import original from './original.json';
import menuCorrections from './menu-corrections.json';
export { original };
export const origin = 'https://ilvicino.se';
export const bookingId = 'ws-block-contacts-with-contact-form-UbkyDJeC';
export const bookingHref = `/#${bookingId}`;
// Date the menu and prices were last checked against the restaurant's own copy.
export const menuUpdated = '2026-10-09';
export const facts = {
  name: 'IL VICINO', alternateNames: ['Il Vicino', 'Grannskapet', 'IL VICINO Pershagen'],
  phone: '08550-97000', phoneIntl: '+46855097000', email: 'info@ilvicino.se',
  address: 'Nyköpingsvägen 75 15139 Södertälje',
  street: 'Nyköpingsvägen 75', postalCode: '151 39', city: 'Södertälje', area: 'Pershagen', region: 'Stockholms län', country: 'SE',
  hours: ['Måndag-Torsdag 10:30-21:00', 'Fredag 10:30-22:00', 'Lördag 12:00-22:00', 'Söndag 12:00-20:00'],
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=IL+VICINO+Nyk%C3%B6pingsv%C3%A4gen+75+151+39+S%C3%B6dert%C3%A4lje',
  // Add verified official profile URLs (Google Business Profile, Instagram, Facebook, TripAdvisor) as [label, url]; they feed the footer and schema sameAs.
  profiles: [] as [string, string][],
  summary: 'IL VICINO (Grannskapet) är en kvarterskrog i Pershagen, Södertälje, som serverar pizza, pasta, sallader, kötträtter, burgare, barnmeny och dessert.',
};

// Typing errors in the captured menu that split words and break search/AI extraction.
const corrections = menuCorrections as [string, string][];
export function correct(text: string) {
  for (const [from, to] of corrections) if (text.includes(from) && !text.includes(to)) text = text.replace(from, to);
  return text;
}

export type MenuItem = {name: string; description?: string; price?: number};
export type MenuSection = {name: string; id: string; lines: string[]; items: MenuItem[]};
const isBand = (line: string) => /^\d+$/.test(line) || line === 'GOURMET PIZZOR';
const unclosed = (line: string) => (line.match(/\(/g)?.length ?? 0) > (line.match(/\)/g)?.length ?? 0);
// Groups printed menu lines into one entry per dish (name line plus wrapped/description lines).
export function groupLines(lines: string[]) {
  const groups: string[][] = [];
  for (const line of lines) {
    const prev = groups.at(-1);
    if (!isBand(line) && prev && !isBand(prev[0]) && (unclosed(prev.join(' ')) || /^(Med |På |Vesuvio)/.test(line))) prev.push(line);
    else groups.push([line]);
  }
  return groups;
}
function toItems(lines: string[]) {
  const items: MenuItem[] = [];
  let band: number | undefined;
  for (const group of groupLines(lines)) {
    if (/^\d+$/.test(group[0])) { band = +group[0]; continue; }
    if (isBand(group[0])) continue;
    const text = group.join(' ').replace(/\s+/g, ' ');
    const priced = text.match(/^(.*?)\s+-\s+(\d+)$/);
    const body = priced ? priced[1] : text;
    const price = priced ? +priced[2] : band;
    const pizza = body.match(/^\d+\.\s*([^(]+?)\s*(?:\((.*)\))?$/);
    if (pizza) items.push({name: pizza[1], description: pizza[2], price});
    else if (group.length > 1) items.push({name: group[0], description: body.slice(group[0].length).trim(), price});
    else items.push({name: body, price});
  }
  return items;
}
export const menuSections: MenuSection[] = [];
for (const block of original.meny.blocks[1]) {
  if (block.tag === 'h3') menuSections.push({name: block.text, id: `meny-${menuSections.length}`, lines: [], items: []});
  else if (menuSections.length && block.text) menuSections.at(-1)!.lines.push(correct(block.text));
}
for (const section of menuSections) section.items = toItems(section.lines);

export function priceRange(items: MenuItem[]) {
  const prices = items.map(i => i.price).filter((p): p is number => p !== undefined);
  const [min, max] = [Math.min(...prices), Math.max(...prices)];
  return min === max ? `${min} kr` : `${min}–${max} kr`;
}
export const allPrices = priceRange(menuSections.flatMap(s => s.items));
const section = (name: string) => menuSections.find(s => s.name.toLowerCase().startsWith(name.toLowerCase()));
const list = (xs: string[]) => xs.length > 1 ? `${xs.slice(0, -1).join(', ')} och ${xs.at(-1)}` : xs.join('');
const lower = (name: string) => name.toLowerCase().replace(/^barn /, 'barn');
const sectionPrices = list(menuSections.map(s => `${lower(s.name)} ${priceRange(s.items)}`));
const kids = section('Barn')?.items ?? [];

// Answers use only facts published on this site (address, hours, menu, contact and event copy).
export const faq: {q: string; a: string}[] = [
  {q: 'Var ligger IL VICINO?', a: `IL VICINO ligger på ${facts.street}, ${facts.postalCode} ${facts.city}, i ${facts.area} i Södertälje kommun (${facts.region}).`},
  {q: 'Vilka öppettider har IL VICINO?', a: `${facts.hours.join(', ')}.`},
  {q: 'Vad serverar IL VICINO?', a: `En bred meny för lunch och middag med ${list(menuSections.map(s => lower(s.name)))}. Bland annat ${section('Pizzor')?.items.length ?? 0} pizzor inklusive gourmetpizzor, pasta, sallader, grillad biff, schnitzel, fläskfilé, fish and chips och burgare.`},
  {q: 'Vad kostar det att äta på IL VICINO?', a: `Rätterna på menyn kostar ${allPrices}: ${sectionPrices}.`},
  {q: 'Hur bokar jag bord?', a: `Ring ${facts.phone}, mejla ${facts.email} eller skicka en förfrågan via kontaktformuläret på ilvicino.se.`},
  {q: 'Finns det barnmeny?', a: `Ja. Barnmenyn har ${list(kids.map(i => lower(i.name)))} för ${priceRange(kids)} styck.`},
  {q: 'Kan man ha fest eller företagsevent på IL VICINO?', a: 'Ja. IL VICINO tar emot fester, företagsevent och andra sammankomster, anpassar menyn efter dina önskemål och erbjuder personlig service. Kontakta restaurangen för att planera ditt evenemang.'},
];
