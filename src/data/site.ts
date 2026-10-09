import original from './original.json';
export { original };
export const origin = 'https://ilvicino.se';
export const bookingId = 'ws-block-contacts-with-contact-form-UbkyDJeC';
export const bookingHref = `/#${bookingId}`;
export const facts = {
  name: 'IL VICINO', phone: '08550-97000', email: 'info@ilvicino.se',
  address: 'Nyköpingsvägen 75 15139 Södertälje',
  hours: ['Måndag-Torsdag 10:30-21:00', 'Fredag 10:30-22:00', 'Lördag 12:00-22:00', 'Söndag 12:00-20:00'],
};
export const menuSections: {name: string; id: string; lines: string[]}[] = [];
for (const block of original.meny.blocks[1]) {
  if (block.tag === 'h3') menuSections.push({name:block.text,id:`meny-${menuSections.length}`,lines:[]});
  else if (menuSections.length && block.text) menuSections.at(-1)!.lines.push(block.text);
}
