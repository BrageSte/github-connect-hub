-- Fix orders table RLS policies - convert from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can insert orders" ON public.orders;

CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Fix files table RLS policies - convert from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Admins can view files" ON public.files;
DROP POLICY IF EXISTS "Admins can insert files" ON public.files;

CREATE POLICY "Admins can view files"
  ON public.files
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert files"
  ON public.files
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Fix order_events table RLS policies - convert from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Admins can view order events" ON public.order_events;
DROP POLICY IF EXISTS "Admins can insert order events" ON public.order_events;

CREATE POLICY "Admins can view order events"
  ON public.order_events
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert order events"
  ON public.order_events
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Fix user_roles table RLS policy - convert from RESTRICTIVE to PERMISSIVE
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (is_admin());