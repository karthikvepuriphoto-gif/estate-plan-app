# Regenerates apps-script/*.html from the shared web sources so both UIs stay identical.
import json,re,os
d=os.path.dirname(os.path.abspath(__file__))+"/"
js=lambda f:open(d+"js/"+f).read()
data="window.__DATA="+json.dumps({k:json.load(open(d+f"data/{k}.json")) for k in["flow","states","citizenship"]})+";"
shim="const _f=window.fetch;window.fetch=u=>{const k=(String(u).match(/(\\w+)\\.json$/)||[])[1];return k&&window.__DATA[k]?Promise.resolve({json:()=>window.__DATA[k]}):_f(u)};"
open(d+"apps-script/Data.html","w").write("<script>"+data+shim+"</script>")
for n,f in[("Storage","storage.js"),("Flow","flow.js"),("Templates","templates.js"),("App","app.js")]:open(d+f"apps-script/{n}.html","w").write("<script>\n"+js(f)+"\n</script>")
open(d+"apps-script/Styles.html","w").write("<style>"+open(d+"style.css").read()+"</style>")
idx=open(d+"index.html").read().replace('<link rel="stylesheet" href="style.css">',"<?!= include('Styles') ?>")
idx=re.sub(r'<script src=.*</script></body>',"<?!= include('Data') ?><?!= include('Storage') ?><?!= include('Flow') ?><?!= include('Templates') ?><?!= include('App') ?></body>",idx)
open(d+"apps-script/Index.html","w").write(idx)
