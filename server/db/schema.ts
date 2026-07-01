import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

/**
 * 微信扫码登录上来的用户。
 *
 * - id：本站内部主键，格式 `adm_<random>`，签发后保持稳定，便于其它业务表外键引用。
 * - wechatSubject：provider 下发的 sub，在本应用内保持稳定，唯一。
 * - openid/unionid：微信账号体系标识，便于跨应用关联。
 * - rawProfile：微信 userinfo 接口返回的完整 user 对象（已脱敏），用于审计/扩展字段。
 */
export const wechatUser = pgTable('wechat_user', {
  id: text('id').primaryKey(),
  wechatSubject: text('wechat_subject').notNull().unique(),
  openid: text('openid'),
  unionid: text('unionid'),
  nickname: text('nickname'),
  avatarUrl: text('avatar_url'),
  rawProfile: jsonb('raw_profile').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  lastLoginAt: timestamp('last_login_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

/**
 * 服务端会话表。cookie 里只放随机 token，db 中存 sha256(token)，便于主动失效/撤销。
 */
export const wechatSession = pgTable('wechat_session', {
  id: text('id').primaryKey(),
  tokenHash: text('token_hash').notNull().unique(),
  userId: text('user_id')
    .notNull()
    .references(() => wechatUser.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})
