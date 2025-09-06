// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    routeRules: {
        '/': { prerender: true },
        '/api/**': { cors: true }
    },
    typescript: {
        typeCheck: true,
        strict: true
    },
    modules: [
        '@nuxt/eslint',
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        'vuetify-nuxt-module',
        '@vite-pwa/nuxt'
    ],
    imports: {
        dirs: ['composables/**']
    }
});
