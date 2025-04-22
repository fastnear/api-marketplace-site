import type { Metadata } from 'next';
import Link from 'next/link';

// Define API credit plans
const API_PLANS = [
  {
    name: "Pay-As-You-Go",
    price: "$5",
    unit: "starting",
    description: "Perfect for developers who want to explore our APIs. Pay only for what you use with no minimum commitment.",
    features: [
      "Access to all marketplace APIs",
      "Usage-based billing",
      "Developer documentation",
      "Basic support"
    ],
    externalLink: "https://checkout.stripe.com/pay/cs_test_api_credits_paygoyou",
    highlight: false,
    badge: ""
  },
  {
    name: "API Credit Pack",
    price: "$30",
    unit: "pack",
    description: "Save up to 40% with pre-purchased API credits. Ideal for regular users with predictable API needs.",
    features: [
      "All Pay-As-You-Go features",
      "Equivalent to $50 in API usage",
      "Credits never expire",
      "Priority queue access"
    ],
    externalLink: "https://checkout.stripe.com/pay/cs_test_api_credits_pack",
    highlight: true,
    badge: "Most Popular"
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    description: "For businesses requiring high-volume API access with dedicated support and SLAs.",
    features: [
      "All API Credit Pack features",
      "Custom SLA guarantees",
      "Dedicated support team",
      "Branded API endpoints"
    ],
    externalLink: "/contact",
    highlight: false,
    badge: ""
  }
];

// API Usage table data
const API_USAGE_RATES = [
  {
    api: "NEAR AI Text Generation",
    description: "Generate text, code, and creative content",
    costPerRequest: "0.02 credits"
  },
  {
    api: "NEAR AI Vision Analysis",
    description: "Analyze images and extract structured data",
    costPerRequest: "0.05 credits"
  },
  {
    api: "NEAR Blockchain Query API",
    description: "Access on-chain data and transaction history",
    costPerRequest: "0.01 credits"
  }
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: "What can I do with NEAR AI APIs?",
    answer: "Our AI APIs enable you to generate content, analyze images, create smart contract code, and build AI-powered dApps on NEAR Protocol. Use them to enhance user experiences, automate tasks, and build next-generation blockchain applications."
  },
  {
    question: "Can I use both AI and blockchain APIs with the same credits?",
    answer: "Yes! That's the beauty of our unified credit system. Purchase once and use your credits across any API in our marketplace according to your needs, whether it's AI services or blockchain data access."
  },
  {
    question: "How does the $30 Credit Pack save me money?",
    answer: "The $30 Credit Pack gives you $50 worth of API usage - that's a 40% savings compared to pay-as-you-go pricing. Plus, these credits never expire, so you can use them at your own pace without worrying about monthly renewals."
  },
  {
    question: "Do API credits expire?",
    answer: "No. Once purchased, your API credits remain valid until used. There are no time restrictions or expiration dates to worry about."
  }
];

export default function PricingOptionsPage() {
  return (
    <>
      {/* Compact Hero Section */}
      <div className="relative bg-white dark:bg-gray-900 pt-12 pb-6 md:pt-16 md:pb-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-purple-200 opacity-20 dark:from-indigo-900 dark:to-purple-900 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-3">
            Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">pricing</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-300">
            Access NEAR's AI and blockchain APIs with unified credits across services
          </p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="relative py-12 sm:py-16 bg-gray-50 dark:bg-gray-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Choose your plan</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Select the option that best fits your needs. All plans provide access to our full API catalog.
            </p>
          </div>
          
          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-md space-y-4 lg:grid lg:max-w-none lg:grid-cols-3 lg:gap-8 lg:space-y-0">
              {API_PLANS.map((plan) => (
                <div 
                  key={plan.name} 
                  className={`flex flex-col overflow-hidden rounded-2xl ${
                    plan.highlight 
                      ? 'border-2 border-indigo-500 dark:border-indigo-400 shadow-lg' 
                      : 'border border-gray-200 dark:border-gray-700 shadow-sm'
                  }`}
                >
                  {plan.highlight && (
                    <div className="bg-indigo-500 py-1.5 text-center text-sm font-semibold uppercase text-white shadow-sm">
                      {plan.badge}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between bg-white p-6 dark:bg-gray-800 sm:p-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                      <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{plan.price}</span>
                        {plan.unit && (
                          <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">{plan.unit}</span>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        {plan.description}
                      </p>
                      <ul role="list" className="mt-6 space-y-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">{feature}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-8">
                      <a
                        href={plan.externalLink}
                        target={plan.name !== "Enterprise" ? "_blank" : ""}
                        rel="noopener noreferrer"
                        className={`block w-full rounded-md px-4 py-3 text-center text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          plan.highlight
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                            : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-500 dark:hover:bg-gray-700'
                        } transition-all`}
                      >
                        {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Cards */}
      <div className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Why choose our marketplace
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Unified API experience with seamless integration and cost-effective pricing
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-8">
            {/* Card 1 */}
            <div className="flex flex-col rounded-2xl bg-white shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all hover:shadow-md hover:-translate-y-1">
              <div className="h-2 w-full bg-indigo-500"></div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600 dark:text-indigo-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">AI-Powered</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Cutting-edge AI capabilities trained on NEAR Protocol data
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col rounded-2xl bg-white shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all hover:shadow-md hover:-translate-y-1">
              <div className="h-2 w-full bg-purple-500"></div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Unified Credits</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  One credit balance works across all AI and blockchain APIs
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col rounded-2xl bg-white shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all hover:shadow-md hover:-translate-y-1">
              <div className="h-2 w-full bg-green-500"></div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Cost-Effective</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Pay only for what you use with bulk discounts for regular users
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Usage Rates */}
      <div className="relative py-12 bg-gray-50 dark:bg-gray-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">API Usage Rates</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Different APIs have different credit costs based on computational requirements
            </p>
          </div>
          
          <div className="mx-auto overflow-hidden rounded-xl bg-white shadow dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      API
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      Cost Per Request
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {API_USAGE_RATES.map((item, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {item.api}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-mono font-medium text-gray-900 dark:text-white">
                        {item.costPerRequest}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Frequently Asked Questions</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Quick answers about our API marketplace
            </p>
          </div>
          
          <div className="mx-auto max-w-4xl divide-y divide-gray-200 dark:divide-gray-700">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="py-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {item.question}
                </h3>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-12 bg-gray-50 dark:bg-gray-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 px-6 py-8 shadow-xl sm:px-10 sm:py-12">
            <div className="relative">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Ready to get started?
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-base text-indigo-100">
                  Access powerful NEAR Protocol APIs with our unified credit system
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="inline-flex rounded-md shadow">
                    <a href="#" className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-all">
                      Create an account
                    </a>
                  </div>
                  <div className="ml-3 inline-flex">
                    <Link href="/contact" className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-700 bg-opacity-60 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-70 transition-all">
                      Contact sales
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-20 opacity-50">
              <svg width="404" height="384" fill="none" viewBox="0 0 404 384" aria-hidden="true" className="text-indigo-700 opacity-20">
                <defs>
                  <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" className="text-white" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)" />
              </svg>
            </div>
            <div className="absolute -bottom-24 -left-20 opacity-50">
              <svg width="404" height="384" fill="none" viewBox="0 0 404 384" aria-hidden="true" className="text-indigo-700 opacity-20">
                <defs>
                  <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" className="text-white" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c2)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'API Pricing | FASTNEAR AI & Blockchain Marketplace',
    description: 'Flexible API credit plans for NEAR Protocol AI and blockchain developers. Access powerful AI models and blockchain data with unified credits.',
  };

  return metadata;
}