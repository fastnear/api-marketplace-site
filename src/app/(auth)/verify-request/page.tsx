'use client';

import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-[calc(100vh-144px)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md card-themed rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold heading-themed">Check your email</h2>
        <div className="py-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mx-auto text-blue-600 dark:text-blue-400"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          We've sent you a magic link to sign in to your account. 
          <br /><br />
          Please check your email and click the link to continue.
        </p>
        <div className="pt-4">
          <Link 
            href="/login"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}