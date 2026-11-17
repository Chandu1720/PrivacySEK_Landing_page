# Deploying to AWS (S3 + CloudFront)

The site is a fully static export (`npm run build` → `out/`). On AWS,
`vercel.json` is ignored, so redirects and clean URLs are handled by
[`cloudfront-function.js`](cloudfront-function.js).

## 1. S3 bucket

- Create a private bucket (keep "Block all public access" on).
- Do **not** enable static website hosting — CloudFront reads it via OAC.

## 2. CloudFront distribution

- Origin: the S3 bucket (REST endpoint, not the website endpoint), with
  **Origin Access Control**; apply the bucket policy CloudFront offers.
- Viewer protocol policy: Redirect HTTP to HTTPS.
- Default root object: `index.html`.
- Error pages (missing objects come back as 403 from a private bucket):
  - 403 → response page `/404.html`, response code `404`
  - 404 → response page `/404.html`, response code `404`

## 3. CloudFront Function

- CloudFront → Functions → Create function, runtime **cloudfront-js-2.0**.
- Paste the contents of `cloudfront-function.js`, save, then **Publish**.
- Distribution → Behaviors → Default (`*`) → Function associations →
  **Viewer request** → CloudFront Functions → this function.

It does:

| Request                         | Result                       |
| ------------------------------- | ---------------------------- |
| `/about`                        | serves `about.html`          |
| `/about/`, `/about.html`        | 301 → `/about`               |
| `/solutions` (old URLs)         | 301 → new page (from vercel.json) |
| `/_next/...`, `/logo.svg`, etc. | served as-is                 |

If you add or change a redirect, update both `vercel.json` and
`REDIRECTS` in the function, then re-publish the function.

## 4. Upload

```sh
npm run build

# hashed assets: cache for a year
aws s3 sync out/_next s3://BUCKET/_next --delete \
  --cache-control "public,max-age=31536000,immutable"

# everything else: always revalidate
aws s3 sync out s3://BUCKET --delete --exclude "_next/*" \
  --cache-control "public,max-age=0,must-revalidate"

aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```

## 5. Lead API (/api/*)

Forms post to `/api/lead`, served by the backend in [`../backend`](../backend/README.md).
Deploy it with SAM, then add an `/api/*` behavior to this distribution as described
in backend/README.md, step 4. Do not attach the CloudFront Function to that behavior.
