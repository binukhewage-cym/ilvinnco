import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,Footer,Photo,Arrow} from '@/components/site';
import {StructuredData} from '@/components/structured-data';
import {original,menuSections} from '@/data/site';
export const metadata:Metadata={title:original.meny.title,alternates:{canonical:'/meny/'},openGraph:{title:original.meny.title,url:'/meny/',siteName:'ilvicino.se',locale:'sv_SE',type:'website',images:[original.meny.images[0]]},twitter:{card:'summary_large_image',title:original.meny.title,images:[original.meny.images[0]]}};
function MenuLines({lines}:{lines:string[]}){
 const groups:string[][]=[];
 for(const line of lines){
  if(/^\d+$/.test(line)||line==='GOURMET PIZZOR')groups.push([line]);
  else if(/^(Med |På |V esuvio|bearnaisesås\)|& mozzarella|basilika &|rucola &|tomater, burrata)/.test(line)&&groups.length)groups.at(-1)!.push(line);
  else groups.push([line]);
 }
 return <div className="menu-items">{groups.map((group,i)=>/^\d+$/.test(group[0])||group[0]==='GOURMET PIZZOR'?<p className="menu-price-band" key={i}>{group[0]}</p>:<div className="menu-item" key={i}>{group.map((text,j)=><p className={j?'item-description':''} key={j}>{text}</p>)}</div>)}</div>;
}
export default function Menu(){const b=original.meny.blocks;return <><Header menu/><main id="main"><StructuredData menu/><section className="shell menu-hero"><div><nav className="breadcrumbs" aria-label="Brödsmulor"><Link href="/">Hem</Link><span aria-hidden="true">/</span><span>Meny</span></nav><h1>{b[0][0].text}</h1><p>{b[0][1].text}</p><a className="text-link" href="#meny-0">Utforska <Arrow/></a></div><Photo src={original.meny.images[0]} alt="Rostad smörgås med gröna blad" priority className="menu-photo"/></section><div className="shell menu-layout"><aside className="menu-index"><p>{b[1][0].text}</p><nav aria-label="Menykategorier">{menuSections.map(s=><a href={`#${s.id}`} key={s.id}>{s.name}<span aria-hidden="true">↘</span></a>)}</nav></aside><div>{menuSections.map(s=><section className="menu-section" id={s.id} key={s.id}><h2>{s.name}</h2><MenuLines lines={s.lines}/></section>)}</div></div><section className="shell menu-end"><h2>{b[2][0].text}</h2><p>{b[2][1].text}</p><a className="button" href="#meny-0">Utforska <Arrow/></a></section></main><Footer minimal/></>;}
