# Tests Playwright « annonce du mot » (13/11/2026) : scratch 2 temps avant chaque mot + voix du téléphone.
# Lancer : python3 -m http.server 8765 & puis python3 tests/e2e_annonce.py
from playwright.sync_api import sync_playwright
URL="http://localhost:8765/index.html"
ok=0;ko=0
def check(nom,cond,info=""):
    global ok,ko
    if cond: ok+=1;print("PASS",nom,info)
    else: ko+=1;print("FAIL",nom,info)
# Espions : voix (speak), scratch (avec le temps de la mesure), mots tirés
SPY="""()=>{window.__said=[];window.__scr=[];window.__words=[];window.__cancel=0;
speechSynthesis.speak=u=>{if(u.text.trim())__said.push(u.text)};const c=speechSynthesis.cancel.bind(speechSynthesis);speechSynthesis.cancel=()=>{__cancel++;c()};
const f=announceScratch;announceScratch=function(t){__scr.push({beat:beatIndex,bar:barIndex});return f.apply(this,arguments)};
const d=draw;draw=function(){const b=current;d.apply(this,arguments);if(current!==b)__words.push({w:current,bar:barIndex})}}"""
def start(b,mode,battle=False):
    pg=b.new_page(viewport={"width":375,"height":812});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(URL);pg.click("#enterImpro")
    if battle: pg.click("#quickBattle");pg.fill("#battleP1","Alexis");pg.fill("#battleP2","Léon")
    else: pg.click("#customizeBtn")
    pg.select_option("#announceMode",mode);pg.fill("#bpm","160");pg.select_option("#bars","1");pg.evaluate(SPY)
    return pg,errs
with sync_playwright() as p:
    b=p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    pg,errs=start(b,"voice")
    check("Réglage proposé avec « Aucune » par défaut",pg.evaluate("()=>[...$('announceMode').options].map(o=>o.value).join()")=="none,scratch,voice")
    pg.click("#launch");pg.wait_for_function("()=>__words.length>=4",timeout=30000);pg.wait_for_timeout(200)
    st=pg.evaluate("()=>({said:__said,words:__words,scr:__scr})")
    words=[w["w"] for w in st["words"]]
    check("Voix : chaque nouveau mot est prononcé",st["said"][:len(words)]==words,(st["said"],words))
    check("Scratch : toujours 2 temps avant la mesure suivante",len(st["scr"])>0 and all(s["beat"]%4==2 for s in st["scr"]),st["scr"][:5])
    wb={w["bar"] for w in st["words"]};sb={s["bar"]+1 for s in st["scr"]}
    check("Scratch : un par mot, juste avant lui (pas pendant l'intro)",wb<=sb|{max(sb,default=0)+1} and min(sb)>=5,(sorted(sb),sorted(wb)))
    check("Mémorisé pour la prochaine fois",pg.evaluate("()=>localStorage.getItem('improRapAnnounce')")=="voice")
    n=pg.evaluate("()=>__cancel");pg.click("#pauseBtn");check("Pause : la voix est coupée",pg.evaluate("()=>__cancel")>n)
    pg.click("#finishBtn");check("Aucune erreur JS (voix)",not errs,errs);pg.close()
    pg,errs=start(b,"scratch");pg.click("#launch");pg.wait_for_function("()=>__words.length>=3",timeout=30000)
    check("Scratch seul : pas de voix, mais des scratchs",pg.evaluate("()=>__said.length")==0 and pg.evaluate("()=>__scr.length")>=2)
    pg.click("#finishBtn");pg.close()
    pg,errs=start(b,"none");pg.click("#launch");pg.wait_for_function("()=>__words.length>=3",timeout=30000)
    check("Aucune : ni voix ni scratch (comportement d'avant)",pg.evaluate("()=>__said.length+__scr.length")==0)
    pg.click("#finishBtn");pg.close()
    pg,errs=start(b,"voice",battle=True);pg.click("#launch");pg.wait_for_function("()=>__words.length>=2",timeout=40000)
    said=pg.evaluate("()=>__said")
    check("Battle : la voix annonce le MC puis le mot",len(said)>=2 and said[0].startswith("Micro à Alexis") and said[1].startswith("Micro à Léon"),said)
    pg.click("#finishBtn");check("Aucune erreur JS (battle)",not errs,errs)
    b.close()
print(f"\n{ok}/{ok+ko} OK");exit(1 if ko else 0)
