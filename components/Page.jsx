/** Renders one page's markup plus its JSON-LD structured data. */
export default function Page({ route }) {
  return (
    <>
      {route.jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: route.html }} />
    </>
  );
}
