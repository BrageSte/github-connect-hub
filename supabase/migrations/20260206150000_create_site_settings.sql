-- Key-value settings table for admin-configurable site settings
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (prices visible to all visitors)
CREATE POLICY "Anyone can read settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can update settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert settings"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete settings"
  ON public.site_settings
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Seed with current hardcoded values
INSERT INTO public.site_settings (key, value) VALUES
  ('products', '[
    {"variant": "shortedge", "name": "Compact", "price": 399, "description": "Ultrakompakt design tilpasset fingrene. Individuelt tilpassede steg for optimal halvkrimpp-trening."},
    {"variant": "longedge", "name": "Long Edge", "price": 499, "description": "Ekstra lang flate på enden (80mm), så du kan crimpe som på en vanlig 20 mm kant. Komfortabel avrunding. Dette er ultimate-varianten: individuelle steg med custom mål til fingrene + en vanlig 20 mm flatkant for trening."}
  ]'::jsonb),
  ('stl_file_price', '199'::jsonb),
  ('shipping_cost', '79'::jsonb),
  ('promo_codes', '{"TESTMEG": {"type": "percent", "value": 100}}'::jsonb);
