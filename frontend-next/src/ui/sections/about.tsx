export default function About() {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-black to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80"
                alt="Team collaboration workspace"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-8 -right-8 bg-purple-600 rounded-2xl p-6 shadow-2xl">
              <div className="text-4xl font-bold text-white mb-1">500+</div>
              <div className="text-purple-200">Companies Trust Us</div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <div className="chip mb-4">About SubFlow</div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              <span className="heading-gradient">
                Your Complete Subscription Management Solution
              </span>
            </h2>

            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              SubFlow is designed specifically for freelancers and small
              businesses who juggle multiple subscriptions. We help you stay
              organized, save money, and never miss an important renewal.
            </p>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              From Notion to Figma, Canva to Grammarly - manage all your tools
              in one centralized dashboard. Get smart alerts, track spending,
              and make informed decisions about your subscriptions.
            </p>

            {/* Features list */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-purple-400"
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
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Centralized Dashboard
                  </h3>
                  <p className="text-gray-400">
                    View all your subscriptions in one beautiful interface
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-purple-400"
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
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Smart Alerts
                  </h3>
                  <p className="text-gray-400">
                    Never miss a renewal with intelligent notifications
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Cost Optimization
                  </h3>
                  <p className="text-gray-400">
                    Identify savings opportunities and reduce expenses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
