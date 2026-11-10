DROP POLICY IF EXISTS "Allow public delete on cases" ON public.cases;
DROP POLICY IF EXISTS "Anyone can create cases" ON public.cases;
DROP POLICY IF EXISTS "Anyone can view cases" ON public.cases;
DROP POLICY IF EXISTS "Anyone can update agents" ON public.agents;
DROP POLICY IF EXISTS "Anyone can insert agents" ON public.agents;
DROP POLICY IF EXISTS "Anyone can view agents" ON public.agents;
REVOKE ALL ON public.cases FROM anon, authenticated;
REVOKE ALL ON public.agents FROM anon, authenticated;