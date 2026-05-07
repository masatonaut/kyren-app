import Link from 'next/link'
import type { Metadata } from 'next'
import { Check, ArrowLeft } from 'lucide-react'
import { PLANS } from '@/lib/plans'
import { SubscribeButton, ManageSubscriptionButton, LifetimeButton } from './PricingActions'

export const metadata: Metadata = {
  title: 'Pricing — SABAKU',
  description: 'Free for personal use. Pro at $8/mo for cloud sync. Lifetime at $49.',
}

const FAQ = [
  {
    q: 'Is there a free trial?',
    a: 'SABAKU Free is unlimited in time — you can use Kanban, Focus, timer, and JSON export forever locally. Pro features (cloud sync, Vault auto-sync, analytics) require a subscription.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Manage your subscription via Stripe Customer Portal. You keep Pro access until the end of the current billing period.',
  },
  {
    q: 'Is there a refund policy?',
    a: '7-day no-questions-asked refund. Email i.masato0907@gmail.com.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your local strips stay in your browser. You can export everything to JSON anytime. Cloud-synced strips remain readable for 30 days after cancellation in case you re-subscribe.',
  },
  {
    q: 'How does Obsidian Vault sync work?',
    a: 'Pro users run a small CLI tool (open source, MIT) that watches your Vault for daily notes and auto-creates strips. Free users can use the CLI manually with one-shot syncs.',
  },
] as const

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link href="/" className="text-[18px] font-bold tracking-tight">SABAKU</Link>
        <Link href="/" className="flex items-center gap-1 text-[13px] text-text-tertiary hover:text-text-secondary">
          <ArrowLeft size={14} />
          Back to app
        </Link>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Pricing</h1>
        <p className="text-text-secondary text-[15px]">
          Free forever for solo use. Pay only when you want cross-device sync and Vault auto-import.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <ManageSubscriptionButton />

        <div className="grid md:grid-cols-3 gap-5">
          {/* Free */}
          <PriceCard
            name="Free"
            price="¥0"
            period="forever"
            features={PLANS.FREE.features}
            cta={
              <Link href="/" className="block w-full text-center px-4 py-2 text-[13px] font-medium border border-border text-text-secondary rounded hover:text-text-primary transition-colors">
                Use for free
              </Link>
            }
          />

          {/* Pro */}
          <PriceCard
            name="Pro"
            price="¥800"
            period="/month"
            highlight
            badge="Recommended"
            features={PLANS.PRO.features}
            extra={
              <p className="text-[11px] text-text-tertiary mt-2 text-center">
                or ¥7,200/year (save 25%)
              </p>
            }
            cta={
              <div className="space-y-2">
                <SubscribeButton priceType="monthly" label="Subscribe Monthly" />
                <SubscribeButton priceType="yearly" label="Subscribe Annual (-25%)" />
              </div>
            }
          />

          {/* Lifetime */}
          <PriceCard
            name="Lifetime"
            price="¥4,900"
            period="one-time"
            badge="First 100 users"
            features={[
              'Everything in Pro',
              'Pay once, use forever',
              'No recurring fees',
              'Gumroad fulfillment',
              'Early access to features',
            ]}
            cta={<LifetimeButton />}
          />
        </div>

        <p className="mt-8 text-center text-[12px] text-text-tertiary">
          All prices in JPY. Tax included. Payment processed by Stripe (subscription) or Gumroad (lifetime).
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-border">
        <h2 className="text-2xl font-bold tracking-tight text-center mb-8">FAQ</h2>
        <div className="space-y-5">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group p-4 bg-bg-secondary border border-border rounded">
              <summary className="cursor-pointer text-[14px] font-medium list-none flex items-start justify-between gap-3">
                <span>{q}</span>
                <span className="text-text-tertiary group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-[13px] text-text-secondary leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-6 py-10 border-t border-border text-[12px] text-text-tertiary">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/tokushoho" className="hover:text-text-secondary">特定商取引法</Link>
          <Link href="/privacy" className="hover:text-text-secondary">Privacy</Link>
          <Link href="/terms" className="hover:text-text-secondary">Terms</Link>
          <Link href="/" className="hover:text-text-secondary">Demo</Link>
        </div>
      </footer>
    </div>
  )
}

function PriceCard({
  name, price, period, features, cta, highlight, badge, extra,
}: {
  name: string
  price: string
  period: string
  features: readonly string[]
  cta: React.ReactNode
  highlight?: boolean
  badge?: string
  extra?: React.ReactNode
}) {
  return (
    <div className={`p-6 border rounded bg-bg-secondary flex flex-col ${highlight ? 'border-accent shadow-lg shadow-accent/5' : 'border-border'}`}>
      {badge && (
        <div className={`inline-block px-2 py-0.5 mb-3 text-[10px] font-mono uppercase tracking-wider rounded self-start ${highlight ? 'text-accent border border-accent/30' : 'text-text-tertiary border border-border'}`}>
          {badge}
        </div>
      )}
      <h3 className="text-[15px] font-medium mb-1">{name}</h3>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-[12px] text-text-tertiary">{period}</span>
      </div>
      {extra}
      <ul className="space-y-2 my-5 text-[13px] text-text-secondary flex-1">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2">
            <Check size={14} className="text-accent shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto">{cta}</div>
    </div>
  )
}
