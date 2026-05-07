'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { ExternalLink, Loader2 } from 'lucide-react'

const GUMROAD_URL = 'https://gumroad.com/l/sabaku-lifetime' // placeholder; user will replace

export function SubscribeButton({ priceType, label }: { priceType: 'monthly' | 'yearly'; label: string }) {
  const router = useRouter()
  const { user, isConfigured } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!isConfigured) {
      alert('Auth not yet configured. Please come back soon.')
      return
    }
    if (!user) {
      router.push(`/login?next=${encodeURIComponent('/pricing')}`)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error || 'Checkout failed')
    } catch {
      alert('Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full px-4 py-2 text-[13px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {label}
    </button>
  )
}

export function ManageSubscriptionButton() {
  const { user } = useAuth()
  const { isPro, loading: subLoading } = useSubscription(user)
  const [loading, setLoading] = useState(false)

  if (!user || subLoading || !isPro) return null

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error || 'Portal failed')
    } catch {
      alert('Portal failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8 p-4 bg-accent/10 border border-accent/30 rounded text-center">
      <p className="text-[13px] text-accent mb-2">You're on Pro. 🎉</p>
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-[12px] text-accent hover:underline disabled:opacity-50"
      >
        {loading ? 'Loading…' : 'Manage subscription'}
      </button>
    </div>
  )
}

export function LifetimeButton() {
  return (
    <a
      href={GUMROAD_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full px-4 py-2 text-[13px] font-medium bg-bg-primary border border-border text-text-primary rounded hover:bg-bg-tertiary transition-colors flex items-center justify-center gap-2"
    >
      Buy on Gumroad
      <ExternalLink size={12} />
    </a>
  )
}
