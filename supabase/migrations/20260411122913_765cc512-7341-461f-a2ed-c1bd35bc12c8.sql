
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  rank TEXT NOT NULL DEFAULT 'Recruit',
  badge_number TEXT NOT NULL,
  division TEXT DEFAULT 'Unassigned',
  clearance_level TEXT DEFAULT 'LEVEL 1',
  callsign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view agents" ON public.agents FOR SELECT USING (true);
CREATE POLICY "Anyone can insert agents" ON public.agents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update agents" ON public.agents FOR UPDATE USING (true);

CREATE OR REPLACE FUNCTION public.update_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_agents_updated_at();
