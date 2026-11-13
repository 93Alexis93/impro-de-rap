# Tests Playwright plein écran Impro (29/10/2026). Lancer : python3 -m http.server 8765 & puis python3 tests/e2e_plein_ecran.py
from playwright.sync_api import sync_playwright
# Depuis le design du 30/10/2026, réglages Impro et volets Freestyle sont repliés : on les ouvre avant d'agir dessus.
OUVRIR="()=>{document.querySelectorAll('#freestyle details').forEach(d=>d.open=true);const g=document.getElementById('setupGrid');if(g&&g.hidden&&!document.getElementById('improApp').classList.contains('hide'))document.getElementById('customizeBtn').click()}"
import tempfile;SP=tempfile.gettempdir()+"/"
with sync_playwright() as p:
    b=p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    for name,vp in [("court",{"width":375,"height":667}),("portrait",{"width":390,"height":844}),("paysage",{"width":844,"height":390}),("petit",{"width":320,"height":568})]:
        pg=b.new_page(viewport=vp);errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        pg.goto("http://localhost:8765/index.html");pg.click("#enterImpro");pg.evaluate(OUVRIR);pg.fill("#bpm","160");pg.click("#launch")
        pg.wait_for_function("()=>!!rimeIndex",timeout=60000);pg.wait_for_function("()=>barIndex>=6",timeout=20000)
        pg.evaluate("()=>{const W=window.__W||'Gentrification';current=W;$('bigWord').textContent=W;$('bigWord').classList.remove('empty-word');renderRhymeHelper(W)}");pg.wait_for_timeout(300)
        info=pg.evaluate("""()=>{const r=e=>e.getBoundingClientRect();const w=$('bigWord'),stars=[...document.querySelectorAll('#rhymeOrbit .rhyme-star')];
          const ov=(a,b)=>!(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top);
          const vis=el=>{const x=r(el);return x.bottom<=innerHeight+1&&x.top>=-1};
          return {live:document.body.classList.contains('impro-live'),font:getComputedStyle(w).fontSize,wordFits:w.scrollWidth<=w.clientWidth+1,overlap:stars.some(s=>ov(r(s),r(w))),
          stars:stars.map(s=>s.textContent),controlsVisible:vis($('pauseBtn'))&&vis($('nextGameWord')),pageScroll:document.documentElement.scrollHeight>innerHeight+2&&getComputedStyle(document.body).overflow!=='hidden'}}""")
        print(name,info,"erreurs:",errs)
        pg.screenshot(path=SP+f"live-{name}.png")
        pg.click("#finishBtn");pg.wait_for_timeout(300);print("  après Terminer, plein écran retiré:",not pg.evaluate("()=>document.body.classList.contains('impro-live')"))
        pg.close()
    b.close()
# mot court + chevauchement word-meta / barre des temps
with sync_playwright() as p:
    b=p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    for name,vp in [("petit",{"width":320,"height":568}),("court",{"width":375,"height":667}),("portrait",{"width":390,"height":844})]:
        pg=b.new_page(viewport=vp);pg.goto("http://localhost:8765/index.html");pg.evaluate("()=>window.__W='Lune'");pg.click("#enterImpro");pg.evaluate(OUVRIR);pg.fill("#bpm","160");pg.click("#launch")
        pg.wait_for_function("()=>!!rimeIndex",timeout=60000);pg.wait_for_function("()=>barIndex>=6",timeout=20000)
        pg.evaluate("()=>{const W='Lune';current=W;$('bigWord').textContent=W;$('bigWord').classList.remove('empty-word');renderRhymeHelper(W)}");pg.wait_for_timeout(300)
        r=pg.evaluate("()=>{const a=$('wordMeta').getBoundingClientRect(),b=$('beatline').getBoundingClientRect(),z=$('rhymeOrbit').getBoundingClientRect();return {font:getComputedStyle($('bigWord')).fontSize,metaVisible:a.bottom<=b.top+1&&a.height>8, metaHauteur:Math.round(a.height)}}")
        print(name,"Lune",r);pg.screenshot(path=SP+f"lune-{name}.png");pg.close()
    b.close()
