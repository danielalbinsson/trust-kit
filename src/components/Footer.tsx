import { Link } from "react-router-dom";
import { LINKS } from "../lib/links";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <p className="text-2xl tracking-tight">Agentic Kit</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            The place Eve builders go to inspect, stamp, and ship agents they can
            defend. Powered by{" "}
            <a className="text-link" href={LINKS.aletheia}>
              Aletheia
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-normal text-ink-soft">
          <Link to="/gallery">Gallery</Link>
          <Link to="/docs">Docs</Link>
          <Link to="/review">Capability Review</Link>
          <a href={LINKS.agenticUx}>Agentic UX</a>
          <a href={LINKS.hire}>Hire</a>
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
