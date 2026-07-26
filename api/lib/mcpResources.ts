import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  FULL_LIBRARY_URI,
  docTitle,
  docUri,
  listDocIds,
  listPolicyPackIds,
  parseDocIdFromUri,
  parsePolicyPackIdFromUri,
  policyPackTitle,
  policyPackUri,
  readDocSpec,
  readFullLibrary,
  readPolicyPack,
} from "./kitFiles.js";

export function registerKitResources(server: McpServer): void {
  server.registerResource(
    "library-full",
    FULL_LIBRARY_URI,
    {
      title: "Full Agentic Kit corpus",
      description:
        "Complete docs corpus as a single document (llms-full.txt). Prefer this resource over get_full_library when browsing MCP resources.",
      mimeType: "text/plain",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/plain",
          text: readFullLibrary(),
        },
      ],
    }),
  );

  server.registerResource(
    "doc-spec",
    new ResourceTemplate("agentic-kit://docs/{id}", {
      list: async () => ({
        resources: listDocIds().map((id) => ({
          uri: docUri(id),
          name: id,
          title: docTitle(id),
          description: `Agentic Kit doc specification for ${docTitle(id)}`,
          mimeType: "text/plain",
        })),
      }),
      complete: {
        id: () => listDocIds(),
      },
    }),
    {
      title: "Agentic Kit doc specification",
      description:
        "Per-doc spec from public/llms/docs/{id}.txt. Prefer resources/read over get_doc when attaching context.",
    },
    async (uri, variables) => {
      const fromTemplate = variables.id;
      const resolvedId =
        typeof fromTemplate === "string"
          ? fromTemplate
          : parseDocIdFromUri(uri);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/plain",
            text: readDocSpec(resolvedId),
          },
        ],
      };
    },
  );

  server.registerResource(
    "policy-pack",
    new ResourceTemplate("agentic-kit://policy-packs/{id}", {
      list: async () => ({
        resources: listPolicyPackIds().map((id) => ({
          uri: policyPackUri(id),
          name: id,
          title: policyPackTitle(id),
          description: `Policy pack JSON for ${policyPackTitle(id)}`,
          mimeType: "application/json",
        })),
      }),
      complete: {
        id: () => listPolicyPackIds(),
      },
    }),
    {
      title: "Policy pack JSON",
      description:
        "Blast-radius policy pack from public/policy-packs/{id}.json.",
    },
    async (uri, variables) => {
      const fromTemplate = variables.id;
      const resolvedId =
        typeof fromTemplate === "string"
          ? fromTemplate
          : parsePolicyPackIdFromUri(uri);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: readPolicyPack(resolvedId),
          },
        ],
      };
    },
  );
}
