-- Anonymous API usage tracking (no auth required)
CREATE TABLE public.api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  style text,
  input_length int,
  response_ms int
);

-- Fast lookups for rate limiting and daily counts
CREATE INDEX idx_api_usage_ip_created ON public.api_usage (ip_hash, created_at DESC);

-- Enable RLS
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Allow anon key to insert usage records (server-side route)
CREATE POLICY "Allow anonymous inserts" ON public.api_usage
  FOR INSERT WITH CHECK (true);

-- Allow anon key to read for rate limit counting
CREATE POLICY "Allow anonymous reads" ON public.api_usage
  FOR SELECT USING (true);
