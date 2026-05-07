import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const priceType: 'monthly' | 'yearly' = body.priceType === 'yearly' ? 'yearly' : 'monthly'

    const url = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      priceType,
    })
    return NextResponse.json({ url })
  } catch (err) {
    console.error('checkout error', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    )
  }
}
