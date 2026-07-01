import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

const STATE_TTL_SECONDS = 10 * 60

type WechatLoginConfig = {
  wechatLogin?: {
    providerBaseUrl?: string
    clientId?: string
    clientSecret?: string
    redirectUri?: string
    stateSecret?: string
  }
}

export type WechatLoginUser = {
  sub: string
  openid: string
  unionid?: string | null
  nickname?: string | null
  headimgurl?: string | null
  [key: string]: unknown
}

const getConfig = () => useRuntimeConfig() as unknown as WechatLoginConfig

const getSigningSecret = () => {
  const secret = getConfig().wechatLogin?.stateSecret || ''
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: '微信登录 state 签名密钥未配置' })
  }
  return secret
}

const sign = (value: string) =>
  createHmac('sha256', getSigningSecret()).update(value).digest('base64url')

const safeEqual = (left: string, right: string) => {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export const createWechatLoginState = () => {
  const payload = Buffer.from(JSON.stringify({
    kind: 'wechat_state',
    nonce: randomBytes(16).toString('hex'),
    exp: Math.floor(Date.now() / 1000) + STATE_TTL_SECONDS
  })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export const verifyWechatLoginState = (state: string | null | undefined) => {
  if (!state) return false

  const [encoded, signature, extra] = String(state).split('.')
  if (!encoded || !signature || extra) return false
  if (!safeEqual(signature, sign(encoded))) return false

  try {
    const data = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as {
      kind?: string
      exp?: number
    }
    if (data.kind !== 'wechat_state') return false
    return Number(data.exp) > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

export const exchangeWechatLoginCodeForUser = async (code: string): Promise<WechatLoginUser> => {
  const cfg = getConfig().wechatLogin || {}
  const providerBaseUrl = (cfg.providerBaseUrl || '').replace(/\/$/, '')
  const clientId = cfg.clientId || ''
  const clientSecret = cfg.clientSecret || ''

  if (!providerBaseUrl || !clientId || !clientSecret) {
    throw createError({ statusCode: 500, statusMessage: '微信登录配置不完整' })
  }

  const result = await $fetch<{ token_type: string, user: WechatLoginUser }>(
    `${providerBaseUrl}/api/wechat/oauth/token`,
    {
      method: 'POST',
      body: { client_id: clientId, client_secret: clientSecret, code }
    }
  )

  if (!result?.user?.sub || !result?.user?.openid) {
    throw createError({ statusCode: 502, statusMessage: '微信登录用户信息换取失败' })
  }

  return result.user
}
