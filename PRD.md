# Humanizer 文本人性化工具 - 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 产品定位
Humanizer 是一个在线文本人性化工具，帮助用户将 AI 生成的文字转换为更自然、更像人类写作的内容。通过识别和去除 AI 写作的典型特征，提升内容的可读性和真实性。

### 1.2 目标用户
| 用户类型 | 使用场景 |
|---------|---------|
| 内容创作者 | 润色 AI 辅助生成的文章，使其更自然 |
| 营销人员 | 优化 AI 生成的营销文案，避免机械感 |
| 学生/研究人员 | 修改 AI 辅助写作的内容，确保学术诚信 |
| 自媒体运营 | 批量处理 AI 生成的内容，保持个人风格 |

### 1.3 核心价值主张
- **快速**: 一键检测并去除 AI 写作痕迹
- **准确**: 基于 20+ 种 AI 写作模式的识别规则
- **自然**: 不只是删除，而是真正"人性化"重写
- **独特**: 降低与已知 AI 内容的重复率，提升原创性
- **隐私**: 本地处理，不存储用户文本

---

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 文本输入
| 功能 | 描述 | 优先级 |
|-----|------|--------|
| 直接粘贴 | 支持大段文本粘贴（最多 5000 字） | P0 |
| 文件上传 | 支持 .txt, .docx, .md 文件导入 | P1 |
| URL 抓取 | 输入网页 URL，自动提取正文内容 | P2 |

#### 2.1.2 AI 模式检测
实时高亮显示文本中的 AI 特征：

| 检测类型 | 说明 | 视觉提示 |
|---------|------|---------|
| 过度强调 | testament, pivotal, crucial 等 | 黄色下划线 |
| 肤浅分析 | highlighting, reflecting... | 蓝色波浪线 |
| 模糊归因 | Experts argue... | 橙色框 |
| AI 高频词 | Additionally, Furthermore... | 灰色删除线 |
| 无灵魂句式 | 过度中立的表达 | 虚线框 |

#### 2.1.3 降低 AI 重复率（Uniqueness Enhancement）
检测并降低文本与常见 AI 生成内容的重复度，提升原创性：

| 功能模块 | 描述 | 技术实现 |
|---------|------|---------|
| **重复率检测** | 比对文本与常见 AI 语料库的相似度 | 向量相似度计算 + 指纹算法 |
| **常见 AI 模板识别** | 识别 GPT 等模型的典型输出结构 | 模式匹配 + 统计特征分析 |
| **句式重构** | 改变句子结构，避免与 AI 输出雷同 | 同义句生成 + 语序调整 |
| **词汇多样化** | 替换高频 AI 用词，增加表达多样性 | 语义相似词推荐 + 上下文适配 |
| **段落重组** | 调整段落逻辑顺序，打破固定模板 | 语义连贯性分析 + 结构优化 |

**重复率评分维度：**
```
总分 = 100 - (AI模板匹配度 × 0.4 + 词汇重复度 × 0.3 + 句式重复度 × 0.2 + 段落结构重复度 × 0.1)
```

| 分数区间 | 评级 | 建议 |
|---------|------|------|
| 90-100 | 高度原创 | 无需修改 |
| 70-89 | 较原创 | 轻微调整 |
| 50-69 | 中等重复 | 建议重构 |
| 0-49 | 高度重复 | 必须重写 |

#### 2.1.5 人性化处理
| 处理模式 | 描述 | 适用场景 |
|---------|------|---------|
| 快速模式 | 仅标记问题，不自动修改 | 用户想自己修改 |
| 标准模式 | 自动重写，保留原意 | 日常使用 |
| 深度模式 | 添加个人观点和语气 | 需要强个性化 |
| **防重复模式** | 重点降低 AI 重复率 | 查重/检测场景 |
| 对比模式 | 左右分栏显示原文和修改 | 精细校对 |

#### 2.1.6 输出功能
- 复制结果
- 下载为 .txt / .docx / .md
- 分享链接（临时，24小时有效）
- 一键应用到原文（编辑模式）

