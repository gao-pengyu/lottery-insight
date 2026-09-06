#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
PID_FILE="${PID_FILE:-/tmp/lottery-insight-next.pid}"

if [ -f "$PID_FILE" ]; then
  PID="$(cat "$PID_FILE")"
  if ps -p "$PID" >/dev/null 2>&1; then
    echo "正在停止彩数洞察进程 $PID ..."
    kill "$PID"
    rm -f "$PID_FILE"
    exit 0
  fi
fi

PID_BY_PORT="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | head -n 1 || true)"
if [ -n "$PID_BY_PORT" ]; then
  echo "正在停止监听 $PORT 端口的进程 $PID_BY_PORT ..."
  kill "$PID_BY_PORT"
  rm -f "$PID_FILE"
  exit 0
fi

echo "彩数洞察当前没有在 $PORT 端口运行。"
