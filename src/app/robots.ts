import type {MetadataRoute} from 'next';
// AI search, assistant and training crawlers are named explicitly so CDN/WAF rules and future edits keep them allowed.
const aiBots=['OAI-SearchBot','ChatGPT-User','GPTBot','Claude-SearchBot','Claude-User','ClaudeBot','PerplexityBot','Perplexity-User','Google-Extended','Applebot','Applebot-Extended','Bingbot','DuckAssistBot','meta-externalagent','MistralAI-User','CCBot'];
export default function robots():MetadataRoute.Robots{return {rules:[{userAgent:'*',allow:'/',disallow:'/integration/'},{userAgent:aiBots,allow:'/',disallow:'/integration/'}],sitemap:'https://ilvicino.se/sitemap.xml',host:'https://ilvicino.se'};}
