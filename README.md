# PrivacySEK website (Next.js)

Next.js 14 (App Router) project, statically exported, so every page is pre-rendered HTML for search engines.

## Run
```
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```
Deploy `./out` to any static host, or connect the repo to Vercel (redirects are in `vercel.json`).

## Structure
- `app/page.jsx` (home) and `app/[...slug]/page.jsx` (all other 39 pages), with per-page SEO metadata from `app/seo.js`.
- `content/routes.js`: URL path, title, description, canonical and JSON-LD for every page.
- `content/pages/*.js`: page markup. `content/layout.js`: header, mobile menu, footer.
- `components/`: `Chrome` (header and footer) and `Page` (page markup and structured data).
- `app/globals.css`: the design system. `public/site.js`: all interactions.

## Before go-live
1. **Forms:** the demo popup, contact form and DPIA tool post to `/api/lead`. Deploy the lead backend and route `/api/*` through CloudFront: see [backend/README.md](backend/README.md).
2. **Hero video:** add the overview video. In `content/pages/index.js`, replace the `vs-play` placeholder with a `<video>` element, or ask for a regenerated build with `HERO_VIDEO` set.
3. **Analytics and cookie banner:** add your analytics with consent, and use PrivacySEK's own cookie consent on the site.
4. **Legal pages:** have counsel review the privacy policy, cookie policy, terms and the GCC (s.17(1)(d)) and CISO wording.

## Pages and URLs
- `/about`: About PrivacySEK | Founder and Team Behind the Platform
- `/accessibility`: Accessibility Statement | PrivacySEK
- `/resources/blog/consent-vs-legitimate-use`: Consent or legitimate use? Choosing the right basis under DPDP | PrivacySEK
- `/resources/blog/dpdp-breach-intimation-72-hours`: Breach intimation under DPDP: without delay, then 72 hours | PrivacySEK
- `/resources/blog/dpdp-timeline-explained`: The DPDP timeline, explained: what applies when | PrivacySEK
- `/resources/blog/graduated-data-protection-decisions`: Beyond allow and block: graduated data protection decisions | PrivacySEK
- `/resources/blog/metadata-first-data-discovery`: Why metadata-first data discovery matters for privacy | PrivacySEK
- `/resources/blog/ropa-spreadsheet-to-live-record`: From ROPA spreadsheet to a live processing record | PrivacySEK
- `/resources/blog`: Privacy Operations Blog | PrivacySEK
- `/platform/breach-response`: Incident & Breach Management for DPDP and CERT-In | PrivacySEK
- `/regulations/ccpa`: CCPA / CPRA Compliance & Privacy Requirements | PrivacySEK
- `/platform/consent-management`: Consent Management Platform for DPDP (22 Languages) | PrivacySEK
- `/contact`: Request a Demo | PrivacySEK
- `/platform/cookie-consent`: Cookie Consent Management Platform (CMP) for India | PrivacySEK
- `/cookie-policy`: Cookie Policy | PrivacySEK
- `/platform/data-discovery`: Data Discovery & Classification Software for DPDP | PrivacySEK
- `/dpdp`: DPDP Act 2023 & Rules 2025: Compliance Guide | PrivacySEK
- `/dpia-assessment-tool`: Free DPIA Assessment Tool for DPDP | PrivacySEK
- `/platform/dpia`: DPIA & Privacy Assessment Software | PrivacySEK
- `/platform/dsar`: Data Subject Request (DSR) Software for DPDP | PrivacySEK
- `/resources/faqs`: PrivacySEK FAQs | Privacy Platform Questions
- `/regulations/gdpr`: GDPR Compliance & Privacy Requirements | PrivacySEK
- `/regulations/global`: Global Privacy Laws: 10 Jurisdictions | PrivacySEK
- `/resources/glossary`: Privacy Glossary: DPDP, DPIA, ROPA, DSAR & More | PrivacySEK
- `/resources/guides`: Practical Privacy Guides: ROPA, DPIA, DSAR, DPDP | PrivacySEK
- `/`: PrivacySEK | Privacy Management Platform for DPDP, GDPR & CCPA
- `/integrations`: Integrations: Databases, CRM, Marketing & Cloud | PrivacySEK
- `/platform/obligation-cockpit`: DPDP Compliance Dashboard: Obligation Cockpit | PrivacySEK
- `/platform`: Privacy Management Platform: Find, Control, Prove | PrivacySEK
- `/services/privacy-assessments`: DPDP Privacy Assessments & Gap Analysis | PrivacySEK Consulting
- `/privacy-policy`: Privacy Policy | PrivacySEK
- `/services/privacy-staffing`: Privacy Staffing: Interim & Contract Privacy Talent | PrivacySEK
- `/regulations`: Privacy Regulations: DPDP, GDPR & CCPA Compared | PrivacySEK
- `/resources`: Privacy Resources: Blog, Guides, Glossary & FAQs | PrivacySEK
- `/platform/ropa`: Data Mapping & ROPA Software: Records of Processing | PrivacySEK
- `/security`: Security & Trust | PrivacySEK
- `/services`: Privacy Services: Assessments, Staffing, Virtual DPO | PrivacySEK
- `/terms`: Terms of Use | PrivacySEK
- `/platform/vendor-management`: Vendor Risk Management (TPRM) Software for Privacy | PrivacySEK
- `/services/virtual-dpo-ciso`: Virtual DPO & Virtual CISO Services for DPDP | PrivacySEK
