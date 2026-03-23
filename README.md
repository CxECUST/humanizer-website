# Humanizer Website - AI降低重复率工具

一个帮助用户降低AI生成文本重复率的网站，支持用户注册、登录和额度管理。

## 功能特性

- 🔐 用户注册/登录（邮箱密码方式）
- 📊 用户后台管理
- 💰 额度系统（新用户1000字符/月）
- 📝 文本人性化处理
- 🔍 AI模式检测
- 📈 重复率检查
- 📋 使用记录查询

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **UI组件**: shadcn/ui (Radix UI)
- **后端**: Next.js API Routes
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: Prisma
- **认证**: NextAuth.js v5 (Credentials Provider)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并修改：

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 创建数据库

```bash
npx prisma migrate dev --name init
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## API 接口

### 认证

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/[...nextauth]` - NextAuth 登录/登出
- `GET /api/auth/session` - 获取当前session

### 额度

- `GET /api/user/quota` - 获取用户额度
- `GET /api/user/usage` - 获取使用记录
- `GET /api/user/usage/stats` - 获取使用统计

### 功能

- `POST /api/humanize` - 文本人性化处理
- `POST /api/detect` - AI模式检测
- `POST /api/uniqueness-check` - 重复率检查

## 额度规则

| 操作类型 | 额度计算 | 最小额度 |
|---------|---------|---------|
| 人性化处理 | 1 × 字符数 | 10 额度/次 |
| AI检测 | 0.5 × 字符数 | 5 额度/次 |
| 重复率检查 | 0.3 × 字符数 | 3 额度/次 |

新用户默认获得 1000 字符/月免费额度。

## 项目结构

```
humanizer-website/
├── app/
│   ├── (auth)/           # 认证页面组
│   │   ├── signin/
│   │   └── signup/
│   ├── (dashboard)/      # 后台页面组
│   │   └── dashboard/
│   ├── api/             # API路由
│   │   ├── auth/
│   │   ├── user/
│   │   ├── humanize/
│   │   ├── detect/
│   │   └── uniqueness-check/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/             # shadcn/ui 组件
├── lib/
│   ├── auth.ts          # NextAuth 配置
│   ├── quota.ts         # 额度管理逻辑
│   └── prisma.ts       # Prisma 客户端
├── prisma/
│   ├── schema.prisma    # 数据库模型
│   └── migrations/
└── types/
    └── next-auth.d.ts   # NextAuth 类型定义
```

## 数据库模型

### User
- 用户基本信息

### Quota
- 额度管理（总额度、已用、剩余）

### Usage
- 使用记录（操作类型、输入长度、扣除额度、处理结果）

### Session/Account
- NextAuth 会话管理

## 生产部署

### 数据库迁移到 PostgreSQL

修改 `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // 改为 postgresql
  url      = env("DATABASE_URL")
}
```

更新 `.env` 中的 `DATABASE_URL` 为 PostgreSQL 连接字符串。

### Vercel 部署

1. 连接 GitHub 仓库
2. 配置环境变量
3. 部署

## 开发注意事项

1. 本地开发使用 SQLite，生产环境建议使用 PostgreSQL
2. SQLite 不支持原生 enum，使用 String 类型代替
3. NextAuth Session 使用 JWT 策略，适合无服务器部署
4. 所有API都需要登录认证（除首页和注册/登录页）

## License

MIT
