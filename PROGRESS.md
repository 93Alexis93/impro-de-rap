# Suivi du projet

## État au 28/10/2026
- `main` (en ligne) contient la version déposée par erreur le 25/10 puis enrichie du mode Freestyle.
- La branche `fusion-impro-freestyle` réunit les deux : l’appli Impro d’origine (la plus complète) + l’accueil et le mode Freestyle. **À tester sur iPhone avant toute fusion dans `main`.**

## Tests réalisés sur la branche (navigateur Chromium, vue mobile 375×812 et ordinateur)
- Contrôles automatiques `tests/smoke.py` et vérification de la syntaxe JavaScript : OK.
- Parcours : accueil, entrée dans Impro, session « Échauffement » (mot affiché, étoile de rimes), bilan, retour accueil, Freestyle (enregistrement d’un texte, défilement, mode plein écran, arrêt, retour), conservation de la bibliothèque après rechargement, panneau 10 mots, lien de défi du jour : OK, aucune erreur JavaScript.

## À tester par Alexis sur iPhone (Safari)
- Son de VirtualBeat et du métronome au lancement d’une session.
- Freestyle : défilement fluide, instru intégrée, import d’un fichier audio, mode plein écran.
- Enregistrement de la voix (autorisation du micro).
- Retour à l’accueil pendant une session.

## Pistes suivantes
Voir les propositions dans DECISIONS.md.
