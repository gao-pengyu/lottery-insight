# 彩票信息网站技术方案文档

## 1. 技术目标

本技术方案用于支撑彩票信息网站的 V1 建设，重点实现：

1. 双色球开奖数据自动采集、校验、存储和展示。
2. 双色球历史数据分析能力。
3. 基于规则和概率的号码生成能力。
4. 彩票新闻和中奖故事自动聚合能力。
5. 基础后台管理能力。
6. 良好的 SEO、缓存、扩展性和数据质量保障。

---

## 2. 总体架构

### 2.1 架构分层

系统整体分为：

1. 数据源层
2. 数据采集层
3. 数据处理层
4. 数据存储层
5. 服务 API 层
6. 前端展示层
7. 后台管理层
8. 监控与告警层

### 2.2 架构示意

```text
外部数据源
  ├─ 中国福利彩票官网
  ├─ 中国体育彩票官网
  ├─ 地方福彩/体彩官网
  ├─ 财政部/民政部/体育总局等官方公告
  ├─ 主流新闻网站
  └─ 搜索引擎结果

数据采集层
  ├─ 开奖数据采集器
  ├─ 历史数据补全任务
  ├─ 新闻采集器
  ├─ 页面解析器
  └─ 数据源适配器

数据处理层
  ├─ 数据清洗
  ├─ 数据校验
  ├─ 多源比对
  ├─ 新闻去重
  ├─ 自动摘要
  ├─ 实体识别
  └─ 数据质量标记

数据存储层
  ├─ PostgreSQL
  ├─ Redis
  ├─ 搜索索引
  └─ 文件/对象存储

服务层
  ├─ 开奖 API
  ├─ 分析 API
  ├─ 预测 API
  ├─ 新闻 API
  └─ 后台 API

前端展示层
  ├─ 首页
  ├─ 双色球专题页
  ├─ 历史开奖页
  ├─ 数据分析页
  ├─ 号码预测页
  └─ 新闻资讯页
```

---

## 3. 推荐技术栈

### 3.1 V1 推荐方案

推荐使用：

```text
Next.js + PostgreSQL + Prisma + Redis + BullMQ + ECharts
```

### 3.2 技术选型明细

| 模块 | 技术 |
|---|---|
| 前端框架 | Next.js |
| UI 组件 | Tailwind CSS + shadcn/ui |
| 图表 | ECharts 或 Recharts |
| 地图 | ECharts 中国地图 |
| 服务端接口 | Next.js API Routes 或独立 NestJS |
| ORM | Prisma |
| 数据库 | PostgreSQL |
| 缓存 | Redis |
| 定时任务 | BullMQ |
| 页面抓取 | Playwright |
| HTML 解析 | Cheerio |
| 搜索索引 | Meilisearch，后续可换 Elasticsearch |
| 部署 | Docker Compose |
| 日志 | Pino / Winston |
| 监控 | Prometheus + Grafana，后续接入 |

### 3.3 为什么推荐该方案

1. Next.js 适合内容型网站和 SEO。
2. 前后端一体，MVP 开发效率高。
3. PostgreSQL 适合结构化开奖数据、奖级数据和新闻数据。
4. Redis + BullMQ 适合定时任务、重试和任务队列。
5. ECharts 适合号码走势、奖池走势、地区地图等图表。
6. 后续可以平滑拆分成独立的数据采集服务和分析服务。

---

## 4. 系统模块设计

## 4.1 前端模块

### 4.1.1 页面模块

前端页面包括：

| 页面 | 路径 |
|---|---|
| 首页 | / |
| 双色球专题页 | /ssq |
| 历史开奖 | /ssq/history |
| 单期开奖详情 | /ssq/draws/[issueNo] |
| 数据分析 | /ssq/analysis |
| 号码预测 | /ssq/predict |
| 新闻资讯 | /news |
| 新闻详情 | /news/[id] |
| 免责声明 | /about/disclaimer |
| 后台首页 | /admin |

### 4.1.2 前端组件

核心组件包括：

- 开奖号码组件
- 开奖卡片组件
- 历史开奖表格
- 奖级分布表格
- 号码频率图
- 遗漏走势图
- 和值走势图
- 奇偶比图表
- 大小比图表
- 地区中奖地图
- 预测规则表单
- 预测结果卡片
- 新闻卡片
- 来源标识组件
- 风险提示组件

### 4.1.3 SEO 方案

