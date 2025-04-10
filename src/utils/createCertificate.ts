import type Koa from "koa";
import jwt from "jsonwebtoken";

export const createCertificate = () => {
  return async (ctx: Koa.Context, next: () => Promise<void>) => {
    await next();

    const isPublishRequest =
      ctx.request.url.startsWith("/content-manager/collection-types/api::certificate.certificate/actions/publish") &&
      ctx.request.method === "POST" &&
      ctx.response.status === 200;

    if (!isPublishRequest) return;

    const token = ctx.cookies.get("jwtToken");
    if (!token) return;

    try {
      const decodedToken: any = jwt.verify(token, process.env.ADMIN_JWT_SECRET || "default_jwt_secret");
      const adminUserId = decodedToken?.id;
      if (!adminUserId) return;

      const adminUser = await strapi.db.query("admin::user").findOne({
        where: { id: adminUserId },
        populate: { roles: true },
      });

      const isAuthor = (adminUser as any).roles?.some((role: any) => role.code === "strapi-author");
      if (!isAuthor) return;

      const upUsers = await strapi.entityService.findMany("plugin::users-permissions.user", {
        filters: { email: adminUser.email },
        populate: ["userDetail"],
      });

      const upUser = upUsers?.[0];
      const userDetail = (upUser as any)?.userDetail;
      if (!userDetail) return;

      const latestCertificate = await strapi.entityService.findMany("api::certificate.certificate", {
        sort: { createdAt: "desc" },
        limit: 1,
      });

      const certificate = latestCertificate?.[0];
      if (!certificate) return;

      await strapi.db.query("api::certificate.certificate").update({
        where: { id: certificate.id },
        data: {
          userDetail: userDetail.id,
        },
      });

      ctx.params = {
        model: "api::certificate.certificate",
        id: certificate.documentId.toString(),
      };

      await strapi
        .plugin("content-manager")
        .controller("collection-types")
        .publish(ctx, async () => {});
    } catch (err) {
      strapi.log.error("Middleware error:", err);
    }
  };
};
