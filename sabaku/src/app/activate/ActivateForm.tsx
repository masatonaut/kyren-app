'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function ActivateForm() {
  const router = useRouter()
  const { user, loading: authLoading, isConfigured } = useAuth()
  const [licenseKey, setLicenseKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isConfigured) {
    return (
      <div className="text-center text-[13px] text-text-secondary">
        License activation is unavailable. Please come back soon.
      </div>
    )
  }

  if (authLoading) return <div className="text-center text-text-tertiary text-[13px]">Loading…</div>

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-[13px] text-text-secondary mb-4">Please sign in to activate your Lifetime license.</p>
        <Link href="/login?next=/activate" className="inline-block px-4 py-2 text-[13px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors">
          Sign in
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: licenseKey.trim().toUpperCase() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Activation failed')
        return
      }
      setSuccess(true)
      setTimeout(() => router.push('/'), 1500)
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-start gap-2 p-4 bg-priority-nrm/10 border border-green-500/30 rounded text-[13px] text-green-400">
        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">License activated!</p>
          <p className="text-text-secondary">Pro features are now enabled. Redirecting…</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-[12px] text-text-secondary block mb-1.5">License key</label>
        <input
          type="text"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          required
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-[15px] font-mono uppercase tracking-wider focus:outline-none focus:border-accent/50 transition-colors"
        />
        <p className="mt-2 text-[11px] text-text-tertiary">
          Find this in the email you received after purchasing on Gumroad.
        </p>
      </div>
      {error && (
        <div className="flex items-start gap-2 p-3 bg-priority-urg/10 border border-red-500/30 rounded text-[12px] text-red-400">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      <button
        type="submit"
        disabled={loading || !licenseKey.trim()}
        className="w-full px-4 py-2.5 text-[14px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? 'Activating…' : 'Activate license'}
      </button>
    </form>
  )
}