使用 Next.js 支持：

- 服务端渲染
- 静态生成
- 动态 meta
- sitemap
- robots.txt
- 结构化数据

重点 SEO 页面：

- 双色球开奖结果
- 双色球历史开奖
- 双色球第 x 期开奖详情
- 双色球走势图
- 双色球号码分析
- 双色球预测
- 彩票中奖故事
- 彩票新闻

---

## 4.2 后端 API 模块

### 4.2.1 开奖数据 API

```http
GET /api/lotteries
GET /api/draws?lottery=ssq&page=1&pageSize=50
GET /api/draws/ssq/latest
GET /api/draws/ssq/{issueNo}
```

### 4.2.2 分析 API

```http
GET /api/analysis/ssq/frequency?window=100
GET /api/analysis/ssq/omission?window=100
GET /api/analysis/ssq/hot-cold?window=100
GET /api/analysis/ssq/sum-trend?window=100
GET /api/analysis/ssq/odd-even?window=100
GET /api/analysis/ssq/big-small?window=100
GET /api/analysis/ssq/prize-trend?window=100
GET /api/analysis/ssq/region-ranking?window=365
```

### 4.2.3 预测 API

```http
POST /api/predictions/ssq/generate
GET /api/predictions/ssq/history
GET /api/predictions/ssq/{id}
```

### 4.2.4 新闻 API

```http
GET /api/articles?page=1&pageSize=20
GET /api/articles?category=winning-story
GET /api/articles?lottery=ssq
GET /api/articles/{id}
GET /api/articles/trending
```

### 4.2.5 后台管理 API

```http
GET /api/admin/crawlers/jobs
POST /api/admin/crawlers/run
GET /api/admin/data-quality/issues
POST /api/admin/data-quality/issues/{id}/resolve
GET /api/admin/articles
POST /api/admin/articles/{id}/publish
POST /api/admin/articles/{id}/hide
POST /api/admin/articles/{id}/merge
```

---

## 5. 数据库设计

## 5.1 lottery_type：彩票类型表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | varchar | 主键 |
| code | varchar | 彩种编码，如 ssq |
| name | varchar | 彩种名称 |
| category | varchar | 福彩或体彩 |
| status | varchar | 启用或停用 |
| official_url | text | 官方地址 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

---

## 5.2 draw_result：开奖记录表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | uuid | 主键 |
| lottery_type_id | varchar | 彩种 ID |
| issue_no | varchar | 期号 |
| draw_date | date | 开奖日期 |
| red_numbers | int[] | 双色球红球 |
| blue_numbers | int[] | 双色球蓝球 |
| front_numbers | int[] | 大乐透前区 |
| back_numbers | int[] | 大乐透后区 |
| sales_amount | numeric | 销售金额 |
| pool_amount | numeric | 奖池金额 |
| source_name | varchar | 来源名称 |
| source_url | text | 来源地址 |
| fetched_at | timestamp | 抓取时间 |
| verified_status | varchar | 校验状态 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

唯一索引：

```text
lottery_type_id + issue_no
```

---

## 5.3 prize_level：奖级表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | uuid | 主键 |
| draw_result_id | uuid | 开奖记录 ID |
| level | varchar | 奖级 |
| winning_count | int | 中奖注数 |
| prize_amount | numeric | 单注奖金 |
| total_amount | numeric | 总奖金 |
| created_at | timestamp | 创建时间 |

---

## 5.4 winning_region：中奖地区表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | uuid | 主键 |
| draw_result_id | uuid | 开奖记录 ID |
| province | varchar | 省份 |
| city | varchar | 城市 |
| winning_count | int | 中奖注数 |
| amount | numeric | 金额 |
| source_url | text | 来源 |
| created_at | timestamp | 创建时间 |

---

## 5.5 winning_station：中奖站点表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | uuid | 主键 |
| draw_result_id | uuid | 开奖记录 ID |
| station_no | varchar | 站点编号 |
| province | varchar | 省份 |
| city | varchar | 城市 |
| district | varchar | 区县 |
| address | text | 地址 |
| amount | numeric | 中奖金额 |
| article_id | uuid | 关联文章 |
| source_url | text | 来源 |
| created_at | timestamp | 创建时间 |

---

