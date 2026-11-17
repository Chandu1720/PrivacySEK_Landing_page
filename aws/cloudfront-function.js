// CloudFront Function (runtime: cloudfront-js-2.0, event type: viewer-request).
// Replaces what vercel.json does on Vercel:
//   1. permanent redirects for old URLs
//   2. clean URLs: /about -> /about.html, /about.html -> 301 /about
//   3. trailing slash removal: /about/ -> 301 /about
// Keep REDIRECTS in sync with vercel.json if either changes.

var REDIRECTS = {
  "/regulations/dpdp": "/dpdp",
  "/solutions": "/services",
  "/dpdp/readiness": "/dpia-assessment-tool",
  "/solutions/assessment-consulting": "/services/privacy-assessments",
  "/solutions/product-support": "/services",
  "/solutions/virtual-ciso-virtual-dpo": "/services/virtual-dpo-ciso",
  "/platform/Data protection and Enforcement-incident-management": "/platform/breach-response",
  "/platform/purpose-guard": "/platform",
  "/platform/proof-ledger": "/platform",
  "/platform/person-finder": "/platform/dsar",
  "/platform/reports": "/platform/obligation-cockpit",
  "/platform/data-retention": "/platform/data-discovery",
  "/platform/privacy-training": "/services",
  "/platform/trust-center": "/platform/consent-management",
  "/platform/ai-governance": "/platform"
};

function qs(querystring) {
  var parts = [];
  for (var key in querystring) {
    var p = querystring[key];
    var values = p.multiValue ? p.multiValue : [p];
    for (var i = 0; i < values.length; i++) {
      parts.push(values[i].value === "" ? key : key + "=" + values[i].value);
    }
  }
  return parts.length ? "?" + parts.join("&") : "";
}

function redirect(location, request) {
  return {
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: { location: { value: location + qs(request.querystring) } }
  };
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  var decoded = uri;
  try { decoded = decodeURIComponent(uri); } catch (e) {}

  // Strip trailing slash (except root) so /about/ and /about are one URL.
  if (decoded.length > 1 && decoded.charAt(decoded.length - 1) === "/") {
    decoded = decoded.replace(/\/+$/, "");
    if (REDIRECTS[decoded]) return redirect(REDIRECTS[decoded], request);
    return redirect(decoded, request);
  }

  if (REDIRECTS[decoded]) return redirect(REDIRECTS[decoded], request);

  if (uri === "/") {
    request.uri = "/index.html";
    return request;
  }

  // /about.html -> /about (but leave /index.html and /404.html alone).
  if (/\.html$/.test(uri) && uri !== "/index.html" && uri !== "/404.html") {
    return redirect(uri.slice(0, -5), request);
  }

  // No file extension in the last segment -> it's a page, serve its .html.
  var last = uri.substring(uri.lastIndexOf("/") + 1);
  if (last.indexOf(".") === -1) {
    request.uri = uri + ".html";
  }

  return request;
}
