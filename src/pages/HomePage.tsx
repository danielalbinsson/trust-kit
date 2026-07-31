import { ArrowRight, Eye, SealCheck, ShieldCheck } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { PortraitBust } from "../components/PortraitBust";
import { site } from "../data/site";
import { LINKS } from "../lib/links";
import { galleryAgents } from "../data/gallery";

const layers = [
  {
    step: "01",
    icon: Eye,
    title: "Inspect",
    body: "Aletheia renders a self-portrait from the agent on disk: what it can touch, what it does alone, what it asks first.",
  },
  {
    step: "02",
    icon: ShieldCheck,
    title: "Gate",
    body: "aletheia diff fails the PR when authority expands. Intentional growth needs an explicit ack, not a silent merge.",
    emphasize: true,
  },
  {
    step: "03",
    icon: SealCheck,
    title: "Stamp",
    body: "Kit Certified blueprints ship consent, policy, CI, and Agentic UX lifecycle docs (Before the agent acts / While the agent works / After the agent acts).",
  },
];

export function HomePage() {
  return (
    <>
      <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
        <h1 className="display fade-up max-w-4xl text-5xl md:text-7xl">
          {site.heroHeadline}
        </h1>
        <p className="lead fade-up-delay-2 mt-6 max-w-3xl">{site.heroLead}</p>
        <p className="fade-up-delay-2 mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
          {site.heroSubline}
        </p>
        <div className="fade-up-delay-2 mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3">
          <Link className="btn btn-primary w-full min-w-0 sm:w-auto" to="/docs/golden-path">
            Walk the golden path
            <ArrowRight size={18} weight="bold" className="shrink-0" />
          </Link>
          <Link className="btn btn-secondary w-full min-w-0 sm:w-auto" to="/docs/cli">
            <code className="truncate text-sm text-inherit">npx @danielalbinsson/aletheia-cli</code>
          </Link>
          <a className="text-link text-link-tap text-sm" href={LINKS.aletheia}>
            Open Aletheia
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="eyebrow">{site.homeLayersEyebrow}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {layers.map((layer) => (
            <div
              key={layer.title}
              className={[
                "panel p-7",
                layer.emphasize ? "ring-1 ring-ink/20" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <layer.icon size={28} weight="thin" className="text-teal" aria-hidden />
                <span className="step-num">{layer.step}</span>
              </div>
              <h2 className="mt-5 text-2xl tracking-tight">{layer.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">{layer.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5 md:px-8">
        <div className="panel overflow-hidden">
          <div className="grid min-w-0 md:grid-cols-2">
            <div className="flex min-w-0 flex-col justify-center p-5 md:p-12">
              <p className="eyebrow">The red/green moment</p>
              <h2 className="display mt-4 text-3xl md:text-4xl">
                Authority expanded. Review required.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                A teammate adds Stripe on a branch. The capability check fails before
                credentials go live. Same bar when supervision matters: refunds that ask
                first, reach widened in silence.
              </p>
              <pre className="cli-snippet" tabIndex={0}>
                <code>
                  {`$ npx @danielalbinsson/aletheia-cli diff --baseline git:main\n`}
                  <span className="fail">exit 1</span>
                  {`  authority expanded\n`}
                  {`+ connection  stripe\n`}
                  <span className="ok"># add label capability-change-ack to merge</span>
                </code>
              </pre>
              <Link
                to="/docs/golden-path"
                className="text-link text-link-tap mt-8 inline-flex items-center gap-2 text-sm"
              >
                Walk the golden path
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="bg-paper-deep p-4 md:p-6">
              <img
                src="/gallery/capability-review-authority-expanded.jpg"
                alt="Aletheia authority diff showing authority expanded"
                className="h-full w-full rounded-[var(--radius-md)] object-cover object-top shadow-[var(--shadow-elevated)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5 pb-8 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="display text-3xl md:text-4xl">
              Agents you can open before you run.
            </h2>
          </div>
          <Link to="/gallery" className="btn btn-secondary self-start">
            View gallery
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {galleryAgents.slice(0, 2).map((agent) => (
            <a key={agent.name} href={agent.repo} className="panel-link group overflow-hidden">
              <PortraitBust portrait={agent.portrait} compact />
              <div className="p-6">
                <h3 className="text-xl tracking-tight">{agent.name}</h3>
                <p className="mt-2 text-sm text-muted">{agent.body}</p>
                <p className="text-link mt-4 text-sm">View repo →</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
