# IMPRO DE RAP

**Un mot. Une mesure. À toi.**

Application web de freestyle rap, pensée d’abord pour le téléphone. Elle propose des mots, des thèmes et des exercices pour s’entraîner seul ou entre amis, sans compte.

## Essayer l’application

**[Lancer IMPRO DE RAP](https://93alexis93.github.io/impro-de-rap/)**

## Ce qui est disponible dans la version actuelle

- Interface sombre à contraste élevé, avec un écran de session épuré.
- Sept thèmes et un mélange surprise, en conservant le corpus de mots initial.
- Trois niveaux : Chauffe, Équilibré et Technique.
- Six modes : Mot qui tombe, Chaîne, Rime cible, Histoire, Punchline et Chaos.
- Réglage du BPM (60–160), compte à rebours de quatre temps, pulsation à quatre temps et clic de métronome généré par le navigateur. Les mots arrivent sur les débuts de mesure, selon la cadence choisie.
- Sessions de 3, 5 ou 10 minutes, ou sans limite.
- Aperçu facultatif, mode zéro distraction, pause/reprise et passage manuel au mot suivant.
- Bilan de session avec auto-évaluation « placé / raté ».
- Favoris, historique de sessions, mots à retravailler et série de jours conservés localement sur l’appareil.
- Réglages mémorisés sans compte.
- Base PWA installable (manifest et icône) avec cache de l’application pour une réouverture hors ligne après le premier chargement.

## Limites à connaître

- **Les instrumentales ne sont pas encore intégrées dans l’application.** Les liens vers les plateformes restent externes et ne sont pas synchronisés avec les mots.
- Le moteur de tempo utilise l’horloge audio du navigateur pour les pulsations. Le rythme est calé sur les temps et mesures, mais la précision doit encore être testée sur des téléphones réels et sur des sessions longues.
- Le mode hors ligne nécessite une première ouverture avec connexion et un navigateur qui prend en charge les service workers. Les limites d’installation varient selon le navigateur.
- Le plein écran et le maintien de l’écran allumé dépendent du navigateur et du système. Sur iPhone, ces capacités peuvent être limitées.
- Les modes sont une première version : les règles et la variété de leurs exercices devront être enrichies et testées.
- Les données sont stockées sur l’appareil courant : elles ne se synchronisent pas entre navigateurs ou appareils.

## Instrumentales et droits

Les liens externes sont fournis pour explorer des pistes, pas pour affirmer que tous les morceaux sont libres de droits. Vérifie la licence en vigueur de chaque piste et ses conditions d’utilisation, de redistribution, d’attribution et de publication avant de l’utiliser. La prochaine étape pour une vraie synchronisation sera d’ajouter des fichiers audio pour lesquels les droits d’intégration et de redistribution sont clairement autorisés.

## Développement

Le site est statique et fonctionne avec HTML, CSS et JavaScript natifs, sans framework ni service payant. Le fichier principal est `index.html`.

La refonte est déployée sur la branche `main` à titre de version de travail. Avant de considérer cette version comme validée, tester sur téléphone : démarrage audio, compte à rebours, précision du BPM, pause/reprise, fin de session, persistance locale et commandes tactiles.