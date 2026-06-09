import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                C
              </div>

              <h2 className="text-xl font-bold text-foreground">
                CodeMind AI
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Chat with your codebase using AI. Upload repositories,
              explore architecture, and understand complex systems faster.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              Product
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/">Features</Link>
              </li>
              <li>
                <Link href="/">How It Works</Link>
              </li>
              <li>
                <Link href="/">Roadmap</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              Resources
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/">Documentation</Link>
              </li>
              <li>
                <Link href="/">GitHub</Link>
              </li>
              <li>
                <Link href="/">Support</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              Legal
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/">Terms of Service</Link>
              </li>
              <li>
                <Link href="/">Security</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 CodeMind AI. All rights reserved.</p>

          <p>
            Built with Next.js, TypeScript, Node.js & AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;