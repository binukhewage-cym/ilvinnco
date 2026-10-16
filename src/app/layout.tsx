import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
const poppins = localFont({src:[{path:'../../public/assets/poppins-regular.ttf',weight:'400',style:'normal'},{path:'../../public/assets/poppins-bold.ttf',weight:'700',style:'normal'}],variable:'--font-brand',display:'swap'});
import { Analytics } from '@/components/analytics';
import './globals.css';
export const metadata: Metadata = {metadataBase:new URL('https://ilvicino.se'),icons:{icon:'/assets/9d76905f8d.svg'},robots:{index:true,follow:true}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#173e3b'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="sv"><body className={poppins.variable}><a className="skip-link" href="#main">Hoppa till innehållet</a>{children}<Analytics/></body></html>;}
