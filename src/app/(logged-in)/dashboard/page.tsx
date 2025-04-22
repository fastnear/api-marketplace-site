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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState(1000); // Default demo values
  const [apiUsage, setApiUsage] = useState(243); // Default demo values
  const [isLoading, setIsLoading] = useState(true);
  const [showUsageChart, setShowUsageChart] = useState(false);
  
  // Fetch user data when authenticated
  useEffect(() => {
    async function fetchUserData() {
      if (status === 'authenticated' && session?.user?.id) {
        setIsLoading(true);
        try {
          // Try to fetch actual data, but don't worry if it fails
          // We'll just use the demo data
          const response = await fetch(`/api/user/credits?userId=${session.user.id}`);
          
          if (response.ok) {
            const data = await response.json();
            setCredits(data.credits);
            setApiUsage(data.monthlyUsage);
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
  }, [status, session]);

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
          <div className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Available Credits
            </p>
            <p className="mt-2 flex items-baseline">
              <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {credits.toLocaleString()}
              </span>
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Use credits to access API resources
            </p>
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
            <div className="relative group">
              <button
                onClick={() => alert('This would show a detailed breakdown of API usage')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                <span>View All</span>
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
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