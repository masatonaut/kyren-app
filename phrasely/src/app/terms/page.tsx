import Link from "next/link";

export default function TermsPage() {
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
          Terms of Service
        </h1>

        <div className="prose prose-invert max-w-none space-y-6 text-[var(--muted)]">
          <p>Last updated: April 2026</p>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Phrasely (&quot;Service&quot;), operated by
              Kyren (&quot;we&quot;, &quot;us&quot;), you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please
              do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              2. Description of Service
            </h2>
            <p>
              Phrasely is an AI-powered English rewriting tool designed to help
              non-native speakers improve their writing. The Service transforms
              text to sound more natural while providing explanations for
              changes made. The Service uses third-party AI providers
              (Anthropic) to process text submitted by users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              3. User Responsibilities
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Service only for lawful purposes</li>
              <li>
                Not submit content that is illegal, harmful, or violates the
                rights of others
              </li>
              <li>
                Not attempt to circumvent usage limits, rate limiting, or access
                controls
              </li>
              <li>
                Not use automated systems or bots to access the Service
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              4. Pricing and Subscription (Pro Plan)
            </h2>
            <p>
              The Pro plan is offered as a recurring monthly subscription at
              USD $4.99/month (or USD $3.99/month billed annually at $47.88/year),
              payable in advance. Prices are shown in US Dollars and converted
              to your local currency by our payment processor (Stripe).
            </p>
            <p className="mt-2">
              <strong className="text-[var(--foreground)]">
                Automatic renewal:
              </strong>{" "}
              Subscriptions renew automatically at the end of each billing
              period unless canceled before renewal. Your payment method will be
              charged automatically.
            </p>
            <p className="mt-2">
              <strong className="text-[var(--foreground)]">
                Cancellation:
              </strong>{" "}
              You may cancel your subscription at any time. Cancellation takes
              effect at the end of the current billing period; you retain Pro
              access until then. To cancel, contact{" "}
              <a
                href="mailto:hey@kyren.app"
                className="text-[var(--accent)] hover:underline"
              >
                hey@kyren.app
              </a>{" "}
              with your subscription email.
            </p>
            <p className="mt-2">
              <strong className="text-[var(--foreground)]">Refunds:</strong>{" "}
              Due to the digital nature of the Service, we do not offer refunds
              for partial billing periods. Refunds may be considered on a
              case-by-case basis for billing errors or extended service
              outages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              5. Payment Processing
            </h2>
            <p>
              Payments are processed securely by Stripe. We do not store your
              credit card information on our servers. By subscribing, you agree
              to Stripe&apos;s terms of service and privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              6. Service Availability
            </h2>
            <p>
              We strive to maintain high service availability but do not
              guarantee uninterrupted access. The Service may be unavailable
              during scheduled maintenance or due to factors beyond our control
              (including third-party API outages).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              7. Intellectual Property
            </h2>
            <p>
              You retain all rights to the content you submit. Phrasely does not
              claim ownership of your original text or the rewritten output. You
              grant us a limited license to process your input through our AI
              providers solely to deliver the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              8. Termination
            </h2>
            <p>
              We may suspend or terminate your access to the Service if you
              violate these Terms. Pro subscribers will receive a prorated
              refund in such cases only if termination is not due to a material
              breach on your part.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              9. Limitation of Liability
            </h2>
            <p>
              Phrasely is provided &quot;as is&quot; without warranties of any
              kind. We are not liable for any damages arising from your use of
              the Service, including but not limited to lost data, lost
              business, or damages caused by AI-generated output. Our total
              liability is limited to the amount you paid in the 3 months prior
              to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              10. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Material changes
              will be communicated via email (for subscribers) or on the
              website. Continued use of the Service after changes constitutes
              acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              11. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of Japan. For Japanese
              customers, please also refer to our{" "}
              <Link
                href="/tokushoho"
                className="text-[var(--accent)] hover:underline"
              >
                特定商取引法に基づく表記
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              12. Contact
            </h2>
            <p>
              For questions about these Terms, please contact us at{" "}
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
