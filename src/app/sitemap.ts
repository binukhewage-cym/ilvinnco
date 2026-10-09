import type {MetadataRoute} from 'next';
import {menuUpdated} from '@/data/site';
export default function sitemap():MetadataRoute.Sitemap{return [{url:'https://ilvicino.se/',lastModified:menuUpdated,priority:1},{url:'https://ilvicino.se/meny/',lastModified:menuUpdated,priority:0.9}];}
