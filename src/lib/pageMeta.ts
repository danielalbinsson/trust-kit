import { docs, docPath } from "../data/docs";
import { site, SITE_TITLE } from "../data/site";
import { pagePathToUrl, toAbsoluteUrl } from "./structuredData";

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
};

export function resolvePageMeta(path: string): PageMeta {
  if (path === "/") {
    return {
      title: `${SITE_TITLE} · Eve agent trust`,
      description: site.metaDescription,
      path: "/",
      ogType: "website",
    };
  }
  if (path === "/gallery") {
    return {
      title: `Gallery · ${SITE_TITLE}`,
      description: site.galleryMetaDescription,
      path: "/gallery",
    };
  }
  if (path === "/review") {
    return {
      title: `Capability Review · ${SITE_TITLE}`,
      description: site.reviewMetaDescription,
      path: "/review",
    };
  }
  if (path === "/docs") {
    return {
      title: `Docs · ${SITE_TITLE}`,
      description: site.docsIndexMetaDescription,
      path: "/docs",
    };
  }

  const doc = docs.find((d) => docPath(d.id) === path);
  if (doc) {
    return {
      title: `${doc.title} · ${SITE_TITLE}`,
      description: doc.summary,
      path: docPath(doc.id),
      ogType: "article",
    };
  }

  return {
    title: `${SITE_TITLE} · Eve agent trust`,
    description: site.metaDescription,
    path: "/",
  };
}

export function socialMetaTagsHtml(meta: PageMeta): string {
  const url = pagePathToUrl(meta.path);
  const image = toAbsoluteUrl(site.ogImagePath);
  const ogType = meta.ogType ?? "website";

  return [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="${SITE_TITLE}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="${site.ogImageWidth}" />`,
    `<meta property="og:image:height" content="${site.ogImageHeight}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(site.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="${site.twitterCard}" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(site.ogImageAlt)}" />`,
  ].join("\n    ");
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}
