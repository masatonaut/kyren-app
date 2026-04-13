import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--foreground)] mb-4">
          404
        </h1>
        <p className="text-xl text-[var(--muted)] mb-8">
          ページが見つかりません
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-[var(--accent)]/25"
        >
          ホームに戻る
        </Link>
      </div>
    </main>
  );
}
