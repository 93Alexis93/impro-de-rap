# Changelog

## 2026-10-29 — Rimes de « gentrification » corrigées, Impro en plein écran
- **Rimes fausses (ex. « gentrification » → sociaux, radio)** : la cause est dans Lexique 4.00 lui-même. Pour certains mots rares (transcrits automatiquement), la finale nasale est notée comme une voyelle orale : « gentrification » Z@tRifikasjO au lieu de …sj§ (« on »), « maintenant » m5tna au lieu de m5tn@, « tremplins » tR@plE au lieu de tR@pl5. L’appli cherchait donc des rimes en « -sio ».
- Correction : `scripts/phon_fixes.py` rétablit la finale nasale quand l’orthographe française l’impose (-ion, -on, -ant, -ment, -ain, -ins, -ance) et que la prononciation finit sur la voyelle orale correspondante. 191 mots corrigés dans `data/lexique-rimes.json` (`scripts/fix_lexique_rimes.py`, idempotent) ; la correction est aussi branchée dans `scripts/build_lexique_rimes.py` pour les prochaines reconstructions. Les mots anglais (fan, bacon, cartoon) ne sont pas touchés. « gentrification » rime maintenant avec situation, relation, opération.
- **Impro en plein écran** : pendant la session, l’écran de jeu couvre tout le téléphone. Mot central jusqu’à 27 % de la largeur de l’écran (les mots longs rétrécissent pour tenir), bulles de rimes plus grosses et sans coupure de mot, consigne en 15-19 px, chrono en 20 px, barre des temps plus épaisse. Masqués pendant le jeu : la ligne technique (BPM, instru), la légende « Étoiles de rimes » et le rappel des gestes. Sur petit écran, le bandeau d’objectif est masqué (la consigne du mot reste) ; en paysage, mise en page dédiée.
- Cache hors ligne passé en `v28` (nouveau dictionnaire de rimes chargé).

## 2026-10-29 — Battle à deux facile à trouver
- Retour d’Alexis : impossible de trouver où choisir la battle. Cause : la case était perdue dans une liste de cases sans mise en forme, affichées collées comme un paragraphe.
- La battle devient une carte de « Mode d’impro » (à côté d’« Impro libre » et « 10 mots ») ; la choisir affiche les noms des MC et le passage de micro.
- Nouveau bouton rapide « ⚔️ Battle à deux » en haut de l’Impro : il sélectionne la carte, ouvre les réglages et place le curseur sur le nom du MC 1.
- Les cases à cocher des réglages s’affichent une par ligne.
- Cache hors ligne passé en `v27`.

## 2026-10-29 — Générateur : univers et ambiances pensés pour le rap
- **Univers** (10) : Ego trip, Street / quartier, Amour, Conscient / engagé, Introspection, Famille & racines, Charbon / réussite, Hommage / mémoire, Battle / clash, Storytelling. Retirés : Espace, Conte, Mer, Foot, École, Futur, Nature (thèmes trop éloignés du rap).
- **Ambiances** (9) : Fierté, Rage, La dalle, Revanche, Froid / posé, Mélancolie, Nostalgie, Espoir, Second degré (l’ancien « Humour »).
- Chaque univers et chaque ambiance a ses images, ses mots-pivots et une consigne d’angle, reprise dans le prompt IA (ex. « rap conscient — dénonce une injustice précise, avec des faits et des images, pas des slogans »).

