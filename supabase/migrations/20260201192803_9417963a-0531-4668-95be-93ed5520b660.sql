-- Drop the incorrect policy and create one that works for anonymous users
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;

-- Create policy that allows both anon and authenticated users to insert orders
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Also need to allow public to invoke edge functions
-- Grant usage on the orders table to anon
GRANT INSERT ON public.orders TO anon;