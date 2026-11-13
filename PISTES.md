# Pistes futures — trois améliorations inattendues (13/11/2026)

Trois idées qui respectent les règles du projet : gratuites, hors ligne, sans API payante, sans instru externe, pensées pour le téléphone posé à distance. Chacune est décrite pour pouvoir être reprise telle quelle (cahier des charges, technique, risques iPhone, tests). **Rien n'est codé : ce sont des propositions, à valider par Alexis.**

Ordre conseillé : 1 → 2 → 3 (de la plus simple à la plus ambitieuse).

---

## 1. « Le DJ t'annonce le mot » : entendre le mot au lieu de le lire

> **Codée le 13/11/2026** (réglage « 📣 Annonce du mot », test `tests/e2e_annonce.py`). Reste à valider sur iPhone.

**Le problème** : le téléphone est posé à 2-3 m. Même avec un mot en très gros, il faut lever les yeux au bon moment, et on perd le flow.

**L'idée** : une demi-mesure avant chaque nouveau mot, un petit **scratch synthétique** (« rrrrip ») prévient l'oreille, puis une **voix annonce le mot** sur le temps 1, comme un DJ ou un host de battle. On peut rapper les yeux fermés.

**Réglage** (Personnaliser ma session) : `Annonce du mot : Aucune · Scratch seul · Scratch + voix`. Par défaut : « Aucune », pour ne rien changer aux habitudes.

**Technique** (gratuite, hors ligne) :
- Le scratch est généré par Web Audio, comme VirtualBeat : un bruit filtré en passe-bande dont la fréquence glisse de 400 à 2 500 Hz en 120 ms, programmé à `temps du nouveau mot − 2 temps`, envoyé dans la même chaîne `vbBuildMaster`.
- La voix vient de la **synthèse vocale du téléphone** : `speechSynthesis` avec une voix `fr-FR` (déjà installée sur iPhone, sans réseau). Elle est lancée depuis `draw()` en même temps que l'affichage du mot. Réglages : `rate` 1.1, `pitch` 0.9.
- Pendant la voix, l'instru baisse de 6 dB pendant 0,6 s (`vbMaster.gain`), puis remonte : le mot reste clair sans couper le beat.
- En mode Battle, l'annonce dit aussi le nom du MC (« Micro à Léon… *Tempête* »).

**Risques iPhone** :
- La synthèse vocale de Safari ne démarre qu'après un premier toucher : on la « réveille » en prononçant un texte vide au clic sur « Lancer ».
- Le volume de la voix suit le volume du téléphone, pas celui de l'instru.
- Il faut vérifier que la voix ne coupe pas Web Audio sur iOS (à tester en premier, 10 minutes suffisent).

**Tests Playwright** : on remplace `speechSynthesis.speak` par un espion, puis on vérifie qu'il y a un appel par mot affiché, avec le bon texte ; on vérifie aussi que le scratch est programmé deux temps avant le mot (espion sur la fonction scratch) et que le réglage « Aucune » ne déclenche rien.

**Effort** : petit (une session).

---

## 2. « Télécommande dans les écouteurs » : piloter sans toucher le téléphone

> **Codée le 13/11/2026** (interrupteur « 🎧 Télécommande des écouteurs », test `tests/e2e_telecommande.py`), avec un son silencieux en boucle plutôt qu’en faisant passer l’instru par `<audio>`. Reste à valider sur iPhone.

**Le problème** : le téléphone est loin. Pour mettre en pause ou passer au mot suivant, il faut aller le toucher.

**L'idée** : avec des écouteurs (AirPods ou filaires), on utilise leurs boutons :

| Geste écouteurs | Action dans l'appli |
|---|---|
| Lecture / pause (1 appui) | Pause / reprise de la session |
| Piste suivante (2 appuis) | Mot suivant (en mode 10 mots : « mot placé ✓ ») |
| Piste précédente (3 appuis) | Garder le mot actuel 4 mesures de plus |

Bonus : l'écran verrouillé de l'iPhone affiche le mot en cours comme « titre du morceau » (`MediaMetadata.title = mot`, `artist = "IMPRO DE RAP"`). Un coup d'œil au téléphone verrouillé suffit.

