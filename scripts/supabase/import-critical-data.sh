#!/usr/bin/env bash
set -euo pipefail

if ! command -v psql >/dev/null 2>&1; then
  echo "Missing dependency: psql" >&2
  exit 1
fi

NEW_DB_URL="${NEW_DB_URL:-}"
INPUT_FILE="${1:-${INPUT_FILE:-}}"

if [[ -z "$NEW_DB_URL" ]]; then
  echo "NEW_DB_URL is required." >&2
  echo "Example: NEW_DB_URL='postgresql://...' $0 tmp/data_migration.sql" >&2
  exit 1
fi

if [[ -z "$INPUT_FILE" || ! -f "$INPUT_FILE" ]]; then
  echo "Input SQL file is required and must exist." >&2
  echo "Example: $0 tmp/data_migration.sql" >&2
  exit 1
fi

psql "$NEW_DB_URL" -v ON_ERROR_STOP=1 -f "$INPUT_FILE"

psql "$NEW_DB_URL" -v ON_ERROR_STOP=1 <<'SQL'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'S'
      AND c.relname = 'orders_production_number_seq'
      AND n.nspname = 'public'
  ) THEN
    PERFORM (
      WITH max_val AS (
        SELECT MAX(production_number) AS v FROM public.orders
      )
      SELECT setval(
        'public.orders_production_number_seq',
        COALESCE(v, 1),
        v IS NOT NULL
      )
      FROM max_val
    );
  END IF;
END
$$;
SQL

echo "Import completed and production-number sequence synchronized."
