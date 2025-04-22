'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use public environment variable or dynamically determine the URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : 'http://localhost:3001');
    
  return (
    <SessionProvider basePath="/api/auth" baseUrl={baseUrl}>
      {children}
    </SessionProvider>
  );
}