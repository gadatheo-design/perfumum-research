# Audit Contenu/Contenant PERFUMUM - 04 Janvier 2026

## Analyse de la cohérence Contenu/Design

### Page d'accueil

**Problèmes identifiés :**
1. **Statistiques incohérentes** : La page affiche "192 molécules" dans le hero, "131 molécules" dans les stats, et la page molécules montre "366 molécules trouvées"
2. **Redondance des parcours** : Les 3 parcours (Chercheur, Créateur, Curieux) répètent des liens déjà présents dans le menu
3. **Section "Accès aux données"** : Manque de hiérarchie visuelle claire entre les 3 colonnes

**Recommandations :**
- Centraliser les statistiques via une API unique
- Simplifier la page d'accueil en réduisant la redondance
- Ajouter des icônes plus distinctives pour chaque section

---

### Page Molécules

**Points positifs :**
- Filtres avancés bien structurés (gammes, profils olfactifs, concentration)
- Sliders pour propriétés chimiques (point d'ébullition, masse moléculaire)
- Breadcrumb présent

**Problèmes identifiés :**
1. **Cartes de molécules** :
   - "Formule non disponible" affiché pour beaucoup de molécules → données incomplètes
   - Doublons apparents (Hexanoic acid apparaît 2 fois avec des données différentes)
   - Icône hexagonale générique pour toutes les molécules → manque de différenciation visuelle

2. **Informations affichées** :
   - Intensité sur 10 mais certaines valeurs sont "48/10", "85/10" → incohérence d'échelle
   - "Non classé" pour certaines molécules → données incomplètes

3. **UX des filtres** :
   - Beaucoup de filtres visibles par défaut → peut être overwhelming
   - Pas de compteur de résultats par filtre

**Recommandations :**
- Nettoyer les doublons dans la base de données
- Normaliser l'échelle d'intensité (0-10 ou 0-100)
- Ajouter des images/structures moléculaires quand disponibles
- Masquer les filtres avancés par défaut avec option "Plus de filtres"

---

### Page Recettes

**Points positifs :**
- 261 recettes disponibles
- Filtres par gamme et type (parfum, résine, tabac, encens)
- Fonction de comparaison intégrée

**Problèmes identifiés :**
1. **Cartes de recettes** :
   - Beaucoup de recettes sans nom descriptif (juste "R-18", "R-17")
   - Badge "Nouveau" sur presque toutes les recettes → perd son sens
   - Intensité affichée de façon incohérente (7/10 vs 82/10)

2. **Hiérarchie de l'information** :
   - Les filtres prennent beaucoup de place
   - Pas de vue "grille" vs "liste" pour s'adapter aux préférences

3. **Contenu manquant** :
   - Pas de description courte visible sur les cartes
   - Pas d'aperçu des molécules principales

**Recommandations :**
- Ajouter des noms descriptifs aux recettes (pas juste des codes)
- Limiter le badge "Nouveau" aux 30 derniers jours
- Ajouter une description courte sur chaque carte
- Proposer une vue liste compacte

---

## Analyse globale du contenu

### Données disponibles
| Entité | Quantité affichée | Problèmes |
|--------|-------------------|-----------|
| Molécules | 366 (page) / 192 (home) / 131 (stats) | Incohérence majeure |
| Recettes | 261 | OK mais beaucoup sans nom |
| Accords | 25 | Non vérifié |
| Gammes | 5 | OK |
| Traditions | 26 | Non vérifié |

### Qualité des données
- **Complétude** : Beaucoup de champs "non disponible" ou vides
- **Cohérence** : Échelles d'intensité variables, doublons potentiels
- **Fraîcheur** : Badge "Nouveau" trop répandu

---

## Recommandations d'implémentation

### Priorité haute
1. [ ] Créer une API centralisée pour les statistiques globales
2. [ ] Nettoyer les doublons de molécules
3. [ ] Normaliser les échelles (intensité 0-10 partout)
4. [ ] Ajouter des noms descriptifs aux recettes

### Priorité moyenne
5. [ ] Améliorer les cartes avec plus d'informations visuelles
6. [ ] Ajouter des vues alternatives (grille/liste)
7. [ ] Limiter le badge "Nouveau" temporellement
8. [ ] Masquer les filtres avancés par défaut

### Priorité basse
9. [ ] Ajouter des structures moléculaires visuelles
10. [ ] Créer des aperçus de composition pour les recettes
11. [ ] Améliorer la recherche avec autocomplétion
