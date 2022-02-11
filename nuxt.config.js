export default {
  head: {
    title: 'atm',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '@assets/global.sass',
    '@assets/fonts.sass',
    '@assets/variables.sass'
  ],
  styleResources: {
    sass: [
      '@assets/variables.sass'
    ]
  },

  plugins: [
    { src: '@/plugins/socket', ssr: false }
  ],

  components: true,

  buildModules: [
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/style-resources'
  ],

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/user/login', method: 'post', propertyName: 'token' },
          logout: { url: '/api/user/logout', method: 'post'},
          user: { url: '/api/user/user', method: 'get', propertyName: 'nickname' }
        }
      }
    }
  },

  axios: {
    proxy: true
  },

  proxy: {
    '/api': 'http://localhost:3000/api/'
  },

  serverMiddleware: [
    { path: "/api", handler: require("body-parser").json() },
    { path: '/api', handler: '~/api' }
  ],

  build: {
  }
}
