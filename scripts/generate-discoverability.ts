import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { docs, docLlmsPath, docPath } from "../src/data/docs";
import { POLICY_PACKS, site } from "../src/data/site";
import { resolveRouteLastmodMap } from "./lib/buildRouteLastmod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const routeLastmod = resolveRouteLastmodMap(root);

function abs(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${site.siteUrl}${normalized}`;
}

function formatRobotsTxt(): string {
  const lines: string[] = [
    "# Pre-training / bulk crawlers : disallow",
  ];

  for (const agent of site.crawlPolicy.disallow) {
    lines.push(`User-agent: ${agent}`, "Disallow: /", "");
  }

  lines.push("# Live retrieval + search : allow");

  for (const agent of site.crawlPolicy.allow) {
    lines.push(`User-agent: ${agent}`, "Allow: /", "");
  }

  lines.push(
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${abs("/sitemap.xml")}`,
    `# llms.txt: ${abs("/llms.txt")}`,
    "",
  );

  return lines.join("\n");
}

type SitemapEntry = { loc: string; priority: string; lastmod: string };

function sitemapEntries(): SitemapEntry[] {
  const htmlRoutes: Array<{ path: string; priority: string }> = [
    { path: "/", priority: "1.0" },
    { path: "/gallery", priority: "0.8" },
    { path: "/review", priority: "0.8" },
    { path: "/docs", priority: "0.9" },
    ...docs.map((d) => ({
      path: docPath(d.id),
      priority: d.id === "roadmap" ? "0.6" : "0.8",
    })),
  ];

  const agentAssets: Array<{ path: string; priority: string }> = [
    { path: "/llms.txt", priority: "0.9" },
    { path: "/llms-full.txt", priority: "0.8" },
    ...docs.map((d) => ({
      path: docLlmsPath(d.id),
      priority: "0.7",
    })),
    ...POLICY_PACKS.map((p) => ({
      path: p.path,
      priority: "0.6",
    })),
  ];

  return [...htmlRoutes, ...agentAssets].map(({ path, priority }) => ({
    loc: abs(path),
    priority,
    lastmod: routeLastmod[path] ?? site.datePublished,
  }));
}

function formatSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function formatAiTxt(): string {
  return [
    "User-Agent: *",
    "Allow: /",
    "",
    `# llms.txt index: ${abs("/llms.txt")}`,
    `# llms-full.txt: ${abs("/llms-full.txt")}`,
    "",
  ].join("\n");
}

function formatMcpServerCard(): string {
  const docIds = docs.map((d) => d.id);
  const packIds = POLICY_PACKS.map((p) => p.id);

  return JSON.stringify(
    {
      $schema: "https://modelcontextprotocol.io/schemas/server-card/v1.0",
      version: "1.0",
      protocolVersion: "2025-03-26",
      serverInfo: {
        name: "agentic-kit",
        version: "0.1.0",
        description:
          "Agentic Kit docs, policy packs, and pointers to Aletheia for Eve agent trust.",
        homepage: abs("/"),
        documentationUrl: abs("/docs/mcp"),
      },
      transport: {
        type: "streamable-http",
        url: site.mcpServerUrl,
      },
      capabilities: {
        tools: true,
        resources: true,
        prompts: true,
      },
      configSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
        description:
          "No configuration required. The server reads public docs and policy packs at runtime.",
      },
      tools: [
        {
          name: "list_docs",
          description:
            "List Agentic Kit doc ids. Prefer resources/list for MCP-native discovery.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: "get_doc",
          description:
            "Retrieve one Agentic Kit doc spec. Prefer resource agentic-kit://docs/{id}.",
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Doc id slug",
                enum: docIds,
              },
            },
            required: ["id"],
            additionalProperties: false,
          },
        },
        {
          name: "list_policy_packs",
          description: "List published policy pack ids.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: "get_policy_pack",
          description:
            "Retrieve one policy pack JSON. Prefer resource agentic-kit://policy-packs/{id}.",
          inputSchema: {
            type: "object",
            properties: {
              id: {
                type: "string",
                enum: packIds,
              },
            },
            required: ["id"],
            additionalProperties: false,
          },
        },
        {
          name: "get_full_library",
          description:
            "Retrieve llms-full.txt. Prefer resource agentic-kit://library/full.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
        },
      ],
      resources: [
        {
          uri: "agentic-kit://library/full",
          name: "library-full",
          title: "Full Agentic Kit corpus",
          description: "Complete docs corpus (llms-full.txt).",
          mimeType: "text/plain",
        },
      ],
      resourceTemplates: [
        {
          name: "doc-spec",
          uriTemplate: "agentic-kit://docs/{id}",
          title: "Agentic Kit doc specification",
          description: "Per-doc spec from public/llms/docs/{id}.txt.",
        },
        {
          name: "policy-pack",
          uriTemplate: "agentic-kit://policy-packs/{id}",
          title: "Policy pack JSON",
          description: "Blast-radius policy pack from public/policy-packs/{id}.json.",
        },
      ],
      prompts: [
        {
          name: "inspect-eve-agent",
          description:
            "Inspect an Eve agent with Aletheia honesty rules. Do not invent trust claims.",
          arguments: [
            {
              name: "agentPath",
              description: "Path or repo URL of the Eve agent workspace",
              required: true,
            },
            {
              name: "goal",
              description:
                "What to verify (portrait, authority diff, Kit Certified checklist)",
              required: false,
            },
          ],
        },
      ],
    },
    null,
    2,
  );
}

