import asyncio,json,urllib.parse
from playwright.async_api import async_playwright
seed={"Karthik":{"name":"Karthik","state":"NE","married":"Married","spouse_name":"Navya","citizenship":"Visa holder living in U.S.","couple_citizenship":"Both spouses non-citizens","kids":["Minor children"],"guardian_abroad":"No"}}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome");c=await b.new_context(viewport={"width":390,"height":844});pg=await c.new_page();errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.add_init_script('localStorage.setItem("epa.who","Karthik");localStorage.setItem("epa.people",JSON.stringify(["Karthik","Navya"]))')
    await pg.goto("http://localhost:8124/index.html?mode=ok&seed="+urllib.parse.quote(json.dumps(seed)));await pg.wait_for_selector("#go")
    clr=await pg.locator("#clear").is_visible();await pg.wait_for_timeout(300);db=await pg.evaluate("JSON.stringify(window.db)")
    await pg.screenshot(path="/workspace/epa/shots/v4-home-settings.png",full_page=True)
    await pg.click("#docs");await pg.wait_for_selector(".doc");await pg.wait_for_timeout(500)
    tags=await pg.locator(".tag").all_inner_texts();todo=await pg.locator(".link-row span").all_inner_texts()
    await pg.locator(".link-row",has_text="spouse").click();await pg.wait_for_selector(".q");q=await pg.locator(".q").inner_text();await pg.click("text=Green card holder");await pg.wait_for_timeout(600)
    await pg.click("#homeBtn");await pg.wait_for_timeout(300);await pg.click("#docs");await pg.wait_for_selector(".doc");await pg.wait_for_timeout(500)
    tags2=await pg.locator(".tag").all_inner_texts();todo2=await pg.locator(".link-row span").all_inner_texts();await pg.screenshot(path="/workspace/epa/shots/v4-drafts-both-noncitizens.png")
    print("clear visible:",clr,"\nmigrated db:",db,"\nbefore spouse answer tags:",tags,"\nstill to answer:",todo,"\njumped to:",q,"\nafter tags:",tags2,"\nstill to answer after:",todo2,"\nerrs:",errs)
asyncio.run(main())
