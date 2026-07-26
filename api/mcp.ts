import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { registerKitPrompts } from "./lib/mcpPrompts.js";
import { registerKitResources } from "./lib/mcpResources.js";
import {
  DOC_ID_RE,
  PACK_ID_RE,
  listDocIds,
  listPolicyPackIds,
  readDocSpec,
  readFullLibrary,
  readPolicyPack,
} from "./lib/kitFiles.js";

const mcpHandler = createMcpHandler(
  (server) => {
    registerKitResources(server);
    registerKitPrompts(server);

    server.tool(
      "list_docs",
      "List all available Agentic Kit doc ids. Prefer resources/list for MCP-native discovery.",
      {},
      async () => {
        try {
          const ids = listDocIds();
          return {
            content: [
              {
                type: "text",
                text: `Available docs (${ids.length}): ${ids.join(", ")}`,
              },
            ],
          };
        } catch {
          return {
            content: [
              {
                type: "text",
                text: "Failed to scan public/llms/docs. Run pnpm generate:llms before starting the MCP server.",
              },
            ],
            isError: true,
          };
        }
      },
    );

    server.tool(
      "get_doc",
      "Retrieve the full Agentic Kit doc specification for a given id. Prefer resource agentic-kit://docs/{id}.",
      {
        id: z
          .string()
          .regex(DOC_ID_RE)
          .describe("Doc id slug, e.g. 'honesty-contract' or 'kit-certified'"),
      },
      async ({ id }) => {
        try {
          return {
            content: [{ type: "text", text: readDocSpec(id) }],
          };
        } catch {
          return {
            content: [
              {
                type: "text",
                text: `Doc '${id}' not found. Run list_docs first.`,
              },
            ],
            isError: true,
          };
        }
      },
    );

    server.tool(
      "list_policy_packs",
      "List published policy pack ids. Prefer resources/list for MCP-native discovery.",
      {},
      async () => {
        try {
          const ids = listPolicyPackIds();
          return {
            content: [
              {
                type: "text",
                text: `Available policy packs (${ids.length}): ${ids.join(", ")}`,
              },
            ],
          };
        } catch {
          return {
            content: [
              {
                type: "text",
                text: "Failed to scan public/policy-packs.",
              },
            ],
            isError: true,
          };
        }
      },
    );

    server.tool(
      "get_policy_pack",
      "Retrieve one policy pack JSON. Prefer resource agentic-kit://policy-packs/{id}.",
      {
        id: z
          .string()
          .regex(PACK_ID_RE)
          .describe("Policy pack id, e.g. 'support-bot'"),
      },
      async ({ id }) => {
        try {
          return {
            content: [{ type: "text", text: readPolicyPack(id) }],
          };
        } catch {
          return {
            content: [
              {
                type: "text",
                text: `Policy pack '${id}' not found. Run list_policy_packs first.`,
              },
            ],
            isError: true,
          };
        }
      },
    );

    server.tool(
      "get_full_library",
      "Retrieve the complete Agentic Kit corpus (llms-full.txt). Prefer resource agentic-kit://library/full.",
      {},
      async () => {
        try {
          return {
            content: [{ type: "text", text: readFullLibrary() }],
          };
        } catch {
          return {
            content: [
              {
                type: "text",
                text: "Failed to read public/llms-full.txt. Run pnpm generate:llms before starting the MCP server.",
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
  {
    serverInfo: {
      name: "agentic-kit",
      version: "0.1.0",
    },
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
