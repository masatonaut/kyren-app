'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Link href="/" className="text-accent hover:underline">Back to app</Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-4">
      <Link href="/login" className="absolute top-4 left-4 flex items-center gap-1 text-[13px] text-text-tertiary hover:text-text-secondary">
        <ArrowLeft size={14} />
        Back to login
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Reset password</h1>
        <p className="text-[13px] text-text-secondary mb-6">We'll send you a link to set a new password.</p>

        {sent ? (
          <div className="flex items-start gap-2 p-4 bg-priority-nrm/10 border border-green-500/30 rounded text-[13px] text-green-400">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Email sent</p>
              <p className="text-text-secondary">Check {email} for the reset link.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-[15px] focus:outline-none focus:border-accent/50 transition-colors"
            />
            {error && <div className="text-[12px] text-red-400">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 text-[14px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