function formatApiCatalog(): string {
  return JSON.stringify(
    {
      linkset: [
        {
          anchor: abs("/"),
          describedby: [
            {
              href: abs("/llms.txt"),
              type: "text/plain",
              title: "Agentic Kit index for coding agents",
            },
            {
              href: abs("/llms-full.txt"),
              type: "text/plain",
              title: "Full docs corpus as a single document",
            },
          ],
          sitemap: [
            {
              href: abs("/sitemap.xml"),
              type: "application/xml",
              title: "HTML and agent asset sitemap",
            },
          ],
          "service-meta": [
            {
              href: abs("/.well-known/ai"),
              type: "application/json",
              title: "AI endpoint capability manifest",
            },
            {
              href: abs("/docs"),
              type: "text/html",
              title: "Human docs",
            },
          ],
          license: [
            {
              href: site.licenseUrl,
              title: `Content licence (${site.licenseLabel})`,
            },
          ],
        },
        {
          anchor: site.mcpServerUrl,
          "service-desc": [
            {
              href: abs("/.well-known/mcp/server-card.json"),
              type: "application/json",
              title: "MCP server card (SEP-2127)",
            },
          ],
          "service-doc": [
            {
              href: abs("/docs/mcp"),
              type: "text/html",
              title: "MCP setup and docs",
            },
          ],
        },
      ],
    },
    null,
    2,
  );
}

function formatWellKnownAi(): string {
  const docIds = docs.map((d) => d.id).join(", ");
  const packIds = POLICY_PACKS.map((p) => p.id).join(", ");

  return JSON.stringify(
    {
      aiendpoint: {
        service: {
          name: site.productName,
          description: site.metaDescription,
          provider: site.authorName,
        },
        capabilities: [
          {
            id: "docs-index",
            name: "Agentic Kit Docs Index",
            description:
              "Machine-readable docs for Eve agent trust: honesty contract, CLI, CI, Kit Certified",
            endpoint: abs("/llms.txt"),
            methods: ["GET"],
            parameters: [],
          },
          {
            id: "doc-detail",
            name: "Individual Doc Spec",
            description: "Self-contained guidance for one Kit doc",
            endpoint: `${abs("/llms/docs")}/{doc-id}.txt`,
            methods: ["GET"],
            parameters: [`doc-id: string, required : one of: ${docIds}`],
          },
          {
            id: "policy-packs",
            name: "Policy Packs",
            description: "Blast-radius policy.json packs for Eve agents",
            endpoint: `${abs("/policy-packs")}/{pack-id}.json`,
            methods: ["GET"],
            parameters: [`pack-id: string, required : one of: ${packIds}`],
          },
          {
            id: "mcp-agentic-kit",
            name: "Agentic Kit MCP",
            description:
              "MCP resources and tools for docs, policy packs, and Eve inspect prompt",
            endpoint: site.mcpServerUrl,
            methods: ["POST"],
            parameters: [
              "resources: agentic-kit://library/full, agentic-kit://docs/{id}, agentic-kit://policy-packs/{id}",
              "tools: list_docs, get_doc, list_policy_packs, get_policy_pack, get_full_library",
              "prompt: inspect-eve-agent",
            ],
          },
        ],
      },
    },
    null,
    2,
  );
}

function main(): void {
  const robotsPath = join(publicDir, "robots.txt");
  writeFileSync(robotsPath, formatRobotsTxt(), "utf8");
  console.log(`Wrote ${robotsPath}`);

  const lastmodPath = join(publicDir, "route-lastmod.json");
  writeFileSync(lastmodPath, `${JSON.stringify(routeLastmod, null, 2)}\n`, "utf8");
  console.log(`Wrote ${lastmodPath}`);

  const sitemapPath = join(publicDir, "sitemap.xml");
  writeFileSync(sitemapPath, formatSitemapXml(sitemapEntries()), "utf8");
  console.log(`Wrote ${sitemapPath}`);

  const aiTxtPath = join(publicDir, "ai.txt");
  writeFileSync(aiTxtPath, formatAiTxt(), "utf8");
  console.log(`Wrote ${aiTxtPath}`);

  const wellKnownDir = join(publicDir, ".well-known");
  mkdirSync(wellKnownDir, { recursive: true });
  const wellKnownPath = join(wellKnownDir, "ai");
  writeFileSync(wellKnownPath, formatWellKnownAi(), "utf8");
  console.log(`Wrote ${wellKnownPath}`);

  const mcpDir = join(wellKnownDir, "mcp");
  mkdirSync(mcpDir, { recursive: true });
  const serverCardPath = join(mcpDir, "server-card.json");
  writeFileSync(serverCardPath, formatMcpServerCard(), "utf8");
  console.log(`Wrote ${serverCardPath}`);

  const apiCatalogPath = join(wellKnownDir, "api-catalog");
  writeFileSync(apiCatalogPath, formatApiCatalog(), "utf8");
  console.log(`Wrote ${apiCatalogPath}`);
}

main();
