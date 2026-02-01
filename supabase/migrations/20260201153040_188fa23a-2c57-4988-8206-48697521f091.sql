-- Remove unnecessary INSERT policies that use WITH CHECK (true)
-- Service role bypasses RLS anyway, so these policies serve no purpose

DROP POLICY IF EXISTS "Service role can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Service role can insert events" ON public.order_events;