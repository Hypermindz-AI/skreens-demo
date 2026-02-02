import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware(async (authFn, req) => {
  const pathname = req.nextUrl.pathname

  // Bypass Clerk for MCP API routes - they use API key auth
  if (pathname.startsWith('/api/mcp')) {
    return NextResponse.next()
  }

  // Bypass for static assets and ads
  if (pathname.startsWith('/_next') || pathname.startsWith('/ads') || pathname.includes('.')) {
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
