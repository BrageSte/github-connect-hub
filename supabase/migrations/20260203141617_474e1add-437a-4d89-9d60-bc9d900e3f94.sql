-- Grant INSERT permission on orders table for anonymous users (for free checkout)
GRANT INSERT ON public.orders TO anon;

-- Also grant for authenticated users  
GRANT INSERT ON public.orders TO authenticated;