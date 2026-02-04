-- Add new order statuses: arkivert and reklamasjon
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'arkivert';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'reklamasjon';
