#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3000}"
HOST="${HOST:-0.0.0.0}"
PID_FILE="${PID_FILE:-/tmp/lottery-insight-next.pid}"
LOG_FILE="${LOG_FILE:-/tmp/lottery-insight-next.log}"

cd "$ROOT_DIR"

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "彩数洞察已经在 $PORT 端口运行。"
  echo "本机地址：http://localhost:$PORT"
  exit 0
fi

echo "正在准备本地数据..."
npm run setup

echo "正在构建生产版本..."
npm run build

echo "正在启动彩数洞察：$HOST:$PORT ..."
nohup npm run start -- -H "$HOST" -p "$PORT" > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

sleep 2

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "彩数洞察启动成功。"
  echo "进程号文件：$PID_FILE"
  echo "日志文件：$LOG_FILE"
  echo "本机地址：http://localhost:$PORT"
else
  echo "彩数洞察启动失败。最近日志如下："
  tail -n 80 "$LOG_FILE" || true
  exit 1
fi
