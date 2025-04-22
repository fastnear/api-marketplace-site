import type { Metadata } from 'next';

// Define API credit plans
const API_PLANS = [
  {
    name: "Pay-As-You-Go",
    price: "$5",
    description: "Perfect for developers who want to explore our APIs. Pay only for what you use with no minimum commitment.",
    features: [
      "Access to all marketplace APIs",
      "Usage-based billing",
      "Developer documentation",
      "Basic support"
    ],
    externalLink: "https://checkout.stripe.com/pay/cs_test_api_credits_paygoyou",
    highlight: false
  },
  {
    name: "API Credit Pack",
    price: "$30",
    description: "Save up to 40% with pre-purchased API credits. Ideal for regular users with predictable API needs.",
    features: [
      "All Pay-As-You-Go features",
      "Equivalent to $50 in API usage",
      "Credits never expire",
      "Priority queue access"
    ],
    externalLink: "https://checkout.stripe.com/pay/cs_test_api_credits_pack",
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For businesses requiring high-volume API access with dedicated support and SLAs.",
    features: [
      "All API Credit Pack features",
      "Custom SLA guarantees",
      "Dedicated support team",
      "Branded API endpoints"
    ],
    externalLink: "/contact",
    highlight: false
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

export default function PricingOptionsPage() {
  return (
    <div className="section-themed flex flex-col items-center py-12 md:py-16">
      <div className="max-w-6xl w-full px-4 sm:px-6 md:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6 heading-themed tracking-tight">
          API Pricing
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-center mb-8 text-themed-secondary leading-relaxed">
          Access NEAR AI and blockchain APIs through our unified marketplace. Purchase credits once, use them across multiple services.
        </p>

        {/* Value proposition cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-sm border border-slate-200/50 dark:border-gray-700/50">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-slate-700 dark:text-gray-300">Leverage cutting-edge AI capabilities specifically trained on NEAR Protocol data.</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-sm border border-slate-200/50 dark:border-gray-700/50">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold mb-2">Unified Credits</h3>
            <p className="text-sm text-slate-700 dark:text-gray-300">One credit balance works across all available AI and blockchain APIs.</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 text-center shadow-sm border border-slate-200/50 dark:border-gray-700/50">
            <div className="text-4xl mb-4">💸</div>
            <h3 className="text-xl font-semibold mb-2">Cost-Effective</h3>
            <p className="text-sm text-slate-700 dark:text-gray-300">Pay only for the API calls you need with bulk discounts for regular users.</p>
          </div>
        </div>

        {/* Pricing plans */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 mb-20">
          {API_PLANS.map((plan) => (
            <div key={plan.name} className={`pricing-card card-themed w-full sm:w-80 flex flex-col ${plan.highlight ? 'border-blue-500 dark:border-blue-400 border-2' : ''}`}>
              <div className="mb-6 flex-grow">
                <h2 className="heading-themed text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="price text-3xl font-bold mb-2">{plan.price}
                  {plan.name !== "Enterprise" && <span className="text-lg text-muted ml-1">starting</span>}
                </div>
                <p className="description text-sm mb-4 text-slate-700 dark:text-gray-300">{plan.description}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-slate-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={plan.externalLink}
                target={plan.name !== "Enterprise" ? "_blank" : ""}
                rel="noopener noreferrer"
                className={`button-themed-primary w-full block text-center py-3 rounded-lg font-medium ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
              >
                {plan.name === "Enterprise" ? "Contact Us" : "Get Started"}
              </a>
            </div>
          ))}
        </div>

        {/* API usage rates */}
        <div className="card-themed max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 tracking-tight heading-themed">
            API Usage Rates
          </h3>
          <p className="text-center mb-8 max-w-2xl mx-auto text-slate-700 dark:text-gray-300">
            Our credit-based system allows you to use any API in our marketplace. Different APIs have different credit costs based on computational requirements.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left comparison-table">
              <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-lg">API</th>
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-lg">Description</th>
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-lg text-right">Cost Per Request</th>
              </tr>
              </thead>
              <tbody>
              {API_USAGE_RATES.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 font-medium">{item.api}</td>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-slate-700 dark:text-gray-300">{item.description}</td>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-right font-mono">{item.costPerRequest}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 tracking-tight heading-themed">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="card-themed">
              <h4 className="font-semibold text-lg mb-2">What can I do with NEAR AI APIs?</h4>
              <p className="text-slate-700 dark:text-gray-300">
                Our AI APIs enable you to generate content, analyze images, create smart contract code, and build AI-powered dApps on NEAR Protocol. Use them to enhance user experiences, automate tasks, and build next-generation blockchain applications.
              </p>
            </div>
            <div className="card-themed">
              <h4 className="font-semibold text-lg mb-2">Can I use both AI and blockchain APIs with the same credits?</h4>
              <p className="text-slate-700 dark:text-gray-300">
                Yes! That's the beauty of our unified credit system. Purchase once and use your credits across any API in our marketplace according to your needs, whether it's AI services or blockchain data access.
              </p>
            </div>
            <div className="card-themed">
              <h4 className="font-semibold text-lg mb-2">How does the $30 Credit Pack save me money?</h4>
              <p className="text-slate-700 dark:text-gray-300">
                The $30 Credit Pack gives you $50 worth of API usage - that's a 40% savings compared to pay-as-you-go pricing. Plus, these credits never expire, so you can use them at your own pace without worrying about monthly renewals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
