import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { site } from "../../src/data/site.js";

export function registerKitPrompts(server: McpServer): void {
  server.registerPrompt(
    "inspect-eve-agent",
    {
      title: "Inspect Eve agent",
      description:
        "Inspect an Eve agent with Aletheia honesty rules. Do not invent trust claims.",
      argsSchema: {
        agentPath: z
          .string()
          .min(1)
          .describe("Path or repo URL of the Eve agent workspace"),
        goal: z
          .string()
          .optional()
          .describe(
            "What to verify (portrait, authority diff, Kit Certified checklist)",
          ),
      },
    },
    ({ agentPath, goal }) => {
      const goalLine = goal
        ? `Goal: ${goal}`
        : "Goal: produce a verified capability portrait and note any authority growth.";

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: [
                "You are helping inspect an Eve agent using Agentic Kit / Aletheia.",
                "",
                `Agent workspace: ${agentPath}`,
                goalLine,
                "",
                "Hard rules (honesty contract):",
                "- Never present a guess as a fact.",
                "- Prefer verified-from-build after `eve build`.",
                "- Label from-source reads as provisional.",
                "- Do not invent approvals, connection scopes, or runtime behavior.",
                "",
                "Steps:",
                `1. Install the skill if needed: \`${site.aletheiaSkillInstall}\``,
                "2. Read Agentic Kit docs via MCP resources or https://agentic-kit.dev/llms.txt",
                `3. Read engine index: ${site.aletheiaLlms}`,
                "4. Run portrait / `npx @aletheia/cli diff --baseline git:main` as appropriate",
                "5. Report verified facts, source-labelled claims, and drift separately",
                "",
                "If Kit Certified is in scope, use the checklist at agentic-kit://docs/kit-certified.",
              ].join("\n"),
            },
          },
        ],
      };
    },
  );
}
