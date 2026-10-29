import asyncio,sys
from playwright.async_api import async_playwright
URL=sys.argv[1] if len(sys.argv)>1 else "http://localhost:8123/"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path="/usr/bin/google-chrome")
    for scheme in["light","dark"]:
     for n,w,h in[("phone",390,844),("tablet",820,1180),("desktop",1440,900)]:
      c=await b.new_context(viewport={"width":w,"height":h},color_scheme=scheme,reduced_motion="reduce");pg=await c.new_page();errs=[]
      pg.on("console",lambda m:m.type=="error" and errs.append(m.text));pg.on("pageerror",lambda e:errs.append(str(e)))
      await pg.goto(URL);await pg.wait_for_selector("#go");await pg.screenshot(path=f"shots/{scheme}-{n}-home.png")
      await pg.click("#go");await pg.fill("#t","Karthik Vepuri");await pg.keyboard.press("Enter")
      await pg.select_option("#t","NE");await pg.click("#next");await pg.keyboard.press("1")
      await pg.wait_for_timeout(300);await pg.fill("#t","Navya Vepuri");await pg.click("#next")
      await pg.click("text=Minor children");await pg.screenshot(path=f"shots/{scheme}-{n}-question.png")
      await pg.click("#next");await pg.fill("#t","Myra, Nivaan");await pg.click("#next")
      await pg.keyboard.press("3");await pg.wait_for_timeout(300);await pg.keyboard.press("3");await pg.wait_for_timeout(300);await pg.keyboard.press("1");await pg.wait_for_timeout(300)
      await pg.click("text=Home");await pg.click("text=Foreign property or accounts");await pg.click("#next");await pg.fill("#t","India - flat in Hyderabad");await pg.click("#next")
      await pg.goto(URL);await pg.click("#docs");await pg.wait_for_selector(".doc");await pg.screenshot(path=f"shots/{scheme}-{n}-drafts.png",full_page=False)
      ov=await pg.evaluate("document.documentElement.scrollWidth>innerWidth")
      print(scheme,n,"errors:",errs,"overflow:",ov,"docs:",await pg.locator(".doc").count())
      await c.close()
    await b.close()
asyncio.run(main())
