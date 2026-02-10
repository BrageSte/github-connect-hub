-- Server-side Stripe checkout snapshots used by webhook-first order creation.
CREATE TABLE IF NOT EXISTS public.checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  delivery_method TEXT NOT NULL,
  pickup_location TEXT,
  shipping_address JSONB,
  promo_code TEXT,
  promo_discount_amount INT NOT NULL DEFAULT 0,
  subtotal_amount INT NOT NULL,
  shipping_amount INT NOT NULL DEFAULT 0,
  total_amount INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NOK',
  line_items JSONB NOT NULL,
  config_snapshot JSONB NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  error_message TEXT,
  confirmation_email_sent_at TIMESTAMPTZ,
  CONSTRAINT checkout_sessions_status_check CHECK (status IN ('pending', 'paid', 'expired', 'failed'))
);

CREATE INDEX IF NOT EXISTS checkout_sessions_status_idx ON public.checkout_sessions(status);
CREATE INDEX IF NOT EXISTS checkout_sessions_customer_email_idx ON public.checkout_sessions(customer_email);
CREATE INDEX IF NOT EXISTS checkout_sessions_order_id_idx ON public.checkout_sessions(order_id);

ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'update_updated_at_column'
      AND pronamespace = 'public'::regnamespace
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_checkout_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_checkout_sessions_updated_at
      BEFORE UPDATE ON public.checkout_sessions
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END
$$;
