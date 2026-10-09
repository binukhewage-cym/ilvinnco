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

The site is a static export (`output: 'export'`): `npm run build` writes `out/`, which is uploaded to a PHP host. `npm run start` does not serve an export; preview `out/` with any static server (or `php -S 127.0.0.1:3100 -t out` to include the form endpoint).

## Contact form

`src/components/contact-form.tsx` posts to `/contact.php` (`public/contact.php`), which emails the enquiry through Resend with a honeypot, a 3-second timing trap, same-origin check and a 5-per-10-minutes rate limit. Secrets are in `ilvincino-config.php` (gitignored; template in `ilvincino-config.example.php`). Upload it **one folder above `public_html`** if the host allows, otherwise into `public_html` next to `contact.php` (`.htaccess` blocks direct access to it), or point `ILVINCINO_CONFIG` at it. Header rules are in `public/.htaccess`.

The last command checks the rendered pages, original text and images, link targets, canons, sitemap, robots, structured data, integration settings and HTTP status codes. The local preview requires no secrets.

`audit/REPORT.md` contains the baseline, content map, verification scorecard, metadata proposals and remaining owner/external actions. Source HTML and unchanged original asset URLs are archived in `audit/baseline/` and `public/ws/`. No deployment is configured or performed by this project.
# ilvinnco
# ilvinnco