## 5.6 article：文章资讯表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | uuid | 主键 |
| title | varchar | 标题 |
| summary | text | 摘要 |
| content_hash | varchar | 内容 hash |
| source_name | varchar | 来源名称 |
| source_url | text | 原文链接 |
| published_at | timestamp | 发布时间 |
| fetched_at | timestamp | 抓取时间 |
| category | varchar | 分类 |
| lottery_type_id | varchar | 关联彩种 |
| issue_no | varchar | 关联期号 |
| province | varchar | 关联地区 |
| city | varchar | 关联城市 |
| amount_text | varchar | 金额文本 |
| credibility | varchar | 可信度 |
| status | varchar | 草稿、已发布、已隐藏 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

索引：

```text
source_url
content_hash
category
lottery_type_id
published_at
```

---

## 5.7 prediction_record：预测记录表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | uuid | 主键 |
| lottery_type_id | varchar | 彩种 ID |
| target_issue_no | varchar | 目标期号 |
| mode | varchar | 预测模式 |
| rules_json | jsonb | 规则配置 |
| numbers_json | jsonb | 生成号码 |
| score | numeric | 模型评分 |
| explanation | text | 解释 |
| hit_result_json | jsonb | 开奖后命中结果 |
| created_at | timestamp | 创建时间 |

---

## 5.8 crawler_job：采集任务表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | uuid | 主键 |
| job_type | varchar | 任务类型 |
| source_name | varchar | 数据源名称 |
| status | varchar | 状态 |
| started_at | timestamp | 开始时间 |
| finished_at | timestamp | 结束时间 |
| success_count | int | 成功数量 |
| failed_count | int | 失败数量 |
| error_message | text | 错误信息 |
| created_at | timestamp | 创建时间 |

---

## 5.9 data_quality_issue：数据质量问题表

| 字段 | 类型 | 说明 |
|---|---|---|
| id | uuid | 主键 |
| issue_type | varchar | 问题类型 |
| entity_type | varchar | 实体类型 |
| entity_id | varchar | 实体 ID |
| description | text | 问题描述 |
| severity | varchar | 严重等级 |
| status | varchar | 待处理、已处理、忽略 |
| created_at | timestamp | 创建时间 |
| resolved_at | timestamp | 处理时间 |

---

## 6. 数据采集方案

## 6.1 开奖数据采集

### 6.1.1 数据来源优先级

优先级：

1. 中国福利彩票官方网站
2. 中国体育彩票官方网站
3. 各省福彩、体彩官方网站
4. 可信第三方数据站
5. 新闻报道补充信息

官方数据优先级最高。第三方来源仅作为补充和比对。

### 6.1.2 采集频率

| 任务 | 频率 |
|---|---|
| 最新开奖检查 | 每 10 分钟 |
| 开奖日加密轮询 | 每 2 分钟，持续 2 小时 |
| 历史数据补全 | 每日凌晨 |
| 奖级数据补全 | 开奖后每 10 分钟重试 |
| 地区中奖数据补全 | 每日 2 次 |
| 投注站点新闻补全 | 每日 2 次 |

### 6.1.3 数据校验规则

双色球数据校验：

- 期号不能为空
- 开奖日期不能为空
- 红球数量必须为 6
- 红球范围必须是 1–33
- 红球不能重复
- 蓝球数量必须为 1
- 蓝球范围必须是 1–16
- 销售金额不能为负数
- 奖池金额不能为负数
- 奖级注数不能为负数
- 来源链接不能为空

### 6.1.4 多源比对逻辑

处理规则：

1. 已验证官方数据不被第三方数据覆盖。
2. 第三方数据可补充缺失字段。
3. 多源号码不一致时，标记为严重异常。
4. 奖金、销售额、奖池不一致时，标记为普通异常。
5. 异常数据进入后台审核队列。

---

## 6.2 新闻采集

### 6.2.1 关键词策略

基础关键词：

- 双色球 开奖
- 双色球 一等奖
- 双色球 中奖者
- 双色球 奖池
- 双色球 中奖站点
- 福彩 开奖公告
- 福彩 中奖故事
- 大乐透 一等奖
- 大乐透 中奖者
- 体彩 中奖故事
- 彩票 防诈骗
- 彩票 政策 公告

### 6.2.2 采集流程

```text
生成关键词任务
  ↓
搜索候选文章
  ↓
抓取页面内容
  ↓
提取标题、摘要、发布时间、来源
  ↓
正文清洗
  ↓
去重
  ↓
分类
  ↓
实体识别
  ↓
可信度标记
  ↓
入库
  ↓
前台展示
```

