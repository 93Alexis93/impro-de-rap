# Tests Playwright son + mots (30/10/2026) : instru plus forte, mots qui ne restent plus bloqués, micro réglé pour la musique.
# Lancer : python3 -m http.server 8765 & puis python3 tests/e2e_son.py
from playwright.sync_api import sync_playwright
URL="http://localhost:8765/index.html"
ok=0;ko=0
def check(nom,cond,info=""):
    global ok,ko
    if cond: ok+=1;print("PASS",nom,info)
    else: ko+=1;print("FAIL",nom,info)
# Rendu hors ligne de 8 mesures de chaque instru à travers la chaîne de sortie : niveau crête et niveau moyen (dB)
LOUD="""async ()=>{const out={};for(const k of Object.keys(VB_STYLES)){const st=VB_STYLES[k],bpm=st.bpm,dur=8*4*60/bpm+1;
const C=new OfflineAudioContext(1,Math.ceil(44100*dur),44100);const m=vbBuildMaster(C);m.output.connect(C.destination);
vbCtx=C;vbOut=m.input;vbRoot=null;for(let s=0;s<32;s++)vbPattern(st,bpm,.05+s*60/bpm,s);
const d=(await C.startRendering()).getChannelData(0);let pk=0,sq=0;for(const x of d){const a=Math.abs(x);if(a>pk)pk=a;sq+=x*x}
out[k]=[+(20*Math.log10(pk)).toFixed(1),+(10*Math.log10(sq/d.length)).toFixed(1)]}vbCtx=null;vbOut=null;return out}"""
# Compte les temps d'instru programmés
SPY="()=>{window.__beats=0;const f=playVirtualBeat;playVirtualBeat=function(){window.__beats++;return f.apply(this,arguments)}}"
def session(b):
    pg=b.new_page(viewport={"width":375,"height":812});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(URL);pg.click("#enterImpro");pg.click("#customizeBtn");pg.fill("#bpm","160");pg.select_option("#bars","1")
    return pg,errs
def mots(pg,n,ms=500):
    seen=[]
    for _ in range(n):
        pg.wait_for_timeout(ms);w=pg.evaluate("()=>current")
        if not seen or seen[-1]!=w: seen.append(w)
    return seen
