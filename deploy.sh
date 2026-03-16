#!/usr/bin/env bash
set -euo pipefail
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR"
if [ -f ".env" ]; then
  set -o allexport
  source <(grep -v '^\s*#' .env | sed -e 's/\r$//') || true
  set +o allexport
fi
REPO_URL="${REPO_URL:-git@github.com:x863087018/dana-api.git}"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  CURRENT_URL="$(git remote get-url origin || true)"
  if [ -z "$CURRENT_URL" ]; then
    git remote add origin "$REPO_URL"
  elif [ "$CURRENT_URL" != "$REPO_URL" ]; then
    git remote set-url origin "$REPO_URL"
  fi
else
  echo "当前目录不是 Git 仓库，请手动 git clone $REPO_URL 到此目录后再执行。"
  exit 1
fi
git fetch origin --tags
UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"
if [ -n "$UPSTREAM" ]; then
  BRANCH="${UPSTREAM#origin/}"
else
  if git show-ref --quiet refs/remotes/origin/main; then BRANCH="main"
  elif git show-ref --quiet refs/remotes/origin/master; then BRANCH="master"
  else BRANCH="$(git branch -r | sed -n 's|  origin/||p' | head -1)"; fi
fi
if [ -z "$BRANCH" ]; then
  echo "无法确定分支，请手动设置 BRANCH 环境变量后重试。"
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  git stash push -u -m "deploy-$(date +%s)" || true
fi
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
# 安装依赖：如果有 lockfile 用 ci，否则用 install
if [ -f "package-lock.json" ] || [ -f "npm-shrinkwrap.json" ]; then
  echo "use npm ci"
  npm ci
else
  echo "use npm install"
  npm install
fi
npm run build
export NODE_ENV=production
export MIDWAY_SERVER_ENV=production
export DANA_FILES_DIR="${DANA_FILES_DIR:-/root/dana-files}"
mkdir -p "$DANA_FILES_DIR"
if ! command -v pm2 >/dev/null 2>&1; then
  npm i -g pm2
fi
APP_NAME="dana-api"
if pm2 list | grep -q "$APP_NAME"; then
  DANA_FILES_DIR="$DANA_FILES_DIR" WX_APPID="${WX_APPID:-}" WX_SECRET="${WX_SECRET:-}" pm2 reload "$APP_NAME"
else
  DANA_FILES_DIR="$DANA_FILES_DIR" WX_APPID="${WX_APPID:-}" WX_SECRET="${WX_SECRET:-}" pm2 start ecosystem.config.js --env production
fi
pm2 save
pm2 status "$APP_NAME" || true
echo "deploy done"
