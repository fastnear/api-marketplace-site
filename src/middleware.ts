import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname: targetRoute } = request.nextUrl;
  
  // Get the user's session token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Add debug headers
  const headers = new Headers({
    'x-fastnear-log-targetRoute': targetRoute,
  });

  // Check if the route requires authentication
  if (targetRoute.startsWith('/dashboard')) {
    // Redirect to login if not authenticated
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', targetRoute);
      return NextResponse.redirect(url);
    }
  }

  // Add the debug header to the response
  return NextResponse.next({
    headers,
  });
}

// See: https://nextjs.org/docs/app/api-reference/file-conventions/middleware#config-object-optional
// Follows regex in the sense that you:
// Use * for "no segment or segment"
// Use + for "has to have segment"
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pricing/:path+'
  ]
}
