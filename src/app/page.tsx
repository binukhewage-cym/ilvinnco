import type {Metadata} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {Header,Footer,BookingLink,Photo,Paragraphs,Arrow} from '@/components/site';
import {StructuredData} from '@/components/structured-data';
import {original,bookingId,facts} from '@/data/site';
export const metadata:Metadata={title:original.home.title,alternates:{canonical:'/'},openGraph:{title:original.home.title,url:'/',siteName:'ilvicino.se',locale:'sv_SE',type:'website',images:[{url:original.home.images[1],width:1200,height:1600,alt:'IL VICINO'}]},twitter:{card:'summary_large_image',title:original.home.title,images:[original.home.images[1]]}};
export default function Home(){ const b=original.home.blocks;const im=original.home.images;
 return <><Header/><main id="main"><StructuredData/>
 <section className="hero shell"><div className="hero-copy"><h1>{b[0][0].text}</h1><p className="hero-tagline">{b[0][5].text}</p><div className="flex flex-wrap items-center gap-7"><BookingLink/><Link className="text-link" href="/meny/">Meny <Arrow/></Link></div></div><Photo src={im[1]} alt="Matsalen på IL VICINO med blågröna väggar och dukade bord" className="hero-photo" priority/></section>
 <section className="intro shell"><div className="intro-text"><p className="lead">{b[0][1].text}</p><div className="copy"><p>{b[0][2].text}</p><p>{b[0][3].text}</p><p>{b[0][4].text}</p></div></div><Photo src={im[2]} alt="Baren på IL VICINO" className="intro-photo" sizes="(max-width: 767px) 80vw, 30vw"/></section>
 <section id="kok" className="kitchen-section"><div className="shell kitchen"><Photo src={im[3]} alt="Matlagning i köket" className="kitchen-photo"/><div className="kitchen-copy"><h2>{b[1][0].text}</h2><div className="copy"><Paragraphs block={1}/></div><Link className="text-link" href="/meny/">Meny <Arrow/></Link></div></div></section>
 <section id="varfor" className="shell reasons"><div className="section-heading"><h2>{b[2][0].text}</h2><p>{b[2][1].text}</p></div><div className="reason-grid">{[3,4,5].map(n=><article key={n}><h3>{b[n][0].text}</h3><p>{b[n][1].text}</p></article>)}</div></section>
 <section className="events shell"><Photo src={im[4]} alt="Restaurangens bar och sittplatser" className="event-photo"/><div className="event-copy"><h2>{b[6][0].text}</h2><div className="copy"><Paragraphs block={6}/></div></div></section>
 <section id="omdomen" className="reviews shell"><div className="section-heading"><h2>{b[7][0].text}</h2><p>{b[7][1].text}</p></div><div className="review-grid">{[8,9,10].map((n,i)=><figure key={n}><blockquote>{b[n][1].text}</blockquote><figcaption><Image src={im[i+5]} alt="" width={48} height={48}/><span>{b[n][0].text}</span></figcaption></figure>)}</div><BookingLink/></section>
 <section id={bookingId} className="contact-section"><div className="shell contact-grid"><div><h2>{b[12][0].text}</h2><p className="contact-intro">{b[12][1].text}</p><address className="contact-address"><p>{facts.address}</p><a className="phone-large" href="tel:0855097000">{facts.phone}</a><a href={`mailto:${facts.email}`}>{facts.email}</a></address><div className="hours">{facts.hours.map(h=><p key={h}>{h}</p>)}</div></div><div className="contact-form"><h2>{b[11][0].text}</h2><iframe src="/integration/contact.html" title={b[11][0].text} loading="lazy" className="form-frame"/></div></div></section>
 </main><Footer/></>;
}
