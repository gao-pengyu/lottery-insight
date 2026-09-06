#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
PID_FILE="${PID_FILE:-/tmp/lottery-insight-next.pid}"
LOG_FILE="${LOG_FILE:-/tmp/lottery-insight-next.log}"

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "彩数洞察正在 $PORT 端口运行。"
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN
  echo "本机地址：http://localhost:$PORT"
  if command -v curl >/dev/null 2>&1; then
    STATUS="$(curl -s -o /tmp/lottery-insight-health.html -w '%{http_code}' "http://localhost:$PORT" || true)"
    echo "首页 HTTP 状态码：$STATUS"
  fi
else
  echo "彩数洞察没有监听 $PORT 端口。"
  if [ -f "$PID_FILE" ]; then
    echo "可能存在过期进程号文件：$PID_FILE"
  fi
fi

echo "进程号文件：$PID_FILE"
echo "日志文件：$LOG_FILE"
