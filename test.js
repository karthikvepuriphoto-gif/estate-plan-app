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
// ---- Citizenship combinations: exact warnings and will clauses ----
const eq=(x,y,m)=>ok(JSON.stringify([...x].sort())===JSON.stringify([...y].sort()),m+" => "+JSON.stringify(x));
const base={name:"K",state:"NE",married:"Married",spouse_name:"N",kids:["Minor children"],guardian:"G",guardian_abroad:"No",assets:["Home"]};
const will=a=>JSON.stringify(T.build(F.effective(flow,a),S.NE).docs.find(d=>d.id==="will"));
const run=(a)=>F.flags(F.effective(flow,a),C).map(c=>c.id);
ok(!flow.questions.some(q=>q.id==="couple_citizenship"),"no separate couple question");
const so=flow.questions.find(q=>q.id==="citizenship").opts,sp=flow.questions.find(q=>q.id==="spouse_citizenship").opts;
eq(so,sp,"self and spouse use the same status options");
const CASES=[
 ["both citizens",{citizenship:"U.S. citizen",spouse_citizenship:"U.S. citizen"},[],"both_citizens",false],
 ["me citizen, spouse green card",{citizenship:"U.S. citizen",spouse_citizenship:"Green card holder"},["mixed","noncitizen_spouse"],"mixed",true],
 ["me citizen, spouse visa",{citizenship:"U.S. citizen",spouse_citizenship:"Visa holder living in U.S."},["mixed","noncitizen_spouse"],"mixed",true],
 ["me green card, spouse citizen",{citizenship:"Green card holder",spouse_citizenship:"U.S. citizen"},["domiciliary","mixed"],"mixed",false],
 ["both green card",{citizenship:"Green card holder",spouse_citizenship:"Green card holder"},["domiciliary","both_noncitizens","noncitizen_spouse"],"both_noncitizens",true],
 ["both visa",{citizenship:"Visa holder living in U.S.",spouse_citizenship:"Visa holder living in U.S."},["domiciliary","both_noncitizens","noncitizen_spouse"],"both_noncitizens",true],
 ["visa + green card",{citizenship:"Visa holder living in U.S.",spouse_citizenship:"Green card holder"},["domiciliary","both_noncitizens","noncitizen_spouse"],"both_noncitizens",true],
 ["me nonresident, spouse citizen",{citizenship:"Non-resident (live abroad)",spouse_citizenship:"U.S. citizen"},["nonresident_alien","mixed"],"mixed",false],
 ["both nonresident",{citizenship:"Non-resident (live abroad)",spouse_citizenship:"Non-resident (live abroad)"},["nonresident_alien","both_noncitizens","noncitizen_spouse"],"both_noncitizens",true],
];
for(const [n,x,exp,cc,qdot] of CASES){const a={...base,...x};eq(run(a),exp,"flags: "+n);ok(F.couple(a)===cc,"couple: "+n+" = "+cc);
 const w=will(a);ok(/Qualified Domestic Trust/.test(w)===qdot,"QDOT clause "+(qdot?"present":"absent")+": "+n);
 ok(/unlimited marital deduction does not apply/.test(w)===qdot,"marital-deduction clause "+(qdot?"present":"absent")+": "+n);
 const ids=run(a);ok(!(ids.includes("mixed")&&ids.includes("both_noncitizens")),"no contradiction: "+n);}
// single, non-citizen: no spouse warnings
eq(run({name:"K",state:"NE",married:"Single",citizenship:"Visa holder living in U.S.",spouse_citizenship:"Visa holder living in U.S."}),["domiciliary"],"single visa holder ignores stale spouse answer");
// India
const ind={...base,citizenship:"Visa holder living in U.S.",spouse_citizenship:"Visa holder living in U.S.",assets:["Foreign property or accounts"],foreign_where:"Flat in Hyderabad, India"};
eq(run(ind),["domiciliary","both_noncitizens","noncitizen_spouse","foreign_wills_situs","fbar","india"],"flags: both visa + India");
ok(/separate Indian will/.test(will(ind)),"India will clause present");ok(!/separate Indian will/.test(will(base)),"India clause absent without India");
// Guardian abroad only when Yes and minors
ok(run({...base,guardian_abroad:"Yes"}).includes("guardian_abroad"),"guardian abroad: Yes => warning");
ok(!run({...base,guardian_abroad:"No"}).includes("guardian_abroad"),"guardian abroad: No => none");
ok(!run({...base,kids:["Adult children"],guardian_abroad:"Yes"}).includes("guardian_abroad"),"guardian abroad: stale Yes without minors => none");
// Still to answer never includes hidden questions
const vis=F.visible(flow,F.effective(flow,{married:"Single",kids:["No children"]})).map(q=>q.id);
["spouse_name","spouse_citizenship","guardian","guardian_abroad","trustee","kid_names"].forEach(x=>ok(!vis.includes(x),"hidden when single/no kids: "+x));
ok(F.visible(flow,{married:"Married"}).some(q=>q.id==="spouse_citizenship"),"spouse status shown when married");
// Migration from v3 couple question
const m1=F.migrate({citizenship:"Visa holder living in U.S.",couple_citizenship:"Both spouses non-citizens",married:"Married"});
ok(m1.changed&&!("couple_citizenship" in m1.answers)&&!m1.answers.spouse_citizenship,"migrate: both non-citizens drops couple, asks spouse status");
ok(F.migrate({couple_citizenship:"Both U.S. citizens"}).answers.spouse_citizenship==="U.S. citizen","migrate: both citizens fills spouse");
ok(F.migrate({citizenship:"Green card holder",couple_citizenship:"One U.S. citizen, one non-citizen"}).answers.spouse_citizenship==="U.S. citizen","migrate: mixed + me non-citizen => spouse citizen");
ok(!F.migrate({citizenship:"U.S. citizen",couple_citizenship:"One U.S. citizen, one non-citizen"}).answers.spouse_citizenship,"migrate: mixed + me citizen => spouse left to ask");
ok(F.migrate({citizenship:"U.S. citizen",spouse_citizenship:"Green card holder",couple_citizenship:"Both U.S. citizens"}).answers.spouse_citizenship==="Green card holder","migrate: never overwrites explicit spouse answer");
ok(!F.migrate({a:1}).changed,"migrate: no-op for new answers");
