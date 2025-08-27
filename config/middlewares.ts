export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  // {
  //   name: "strapi::security",
  //   config: {
  //     contentSecurityPolicy: {
  //       useDefaults: true,
  //       directives: {
  //         "connect-src": ["'self'", "https:"],
  //         "img-src": ["'self'", "data:", "blob:", "market-assets.strapi.io", "beunik-blog-pull-zone.b-cdn.net"],
  //         "media-src": ["'self'", "data:", "blob:", "market-assets.strapi.io", "beunik-blog-pull-zone.b-cdn.net"],
  //         upgradeInsecureRequests: null,
  //       },
  //     },
  //   },
  // },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
