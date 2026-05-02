# Case Study — Phrasely

> Production AI rewriting tool for non-native English writers. Reusable architecture for any "tone-aware text transformation with per-change explanations" use case.
>
> Live: [phrasely.kyren.app](https://phrasely.kyren.app) · Source-of-record: `/Users/_jadmin/Code/projects/kyren-app/phrasely/`

---

## 1. Tech stack (verbatim, implementation-grounded)

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js 15** (App Router) | TypeScript strict |
| LLM | **Anthropic Claude API** (`@anthropic-ai/sdk ^0.88`) | Streaming rewrites + per-change explanation tokens |
| Database / Auth | **Supabase** (`@supabase/ssr ^0.5`) | Postgres + RLS + magic-link auth |
| Payments | **Stripe** (`stripe ^22`) | Subscription, webhook-verified entitlement |
| Styling | Tailwind CSS v4 + shadcn/ui | `@theme inline` token model |
| Monitoring | **Sentry** (`@sentry/nextjs ^10.50`) | DSN-gated |
| Analytics | **Vercel Analytics** (`@vercel/analytics ^2.0`) | Privacy-friendly, no third-party cookies |
| Hosting | Vercel | Edge-friendly streaming |

### Security posture
- **RLS on every user-data table**; ownership chain validated on every API route.
- **Stripe webhook signature verification** before any entitlement change.
- **CSP / HSTS / X-Frame-Options DENY / X-Content-Type-Options nosniff** headers.
- **Per-IP rate limiting** + **per-user daily quota** for free tier.
- **Anthropic Console spend cap** as final safety net.

### Pricing model (in-repo, not aspirational)
| Tier | Limit | Price |
|------|-------|-------|
| Free | 500 chars/req · 10 req/day · 10 saved phrases | $0 |
| Pro | 5,000 chars/req · unlimited req · unlimited phrases | **$4.99/mo** |

---

## 2. Business problem solved

> Grammar checkers fix mistakes. They don't fix **tone**, **register**, or the small idiomatic choices that separate "technically correct" from "sounds like a native speaker."

The product solves the **"correct but wrong-feeling"** gap. A non-native English writer sending a customer email or a Slack message to a US team faces three layers of friction:

1. **Tone register** — Casual vs. Professional vs. Academic. Direct translation from Japanese loses the politeness gradient.
2. **Idiom selection** — "I will do my best" → native ear hears "I'm not sure I can do this." A native would write "I'm on it" or "I'll get this handled."
3. **Why is this wrong?** — Other tools rewrite silently. The user gets a polished result but learns nothing. Next email, same mistake.

Phrasely closes all three with one interaction:

- **Paste → pick tone → get native output** — one screen, three clicks, sub-second streaming.
- **Per-change diff with Japanese explanations** — every replacement shows *what* changed and *why* a native would phrase it differently. The product is a rewriting tool **and** a teaching tool simultaneously.
- **Phrase Library** — Pro users save phrasings they want to internalize. The library compounds over months into a personal style guide.

The teaching layer is the moat. A user who learns the *why* eventually needs Phrasely less for the same email type — but gets a clean upgrade to harder content (legal copy, marketing claims, technical docs).

---

## 3. Quantitative outcome

### Time saved per email / message
A non-native writer drafting a customer-facing email manually edits for tone for **8–15 minutes** (rewriting the same sentence 3–4 times, second-guessing word choice). Phrasely: **15–30 seconds** including reading the explanation.

| Use case | Manual editing (minutes) | Phrasely (seconds) | Saved |
|----------|-------------------------|---------------------|-------|
| Customer support reply (200 chars) | 5–8 | ~15 | **~95%** |
| Internal Slack DM (100 chars) | 3–5 | ~10 | **~95%** |
| Sales follow-up email (500 chars) | 10–15 | ~30 | **~96%** |
| Cover letter / formal application (1,500 chars) | 30–60 | ~60 | **~97%** |

### Pro tier ROI (defensible from pricing)
- Pro is **$4.99/mo**. A single converted lead from a polished sales email = **break-even ~100×**.
- For a 20-person Japan-based company doing English customer support: 5 emails/agent/day × 20 agents × 6 min saved = **10 hours/day saved across team** at a $100/mo team-tier price point.

### LLM cost margin
- Average rewrite: ~500 input + ~500 output tokens = **~$0.005/request** at Claude Sonnet pricing.
- Pro free-tier replacement: 100 req/day × $0.005 = **$0.50/user/day max** → daily cap before margin compression. Per-user daily quota is the load-bearing cost lever.
- $4.99/mo with realistic usage (~30 req/day) ≈ **$4.50 / mo gross margin** per Pro user.

### Onboarding friction
Magic-link auth → first rewrite → first explanation read: **<60 seconds**. No credit card on free tier. Pro upgrade is a single Stripe checkout.

---

## 4. Cross-industry applications

The architecture (streaming rewrite + per-change explanation + tone selector + Stripe-gated quota) maps to any vertical with **non-native or non-specialist writers producing customer-facing or compliance-sensitive prose**.

### E-commerce — product copy localization
Japanese / Korean / Chinese sellers writing English product listings for Amazon US, Etsy, Shopify global. A Pro tier per seller pays for itself on **one extra conversion per month**. Tone presets become "Marketplace SEO / Premium / Casual." Phrase Library becomes brand voice guide.

### Real estate — listing descriptions across markets
International agents listing properties in markets where they don't write the local language fluently. Phrasely-style rewriter trained on listing-copy tone (warm, descriptive, regulation-compliant). Per-agent Pro at $9.99/mo. Per-brokerage team plan at $49–$99/mo.

### Legal — clear-language contract drafts
Junior associates drafting client-facing letters, settlement summaries, NDAs in plain English. Per-change explanation becomes a learning loop. Compliance angle: explanations log = training audit trail. Per-firm Stripe billing + RLS-isolated phrase libraries per practice group.

### HVAC / trades — customer-facing service estimates
Field technicians writing estimates and follow-ups to homeowners. The "professional but friendly" register is exactly what tradespeople struggle with. Phrasely-style tool with HVAC-specific vocabulary loaded into the system prompt. Per-shop Stripe seat licensing.

### Internal comms for global teams
Japan / Korea / EU offices writing English to US HQ. Slack-integrated variant: select message → "rewrite professional" → send. Team plan, SSO add-on for enterprise.

---

## 5. Upwork proposal hook (single line, English)

> **"I'll build your team a private AI rewriting tool with custom tone profiles, per-change explanations in your users' native language, and Stripe-billed seat licensing — proven architecture (Next.js 15 + Claude streaming + Supabase RLS), live in production at phrasely.kyren.app. $2,000 setup, 10 business days, source yours, infrastructure <$25/mo."**

Variants:

> "Setup $2,000 + $300/mo retainer covers Anthropic spend monitoring, prompt-tuning sprints, one new tone preset per month, and per-customer LLM cost dashboards."

> "Stretch deliverable (+$1,500): Slack/Gmail/Outlook integration so the rewrite is one keyboard shortcut from the user's existing inbox."

> "Mercor / Braintrust profile angle: full-stack engineer who has shipped 3 production Next.js + Supabase + Stripe + Anthropic apps solo (KASHITE, YOMU, Phrasely) — can scope and ship a domain-specific Claude-powered tool in <2 weeks."
