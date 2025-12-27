export default function BlogPage() {
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Blog
        </h1>
        <p className="text-gray-400 mt-2">
          Insights, product updates, and stories.
        </p>
        <div className="mt-6 card-glass p-6">
          <div className="text-white font-semibold">Latest</div>
          <p className="text-gray-400">What’s new this month at SubFlow.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <article key={i} className="card-glass p-6">
              <h2 className="text-white text-xl font-semibold">
                Post title {i}
              </h2>
              <p className="text-gray-400 mt-2">
                Short description of the post content and value.
              </p>
              <button className="mt-4 btn-ghost">Read more</button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
