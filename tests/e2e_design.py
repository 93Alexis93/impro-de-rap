# Tests Playwright design épuré + accessibilité (30/10/2026). Lancer : python3 -m http.server 8765 & puis python3 tests/e2e_design.py
from playwright.sync_api import sync_playwright
URL="http://localhost:8765/index.html"
ok=0;ko=0
def check(nom,cond,info=""):
    global ok,ko
    if cond: ok+=1;print("PASS",nom,info)
    else: ko+=1;print("FAIL",nom,info)
# Boutons visibles de moins de 44 px de haut (cibles tactiles trop petites) ; pour une case dans un libellé, c'est le libellé entier qu'on touche
PETITS="""()=>[...document.querySelectorAll('button,select,summary,input:not([type=hidden]):not([type=range])')].filter(e=>{const t=(e.type==='checkbox'||e.type==='radio')&&e.closest('label')?e.closest('label'):e,r=t.getBoundingClientRect(),cs=getComputedStyle(e);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&r.height<43.5}).map(e=>(e.id||e.className||e.tagName)+':'+Math.round(e.getBoundingClientRect().height))"""
DEBORDE="()=>document.documentElement.scrollWidth>innerWidth+1"
with sync_playwright() as p:
    b=p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    for vp in [{"width":320,"height":568},{"width":375,"height":812},{"width":1280,"height":800}]:
        pg=b.new_page(viewport=vp);errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        pg.goto(URL);pg.wait_for_timeout(300);w=vp["width"]
        check(f"{w}px accueil : pas de défilement horizontal",not pg.evaluate(DEBORDE))
        check(f"{w}px accueil : cibles tactiles ≥ 44 px",not pg.evaluate(PETITS),pg.evaluate(PETITS))
        pg.click("#enterImpro");pg.wait_for_timeout(200)
        check(f"{w}px Impro : réglages repliés au départ",pg.evaluate("()=>$('setupGrid').hidden&&getComputedStyle($('setupGrid')).display==='none'&&$('customizeBtn').getAttribute('aria-expanded')==='false'"))
        check(f"{w}px Impro : pas de défilement horizontal",not pg.evaluate(DEBORDE))
        check(f"{w}px Impro : cibles tactiles ≥ 44 px",not pg.evaluate(PETITS),pg.evaluate(PETITS))
        pg.click("#customizeBtn");pg.wait_for_timeout(200)
        check(f"{w}px Impro : réglages dépliés au clic",pg.evaluate("()=>!$('setupGrid').hidden&&$('customizeBtn').getAttribute('aria-expanded')==='true'"))
        check(f"{w}px réglages : cibles tactiles ≥ 44 px",not pg.evaluate(PETITS),pg.evaluate(PETITS))
        check(f"{w}px réglages : pas de défilement horizontal",not pg.evaluate(DEBORDE))
        pg.click("#improHome");pg.click("#enterFreestyle");pg.wait_for_timeout(200)
        check(f"{w}px Freestyle : volets repliés, texte et lecture visibles",pg.evaluate("()=>[...document.querySelectorAll('#freestyle details')].every(d=>!d.open)&&$('freeText').offsetHeight>0&&$('freeScroll').offsetHeight>0&&$('freeStart').offsetHeight>0"))
        pg.evaluate("()=>document.querySelectorAll('#freestyle details').forEach(d=>d.open=true)");pg.wait_for_timeout(100)
        check(f"{w}px Freestyle : pas de défilement horizontal (volets ouverts)",not pg.evaluate(DEBORDE))
        check(f"{w}px Freestyle : cibles tactiles ≥ 44 px",not pg.evaluate(PETITS),pg.evaluate(PETITS))
        check(f"{w}px aucune erreur JS",not errs,errs)
        pg.close()
    pg=b.new_page(viewport={"width":375,"height":812});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(URL);pg.click("#enterImpro")
    # Bouton rapide « 10 mots »
    pg.click("#quickTen");pg.wait_for_timeout(600)
    st=pg.evaluate("()=>({card:document.querySelector('[data-session-mode=custom]').getAttribute('aria-pressed'),panel:!$('customModePanel').hidden,open:!$('setupGrid').hidden,focus:document.activeElement.id})")
    check("Bouton « 10 mots » : carte choisie, panneau affiché, curseur dans la liste",st=={"card":"true","panel":True,"open":True,"focus":"customWordsInput"},st)
    pg.fill("#customWordsInput","Mirage, Béton, Amour, Tempête, Métro, Dragon, Liberté, Miroir, Secret, Victoire");pg.click("#startCustom");pg.wait_for_timeout(500)
    check("Mode 10 mots : la session démarre",pg.evaluate("()=>!$('gameView').hidden"))
    pg.click("#finishBtn");pg.wait_for_timeout(300);pg.click("#homeBtn");pg.wait_for_timeout(200)
    # Onglets : l'onglet actif est annoncé
    pg.click('[data-nav="beats"]');pg.wait_for_timeout(200)
    cur=pg.evaluate("()=>[...document.querySelectorAll('[data-nav]')].map(b=>b.getAttribute('aria-current'))")
    check("Onglet Instrus : aria-current suit le clic",cur==["false","true","false"],cur)
    pg.click('[data-nav="home"]');pg.wait_for_timeout(200)
    check("Onglet Jouer : aria-current revient",pg.evaluate("()=>document.querySelector('[data-nav=home]').getAttribute('aria-current')")=="true")
    # Interrupteurs : toujours de vraies cases à cocher, pilotables au clavier
    pg2=b.new_page(viewport={"width":375,"height":812});pg2.goto(URL);pg2.click("#enterImpro");pg2.click("#customizeBtn")
    before=pg2.evaluate("()=>$('zeroMode').checked");pg2.focus("#zeroMode");pg2.keyboard.press("Space")
    check("Interrupteur « zéro distraction » : basculé au clavier",pg2.evaluate("()=>$('zeroMode').checked")!=before)
    pg2.close()
    # Focus clavier visible
    pg.keyboard.press("Tab");out=pg.evaluate("()=>getComputedStyle(document.activeElement).outlineStyle")
    check("Focus clavier : contour visible",out=="solid",out)
    # Bilan : notation des mots juste sous son titre
    order=pg.evaluate("()=>{const r=$('wordRatings'),l=$('recordingsList');return !!(r.compareDocumentPosition(l)&Node.DOCUMENT_POSITION_FOLLOWING)}")
    check("Bilan : « mots à retravailler » avant « enregistrements »",order)
    # Freestyle en lecture plein écran : les volets disparaissent
    pg.click("#improHome");pg.click("#enterFreestyle");pg.fill("#freeText","Ligne un\nLigne deux\nLigne trois");pg.click("#freeStart");pg.wait_for_timeout(600)
    live=pg.evaluate("()=>({live:document.body.classList.contains('freestyle-live'),boxes:[...document.querySelectorAll('#freestyle>.box')].some(e=>e.offsetHeight>0),titre:document.querySelector('.free-read-title').offsetHeight,scroll:$('freeScroll').offsetHeight})")
    check("Freestyle en lecture : volets et titres masqués, texte plein écran",live["live"] and not live["boxes"] and live["titre"]==0 and live["scroll"]>300,live)
    pg.click("#freeStop");pg.wait_for_timeout(200)
    check("Aucune erreur JS (parcours)",not errs,errs)
    b.close()
print(f"\n{ok}/{ok+ko} OK");exit(1 if ko else 0)
