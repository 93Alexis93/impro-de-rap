# Données de rimes — IMPRO DE RAP

## État actuel

Le moteur de suggestions intégré à `index.html` contient des familles éditoriales conçues pour le freestyle. Elles sont utiles pour amorcer une rime, mais ne constituent pas un dictionnaire phonétique exhaustif et certaines propositions peuvent être des assonances plutôt que des rimes parfaites.

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

## Limite d'import de cette version

La source officielle a été identifiée, mais l'archive ZIP complète n'a pas pu être téléchargée dans l'environnement de travail lors de cette opération. **Aucune des 190 000 formes n'est donc présentée comme importée**. Le corpus devra être téléchargé, contrôlé et transformé en fichier léger indexé par finale phonologique avant d'être intégré à l'application. Conserver ce fichier de licence, les crédits, la version du corpus et le lien source avec les données dérivées.
