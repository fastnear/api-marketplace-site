"use client";

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ 
  className = "text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100", 
  children 
}: LogoutButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // Determine which provider was used for authentication
      let provider = 'default';
      
      // PRODUCTION TODO: For production, store the provider in the session during login
      // This email-based detection is a simplistic approach that won't work for all cases
      // E.g., Google Workspace emails won't match @gmail.com
      if (session?.user?.email?.includes('@gmail.com')) {
        provider = 'google';
      } else if (session?.user?.email?.includes('@github')) {
        provider = 'github';
      }
      
      // For a complete logout including from the provider, use our custom API
      router.push(`/api/auth/logout?provider=${provider}&callbackUrl=/login`);
      
      // Alternative: Use NextAuth's signOut for a simple session logout
      // await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
      aria-label="Sign out"
    >
      {children || (isLoggingOut ? 'Signing out...' : 'Sign out')}
    </button>
  );
} 