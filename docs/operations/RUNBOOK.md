# 运维手册 Runbook

## 1. 启动服务

```bash
cd /Users/bytedance/Documents/ChatGPT/其他/lottery-insight
npm install
npm run setup
npm run dev
```

访问：

```text
http://localhost:3000
```

## 2. 初始化数据

```bash
npm run setup
```

该命令会重置：

```text
data/db.json
```

注意：如果之前已经刷新过官方数据，执行该命令会恢复为本地示例数据。

## 3. 刷新官方开奖数据

### 3.1 页面刷新

打开：

```text
http://localhost:3000/ssq/history
```

点击：**刷新官方数据**。

### 3.2 命令行刷新

```bash
curl -X POST http://localhost:3000/api/crawlers/refresh
```

成功返回：

```json
{"successCount":30,"failedCount":0,"source":"official"}
```

## 4. 查看采集任务

页面：

```text
http://localhost:3000/admin/crawlers
```

数据文件字段：

```text
data/db.json → crawlerJobs
```

## 5. 查看数据质量问题

页面：

```text
http://localhost:3000/admin/data-quality
```

数据文件字段：

```text
data/db.json → dataQualityIssues
```

## 6. 常见问题处理

### 6.1 页面不是最新开奖

处理：

1. 点击历史页的 **刷新官方数据**。
2. 浏览器强制刷新。
3. 查看 `/admin/crawlers` 中最近任务是否 success。
4. 执行：

```bash
curl http://localhost:3000/api/draws/ssq/latest
```

### 6.2 官方源不可用

现象：

- 刷新接口返回 `source: sample-fallback`。
- 数据来源显示“本地示例数据”。

处理：

1. 稍后重试刷新。
2. 检查本机网络是否能访问 `https://www.cwl.gov.cn/`。
3. 不要手工改 `data/db.json`，除非只是临时排查。

### 6.3 页面启动失败

处理：

```bash
npm install
npm run setup
npm test
npm run build
npm run dev
```

如果端口 3000 被占用，Next.js 会提示其他端口，按终端输出访问。

### 6.4 号码生成失败

可能原因：

- 自定义约束过强。
- 必选号码和排除号码冲突。
- 和值范围过窄。

处理：

- 放宽和值范围。
- 减少必选或排除号码。
- 改用混合权重或随机均衡模式。

## 7. 发布前检查

```bash
npm test
npm run build
curl http://localhost:3000/api/draws/ssq/latest
```

人工检查页面：

- `/`
- `/ssq/history`
- `/ssq/analysis`
- `/ssq/predict`
- `/admin/crawlers`

## 8. 备份和恢复

### 8.1 备份

```bash
cp data/db.json data/db.backup.$(date +%Y%m%d%H%M%S).json
```

### 8.2 恢复

```bash
cp data/db.backup.YYYYMMDDHHMMSS.json data/db.json
```

### 8.3 重置

```bash
npm run setup
```
