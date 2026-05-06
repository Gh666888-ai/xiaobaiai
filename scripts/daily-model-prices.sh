#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/xiaobaiai}"
PM2_APP="${PM2_APP:-xiaobaiai}"

cd "$APP_DIR"

echo "[daily-model-prices] $(date '+%F %T') start"
git pull --ff-only
npm run update:model-prices
npm run build
pm2 restart "$PM2_APP"
echo "[daily-model-prices] $(date '+%F %T') done"
