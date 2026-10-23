# Données de rimes — IMPRO DE RAP

## État actuel

Le moteur combine les familles éditoriales de `index.html` avec un index dérivé de Lexique 4.00 généré automatiquement dans `data/lexique-rimes.json`. Le 23 octobre 2026, le workflow GitHub Actions a téléchargé l’archive officielle, indexé 171 446 entrées de prononciation, 28 433 finales syllabiques et produit un fichier JSON de 22,8 Mo. Le fichier est chargé côté navigateur ; en cas d’échec de chargement, les suggestions éditoriales et les solutions de secours restent disponibles.

**Limite importante :** cette première intégration regroupe les mots par finale syllabique exacte, mais ne calcule pas encore de manière fiable les catégories « riche / suffisante / pauvre » à partir du nombre de phonèmes communs. Certaines suggestions doivent donc être considérées comme des pistes sonores, pas comme une validation linguistique garantie. L’index est une base de travail, pas un arbitre de rimes.

## Sources étudiées et réutilisation

### Lexique 4.10
- Site officiel : https://www.lexique.org/
- Données annoncées : environ 190 000 formes françaises, représentations phonologiques, lemmes et fréquences.
- Licence annoncée par le site : Creative Commons Attribution — Partage dans les mêmes conditions 4.0 International (CC BY-SA 4.0).
- Citation scientifique : New, B., Pallier, C., Schalchli, G., Bourgin, J., & Gimenes, M. (2026). *Lexique 4: A major upgrade of the “Lexique” French lexical database*. Behavior Research Methods, 58(5), 140.
- Téléchargement officiel : https://www.lexique.org/databases/Lexique410/Lexique4.1.zip

### Le Barbery
- Guide et licence : https://www.barbery.net/lebarbery/mode-emploi.html
- Le site indique que son fichier adapté `data/lexique.tsv`, dérivé de Lexique 3.83, est diffusé sous CC BY-SA 4.0.
- Le fichier appartient au site Barbery ; ne pas le copier depuis le site sans vérifier les conditions et la version. Préférer le téléchargement officiel de Lexique et citer les auteurs d'origine.

### Rimes Solides et Dico des rimes
- https://www.rimessolides.com/
- https://www.dicodesrimes.com/
- Ils sont utiles pour comparer des exemples et contrôler des cas limites. Aucune API publique documentée n'a été confirmée lors de la recherche ; ne pas scraper leurs résultats ni les importer en masse sans autorisation.

## Classement cible dans l'application

1. **Rime riche** : au moins trois phonèmes communs en fin de mot.
2. **Rime suffisante** : deux phonèmes communs.
3. **Rime pauvre** : un phonème commun.
4. **Assonance / proximité sonore** : ressemblance partielle, affichée séparément et clairement étiquetée.

Le classement doit se faire à partir de la transcription phonologique (phonèmes), et non de la seule terminaison écrite : l'orthographe française ne permet pas de garantir une rime à elle seule.

## Import et maintenance

Le script `scripts/build_lexique_rimes.py` télécharge l’archive officielle Lexique 4.00, conserve les symboles phonologiques propres à Lexique et découpe les syllabes à partir des tirets du champ `25_SyllPhono`. Il construit l’index et renseigne la source, la version et la licence dans le JSON. Le workflow `.github/workflows/build-lexique-rimes.yml` permet de régénérer l’index à la demande et lors des changements du script ou du workflow. Les doublons exacts (mot + transcription phonologique) sont filtrés avant insertion afin d’éviter des entrées d’index mal associées.

Pour vérifier la publication : consulter l’exécution [Build Lexique rhyme database](https://github.com/93Alexis93/impro-de-rap/actions/runs/39918089421) et le fichier [data/lexique-rimes.json](https://github.com/93Alexis93/impro-de-rap/blob/main/data/lexique-rimes.json). La taille importante du JSON peut empêcher certains aperçus GitHub de l’afficher, sans empêcher le téléchargement par le navigateur.

La prochaine amélioration linguistique consiste à calculer les phonèmes communs en fin de transcription, puis à étiqueter séparément rimes riches, suffisantes, pauvres et assonances. Ne pas confondre ce classement avec les regroupements de finales syllabiques actuels.
