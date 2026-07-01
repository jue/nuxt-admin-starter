<script setup lang="ts">
const route = useRoute()
const toast = useToast()

const getQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

const getRouteAuthErrorMessage = () => {
  const description
    = getQueryValue(route.query.error_description)
      ?? getQueryValue(route.query.message)

  if (typeof description === 'string' && description) {
    return description
  }

  const error = getQueryValue(route.query.error)
  if (error === 'wechat_state_invalid') {
    return '登录状态已失效，请重新扫码'
  }

  if (error === 'wechat_login_failed') {
    return '微信登录失败，请稍后重试'
  }

  return typeof error === 'string' && error ? '微信登录失败，请稍后再试' : ''
}

const showAuthErrorToast = (description: string) => {
  toast.add({
    title: '登录失败',
    description,
    color: 'error',
    icon: 'i-ph-warning-circle'
  })
}

onMounted(() => {
  const message = getRouteAuthErrorMessage()
  if (message) {
    showAuthErrorToast(message)
  }
})

definePageMeta({
  layout: false
})

useHead({
  title: '登录 | NIPAO'
})
</script>

<template>
  <main
    class="relative flex min-h-screen w-full overflow-hidden bg-white text-neutral-900"
  >
    <!-- 左侧登录区 -->
    <section
      class="relative flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12"
    >
      <!-- 顶部 Logo -->
      <div class="absolute left-6 top-6 flex items-center gap-3">
        <AppLogo
          :size="36"
          alt="NIPAO"
          rounded="lg"
        />
      </div>

      <div class="w-full max-w-[360px]">
        <div class="text-center">
          <h1
            class="text-[26px] font-semibold tracking-tight text-neutral-900 sm:text-[30px]"
          >
            欢迎回来
          </h1>
          <p class="mt-2 text-[14px] text-neutral-500">
            使用微信扫码，即刻登录或注册账号
          </p>
        </div>

        <div
          class="mt-8 rounded-2xl border border-neutral-100 bg-white p-8 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.06)]"
        >
          <WechatLoginPanel />
        </div>

        <p
          class="mt-6 text-[13px] text-neutral-400 flex items-center justify-center gap-2"
        >
          <UIcon
            name="i-ph-scan"
            class="h-4 w-4"
          />
          请使用微信扫描二维码完成登录
        </p>
      </div>

      <p class="absolute bottom-6 left-6 text-[13px] text-neutral-400">
        © {{ new Date().getFullYear() }} NIPAO. All rights reserved.
      </p>
    </section>

    <!-- 右侧品牌区 -->
    <section class="hidden w-[50%] flex-col p-2 lg:flex">
      <div
        class="relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl bg-neutral-950 p-10 text-white"
      >
        <!-- 背景光晕 -->
        <div
          class="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div
            class="absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
          />
          <div
            class="absolute -right-20 bottom-1/4 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[100px]"
          />
          <div
            class="absolute inset-0 opacity-[0.03]"
            style="
              background-image: radial-gradient(#fff 1px, transparent 1px);
              background-size: 24px 24px;
            "
          />
        </div>

        <!-- 中部文案 -->
        <div class="relative z-10 max-w-md">
          <h2
            class="text-4xl font-semibold leading-[1.15] tracking-tight text-white xl:text-5xl"
          >
            简洁、高效的开箱即用<br>
            <span class="text-primary">管理后台模板</span>
          </h2>
          <p class="mt-5 text-[15px] leading-relaxed text-neutral-400">
            基于 Nuxt 4 与 Nuxt UI
            构建，专注于开发体验与视觉一致性，让后台系统从第一行代码就保持优雅。
          </p>

          <!-- 特性标签 -->
          <div class="mt-8 flex flex-wrap gap-3">
            <div
              class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] text-neutral-300"
            >
              <UIcon
                name="i-ph-rocket-launch"
                class="text-primary"
              />
              快速启动
            </div>
            <div
              class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] text-neutral-300"
            >
              <UIcon
                name="i-ph-shield-check"
                class="text-primary"
              />
              安全可靠
            </div>
            <div
              class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] text-neutral-300"
            >
              <UIcon
                name="i-ph-paint-brush"
                class="text-primary"
              />
              设计一致
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
