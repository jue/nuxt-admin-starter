<template>
  <NuxtLayout name="app">
    <div class="p-4">
      <!-- 仪表盘内容区域 -->
      <div class="max-w-6xl mx-auto space-y-6" />
    </div>
  </NuxtLayout>
</template>

<script setup>
// 仪表盘页面面包屑：首页 > 仪表盘
definePageMeta({
  breadcrumbs: [{ label: '仪表盘' }]
})
</script>
