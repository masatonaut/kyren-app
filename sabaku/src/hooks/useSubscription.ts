'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { Subscription } from '@/types/subscription'

interface UseSubscriptionReturn {
  subscription: Subscription | null
  isPro: boolean
  loading: boolean
}

export function useSubscription(user: User | null): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured() || !user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    let cancelled = false
    const supabase = createClient()

    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) console.error('useSubscription error', error)
        setSubscription((data as Subscription | null) ?? null)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [user])

  const isPro = subscription
    ? subscription.plan === 'lifetime' || (subscription.plan === 'pro' && subscription.status === 'active')
    : false

  return { subscription, isPro, loading }
}
