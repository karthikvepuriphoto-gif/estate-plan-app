(async()=>{try{const $=s=>document.querySelector(s),app=$("#app"),esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
const P={check:'<path d="M20 6 9 17l-5-5"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>',home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',users:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M17 4a4 4 0 0 1 0 8M22 21a6 6 0 0 0-4-5.6"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',flag:'<path d="M4 21V4h13l-2 4 2 4H4"/>',coins:'<circle cx="9" cy="9" r="6"/><path d="M15.5 9.5a6 6 0 1 1-6 6"/>',shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',paw:'<circle cx="5" cy="10" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="19" cy="10" r="2"/><path d="M8 17a4 4 0 0 1 8 0c0 2-2 3-4 3s-4-1-4-3z"/>',file:'<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',moon:'<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',cloud:'<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z"/>'};
const I=(n,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||P.check}</svg>`;
const OI={Yes:"check",No:"x",Married:"heart","Domestic partner":"heart",Home:"home","Retirement accounts":"coins","Life insurance":"shield",Business:"briefcase","Foreign property or accounts":"globe","Digital assets":"cloud",Pets:"paw","U.S. citizen":"flag","Green card holder":"file","Visa holder living in U.S.":"file","Non-resident (live abroad)":"globe","Minor children":"users","Adult children":"users","Child with special needs":"heart"};
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
function fail(msg){app.innerHTML=`<section class="hero enter"><div class="card"><h2 class="q">Something went wrong loading the app.</h2><p class="why">${I("info",18)}<span>${esc(msg)}</span></p><div class="actions"><button class="btn" onclick="location.reload()">Try again</button></div></div></section>`;}
const withTimeout=(p,ms,fb)=>Promise.race([p,new Promise(r=>setTimeout(()=>r(fb),ms))]);
let flow,states,cit,warn="";
try{const base=window.DATA_BASE||"data/";[flow,states,cit]=await Promise.all(["flow","states","citizenship"].map(f=>fetch(base+f+".json").then(r=>r.json())));}catch(e){return fail("Couldn't load the question data: "+(e.message||e));}
let people;try{people=JSON.parse(LS.get("epa.people")||"null")}catch(e){}if(!Array.isArray(people)||!people.length)people=["Person 1","Person 2"];
let person=LS.get("epa.who")||people[0];if(!people.includes(person))people.unshift(person);
let ans={},i=0,view="home";
try{const T={};const r=await withTimeout(EPAStorage.load(person),8000,T);if(r===T)warn="Your saved answers are taking a while to load, so you're starting with a blank form for now.";else ans=r||{};}
catch(e){warn="Couldn't load saved answers ("+(e.message||e)+"). You can keep going; we'll try saving again as you answer.";}
async function persist(){try{await EPAStorage.save(person,ans);}catch(e){toast("Couldn't save: "+(e.message||e));}}
function toast(m){let t=$("#toast");if(!t){t=document.createElement("div");t.id="toast";t.setAttribute("role","status");document.body.append(t)}t.textContent=m;t.className="on";clearTimeout(t._t);t._t=setTimeout(()=>t.className="",3500);}
async function switchTo(p){person=p;LS.set("epa.who",p);if(!people.includes(p))people.push(p);LS.set("epa.people",JSON.stringify(people));try{ans=await EPAStorage.load(p)||{}}catch(e){ans={};toast("Couldn't load answers for "+p)}i=0;home();}
const th=LS.get("epa.theme");if(th)document.documentElement.dataset.theme=th;
function chrome(){$("#who").innerHTML=people.map(p=>`<button aria-selected="${p===person}" data-p="${esc(p)}">${esc(p)}</button>`).join("");
 $("#who").querySelectorAll("button").forEach(b=>b.onclick=()=>switchTo(b.dataset.p));
 const l=qs(),d=l.filter(q=>ans[q.id]!=null&&ans[q.id]!==""&&!(Array.isArray(ans[q.id])&&!ans[q.id].length)).length;$("#barFill").style.width=Math.round(100*d/l.length)+"%";return [d,l.length];}
const qs=()=>EstateFlow.visible(flow,ans);
function render(html,fn){const go=()=>{app.innerHTML=html;app.firstElementChild&&app.firstElementChild.classList.add("enter");fn&&fn();window.scrollTo(0,0)};
 if(RM||!app.firstElementChild)return go();app.firstElementChild.classList.add("leave");setTimeout(go,150);}
function home(){view="home";const [d,n]=chrome();render(`<section class="hero"><h1>${d?"Welcome back.":"Draft your estate plan,<br>calmly."}</h1>
 <p class="lead">${d?`You've answered ${d} of ${n} questions. Pick up where you left off.`:"A few minutes of tap-to-answer questions that adapt to your state, family, citizenship and assets. You leave with drafts to take to an attorney."}</p>
 <ul class="feat"><li>${I("flag",16)}All 50 states + DC</li><li>${I("globe",16)}Non-citizen &amp; foreign assets</li><li>${I("lock",16)}Answers stay on this device</li></ul>
 ${warn?`<p class="why" role="alert">${I("info",18)}<span>${esc(warn)}</span></p>`:""}
 <form class="namer" id="namer"><label for="pname">Who's answering on this device?</label><div><input type="text" id="pname" value="${esc(person)}" maxlength="40" autocomplete="given-name"><button class="btn ghost" type="submit">Save name</button></div></form>
 <div class="actions"><button class="btn grow" id="go">${d?"Continue":"Start"} as ${person} ${I("arrow",18)}</button><button class="btn ghost" id="docs">${I("file",18)} View drafts</button></div>
 <p class="notice">Not legal advice. Every draft is watermarked for attorney review.</p></section>`,()=>{$("#go").onclick=()=>{i=Math.min(d,n-1);ask()};$("#docs").onclick=docs;
 $("#namer").onsubmit=async e=>{e.preventDefault();const nn=$("#pname").value.trim();if(!nn||nn===person)return;if(people.includes(nn))return switchTo(nn);
  try{await EPAStorage.rename(person,nn)}catch(err){}people=people.map(p=>p===person?nn:p);person=nn;LS.set("epa.people",JSON.stringify(people));LS.set("epa.who",nn);await persist();toast("Saved. Answering as "+nn);home();};});}
function ask(){view="ask";const list=qs();if(i>=list.length)return docs();const q=list[i],a=ans[q.id],sec=flow.sections.find(s=>s.id===q.s);chrome();
 let body="";if(q.type==="text")body=`<input type="text" id="t" value="${esc(a||"")}" placeholder="Type your answer" autocomplete="off">`;
 else if(q.type==="state")body=`<select id="t" aria-label="State"><option value="">Choose your state…</option>${Object.values(states.states).map(s=>`<option value="${s.code}" ${a===s.code?"selected":""}>${s.name}</option>`).join("")}</select>`;
 else{const o=q.type==="yn"?["Yes","No"]:q.opts,m=q.type==="multi";body=`<div class="opts" role="group">${o.map((x,k)=>`<button class="opt" aria-pressed="${m?(a||[]).includes(x):a===x}" data-v="${esc(x)}"><span class="ic">${I(OI[x]||"check")}</span>${esc(x)}<kbd>${k+1}</kbd></button>`).join("")}</div>`;}
 render(`<div><div class="card"><div class="meta"><b>${esc(sec.t)}</b><span>${i+1} of ${list.length}</span></div><h2 class="q">${esc(q.q)}</h2><p class="why">${I("info",18)}<span>${esc(q.why)}</span></p>${body}</div>
 <div class="actions"><button class="btn ghost" id="back">Back</button><button class="btn grow" id="next">${i===list.length-1?"See my drafts":"Continue"}</button></div><p class="hint"><kbd>1</kbd>–<kbd>9</kbd> choose · <kbd>Enter</kbd> continue · <kbd>Esc</kbd> back</p></div>`,()=>{
 app.querySelectorAll(".opt").forEach(b=>b.onclick=()=>pick(q,b.dataset.v));const t=$("#t");if(t&&matchMedia("(min-width:700px)").matches)t.focus();
 $("#next").onclick=next;$("#back").onclick=back;});
 window._q=q;}
async function pick(q,x){if(q.type==="multi"){let s=ans[q.id]||[];if(x==="No children")s=[x];else s=(s.includes(x)?s.filter(y=>y!==x):[...s.filter(y=>y!=="No children"),x]);ans[q.id]=s;persist();
 app.querySelectorAll(".opt").forEach(b=>b.setAttribute("aria-pressed",s.includes(b.dataset.v)));chrome();}
 else{ans[q.id]=x;persist();app.querySelectorAll(".opt").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===x));setTimeout(()=>{i++;ask()},RM?0:180);}}
async function next(){const t=$("#t");if(t){ans[window._q.id]=t.value;persist()}i++;ask();}
function back(){if(i>0){i--;ask()}else home();}
document.addEventListener("keydown",e=>{if(view!=="ask")return;const tag=e.target.tagName;if(e.key==="Enter"&&tag!=="BUTTON"){e.preventDefault();next();}
 else if(e.key==="Escape")back();else if(/^[1-9]$/.test(e.key)&&tag!=="INPUT"){const b=app.querySelectorAll(".opt")[+e.key-1];b&&b.click();}});
function docs(){view="docs";chrome();const st=states.states[ans.state];
 if(!st)return render(`<section class="hero"><h1>Nothing to draft yet.</h1><p class="lead">Tell us your state and a few basics, and your drafts appear here, already matched to your state's signing rules.</p><div class="actions"><button class="btn" id="go">Start the questions</button></div></section>`,()=>{$("#go").onclick=()=>{i=0;ask()}});
 const out=EstateTemplates.build(ans,st),fl=EstateFlow.flags(ans,cit),un=Object.entries(st).filter(([k,v])=>v==="unverified").map(([k])=>k.replace(/_/g," "));
 render(`<section><h1 style="font-size:clamp(28px,5vw,40px)">Your drafts · ${esc(st.name)}</h1><p class="wm" style="margin:8px 0 20px">${out.watermark}</p>
 ${fl.length?`<div class="card"><h3 style="margin-bottom:6px">Raise these with your attorney</h3>${fl.map(c=>`<div class="flag"><span class="tag">${esc(c.title)}</span><p style="margin:6px 0 0;color:var(--mute)">${esc(c.plain)}</p></div>`).join("")}</div>`:""}
 ${un.length?`<p class="notice">${I("info",14)} For ${esc(st.name)}, these rules weren't verified yet: ${esc(un.join(", "))}.</p>`:""}
 ${out.docs.map(d=>`<article class="doc"><p class="wm">${out.watermark}</p><h2>${esc(d.title)}</h2>${d.sections.map(s=>`<h3>${esc(s.h)}</h3>${s.p.map(p=>`<p>${esc(p)}</p>`).join("")}`).join("")}</article>`).join("")}
 <article class="doc"><p class="wm">${out.watermark}</p><h2>${esc(st.name)} signing checklist</h2><ol>${out.checklist.map(c=>`<li>${esc(c)}</li>`).join("")}</ol></article>
 <div class="actions"><button class="btn" id="pr">Print or save PDF</button><button class="btn ghost" id="dl">Download Word file</button><button class="btn ghost" id="h">Edit answers</button></div></section>`,()=>{
 $("#pr").onclick=()=>print();$("#h").onclick=()=>{i=0;ask()};$("#dl").onclick=()=>{const h=`<html><body style="font-family:Calibri"><p style="color:#9a5b13"><b>${out.watermark}</b></p>`+[...app.querySelectorAll(".doc")].map(d=>d.innerHTML).join('<br style="page-break-before:always">')+`</body></html>`;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([h],{type:"application/msword"}));a.download="estate-drafts-"+person.replace(/\s/g,"")+".doc";a.click();};
 if(window.google&&google.script){const b=document.createElement("button");b.className="btn ghost";b.textContent="Save as Google Doc";b.onclick=()=>EPAStorage.call("createDocs",person,[...app.querySelectorAll(".doc")].map(d=>d.innerHTML).join("<hr>")).then(u=>window.open(u)).catch(e=>toast("Couldn't create the Google Doc: "+(e.message||e)));$(".actions").append(b);}});}
$("#homeBtn").onclick=home;$("#theme").onclick=()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;r.dataset.theme=dark?"light":"dark";LS.set("epa.theme",r.dataset.theme)};home();}catch(e){console.error(e);const a=document.querySelector("#app");if(a)a.innerHTML=`<section class="card"><h2>Something went wrong loading the app.</h2><p>${String(e&&e.message||e).replace(/</g,"&lt;")}</p><button class="btn" onclick="location.reload()">Try again</button></section>`;}})();
