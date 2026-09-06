<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md - 彩数洞察智能体工作指南

## 1. 项目一句话

彩数洞察是一个 Next.js 本地彩票信息网站 最小可用版本，当前只深度支持 **福利彩票·双色球**，提供开奖数据、历史分析、娱乐性号码生成、资讯摘要和后台采集状态。

## 2. 先读这些文档

| 任务 | 必读文档 |
|---|---|
| 了解产品范围 | `docs/product/PRD.md` |
| 了解原技术方案 | `docs/technical/TECHNICAL_DESIGN.md` |
| 了解当前实现 | `docs/technical/CURRENT_IMPLEMENTATION.md` |
| 改数据采集 | `docs/specs/DATA_REFRESH_SPEC.md`, `src/lib/crawler.ts` |
| 改分析逻辑 | `docs/specs/ANALYSIS_SPEC.md`, `src/lib/analysis.ts` |
| 改号码生成 | `docs/specs/PREDICTION_SPEC.md`, `src/lib/prediction.ts` |
| 改页面 | `ARCHITECTURE.md`, `src/app/**`, `src/components/**` |
| 运维排障 | `docs/operations/RUNBOOK.md`, `docs/operations/LOCAL_START.md` |
| 合规判断 | `docs/rules/COMPLIANCE.md` |

## 3. 当前技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Vitest
- 本地 JSON 数据文件 数据文件：`data/db.json`
- 样例数据入口：`prisma/seed.ts`
- Prisma 数据模型文件 仅保留为后续 PostgreSQL 迁移参考，当前运行时不要依赖 Prisma 客户端。

## 4. 常用命令

```bash
npm install
npm run setup
npm run dev
npm run local:start
npm run local:stop
npm run local:status
npm test
npm run build
```

手动刷新官方开奖数据：

```bash
curl -X POST http://localhost:3000/api/crawlers/refresh
```

检查最新开奖 API：

```bash
curl http://localhost:3000/api/draws/ssq/latest
```

## 5. 模块地图

| 路径 | 职责 |
|---|---|
| `src/app/` | 页面和 API 路由 |
| `src/components/` | 展示组件和客户端交互组件 |
| `src/lib/types.ts` | 领域类型 |
| `src/lib/store.ts` | 本地 JSON 数据文件 存储读写 |
| `src/lib/data.ts` | 页面用数据读取和聚合 |
| `src/lib/crawler.ts` | 官方开奖数据刷新和兜底逻辑 |
| `src/lib/analysis.ts` | 频率、遗漏、和值、奇偶比等纯分析逻辑 |
| `src/lib/prediction.ts` | 娱乐性号码生成逻辑 |
| `src/lib/sample-data.ts` | 本地示例数据 |
| `src/__tests__/` | 行为测试 |
| `data/db.json` | 本地运行数据，不要手工编辑，优先用 `npm run setup` 重建 |

## 6. 重要工程约束

1. **不做售彩功能**：禁止新增支付、投注、代购、合买、跟单、返佣、充值、提现能力。
2. **预测必须标注娱乐性**：任何号码生成结果都必须说明不能预测真实开奖结果。
3. **先测试再改核心逻辑**：修改 `analysis.ts`、`prediction.ts`、`crawler.ts` 前先补或更新测试。
4. **数据源可失败**：官方源不可用时必须有兜底路径，不允许页面直接崩溃。
5. **页面读数据要动态**：开奖、历史、分析、后台页面应避免静态缓存导致数据旧。
6. **不采集个人敏感信息**：不得加入真实姓名、手机号、身份证等字段展示或存储。
7. **新闻只做摘要和来源**：不要抓取并展示完整转载文章。
8. **本地 JSON 数据文件 是当前 权威数据源**：当前运行时以 `data/db.json` 为准。

## 7. 修改流程建议

1. 阅读相关 `docs/specs/*.md` 和 `docs/rules/*.md`。
2. 用 `rg` 查找现有实现和测试。
3. 对核心逻辑先写失败测试。
4. 最小修改实现。
5. 执行：

```bash
npm test
npm run build
```

6. 若改动采集或页面数据，手动检查：

```bash
npm run setup
npm run dev
curl -X POST http://localhost:3000/api/crawlers/refresh
curl http://localhost:3000/api/draws/ssq/latest
```

## 8. 常见坑

- `npm run setup` 会重置 `data/db.json`，可能覆盖手动刷新得到的官方数据。
- `src/components/PredictionForm.tsx` 是浏览器端组件，里面可以使用 `window.location.reload()`；服务端页面不能使用浏览器 浏览器接口。
- `src/app/**/page.tsx` 中多个数据页设置了 `dynamic = "force-dynamic"`，不要随意删除，否则可能出现旧数据。
- Next.js 版本较新，遇到框架 API 不确定时先查本地 `node_modules/next/dist/docs/`。
- `AGENTS.md` 顶部 Next.js 自动生成块不要删除，`next dev` 会自动补回。

## 9. 交付前检查清单

- [ ] `npm test` 通过
- [ ] `npm run build` 通过
- [ ] 核心页面能打开
- [ ] `/api/draws/ssq/latest` 返回正常 JSON 数据文件
- [ ] 没有新增售彩/支付/承诺中奖文案
- [ ] 文档路径和命令同步更新
