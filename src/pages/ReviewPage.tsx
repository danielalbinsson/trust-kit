import { CheckCircle, EnvelopeSimple } from "@phosphor-icons/react";
import { LINKS } from "../lib/links";

const deliverables = [
  "Aletheia self-portrait with provenance labels (verified vs from source)",
  "Authority report: blast radius, schedules, approvals, intentional cannots",
  "Kit Certified gap list: what to fix before you ship",
  "Optional PR-ready policy.json + consent sidecar recommendations",
];

export function ReviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
      <p className="eyebrow fade-up">Service</p>
      <h1 className="display fade-up-delay mt-4 max-w-3xl text-4xl md:text-6xl">
        Capability Review
      </h1>
      <p className="lead fade-up-delay-2 mt-6">
        I run fixed-scope reviews of eve agent repos. Stakeholders get a capability
        one-pager; you get a Kit Certified gap list to ship against.
      </p>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel order-2 p-8 md:p-10 lg:order-1">
          <h2 className="text-2xl tracking-tight">What you get</h2>
          <ul className="mt-6 space-y-4">
            {deliverables.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-relaxed text-ink-soft">
                <CheckCircle size={22} weight="thin" className="mt-0.5 shrink-0 text-teal" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-2xl tracking-tight">Scope & turnaround</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            One eve agent repo (or monorepo path). Async review in ~3–5 business
            days after access. Fixed fee typically{" "}
            <strong className="font-medium">€400–1500</strong> depending on
            connections, subagents, and CI depth.
          </p>

          <h2 className="mt-10 text-2xl tracking-tight">Support boundary</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            I review capability, consent, policy, and lifecycle legibility. I do
            not debug model quality, prompt craft, or product outcome metrics.
          </p>
          <p className="mt-4 text-sm text-muted">
            This is not a security audit or penetration test.{" "}
            <a className="text-link" href="/docs/disclaimer">
              Disclaimer
            </a>
            .
          </p>
        </div>

        <div className="panel order-1 flex flex-col justify-between p-8 md:p-10 lg:order-2">
          <div>
            <p className="eyebrow">Intake</p>
            <h2 className="mt-3 text-3xl tracking-tight">Request a review</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Email the repo URL (or grant temporary read access), the channels
              it will use, and when you need the report.
            </p>
            <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-ink-soft">
              <li>Repo link + branch to review</li>
              <li>Intended deployment (Slack, Linear, …)</li>
              <li>Deadline / stakeholder audience</li>
            </ol>
          </div>
          <a className="btn btn-primary mt-10" href={LINKS.email}>
            <EnvelopeSimple size={18} />
            daniel.Albinsson@pm.me
          </a>
        </div>
      </div>
    </div>
  );
}
