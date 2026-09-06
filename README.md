# 彩数洞察 最小可用版本

彩数洞察是一个本地可运行的彩票信息网站 最小可用版本，当前重点支持 **福利彩票·双色球**：最新开奖、历史开奖、基础数据分析、娱乐性号码生成、资讯摘要和后台采集状态查看。

> 合规边界：本站只提供公开数据整理、历史分析和娱乐性号码生成服务；不销售彩票，不代购彩票，不提供投注入口，不接入支付，不承诺中奖。

## 1. 给运维人员的快速结论

### 1.1 当前运行方式

当前 最小可用版本 是一个 Next.js 本地网站应用：

- 网站入口：`http://localhost:3000`
- 数据存储：本地 JSON 数据文件 `data/db.json`
- 官方数据刷新：`POST /api/crawlers/refresh`
- 默认核心彩种：双色球 `ssq`
- Node.js 版本：建议 Node.js 20+

### 1.2 为什么不是 PostgreSQL

原技术方案建议 PostgreSQL + Prisma。实际本地落地时，当前工作目录包含中文路径，Prisma SQLite 初始化在该环境下出现 schema engine 异常。为了确保 最小可用版本 能在本地直接运行，当前版本把存储层切换为本地 JSON 数据文件。

后续线上部署建议恢复为：

```text
Next.js + PostgreSQL + Prisma + Redis/BullMQ
```

当前代码中保留了 `prisma/schema.prisma` 作为后续数据库迁移参考，但运行时主要读取 `src/lib/store.ts` 管理的 `data/db.json`。

## 2. 项目目录

```text
lottery-insight/
  README.md                         # 运维和开发主说明
  AGENTS.md                         # 智能体工作指南
  ARCHITECTURE.md                   # 架构和模块边界
  package.json                      # npm 脚本和依赖
  data/db.json                      # 本地运行数据文件
  docs/
    AGENTS.md                       # docs 目录导航
    product/PRD.md                  # 产品需求文档
    technical/TECHNICAL_DESIGN.md   # 技术方案文档
    technical/CURRENT_IMPLEMENTATION.md
    operations/RUNBOOK.md           # 运维手册
    operations/DEPLOYMENT.md        # 部署建议
    specs/                          # 当前实现规格
    rules/                          # 工程和合规规则
  rules/                            # AI/IDE 常用规则入口
  spec/                             # AI/IDE 常用规格入口
  src/
    app/                            # Next.js 页面和 API
    components/                     # UI 组件
    lib/                            # 数据、采集、分析、预测逻辑
    __tests__/                      # Vitest 测试
```

## 3. 本地启动

### 3.0 推荐一键启动

```bash
npm run local:start
```

停止服务：

```bash
npm run local:stop
```

查看状态：

```bash
npm run local:status
```

详细说明见 `docs/operations/LOCAL_START.md`。

### 3.1 安装依赖

```bash
cd /Users/bytedance/Documents/ChatGPT/其他/lottery-insight
npm install
```

### 3.2 初始化本地数据

```bash
npm run setup
```

该命令会写入 `data/db.json`，包含：

- 双色球示例历史数据
- 最新一期示例奖级信息
- 示例中奖地区和站点
- 示例资讯文章
- 一条初始化采集任务记录

### 3.3 启动开发服务

```bash
npm run dev
```

打开：

```text
http://localhost:3000
```

常用页面：

| 页面 | 地址 |
|---|---|
| 首页 | `http://localhost:3000/` |
| 双色球专题 | `http://localhost:3000/ssq` |
| 历史开奖 | `http://localhost:3000/ssq/history` |
| 数据分析 | `http://localhost:3000/ssq/analysis` |
| 号码生成 | `http://localhost:3000/ssq/predict` |
| 彩票资讯 | `http://localhost:3000/news` |
| 后台监控 | `http://localhost:3000/admin` |
| 采集任务 | `http://localhost:3000/admin/crawlers` |
| 数据质量 | `http://localhost:3000/admin/data-quality` |
| 免责声明 | `http://localhost:3000/about/disclaimer` |

## 4. 常见命令

| 命令 | 用途 |
|---|---|
| `npm install` | 安装依赖 |
| `npm run setup` | 初始化或重置本地演示数据 |
| `npm run dev` | 启动本地开发服务 |
| `npm run local:start` | 构建并以生产模式启动本地服务 |
| `npm run local:stop` | 停止本地生产服务 |
| `npm run local:status` | 查看本地服务状态 |
| `npm test` | 运行单元测试 |
| `npm run build` | 生产构建和类型检查 |
| `npm run db:seed` | 仅重建 `data/db.json` 示例数据 |

## 5. 数据刷新

### 5.1 页面手动刷新

在以下页面可以点击 **刷新官方数据**：

- `/ssq/history`
- `/admin/crawlers`

刷新逻辑：

1. 调用中国福彩网公开接口。
2. 解析双色球最近开奖数据。
3. 校验红球、蓝球格式。
4. 写入 `data/db.json`。
5. 如果官方源不可用，则回退到本地示例数据。

### 5.2 命令行刷新

```bash
curl -X POST http://localhost:3000/api/crawlers/refresh
```

成功返回示例：

```json
{
  "successCount": 30,
  "failedCount": 0,
  "source": "official"
}
```

