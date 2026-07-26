/**
 * Light head-injection prerender (no React SSR).
 * After vite build, writes dist/{route}/index.html with per-route title,
 * description, social meta, and JSON-LD.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { docs, docPath } from "../src/data/docs";
import { resolvePageMeta, socialMetaTagsHtml } from "../src/lib/pageMeta";
import {
  jsonLdScriptHtml,
  llmsAlternateLinkHtml,
  robotsMetaHtml,
} from "../src/lib/structuredData";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.resolve(root, "dist");

const routes = [
  "/",
  "/gallery",
  "/review",
  "/docs",
  ...docs.map((d) => docPath(d.id)),
];

function writeRouteHtml(route: string, template: string): void {
  const meta = resolvePageMeta(route);
  const social = socialMetaTagsHtml(meta);
  const jsonLd = jsonLdScriptHtml(route);

  let html = template;
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`,
  );
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
  );

  const headExtras = [
    robotsMetaHtml,
    llmsAlternateLinkHtml,
    social,
    jsonLd,
  ].join("\n    ");

  if (html.includes("<!-- head-extras:start -->")) {
    html = html.replace(
      /<!-- head-extras:start -->[\s\S]*?<!-- head-extras:end -->/,
      `<!-- head-extras:start -->\n    ${headExtras}\n    <!-- head-extras:end -->`,
    );
  } else {
    html = html.replace("</head>", `    ${headExtras}\n  </head>`);
  }

  const outDir =
    route === "/" ? distDir : path.join(distDir, route.replace(/^\//, ""));
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "index.html");
  fs.writeFileSync(outPath, html, "utf8");
  console.log(`Wrote ${outPath}`);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

const templatePath = path.join(distDir, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error("dist/index.html missing — run vite build first");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf8");
console.log(`Pre-rendering ${routes.length} routes (head injection)…`);
for (const route of routes) {
  writeRouteHtml(route, template);
}
console.log("Done.");