## 2026-10-29 — Nouvelles idées : instrus Freestyle, prises synchronisées, battle, rimes en direct
- **Freestyle = mêmes instrus que l’Impro** : Boom-bap 90, Lo-fi 82, Oriental 96, Afro / Makossa 104, Trap 140 (batterie, basse, accords). Le tempo conseillé se règle quand on change d’instru. Un seul moteur VirtualBeat partagé ; l’ancien moteur du Freestyle (surtout de la batterie) est retiré. « Sans instru » et « Importer mon instru » inchangés.
- **Enregistrer ma voix** (Freestyle, case à cocher) : la prise démarre avec le défilement, se met en pause avec lui et s’arrête avec « Arrêter tout » (15 min max). Voix mixée avec l’instru VirtualBeat ; avec une instru importée, voix seule. Badge « ● REC » en plein écran. Micro refusé = le défilement part quand même.
- **Mes prises** : liste sur l’appareil (IndexedDB), réécoute avec le texte qui défile ou la ligne surlignée exactement comme pendant la prise, suppression avec confirmation. Les prises Freestyle n’apparaissent pas dans la liste de l’Impro.
- **Mode battle à deux** (Impro, réglages) : noms des deux MC, passage de micro toutes les 4 ou 8 mesures, un nouveau mot à chaque passage, bandeau coloré (rose / bleu) avec alerte à la dernière mesure, nombre de passages dans le bilan. Le réglage « Un mot toutes les… » enregistré n’est pas modifié. Pas de battle en mode 10 mots.
- **Rimes en direct** (Freestyle) : toucher une ligne affiche 4 rimes au son pour son dernier mot ; en écrivant une nouvelle ligne, les rimes de la ligne d’avant. Toucher une rime l’insère au curseur. Désactivable.
- Cache hors ligne passé en `v26`.

## 2026-10-29 — Freestyle : générateur, tempo, mémoire, relais
- **Générer un texte** : mots imposés (jusqu’à 10), univers (10), ambiance (6), structure (8 ou 16 mesures, avec ou sans refrain de 4), schéma AABB / ABAB / AAAA, rimes (meilleures, riches, multisyllabiques), résultat « Trame à trous » ou « Texte complet ». Gratuit et hors ligne : les fins de vers viennent du moteur de rimes au son ; le texte complet est un brouillon à retravailler. « Remettre mon texte d’avant » annule.
- **Copier le prompt IA** : prompt prêt à coller dans Claude ou ChatGPT (structure, BPM, univers, mots, schéma, pistes de rimes vérifiées au son, contraintes anti-clichés), aussi affiché pour une copie manuelle.
- **Défilement au tempo** : 1 ligne par mesure ou toutes les 2 mesures, calé sur le BPM, ligne en cours surlignée, intro de 4 mesures facultative. Les lignes `[Couplet]` / `[Refrain]` et les lignes vides ne prennent pas de mesure. La pause fige le chrono.
- **Mode mémoire** : 0 → 25 → 50 → 75 → 100 % des mots cachés (1re lettre gardée, mots de fin de ligne cachés en dernier) ; passe tout seul au niveau suivant à la fin du texte.
- **Mode relais** : 1 ligne sur 4 (ou sur 2) s’arrête au milieu avec « … 🎤 à toi ».
- La vitesse libre (px/s) reste disponible et inchangée. Cache hors ligne passé en `v25`.

## 2026-10-29 — 4 bulles de rimes au lieu de 6
- Retour d’Alexis : trop de propositions autour du mot. L’orbite affiche au maximum 4 rimes (les 4 meilleures : mots courants et rimes les plus riches d’abord).
- Cache hors ligne passé en `v24`.

## 2026-10-29 — Rimes calculées au son
- Retour d’Alexis : beaucoup de bulles ne rimaient pas. Cause : quand un mot n’avait pas de famille prête, l’appli tombait sur des listes de secours choisies par l’orthographe, voire sur une liste générique (« écho, voix, espoir… ») qui ne rimait pas du tout.
- Nouveau moteur : les rimes se calculent sur la prononciation de Lexique (171 000 formes). Une bulle n’est affichée que si elle partage au moins la dernière voyelle prononcée et les consonnes qui suivent ; les listes de secours non vérifiées sont supprimées.
- Mots absents du dictionnaire (prénoms, argot, mots du public : Mbappé, wesh, TikTok, PSG…) : la fin du mot est prononcée d’après les mots qui s’écrivent pareil, puis par des règles simples ; les sigles se prononcent lettre par lettre.
- Classement : mots courants d’abord, rimes les plus riches ensuite ; plus de rime pauvre imposée. Filtres : pas de sigles, pas d’insultes ni de mots grossiers, pas de dérivé du même mot (terminé / déterminé).
- Le dictionnaire de rimes se charge dès l’ouverture du mode Impro (et pendant l’intro de 4 mesures).
- Cache hors ligne passé en `v23`.

