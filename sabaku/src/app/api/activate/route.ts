import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

interface GumroadVerifyResponse {
  success: boolean
  uses?: number
  purchase?: {
    sale_id: string
    email: string
    refunded?: boolean
    chargebacked?: boolean
    [key: string]: unknown
  }
  message?: string
}

export async function POST(request: Request) {
  try {
    const productId = process.env.GUMROAD_PRODUCT_ID
    if (!productId) {
      return NextResponse.json({ error: 'License activation is not yet configured.' }, { status: 503 })
    }

    const { licenseKey } = await request.json()
    if (!licenseKey || typeof licenseKey !== 'string') {
      return NextResponse.json({ error: 'License key required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in first' }, { status: 401 })
    }

    const normalized = licenseKey.trim().toUpperCase()

    // Verify with Gumroad
    const verifyRes = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_id: productId,
        license_key: normalized,
        increment_uses_count: 'false',
      }),
    })
    const result = (await verifyRes.json()) as GumroadVerifyResponse

    if (!result.success) {
      return NextResponse.json({ error: result.message ?? 'Invalid license key' }, { status: 400 })
    }

    if (result.purchase?.refunded || result.purchase?.chargebacked) {
      return NextResponse.json({ error: 'This license has been refunded.' }, { status: 400 })
    }

    // Insert via service client (bypass RLS)
    const service = createServiceClient()

    // Check if already activated by another account
    const { data: existing } = await service
      .from('lifetime_licenses')
      .select('user_id')
      .eq('license_key', normalized)
      .maybeSingle()

    if (existing && existing.user_id !== user.id) {
      return NextResponse.json({ error: 'This license is already activated on another account.' }, { status: 409 })
    }

    // Upsert license + subscription
    const { error: licErr } = await service.from('lifetime_licenses').upsert({
      user_id: user.id,
      license_key: normalized,
      gumroad_purchase_id: result.purchase?.sale_id,
      gumroad_email: result.purchase?.email,
      activated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    if (licErr) {
      console.error('insert license error', licErr)
      return NextResponse.json({ error: 'Failed to activate' }, { status: 500 })
    }

    await service.from('subscriptions').upsert({
      user_id: user.id,
      plan: 'lifetime',
      status: 'active',
      current_period_end: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('activate error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
