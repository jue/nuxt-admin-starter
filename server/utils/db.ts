import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  // 缺少 DATABASE_URL 时直接抛错，避免回退到 localhost 把「配置缺失」
  // 伪装成 ECONNREFUSED 127.0.0.1:5432（serverless 运行时不加载 .env，
  // 必须在平台控制台配置该环境变量）。
  throw new Error('DATABASE_URL 未配置：请在运行环境注入该环境变量')
}

const pool = new Pool({ connectionString })

export const db = drizzle(pool, { schema })
