import { createMcpHandler } from "mcp-handler";
import { registerKitPrompts } from "./lib/mcpPrompts.js";
import { registerKitResources } from "./lib/mcpResources.js";
import { registerKitTools } from "./lib/mcpTools.js";
import { site } from "../src/data/site.js";

const SERVER_INSTRUCTIONS = [
  "Agentic Kit is the Eve trust shell: inspect (Aletheia portraits), gate (aletheia-cli authority diff), stamp (Kit Certified).",
  "Prefer MCP resources over tools when attaching context: agentic-kit://docs/{id}, agentic-kit://policy-packs/{id}, agentic-kit://library/full.",
  "Tool tree: docs.list → docs.get; packs.list → packs.get; library.get for the full corpus.",
  "Honesty contract: never invent verified approvals, connection scopes, or runtime behavior. Use the inspect-eve-agent prompt for Aletheia workflows.",
  `Homepage: ${site.siteUrl} · Docs: ${site.siteUrl}/docs/mcp · Aletheia skill: ${site.aletheiaSkillInstall}`,
].join("\n");

const mcpHandler = createMcpHandler(
  (server) => {
    registerKitResources(server);
    registerKitPrompts(server);
    registerKitTools(server);
  },
  {
    // mcp-handler types serverInfo as {name,version}; runtime accepts full Implementation.
    serverInfo: {
      name: "agentic-kit",
      version: "0.2.0",
      title: site.productName,
      description: site.metaDescription,
      websiteUrl: site.siteUrl,
      icons: [
        {
          src: `${site.siteUrl}/favicon-32x32.png`,
          mimeType: "image/png",
          sizes: ["32x32"],
        },
        {
          src: `${site.siteUrl}/og-image.png`,
          mimeType: "image/png",
          sizes: ["1200x630"],
        },
      ],
    } as {
      name: string;
      version: string;
      title: string;
      description: string;
      websiteUrl: string;
      icons: { src: string; mimeType: string; sizes: string[] }[];
    },
    instructions: SERVER_INSTRUCTIONS,
  },
  {
    basePath: "/api",
    maxDuration: 300,
    verboseLogs: process.env.NODE_ENV !== "production",
  },
);

export default {
  async fetch(request: Request): Promise<Response> {
    return mcpHandler(request);
  },
};
