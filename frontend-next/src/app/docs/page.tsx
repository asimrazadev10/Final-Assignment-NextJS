export default function DocsPage() {
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Documentation
        </h1>
        <p className="text-gray-400 mt-2">
          Developer guides and API references.
        </p>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="card-glass p-6">
            <div className="text-white font-semibold">Authentication</div>
            <p className="text-gray-400 text-sm mt-1">
              Set up API keys and tokens.
            </p>
          </div>
          <div className="card-glass p-6">
            <div className="text-white font-semibold">Subscriptions</div>
            <p className="text-gray-400 text-sm mt-1">
              Create, update and cancel plans.
            </p>
          </div>
          <div className="card-glass p-6">
            <div className="text-white font-semibold">Webhooks</div>
            <p className="text-gray-400 text-sm mt-1">
              Receive events in your app.
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Overview", "API", "Webhooks"].map((s) => (
            <div key={s} className="card-glass p-6">
              <div className="text-white font-semibold">{s}</div>
              <p className="text-gray-400 text-sm mt-1">
                Learn how to work with {s}.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
