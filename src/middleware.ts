import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXT_PUBLIC_AUTH_SECRET || 'something' })

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/employee', '/site', '/operation', '/planification', '/card', '/vehicules']
}
