#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
LABEL="${LABEL:-com.lottery-insight.local}"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
USER_ID="$(id -u)"

if [ -f "$PLIST" ]; then
  echo "正在停止 macOS 常驻服务：$LABEL ..."
  launchctl bootout "gui/$USER_ID" "$PLIST" >/dev/null 2>&1 || true
fi

PID_BY_PORT="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | head -n 1 || true)"
if [ -n "$PID_BY_PORT" ]; then
  echo "正在停止监听 $PORT 端口的进程 $PID_BY_PORT ..."
  kill "$PID_BY_PORT" || true
fi

echo "彩数洞察已停止。"