### 6.2.3 去重策略

使用多层去重：

1. URL 去重
2. 标题完全匹配去重
3. 标题相似度去重
4. 正文 hash 去重
5. 同一事件聚合

### 6.2.4 分类策略

文章分类：

- 开奖公告
- 中奖故事
- 政策公告
- 彩票趣闻
- 数据榜单
- 风险提示
- 防诈骗内容

### 6.2.5 实体识别

需要识别：

- 彩种
- 期号
- 省份
- 城市
- 中奖金额
- 投注站点
- 中奖人匿名称呼
- 发布时间

### 6.2.6 可信度标记

| 可信度 | 说明 |
|---|---|
| 官方 | 官方彩票中心、政府网站 |
| 主流媒体 | 主流新闻媒体 |
| 地方媒体 | 地方新闻网站 |
| 普通转载 | 聚合站或转载站 |
| 未知 | 来源不明确 |

---

## 7. 数据分析方案

## 7.1 分析数据生成方式

分析结果可以采用两种方式：

1. 实时查询计算
2. 定时预计算后缓存

V1 推荐：

- 高频页面使用预计算 + Redis 缓存
- 低频自定义筛选使用实时计算

### 7.1.1 预计算任务

每日或每次开奖后生成：

- 最近 30 期分析
- 最近 50 期分析
- 最近 100 期分析
- 全历史分析
- 奖池走势
- 销售额走势
- 热号榜
- 冷号榜
- 遗漏榜

---

## 7.2 号码频率计算

红球频率：

```text
某个红球出现次数 / 统计期数
```

蓝球频率：

```text
某个蓝球出现次数 / 统计期数
```

输出：

- 号码
- 出现次数
- 出现比例
- 最近出现期号
- 最近出现日期

---

## 7.3 遗漏计算

当前遗漏：

```text
当前最新期号之前，某号码连续未出现的期数
```

最大遗漏：

```text
历史上某号码连续未出现的最大期数
```

平均遗漏：

```text
该号码两次出现之间的平均间隔
```

---

## 7.4 冷热号计算

以最近 N 期为周期。

平均出现次数：

```text
红球理论平均出现次数 = N * 6 / 33
蓝球理论平均出现次数 = N * 1 / 16
```

可定义：

- 出现次数高于平均值一定比例：热号
- 接近平均值：温号
- 低于平均值或遗漏较长：冷号

---

## 7.5 和值计算

红球和值：

```text
sum(red_numbers)
```

输出：

- 当期和值
- 最近 N 期平均和值
- 历史最大和值
- 历史最小和值
- 和值区间分布

---

## 7.6 奇偶比计算

```text
奇数数量 : 偶数数量
```

例如：

```text
[3, 8, 12, 19, 24, 31]
奇数：3、19、31
偶数：8、12、24
奇偶比：3:3
```

---

## 7.7 大小比计算

双色球红球默认：

- 小号：1–16
- 大号：17–33

```text
小号数量 : 大号数量
```

---

## 7.8 区间分布计算

双色球红球默认三区：

- 一区：1–11
- 二区：12–22
- 三区：23–33

输出：

```text
一区数量 - 二区数量 - 三区数量
```

例如：

```text
2-2-2
1-3-2
3-1-2
```

---

## 7.9 连号计算

如果红球排序后存在相邻号码差值为 1，则存在连号。

例如：

```text
[3, 8, 12, 13, 24, 31]
存在连号：12-13
```

---

## 7.10 重号计算

与上一期开奖红球求交集：

```text
current.red_numbers ∩ previous.red_numbers
```

输出：

- 重号数量
- 重号号码
- 蓝球是否重复

---

## 8. 号码生成算法方案

## 8.1 设计原则

1. 号码生成是娱乐性工具。
2. 不声称能预测真实中奖号码。
3. 所有结果必须给出规则解释。
4. 生成过程可复现。
5. 支持用户自定义约束。
6. 避免生成极端异常组合。

---

## 8.2 输入参数

示例：

```json
{
  "lotteryType": "ssq",
  "mode": "mixed",
  "historyWindow": 100,
  "count": 5,
  "constraints": {
    "oddEvenRatio": ["3:3", "4:2", "2:4"],
    "bigSmallRatio": ["3:3", "4:2", "2:4"],
    "sumRange": [70, 130],
    "allowConsecutive": true,
    "excludeNumbers": [],
    "mustIncludeNumbers": []
  }
}
```

