import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const provider = searchParams.get('provider') || 'default';
  const callbackUrl = searchParams.get('callbackUrl') || '/login';
  
  // Default NextAuth signout URL
  const signOutUrl = `/api/auth/signout?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  
  // Provider-specific logout handling
  switch (provider) {
  case 'google':
    // First sign out from NextAuth, then redirect to Google's logout
    return NextResponse.redirect(new URL(signOutUrl, req.url));
    
  case 'github':
    // GitHub doesn't have a reliable logout URL to redirect to
    // We'll just use NextAuth's signout
    return NextResponse.redirect(new URL(signOutUrl, req.url));
      
  case 'email':
    // For passwordless login, just use NextAuth's signout
    return NextResponse.redirect(new URL(signOutUrl, req.url));
      
  default:
    // Default logout behavior
    return NextResponse.redirect(new URL(signOutUrl, req.url));
  }
} 