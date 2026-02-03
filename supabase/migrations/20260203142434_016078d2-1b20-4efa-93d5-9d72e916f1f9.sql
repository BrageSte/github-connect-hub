-- Remove the unnecessary anon SELECT policy since we no longer need SELECT for returning id
DROP POLICY IF EXISTS "Anon can view own order after insert" ON public.orders;

-- Revoke SELECT from anon to keep orders secure (admins only)
REVOKE SELECT ON public.orders FROM anon;