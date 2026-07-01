/**
 * 前端路由认证中间件
 * 只处理前端页面路由的跳转控制，不处理 API 请求
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetchSession } = useAuth()

  // 公开页面路由（无需登录即可访问）
  const publicRoutes = ['/', '/login']
  const isPublicRoute = publicRoutes.includes(to.path)
    || to.path.startsWith('/auth/wechat/')

  // 首次进入时，从服务器读取 cookie 会话
  await fetchSession()

  // 未登录用户访问需要认证的页面，重定向到登录页
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // 已登录用户访问登录页，重定向到首页或之前要访问的页面
  if (isAuthenticated.value && to.path === '/login') {
    const redirect = to.query.redirect as string
    return navigateTo(redirect || '/app')
  }
})
