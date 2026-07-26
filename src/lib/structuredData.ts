import { docs, docPath, type DocId } from "../data/docs";
import { POLICY_PACKS, site } from "../data/site";

const ORG_ID = `${site.siteUrl}/#organization`;
const PERSON_ID = `${site.siteUrl}/#person`;
const WEBSITE_ID = `${site.siteUrl}/#website`;
const SOFTWARE_ID = `${site.siteUrl}/#software`;

export function toAbsoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${site.siteUrl}${normalized}`;
}

export function pagePathToUrl(path: string): string {
  if (path === "/") return site.siteUrl;
  return toAbsoluteUrl(path);
}

export function globalJsonLdGraph(): Record<string, unknown>[] {
  return [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: site.siteTitle,
      url: site.siteUrl,
      description: site.metaDescription,
      license: site.licenseUrl,
      creator: { "@id": PERSON_ID },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: site.authorName,
      url: site.authorSite,
      jobTitle: site.authorTitle,
      email: site.authorEmail,
      sameAs: [site.authorLinkedIn, site.authorSite],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: site.siteUrl,
      name: site.siteTitle,
      description: site.metaDescription,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": SOFTWARE_ID,
      name: site.productName,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      url: site.siteUrl,
      description: site.metaDescription,
      author: { "@id": PERSON_ID },
      publisher: { "@id": ORG_ID },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ];
}

export function homePageJsonLd(): Record<string, unknown>[] {
  return [
    ...globalJsonLdGraph(),
    {
      "@type": "ItemList",
      name: `${site.productName} docs`,
      numberOfItems: docs.length,
      itemListElement: docs.map((doc, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: doc.title,
        url: pagePathToUrl(docPath(doc.id)),
      })),
    },
  ];
}

export function docsIndexJsonLd(): Record<string, unknown>[] {
  return [
    ...globalJsonLdGraph(),
    {
      "@type": "CollectionPage",
      "@id": pagePathToUrl("/docs"),
      name: `Docs · ${site.siteTitle}`,
      url: pagePathToUrl("/docs"),
      description: site.docsIndexMetaDescription,
    },
  ];
}

export function docPageJsonLd(id: DocId): Record<string, unknown>[] {
  const doc = docs.find((d) => d.id === id);
  if (!doc) return globalJsonLdGraph();
  const url = pagePathToUrl(docPath(id));
  return [
    ...globalJsonLdGraph(),
    {
      "@type": "TechArticle",
      "@id": url,
      headline: doc.title,
      description: doc.summary,
      url,
      author: { "@id": PERSON_ID },
      publisher: { "@id": ORG_ID },
      datePublished: site.datePublished,
      dateModified: site.datePublished,
      inLanguage: "en",
      keywords: [
        "Eve agent",
        "agent trust",
        "Aletheia",
        "capability review",
        "Kit Certified",
      ],
    },
  ];
}

export function galleryPageJsonLd(): Record<string, unknown>[] {
  return [
    ...globalJsonLdGraph(),
    {
      "@type": "CollectionPage",
      "@id": pagePathToUrl("/gallery"),
      name: `Gallery · ${site.siteTitle}`,
      url: pagePathToUrl("/gallery"),
      description: site.galleryMetaDescription,
      hasPart: POLICY_PACKS.map((pack) => ({
        "@type": "CreativeWork",
        name: pack.title,
        description: pack.description,
        url: pagePathToUrl(pack.path),
      })),
    },
  ];
}

export function reviewPageJsonLd(): Record<string, unknown>[] {
  return [
    ...globalJsonLdGraph(),
    {
      "@type": "WebPage",
      "@id": pagePathToUrl("/review"),
      name: `Capability Review · ${site.siteTitle}`,
      url: pagePathToUrl("/review"),
      description: site.reviewMetaDescription,
    },
  ];
}

export function jsonLdGraphForPath(path: string): Record<string, unknown>[] {
  if (path === "/") return homePageJsonLd();
  if (path === "/docs") return docsIndexJsonLd();
  if (path === "/gallery") return galleryPageJsonLd();
  if (path === "/review") return reviewPageJsonLd();

  const docMatch = /^\/docs\/([^/]+)$/.exec(path);
  if (docMatch) {
    return docPageJsonLd(docMatch[1] as DocId);
  }

  return globalJsonLdGraph();
}

export function jsonLdScriptHtml(path: string): string {
  const graph = jsonLdGraphForPath(path);
  const payload = {
    "@context": "https://schema.org",
    "@graph": graph,
  };
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

export const llmsAlternateLinkHtml = `<link rel="alternate" type="text/plain" href="${toAbsoluteUrl("/llms.txt")}" title="LLM context" />`;

export const robotsMetaHtml = `<meta name="robots" content="index, follow" />`;
