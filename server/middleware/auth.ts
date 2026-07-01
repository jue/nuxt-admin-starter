import { requireAppSession } from '../utils/session'

/**
 * 服务端 API 认证中间件：
 *
 * - 非 /api/ 路由不处理。
 * - /api/auth/* 完全放行（含 me / state / logout）。
 * - 其它 /api/* 要求存在有效 session，并把 (session, user) 挂到 event.context.auth。
 */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/')) {
    return
  }

  if (path.startsWith('/api/auth/')) {
    return
  }

  await requireAppSession(event)
})
