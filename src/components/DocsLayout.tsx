import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { DOCS_NAV } from "../lib/links";

function DocsNavLink({ to, label, compact }: { to: string; label: string; compact?: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          compact
            ? "shrink-0 rounded-full px-3 py-2 text-sm font-normal transition-colors"
            : "rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-normal transition-colors",
          isActive
            ? compact
              ? "bg-ink text-white"
              : "bg-white text-ink shadow-[var(--shadow-card)]"
            : "text-ink-soft hover:bg-white hover:text-ink",
        ].join(" ")
      }
      style={{ transitionTimingFunction: "var(--ease-smooth)", transitionDuration: "var(--duration-normal)" }}
    >
      {label}
    </NavLink>
  );
}

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
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow fade-up">{eyebrow}</p>
        <h1 className="display fade-up-delay mt-3 text-4xl md:text-5xl">{title}</h1>
      </div>

      <nav
        className="mt-6 flex gap-2 overflow-x-auto pb-1 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Documentation"
      >
        {DOCS_NAV.map((item) => (
          <DocsNavLink key={item.to} to={item.to} label={item.label} compact />
        ))}
      </nav>

      <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block md:sticky md:top-24 md:self-start">
          <p className="eyebrow mb-4">Documentation</p>
          <nav className="flex flex-col gap-1" aria-label="Documentation">
            {DOCS_NAV.map((item) => (
              <DocsNavLink key={item.to} to={item.to} label={item.label} />
            ))}
          </nav>
        </aside>
        <article className="prose-docs min-w-0 max-w-2xl">
          <div className="fade-up-delay-2">{children}</div>
        </article>
      </div>
    </div>
  );
}
