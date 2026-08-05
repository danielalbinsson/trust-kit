// Gallery agents. Two things here are DERIVED from real build artifacts, never
// hand-set: the "Kit Certified" badge, and the portrait.
//
// Badge: `stamped` is `passport.certified === true`, read from a passport emitted
// by `aletheia passport`. It once claimed certification for support-bot whose
// real passport is not certified — the badge lied. Now it can't.
//
// Portrait: the gallery used to ship 100 KB JPEG screenshots labelled "verified
// from build". One showed a tool that had been deleted. A screenshot cannot stay
// true, so the portrait is now a generated `aletheia.portrait/v1` artifact,
// rendered live. scripts/check-passports.ts gates both against their public
// copies a stranger can fetch.

import designQaPassport from "./passports/design-qa-agent.json" with { type: "json" };
import supportBotPassport from "./passports/support-bot.json" with { type: "json" };
import codeReviewerPassport from "./passports/code-reviewer.json" with { type: "json" };
import designQaPortrait from "./portraits/design-qa-agent.json" with { type: "json" };
import supportBotPortrait from "./portraits/support-bot.json" with { type: "json" };
import codeReviewerPortrait from "./portraits/code-reviewer.json" with { type: "json" };
import { LINKS } from "../lib/links.js";

interface PassportCheck {
  id: string;
  title: string;
  required: boolean;
  status: "pass" | "fail" | "advisory-pass" | "advisory-fail";
  detail: string;
}
interface Passport {
  schema: string;
  name: string;
  certified: boolean;
  checks: PassportCheck[];
}

export interface Portrait {
  schema: string;
  name: string;
  verified: boolean;
  provenance: string;
  bust: string[];
  canDo: { label: string; asksFirst: boolean }[];
  canTouch: string[];
  doesOnItsOwn: { when: string; does: string; asksFirst: boolean }[];
  cannot: { tool: string; label: string }[];
  subagents: string[];
}

export interface GalleryAgent {
  name: string;
  role: string;
  body: string;
  repo: string;
  /** Public URLs a visitor can fetch and verify. */
  passportUrl: string;
  portraitUrl: string;
  /** Derived from the passport, not stored. */
  stamped: boolean;
  /** Required checks still failing, for honest "not yet certified" copy. */
  pendingChecks: string[];
  /** Generated portrait, rendered live in place of a screenshot. */
  portrait: Portrait;
}

function pending(passport: Passport): string[] {
  return passport.checks.filter((c) => c.required && c.status === "fail").map((c) => c.title);
}

const passports: Record<string, Passport> = {
  "design-qa-agent": designQaPassport as Passport,
  "support-bot": supportBotPassport as Passport,
  "code-reviewer": codeReviewerPassport as Passport,
};

const portraits: Record<string, Portrait> = {
  "design-qa-agent": designQaPortrait as Portrait,
  "support-bot": supportBotPortrait as Portrait,
  "code-reviewer": codeReviewerPortrait as Portrait,
};

interface AgentMeta {
  slug: keyof typeof passports;
  name: string;
  role: string;
  body: string;
  repo: string;
}

const meta: AgentMeta[] = [
  {
    slug: "design-qa-agent",
    name: "Design QA Agent",
    role: "Orchestrator",
    body: "Holds no tools of its own: it directs specialist subagents and reaches GitHub over MCP. The portrait shows the delegation graph.",
    repo: LINKS.designQa,
  },
  {
    slug: "support-bot",
    name: "support-bot",
    role: "Support blueprint",
    body: "Customer support with refunds that ask first: the trust case in one screen.",
    repo: LINKS.supportBot,
  },
  {
    slug: "code-reviewer",
    name: "code-reviewer",
    role: "Blueprint pack",
    body: "Reviews diffs, runs a security checklist, submits structured feedback. Reaches nothing outside itself.",
    repo: `${LINKS.eveBlueprints}/tree/main/code-reviewer`,
  },
];

export const galleryAgents: GalleryAgent[] = meta.map((m) => {
  const passport = passports[m.slug];
  return {
    name: m.name,
    role: m.role,
    body: m.body,
    repo: m.repo,
    passportUrl: `/passports/${m.slug}.json`,
    portraitUrl: `/portraits/${m.slug}.json`,
    stamped: passport.certified === true,
    pendingChecks: passport.certified ? [] : pending(passport),
    portrait: portraits[m.slug],
  };
});
