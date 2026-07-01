import { getAppSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const auth = await getAppSession(event)
  if (!auth) {
    return { user: null }
  }
  const u = auth.user
  return {
    user: {
      id: u.id,
      name: u.nickname,
      image: u.avatarUrl,
      provider: 'wechat' as const,
      providerSub: u.wechatSubject,
      openid: u.openid,
      unionid: u.unionid
    }
  }
})
