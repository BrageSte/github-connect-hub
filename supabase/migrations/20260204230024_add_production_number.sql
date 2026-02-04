-- Add production number to orders
CREATE SEQUENCE IF NOT EXISTS public.orders_production_number_seq
  START 1
  INCREMENT 1;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS production_number INTEGER;

ALTER TABLE public.orders
  ALTER COLUMN production_number SET DEFAULT nextval('public.orders_production_number_seq');

UPDATE public.orders
SET production_number = nextval('public.orders_production_number_seq')
WHERE production_number IS NULL;

ALTER SEQUENCE public.orders_production_number_seq OWNED BY public.orders.production_number;

ALTER TABLE public.orders
  ALTER COLUMN production_number SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_production_number_key'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_production_number_key UNIQUE (production_number);
  END IF;
END $$;

SELECT setval(
  'public.orders_production_number_seq',
  COALESCE((SELECT MAX(production_number) FROM public.orders), 0)
);

GRANT USAGE, SELECT ON SEQUENCE public.orders_production_number_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.orders_production_number_seq TO authenticated;
