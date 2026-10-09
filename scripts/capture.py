from bs4 import BeautifulSoup
from pathlib import Path
import json,re,hashlib
out={}; assets={}
for page in ['home','meny']:
 s=BeautifulSoup(Path(f'audit/baseline/{page}.html').read_text(),'html.parser')
 blocks=[]
 for el in s.select('ws-text'):
  blocks.append([{'tag':n.name,'text':re.sub(r'\s+',' ',n.get_text()).strip()} for n in el.find_all(['h1','h2','h3','h4','h5','h6','p','blockquote'],recursive=False)])
 imgs=[]
 for img in s.select('img[src]'):
  u=img['src']; name=hashlib.sha256(u.encode()).hexdigest()[:10]+Path(u).suffix
  assets[u]='/assets/'+name; imgs.append(assets[u])
 out[page]={'title':s.title.text,'blocks':blocks,'images':imgs,'ids':[e['id'] for e in s.select('[id]')],'links':[{'text':a.get_text(' ',strip=True),'href':a['href']} for a in s.select('a[href]')]}
Path('src/data/original.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
Path('audit/baseline/assets.json').write_text(json.dumps(assets,indent=2))
# Keep exact original form markup, validation, captcha, endpoint and messages.
s=BeautifulSoup(Path('audit/baseline/home.html').read_text(),'html.parser')
Path('public/integration').mkdir(exist_ok=True)
form=str(s.select_one('ws-contact-form-container'))
styles='\n'.join(str(x) for x in s.select('head style'))
output=str(s.select_one('#form-output-global'))
css='''html,body{margin:0!important;background:#f4f3ec!important;color:#173e3b!important;font-family:Arial,sans-serif!important}body{padding:4px!important}ws-contact-form-container{display:block}ws-contact-form-group{display:block;margin-bottom:20px}ws-label{display:block;font-size:14px;margin-bottom:8px}input,textarea{font:inherit!important;background:transparent!important;border:1px solid #7f9590!important;border-radius:0!important;padding:14px!important;width:100%!important;box-sizing:border-box}textarea{min-height:120px!important}input:focus,textarea:focus{outline:2px solid #173e3b;outline-offset:3px}ws-button{background:#173e3b!important;color:#fff!important;padding:16px 24px!important;display:inline-flex!important;border-radius:0!important;cursor:pointer}ws-button:focus-visible{outline:3px solid #173e3b;outline-offset:4px}.ws-contact-form__output{max-width:100%}'''
Path('public/integration/contact.html').write_text('<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Boknings- och kontaktformulär</title><link rel="stylesheet" href="/integration/original.css">'+styles+'<style>'+css+'</style></head><body class="ws-light-1">'+form+output+'<script src="/integration/original.js"></script></body></html>')
# Preserve original analytics configuration and script, loaded only on the production hostname.
a=s.select_one('#site_analytics_tracking')
Path('src/data/analytics.json').write_text(json.dumps({'attrs':a.attrs,'script':a.string}))
print(json.dumps(out,ensure_ascii=False,indent=2)[:1800]);print(assets)
