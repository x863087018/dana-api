#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJ_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJ_DIR"
echo "[deploy] project: $PROJ_DIR"
if [ -f ".env" ]; then
  set -o allexport
  source <(grep -v '^\s*#' .env | sed -e 's/\r$//') || true
  set +o allexport
fi
export NODE_ENV=production
export MIDWAY_SERVER_ENV=production
export DANA_FILES_DIR="${DANA_FILES_DIR:-/root/dana-files}"
mkdir -p "$DANA_FILES_DIR"
mkdir -p /home/midway-deploy/logs || true
echo "[deploy] git pull"
git pull --rebase
echo "[deploy] npm ci/install"
npm ci || npm install
echo "[deploy] build"
npm run build
if ! command -v pm2 >/dev/null 2>&1; then
  npm i -g pm2
fi
APP_NAME="dana-api"
echo "[deploy] start/reload pm2 app: $APP_NAME"
if pm2 list | grep -q "$APP_NAME"; then
  DANA_FILES_DIR="$DANA_FILES_DIR" WX_APPID="${WX_APPID:-}" WX_SECRET="${WX_SECRET:-}" pm2 reload "$APP_NAME"
else
  DANA_FILES_DIR="$DANA_FILES_DIR" WX_APPID="${WX_APPID:-}" WX_SECRET="${WX_SECRET:-}" pm2 start ecosystem.config.js --env production
fi
pm2 save
pm2 status "$APP_NAME" || true
echo "[deploy] done"
