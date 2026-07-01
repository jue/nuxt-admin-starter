import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  persist: true,
  state: () => ({
    // Sidebar 展开状态
    sidebarOpen: true,

    // 导航菜单展开状态（存储展开的菜单项 label 数组）
    expandedMenus: [] as string[]
  }),

  actions: {
    // Sidebar 操作
    openSidebar() {
      this.sidebarOpen = true
    },
    closeSidebar() {
      this.sidebarOpen = false
    },

    // 导航菜单操作
    setExpandedMenus(labels: string[]) {
      this.expandedMenus = labels
    },
    toggleExpandedMenu(label: string) {
      const index = this.expandedMenus.indexOf(label)
      if (index > -1) {
        this.expandedMenus.splice(index, 1)
      } else {
        this.expandedMenus.push(label)
      }
    }
  }
})
