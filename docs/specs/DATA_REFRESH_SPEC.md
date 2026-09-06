# 数据刷新规格

## 1. 数据源优先级

1. 中国福彩网公开双色球开奖数据。
2. 本地示例数据 `src/lib/sample-data.ts`。

## 2. 核心函数

| 函数 | 文件 | 说明 |
|---|---|---|
| `refreshSsqData()` | `src/lib/crawler.ts` | 执行一次刷新任务 |
| `upsertDraws()` | `src/lib/crawler.ts` | 写入或更新开奖数据 |
| `needsRefresh()` | `src/lib/crawler.ts` | 判断是否超过刷新 TTL |
| `ensureFreshSsqData()` | `src/lib/crawler.ts` | 页面读取数据前自动刷新 |

## 3. 校验规则

- 红球数量必须为 6。
- 红球范围必须为 1-33。
- 红球不能重复。
- 蓝球数量必须为 1。
- 蓝球范围必须为 1-16。
- 校验失败写入 `dataQualityIssues`。

## 4. 兜底规则

如果官方源请求失败、返回空、解析失败，则使用本地示例数据，并记录采集任务：

```json
{
  "source": "sample-fallback"
}
```

## 5. 页面刷新入口

- `/ssq/history` 的“刷新官方数据”按钮。
- `/admin/crawlers` 的“刷新官方数据”按钮。

## 6. 接口

```text
POST /api/crawlers/refresh
```
