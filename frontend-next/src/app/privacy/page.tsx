export default function PrivacyPage() {
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Privacy Policy
        </h1>
        <p className="text-gray-400 mt-2">
          Your privacy matters. Here's how we handle your data.
        </p>
        <div className="card-glass p-6 mt-6 text-gray-300 space-y-4">
          <h2 className="text-white text-xl font-semibold">
            Information we collect
          </h2>
          <p>
            Account data, usage data, and cookies to keep you signed in and
            improve our product.
          </p>
          <h2 className="text-white text-xl font-semibold">How we use data</h2>
          <p>
            Operate the service, provide support, detect abuse, and improve
            features.
          </p>
          <h2 className="text-white text-xl font-semibold">Your rights</h2>
          <p>
            Access, correct, export, or delete your data anytime. Email support
            to start a request.
          </p>
        </div>
      </div>
    </main>
  );
}
