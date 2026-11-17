import { notFound } from "next/navigation";
import { routes, byPath } from "../../content/routes";
import Page from "../../components/Page";
import { metadataFor } from "../seo";

const toPath = (slug) => "/" + slug.join("/");

export const dynamicParams = false;

export function generateStaticParams() {
  return routes.filter((r) => r.path !== "/").map((r) => ({ slug: r.path.slice(1).split("/") }));
}

export function generateMetadata({ params }) {
  return metadataFor(toPath(params.slug));
}

export default function RoutePage({ params }) {
  const r = byPath[toPath(params.slug)];
  if (!r) notFound();
  return <Page route={r} />;
}
