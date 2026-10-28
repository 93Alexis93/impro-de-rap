# IMPRO DE RAP

**Un mot. Une mesure. À toi.**

Application web de freestyle rap, pensée d’abord pour le téléphone. Elle propose des mots, des thèmes et des exercices pour s’entraîner seul ou entre amis, sans compte.

## Essayer l’application

**[Lancer IMPRO DE RAP](https://93alexis93.github.io/impro-de-rap/)**

## Ce qui est disponible dans la version actuelle

- **Accueil à deux espaces** : 🎤 **Impro** (mots, rimes, défis, VirtualBeat) et 📜 **Freestyle** (ton texte défile pendant que tu rappes, avec une bibliothèque de textes enregistrés sur l’appareil, une instru intégrée facultative ou ton propre fichier audio, et un mode lecture plein écran).
- **VirtualBeat** : rythmes générés dans le navigateur (boom-bap, oriental, makossa) synchronisés avec les mots, ou métronome simple.
- **10 mots pour une impro** : les mots de ton public, placés un par un, avec ou sans propositions de rimes.
- **Étoile de rimes** avec classement pauvre / suffisante / riche / multisyllabique, enrichie par l’index Lexique (`data/lexique-rimes.json`, chargé seulement quand il sert).
- Enregistrement de ta voix pendant la session et liste de tes enregistrements.

- Interface sombre à contraste élevé, avec un écran de session épuré.
- Sept thèmes et un mélange surprise, avec le corpus initial conservé et enrichi.
- Trois niveaux : Chauffe (mots concrets), Équilibré (vocabulaire concret, intermédiaire et technique) et Technique (mots plus rares ou abstraits).
- Six modes : Mot qui tombe, Chaîne, Rime cible, Histoire, Punchline et Chaos.
- Réglage du BPM (60–160), compte à rebours de quatre temps affichant déjà la consigne du mode choisi, pulsation à quatre temps et clic de métronome généré par le navigateur. Les mots arrivent sur les débuts de mesure, selon la cadence choisie.
- Sessions de 3, 5 ou 10 minutes, ou sans limite.
- Aperçu facultatif, mode zéro distraction, pause/reprise et passage manuel au mot suivant.
- Bilan de session avec auto-évaluation « placé / raté ».
- Favoris activables/désactivables depuis la session, historique de sessions, mots à retravailler et série de jours conservés localement sur l’appareil.
- Tirage qui évite autant que possible les mots récemment affichés, tout en remettant en priorité les mots à retravailler.
- Session dédiée de 3 minutes pour réviser uniquement les mots ratés, avec message explicite si aucun mot n'est à revoir.
- Bilan avec choix exclusif « placé » ou « raté » par mot ; un mot réussi réduit son compteur « à retravailler ».
- Réglages mémorisés sans compte.
- Base PWA installable (manifest et icône) avec cache de l’application pour une réouverture hors ligne après le premier chargement.

## Limites à connaître

- Les instrus VirtualBeat sont synthétisées par le navigateur ; les liens vers des instrus externes restent externes et ne sont pas synchronisés avec les mots.
- Le moteur de tempo utilise l’horloge audio du navigateur pour les pulsations. Le rythme est calé sur les temps et mesures, mais la précision doit encore être testée sur des téléphones réels et sur des sessions longues.
- Le mode hors ligne nécessite une première ouverture avec connexion et un navigateur qui prend en charge les service workers. Les limites d’installation varient selon le navigateur.
- Le plein écran et le maintien de l’écran allumé dépendent du navigateur et du système. Sur iPhone, ces capacités peuvent être limitées.
- Les modes proposent des mécaniques distinctes : Chaîne relie deux mots consécutifs, Rime cible conserve le mot plusieurs mesures, Histoire démarre avec trois éléments puis fait progresser le récit, Punchline ajoute un rendez-vous de chute toutes les huit mesures et Chaos lance des virages de consigne. La qualité du freestyle reste auto-évaluée par la personne qui s’entraîne.
- Les données sont stockées sur l’appareil courant : elles ne se synchronisent pas entre navigateurs ou appareils.

## Instrumentales et droits

Les liens externes sont fournis pour explorer des pistes, pas pour affirmer que tous les morceaux sont libres de droits. Vérifie la licence en vigueur de chaque piste et ses conditions d’utilisation, de redistribution, d’attribution et de publication avant de l’utiliser. La prochaine étape pour une vraie synchronisation sera d’ajouter des fichiers audio pour lesquels les droits d’intégration et de redistribution sont clairement autorisés.

## Développement

Le site est statique et fonctionne avec HTML, CSS et JavaScript natifs, sans framework ni service payant. Le fichier principal est `index.html`.

La refonte est déployée sur la branche `main` à titre de version de travail. Avant de considérer cette version comme validée, tester sur téléphone : démarrage audio, compte à rebours, précision du BPM, pause/reprise, fin de session, persistance locale et commandes tactiles.