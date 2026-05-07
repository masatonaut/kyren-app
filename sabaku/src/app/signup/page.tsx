'use client'

import { useState } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
})

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-2xl font-bold tracking-tight mb-3">Sign up unavailable</h1>
          <p className="text-[13px] text-text-secondary mb-4">
            Sign up is unavailable until Supabase is connected.
          </p>
          <Link href="/" className="inline-block px-4 py-2 text-[13px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors">
            Back to app
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const result = schema.safeParse({ email, password, confirm })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid input')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setSuccess(true)
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center px-4">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-1 text-[13px] text-text-tertiary hover:text-text-secondary">
        <ArrowLeft size={14} />
        Back
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Create account</h1>
        <p className="text-[13px] text-text-secondary mb-6">Start using SABAKU with cloud sync.</p>

        {success ? (
          <div className="flex items-start gap-2 p-4 bg-priority-nrm/10 border border-green-500/30 rounded text-[13px] text-green-400">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Check your email</p>
              <p className="text-text-secondary">
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
              </p>
            </div>
          </div>
        ) : (
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
              <label className="text-[12px] text-text-secondary block mb-1.5">Password (8+ chars)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-[15px] focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[12px] text-text-secondary block mb-1.5">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
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
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        )}

        <p className="mt-6 text-[13px] text-text-secondary text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
        <p className="mt-2 text-[11px] text-text-tertiary text-center">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="hover:text-text-secondary">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="hover:text-text-secondary">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