---

## 8.3 输出结果

示例：

```json
{
  "targetIssueNo": "2026100",
  "results": [
    {
      "red": [3, 8, 12, 19, 24, 31],
      "blue": [9],
      "score": 82.5,
      "features": {
        "sum": 97,
        "oddEvenRatio": "3:3",
        "bigSmallRatio": "3:3",
        "zoneRatio": "2-2-2",
        "hasConsecutive": false
      },
      "reason": "该组合和值为 97，奇偶比 3:3，大小比 3:3，符合最近 100 期常见分布。"
    }
  ]
}
```

---

## 8.4 模式一：随机均衡

流程：

1. 随机生成红球 6 个。
2. 随机生成蓝球 1 个。
3. 校验红球是否重复。
4. 校验和值、奇偶比、大小比。
5. 不满足条件则重试。
6. 返回符合约束的号码。

---

## 8.5 模式二：热号优先

流程：

1. 获取最近 N 期历史数据。
2. 计算每个号码出现频率。
3. 根据频率生成权重。
4. 按权重抽取号码。
5. 校验约束。
6. 返回结果。

---

## 8.6 模式三：冷号回补

流程：

1. 获取最近 N 期历史数据。
2. 计算当前遗漏期数。
3. 遗漏期数越长，权重越高。
4. 排除长期极端异常号码。
5. 按权重抽取号码。
6. 校验约束。
7. 返回结果。

---

## 8.7 模式四：混合权重

默认评分因子：

| 因子 | 权重 |
|---|---:|
| 最近频率 | 30% |
| 全历史频率 | 20% |
| 当前遗漏 | 20% |
| 奇偶平衡 | 10% |
| 大小平衡 | 10% |
| 和值合理性 | 10% |

最终得分：

```text
score =
  recent_frequency_score * 0.3 +
  all_time_frequency_score * 0.2 +
  omission_score * 0.2 +
  odd_even_score * 0.1 +
  big_small_score * 0.1 +
  sum_score * 0.1
```

---

## 8.8 模式五：自定义规则

用户可配置：

```json
{
  "mustIncludeRed": [6, 8],
  "excludeRed": [13, 14],
  "mustIncludeBlue": [],
  "excludeBlue": [4],
  "sumRange": [70, 130],
  "oddEvenRatio": ["3:3"],
  "bigSmallRatio": ["3:3", "4:2"],
  "allowConsecutive": true,
  "allowRepeatFromLastDraw": true,
  "hotCount": 2,
  "warmCount": 2,
  "coldCount": 2
}
```

---

## 8.9 生成保护

为避免死循环：

- 每次生成最多尝试 1000 次
- 约束过强时返回提示
- 告诉用户哪些条件导致无法生成
- 支持一键放宽条件

---

## 9. 缓存方案

## 9.1 Redis 缓存

| 数据 | 缓存时间 |
|---|---:|
| 最新开奖 | 1–5 分钟 |
| 历史开奖列表 | 1 小时 |
| 单期开奖详情 | 1 天 |
| 已验证开奖详情 | 长期缓存 |
| 分析结果 | 10 分钟到 1 小时 |
| 新闻列表 | 10 分钟 |
| 首页数据 | 5 分钟 |

## 9.2 缓存刷新

触发条件：

- 新期开奖数据入库
- 奖级数据更新
- 新闻数据更新
- 后台手动刷新
- 数据异常修复

---

## 10. 定时任务设计

## 10.1 任务列表

| 任务 | 频率 |
|---|---|
| fetch-latest-ssq-draw | 每 10 分钟 |
| fetch-latest-ssq-draw-fast | 开奖日每 2 分钟 |
| backfill-ssq-history | 每日凌晨 |
| fetch-prize-detail | 开奖后重试 |
| fetch-winning-region | 每日 2 次 |
| fetch-news | 每日 3 次 |
| compute-analysis | 每次开奖后 |
| check-data-quality | 每日 1 次 |
| update-prediction-hit-result | 开奖后执行 |

---

## 10.2 任务状态

任务状态包括：

- pending
- running
- success
- failed
- retrying
- skipped

失败任务需要记录：

- 任务名称
- 数据源
- 请求地址
- 错误原因
- 堆栈信息
- 重试次数
- 下次重试时间

---

## 11. 数据质量方案

## 11.1 数据质量检查项

