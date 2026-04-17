"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-3">
          Something went wrong
        </h1>
        <p className="text-sm text-[var(--muted)] mb-2">
          {
            "\u4E88\u671F\u305B\u306C\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002"
          }
        </p>
        <p className="text-sm text-[var(--muted)] mb-6">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-[var(--muted)] mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 min-h-[44px] bg-[var(--accent)] text-white font-medium rounded-lg hover:bg-[var(--accent)]/90 transition cursor-pointer"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-5 py-2.5 min-h-[44px] bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] font-medium rounded-lg hover:text-[var(--foreground)] transition inline-flex items-center"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
