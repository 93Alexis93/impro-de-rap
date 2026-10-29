# Suivi du projet

## État au 28/10/2026
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
