import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-[var(--muted)] hover:text-[var(--accent)] transition text-sm mb-8 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-invert max-w-none space-y-6 text-[var(--muted)]">
          <p>Last updated: April 2026</p>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              1. Information We Collect
            </h2>
            <p>We collect the following information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong className="text-[var(--foreground)]">
                  Waitlist emails:
                </strong>{" "}
                When you join our waitlist
              </li>
              <li>
                <strong className="text-[var(--foreground)]">
                  Submitted text:
                </strong>{" "}
                The text you submit for rewriting
              </li>
              <li>
                <strong className="text-[var(--foreground)]">
                  Usage data:
                </strong>{" "}
                Anonymized IP hash (SHA-256) and request metadata for rate
                limiting. Raw IP addresses are never stored.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">
                  Payment information:
                </strong>{" "}
                For Pro subscribers, we store your email and Stripe customer ID.
                Credit card details are handled directly by Stripe and never
                touch our servers.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">
                  Analytics:
                </strong>{" "}
                Anonymous page view and performance data via Vercel Analytics.
                No cookies or personal identifiers are used.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide and improve our rewriting service</li>
              <li>Process subscription payments (for Pro users)</li>
              <li>Enforce rate limits and prevent abuse</li>
              <li>Send you updates about Phrasely (if you opted in)</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              3. Third-Party Services
            </h2>
            <p>We share data with the following processors:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong className="text-[var(--foreground)]">
                  Anthropic:
                </strong>{" "}
                Text you submit is sent to Anthropic&apos;s Claude API for
                processing. Anthropic may retain the data per their policies.
                See{" "}
                <a
                  href="https://www.anthropic.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  Anthropic Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-[var(--foreground)]">
                  Stripe:
                </strong>{" "}
                Handles payment processing for Pro subscriptions. See{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  Stripe Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-[var(--foreground)]">
                  Supabase:
                </strong>{" "}
                Stores waitlist emails, subscription records, and usage logs.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">
                  Vercel:
                </strong>{" "}
                Hosts the application and provides anonymous analytics.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              4. Data Retention
            </h2>
            <p>
              Submitted text is processed in real-time and is not stored
              permanently on our servers (though it may be retained by
              Anthropic per their policies). Usage logs are retained for up to
              90 days for rate limiting and abuse prevention. Subscription
              records are kept as long as your account is active plus 7 years
              for tax and accounting purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              5. Your Rights
            </h2>
            <p>
              You have the right to request access to, correction of, or
              deletion of your personal data. To exercise these rights, contact
              us at{" "}
              <a
                href="mailto:hey@kyren.app"
                className="text-[var(--accent)] hover:underline"
              >
                hey@kyren.app
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              6. Contact
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:hey@kyren.app"
                className="text-[var(--accent)] hover:underline"
              >
                hey@kyren.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
