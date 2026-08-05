/** Canonical site metadata for Agentic Kit. */

export const site = {
  siteUrl: "https://agentic-kit.dev",
  mcpServerUrl: "https://agentic-kit.dev/api/mcp",
  siteTitle: "Agentic Kit",
  siteShortName: "Kit",
  productName: "Agentic Kit",
  siteTagline: "Agentic UX patterns, enforced on eve.",
  metaTitleSuffix: "Supervised delegation on eve",
  metaDescription:
    "Supervised delegation for eve (Vercel) builders: lifecycle design from Agentic UX, portraits and authority-diff CI with Aletheia. Legibility tooling, not a security audit.",
  heroHeadline: "See what an eve agent can do before you run it.",
  heroLead:
    "Agents act on your behalf. The design job is making that reach legible to your team before merge.",
  heroSubline:
    "Patterns from Agentic UX, enforced with Aletheia portraits, authority-diff CI, and Kit Certified blueprints. Agentic Kit is the product shell; Aletheia is the inspector.",
  authorByline: "Daniel Albinsson · Designer · author of Agentic UX",
  homeLayersEyebrow: "Design to enforcement",
  footerBlurb:
    "Open tooling for eve teams who need legibility before merge. Patterns from Agentic UX, enforced with Aletheia.",
  docsIndexHeadline: "How supervised delegation shows up on eve.",
  docsIndexLead:
    "Design commitments and enforcement: honesty contract, lifecycle docs, CLI, CI gate, and the golden path from clone to red/green.",
  authorName: "Daniel Albinsson",
  authorTitle: "Designer",
  authorSite: "https://www.danielalbinsson.com",
  authorLinkedIn: "https://www.linkedin.com/in/danielalbinsson/",
  authorEmail: "daniel.Albinsson@pm.me",
  licenseLabel: "MIT",
  licenseUrl: "https://opensource.org/licenses/MIT",
  datePublished: "2026-07-25",
  aletheiaRepo: "https://github.com/danielalbinsson/Aletheia",
  aletheiaShowcase: "https://agentic-kit.dev/aletheia",
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
  ogImageAlt: "Agentic Kit: supervised delegation for eve agents",
  twitterCard: "summary_large_image" as const,
  galleryMetaDescription:
    "Stamped eve agent blueprints that pass Aletheia inspection and the Kit Certified checklist.",
  reviewMetaDescription:
    "Hire for eve agent legibility: Aletheia self-portraits, authority reporting, and a Kit Certified gap list you can ship against.",
  docsIndexMetaDescription:
    "Supervised delegation on eve: honesty contract, lifecycle docs, CLI, CI gate, Kit Certified, and the golden path.",
} as const;

export const SITE_TITLE = site.siteTitle;

export const POLICY_PACKS = [
  {
    id: "support-bot",
    title: "Support bot",
    description:
      "Blast-radius pack for customer-support eve agents (Phase 2 content).",
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
    description: "Blast-radius pack for design-tool eve agents.",
    path: "/policy-packs/design-tools.json",
  },
] as const;

export type PolicyPackId = (typeof POLICY_PACKS)[number]["id"];
