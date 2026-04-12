"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Supabase waitlist
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">Phrasely</h1>
        <p className="text-2xl text-blue-600 font-medium mb-6">
          Sound native, effortlessly.
        </p>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          AI-powered English rewriting for non-native speakers. Transform your
          writing to sound more natural — and learn why each change was made.
        </p>

        {/* Waitlist Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex gap-3 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="px-4 py-3 rounded-lg border border-slate-300 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Join Waitlist
            </button>
          </form>
        ) : (
          <p className="text-green-600 font-medium">
            Thanks! We&apos;ll notify you when Phrasely launches.
          </p>
        )}
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Smart Rewrite */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Smart Rewrite
            </h3>
            <p className="text-slate-600">
              Paste your text, select a tone (Casual / Professional / Academic),
              and get native-sounding output instantly.
            </p>
          </div>

          {/* Why Changed */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Why Changed
            </h3>
            <p className="text-slate-600">
              See Before/After diffs with clear explanations. Learn why each
              change makes your writing sound more natural.
            </p>
          </div>

          {/* Phrase Library */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📖</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Phrase Library
            </h3>
            <p className="text-slate-600">
              Save your favorite phrases and reuse them. Build your personal
              collection of native-sounding expressions.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Simple Pricing
        </h2>
        <p className="text-slate-600 mb-8">
          Start free. Upgrade when you need more.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-4">$0</p>
            <ul className="text-slate-600 text-left space-y-2">
              <li>• 500 characters per request</li>
              <li>• 10 requests per day</li>
              <li>• 10 saved phrases</li>
            </ul>
          </div>
          <div className="bg-blue-600 text-white p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-4">$10/mo</p>
            <ul className="text-left space-y-2">
              <li>• 5,000 characters per request</li>
              <li>• Unlimited requests</li>
              <li>• Unlimited saved phrases</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-500 text-sm">
        <p>© 2026 Kyren. All rights reserved.</p>
      </footer>
    </main>
  );
}
