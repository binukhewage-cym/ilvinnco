import Image from 'next/image';
import Link from 'next/link';
import { bookingHref, facts, original } from '@/data/site';
export function Arrow() { return <span aria-hidden="true">↗</span>; }
export function BookingLink({className = ''}: {className?:string}) { return <a className={`button ${className}`} href={bookingHref}>Boka bord <Arrow /></a>; }
export function Header({menu = false}: {menu?:boolean}) {
 return <header id="top" className="site-header"><div className="shell flex h-full items-center justify-between gap-4">
   <Link href="/#top" className="brand" aria-label="IL VICINO – startsida"><Image src={original.home.images[0]} alt="" width={40} height={40}/><span translate="no" className="notranslate">IL VICINO</span></Link>
   <nav aria-label="Huvudnavigation" className="flex items-center gap-5 md:gap-9"><Link href="/#top" aria-current={!menu?'page':undefined} className="nav-link">Hem</Link><Link href="/meny/#top" aria-current={menu?'page':undefined} className="nav-link">Meny</Link><a href="tel:0855097000" className="header-phone">{facts.phone}</a><BookingLink /></nav>
 </div></header>;
}
export function Footer({minimal = false}: {minimal?:boolean}) {
 if (minimal) return <footer className="shell footer-bottom"><Link href="/">IL VICINO · {facts.street}, {facts.area}</Link><Link href="/">Hem <Arrow/></Link></footer>;
 const links=[['Hem','/'],['Meny','/meny/'],['Varför oss','/#varfor'],['Omdömen','/#omdomen'],['Vanliga frågor','/#vanliga-fragor'],['Boka bord',bookingHref]];
 return <footer className="site-footer"><div className="shell footer-grid"><div><Link className="brand" href="/"><Image src={original.home.images[0]} alt="" width={40} height={40}/><span translate="no" className="notranslate">IL VICINO</span></Link><p className="mt-6 max-w-xs">{original.home.blocks[13][0].text}</p></div><nav aria-label="Sidfotsnavigation" className="footer-links">{links.map(([label,href])=><a key={label} href={href}>{label}</a>)}</nav><address className="not-italic space-y-3"><p>{facts.address}</p>{facts.hours.map(h=><p key={h}>{h}</p>)}<p><a href="tel:0855097000">{facts.phone}</a></p><p><a href={`mailto:${facts.email}`}>{facts.email}</a></p></address></div><div className="shell footer-bottom"><span>© 2026 IL VICINO, Pershagen, Södertälje</span>{facts.profiles.length?<nav aria-label="Sociala medier" className="flex gap-4">{facts.profiles.map(([label,url])=><a key={url} href={url} target="_blank" rel="noopener me">{label}</a>)}</nav>:<span>Kvarterskrog · Pizza · Pasta · Husmanskost</span>}</div></footer>;
}
export function Paragraphs({block,start=1}: {block:number;start?:number}) { return original.home.blocks[block].slice(start).map((p,i)=><p key={i}>{p.text}</p>); }
export function Photo({src,alt,className='',priority=false,sizes='(max-width: 767px) 100vw, 50vw'}:{src:string;alt:string;className?:string;priority?:boolean;sizes?:string}) {
 return <div className={`photo ${className}`}><Image src={src} alt={alt} fill sizes={sizes} priority={priority} fetchPriority={priority ? 'high' : undefined} quality={75}/></div>;
}
