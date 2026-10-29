const F=require("./js/flow.js"),T=require("./js/templates.js"),flow=require("./data/flow.json"),S=require("./data/states.json").states,C=require("./data/citizenship.json");
const a={name:"A",state:"NE",married:"Married",spouse_citizenship:"Visa holder living in U.S.",citizenship:"Visa holder living in U.S.",kids:["Minor children"],assets:["Pets","Foreign property or accounts"],foreign_where:"India",rlt:"Yes"};
const ok=(c,m)=>{if(!c){console.error("FAIL",m);process.exit(1)}console.log("ok",m)};
ok(Object.keys(S).length===51,"51 jurisdictions");
ok(F.visible(flow,a).some(q=>q.id==="guardian"),"guardian shown for minors");
ok(!F.visible(flow,{married:"Single"}).some(q=>q.id==="spouse_name"),"spouse hidden when single");
const d=F.documents(a);["will","testamentary_trust","living_trust","financial_poa","healthcare_directive","hipaa","guardian_nomination","pet_trust"].forEach(x=>ok(d.includes(x),"doc "+x));
const f=F.flags(a).sort();ok(f.includes("india")&&f.includes("noncitizen_spouse")&&f.includes("both_noncitizens"),"citizenship flags "+f);
for(const k in S){const o=T.build(a,S[k]);ok(o.docs.length===8&&o.checklist.length>5,"templates "+k)}
const w=T.build(a,S.NE).docs[0];ok(JSON.stringify(w).includes("Qualified Domestic Trust"),"QDOT clause");
// Both spouses non-citizens via the explicit couple option
const b={name:"K",state:"NE",married:"Married",couple_citizenship:"Both spouses non-citizens",kids:["Minor children"],assets:["Foreign property or accounts"],foreign_where:"Flat in Hyderabad, India"};
ok(flow.questions.find(q=>q.id==="couple_citizenship").opts.includes("Both spouses non-citizens"),"explicit 'Both spouses non-citizens' option");
ok(F.visible(flow,b).some(q=>q.id==="couple_citizenship"),"couple question shown when married");
const bf=F.flags(b,C).map(c=>c.id);["both_noncitizens","noncitizen_spouse","india"].forEach(x=>ok(bf.includes(x),"flag "+x));
const nsp=C.cases.find(c=>c.id==="noncitizen_spouse").plain;ok(/marital deduction does NOT apply/.test(nsp)&&/QDOT/.test(nsp),"warning text: no unlimited marital deduction + QDOT");
const bw=JSON.stringify(T.build(b,S.NE).docs.find(d=>d.id==="will"));
ok(/unlimited marital deduction does not apply/.test(bw),"will: no unlimited marital deduction");ok(/Qualified Domestic Trust \(QDOT\)/.test(bw),"will: QDOT clause");ok(/separate Indian will/.test(bw),"will: India will clause");
ok(!/QDOT/.test(JSON.stringify(T.build({...b,couple_citizenship:"Both U.S. citizens"},S.NE).docs[0])),"no QDOT for citizen couple");
