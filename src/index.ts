import type { Core } from '@strapi/strapi';
import { registerAdmin } from './utils/registerAdmin';
import { userDetailAdminSync } from './utils/userDetailAdminSync';
import { createCertificate } from './utils/createCertificate';
import { createPortfolio } from './utils/createPortfolio';
import { createBlog } from './utils/createBlog';
import sharp from 'sharp';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.server.use(registerAdmin());
    strapi.server.use(userDetailAdminSync());
    strapi.server.use(createCertificate());
    strapi.server.use(createPortfolio());
    strapi.server.use(createBlog());
    sharp.cache(false);
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
