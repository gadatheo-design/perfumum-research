# Observations - Page Recettes

## État actuel observé

La page des recettes présente 261 recettes avec un système de filtres complet. Les cartes de recettes affichent les informations suivantes :

### Points positifs
- Filtres par gamme (badges colorés cliquables)
- Filtres par catégorie (parfum, résine, tabac, encens, extrait)
- Filtres par prototype (C1, C2, C3, C4)
- Filtre par ingrédients
- Filtre par profil radar
- Tri par date (plus récentes)
- Badge "Nouveau" sur les recettes récentes
- Mini radar hexagonal sur chaque carte
- Nombre de molécules affiché
- Barre de progression pour l'intensité

### Points à améliorer
1. Les cartes manquent de descriptions courtes pour donner du contexte
2. L'intensité affiche parfois des valeurs incorrectes (82/10, 75/10 au lieu de 8.2/10, 7.5/10)
3. Le badge "Nouveau" est présent sur presque toutes les recettes (critère trop large)
4. Pas de vue alternative (liste compacte vs grille)
5. Les mini radars affichent "0" quand il n'y a pas de données

## Améliorations recommandées
- Corriger l'affichage de l'intensité (diviser par 10 si > 10)
- Limiter le badge "Nouveau" aux 30 derniers jours réels
- Ajouter une description courte sur les cartes
- Proposer une vue liste alternative
