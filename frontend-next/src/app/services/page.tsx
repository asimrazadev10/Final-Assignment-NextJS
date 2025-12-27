import Link from "next/link";
import { ReactNode } from "react";

// Define interfaces for data structures
interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export default function ServicesPage() {
  const features: Feature[] = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Subscription Inbox",
      description:
        "Centralized command center for all your subscription communications. Never miss important updates, price changes, or renewal notices.",
      features: [
        "Email parsing & categorization",
        "Subscription detection",
        "Important alerts prioritization",
        "Clean unified interface",
      ],
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
      title: "Renewal Radar",
      description:
        "Advanced early warning system for subscription renewals. Smart notifications ensure you never get surprised by charges.",
      features: [
        "7/3/1 day advance alerts",
        "Smart notification timing",
        "Trial expiry warnings",
        "Customizable alert preferences",
      ],
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Smart Budget Guard",
      description:
        "Intelligent budget monitoring that learns your spending patterns and alerts you before you exceed limits.",
      features: [
        "Monthly/quarterly budget tracking",
        "Spending pattern analysis",
        "Overspend prevention alerts",
        "Budget recommendations",
      ],
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Invoice Vault",
      description:
        "Secure, organized storage for all your subscription invoices and receipts. Perfect for accounting and tax purposes.",
      features: [
        "Automatic invoice collection",
        "OCR text extraction",
        "Tax-ready organization",
        "Search & filter capabilities",
      ],
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Client Cost Allocation",
      description:
        "Allocate subscription costs across different clients and projects. Perfect for agencies and freelancers managing client work.",
      features: [
        "Project-based cost splitting",
        "Client billing integration",
        "Time-based allocation",
        "Automated cost distribution",
      ],
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Usage Analytics Lite",
      description:
        "Essential insights into your subscription usage patterns. Understand which tools deliver value and which don't.",
      features: [
        "Usage trend analysis",
        "Value-per-dollar insights",
        "Underused subscription detection",
        "ROI calculations",
      ],
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Vendor Optimization Hints",
      description:
        "Smart recommendations to optimize your vendor relationships. Get hints on better plans, alternatives, and negotiation opportunities.",
      features: [
        "Plan optimization suggestions",
        "Alternative service recommendations",
        "Price comparison alerts",
        "Negotiation timing hints",
      ],
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Contract Templates & Docs",
      description:
        "Ready-to-use templates and documentation for managing vendor relationships and subscription agreements.",
      features: [
        "Cancellation letter templates",
        "Negotiation email scripts",
        "Contract review checklists",
        "Vendor communication guides",
      ],
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
      title: "Reports & Exports",
      description:
        "Comprehensive reporting system with multiple export formats. Perfect for accounting, budgeting, and stakeholder updates.",
      features: [
        "Monthly/quarterly reports",
        "CSV/PDF/Excel exports",
        "Custom report builder",
        "Scheduled report delivery",
      ],
    },
  ];

  const additionalFeatures: Feature[] = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Team/Workspace Controls",
      description:
        "Collaborative features for teams and workspaces. Manage permissions, share insights, and work together efficiently.",
      features: [
        "Multi-user access control",
        "Role-based permissions",
        "Team sharing & collaboration",
        "Workspace organization",
      ],
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "Free",
      period: "Forever",
      description: "Perfect for individuals just getting started",
      features: [
        "Track up to 10 subscriptions",
        "Basic renewal alerts",
        "Monthly spending overview",
        "Email notifications",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "Ideal for freelancers and small teams",
      features: [
        "Unlimited subscriptions",
        "Advanced analytics & reports",
        "Smart cost optimization",
        "SMS + Email alerts",
        "Priority support",
        "Team sharing (up to 3 members)",
      ],
      cta: "Start 14-Day Free Trial",
      popular: true,
    },
    {
      name: "Business",
      price: "$29",
      period: "per month",
      description: "Built for growing businesses and agencies",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Advanced integrations",
        "Custom reporting",
        "API access",
        "Dedicated account manager",
        "White-label options",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="chip mb-6">Our Services</div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Everything You Need to{" "}
              <span className="heading-gradient">Master</span> Subscriptions
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              Powerful tools designed by Pakistani entrepreneurs who understand
              the real challenges of managing subscriptions on a tight budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-gradient text-lg">
                Start Free Trial
              </Link>
              <Link href="#features" className="btn-ghost text-lg">
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Comprehensive{" "}
              <span className="heading-gradient">Feature Suite</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every feature built from real startup experience and user feedback
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group card-glass p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-600/10 hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition" />

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400 group-hover:bg-purple-600/30 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    {feature.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 text-gray-300"
                        >
                          <div className="w-5 h-5 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-3 h-3 text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Controls Feature - Highlighted */}
          <div className="max-w-4xl mx-auto">
            <div className="card-glass p-8 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent relative overflow-hidden">
              <div className="pointer-events-none absolute -right-8 -top-8 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-purple-600/30 rounded-xl flex items-center justify-center text-purple-400 flex-shrink-0">
                  {additionalFeatures[0].icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-white">
                      {additionalFeatures[0].title}
                    </h3>
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Team Feature
                    </div>
                  </div>

                  <p className="text-gray-400 leading-relaxed mb-4">
                    {additionalFeatures[0].description}
                  </p>

                  <ul className="grid md:grid-cols-2 gap-3">
                    {additionalFeatures[0].features.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-gray-300"
                      >
                        <div className="w-5 h-5 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3 h-3 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              How <span className="heading-gradient">SubFlow</span> Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get started in minutes, not hours. We've made it incredibly
              simple.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Connect Your Accounts
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Securely link your email accounts and banking information. We'll
                automatically detect your subscriptions.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Review & Organize
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Review detected subscriptions, add missing ones, and organize
                them into categories that make sense for you.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Save & Optimize
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Get smart recommendations, set up alerts, and start saving money
                while staying in control of your subscriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Simple <span className="heading-gradient">Pricing</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Start free, upgrade when you need more. No hidden fees, no
              surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`card-glass p-8 text-center relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular
                    ? "border-purple-500/50 bg-gradient-to-b from-purple-500/10 to-transparent"
                    : "hover:border-purple-500/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <div className="w-5 h-5 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-left">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`block w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "btn-gradient"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-purple-500/50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              All plans include 14-day money-back guarantee
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300 text-sm">No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300 text-sm">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300 text-sm">24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Ready to Take Control of Your Subscriptions?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of startups and businesses who trust SubFlow to
            optimize their subscription spending.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-gradient text-lg">
              Start Free Trial - No Credit Card Required
            </Link>
            <Link href="/about" className="btn-ghost text-lg">
              Learn About Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}