
const BANK={
rue:{label:"Rue & quotidien",medium:["Dernier métro","Badge","Cauchemar","Hall d’immeuble","Station-service","Ticket froissé"],easy:["Métro","Boulot","Famille","Quartier","Retard","Café","Loyer","Voisin","École","Facture","Béton","Fenêtre","Boulangerie","Trajet","Dimanche","Palier","Banc","Pluie"],hard:["Interphone","Périphérique","Insomnie","Gentrification","Contrôle","Bureaucratie","Interstice","Routine","Solitude urbaine","Dernier étage"]},
emotions:{label:"Émotions & relations",medium:["Fausse promesse","Fierté blessée","Cœur fermé","Lien fragile","Regret tardif","Parole sincère"],easy:["Amour","Doute","Frère","Mère","Pardon","Fierté","Manque","Rire","Larmes","Promesse","Regard","Départ","Retour","Secret","Confiance","Colère"],hard:["Ambivalence","Ressentiment","Transmission","Vulnérabilité","Désillusion","Compromis","Nostalgie","Contradiction","Réconciliation","Non-dit"]},
societe:{label:"Société & idées",medium:["Double discours","Main invisible","Voix publique","Prix à payer","Ligne rouge","Pouvoir d’achat"],easy:["Liberté","Justice","École","Travail","Frontière","Pouvoir","Argent","Droit","Voix","Grève","Choix","Peuple","Écran","Égalité","Règle","Avenir"],hard:["Précarité","Propagande","Résistance","Hypocrisie","Solidarité","Censure","Privilège","Légitimité","Désobéissance","Paradoxe"]},
imaginaire:{label:"Imaginaire & fiction",medium:["Carte secrète","Ville engloutie","Clé interdite","Rêve lucide","Gardien du temps","Passage caché"],easy:["Dragon","Portail","Sorcière","Planète","Fantôme","Trésor","Masque","Géant","Potion","Robot","Forêt","Lune","Pirate","Oracle","Château","Mirage"],hard:["Métamorphose","Prophétie","Paradoxe temporel","Civilisation perdue","Invisibilité","Créature hybride","Univers parallèle","Apocalypse","Immortalité","Dimension"]},
images:{label:"Images & poésie",medium:["Miroir brisé","Pluie de cendres","Fil invisible","Mémoire vive","Lueur fragile","Marée montante"],easy:["Écho","Cendre","Miroir","Racine","Orage","Ombre","Lumière","Sable","Encre","Cicatrice","Horizon","Vertige","Marée","Poussière","Étincelle","Silence"],hard:["Constellation","Métaphore","Éphémère","Réverbération","Abîme","Alchimie","Fissure","Crépuscule","Éclipse","Infini"]},
absurde:{label:"Absurde & décalé",medium:["Réunion de canards","Facture lunaire","Pigeon ministre","Banane suspecte","Parapluie rebelle","Réveil jaloux"],easy:["Cornichon","Canard","Pantoufle","Mayonnaise","Ascenseur","Licorne","Dentier","Brocoli","Valise","Pingouin","Chaussette","Trompette","Baguette","Parapluie","Yaourt","Pigeon"],hard:["Diplomatie du grille-pain","Syndicat des fantômes","République bananière","Hypnose collective","Complot des pigeons","Chaise quantique","Démission du soleil","Procès d’une tartine"]},
victoire:{label:"Ego-trip & victoire",medium:["Jeu d’échecs","Coup d’avance","Plume acérée","Frappe précise","Aura magnétique","Sans compromis"],easy:["Couronne","Sommet","Talent","Respect","Légende","Flamme","Roi","Équipe","Victoire","Style","Force","Micro","Scène","Champion","Rythme","Impact"],hard:["Précision chirurgicale","Élégance insolente","Suprématie","Démonstration","Intemporalité","Domination","Signature","Inarrêtable","Virtuosité","Panache"]}
};
const MODES={mot:"Intègre chaque mot dans ton flow.",chaine:"Relie chaque mot au précédent par le sens, le son ou une rime.",rime:"Trouve des rimes autour du mot affiché.",histoire:"Fais avancer une histoire avec les mots imposés.",punchline:"Prépare une phrase qui finit fort avec le mot cible.",chaos:"Garde le flow malgré les changements de consigne."};
const BEAT_LABELS={metro:"Métronome", "virtual-boom":"VirtualBeat · Boom-bap", "virtual-oriental":"VirtualBeat · Oriental", "virtual-makossa":"VirtualBeat · Afro / Makossa","virtual-lofi":"VirtualBeat · Lo-fi jazzy","virtual-trap":"VirtualBeat · Trap sombre",oldschool:"Métronome · lien Old School séparé",metabolit:"Métronome · lien Metabolit séparé",state:"Métronome · lien State of Mind séparé"};
const BEATS={oldschool:"https://pixabay.com/music/beats-old-school-x-hip-hop-beat-boom-bap-instrumental-word-for-word-331748/",metabolit:"https://pixabay.com/music/beats-metabolit-124939/",state:"https://pixabay.com/music/beats-state-of-mind-boom-bap-music-451240/"};
const $=id=>document.getElementById(id);function localDateKey(date=new Date()){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");return y+"-"+m+"-"+d}const safeRead=()=>{try{return JSON.parse(localStorage.getItem("improRapData")||"{}")}catch{return {}}};let data=safeRead();let customSession=false,customWords=[];let settings={theme:"mix",mode:"mot",level:"mixed",duration:600,bpm:90,bars:2,beat:"virtual-boom",preview:false,click:true,zero:false,rhymeAssist:true};
let deck=[],recent=[],current="",previousWord="",promptStep=0,historySeeds=[],rimeHoldUntilBar=0,lastPunchlineBar=0,sessionWords=[],wordTimes=[],reviewOnly=false,running=false,gameStarted=false,sessionStart=0,pausedAt=0,totalPaused=0,roundTimer=null,raf=null,audioCtx=null,noiseBuffer=null,nextBeatTime=0,beatIndex=0,barIndex=0,nextWordBar=0,sessionEnd=0,sessionDuration=600,remainingBeforePause=0,wakeLock=null,lastTap=0,longPressTimer=null,longPressFired=false,ended=false,challengeSeed=null,challengeActive=false;
function save(){try{localStorage.setItem("improRapData",JSON.stringify(data))}catch{setStatus("Stockage indisponible dans ce navigateur.")}}
function setStatus(s){$("gameHint").textContent=s}
function pool(){const keys=settings.theme==="mix"?Object.keys(BANK):[settings.theme];let words=keys.flatMap(k=>settings.level==="easy"?BANK[k].easy:settings.level==="hard"?BANK[k].hard:[...BANK[k].easy,...(BANK[k].medium||[]),...BANK[k].hard]);if(settings.mode==="mot"&&$("favoritePriority")?.checked&&(data.favorites||[]).length){words=[...new Set([...(data.favorites||[]),...words])]}if(reviewOnly){const missed=data.missed||{};const review=words.filter(w=>missed[w]>0);if(review.length)return review}return words}
function randomValue(){if(challengeSeed===null)return Math.random();challengeSeed=(challengeSeed*1664525+1013904223)>>>0;return challengeSeed/4294967296}
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(randomValue()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function makeDeck(){if(customSession){deck=[...customWords].reverse();return}const p=pool();const seen=new Set(sessionWords.map(w=>String(w).toLocaleLowerCase("fr")));const sourceBase=p.filter(w=>!seen.has(String(w).toLocaleLowerCase("fr")));let source=sourceBase;if(settings.mode==="rime"){const rhymeKeys=new Set(Object.keys(RHYME_FAMILIES).map(rhymeKey));const rhymeTargets=source.filter(w=>rhymeKeys.has(rhymeKey(w)));if(rhymeTargets.length>=8)source=rhymeTargets}const missed=data.missed||{};const boosted=shuffle([...new Set(Object.keys(missed).filter(w=>missed[w]>0&&source.includes(w)))]).slice(0,5);const priority=new Set(boosted);const favWords=settings.mode==="mot"&&$("favoritePriority")?.checked?[...new Set((data.favorites||[]).filter(w=>source.includes(w)))]:[];const favSet=new Set(favWords);deck=[...shuffle(source.filter(w=>!priority.has(w)&&!favSet.has(w))),...boosted.filter(w=>!favSet.has(w)),...favWords.slice().reverse()];}
const MODE_PROMPTS={mot:["Place ce mot naturellement dans ta prochaine mesure.","Utilise le mot sans casser ton flow.","Fais rimer ce mot ou construis une image autour de lui."],chaine:["Relie le mot précédent « {prev} » à « {word} » par une idée ou une rime.","Fais une transition crédible entre « {prev} » et « {word} ».","Trouve un lien inattendu entre « {prev} » et « {word} »."],rime:["Garde « {word} » comme cible : enchaîne au moins 2 rimes sur un même son.","Fais sonner la fin de 2 mesures avec des rimes autour de « {word} ».","Trouve une rime riche ou multisyllabique pour « {word} »."],histoire:["ÉTAPE 1 — Présente un personnage ou un lieu avec « {word} ».","ÉTAPE 2 — Crée un problème lié à « {word} ».","ÉTAPE 3 — Fais un rebondissement avec « {word} ».","ÉTAPE 4 — Conclus l’histoire avec « {word} »."],punchline:["Prépare une punchline contenant « {word} » et termine par une chute.","Fais une comparaison inattendue avec « {word} », puis frappe sur le dernier mot.","Construis une montée en tension et place « {word} » dans la chute."],chaos:["VIRAGE — Change d’émotion tout en plaçant « {word} ».","VIRAGE — Parle au « je » et place « {word} ».","VIRAGE — Fais une comparaison surprenante avec « {word} ».","VIRAGE — Raconte au futur avec « {word} ».","VIRAGE — Place une rime interne et « {word} ».","VIRAGE — Passe de sérieux à absurde en utilisant « {word} ».","VIRAGE — Adresse-toi directement à un adversaire avec « {word} ».","VIRAGE — Décris une scène en utilisant les cinq sens et « {word} »." ]};
function modeInstruction(word,prev){const list=MODE_PROMPTS[settings.mode]||MODE_PROMPTS.mot;let prompt;if(settings.mode==="chaine"&&!prev)prompt="Premier maillon : lance une idée qui pourra être reliée au prochain mot « "+word+" ».";else if(settings.mode==="histoire"&&promptStep===1)prompt="DÉPART — Lance un récit avec ces 3 éléments : "+historySeeds.join(" · ")+". Donne un lieu, un personnage et une envie.";else if(settings.mode==="histoire")prompt=list[(promptStep-1)%list.length];else if(settings.mode==="punchline"&&promptStep%4===0)prompt="PRÉPARE LA CHUTE — Fais monter la tension autour de « "+word+" » : la punchline doit tomber au prochain virage de 8 mesures.";else if(settings.mode==="chaos")prompt=list[Math.floor(randomValue()*list.length)];else prompt=list[(promptStep-1)%list.length];return prompt.replaceAll("{word}",word).replaceAll("{prev}",prev||"départ");}

// Familles de rimes utiles au démarrage : suggestions locales, sans API ni dépendance.
const RHYME_FAMILIES={
"amour":["toujours","jour","tour","lourd","discours","secours","parcours","autour","retour","humour","tambour","velours","détour","séjour"],
"jour":["amour","toujours","tour","lourd","discours","secours","parcours","autour","retour","humour","tambour","velours","détour"],
"vie":["envie","avis","souris","défi","oubli","infini","joli","pari","survie","récit","merci","énergie"],
"envie":["vie","avis","souris","défi","oubli","infini","joli","pari","survie","récit"],
"rue":["vue","issue","venue","déçue","perdue","inconnue","continue","minute","brute"],
"nuit":["bruit","fruit","huit","conduite","suite","poursuite","cuite","fuite","réussite","insomnie"],
"cœur":["peur","fleur","sœur","douceur","chaleur","douleur","bonheur","malheur","honneur","valeur","couleur","ailleurs"],
"peur":["cœur","fleur","sœur","douceur","chaleur","douleur","bonheur","malheur","honneur","valeur","couleur"],
"temps":["vent","sang","blanc","grand","enfant","présent","absent","vivant","longtemps","maintenant"],
"vent":["temps","sang","blanc","grand","enfant","présent","absent","vivant","longtemps"],
"argent":["parent","présent","absent","dedans","devant","mécontent","évident","gagnant","brillant"],
"voix":["choix","loi","roi","toi","moi","fois","émoi","exploit","proie","voie"],
"choix":["voix","loi","roi","toi","moi","fois","émoi","exploit","proie","voie"],
"roi":["moi","toi","soi","choix","voix","loi","fois","exploit","proie","émoi"],
"moi":["toi","roi","soi","choix","voix","loi","fois","émoi","exploit"],
"toi":["moi","roi","soi","choix","voix","loi","fois","émoi"],
"liberté":["vérité","fierté","beauté","unité","égalité","humanité","priorité","sincérité","légalité","fatalité"],
"vérité":["liberté","fierté","beauté","unité","égalité","humanité","priorité","sincérité","légalité"],
"fierté":["vérité","liberté","beauté","unité","égalité","humanité","sincérité"],
"justice":["injustice","notice","supplice","complice","délice","vice","bénéfice","artifice"],
"travail":["soleil","réveil","pareil","conseil","appareil","sommeil","merveille","oreille","bataille"],
"soleil":["travail","réveil","pareil","conseil","appareil","sommeil","merveille"],
"quartier":["fier","hier","premier","dernier","entier"],
"métro":["trop","mots","dos","chaud","faux","défaut","niveau","zéro","héros","écho"],
"boulot":["métro","trop","mots","dos","chaud","faux","défaut","niveau","héros"],
"famille":["brille","fille","ville","tranquille","fragile","facile","utile","asile","profil"],
"retard":["regard","hasard","bavard","départ"],
"café":["parfait","effet","refait","secret","paix","jamais","après","succès"],
"pluie":["nuit","bruit","fruit","fuite","ennui","aujourd'hui","appui","conduit"],
"béton":["son","fond","rond","nom","ton","long","frisson","horizon","maison","poison"],
"maison":["raison","saison","horizon","poison","prison","chanson","frisson","blason"],
"raison":["maison","saison","horizon","poison","prison","chanson","frisson"],
"chanson":["maison","raison","saison","horizon","poison","prison","frisson","passion"],
"passion":["action","réaction","nation","vibration","création","fiction","mission","vision","pression"],
"colère":["lumière","poussière","rivière","derrière","pierre","mystère","sincère","repère"],
"larmes":["armes","flammes","femmes","âmes","drames","lames","réclames"],
"regard":["retard","hasard","bavard","départ"],
"départ":["retard","regard","hasard","bavard"],
"espoir":["histoire","mémoire","miroir","territoire","victoire","soir","noir","voir","pouvoir"],
"histoire":["mémoire","miroir","territoire","victoire","espoir","soir","noir","voir","pouvoir"],
"mémoire":["histoire","miroir","territoire","victoire","espoir","soir","noir","voir"],
"noir":["soir","voir","espoir","histoire","mémoire","miroir","territoire","victoire"],
"soir":["noir","voir","espoir","histoire","mémoire","miroir","territoire","victoire"],
"victoire":["histoire","mémoire","miroir","territoire","espoir","gloire","voir"],
"force":["corse","écorce","amorce","torse","entorse","renforce","s'efforce"],
"style":["tuile","utile","facile","fragile","ville","tranquille","profil","exil"],
"micro":["mots","trop","dos","chaud","héros","zéro","écho","niveau"],
"scène":["saine","humaine","veine","peine","haine","reine","gêne","domaine"],
"flamme":["âme","femme","drame","lame","blâme","réclame","infâme"],
"légende":["agenda","bande","demande","offrande","amende","tendance","défende"],
"respect":["aspect","projet","sujet","objet","effet","secret","parfait"],
"talent":["parent","présent","absent","dedans","devant","gagnant","brillant"],
"équipe":["principe","participe","anticipe","s'équipe"],
"dragon":["avion","passion","vision","mission","frisson","horizon","maison"],
"lune":["brune","fortune","commune","rune","aucune","lacune"],
"rêve":["trêve","grève","s'élève","achève","relève","sève"],
"plume":["brume","costume","ume","amertume","écume","volume"],
"pouvoir":["savoir","devoir","voir","espoir","miroir","histoire","territoire"],
"pardon":["maison","raison","chanson","saison","frisson","horizon"],
"secret":["discret","concret","regret","projet","respect","effet","parfait"],
"demain":["chemin","destin","malin","soudain","humain","terrain","lointain","main"],
"chemin":["demain","destin","malin","soudain","humain","terrain","lointain"],
"destin":["chemin","demain","malin","soudain","humain","terrain","lointain"],
"enfant":["temps","vent","sang","grand","blanc","vivant","présent","absent"],
"famille":["brille","fille","ville","tranquille","fragile","facile","utile"],
"école":["drôle","rôle","vole","sol","folle","parole","idole","bémol"],
"parole":["école","drôle","rôle","vole","sol","folle","idole"],
"cauchemar":["bizarre","regard","hasard","départ","bavard"],
"fantôme":["diplôme","atome","autonome","royaume","chromosome"],
"mirage":["orage","courage","voyage","visage","partage","message","nage"],
"orage":["mirage","courage","voyage","visage","partage","message"],
"courage":["orage","mirage","voyage","visage","partage","message"],
"plaisir":["désir","sourire","avenir","partir","sortir","grandir","souvenir","choisir"],
"sourire":["plaisir","désir","avenir","partir","sortir","grandir","souvenir","choisir"],
"avenir":["plaisir","désir","sourire","partir","sortir","grandir","souvenir","choisir"],
"écran":["criant","brillant","présent","géant","vivant","courant"],
"frontière":["lumière","poussière","rivière","derrière","première","dernière","entière"],
"grève":["rêve","trêve","s'élève","achève","relève"],
"victoire":["gloire","histoire","mémoire","miroir","territoire","espoir","voir"],
"silence":["absence","présence","sentence","essence","cadence","danse","chance"],
"chance":["danse","cadence","silence","absence","présence","essence"],
"rythme":["abîme","rime","intime","victime","sublime","anime"],
"rime":["rythme","abîme","intime","victime","sublime"],
"abîme":["rythme","rime","intime","victime","sublime"],
"impact":["contact","compact","exact","intact","pacte","acte"],
"bébé":["été","côté","jeté","fêté","resté","levé","clé","carré"],
"fleur":["cœur","peur","sœur","douceur","chaleur","douleur","bonheur","malheur"],
"bonheur":["cœur","peur","fleur","douceur","chaleur","douleur","malheur","honneur"],
"pluie":["ennui","nuit","bruit","fruit","fuite","aujourd'hui","appui"]
};
// Extension éditoriale : familles phonétiques pensées pour les finales fréquentes en freestyle.
const RHYME_CURATED_GROUPS=[
["amour","toujours","velours","humour","tambour","parcours","secours","retour","détour","discours","recours","concours","contour","bonjour","autour","tour","jour","lourd","vautour"],
["moi","toi","roi","choix","voix","loi","fois","soi","émoi","exploit","proie","voie","joie","foi","bois","doigt","froid"],
["temps","sang","blanc","grand","enfant","vivant","présent","absent","gagnant","brillant","longtemps","maintenant","mécontent","évident","parent","devant"],
["son","nom","ton","fond","rond","long","maison","raison","chanson","horizon","pardon","poisson","garçon","frisson","façon","saison","prison"],
["cœur","peur","fleur","sœur","douceur","chaleur","douleur","bonheur","malheur","honneur","valeur","couleur","lueur","rumeur","demeure","heure"],
["noir","soir","voir","espoir","miroir","pouvoir","savoir","devoir","histoire","mémoire","victoire","gloire","territoire","dérisoire","couloir","exutoire"],
["vie","envie","survie","défi","oubli","infini","récit","merci","pari","avis","souris","folie","jolie","ennemi"],
["rue","vue","issue","venue","perdue","inconnue","continue","retenue","revenue","connue","déçue","tendue","étendue","entendue"],
["nuit","bruit","fruit","huit","suite","fuite","conduite","poursuite","réussite","insomnie","ennui","appui","aujourd'hui"],
["orage","mirage","courage","voyage","visage","partage","message","rivage","carnage","ancrage","virage","fromage","sabotage","naufrage"],
["musique","logique","magique","tragique","classique","unique","critique","électrique","poétique","politique","comique","technique","mythique"],
["action","passion","mission","vision","pression","fiction","réaction","création","nation","vibration","tentation","révolution","solution","punition"],
["tête","fête","quête","conquête","tempête","planète","comète","inquiète","défaite","parfaite","silhouette","recette","casquette"],
["soleil","réveil","pareil","conseil","appareil","sommeil","merveille","orteil"],
["clair","éclair","galère","colère","misère","lumière","poussière","prière","frontière","arrière","repère"],
["matin","chemin","destin","humain","demain","refrain","terrain","chagrin","voisin","malin","écrivain"],
["capable","stable","table","fable","sable","implacable","respectable","inoubliable","incroyable","véritable","coupable"],
["maison","raison","saison","chanson","horizon","prison","poisson","garçon","pardon","frisson","façon","blason","poison"],
["liberté","vérité","fierté","beauté","unité","égalité","humanité","priorité","sincérité","légalité","fatalité","dignité"],
["chance","danse","silence","absence","présence","essence","cadence","sentence","différence","confiance","puissance","violence","balance"],
["invincible","sensible","possible","terrible","visible","cible","flexible","invisible","impossible","fusible"],
["rivière","dernière","carrière","arrière","lumière","poussière","prière","frontière"]
];
for(const group of RHYME_CURATED_GROUPS){
 for(const word of group){
  const key=word.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("fr");
  RHYME_FAMILIES[key]=group.filter(w=>w!==word);
 }
}
function rhymeKey(word){return String(word||"").toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g," ").replace(/[^a-z -]/g," ").trim().split(/\s+/).filter(Boolean).pop()||"";}
const INVARIABLE_FINALS=new Set(["bus","tapis","souris","fils","prix","choix","voix","fois","temps","corps","sens","virus","ours","pays","avis","bras","gras","pas","repas","plus","mars","cours","parcours","discours","secours","univers","héros","gaz","nez","riz","permis","sourcils"]);
function rhymeIdentityKey(word){
 let key=String(word||"").toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/œ/g,"oe").replace(/æ/g,"ae").replace(/[’']/g," ").replace(/[^a-z -]/g," ").trim().split(/\s+/).filter(Boolean).pop()||"";
 if(!key||INVARIABLE_FINALS.has(key))return key;
 const irregular={"chevaux":"cheval","journaux":"journal","travaux":"travail","vitraux":"vitrail","coraux":"corail","bijoux":"bijou","cailloux":"caillou","choux":"chou","genoux":"genou","hiboux":"hibou","joujoux":"joujou","poux":"pou","bateaux":"bateau","chateaux":"chateau","cadeaux":"cadeau","morceaux":"morceau","gateaux":"gateau","oiseaux":"oiseau","tableaux":"tableau","rideaux":"rideau","tuyaux":"tuyau"};
 if(irregular[key])return irregular[key];
 if(key.endsWith("eaux"))return key.slice(0,-1);
 if(key.endsWith("aux")&&key.length>4)return key.slice(0,-3)+"al";
 if(key.endsWith("s")&&key.length>2)return key.slice(0,-1);
 if(key.endsWith("x")&&key.length>2)return key.slice(0,-1);
 return key;
}
function finalizeRhymeCandidates(candidates,target,limit=12){
 const targetKey=rhymeIdentityKey(target),seen=new Set(),out=[];
 for(const candidate of candidates||[]){
  if(typeof candidate!=="string")continue;
  const identity=rhymeIdentityKey(candidate);
  if(!identity||identity===targetKey||seen.has(identity))continue;
  seen.add(identity);out.push(candidate);
  if(out.length>=limit)break;
 }
 return out;
}
let lexiqueRimes=null;
let lexiqueRimesPromise=null;
function loadLexiqueRimes(){
 if(lexiqueRimes)return Promise.resolve(lexiqueRimes);
 if(!lexiqueRimesPromise){
  lexiqueRimesPromise=fetch("data/lexique-rimes.json").then(r=>{if(!r.ok)throw new Error("Index de rimes indisponible");return r.json()}).then(data=>{if(!data||!data.families||!data.word_index)throw new Error("Index de rimes invalide");lexiqueRimes=data;return buildRimeIndex().then(()=>data)}).catch(()=>{lexiqueRimesPromise=null;return null});
 }
 return lexiqueRimesPromise;
}
function lexiqueWordKey(value){return String(value||"").toLocaleLowerCase("fr").normalize("NFC").replace(/œ/g,"oe").replace(/æ/g,"ae").replace(/[^a-zàâäéèêëîïôöùûüÿç'-]/g,"")}
/* ---- Moteur de rimes au son (29/10/2026) ----
   Les rimes se calculent sur la prononciation (Lexique), pas sur l'orthographe.
   Une proposition n'est gardée que si elle partage au moins la dernière voyelle prononcée
   et les consonnes qui la suivent. Pour un mot absent de Lexique (prénom, argot, mot du public),
   la prononciation de la fin est déduite des mots qui s'écrivent pareil, puis de règles simples. */
const RIME_VOWELS=/[aie@o§yu52]/;
function stripAcc(s){return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/œ/g,"oe").replace(/æ/g,"ae")}
function rNorm(p){return String(p||"").replace(/[^A-Za-z@°§0-9]/g,"").replace(/°+$/,"").replace(/E/g,"e").replace(/O/g,"o").replace(/[9°]/g,"2").replace(/1/g,"5").replace(/A/g,"a")}
function rimeOf(p){for(let i=p.length-1;i>=0;i--)if(RIME_VOWELS.test(p[i]))return p.slice(i);return ""}
function lastRhymeToken(word){return lexiqueWordKey(String(word||"").toLocaleLowerCase("fr").replace(/[’']/g," ").trim().split(/\s+/).pop()||"")}
let rimeIndex=null,lexWords=null,rimeIndexPromise=null;const inferCache=new Map();
function buildRimeIndex(){
 if(rimeIndex)return Promise.resolve(rimeIndex);
 if(!lexiqueRimes)return Promise.resolve(null);
 if(rimeIndexPromise)return rimeIndexPromise;
 const all=Object.entries(lexiqueRimes.word_index),idx=new Map(),words=[];let pos=0;
 rimeIndexPromise=new Promise(resolve=>{
  const step=()=>{const end=Math.min(all.length,pos+15000);
   for(;pos<end;pos++){const [w,es]=all[pos];let best=null;const seen=new Set();
    for(const e of es||[]){const p=rNorm(e.phon);if(!p)continue;const f=e.frequency||0;if(!best||f>best.f)best={p,f};const r=rimeOf(p);if(!r||seen.has(r))continue;seen.add(r);let b=idx.get(r);if(!b)idx.set(r,b=[]);b.push([w,p,f])}
    if(best)words.push([w,stripAcc(w),best.p,best.f,w])}
   if(pos<all.length){setTimeout(step,0);return}
   idx.forEach(b=>b.sort((x,y)=>y[2]-x[2]));rimeIndex=idx;lexWords=words;resolve(idx)};
  setTimeout(step,0)});
 return rimeIndexPromise;
}
function vowelCompat(w){
 const x=stripAcc(w).replace(/([^aeiouy])(e|es|ent)$/,"$1").replace(/[^aeiouy]+$/,"");
 const g=(x.match(/[aeiouy]+$/)||[""])[0],c=g[0]||"";
 return ({a:"a@eo5",e:"e2@5oa",i:"i5",y:"i5",o:"o§ua2",u:"y52"})[c]||"aie@o§yu52";
}
function spellCons(c){return c.replace(/sch|sh|ch/g,"S").replace(/gn/g,"N").replace(/ph/g,"f").replace(/th/g,"t").replace(/qu|ck|cq|q/g,"k").replace(/x/g,"ks").replace(/j/g,"Z").replace(/r/g,"R").replace(/(.)\1/g,"$1").replace(/c/g,"k").replace(/h/g,"")}
const LETTER_SOUNDS={a:"a",b:"be",c:"se",d:"de",e:"2",f:"ef",g:"Ze",h:"aS",i:"i",j:"Zi",k:"ka",l:"el",m:"em",n:"en",o:"o",p:"pe",q:"ky",r:"eR",s:"es",t:"te",u:"y",v:"ve",w:"ve",x:"iks",y:"igRek",z:"zed"};
const RHYME_BLOCKLIST=new Set("chinetoque chinetoc chintok bougnoule bougnoul negro negre youpin bicot raton toubab bamboula boche rital gogol pede tapette tarlouze gouine encule enculer salope pute putain bite couille penis vagin nichon branleur connard connasse niquer nique zizi coke cocaine shit beuh salopard laplupart".split(" "));
function spellRime(w){
 const x=String(w||"").toLocaleLowerCase("fr");
 const T=[[/(oires?|oirs?)$/,"waR"],[/(ois|oit|oies?|oix|oi)$/,"wa"],[/(eurs?|eures?|œurs?)$/,"2R"],[/(eux|eus?|eues?)$/,"2"],
  [/(iens?|ient)$/,"j5"],[/(aints?|ains?|eins?|ints?|ins?|ims?|uns?|ym)$/,"5"],[/(ants?|ents?|ans?|ens|ands?|ang|amps?)$/,"@"],[/(ons?|onts?|onds?|om)$/,"§"],
  [/ouilles?$/,"uj"],[/(ailles?|ails?)$/,"aj"],[/(eilles?|eils?)$/,"ej"],[/illes?$/,"ij"],
  [/(oux|ous|outs?|oups?|oûts?|oues?|ou)$/,"u"],[/(eaux?|aux?|auds?|auts?|ots?|ôts?|os|o)$/,"o"],
  [/(ées?|és?|ers|er|ez|ais|ait|aient|ai|ets?|ês|êts?|ès)$/,"e"],[/(ies?|is|its?|ix|ids?|i|y)$/,"i"],[/(ues?|us|uts?|ûts?|u)$/,"y"],[/(as|ats?|ah|âts?|à|a)$/,"a"]];
 for(const [re,r] of T){const m=x.match(re);if(!m)continue;const before=x.slice(0,m.index);
  if(/ill$/.test(before))return "j"+r;
  const cg=(before.match(/[^aeiouyéèêëàâîïôöûüù]+$/)||[""])[0];
  if(cg){const c=spellCons(cg.slice(-2)).slice(-1);return (c&&!/[jw]/.test(r[0])?c:"")+r}
  const vg=(before.match(/[éèêe]$/)||[""])[0];return (vg?"e":"")+r}
 const m=x.match(/(eau|au|ou|oi|ai|ei|eu|œu|[aeiouyéèêëàâîïôöûüù])([^aeiouyéèêëàâîïôöûüù]+)(e|es)?$/);
 if(!m)return "";
 const V={a:"a",à:"a",â:"a",e:"e",é:"e",è:"e",ê:"e",ë:"e",i:"i",î:"i",ï:"i",y:"i",o:"o",ô:"o",ö:"o",u:"y",û:"y",ü:"y",ù:"y",eau:"o",au:"o",ou:"u",oi:"wa",ai:"e",ei:"e",eu:"2",œu:"2"};
 let c=m[2];const hasE=!!m[3];if(!hasE){const k=c.replace(/[tdsxp]+$/,"");c=k}
 c=c.replace(/sch|sh|ch/g,"S").replace(/gn/g,"N").replace(/ph/g,"f").replace(/th/g,"t").replace(/qu|ck|cq|q/g,"k").replace(/x/g,"ks").replace(/j/g,"Z").replace(/r/g,"R").replace(/(.)\1/g,"$1");
 if(hasE){if(/g$/.test(c))c=c.replace(/g$/,"Z");if(/c$/.test(c))c=c.replace(/c$/,"s");if(m[2]==="s")c="z"}
 c=c.replace(/c/g,"k").replace(/h/g,"");
 return (V[m[1]]||"")+c;
}
function inferPhon(w){
 if(inferCache.has(w))return inferCache.get(w);
 const accented=stripAcc(w)!==w,s=accented?w:stripAcc(w),ok=vowelCompat(w),spelled=spellRime(w);let out="";
 if(lexWords)for(let L=Math.min(6,s.length-1);L>=3&&!out;L--){
  const suf=s.slice(-L),votes=new Map();let total=0;
  for(const [,plain,p,f,orig] of lexWords){const ls=accented?orig:plain;if(ls.length>L&&ls!==s&&ls.endsWith(suf)){const r=rimeOf(p);if(!r)continue;const wt=1+Math.log10(1+f);let v=votes.get(r);if(!v)votes.set(r,v={w:0,pre:new Map()});v.w+=wt;total+=wt;const pc=p[p.length-r.length-1]||"";v.pre.set(pc,(v.pre.get(pc)||0)+wt)}}
  if(!total)continue;
  const [r,v]=[...votes].sort((a,b)=>b[1].w-a[1].w)[0];
  if(v.w/total>=.6&&ok.includes(r[0])){const [pc,pw]=[...v.pre].sort((a,b)=>b[1]-a[1])[0];out=(pc&&pw/v.w>=.7?pc:"")+r}
 }
 if(out&&spelled.length>out.length&&spelled.endsWith(out))out=spelled;
 if(!out&&spelled&&RIME_VOWELS.test(spelled))out=spelled;
 inferCache.set(w,out);return out;
}
const targetCache=new Map();
function targetPhon(word){const k=String(word||"");if(targetCache.has(k))return targetCache.get(k);const r=targetPhonRaw(word);if(r||lexWords)targetCache.set(k,r);return r}
function targetPhonRaw(word){
 const w=lastRhymeToken(word);if(!w||!lexiqueRimes)return null;
 const raw=String(word||"").trim().split(/\s+/).pop()||"";
 if((/^[A-Z]{2,5}$/.test(raw)||!/[aeiouyéèêëàâîïôöûüù]/.test(w))&&LETTER_SOUNDS[stripAcc(w).slice(-1)]){const ls=LETTER_SOUNDS[stripAcc(w).slice(-1)];return {w,p:ls,known:false}}
 const es=lexiqueRimes.word_index[w];
 if(es&&es.length){const e=[...es].sort((a,b)=>(b.frequency||0)-(a.frequency||0))[0];const p=rNorm(e.phon);if(p&&rimeOf(p))return {w,p,known:true}}
 if(!lexWords)return null;
 const p=inferPhon(w);return p?{w,p,known:false}:null;
}
/* Clé de rime exacte d'abord ; si elle ne donne presque rien (mot anglais, nom propre),
   on essaie une rime proche : sans semi-voyelle, puis en raccourcissant la fin. */
function rimeKeysFor(p){const r=rimeOf(p),keys=[r];let k=r.replace(/[jw8](?=.)/g,"");if(k&&k!==r)keys.push(k);while(k.length>1&&!RIME_VOWELS.test(k[k.length-1])){k=k.slice(0,-1);if(!keys.includes(k))keys.push(k)}return keys}
function sharedTail(a,b){let n=0;while(n<a.length&&n<b.length&&a[a.length-1-n]===b[b.length-1-n])n++;return n}
const rhymeCache=new Map();
function rhymeSuggestions(word){
 if(!lexiqueRimes||!rimeIndex)return [];
 const t=targetPhon(word);if(!t)return [];
 if(rhymeCache.has(t.w))return rhymeCache.get(t.w);
 const tw=stripAcc(t.w),scored=[];
 for(const key of rimeKeysFor(t.p)){if(scored.length>=8)break;
  for(const [w,p,f] of rimeIndex.get(key)||[]){
   if(p===t.p)continue;
   const n=sharedTail(p,t.p),tier=f>=2?2:f>=.5?1:0;
   scored.push({w,p,s:(tier*2+(n>=2?Math.min(n,4)*1.5:0))*1e6+Math.min(f,99999)});
  }}
 scored.sort((a,b)=>b.s-a.s);
 /* Filtres plus coûteux seulement sur les meilleurs : pas de sigles, pas d'insultes, pas le même mot. */
 const seenP=new Set([t.p]),out=[];
 for(const {w,p} of scored){if(out.length>=60)break;
  if(seenP.has(p)||/['-]/.test(w))continue;
  const sw=stripAcc(w);
  if(sw===tw||!/[aeiouy]/.test(sw)||RHYME_BLOCKLIST.has(sw)||RHYME_BLOCKLIST.has(rhymeIdentityKey(sw)))continue;
  if(sw.length>=3&&tw.length>=3&&(sw.endsWith(tw)||tw.endsWith(sw)))continue;
  seenP.add(p);out.push(w)}
 const res=finalizeRhymeCandidates(out,word,40);rhymeCache.set(t.w,res);return res;
}
function rhymeAnalysis(target,candidate){
 const empty={quality:"unknown",multi:false,sharedPhonemes:0,sharedSyllables:0};
 if(!lexiqueRimes)return empty;
 const t=targetPhon(target),es=lexiqueRimes.word_index[lexiqueWordKey(candidate)]||[];
 if(!t||!es.length)return empty;
 let best=0;for(const e of es){const n=sharedTail(rNorm(e.phon),t.p);if(n>best)best=n}
 const shared=t.p.slice(t.p.length-best),vowels=(shared.match(/[aie@o§yu52]/g)||[]).length;
 if(!vowels||best<rimeOf(t.p).length){const near=rimeKeysFor(t.p).slice(1);if(es.some(e=>near.includes(rimeOf(rNorm(e.phon)))))return {quality:"poor",multi:false,sharedPhonemes:1,sharedSyllables:1};return {...empty,quality:"none"}}
 return {quality:best<=1?"poor":best===2?"sufficient":"rich",multi:vowels>=2,sharedPhonemes:best,sharedSyllables:vowels};
}
function selectRhymeStars(target,candidates,limit=6){
 /* L'ordre vient de rhymeSuggestions : mots courants d'abord, puis les rimes les plus riches.
    On ne garde que les vraies rimes (au son). */
 return finalizeRhymeCandidates(candidates,target,60).filter(w=>{const q=rhymeAnalysis(target,w).quality;return q!=="none"&&q!=="unknown"}).slice(0,limit);
}
function renderRhymeHelper(word){
 const box=$("rhymeHelper"),orbit=$("rhymeOrbit");if(!box||!orbit)return;
 const active=settings.rhymeAssist!==false&&!!word;
 const suggestions=active?selectRhymeStars(word,rhymeSuggestions(word),12):[];
 if(active&&!rimeIndex){loadLexiqueRimes().then(data=>{if(data&&settings.rhymeAssist!==false&&current)renderRhymeHelper(current)});}
 box.hidden=!active;
 orbit.querySelectorAll(".rhyme-star").forEach(el=>el.remove());
 if(!active)return;
 const orbitSuggestions=suggestions.slice(0,4);orbitSuggestions.forEach((candidate,index)=>{
  const analysis=rhymeAnalysis(word,candidate);
  const b=document.createElement("button");
  b.type="button";b.className="rhyme-star rhyme-"+analysis.quality;
  b.textContent=candidate;
  if(analysis.multi){const marker=document.createElement("span");marker.className="rhyme-multi";marker.textContent="MULTI";b.append(marker);}
  b.setAttribute("aria-label",candidate+" : "+(analysis.quality==="poor"?"rime pauvre":analysis.quality==="sufficient"?"rime suffisante":analysis.quality==="rich"?"rime riche":"type de rime non vérifié")+(analysis.multi?", multisyllabique":"")+". Toucher pour garder cette piste.");
  const angle=(-Math.PI/2)+(2*Math.PI*index/Math.max(1,orbitSuggestions.length));
  b.style.left=(50+Math.cos(angle)*35)+"%";
  b.style.top=(50+Math.sin(angle)*36)+"%";
  b.addEventListener("click",()=>{$("wordMeta").textContent="PISTE DE RIME : "+candidate+" · fais-la sonner dans ta prochaine phrase";$("wordMeta").style.color="var(--yellow)";});
  orbit.append(b);
 });
 box.querySelectorAll(".rhyme-external").forEach(el=>el.remove());
 const links=document.createElement("div");links.className="rhyme-external";
 const slug=String(word).toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
 const targets=[
  ["Rimes Solides","https://www.rimessolides.com/rime.aspx?m="+encodeURIComponent(word)],
  ["Dico des rimes","https://www.dicodesrimes.com/rime/"+encodeURIComponent(slug)],
  ["Barbery","https://www.barbery.net/lebarbery/index.htm"]
 ];
 targets.forEach(([label,url])=>{const a=document.createElement("a");a.className="rhyme-external-link";a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent="↗ "+label;a.setAttribute("aria-label","Chercher des rimes pour "+word+" sur "+label);links.append(a);});
 box.append(links);
 const groups=$("rhymeGroups");if(groups){groups.replaceChildren();const categories=[{key:"multi",title:"Multisyllabiques",test:x=>x.multi},{key:"rich",title:"Rimes riches",test:x=>!x.multi&&x.quality==="rich"},{key:"sufficient",title:"Rimes suffisantes",test:x=>!x.multi&&x.quality==="sufficient"},{key:"poor",title:"Rimes pauvres",test:x=>!x.multi&&x.quality==="poor"},{key:"unknown",title:"À vérifier à l’oreille",test:x=>x.quality==="unknown"}];categories.forEach(cat=>{const matches=suggestions.filter(candidate=>{const a=rhymeAnalysis(word,candidate);return cat.test(a)});if(!matches.length)return;const section=document.createElement("section");section.className="rhyme-group";const title=document.createElement("h4");title.textContent=cat.title;const list=document.createElement("div");list.className="rhyme-group-list";matches.forEach(candidate=>{const a=rhymeAnalysis(word,candidate),b=document.createElement("button");b.type="button";b.className="rhyme-star rhyme-"+a.quality;b.textContent=candidate;if(a.multi)b.textContent+=" ✦";b.addEventListener("click",()=>{$("wordMeta").textContent="PISTE DE RIME : "+candidate+" · fais-la sonner dans ta prochaine phrase";$("wordMeta").style.color="var(--yellow)"});list.append(b)});section.append(title,list);groups.append(section)})}
}

function draw(){if(!deck.length){if(customSession)return;makeDeck();if(!deck.length){finishSession();return}}previousWord=current;current=deck.pop();promptStep++;if(settings.mode==="histoire"&&promptStep===1){historySeeds=[current];for(let i=0;i<2&&deck.length;i++)historySeeds.push(deck.pop());while(historySeeds.length<3)historySeeds.push(current);historySeeds.forEach(w=>{recent.push(w);sessionWords.push(w)});current=historySeeds[2]}else{recent.push(current);sessionWords.push(current)}if(recent.length>60)recent=recent.slice(-60);$("bigWord").classList.remove("empty-word");$("bigWord").textContent=current;$("favoriteWord").textContent=isFavorite(current)?"★":"☆";$("wordMeta").textContent=customSession?"MOT "+sessionWords.length+"/10 · place-le dans ton flow.":modeInstruction(current,previousWord);renderRhymeHelper(current);if(customSession){$("sessionMeta").textContent="10 MOTS POUR UNE IMPRO · "+sessionWords.length+"/10";$("nextGameWord").textContent=sessionWords.length>=10?"Terminer les 10 mots ✓":"Mot placé ✓ · suivant";$("gameHint").textContent=settings.level==="easy"?"Place le mot affiché ; les rimes sont là si tu en as besoin.":"Place le mot affiché, puis appuie pour découvrir le suivant."}if(settings.mode==="rime")rimeHoldUntilBar=barIndex+4;$("previewWord").textContent=settings.preview&&settings.level==="easy"&&deck.length?"À venir : "+deck[deck.length-1]:"";$("roundProgress").style.width=(sessionDuration?Math.min(100,(Date.now()-sessionStart-totalPaused)/1000/sessionDuration*100):0)+"%"}
function chooseTheme(k){settings.theme=k;document.querySelectorAll("[data-theme]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.theme===k)))}
const FOCUS_HINTS={mot:"Flow libre : garde le fil, les mots sont des tremplins et non des obligations de rimes.",chaine:"Chaîne d’idées : relie le nouveau mot au précédent par le sens, une image ou un son.",rime:"Rimes ciblées : explore plusieurs finales sonores autour du mot cible.",punchline:"Punchline : fais monter la tension et prépare une chute mémorable.",histoire:"Histoire : donne un départ, un problème, un rebondissement puis une conclusion.",chaos:"Adaptation : garde le flow malgré des consignes surprises."};
function chooseMode(k){settings.mode=k;document.querySelectorAll("[data-mode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.mode===k)));const select=$("focusMode");if(select)select.value=k;const hint=$("focusHint");if(hint)hint.textContent=FOCUS_HINTS[k]||FOCUS_HINTS.mot;}
function applyLevel(){const v=settings.level;$("levelHint").textContent=v==="easy"?"Mots concrets et accessibles · un mot toutes les 4 mesures · aperçu possible.":v==="hard"?"Mots plus rares, abstraits ou multisyllabiques · un mot toutes les 1 à 2 mesures · défis plus corsés.":"Trois étages de vocabulaire : concret, intermédiaire et technique · un mot toutes les 2 mesures.";if(v==="easy")$("bars").value="4";else if(v==="hard")$("bars").value="1";else $("bars").value="2";settings.bars=Number($("bars").value)}
function loadSettings(){try{const s=JSON.parse(localStorage.getItem("improRapSettings")||"{}");Object.assign(settings,s)}catch{}$("level").value=settings.level;$("favoritePriority").checked=!!settings.favoritePriority;$("duration").value=String(settings.duration);$("bpm").value=settings.bpm;$("bars").value=String(settings.bars);$("beatChoice").value=settings.beat;$("previewNext").checked=!!settings.preview;$("clickEnabled").checked=settings.click!==false;$("zeroMode").checked=!!settings.zero;$("rhymeAssist").checked=settings.rhymeAssist!==false;chooseTheme(settings.theme);chooseMode(settings.mode);const v=settings.level;$("levelHint").textContent=v==="easy"?"Mots concrets · un mot toutes les 4 mesures · aperçu possible.":v==="hard"?"Mots plus rares · un mot toutes les 1 à 2 mesures · défis plus corsés.":"Vocabulaire mixte · un mot toutes les 2 mesures · surprise occasionnelle.";settings.bars=Number($("bars").value)||2}
function persistSettings(){settings.level=$("level").value;settings.duration=Number($("duration").value);settings.bpm=Math.max(60,Math.min(160,Number($("bpm").value)||90));settings.bars=Math.max(1,Math.min(8,Number($("bars").value)||2));settings.beat=$("beatChoice").value;settings.preview=$("previewNext").checked;settings.click=$("clickEnabled").checked;settings.zero=$("zeroMode").checked;settings.rhymeAssist=$("rhymeAssist").checked;settings.favoritePriority=$("favoritePriority").checked;try{localStorage.setItem("improRapSettings",JSON.stringify(settings))}catch{}}
let mediaRecorder=null,recordedChunks=[],recordingStartedAt=0,recordingStream=null,recordingDbPromise=null,activeRecordingUrl=null;
function recordingDb(){if(recordingDbPromise)return recordingDbPromise;recordingDbPromise=new Promise((resolve,reject)=>{if(!("indexedDB"in window)){reject(new Error("Le stockage audio n’est pas disponible dans ce navigateur."));return}const req=indexedDB.open("improRapAudio",1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains("recordings"))req.result.createObjectStore("recordings",{keyPath:"id",autoIncrement:true})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error("Ouverture du stockage impossible."))});return recordingDbPromise}
async function saveRecording(blob,duration){const db=await recordingDb();return new Promise((resolve,reject)=>{const tx=db.transaction("recordings","readwrite");tx.objectStore("recordings").add({blob,duration,createdAt:Date.now(),words:[...new Set(sessionWords)].slice(-10),mode:settings.mode});tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error("Enregistrement non sauvegardé."))})}
async function listRecordings(){const host=$("recordingsList");if(!host)return;try{const db=await recordingDb();const items=await new Promise((resolve,reject)=>{const tx=db.transaction("recordings","readonly"),req=tx.objectStore("recordings").getAll();req.onsuccess=()=>resolve((req.result||[]).filter(x=>x.kind!=="freestyle"));req.onerror=()=>reject(req.error)});host.replaceChildren();if(!items.length){host.textContent="Aucun enregistrement pour le moment.";return}items.sort((a,b)=>b.createdAt-a.createdAt).slice(0,20).forEach(item=>{const row=document.createElement("div");row.className="recording-item";const info=document.createElement("div"),title=document.createElement("b"),sub=document.createElement("small"),play=document.createElement("audio");title.textContent=new Date(item.createdAt).toLocaleString("fr-FR")+" · "+fmt(Math.round(item.duration/1000));sub.textContent=(MODES[item.mode]||"Impro")+" · "+(item.words||[]).join(", ");info.append(title,sub);play.controls=true;play.preload="none";play.setAttribute("aria-label","Écouter l’impro enregistrée");play.src=URL.createObjectURL(item.blob);row.append(info,play);host.append(row)})}catch(e){host.textContent=e.message||"Impossible de lire les enregistrements locaux."}}
async function startVoiceRecording(){if(mediaRecorder)return;try{if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw new Error("Cet iPhone/navigateur ne prend pas en charge l’enregistrement audio ici.");recordingStream=await navigator.mediaDevices.getUserMedia({audio:true});const mime=["audio/mp4","audio/webm;codecs=opus","audio/webm"].find(t=>window.MediaRecorder.isTypeSupported?.(t));mediaRecorder=mime?new MediaRecorder(recordingStream,{mimeType:mime}):new MediaRecorder(recordingStream);recordedChunks=[];recordingStartedAt=Date.now();mediaRecorder.ondataavailable=e=>{if(e.data?.size)recordedChunks.push(e.data)};mediaRecorder.onerror=()=>{$("recordStatus").textContent="Une erreur est survenue pendant l’enregistrement."};mediaRecorder.onstop=async()=>{const duration=Math.max(0,Date.now()-recordingStartedAt),blob=new Blob(recordedChunks,{type:mediaRecorder?.mimeType||"audio/webm"});recordingStream?.getTracks().forEach(t=>t.stop());recordingStream=null;mediaRecorder=null;$("recordBtn").disabled=false;$("stopRecordBtn").disabled=true;if(blob.size){try{await saveRecording(blob,duration);if(activeRecordingUrl)URL.revokeObjectURL(activeRecordingUrl);activeRecordingUrl=URL.createObjectURL(blob);$("recordPlayback").src=activeRecordingUrl;$("recordPlayback").hidden=false;$("recordStatus").textContent="Enregistrement sauvegardé sur cet appareil · "+fmt(Math.round(duration/1000))+".";await listRecordings()}catch(e){$("recordStatus").textContent=e.message||"Lecture disponible, mais sauvegarde impossible."}}};mediaRecorder.start();$("recordBtn").disabled=true;$("stopRecordBtn").disabled=false;$("recordStatus").textContent="Enregistrement en cours… appuie sur Arrêter quand tu as fini."}catch(e){recordingStream?.getTracks().forEach(t=>t.stop());recordingStream=null;mediaRecorder=null;$("recordStatus").textContent=e.message||"Micro inaccessible. Vérifie l’autorisation du navigateur."}}
function stopVoiceRecording(){if(mediaRecorder&&mediaRecorder.state!=="inactive")mediaRecorder.stop()}
function showView(which){$("homeView").hidden=which!=="home";$("gameView").hidden=which!=="game";$("summaryView").hidden=which!=="summary";if(which==="summary")listRecordings();window.scrollTo(0,0)}
async function requestWakeLock(){try{if("wakeLock"in navigator)wakeLock=await navigator.wakeLock.request("screen")}catch{wakeLock=null}}
function releaseWakeLock(){try{wakeLock?.release()}catch{}wakeLock=null}
function toggleFullscreen(){try{if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{})}catch{}}
function audioStart(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!audioCtx)audioCtx=new C();if(audioCtx.state==="suspended")audioCtx.resume();return audioCtx}catch{return null}}
function clickAt(time,accent){if(!settings.click||!audioCtx)return;try{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="sine";o.frequency.value=accent?1150:780;g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(accent?.09:.045,time+.006);g.gain.exponentialRampToValueAtTime(.0001,time+.045);o.connect(g);g.connect(audioCtx.destination);o.start(time);o.stop(time+.05)}catch{}}
function noiseAt(time,kind){if(!audioCtx)return;try{if(!noiseBuffer){noiseBuffer=audioCtx.createBuffer(1,audioCtx.sampleRate,audioCtx.sampleRate);const channel=noiseBuffer.getChannelData(0);for(let i=0;i<channel.length;i++)channel[i]=Math.random()*2-1}const source=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),gain=audioCtx.createGain(),duration=kind==="hat"?.028:.105;source.buffer=noiseBuffer;filter.type=kind==="hat"?"highpass":"bandpass";filter.frequency.value=kind==="hat"?7200:1900;filter.Q.value=kind==="hat"?.7:.8;gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(kind==="hat"?.035:.12,time+.003);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);source.connect(filter);filter.connect(gain);gain.connect(audioCtx.destination);source.start(time);source.stop(time+duration)}catch{}}
function drumAt(time,kind){if(!settings.click||!audioCtx)return;if(kind==="snare"||kind==="hat"){noiseAt(time,kind);return}try{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);if(kind==="kick"){o.type="sine";o.frequency.setValueAtTime(135,time);o.frequency.exponentialRampToValueAtTime(48,time+.13);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(.42,time+.008);g.gain.exponentialRampToValueAtTime(.0001,time+.16);o.start(time);o.stop(time+.17)}else if(kind==="snare"){o.type="triangle";o.frequency.setValueAtTime(210,time);o.frequency.exponentialRampToValueAtTime(95,time+.07);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(.16,time+.004);g.gain.exponentialRampToValueAtTime(.0001,time+.09);o.start(time);o.stop(time+.1)}else if(kind==="hat"){o.type="square";o.frequency.value=7800;g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(.025,time+.002);g.gain.exponentialRampToValueAtTime(.0001,time+.025);o.start(time);o.stop(time+.03)}else{o.type="sine";o.frequency.setValueAtTime(230,time);o.frequency.exponentialRampToValueAtTime(105,time+.08);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(.12,time+.004);g.gain.exponentialRampToValueAtTime(.0001,time+.1);o.start(time);o.stop(time+.11)}}catch{}}
function playVirtualBeat(time,step){if(!settings.click||!audioCtx)return;
 /* Moteur d'instrus repris de la version du 25/10 : batterie + basse + accords, swing et couleur propres à chaque style. */
 if(!vbMaster){vbMaster=audioCtx.createGain();vbMaster.gain.value=.8;const c=audioCtx.createDynamicsCompressor();vbMaster.connect(c);c.connect(audioCtx.destination)}
 vbCtx=audioCtx;vbOut=vbMaster;vbPattern(VB_STYLES[settings.beat]||VB_STYLES["virtual-boom"],settings.bpm,time,step);
}
/* Un temps (4 doubles-croches) d'instru VirtualBeat. Partagé par l'Impro et le Freestyle (29/10/2026). */
function vbPattern(st,bpm,time,step){
 const beatDur=60/bpm,sp=beatDur/4;
 if(step===0||vbRoot===null)vbRoot=57+[0,2,3,5,7,8,10][Math.floor(Math.random()*7)];
 for(let k=0;k<4;k++){
  const i=step*4+k,q=i%16,bar=Math.floor(i/16),t=time+k*sp+((q%2)?st.sw*sp:0),ch=st.pr[bar%4];
  if(st.k[q]==="x")vbTone(t,"sine",150,.4,1,0,42);
  if(st.s[q]==="x"){vbNoise(t,"bandpass",1800,.17,.7);vbTone(t,"triangle",190,.1,.35)}
  if(st.h[q]==="x")vbNoise(t,"highpass",7500,.05,.22*(q%4===0?1:.6));
  if(bar%4===3&&q>12&&Math.random()<.7){vbNoise(t,"bandpass",1800,.17,.42);vbTone(t,"triangle",190,.1,.21)}
  if(st.b[q]==="x")vbTone(t,st.long?"sine":st.w,vbFreq(vbRoot-24+ch),st.long?.9:.3,st.long?.9:.45,st.long?200:400);
  if(q===0||(st.stab&&(q===6||q===10)))st.q.forEach(n=>vbTone(t,st.w,vbFreq(vbRoot-12+ch+n),st.stab?.25:1.6,.07,st.lp));
  if(st.arp&&q%2===0&&Math.random()<.65){const sc=VB_SCALES[st.arp],n=sc[Math.floor(Math.random()*sc.length)];vbTone(t,"triangle",vbFreq(vbRoot+12+ch+n),.25,.09,2500)}
 }
}
function countdownInstruction(){const names={mot:"Place chaque mot dans ton flow.",chaine:"Prépare-toi à relier chaque mot au précédent.",rime:"Garde une famille de rimes en tête.",histoire:"Construis un récit : départ, problème, rebondissement, chute.",punchline:"Prépare une montée en tension et une chute toutes les 8 mesures.",chaos:"Reste prêt : une contrainte peut changer en plein flow."};return names[settings.mode]||names.mot}
function tick(){if(!running||!audioCtx)return;const now=audioCtx.currentTime,beatDur=60/settings.bpm;while(nextBeatTime<now+.12){if(settings.beat==="metro")clickAt(nextBeatTime,beatIndex%4===0);else if(settings.beat.startsWith("virtual-"))playVirtualBeat(nextBeatTime,beatIndex);else clickAt(nextBeatTime,beatIndex%4===0);const slot=beatIndex%4;document.querySelectorAll("#beatline span").forEach((s,i)=>s.classList.toggle("on",i===slot));if(beatIndex<INTRO_BEATS){const introBar=Math.floor(beatIndex/4);$("bigWord").textContent=String(INTRO_BARS-introBar);$("bigWord").classList.remove("empty-word");$("wordMeta").textContent="INTRO · mesure "+(introBar+1)+"/"+INTRO_BARS+" — "+countdownInstruction()}if(slot===0){barIndex++;if(customSession){if(!current&&beatIndex>=INTRO_BEATS)draw()}else if(barIndex>=INTRO_BARS+1&&((barIndex-INTRO_BARS-1)%Math.max(1,Number(settings.bars)||1)===0)){if(settings.mode==="rime"&&current&&barIndex<rimeHoldUntilBar){/* keep the rhyme target on screen */}else if(settings.mode==="punchline"&&barIndex-lastPunchlineBar>=8){lastPunchlineBar=barIndex;draw();const p=MODE_PROMPTS.punchline[Math.floor(randomValue()*MODE_PROMPTS.punchline.length)];$("wordMeta").textContent="PUNCHLINE · "+p.replaceAll("{word}",current);$("wordMeta").style.color="var(--pink)";setTimeout(()=>{if(running) $("wordMeta").style.color=""},1800)}else if(settings.mode==="chaos"&&randomValue()<.28){const turns=["VIRAGE : change de thème !","VIRAGE : passe au « je » !","VIRAGE : ralentis le flow !","VIRAGE : change d’émotion !","VIRAGE : raconte à l’envers !","VIRAGE : place une rime interne !","VIRAGE : parle au futur !","VIRAGE : fais une comparaison !"];const t=turns[Math.floor(randomValue()*turns.length)];$("wordMeta").textContent=t+" Cible à placer : "+current;$("wordMeta").style.color="var(--pink)";setTimeout(()=>{if(running){$("bigWord").style.color="";$("wordMeta").style.color=""}},1800)}else draw()}}beatIndex++;nextBeatTime+=beatDur}raf=requestAnimationFrame(tick)}
const INTRO_BARS=4,INTRO_BEATS=INTRO_BARS*4;let introSeconds=0;
function fmt(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
function updateClock(){if(!running)return;const total=(Date.now()-sessionStart-totalPaused)/1000;if(total<introSeconds){$("timeLeft").textContent="Intro "+fmt(introSeconds-total);$("roundProgress").style.width=(total/introSeconds*100)+"%";roundTimer=setTimeout(updateClock,200);return}const elapsed=total-introSeconds;const rem=sessionDuration?Math.max(0,sessionDuration-elapsed):0;$("timeLeft").textContent=sessionDuration?fmt(rem):fmt(elapsed);$("roundProgress").style.width=sessionDuration?Math.min(100,elapsed/sessionDuration*100)+"%":"0%";if(sessionDuration&&rem<=0)finishSession();else roundTimer=setTimeout(updateClock,200)}
async function launch(){persistSettings();if(settings.rhymeAssist!==false)loadLexiqueRimes();if(!challengeActive)challengeSeed=null;current="";previousWord="";promptStep=0;historySeeds=[];rimeHoldUntilBar=0;lastPunchlineBar=0;sessionWords=[];wordTimes=[];recent=[];makeDeck();ended=false;sessionStart=Date.now();totalPaused=0;sessionDuration=settings.duration;beatIndex=0;barIndex=0;nextWordBar=0;gameStarted=true;running=true;$("stage").classList.toggle("zero-distraction",settings.zero);$("sessionMeta").textContent=(challengeActive?"DÉFI DU JOUR · ":"")+settings.bpm+" BPM · "+(BEAT_LABELS[settings.beat]||"Métronome")+" · mot toutes les "+settings.bars+" mesure(s) · "+MODES[settings.mode];$("gameTheme").textContent=BANK[settings.theme]?.label||"Mélange surprise";const focusBanner=$("focusBanner");if(focusBanner)focusBanner.textContent=customSession?"10 mots pour une impro · place chaque mot dans ton flow.":(MODES[settings.mode]||MODES.mot)+" "+(FOCUS_HINTS[settings.mode]||FOCUS_HINTS.mot);$("bigWord").classList.add("empty-word");$("bigWord").textContent=String(INTRO_BARS);$("wordMeta").textContent="INTRO · "+INTRO_BARS+" mesures";renderRhymeHelper("");$("timeLeft").textContent=sessionDuration?fmt(sessionDuration):"∞";$("pauseBtn").textContent="Ⅱ Pause";showView("game");requestWakeLock();toggleFullscreen();audioStart();if(audioCtx){try{await audioCtx.resume()}catch(e){}}introSeconds=0;if(!audioCtx||audioCtx.state!=="running"){$("wordMeta").textContent="Mode sans métronome : la session est lancée. Utilise « Mot suivant » pour avancer.";draw()}else{nextBeatTime=audioCtx.currentTime+.15;introSeconds=(Date.now()-sessionStart)/1000+.15+INTRO_BEATS*60/settings.bpm;raf=requestAnimationFrame(tick)}updateClock()}
function pauseGame(){if(!running)return;running=false;pausedAt=Date.now();if(roundTimer)clearTimeout(roundTimer);if(raf)cancelAnimationFrame(raf);$("pauseBtn").textContent="▶ Reprendre";$("wordMeta").textContent="En pause · reprends quand tu veux";releaseWakeLock();if(audioCtx&&audioCtx.state==="running")audioCtx.suspend().catch(()=>{})}
function resumeGame(){if(running)return;running=true;totalPaused+=Date.now()-pausedAt;$("pauseBtn").textContent="Ⅱ Pause";requestWakeLock();if(audioCtx){audioCtx.resume().catch(()=>{});nextBeatTime=audioCtx.currentTime+.08;raf=requestAnimationFrame(tick)}updateClock()}
function nextManual(){if(!running)return;if(customSession){customNext();return}draw()}function customNext(){if(!running||!current)return;data.placed=(data.placed||0)+1;data.placedWords=data.placedWords||{};data.placedWords[current]=(data.placedWords[current]||0)+1;save();if(sessionWords.length>=10){finishSession();return}draw()}
function finishSession(){if(ended)return;if(mediaRecorder&&mediaRecorder.state!=="inactive")stopVoiceRecording();const stoppedAt=Date.now();const pausedNow=running?0:Math.max(0,stoppedAt-pausedAt);const elapsed=Math.max(0,Math.round((stoppedAt-sessionStart-totalPaused-pausedNow)/1000-introSeconds));const finishedEarly=sessionDuration>0&&elapsed<sessionDuration-1;ended=true;reviewOnly=false;running=false;if(roundTimer)clearTimeout(roundTimer);if(raf)cancelAnimationFrame(raf);releaseWakeLock();if(audioCtx)audioCtx.suspend().catch(()=>{});data.sessions=(data.sessions||0)+1;data.words=(data.words||0)+sessionWords.length;const today=localDateKey();if(data.lastDay!==today){const y=localDateKey(new Date(Date.now()-86400000));data.streak=data.lastDay===y?(data.streak||0)+1:1;data.lastDay=today}data.lastSessionWords=[...new Set(sessionWords)].slice(-12);save();$("sumWords").textContent=sessionWords.length;$("sumTime").textContent=fmt(elapsed);$("sumStreak").textContent=data.streak||1;$("summaryLine").textContent=sessionWords.length?(finishedEarly?"Impro arrêtée à ton signal : "+fmt(elapsed)+" au chrono, sans attendre la fin prévue.":"Tu as traversé "+sessionWords.length+" mots. À toi de choisir ceux qui t'ont résisté."):"Chaque session commence quelque part.";const wr=$("wordRatings");wr.innerHTML="";[...new Set(sessionWords)].slice(-8).reverse().forEach(w=>{const row=document.createElement("div");row.className="rating-row";const span=document.createElement("span");span.textContent=w;const good=document.createElement("button");good.textContent="Placé";good.setAttribute("aria-label","Marquer "+w+" comme placé");const bad=document.createElement("button");bad.textContent="Raté";bad.setAttribute("aria-label","Marquer "+w+" comme raté");const lockRating=()=>{good.disabled=true;bad.disabled=true};good.addEventListener("click",()=>{lockRating();good.textContent="✓ Placé";data.placed=(data.placed||0)+1;data.placedWords=data.placedWords||{};data.placedWords[w]=(data.placedWords[w]||0)+1;if(data.missed&&data.missed[w]){data.missed[w]=Math.max(0,data.missed[w]-1);if(!data.missed[w])delete data.missed[w]}save()});bad.addEventListener("click",()=>{lockRating();bad.textContent="À retravailler";data.missed=data.missed||{};data.missed[w]=(data.missed[w]||0)+1;save()});if(customSession){good.textContent="✓ Placé";good.disabled=true;bad.disabled=true}const fav=document.createElement("button");const syncFav=()=>{fav.textContent=isFavorite(w)?"★ Favori":"☆ Favori";fav.setAttribute("aria-pressed",String(isFavorite(w)));};syncFav();fav.setAttribute("aria-label",(isFavorite(w)?"Retirer ":"Ajouter ")+w+" des favoris");fav.addEventListener("click",()=>{data.favorites=data.favorites||[];if(data.favorites.includes(w))data.favorites=data.favorites.filter(x=>x!==w);else data.favorites.push(w);save();syncFav();fav.setAttribute("aria-label",(isFavorite(w)?"Retirer ":"Ajouter ")+w+" des favoris");renderStats()});row.append(span,good,bad,fav);wr.append(row)});renderStats();showView("summary")}
function renderStats(){ $("statSessions").textContent=data.sessions||0;$("statWords").textContent=data.words||0;$("statDays").textContent=data.streak||0;const el=$("favorites");el.innerHTML="";const fav=data.favorites||[];if(!fav.length){el.innerHTML='<span class="empty-note">Tes favoris apparaîtront ici.</span>';return}fav.forEach(w=>{const b=document.createElement("button");b.className="favorite-chip";b.textContent="★ "+w;b.title="Retirer des favoris";b.addEventListener("click",()=>{data.favorites=fav.filter(x=>x!==w);save();renderStats()});el.append(b)})}
function isFavorite(w){return (data.favorites||[]).includes(w)}
function addFavorite(){if(!current)return;data.favorites=data.favorites||[];if(data.favorites.includes(current)){data.favorites=data.favorites.filter(w=>w!==current);$("favoriteWord").textContent="☆";$("favoriteWord").setAttribute("aria-label","Ajouter aux favoris")}else{data.favorites.push(current);$("favoriteWord").textContent="★";$("favoriteWord").setAttribute("aria-label","Retirer des favoris")}save();renderStats()}
async function shareChallenge(){const url=location.href.split("?")[0]+"?defi="+localDateKey();const text="Mon défi du jour sur IMPRO DE RAP : 3 minutes, niveau technique. À toi de jouer ! "+url;try{if(navigator.share)await navigator.share({title:"IMPRO DE RAP — défi du jour",text,url});else if(navigator.clipboard){await navigator.clipboard.writeText(text);$("shareBtn").textContent="Lien copié ✓"}else prompt("Copie ce lien pour partager le défi :",url)}catch(e){if(e.name!=="AbortError")prompt("Copie ce lien pour partager le défi :",url)}}
function goHome(){if(running)pauseGame();customSession=false;showView("home");renderStats()}
function onStagePointerDown(){longPressFired=false;clearTimeout(longPressTimer);longPressTimer=setTimeout(()=>{longPressFired=true;if(running)pauseGame();else resumeGame()},600)}
function onStagePointerUp(){clearTimeout(longPressTimer);if(longPressFired)return;const now=Date.now();if(now-lastTap<320){nextManual();lastTap=0}else lastTap=now}
document.querySelectorAll("[data-theme]").forEach(b=>b.addEventListener("click",()=>chooseTheme(b.dataset.theme)));document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>chooseMode(b.dataset.mode)));document.querySelectorAll("[data-session-mode]").forEach(b=>b.addEventListener("click",()=>{const custom=b.dataset.sessionMode==="custom";document.querySelectorAll("[data-session-mode]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));$("customModePanel").hidden=!custom;$("freeOptions").hidden=custom;}));$("level").addEventListener("change",()=>{settings.level=$("level").value;applyLevel()});$("focusMode").addEventListener("change",()=>chooseMode($("focusMode").value));$("rhymeAssist").addEventListener("change",()=>{settings.rhymeAssist=$("rhymeAssist").checked;if(current)renderRhymeHelper(current);persistSettings()});
$("launch").addEventListener("click",()=>{customSession=false;launch()});$("quickWarm").addEventListener("click",()=>{customSession=false;$("duration").value="180";$("level").value="easy";$("bpm").value=String((VB_STYLES[$("beatChoice").value]||{}).bpm||90);$("bars").value="4";chooseMode("mot");applyLevel();$("bars").value="4";launch()});$("quickSession").addEventListener("click",()=>{customSession=false;$("duration").value="600";$("level").value="mixed";$("bpm").value=String((VB_STYLES[$("beatChoice").value]||{}).bpm||95);$("bars").value="2";chooseMode("mot");applyLevel();$("bars").value="2";launch()});function startDailyChallenge(day=localDateKey()){let seed=[...day].reduce((a,c)=>((a*31)+c.charCodeAt(0))>>>0,7);challengeSeed=seed||1;challengeActive=true;const themes=Object.keys(BANK);chooseTheme(themes[seed%themes.length]);chooseMode("chaos");$("duration").value="180";$("level").value="hard";$("bpm").value=85+seed%16;$("bars").value="2";applyLevel();$("bars").value="2";launch()}
$("quickChallenge").addEventListener("click",()=>{customSession=false;startDailyChallenge()});
function startReviewSession(){customSession=false;const missed=data.missed||{};if(!Object.values(missed).some(n=>n>0)){alert("Aucun mot à retravailler pour le moment. Termine une session et marque les mots difficiles avec « Raté ».");return}reviewOnly=true;challengeActive=false;challengeSeed=null;chooseTheme("mix");chooseMode("mot");$("level").value="mixed";$("duration").value="180";$("bpm").value=String((VB_STYLES[$("beatChoice").value]||{}).bpm||90);$("bars").value="1";applyLevel();$("bars").value="1";launch()}
$("quickReview").addEventListener("click",startReviewSession);
function parseCustomWords(){return $("customWordsInput").value.split(/[\n,;]+/).map(w=>w.trim()).filter(Boolean).slice(0,11)}
function startCustomSession(){$("beatChoice").value=$("customBeat").value;$("quickBeatChoice").value=$("customBeat").value;$("bpm").value=String(Math.max(60,Math.min(160,Number($("customBpm").value)||90)));const words=parseCustomWords();$("customWordsCount").textContent=words.length+" / 10 mots";if(words.length!==10){alert("Il faut exactement 10 mots. Mets un mot par ligne ou sépare-les par des virgules.");return}customWords=words;customSession=true;reviewOnly=false;challengeActive=false;challengeSeed=null;settings.theme="mix";settings.mode="mot";settings.level=document.querySelector('input[name="customHelp"]:checked').value==="easy"?"easy":"mixed";settings.rhymeAssist=document.querySelector('input[name="customHelp"]:checked').value==="easy";$("rhymeAssist").checked=settings.rhymeAssist;settings.duration=0;settings.bpm=Math.max(60,Math.min(160,Number($("bpm").value)||90));settings.bars=1;settings.preview=false;settings.zero=false;$("duration").value="0";$("level").value=settings.level;$("bars").value="1";chooseTheme("mix");chooseMode("mot");launch()}
$("customWordsInput").addEventListener("input",()=>{const n=parseCustomWords().length;$("customWordsCount").textContent=Math.min(n,10)+" / 10 mots"+(n>10?" · trop de mots":"")});$("startCustom").addEventListener("click",startCustomSession);
$("recordBtn").addEventListener("click",startVoiceRecording);$("stopRecordBtn").addEventListener("click",stopVoiceRecording);$("pauseBtn").addEventListener("click",()=>running?pauseGame():resumeGame());$("nextGameWord").addEventListener("click",nextManual);$("favoriteWord").addEventListener("click",addFavorite);$("shareBtn").addEventListener("click",shareChallenge);$("finishBtn").addEventListener("click",finishSession);$("finishNowBtn").addEventListener("click",finishSession);$("backSetup").addEventListener("click",goHome);$("againBtn").addEventListener("click",launch);$("homeBtn").addEventListener("click",goHome);
$("stage").addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;onStagePointerDown()});["pointerup","pointercancel"].forEach(e=>$("stage").addEventListener(e,eve=>{if(eve.target.closest("button")){clearTimeout(longPressTimer);return}onStagePointerUp()}));$("stage").addEventListener("pointerleave",()=>clearTimeout(longPressTimer));$("clearData").addEventListener("click",()=>{if(confirm("Effacer les favoris, bilans et réglages enregistrés sur cet appareil ?")){try{localStorage.removeItem("improRapData");localStorage.removeItem("improRapSettings")}catch{}data={};renderStats()}});
document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.nav==="beats"||b.dataset.nav==="me"){if($("setupGrid").hidden)$("customizeBtn").click();const target=b.dataset.nav==="beats"?$("beatChoice"):$("clearData");setTimeout(()=>target.scrollIntoView({behavior:"smooth",block:"center"}),80)}else window.scrollTo({top:0,behavior:"smooth"})}));
document.addEventListener("keydown",e=>{if($("gameView")?.hidden||["INPUT","TEXTAREA","SELECT","BUTTON"].includes(document.activeElement?.tagName)||document.activeElement?.isContentEditable||e.altKey||e.ctrlKey||e.metaKey)return;if(e.code==="Space"){e.preventDefault();running?pauseGame():resumeGame()}else if(e.key==="ArrowRight"){e.preventDefault();nextManual()}else if(e.key==="Escape"){e.preventDefault();finishSession()}});document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&running)pauseGame();else if(document.visibilityState==="visible"&&running)requestWakeLock()});window.addEventListener("pagehide",()=>{releaseWakeLock();if(raf)cancelAnimationFrame(raf);if(roundTimer)clearTimeout(roundTimer)});

