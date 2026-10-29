import asyncio
from playwright.async_api import async_playwright
U="http://localhost:8124/index.html?mode="
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome")
    for scheme,(n,w,h) in [("light",("phone",390,844)),("dark",("desktop",1440,900)),("light",("tablet",820,1180))]:
      for mode in ["ok","docfail"]:
        c=await b.new_context(viewport={"width":w,"height":h},color_scheme=scheme);pg=await c.new_page();errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(U+mode);await pg.wait_for_selector("#go")
        await pg.click("#go");await pg.fill("#t","Karthik");await pg.keyboard.press("Enter");await pg.wait_for_selector("select#t");await pg.select_option("#t","NE");await pg.click("#next")
        await pg.click("text=Married");await pg.wait_for_selector("input#t");await pg.fill("#t","Navya");await pg.click("#next")
        await pg.click("#homeBtn");await pg.wait_for_timeout(300);await pg.click("#docs");await pg.wait_for_selector("#gd")
        await pg.wait_for_timeout(500);todo=await pg.locator(".link-row").count();tops=await pg.evaluate("[...document.querySelectorAll('#docActions .btn')].map(b=>Math.round(b.getBoundingClientRect().top))")
        if mode=="ok":await pg.screenshot(path=f"/workspace/epa/shots/v3-{scheme}-{n}-drafts.png")
        await pg.click("#gd");await pg.wait_for_timeout(200);busy=await pg.locator("#gd").inner_text();dis=await pg.locator("#gd").is_disabled()
        if mode=="ok" and n=="phone":await pg.locator("#gd").scroll_into_view_if_needed();await pg.screenshot(path=f"/workspace/epa/shots/v3-saving.png")
        await pg.wait_for_selector("#toast.on");tt=await pg.locator("#toast").inner_text();href=await pg.locator("#toast a").get_attribute("href") if await pg.locator("#toast a").count() else None
        if n=="phone":await pg.screenshot(path=f"/workspace/epa/shots/v3-toast-{mode}.png")
        after=await pg.locator("#gd").inner_text()
        # still-to-answer link
        await pg.locator(".link-row").first.click();await pg.wait_for_selector(".q");jq=await pg.locator(".q").inner_text()
        print(scheme,n,mode,"| todo:",todo,"| button rows:",sorted(set(tops)),"| busy:",busy.strip(),dis,"| toast:",tt.replace("\n"," "),href,"| after:",after.strip(),"| jumped to:",jq,"| errs:",errs)
        if mode=="ok" and n=="phone":
          await pg.click("#homeBtn");await pg.wait_for_timeout(300);await pg.click("#clear");await pg.wait_for_selector(".dialog");await pg.wait_for_timeout(500);await pg.screenshot(path="/workspace/epa/shots/v3-clear-confirm.png")
          await pg.click("#dc");kept=await pg.evaluate("JSON.stringify(window.db)")
          await pg.click("#clear");await pg.click("#dok");await pg.wait_for_timeout(400);cleared=await pg.evaluate("JSON.stringify(window.db)")
          print("  cancel kept:",kept,"| confirm cleared:",cleared,"| clear btn disabled now:",await pg.locator("#clear").is_disabled())
        await c.close()
    await b.close()
asyncio.run(main())
