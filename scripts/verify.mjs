import {load} from 'cheerio';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.TEST_URL || 'http://localhost:3000';
const source=JSON.parse(fs.readFileSync('src/data/original.json','utf8'));
const normalize=s=>s.replace(/\s+/g,' ').trim();
const corrections=JSON.parse(fs.readFileSync('src/data/menu-corrections.json','utf8'));
const correct=t=>{for(const [from,to] of corrections)if(t.includes(from)&&!t.includes(to))t=t.replace(from,to);return t;};
const titles={home:'IL VICINO | Kvarterskrog i Pershagen, Södertälje',meny:'Meny | IL VICINO i Pershagen'};
const results=[];
function check(name,condition,detail=''){results.push({name,status:condition?'PASS':'FAIL',detail});}
for(const [key,path] of [['home','/'],['meny','/meny/']]){
 const response=await fetch(base+path);const html=await response.text();const $=load(html);fs.writeFileSync(`audit/${key}-rendered.html`,html);
 check(`${path} HTTP 200`,response.status===200);
 check(`${path} descriptive title`,$('title').text()===titles[key]);
 const description=$('meta[name=description]').attr('content')||'';
 check(`${path} meta description 70-200 chars naming place`,description.length>=70&&description.length<=200&&description.includes('Pershagen'),description);
 check(`${path} Swedish language`,$('html').attr('lang')==='sv');
 check(`${path} canonical`,$('link[rel=canonical]').attr('href')==='https://ilvicino.se'+path);
 check(`${path} indexable`,!$('meta[name=robots]').attr('content')?.includes('noindex'));
 check(`${path} one H1`,$('h1').length===1);
 check(`${path} social title`,$('meta[property="og:title"]').attr('content')===titles[key]&&!!$('meta[property="og:description"]').attr('content'));
 const graph=JSON.parse($('script[type="application/ld+json"]').text())['@graph'];
 check(`${path} JSON-LD syntax and stable unique entity IDs`,graph.every(e=>e['@id']?.startsWith('https://ilvicino.se/'))&&new Set(graph.map(e=>e['@id'])).size===graph.length);
 const business=graph.find(e=>e['@type']==='Restaurant');
 if(key==='home'){const faq=graph.find(e=>e['@type']==='FAQPage');check('/ FAQPage matches visible questions',faq?.mainEntity.length>=6&&faq.mainEntity.every(q=>$('details summary').text().includes(q.name)));}
 if(key==='meny'){const items=graph.find(e=>e['@type']==='Menu').hasMenuSection.flatMap(s=>s.hasMenuItem);check('/meny/ every MenuItem priced in SEK',items.length>50&&items.every(i=>i.offers?.priceCurrency==='SEK'&&i.offers.price>0),String(items.length));}
 check(`${path} schema facts`,business.name==='IL VICINO'&&business.telephone==='+46855097000'&&business.address.streetAddress==='Nyköpingsvägen 75'&&business.address.addressCountry==='SE'&&business.servesCuisine.length>0&&!!business.priceRange&&!!business.disambiguatingDescription&&business.openingHoursSpecification.length===4);
 $('script,style').remove();const text=normalize($('body').text());
 const missing=source[key].blocks.flat().filter(b=>b.text&&!text.includes(normalize(correct(b.text))));
 check(`${path} every original content block preserved`,missing.length===0,JSON.stringify(missing));
 const missingImages=source[key].images.filter(src=>!$(`img[src="${src}"]`).length&&!html.includes(encodeURIComponent(src)));
 check(`${path} every original visible image retained`,missingImages.length===0,JSON.stringify(missingImages));
 const names=[];$('a[href]').each((_,e)=>{if(!normalize($(e).text())&&!$(e).attr('aria-label')&&!$(e).find('img[alt]').attr('alt'))names.push($(e).attr('href'));});
 check(`${path} links have accessible names`,names.length===0,JSON.stringify(names));
 const broken=[];for(const href of new Set($('a[href]').map((_,e)=>$(e).attr('href')).get())){
  if(href==='#'||href==='/#')continue;
  if(href.startsWith('/')){const u=new URL(href,base);const res=await fetch(u);if(!res.ok)broken.push(href);if(u.hash){const other=load(await res.text());if(!other(`[id="${u.hash.slice(1)}"]`).length)broken.push(href);}}
  else if(href.startsWith('#')&&!$(`[id="${href.slice(1)}"]`).length)broken.push(href);
 }
 check(`${path} functional internal destinations`,broken.length===0,JSON.stringify(broken));
}
const form=load(await(await fetch(base+'/integration/contact.html')).text());
const oldForm=load(fs.readFileSync('audit/baseline/home.html','utf8'));
for(const attr of ['action','destination','locale','page-id','site-id','site-name','success-message','ws-hcaptcha-key'])check(`form ${attr} preserved`,form('ws-contact-form-container').attr(attr)===oldForm('ws-contact-form-container').attr(attr));
for(const field of ['name','email','message'])check(`form field ${field} preserved`,form(`[name=${field}]`).length===1);
check('form required email preserved',form('[name=email]').attr('required')!==undefined);
const analytics=JSON.parse(fs.readFileSync('src/data/analytics.json','utf8'));
const originalAnalytics=load(fs.readFileSync('audit/baseline/home.html','utf8'))('#site_analytics_tracking');
check('original analytics ID and provider preserved',analytics.attrs['data-id']===originalAnalytics.attr('data-id')&&analytics.attrs['data-url']===originalAnalytics.attr('data-url')&&analytics.script.includes('_trackPageview'));
const robots=await(await fetch(base+'/robots.txt')).text();check('robots allows all crawlers and named AI bots',/User-Agent: \*/i.test(robots)&&/Allow: \//.test(robots)&&['GPTBot','OAI-SearchBot','ClaudeBot','PerplexityBot','Google-Extended'].every(b=>robots.includes(b))&&robots.includes('https://ilvicino.se/sitemap.xml'));
const llmsRes=await fetch(base+'/llms.txt');const llms=await llmsRes.text();check('llms.txt served with facts and full menu',llmsRes.ok&&llms.startsWith('# IL VICINO')&&llms.includes('Nyköpingsvägen 75')&&llms.includes('MARGHERITA')&&llms.includes('Tiramisu'));
const xml=await(await fetch(base+'/sitemap.xml')).text();const sm=load(xml,{xmlMode:true});assert.equal(sm('parsererror').length,0);check('sitemap two canonical routes',JSON.stringify(sm('loc').map((_,e)=>sm(e).text()).get().sort())===JSON.stringify(['https://ilvicino.se/','https://ilvicino.se/meny/']));
check('unknown route returns 404',(await fetch(base+'/missing-route-test/')).status===404);
check('menu slash redirect',(await fetch(base+'/meny',{redirect:'manual'})).status===308);
check('integration noindex header',(await fetch(base+'/integration/contact.html')).headers.get('x-robots-tag')==='noindex');
const assets=JSON.parse(fs.readFileSync('audit/baseline/assets.json'));check('all archived brand assets present',Object.values(assets).every(p=>fs.existsSync('public'+p)&&fs.statSync('public'+p).size>0));
fs.writeFileSync('audit/verification.json',JSON.stringify(results,null,2));
console.log(results.map(r=>`${r.status} ${r.name}${r.status==='FAIL'?' '+r.detail:''}`).join('\n'));
console.log(`${results.filter(r=>r.status==='PASS').length}/${results.length} checks passed`);
if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
