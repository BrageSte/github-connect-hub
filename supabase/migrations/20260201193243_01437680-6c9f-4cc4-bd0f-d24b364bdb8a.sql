-- Remove the conflicting admin-only insert policy that blocks regular users
DROP POLICY IF EXISTS "Admins can insert orders" ON public.orders;