### 开奖数据

检查：

- 期号是否连续
- 号码格式是否正确
- 是否缺失奖级
- 奖池金额是否异常
- 销售金额是否异常
- 数据来源是否缺失
- 多源数据是否冲突

### 新闻数据

检查：

- 标题是否为空
- 来源是否为空
- URL 是否重复
- 摘要是否为空
- 分类是否缺失
- 是否包含违规关键词

---

## 11.2 异常等级

| 等级 | 说明 |
|---|---|
| P0 | 开奖号码冲突、核心数据错误 |
| P1 | 奖级金额异常、销售额异常 |
| P2 | 新闻重复、分类错误 |
| P3 | 摘要缺失、标签缺失 |

---

## 11.3 异常处理

流程：

```text
发现异常
  ↓
写入 data_quality_issue
  ↓
后台展示
  ↓
人工审核或自动修复
  ↓
更新状态
  ↓
刷新缓存
```

---

## 12. 安全与合规技术方案

## 12.1 功能限制

技术层面不提供：

- 支付接口
- 下单接口
- 投注接口
- 代购接口
- 用户资金账户
- 提现接口

## 12.2 敏感词过滤

需要过滤的高风险词：

- 必中
- 包中
- 稳赚
- 内部号
- 专家带单
- 扫码投注
- 代买
- 返利
- 高回报
- 赌博
- 博彩平台

## 12.3 内容安全

新闻入库前需要经过：

1. URL 去重
2. 来源检查
3. 敏感词检测
4. 摘要生成
5. 分类判断
6. 可信度标记

高风险内容默认不自动发布，进入后台审核。

---

## 13. 日志与监控

## 13.1 日志类型

记录：

- API 请求日志
- 爬虫任务日志
- 数据校验日志
- 新闻处理日志
- 预测生成日志
- 后台操作日志
- 异常日志

## 13.2 监控指标

关注：

- API 响应时间
- API 错误率
- 抓取成功率
- 抓取失败次数
- 数据更新延迟
- Redis 命中率
- 数据库慢查询
- 新闻入库数量
- 预测接口调用次数

## 13.3 告警条件

触发告警：

- 开奖数据超过预期时间未更新
- 官方数据源连续抓取失败
- 核心 API 错误率升高
- 数据库连接异常
- 任务队列积压
- 多源开奖数据冲突

---

## 14. 部署方案

## 14.1 MVP 部署

推荐 Docker Compose：

```text
app
postgres
redis
worker
meilisearch
nginx
```

### 服务说明

| 服务 | 说明 |
|---|---|
| app | Next.js Web 和 API |
| worker | 定时任务和采集任务 |
| postgres | 主数据库 |
| redis | 缓存和任务队列 |
| meilisearch | 新闻搜索 |
| nginx | 反向代理 |

---

## 14.2 目录结构建议

```text
lottery-insight/
  apps/
    web/
      app/
      components/
      lib/
      api/
  packages/
    crawler/
    analysis/
    prediction/
    shared/
  prisma/
    schema.prisma
    migrations/
  workers/
    jobs/
    processors/
  docs/
    prd.md
    technical-design.md
  docker-compose.yml
  README.md
```

---

## 15. 开发里程碑

## 15.1 阶段一：数据基础

目标：

- 建立数据库
- 接入双色球数据
- 实现定时抓取
- 实现基础 API

任务：

1. 初始化项目
2. 设计 Prisma schema
3. 建立 PostgreSQL
4. 实现双色球采集器
5. 实现数据校验
6. 实现最新开奖 API
7. 实现历史开奖 API

预计周期：1–2 周

---

## 15.2 阶段二：前台展示

目标：

- 用户可以浏览开奖和基础分析。

任务：

1. 首页
2. 双色球专题页
3. 历史开奖页
4. 单期开奖详情页
5. 基础图表组件
6. 奖金走势图
7. 号码频率图

预计周期：1–2 周

---

## 15.3 阶段三：分析与预测

目标：

- 实现基础分析和娱乐性号码生成。

任务：

1. 频率分析
2. 遗漏分析
3. 冷热号分析
4. 和值分析
5. 奇偶比分析
6. 大小比分析
7. 随机均衡生成
8. 热号优先生成
9. 冷号回补生成
10. 混合权重生成
11. 自定义规则生成

预计周期：1 周

---

## 15.4 阶段四：新闻聚合

目标：

