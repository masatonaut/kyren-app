# Kyren — Brand Concept

> Input document for Claude Design. Use this to generate prototypes, design systems, and product LP variants for `kyren.app` and the product family (KASHITE / YOMU / Phrasely / SABAKU).
> Companion to `BRAND.md` (the one-page reference card). This file goes deeper on **why** so the design system inherits the right intuitions.

---

## 1. Mission

Kyren is a one-person product studio that builds **focused tools for the quietly ambitious** — solo developers, indie makers, and knowledge workers who would rather ship one well-considered thing than ten mediocre things. Each product solves exactly one everyday friction (a forgotten loan, an unread book, a clumsy sentence) without asking the user to adopt a new identity, a new ritual, or a new dashboard. The studio name **Kyren** holds the intent: *quiet ambition* — boast only when receipts permit, ship at your own pace, and let consistency speak louder than launches.

---

## 2. Audience

### Primary
Solo developers and indie makers in **Tokyo / SF / Berlin / Tel Aviv**. They read Hacker News, ship side projects, value craft over reach, and are skeptical of growth-hacking. They earn enough to pay ¥500–¥2,000/mo for a tool that respects their attention.

### Secondary
Knowledge workers who don't write code — designers, writers, freelancers — who recognize a well-made product when they see one. They arrive via word-of-mouth from the primary audience, not via SEO funnels.

### Anti-audience (explicit)
- Enterprise buyers requiring SSO / SOC 2 / procurement
- Growth-at-all-costs founders chasing TAM stories
- Users who want gamification, streaks, or notification spam

We design for the primary; the secondary follows. The anti-audience never sees a marketing page tuned for them.

---

## 3. Color palette

The studio uses a **dark warm-near-black** as the canonical surface. Each product gets one accent that is used sparingly — only on its own subdomain hero. The studio hub itself uses a single amber accent.

### Studio (kyren.app) — dark canonical

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--bg` | `#0c0c0d` | page surface |
| Surface raised | `--surface` | `#17171a` | cards, dialogs |
| Ink primary | `--ink-1` | `rgba(255,255,255,0.92)` | body, headings |
| Ink secondary | `--ink-2` | `rgba(255,255,255,0.62)` | meta, captions |
| Ink mute | `--ink-3` | `rgba(255,255,255,0.38)` | dividers, placeholders |
| Accent (single) | `--amber` | `#fbbf24` | one rule line, one hover, one underline — never two on a screen |

### Magazine alt ("Meridian", for masatonaut.dev / editorial pages)

| Role | Token | Hex |
|------|-------|-----|
| Paper | `--paper` | `#EDE4D0` |
| Paper deep | `--paper-deep` | `#E3D8BF` |
| Ink (navy) | `--ink` | `#1B2942` |
| Ink soft | `--ink-soft` | `#2A3B57` |
| Amber | `--amber` | `#C8913A` |
| Coral (rare) | `--coral` | `#D88B6F` |

### Product accents

| Product | Hex | Mood |
|---------|-----|------|
| KASHITE | `#E85D3A` | warm coral — "lend / return" |
| YOMU | `#5B8DEF` | soft blue — "reading" |
| Phrasely | `#4CAF82` | green — "growth / fluency" |
| SABAKU | `#D4A853` | gold/sand — "ATC strips on a desert" |

Rule: a product accent appears **only** on its own hero band and primary CTA. The rest of the product UI obeys the studio's neutral palette so products feel like siblings, not strangers.

### Neutrals (extended)

| Token | Hex | Use |
|-------|-----|-----|
| `--rule` | `rgba(255,255,255,0.08)` | hairline divider |
| `--rule-strong` | `rgba(255,255,255,0.18)` | strong divider |
| `--success` | `#4CAF82` | confirmation only (same as Phrasely accent — coincidence, kept) |
| `--warning` | `#C8913A` | inline warning (same as Meridian amber) |
| `--danger` | `#D88B6F` | destructive — used coral, never red |

We do not use pure red. We do not use pure black. We do not use cool gray. Warmth is a brand commitment.

---

## 4. Typography

### Stack

- **Display (serif)** — `Instrument Serif`, Italic. Used for the tagline *"Quiet Ambition."* and section pull-quotes.
- **Display (sans)** — `Inter` 700–800. Product names: KASHITE, YOMU, Phrasely, SABAKU.
- **Body** — `Inter` 400–500. All paragraph text, lists, form labels.
- **Meta / labels** — `JetBrains Mono` 400–500. Timestamps, metric tables, code, captions.
- **Japanese** — `Noto Sans JP` 300–500. Use sparingly. For kanji titles (e.g. 静かなる野心), apply `letter-spacing: 0.32em` and a slightly lighter weight than the surrounding sans.

### Magazine alt
- **Display** — `Playfair Display` 700–800 (the Q with swash for *"Quiet Ambition."*)
- Body / meta / Japanese — same as above

### Hierarchy

