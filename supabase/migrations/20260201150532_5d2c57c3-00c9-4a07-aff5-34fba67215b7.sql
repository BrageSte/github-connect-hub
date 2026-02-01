-- Create enum for order status
CREATE TYPE public.order_status AS ENUM (
  'new',
  'manual_review',
  'in_production',
  'ready_to_print',
  'printing',
  'shipped',
  'done',
  'error'
);

-- Create enum for app roles (for admin access)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a role (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Policy: Only admins can view user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status order_status NOT NULL DEFAULT 'new',
  config_version INT NOT NULL DEFAULT 1,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  delivery_method TEXT NOT NULL,
  shipping_address JSONB,
  pickup_location TEXT,
  delivery_notes TEXT,
  config_snapshot JSONB NOT NULL,
  line_items JSONB NOT NULL,
  subtotal_amount INT NOT NULL,
  shipping_amount INT NOT NULL DEFAULT 0,
  total_amount INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NOK',
  internal_notes TEXT,
  error_message TEXT
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view orders
CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Policy: Only admins can update orders
CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- Policy: Service role can insert orders (for webhook)
CREATE POLICY "Service role can insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- Create order_events table for event logging
CREATE TABLE public.order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL
);

-- Enable RLS on order_events
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view order events
CREATE POLICY "Admins can view order events"
  ON public.order_events
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Policy: Service role can insert events (for webhook)
CREATE POLICY "Service role can insert events"
  ON public.order_events
  FOR INSERT
  WITH CHECK (true);

-- Create files table for future STEP/STL storage
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  original_filename TEXT
);

-- Enable RLS on files
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view files
CREATE POLICY "Admins can view files"
  ON public.files
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Policy: Only admins can insert files
CREATE POLICY "Admins can insert files"
  ON public.files
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();