- 自动聚合彩票资讯和中奖故事。

任务：

1. 关键词任务
2. 新闻抓取
3. 正文提取
4. 去重
5. 分类
6. 摘要
7. 入库
8. 新闻列表页
9. 新闻详情页

预计周期：1–2 周

---

## 15.5 阶段五：后台与质量保障

目标：

- 建立基础运营和质量保障能力。

任务：

1. 后台首页
2. 采集任务管理
3. 数据质量审核
4. 新闻管理
5. 手动重跑任务
6. 缓存刷新
7. 基础监控
8. 告警机制

预计周期：1 周

---

## 16. 测试方案

## 16.1 单元测试

覆盖：

- 双色球号码校验
- 开奖数据解析
- 奖级数据解析
- 频率计算
- 遗漏计算
- 和值计算
- 奇偶比计算
- 大小比计算
- 预测规则引擎

## 16.2 集成测试

覆盖：

- 抓取任务到数据库入库
- 数据入库后刷新缓存
- 最新开奖 API
- 历史开奖 API
- 分析 API
- 预测 API
- 新闻采集到展示

## 16.3 端到端测试

覆盖用户路径：

1. 访问首页并查看最新开奖。
2. 进入双色球历史开奖页。
3. 搜索指定期号。
4. 查看单期开奖详情。
5. 进入数据分析页查看图表。
6. 使用号码生成工具生成号码。
7. 查看新闻详情。

## 16.4 数据质量测试

测试：

- 错误号码能否被拦截
- 缺失奖级能否被标记
- 多源冲突能否进入审核
- 重复新闻能否去重
- 敏感内容能否被过滤

---

## 17. 性能目标

### 17.1 页面性能

| 页面 | 目标 |
|---|---|
| 首页 | 首屏小于 2 秒 |
| 历史开奖页 | 小于 2 秒 |
| 开奖详情页 | 小于 1.5 秒 |
| 分析页 | 小于 3 秒 |
| 预测页 | 小于 2 秒 |

### 17.2 API 性能

| API | 目标 |
|---|---|
| 最新开奖 API | 小于 200ms |
| 历史开奖 API | 小于 500ms |
| 单期开奖 API | 小于 300ms |
| 分析 API | 小于 800ms |
| 预测 API | 小于 1s |
| 新闻列表 API | 小于 500ms |

---

## 18. 扩展规划

### 18.1 彩种扩展

后续支持：

- 超级大乐透
- 福彩 3D
- 排列 3
- 排列 5
- 七乐彩
- 7 星彩

### 18.2 分析能力扩展

后续支持：

- 历史相似号码
- 组合形态分析
- 跨期趋势分析
- 奖池周期分析
- 省市中奖概率展示
- 投注站点长期榜单

### 18.3 用户能力扩展

后续支持：

- 用户登录
- 收藏号码
- 保存自定义规则
- 开奖提醒
- 历史预测回看
- 个性化首页

---

## 19. 关键风险与技术应对

### 19.1 数据源变动

风险：

- 官方页面结构变化导致采集失败。

应对：

- 数据源适配器独立封装
- 每个来源单独测试
- 抓取失败告警
- 多源补充
- 后台手动修复

### 19.2 数据延迟

风险：

- 开奖后官方数据发布延迟。

应对：

- 开奖日加密轮询
- 明确展示更新时间
- 数据未确认时标记“待确认”
- 官方确认后再标记“已验证”

### 19.3 新闻版权

风险：

- 抓取全文可能有版权问题。

应对：

- 只展示摘要
- 标注来源
- 跳转原文
- 不大段复制正文
- 支持内容下架

### 19.4 预测误导

风险：

- 用户误解为真实预测。

应对：

- 强制展示免责声明
- 不使用“必中”等词
- 不提供付费预测
- 不接入售彩能力
- 所有结果说明为规则生成

---

## 20. 推荐实施顺序

建议优先实施顺序：

1. 双色球数据模型
2. 双色球历史数据采集
3. 最新开奖 API
4. 历史开奖页
5. 单期开奖详情页
6. 基础分析 API
7. 数据分析页面
8. 号码生成 API
9. 号码预测页面
10. 新闻采集
11. 新闻页面
12. 后台任务监控
13. 数据质量审核
14. 缓存和监控优化

第一版不要过早做用户系统、付费功能和复杂社区功能，先把双色球的数据闭环、内容闭环和 SEO 页面做扎实。