if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(reg=>reg.update()).catch(()=>{}))}
const challengeParam=new URLSearchParams(location.search).get("defi");loadSettings();const quickBeat=$("quickBeatChoice"),mainBeat=$("beatChoice");quickBeat.value=mainBeat.value;quickBeat.addEventListener("change",()=>{mainBeat.value=quickBeat.value;persistSettings()});mainBeat.addEventListener("change",()=>{quickBeat.value=mainBeat.value});renderStats();listRecordings();$("customizeBtn").addEventListener("click",()=>{const panel=$("setupGrid"),open=panel.hidden;panel.hidden=!open;$("customizeBtn").setAttribute("aria-expanded",String(open));$("customizeBtn").textContent=open?"✕ Masquer les réglages":"⚙ Personnaliser ma session";if(open)panel.scrollIntoView({behavior:"smooth",block:"start"})});if(challengeParam&&/^\d{4}-\d{2}-\d{2}$/.test(challengeParam)){setTimeout(()=>startDailyChallenge(challengeParam),0)}

/* ---- Accueil et Freestyle (repris de la version du 25/10, fusion du 28/10/2026) ---- */

const showPage=id=>{["homeStart","freestyle","improApp"].forEach(k=>$(k).classList.toggle("hide",k!==id));window.scrollTo(0,0)};
$("enterImpro").onclick=()=>{showPage("improApp");loadLexiqueRimes()};
$("enterFreestyle").onclick=()=>showPage("freestyle");
$("improHome").onclick=()=>{goHome();showPage("homeStart")};
$("freeHome").onclick=()=>{stopFreeScroll();stopFreeBeat();document.body.classList.remove("freestyle-live");$("freeLiveTop").classList.add("hide");showPage("homeStart")};
let freeVbBus=null,freeVbComp=null;
let freeFrame=0,freeLast=0,freeScrollRemainder=0,freeScrollPosition=0,freeScrolling=false,freePaused=false,freeFileAudio=null,freeSynth=false,freeBeatTimer=null,freeBeatFrame=0,freeBeatIndex=0,freeBeatNext=0,freeBeatContext=null,freeBeatGain=null,freeBeatSource=null;
function freeStatus(t,live=false){$("freeStatus").textContent=t;$("freeStatus").classList.toggle("live",live)}
function syncFreePreview(reset=true){const text=$("freeText").value.trim();$("freeScroll").textContent=text||"Ton texte apparaîtra ici…";if(reset){freeScrollPosition=0;freeScrollRemainder=0;$("freeScroll").scrollTop=0;requestAnimationFrame(()=>{$("freeScroll").scrollTop=0})}}
const FREE_TEXTS_KEY="impro-de-rap-text-library-v1";
function getFreeTexts(){try{const a=JSON.parse(localStorage.getItem(FREE_TEXTS_KEY)||"[]");return Array.isArray(a)?a.filter(x=>x&&typeof x.title==="string"&&typeof x.text==="string"):[]}catch(e){return []}}
function refreshFreeTexts(selected=""){const list=$("freeSavedTexts"),items=getFreeTexts();list.innerHTML='<option value="">Choisir un texte…</option>'+items.map((x,i)=>'<option value="'+i+'">'+escapeFreeText(x.title)+'</option>').join("");if(selected!==""&&items[+selected])list.value=String(selected);$("freeDeleteText").disabled=list.value==="";$("freeLoadText").disabled=list.value==="";if(!items.length){list.innerHTML='<option value="">Aucun texte enregistré</option>';}}
function escapeFreeText(t){return t.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("freeSaveText").onclick=()=>{const text=$("freeText").value.trim(),title=$("freeTextTitle").value.trim()||("Texte "+(getFreeTexts().length+1));if(!text){freeStatus("Écris ou colle un texte avant de l’enregistrer.");return}const items=getFreeTexts();items.push({title,text,updatedAt:Date.now()});try{localStorage.setItem(FREE_TEXTS_KEY,JSON.stringify(items));refreshFreeTexts(String(items.length-1));freeStatus("Texte enregistré dans ta bibliothèque.")}catch(e){freeStatus("Impossible d’enregistrer : l’espace de stockage du navigateur est peut-être plein.")}};
$("freeSavedTexts").onchange=()=>{const ok=$("freeSavedTexts").value!=="";$("freeDeleteText").disabled=!ok;$("freeLoadText").disabled=!ok};
$("freeLoadText").onclick=()=>{const i=$("freeSavedTexts").value,items=getFreeTexts();if(i===" "||i===""||!items[+i])return;stopFreeScroll();$("freeText").value=items[+i].text;$("freeTextTitle").value=items[+i].title;syncFreePreview(true);freeStatus("Texte chargé. Tu peux le modifier ou lancer le freestyle.")};
$("freeDeleteText").onclick=()=>{const i=$("freeSavedTexts").value,items=getFreeTexts();if(i===""||!items[+i])return;items.splice(+i,1);try{localStorage.setItem(FREE_TEXTS_KEY,JSON.stringify(items));refreshFreeTexts();freeStatus("Texte supprimé de la bibliothèque.")}catch(e){freeStatus("Impossible de mettre à jour la bibliothèque.")}};
$("freeText").addEventListener("input",()=>{if(!freeScrolling)syncFreePreview(true)});
refreshFreeTexts();
$("freeSpeed").addEventListener("input",()=>$("freeSpeedValue").textContent=$("freeSpeed").value+" px/s");
$("freeBeat").addEventListener("change",()=>{
 const mode=$("freeBeat").value;$("freeFileBox").classList.toggle("hide",mode!=="file");$("freeBpmBox").classList.toggle("hide",mode==="none"||mode==="file");
 stopFreeBeat();$("freeAudioPreview").innerHTML="";
 if(mode==="file"&&freeFileAudio){const a=document.createElement("audio");a.controls=true;a.src=freeFileAudio.src;$("freeAudioPreview").append(a)}
});
$("freeFile").addEventListener("change",e=>{
 const f=e.target.files&&e.target.files[0];if(!f)return;stopFreeBeat();if(freeFileAudio){URL.revokeObjectURL(freeFileAudio.src)}freeFileAudio=new Audio(URL.createObjectURL(f));freeFileAudio.loop=true;freeFileAudio.volume=(+$("freeVol").value)/100;
 const preview=document.createElement("audio");preview.controls=true;preview.src=freeFileAudio.src;$("freeAudioPreview").replaceChildren(preview);
});
$("freeVol").addEventListener("input",()=>{if(freeFileAudio)freeFileAudio.volume=(+$("freeVol").value)/100;if(freeBeatGain&&freeBeatContext)freeBeatGain.gain.setTargetAtTime((+$("freeVol").value)/100,freeBeatContext.currentTime,.03)});
function scheduleFreeBeat(){if(!freeSynth||!freeBeatContext)return;const st=VB_STYLES[$("freeBeat").value]||VB_STYLES["virtual-boom"],bpm=Math.max(60,Math.min(170,+$("freeBpm").value||90)),beat=60/bpm;while(freeBeatNext<freeBeatContext.currentTime+.12){vbCtx=freeBeatContext;vbOut=freeVbBus;vbPattern(st,bpm,freeBeatNext,freeBeatIndex);freeBeatNext+=beat;freeBeatIndex++}}
async function startFreeBeat(){
 const mode=$("freeBeat").value;if(mode==="none")return;
 if(mode==="file"){if(!freeFileAudio){freeStatus("Choisis d’abord ton fichier audio.");return}try{freeFileAudio.currentTime=0;freeFileAudio.volume=(+$("freeVol").value)/100;await freeFileAudio.play()}catch(e){freeStatus("Impossible de lire le fichier audio. Appuie à nouveau sur Lancer.");}return}
 try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC){freeStatus("Le navigateur ne prend pas en charge l’instrumentale intégrée.");return}freeBeatContext=freeBeatContext||new AC();await freeBeatContext.resume();if(freeBeatGain)freeBeatGain.disconnect();freeBeatGain=freeBeatContext.createGain();freeBeatGain.gain.value=(+$("freeVol").value)/100;freeBeatGain.connect(freeBeatContext.destination);if(!freeVbBus){freeVbBus=freeBeatContext.createGain();freeVbBus.gain.value=.8;freeVbComp=freeBeatContext.createDynamicsCompressor();freeVbBus.connect(freeVbComp)}try{freeVbComp.disconnect()}catch(e){}freeVbComp.connect(freeBeatGain);if(typeof freeRecTap==="function")freeRecTap();freeBeatIndex=0;freeBeatNext=freeBeatContext.currentTime+.05;freeSynth=true;scheduleFreeBeat();freeBeatTimer=setInterval(scheduleFreeBeat,25)}catch(e){freeStatus("Impossible de lancer l’instru intégrée. Réessaie.")}}
