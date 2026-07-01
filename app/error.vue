<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.status === 404)

const title = computed(() =>
  is404.value ? '页面未找到' : '出错了'
)

const description = computed(() =>
  is404.value
    ? '抱歉，您访问的页面不存在或已被移除。'
    : props.error.statusText || '抱歉，发生了一些错误。'
)

useHead({
  title
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
    <div class="text-center max-w-md">
      <div class="mb-8">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-6">
          <UIcon
            :name="is404 ? 'i-ph-magnifying-glass' : 'i-ph-warning-circle'"
            class="w-12 h-12 text-neutral-400 dark:text-neutral-500"
          />
        </div>
        <h1 class="text-6xl font-bold text-neutral-900 dark:text-white mb-2">
          {{ error.status }}
        </h1>
        <p class="text-xl text-neutral-600 dark:text-neutral-400">
          {{ title }}
        </p>
      </div>

      <p class="text-neutral-500 dark:text-neutral-500 mb-8">
        {{ description }}
      </p>

      <div class="flex items-center justify-center gap-4">
        <UButton
          color="primary"
          size="lg"
          icon="i-ph-house"
          @click="handleError"
        >
          返回首页
        </UButton>
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-ph-arrow-left"
          @click="$router.back()"
        >
          返回上一页
        </UButton>
      </div>
    </div>
  </div>
</template>
