import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/landing',
  '/pricing',
  '/tokushoho',
  '/privacy',
  '/terms',
  '/login',
  '/signup',
  '/reset-password',
  '/update-password',
  '/auth/callback',
]

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname.startsWith('/api')) return true
  if (pathname === '/sw.js' || pathname === '/manifest.json') return true
  if (pathname.startsWith('/icons/')) return true
  return false
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // If Supabase isn't configured, skip session refresh
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Logged-in user visiting /login or /signup → home
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // /activate requires login
  if (!user && pathname === '/activate') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', '/activate')
    return NextResponse.redirect(url)
  }

  // No other auth-gating: SABAKU is local-first; everything else is public
  void isPublicPath
  return supabaseResponse
}