### 2.2 用户系统功能

#### 2.2.1 用户注册/登录
| 功能 | 描述 | 优先级 |
|-----|------|--------|
| 邮箱注册 | 用户通过邮箱和密码注册账户 | P0 |
| 邮箱登录 | 使用邮箱密码登录系统 | P0 |
| 密码重置 | 通过邮箱重置密码 | P1 |
| Session 管理 | JWT Session，自动过期刷新 | P0 |

#### 2.2.2 额度管理
| 功能 | 描述 | 优先级 |
|-----|------|--------|
| 默认额度 | 新用户注册后获得 1000 字符/月 | P0 |
| 额度显示 | 后台实时显示剩余额度 | P0 |
| 额度消耗 | 每次处理文本自动扣除相应额度 | P0 |
| 额度不足提示 | 额度用完时提示用户升级或等待下月重置 | P0 |

#### 2.2.3 用户后台
| 功能 | 描述 | 优先级 |
|-----|------|--------|
| Dashboard 首页 | 额度概览、最近活动、快捷操作 | P0 |
| 额度管理页 | 详细额度信息、使用趋势图 | P0 |
| 使用记录页 | 历史处理记录、详细数据 | P0 |
| 个人设置页 | 修改密码、账户信息管理 | P1 |

### 2.3 辅助功能

| 功能 | 描述 | 优先级 |
|-----|------|--------|
| 语气选择 | 正式/随意/专业/幽默/学术 | P1 |
| 语言支持 | 中文、英文、中英混合 | P0 |
| 统计面板 | 显示修改数量、AI 痕迹评分、重复率评分 | P1 |
| 批量处理 | 同时处理多个文件 | P2 |
| **查重报告** | 生成详细的重复率分析报告 | P2 |

---

## 3. 技术架构

### 3.1 系统架构

```
┌─────────────────┐
│   前端 (Next.js) │  React + TypeScript + Tailwind
│  - 文本编辑器    │
│  - 实时检测高亮  │
│  - 结果展示     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API 路由层    │  Next.js API Routes
│  - 请求验证     │
│  - 限流控制     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI 处理服务    │  Claude API / OpenAI API
│  - 文本分析     │  System Prompt 包含检测规则
│  - 人性化重写   │
│  - 重复率检测   │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  重复率检测服务  │  向量数据库 + 指纹算法
│  - AI 语料库比对 │  ChromaDB / Pinecone
│  - 相似度计算   │
│  - 模板匹配     │
└─────────────────┘
```

### 3.2 数据流

```
用户输入 → 前端校验 → API 请求 → LLM 处理 → 结果解析 → 前端渲染 → 用户操作
```

### 3.3 关键技术选型

| 层级 | 技术栈 | 理由 |
|-----|--------|------|
| 前端框架 | Next.js 14 (App Router) | SSR 支持、API 路由一体化 |
| UI 组件 | shadcn/ui + Tailwind | 快速开发、美观 |
| 编辑器 | Slate.js / Tiptap | 自定义高亮、富文本支持 |
| AI 接口 | Claude API (首选) | 文本处理能力强 |
| 状态管理 | Zustand | 轻量、易用 |
| 部署 | Vercel | 与 Next.js 完美配合 |

---

## 4. 页面设计

### 4.1 页面结构

```
/
├── /                    # 首页 - 主功能页面
├── /about               # 关于页面
├── /auth                # 认证相关页面
│   ├── /signin          # 登录页
│   └── /signup          # 注册页
├── /dashboard           # 用户后台
│   ├── /                # Dashboard 首页
│   ├── /quota           # 额度管理页
│   └── /usage           # 使用记录页
├── /api                 # API 路由
│   ├── /auth/[...nextauth]  # NextAuth 路由
│   ├── /user/quota      # 获取用户额度
│   ├── /user/usage      # 获取使用记录
│   ├── /humanize        # 文本处理接口
│   ├── /detect          # 仅检测接口
│   └── /uniqueness-check # 重复率检测接口
└── /share/[id]          # 分享结果页
```

