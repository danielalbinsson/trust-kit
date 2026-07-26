import { Link } from "react-router-dom";
import { DocMarkdown } from "../components/DocMarkdown";
import { DocsLayout } from "../components/DocsLayout";
import { DOCS_NAV, getDoc, type DocId } from "../data/docs";

export function DocsIndexPage() {
  const main = DOCS_NAV.filter((item) => item.id !== "roadmap");
  const roadmap = DOCS_NAV.find((item) => item.id === "roadmap");

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
      <p className="eyebrow fade-up">Docs</p>
      <h1 className="display fade-up-delay mt-4 text-4xl md:text-6xl">
        How trust shows up on Eve.
      </h1>
      <p className="lead fade-up-delay-2 mt-6">
        Honesty contract, CLI, CI gate, Kit Certified checklist, and the golden path
        from clone to red/green.
      </p>
      <div className="mt-12 grid gap-3 sm:grid-cols-2">
        {main.map((item) => (
          <Link key={item.to} to={item.to} className="panel-link p-6">
            <h2 className="text-xl tracking-tight">{item.label}</h2>
            <p className="mt-2 text-sm font-normal text-teal">Open →</p>
          </Link>
        ))}
      </div>
      {roadmap ? (
        <Link
          to={roadmap.to}
          className="panel-link mt-3 block p-6 sm:flex sm:items-center sm:justify-between"
        >
          <h2 className="text-xl tracking-tight">{roadmap.label}</h2>
          <p className="mt-2 text-sm font-normal text-teal sm:mt-0">Open →</p>
        </Link>
      ) : null}
    </div>
  );
}

function DocPage({ id }: { id: DocId }) {
  const doc = getDoc(id);
  return (
    <DocsLayout title={doc.title} eyebrow={doc.eyebrow ?? "Docs"}>
      <DocMarkdown source={doc.body} />
    </DocsLayout>
  );
}

export function HonestyContractPage() {
  return <DocPage id="honesty-contract" />;
}

export function CliPage() {
  return <DocPage id="cli" />;
}

export function GoldenPathPage() {
  return <DocPage id="golden-path" />;
}

export function CiPage() {
  return <DocPage id="ci" />;
}

export function KitCertifiedPage() {
  return <DocPage id="kit-certified" />;
}

export function DisclaimerPage() {
  return <DocPage id="disclaimer" />;
}

export function RoadmapPage() {
  return <DocPage id="roadmap" />;
}
