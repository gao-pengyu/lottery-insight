# 彩数洞察架构说明

## 1. 当前架构概览

彩数洞察 最小可用版本 使用 Next.js 应用路由 构建，当前重点目标是本地可运行、可演示、可扩展。系统分为页面层、组件层、业务逻辑层、本地存储层和测试层。

```text
浏览器
  ↓
Next.js 页面 src/app/**
  ↓
页面数据聚合 src/lib/data.ts
  ↓
本地 JSON 数据文件 存储 src/lib/store.ts → data/db.json
  ↓
核心纯逻辑 src/lib/analysis.ts / prediction.ts / crawler.ts
```

## 2. 运行时数据流

### 2.1 页面读取开奖数据

```text
Page Component
  → getLatestSsqDraw / getSsqDraws / getSsqAnalysis
  → ensureFreshSsqData
  → readDb(data/db.json)
  → render UI
```

### 2.2 手动刷新官方数据

```text
用户点击“刷新官方数据”
  → POST /api/crawlers/refresh
  → refreshSsqData()
  → fetchOfficialSsqDraws()
  → validateSsqNumbers()
  → upsertDraws()
  → writeDb(data/db.json)
  → 页面 reload
```

如果官方源失败：

```text
fetchOfficialSsqDraws 失败
  → 使用 sampleDraws
  → 数据来源 = sample-fallback
  → 写入 crawlerJobs 记录
```

## 3. 模块边界

| 模块 | 文件 | 边界 |
|---|---|---|
| 页面层 | `src/app/**` | 只负责页面结构、调用数据函数、展示组件 |
| 接口层 | `src/app/api/**/route.ts` | 只负责请求校验、调用业务函数、返回 JSON 数据文件 |
| 组件层 | `src/components/**` | 只负责复用 UI；复杂业务逻辑不放组件里 |
| 数据访问 | `src/lib/data.ts` | 页面级数据聚合，不直接实现算法 |
| 本地存储 | `src/lib/store.ts` | `data/db.json` 的读写和数据结构 |
| 采集 | `src/lib/crawler.ts` | 官方数据获取、校验、兜底、任务记录 |
| 分析 | `src/lib/analysis.ts` | 纯函数，无文件读写，无网络请求 |
| 预测 | `src/lib/prediction.ts` | 纯函数，基于历史数据和规则生成号码 |
| 类型 | `src/lib/types.ts` | 领域对象类型定义 |
| 样例数据 | `src/lib/sample-data.ts` | 本地演示数据 |

## 4. 页面清单

| 页面 | 文件 | 说明 |
|---|---|---|
| 首页 | `src/app/page.tsx` | 最新开奖、热号、新闻入口 |
| 双色球专题 | `src/app/ssq/page.tsx` | 双色球概览 |
| 历史开奖 | `src/app/ssq/history/page.tsx` | 历史开奖表格和刷新按钮 |
| 开奖详情 | `src/app/ssq/draws/[issueNo]/page.tsx` | 单期号码、奖级、地区、站点 |
| 数据分析 | `src/app/ssq/analysis/page.tsx` | 频率、遗漏、和值、比例 |
| 号码生成 | `src/app/ssq/predict/page.tsx` | 娱乐性号码生成 |
| 资讯列表 | `src/app/news/page.tsx` | 资讯摘要 |
| 资讯详情 | `src/app/news/[id]/page.tsx` | 单篇摘要和来源 |
| 后台 | `src/app/admin/page.tsx` | 数据量和任务概览 |
| 采集任务 | `src/app/admin/crawlers/page.tsx` | 任务列表和刷新按钮 |
| 数据质量 | `src/app/admin/data-quality/page.tsx` | 问题列表 |
| 免责声明 | `src/app/about/disclaimer/page.tsx` | 合规说明 |

## 5. 接口清单

| API | 文件 | 说明 |
|---|---|---|
| `GET /api/draws/ssq/latest` | `src/app/api/draws/ssq/latest/route.ts` | 最新开奖 |
| `POST /api/predictions/ssq/generate` | `src/app/api/predictions/ssq/generate/route.ts` | 号码生成 |
| `GET /api/articles` | `src/app/api/articles/route.ts` | 资讯列表 |
| `POST /api/crawlers/refresh` | `src/app/api/crawlers/refresh/route.ts` | 刷新开奖数据 |

## 6. 核心不变量

1. 双色球红球必须是 6 个不重复数字，范围 1-33。
2. 双色球蓝球必须是 1 个数字，范围 1-16。
3. 预测结果必须包含“不保证中奖/仅供娱乐”的说明。
4. 官方源失败不能导致页面不可用。
5. 本地演示数据可以兜底，但必须标记来源。
6. 资讯内容只展示摘要和来源，不搬运全文。
7. 不引入彩票销售、支付、代购、合买、跟单功能。

## 7. 后续线上化演进

建议按以下顺序演进：

1. `data/db.json` → PostgreSQL。
2. `src/lib/store.ts` → repository 接口 + 数据库实现。
3. 页面触发刷新 → BullMQ/cron 定时任务。
4. 本地任务记录 → 数据库任务表 + 日志。
5. 简单后台 → 带登录鉴权的运营后台。
6. 静态资讯 → 新闻源抓取、去重、摘要和审核流。
