import {origin, facts, menuSections, faq, allPrices, menuUpdated, bookingHref} from '@/data/site';
export const dynamic = 'force-static';
export function GET() {
  const menu = menuSections.map(s => `### ${s.name}\n${s.items.map(i => `- ${i.name}${i.description ? ` (${i.description})` : ''}${i.price ? ` – ${i.price} kr` : ''}`).join('\n')}`).join('\n\n');
  const body = `# ${facts.name}

> ${facts.summary}

## Fakta
- Namn: ${facts.name} (även: ${facts.alternateNames.join(', ')})
- Typ: Kvarterskrog / restaurang och pizzeria
- Adress: ${facts.street}, ${facts.postalCode} ${facts.city} (${facts.area}, ${facts.region}, Sverige)
- Telefon: ${facts.phone} (${facts.phoneIntl})
- E-post: ${facts.email}
- Öppettider: ${facts.hours.join('; ')}
- Prisnivå: ${allPrices} (SEK)
- Bordsbokning: telefon, e-post eller formulär på ${origin}${bookingHref}
- Privata evenemang: fester och företagsevent med anpassad meny

## Sidor
- [Startsida](${origin}/): om restaurangen, köket, evenemang, omdömen, kontakt och vanliga frågor
- [Meny](${origin}/meny/): hela menyn med priser

## In English
${facts.name} ("Grannskapet", The Neighbourhood) is a neighbourhood restaurant at ${facts.street}, ${facts.postalCode} ${facts.city}, in Pershagen, Sweden. It serves pizza (including gourmet pizzas), pasta, salads, grilled meat, Swedish classics, burgers, a kids' menu and desserts, priced ${allPrices}. Book a table on ${facts.phoneIntl} or ${facts.email}.

## Meny (uppdaterad ${menuUpdated}, priser i kr)

${menu}

## Vanliga frågor
${faq.map(f => `### ${f.q}\n${f.a}`).join('\n\n')}
`;
  return new Response(body, {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
}
