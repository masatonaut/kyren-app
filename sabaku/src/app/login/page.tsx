'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <LoginInner />
    </Suspense>
  )
}

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isSupabaseConfigured()) {
    return <NotConfiguredState />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    router.push(next)
    router.refresh()
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center px-4">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-1 text-[13px] text-text-tertiary hover:text-text-secondary">
        <ArrowLeft size={14} />
        Back
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Sign in</h1>
        <p className="text-[13px] text-text-secondary mb-6">Welcome back to SABAKU.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] text-text-secondary block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-[15px] focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12px] text-text-secondary">Password</label>
              <Link href="/reset-password" className="text-[12px] text-accent hover:underline">Forgot?</Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-[15px] focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-priority-urg/10 border border-red-500/30 rounded text-[12px] text-red-400">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 text-[14px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-text-tertiary">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full px-4 py-2.5 text-[14px] bg-bg-secondary border border-border text-text-primary rounded hover:bg-bg-tertiary transition-colors"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-[13px] text-text-secondary text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-accent hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

function NotConfiguredState() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center px-4">
      <div className="max-w-sm text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-3">Auth not configured</h1>
        <p className="text-[13px] text-text-secondary mb-4">
          Sign in is unavailable until Supabase is connected. SABAKU works locally — go back and use the app with localStorage.
        </p>
        <Link href="/" className="inline-block px-4 py-2 text-[13px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors">
          Back to app
        </Link>
      </div>
    </div>
  )
}