function stopFreeBeat(){freeSynth=false;if(freeBeatTimer){clearInterval(freeBeatTimer);freeBeatTimer=null}if(freeFileAudio){freeFileAudio.pause();try{freeFileAudio.currentTime=0}catch(e){}}if(freeBeatContext&&freeBeatContext.state==="running")freeBeatContext.suspend().catch(()=>{});if(freeBeatGain){try{freeBeatGain.disconnect()}catch(e){}}}
function stopFreeScroll(){freeScrolling=false;freePaused=false;if(freeFrame)cancelAnimationFrame(freeFrame);freeFrame=0;freeLast=0;freeScrollRemainder=0;$("freePause").textContent="Ⅱ Pause"}
function freeScrollFrame(now){if(!freeScrolling||freePaused)return;const view=$("freeScroll"),dt=freeLast?Math.max(0,(now-freeLast)/1000):0;freeLast=now;freeScrollRemainder+=dt*(+$("freeSpeed").value||35);const wholePixels=Math.floor(freeScrollRemainder);if(wholePixels>0){freeScrollPosition+=wholePixels;freeScrollRemainder-=wholePixels;view.scrollTop=freeScrollPosition}if(view.scrollTop+view.clientHeight>=view.scrollHeight-1){stopFreeScroll();freeStatus("Fin du texte. Tu peux revenir au début ou relancer.");return}freeFrame=requestAnimationFrame(freeScrollFrame)}
$("freeStart").onclick=async()=>{
 if(!$("freeText").value.trim()){freeStatus("Colle ou écris ton texte avant de lancer.");return}
 stopFreeScroll();stopFreeBeat();if($("freeScroll").textContent!==$("freeText").value.trim())syncFreePreview(true);freeScrollPosition=$("freeScroll").scrollTop;freeScrollRemainder=0;document.body.classList.add("freestyle-live");$("freeLiveTop").classList.remove("hide");freeScrolling=true;freePaused=false;$("freePause").textContent="Ⅱ Pause";freeStatus("Défilement en cours… ajuste la vitesse quand tu veux.",true);
 await startFreeBeat();if(!freeScrolling)return;freeLast=0;freeFrame=requestAnimationFrame(freeScrollFrame)
};
$("freePause").onclick=()=>{
 if(freeScrolling&&!freePaused){freePaused=true;if(freeFrame)cancelAnimationFrame(freeFrame);freeFrame=0;if(freeBeatContext&&freeSynth)freeBeatContext.suspend().catch(()=>{});if(freeFileAudio)freeFileAudio.pause();$("freePause").textContent="▶ Reprendre";freeStatus("En pause. Appuie sur Reprendre pour continuer.")}
 else if(freeScrolling&&freePaused){freePaused=false;freeLast=0;if(freeBeatContext&&freeSynth)freeBeatContext.resume().then(scheduleFreeBeat).catch(()=>{});if(freeFileAudio&&$("freeBeat").value==="file")freeFileAudio.play().catch(()=>{});$("freePause").textContent="Ⅱ Pause";freeStatus("Défilement en cours…",true);freeFrame=requestAnimationFrame(freeScrollFrame)}
};
$("freeReset").onclick=()=>{stopFreeScroll();freeScrollPosition=0;freeScrollRemainder=0;const view=$("freeScroll");view.scrollTop=0;requestAnimationFrame(()=>{view.scrollTop=0;freeScrollPosition=0});freeStatus("Texte replacé au début. Appuie sur Lancer pour recommencer.")};
$("freeStop").onclick=()=>{stopFreeScroll();stopFreeBeat();document.body.classList.remove("freestyle-live");$("freeLiveTop").classList.add("hide");freeScrollPosition=$("freeScroll").scrollTop;freeScrollRemainder=0;freeStatus("Lecture arrêtée. Ton texte est conservé à cette position.")};
$("freeExitLive").onclick=()=>{document.body.classList.remove("freestyle-live");$("freeLiveTop").classList.add("hide")};
$("freeBpm").addEventListener("change",()=>{$("freeBpm").value=Math.max(60,Math.min(170,+$("freeBpm").value||90))});