### 4.2 首页布局

```
┌─────────────────────────────────────────────────────┐
│  Logo    首页   API文档   关于              语言 主题  │  ← Header
├─────────────────────────────────────────────────────┤
│                                                     │
│        让 AI 文字读起来像人写的                        │  ← Hero
│   一键检测并去除 AI 写作痕迹，让你的内容更自然          │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────────────────────────────────────────┐  │
│   │  模式: [标准 ▼]  语气: [自然 ▼]  防重复: [开 ▼] │  │  ← 工具栏
│   │  字数: 0/5000  │  重复率: --%  │  AI评分: --   │  │
│   └─────────────────────────────────────────────┘  │
│                                                     │
│   ┌──────────────────┐  ┌──────────────────┐      │
│   │                  │  │                  │      │
│   │   输入区域        │  │   输出区域        │      │  ← 主编辑区
│   │   (支持实时高亮)   │  │   (显示修改结果)   │      │
│   │                  │  │                  │      │
│   │                  │  │                  │      │
│   └──────────────────┘  └──────────────────┘      │
│                                                     │
│   ┌─────────────────────────────────────────────┐  │
│   │  [开始人性化]  [仅检测]  [清空]              │  │  ← 操作按钮
│   └─────────────────────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│  AI 痕迹评分: 78 → 23                              │  ← 统计面板
│  重复率评分: 45 → 87  ↑ 原创性提升 42 分            │
│  检测到: 过度强调 x3 | 肤浅分析 x2 | AI词汇 x5      │
│  重复降低: 句式重构 x8 | 词汇替换 x12 | 段落重组 x2 │
│                                                     │
├─────────────────────────────────────────────────────┤
│  工作原理 | 常见问题 | 隐私政策 | GitHub           │  ← Footer
└─────────────────────────────────────────────────────┘
```

### 4.3 响应式断点

| 断点 | 布局变化 |
|-----|---------|
| Desktop (≥1280px) | 左右分栏编辑器 |
| Tablet (768-1279px) | 上下分栏编辑器 |
| Mobile (<768px) | 单栏，Tab 切换输入/输出 |

---

## 5. API 设计

### 5.1 人性化接口

```http
POST /api/humanize
Content-Type: application/json

{
  "text": "需要处理的文本...",
  "mode": "standard",      // quick | standard | deep | anti-plagiarism
  "tone": "natural",       // formal | casual | professional | humorous | academic
  "language": "zh",        // zh | en | auto
  "antiDuplicate": true,   // 是否启用重复率降低
  "targetUniqueness": 85   // 目标重复率评分 (0-100)
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "original": "原文...",
    "humanized": "修改后...",
    "changes": [
      {
        "type": "over_emphasis",
        "original": "marks a pivotal moment",
        "replacement": "is an important event",
        "position": [45, 67]
      }
    ],
    "stats": {
      "aiScoreBefore": 78,
      "aiScoreAfter": 23,
      "uniquenessScoreBefore": 45,
      "uniquenessScoreAfter": 87,
      "patternsFound": {
        "overEmphasis": 3,
        "superficialAnalysis": 2,
        "aiVocabulary": 5
      },
      "uniquenessImprovements": {
        "sentenceRestructured": 8,
        "vocabularyReplaced": 12,
        "paragraphReorganized": 2,
        "templateMatchesRemoved": 3
      },
      "similarityReport": {
        "matchedTemplates": ["ai_intro_pattern", "list_structure"],
        "similarityScore": 12.5
      }
    }
  }
}
```

### 5.2 仅检测接口

```http
POST /api/detect
Content-Type: application/json

{
  "text": "需要检测的文本..."
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "aiScore": 78,
    "patterns": [
      {
        "type": "over_emphasis",
        "text": "testament to",
        "position": [23, 35],
        "suggestion": "example of"
      }
    ]
  }
}
```

### 5.3 用户系统 API

