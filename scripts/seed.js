"use strict";

const fs = require("fs-extra");
const path = require("path");
const mime = require("mime-types");
const bcrypt = require("bcryptjs");
const { categories, professions, users, socials } = require("./data.json");

async function run() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = "error";

  const CATEGORY_UID = "api::category.category";
  const PROFESSION_UID = "api::profession.profession";
  const USER_DETAIL_UID = "api::user-detail.user-detail";
  const SOCIAL_UID = "api::social.social";

  const clearDocuments = async (uid) => {
    const existingDocs = await strapi.documents(uid).findMany({ limit: 10000 });
    for (const doc of existingDocs) {
      await strapi.documents(uid).delete({ documentId: doc.documentId });
    }
  };

  const createAndPublish = async (uid, data) => {
    const draft = await strapi.documents(uid).create({ data });
    return await strapi.documents(uid).publish({ documentId: draft.documentId });
  };

  const clearUsers = async () => {
    const upUsers = await strapi.query("plugin::users-permissions.user").findMany();
    for (const u of upUsers) {
      await strapi.query("plugin::users-permissions.user").delete({ where: { id: u.id } });
    }

    const adminUsers = await strapi.db.query("admin::user").findMany();
    for (const admin of adminUsers) {
      if (admin.id !== 1) {
        await strapi.db.query("admin::user").delete({ where: { id: admin.id } });
      }
    }
  };

  const getFileData = (fileName) => {
    const filePath = path.join("data", "uploads", fileName);
    const size = fs.statSync(filePath).size;
    const ext = fileName.split(".").pop();
    const mimeType = mime.lookup(ext || "") || "";

    return {
      filepath: filePath,
      originalFileName: fileName,
      size,
      mimetype: mimeType,
    };
  };

  const uploadFile = async (fileName) => {
    const fileData = getFileData(fileName);

    const [uploadedFile] = await strapi
      .plugin("upload")
      .service("upload")
      .upload({
        files: fileData,
        data: {
          fileInfo: {
            alternativeText: `Imagen ${fileName}`,
            caption: fileName,
            name: fileName,
          },
        },
      });

    return uploadedFile;
  };

  const createUserWithAdmin = async ({ username, email, password, firstname, lastname }) => {
    const authenticatedRole = await strapi.db.query("plugin::users-permissions.role").findOne({
      where: { type: "authenticated" },
    });
    if (!authenticatedRole) throw new Error("⚠️ Rol 'authenticated' no encontrado en Users-Permissions");

    const upUser = await strapi.plugin("users-permissions").service("user").add({
      username,
      email,
      password,
      confirmed: true,
      blocked: false,
      role: authenticatedRole.id,
      provider: "local",
    });

    const adminRole = await strapi.db.query("admin::role").findOne({
      where: { code: "strapi-author" },
    });
    if (!adminRole) throw new Error("⚠️ Rol 'author' no encontrado en admin_users");

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await strapi.db.query("admin::user").create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        isActive: true,
        roles: [adminRole.id],
      },
    });

    return { upUser, adminUser };
  };

  const createUserDetails = async ({
    firstname,
    lastname,
    description,
    gender,
    category,
    profession,
    idUser,
    photoFile,
    profileViews,
  }) => {
    const existingCategory = await strapi.documents(CATEGORY_UID).findFirst({
      filters: { slug: category },
    });
    if (!existingCategory) throw new Error(`⚠️ Categoría no encontrada: ${category}`);

    let profileImage = null;
    if (photoFile) {
      profileImage = await uploadFile(photoFile);
    }

    const userDetail = await createAndPublish(USER_DETAIL_UID, {
      firstname,
      lastname,
      description,
      gender,
      category: existingCategory.documentId,
      profession,
      user: idUser,
      profileImage,
      profileViews,
    });

    return { userDetail };
  };

  try {
    await clearDocuments(CATEGORY_UID);
    await clearDocuments(PROFESSION_UID);
    await clearDocuments(USER_DETAIL_UID);
    await clearUsers();
    await clearDocuments(SOCIAL_UID);

    const categoryMap = {};
    for (const category of categories) {
      const publishedCategory = await createAndPublish(CATEGORY_UID, category);
      categoryMap[category.slug] = publishedCategory.documentId;
    }

    for (const group of professions) {
      const categoryId = categoryMap[group.category];
      if (!categoryId) {
        console.warn(`⚠️ No se encontró categoría con slug ${group.category}`);
        continue;
      }

      for (const professionName of group.professions) {
        await createAndPublish(PROFESSION_UID, {
          name: professionName,
          category: categoryId,
        });
      }
    }

    for (const user of users) {
      const newUser = await createUserWithAdmin(user);

      const newUserDetail = await createUserDetails({
        ...user,
        idUser: newUser.upUser.id,
      });

      for (const social of socials) {
        if (social.user === newUser.upUser.username) {
          await createAndPublish(SOCIAL_UID, {
            ...social,
            userDetail: newUserDetail.userDetail.documentId,
          });
        }
      }
    }

    console.log("✅ Seed Educaverso completado.");
  } catch (err) {
    console.error("❌ Error en seed:", err);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

run();
