# Phrasely

> Sound native, effortlessly.

AI-powered English rewriting tool for non-native speakers. Transform your writing to sound more natural while learning why changes were made.

## Problem

Non-native English speakers often write grammatically correct but unnatural English. Existing tools fix grammar but don't optimize tone and register for business contexts.

## Features (MVP)

1. **Smart Rewrite** - Paste text, select tone (Casual/Professional/Academic), get native-sounding output
2. **Why Changed** - Before/After diff with Japanese explanations for each change
3. **Phrase Library** - Save and reuse your favorite phrases

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth, PostgreSQL, RLS)
- **AI:** Anthropic Claude API
- **Payments:** Stripe
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Supabase account
- Anthropic API key
- Stripe account

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Project Structure

```
src/
├── app/          # Next.js App Router pages
├── components/   # React components
├── lib/          # Utilities, API clients, hooks
└── types/        # TypeScript type definitions
```

## Pricing

- **Free:** 500 chars/request, 10 requests/day, 10 saved phrases
- **Pro ($10/mo):** 5,000 chars/request, unlimited requests, unlimited phrases

## License

Proprietary - Kyren
