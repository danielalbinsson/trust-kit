import { NavLink } from "react-router-dom";

const links = [
  { to: "/gallery", label: "Gallery" },
  { to: "/docs", label: "Docs" },
  { to: "/review", label: "Review" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <NavLink to="/" className="rounded-sm text-xl tracking-tight text-ink md:text-2xl">
          Agentic Kit
        </NavLink>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "inline-flex min-h-11 items-center rounded-full px-3 py-2 text-sm font-normal transition-colors duration-[var(--duration-normal)]",
                  isActive ? "bg-ink" : "text-ink-soft hover:bg-black/5",
                ].join(" ")
              }
              style={({ isActive }) => ({
                transitionTimingFunction: "var(--ease-smooth)",
                color: isActive ? "#ffffff" : undefined,
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
