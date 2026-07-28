import { Link } from "react-router-dom";
import { site } from "../data/site";
import { LINKS } from "../lib/links";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="text-2xl tracking-tight">Agentic Kit</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {site.footerBlurb}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-normal text-ink-soft">
          <Link className="inline-flex min-h-11 items-center" to="/gallery">Gallery</Link>
          <Link className="inline-flex min-h-11 items-center" to="/docs">Docs</Link>
          <Link className="inline-flex min-h-11 items-center" to="/review">Capability Review</Link>
          <a className="inline-flex min-h-11 items-center" href={LINKS.agenticUx}>Agentic UX</a>
          <a className="inline-flex min-h-11 items-center" href={LINKS.hire}>Hire</a>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-10 md:px-8">
        <p className="text-xs leading-relaxed text-muted">
          Inspection is not a security audit or penetration test.{" "}
          <Link className="text-link" to="/docs/disclaimer">
            Read the disclaimer
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
