import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPortalSession, getSubscription, isStripeConfigured } from '@/lib/stripe'

export async function POST() {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sub = await getSubscription(user.id)
    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    const url = await createPortalSession({ customerId: sub.stripe_customer_id })
    return NextResponse.json({ url })
  } catch (err) {
    console.error('portal error', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    )
  }
}
