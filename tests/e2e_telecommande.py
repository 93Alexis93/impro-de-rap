# Tests Playwright « télécommande des écouteurs » (13/11/2026) : boutons des écouteurs (Media Session) + mot sur l'écran verrouillé.
# Lancer : python3 -m http.server 8765 & puis python3 tests/e2e_telecommande.py
from playwright.sync_api import sync_playwright
URL="http://localhost:8765/index.html"
ok=0;ko=0
def check(nom,cond,info=""):
    global ok,ko
    if cond: ok+=1;print("PASS",nom,info)
    else: ko+=1;print("FAIL",nom,info)
# Espion : on garde les gestionnaires enregistrés, comme les boutons des écouteurs les appelleraient
SPY="()=>{window.__h={};const f=navigator.mediaSession.setActionHandler.bind(navigator.mediaSession);navigator.mediaSession.setActionHandler=(k,h)=>{__h[k]=h;try{f(k,h)}catch{}}}"
def start(b,on,custom=False):
    pg=b.new_page(viewport={"width":375,"height":812});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(URL);pg.click("#enterImpro");pg.click("#customizeBtn");pg.evaluate("()=>document.querySelectorAll('#setupGrid details').forEach(d=>d.open=true)")
    if on: pg.check("#remoteOn")
    pg.fill("#bpm","160");pg.select_option("#bars","1");pg.evaluate(SPY)
    return pg,errs
with sync_playwright() as p:
    b=p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    pg,errs=start(b,True)
    pg.click("#launch");pg.wait_for_function("()=>barIndex>=6&&current",timeout=30000)
    st=pg.evaluate("()=>({audio:!!$('remoteAudio')&&!$('remoteAudio').paused,keys:Object.keys(__h).sort(),title:navigator.mediaSession.metadata?.title,cur:current,state:navigator.mediaSession.playbackState})")
    check("Son silencieux en lecture (nécessaire sur iPhone)",st["audio"],st)
    check("Boutons des écouteurs branchés",all(k in st["keys"] for k in ["nexttrack","pause","play","previoustrack"]),st["keys"])
    check("Écran verrouillé : le titre est le mot affiché",st["title"]==st["cur"] and st["state"]=="playing",st)
    w=pg.evaluate("()=>current");pg.evaluate("()=>__h.nexttrack()")
    check("2 appuis : mot suivant",pg.evaluate("()=>current")!=w and pg.evaluate("()=>navigator.mediaSession.metadata.title")==pg.evaluate("()=>current"))
    pg.evaluate("()=>__h.previoustrack()");w=pg.evaluate("()=>current");b0=pg.evaluate("()=>barIndex")
    pg.wait_for_function(f"()=>barIndex>={b0+3}",timeout=10000)
    check("3 appuis : le mot est gardé plusieurs mesures",pg.evaluate("()=>current")==w,(w,pg.evaluate("()=>current")))
    pg.wait_for_function(f"()=>barIndex>={b0+6}",timeout=10000)
    check("… puis les mots repartent",pg.evaluate("()=>current")!=w)
    pg.evaluate("()=>__h.pause()");pg.wait_for_timeout(300)
    check("1 appui : pause (son silencieux arrêté)",not pg.evaluate("()=>running") and pg.evaluate("()=>$('remoteAudio').paused") and pg.evaluate("()=>navigator.mediaSession.playbackState")=="paused")
    pg.evaluate("()=>__h.play()");pg.wait_for_timeout(300)
    check("1 appui : reprise",pg.evaluate("()=>running") and not pg.evaluate("()=>$('remoteAudio').paused"))
    w=pg.evaluate("()=>current");pg.evaluate("()=>__h.previoustrack()");pg.click("#nextGameWord")
    check("« Mot suivant » à l'écran passe même un mot gardé",pg.evaluate("()=>current")!=w)
    pg.click("#finishBtn");pg.wait_for_timeout(300)
    check("Fin : boutons débranchés, son silencieux arrêté",pg.evaluate("()=>$('remoteAudio').paused&&__h.nexttrack===null&&navigator.mediaSession.metadata===null"))
    check("Mémorisé pour la prochaine fois",pg.evaluate("()=>localStorage.getItem('improRapRemote')")=="on")
    check("Aucune erreur JS",not errs,errs);pg.close()
    pg,errs=start(b,False);pg.click("#launch");pg.wait_for_function("()=>barIndex>=6",timeout=30000)
    check("Désactivé (par défaut) : rien ne change",not pg.evaluate("()=>!!$('remoteAudio')") and pg.evaluate("()=>Object.keys(__h).length")==0)
    pg.click("#finishBtn");check("Aucune erreur JS (désactivé)",not errs,errs)
    b.close()
print(f"\n{ok}/{ok+ko} OK");exit(1 if ko else 0)
