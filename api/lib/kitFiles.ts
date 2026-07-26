import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { docs } from "../../src/data/docs.js";
import { POLICY_PACKS } from "../../src/data/site.js";

export const DOC_ID_RE = /^[a-z0-9-]+$/;
export const PACK_ID_RE = /^[a-z0-9-]+$/;

export const KIT_URI_SCHEME = "agentic-kit://";
export const FULL_LIBRARY_URI = `${KIT_URI_SCHEME}library/full`;

function docsDir(): string {
  return join(process.cwd(), "public/llms/docs");
}

function policyPacksDir(): string {
  return join(process.cwd(), "public/policy-packs");
}

function fullLibraryPath(): string {
  return join(process.cwd(), "public/llms-full.txt");
}

export function listDocIds(): string[] {
  try {
    return readdirSync(docsDir())
      .filter((file) => file.endsWith(".txt"))
      .map((file) => file.replace(/\.txt$/, ""))
      .sort();
  } catch {
    return docs.map((d) => d.id);
  }
}

export function listPolicyPackIds(): string[] {
  try {
    return readdirSync(policyPacksDir())
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(/\.json$/, ""))
      .sort();
  } catch {
    return POLICY_PACKS.map((p) => p.id);
  }
}

export function docUri(id: string): string {
  return `${KIT_URI_SCHEME}docs/${id}`;
}

export function policyPackUri(id: string): string {
  return `${KIT_URI_SCHEME}policy-packs/${id}`;
}

export function docTitle(id: string): string {
  return docs.find((d) => d.id === id)?.title ?? id;
}

export function policyPackTitle(id: string): string {
  return POLICY_PACKS.find((p) => p.id === id)?.title ?? id;
}

export function readDocSpec(id: string): string {
  if (!DOC_ID_RE.test(id)) throw new Error(`Invalid doc id: ${id}`);
  return readFileSync(join(docsDir(), `${id}.txt`), "utf8");
}

export function readPolicyPack(id: string): string {
  if (!PACK_ID_RE.test(id)) throw new Error(`Invalid policy pack id: ${id}`);
  return readFileSync(join(policyPacksDir(), `${id}.json`), "utf8");
}

export function readFullLibrary(): string {
  return readFileSync(fullLibraryPath(), "utf8");
}

export function parseDocIdFromUri(uri: URL): string {
  if (uri.protocol !== "agentic-kit:") {
    throw new Error(`Unsupported resource URI scheme: ${uri.protocol}`);
  }
  const match = /^\/docs\/([a-z0-9-]+)$/.exec(uri.pathname);
  if (!match) throw new Error(`Unsupported resource URI: ${uri.href}`);
  return match[1];
}

export function parsePolicyPackIdFromUri(uri: URL): string {
  if (uri.protocol !== "agentic-kit:") {
    throw new Error(`Unsupported resource URI scheme: ${uri.protocol}`);
  }
  const match = /^\/policy-packs\/([a-z0-9-]+)$/.exec(uri.pathname);
  if (!match) throw new Error(`Unsupported resource URI: ${uri.href}`);
  return match[1];
}
