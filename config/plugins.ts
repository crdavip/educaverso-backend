export default () => ({
  upload: {
    config: {
      provider: "@nexide/strapi-provider-bunny",
      providerOptions: {
        api_key: "013214a7-b822-4232-ae00bcb00570-ef4e-47cb",
        storage_zone: "beunik-blog-images",
        pull_zone: "beunik-blog-pull-zone",
        hostname: "beunik-blog-pull-zone.b-cdn.net",
      },
    },
  },
});
