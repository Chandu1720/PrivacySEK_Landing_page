import { byPath } from "../content/routes";

/** Per-page SEO metadata built from the route registry. */
export function metadataFor(path) {
  const r = byPath[path];
  if (!r) return {};
  return {
    title: r.title,
    description: r.description,
    alternates: { canonical: r.canonical, languages: { "en-IN": r.canonical, "x-default": r.canonical } },
    openGraph: { siteName: "PrivacySEK", type: r.ogType, title: r.title, description: r.description, url: r.canonical, locale: "en_IN",
      images: [{ url: "https://privacysek.com/og.png", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: r.title, description: r.description, images: ["https://privacysek.com/og.png"] },
  };
}
