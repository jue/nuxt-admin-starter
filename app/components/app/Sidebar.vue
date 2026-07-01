<template>
  <USidebar
    v-model:open="open"
    variant="inset"
    collapsible="icon"
    :rail="false"
    :ui="{
      container:
        'border-e-0 border-s-0 lg:group-data-[variant=inset]/sidebar:py-2',
      header: 'min-h-0',
      footer: 'min-h-0 py-2',
    }"
    :close="{ size: 'md', color: 'neutral', variant: 'ghost' }"
    close-icon="i-ph-sidebar-simple"
    mode="slideover"
    :menu="{
      ui: {
        content:
          'ring-0 shadow-none rounded-none inset-y-0 left-0 w-[80%] h-full max-w-none',
        body: 'p-0',
      },
    }"
  >
    <template #title>
      <div class="flex items-center gap-2 min-w-0 h-14 shrink-0">
        <AppLogo :size="32" alt="SaaS Starter" class="rounded-md" />
      </div>
    </template>

    <template #default>
      <UNavigationMenu
        v-model="expandedMenus"
        :items="items"
        orientation="vertical"
        type="multiple"
        :collapsed="!open"
        tooltip
        :ui="{
          list: 'space-y-0.5',
          label: 'text-neutral-400 dark:text-neutral-500 px-1.5',
          link: 'text-neutral-600 dark:text-neutral-300 hover:before:bg-neutral-200 dark:hover:before:bg-neutral-800 data-[active]:text-primary data-[active]:before:bg-primary-100/60 dark:data-[active]:before:bg-primary-900/40 overflow-hidden px-1.5 text-[15px]',
          linkTrailingIcon: 'size-4',
          separator: 'opacity-0',
        }"
      />
    </template>

    <template #footer>
      <User />
    </template>
  </USidebar>
</template>

<script setup lang="ts">
const settings = useSettingsStore()
const open = computed({
  get: () => settings.sidebarOpen,
  set: (value) => (settings.sidebarOpen = value),
})

const expandedMenus = computed({
  get: () => settings.expandedMenus,
  set: (value) => settings.setExpandedMenus(value),
})

const items = ref([
  [
    {
      label: '仪表盘',
      icon: 'i-ph-squares-four',
      to: '/app',
    },
    {
      label: '网盘',
      icon: 'i-ph-hard-drive-fill',
      children: [
        { label: '我的文件', icon: 'i-ph-folder', to: '/app/pan/files' },
        { label: '分享文件', icon: 'i-ph-share', to: '/app/pan/share' },
        { label: '回收站', icon: 'i-ph-trash', to: '/app/pan/trash' },
      ],
    },
  ],
  [
    { label: '功能区', type: 'label' },
    {
      label: '用户管理',
      icon: 'i-ph-users',
      to: '/users',
    },
    {
      label: '产品管理',
      icon: 'i-ph-package',
      to: '/products',
    },
    {
      label: '订单管理',
      icon: 'i-ph-shopping-cart',
      to: '/orders',
    },
  ],
  [
    { label: '设置区', type: 'label' },
    {
      label: '设置',
      icon: 'i-ph-gear',
    },
  ],
])
</script>
