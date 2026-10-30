# Suivi du projet

## 30/10/2026 (suite) — retours d’Alexis après test iPhone du nouveau design
- Plaît : le nouveau design, les boutons, les volets repliables.
- Corrigé (même branche, non fusionné) : instru plus forte, mot qui restait bloqué, enregistrement Freestyle de la voix. Détails dans le CHANGELOG.
- Tests Chromium : `e2e_son.py` 19/19, `e2e_design.py` 45/45, `e2e_nouvelles_idees.py` 29/29, `e2e_cas_limites.py` 7/7, `e2e_plein_ecran.py` OK sur 4 formats, `smoke.py` OK.
- À vérifier par Alexis sur iPhone : volume de l’instru avec et sans enregistrement, plus de mot bloqué (y compris après une notification ou un verrouillage), qualité de la prise Freestyle avec haut-parleur ET avec écouteurs, voix bien calée sur l’instru à la réécoute (le délai de recalage est une estimation).

## 30/10/2026 — branche `claude/tender-lovelace-plb9qb` : design épuré + accessibilité (non fusionné)
- Fait : voir CHANGELOG du 30/10. Toutes les fonctions sont conservées ; réglages Impro et options Freestyle repliés par défaut.
- Tests Chromium : `tests/smoke.py` OK, syntaxe JavaScript OK ; `e2e_design.py` 45/45 (320, 375 et 1280 px : pas de débordement, cibles ≥ 44 px, interrupteurs au clavier, focus visible, raccourci 10 mots, onglets) ; `e2e_nouvelles_idees.py` 29/29 ; `e2e_cas_limites.py` 7/7 ; `e2e_plein_ecran.py` : mot entier et sans chevauchement sur 4 formats.
- À vérifier par Alexis sur iPhone : rendu de la police condensée (Avenir Next Condensed sur iPhone, différente du test), interrupteurs, ouverture des volets Freestyle, barre d’onglets flottante qui ne gêne pas.

## État au 29/10/2026 (à jour)
- `main` (en ligne sur GitHub Pages) contient tout le travail validé : Impro + Freestyle (PR #2), nouvelles idées — instrus Freestyle, prises synchronisées, battle, rimes en direct (PR #5, avec #3 et #4), battle facile à trouver (#6), rimes nasales corrigées et Impro en plein écran (PR #7), puis l’index de rimes Lexique reconstruit automatiquement (`f78f143`).
- Les anciennes branches de travail (`fusion-impro-freestyle`, `nouvelles-idees`, `freestyle-generateur`) sont fusionnées : les sections ci-dessous sont l’historique.
- Cache hors ligne : `v28`.
- Contrôles automatiques au 29/10 sur `f78f143` : `tests/smoke.py` OK, syntaxe JavaScript OK.

### Reste à tester par Alexis sur iPhone (Safari)
- Son de VirtualBeat au lancement d’une session (Impro et Freestyle).
- Impro plein écran : mot central entier et lisible à distance, bulles de rimes sans chevauchement, en portrait et en paysage.
- Micro : autorisation, volume de l’instru pendant l’enregistrement, qualité de la prise réécoutée.
- Rimes en direct avec le clavier ouvert ; bandeau battle lisible à distance.
- Freestyle : défilement fluide, import d’un fichier audio, mode plein écran.

### Prochaine étape
À choisir par Alexis (corrections après tests iPhone ou nouvelle fonction). Éléments de la version du 25/10 encore non repris : voir DECISIONS.md.

## Historique — état au 28/10/2026
- `main` (en ligne) contient la version déposée par erreur le 25/10 puis enrichie du mode Freestyle.
- La branche `fusion-impro-freestyle` réunit les deux : l’appli Impro d’origine (la plus complète) + l’accueil et le mode Freestyle. **À tester sur iPhone avant toute fusion dans `main`.**

## Tests réalisés sur la branche (navigateur Chromium, vue mobile 375×812 et ordinateur)
- Contrôles automatiques `tests/smoke.py` et vérification de la syntaxe JavaScript : OK.
- Parcours : accueil, entrée dans Impro, session « Échauffement » (mot affiché, étoile de rimes), bilan, retour accueil, Freestyle (enregistrement d’un texte, défilement, mode plein écran, arrêt, retour), conservation de la bibliothèque après rechargement, panneau 10 mots, lien de défi du jour : OK, aucune erreur JavaScript.

- Mot central et bulles de rimes : 11 mots testés (courts, longs, à deux mots, « Anticonstitutionnellement ») sur 4 tailles d’écran (320, 375, 430 et 1280 px) : plus aucun chevauchement ni mot coupé.

## À tester par Alexis sur iPhone (Safari)
- Pendant une session : le mot central reste entier et lisible, les bulles ne le recouvrent pas.
- Son de VirtualBeat et du métronome au lancement d’une session.
- Freestyle : défilement fluide, instru intégrée, import d’un fichier audio, mode plein écran.
- Enregistrement de la voix (autorisation du micro).
- Retour à l’accueil pendant une session.

## Pistes suivantes
Voir les propositions dans DECISIONS.md.

## 29/10/2026 — branche `nouvelles-idees` (contient aussi #3 et #4)
- Fait : instrus VirtualBeat dans le Freestyle, enregistrement + réécoute synchronisée, mode battle à deux, rimes en direct.
- Tests Chromium (375×812, micro simulé) : 35 vérifications réussies, aucune erreur JavaScript ; `tests/smoke.py` OK.
- À tester par Alexis sur iPhone : autorisation du micro, volume de l’instru pendant l’enregistrement (iOS peut baisser le son quand le micro est actif), qualité de la prise réécoutée, rimes en direct avec le clavier ouvert, bandeau battle lisible à distance.
