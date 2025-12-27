export default function TermsPage() {
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Terms of Service
        </h1>
        <p className="text-gray-400 mt-2">
          The rules and guidelines for using our service.
        </p>
        <div className="card-glass p-6 mt-6 text-gray-300 space-y-4">
          <h2 className="text-white text-xl font-semibold">Use of service</h2>
          <p>
            Don't abuse the platform, attempt to break security, or harm other
            users.
          </p>
          <h2 className="text-white text-xl font-semibold">
            Subscriptions & billing
          </h2>
          <p>
            Plans auto-renew monthly; you can cancel anytime in your account.
          </p>
          <h2 className="text-white text-xl font-semibold">Liability</h2>
          <p>
            To the extent permitted by law, we disclaim warranties and limit
            liability.
          </p>
        </div>
      </div>
    </main>
  );
}
