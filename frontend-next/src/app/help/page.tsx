export default function HelpCenterPage() {
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Help Center
        </h1>
        <p className="text-gray-400 mt-2">Find answers to common questions.</p>
        <div className="mt-6 card-glass p-6">
          <input
            placeholder="Search articles..."
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
          />
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {["Getting Started", "Billing", "Teams", "Integrations"].map(
            (topic) => (
              <div key={topic} className="card-glass p-6">
                <div className="text-white font-semibold">{topic}</div>
                <ul className="text-gray-400 text-sm list-disc list-inside mt-2 space-y-1">
                  <li>How to use {topic}</li>
                  <li>{topic} FAQs</li>
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
