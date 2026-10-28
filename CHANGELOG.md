# Changelog

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
