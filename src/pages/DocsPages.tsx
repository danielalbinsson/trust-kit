import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { DocMarkdown } from "../components/DocMarkdown";
import { DocsLayout } from "../components/DocsLayout";
import { DOCS_NAV, getDoc, type DocId } from "../data/docs";
import { site } from "../data/site";

export function DocsIndexPage() {
  const goldenPath = getDoc("golden-path");
  const main = DOCS_NAV.filter(
    (item) => item.id !== "roadmap" && item.id !== "golden-path",
  );
  const roadmap = DOCS_NAV.find((item) => item.id === "roadmap");

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
      <p className="eyebrow fade-up">Docs</p>
      <h1 className="display fade-up-delay mt-4 text-4xl md:text-6xl">
        {site.docsIndexHeadline}
      </h1>
      <p className="lead fade-up-delay-2 mt-6">{site.docsIndexLead}</p>
      <Link
        to="/docs/golden-path"
        className="panel-link fade-up-delay-2 mt-12 block p-6 md:p-8"
      >
        <p className="eyebrow">Start here</p>
        <h2 className="mt-3 text-2xl tracking-tight md:text-3xl">{goldenPath.title}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
          {goldenPath.summary}
        </p>
        <p className="text-link mt-6 inline-flex items-center gap-2 text-sm">
          Open the golden path
          <ArrowRight size={16} />
        </p>
      </Link>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
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

export function McpPage() {
  return <DocPage id="mcp" />;
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
