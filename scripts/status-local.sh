#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
LABEL="${LABEL:-com.lottery-insight.local}"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG_FILE="${LOG_FILE:-/tmp/lottery-insight-next.log}"
ERROR_LOG_FILE="${ERROR_LOG_FILE:-/tmp/lottery-insight-next.error.log}"
USER_ID="$(id -u)"

if launchctl print "gui/$USER_ID/$LABEL" >/dev/null 2>&1; then
  echo "macOS 常驻服务已加载：$LABEL"
else
  echo "macOS 常驻服务未加载：$LABEL"
fi

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
fi

echo "配置文件：$PLIST"
echo "标准日志：$LOG_FILE"
echo "错误日志：$ERROR_LOG_FILE"
