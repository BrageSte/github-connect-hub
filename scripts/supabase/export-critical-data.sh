#!/usr/bin/env bash
set -euo pipefail

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "Missing dependency: pg_dump" >&2
  exit 1
fi

OLD_DB_URL="${OLD_DB_URL:-}"
OUTPUT_FILE="${1:-${OUTPUT_FILE:-tmp/data_migration_$(date +%Y%m%d_%H%M%S).sql}}"

if [[ -z "$OLD_DB_URL" ]]; then
  echo "OLD_DB_URL is required." >&2
  echo "Example: OLD_DB_URL='postgresql://...' $0" >&2
  exit 1
fi

TABLES=(
  "public.site_settings"
  "public.orders"
  "public.order_events"
  "public.files"
  "public.checkout_sessions"
)

TABLE_ARGS=()
for table_name in "${TABLES[@]}"; do
  TABLE_ARGS+=("--table=${table_name}")
done

mkdir -p "$(dirname "$OUTPUT_FILE")"

pg_dump "$OLD_DB_URL" \
  --data-only \
  --column-inserts \
  --no-owner \
  --no-privileges \
  "${TABLE_ARGS[@]}" \
  > "$OUTPUT_FILE"

echo "Export completed: $OUTPUT_FILE"
