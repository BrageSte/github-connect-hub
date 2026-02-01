-- Fix: Ensure orders table SELECT is restricted to admins only
-- Drop any existing SELECT policies and recreate with proper permissions

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

-- Create proper PERMISSIVE SELECT policy for admins only
-- This ensures only authenticated users with admin role can view orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Revoke any direct SELECT grants from anon role on orders table
REVOKE SELECT ON public.orders FROM anon;