// Guards the gallery's build-derived artifacts against drift and fabrication.
//
// Covers two artifact kinds, both rendered from committed files:
//   - passports (aletheia.passport/v1) — back the "Kit Certified" badge
//   - portraits (aletheia.portrait/v1) — rendered live in place of screenshots
//
// Invariants, each fails the build:
//   1. Every file the gallery imports (src/data/{passports,portraits}/*.json) is
//      byte-identical to the public copy a visitor can fetch. The rendered claim
//      and the verifiable artifact cannot diverge.
//   2. Every file is well-formed for its schema.
//
// This is the trust-kit analogue of `check:sync`. It does NOT regenerate the
// artifacts — that requires `aletheia passport|portrait` against each agent's
// build, run in the agent's own repo. This only proves the committed artifacts
// are honest and consistent.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

let failed = false;
const fail = (msg: string) => {
  console.error(`✗ ${msg}`);
  failed = true;
};

interface ArtifactKind {
  dir: string;
  schema: string;
  validate: (doc: Record<string, unknown>, file: string) => void;
}

const kinds: ArtifactKind[] = [
  {
    dir: "passports",
    schema: "aletheia.passport/v1",
    validate: (doc, file) => {
      if (typeof doc.certified !== "boolean") fail(`${file} has no boolean "certified" field`);
      if (!Array.isArray(doc.checks)) fail(`${file} has no "checks" array`);
    },
  },
  {
    dir: "portraits",
    schema: "aletheia.portrait/v1",
    validate: (doc, file) => {
      if (!Array.isArray(doc.bust)) fail(`${file} has no "bust" array`);
      if (!Array.isArray(doc.canDo)) fail(`${file} has no "canDo" array`);
      if (typeof doc.verified !== "boolean") fail(`${file} has no boolean "verified" field`);
    },
  },
];

let count = 0;
for (const kind of kinds) {
  const srcDir = path.join(root, "src/data", kind.dir);
  const pubDir = path.join(root, "public", kind.dir);
  const srcFiles = readdirSync(srcDir).filter((f) => f.endsWith(".json")).sort();
  if (srcFiles.length === 0) fail(`no ${kind.dir} found in src/data/${kind.dir}`);

  for (const file of srcFiles) {
    count++;
    const srcRaw = readFileSync(path.join(srcDir, file), "utf8");

    // Invariant 1: public copy exists and matches byte-for-byte.
    let pubRaw: string | null = null;
    try {
      pubRaw = readFileSync(path.join(pubDir, file), "utf8");
    } catch {
      fail(`public/${kind.dir}/${file} is missing — a stranger cannot verify this`);
    }
    if (pubRaw !== null && pubRaw !== srcRaw) {
      fail(`public/${kind.dir}/${file} has drifted from src/data/${kind.dir}/${file}`);
    }

    // Invariant 2: well-formed for the schema.
    let doc: Record<string, unknown>;
    try {
      doc = JSON.parse(srcRaw);
    } catch {
      fail(`${kind.dir}/${file} is not valid JSON`);
      continue;
    }
    if (doc.schema !== kind.schema) {
      fail(`${kind.dir}/${file} is not a ${kind.schema} document (schema="${String(doc.schema)}")`);
    }
    kind.validate(doc, `${kind.dir}/${file}`);
  }
}

if (failed) {
  console.error("\ncheck-passports: FAILED. Regenerate with `aletheia passport|portrait --format json` and copy into both src/data/ and public/.");
  process.exit(1);
}
console.log(`check-passports: OK (${count} artifact(s), src ↔ public in sync).`);
