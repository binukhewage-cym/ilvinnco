import {origin, facts, original, menuSections, allPrices, faq, menuUpdated} from '@/data/site';
export const pageDescriptions = {
 home: `${facts.summary} Öppet alla dagar. Boka bord på ${facts.phone}.`,
 meny: `Hela menyn med priser för IL VICINO i Pershagen, Södertälje: förrätter, varmrätter, ${menuSections.find(s=>s.name==='Pizzor')?.items.length} pizzor, barnmeny och dessert (${allPrices}).`,
};
export function StructuredData({menu=false}:{menu?:boolean}) {
 const page = menu?`${origin}/meny/`:`${origin}/`;
 const place = {'@type':'Place',name:'Pershagen',sameAs:'https://sv.wikipedia.org/wiki/Pershagen'};
 const business = {'@type':'Restaurant','@id':`${origin}/#restaurant`,name:facts.name,alternateName:facts.alternateNames,description:facts.summary,url:`${origin}/`,logo:`${origin}${original.home.images[0]}`,image:[1,2,4].map(i=>`${origin}${original.home.images[i]}`),telephone:facts.phoneIntl,email:facts.email,
  address:{'@type':'PostalAddress',streetAddress:facts.street,postalCode:facts.postalCode,addressLocality:facts.city,addressRegion:facts.region,addressCountry:facts.country},
  containedInPlace:place,areaServed:[place,{'@type':'City',name:'Södertälje',sameAs:'https://sv.wikipedia.org/wiki/S%C3%B6dert%C3%A4lje'}],hasMap:facts.mapUrl,...(facts.profiles.length?{sameAs:facts.profiles.map(([,url])=>url)}:{}),
  servesCuisine:['Pizza','Italiensk','Pasta','Svensk husmanskost','Burgare'],priceRange:allPrices,currenciesAccepted:'SEK',acceptsReservations:true,
  amenityFeature:[{'@type':'LocationFeatureSpecification',name:'Barnmeny',value:true},{'@type':'LocationFeatureSpecification',name:'Privata evenemang',value:true}],
  hasMenu:{'@id':`${origin}/meny/#menu`},
  openingHoursSpecification:[{dayOfWeek:['Monday','Tuesday','Wednesday','Thursday'],opens:'10:30',closes:'21:00'},{dayOfWeek:'Friday',opens:'10:30',closes:'22:00'},{dayOfWeek:'Saturday',opens:'12:00',closes:'22:00'},{dayOfWeek:'Sunday',opens:'12:00',closes:'20:00'}].map(h=>({'@type':'OpeningHoursSpecification',...h}))};
 const graph: Record<string,unknown>[] = [business,{'@type':'WebSite','@id':`${origin}/#website`,url:`${origin}/`,name:facts.name,alternateName:'ilvicino.se',inLanguage:'sv',publisher:{'@id':`${origin}/#restaurant`}},{'@type':'WebPage','@id':`${page}#webpage`,url:page,name:menu?'Meny | IL VICINO i Pershagen':'IL VICINO | Kvarterskrog i Pershagen, Södertälje',description:menu?pageDescriptions.meny:pageDescriptions.home,inLanguage:'sv',isPartOf:{'@id':`${origin}/#website`},about:{'@id':`${origin}/#restaurant`},...(menu?{dateModified:menuUpdated,mainEntity:{'@id':`${origin}/meny/#menu`},breadcrumb:{'@id':`${page}#breadcrumb`}}:{mainEntity:{'@id':`${page}#faq`}})}];
 if(menu) graph.push({'@type':'BreadcrumbList','@id':`${page}#breadcrumb`,itemListElement:[{'@type':'ListItem',position:1,name:'Hem',item:`${origin}/`},{'@type':'ListItem',position:2,name:'Meny',item:page}]},{'@type':'Menu','@id':`${page}#menu`,name:'Meny – IL VICINO',url:page,inLanguage:'sv',
  hasMenuSection:menuSections.map(s=>({'@type':'MenuSection','@id':`${page}#${s.id}`,name:s.name,hasMenuItem:s.items.map(i=>({'@type':'MenuItem',name:i.name,...(i.description?{description:i.description}:{}),...(i.price?{offers:{'@type':'Offer',price:i.price,priceCurrency:'SEK'}}:{})}))}))});
 else graph.push({'@type':'FAQPage','@id':`${page}#faq`,inLanguage:'sv',mainEntity:faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))});
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}}/>;
}
