import Link from "next/link";

const CTA = () => {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-12 text-center">
        <h2 className="text-4xl font-bold text-foreground md:text-5xl">
          Ready to Chat With Your Codebase?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Upload your repository, ask questions in natural language,
          and understand complex codebases instantly with AI.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Get Started Free
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-border px-6 py-3 font-medium text-foreground"
          >
            View Demo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;