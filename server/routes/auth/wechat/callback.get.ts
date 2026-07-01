import {
  exchangeWechatLoginCodeForUser,
  verifyWechatLoginState
} from '../../../utils/wechat-oauth'
import { upsertLocalWechatUser } from '../../../utils/wechat-user'
import { createAppSession } from '../../../utils/session'

/**
 * starter.jue.sh 微信扫码登录回调。
 *
 * provider 会把第三方顶层窗口导航到本地址，因此回调在顶层上下文执行，
 * 可以直接 setCookie 建立会话。
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = typeof query.code === 'string' ? query.code : ''
  const state = typeof query.state === 'string' ? query.state : ''

  if (!code || !state || !verifyWechatLoginState(state)) {
    return sendRedirect(event, '/login?error=wechat_state_invalid', 302)
  }

  try {
    const profile = await exchangeWechatLoginCodeForUser(code)
    const user = await upsertLocalWechatUser(profile)
    await createAppSession(event, user.id)
    return sendRedirect(event, '/app', 302)
  } catch (error) {
    console.error('[auth/wechat/callback] 微信登录失败', error)
    return sendRedirect(event, '/login?error=wechat_login_failed', 302)
  }
})
