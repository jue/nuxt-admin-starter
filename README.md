# SaaS Starter

一个基于 Nuxt 3 + Nuxt UI 的生产级管理后台启动模板，帮助你快速构建现代化的 SaaS 应用。

## 技术栈

- **框架**: [Nuxt 3](https://nuxt.com/)（SPA 模式，默认关闭 SSR）
- **UI 组件库**: [Nuxt UI v4](https://ui.nuxt.com/)
- **样式**: Tailwind CSS v4
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **数据库 ORM**: Drizzle ORM
- **数据库**: PostgreSQL（开发阶段兼容 libsql/SQLite）
- **图标**: Phosphor Icons（`i-ph-*` 系列）
- **类型检查**: TypeScript + vue-tsc
- **代码规范**: ESLint（@nuxt/eslint）

## 功能特性

- **微信扫码登录**: 通过 [starter.jue.sh](https://starter.jue.sh) OAuth2 平台接入微信扫码登录，无需自行申请微信开放平台资质
- **会话管理**: 基于 HTTP-only Cookie + 数据库存储的安全会话体系，支持主动失效和过期清理
- **管理后台布局**: 响应式侧边栏 + 面包屑导航，支持折叠和移动端 Drawer
- **暗黑模式**: 基于 Nuxt UI 的自动/手动主题切换
- **数据库迁移**: Drizzle Kit 提供生成、执行、可视化迁移脚本

## 项目结构

```
├── app/
│   ├── components/          # Vue 组件
│   │   ├── WechatLoginPanel.vue   # 微信扫码登录面板
│   │   ├── app/
│   │   │   ├── Sidebar.vue        # 应用侧边栏导航
│   │   │   └── Logo.vue           # 应用 Logo
│   │   └── User/
│   │       └── index.vue          # 用户头像/下拉菜单
│   ├── composables/         # 组合式函数
│   │   └── useAuth.ts       # 前端鉴权（获取会话、退出登录）
│   ├── layouts/             # 布局
│   │   └── app.vue          # 管理后台布局（侧边栏 + 主内容区）
│   ├── pages/               # 页面路由
│   │   ├── index.vue        # 官网首页（Landing Page）
│   │   ├── (auth)/
│   │   │   └── login.vue    # 登录页（含微信扫码）
│   │   └── app/
│   │       └── index.vue    # 仪表盘
│   └── stores/              # Pinia 状态仓库
├── server/
│   ├── api/                 # API 路由
│   │   ├── auth/
│   │   │   ├── me.get.ts          # 获取当前登录用户
│   │   │   ├── logout.post.ts     # 退出登录
│   │   │   └── wechat/
│   │   │       └── state.get.ts   # 获取 OAuth state（防 CSRF）
│   │   └── ...
│   ├── db/
│   │   └── schema.ts        # Drizzle ORM 数据库表定义
│   ├── utils/               # 服务端工具函数
│   │   ├── db.ts            # 数据库连接
│   │   ├── session.ts       # Cookie 会话管理（创建/读取/清除）
│   │   ├── wechat-oauth.ts  # 微信登录 state 签名与用户信息换取
│   │   └── wechat-user.ts   # 微信用户数据持久化
│   └── routes/
│       └── auth/
│           └── wechat/
│               ├── callback.get.ts  # OAuth 回调处理
│               └── ...
├── .env.example             # 环境变量示例
├── drizzle.config.ts        # Drizzle Kit 配置
├── nuxt.config.ts           # Nuxt 配置
└── package.json
```

## 快速开始

### 安装依赖

```bash
bun install
```

### 配置环境变量

复制示例文件并填写实际值：

```bash
cp .env.example .env
```

| 变量                             | 说明                                                                     |
| -------------------------------- | ------------------------------------------------------------------------ |
| `DATABASE_URL`                   | PostgreSQL 连接字符串，如 `postgresql://user:pass@localhost:5432/dbname` |
| `WECHAT_LOGIN_PROVIDER_BASE_URL` | 微信登录平台基础地址，默认 `https://starter.jue.sh`                      |
| `WECHAT_LOGIN_CLIENT_ID`         | 在平台创建应用后获得的客户端 ID（格式如 `wcid_xxx`）                     |
| `WECHAT_LOGIN_CLIENT_SECRET`     | 对应客户端密钥（格式如 `wcs_xxx`，仅服务端使用）                         |
| `WECHAT_LOGIN_REDIRECT_URI`      | 在平台登记的 OAuth 回调地址，必须与登记值完全一致                        |
| `WECHAT_LOGIN_STATE_SECRET`      | 用于签名和校验 OAuth state 的随机密钥，建议至少 32 字节                  |

### 数据库迁移

```bash
# 生成迁移文件
bun db:generate

# 执行迁移
bun db:migrate

# 可视化查看数据库（可选）
bun db:studio
```

### 启动开发服务器

```bash
bun dev
```

访问 http://localhost:3000。

## 常用命令

| 命令              | 说明                                 |
| ----------------- | ------------------------------------ |
| `bun dev`         | 启动开发服务器                       |
| `bun build`       | 构建生产环境应用                     |
| `bun preview`     | 本地预览生产构建                     |
| `bun typecheck`   | 运行 TypeScript 类型检查             |
| `bun lint`        | 运行 ESLint 代码检查                 |
| `bun db:generate` | 生成 Drizzle 数据库迁移              |
| `bun db:migrate`  | 执行数据库迁移                       |
| `bun db:studio`   | 启动 Drizzle Studio 数据库可视化工具 |

## 微信登录接入说明

本项目通过 [starter.jue.sh](https://starter.jue.sh) 平台间接接入微信扫码登录，无需自行申请微信开放平台资质。

1. 访问 [starter.jue.sh](https://starter.jue.sh) 创建应用，获取 `CLIENT_ID` 和 `CLIENT_SECRET`
2. 在平台登记回调地址（如 `http://localhost:3000/auth/wechat/callback`）
3. 将获取的凭证填入 `.env`
4. 登录页会自动渲染微信扫码二维码，用户扫码授权后完成登录

## 部署

构建生产环境：

```bash
bun build
```

查看 [Nuxt 部署文档](https://nuxt.com/docs/getting-started/deployment) 了解更多部署选项。

## 许可证

MIT
