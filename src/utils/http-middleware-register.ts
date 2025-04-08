import type Koa from "koa";

export const registerInterceptorMiddleware = () => {
  return async (ctx: Koa.Context, next: () => Promise<void>) => {
    await next();

    const isRegisterRequest =
      ctx.request.url === "/api/auth/local/register" && ctx.request.method === "POST" && ctx.response.status === 200;

    if (!isRegisterRequest) return;

    const user = (ctx.response.body as { user?: any })?.user;
    const rawPassword = ctx.request.body.password;

    if (!user || !rawPassword) {
      strapi.log.warn("Registro interceptado pero faltan datos: usuario o contraseña");
      return;
    }

    try {
      const existingAdmin = await strapi.db.query("admin::user").findOne({
        where: { email: user.email },
      });

      if (existingAdmin) return;

      const authorRole = await strapi.db.query("admin::role").findOne({
        where: { code: "strapi-author" },
      });

      if (!authorRole) {
        strapi.log.error("Rol 'strapi-author' no encontrado");
        return;
      }

      await strapi.admin.services.user.create({
        email: user.email,
        firstname: user.username,
        password: rawPassword,
        username: user.username,
        isActive: true,
        roles: [authorRole.id],
      });
    } catch (err) {
      strapi.log.error("Error al crear usuario admin desde middleware de registro", err);
    }
  };
};
