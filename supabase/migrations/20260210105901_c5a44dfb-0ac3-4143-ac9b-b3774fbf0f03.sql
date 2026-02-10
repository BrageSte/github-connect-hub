-- Idempotent site_settings migration (safe when table/policies already exist)

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_settings'
      AND policyname = 'Anyone can read settings'
  ) THEN
    CREATE POLICY "Anyone can read settings"
      ON public.site_settings
      FOR SELECT
      USING (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_settings'
      AND policyname = 'Admins can insert settings'
  ) THEN
    CREATE POLICY "Admins can insert settings"
      ON public.site_settings
      FOR INSERT
      WITH CHECK (public.is_admin());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_settings'
      AND policyname = 'Admins can update settings'
  ) THEN
    CREATE POLICY "Admins can update settings"
      ON public.site_settings
      FOR UPDATE
      USING (public.is_admin());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'site_settings'
      AND policyname = 'Admins can delete settings'
  ) THEN
    CREATE POLICY "Admins can delete settings"
      ON public.site_settings
      FOR DELETE
      USING (public.is_admin());
  END IF;
END
$$;
