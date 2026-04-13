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
            <p>
              We collect information you provide directly to us, such as your
              email address when you join our waitlist, and the text you submit
              for rewriting.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide and improve our rewriting service</li>
              <li>Send you updates about Phrasely (if you opted in)</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              3. Data Storage
            </h2>
            <p>
              Your submitted text is processed in real-time and is not stored
              permanently. Waitlist emails are stored securely and will not be
              shared with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              4. Contact
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
