import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'
import type { Subscription } from '@/types/subscription'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY not set')
  _stripe = new Stripe(key)
  return _stripe
}

export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_PRO_MONTHLY_PRICE_ID &&
    process.env.STRIPE_PRO_YEARLY_PRICE_ID
  )
}

interface CheckoutOptions {
  userId: string
  email: string
  priceType: 'monthly' | 'yearly'
}

export async function createCheckoutSession({ userId, email, priceType }: CheckoutOptions): Promise<string> {
  const stripe = getStripe()
  const priceId = priceType === 'monthly'
    ? process.env.STRIPE_PRO_MONTHLY_PRICE_ID!
    : process.env.STRIPE_PRO_YEARLY_PRICE_ID!

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sabaku.kyren.app'

  // Find or create customer (cached in subscriptions table)
  let customerId: string | undefined
  try {
    const sub = await getSubscription(userId)
    customerId = sub?.stripe_customer_id ?? undefined
  } catch { /* ignore */ }

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { user_id: userId },
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    automatic_tax: { enabled: true },
    customer_update: { address: 'auto', name: 'auto' },
    allow_promotion_codes: true,
    success_url: `${appUrl}/?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=canceled`,
    metadata: { user_id: userId },
    subscription_data: { metadata: { user_id: userId } },
  })

  if (!session.url) throw new Error('No checkout URL returned')
  return session.url
}

export async function createPortalSession({ customerId }: { customerId: string }): Promise<string> {
  const stripe = getStripe()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sabaku.kyren.app'
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/`,
  })
  return session.url
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) {
    console.error('getSubscription error', error)
    return null
  }
  return data as Subscription | null
}

export async function isPro(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId)
  if (!sub) return false
  if (sub.plan === 'lifetime') return true
  return sub.plan === 'pro' && sub.status === 'active'
}
