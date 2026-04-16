"use client";

import { useState, useEffect } from "react";
import { LIMITS, PRICING } from "@/lib/config";

interface Change {
  original: string;
  replacement: string;
  explanation: string;
  explanation_ja?: string;
}

interface RewriteResult {
  rewritten: string;
  changes: Change[];
  usage?: {
    used: number;
    limit: number;
    remaining: number;
    isPro?: boolean;
  };
}

// Limit Modal Component
const LimitModal = ({
  onClose,
  onUpgrade,
}: {
  onClose: () => void;
  onUpgrade: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-[var(--card)] p-6 rounded-xl max-w-md mx-4 border border-[var(--border)]">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
        Daily limit reached
      </h3>
      <p className="text-[var(--muted)] mb-4">
        You&apos;ve used all {LIMITS.FREE_DAILY_REWRITES} free rewrites for
        today. Upgrade to Pro for unlimited rewrites at just $
        {PRICING.PRO_MONTHLY}/mo.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition cursor-pointer"
        >
          Close
        </button>
        <button
          onClick={onUpgrade}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent)]/90 transition cursor-pointer"
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  </div>
);

// Style options with icons
const STYLE_OPTIONS = [
  { value: "casual", label: "Casual", icon: "\u{1F4AC}" },
  { value: "formal", label: "Formal", icon: "\u{1F3E2}" },
  { value: "academic", label: "Academic", icon: "\u{1F393}" },
  { value: "business_email", label: "Business Email", icon: "\u{1F4BC}" },
  { value: "social", label: "Social", icon: "\u{1F377}" },
] as const;

type StyleValue = (typeof STYLE_OPTIONS)[number]["value"];

// Speech synthesis helper
const speak = (text: string) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

