import { byPath } from "../content/routes";
import Page from "../components/Page";
import { metadataFor } from "./seo";

export const metadata = metadataFor("/");

export default function Home() {
  return <Page route={byPath["/"]} />;
}
