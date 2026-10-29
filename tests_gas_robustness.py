import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome")
    for mode in["ok","fail","hang","undef","garbage","srverr","savefail"]:
      c=await b.new_context(viewport={"width":390,"height":844});pg=await c.new_page();errs=[]
      pg.on("pageerror",lambda e:errs.append(str(e)))
      await pg.goto(f"http://localhost:8124/index.html?mode={mode}")
      await pg.wait_for_selector("#go",timeout=12000)
      who=await pg.locator("#who button").count();al=await pg.locator("[role=alert]").all_inner_texts()
      await pg.fill("#pname","Karthik");await pg.click("text=Save name");await pg.wait_for_timeout(400)
      names=await pg.locator("#who button").all_inner_texts()
      await pg.click("#go");await pg.fill("#t","Karthik V");await pg.keyboard.press("Enter");await pg.wait_for_timeout(500)
      q=await pg.locator(".q").inner_text();toast=await pg.locator("#toast").inner_text() if await pg.locator("#toast").count() else ""
      saved=await pg.evaluate("JSON.stringify(window.db)");print(mode,"| saved:",saved,"| who:",who,names,"| alert:",al,"| next q:",q,"| toast:",toast,"| errs:",errs)
      if mode=="fail":await pg.screenshot(path="/workspace/epa/shots/gas-load-failure.png")
      if mode=="ok":await pg.goto("http://localhost:8124/index.html?mode=ok");await pg.wait_for_selector("#go");await pg.screenshot(path="/workspace/epa/shots/gas-home-named.png")
      await c.close()
    await b.close()
asyncio.run(main())
