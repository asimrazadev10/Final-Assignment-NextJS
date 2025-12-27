export default function CookiesPage() {
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Cookie Policy
        </h1>
        <p className="text-gray-400 mt-2">
          How we use cookies and similar technologies.
        </p>
        <div className="card-glass p-6 mt-6 text-gray-300 space-y-4">
          <h2 className="text-white text-xl font-semibold">Types of cookies</h2>
          <p>
            Essential (auth), functional (preferences), analytics (usage),
            marketing (opt-in only).
          </p>
          <h2 className="text-white text-xl font-semibold">Controls</h2>
          <p>Manage cookie preferences in your browser or system settings.</p>
        </div>
      </div>
    </main>
  );
}
