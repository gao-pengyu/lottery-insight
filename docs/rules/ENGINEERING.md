# 工程规则

## 1. 测试规则

修改以下文件时必须运行 `npm test`：

- `src/lib/analysis.ts`
- `src/lib/prediction.ts`
- `src/lib/crawler.ts`
- `src/lib/store.ts`
- `src/app/api/**`

修改页面或类型时必须运行：

```bash
npm run build
```

## 2. 数据规则

- 当前运行时数据源是 `data/db.json`。
- 不要手工编辑 `data/db.json` 作为长期方案。
- 重置数据用 `npm run setup`。
- 刷新官方数据用 `POST /api/crawlers/refresh`。

## 3. 页面缓存规则

开奖、历史、分析、后台页面必须保持动态读取：

```ts
export const dynamic = "force-dynamic";
```

## 4. 模块边界规则

- 页面不实现复杂算法。
- 组件不读写文件。
- `analysis.ts` 和 `prediction.ts` 保持纯函数。
- `crawler.ts` 可以访问网络和写数据。
- `store.ts` 是唯一直接读写 `data/db.json` 的模块。

## 5. 依赖规则

新增依赖前先确认是否必要。MVP 优先使用现有依赖和原生能力。
