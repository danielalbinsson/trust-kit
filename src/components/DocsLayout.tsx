import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { DOCS_NAV } from "../lib/links";

export function DocsLayout({
  title,
  eyebrow = "Docs",
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[220px_1fr] md:px-8 md:py-16">
      <aside className="md:sticky md:top-24 md:self-start">
        <p className="eyebrow mb-4">Documentation</p>
        <nav className="flex flex-col gap-1">
          {DOCS_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-[var(--radius-md)] px-3 py-2 text-sm font-normal text-ink-soft transition-colors hover:bg-white hover:text-ink"
              style={{ transitionTimingFunction: "var(--ease-smooth)", transitionDuration: "var(--duration-normal)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <article className="prose-docs max-w-2xl">
        <p className="eyebrow fade-up">{eyebrow}</p>
        <h1 className="display fade-up-delay mt-3 text-4xl md:text-5xl">{title}</h1>
        <div className="fade-up-delay-2 mt-8">{children}</div>
      </article>
    </div>
  );
}
