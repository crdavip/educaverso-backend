module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "strapi-provider-upload-bunnynet",
      providerOptions: {
        api_key: '4c180441-7d47-42d5-a29e44bb8fb6-b45f-4977',
        storage_zone: 'beunik-blog-images',
        pull_zone: 'https://beunik-blog-pull-zone.b-cdn.net',
      },
    },
  },
})
