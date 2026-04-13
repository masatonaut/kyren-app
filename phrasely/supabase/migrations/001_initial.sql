-- Waitlist table
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Allow anonymous inserts for waitlist
create policy "Anyone can join waitlist" on public.waitlist
  for insert with check (true);

-- Rewrite history (for future)
create table public.rewrite_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  input_text text not null,
  output_json jsonb not null,
  tone text default 'native',
  created_at timestamptz default now()
);

alter table public.rewrite_history enable row level security;

create policy "Users see own history" on public.rewrite_history
  for all using (auth.uid() = user_id);

-- Saved phrases (for future)
create table public.saved_phrases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  original text not null,
  replacement text not null,
  explanation text not null,
  created_at timestamptz default now()
);

alter table public.saved_phrases enable row level security;

create policy "Users see own phrases" on public.saved_phrases
  for all using (auth.uid() = user_id);

-- Daily usage tracking
create table public.daily_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date default current_date not null,
  count int default 0,
  unique (user_id, date)
);

alter table public.daily_usage enable row level security;

create policy "Users see own usage" on public.daily_usage
  for all using (auth.uid() = user_id);