/* ---- Freestyle : générateur de texte, défilement au tempo, mode mémoire, mode relais (29/10/2026) ---- */
const GEN_UNIVERSES={
 ego:{label:"ego trip",brief:"affirme ton talent et ta plume avec des comparaisons inattendues, sans te prendre trop au sérieux",img:["le micro","la plume","le studio à trois heures du matin","le premier rang","les projecteurs","la feuille raturée","le casque sur les oreilles","la prise unique","le carnet de rimes","la foule qui reprend"],anchors:["micro","plume","flow","scène","couronne","talent","sommet","niveau","légende","carnet"]},
 rue:{label:"street et quartier",brief:"raconte le quartier de l’intérieur, avec des détails vrais, sans le glorifier",img:["le hall du bâtiment","la cage d’escalier","le bitume","les lampadaires","le dernier métro","le banc du square","les rideaux de fer","le snack du coin","la dalle","les sirènes au loin"],anchors:["quartier","béton","bitume","trottoir","escalier","sirène","métro","bâtiment","square","rue"]},
 amour:{label:"amour",brief:"parle d’une personne précise, avec des souvenirs concrets plutôt que de grands mots",img:["ton sourire","le premier rendez-vous","les messages à minuit","la gare du départ","ton parfum sur ma veste","nos photos","les silences","la promesse","la clé de chez nous","le quai du RER"],anchors:["cœur","promesse","sourire","regard","souvenir","toujours","tendresse","confiance","amour","baiser"]},
 conscient:{label:"rap conscient",brief:"dénonce une injustice précise, avec des faits et des images, pas des slogans",img:["la fiche de paie","la file à la préfecture","les écrans du 20 h","les promesses électorales","les loyers qui montent","l’usine fermée","les manuels d’histoire","les gros titres","le bulletin de vote","la frontière"],anchors:["justice","système","liberté","vérité","mémoire","frontière","pouvoir","silence","peuple","combat"]},
 introspection:{label:"introspection",brief:"regarde-toi en face : tes doutes, tes contradictions, ce que tu caches",img:["le miroir de la salle de bain","le plafond à quatre heures du matin","le carnet de doutes","la buée sur la vitre","l’ombre dans le couloir","le téléphone éteint","les cicatrices","le reflet dans la vitrine","la page blanche","le silence de la chambre"],anchors:["miroir","doute","silence","ombre","reflet","faiblesse","passé","conscience","solitude","vérité"]},
 racines:{label:"famille et racines",brief:"rends hommage à ta famille et à tes origines avec des détails du quotidien",img:["les mains de ma mère","le vieux qui rentre de l’usine","le thé du dimanche","la valise du bled","les photos jaunies","l’accent des anciens","la table trop petite","le prénom qu’on m’a donné","la langue des parents","la maison du grand-père"],anchors:["famille","racine","héritage","mère","père","origine","exil","mémoire","maison","sang"]},
 charbon:{label:"charbon et réussite",brief:"montre le chemin de la galère à la réussite : sacrifices, discipline, premières victoires",img:["le réveil à cinq heures","les heures sup","le compte à découvert","le premier contrat","les nuits au studio","les portes fermées","la chaise vide au repas","le carnet de comptes","le CV refusé","la première paie"],anchors:["travail","sacrifice","effort","réussite","discipline","victoire","sommet","patience","fortune","combat"]},
 hommage:{label:"hommage et mémoire",brief:"parle des absents et des anciens, avec pudeur et des souvenirs précis",img:["la photo sur le frigo","le banc où il s’asseyait","le dernier message","sa voix sur le répondeur","les fleurs du cimetière","son rire dans le couloir","la veste qu’il portait","les mots qu’on n’a pas dits","la date entourée","la bougie"],anchors:["mémoire","absence","souvenir","silence","ciel","adieu","lumière","héritage","éternité","larme"]},
 clash:{label:"battle et clash",brief:"des punchlines contre un adversaire imaginaire : jeux de mots et comparaisons, sans insultes",img:["le cercle","le chrono","l’adversaire en face","le public qui hurle","la dernière réplique","le micro qu’on se passe","la punchline qui tombe","le jury","le round final","les regards"],anchors:["punchline","adversaire","défaite","victoire","cercle","round","réplique","micro","niveau","terrain"]},
 story:{label:"storytelling",brief:"raconte une histoire avec un personnage, un lieu, un problème et une chute",img:["la gare de nuit","le gars en capuche","la lettre jamais envoyée","la voiture garée","la porte qui claque","le coup de fil","la pluie sur le pare-brise","la valise","le rendez-vous manqué","le dernier train"],anchors:["histoire","destin","chemin","personnage","nuit","rencontre","secret","départ","retour","fin"]}
};
const GEN_MOODS={
 fierte:{label:"fierté",brief:"tête haute, fier du chemin et des siens",lead:["Je lève la tête","Je marche droit","J’ai rien lâché","Je tiens debout","Je signe en grand","Je viens d’en bas"]},
 rage:{label:"rage",brief:"colère froide et précise, pas de cris gratuits",lead:["J’ai la rage au ventre","Ça bout dans mes veines","Je serre les poings","Trop de silence","J’ai trop attendu","Je hausse le ton"]},
 dalle:{label:"la dalle (faim de réussir)",brief:"urgence, envie de tout prendre, énergie",lead:["J’ai la dalle","Je veux ma part","Pas le temps de dormir","Je charbonne encore","J’arrive en courant","Rien ne m’arrête"]},
 revanche:{label:"revanche",brief:"prendre sa revanche sur ceux qui ne croyaient pas en toi",lead:["Ils riaient hier","On m’a dit jamais","Regarde-moi maintenant","J’ai gardé la liste","Ils m’ont fermé la porte","Le vent a tourné"]},
 froid:{label:"froid et posé",brief:"calme, assurance tranquille, phrases courtes et menaçantes",lead:["Calme et posé","Pas un mot de trop","Je parle bas","Le regard fixe","Sang-froid","Je compte en silence"]},
 melancolie:{label:"mélancolie",brief:"tristesse douce, images de nuit et de pluie",lead:["Le ciel est bas","J’écris sous la pluie","Le temps s’efface","J’ai le cœur en hiver","La nuit me parle","Je compte les heures"]},
 nostalgie:{label:"nostalgie",brief:"souvenirs d’avant, détails d’époque",lead:["Je repense à hier","C’était le bon temps","Les souvenirs remontent","On était petits","Je revois la scène","Tout revient d’un coup"]},
 espoir:{label:"espoir",brief:"lumière au bout du tunnel, sans naïveté",lead:["Demain s’éclaire","Je crois encore","Une lueur se lève","On va s’en sortir","J’ouvre la fenêtre","Je vois plus loin"]},
 humour:{label:"second degré",brief:"autodérision et images absurdes, sans perdre le flow",lead:["Me regarde pas comme ça","Même mon chat rigole","J’ai glissé sur ma rime","Mon voisin danse encore","J’ai perdu mes clés","Je rappe en chaussons"]}
};
const GEN_TEMPLATES=[
 "{I} sous mes pas, un seul mot : {R}",
 "{L} — on me parle de {I}, moi je pense « {R} »",
 "Entre {I} et {I2}, je pose : {R}",
 "{L}, et le refrain me souffle « {R} »",
 "{I} dans la tête, sur la langue : {R}",
 "Chaque mesure me rapproche, au bout : {R}",
 "{L}, j’écris, je rature, je garde « {R} »",
 "J’ai cherché {I}, j’ai trouvé : {R}",
 "Sous {I}, ma voix tape fort, mot d’ordre : {R}",
 "{L}, et tout le monde répète « {R} »",
 "{I}, {I2}, et pour finir : {R}",
 "Retiens bien ça, gravé sur {I} : {R}"
];
const GEN_EXTRA_TEMPLATES=["{L}, j’ai mis « {X} » dans la balance, résultat : {R}","Avec « {X} » en poche, je file vers « {R} »","« {X} » en tête de liste, en bout de ligne : {R}"];
function genPick(a,used){const free=a.filter(x=>!used||!used.has(x));const list=free.length?free:a;const v=list[Math.floor(Math.random()*list.length)];if(used)used.add(v);return v}
function genParseWords(){return $("genWords").value.split(/[\n,;]+/).map(w=>w.trim()).filter(Boolean).slice(0,10)}
function genStructure(){const v=$("genLength").value;const [c,r]=v.split("+").map(Number);return {couplet:c,refrain:r||0}}
function genGroups(n,scheme){
 /* Renvoie pour chaque ligne l'indice de son groupe de rimes. */
 const out=[];
 for(let i=0;i<n;i++){
  if(scheme==="AAAA")out.push(Math.floor(i/4));
  else if(scheme==="ABAB"){const block=Math.floor(i/4),pos=i%4;out.push(block*2+(pos%2))}
  else out.push(Math.floor(i/2));
 }
 return out;
}
function genPartners(anchor,count,level,used){
 const all=selectRhymeStars(anchor,rhymeSuggestions(anchor),40).filter(w=>!used.has(stripAcc(w).toLowerCase()));
 const q=w=>rhymeAnalysis(anchor,w);
 let pool=level==="multi"?all.filter(w=>q(w).multi):level==="rich"?all.filter(w=>{const a=q(w);return a.multi||a.quality==="rich"}):all;
 if(pool.length<count)pool=pool.concat(all.filter(w=>!pool.includes(w)));
 pool=pool.slice(0,Math.max(count,8));
 const out=[];while(out.length<count&&pool.length){const i=Math.floor(Math.random()*Math.min(pool.length,6));const w=pool.splice(i,1)[0];out.push(w);used.add(stripAcc(w).toLowerCase())}
 return out;
}
function genBuildRhymes(lines,scheme,level,imposed,universe){
 const groups=genGroups(lines,scheme),nG=Math.max(...groups)+1,used=new Set(),ends=new Array(lines),anchors=[];
 const pool=[...imposed];const uni=GEN_UNIVERSES[universe];
 for(let g=0;g<nG;g++){
  const idx=groups.map((x,i)=>x===g?i:-1).filter(i=>i>=0);
  let anchor=null,partners=[];
  const tries=pool.length?[pool.shift(),...uni.anchors.filter(a=>!used.has(stripAcc(a).toLowerCase()))]:uni.anchors.filter(a=>!used.has(stripAcc(a).toLowerCase())).sort(()=>Math.random()-.5);
  for(const a of tries){if(!a)continue;const u=new Set(used);u.add(stripAcc(a).toLowerCase());const p=genPartners(a,idx.length-1,level,u);if(p.length>=idx.length-1||imposed.includes(a)){anchor=a;partners=p;u.forEach(x=>used.add(x));break}}
  if(!anchor){anchor=uni.anchors[g%uni.anchors.length];partners=[]}
  anchors.push({anchor,partners});
  const words=[anchor,...partners];idx.forEach((li,k)=>{ends[li]=words[k]||anchor});
 }
 return {ends,anchors,extras:pool};
}
function genFill(tpl,ctx){return genFixArticles(tpl.replace(/\{L\}/g,ctx.L).replace(/\{I2\}/g,ctx.I2).replace(/\{I\}/g,ctx.I).replace(/\{X\}/g,ctx.X||"").replace(/\{R\}/g,ctx.R))}
function genFixArticles(t){return t.replace(/\bde les /g,"des ").replace(/\bde le /g,"du ").replace(/\bà les /g,"aux ").replace(/\bà le /g,"au ").replace(/\bsur le /g,"sur le ")}
function genCap(s){return s.charAt(0).toLocaleUpperCase("fr")+s.slice(1)}
function genSection(title,n,opts,ctx){
 const {ends,extras}=genBuildRhymes(n,opts.scheme,opts.level,ctx.imposed,opts.universe);
 const out=["["+title+"]"],uni=GEN_UNIVERSES[opts.universe],mood=GEN_MOODS[opts.mood],usedImg=new Set(),usedTpl=new Set(),usedLead=new Set();
 const extraQueue=[...extras];
 for(let i=0;i<n;i++){
  const R=ends[i];
  if(opts.kind==="trame"){out.push("· · · · · · · · · · · · "+R);continue}
  let tpl;
  if(extraQueue.length&&i%2===0)tpl=genPick(GEN_EXTRA_TEMPLATES);else tpl=genPick(GEN_TEMPLATES,usedTpl);
  if(usedTpl.size>=GEN_TEMPLATES.length)usedTpl.clear();
  if(usedImg.size>=uni.img.length-1)usedImg.clear();
  if(usedLead.size>=mood.lead.length)usedLead.clear();
  out.push(genCap(genFill(tpl,{L:genPick(mood.lead,usedLead),I:genPick(uni.img,usedImg),I2:genPick(uni.img,usedImg),X:tpl.includes("{X}")?extraQueue.shift():"",R})));
 }
 if(opts.refrain&&out.length>=4)out[3]=out[1];
 if(opts.kind==="trame"&&extras.length)out.push("(À placer aussi : "+extras.join(", ")+")");
 return out;
}
function genOptions(){return {universe:$("genUniverse").value,mood:$("genMood").value,scheme:$("genScheme").value,level:$("genRhyme").value,kind:$("genKind").value}}
function generateFreeText(){
 const opts=genOptions(),imposed=genParseWords(),st=genStructure(),lines=[];
 lines.push(...genSection("Couplet",st.couplet,opts,{imposed:[...imposed]}));
 if(st.refrain){
  const hook=imposed[0]||GEN_UNIVERSES[opts.universe].anchors[Math.floor(Math.random()*4)];
  lines.push("");
  const ref=genSection("Refrain",st.refrain,{...opts,scheme:"AAAA",refrain:true},{imposed:[hook]});
  lines.push(...ref);
 }
 return lines.join("\n");
}
let genPrevText=null;
async function genEnsureRhymes(){
 if(rimeIndex)return true;
 $("genStatus").textContent="Chargement du dictionnaire de rimes…";
 await loadLexiqueRimes();
 return !!rimeIndex;
}
$("genBtn").addEventListener("click",async()=>{
 if(!(await genEnsureRhymes())){$("genStatus").textContent="Le dictionnaire de rimes n’a pas pu se charger. Vérifie la connexion puis réessaie.";return}
 const prev=$("freeText").value;
 const text=generateFreeText();
 if(prev.trim()){genPrevText=prev;$("genUndo").classList.remove("hide")}
 $("freeText").value=text;
 if(!$("freeTextTitle").value.trim())$("freeTextTitle").value="Brouillon · "+GEN_UNIVERSES[$("genUniverse").value].label;
 stopFreeScroll();syncFreePreview(true);
 $("genStatus").textContent=($("genKind").value==="trame"?"Trame générée : les fins de ligne sont imposées, à toi de remplir le début.":"Brouillon généré : retravaille-le, c’est une base.")+" Appuie encore sur Générer pour une autre version.";
});
$("genUndo").addEventListener("click",()=>{if(genPrevText===null)return;$("freeText").value=genPrevText;genPrevText=null;$("genUndo").classList.add("hide");stopFreeScroll();syncFreePreview(true);$("genStatus").textContent="Ton texte d’avant est revenu."});
function buildFreePrompt(){
 const opts=genOptions(),imposed=genParseWords(),st=genStructure(),uni=GEN_UNIVERSES[opts.universe],mood=GEN_MOODS[opts.mood];
 const beatSel=$("freeBeat"),beat=beatSel.options[beatSel.selectedIndex].text,bpm=Math.max(60,Math.min(170,+$("freeBpm").value||90));
 const anchors=(imposed.length?imposed:uni.anchors.slice(0,4)).slice(0,6);
 const tips=rimeIndex?anchors.map(a=>{const r=selectRhymeStars(a,rhymeSuggestions(a),6);return r.length?"- "+a+" → "+r.join(", "):""}).filter(Boolean):[];
 const parts=[
  "Tu es un auteur de rap francophone exigeant. Écris "+(st.refrain?"un couplet de "+st.couplet+" mesures puis un refrain de "+st.refrain+" mesures":"un couplet de "+st.couplet+" mesures")+", en français.",
  "Une ligne = une mesure"+(beatSel.value==="none"?"":", sur une instru "+beat+" à "+bpm+" BPM")+" : vise 10 à 14 syllabes par ligne pour que ça tienne dans la mesure.",
  "Univers : "+uni.label+" — "+uni.brief+".",
  "Ambiance : "+mood.label+" — "+mood.brief+".",
  imposed.length?"Mots à placer obligatoirement : "+imposed.join(", ")+".":"",
  "Schéma de rimes : "+opts.scheme+". "+(opts.level==="multi"?"Vise des rimes multisyllabiques (deux syllabes ou plus qui riment).":opts.level==="rich"?"Vise des rimes riches (au moins trois sons communs).":"Des rimes au son, pas seulement à l’écrit."),
  tips.length?"Pistes de rimes vérifiées au son (facultatives) :\n"+tips.join("\n"):"",
  opts.kind==="trame"?"Donne seulement une trame : pour chaque ligne, le mot de fin qui rime, précédé de « … », pour que je complète en improvisant.":"Écris le texte complet.",
  "Contraintes : images concrètes et personnelles, pas de clichés (« ma vie est un film », « je suis dans le game »), pas d’insultes ni de vulgarité, ponctuation légère.",
  "Réponds uniquement avec le texte, avec les titres [Couplet]"+(st.refrain?" et [Refrain]":"")+", une mesure par ligne."
 ];
 return parts.filter(Boolean).join("\n");
}
$("genPrompt").addEventListener("click",async()=>{
 await genEnsureRhymes();
 const p=buildFreePrompt(),box=$("genPromptText");box.value=p;box.classList.remove("hide");
 try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(p);$("genStatus").textContent="Prompt copié ✓ Colle-le dans Claude ou ChatGPT, puis colle sa réponse dans « Ton texte ».";return}}catch(e){}
 box.focus();box.select();$("genStatus").textContent="Sélectionne le prompt ci-dessus et copie-le, puis colle la réponse de l’IA dans « Ton texte ».";
});
$("enterFreestyle").addEventListener("click",()=>loadLexiqueRimes());

