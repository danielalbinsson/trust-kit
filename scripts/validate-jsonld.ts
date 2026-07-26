import { jsonLdGraphForPath } from "../src/lib/structuredData";
import { docs, docPath } from "../src/data/docs";

const paths = [
  "/",
  "/gallery",
  "/review",
  "/docs",
  ...docs.map((d) => docPath(d.id)),
];

let failed = false;

for (const path of paths) {
  const graph = jsonLdGraphForPath(path);
  if (!Array.isArray(graph) || graph.length === 0) {
    console.error(`Empty JSON-LD graph for ${path}`);
    failed = true;
    continue;
  }
  for (const node of graph) {
    if (!node["@type"]) {
      console.error(`Missing @type in graph for ${path}`);
      failed = true;
    }
  }
  console.log(`ok ${path} (${graph.length} nodes)`);
}

if (failed) process.exit(1);
console.log("validate:jsonld passed");
