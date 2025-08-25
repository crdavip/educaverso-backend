"use strict";

const { categories, professions } = require("./data.json");

async function run() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = "error";

  const CATEGORY_UID = "api::category.category";
  const PROFESSION_UID = "api::profession.profession";

  try {
    // 🔹 1) Limpiar categorías y profesiones
    const existingCategories = await strapi.documents(CATEGORY_UID).findMany({ limit: 10000 });
    for (const doc of existingCategories) {
      await strapi.documents(CATEGORY_UID).delete({ documentId: doc.documentId });
    }

    const existingProfessions = await strapi.documents(PROFESSION_UID).findMany({ limit: 10000 });
    for (const doc of existingProfessions) {
      await strapi.documents(PROFESSION_UID).delete({ documentId: doc.documentId });
    }

    // 🔹 2) Crear y publicar categorías
    const categoryMap = {}; // slug → documentId
    for (const category of categories) {
      const draft = await strapi.documents(CATEGORY_UID).create({ data: category });
      const published = await strapi.documents(CATEGORY_UID).publish({ documentId: draft.documentId });
      categoryMap[category.slug] = published.documentId; // guardamos relación
    }

    // 🔹 3) Crear y publicar profesiones asociadas
    for (const group of professions) {
      const categoryId = categoryMap[group.category];
      if (!categoryId) {
        console.warn(`⚠️ No se encontró categoría con slug ${group.category}`);
        continue;
      }

      for (const professionName of group.professions) {
        const draft = await strapi.documents(PROFESSION_UID).create({
          data: {
            name: professionName,
            category: categoryId, // 👈 relación por documentId
          },
        });

        await strapi.documents(PROFESSION_UID).publish({ documentId: draft.documentId });
      }
    }

    console.log("✅ Seed de categorías + profesiones completado.");
  } catch (err) {
    console.error("❌ Error en seed:", err);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

run();