/* ---- Rendu ligne par ligne (tempo, mémoire, relais) ---- */
let freeTempoElapsed=0,freeLineEls=[],freeCountEl=null,freeTempoLastLine=-2;
const freeTempo=()=>$("freeMode").value!=="px";
const freeSpecial=()=>freeTempo()||$("freeMemory").value!=="off"||$("freeRelay").value!=="off";
function freeHash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function freeMaskSet(lines,percent){
 /* Ordre de disparition stable pour un même texte ; les mots de fin de ligne partent en dernier. */
 const slots=[];lines.forEach((ln,li)=>{const ws=ln.words;ws.forEach((w,wi)=>{if(/[\p{L}\p{N}]/u.test(w))slots.push({li,wi,last:wi===ws.length-1,h:freeHash(w+"|"+li+"|"+wi)})})});
 slots.sort((a,b)=>(a.last-b.last)||(a.h-b.h));
 const n=Math.round(slots.length*percent/100),set=new Set();slots.slice(0,n).forEach(s=>set.add(s.li+":"+s.wi));return set;
}
function freeMaskWord(w){return w.replace(/^([^\p{L}\p{N}]*)([\p{L}\p{N}])([\p{L}\p{N}’'-]*)/u,(m,pre,first,rest)=>pre+first+"_".repeat(Math.max(2,rest.length)))}
function renderFreeLines(){
 const view=$("freeScroll"),raw=$("freeText").value.trim();
 view.replaceChildren();freeLineEls=[];freeCountEl=null;
 if(!raw){view.textContent="Ton texte apparaîtra ici…";return}
 const lines=raw.split("\n").map(t=>{const s=t.trim();return {t:s,head:/^\[.*\]$/.test(s),gap:!s,words:s?s.split(/\s+/):[]}});
 const mem=$("freeMemory").value,mask=mem==="off"?new Set():freeMaskSet(lines.filter(l=>!l.head&&!l.gap).map(l=>l),+mem);
 const relay=$("freeRelay").value==="off"?0:+$("freeRelay").value;
 if(freeTempo()&&$("freeIntro").checked){freeCountEl=document.createElement("div");freeCountEl.className="free-count";freeCountEl.textContent="INTRO · 4 mesures";view.append(freeCountEl)}
 let k=0,real=0;
 lines.forEach(l=>{
  const d=document.createElement("div");
  if(l.gap){d.className="free-gap";d.textContent=" ";view.append(d);return}
  if(l.head){d.className="free-head";d.textContent=l.t;view.append(d);return}
  d.className="free-line";real++;
  let words=l.words.map((w,wi)=>mask.has(k+":"+wi)?{w:freeMaskWord(w),m:true}:{w,m:false});
  let cut=false;
  if(relay&&real%relay===0&&words.length>2){words=words.slice(0,Math.max(1,Math.floor(words.length/2)));cut=true}
  words.forEach((x,i)=>{if(i)d.append(" ");if(x.m){const s=document.createElement("span");s.className="free-mask";s.textContent=x.w;d.append(s)}else d.append(x.w)});
  if(cut){const s=document.createElement("span");s.className="free-relay";s.textContent=" … 🎤 à toi";d.append(s)}
  view.append(d);freeLineEls.push(d);k++;
 });
}
{const _syncFreePreview=syncFreePreview;syncFreePreview=function(reset=true){
 document.body.classList.toggle("free-tempo",freeTempo());
 if(!freeSpecial()){_syncFreePreview(reset);return}
 renderFreeLines();freeTempoElapsed=0;freeTempoLastLine=-2;
 if(reset){freeScrollPosition=0;freeScrollRemainder=0;$("freeScroll").scrollTop=0;requestAnimationFrame(()=>{$("freeScroll").scrollTop=0})}
}}
function freeBpmValue(){return Math.max(60,Math.min(170,+$("freeBpm").value||90))}
function freeTempoFrame(now){
 const dt=freeLast?Math.max(0,(now-freeLast)/1000):0;freeLast=now;freeTempoElapsed+=dt;
 const bar=60/freeBpmValue()*4,barsPerLine=+$("freeMode").value,intro=($("freeIntro").checked?4:0);
 const bars=freeTempoElapsed/bar;
 if(freeCountEl){if(bars<intro){freeCountEl.textContent="INTRO · "+(intro-Math.floor(bars))+" mesure"+(intro-Math.floor(bars)>1?"s":"")+" avant la 1re ligne";freeCountEl.classList.add("on")}else{freeCountEl.textContent="▶ C’est parti";freeCountEl.classList.remove("on")}}
 const li=bars<intro?-1:Math.floor((bars-intro)/barsPerLine);
 if(freeTempoLastLine===-2)freeStatus("Au tempo : "+freeBpmValue()+" BPM · une ligne "+(barsPerLine===1?"par mesure":"toutes les 2 mesures")+(intro?" · intro de 4 mesures":"")+".",true);
 if(li!==freeTempoLastLine){
  freeTempoLastLine=li;
  freeLineEls.forEach((el,i)=>{el.classList.toggle("on",i===li);el.classList.toggle("done",i<li)});
  const target=li<0?freeCountEl:freeLineEls[li];
  if(target){const view=$("freeScroll");const top=target.offsetTop-view.clientHeight*.38+target.offsetHeight/2;view.scrollTo({top:Math.max(0,top),behavior:"smooth"})}
  if(li>=freeLineEls.length){
   stopFreeScroll();
   const mem=$("freeMemory");
   if(mem.value!=="off"&&mem.selectedIndex<mem.options.length-1){mem.selectedIndex++;freeStatus("Fin du texte. Passage suivant prêt : "+mem.options[mem.selectedIndex].text+". Appuie sur Lancer.");}
   else freeStatus("Fin du texte. Tu peux relancer.");
   return;
  }
 }
 freeFrame=requestAnimationFrame(freeScrollFrame);
}
{const _freeScrollFrame=freeScrollFrame;freeScrollFrame=function(now){if(!freeScrolling||freePaused)return;if(freeTempo())return freeTempoFrame(now);return _freeScrollFrame(now)}}
function freeSyncOptions(){
 const m=$("freeBeat").value,tempo=freeTempo();
 $("freeBpmBox").classList.toggle("hide",(m==="none"||m==="file")&&!tempo);
 $("freeSpeed").closest(".box").classList.toggle("hide",tempo);
 $("freeIntro").closest("label").classList.toggle("hide",!tempo);
 if(!freeScrolling)syncFreePreview(true);
}
["freeMode","freeMemory","freeRelay","freeIntro"].forEach(id=>$(id).addEventListener("change",freeSyncOptions));
$("freeBeat").addEventListener("change",freeSyncOptions);
/* Comme dans l’Impro : choisir une instru règle son tempo conseillé. */
$("freeBeat").addEventListener("change",()=>{const st=VB_STYLES[$("freeBeat").value];if(st)$("freeBpm").value=st.bpm});
/* Le bouton « Revenir au début » remet aussi le chrono du tempo à zéro. */
$("freeReset").addEventListener("click",()=>{if(freeSpecial())syncFreePreview(true)});
freeSyncOptions();

if(challengeParam&&/^\d{4}-\d{2}-\d{2}$/.test(challengeParam))showPage("improApp");

/* ---- Mot central toujours lisible au milieu des bulles de rimes (28/10/2026) ----
   1) le mot rétrécit jusqu'à tenir en largeur, sans couper un mot en deux ;
   2) les bulles se placent autour du mot sans jamais le recouvrir ;
   3) si le mot est trop large pour des bulles sur les côtés, elles passent au-dessus et en dessous. */
function fitOrbitWord(){
 const big=$("bigWord"),orbit=$("rhymeOrbit");if(!big||!orbit)return;
 big.style.fontSize="";big.style.maxWidth="";orbit.style.minHeight="";
 const stars=[...orbit.querySelectorAll(".rhyme-star")];
 stars.forEach(st=>{st.style.left="0px";st.style.top="0px"});
 if(big.classList.contains("empty-word")||!big.textContent.trim()){stars.forEach(s=>{s.style.left="";s.style.top=""});return}
 const W=orbit.clientWidth;if(!W)return;
 big.style.maxWidth=Math.floor(W*0.94)+"px";
 let fs=parseFloat(getComputedStyle(big).fontSize)||48;const minFs=20;
 const words=big.textContent.trim().split(/\s+/).length;
 const maxLines=words>1?2:1;
 for(let i=0;i<40;i++){
  big.style.fontSize=fs+"px";
  const lh=parseFloat(getComputedStyle(big).lineHeight)||fs;
  const fitsWidth=big.scrollWidth<=big.clientWidth+1;
  const lines=Math.round(big.offsetHeight/lh);
  if(fitsWidth&&lines<=maxLines)break;
  if(fs<=minFs)break;
  fs=Math.max(minFs,fs*0.92);
 }
 if(!stars.length)return;
 const gap=8,ww=big.offsetWidth,wh=big.offsetHeight;
 const sz=stars.map(s=>({w:s.offsetWidth,h:s.offsetHeight}));
 const maxH=Math.max(...sz.map(z=>z.h));
 const baseH=Math.max(orbit.offsetHeight,wh+2*(maxH+gap*3));
 const overlap=(a,b)=>!(a.r<=b.l||a.l>=b.r||a.b<=b.t||a.t>=b.b);
 const place=(H,useRows)=>{
  const cx=W/2,cy=H/2,word={l:cx-ww/2-gap,r:cx+ww/2+gap,t:cy-wh/2-gap,b:cy+wh/2+gap},pos=[];
  if(useRows){
   const top=[],bot=[];stars.forEach((s,i)=>(i%2?bot:top).push(i));
   [[top,-1],[bot,1]].forEach(([row,dir])=>{
    row.forEach((i,k)=>{
     const x=W*(k+0.5)/row.length;
     const rowH=Math.max(...row.map(j=>sz[j].h));
     const y=dir<0?word.t-rowH/2:word.b+rowH/2;
     pos[i]={x:Math.min(W-sz[i].w/2,Math.max(sz[i].w/2,x)),y};
    });
   });
  }else{
   stars.forEach((s,i)=>{
    const a=(-Math.PI/2)+(2*Math.PI*i/stars.length),dx=Math.cos(a),dy=Math.sin(a);
    const tx=Math.abs(dx)>1e-6?(ww/2+sz[i].w/2+gap)/Math.abs(dx):Infinity;
    const ty=Math.abs(dy)>1e-6?(wh/2+sz[i].h/2+gap)/Math.abs(dy):Infinity;
    const t=Math.min(tx,ty)*1.08;
    pos[i]={x:Math.min(W-sz[i].w/2,Math.max(sz[i].w/2,cx+dx*t)),y:cy+dy*t};
   });
  }
  const boxes=pos.map((q,i)=>({l:q.x-sz[i].w/2,r:q.x+sz[i].w/2,t:q.y-sz[i].h/2,b:q.y+sz[i].h/2}));
  let ok=boxes.every(bx=>!overlap(bx,word)&&bx.l>=-1&&bx.r<=W+1);
  for(let i=0;ok&&i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)if(overlap(boxes[i],boxes[j])){ok=false;break}
  const minT=Math.min(...boxes.map(bx=>bx.t)),maxB=Math.max(...boxes.map(bx=>bx.b));
  return {pos,ok,need:Math.max(H,Math.ceil(maxB-minT+2*gap)),fits:minT>=0&&maxB<=H};
 };
 let H=baseH,res=place(H,false);
 if(!res.ok)res=place(H,true);
 const rows=!place(H,false).ok;
 if(!res.fits){H=res.need;res=place(H,rows)}
 orbit.style.minHeight=H+"px";
 res.pos.forEach((q,i)=>{stars[i].style.left=q.x+"px";stars[i].style.top=q.y+"px"});
}
{const _renderRhymeHelper=renderRhymeHelper;renderRhymeHelper=function(word){_renderRhymeHelper(word);fitOrbitWord()}}
window.addEventListener("resize",()=>{clearTimeout(window.__fitT);window.__fitT=setTimeout(fitOrbitWord,120)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitOrbitWord);

/* ---- Styles VirtualBeat (repris et adaptés de la version du 25/10/2026) ---- */
const VB_STYLES={
 "virtual-boom":{bpm:90,sw:.2,k:"x..x..x...x.....",s:"....x.......x...",h:"x.x.x.x.x.x.x.x.",b:"x.....x...x.....",pr:[0,8,5,7],q:[0,3,7,10],w:"triangle",lp:1100},
 "virtual-lofi":{bpm:82,sw:.3,k:"x.....x...x.....",s:"....x.......x...",h:"..x...x...x...x.",b:"x.......x.......",pr:[2,7,0,0],q:[0,4,7,11],w:"sine",lp:900,arp:1},
 "virtual-oriental":{bpm:96,sw:0,k:"x...x..x........",s:"....x.......x...",h:"x.x.x.x.x.x.x.xx",b:"x.......x.x.....",pr:[0,1,0,7],q:[0,4,7],w:"sawtooth",lp:1300,arp:2},
 "virtual-makossa":{bpm:104,sw:.1,k:"x..x..x.x..x..x.",s:"....x.......x..x",h:"x.xxx.xxx.xxx.xx",b:"x..x..x.x..x..x.",pr:[0,5,7,5],q:[0,4,7],w:"triangle",lp:1600,stab:1},
 "virtual-trap":{bpm:140,sw:0,k:"x.........x.....",s:"........x.......",h:"xxxxxxxxxxxxxxxx",b:"x.........x.....",pr:[0,0,8,7],q:[0,3,7],w:"sawtooth",lp:600,long:1}
};
const VB_SCALES={2:[0,1,4,5,7,8,11,12],1:[0,3,5,7,10,12,15]};
let vbMaster=null,vbRoot=null,vbCtx=null,vbOut=null;const vbNoiseBufs=new WeakMap();
const vbFreq=m=>440*Math.pow(2,(m-69)/12);
function vbEnv(g,t,a,d,v){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
function vbTone(t,type,f,d,v,lp,f2){try{const C=vbCtx||audioCtx,o=C.createOscillator(),g=C.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+.12);vbEnv(g,t,.006,d,v);let n=o;if(lp){const x=C.createBiquadFilter();x.type="lowpass";x.frequency.value=lp;o.connect(x);n=x}n.connect(g);g.connect(vbOut||vbMaster);o.start(t);o.stop(t+d+.05)}catch{}}
function vbNoise(t,ty,f,d,v){try{const C=vbCtx||audioCtx;let buf=vbNoiseBufs.get(C);if(!buf){buf=C.createBuffer(1,C.sampleRate,C.sampleRate);const dd=buf.getChannelData(0);for(let i=0;i<dd.length;i++)dd[i]=Math.random()*2-1;vbNoiseBufs.set(C,buf)}const src=C.createBufferSource();src.buffer=buf;const x=C.createBiquadFilter();x.type=ty;x.frequency.value=f;const g=C.createGain();vbEnv(g,t,.002,d,v);src.connect(x);x.connect(g);g.connect(vbOut||vbMaster);src.start(t);src.stop(t+d+.05)}catch{}}
/* Le tempo conseillé de chaque instru se règle tout seul quand on la choisit. */
["beatChoice","quickBeatChoice"].forEach(id=>$(id)?.addEventListener("change",e=>{const st=VB_STYLES[e.target.value];if(st&&$("bpm")){$("bpm").value=st.bpm;settings.bpm=st.bpm;persistSettings()}}));
/* Une seule fois : ceux qui avaient le métronome par défaut passent sur une vraie instru. */
try{if(!localStorage.getItem("improRapBeatV2")){if(settings.beat==="metro"){settings.beat="virtual-boom";$("beatChoice").value="virtual-boom";$("quickBeatChoice").value="virtual-boom";persistSettings()}localStorage.setItem("improRapBeatV2","1")}}catch{}
/* Les liens d’instrus externes ont été retirés : un réglage qui les visait repasse sur Boom-bap. */
if(["oldschool","metabolit","state"].includes(settings.beat)){settings.beat="virtual-boom";$("beatChoice").value="virtual-boom";$("quickBeatChoice").value="virtual-boom";persistSettings()}
/* Mode 10 mots : même choix d’instrus et de tempo que les autres modes, synchronisé avec les réglages. */
function syncCustomBeat(){$("customBeat").value=$("beatChoice").value;$("customBpm").value=$("bpm").value}
syncCustomBeat();
document.querySelector('[data-session-mode="custom"]')?.addEventListener("click",syncCustomBeat);
$("customBeat").addEventListener("change",()=>{const v=$("customBeat").value,st=VB_STYLES[v];$("beatChoice").value=v;$("quickBeatChoice").value=v;if(st){$("bpm").value=st.bpm;$("customBpm").value=st.bpm}persistSettings()});
$("customBpm").addEventListener("change",()=>{const b=Math.max(60,Math.min(160,Number($("customBpm").value)||90));$("customBpm").value=b;$("bpm").value=b;persistSettings()});

/* ---- Mode battle à deux : on se passe le micro toutes les 4 (ou 8) mesures, un mot par passage (29/10/2026) ---- */
const BATTLE_KEY="improRapBattle";
let battleActive=false,battlePasses=0,battleLastTurn=-1;
function battleNames(){return [$("battleP1").value.trim()||"MC 1",$("battleP2").value.trim()||"MC 2"]}
function battleTurnBars(){return $("battleTurn").value==="8"?8:4}
function battleSave(){try{localStorage.setItem(BATTLE_KEY,JSON.stringify({on:$("battleMode").checked,p1:$("battleP1").value.trim(),p2:$("battleP2").value.trim(),turn:battleTurnBars()}))}catch{}}
function battleLoad(){try{const b=JSON.parse(localStorage.getItem(BATTLE_KEY)||"{}");$("battleMode").checked=!!b.on;$("battleP1").value=b.p1||"";$("battleP2").value=b.p2||"";if(b.turn)$("battleTurn").value=String(b.turn)}catch{}$("battleOptions").hidden=!$("battleMode").checked}
["battleMode","battleP1","battleP2","battleTurn"].forEach(id=>$(id).addEventListener("change",()=>{$("battleOptions").hidden=!$("battleMode").checked;battleSave()}));
/* La battle est une carte de « Mode d'impro » (29/10/2026) : la carte coche la case cachée battleMode. */
function setBattleCard(on){$("battleMode").checked=on;$("battleOptions").hidden=!on;battleSave()}
document.querySelectorAll("[data-session-mode]").forEach(b=>b.addEventListener("click",()=>setBattleCard(b.dataset.sessionMode==="battle")));
function selectBattleCard(){document.querySelector('[data-session-mode="battle"]').click()}
battleLoad();
if($("battleMode").checked){const c=document.querySelector('[data-session-mode="battle"]');document.querySelectorAll("[data-session-mode]").forEach(x=>x.setAttribute("aria-pressed",String(x===c)));$("customModePanel").hidden=true;$("freeOptions").hidden=false}
$("quickBattle").addEventListener("click",()=>{selectBattleCard();if($("setupGrid").hidden||getComputedStyle($("setupGrid")).display==="none")$("customizeBtn").click();$("battleOptions").scrollIntoView({behavior:"smooth",block:"center"});setTimeout(()=>{try{$("battleP1").focus({preventScroll:true})}catch{}},400)});
function renderBattle(){
 const bn=$("battleBanner");if(!battleActive){bn.hidden=true;return}
 const names=battleNames(),tb=battleTurnBars(),played=barIndex-INTRO_BARS-1;bn.hidden=false;
 bn.replaceChildren();const who=document.createElement("span"),sub=document.createElement("small");
 if(played<0){const left=INTRO_BARS+1-barIndex;bn.className="battle-banner p1";who.textContent="🎤 "+names[0]+" ouvre la battle";sub.textContent="Intro · micro dans "+left+" mesure"+(left>1?"s":"")}
 else{const turn=Math.floor(played/tb),mc=turn%2,inTurn=played%tb;if(turn!==battleLastTurn){battleLastTurn=turn;battlePasses=turn+1}
  const last=inTurn===tb-1;bn.className="battle-banner p"+(mc+1)+(last?" warn":"");who.textContent="🎤 "+names[mc];
  sub.textContent=last?"→ Micro à "+names[1-mc]+" à la prochaine mesure !":"Mesure "+(inTurn+1)+"/"+tb}
 bn.append(who,sub);
}
{const _tick=tick;tick=function(){const b=barIndex;_tick();if(battleActive&&barIndex!==b)renderBattle()}}
{const _launch=launch;launch=async function(...args){
 battleActive=!customSession&&$("battleMode").checked;battlePasses=0;battleLastTurn=-1;
 let prevBars=null;if(battleActive){prevBars=$("bars").value;$("bars").value=String(battleTurnBars())}
 try{return await _launch.apply(this,args)}finally{
  /* Le passage de micro impose un mot par tour, sans changer le réglage « Un mot toutes les… » enregistré. */
  if(prevBars!==null){$("bars").value=prevBars;try{const st=JSON.parse(localStorage.getItem("improRapSettings")||"{}");st.bars=Number(prevBars);localStorage.setItem("improRapSettings",JSON.stringify(st))}catch{}}
  renderBattle()}
}
 /* « Rejouer » appelait l’ancienne version : on le rebranche pour que la battle reste active. */
 $("againBtn").removeEventListener("click",_launch);$("againBtn").addEventListener("click",()=>launch());
}
{const _finish=finishSession;finishSession=function(...args){const was=battleActive&&!ended;const r=_finish.apply(this,args);if(was){const n=battlePasses;$("summaryLine").textContent+=" Battle : "+n+" passage"+(n>1?"s":"")+" de micro entre "+battleNames().join(" et ")+"."}battleActive=false;renderBattle();return r}
 $("finishBtn").removeEventListener("click",_finish);$("finishBtn").addEventListener("click",()=>finishSession());
}

/* ---- Rimes en direct pendant l'écriture : 4 rimes pour le dernier mot de la ligne touchée (29/10/2026) ---- */
const FREE_RHYMES_KEY="improRapFreeRhymes";
let freeRhymeTimer=0,freeRhymeCaret=0,freeRhymeShown="",freeRhymeReq=0;
function freeLastWord(line){if(!line||/^\s*\[.*\]\s*$/.test(line))return "";const m=line.match(/([\p{L}’'-]+)[^\p{L}]*$/u);if(!m)return "";return m[1].split(/[’']/).pop().replace(/^-+|-+$/g,"")}
function freeRhymeWord(fromTyping){
 const ta=$("freeText"),v=ta.value,pos=ta.selectionStart??v.length,lines=v.split("\n");
 let acc=0,li=0;for(;li<lines.length-1;li++){if(pos<=acc+lines[li].length)break;acc+=lines[li].length+1}
 /* En écrivant : on cherche la rime de la ligne d'avant. En touchant une ligne : la rime de son dernier mot. */
 let start=fromTyping?li-1:li;if(start<0)start=li;
 for(let i=start;i>=0;i--){const w=freeLastWord(lines[i]);if(w)return w}
 return "";
}
async function updateFreeRhymes(fromTyping){
 const bar=$("freeRhymeBar"),on=$("freeRhymeOn").checked;bar.classList.toggle("off",!on);if(!on)return;
 const req=++freeRhymeReq,ta=$("freeText");freeRhymeCaret=ta.selectionStart??ta.value.length;
 const w=freeRhymeWord(fromTyping),label=$("freeRhymeLabel"),chips=$("freeRhymeChips");
 if(!w){label.textContent="🎯 Touche une ligne : 4 rimes pour son dernier mot.";chips.replaceChildren();freeRhymeShown="";return}
 if(w===freeRhymeShown&&chips.childElementCount)return;
 if(!rimeIndex){label.textContent="Chargement du dictionnaire de rimes…";chips.replaceChildren();try{await loadLexiqueRimes()}catch{}if(req!==freeRhymeReq)return;if(!rimeIndex){label.textContent="Dictionnaire de rimes indisponible pour l’instant.";return}}
 freeRhymeShown=w;
 const list=selectRhymeStars(w,rhymeSuggestions(w),4);chips.replaceChildren();
 label.textContent=list.length?"🎯 Rimes pour « "+w+" »":"Pas de rime trouvée pour « "+w+" ».";
 list.forEach(r=>{const b=document.createElement("button");b.type="button";b.textContent=r;let q;try{q=rhymeAnalysis(w,r)}catch{q=null}if(q&&(q.multi||q.quality==="rich")){const s=document.createElement("small");s.textContent=q.multi?"multisyllabique":"riche";b.append(s)}
  b.setAttribute("aria-label","Insérer "+r);b.addEventListener("mousedown",e=>e.preventDefault());b.addEventListener("click",()=>insertFreeRhyme(r));chips.append(b)});
}
function insertFreeRhyme(word){
 const ta=$("freeText"),v=ta.value,pos=Math.min(freeRhymeCaret,v.length),before=v.slice(0,pos),after=v.slice(pos);
 const sep=before&&!/\s$/.test(before)?" ":"",tail=after&&!/^\s/.test(after)?" ":"";
 ta.value=before+sep+word+tail+after;const caret=pos+sep.length+word.length;freeRhymeCaret=caret;
 try{ta.focus({preventScroll:true});ta.setSelectionRange(caret,caret)}catch{}
 ta.dispatchEvent(new Event("input",{bubbles:true}));
}
function scheduleFreeRhymes(fromTyping){clearTimeout(freeRhymeTimer);freeRhymeTimer=setTimeout(()=>updateFreeRhymes(fromTyping),fromTyping?350:60)}
$("freeText").addEventListener("input",()=>scheduleFreeRhymes(true));
["click","focus"].forEach(ev=>$("freeText").addEventListener(ev,()=>scheduleFreeRhymes(false)));
$("freeText").addEventListener("keyup",e=>{if(/^(Arrow|Home|End|Page)/.test(e.key))scheduleFreeRhymes(false)});
try{$("freeRhymeOn").checked=localStorage.getItem(FREE_RHYMES_KEY)!=="off"}catch{}
$("freeRhymeOn").addEventListener("change",()=>{try{localStorage.setItem(FREE_RHYMES_KEY,$("freeRhymeOn").checked?"on":"off")}catch{}freeRhymeShown="";updateFreeRhymes(false)});
$("freeRhymeBar").classList.toggle("off",!$("freeRhymeOn").checked);

/* ---- Freestyle : enregistrer sa voix pendant le défilement, puis réécouter avec le texte synchronisé (29/10/2026) ---- */
const FREE_REC_KEY="improRapFreeRec",FREE_REC_MAX=15*60;
let freeRec=null,freeReplayUrl="",freeReplayItem=null,freeReplayFrame=0,freeReplayLast=-3;
try{$("freeRecOn").checked=localStorage.getItem(FREE_REC_KEY)==="on"}catch{}
$("freeRecOn").addEventListener("change",()=>{try{localStorage.setItem(FREE_REC_KEY,$("freeRecOn").checked?"on":"off")}catch{}});
/* L'instru VirtualBeat est mixée dans la prise : appelé à chaque démarrage de l'instru. */
function freeRecTap(){if(freeRec&&freeRec.dest&&freeBeatGain&&freeRec.ctx===freeBeatContext){try{freeBeatGain.connect(freeRec.dest)}catch(e){}}}
function freeRecNow(){if(!freeRec||!freeRec.startedAt)return 0;const p=freeRec.pausedAt?performance.now()-freeRec.pausedAt:0;return Math.max(0,(performance.now()-freeRec.startedAt-freeRec.pausedTotal-p)/1000)}
function freeRecSample(){
 if(!freeRec||freeRec.pausedAt)return;const v=$("freeScroll"),max=Math.max(1,v.scrollHeight-v.clientHeight);
 const e={t:+freeRecNow().toFixed(2),r:+(v.scrollTop/max).toFixed(4)};if(freeRec.tempo)e.li=freeTempoLastLine;
 const tl=freeRec.timeline,last=tl[tl.length-1];if(!last||last.r!==e.r||last.li!==e.li)tl.push(e);
 if(e.t>FREE_REC_MAX){freeRecStop();freeStatus("Prise arrêtée au bout de 15 minutes et sauvegardée.")}
}
async function freeRecPrepare(){
 if(!$("freeRecOn").checked)return;
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){freeStatus("L’enregistrement n’est pas disponible sur ce navigateur : défilement sans enregistrement.");return}
 let mic;try{mic=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:false,autoGainControl:true}})}catch(e){freeStatus("Micro refusé : défilement sans enregistrement.");return}
 const rec={chunks:[],mic,timeline:[],pausedTotal:0,pausedAt:0,startedAt:0,tempo:freeTempo(),title:$("freeTextTitle").value.trim()||"Prise freestyle",beat:$("freeBeat").options[$("freeBeat").selectedIndex].text};
 let stream=mic;
 if($("freeBeat").value.startsWith("virtual-")){try{const AC=window.AudioContext||window.webkitAudioContext;freeBeatContext=freeBeatContext||new AC();rec.ctx=freeBeatContext;rec.dest=freeBeatContext.createMediaStreamDestination();rec.micSrc=freeBeatContext.createMediaStreamSource(mic);rec.micSrc.connect(rec.dest);stream=rec.dest.stream}catch(e){rec.dest=null;stream=mic}}
 const mime=["audio/mp4","audio/webm;codecs=opus","audio/webm"].find(t=>window.MediaRecorder.isTypeSupported?.(t));
 try{rec.recorder=mime?new MediaRecorder(stream,{mimeType:mime}):new MediaRecorder(stream)}catch(e){mic.getTracks().forEach(t=>t.stop());freeStatus("Enregistrement impossible : défilement sans enregistrement.");return}
 rec.recorder.ondataavailable=e=>{if(e.data?.size)rec.chunks.push(e.data)};
 freeRec=rec;
}
function freeRecBegin(){
 const rec=freeRec;if(!rec||rec.startedAt)return;
 try{rec.recorder.start(1000)}catch(e){freeRecDiscard();freeStatus("Enregistrement impossible : défilement sans enregistrement.");return}
 rec.startedAt=performance.now();rec.html=$("freeScroll").innerHTML;freeRecTap();freeRecSample();rec.timer=setInterval(freeRecSample,100);
 $("freeRecBadge").classList.remove("hide");
}
function freeRecRelease(rec){clearInterval(rec.timer);try{rec.micSrc?.disconnect()}catch{}try{if(freeBeatGain&&rec.dest)freeBeatGain.disconnect(rec.dest)}catch{}rec.mic?.getTracks().forEach(t=>t.stop());$("freeRecBadge").classList.add("hide")}
function freeRecDiscard(){if(!freeRec)return;const rec=freeRec;freeRec=null;try{if(rec.recorder.state!=="inactive")rec.recorder.stop()}catch{}freeRecRelease(rec)}
function freeRecStop(){
 if(!freeRec)return Promise.resolve();const rec=freeRec;
 if(!rec.startedAt){freeRecDiscard();return Promise.resolve()}
 freeRecSample();const duration=Math.round(freeRecNow()*1000);freeRec=null;
 return new Promise(resolve=>{
  rec.recorder.onstop=async()=>{freeRecRelease(rec);const blob=new Blob(rec.chunks,{type:rec.recorder.mimeType||"audio/webm"});
   if(blob.size&&duration>800){try{await saveFreeTake({kind:"freestyle",blob,duration,createdAt:Date.now(),title:rec.title,beat:rec.beat,html:rec.html||"",tempo:rec.tempo,timeline:rec.timeline});freeStatus("Prise sauvegardée sur cet appareil · "+fmt(Math.round(duration/1000))+". Réécoute-la dans « Mes prises ».");await listFreeTakes()}catch(e){freeStatus("Prise non sauvegardée : "+(e.message||"stockage indisponible")+".")}}
   resolve()};
  try{if(rec.recorder.state==="paused")rec.recorder.resume();rec.recorder.stop()}catch(e){freeRecRelease(rec);resolve()}
 });
}
async function saveFreeTake(item){const db=await recordingDb();return new Promise((resolve,reject)=>{const tx=db.transaction("recordings","readwrite");tx.objectStore("recordings").add(item);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error("Enregistrement non sauvegardé."))})}
async function getFreeTakes(){const db=await recordingDb();return new Promise((resolve,reject)=>{const req=db.transaction("recordings","readonly").objectStore("recordings").getAll();req.onsuccess=()=>resolve((req.result||[]).filter(x=>x.kind==="freestyle").sort((a,b)=>b.createdAt-a.createdAt));req.onerror=()=>reject(req.error)})}
async function deleteFreeTake(id){const db=await recordingDb();return new Promise((resolve,reject)=>{const tx=db.transaction("recordings","readwrite");tx.objectStore("recordings").delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
async function listFreeTakes(){
 const host=$("freeTakes");
 try{const items=await getFreeTakes();host.replaceChildren();
  if(!items.length){const p=document.createElement("p");p.className="n";p.textContent="Aucune prise pour le moment.";host.append(p);return}
  items.forEach(item=>{const row=document.createElement("div");row.className="recording-item";const info=document.createElement("div"),t=document.createElement("b"),sub=document.createElement("small");
   t.textContent=item.title;sub.textContent=new Date(item.createdAt).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"})+" · "+fmt(Math.round(item.duration/1000))+" · "+(item.beat||"");info.append(t,sub);
   const acts=document.createElement("div");acts.className="take-actions";const play=document.createElement("button"),del=document.createElement("button");
   play.textContent="▶ Réécouter";play.setAttribute("aria-label","Réécouter "+item.title+" avec le texte");play.addEventListener("click",()=>openFreeReplay(item));
   del.textContent="🗑";del.setAttribute("aria-label","Supprimer la prise "+item.title);del.addEventListener("click",async()=>{if(!confirm("Supprimer cette prise ?"))return;if(freeReplayItem&&freeReplayItem.id===item.id)closeFreeReplay();try{await deleteFreeTake(item.id)}catch{}listFreeTakes()});
   acts.append(play,del);row.append(info,acts);host.append(row)})}
 catch(e){host.textContent=e.message||"Impossible de lire les prises enregistrées."}
}
function freeReplayAt(t){
 const tl=freeReplayItem?.timeline||[];if(!tl.length)return;let lo=0,hi=tl.length-1,k=0;while(lo<=hi){const m=(lo+hi)>>1;if(tl[m].t<=t){k=m;lo=m+1}else hi=m-1}
 const e=tl[k],view=$("freeReplayText");
 if(freeReplayItem.tempo&&e.li!==undefined){if(e.li===freeReplayLast)return;freeReplayLast=e.li;const lines=[...view.querySelectorAll(".free-line")];lines.forEach((el,i)=>{el.classList.toggle("on",i===e.li);el.classList.toggle("done",i<e.li)});
  const target=e.li<0?view.querySelector(".free-count"):lines[e.li];if(target)view.scrollTo({top:Math.max(0,target.offsetTop-view.offsetTop-view.clientHeight*.38+target.offsetHeight/2),behavior:"smooth"})}
 else view.scrollTop=e.r*Math.max(0,view.scrollHeight-view.clientHeight);
}
function freeReplayLoop(){const a=$("freeReplayAudio");freeReplayAt(a.currentTime);if(!a.paused&&!a.ended)freeReplayFrame=requestAnimationFrame(freeReplayLoop)}
function openFreeReplay(item){
 stopFreeScroll();stopFreeBeat();freeReplayItem=item;freeReplayLast=-3;
 if(freeReplayUrl)URL.revokeObjectURL(freeReplayUrl);freeReplayUrl=URL.createObjectURL(item.blob);
 const view=$("freeReplayText");view.innerHTML=item.html||"";view.classList.toggle("tempo",!!item.tempo);view.scrollTop=0;
 view.querySelectorAll(".on,.done").forEach(el=>el.classList.remove("on","done"));
 $("freeReplayTitle").textContent="🎧 "+item.title;const a=$("freeReplayAudio");a.src=freeReplayUrl;
 $("freeReplay").classList.remove("hide");$("freeReplay").scrollIntoView({behavior:"smooth",block:"start"});
 freeReplayAt(0);a.play().catch(()=>{});
}
function closeFreeReplay(){const a=$("freeReplayAudio");a.pause();cancelAnimationFrame(freeReplayFrame);$("freeReplay").classList.add("hide");freeReplayItem=null;a.removeAttribute("src");try{a.load()}catch{}if(freeReplayUrl){URL.revokeObjectURL(freeReplayUrl);freeReplayUrl=""}}
$("freeReplayAudio").addEventListener("play",()=>{cancelAnimationFrame(freeReplayFrame);freeReplayFrame=requestAnimationFrame(freeReplayLoop)});
["seeked","timeupdate"].forEach(ev=>$("freeReplayAudio").addEventListener(ev,()=>{if(ev==="seeked")freeReplayLast=-3;freeReplayAt($("freeReplayAudio").currentTime)}));
$("freeReplayClose").addEventListener("click",closeFreeReplay);
{const _start=$("freeStart").onclick;$("freeStart").onclick=async e=>{
 if(!$("freeText").value.trim())return _start(e);
 await freeRecStop();if($("freeReplayAudio").src)$("freeReplayAudio").pause();
 await freeRecPrepare();
 await _start(e);
 if(freeRec){if(freeScrolling)freeRecBegin();else freeRecDiscard()}
}}
{const _pause=$("freePause").onclick;$("freePause").onclick=e=>{_pause(e);const rec=freeRec;if(!rec||!rec.startedAt)return;
 try{if(freePaused&&!rec.pausedAt){rec.recorder.pause();rec.pausedAt=performance.now()}else if(!freePaused&&rec.pausedAt){rec.recorder.resume();rec.pausedTotal+=performance.now()-rec.pausedAt;rec.pausedAt=0}}catch{}}}
["freeStop","freeHome"].forEach(id=>$(id).addEventListener("click",()=>{freeRecStop()}));
$("enterFreestyle").addEventListener("click",listFreeTakes);
