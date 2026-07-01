<template>
  <div class="w-full">
    <UDropdownMenu
      :items="userItems"
      class="w-full"
      :content="{
        align: 'start',
        side: 'top'
      }"
      :ui="{
        content: 'w-56'
      }"
    >
      <template #default="{ open }">
        <div
          class="flex items-center w-full cursor-pointer select-none gap-3 py-0.5 px-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg"
          :class="open ? 'bg-neutral-200 dark:bg-neutral-700' : ''"
        >
          <UAvatar
            :src="user?.image || ''"
            :alt="user?.name || '用户头像'"
            size="sm"
            class="bg-white"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">
              {{ user?.name || "用户" }}
            </p>
          </div>
          <UIcon
            name="i-ph-caret-up-down"
            class="text-xs text-gray-400 dark:text-neutral-400"
          />
        </div>
      </template>
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const { user, signOut } = useAuth()
const toast = useToast()

const handleSignOut = async () => {
  try {
    await signOut()
    toast.add({
      title: '成功',
      description: '已退出登录',
      color: 'success'
    })
    await navigateTo('/login')
  } catch {
    toast.add({
      title: '错误',
      description: '退出登录失败',
      color: 'error'
    })
  }
}

const userItems = computed(() => [
  [
    {
      label: '个人资料',
      icon: 'i-ph-user',
      to: '/profile'
    },
    {
      label: '账户设置',
      icon: 'i-ph-gear',
      to: '/settings'
    },
    {
      label: '外观',
      icon:
        colorMode.value === 'dark'
          ? 'i-ph-moon'
          : colorMode.value === 'light'
            ? 'i-ph-sun'
            : 'i-ph-desktop',
      children: [
        {
          label: '跟随系统',
          icon: colorMode.preference === 'system' ? 'i-ph-check' : 'i-ph-empty',
          ui: {
            itemLeadingIcon:
              colorMode.preference === 'system' ? '' : 'opacity-0'
          },
          onSelect: () => {
            colorMode.preference = 'system'
          }
        },
        {
          label: '明亮模式',
          icon: colorMode.preference === 'light' ? 'i-ph-check' : 'i-ph-empty',
          ui: {
            itemLeadingIcon:
              colorMode.preference === 'light' ? '' : 'opacity-0'
          },
          onSelect: () => {
            colorMode.preference = 'light'
          }
        },
        {
          label: '黑暗模式',
          icon: colorMode.preference === 'dark' ? 'i-ph-check' : 'i-ph-empty',
          ui: {
            itemLeadingIcon: colorMode.preference === 'dark' ? '' : 'opacity-0'
          },
          onSelect: () => {
            colorMode.preference = 'dark'
          }
        }
      ]
    }
  ],
  [
    {
      label: '退出登录',
      icon: 'i-ph-sign-out',
      color: 'error' as const,
      onSelect: handleSignOut
    }
  ]
])
</script>