**Technique** :
- On utilise la Media Session API : `navigator.mediaSession.setActionHandler("play" | "pause" | "nexttrack" | "previoustrack", …)`, branchée sur `pauseGame`, `resumeGame`, `nextManual` et un nouveau « garder le mot ».
- **Point clé iOS** : ces boutons ne sont envoyés qu'à une page qui joue un vrai élément `<audio>`, pas du Web Audio seul. Il faut donc faire passer VirtualBeat par `audioCtx.createMediaStreamDestination()` puis dans un `<audio autoplay playsinline>` caché, au lieu de `audioCtx.destination`. Bonus probable : sur iOS, un `<audio>` continue de jouer écran verrouillé, alors que Web Audio seul s'arrête (à vérifier : ça renforcerait aussi la correction du « mot bloqué »).
- Le titre de l'écran verrouillé est mis à jour dans `draw()`.

**Risques** :
- Passer par `<audio>` ajoute un peu de latence entre l'instru et l'affichage des mots. Il faudra mesurer, puis décaler l'affichage de `audioCtx.outputLatency` si besoin.
- Fallback obligatoire : si le `<audio>` refuse de démarrer, on reste sur la sortie actuelle.

**Tests Playwright** : on appelle directement les gestionnaires enregistrés (on espionne `setActionHandler` pour les récupérer), puis on vérifie la pause, le mot suivant et le maintien du mot ; on vérifie aussi que `mediaSession.metadata.title` est égal au mot affiché. Le vrai test des boutons se fait sur iPhone avec des AirPods.

**Effort** : moyen (une session + un test iPhone attentif).

---

## 3. « Flow-mètre » : un bilan chiffré de ta prise, comme un coach

**Le problème** : l'appli sait enregistrer, mais ne dit rien sur la prise. Le bilan « placé / raté » repose sur ton ressenti.

**L'idée** : après une prise (Impro ou Freestyle), l'appli analyse l'enregistrement **sur le téléphone, sans internet**, et affiche trois chiffres simples, avec un conseil :

1. **Tenue** : % de mesures où tu as rappé. Exemple : « 92 % — 2 trous de plus d'une mesure, à 0:41 et 1:58 ». Toucher un trou relance la réécoute à cet endroit.
2. **Densité** : syllabes estimées par mesure, en courbe, pour voir les accélérations et les moments où tu t'essouffles (« tu ralentis après 2 minutes »).
3. **Placement** : part des attaques de syllabes qui tombent près d'un temps ou d'une croche, donc dans la grille du beat (repère, pas une note).

Ensuite, un défi personnalisé : « Prochaine session : vise moins de 1 trou ». C'est l'esprit « carnet de coach », et ça donne envie de rejouer.

**Technique** (sans API) :
- On décode la prise avec `decodeAudioData`, puis on calcule l'énergie par tranches de 20 ms (RMS).
- Le **seuil de voix** s'adapte au bruit ambiant (percentile 30 de l'énergie + 6 dB), pour éviter que l'instru captée par le micro ne compte comme de la voix. On filtre la prise en passe-bande 300-3 400 Hz avant le calcul (zone de la voix, où le kick et la basse pèsent peu).
- Les syllabes sont repérées par les pics d'énergie (« onsets ») espacés d'au moins 90 ms.
- La grille de mesures est connue : BPM, début de l'intro, et pour le Freestyle la chronologie `timeline` déjà enregistrée avec chaque prise.
- Le résultat est stocké avec la prise (IndexedDB, comme aujourd'hui), avec un historique des 10 dernières pour afficher les progrès.

**Risques** :
- Avec le haut-parleur, l'instru repasse dans le micro. Le filtre et le seuil limitent le problème, mais les chiffres seront plus fiables avec écouteurs : à afficher comme « estimation ».
- Il faut rester encourageant, jamais humiliant : on affiche le progrès par rapport à soi-même, pas une note sur 20.

**Tests** : on génère des prises de synthèse (rafales de bruit « syllabes » sur une grille connue, avec des trous volontaires) avec `OfflineAudioContext`, puis on vérifie que les trous, la densité et le placement retrouvés correspondent à ceux fabriqués (± 1 mesure, ± 15 %).

**Effort** : plus gros (deux sessions). C'est la plus originale : aucune appli d'impro rap gratuite ne fait ce retour à notre connaissance (à vérifier avant de l'annoncer).

---

### Prompt prêt à l'emploi (pour lancer une piste plus tard)

> Dans le dépôt `93Alexis93/impro-de-rap`, sur une branche de travail (jamais `main`), implémente la piste N de `PISTES.md` exactement comme décrite. Respecte le style du code existant (`index.html`, JavaScript natif), garde toutes les fonctions actuelles, ajoute le réglage par défaut « désactivé » si la piste en prévoit un, écris le test Playwright décrit dans `tests/`, lance tous les tests existants (y compris en 375×812), monte le cache dans `sw.js`, mets à jour `CHANGELOG.md` et `PROGRESS.md`. Ne fusionne pas sans l'accord d'Alexis.
