import { NextResponse, NextRequest } from 'next/server'

// Note: We can't use getServerSession in middleware directly.
// Authentication should be handled in route handlers using:
// import { getServerSession } from 'next-auth/next';

export async function middleware(request: NextRequest) {
  const { pathname: targetRoute } = request.nextUrl;

  // With server-side sessions using getServerSession,
  // authentication should be handled in the route handlers, not middleware.
  // Middleware doesn't have access to getServerSession.

  // Minimal header for debugging/logging
  const headers = new Headers({
    'x-fastnear-log-targetRoute': targetRoute
  });

  // Pass through all requests, let route handlers manage authentication
  return NextResponse.next({
    headers,
  });
}

// Only include routes that need any middleware processing
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pricing/:path+'
  ]
}

/*

// With this approach, your protected routes would check authentication like this:

// In a route handler
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Handle unauthenticated access
    return redirect('/api/auth/signin');
  }

  // Continue with authenticated access
}

 */
