import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

function mapStatus(s: Stripe.Subscription.Status): 'active' | 'canceled' | 'past_due' {
  switch (s) {
    case 'active':
    case 'trialing':
      return 'active'
    case 'past_due':
    case 'unpaid':
      return 'past_due'
    default:
      return 'canceled'
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const sig = request.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  const body = await request.text()
  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error('webhook signature verify failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        if (!userId) break
        const subRef = session.subscription
        const sub = subRef
          ? await stripe.subscriptions.retrieve(typeof subRef === 'string' ? subRef : subRef.id)
          : null

        const periodEnd = sub && 'current_period_end' in sub
          ? (sub as unknown as { current_period_end: number }).current_period_end
          : null

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
          stripe_subscription_id: sub?.id ?? null,
          plan: 'pro',
          status: sub ? mapStatus(sub.status) : 'active',
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id
        if (!userId) break
        const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end
        await supabase.from('subscriptions').update({
          stripe_subscription_id: sub.id,
          plan: event.type === 'customer.subscription.deleted' ? 'free' : 'pro',
          status: event.type === 'customer.subscription.deleted' ? 'canceled' : mapStatus(sub.status),
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId)
        break
      }
    }
  } catch (err) {
    console.error('webhook handling error', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
