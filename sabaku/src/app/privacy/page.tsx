import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — SABAKU',
  description: 'How SABAKU collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link href="/" className="text-[18px] font-bold tracking-tight">SABAKU</Link>
        <Link href="/" className="flex items-center gap-1 text-[13px] text-text-tertiary hover:text-text-secondary">
          <ArrowLeft size={14} />
          Back
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-6 pb-20 text-[14px] leading-relaxed">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-[13px] text-text-tertiary mb-10">プライバシーポリシー · Last updated 2026-05-07</p>

        <Section title="1. Overview / 概要">
          <p>SABAKU (the "Service") is operated by Masato Nakamura ("we", "us"). This Privacy Policy describes how we collect, use, and protect personal information.</p>
          <p className="text-text-secondary mt-2">本サービス「SABAKU」は中村柾人が運営します。本ポリシーは個人情報の取扱いを定めます (個人情報保護法 / APPI 準拠)。</p>
        </Section>

        <Section title="2. Information collected / 収集する情報">
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account info</strong>: email, authentication ID (Supabase Auth)</li>
            <li><strong>App data</strong>: strip titles, priorities, projects, timers, completion timestamps</li>
            <li><strong>Payment metadata</strong>: customer ID, subscription status (no credit card data is stored on our servers; processed by Stripe)</li>
            <li><strong>Usage analytics</strong>: anonymized page views (Vercel Analytics)</li>
            <li><strong>Error reports</strong>: stack traces with PII redacted (Sentry, optional)</li>
          </ul>
        </Section>

        <Section title="3. How we use it / 利用目的">
          <ul className="list-disc pl-6 space-y-1">
            <li>Service provision and improvement</li>
            <li>Payment processing and subscription management</li>
            <li>Authentication and security</li>
            <li>Customer support</li>
            <li>Aggregated analytics (no individual targeting)</li>
          </ul>
        </Section>

        <Section title="4. Third parties / 第三者提供">
          <p>We use the following service providers (data may be processed in their infrastructure):</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Supabase</strong> — database, authentication (AWS Tokyo)</li>
            <li><strong>Stripe</strong> — payment processing (PCI DSS Level 1 certified)</li>
            <li><strong>Gumroad</strong> — lifetime license fulfillment</li>
            <li><strong>Vercel</strong> — hosting and analytics</li>
            <li><strong>Sentry</strong> (optional) — error tracking</li>
            <li><strong>Cloudflare</strong> — DNS</li>
          </ul>
          <p className="mt-2">We do not sell or rent your personal information.</p>
        </Section>

        <Section title="5. User rights / ユーザーの権利">
          <p>You can:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Export all your data as JSON anytime via the in-app Settings menu</li>
            <li>Request deletion of your account and all associated data</li>
            <li>Update your information via the app</li>
            <li>Opt out of analytics by using a privacy-friendly browser</li>
          </ul>
          <p className="mt-2">To exercise these rights, email <a href="mailto:i.masato0907@gmail.com" className="text-accent hover:underline">i.masato0907@gmail.com</a>.</p>
        </Section>

        <Section title="6. Cookies / Cookieについて">
          <p>We use cookies for:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Authentication sessions</strong> (essential)</li>
            <li><strong>Anonymous analytics</strong> (Vercel)</li>
          </ul>
          <p className="mt-2">No third-party advertising cookies.</p>
        </Section>

        <Section title="7. Data retention / データ保管期間">
          <ul className="list-disc pl-6 space-y-1">
            <li>Active accounts: indefinite while subscription is active</li>
            <li>Free tier: data lives in your browser only (we don't store it server-side)</li>
            <li>After cancellation: 30-day grace period for re-subscription, then deletion</li>
          </ul>
        </Section>

        <Section title="8. Contact / お問い合わせ">
          <p>Email: <a href="mailto:i.masato0907@gmail.com" className="text-accent hover:underline">i.masato0907@gmail.com</a></p>
        </Section>
      </article>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-[16px] font-medium mb-3">{title}</h2>
      <div className="text-text-secondary">{children}</div>
    </section>
  )
}