`数据来源字段说明：

| 字段值 | 含义 |
|---|---|
| `official` | 来自中国福彩网公开数据 |
| `sample-fallback` | 官方源不可用，使用本地示例数据兜底 |

### 5.3 自动刷新策略

代码入口：`src/lib/crawler.ts`

- `ensureFreshSsqData()`：页面读取数据前自动检查是否需要刷新。
- `needsRefresh()`：判断最近是否已有成功的官方刷新任务。
- 默认 TTL：1 小时。

## 6. 接口清单

| API | 方法 | 说明 |
|---|---|---|
| `/api/draws/ssq/latest` | GET | 获取最新双色球开奖 |
| `/api/predictions/ssq/generate` | POST | 生成娱乐性参考号码 |
| `/api/articles` | GET | 获取资讯摘要列表 |
| `/api/crawlers/refresh` | POST | 手动刷新双色球开奖数据 |

### 6.1 号码生成接口 示例

```bash
curl -X POST http://localhost:3000/api/predictions/ssq/generate \
  -H 'Content-Type: application/json' \
  -d '{
    "mode": "mixed",
    "count": 5,
    "historyWindow": 30,
    "constraints": {
      "sumRange": [70, 130],
      "oddEvenRatio": ["2:4", "3:3", "4:2"],
      "bigSmallRatio": ["2:4", "3:3", "4:2"],
      "allowConsecutive": true,
      "allowRepeatFromLastDraw": true
    }
  }'
```

## 7. 数据文件说明

当前本地数据文件：

```text
data/db.json
```

主要字段：

| 字段 | 说明 |
|---|---|
| `draws` | 开奖记录 |
| `prizeLevels` | 奖级分布，按 drawId 聚合 |
| `regions` | 中奖地区 |
| `stations` | 中奖站点 |
| `articles` | 资讯摘要 |
| `crawlerJobs` | 采集任务记录 |
| `dataQualityIssues` | 数据质量问题 |

如果本地数据异常，可以执行：

```bash
npm run setup
```

该命令会重置 `data/db.json`。

## 8. 验证与健康检查

### 8.1 测试

```bash
npm test
```

当前覆盖：

- 双色球号码校验
- 号码频率、遗漏、和值、比例分析
- 号码生成约束
- 官方刷新 TTL 判断

### 8.2 构建检查

```bash
npm run build
```

该命令会执行生产构建和 TypeScript 类型检查。

### 8.3 页面检查

```bash
curl -I http://localhost:3000
curl http://localhost:3000/api/draws/ssq/latest
```

预期：

- 首页返回 200
- 最新开奖接口 返回 `draw.issueNo`、`draw.redNumbers`、`draw.blueNumbers`

## 9. 常见问题

### 9.1 为什么页面没有最新数据？

可能原因：

1. 还没有调用官方数据刷新。
2. 官方源暂时不可用，系统使用了本地兜底数据。
3. 浏览器仍显示旧页面。

处理方式：

1. 打开 `/ssq/history`，点击 **刷新官方数据**。
2. 或执行：`curl -X POST http://localhost:3000/api/crawlers/refresh`。
3. 浏览器强制刷新页面。
4. 查看 `/admin/crawlers` 确认任务状态。

### 9.2 为什么没有中奖人真实信息？

这是合规设计。系统只展示公开报道中的匿名信息或摘要，不采集真实姓名、身份证、手机号等敏感信息。

### 9.3 为什么预测结果不保证中奖？

彩票开奖结果具有随机性。号码生成只是根据历史频率、遗漏、和值、奇偶比等规则生成娱乐性参考号码，不代表真实预测，也不构成购彩建议。

### 9.4 为什么没有在线购买彩票？

这是合规边界。本站不提供售彩、代购、合买、跟单、充值、提现或投注入口。

### 9.5 为什么 README 里提到 Prisma 但实际数据是 JSON？

`prisma/schema.prisma` 是后续数据库化参考。当前 最小可用版本 为了本地稳定运行使用 JSON 数据文件。线上化时建议迁移到 PostgreSQL。

## 10. 运维升级建议

如果要上线为长期服务，建议按顺序做：

1. 将 `data/db.json` 迁移到 PostgreSQL。
2. 用 Redis + BullMQ 替代页面触发式刷新。
3. 增加 cron 定时任务：开奖日 2 分钟轮询，平日 1 小时刷新。
4. 增加日志落盘和采集失败告警。
5. 增加后台登录和操作审计。
6. 新闻资讯只展示摘要和来源，不抓全文。
7. 增加 sitemap、robots.txt、结构化数据。

## 11. 文档导航

| 文档 | 说明 |
|---|---|
| `AGENTS.md` | 智能体工作指南 |
| `ARCHITECTURE.md` | 架构与模块边界 |
| `docs/product/PRD.md` | 产品需求文档 |
| `docs/technical/TECHNICAL_DESIGN.md` | 原始技术方案 |
| `docs/technical/CURRENT_IMPLEMENTATION.md` | 当前实现说明 |
| `docs/operations/RUNBOOK.md` | 运维手册 |
| `docs/operations/LOCAL_START.md` | 本地启动/停止/状态脚本说明 |
| `docs/operations/DEPLOYMENT.md` | 部署建议 |
| `docs/specs/最小可用版本_SPEC.md` | 最小可用版本 实现规格 |
| `docs/rules/COMPLIANCE.md` | 彩票合规规则 |
| `docs/rules/ENGINEERING.md` | 工程规则 |
| `docs/rules/AI_AGENT_RULES.md` | 智能体规则 |
