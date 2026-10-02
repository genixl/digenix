// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' }
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
      enterActiveClass: 'transition duration-300 ease-out motion-reduce:transition-none',
      enterFromClass: 'opacity-0 translate-y-3',
      leaveActiveClass: 'transition duration-200 ease-in motion-reduce:transition-none',
      leaveToClass: 'opacity-0 -translate-y-3'
    }
  },

  css: ['~/assets/css/main.css'],

  ui: {
    colorMode: false
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    clientBundle: {
      scan: {
        globInclude: ['app/**/*.{vue,ts}']
      }
    }
  }
})
