'use client'

import dynamic from 'next/dynamic'

// Dynamically load Vercel Analytics — don't crash if package is missing
const VercelAnalytics = dynamic(
  () => import('@vercel/analytics/next').then((m) => m.Analytics).catch(() => () => null),
  { ssr: false }
)

const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then((m) => m.SpeedInsights).catch(() => () => null),
  { ssr: false }
)

export default function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  )
}
