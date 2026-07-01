<script setup lang="ts">
/**
 * 微信扫码登录面板：
 * 1. 拉取后端签名 state
 * 2. 加载 starter.jue.sh SDK
 * 3. 用 WechatLogin.render 在容器内渲染二维码 iframe
 * 4. 跨源（localhost）时监听 postMessage 完成跳转
 */

interface WechatLoginConfig {
  providerBaseUrl: string
  clientId: string
  redirectUri: string
}

interface WechatLoginInstance {
  iframe?: HTMLIFrameElement
  ready?: Promise<unknown>
  destroy?: () => void
}

declare global {
  interface Window {
    WechatLogin?: {
      render: (options: {
        container: HTMLElement
        providerBaseUrl: string
        clientId: string
        redirectUri: string
        state: string
        display: 'iframe'
        fastLogin: boolean
        width: string
        height: string
      }) => WechatLoginInstance
    }
  }
}

const config = useRuntimeConfig().public.wechatLogin as WechatLoginConfig

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const errorMessage = ref('')
const isLoading = ref(true)
let instance: WechatLoginInstance | null = null

const cleanup = () => {
  if (instance?.destroy) {
    instance.destroy()
    instance = null
  }
}

const handleRedirectMessage = (event: MessageEvent) => {
  const iframe = instance?.iframe
  if (!iframe || event.source !== iframe.contentWindow) return
  const data = event.data as { type?: string, url?: unknown } | null
  if (data?.type !== 'wechat-login-redirect') return
  const url = typeof data.url === 'string' && /^https?:\/\//.test(data.url) ? data.url : ''
  if (url) window.location.replace(url)
}

const loadSdk = (src: string) => new Promise<void>((resolve, reject) => {
  const existing = document.querySelector(`script[src="${src}"]`)
  if (existing) {
    resolve()
    return
  }
  const script = document.createElement('script')
  script.src = src
  script.async = true
  script.onload = () => resolve()
  script.onerror = () => reject(new Error('微信登录 SDK 加载失败'))
  document.head.appendChild(script)
})

const renderWechatLogin = async () => {
  cleanup()

  if (!config.clientId || !config.providerBaseUrl || !config.redirectUri) {
    errorMessage.value = '微信登录尚未配置 (clientId / providerBaseUrl / redirectUri)'
    isLoading.value = false
    return
  }

  try {
    const { state } = await $fetch<{ state: string }>('/api/auth/wechat/state', {
      credentials: 'include'
    })

    const sdkUrl = `${config.providerBaseUrl.replace(/\/$/, '')}/wechat/sdk.js`
    await loadSdk(sdkUrl)

    const W = window.WechatLogin
    if (!W) {
      throw new Error('微信登录 SDK 未正确加载')
    }

    const target = containerRef.value
    if (!target) {
      throw new Error('二维码容器未挂载 (containerRef)')
    }

    instance = W.render({
      container: target,
      providerBaseUrl: config.providerBaseUrl,
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      state,
      display: 'iframe',
      fastLogin: true,
      width: '188px',
      height: '198px'
    })

    instance?.iframe?.addEventListener('load', () => {
      isLoading.value = false
    }, { once: true })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '微信登录初始化失败'
    isLoading.value = false
  }
}

onMounted(() => {
  window.addEventListener('message', handleRedirectMessage)
  renderWechatLogin()
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleRedirectMessage)
  cleanup()
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      class="relative flex h-[198px] w-full max-w-[188px] items-center justify-center"
    >
      <div
        ref="containerRef"
        class="absolute inset-0 flex items-center justify-center"
      />
      <div
        v-if="isLoading && !errorMessage"
        class="relative z-10 flex flex-col items-center gap-3 text-neutral-400"
      >
        <UIcon
          name="i-ph-circle-notch"
          class="h-6 w-6 animate-spin"
        />
        <span class="text-[13px]">正在加载微信二维码...</span>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="mt-3 flex max-w-[300px] items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-left text-[12px] leading-5 text-red-600"
    >
      <UIcon
        name="i-ph-warning-circle"
        class="mt-0.5 h-4 w-4 shrink-0"
      />
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>
