-- Allow anyone (anon and authenticated) to create orders
-- This is safe because orders are payment confirmations, not sensitive data
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);