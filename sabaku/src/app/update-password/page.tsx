'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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
    if (password !== confirm) { setError("Passwords don't match"); return }
    if (password.length < 8) { setError('At least 8 characters'); return }
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    router.push('/login?reset=true')
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Set new password</h1>
        <p className="text-[13px] text-text-secondary mb-6">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="New password"
            minLength={8}
            className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-[15px] focus:outline-none focus:border-accent/50 transition-colors"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="Confirm"
            className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-[15px] focus:outline-none focus:border-accent/50 transition-colors"
          />
          {error && <div className="text-[12px] text-red-400">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 text-[14px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
