import { site } from "./site.js";

export type DocId =
  | "honesty-contract"
  | "cli"
  | "mcp"
  | "golden-path"
  | "ci"
  | "kit-certified"
  | "disclaimer"
  | "roadmap";

export type DocEntry = {
  id: DocId;
  title: string;
  summary: string;
  eyebrow?: string;
  /** Markdown body shared by the docs UI and generated llms/*.txt files. */
  body: string;
};

export const docs: readonly DocEntry[] = [
  {
    id: "honesty-contract",
    title: "Honesty contract",
    summary:
      "Never present a guess as a fact. Verified-from-build vs from-source; what Aletheia refuses to invent.",
    body: `A trust tool that lies is worse than none. Aletheia's core rule: **never present a guess as a fact.** Every claim carries provenance.

## Verified from build

After \`eve build\`, the portrait reads the compiled manifest (\`.eve/compile/compiled-agent-manifest.json\`):

- Tool names, descriptions, and input schemas
- Connections and channels
- Schedules (acts-on-its-own)
- Framework tools the agent has disabled (verifiable "cannots")
- Subagents, recursed from nested manifests

## From source

Without a manifest (common on a fresh clone), Aletheia falls back to a tolerant read of \`agent/\` and labels it **from source — build to verify**.

## What Aletheia refuses to invent

- Per-tool **approval** as build-verified (use \`agent/.aletheia/consent.json\`; always source-declared)
- Connection read/write scope when eve does not expose it

Drift between source \`approval:\` gates and the consent sidecar is reported as **drift**, not shown as fact.`,
  },
  {
    id: "cli",
    title: "CLI quickstart",
    summary:
      "Headless authority diff for eve agents. Exit 1 means authority expanded.",
    body: `Headless authority diff for eve agents. Exit \`1\` means authority expanded.

## Install & run

\`\`\`bash
# Preferred for consumers
npx @danielalbinsson/aletheia-cli diff --baseline git:main

# From the Aletheia repo
pnpm build:cli
node bin/aletheia.mjs diff --baseline git:main
\`\`\`

## Inspector UI

\`\`\`bash
git clone https://github.com/danielalbinsson/Aletheia.git
cd Aletheia
pnpm install
pnpm dev   # → http://localhost:5173
\`\`\`

Browse to a folder containing \`agent/agent.ts\`. Prefer verified-from-build after \`eve build\`.

## Agent skill

\`\`\`bash
npx skills add danielalbinsson/Aletheia --skill aletheia-eve-trust
\`\`\`

## Exit codes

- \`0\` — ok
- \`1\` — authority expanded
- \`2\` — error`,
  },
  {
    id: "mcp",
    title: "MCP server",
    summary:
      "Connect Cursor and other MCP clients to Kit docs, policy packs, and the inspect-eve-agent prompt.",
    body: `When deployed, Agentic Kit exposes an MCP server over Streamable HTTP. No API keys or config. The server reads public docs and policy packs at runtime.

## Endpoint

- **URL:** ${site.mcpServerUrl}
- **Transport:** Streamable HTTP
- **Server card:** [/.well-known/mcp/server-card.json](/.well-known/mcp/server-card.json) (machine-readable manifest)

## Cursor

Add to \`.cursor/mcp.json\` or **Cursor Settings → MCP**:

\`\`\`json
{
  "mcpServers": {
    "agentic-kit": {
      "url": "${site.mcpServerUrl}"
    }
  }
}
\`\`\`

Restart Cursor (or reload MCP) after saving. The server should appear in your MCP tool list.

## Claude Desktop and other clients

Use the same URL with Streamable HTTP transport. Consult your client's MCP docs for the exact config shape; most accept a remote \`url\` field.

## Resources (preferred)

Use MCP **resources** when your client supports them. They map directly to Kit's llms corpus:

| URI | Purpose |
|-----|---------|
| \`agentic-kit://library/full\` | Entire corpus (\`llms-full.txt\`) |
| \`agentic-kit://docs/{id}\` | One doc spec (e.g. \`agentic-kit://docs/honesty-contract\`) |
| \`agentic-kit://policy-packs/{id}\` | Policy pack JSON (e.g. \`agentic-kit://policy-packs/support-bot\`) |

## Tools

Tool tree (dot notation): \`docs.list\` / \`docs.get\`, \`packs.list\` / \`packs.get\`, \`library.get\`. Prefer resources when browsing or attaching context.

## Prompt

**\`inspect-eve-agent\`** — pre-built inspection workflow with Aletheia honesty rules. Args: \`agentPath\` (required), \`goal\` (optional).

Pair with the [Aletheia skill](${site.aletheiaSkillUrl}) and [CLI quickstart](/docs/cli) for headless diffing.

## Also available

- [llms.txt](/llms.txt): index for agents that do not use MCP
- [API catalog](/.well-known/api-catalog): linkset for discovery bots`,
  },
  {
    id: "golden-path",
    title: "Golden path",
    summary:
      "Clone a stamped agent → portrait → CI fail demo → intentional ack. The red/green moment Kit is built around.",
    body: `The conversion loop: clone a stamped agent → portrait → CI fail demo → intentional ack. This is the red/green moment Kit is built around.

## 1. Clone a stamped agent

\`\`\`bash
git clone https://github.com/danielalbinsson/eve-blueprints.git
cd eve-blueprints/support-bot
# Or inspect the bundled design-qa agent in Aletheia at ./agent
\`\`\`

## 2. Build, then open the portrait

\`\`\`bash
# In the agent workspace root (folder that contains agent/)
eve build
# In Aletheia: pnpm dev → Browse folder → pick support-bot
# Or: ALETHEIA_WORKSPACE=/path/to/eve-blueprints/support-bot
\`\`\`

Confirm facts are labelled **verified from build**.

## 3. Commit a capability baseline

\`\`\`bash
# After a clean portrait, commit the snapshot used by diff
# agent/.aletheia/deployed-capabilities.json (generated / maintained by Aletheia CLI)
git add agent/.aletheia .aletheia .github/workflows/capability-review.yml
git commit -m "chore: capability baseline"
\`\`\`

## 4. Expand authority on a branch

\`\`\`bash
git checkout -b demo/add-connection
# Add a new connection under agent/connections/ (e.g. stripe.ts)
git add agent/connections && git commit -m "feat: add Stripe connection"
npx @danielalbinsson/aletheia-cli diff --baseline git:main
# → exit 1, authority expanded
\`\`\`

## 5. Acknowledge intentional growth

On the PR, add the \`capability-change-ack\` label after reviewing the sticky capability comment. Required checks stay red until the ack is present.

See [CI gate](/docs/ci) for the workflow file.`,
  },
  {
    id: "ci",
    title: "CI gate",
    summary:
      "Required check that fails when the agent gains power. Routine changes pass quietly.",
    body: `Ship a required check that fails when the agent gains power. Routine changes pass quietly.

## What is elevated

- New external reach (connections / channels)
- New acts-on-its-own schedule
- New delegation (subagent)
- Lifted restriction / removed approval gate
- Model or system-prompt change that expands authority

## Policy

\`\`\`json
// .aletheia/policy.json
{
  "failOn": "elevated",
  "rules": [
    { "category": "customer records", "severity": "high", "pattern": "zendesk|intercom" }
  ]
}
\`\`\`

## Ack label

Intentional merges use the GitHub label \`capability-change-ack\`. Without it, elevated diffs fail the required check.

## Workflow

Reference implementation: [Aletheia capability-review.yml](https://github.com/danielalbinsson/Aletheia/blob/main/.github/workflows/capability-review.yml). Stamped agents vendor a copy under \`.github/workflows/\`.`,
  },
  {
    id: "kit-certified",
    title: "Kit Certified",
    summary:
      "Public checklist for stamped agents: verified portrait, consent, policy, CI, lifecycle, passport.",
    body: `A Kit Certified agent is not "looks nice." It meets this public checklist:

1. Compiles; Aletheia portrait is mostly **verified from build**
2. \`agent/.aletheia/consent.json\` mirrors approval gates (no drift)
3. \`.aletheia/policy.json\` with sensible \`failOn\` + blast-radius rules
4. \`aletheia diff\` green in CI against a committed baseline
5. Before the agent acts / While the agent works / After the agent acts lifecycle documented (Agentic UX)
6. Intentional restrictions (disabled framework tools) visible as "cannots"
7. One-page passport, **generated** by \`aletheia passport\` from the compiled manifest (not hand-authored). It embeds the checklist result and a \`certified\` flag

The badge on the [gallery](/gallery) is derived from that generated passport, which is published per agent (e.g. [design-qa-agent.json](/passports/design-qa-agent.json)) so anyone can fetch and check it. Checks 1–5 are required; the lifecycle doc is advisory. An agent is Kit Certified only when every required check passes.

Selling blueprints without the stamp is just another template repo. This checklist is the public definition of **Kit Certified**.

Reference stamps: [support-bot](https://github.com/danielalbinsson/eve-blueprints/tree/main/support-bot) · [Beacon](https://github.com/danielalbinsson/Aletheia/tree/main/examples/beacon) · [design-qa (bundled)](https://github.com/danielalbinsson/Aletheia/tree/main/agent)`,
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    eyebrow: "Legal",
    summary:
      "Legibility tooling, not a security audit or compliance certification.",
    body: `Agentic Kit and Aletheia help you **see** what an eve agent is configured to do. They are not a security audit, penetration test, compliance certification, or guarantee that an agent is safe to run.

- Secrets can still leak through misconfigured credentials or prompts
- Runtime behavior can diverge from the static portrait
- Model choices and instructions can expand effective authority without a tool change

Use the honesty contract: never treat inferred facts as verified. Prefer \`eve build\` + required CI checks before merge or deploy.`,
  },
  {
    id: "roadmap",
    title: "Pro roadmap",
    eyebrow: "Phase 2 · gated",
    summary:
      "Public backlog for Kit Pro: Action, passport export, policy packs, stamped blueprint pack. Gated until demand + Aug 31.",
    body: `Kit Pro ships only after eve agent legibility audits prove demand **and** after August 31. Until then, this page is the public backlog, not a buy path.

## GitHub Action Pro

Marketplace-ready Action: sticky PR comment, portrait artifact, required check UX. Local-first still wins: the Action runs on GitHub; we do not host your agent source long-term.

## Passport export

\`\`\`bash
# Planned CLI surface
aletheia passport --format md
# PDF later
\`\`\`

## Policy packs

Curated \`policy.json\` packs (content, not SaaS). Drafts are published for early feedback and are not sold until Phase 2 unlocks:

- [support-bot.json](/policy-packs/support-bot.json)
- [payments-high.json](/policy-packs/payments-high.json)
- [design-tools.json](/policy-packs/design-tools.json)

## Stamped blueprint pack

Paid downloadable verticals with UX.md + consent + CI already wired. Built on the same Kit Certified checklist as the open references. Pack inventory staging: \`content/blueprints/\` in this repo.

## Explicitly later

- Hosted private gallery / shareable portrait URLs
- Org policy sync for managers who will not install Node

Want early access? Mention it when you [send your agent flow](/review).`,
  },
] as const;

export function getDoc(id: DocId): DocEntry {
  const entry = docs.find((d) => d.id === id);
  if (!entry) throw new Error(`Unknown doc id: ${id}`);
  return entry;
}

export function docPath(id: DocId): string {
  return `/docs/${id}`;
}

export function docLlmsPath(id: DocId): string {
  return `/llms/docs/${id}.txt`;
}

/** Nav order matches the product docs sidebar. */
export const DOCS_NAV = docs.map((d) => ({
  to: docPath(d.id),
  label: d.title,
  id: d.id,
}));
