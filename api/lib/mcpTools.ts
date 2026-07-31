import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  DOC_ID_RE,
  PACK_ID_RE,
  docTitle,
  docUri,
  listDocIds,
  listPolicyPackIds,
  policyPackTitle,
  policyPackUri,
  readDocSpec,
  readFullLibrary,
  readPolicyPack,
} from "./kitFiles.js";

/** Local read-only corpus — safe to auto-approve; no external network. */
export const READONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

const docIdSchema = z
  .string()
  .regex(DOC_ID_RE)
  .describe(
    "Doc id slug from docs.list. Examples: 'honesty-contract', 'kit-certified', 'cli', 'ci'.",
  );

const packIdSchema = z
  .string()
  .regex(PACK_ID_RE)
  .describe(
    "Policy pack id from packs.list. Examples: 'support-bot', 'payments-high', 'design-tools'.",
  );

const listIdsOutput = {
  count: z.number().int().describe("Number of ids returned"),
  ids: z.array(z.string()).describe("Sorted id slugs"),
  preferredResourceHint: z
    .string()
    .describe("MCP resource URI pattern to prefer over tools when attaching context"),
};

const getDocOutput = {
  id: z.string().describe("Doc id slug"),
  title: z.string().describe("Human title for the doc"),
  uri: z.string().describe("Canonical MCP resource URI for this doc"),
  text: z.string().describe("Full markdown/plain-text doc body"),
};

const getPackOutput = {
  id: z.string().describe("Policy pack id"),
  title: z.string().describe("Human title for the pack"),
  uri: z.string().describe("Canonical MCP resource URI for this pack"),
  json: z.string().describe("Policy pack JSON as a string"),
};

const getLibraryOutput = {
  uri: z.string().describe("Canonical MCP resource URI for the full corpus"),
  text: z.string().describe("Complete llms-full.txt corpus"),
  byteLength: z.number().int().describe("UTF-8 byte length of the corpus text"),
};

function textResult(payload: Record<string, unknown>, isError = false) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload, null, 2),
      },
    ],
    structuredContent: payload,
    ...(isError ? { isError: true } : {}),
  };
}

export function registerKitTools(server: McpServer): void {
  server.registerTool(
    "docs.list",
    {
      title: "List docs",
      description:
        "List every Agentic Kit doc id (honesty contract, CLI, CI, Kit Certified, and more). Prefer resources/list and agentic-kit://docs/{id} when attaching context; call docs.get only when you need the body as a tool result.",
      inputSchema: {},
      outputSchema: listIdsOutput,
      annotations: READONLY,
    },
    async () => {
      try {
        const ids = listDocIds();
        return textResult({
          count: ids.length,
          ids,
          preferredResourceHint: "agentic-kit://docs/{id}",
        });
      } catch {
        return textResult(
          {
            count: 0,
            ids: [],
            preferredResourceHint:
              "Failed to scan public/llms/docs. Run pnpm generate:llms before starting the MCP server.",
          },
          true,
        );
      }
    },
  );

  server.registerTool(
    "docs.get",
    {
      title: "Get doc",
      description:
        "Fetch one Agentic Kit doc body by id (markdown/plain text). Prefer resource agentic-kit://docs/{id} when your client can attach resources; use this tool when you need the text in the tool channel.",
      inputSchema: { id: docIdSchema },
      outputSchema: getDocOutput,
      annotations: READONLY,
    },
    async ({ id }) => {
      try {
        const text = readDocSpec(id);
        return textResult({
          id,
          title: docTitle(id),
          uri: docUri(id),
          text,
        });
      } catch {
        return textResult(
          {
            id,
            title: "",
            uri: docUri(id),
            text: `Doc '${id}' not found. Call docs.list first.`,
          },
          true,
        );
      }
    },
  );

  server.registerTool(
    "packs.list",
    {
      title: "List policy packs",
      description:
        "List published blast-radius policy pack ids for eve agents. Prefer resources/list and agentic-kit://policy-packs/{id}; call packs.get when you need the JSON as a tool result.",
      inputSchema: {},
      outputSchema: listIdsOutput,
      annotations: READONLY,
    },
    async () => {
      try {
        const ids = listPolicyPackIds();
        return textResult({
          count: ids.length,
          ids,
          preferredResourceHint: "agentic-kit://policy-packs/{id}",
        });
      } catch {
        return textResult(
          {
            count: 0,
            ids: [],
            preferredResourceHint: "Failed to scan public/policy-packs.",
          },
          true,
        );
      }
    },
  );

  server.registerTool(
    "packs.get",
    {
      title: "Get policy pack",
      description:
        "Fetch one policy pack JSON by id (blast-radius thresholds per domain). Prefer resource agentic-kit://policy-packs/{id} when attaching context.",
      inputSchema: { id: packIdSchema },
      outputSchema: getPackOutput,
      annotations: READONLY,
    },
    async ({ id }) => {
      try {
        const json = readPolicyPack(id);
        return textResult({
          id,
          title: policyPackTitle(id),
          uri: policyPackUri(id),
          json,
        });
      } catch {
        return textResult(
          {
            id,
            title: "",
            uri: policyPackUri(id),
            json: `Policy pack '${id}' not found. Call packs.list first.`,
          },
          true,
        );
      }
    },
  );

  server.registerTool(
    "library.get",
    {
      title: "Get full library",
      description:
        "Fetch the complete Agentic Kit corpus (llms-full.txt) in one call. Prefer resource agentic-kit://library/full when attaching context; use this tool only when the client lacks resource support.",
      inputSchema: {},
      outputSchema: getLibraryOutput,
      annotations: READONLY,
    },
    async () => {
      try {
        const text = readFullLibrary();
        return textResult({
          uri: "agentic-kit://library/full",
          text,
          byteLength: new TextEncoder().encode(text).byteLength,
        });
      } catch {
        return textResult(
          {
            uri: "agentic-kit://library/full",
            text: "Failed to read public/llms-full.txt. Run pnpm generate:llms before starting the MCP server.",
            byteLength: 0,
          },
          true,
        );
      }
    },
  );
}
