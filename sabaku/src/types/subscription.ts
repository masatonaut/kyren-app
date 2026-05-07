export type SubscriptionPlan = 'free' | 'pro' | 'lifetime'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due'

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_end: string | null
  created_at: string
  updated_at: string
}
