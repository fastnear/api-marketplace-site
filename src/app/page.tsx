'use client';

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { THEME, THEME_ASSETS } from "@/app/_components/theme-config";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="landing-page min-h-screen bg-gradient-to-b from-white to-white/95 dark:from-gray-900 dark:to-gray-900/95">
      {/* Hero Section with subtle gradient overlay */}
      <div className="landing-hero relative overflow-hidden">
        <div className="landing-hero__gradient absolute inset-0 bg-gradient-to-br from-slate-100/[0.02] via-transparent to-slate-300/[0.02] dark:from-slate-200/[0.02] dark:to-slate-400/[0.02]" />

        <div className="landing-hero__container relative w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <main className="landing-content relative w-full">

            {/* Header section with professional styling */}
            <div className="landing-header flex flex-col items-center mb-10 md:mb-16">
              <div className="landing-header__wrapper w-full text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  <span className="text-blue-800 dark:text-blue-400">FASTNEAR</span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Marketplace</span>
                </h1>
                <div className="h-1 w-24 bg-blue-800 dark:bg-blue-600 mx-auto mt-2 rounded-full"></div>
              </div>
            </div>

            {/* Main content with proper spacing and responsive widths */}
            <div className="landing-content__main space-y-12 md:space-y-16">
              <div className="landing-heading relative text-center max-w-4xl mx-auto">
                <h2 className="landing-heading__title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold heading-themed leading-tight">
                  NEAR Protocol API Marketplace
                </h2>
                <div className="landing-heading__glow absolute -inset-x-4 sm:-inset-x-6 -inset-y-4 bg-gradient-to-r from-slate-100/[0.02] via-transparent to-slate-300/[0.02] dark:from-slate-200/[0.02] dark:to-slate-400/[0.02] blur-sm -z-10" />
              </div>

              <div className="landing-text space-y-4 sm:space-y-6 max-w-4xl mx-auto text-left">
                <p className="landing-text__paragraph text-base sm:text-lg md:text-xl text-slate-700 dark:text-gray-200">
                  Discover and integrate powerful APIs for NEAR Protocol with our unified marketplace. Purchase credits and access multiple services through a single dashboard.
                </p>

                <p className="landing-text__paragraph text-base sm:text-lg md:text-xl text-slate-700 dark:text-gray-200">
                  From indexers to oracles, smart contract analytics to NFT metadata — unlock the full potential of NEAR's ecosystem with just a few API calls.
                </p>
              </div>

              {/* API Features Section with responsive grid */}
              <div className="landing-features grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full">
                <div className="landing-feature-card p-4 md:p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-slate-800 dark:text-white text-left">Unified Credits</h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-gray-300 text-left">One balance, multiple APIs. Purchase credits once and use them across all available services.</p>
                </div>

                <div className="landing-feature-card p-4 md:p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-slate-800 dark:text-white text-left">Curated Services</h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-gray-300 text-left">Only the best APIs make it to our marketplace, thoroughly tested for reliability and performance.</p>
                </div>

                <div className="landing-feature-card p-4 md:p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-slate-800 dark:text-white text-left">Unified Documentation</h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-gray-300 text-left">Access comprehensive API docs in one place with consistent formats and interactive examples.</p>
                </div>

                <div className="landing-feature-card p-4 md:p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-gray-700/50 shadow-sm">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-slate-800 dark:text-white text-left">Usage Analytics</h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-gray-300 text-left">Monitor your API consumption with detailed analytics and optimize your credit usage.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
