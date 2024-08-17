// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  devtools: { enabled: true },

  // https://www.joshwcomeau.com/css/custom-css-reset/
  css: [
    '@/assets/styles/reset.css',
    '@/assets/styles/index.css',
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:4000',
    },
  },
  
})