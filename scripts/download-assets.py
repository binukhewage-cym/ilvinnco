import json,subprocess
for url,local in json.load(open('audit/baseline/assets.json')).items():
 subprocess.run(['curl','-fLsS','--max-time','45','https://ilvicino.se'+url,'-o','public'+local],check=True)
