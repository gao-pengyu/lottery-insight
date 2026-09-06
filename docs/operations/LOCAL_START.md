# 本地启动步骤

本文档记录开发机上启动、停止、检查彩数洞察服务的标准步骤。

## 1. 一键启动

在项目根目录执行：

```bash
npm run local:start
```

等价于：

```bash
./scripts/start-local.sh
```

该脚本会自动执行：

1. 进入项目根目录。
2. 检查 3000 端口是否已有服务。
3. 执行 `npm run setup` 初始化本地数据。
4. 执行 `npm run build` 构建生产包。
5. 执行 `npm run start -- -H 0.0.0.0 -p 3000` 启动服务。
6. 将日志写到 `/tmp/lottery-insight-next.log`。
7. 将进程号写到 `/tmp/lottery-insight-next.pid`。

## 2. 访问地址

默认端口为 3000：

```text
http://localhost:3000
http://127.0.0.1:3000
```

如果要从同一局域网其他设备访问，使用开发机 IP：

```text
http://<开发机IP>:3000
```

例如：

```text
http://192.168.0.103:3000
```

## 3. 查看服务状态

```bash
npm run local:status
```

等价于：

```bash
./scripts/status-local.sh
```

该脚本会检查：

- 3000 端口是否正在监听。
- 当前监听进程。
- 首页 HTTP 状态码。
- PID 文件和日志文件位置。

## 4. 停止服务

```bash
npm run local:stop
```

等价于：

```bash
./scripts/stop-local.sh
```

该脚本会优先读取：

```text
/tmp/lottery-insight-next.pid
```

如果 PID 文件不存在，则会查找 3000 端口上的监听进程并停止。

## 5. 自定义端口

如需使用 3001 端口：

```bash
PORT=3001 npm run local:start
```

查看状态：

```bash
PORT=3001 npm run local:status
```

停止：

```bash
PORT=3001 npm run local:stop
```

## 6. 日志

默认日志文件：

```text
/tmp/lottery-insight-next.log
```

查看最近日志：

```bash
tail -n 100 /tmp/lottery-insight-next.log
```

实时查看：

```bash
tail -f /tmp/lottery-insight-next.log
```

## 7. 数据初始化和刷新

初始化本地数据：

```bash
npm run setup
```

刷新官方开奖数据：

```bash
curl -X POST http://localhost:3000/api/crawlers/refresh
```

查看最新开奖：

```bash
curl http://localhost:3000/api/draws/ssq/latest
```

## 8. 常见问题

### 8.1 访问 localhost:3000 打不开

执行：

```bash
npm run local:status
```

如果未监听，执行：

```bash
npm run local:start
```

### 8.2 端口被占用

执行：

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

如果确认是旧的彩数洞察进程：

```bash
npm run local:stop
npm run local:start
```

如果 3000 被其他服务占用：

```bash
PORT=3001 npm run local:start
```

### 8.3 数据变回示例数据

`npm run setup` 会重置 `data/db.json`。如果需要最新官方数据，启动后执行：

```bash
curl -X POST http://localhost:3000/api/crawlers/refresh
```

或在 `/ssq/history` 页面点击“刷新官方数据”。
