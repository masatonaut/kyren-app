-- Subscribers table for Stripe-based Pro plan
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text NOT NULL DEFAULT 'active',
  plan text NOT NULL DEFAULT 'pro',
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_subscribers_email ON public.subscribers(email);
CREATE INDEX idx_subscribers_stripe_customer ON public.subscribers(stripe_customer_id);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous reads" ON public.subscribers
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous updates" ON public.subscribers
  FOR UPDATE USING (true);