with sync_playwright() as p:
    b=p.chromium.launch(args=["--use-fake-ui-for-media-stream","--use-fake-device-for-media-stream","--autoplay-policy=no-user-gesture-required"])
    pg,errs=session(b)
    for k,(pk,rms) in pg.evaluate(LOUD).items():
        check(f"Instru {k} : plus forte (moyenne ≥ -14,5 dB) sans saturer (crête ≤ -0,5 dB)",rms>=-14.5 and pk<=-.5,f"crête {pk} dB, moyenne {rms} dB (avant : ≈ -17 à -21 dB)")
    # 1) Coupure du son par le téléphone, qui refuse de le relancer
    pg.evaluate(SPY);pg.click("#launch");pg.wait_for_function("()=>barIndex>=7",timeout=20000)
    pg.evaluate("()=>{window.__resume=audioCtx.resume.bind(audioCtx);audioCtx.resume=()=>Promise.reject(new Error('interrompu'));audioCtx.suspend()}")
    pg.wait_for_timeout(300);b0=pg.evaluate("()=>window.__beats")
    seen=mots(pg,12)
    check("Son coupé et bloqué : les mots continuent d'arriver (plus de mot figé)",len(seen)>=4,seen)
    check("Son coupé : aucun son empilé pendant la coupure",pg.evaluate("()=>window.__beats")==b0)
    # 2) Le son revient (toucher l'écran) : l'instru repart sans rafale de sons en retard
    pg.evaluate("()=>{audioCtx.resume=window.__resume}");pg.mouse.click(187,330);pg.wait_for_timeout(150)
    b1=pg.evaluate("()=>window.__beats");pg.wait_for_timeout(1500);b2=pg.evaluate("()=>window.__beats")
    check("Toucher l'écran relance le son",pg.evaluate("()=>audioCtx.state")=="running")
    check("L'instru repart au tempo, sans rafale",1<=b2-b1<=7 and b1-b0<=3,f"{b1-b0} temps à la reprise, {b2-b1} temps en 1,5 s (160 BPM ≈ 4)")
    check("Les mots continuent après la reprise",len(mots(pg,6))>=2)
    # 3) Pause / reprise : toujours correct
    pg.click("#pauseBtn");pg.wait_for_timeout(600);w=pg.evaluate("()=>current");pg.wait_for_timeout(1200)
    check("Pause : le mot ne change pas",pg.evaluate("()=>current")==w)
    pg.click("#pauseBtn");check("Reprise : les mots repartent",len(mots(pg,8))>=2)
    pg.click("#finishBtn");check("Aucune erreur JS (coupure)",not errs,errs);pg.close()
    # 4) Le son ne démarre jamais (téléphone qui bloque l'audio) : la session tourne quand même
    pg,errs=session(b)
    pg.evaluate("()=>{const C=window.AudioContext;window.AudioContext=function(){const c=new C();c.resume=()=>Promise.reject(new Error('bloqué'));c.suspend();return c}}")
    pg.click("#launch");pg.wait_for_timeout(3500)
    seen=mots(pg,10)
    check("Son bloqué dès le départ : l'intro passe et les mots défilent",pg.evaluate("()=>audioCtx.state")!="running" and len(seen)>=3,seen)
    pg.click("#finishBtn");check("Aucune erreur JS (son bloqué)",not errs,errs);pg.close()
    # 5) Micro réglé pour la musique (Impro et Freestyle)
    ctx=b.new_context(permissions=["microphone"],viewport={"width":375,"height":812});pg=ctx.new_page();errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(URL);pg.evaluate("()=>{window.__c=[];const g=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=c=>{window.__c.push(c);return g(c)}}")
    pg.click("#enterImpro");pg.click("#quickWarm");pg.wait_for_timeout(1500);pg.click("#recordBtn");pg.wait_for_timeout(1500);pg.click("#stopRecordBtn");pg.wait_for_timeout(800);pg.click("#finishBtn");pg.wait_for_timeout(300)
    pg.click("#homeBtn");pg.click("#improHome");pg.click("#enterFreestyle")
    pg.evaluate("()=>document.querySelectorAll('#freestyle details').forEach(d=>d.open=true)")
    pg.fill("#freeText","Ligne un\nLigne deux\nLigne trois");pg.select_option("#freeBeat","virtual-boom");pg.check("#freeRecOn");pg.click("#freeStart");pg.wait_for_timeout(2500)
    mix=pg.evaluate("()=>freeRec&&({voice:FREE_REC_VOICE,beat:FREE_REC_BEAT,delay:+freeRec.beatIn.delayTime.value.toFixed(3),nodes:freeRec.nodes.length})")
    pg.click("#freeStop");pg.wait_for_timeout(1500)
    cs=pg.evaluate("()=>window.__c")
    music=lambda c:isinstance(c.get("audio"),dict) and c["audio"].get("echoCancellation") is False and c["audio"].get("noiseSuppression") is False and c["audio"].get("autoGainControl") is False
    check("Micro Impro et Freestyle : sans annulation d'écho, réduction de bruit ni gain auto",len(cs)==2 and all(music(c) for c in cs),cs)
    check("Prise Freestyle : voix renforcée, instru plus basse et recalée",bool(mix) and mix["voice"]>1 and mix["beat"]<1 and .02<=mix["delay"]<=.3,mix)
    check("Prise Freestyle sauvegardée",pg.evaluate("()=>document.querySelectorAll('#freeTakes .recording-item').length")>=1)
    check("Aucune erreur JS (micro)",not errs,errs)
    b.close()
print(f"\n{ok}/{ok+ko} OK");exit(1 if ko else 0)
