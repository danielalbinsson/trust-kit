/** Simple route → lastmod map. Uses site.datePublished as the baseline. */

import { site } from "../../src/data/site";
import { docs, docLlmsPath, docPath } from "../../src/data/docs";
import { POLICY_PACKS } from "../../src/data/site";

export function resolveRouteLastmodMap(
  _repoRoot: string,
): Record<string, string> {
  const fallback = site.datePublished;
  const map: Record<string, string> = {
    "/": fallback,
    "/gallery": fallback,
    "/review": fallback,
    "/docs": fallback,
    "/llms.txt": fallback,
    "/llms-full.txt": fallback,
  };

  for (const doc of docs) {
    map[docPath(doc.id)] = fallback;
    map[docLlmsPath(doc.id)] = fallback;
  }

  for (const pack of POLICY_PACKS) {
    map[pack.path] = fallback;
  }

  return map;
}