| Use | Size | Weight | Family |
|-----|------|--------|--------|
| Hero display | `clamp(2.6rem, 6vw, 5rem)` | 700 | Display serif or sans |
| Section heading | `clamp(1.7rem, 3vw, 2.4rem)` | 700 | Display sans |
| Body | 16–17px, `line-height: 1.65` | 400 | Inter |
| Meta label | 11–12px, `letter-spacing: 0.1em`, uppercase | 500 | JetBrains Mono |
| Japanese heading | 12–14px, `letter-spacing: 0.32em` | 400 | Noto Sans JP |
| Numerals (metrics) | inherit, `font-variant-numeric: tabular-nums` | — | — |

Tabular numerals are non-negotiable on metric displays — when the number changes, no other element shifts.

---

## 5. Voice & Tone

The voice is **first-person, calm, declarative**. It boasts only when receipts permit. It uses Japanese as cultural anchor, not as ornament. It writes in lowercase casually but capitalizes for headings and product names.

### Do / Don't — Voice

| ✅ Do | ❌ Don't |
|------|---------|
| "I build focused tools from Tokyo." | "Kyren is a leading product studio." |
| "4 products live, 0 investors." | "Strategic alignment with stakeholders." |
| "Lost ¥30,000 to a forgotten lend. Built kashite so it wouldn't happen again." | "Innovative loan management solution." |

### Do / Don't — Tone

| ✅ Do | ❌ Don't |
|------|---------|
| Em-dash for asides — sparingly | "..." trailing-dots in marketing copy |
| Lowercase 'i' in build-in-public posts ("shipped phrasely v0.4.") | "🚨 PRODUCT LAUNCH 🚨" |
| Japanese subtitle as *cultural* anchor (静かなる野心) | Japanese as decoration without meaning |

Never use:
- "Game-changing", "revolutionary", "next-gen"
- All-caps headlines except for product names
- Emoji clusters in landing-page copy (single emoji OK for X)
- Roadmap promises beyond the next 30 days

---

## 6. Visual principles

These are the load-bearing intuitions the design system must encode. Every layout, animation, and component decision should be explainable by one of these.

### 1. Kanso (簡素) — strip the unnecessary
One product, one problem, one screen where possible. If a section can be removed without breaking comprehension, remove it. Empty space is a feature.

### 2. Warm restraint
The palette is dark but never cold. Type is generous but never floaty. Motion is present but never bouncy. Every restraint is paired with a small warmth — an amber rule, a serif italic, a 0.32em-tracked kanji line — so the result feels intentional, not minimalist for its own sake.

### 3. Travel as composition — Tokyo → Sydney → Budapest → LA
The brand is shaped by movement. **Tokyo** taught precision and ma (間, the breath between elements) — hence the generous 64–96px vertical rhythm. **Sydney** taught warmth and directness — hence the warm-near-black background and the first-person voice. **Budapest** taught that craft can survive across centuries — hence the magazine alt direction (Meridian) with its serif display and paper texture. **LA** is the destination, and it teaches that ambition can be quiet — first-name, present-tense, no hype. A Kyren page should feel like a quiet morning in any of those four cities: composed, unhurried, with one accent line of warmth.

### 4. Builder-first, not brand-first
Every page should answer "what does this tool do" before it answers "who made it." The tagline *Quiet Ambition* is the only studio assertion above the fold. After that, it is product → screenshot → why-it-exists → price → footer. The about-the-builder section is below the fold, always.

### 5. One accent per surface
A page has at most one amber rule, one accent CTA, one underline-on-hover. If you find yourself adding a second accent to fix a hierarchy problem, the hierarchy was wrong — fix the spacing or the weight, not the color.

---

## Reference moments to capture

When generating prototypes, the design system should evoke these references — not copy them, but inherit their intuitions:

- The **MERIDIAN magazine** cover aesthetic — cream paper + navy ink + amber rule + 静かなる野心
- **rauno.me** — micro-typography precision, every space considered
- **Linear.app** — animated dot grid (when motion is in scope)
- **Pedro Duarte's portfolio** — first-person directness ("Yo! I'm Pedro" → here: "Hey, I'm masato.")
- **Apple's mid-2000s product pages** — sections that breathe, no fold-stuffing

---

## What Kyren is NOT

- A SaaS company
- A studio with employees, team, or office
- A "platform" or "ecosystem"
- A VC-backed startup
- A growth-hacking operation

If a design choice would only make sense for one of the above, reject it.

---

## Domains in scope

- `kyren.app` — studio hub, lists products
- `masatonaut.dev` — personal portfolio (the one-person studio behind Kyren)
- `kashite.kyren.app`, `yomu.kyren.app`, `phrasely.kyren.app`, `sabaku.kyren.app` — product LPs

Each product LP may have its own visual variation **but must obey the principles, palette family, and voice above**.

---

*Source: hand-written by masato (@masatobuilds). Last updated: 2026-05-01.
Companion: `BRAND.md` — the one-page scannable reference card.*
