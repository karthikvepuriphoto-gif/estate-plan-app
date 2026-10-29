// Branching engine: pure functions, no DOM, no storage. Shared by web + Apps Script.
(function(g){
function match(cond,a){return Object.entries(cond||{}).every(([k,v])=>{const x=a[k];const has=y=>Array.isArray(x)?x.includes(y):x===y;
 if(v&&v.not)return x!=null&&!has(v.not)&&!(Array.isArray(x)&&x.length===0);
 return Array.isArray(v)?v.some(has):has(v);});}
function visible(flow,a){return flow.questions.filter(q=>match(q.when,a));}
function has(a,k,v){const x=a[k];return Array.isArray(x)?x.includes(v):x===v;}
function documents(a){const d=["will","financial_poa","healthcare_directive","hipaa"];
 if(has(a,"kids","Minor children"))d.push("guardian_nomination");
 if(has(a,"kids","Minor children")||has(a,"kids","Child with special needs"))d.push("testamentary_trust");
 if(a.rlt==="Yes")d.push("living_trust");if(has(a,"assets","Pets"))d.push("pet_trust");return d;}
function flags(a,cit){const f=[],nc=x=>x&&x!=="U.S. citizen";
 if(a.married==="Married"&&nc(a.spouse_citizenship))f.push("noncitizen_spouse");
 if(nc(a.citizenship)&&a.citizenship==="Non-resident (live abroad)")f.push("nonresident_alien");else if(nc(a.citizenship))f.push("domiciliary");
 if(nc(a.citizenship)&&nc(a.spouse_citizenship))f.push("both_noncitizens");
 if(a.married==="Married"&&nc(a.citizenship)!==nc(a.spouse_citizenship))f.push("mixed");
 if(has(a,"assets","Foreign property or accounts")){f.push("foreign_wills_situs","fbar");if(/india/i.test(a.foreign_where||""))f.push("india");}
 if(a.guardian_abroad==="Yes")f.push("guardian_abroad");
 return cit?cit.cases.filter(c=>f.includes(c.id)):f;}
g.EstateFlow={match,visible,documents,flags};
if(typeof module!=="undefined")module.exports=g.EstateFlow;})(typeof window!=="undefined"?window:this);
