#!/usr/bin/env bash
set -euo pipefail

APP_URL="${APP_URL:-https://xiaobaiai.cn}"
CRON_SECRET="${WORKFLOW_CRON_SECRET:-}"

if [ -z "$CRON_SECRET" ]; then
  echo "[workflows-cron] WORKFLOW_CRON_SECRET is empty; set it in cron env or .env.local"
  exit 1
fi

curl -fsS -X POST "$APP_URL/api/workflows/cron" \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: $CRON_SECRET"

echo
echo "[workflows-cron] done"
