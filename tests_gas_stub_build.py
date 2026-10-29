import re
d="/workspace/epa/apps-script/"
idx=open(d+"Index.html").read()
stub='''<script>
window.db=JSON.parse(new URLSearchParams(location.search).get("seed")||"{}");const mode=new URLSearchParams(location.search).get("mode")||"ok";const db=window.db;
function runner(){const h={s:null,f:null};let px;const api={withSuccessHandler(f){h.s=f;return px},withFailureHandler(f){h.f=f;return px}};
 const srv={listPeople:()=>JSON.stringify({ok:true,data:Object.keys(db)}),loadAnswers:p=>JSON.stringify({ok:true,data:db[p]||{}}),saveAnswers:(p,a)=>{db[p]=JSON.parse(a);return JSON.stringify({ok:true,data:true})},renamePerson:()=>JSON.stringify({ok:true,data:true}),clearAnswers:p=>{delete db[p];return JSON.stringify({ok:true,data:true})},createDocs:()=>JSON.stringify({ok:true,data:"about:blank"})};
 return px=new Proxy(api,{get(t,k){if(k in t)return t[k];return(...x)=>setTimeout(()=>{
  if(k==="loadAnswers"&&mode==="fail")return h.f(new Error("Exception: Drive export failed"));
  if(k==="loadAnswers"&&mode==="hang")return;
  if(k==="loadAnswers"&&mode==="undef")return h.s(undefined);
  if(k==="loadAnswers"&&mode==="garbage")return h.s("<<not json>>");
  if(k==="loadAnswers"&&mode==="srverr")return h.s(JSON.stringify({ok:false,error:"Sheet missing"}));
  if(k==="createDocs"&&mode==="docfail")return setTimeout(()=>h.f(new Error("Drive quota exceeded")),600);if(k==="createDocs")return setTimeout(()=>h.s(JSON.stringify({ok:true,data:"https://docs.google.com/document/d/TEST/edit"})),900);if(k==="saveAnswers"&&mode==="savefail")return h.f({message:"quota"});
  h.s(srv[k](...x))},20)}})}
window.google={script:{get run(){return runner()}}};</script>'''
idx=idx.replace("<?!= include('Styles') ?>",open(d+"Styles.html").read())
idx=re.sub(r"<\?!= include\('(\w+)'\) \?>",lambda m:(stub if m.group(1)=="Data" else "")+open(d+m.group(1)+".html").read(),idx)
open("/tmp/gas/index.html","w").write(idx)
