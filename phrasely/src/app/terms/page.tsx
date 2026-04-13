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
              By accessing or using Phrasely, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              2. Description of Service
            </h2>
            <p>
              Phrasely is an AI-powered English rewriting tool designed to help
              non-native speakers improve their writing. The service transforms
              text to sound more natural while providing explanations for
              changes made.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              3. User Responsibilities
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                Use the service only for lawful purposes
              </li>
              <li>
                Not submit content that is illegal, harmful, or violates the
                rights of others
              </li>
              <li>
                Not attempt to circumvent usage limits or access controls
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              4. Intellectual Property
            </h2>
            <p>
              You retain all rights to the content you submit. Phrasely does not
              claim ownership of your original text or the rewritten output.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              5. Limitation of Liability
            </h2>
            <p>
              Phrasely is provided &quot;as is&quot; without warranties of any kind. We
              are not liable for any damages arising from your use of the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
              6. Contact
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
