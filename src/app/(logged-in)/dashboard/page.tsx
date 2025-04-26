'use client';

import './dashboard.css';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Sample data for API usage chart
const sampleUsageData = [
  { day: 'Mon', count: 65 },
  { day: 'Tue', count: 45 },
  { day: 'Wed', count: 90 },
  { day: 'Thu', count: 50 },
  { day: 'Fri', count: 75 },
  { day: 'Sat', count: 30 },
  { day: 'Sun', count: 15 },
];

// Types for credit system integration
interface CreditTransactionType {
  id: number;
  type: 'purchase' | 'usage' | 'refund' | 'bonus' | 'transfer' | 'initial';
  amount: number;
  balance_after: number;
  reference_type: string;
  reference_id?: number;
  description: string;
  created_at: string;
}

interface CreditData {
  balance: number;
  recentTransactions: CreditTransactionType[];
  usageByApi: {
    apiName: string;
    creditsUsed: number;
  }[];
}

export default function DashboardPage() {
  const { data: session, status, update: updateSession } = useSession();
  const [apiUsage, setApiUsage] = useState(243); // Default demo values
  const [isLoading, setIsLoading] = useState(true);
  const [showUsageChart, setShowUsageChart] = useState(false);
  const [credits, setCredits] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [creditTransactions, setCreditTransactions] = useState<CreditTransactionType[]>([]);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  // Add client-side redirect to login if not authenticated
  // This is a backup for the middleware-level protection we temporarily disabled
  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login?callbackUrl=' + encodeURIComponent(window.location.pathname);
    }
  }, [status]);

  // CREDIT INTEGRATION: Properly refreshable credit state
  useEffect(() => {
    if (session?.user?.credits) {
      setCredits(session.user.credits);
    }
  }, [session?.user?.credits]);

  // Refresh user data and session
  const refreshUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch fresh credit data
      const response = await fetch(`/api/user/credits`, {
        credentials: 'include', // Ensure cookies are sent with the request
        cache: 'no-store' // Prevent caching
      });

      if (response.ok) {
        const data = await response.json();
        setApiUsage(data.monthlyUsage);
        setCredits(data.credits);

        // Also update the session to ensure it has the latest info
        await updateSession();
      }

      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data when authenticated
  useEffect(() => {
    async function fetchUserData() {
      if (status === 'authenticated' && session?.user?.id) {
        setIsLoading(true);
        try {
          // Fetch credits and usage data
          const response = await fetch(`/api/user/credits`, {
            credentials: 'include' // Ensure cookies are sent with the request
          });

          if (response.ok) {
            const data = await response.json();
            setApiUsage(data.monthlyUsage);
            setCredits(data.credits);
          }

          // Fetch credit transaction history from our new schema
          const creditResponse = await fetch(`/api/user/credit-history`, {
            credentials: 'include' // Ensure cookies are sent with the request
          });
          if (creditResponse.ok) {
            const creditData = await creditResponse.json();
            setCreditTransactions(creditData.transactions);
            // Could also update credit data here if we decide to cache it separately from the session
          }

        } catch (error) {
          // Just log the error, we'll use the default demo values
          console.log('Using demo data - API might not be available');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [status, session?.user?.id, lastRefreshed]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Find the max value for scaling the bars
  const maxCount = Math.max(...sampleUsageData.map(d => d.count));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Marketplace Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your API usage and explore available services
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Welcome, {session?.user?.name || session?.user?.email || 'User'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here's an overview of your API usage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          {/* CREDIT INTEGRATION: This credit display section will be connected to the credit_transactions table */}
          {/* The credit balance will be calculated from the sum of all transactions */}
          <div className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Available Credits
            </p>
            <p className="mt-2 flex items-baseline">
              <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {credits.toLocaleString()}
              </span>
              {/* Future: Display organization credits when viewing as team member */}
              {/* Organization credits will come from the organization_credits table */}
              {/*
              {session?.user?.organizationId && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  (Organization: {organizationCredits.toLocaleString()})
                </span>
              )}
              */}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Use credits to access API resources
            </p>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={refreshUserData}
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <svg
                  className="h-4 w-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refresh Credits
              </button>

              <button
                onClick={() => setShowTransactionHistory(!showTransactionHistory)}
                className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {showTransactionHistory ? 'Hide History' : 'View Credit History'}
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${showTransactionHistory ? 'rotate-90' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {showTransactionHistory && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
                <div className="space-y-4">
                  {creditTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{transaction.amount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Balance: {transaction.balance_after}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                API Calls This Month
              </p>
              <p className="mt-2 flex items-baseline">
                <span className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                  {apiUsage.toLocaleString()}
                </span>
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Total API requests made this month
              </p>
            </div>

            <button
              onClick={() => setShowUsageChart(!showUsageChart)}
              className="mt-4 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
            >
              {showUsageChart ? 'Hide Details' : 'View Usage Trend'}
              <svg
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${showUsageChart ? 'rotate-90' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Usage Chart - Shows when button is clicked */}
        {showUsageChart && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              Daily API Usage (Last 7 Days)
            </p>
            <div className="h-48 flex items-end justify-between gap-1">
              {sampleUsageData.map((data, i) => (
                <div key={i} className="flex flex-col items-center flex-1 h-full">
                  <div className="relative w-full">
                    <div
                      className="absolute bottom-0 w-full bg-purple-200 dark:bg-purple-900 rounded-t"
                      style={{
                        height: `${(data.count / maxCount) * 100}%`,
                        transition: 'height 0.5s ease-out',
                        animationDelay: `${i * 0.1}s`
                      }}
                      onLoad={(e) => {
                        // Trigger animation on load
                        e.currentTarget.style.height = `${(data.count / maxCount) * 100}%`;
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {data.count}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {data.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREDIT INTEGRATION: Future credit transaction history section */}
        {/* Will be populated from the credit_transactions table */}
        {/*
        {showTransactionHistory && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              Recent Credit Transactions
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {creditTransactions.length > 0 ? (
                    creditTransactions.map((transaction, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">
                          {transaction.type}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className={transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {transaction.description}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                        No recent transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        */}
      </div>

      {/* API Services */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Available APIs
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Explore and integrate with our powerful APIs
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  NEAR AI Chat
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Text generation models for your applications
                </p>
                <div className="mt-3">
                  <Link href="#" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-all group">
                    <span>View Documentation</span>
                    <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  NEAR Indexer API
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Fast access to indexed blockchain data
                </p>
                <div className="mt-3">
                  <Link href="#" className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-all group">
                    <span>View Documentation</span>
                    <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