## 2026-10-29 — Instru et tempo dans « 10 mots pour une impro »
- Le panneau du mode 10 mots propose les mêmes instrus VirtualBeat que les autres modes (Boom-bap, Lo-fi, Oriental, Afro / Makossa, Trap, Métronome) et un champ Tempo (BPM).
- Le tempo conseillé se règle quand on change d’instru et reste modifiable (60 à 160 BPM). Le choix est synchronisé avec les réglages et mémorisé sur l’appareil.
- La session 10 mots joue l’instru choisie, avec l’intro de 4 mesures avant le premier mot.
- Cache hors ligne passé en `v22`.

## 2026-10-28 — Intro de 4 mesures, liens externes retirés
- Avant le premier mot : intro de 4 mesures avec l’instru déjà lancée (plus de bips de métronome). Le grand chiffre décompte les mesures (4, 3, 2, 1) et le chrono affiche « Intro 0:10 » jusqu’au premier mot.
- La durée choisie (3, 5 ou 10 min) démarre au premier mot : l’intro ne mange pas le temps d’impro, et le bilan ne la compte pas.
- Retrait du panneau « Instrus à explorer » et des trois « liens externes » des listes d’instrus : ils ne faisaient qu’ouvrir un site extérieur (ou jouer un métronome). Un réglage qui les visait repasse sur Boom-bap.
- Cache hors ligne passé en `v21`.

## 2026-10-28 — Instrus VirtualBeat refaites
- Retour d’Alexis : les instrus de la fusion se ressemblaient toutes (batterie seule, motifs presque identiques) et aucune instru n’était choisie par défaut (le métronome l’était).
- VirtualBeat utilise maintenant le moteur d’instrus de la version du 25/10 : batterie + basse + accords, swing et couleur propres à chaque style. Cinq styles : Boom-bap (90), Lo-fi jazzy (82), Oriental (96), Afro / Makossa (104), Trap sombre (140).
- Boom-bap est choisi par défaut (et remplace une seule fois le métronome pour ceux qui l’avaient par défaut) ; le tempo conseillé se règle quand on change d’instru, y compris pour les boutons Échauffement, Session et Réviser.
- Cache hors ligne passé en `v20`.

## 2026-10-28 — Mot central toujours lisible
- Bug signalé par Alexis : le mot à faire rimer passait sous les bulles de rimes et son début était caché ; les mots longs étaient aussi coupés au milieu (« STATIO / N- / SERVIC / E »).
- Le mot rétrécit automatiquement jusqu’à tenir en largeur, sans être coupé au milieu ; les bulles se placent autour sans jamais le recouvrir, et passent au-dessus et en dessous quand le mot est trop large.
- Cache hors ligne passé en `v19`.

## 2026-10-28 — Fusion des deux versions (branche `fusion-impro-freestyle`)
- Restauration de l’application Impro complète telle qu’elle était avant le dépôt manuel du 25/10 à 01h57 (commit `6c6ea19`) : VirtualBeat, accueil rapide (échauffement, session, défi du jour, révision), six objectifs d’impro, thèmes, niveaux, favoris, mots à retravailler, historique et série, index de rimes Lexique, enregistrements, défi partageable.
- Reprise depuis la version du 25/10 (`bc00303`) : écran d’accueil à deux espaces (Impro / Freestyle) et mode **Freestyle** complet (défilement du texte, bibliothèque de textes, instru intégrée ou fichier audio, mode lecture plein écran).
- Bouton « ← Accueil » dans l’en-tête de l’espace Impro ; un lien de défi (`?defi=AAAA-MM-JJ`) ouvre directement l’espace Impro.
- Cache hors ligne passé en `v18` pour que les téléphones récupèrent la nouvelle version.
- README mis à jour pour décrire ce qui existe réellement.
