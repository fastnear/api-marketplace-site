'use client';

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 py-16 md:py-20 lg:py-24 flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-purple-50/20 dark:from-indigo-900/10 dark:to-purple-900/10"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold tracking-tight">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                NEAR Protocol
              </span>
              <span className="block text-gray-900 dark:text-white mt-1">API Marketplace</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-300">
              Access powerful NEAR Protocol APIs through a unified platform. 
              Purchase credits once and use them across all our services.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Link href="/pricing" className="rounded-md bg-indigo-600 px-5 py-2.5 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all">
                Get started
              </Link>
              <Link href="#features" className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center group">
                Learn more
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-20 hidden lg:block">
          <div className="h-96 w-96 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-20 dark:from-indigo-900 dark:to-purple-900 blur-3xl"></div>
        </div>
        <div className="absolute -bottom-24 -left-20 hidden lg:block">
          <div className="h-96 w-96 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 opacity-20 dark:from-purple-900 dark:to-indigo-900 blur-3xl"></div>
        </div>
      </div>

      {/* Main Value Proposition */}
      <div className="relative py-14 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 id="features" className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Everything you need for NEAR development
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-300">
              From indexers to AI tools, all in one convenient place with unified billing
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="group rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-xl -mr-3 -mt-3 group-hover:scale-110 transition-transform"></div>
              <div className="relative">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Unified Credits
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
                  One balance for all APIs. Purchase credits once and use across services.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-12 w-12 bg-purple-50 dark:bg-purple-900/20 rounded-bl-xl -mr-3 -mt-3 group-hover:scale-110 transition-transform"></div>
              <div className="relative">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Curated Services
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
                  Only the best APIs, thoroughly tested for reliability and performance.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-bl-xl -mr-3 -mt-3 group-hover:scale-110 transition-transform"></div>
              <div className="relative">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Unified Documentation
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
                  Comprehensive API docs in one place with consistent formats.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-12 w-12 bg-green-50 dark:bg-green-900/20 rounded-bl-xl -mr-3 -mt-3 group-hover:scale-110 transition-transform"></div>
              <div className="relative">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Usage Analytics
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">
                  Monitor API consumption with detailed analytics to optimize usage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Ready to accelerate your NEAR development?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-600 dark:text-gray-300">
              Get started in minutes. Create an account and explore our API offerings.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-4">
              <Link href="/pricing" className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
                View pricing
              </Link>
              <Link href="/login" className="text-sm font-medium leading-6 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center group">
                Sign up <span aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-purple-200 opacity-20 dark:from-indigo-900 dark:to-purple-900 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </div>
    </>
  );
}