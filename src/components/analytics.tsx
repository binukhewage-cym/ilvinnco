'use client';
import {useEffect} from 'react';
import analytics from '@/data/analytics.json';
export function Analytics(){useEffect(()=>{
 if(location.hostname!=='ilvicino.se' || document.getElementById('site_analytics_tracking'))return;
 const script=document.createElement('script');
 for(const [key,value] of Object.entries(analytics.attrs)) script.setAttribute(key,String(value));
 // Preserve the existing provider's consent checks; Next loads after window.load.
 script.textContent=analytics.script.replace("window.addEventListener('load', function() {\n          injectScript();\n        });","if (document.readyState === 'complete') { injectScript(); } else { window.addEventListener('load', injectScript, { once: true }); }");
 document.body.appendChild(script);
 },[]);return null;}
