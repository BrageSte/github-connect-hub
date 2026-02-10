-- Create site_settings table for configurable prices, promo codes, etc.
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings (prices, etc.)
CREATE POLICY "Anyone can read settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can insert settings"
ON public.site_settings
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update settings"
ON public.site_settings
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete settings"
ON public.site_settings
FOR DELETE
USING (public.is_admin());