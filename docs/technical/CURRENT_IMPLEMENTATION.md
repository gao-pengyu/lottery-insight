# 当前 最小可用版本 实现说明

## 1. 当前状态

当前项目已经实现一个可本地运行的双色球信息网站 最小可用版本。

已实现：

- 首页
- 双色球专题页
- 历史开奖页
- 单期开奖详情页
- 数据分析页
- 娱乐性号码生成页
- 彩票资讯页
- 后台监控页
- 采集任务页
- 数据质量页
- 最新开奖 API
- 号码生成 API
- 官方数据刷新 API

## 2. 与原技术方案的差异

| 原方案 | 当前 最小可用版本 | 原因 |
|---|---|---|
| PostgreSQL | `data/db.json` | 本地中文路径下 Prisma SQLite 初始化异常，优先保证可运行 |
| Prisma ORM | 保留 schema，不作为运行时依赖 | 后续数据库化迁移参考 |
| Redis + BullMQ 定时任务 | 页面触发 + 手动刷新 | 最小可用版本 简化，降低部署成本 |
| 新闻全网搜索 | 本地资讯样例 + 刷新事件文章 | 最小可用版本 阶段先验证信息结构 |
| ECharts/Recharts 图表 | 轻量表格和条形图 CSS | 最小可用版本 优先跑通数据闭环 |

## 3. 数据源

当前支持两类数据源：

1. 中国福彩网公开接口。
2. 本地示例数据 `src/lib/sample-data.ts`。

刷新入口：

```text
POST /api/crawlers/refresh
```

刷新函数：

```text
src/lib/crawler.ts → refreshSsqData()
```

## 4. 运行时数据

当前 权威数据源：

```text
data/db.json
```

写入入口：

- `npm run setup`：重置为本地示例数据。
- `POST /api/crawlers/refresh`：拉取官方数据，失败则回退示例数据。

## 5. 页面动态策略

开奖、分析、后台页面使用：

```ts
export const dynamic = "force-dynamic";
```

原因：避免 Next.js 在构建或开发过程中缓存旧数据，导致页面查不到最新开奖。

## 6. 测试覆盖

当前测试文件：

- `src/__tests__/analysis.test.ts`
- `src/__tests__/prediction.test.ts`
- `src/__tests__/crawler.test.ts`

测试内容：

- 双色球号码格式校验
- 历史分析统计
- 号码生成约束
- 官方数据刷新 TTL 判断

运行：

```bash
npm test
```
