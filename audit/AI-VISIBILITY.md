# AI visibility (GEO / AEO) audit: IL VICINO, Pershagen

Date: 2026-10-09 · Site: https://ilvicino.se (local Next.js rebuild) · Market: Swedish, local restaurant

## 1. Current AI visibility (off-site)

Searches answer engines rely on (web search for "Il Vicino Pershagen restaurang" and "bästa restaurang pizza Pershagen Södertälje"):

| Prompt | Mentioned? | What AI found instead |
|---|---|---|
| "Il Vicino Pershagen restaurang" | **No** | Il Vicino in Albuquerque (USA), Il Vicino in Antalya (Turkey), Vicino in Norrköping |
| "Bästa pizza / restaurang i Pershagen" | **No** | Rosenlunds Pizza, Söder Hörnet, Brunnsängs, Gabos (via Wolt, Reco, Eniro) |

**AI mention score: about 5/100.** AI engines don't know the restaurant exists, and the brand name collides with an established US chain. The earlier audit also noted that the address shows up in search results as **"Al Forno Pershagen"**, so the old business name probably still dominates third-party listings.

## 2. On-site AI readiness

| Area | Before | After (this change) |
|---|---|---|
| Titles | "Hem", "Meny \| ilvicino.se" | "IL VICINO \| Kvarterskrog i Pershagen, Södertälje", "Meny \| IL VICINO i Pershagen" |
| Meta / OG descriptions | none | Fact-dense descriptions on both pages |
| Brand name in UI | "ilvicino.se" | "IL VICINO" (header, footer, schema WebSite name) |
| H1 | "IL VICINO" only | + "Kvarterskrog i Pershagen, Södertälje" |
| Restaurant schema | name, address, phone, hours | + alternateName (Grannskapet), description, **disambiguatingDescription**, servesCuisine, priceRange, currency, acceptsReservations, addressCountry/Region, containedInPlace → Pershagen (Wikipedia), areaServed, hasMap, amenities, `sameAs` slot |
| Menu schema | 5 sections holding raw text | **60 MenuItems**, each with name, description and price in SEK; vegetarian pizzas marked |
| FAQ / AEO | none | 9 visible Q&As + FAQPage schema (location, hours, food, prices, booking, vegetarian, kids' menu, events, USA disambiguation). Answers are generated from site data, so they stay correct when the menu changes |
| llms.txt | 404 | `/llms.txt`: facts, Swedish and English summary, full priced menu, FAQ |
| robots.txt | `*` allowed | `*` allowed, plus named allow rules for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot, Bingbot and others; `/integration/` disallowed |
| Sitemap | no dates | lastModified + priority |
| Freshness | none | "Senast uppdaterad" on the menu + `dateModified` |
| Menu text | broken tokens ("HA W AII", "T onfisk", "V esuvio", "TAR TUFO (T ryffelsås … permesan", missing ")") | Fixed through `src/data/menu-corrections.json` (the archived original is untouched) |
| Template junk | "Funktioner", "Prissättning", "Blogg" → `#`, 4 social icons → `#` | Replaced with real links (Meny, Varför oss, Omdömen, Vanliga frågor, Boka bord); dead social icons removed |

**On-site AI readiness: about 45/100 before, about 85/100 after.** These are my estimates. The remaining points depend on the owner and off-site work below. Verification: `npm run lint`, `typecheck` and `build` pass, and `npm test` passes **50/50** (the suite was updated for the new requirements).

## 3. What still needs fixing (owner / off-site), in priority order

1. **Deploy the rebuild.** Production still serves the old site builder pages. None of the above counts until it is live. — Impact: **Critical**
2. **Claim and fix Google Business Profile** under the name "IL VICINO" (not Al Forno), with the same address, phone (+46 8 550 970 00), hours, menu link, photos and category "Restaurang/Pizzeria". Gemini, Google AI Overviews and ChatGPT local results lean heavily on this. — **High**
3. **Add real profile URLs** to `facts.profiles` in `src/data/site.ts` (Google Maps, Instagram, Facebook, TripAdvisor). They feed schema `sameAs` and the footer automatically. — **High**
4. **Get listed with consistent NAP (name, address, phone)** on Wolt/Foodora (if you deliver), TripAdvisor, Reco.se, Eniro, Hitta.se, Thatsup and Bing Places. AI answers for "best pizza in Pershagen" currently come entirely from these sites. — **High**
5. **Collect real reviews** on Google and TripAdvisor (a QR code on the receipt or table). Never write or buy reviews. — **High**
6. **Submit to Google Search Console and Bing Webmaster Tools** (Bing powers ChatGPT search and Copilot), submit the sitemap, and request indexing. — **High**
7. **Replace the "B" logo.** The logo shows a "B" monogram that doesn't match "IL VICINO". — Medium
8. **Add geo coordinates** (`geo` in schema) once they are confirmed from the Google Business Profile pin. — Medium
9. **Confirm facts I couldn't verify** and add them to the FAQ: takeaway/delivery, alcohol licence/bar, parking, outdoor seating, accessibility, gluten-free options, lunch deal (dagens lunch) and price. Questions like these drive local AI queries. — Medium
10. **Local press/community mentions**: Länstidningen Södertälje, Pershagen Facebook groups, Södertälje kommun's guide. Authority signals for AI. — Medium
11. **Check the CDN/WAF** (nginx host) doesn't block the AI bots allowed in robots.txt. — Medium
12. Optional: an English page (`/en/`) for visitors and English prompts. — Low

## 4. Owner should confirm

- The "no connection to Il Vicino in the USA" statement (FAQ and schema `disambiguatingDescription`).
- Spelling fixes on the menu: Bresaola, Prosciutto di Burrata, Tartufo.
- servesCuisine labels: Pizza, Italiensk, Pasta, Svensk husmanskost, Burgare.
- `menuUpdated` in `src/data/site.ts`: update it whenever prices change.

## 5. Re-test prompts (in about 4–8 weeks after launch and GBP)

Ask ChatGPT, Gemini, Perplexity and Claude: "Restaurang i Pershagen?", "Bästa pizza i Pershagen/Södertälje?", "Il Vicino Pershagen öppettider", "Var kan man äta med barn i Pershagen?", "Restaurang för företagsevent Södertälje". Record whether IL VICINO is mentioned, its position and whether the facts are correct.