#### 5.3.1 用户认证

**POST /api/auth/register**
```http
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123"
}
```

**响应：**
```json
{
  "success": true,
  "user": {
    "id": "cuid...",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

**POST /api/auth/[...nextauth]**
- NextAuth.js 处理所有认证路由
- 登录: /api/auth/signin
- 登出: /api/auth/signout
- Session: /api/auth/session

**GET /api/auth/session**
```json
{
  "user": {
    "id": "cuid...",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER"
  },
  "expires": "2026-03-23T12:00:00Z"
}
```

#### 5.3.2 额度管理

**GET /api/user/quota**
```http
Authorization: Bearer <session_token>
```

**响应：**
```json
{
  "success": true,
  "data": {
    "totalQuota": 1000,
    "usedQuota": 234,
    "remainingQuota": 766,
    "planType": "FREE",
    "lastRenewalDate": "2026-03-01T00:00:00Z",
    "nextRenewalDate": "2026-04-01T00:00:00Z",
    "usagePercentage": 23.4
  }
}
```

#### 5.3.3 使用记录

**GET /api/user/usage**
```http
Authorization: Bearer <session_token>
Query Params: ?limit=20&offset=0&startDate=2026-03-01&endDate=2026-03-22
```

**响应：**
```json
{
  "success": true,
  "data": {
    "usages": [
      {
        "id": "cuid...",
        "actionType": "HUMANIZE",
        "inputLength": 1500,
        "quotaDeducted": 15,
        "aiScoreBefore": 78,
        "aiScoreAfter": 23,
        "uniquenessScore": 87,
        "mode": "standard",
        "tone": "natural",
        "language": "zh",
        "createdAt": "2026-03-22T10:30:00Z"
      }
    ],
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

**GET /api/user/usage/stats**
```json
{
  "success": true,
  "data": {
    "totalRequests": 45,
    "totalCharactersProcessed": 67500,
    "averageAiScoreImprovement": 55.3,
    "averageUniquenessScore": 82.4,
    "usageByDay": [
      { "date": "2026-03-20", "count": 12 },
      { "date": "2026-03-21", "count": 18 },
      { "date": "2026-03-22", "count": 15 }
    ],
    "usageByActionType": {
      "HUMANIZE": 35,
      "DETECT": 8,
      "CHECK": 2
    }
  }
}
```

### 5.4 限流策略

| 用户类型 | 限制 |
|---------|------|
| 未登录 | 5 次/小时 |
| 登录用户 | 50 次/小时 |
| API Key | 1000 次/小时 |

### 5.5 重复率检测专用接口

```http
POST /api/uniqueness-check
Content-Type: application/json

{
  "text": "需要检测的文本...",
  "checkType": "all"       // all | template | vocabulary | sentence
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "uniquenessScore": 45,
    "riskLevel": "high",
    "matches": [
      {
        "type": "template",
        "matchedPattern": "ai_intro_pattern",
        "similarity": 0.85,
        "text": "In today's rapidly evolving world...",
        "suggestion": "用更具体的开头替代"
      },
      {
        "type": "vocabulary",
        "word": "crucial",
        "frequency": 5,
        "suggestion": "尝试 vital, essential, critical"
      }
    ],
    "details": {
      "templateMatchScore": 35,
      "vocabularyDiversity": 58,
      "sentenceStructureVariety": 42,
      "paragraphPatternScore": 65
    }
  }
}
```

---

## 6. 重复率降低机制详解

### 6.1 技术架构

```
┌─────────────────────────────────────────────────────┐
│                  重复率检测引擎                       │
├─────────────┬─────────────┬─────────────┬───────────┤
│  模板匹配   │  词汇分析   │  句式分析   │ 指纹比对  │
│   模块     │   模块     │   模块     │  模块    │
├─────────────┼─────────────┼─────────────┼───────────┤
│ • 开头模板  │ • 高频词   │ • 句长分布  │ • SimHash│
│ • 结尾模板  │ • 重复词   │ • 句式分布  │ • MinHash│
│ • 过渡模板  │ • 语义聚类  │ • 被动语态  │ • 向量   │
│ • 列表模板  │ • 词嵌入   │ • 平行结构  │   相似度  │
└─────────────┴─────────────┴─────────────┴───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │     AI 语料库          │
              │  (GPT输出/常见模板)     │
              └───────────────────────┘
```

### 6.2 检测维度

| 维度 | 检测内容 | 权重 | 实现方式 |
|-----|---------|------|---------|
| **模板匹配** | 常见 AI 开头、结尾、过渡句式 | 40% | 正则表达式 + N-gram 匹配 |
| **词汇多样性** | 高频词使用、重复率、语义聚类 | 30% | TF-IDF + Word2Vec |
| **句式多样性** | 句长分布、句式类型、被动语态比例 | 20% | 句法分析 + 统计特征 |
| **段落结构** | 段落长度分布、结构模板 | 10% | 布局分析 + 模式识别 |

### 6.3 常见 AI 模板库

| 类型 | 英文模板 | 中文模板 |
|-----|---------|---------|
| 开头 | "In today's rapidly evolving..." | "在当今快速发展的..." |
| 开头 | "With the advent of..." | "随着...的到来" |
| 开头 | "It is important to note that..." | "值得注意的是..." |
| 过渡 | "Furthermore, ..." | "此外，..." |
| 过渡 | "In addition, ..." | "另外，..." |
| 结尾 | "In conclusion, ..." | "综上所述，..." |
| 结尾 | "To sum up, ..." | "总之，..." |
| 列表 | "First... Second... Third..." | "首先...其次...最后..." |

### 6.4 降低重复率的策略

#### 策略 1: 句式重构
```
原文: "It is important to note that AI has revolutionized many industries."
重构: "AI has changed how many industries work—sometimes in ways we didn't expect."
```

#### 策略 2: 词汇替换
```
原文: "This is a crucial factor in the success of the project."
替换: "This one factor can make or break the project."
```

#### 策略 3: 打破模板
```
原文: "In conclusion, this essay has discussed..."
改写: "So where does this leave us?"
```

#### 策略 4: 添加个性化
```
原文: "Many people believe that..."
改写: "When I talked to my colleague about this last week, she pointed out..."
```

### 6.5 英文特有处理

| 问题 | 检测方法 | 修复策略 |
|-----|---------|---------|
| 过度使用被动语态 | 统计 be + past participle 比例 | 转换为主动语态 |
| 缺乏 contractions | 检测 I'm, don't, can't 等使用频率 | 适当添加口语化表达 |
| 正式连接词堆砌 | 检测 however, therefore, furthermore | 用更自然的过渡方式 |
| 冗长表达 | 检测 "in order to", "due to the fact" | 替换为简洁表达 |

---

## 7. System Prompt 设计

```
你是一位专业的写作编辑，任务是识别并去除 AI 生成文本的典型特征。

## 处理规则

### 1. 删除过度强调
- testament, pivotal, crucial, vital, significant → 改为具体描述
- "marks a pivotal moment" → "is important"

### 2. 删除肤浅分析
- 删除 highlighting, underscoring, reflecting, symbolizing... 开头的短语

### 3. 使用简单句式
- "serves as" → "is"
- "stands as" → "is"
- "functions as" → "is/works as"

### 4. 删除模糊归因
- "Experts argue" → 具体来源或无主语句
- "Industry reports" → 具体报告名称

### 5. 添加个人观点
- 适当使用第一人称
- 承认不确定性和复杂性
- 表达真实感受

### 6. 其他 AI 特征
- 删除 "Additionally, Furthermore, Moreover"
- 删除 "It's not just X, it's Y" 句式
- 删除规则化的三点列举
- 避免每句长度一致

### 7. 降低重复率（当 antiDuplicate=true 时）
- **避免 AI 常见开头**: 不要以 "In today's world...", "With the rapid development..." 开头
- **避免固定结构**: 不要严格按照 "引言-背景-方法-结论" 的模板组织
- **句式多样化**: 同一意思用不同句式表达，避免平行结构
- **词汇替换**: 用更具体、少见的词汇替代常见 AI 用词
  - important → crucial/significant/vital/critical (根据语境选择)
  - many → numerous/countless/a variety of
  - good → excellent/outstanding/remarkable
- **打破列表模式**: 不要用 "First... Second... Third..." 或 "Firstly... Secondly..."
- **个性化插入**: 添加具体例子、个人经历、真实细节
- **不规则段落**: 段落长度不一，不要每段都 3-5 句话

### 8. 英文特有重复模式
- 避免 "In conclusion / To sum up / In summary"
- 避免 "It is important to note that..."
- 避免 "This essay will discuss..."
- 避免被动语态过度使用
- 使用 contractions (I'm, don't, can't) 增加自然度

## 输出格式
返回 JSON：
{
  "humanizedText": "修改后的文本",
  "changes": [
    {
      "type": "over_emphasis",
      "original": "原文片段",
      "replacement": "修改后",
      "reason": "修改原因"
    }
  ]
}
```

---

## 8. 非功能需求

### 8.1 性能要求
- 首屏加载 < 2s
- 文本处理响应 < 5s（≤1000 字）
- 编辑器输入延迟 < 50ms
- 重复率检测响应 < 2s

### 8.2 安全要求
- 所有 API 请求 HTTPS
- 用户文本不存储（仅临时处理）
- 输入长度限制（防止滥用）
- 速率限制（防止刷接口）
- **查重语料库本地部署**（避免数据外传）

### 8.3 隐私要求
- 明确告知用户文本处理方式
- 提供"隐私模式"（不保留任何日志）
- 符合 GDPR 要求
- **查重数据不用于模型训练**

---

## 9. 里程碑规划

| 阶段 | 时间 | 目标 |
|-----|------|------|
| MVP | 2 周 | 基础输入输出、标准模式、中文支持 |
| V1.0 | 4 周 | 完整功能、文件上传、历史记录、**重复率检测** |
| V1.5 | 6 周 | API 开放、批量处理、插件系统、**查重报告** |
| V2.0 | 8 周 | 多语言、团队协作、高级分析、**自定义语料库** |

---

## 10. 成功指标

| 指标 | 目标值 |
|-----|-------|
| 日活跃用户 (DAU) | 1000+ |
| 平均处理字数 | 800+ |
| 用户满意度 | 4.5/5 |
| AI 痕迹降低率 | 平均 50%+ |
| **重复率降低率** | **平均 40%+** |
| **处理后原创度** | **≥ 80%** |
| 重复使用率 | 30%+ |

---

## 11. 风险与应对

| 风险 | 影响 | 应对策略 |
|-----|------|---------|
| AI 检测不准确 | 高 | 持续优化 prompt，提供用户反馈机制 |
| API 成本高 | 中 | 实现缓存、限流，考虑本地小模型 |
| 竞品出现 | 中 | 专注用户体验，快速迭代 |
| 用户隐私顾虑 | 高 | 透明隐私政策，本地处理选项 |
| **查重误报率高** | **中** | **人工审核样本，持续优化阈值** |
| **语料库维护成本** | **中** | **社区贡献 + 自动采集 + 定期更新** |

---

## 12. 附录

### 11.1 竞品参考
- Undetectable.ai
- GPTZero.me
- HumanizeAI.pro

### 11.2 技术资源
- Claude API 文档: https://docs.anthropic.com
- Wikipedia AI Writing Signs: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing

---

**文档版本**: v1.1
**创建日期**: 2026-03-18
**最后更新**: 2026-03-18

### 更新日志
| 版本 | 日期 | 更新内容 |
|-----|------|---------|
| v1.0 | 2026-03-18 | 初始版本，核心功能定义 |
| v1.1 | 2026-03-18 | 新增重复率降低机制、查重检测、防重复模式 |
