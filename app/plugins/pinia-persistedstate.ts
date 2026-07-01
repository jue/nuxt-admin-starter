import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  // 只在客户端注册持久化插件
  if (import.meta.client) {
    const pinia = nuxtApp.$pinia as Pinia
    pinia.use(piniaPluginPersistedstate)
  }
})
