import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow all requests to the dashboard for now
  // You can add authentication logic here later if needed
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}

