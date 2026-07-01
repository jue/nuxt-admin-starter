<template>
  <div class="h-screen flex flex-col md:flex-row">
    <AppSidebar />
    <main
      class="flex-1 h-full md:peer-data-[variant=inset]:h-[calc(100%-1rem)] peer-data-[variant=sidebar]:border-l border-default md:peer-data-[variant=inset]:my-2 md:peer-data-[variant=inset]:mr-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm bg-white dark:bg-neutral-950 flex flex-col"
    >
      <div
        class="h-14 flex items-center justify-between px-4 dark:border-neutral-700 shrink-0 min-h-0"
      >
        <div class="flex items-center gap-2">
          <UTooltip
            v-if="!open"
            text="Toggle sidebar"
            placement="top"
          >
            <UButton
              :icon="open ? 'i-ph-sidebar-simple' : 'i-ph-list'"
              variant="ghost"
              color="neutral"
              @click="open = !open"
            />
          </UTooltip>
          <!-- 面包屑 -->
          <UBreadcrumb
            v-if="breadcrumbs.length > 0"
            :items="breadcrumbs"
            class="hidden sm:flex"
            :ui="{
              separatorIcon: 'size-4'
            }"
          />

          <slot name="left" />
        </div>

        <slot name="right" />
      </div>
      <div class="flex-1 overflow-y-auto border-t border-default">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'

const settings = useSettingsStore()
const open = computed({
  get: () => settings.sidebarOpen,
  set: value => (settings.sidebarOpen = value)
})

// 从路由获取面包屑
const route = useRoute()
const breadcrumbs = computed(() => {
  const items = []

  // 添加首页
  items.push({
    label: '首页',
    to: '/app'
  })

  // 从当前路由的 meta 中获取面包屑
  const routeBreadcrumbs = route.meta.breadcrumbs as
    | Array<{ label: string, to?: string }>
    | undefined

  if (routeBreadcrumbs) {
    for (const crumb of routeBreadcrumbs) {
      items.push({
        label: crumb.label,
        to: crumb.to
      })
    }
  }

  return items
})
</script>
