# 部署建议

## 1. 最小可用版本 本地部署

当前 最小可用版本 推荐作为本地应用运行：

```bash
npm install
npm run setup
npm run dev
```

如果要用生产构建运行：

```bash
npm run build
npm run start
```

## 2. 生产化目标架构

建议线上版本采用：

```text
Next.js Web/API
  + PostgreSQL
  + Redis
  + BullMQ Worker
  + Nginx
  + 日志与告警
```

## 3. 生产化改造清单

| 优先级 | 改造项 | 说明 |
|---|---|---|
| P0 | JSON 数据文件 → PostgreSQL | 避免并发写文件风险 |
| P0 | 定时任务 Worker | 不依赖页面访问触发刷新 |
| P0 | 后台登录 | 防止公开触发采集或查看后台 |
| P1 | 日志落盘 | 采集失败、接口错误可追踪 |
| P1 | 告警 | 开奖后超时未更新提醒 |
| P1 | 数据源多路兜底 | 官方源变化时保持可用 |
| P2 | CDN/缓存 | 提升内容页访问速度 |
| P2 | SEO | sitemap、robots、结构化数据 |

## 4. 环境变量建议

未来生产环境建议增加：

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
CRAWLER_TTL_MS=3600000
ADMIN_PASSWORD=...
```

当前 最小可用版本 暂不依赖这些变量。

## 5. 安全注意事项

- 后台页面上线前必须加登录鉴权。
- `/api/crawlers/refresh` 上线前必须加鉴权或内网限制。
- 不允许接入支付、下注、代购相关接口。
- 不允许接入非法彩票网站广告。
- 所有预测页面必须保留免责声明。
