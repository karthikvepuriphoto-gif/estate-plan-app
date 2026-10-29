import json
U="unverified"
# code,name,slug,majority,holo,cp,tod,self_proving,statPOA,AD form name,small estate
H=set("AK AZ AR CA CO HI ID KY LA ME MI MS MT NE NV NJ ND OK PA SD TN TX UT VA WV WY".split())
CP=set("AZ CA ID LA NV NM TX WA WI".split()); OPT=set("AK TN SD KY FL".split())
TODY=set("AK AZ AR CA CO DC HI IL IN IA KS ME MN MS MO MT NE NV NM NY ND OH OK OR SD TX UT VT VA WA WV WI WY DE".split())
TODN=set("CT FL GA LA MA NH NJ NC PA SC".split())
UPOAA=set("AL AR CO DC HI ID IA KY ME MD MI MN MS MT NE NV NM ND OH PA SC TX UT VA WA WV WI WY".split())
UPC=set("AK AZ CO HI ID ME MI MN MT NE NM ND SC SD UT".split())
TAX={"CT":"Estate tax; exemption $15,000,000 (2026)","HI":"Estate tax; exemption $5,490,000","IL":"Estate tax; exemption $4,000,000","ME":"Estate tax; exemption $7,160,000 (2026)","MD":"Estate tax $5,000,000 exemption AND inheritance tax (exempt close relatives)","MA":"Estate tax; exemption $2,000,000","MN":"Estate tax; exemption $3,000,000","NY":"Estate tax; exemption $7,350,000 (2026) with cliff at 105%","OR":"Estate tax; exemption $1,000,000","RI":"Estate tax; exemption $1,838,056 (2026)","VT":"Estate tax; exemption $5,000,000","WA":"Estate tax; exemption $3,076,000 (to 6/30/2026), $3,000,000 from 7/1/2026","DC":"Estate tax; exemption $4,988,400 (2026)","KY":"Inheritance tax; spouse/children exempt (Class A)","NE":"Inheritance tax; spouse exempt; children/close relatives $100,000 each, 1%","NJ":"Inheritance tax; spouse/children exempt (Class A)","PA":"Inheritance tax; spouse 0%, children 4.5%, no exemption"}
SMALL={"CA":"$208,850 (affidavit, deaths on/after 4/1/2025)","NE":"$100,000 (affidavit)","TX":"$75,000 (small estate affidavit)","NY":"$50,000 (voluntary administration)","FL":"$75,000 (summary administration)"}
AD={"CA":"Advance Health Care Directive (Probate Code 4701)","TX":"Directive to Physicians and Family or Surrogates + Medical Power of Attorney","NY":"Health Care Proxy + Living Will","FL":"Living Will + Designation of Health Care Surrogate","NE":"Declaration (Rights of the Terminally Ill Act) + Power of Attorney for Health Care","IL":"Statutory Short Form Power of Attorney for Health Care + Living Will Declaration"}
S=[("AL","Alabama","alabama",19),("AK","Alaska","alaska",18),("AZ","Arizona","arizona",18),("AR","Arkansas","arkansas",18),("CA","California","california",18),("CO","Colorado","colorado",18),("CT","Connecticut","connecticut",18),("DE","Delaware","delaware",18),("DC","District of Columbia","district-of-columbia",18),("FL","Florida","florida",18),("GA","Georgia","georgia",18),("HI","Hawaii","hawaii",18),("ID","Idaho","idaho",18),("IL","Illinois","illinois",18),("IN","Indiana","indiana",18),("IA","Iowa","iowa",18),("KS","Kansas","kansas",18),("KY","Kentucky","kentucky",18),("LA","Louisiana","louisiana",18),("ME","Maine","maine",18),("MD","Maryland","maryland",18),("MA","Massachusetts","massachusetts",18),("MI","Michigan","michigan",18),("MN","Minnesota","minnesota",18),("MS","Mississippi","mississippi",21),("MO","Missouri","missouri",18),("MT","Montana","montana",18),("NE","Nebraska","nebraska",19),("NV","Nevada","nevada",18),("NH","New Hampshire","new-hampshire",18),("NJ","New Jersey","new-jersey",18),("NM","New Mexico","new-mexico",18),("NY","New York","new-york",18),("NC","North Carolina","north-carolina",18),("ND","North Dakota","north-dakota",18),("OH","Ohio","ohio",18),("OK","Oklahoma","oklahoma",18),("OR","Oregon","oregon",18),("PA","Pennsylvania","pennsylvania",18),("RI","Rhode Island","rhode-island",18),("SC","South Carolina","south-carolina",18),("SD","South Dakota","south-dakota",18),("TN","Tennessee","tennessee",18),("TX","Texas","texas",18),("UT","Utah","utah",18),("VT","Vermont","vermont",18),("VA","Virginia","virginia",18),("WA","Washington","washington",18),("WV","West Virginia","west-virginia",18),("WI","Wisconsin","wisconsin",18),("WY","Wyoming","wyoming",18)]
out={}
for c,n,slug,maj in S:
  notes=[]
  w="2"
  if c=="LA": w="2 + notary (notarial testament)"; notes.append("Louisiana uses civil law; forced heirship protects children under 24 or disabled children.")
  if c=="CO": notes.append("Colorado also allows a notary acknowledgment instead of two witnesses.")
  if c=="ND": notes.append("North Dakota also allows notary acknowledgment instead of witnesses.")
  if c=="VT": notes.append("Vermont reduced its witness requirement from 3 to 2 in 2006.")
  sp="yes" if c not in ("OH","VT","MD","DC","WI","LA") else U
  if c=="LA": sp="n/a – notarial testament is self-proved"
  tod="yes" if c in TODY else ("no" if c in TODN else U)
  if c=="FL": notes.append("Florida has no TOD deed statute but recognizes enhanced life estate ('Lady Bird') deeds.")
  cp="community property" if c in CP else "common law"+(" (opt-in community property trust available)" if c in OPT else "")
  if c=="WI": cp="community property (marital property act)"
  if c in CP: es="Community property: surviving spouse already owns half of community assets; no elective share"
  elif c=="GA": es="No elective share; spouse may claim 12 months' support"
  elif c in UPC: es="UPC-style augmented-estate elective share (up to 50%, scaled by length of marriage)"
  else: es=U
  out[c]={"code":c,"name":n,"will_witnesses":w,"self_proving_affidavit":sp,"holographic_will_valid":"yes" if c in H else ("military only" if c=="NY" else ("conditional (found among valuables)" if c=="NC" else "no")),"age_of_majority":maj,"property_system":cp,"elective_share":es,"state_estate_or_inheritance_tax":TAX.get(c,"none"),"statutory_poa_form":"yes (Uniform Power of Attorney Act)" if c in UPOAA else U,"advance_directive_form":AD.get(c,U),"tod_deed_allowed":tod,"small_estate_limit":SMALL.get(c,U),"notes":" ".join(notes),"sources":[f"https://law.justia.com/codes/{slug}/","https://taxfoundation.org/data/all/state/estate-inheritance-taxes/","https://www.uniformlaws.org/committees/community-home?CommunityKey=b1975254-8370-4a7c-947f-e5af0d6cb07c"]}
meta={"as_of":"2026-10-29","legend":"'unverified' = not confirmed against a primary source in this build; confirm with a local attorney.","primary_tax_source":"Tax Foundation, Estate and Inheritance Taxes by State 2026 (rates as of Oct 1, 2026)"}
json.dump({"_meta":meta,"states":out},open("data/states.json","w"),indent=1)
full=[c for c,v in out.items() if U not in json.dumps(v)]
print(len(out),"full:",len(full),full)
