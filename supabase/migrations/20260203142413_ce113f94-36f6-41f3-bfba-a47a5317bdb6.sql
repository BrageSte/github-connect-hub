-- Grant SELECT on orders table for anon to allow returning id after INSERT
GRANT SELECT ON public.orders TO anon;

-- Create a more restrictive RLS policy for anon SELECT (only their own order right after insert)
-- But since we don't track user, we'll make it restrictive via the policy
DROP POLICY IF EXISTS "Anon can view own order after insert" ON public.orders;
CREATE POLICY "Anon can view own order after insert" 
ON public.orders 
FOR SELECT 
TO anon
USING (false); -- Anon cannot read existing orders, but GRANT SELECT allows the RETURNING clause in INSERT