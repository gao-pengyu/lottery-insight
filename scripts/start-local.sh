#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3000}"
HOST="${HOST:-0.0.0.0}"
LABEL="${LABEL:-com.lottery-insight.local}"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG_FILE="${LOG_FILE:-/tmp/lottery-insight-next.log}"
ERROR_LOG_FILE="${ERROR_LOG_FILE:-/tmp/lottery-insight-next.error.log}"
NODE_BIN_DIR="$(dirname "$(command -v node)")"
NODE_BIN="$(command -v node)"
NEXT_BIN="$ROOT_DIR/node_modules/next/dist/bin/next"
USER_ID="$(id -u)"

cd "$ROOT_DIR"
mkdir -p "$HOME/Library/LaunchAgents"

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "彩数洞察已经在 $PORT 端口运行。"
  echo "本机地址：http://localhost:$PORT"
  exit 0
fi

echo "正在准备本地数据..."
npm run setup

echo "正在构建生产版本..."
npm run build

echo "正在写入 macOS 常驻服务配置：$PLIST"
cat > "$PLIST" <<PLIST_EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>WorkingDirectory</key>
  <string>$ROOT_DIR</string>
  <key>ProgramArguments</key>
  <array>
    <string>$NODE_BIN</string>
    <string>$NEXT_BIN</string>
    <string>start</string>
    <string>-H</string>
    <string>$HOST</string>
    <string>-p</string>
    <string>$PORT</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>$NODE_BIN_DIR:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    <key>NODE_ENV</key>
    <string>production</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$LOG_FILE</string>
  <key>StandardErrorPath</key>
  <string>$ERROR_LOG_FILE</string>
</dict>
</plist>
PLIST_EOF

launchctl bootout "gui/$USER_ID" "$PLIST" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$USER_ID" "$PLIST"
launchctl kickstart -k "gui/$USER_ID/$LABEL" >/dev/null 2>&1 || true

for _ in $(seq 1 10); do
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "彩数洞察启动成功，并已交给 macOS 常驻管理。"
    echo "本机地址：http://localhost:$PORT"
    echo "服务标识：$LABEL"
    echo "配置文件：$PLIST"
    echo "标准日志：$LOG_FILE"
    echo "错误日志：$ERROR_LOG_FILE"
    exit 0
  fi
  sleep 1
done

echo "彩数洞察启动失败。最近标准日志："
tail -n 80 "$LOG_FILE" || true
echo "最近错误日志："
tail -n 80 "$ERROR_LOG_FILE" || true
exit 1
