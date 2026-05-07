/**
 * SABAKU pricing plans.
 * Prices in JPY (¥).
 */
export const PLANS = {
  FREE: {
    name: 'Free',
    monthlyPrice: 0,
    stripLimit: 50,
    features: [
      'Up to 50 strips (local storage)',
      'Kanban + Focus views',
      'All keyboard shortcuts',
      'Timer + project grouping',
      'JSON export',
      'Vault sync CLI (open source)',
    ],
  },
  PRO: {
    name: 'Pro',
    monthlyPrice: 800,
    yearlyPrice: 7200, // 25% off
    lifetimePrice: 4900,
    stripLimit: Infinity,
    features: [
      'Everything in Free',
      'Unlimited strips',
      'Cloud sync (up to 3 devices)',
      'Vault auto-sync (CLI w/ Pro account)',
      'Unlimited history',
      'Project analytics dashboard',
      'Priority support',
    ],
  },
} as const

export type PlanType = 'free' | 'pro' | 'lifetime'
