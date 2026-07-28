import { LINKS } from "../lib/links";

const agents = [
  {
    name: "design-qa-agent",
    role: "Orchestrator",
    img: "/gallery/portrait-design-qa-agent.jpg",
    body: "Holds no tools of its own: it directs specialist subagents and reaches GitHub over MCP. The portrait shows the delegation graph.",
    repo: LINKS.designQaBundled,
    stamped: true,
  },
  {
    name: "support-bot",
    role: "Support blueprint",
    img: "/gallery/portrait-support-bot.jpg",
    body: "Customer support with refunds that ask first: the trust case in one screen. Kit Certified reference from eve-blueprints.",
    repo: LINKS.supportBot,
    stamped: true,
  },
  {
    name: "code-reviewer",
    role: "Blueprint pack",
    img: "/gallery/portrait-code-reviewer.jpg",
    body: "Reviews diffs, runs a security checklist, submits structured feedback. Reaches nothing outside itself.",
    repo: `${LINKS.eveBlueprints}/tree/main/code-reviewer`,
    stamped: false,
  },
];

export function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
      <p className="eyebrow fade-up">Gallery</p>
      <h1 className="display fade-up-delay mt-4 max-w-3xl text-4xl md:text-6xl">
        Portraits of agents you can defend.
      </h1>
      <p className="lead fade-up-delay-2 mt-6">
        Static Aletheia portraits plus deep-links into the repos. Open them locally
        in Aletheia. This site never hosts your agent source.
      </p>

      <div className="mt-14 grid gap-8">
        {agents.map((agent) => (
          <article key={agent.name} className="panel overflow-hidden md:grid md:grid-cols-2">
            <img
              src={agent.img}
              alt={`${agent.name} portrait`}
              className="aspect-[16/10] max-h-52 w-full object-cover object-top md:aspect-auto md:max-h-none md:min-h-[320px]"
            />
            <div className="flex flex-col justify-center p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <p className="eyebrow">{agent.role}</p>
                {agent.stamped ? (
                  <span className="rounded-full bg-lime/40 px-3 py-1 text-xs font-medium tracking-wide text-ink">
                    Kit Certified
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 text-3xl tracking-tight">{agent.name}</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">{agent.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="btn btn-primary" href={agent.repo}>
                  View repo
                </a>
                <a className="btn btn-secondary" href={LINKS.aletheia}>
                  Inspect in Aletheia
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
