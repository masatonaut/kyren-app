'use client'

import { useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

interface UseAuthReturn {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  isConfigured: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [isConfigured])

  const signOut = useCallback(async () => {
    if (!isConfigured) return
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }, [isConfigured])

  return { user, loading, signOut, isConfigured }
}
