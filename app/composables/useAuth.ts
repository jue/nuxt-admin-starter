/**
 * 前端鉴权 composable。
 *
 * 项目当前只支持微信扫码登录：扫码完成后由后端写入 cookie 会话，
 * 这里只暴露读取会话和退出登录两个能力。
 */

interface AuthUser {
  id: string
  name?: string | null
  image?: string | null
  provider?: 'wechat'
  providerSub?: string
  openid?: string | null
  unionid?: string | null
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const isLoading = useState('auth-loading', () => true)
  const hasFetched = useState('auth-fetched', () => false)

  const fetchSession = async (force = false) => {
    if (hasFetched.value && !force) {
      isLoading.value = false
      return
    }

    isLoading.value = true
    try {
      const response = await $fetch<{ user: AuthUser | null }>('/api/auth/me', {
        credentials: 'include'
      })
      user.value = response.user
    } catch {
      user.value = null
    } finally {
      hasFetched.value = true
      isLoading.value = false
    }
  }

  const signOut = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } finally {
      user.value = null
      hasFetched.value = true
    }
  }

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    isAuthenticated: computed(() => !!user.value),
    fetchSession,
    signOut
  }
}
