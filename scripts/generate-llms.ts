import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { docs, docLlmsPath, docPath } from "../src/data/docs";
import { POLICY_PACKS, site } from "../src/data/site";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const docsDir = join(publicDir, "llms", "docs");

function abs(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${site.siteUrl}${normalized}`;
}

function formatDocSpec(doc: (typeof docs)[number]): string {
  return [
    `# ${doc.title}`,
    "",
    `> ${doc.summary}`,
    "",
    `Product: ${site.productName} (${abs("/")})`,
    `HTML: ${abs(docPath(doc.id))}`,
    `Engine docs: ${site.aletheiaLlms}`,
    "",
    doc.body.trim(),
    "",
    "## Related",
    "",
    `- Index: ${abs("/llms.txt")}`,
    `- Full corpus: ${abs("/llms-full.txt")}`,
    `- Aletheia skill: \`${site.aletheiaSkillInstall}\``,
    `- CLI: ${site.cliNpm}`,
    "",
  ].join("\n");
}

function formatIndex(): string {
  const docLinks = docs
    .map((d) => `- [${d.title}](${abs(docLlmsPath(d.id))}): ${d.summary}`)
    .join("\n");

  const packLinks = POLICY_PACKS.map(
    (p) => `- [${p.title}](${abs(p.path)}): ${p.description}`,
  ).join("\n");

  return [
    `# ${site.productName}`,
    "",
    `> ${site.siteTagline} By ${site.authorName}, ${site.authorTitle.toLowerCase()}.`,
    "",
    "Agentic Kit enforces Agentic UX lifecycle patterns on Eve: inspect (Aletheia",
    "portrait), gate (authority-diff CI), and stamp (Kit Certified blueprints).",
    "Prefer these Markdown surfaces over HTML SPA routes when briefing coding agents.",
    "",
    "## Use with your coding agent",
    "",
    "Before inspecting, gating, or stamping an Eve agent:",
    "",
    "```text",
    `1. Index: ${abs("/llms.txt")}`,
    `2. Doc file: ${abs("/llms/docs")}/{doc-id}.txt`,
    `3. Engine index: ${site.aletheiaLlms}`,
    `4. Skill: ${site.aletheiaSkillInstall}`,
    "```",
    "",
    "Local dev: reference `public/llms.txt` and `public/llms/docs/{id}.txt` directly",
    "(e.g. Cursor `@` file references). Do not invent trust claims; use Aletheia.",
    "",
    `MCP server: ${site.mcpServerUrl} — setup at ${abs("/docs/mcp")}`,
    "",
    "## Promise",
    "",
    "- Inspect: verified self-portrait + honesty contract (Aletheia)",
    "- Gate: authority diff in CI / on deploy (`@danielalbinsson/aletheia-cli`)",
    "- Stamp: Kit Certified starters that pass inspection + Agentic UX lifecycle",
    "",
    "## Docs",
    "",
    docLinks,
    "",
    "## Policy packs",
    "",
    packLinks,
    "",
    "## Engine & skill",
    "",
    `- [Aletheia llms.txt](${site.aletheiaLlms}): engine agent index`,
    `- [AGENTS.md](${site.aletheiaAgents}): install, config, usage for coding agents`,
    `- [Aletheia skill](${site.aletheiaSkillUrl}): \`${site.aletheiaSkillInstall}\``,
    `- [CLI (@danielalbinsson/aletheia-cli)](${site.cliNpm}): \`npx @danielalbinsson/aletheia-cli diff --baseline git:main\``,
    `- [Aletheia repository](${site.aletheiaRepo})`,
    "",
    "## Site (human UI)",
    "",
    `- [Home](${abs("/")}): product promise`,
    `- [Gallery](${abs("/gallery")}): stamped blueprints`,
    `- [Capability Review](${abs("/review")}): paid review CTA`,
    `- [Docs](${abs("/docs")}): honesty contract, CLI, CI, Kit Certified`,
    `- [MCP server](${abs("/docs/mcp")}): connect Cursor and other MCP clients`,
    `- [Agentic UX](${site.agenticUxUrl}): lifecycle patterns for supervised delegation`,
    `- [Hire](${site.hireUrl}): consulting / advisory`,
    "",
    "## Optional",
    "",
    `- [Complete corpus (llms-full.txt)](${abs("/llms-full.txt")}): all doc specs in one file`,
    "",
  ].join("\n");
}

function formatFull(): string {
  const parts = [
    `# ${site.productName} — full corpus`,
    "",
    `> Single-fetch corpus for AI agents. Prefer ${abs("/llms.txt")} as the index; use this file when you need docs inline.`,
    "",
    `Engine: ${site.aletheiaLlms}`,
    `Skill: \`${site.aletheiaSkillInstall}\``,
    "",
    "---",
    "",
  ];

  for (const doc of docs) {
    parts.push(formatDocSpec(doc), "---", "");
  }

  parts.push(
    "## Policy packs",
    "",
    ...POLICY_PACKS.map(
      (p) => `- [${p.title}](${abs(p.path)}): ${p.description}`,
    ),
    "",
  );

  return parts.join("\n");
}

function main(): void {
  mkdirSync(docsDir, { recursive: true });

  for (const doc of docs) {
    const path = join(docsDir, `${doc.id}.txt`);
    writeFileSync(path, formatDocSpec(doc), "utf8");
    console.log(`Wrote ${path}`);
  }

  const indexPath = join(publicDir, "llms.txt");
  writeFileSync(indexPath, formatIndex(), "utf8");
  console.log(`Wrote ${indexPath}`);

  const fullPath = join(publicDir, "llms-full.txt");
  writeFileSync(fullPath, formatFull(), "utf8");
  console.log(`Wrote ${fullPath}`);
}

main();
