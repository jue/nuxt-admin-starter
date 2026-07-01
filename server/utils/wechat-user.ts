import { randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { wechatUser } from '../db/schema'
import type { WechatLoginUser } from './wechat-oauth'

/**
 * 把 starter.jue.sh 返回的用户信息归并 upsert 到本地。
 *
 * 归并优先级：unionid > openid > sub。wechatSubject 使用 provider 下发的 sub，
 * 在本应用内保持稳定。
 */
export const upsertLocalWechatUser = async (profile: WechatLoginUser) => {
  if (!profile.sub || !profile.openid) {
    throw createError({ statusCode: 400, statusMessage: '微信用户 sub/openid 缺失' })
  }

  const now = new Date()
  const sub = profile.sub
  const openid = profile.openid
  const unionid = profile.unionid || null

  const matchCondition = unionid
    ? eq(wechatUser.unionid, unionid)
    : openid
      ? eq(wechatUser.openid, openid)
      : eq(wechatUser.wechatSubject, sub)

  const profileFields = {
    wechatSubject: sub,
    openid,
    unionid,
    nickname: profile.nickname ?? null,
    avatarUrl: profile.headimgurl ?? null,
    rawProfile: profile as Record<string, unknown>,
    lastLoginAt: now,
    updatedAt: now
  }

  const [existing] = await db.select().from(wechatUser).where(matchCondition).limit(1)

  if (existing) {
    const [updated] = await db.update(wechatUser)
      .set(profileFields)
      .where(eq(wechatUser.id, existing.id))
      .returning()

    if (updated) {
      return updated
    }
  }

  // 不存在（或并发竞态下被别人抢先写入）则新建；若撞唯一约束，回退再查一次。
  try {
    const [created] = await db.insert(wechatUser)
      .values({
        id: `adm_${randomBytes(16).toString('hex')}`,
        createdAt: now,
        ...profileFields
      })
      .returning()

    if (created) {
      return created
    }
  } catch {
    const [fallback] = await db.select().from(wechatUser).where(matchCondition).limit(1)
    if (fallback) {
      return fallback
    }
  }

  throw createError({ statusCode: 500, statusMessage: '微信用户保存失败' })
}
