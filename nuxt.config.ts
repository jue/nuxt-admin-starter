// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 全局禁用 SSR，默认所有页面为 SPA 模式

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/image'
  ],
  ssr: false,

  components: [
    {
      path: '~/components',
      pathPrefix: true
    }
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // starter.jue.sh 微信扫码登录平台配置（服务端用）
    wechatLogin: {
      providerBaseUrl: process.env.WECHAT_LOGIN_PROVIDER_BASE_URL || 'https://starter.jue.sh',
      clientId: process.env.WECHAT_LOGIN_CLIENT_ID || '',
      clientSecret: process.env.WECHAT_LOGIN_CLIENT_SECRET || '',
      redirectUri: process.env.WECHAT_LOGIN_REDIRECT_URI || '',
      stateSecret: process.env.WECHAT_LOGIN_STATE_SECRET || ''
    },
    public: {
      wechatLogin: {
        providerBaseUrl: process.env.WECHAT_LOGIN_PROVIDER_BASE_URL || 'https://starter.jue.sh',
        clientId: process.env.WECHAT_LOGIN_CLIENT_ID || '',
        redirectUri: process.env.WECHAT_LOGIN_REDIRECT_URI || ''
      }
    }
  },

  routeRules: {
    // 首页预渲染（静态生成）
    '/': { prerender: true }

    // 示例：为特定页面启用 SSR
    // '/blog/**': { ssr: true },
    // '/products/**': { ssr: true },
  },

  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
