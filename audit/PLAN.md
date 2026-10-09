# Implementation plan and baseline (2026-10-09)
1. Archive both public pages, crawl files, original assets, form/runtime and metadata before editing. Local project was empty; no repository conventions, CMS code, secrets or tests existed.
2. Create Next.js App Router + Tailwind implementation, maintaining / and /meny/, Swedish text, all menu lines, photos, logo and business information.
3. Improve layout and semantic hierarchy. Add canonical and sharing metadata using existing titles; do not invent descriptions or rewrite titles.
4. Preserve site-builder form and Yola analytics. Verify client-side validation without sending a message.
5. Add linked Restaurant, WebSite, WebPage, Menu, MenuSection and BreadcrumbList schema from visible source facts; preserve existing robots policy.
6. Build, type-check, lint, test text/assets/links/SEO, inspect browsers at phone/tablet/desktop widths, measure Lighthouse and document limitations.

Baseline: site-builder custom elements, two sitemap pages, Swedish. Home title Hem; menu title Meny | ilvicino.se. No meta descriptions, canonicals or JSON-LD found. Viewport disables zoom. Every img alt empty. Heading levels skip. Footer labels and social controls use #. Original form posts to forms.ws-platform.net with hCaptcha; Yola tracking present. No payment, separate booking platform or video found. Existing testimonials retained verbatim but authenticity unverified; no review/rating schema added.

Comparators inspected: https://www.baroloristorante.se/ and https://restaurangciro.se/sodertalje/. Both foreground menu, reservations and location. Applicable pattern: accessible menu and direct contact. No competitor content or claims copied. Local listings also show Al Forno at this address; owner must confirm and update old external business identities, not silently merge entities.

Design: teal from original interior photography, light neutral background, original Poppins brand typography, asymmetric photo-led opening, quiet motion (variance 6 / motion 2 / density 4). User preservation rules override skill rules on shortening text, generating images, removing punctuation or limiting section content. All original copy retained, including spelling and placeholder links where no verified destination exists.
