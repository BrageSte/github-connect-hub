#!/usr/bin/env bash
set -euo pipefail

if ! command -v psql >/dev/null 2>&1; then
  echo "Missing dependency: psql" >&2
  exit 1
fi

OLD_DB_URL="${OLD_DB_URL:-}"
NEW_DB_URL="${NEW_DB_URL:-}"
SAMPLE_SIZE="${SAMPLE_SIZE:-10}"

if [[ -z "$OLD_DB_URL" || -z "$NEW_DB_URL" ]]; then
  echo "OLD_DB_URL and NEW_DB_URL are required." >&2
  echo "Example: OLD_DB_URL='postgresql://...' NEW_DB_URL='postgresql://...' $0" >&2
  exit 1
fi

TABLES=(
  "public.site_settings"
  "public.orders"
  "public.order_events"
  "public.files"
  "public.checkout_sessions"
)

status=0

query_scalar() {
  local db_url="$1"
  local sql="$2"
  psql "$db_url" -Atq -v ON_ERROR_STOP=1 -c "$sql"
}

echo "== Row counts =="
for table_name in "${TABLES[@]}"; do
  old_count="$(query_scalar "$OLD_DB_URL" "SELECT COUNT(*) FROM ${table_name};")"
  new_count="$(query_scalar "$NEW_DB_URL" "SELECT COUNT(*) FROM ${table_name};")"

  if [[ "$old_count" == "$new_count" ]]; then
    echo "OK   ${table_name}: ${old_count}"
  else
    echo "FAIL ${table_name}: old=${old_count}, new=${new_count}" >&2
    status=1
  fi
done

echo
echo "== Order totals =="
old_sum="$(query_scalar "$OLD_DB_URL" "SELECT COALESCE(SUM(total_amount), 0) FROM public.orders;")"
new_sum="$(query_scalar "$NEW_DB_URL" "SELECT COALESCE(SUM(total_amount), 0) FROM public.orders;")"
old_max_prod="$(query_scalar "$OLD_DB_URL" "SELECT COALESCE(MAX(production_number), 0) FROM public.orders;")"
new_max_prod="$(query_scalar "$NEW_DB_URL" "SELECT COALESCE(MAX(production_number), 0) FROM public.orders;")"

if [[ "$old_sum" == "$new_sum" ]]; then
  echo "OK   total_amount sum: ${old_sum}"
else
  echo "FAIL total_amount sum: old=${old_sum}, new=${new_sum}" >&2
  status=1
fi

if [[ "$old_max_prod" == "$new_max_prod" ]]; then
  echo "OK   max production_number: ${old_max_prod}"
else
  echo "FAIL max production_number: old=${old_max_prod}, new=${new_max_prod}" >&2
  status=1
fi

echo
echo "== Random order sample (size=${SAMPLE_SIZE}) =="
sample_ids="$(query_scalar "$OLD_DB_URL" "SELECT id FROM public.orders ORDER BY random() LIMIT ${SAMPLE_SIZE};")"

if [[ -z "$sample_ids" ]]; then
  echo "No orders found in source project; sample validation skipped."
else
  while IFS= read -r order_id; do
    [[ -z "$order_id" ]] && continue
    found_count="$(query_scalar "$NEW_DB_URL" "SELECT COUNT(*) FROM public.orders WHERE id = '${order_id}';")"
    if [[ "$found_count" == "1" ]]; then
      echo "OK   order ${order_id}"
    else
      echo "FAIL missing order ${order_id}" >&2
      status=1
    fi
  done <<< "$sample_ids"
fi

echo
if [[ "$status" -eq 0 ]]; then
  echo "Validation passed."
else
  echo "Validation failed." >&2
fi

exit "$status"
