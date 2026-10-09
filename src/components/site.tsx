import Image from 'next/image';
import Link from 'next/link';
import { bookingHref, facts, original } from '@/data/site';
export function Arrow() { return <span aria-hidden="true">↗</span>; }
export function BookingLink({className = ''}: {className?:string}) { return <a className={`button ${className}`} href={bookingHref}>Boka bord <Arrow /></a>; }
export function Header({menu = false}: {menu?:boolean}) {
 return <header className="site-header"><div className="shell flex h-full items-center justify-between gap-4">
   <Link href="/" className="brand" aria-label="ilvicino.se"><Image src={original.home.images[0]} alt="" width={40} height={40}/><span>ilvicino.se</span></Link>
   <nav aria-label="Huvudnavigation" className="flex items-center gap-5 md:gap-9"><Link href="/" aria-current={!menu?'page':undefined} className="nav-link">Hem</Link><Link href="/meny/" aria-current={menu?'page':undefined} className="nav-link">Meny</Link><a href="tel:0855097000" className="header-phone">{facts.phone}</a><BookingLink /></nav>
 </div></header>;
}
export function Footer({minimal = false}: {minimal?:boolean}) {
 if (minimal) return <footer className="shell footer-bottom"><Link href="/">ilvicino.se</Link><Link href="/">Hem <Arrow/></Link></footer>;
 const links=[['Hem','/'],['Funktioner','/#varfor'],['Prissättning','/meny/'],['Omdömen','/#omdomen'],['Kontakt',bookingHref],['Blogg','/#']];
 return <footer className="site-footer"><div className="shell footer-grid"><div><Link className="brand" href="/"><Image src={original.home.images[0]} alt="" width={40} height={40}/>ilvicino.se</Link><p className="mt-6 max-w-xs">{original.home.blocks[13][0].text}</p></div><nav aria-label="Sidfotsnavigation" className="footer-links">{links.map(([label,href])=><a key={label} href={href}>{label}</a>)}</nav><address className="not-italic space-y-3"><p>{facts.address}</p><p><a href="tel:0855097000">{facts.phone}</a></p><p><a href={`mailto:${facts.email}`}>{facts.email}</a></p></address></div><div className="shell footer-bottom"><span>© 2026 ilvicino.se</span><div className="flex gap-3">{[['Facebook','69b3e1764e'],['Instagram','cbb2e70e03'],['LinkedIn','88fcb852d3'],['Twitter','e84250b4e8']].map(([label,asset])=><a className="legacy-social" href="#" target="_blank" rel="noopener" key={label} aria-label={label}><Image src={`/assets/${asset}.svg`} alt="" width={18} height={18}/></a>)}</div></div></footer>;
}
export function Paragraphs({block,start=1}: {block:number;start?:number}) { return original.home.blocks[block].slice(start).map((p,i)=><p key={i}>{p.text}</p>); }
export function Photo({src,alt,className='',priority=false,sizes='(max-width: 767px) 100vw, 50vw'}:{src:string;alt:string;className?:string;priority?:boolean;sizes?:string}) {
 return <div className={`photo ${className}`}><Image src={src} alt={alt} fill sizes={sizes} priority={priority} fetchPriority={priority ? 'high' : undefined} quality={75}/></div>;
}
