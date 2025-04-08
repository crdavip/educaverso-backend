// import type { Core } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';
import { registerInterceptorMiddleware } from './utils/http-middleware-register';
import { userDetailAdminSync } from './utils/userDetailAdminSync';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.server.use(registerInterceptorMiddleware());
    strapi.server.use(userDetailAdminSync());
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
