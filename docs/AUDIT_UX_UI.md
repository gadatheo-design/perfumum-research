# Audit UX/UI — PERFUMUM

**Date** : 2 décembre 2025  
**Pages auditées** : Home, Chimie, Civilisations, Molécule Detail, Recherche

---

## 🏠 Page Home

### ✅ Points forts
- **Hiérarchie visuelle claire** : Titre PERFUMUM en gros, citation en blockquote, description concise
- **CTAs bien visibles** : "Explorer les Prototypes" (violet) et "Découvrir le Projet" (outline)
- **Statistiques impactantes** : 4 Prototypes, 6+ Familles, 120+ Accords, 100+ Molécules, 160+ Recettes, 25+ Civilisations, 12+ Installations
- **Cartes de navigation** : 4 cartes cliquables vers sections principales (Prototypes, Familles, Laboratoire, Civilisations)
- **Typographie cohérente** : Titres en gras, texte en gris muted

### ⚠️ Problèmes identifiés
1. **Navigation surchargée** : 12 liens dans le header (Le Projet, Prototypes, Familles, Chimie, Accords, Expérimental, Laboratoire, Glossaire, Timeline, ABSORBE, Recherche, Civilisations) — trop de choix, risque de paralysie décisionnelle
2. **Manque de hiérarchie dans la navigation** : Tous les liens ont le même poids visuel, pas de regroupement logique
3. **Cartes de navigation** : Bordures en pointillés (dashed) peu professionnelles, préférer des bordures solides ou des ombres subtiles
4. **Statistiques** : Chiffres en violet (#8b5cf6) mais pas de légende explicative sur ce que représentent exactement ces nombres
5. **Responsive** : À vérifier sur mobile (navigation horizontale scrollable ?)

---

## 🧪 Page Chimie (ChemicalFamilies)

### ✅ Points forts
- **Liste de familles cliquable** : Sidebar avec 11 familles chimiques
- **Cartes molécules** : Informations complètes (formule, profil olfactif, effet fonctionnel, résonance émotionnelle)
- **Badges** : Source et variabilité bien visibles

### ⚠️ Problèmes identifiés
1. **Manque de feedback visuel** : Quelle famille est sélectionnée ? Pas de highlight visible
2. **Cartes molécules** : Pas de lien visuel clair vers la page de détail (pas de hover effect, pas d'icône "voir plus")
3. **Sidebar** : Pas de scroll visible si plus de 11 familles

---

## 🌍 Page Civilisations

### ✅ Points forts
- **Cas d'étude Royal Mossi** : Bien documenté avec contexte historique
- **Base de données civilisations** : 10 civilisations avec cartes cliquables
- **Badges temporalité** : Bien visibles (antique, archaic)

### ⚠️ Problèmes identifiés
1. **Cartes civilisations** : Pas de hover effect pour indiquer qu'elles sont cliquables
2. **Matériaux symboliques** : Badges trop petits, difficiles à lire
3. **Manque de breadcrumb** : Difficile de savoir où on est dans la navigation

---

## 🔬 Page Molécule Detail

### ✅ Points forts
- **Graphe React Flow** : Visualisation interactive des relations
- **Informations complètes** : Formule chimique, famille, profil olfactif, résonance émotionnelle
- **Bouton retour** : Bien visible en haut à gauche

### ⚠️ Problèmes identifiés
1. **Graphe** : Nœuds trop petits, texte difficile à lire
2. **Légende** : Pas assez visible, devrait être plus grande
3. **Manque de contexte** : Pas de lien vers la famille chimique parente

---

## 🔍 Page Recherche

### ✅ Points forts
- **Barre de recherche** : Bien visible, debounce fonctionnel
- **Résultats groupés** : Par type (Recettes, Glossaire, etc.)
- **Badges de comptage** : Nombre de résultats par type

### ⚠️ Problèmes identifiés
1. **Pas de placeholder** : Barre de recherche vide sans indication
2. **Résultats** : Pas de highlight du terme recherché dans les résultats
3. **Manque d'états vides** : Que se passe-t-il si aucun résultat ?

---

## 📊 Problèmes transversaux

### 1. **Navigation**
- **Trop de liens** : 12 liens dans le header, difficile de s'y retrouver
- **Pas de regroupement** : Pas de menu déroulant ou de catégories
- **Pas de breadcrumb** : Difficile de savoir où on est dans la hiérarchie

### 2. **Cohérence visuelle**
- **Bordures pointillées** : Utilisées sur la page Home mais pas ailleurs
- **Cartes** : Certaines ont des ombres, d'autres des bordures
- **Badges** : Couleurs incohérentes entre les pages

### 3. **Accessibilité**
- **Contraste** : Certains textes en gris clair difficiles à lire
- **Focus** : Pas de focus visible sur les éléments interactifs
- **Alt text** : À vérifier sur les images

### 4. **Responsive**
- **Navigation** : À vérifier sur mobile
- **Graphes React Flow** : À tester sur tablette et mobile
- **Cartes** : Grid responsive à vérifier

---

## 🎯 Priorités de correction

### Haute priorité
1. **Simplifier la navigation** : Regrouper les liens en catégories (Recherche, Données, Visualisations, Méthodologie)
2. **Ajouter des breadcrumbs** : Sur toutes les pages de détail
3. **Harmoniser les cartes** : Choisir un style unique (ombre subtile + bordure fine)
4. **Améliorer les hover effects** : Indiquer clairement les éléments cliquables

### Moyenne priorité
5. **Améliorer les graphes React Flow** : Nœuds plus grands, texte plus lisible
6. **Ajouter des états vides** : Messages explicites quand aucune donnée
7. **Améliorer le contraste** : Textes plus lisibles
8. **Ajouter des placeholders** : Dans les champs de recherche

### Basse priorité
9. **Responsive** : Tester et optimiser sur mobile/tablette
10. **Accessibilité** : Ajouter alt text, focus visible, ARIA labels
