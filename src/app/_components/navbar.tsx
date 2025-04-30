'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './theme-toggle';
import { useTheme } from 'next-themes';
import { THEME, THEME_ASSETS } from './theme-config';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { resolvedTheme } = useTheme();

  // Avoid hydration mismatch by mounting after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close the user menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdown = document.getElementById('user-dropdown');

      // Only close if the click is outside the dropdown
      if (dropdown && !dropdown.contains(target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = async (event: React.MouseEvent) => {
    // Prevent any default behavior or event bubbling
    event.preventDefault();
    event.stopPropagation();

    console.log("Logout button clicked");

    if (isLoggingOut) {
      console.log("Already logging out, ignoring click");
      return;
    }

    setIsLoggingOut(true);
    setUserMenuOpen(false);

    try {
      // Use the built-in signOut function from next-auth/react
      await signOut({ callbackUrl: '/' });
      console.log("SignOut function called successfully");
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  // During SSR and initial client render, show a neutral version or loading state
  if (!mounted) {
    return (
      <nav className="flex justify-between items-center px-8 py-4 bg-background text-foreground border-b border-foreground/10">
        <div className="flex items-center space-x-4">
          <div id="fn-logo">
            <Link href="/">
              <div className="w-[259px] h-[56px] bg-background" />
            </Link>
          </div>
          <Link href="/pricing" className="hover:underline">
            Pricing
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <div className="w-6 h-6" /> {/* Placeholder for theme toggle */}
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-background text-foreground border-b border-foreground/10">
      <div className="flex items-center space-x-4">
        <Link href="/" className="home-link">
          API Marketplace
        </Link>
        <Link href="/pricing" className="hover:underline">
          Pricing
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        {status === 'authenticated' && (
          <Link href="/dashboard" className="hover:underline mr-4">
            Dashboard
          </Link>
        )}
        {status === 'unauthenticated' ? (
          <Link
            href="/login"
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Link>
        ) : status === 'authenticated' ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            </button>

            {userMenuOpen && (
              <div id="user-dropdown" className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user?.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        )}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
