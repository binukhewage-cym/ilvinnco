# IL VICINO website

A Next.js App Router and Tailwind rebuild of the two-page Swedish restaurant site. It preserves the archived live copy, menu lines, original media, form provider configuration and page URLs.

## Local development

```bash
npm ci
npm run dev
```

Production checks:

```bash
npm run lint
npm run typecheck
npm run build
npm run start -- --port 3100
TEST_URL=http://localhost:3100 npm test
```

The last command checks the rendered pages, original text and images, link targets, canons, sitemap, robots, structured data, integration settings and HTTP status codes. The local preview requires no secrets. The contact form's original hCaptcha key rejects localhost, so a real enquiry must be tested on an authorized production or provider-approved host.

`audit/REPORT.md` contains the baseline, content map, verification scorecard, metadata proposals and remaining owner/external actions. Source HTML and unchanged original asset URLs are archived in `audit/baseline/` and `public/ws/`. No deployment is configured or performed by this project.
# ilvinnco
# ilvinnco