// Render text with editable fill-in markers (___)
const RewrittenText = ({ text }: { text: string }) => {
  const parts = text.split(/(_{3,})/);
  if (parts.length === 1) {
    return <p className="text-[var(--foreground)]">{text}</p>;
  }
  return (
    <p className="text-[var(--foreground)]">
      {parts.map((part, i) =>
        /^_{3,}$/.test(part) ? (
          <span
            key={i}
            contentEditable
            suppressContentEditableWarning
            className="inline-block px-2 py-0.5 mx-0.5 rounded bg-amber-500/20 text-amber-300 border border-dashed border-amber-500/50 outline-none focus:border-amber-500 focus:bg-amber-500/30 min-w-[60px] text-center cursor-text"
            title="Click to fill in"
          >
            ___
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
};

// Typewriter demo data
const TYPEWRITER_DEMO = {
  input: "I want to go to the cafe",
  output: "I\u2019m craving a good latte \u2014 wanna grab one?",
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [remainingRewrites, setRemainingRewrites] = useState<number>(
    LIMITS.FREE_DAILY_REWRITES
  );
  const [targetStyle, setTargetStyle] = useState<StyleValue>("casual");
  const [showJapanese, setShowJapanese] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [proEmail, setProEmail] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Typewriter effect state
  const [displayedInput, setDisplayedInput] = useState("");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [phase, setPhase] = useState<
    "typing-input" | "pause" | "typing-output" | "done"
  >("typing-input");

  // Check Pro status and fetch usage on mount
  useEffect(() => {
    const stored = localStorage.getItem("phrasely_pro_email");
    const params = new URLSearchParams(window.location.search);
    const successEmail = params.get("email");

    // Handle Stripe success redirect
    if (params.get("success") === "true" && successEmail) {
      localStorage.setItem("phrasely_pro_email", successEmail);
      setProEmail(successEmail);
      setIsPro(true);
      setRemainingRewrites(-1);
      // Clean URL
      window.history.replaceState({}, "", "/");
      return;
    }

    const emailToCheck = stored || null;
    setProEmail(emailToCheck);

    const usageUrl = emailToCheck
      ? `/api/usage?email=${encodeURIComponent(emailToCheck)}`
      : "/api/usage";

    fetch(usageUrl)
      .then((r) => r.json())
      .then((data) => {
        if (data.isPro) {
          setIsPro(true);
          setRemainingRewrites(-1);
        } else if (typeof data.remaining === "number") {
          setRemainingRewrites(data.remaining);
          // If stored email is not Pro, clear it
          if (emailToCheck) {
            localStorage.removeItem("phrasely_pro_email");
            setProEmail(null);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    const upgradeEmail =
      proEmail || email || prompt("Enter your email for Pro upgrade:");
    if (!upgradeEmail) {
      setCheckoutLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: upgradeEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to start checkout");
      }
    } catch {
      setError("Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Typewriter effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (phase === "typing-input") {
      if (displayedInput.length < TYPEWRITER_DEMO.input.length) {
        timeout = setTimeout(() => {
          setDisplayedInput(
            TYPEWRITER_DEMO.input.slice(0, displayedInput.length + 1)
          );
        }, 50);
      } else {
        timeout = setTimeout(() => setPhase("pause"), 500);
      }
    } else if (phase === "pause") {
      timeout = setTimeout(() => setPhase("typing-output"), 800);
    } else if (phase === "typing-output") {
      if (displayedOutput.length < TYPEWRITER_DEMO.output.length) {
        timeout = setTimeout(() => {
          setDisplayedOutput(
            TYPEWRITER_DEMO.output.slice(0, displayedOutput.length + 1)
          );
        }, 40);
      } else {
        timeout = setTimeout(() => setPhase("done"), 2000);
      }
    } else if (phase === "done") {
      timeout = setTimeout(() => {
        setDisplayedInput("");
        setDisplayedOutput("");
        setPhase("typing-input");
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [phase, displayedInput, displayedOutput]);

  const handleCopy = async () => {
    if (result?.rewritten) {
      await navigator.clipboard.writeText(result.rewritten);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
    setError("");
  };

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    }
  };

  const handleRewrite = async () => {
    if (!inputText.trim()) return;

    if (remainingRewrites <= 0) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          targetStyle,
          ...(proEmail && { proEmail }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          if (data.usage) {
            setRemainingRewrites(data.usage.remaining);
          }
          if (data.error?.includes("Daily")) {
            setShowLimitModal(true);
          } else {
            setError(data.error || "Too many requests. Please wait.");
          }
          return;
        }
        throw new Error(data.error || "Rewrite failed");
      }

      setResult(data);
      if (data.usage) {
        setRemainingRewrites(data.usage.remaining);
      }
    } catch {
      setError("Failed to rewrite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Limit Modal */}
      {showLimitModal && (
        <LimitModal
          onClose={() => setShowLimitModal(false)}
          onUpgrade={() => {
            setShowLimitModal(false);
            handleUpgrade();
          }}
        />
      )}

      {/* Hero */}
      <section
        id="waitlist"
        className="max-w-4xl mx-auto px-6 pt-16 pb-8 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-3">
          Phrasely
        </h1>
        <p className="text-xl md:text-2xl text-[var(--accent)] font-medium mb-2">
          Sound native, effortlessly.
        </p>
        <p className="text-sm md:text-base text-[var(--muted)] mb-4">
          {"\u65E5\u672C\u8A9E\u306E\u611F\u899A\u3092\u6B8B\u3057\u305F\u307E\u307E\u3001\u30CD\u30A4\u30C6\u30A3\u30D6\u306B\u4F1D\u308F\u308B\u82F1\u8A9E\u306B\u3002"}
        </p>
        <p className="text-base text-[var(--muted)] max-w-2xl mx-auto mb-8">
          AI-powered English rewriting for non-native speakers. Transform your
          writing to sound more natural &mdash; and learn why each change was
          made.
        </p>

        {/* Waitlist Form */}
        {!submitted ? (
          <form
            onSubmit={handleWaitlist}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="px-4 py-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--accent)]/25"
            >
              Join Waitlist
            </button>
          </form>
        ) : (
          <p className="text-[var(--success)] font-medium mb-8">
            Thanks! We&apos;ll notify you when Phrasely Pro launches.
          </p>
        )}
      </section>

      {/* Typewriter Demo */}
      <section className="max-w-2xl mx-auto px-6 pb-12">
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[var(--muted)] text-sm font-medium shrink-0 w-14">
                Input:
              </span>
              <p className="text-[var(--foreground)] min-h-[1.5rem]">
                {displayedInput}
                {phase === "typing-input" && (
                  <span className="inline-block w-0.5 h-5 bg-[var(--accent)] ml-0.5 animate-pulse" />
                )}
              </p>
            </div>
            <div
              className={`flex justify-center transition-opacity duration-300 ${phase === "typing-input" ? "opacity-30" : "opacity-100"}`}
            >
              <span className="text-[var(--accent)] text-xl">{"\u2193"}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[var(--muted)] text-sm font-medium shrink-0 w-14">
                Result:
              </span>
              <p className="text-[var(--success)] min-h-[1.5rem]">
                {displayedOutput}
                {phase === "typing-output" && (
                  <span className="inline-block w-0.5 h-5 bg-[var(--success)] ml-0.5 animate-pulse" />
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Rewrite Demo */}
      <section id="rewrite-demo" className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-6">
          Try Smart Rewrite
        </h2>

        {/* Style Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 overflow-x-auto pb-2 -mx-2 px-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.value}
              onClick={() => setTargetStyle(style.value)}
              className={`px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                targetStyle === style.value
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--card-hover)]"
              }`}
            >
              <span>{style.icon}</span>
              <span>{style.label}</span>
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here... (English or Japanese)"
            className="w-full min-h-[160px] px-4 py-3 pr-10 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
          />
          {inputText && (
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition cursor-pointer text-sm"
              title="Clear"
            >
              {"\u00D7"}
            </button>
          )}
          <span className="absolute bottom-3 right-3 text-xs text-[var(--muted)]">
            {inputText.length} / {isPro ? LIMITS.PRO_MAX_CHARS : LIMITS.FREE_MAX_CHARS}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-3">
          <span className="text-sm text-[var(--muted)]">
            {isPro ? (
              <span className="text-[var(--accent)]">Pro — Unlimited rewrites</span>
            ) : (
              `${remainingRewrites}/${LIMITS.FREE_DAILY_REWRITES} rewrites remaining today`
            )}
          </span>
          <button
            onClick={handleRewrite}
            disabled={loading || !inputText.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-[var(--accent)] text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--accent)]/25 flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Rewriting...</span>
              </>
            ) : (
              "Rewrite"
            )}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-[var(--error)] text-center">{error}</p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] animate-pulse">
              <div className="h-4 w-20 bg-[var(--background)] rounded mb-3" />
              <div className="h-4 w-full bg-[var(--background)] rounded mb-2" />
              <div className="h-4 w-3/4 bg-[var(--background)] rounded" />
            </div>
            <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] animate-pulse">
              <div className="h-4 w-24 bg-[var(--background)] rounded mb-3" />
              <div className="h-16 w-full bg-[var(--background)] rounded" />
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="mt-6 space-y-4">
            {/* Rewritten Text */}
            <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[var(--muted)]">
                  Rewritten
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speak(result.rewritten)}
                    className="px-3 py-2 min-h-[36px] text-xs font-medium rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition cursor-pointer"
                    title="Listen to pronunciation"
                  >
                    {"\u{1F50A}"}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 min-h-[36px] text-xs font-medium rounded bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition cursor-pointer min-w-[70px]"
                  >
                    {copied ? (
                      <span className="text-[var(--success)]">
                        {"\u2713"} Copied
                      </span>
                    ) : (
                      "Copy"
                    )}
                  </button>
                </div>
              </div>
              <RewrittenText text={result.rewritten} />
            </div>

            {/* Changes */}
            {result.changes.length > 0 && (
              <div className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-[var(--muted)]">
                    Why Changed
                  </h3>
                  <button
                    onClick={() => setShowJapanese(!showJapanese)}
                    className={`px-3 py-2 min-h-[36px] text-xs font-medium rounded transition cursor-pointer ${
                      showJapanese
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {showJapanese
                      ? "\u65E5\u672C\u8A9E ON"
                      : "\u65E5\u672C\u8A9E"}
                  </button>
                </div>
                <div className="space-y-3">
                  {result.changes.map((change, i) => (
                    <div
                      key={i}
                      className="p-3 rounded bg-[var(--background)] border border-[var(--border)]"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded bg-red-500/15 text-red-400 text-sm line-through">
                          {change.original}
                        </span>
                        <span className="text-[var(--muted)]">
                          {"\u2192"}
                        </span>
                        <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 text-sm">
                          {change.replacement}
                        </span>
                        <button
                          onClick={() => speak(change.replacement)}
                          className="px-2.5 py-1.5 min-h-[32px] text-xs rounded bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition cursor-pointer"
                          title="Listen"
                        >
                          {"\u{1F50A}"}
                        </button>
                      </div>
                      <p className="text-sm text-[var(--muted)]">
                        {showJapanese && change.explanation_ja
                          ? change.explanation_ja
                          : change.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-8">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] transition-all duration-200 hover:border-[var(--accent)] hover:-translate-y-1">
            <div className="w-12 h-12 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">{"\u2728"}</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Smart Rewrite
            </h3>
            <p className="text-[var(--muted)] text-sm">
              Paste your text, select a tone, and get native-sounding output
              instantly.
            </p>
          </div>
          <div className="group bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] transition-all duration-200 hover:border-[var(--accent)] hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">{"\u{1F4DA}"}</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Why Changed
            </h3>
            <p className="text-[var(--muted)] text-sm">
              See Before/After diffs with clear explanations. Learn why each
              change matters.
            </p>
          </div>
          <div className="group bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] transition-all duration-200 hover:border-[var(--accent)] hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">{"\u{1F4D6}"}</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Phrase Library
            </h3>
            <p className="text-[var(--muted)] text-sm">
              Save your favorite phrases and build your personal collection.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">
          Simple Pricing
        </h2>
        <p className="text-[var(--muted)] mb-8">
          Start free. Upgrade when you need more.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)]">
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Free
            </h3>
            <p className="text-3xl font-bold text-[var(--foreground)] mb-4">
              $0
            </p>
            <ul className="text-[var(--muted)] text-left space-y-2 text-sm">
              <li>
                {"\u2022"} {LIMITS.FREE_DAILY_REWRITES} rewrites per day
              </li>
              <li>
                {"\u2022"} {LIMITS.FREE_MAX_CHARS} characters per request
              </li>
              <li>{"\u2022"} Basic phrase library</li>
            </ul>
          </div>
          <div className="bg-[var(--accent)] text-white p-6 rounded-xl relative overflow-hidden">
            {isPro && (
              <div className="absolute top-3 right-3 bg-white/20 text-xs px-2 py-1 rounded-full">
                Active
              </div>
            )}
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-1">
              ${PRICING.PRO_MONTHLY}
              <span className="text-lg font-normal">/mo</span>
            </p>
            <p className="text-sm opacity-80 mb-4">
              or ${PRICING.PRO_ANNUAL_MONTHLY}/mo billed annually
            </p>
            <ul className="text-left space-y-2 text-sm mb-4">
              <li>{"\u2022"} Unlimited rewrites</li>
              <li>
                {"\u2022"} {LIMITS.PRO_MAX_CHARS.toLocaleString()} characters
                per request
              </li>
              <li>{"\u2022"} Unlimited phrase library</li>
              <li>{"\u2022"} Priority support</li>
            </ul>
            {!isPro && (
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="w-full py-2.5 bg-white text-[var(--accent)] font-semibold rounded-lg hover:bg-white/90 transition cursor-pointer disabled:opacity-50"
              >
                {checkoutLoading ? "Loading..." : "Get Pro"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-[var(--muted)] text-sm border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <a
              href="/privacy"
              className="hover:text-[var(--accent)] transition"
            >
              Privacy
            </a>
            <a href="/terms" className="py-2 hover:text-[var(--accent)] transition">
              Terms
            </a>
            <span className="order-first sm:order-none">
              {"\u00A9"} 2026{" "}
              <a
                href="https://kyren.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition"
              >
                Kyren
              </a>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
