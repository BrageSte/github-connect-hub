-- Fix RLS policies: Change from RESTRICTIVE to PERMISSIVE
-- RESTRICTIVE policies don't work as intended without PERMISSIVE policies

-- Drop existing restrictive policies on orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- Drop existing restrictive policies on user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Drop existing restrictive policies on order_events
DROP POLICY IF EXISTS "Admins can view order events" ON public.order_events;

-- Drop existing restrictive policies on files
DROP POLICY IF EXISTS "Admins can view files" ON public.files;
DROP POLICY IF EXISTS "Admins can insert files" ON public.files;

-- Create PERMISSIVE policies for orders (only admins can access)
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Create PERMISSIVE policies for user_roles (only admins can view)
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Create PERMISSIVE policies for order_events (only admins can access)
CREATE POLICY "Admins can view order events"
ON public.order_events
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert order events"
ON public.order_events
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Create PERMISSIVE policies for files (only admins can access)
CREATE POLICY "Admins can view files"
ON public.files
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert files"
ON public.files
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());