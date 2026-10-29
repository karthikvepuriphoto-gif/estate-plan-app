// Platform-neutral document templates. Each returns {title, sections:[{h,p:[...]}]}.
(function(g){const W="DRAFT – for attorney review, not legal advice";
const F=()=>g.EstateFlow||require("./flow.js");const v=(a,k,d)=>(a[k]||"").toString().trim()||d||"[________]";
function checklist(st){return ["Sign in front of "+st.will_witnesses+" adult witness(es) who are not beneficiaries.",
 st.self_proving_affidavit==="yes"?"Add a notarized self-proving affidavit so witnesses need not testify later.":"Self-proving affidavit availability: "+st.self_proving_affidavit+" – ask your attorney.",
 "Sign the financial power of attorney before a notary"+(String(st.statutory_poa_form).startsWith("yes")?" using "+st.name+"'s statutory form.":"."),
 "Advance directive form: "+st.advance_directive_form+".",
 "Update beneficiary designations on retirement accounts and life insurance to match this plan.",
 st.tod_deed_allowed==="yes"?"Consider a transfer-on-death deed for your home (allowed in "+st.name+").":"TOD deed: "+st.tod_deed_allowed+" in "+st.name+".",
 "Store originals safely and tell your executor where they are."];}
const T={
will:(a,st)=>({title:"Last Will and Testament of "+v(a,"name"),sections:[
 {h:"1. Declaration",p:["I, "+v(a,"name")+", a resident of "+st.name+", declare this my will and revoke prior wills, except any separate will covering only property outside the United States."]},
 {h:"2. Family",p:[a.married==="Married"?"I am married to "+v(a,"spouse_name")+".":"I am not married.","My children: "+v(a,"kid_names","none")+"."]},
 {h:"3. Executor",p:["I appoint "+v(a,"executor")+" as executor (personal representative), to serve without bond."]},
 {h:"4. Residue",p:["I give the rest of my estate: "+v(a,"residue")+". Any share for a beneficiary under "+(a.trust_age||st.age_of_majority)+" is held in the trust below."]},
 ...(F().noncitizenSpouse(a)?[{h:"5. Non-citizen spouse and QDOT",p:["Because my spouse is not a U.S. citizen, the unlimited marital deduction does not apply automatically to property passing to my spouse.","If my spouse is not a U.S. citizen at my death, my executor may place property passing to my spouse in a Qualified Domestic Trust (QDOT) under IRC §2056A with at least one U.S.-citizen or U.S.-corporate trustee."]}]:[]),
 ...(/india/i.test(a.foreign_where||"")?[{h:"6. Property in India",p:["This will does not dispose of my property located in India, which I intend to leave under a separate Indian will executed under the Indian Succession Act, 1925. Neither will revokes the other."]}]:[])]}),
testamentary_trust:a=>({title:"Testamentary Trust for Children",sections:[{h:"Trustee",p:[v(a,"trustee")]},{h:"Terms",p:["Income and principal for health, education, maintenance and support until age "+v(a,"trust_age","25")+".","For any child with special needs, a supplemental-needs trust that does not replace public benefits."]}]}),
living_trust:a=>({title:"Revocable Living Trust of "+v(a,"name"),sections:[{h:"Trustee",p:[v(a,"name")+" as initial trustee; successor: "+v(a,"executor")+"."]},{h:"Funding",p:["Retitle the home and non-retirement accounts into the trust; a pour-over will catches the rest."]}]}),
financial_poa:(a,st)=>({title:"Durable Financial Power of Attorney",sections:[{h:"Agent",p:[v(a,"poa_agent")]},{h:"Effect",p:["Durable: effective now and continues if I become incapacitated."+(String(st.statutory_poa_form).startsWith("yes")?" Prepare on "+st.name+"'s statutory form.":"")]}]}),
healthcare_directive:(a,st)=>({title:"Healthcare Power of Attorney & Advance Directive",sections:[{h:"Form",p:[st.advance_directive_form]},{h:"Agent",p:[v(a,"hc_agent")]},{h:"End-of-life",p:[v(a,"life_support")]},{h:"Organ donation",p:[v(a,"donor")]}]}),
hipaa:a=>({title:"HIPAA Authorization",sections:[{h:"Release",p:["I authorize my health providers to disclose my health information to "+v(a,"hc_agent")+" and "+v(a,"poa_agent")+"."]}]}),
guardian_nomination:a=>({title:"Nomination of Guardian for Minor Children",sections:[{h:"Guardian",p:[v(a,"guardian")]},...(a.guardian_abroad==="Yes"?[{h:"Note",p:["First-choice guardian lives abroad; a U.S.-resident alternate is named."]}]:[])]}),
pet_trust:a=>({title:"Pet Trust",sections:[{h:"Caretaker and funds",p:[v(a,"pet_caretaker")]}]})};
function build(a,st){return {watermark:W,checklist:checklist(st),docs:EstateFlowDocs(a).map(id=>Object.assign({id},T[id](a,st)))};}
function EstateFlowDocs(a){return (g.EstateFlow||require("./flow.js")).documents(a);}
g.EstateTemplates={build,W};if(typeof module!=="undefined")module.exports=g.EstateTemplates;})(typeof window!=="undefined"?window:this);
