<template>
  <div>
    <UPageHero
      title="SaaS Starter"
      description="一个基于 Nuxt UI 的生产级启动模板，帮助你快速构建现代化的 SaaS 应用。"
      :links="[
        {
          label: '开始使用',
          to: '/app',
          trailingIcon: 'i-ph-arrow-right',
          size: 'xl'
        }
      ]"
    />

    <UPageSection
      id="features"
      title="核心特性"
      :features="[
        {
          icon: 'i-ph-rocket-launch',
          title: '开箱即用',
          description:
            '预配置 TypeScript、ESLint、Tailwind CSS，专注于业务开发。'
        },
        {
          icon: 'i-ph-palette',
          title: '精美设计',
          description:
            '基于 Nuxt UI 设计系统，支持自动暗黑模式，组件美观一致。'
        },
        {
          icon: 'i-ph-lightning',
          title: '高性能',
          description: '支持 SSR/SSG，自动代码分割，边缘部署就绪。'
        }
      ]"
    />
  </div>
</template>

<script setup>
useHead({
  title: '首页'
})
</script>
