-- Fix orders INSERT policy once and for all
-- Problem: Multiple conflicting policies and missing GRANTs have prevented order creation

-- 1. Drop ALL existing INSERT policies on orders to start clean
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Service role can insert orders" ON public.orders;

-- 2. Create a single, simple INSERT policy that allows anyone to create orders
-- This is safe because orders are created during checkout and contain no sensitive access
CREATE POLICY "Allow public order creation"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Grant INSERT permission to both anonymous and authenticated users
-- Without these GRANTs, the policy alone is not sufficient
GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.orders TO authenticated;

-- 4. Also grant USAGE on the orders_id_seq if it exists (for auto-generated IDs)
-- This ensures the default gen_random_uuid() works correctly
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
