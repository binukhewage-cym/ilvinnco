# IL VICINO redesign and technical audit

Date: 2026-10-09. Scope: a local Next.js and Tailwind rebuild of the public website; no deployment, DNS or production CMS change.

## A. Website redesign

The source website is a Swedish neighbourhood restaurant in Pershagen, Södertälje. Its visible goals are to read the menu, visit the restaurant and send a booking/contact request. The source site consists of `/` and `/meny/`; its local project folder had no pre-existing source code. Competitor references were [Barolo](https://www.baroloristorante.se/) and [Ciro Södertälje](https://restaurangciro.se/sodertalje/), which foreground menu, booking and location.

The new layout uses the restaurant's existing interior and food photography, logo, Poppins font and blue-green interior colour. It adds an asymmetric photo-led home opening, clearer hierarchy, distinct kitchen, reasons, events, reviews and contact sections, and a menu organized into the five original categories. Mobile navigation, category links, visible focus styles and a skip link support small screens and keyboard use. Pages are static server-rendered HTML; the only React client component starts the original analytics configuration on the production hostname. The original form is retained as an isolated same-origin iframe with its original endpoint, destination, field names, hCaptcha key, messages and vendor runtime. It displays the original validation state for an invalid email locally. hCaptcha itself warns that localhost is not an allowed host, so an end-to-end submission has not been sent or proved.

All original visible text blocks were compared to the rendered pages, including menu lines and prices with existing spelling/punctuation. Every original image, logo and icon was downloaded unchanged and its original `/ws/...` asset URL is also available in `public`; `audit/asset-hashes.json` records byte counts and SHA-256 hashes. All major original sections, two pages and contact information remain. The source's Yola tracking configuration was copied. On the live source, `getCookiePermissionsManager` was absent and the tracking script loaded; the rebuild retains that fallback with a load-state correction for late React hydration. Production analytics events remain unverified. Existing testimonial wording was retained, with no rating/review schema or authenticity claim.

## B. Technical SEO

Both routes have their original titles, `lang="sv"`, self canonicals, responsive viewport and Open Graph/Twitter tags using original images. The source had no meta description; none was added because the owner requires explicit approval for content-related metadata. The original generic titles also remain. The robots policy stays `User-agent: * / Allow: /` with the same sitemap location; no crawler-specific training permission was inferred. The sitemap contains only the two canonical URLs. The old footer's generic anchor destinations were linked to real sections or the menu where a matching destination exists. The original Blogg and four social links still have `#` because no verified destinations exist. The 404 route returns HTTP 404; `/meny` redirects to `/meny/`.

Suggested metadata for owner approval, based solely on existing visible copy:

| Page | Proposed title | Proposed meta description |
|---|---|---|
| `/` | `IL VICINO | Kvarterskrog i Pershagen` | `IL VICINO är en kvarterskrog i Pershagen, Södertälje. Se vår meny med pizza, pasta, sallader, kött och fisk, och kontakta oss för att boka bord.` |
| `/meny/` | `Meny | IL VICINO i Pershagen` | `Se IL VICINOs meny med förrätter, varmrätter, pizzor, barnmeny och dessert. Besök oss på Nyköpingsvägen 75 i Södertälje.` |

These are proposals only, not implemented. The old site also disables zoom; the rebuild allows browser zoom.

## C. GEO, AEO and structured data

The two public pages contain the original restaurant name, Pershagen context, address, phone, email, opening hours, menu and event information in server-rendered HTML. The home and menu link to each other and menu categories have HTML anchors. This answers the existing customer questions “Where is it?”, “When is it open?”, “How do I contact or request a table?”, “What food and prices are shown?” and “Can I enquire about an event?” using the source's exact wording. No new FAQ or business claim was added.

JSON-LD uses stable IDs and the supported types `Restaurant`, `WebSite`, `WebPage`, `Menu`, `MenuSection` and, on the menu page, `BreadcrumbList`. No unverified coordinates, social `sameAs`, review ratings, cuisine, price range, currencies or offers were invented. Schema.org Validator accepted the menu graph with **0 errors and 0 warnings** (`audit/schema-validator.txt`). Google's Rich Results Test for the same code detected **3 valid items**: breadcrumbs, local business and organization (`audit/rich-results.txt`). Google's optional warnings are missing `priceRange` and `servesCuisine`; they are intentionally omitted. Schema validity and rich-result eligibility do not prove indexing or display. Live URL validation must be repeated after deployment.

The original generic robots policy is reproduced. [OpenAI documents](https://developers.openai.com/api/docs/bots) distinct `OAI-SearchBot` search and `GPTBot` training controls; [Google documents](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) `Google-Extended` as a separate product control, and [Bing describes](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a) crawler access and AI grounding. A policy decision about training crawlers belongs to the owner; no AI crawler allowlist or blocklist was imposed. CDN/WAF access, actual crawler visits, Google/Bing index status and AI answers need external evidence. Google and other search services may choose not to index, cite or recommend this site.

## D. Evidence and verification scorecard

**Method:** unweighted. PASS counts once per applicable category. PARTIAL, FAIL and NOT VERIFIED stay in the denominator; NOT APPLICABLE would be excluded. **Verified technical completion: 14 PASS / 21 applicable checks = 66.7%.** Four categories are PARTIAL, none FAIL, and three NOT VERIFIED. This measures verified implementation, not a chance of appearing in AI results.

| Requirement | Status | Evidence and remaining work |
|---|---|---|
| Visual design | PASS | Browser screenshots at `audit/mobile-home-final.png`, `audit/mobile-menu.png`; original brand photos and logo retained. |
| User experience | PARTIAL | Home/menu/booking/category navigation works and form validation appears; production submission unverified. |
| Metadata | PARTIAL | Preserved titles, self canonicals and OG tags; original generic titles and absent descriptions need owner approval. |
| Canonicals | PASS | Both pages checked by `scripts/verify.mjs`. |
| Indexability | PASS | Both local routes return 200 without `noindex`; no proof of future indexing is implied. |
| Sitemap | PASS | XML contains exactly `/` and `/meny/`, both production canonicals. |
| Robots.txt | PARTIAL | Valid original allow policy reproduced; owner's training-crawler preference and CDN/WAF policy not confirmed. |
| Semantic HTML | PASS | One H1 per page, sections/landmarks, contact address, menu headings and visible content checked. |
| Structured data | PASS | Parse and relationship checks; external Schema.org and Google code tests above. |
| Business entities | PASS | Visible and JSON-LD name, location, phone, email and hours agree with source. Off-site profiles need owner audit. |
| GEO | PASS | Restaurant facts and menu are crawlable HTML with internal links and stable entity IDs. |
| AEO | PASS | Existing source answers for location, hours, menu, booking contact and events are directly visible; no fabricated FAQ. |
| Performance | PASS | Local Lighthouse mobile home 97 and menu 98; homepage baseline 84. Homepage lab LCP 2.62 s vs 2.8 s, CLS 0 vs 0.156, TBT 6 ms vs 19 ms. Menu lab LCP 2.48 s, CLS 0. |
| Accessibility | PASS | Local Lighthouse accessibility 100 on both pages vs original 79 home; labelled fields, invalid-email state, skip link and focus styling checked. This is not a full assistive-technology audit. |
| Mobile | PASS | No page-level overflow at 320, 768, 1024 or 1440 px on menu; home at 320, 768, 1024 and 1440 px. Browser screenshots checked. |
| Links | PARTIAL | Internal links and fragment targets pass; Blogg and four social links remain source placeholders without verified URLs. |
| Build quality | PASS | `npm run build`, `npm run lint`, `npm run typecheck` and 47/47 route/content/form/SEO tests pass. Offline dependency audit reports zero known advisories. |
| Final audit | PASS | Source HTML, structured text and assets archived; every original content block and visible image found in rendered site. |
| Field Core Web Vitals | NOT VERIFIED | No RUM, Search Console or CrUX owner access; Lighthouse is lab data only. |
| Form delivery | NOT VERIFIED | hCaptcha rejects localhost; no test enquiry was sent to production. Owner/test-domain validation needed. |
| Production hostname, CDN and crawler reachability after deployment | NOT VERIFIED | No deployment or DNS change authorized; live site still serves the original site-builder pages. |

Raw outputs: `audit/baseline/lighthouse-mobile.json`, `audit/lighthouse-home-mobile-final.json`, `audit/lighthouse-menu-mobile.json`, `audit/verification.json`, `audit/build.log`, `audit/lint.log`, `audit/typecheck.log`, `audit/dependencies-final.json`, `audit/responsive-home.json` and `audit/responsive-menu.json`. The 66.7% figure reflects the required owner and external verification, not a coding defect count.

## E. Remaining work

**Fixed locally:** design, mobile overflow, semantic headings, accessible navigation, crawlable menu, image rendering, canonicals, sitemap, structured data and known code-level build issues.

**Still present intentionally:** generic titles, no meta descriptions, old copy including apparent spelling errors, placeholder Blogg/social URLs. These are under the content and metadata preservation rule. The third-party form runtime remains substantial, but replacing it would break an existing business workflow without provider support.

**Owner input needed:** approve exact metadata copy; verify current business identity, address, hours, menu/prices and testimonials; provide real social/blog URLs if they exist; choose whether search and training crawlers should receive different robots directives. Search results for the address also reference Al Forno Pershagen; confirm whether that is an old or unrelated business before changing citations.

**External access needed:** deploy only with authorization; test a real form submission and delivery on the production hostname; verify provider and analytics behaviour; inspect CDN/WAF rules, logs, Search Console/Bing Webmaster Tools and field performance; rerun live URL Rich Results Test and Lighthouse.

**Off-site:** review and correct owned business profiles and directories, and encourage genuine customer reviews through normal channels. No citations, reviews or backlinks were fabricated.

## Content map

| Page | Audience and intent | Existing topics/facts | Metadata | Schema | Internal links | Missing information needing owner input |
|---|---|---|---|---|---|---|
| `/` | Locals and visitors seeking a table, contact details or an overview | Restaurant description, kitchen, menu categories, private events, reviews, location, hours, contact form | Existing `Hem`; proposed descriptive title/description above | Restaurant, WebSite, WebPage | Menu; booking fragment; kitchen, reviews, contact fragments | Verified social accounts, form delivery and review provenance |
| `/meny/` | Guests checking dishes and prices | Five original menu categories with every source line and amount | Existing `Meny | ilvicino.se`; proposal above | WebPage, Menu, MenuSection, BreadcrumbList | Home, category fragments, home contact through navigation | Correct apparent spelling and incomplete menu lines only with owner approval; currency/price-range confirmation |
