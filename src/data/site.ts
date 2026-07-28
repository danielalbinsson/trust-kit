/** Canonical site metadata for Agentic Kit (trust kit shell). */

export const site = {
  siteUrl: "https://agentic-kit.dev",
  mcpServerUrl: "https://agentic-kit.dev/api/mcp",
  siteTitle: "Agentic Kit",
  siteShortName: "Kit",
  productName: "Agentic Kit",
  siteTagline: "Inspect, stamp, and ship Eve agents you can defend.",
  metaDescription:
    "See what an Eve agent can do before you run it. Inspect, stamp, and ship agents you can defend.",
  heroThesis: "Inspect, stamp, and ship agents you can defend.",
  heroSubline:
    "Trust tooling for Eve builders: Aletheia portraits, authority-diff CI, and Kit Certified blueprints.",
  authorName: "Daniel Albinsson",
  authorTitle: "Designer",
  authorSite: "https://www.danielalbinsson.com",
  authorLinkedIn: "https://www.linkedin.com/in/danielalbinsson/",
  authorEmail: "daniel.Albinsson@pm.me",
  licenseLabel: "MIT",
  licenseUrl: "https://opensource.org/licenses/MIT",
  datePublished: "2026-07-25",
  aletheiaRepo: "https://github.com/danielalbinsson/Aletheia",
  aletheiaLlms:
    "https://raw.githubusercontent.com/danielalbinsson/Aletheia/main/public/llms.txt",
  aletheiaAgents:
    "https://raw.githubusercontent.com/danielalbinsson/Aletheia/main/AGENTS.md",
  aletheiaSkillInstall:
    "npx skills add danielalbinsson/Aletheia --skill aletheia-eve-trust",
  aletheiaSkillUrl:
    "https://github.com/danielalbinsson/Aletheia/tree/main/skills/aletheia-eve-trust",
  cliNpm: "https://www.npmjs.com/package/@danielalbinsson/aletheia-cli",
  agenticUxUrl: "https://agentic-ux.com",
  hireUrl: "https://agentic-ux.com/hire",
  crawlPolicy: {
    disallow: ["CCBot", "GPTBot", "ClaudeBot", "Google-Extended"] as const,
    allow: [
      "OAI-SearchBot",
      "ChatGPT-User",
      "Claude-SearchBot",
      "PerplexityBot",
      "Perplexity-User",
      "Googlebot",
      "Bingbot",
    ] as const,
  },
  ogImagePath: "/og-image.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Agentic Kit — See what an Eve agent can do before you run it.",
  twitterCard: "summary_large_image" as const,
  galleryMetaDescription:
    "Stamped Eve agent blueprints that pass Aletheia inspection and the Kit Certified checklist.",
  reviewMetaDescription:
    "Book a Capability Review: see what your Eve agent can touch, what it does alone, and whether this PR made it more powerful.",
  docsIndexMetaDescription:
    "Honesty contract, CLI, MCP server, CI gate, Kit Certified checklist, and the golden path from clone to red/green.",
} as const;

export const SITE_TITLE = site.siteTitle;

export const POLICY_PACKS = [
  {
    id: "support-bot",
    title: "Support bot",
    description:
      "Blast-radius pack for customer-support Eve agents (Phase 2 content).",
    path: "/policy-packs/support-bot.json",
  },
  {
    id: "payments-high",
    title: "Payments (high)",
    description: "High-stakes payments and billing blast-radius rules.",
    path: "/policy-packs/payments-high.json",
  },
  {
    id: "design-tools",
    title: "Design tools",
    description: "Blast-radius pack for design-tool Eve agents.",
    path: "/policy-packs/design-tools.json",
  },
] as const;

export type PolicyPackId = (typeof POLICY_PACKS)[number]["id"];
