import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Si el usuario entra al root sin locale
  if (pathname === '/' || pathname === '') {
    const url = request.nextUrl.clone()
    url.pathname = '/en'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Ejecutar middleware solo en rutas sin _next, api, ni assets
    '/((?!_next|api|.*\\..*).*)',
  ],
}
