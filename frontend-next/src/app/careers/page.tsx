export default function CareersPage() {
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Careers
        </h1>
        <p className="text-gray-400 mt-2">
          Join us in building the future of subscriptions.
        </p>
        <div className="card-glass p-6 mt-6">
          <h2 className="text-white font-semibold">Life at SubFlow</h2>
          <p className="text-gray-400 mt-2">
            Remote-first, flexible hours, quarterly offsites, learning budget,
            and great people.
          </p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {["Remote", "Flexible", "Growth", "Inclusive"].map((v) => (
              <div
                key={v}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300"
              >
                {v}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 space-y-4">
          {[
            {
              role: "Frontend Engineer",
              location: "Remote",
              type: "Full-time",
            },
            { role: "Product Designer", location: "Remote", type: "Contract" },
          ].map((job) => (
            <div
              key={job.role}
              className="card-glass p-6 flex items-center justify-between"
            >
              <div>
                <div className="text-white font-medium">{job.role}</div>
                <div className="text-gray-400 text-sm">
                  {job.location} • {job.type}
                </div>
              </div>
              <button className="btn-ghost">View role</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
