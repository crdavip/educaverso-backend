import type Koa from "koa";

export const userDetailAdminSync = () => {
  return async (ctx: Koa.Context, next: () => Promise<void>) => {
    await next();

    const isUserDetailCreateRequest =
      ctx.path === "/api/user-details" &&
      ctx.method === "POST" &&
      ctx.status === 201;

    if (!isUserDetailCreateRequest) return;

    try {
      const userDetail = (ctx.body as any)?.data;
      const userId = ctx.request.body?.data?.user;

      if (!userId || !userDetail?.id) return;

      const user = await strapi.db.query("plugin::users-permissions.user").findOne({
        where: { id: userId },
        select: ["email"],
      });

      if (!user) return;

      const adminUser = await strapi.db.query("admin::user").findOne({
        where: { email: user.email },
      });

      if (!adminUser) return;

      await strapi.db.query("admin::user").update({
        where: { id: adminUser.id },
        data: {
          firstname: userDetail.firstname,
          lastname: userDetail.lastname,
        },
      });
    } catch (err) {
      strapi.log.error("🔥 Error en userDetailAdminSync:", err);
    }
  };
};
