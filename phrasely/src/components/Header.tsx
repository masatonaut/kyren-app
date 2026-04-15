"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("phrasely_pro_email");
    if (email) {
      fetch(`/api/usage?email=${encodeURIComponent(email)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.isPro) setIsPro(true);
        })
        .catch(() => {});
    }
  }, []);

  const scrollToDemo = () => {
    const demoSection = document.getElementById("rewrite-demo");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { href: "/", label: "Rewrite" },
    { href: "/library", label: "Library" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold text-[var(--foreground)]"
          >
            Phrasely
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  pathname === link.href
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isPro && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30">
              Pro
            </span>
          )}
          {pathname === "/" ? (
            <button
              onClick={scrollToDemo}
              className="px-4 py-2 bg-[var(--accent)] text-white font-medium rounded-lg hover:bg-[var(--accent)]/90 transition cursor-pointer text-sm"
            >
              Try Free
            </button>
          ) : (
            <Link
              href="/"
              className="px-4 py-2 bg-[var(--accent)] text-white font-medium rounded-lg hover:bg-[var(--accent)]/90 transition text-sm"
            >
              Try Rewrite
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
