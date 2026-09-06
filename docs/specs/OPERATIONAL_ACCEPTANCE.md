# 运维验收规格

## 1. 本地启动验收

```bash
npm install
npm run setup
npm run dev
```

验收：`http://localhost:3000` 能打开首页。

## 2. 数据刷新验收

```bash
curl -X POST http://localhost:3000/api/crawlers/refresh
curl http://localhost:3000/api/draws/ssq/latest
```

验收：最新开奖接口返回 `draw.issueNo`，且 `draw.sourceName` 为“中国福彩网”或“本地示例数据”。

## 3. 构建验收

```bash
npm test
npm run build
```

验收：两个命令均退出码为 0。

## 4. 合规验收

页面不得出现：

- 投注入口
- 代购入口
- 支付入口
- 包中/必中/稳赚承诺
