-- Add a dedicated site setting used to pause checkout during migrations/cutovers.
INSERT INTO public.site_settings (key, value)
VALUES (
  'maintenance_mode',
  jsonb_build_object(
    'enabled', false,
    'message', 'Bestilling er midlertidig satt pa pause. Prov igjen om kort tid.'
  )
)
ON CONFLICT (key) DO NOTHING;
