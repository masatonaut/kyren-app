<div align="center">
  <img src="public/og.png" alt="Phrasely — Sound native, effortlessly" width="100%" />

  <h1>Phrasely</h1>

  <p><strong>Write better English. Learn why it works.</strong></p>

  <p>
    <a href="https://phrasely.kyren.app">Live</a>
    &nbsp;·&nbsp;
    <a href="https://kyren.app">Kyren</a>
    &nbsp;·&nbsp;
    <a href="https://x.com/masatobuilds">@masatobuilds</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" />
    <img src="https://img.shields.io/badge/Supabase-RLS-3ECF8E?logo=supabase" />
    <img src="https://img.shields.io/badge/Claude-API-D97757?logo=anthropic" />
    <img src="https://img.shields.io/badge/Stripe-Live-635BFF?logo=stripe" />
    <img src="https://img.shields.io/badge/license-Proprietary-lightgrey" />
  </p>
</div>

---

AI-powered English rewriting for Japanese speakers (and other non-native writers).
Transform your writing to sound more natural — and learn *why* each change was made.

## Why this exists

Grammar checkers fix mistakes. They don't fix **tone**, **register**, or the small idiomatic choices that separate "technically correct" from "sounds like a native speaker."

Phrasely closes that gap. Paste text, pick a tone, get native-sounding output with a per-change explanation in Japanese.

## Features

| | |
|---|---|
| **Smart Rewrite** | Paste text → select tone (Casual / Professional / Academic) → native-sounding output. |
| **Why Changed** | Before/After diff with Japanese explanations for every change. |
| **Phrase Library** | Save your favorite phrasings and reuse them. |
| **Stripe Pro** | $4.99/mo for unlimited rewrites and longer inputs. |

## Stack

- **Next.js 16** (App Router) + Tailwind CSS + shadcn/ui
- **Supabase** — Postgres + RLS, magic-link auth
- **Claude API** (Anthropic) — streaming rewrites with explanation tokens
- **Stripe** — subscription billing, webhook-verified entitlement
- **Sentry** — error monitoring (DSN-gated)
- **Vercel Analytics** — privacy-friendly usage signal

## Local development

```bash
pnpm install
cp .env.example .env.local
# Fill in: SUPABASE / ANTHROPIC / STRIPE keys
pnpm dev
```

## Production checks

```bash
pnpm build
pnpm lint
```

## Security

- RLS on every user-data table; ownership chain validated on every API route.
- Stripe webhook signature verified before any entitlement change.
- CSP / HSTS / X-Frame-Options DENY / X-Content-Type-Options nosniff headers.
- Per-IP rate limiting; per-user daily quota for free tier.
- API cost cap on Anthropic side as a final safety net.

## Pricing

- **Free** — 500 chars/request, 10 requests/day, 10 saved phrases.
- **Pro ($4.99/mo)** — 5,000 chars/request, unlimited requests, unlimited phrases.

## Legal

[Privacy](https://phrasely.kyren.app/privacy) · [Terms](https://phrasely.kyren.app/terms) · [特定商取引法に基づく表記](https://phrasely.kyren.app/tokushoho)

## License

Proprietary — © Kyren.

---

<sub>Part of the <a href="https://kyren.app">Kyren</a> product suite.</sub>
