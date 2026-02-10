-- 1) Grant admin role to selected auth users (run in NEW project).
-- Replace emails before running.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email IN ('admin1@domene.no', 'admin2@domene.no')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Synchronize production sequence after import (run in NEW project).
WITH max_val AS (
  SELECT MAX(production_number) AS v FROM public.orders
)
SELECT setval(
  'public.orders_production_number_seq',
  COALESCE(v, 1),
  v IS NOT NULL
)
FROM max_val;

-- 3) Post-cutover monitoring snapshots (run in BOTH projects and compare).
SELECT COUNT(*) AS orders_count FROM public.orders;
SELECT COALESCE(SUM(total_amount), 0) AS orders_total_amount_ore FROM public.orders;
SELECT status, COUNT(*) AS checkout_count
FROM public.checkout_sessions
GROUP BY status
ORDER BY status;
