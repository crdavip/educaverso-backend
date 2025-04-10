import type Koa from "koa";
import jwt from "jsonwebtoken";

export const createBlog = () => {
  return async (ctx: Koa.Context, next: () => Promise<void>) => {
    await next();

    const isPublishRequest =
      ctx.request.url.startsWith("/content-manager/collection-types/api::blog.blog/actions/publish") &&
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

      const latestBlog = await strapi.entityService.findMany("api::blog.blog", {
        sort: { createdAt: "desc" },
        limit: 1,
      });

      const blog = latestBlog?.[0];
      if (!blog) return;

      await strapi.db.query("api::blog.blog").update({
        where: { id: blog.id },
        data: {
          userDetail: userDetail.id,
        },
      });

      ctx.params = {
        model: "api::blog.blog",
        id: blog.documentId.toString(),
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
