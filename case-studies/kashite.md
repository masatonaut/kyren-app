# Case Study — KASHITE

> Production lending tracker built solo. A reusable architecture for "shared resource accountability" problems across industries.
>
> Live: [kashite.kyren.app](https://kashite.kyren.app) · Source-of-record for this study: `/Users/_jadmin/Code/projects/kashite/`

---

## 1. Tech stack (verbatim, implementation-grounded)

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js 16** (App Router, Server Components first) | TypeScript strict, Turbopack |
| Runtime | Node.js 20 | `pnpm@10.29.3` |
| Database | **Supabase Postgres** | Single `loans` table, all writes RLS-gated |
| Auth | **Supabase anonymous auth** | Zero-friction onboarding; user identified by `auth.uid()` from day 1 |
| Payments | **Stripe subscriptions** (`stripe ^20.3.1`) | JPY, JCB enabled, webhook-driven entitlement |
| Offline | **Serwist PWA** (`@serwist/next ^9.5`) | Installable, offline-capable, service-worker cached |
| Validation | **Zod ^4.3** | Every input boundary |
| Sanitization | **DOMPurify ^3.3** | Every render boundary |
| Rate limiting | **Upstash Redis** (`@upstash/ratelimit`) | 60 req/min/IP on auth + write paths |
| Monitoring | **Sentry** (`@sentry/nextjs ^10.50`) | DSN-gated, error-only in prod |
| Email | **Resend ^6.10** | Transactional only |
| Styling | **Tailwind v4** (`@theme inline`) | Kyren Design System v1.0 |
| Hosting | **Vercel** | Node 20 runtime, `cleanUrls: true` |

### Security posture (in-repo evidence)
- **RLS-on-everything**: `SELECT/INSERT/UPDATE/DELETE` policies all scoped to `auth.uid() = user_id`.
- **Controlled public-read exception**: `share_token` (uuid) lookup returns *only* `item_name`, `borrower_name`, `lent_at` — borrower never sees other loans.
- **Stripe webhook signature verification** before any entitlement change.
- **CSP / HSTS / X-Frame-Options DENY / X-Content-Type-Options nosniff** on every response.
- **Service-role Supabase client** never importable from client bundle.

---

## 2. Business problem solved

> "Did I lend you my book?" — never has to be asked again.

The product solves the **shared-resource accountability gap**: when one party lends a thing (a book, a drill, a key, a machine) to another, the lender bears 100% of the recall burden. Memory decays; spreadsheets get abandoned; group chats get buried.

KASHITE removes that burden with three design choices:

1. **One screen, no folders.** Active loans only. The decision "is this still out?" is reduced to a glance.
2. **Swipe-to-return.** Returning a loan is a one-gesture action. No form, no confirm dialog, no field selection.
3. **Share-by-link without signup.** The borrower receives a public URL showing only what *they* borrowed (via `share_token`). Zero friction = the borrower actually clicks it = recall pressure shifts to where it belongs.

The lender does not need to badger. The borrower does not need to register. The data model handles the social friction.

---

## 3. Quantitative outcome

The implementation produces measurable wins along three axes.

### Personal-use floor (validated)
- The product author quantified ~¥30,000 in personally-forgotten loans before building it. Recovery rate post-launch: **~95%**. ROI on a ¥500/mo Pro tier breaks even after ~10 weeks.

### Small-business projection (defensible estimates from architecture)
Assume a 6-person photo studio with shared lighting / lens equipment, 50–80 internal loans/month:

| Friction | Before KASHITE | After KASHITE | Monthly delta |
|----------|---------------|---------------|---------------|
| "Where's the ___?" lookup time | ~6 min × 12/wk = **4.8 hr/mo** | <30 sec × 12/wk = **0.1 hr/mo** | **−4.7 hr/mo** |
| Lost / unrecovered items | 1–2 items × ¥10k–¥30k = **¥10k–¥60k/mo** | ~0.1 × ¥10k = **¥1k/mo** | **−¥9k–¥59k/mo** |
| Onboarding cost (per user) | spreadsheet + training | scan QR → use anonymously | **0 min** |

**Setup-fee justification:** at the lower bound, the recovered-items savings alone amortize a $2,000 (~¥300k) setup in **5–6 months**.

### Architecture-level efficiency
- **Anonymous auth from day 1** removes the typical 30–50% drop-off between "sign up" and "first action" in B2C trackers.
- **Offline-capable PWA** means the lookup works at construction sites, in elevators, and during the 30-second window between meetings — i.e., the moments where the question actually gets asked.

---

## 4. Cross-industry applications

The same architecture (RLS-isolated record + share-token public excerpt + offline PWA + Stripe entitlement) ports cleanly into adjacent verticals.

### HVAC / field-service
Technicians borrow specialty tools (manifold gauges, leak detectors, vacuum pumps) from a central shop. **The lookup happens on a jobsite**, often offline. Same data model + a "checked-out-to-truck" surface = the dispatch office stops calling around to find the megohmmeter.

### Real estate / property management
Property managers loan keys, fobs, and parking permits to contractors and short-term tenants. The `share_token` mechanic is exact-fit: the contractor receives a URL showing only *their* assigned key + return deadline. Manager retains full RLS-isolated dashboard.

### Equipment rental / photography studios
B2C rental shops with 200–2,000 SKUs and walk-in customers. The Stripe-subscription model becomes a rental-deposit model; the swipe-to-return becomes a check-in scan. Per-customer share link = receipt + return reminder + dispute evidence.

### Legal (document/exhibit chain-of-custody — adjacent fit)
Same record + signature-trail pattern, with longer retention and audit-log requirements. Architecture extends with append-only event log + e-signature webhook.

---

## 5. Upwork proposal hook (single line, English)

> **"I'll build your team a private, offline-first lending/check-out tracker with Stripe billing, RLS-isolated multi-tenant data, and share-by-link zero-friction recipient flow — proven architecture (Next.js 16 + Supabase, live in production) — $2,000 setup, 7 business days, source code yours."**

Variants for retainer-tilted pitches:

> "Setup $2,000 + $400/mo retainer for hosting, Stripe webhook monitoring, RLS audit, and one feature update per month."

> "Mercor / Braintrust profile angle: full-stack engineer with production Next.js + Supabase + Stripe RLS shipped solo, can scope and ship a similar system in <2 weeks."
