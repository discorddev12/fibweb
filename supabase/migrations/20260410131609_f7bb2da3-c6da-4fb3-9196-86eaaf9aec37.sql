
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'WANTED',
  threat TEXT NOT NULL DEFAULT 'MEDIUM',
  last_seen TEXT,
  charges TEXT[] DEFAULT '{}',
  notes TEXT,
  case_file TEXT NOT NULL DEFAULT ('FIB-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random() * 99999)::text, 5, '0')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cases" ON public.cases FOR SELECT USING (true);
CREATE POLICY "Anyone can create cases" ON public.cases FOR INSERT WITH CHECK (true);
