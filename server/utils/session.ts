/**
 * 服务端会话管理。
 *
 * - 会话 token 是 64 字节随机串，cookie 里只放原文，DB 中存 sha256(token)，
 *   便于审计、踢人、过期清理。
 */
import { createHash, randomBytes } from 'node:crypto'
import { and, eq, gt } from 'drizzle-orm'
import type { H3Event } from 'h3'
import { db } from './db'
import { wechatSession, wechatUser } from '../db/schema'

const SESSION_COOKIE = 'app_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

export type AppSessionAuth = {
  session: typeof wechatSession.$inferSelect
  user: typeof wechatUser.$inferSelect
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export const createAppSession = async (event: H3Event, userId: string) => {
  const token = `app_${randomBytes(32).toString('hex')}`
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000)

  await db.insert(wechatSession).values({
    id: `ses_${randomBytes(16).toString('hex')}`,
    tokenHash: hashToken(token),
    userId,
    expiresAt,
    createdAt: now
  })

  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  })
}

export const getAppSession = async (event: H3Event): Promise<AppSessionAuth | null> => {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null

  const [session] = await db.select()
    .from(wechatSession)
    .where(and(
      eq(wechatSession.tokenHash, hashToken(token)),
      gt(wechatSession.expiresAt, new Date())
    ))
    .limit(1)

  if (!session) {
    deleteCookie(event, SESSION_COOKIE, { path: '/' })
    return null
  }

  const [user] = await db.select()
    .from(wechatUser)
    .where(eq(wechatUser.id, session.userId))
    .limit(1)

  if (!user) return null

  return { session, user }
}

export const clearAppSession = async (event: H3Event) => {
  const token = getCookie(event, SESSION_COOKIE)
  if (token) {
    await db.delete(wechatSession).where(eq(wechatSession.tokenHash, hashToken(token)))
  }
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export const requireAppSession = async (event: H3Event) => {
  const auth = await getAppSession(event)
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  event.context.auth = auth
  return auth
}
