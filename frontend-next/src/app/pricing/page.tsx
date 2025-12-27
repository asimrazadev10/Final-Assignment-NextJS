export default function PricingPage() {
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Pricing
        </h1>
        <p className="text-gray-400 mt-2">
          Simple, transparent plans that grow with you.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className="chip">No credit card required</span>
          <span className="chip">Cancel anytime</span>
          <span className="chip">14-day trial</span>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Starter", "Pro", "Business"].map((tier, i) => (
            <div key={tier} className="card-glass p-6">
              <h2 className="text-xl text-white font-semibold">{tier}</h2>
              <p className="text-gray-400 mt-1">
                Ideal for{" "}
                {i === 0
                  ? "getting started"
                  : i === 1
                  ? "growing teams"
                  : "scaling companies"}
                .
              </p>
              <div className="mt-4 text-3xl font-bold text-white">
                {i === 0 ? "$0" : i === 1 ? "$19" : "$99"}
                <span className="text-sm text-gray-400">/mo</span>
              </div>
              <ul className="mt-4 space-y-2 text-gray-300 text-sm">
                <li>Unlimited projects</li>
                <li>{i > 0 ? "Advanced analytics" : "Basic analytics"}</li>
                <li>{i === 2 ? "Priority support" : "Standard support"}</li>
                <li>{i === 2 ? "SSO & SCIM" : "Invite teammates"}</li>
              </ul>
              <button className="mt-6 w-full btn-gradient">
                Choose {tier}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-10 card-glass p-6">
          <h3 className="text-white font-semibold">FAQ</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-6 text-gray-300 text-sm">
            <div>
              <div className="text-white">Can I change plans later?</div>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade at any time.
              </p>
            </div>
            <div>
              <div className="text-white">Do you offer discounts?</div>
              <p className="text-gray-400">
                We offer annual billing discounts on Pro and Business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
