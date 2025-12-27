import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="chip mb-6">About SubFlow</div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Built for <span className="heading-gradient">Modern</span>{" "}
              Businesses
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We understand the pain of managing multiple subscriptions. SubFlow
              was born from our own struggle with tracking dozens of tools and
              services.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                The Problem We Solve
              </h2>
              <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                As three Pakistani entrepreneurs running our own startup, we
                faced the constant struggle of managing multiple subscriptions
                across different tools and services. Surprise renewals,
                duplicate tools, forgotten free trials - it was affecting our
                tight startup budget.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                We built SubFlow to solve our own problem first, and now we're
                proud to share our solution with startups and businesses
                worldwide who face the same subscription management challenges.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">2023</div>
                  <div className="text-gray-400">Startup Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">3</div>
                  <div className="text-gray-400">Team Members</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=80"
                  alt="Team working on SubFlow"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Our <span className="heading-gradient">Core Values</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The principles that guide everything we do at SubFlow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-glass p-8 text-center group hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 mx-auto group-hover:bg-purple-600/30 group-hover:scale-110 transition-all duration-300">
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
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Simplicity First
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Complex problems deserve simple solutions. We make subscription
                management effortless.
              </p>
            </div>

            <div className="card-glass p-8 text-center group hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 mx-auto group-hover:bg-purple-600/30 group-hover:scale-110 transition-all duration-300">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Privacy & Security
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your financial data is sacred. Bank-level encryption keeps your
                information secure.
              </p>
            </div>

            <div className="card-glass p-8 text-center group hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 mx-auto group-hover:bg-purple-600/30 group-hover:scale-110 transition-all duration-300">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Customer Obsession
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Every feature we build is driven by real user needs and
                feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
                  alt="SubFlow team collaboration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Floating achievement card */}
              <div className="absolute -bottom-6 -right-6 bg-purple-600 rounded-2xl p-6 shadow-2xl z-10">
                <div className="text-3xl font-bold text-white mb-1">100+</div>
                <div className="text-purple-200">Early Users</div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Meet the Team Behind{" "}
                <span className="heading-gradient">SubFlow</span>
              </h2>
              <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                We're a passionate three-person team from Pakistan - combining
                expertise in development, design, and business strategy to
                tackle subscription management challenges.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Based in Pakistan, we work with startups and small businesses
                worldwide, bringing fresh perspectives and innovative solutions
                to help them take control of their recurring expenses and
                optimize their tool stack.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-400"
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
                  <span className="text-white">
                    Small but mighty 3-person team
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-400"
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
                  <span className="text-white">
                    Built with startup mindset
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-white">Dedicated personal support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey & Milestones Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Our <span className="heading-gradient">Startup Journey</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From idea to impact - the milestones that shaped SubFlow
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-px h-full bg-gradient-to-b from-purple-600 to-pink-600"></div>

            <div className="space-y-16">
              {/* Milestone 1 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="card-glass p-6">
                    <div className="text-purple-400 font-semibold mb-2">
                      Early 2023
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      The Problem Hits Hard
                    </h3>
                    <p className="text-gray-400">
                      Our startup was bleeding money from forgotten
                      subscriptions. $200+ monthly on tools we barely used.
                      Something had to change.
                    </p>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center border-4 border-black">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* Milestone 2 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-black">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="w-1/2 pl-8">
                  <div className="card-glass p-6">
                    <div className="text-blue-400 font-semibold mb-2">
                      Mid 2023
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      First Prototype
                    </h3>
                    <p className="text-gray-400">
                      Late nights and countless cups of chai later, we built our
                      first working prototype. Simple, but it solved OUR
                      problem.
                    </p>
                  </div>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="card-glass p-6">
                    <div className="text-green-400 font-semibold mb-2">
                      Late 2023
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      First 100 Users
                    </h3>
                    <p className="text-gray-400">
                      Word spread in the Pakistani startup community. Fellow
                      entrepreneurs started using SubFlow and saving money too.
                    </p>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center border-4 border-black">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                </div>
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* Milestone 4 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center border-4 border-black">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                </div>
                <div className="w-1/2 pl-8">
                  <div className="card-glass p-6">
                    <div className="text-pink-400 font-semibold mb-2">
                      2024 & Beyond
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      Global Vision
                    </h3>
                    <p className="text-gray-400">
                      Now we're scaling globally, helping startups worldwide
                      take control of their subscriptions with the same passion
                      that drove us.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Behind the Scenes Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Behind the <span className="heading-gradient">Scenes</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A peek into how we work and what drives us every day
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Working Style */}
            <div className="card-glass p-8 group hover:border-purple-500/50 transition-all duration-300">
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
                  alt="Late night coding session"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Late Night Coding
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Our Work Style
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We believe in deep work and focused sessions. Most of our
                breakthrough moments happen during late-night coding marathons
                with endless chai.
              </p>
            </div>

            {/* Pakistani Roots */}
            <div className="card-glass p-8 group hover:border-purple-500/50 transition-all duration-300">
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80"
                  alt="Pakistani culture and innovation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Made in Pakistan
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Pakistani Innovation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We're proud to represent Pakistan's growing tech scene. Building
                world-class products with Pakistani ingenuity and global
                ambitions.
              </p>
            </div>

            {/* Future Vision */}
            <div className="card-glass p-8 group hover:border-purple-500/50 transition-all duration-300">
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
                  alt="Future technology and innovation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <svg
                      className="w-5 h-5"
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
                    <span className="text-sm font-medium">Future Ready</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">What's Next</h3>
              <p className="text-gray-400 leading-relaxed">
                We're building AI-powered insights, mobile apps, and
                integrations with 100+ services. The future of subscription
                management is exciting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of startups who trust SubFlow to manage their
            subscriptions efficiently and save money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-gradient text-lg">
              Start Free Trial
            </Link>
            <Link href="/services" className="btn-ghost text-lg">
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}