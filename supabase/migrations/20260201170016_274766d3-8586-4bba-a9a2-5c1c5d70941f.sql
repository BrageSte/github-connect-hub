-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create a PERMISSIVE policy (not restrictive) for public order creation
CREATE POLICY "Public can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);