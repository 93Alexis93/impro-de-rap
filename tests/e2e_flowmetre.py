# Tests Playwright « Flow-mètre » (13/11/2026) : analyse d'une prise fabriquée dont on connaît les trous, la densité et le placement.
# Lancer : python3 -m http.server 8765 & puis python3 tests/e2e_flowmetre.py
from playwright.sync_api import sync_playwright
URL="http://localhost:8765/index.html"
ok=0;ko=0
def check(nom,cond,info=""):
    global ok,ko
    if cond: ok+=1;print("PASS",nom,info)
    else: ko+=1;print("FAIL",nom,info)
# Prise de synthèse : 10 mesures à 90 BPM, des « syllabes » (bruit filtré 60 ms) sur les croches,
# mesures 4 et 5 muettes (trou de 2 mesures), un kick grave (instru captée par le micro) sur tous les temps.
MAKE="""async ({bpm,perBar,jitter})=>{const sr=22050,bar=240/bpm,dur=10*bar+.5,C=new OfflineAudioContext(1,Math.ceil(sr*dur),sr);
const nb=C.createBuffer(1,sr,sr),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
const syl=(t)=>{const s=C.createBufferSource(),f=C.createBiquadFilter(),g=C.createGain();s.buffer=nb;f.type='bandpass';f.frequency.value=1200;f.Q.value=1;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.6,t+.005);g.gain.setValueAtTime(.6,t+.05);g.gain.linearRampToValueAtTime(0,t+.06);s.connect(f);f.connect(g);g.connect(C.destination);s.start(t);s.stop(t+.07)};
const kick=(t)=>{const o=C.createOscillator(),g=C.createGain();o.frequency.value=55;g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g);g.connect(C.destination);o.start(t);o.stop(t+.3)};
for(let b=0;b<10;b++){for(let k=0;k<4;k++)kick(.25+b*bar+k*bar/4);if(b===4||b===5)continue;for(let k=0;k<perBar;k++)syl(.25+b*bar+k*bar/perBar+(jitter?(k%2?.11:0):0))}
const buf=await C.startRendering(),x=buf.getChannelData(0),n=x.length,ab=new ArrayBuffer(44+n*2),v=new DataView(ab),w=(o,t)=>[...t].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
for(let i=0;i<n;i++)v.setInt16(44+i*2,Math.max(-1,Math.min(1,x[i]))*32767,true);window.__take=new Blob([ab],{type:'audio/wav'});return n/sr}"""
with sync_playwright() as p:
    b=p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    pg=b.new_page(viewport={"width":375,"height":812});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(URL);pg.wait_for_timeout(300)
    pg.evaluate(MAKE,{"bpm":90,"perBar":8,"jitter":False})
    r=pg.evaluate("async()=>flowAnalyze(__take,90)")
    info={k:r[k] for k in ["tenue","gaps","density","placement","offset"]}
    check("Trou de 2 mesures retrouvé au bon endroit (± 1 mesure)",len(r["gaps"])==1 and r["gaps"][0]["bars"]==2 and abs(r["gaps"][0]["t"]-4*240/90)<=240/90+.3,info)
    check("Tenue : 8 mesures rappées sur 10 (≈ 80 %)",abs(r["tenue"]-80)<=10,info)
    check("Densité : ≈ 8 syllabes par mesure (± 15 %)",abs(r["density"]-8)<=1.2,info)
    check("Placement : syllabes sur la grille (≥ 85 %)",r["placement"] is not None and r["placement"]>=85,info)
    pg.evaluate(MAKE,{"bpm":90,"perBar":8,"jitter":True})
    r2=pg.evaluate("async()=>flowAnalyze(__take,90)")
    check("Placement : des syllabes décalées font baisser le score",r2["placement"] is not None and r2["placement"]<=r["placement"]-25,(r["placement"],r2["placement"]))
    r3=pg.evaluate("async()=>flowAnalyze(__take,0)")
    check("Sans tempo connu : tenue et densité, placement non affiché",r3["placement"] is None and not r3["empty"],{k:r3[k] for k in ["tenue","density","placement"]})
    # Interface : une prise Freestyle enregistrée, bouton 📊, fiche, conseil, trou cliquable
    pg.click("#enterFreestyle");pg.evaluate("()=>document.querySelectorAll('#freestyle details').forEach(d=>d.open=true)")
    pg.evaluate(MAKE,{"bpm":90,"perBar":8,"jitter":False})
    pg.evaluate("async()=>{await saveFreeTake({kind:'freestyle',blob:__take,duration:27000,createdAt:Date.now(),title:'Prise test',beat:'Boom-bap',html:'Ligne',tempo:false,timeline:[{t:0,r:0}],bpm:90});await listFreeTakes()}")
    pg.click("#freeTakes .flow-btn");pg.wait_for_selector("#freeTakes .flow-stats",timeout=15000)
    card=pg.evaluate("()=>({txt:document.querySelector('#freeTakes .flow-card').innerText,gaps:document.querySelectorAll('#freeTakes .flow-gaps button').length,exp:document.querySelector('#freeTakes .flow-btn').getAttribute('aria-expanded')})")
    check("Fiche affichée : 3 chiffres, 1 trou cliquable, un conseil",card["gaps"]==1 and "Tenue" in card["txt"] and "🎯" in card["txt"] and card["exp"]=="true",card)
    pg.click("#freeTakes .flow-gaps button");pg.wait_for_timeout(800)
    check("Toucher le trou : la réécoute repart juste avant",pg.evaluate("()=>!$('freeReplay').classList.contains('hide')&&$('freeReplayAudio').currentTime>=6&&$('freeReplayAudio').currentTime<=12"),pg.evaluate("()=>$('freeReplayAudio').currentTime"))
    saved=pg.evaluate("async()=>(await getFreeTakes())[0].flow")
    check("Résultat gardé avec la prise (pas recalculé)",bool(saved) and saved["gaps"][0]["bars"]==2)
    check("Aucune erreur JS",not errs,errs)
    b.close()
print(f"\n{ok}/{ok+ko} OK");exit(1 if ko else 0)
