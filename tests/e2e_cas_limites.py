# Tests Playwright (29/10/2026). Lancer depuis la racine : python3 -m http.server 8765 & puis python3 tests/e2e_cas_limites.py
import sys
from playwright.sync_api import sync_playwright
import tempfile;SP=tempfile.gettempdir()+"/"
res=[]
def ok(c,m):res.append(bool(c));print(("PASS " if c else "FAIL ")+m)
text="\n".join("Ligne numéro %d qui défile doucement"%i for i in range(1,30))
with sync_playwright() as p:
    b=p.chromium.launch(args=["--use-fake-ui-for-media-stream","--use-fake-device-for-media-stream","--autoplay-policy=no-user-gesture-required"])
    # A. sans instru, vitesse libre
    ctx=b.new_context(viewport={"width":375,"height":812},permissions=["microphone"]);pg=ctx.new_page();errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto("http://localhost:8765/index.html");pg.click("#enterFreestyle")
    pg.fill("#freeText",text);pg.select_option("#freeBeat","none");pg.fill("#freeSpeed","120");pg.dispatch_event("#freeSpeed","input");pg.check("#freeRecOn")
    pg.click("#freeStart");pg.wait_for_timeout(3500);pg.click("#freeStop");pg.wait_for_timeout(1200)
    t=pg.evaluate("async()=>{const t=(await getFreeTakes())[0];return t&&{n:t.timeline.length,size:t.blob.size,tempo:t.tempo,rmax:Math.max(...t.timeline.map(e=>e.r))}}")
    ok(t and t["size"]>1000 and not t["tempo"] and t["rmax"]>0.05,"Sans instru, vitesse libre : prise avec défilement enregistré %s"%t)
    pg.click("#freeTakes .recording-item button:has-text('Réécouter')");pg.wait_for_timeout(2500)
    ok(pg.evaluate("()=>$('freeReplayText').scrollTop")>20,"Réécoute : le texte défile avec la voix")
    pg.screenshot(path=SP+"replay.png",full_page=False)
    pg.evaluate("()=>{$('freeReplayClose').click();scrollTo(0,0)}")
    # suppression
    pg.on("dialog",lambda d:d.accept())
    pg.click("#freeTakes .recording-item button:has-text('🗑')");pg.wait_for_timeout(500)
    ok(pg.locator("#freeTakes .recording-item").count()==0,"Suppression d'une prise")
    # sans enregistrement : comportement d'avant
    pg.uncheck("#freeRecOn");pg.select_option("#freeBeat","virtual-oriental");pg.click("#freeStart");pg.wait_for_timeout(1500)
    ok(pg.evaluate("()=>freeRec===null&&freeSynth&&freeBeatIndex>1"),"Sans case cochée : instru Oriental, pas d'enregistrement")
    pg.click("#freeStop")
    pg.evaluate("()=>{document.body.classList.remove('freestyle-live');$('freeLiveTop').classList.add('hide')}")
    pg.fill("#freeText","Je pose mes mots sur le béton\n");pg.evaluate("()=>{const t=$('freeText');t.focus();t.setSelectionRange(3,3)}");pg.dispatch_event("#freeText","click")
    pg.wait_for_function("()=>$('freeRhymeChips').childElementCount>0",timeout=30000)
    pg.evaluate("()=>scrollTo(0,0)");pg.screenshot(path=SP+"rimes.png")
    ok(not errs,"Aucune erreur JS (A) "+str(errs))
    ctx.close()
    # B. micro refusé
    ctx=b.new_context(viewport={"width":375,"height":812});pg=ctx.new_page();errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto("http://localhost:8765/index.html");pg.evaluate("()=>{navigator.mediaDevices.getUserMedia=()=>Promise.reject(new DOMException('no','NotAllowedError'))}")
    pg.click("#enterFreestyle");pg.fill("#freeText",text);pg.select_option("#freeBeat","virtual-boom");pg.check("#freeRecOn")
    pg.click("#freeStart");pg.wait_for_timeout(1200)
    ok(pg.evaluate("()=>freeScrolling&&freeRec===null"),"Micro refusé : le défilement part quand même, sans enregistrement")
    pg.click("#freeStop");ok(not errs,"Aucune erreur JS (B) "+str(errs))
    # C. réglages Impro avec battle (capture)
    pg.click("#freeHome");pg.click("#enterImpro");pg.click("#quickBattle");pg.wait_for_timeout(600)
    pg.screenshot(path=SP+"battle-reglages.png")
    pg.fill("#bpm","160");pg.click("#launch");pg.wait_for_timeout(8000);pg.screenshot(path=SP+"battle-scene.png")
    b.close()
sys.exit(0 if all(res) else 1)
