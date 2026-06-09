import Link from "next/link";

const Landing = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-4 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          🚀 AI-Powered Repository Assistant
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Chat With Your
          <span className="text-primary"> Codebase </span>
          Using AI
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Upload your repository, ask questions in natural language,
          and understand complex codebases instantly.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-border bg-card px-6 py-3 font-medium"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-2 text-xl font-semibold">
              Repository Upload
            </h3>

            <p className="text-muted-foreground">
              Upload GitHub repositories and let AI understand
              your entire codebase.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-2 text-xl font-semibold">
              AI Chat
            </h3>

            <p className="text-muted-foreground">
              Ask questions about architecture, APIs,
              business logic and implementation details.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-2 text-xl font-semibold">
              Semantic Search
            </h3>

            <p className="text-muted-foreground">
              Find relevant files and code snippets
              instantly with vector search.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;