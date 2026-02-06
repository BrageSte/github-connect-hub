-- Adjust production_number assignment to happen at export time
-- Add exported_at and provide a safe RPC for assignment

-- Ensure sequence exists
CREATE SEQUENCE IF NOT EXISTS public.orders_production_number_seq
  START 1
  INCREMENT 1;

-- Add columns if missing
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS production_number BIGINT,
  ADD COLUMN IF NOT EXISTS exported_at TIMESTAMPTZ;

-- Drop default / NOT NULL so numbers are assigned on export
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'orders'
      AND column_name = 'production_number'
  ) THEN
    BEGIN
      ALTER TABLE public.orders
        ALTER COLUMN production_number DROP DEFAULT;
    EXCEPTION WHEN undefined_column THEN
      NULL;
    END;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'orders'
        AND column_name = 'production_number'
        AND is_nullable = 'NO'
    ) THEN
      ALTER TABLE public.orders
        ALTER COLUMN production_number DROP NOT NULL;
    END IF;
  END IF;
END $$;

-- Ensure unique constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_production_number_key'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_production_number_key UNIQUE (production_number);
  END IF;
END $$;

-- Keep sequence in sync with existing data
SELECT setval(
  'public.orders_production_number_seq',
  COALESCE((SELECT MAX(production_number) FROM public.orders), 0)
);

-- Assign production_number and exported_at atomically on export
CREATE OR REPLACE FUNCTION public.assign_production_number(order_id UUID)
RETURNS TABLE (production_number BIGINT, exported_at TIMESTAMPTZ)
LANGUAGE sql
AS $$
  WITH updated AS (
    UPDATE public.orders
    SET
      production_number = COALESCE(production_number, nextval('public.orders_production_number_seq')),
      exported_at = COALESCE(exported_at, now())
    WHERE id = order_id
      AND (production_number IS NULL OR exported_at IS NULL)
    RETURNING production_number, exported_at
  )
  SELECT production_number, exported_at FROM updated
  UNION ALL
  SELECT production_number, exported_at
  FROM public.orders
  WHERE id = order_id
  LIMIT 1;
$$;
