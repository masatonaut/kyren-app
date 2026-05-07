import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — SABAKU',
  description: 'Terms governing the use of SABAKU.',
}

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-[13px] text-text-tertiary mb-10">利用規約 · Last updated 2026-05-07</p>

        <Section title="1. Service / サービス">
          <p>SABAKU is a flight-strip-style task management web application operated by Masato Nakamura ("we").</p>
        </Section>

        <Section title="2. Plans / プラン">
          <p><strong>Free</strong>: Up to 50 strips stored locally in your browser. No account required.</p>
          <p className="mt-2"><strong>Pro</strong> (¥800/mo or ¥7,200/yr): Cloud sync, unlimited strips, Vault auto-sync, analytics. Auto-renewing subscription via Stripe.</p>
          <p className="mt-2"><strong>Lifetime</strong> (¥4,900 one-time): Same features as Pro, paid once via Gumroad. Limited to first 100 customers.</p>
        </Section>

        <Section title="3. Account / アカウント">
          <p>To use Pro features, create an account. You're responsible for maintaining the confidentiality of your password.</p>
        </Section>

        <Section title="4. Acceptable use / 利用上の注意">
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Reverse engineer or attempt to bypass Pro feature gates</li>
            <li>Resell access to your account</li>
            <li>Submit content that violates laws or third-party rights</li>
            <li>Attempt to disrupt or compromise the service</li>
          </ul>
        </Section>

        <Section title="5. Intellectual property / 知的財産権">
          <p><strong>Your content</strong>: You own your task data. We claim no rights to it.</p>
          <p className="mt-2"><strong>Our app</strong>: SABAKU's UI code, branding, and Pro infrastructure are owned by Kyren / Masato Nakamura. Open-source components (UI scaffolding, sync CLI) are MIT-licensed.</p>
        </Section>

        <Section title="6. Cancellation and refund / キャンセル・返金">
          <p>Cancel a Pro subscription anytime via Stripe Customer Portal. You retain access until the end of the current billing period.</p>
          <p className="mt-2">7-day no-questions-asked refund for first-time purchases. Email <a href="mailto:i.masato0907@gmail.com" className="text-accent hover:underline">i.masato0907@gmail.com</a>.</p>
        </Section>

        <Section title="7. Service availability / サービス提供">
          <p>We aim for 99% uptime but make no SLA guarantees. Scheduled maintenance may be performed with reasonable notice.</p>
        </Section>

        <Section title="8. Liability / 免責">
          <p>Service provided "as is." We are not liable for data loss, indirect damages, or consequential damages. Maximum aggregate liability is the amount you paid in the past 12 months.</p>
          <p className="mt-2">Always export your data periodically (Settings → Export to JSON).</p>
        </Section>

        <Section title="9. Termination / 終了">
          <p>We may terminate accounts that violate these terms. Users can self-delete their account anytime; we'll provide 30 days to export data and prorate refunds for the unused period.</p>
        </Section>

        <Section title="10. Disputes / 紛争解決">
          <p>Governing law: Japan. Exclusive jurisdiction: Tokyo District Court.</p>
        </Section>

        <Section title="11. Changes / 変更">
          <p>We may update these terms. Material changes will be announced 30 days in advance via email.</p>
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
