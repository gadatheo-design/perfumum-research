# ROADMAP 3 ITÉRATIONS — PERFUMUM

**Date** : 25 décembre 2025  
**Objectif** : Planifier les améliorations UX/produit en 3 itérations courtes et testables.  
**Méthodologie** : Priorisation par impact + faisabilité technique

---

## 🎯 VUE D'ENSEMBLE

| Itération | Focus | Durée | Impact attendu |
|-----------|-------|-------|----------------|
| **Itération 1** | Quick Wins (compréhension immédiate) | 1-2 jours | +40% compréhension visiteurs |
| **Itération 2** | Comparaison & Filtres | 3-5 jours | +60% engagement utilisateurs |
| **Itération 3** | Exports & Favoris | 2-3 jours | +30% rétention utilisateurs |

**Durée totale** : 6-10 jours  
**Critère de succès global** : Site prêt à être partagé avec artistes/clients/institutions

---

## 🚀 ITÉRATION 1 : QUICK WINS (1-2 JOURS)

### **Objectif**
Améliorer la **compréhension immédiate** du site pour qu'un visiteur comprenne en 10 secondes ce qu'est PERFUMUM et où trouver les données.

### **Tâches**

#### **1.1 Ajouter texte de contexte sur la home**
**Problème** : Le visiteur doit deviner ce qu'est PERFUMUM à partir de fragments dispersés.

**Solution** :  
Ajouter un bloc de texte de 2-3 lignes **juste après le titre principal** :

> *"PERFUMUM est une plateforme de recherche olfactive expérimentale développée sur 10 ans (2025-2035). Explorez 288 molécules documentées, 234 recettes olfactives et des méthodologies scientifiques (GC-MS, synergies moléculaires). Les accords créés sont utilisés dans des projets artistiques site-specific et archivés selon la méthodologie ABSORBE."*

**Fichier** : `client/src/pages/Home.tsx`  
**Temps estimé** : 30 min  
**Impact** : 🔴 Haut

---

#### **1.2 Ajouter tagline sous le logo**
**Problème** : Absence d'accroche mémorable.

**Solution** :  
Ajouter une tagline sous le logo PERFUMUM dans le header :

> *"Laboratoire de recherche olfactive expérimentale — 10 ans d'exploration moléculaire et artistique"*

**Fichier** : `client/src/components/Header.tsx`  
**Temps estimé** : 15 min  
**Impact** : 🟡 Moyen

---

#### **1.3 Améliorer la hiérarchie visuelle des 3 parcours**
**Problème** : Les 3 cartes de parcours (Chercheur, Créateur, Curieux) sont identiques visuellement.

**Solution** :  
- Ajouter des **icônes distinctives** (microscope, palette, boussole)
- Utiliser des **couleurs d'accentuation** différentes pour chaque parcours
- Agrandir légèrement le parcours "Chercheur" (priorité)

**Fichier** : `client/src/pages/Home.tsx`  
**Temps estimé** : 1h  
**Impact** : 🔴 Haut

---

#### **1.4 Différencier les boutons CTA**
**Problème** : Les 2 boutons principaux ("Consulter les gammes" vs "Accéder au Dashboard") ont le même poids visuel.

**Solution** :  
- **"Consulter les gammes"** → Bouton primaire (fond violet, texte blanc)
- **"Accéder au Dashboard"** → Bouton secondaire (fond transparent, bordure)

**Fichier** : `client/src/pages/Home.tsx`  
**Temps estimé** : 15 min  
**Impact** : 🟡 Moyen

---

#### **1.5 Simplifier le footer**
**Problème** : Le footer contient 12 liens, trop dense.

**Solution** :  
Réduire à **6 liens essentiels** :
- À propos
- Contact
- Glossaire
- Molécules
- Recettes
- Méthodologie

**Fichier** : `client/src/components/Footer.tsx`  
**Temps estimé** : 30 min  
**Impact** : 🟢 Bas

---

### **Critères "done" Itération 1**
- [ ] Un visiteur comprend en 10 secondes ce qu'est PERFUMUM
- [ ] Les 3 parcours sont visuellement différenciés
- [ ] Le CTA principal est clairement identifié
- [ ] Le footer est lisible et non surchargé

### **Tests**
1. Faire tester par 3 personnes externes (non familières avec le projet)
2. Poser la question : *"En 10 secondes, qu'est-ce que PERFUMUM ?"*
3. Valider que 2/3 personnes donnent une réponse correcte

---

## 🔍 ITÉRATION 2 : COMPARAISON & FILTRES (3-5 JOURS)

### **Objectif**
Améliorer l'**engagement utilisateur** en permettant de filtrer, comparer et exporter les données efficacement.

### **Tâches**

#### **2.1 Ajouter un dropdown "Trier par" sur /recettes**
**Problème** : Les recettes ne peuvent pas être triées par l'utilisateur.

**Solution** :  
Ajouter un dropdown en haut de la page /recettes :
- Plus récentes
- Plus anciennes
- Intensité croissante
- Intensité décroissante
- Nombre de molécules (croissant/décroissant)

**Fichier** : `client/src/pages/Recettes.tsx`  
**Temps estimé** : 1h  
**Impact** : 🟡 Moyen

---

#### **2.2 Ajouter un bouton "Réinitialiser les filtres"**
**Problème** : Si l'utilisateur applique plusieurs filtres, il doit les désactiver un par un.

**Solution** :  
Ajouter un bouton "Effacer tous les filtres" (icône X) à côté du compteur de résultats.

**Fichier** : `client/src/pages/Recettes.tsx`  
**Temps estimé** : 30 min  
**Impact** : 🟡 Moyen

---

#### **2.3 Améliorer le placeholder de recherche**
**Problème** : Le placeholder "Rechercher une recette par nom..." est trop restrictif.

**Solution** :  
Changer en : *"Rechercher par nom, ingrédient ou molécule..."*

**Fichier** : `client/src/pages/Recettes.tsx`  
**Temps estimé** : 5 min  
**Impact** : 🟢 Bas

---

#### **2.4 Ajouter des tooltips sur les filtres avancés**
**Problème** : Les filtres "Ingrédients" et "Profil Radar" ne sont pas explicites.

**Solution** :  
Ajouter des tooltips au hover :
- **Ingrédients** : *"Filtrer par molécules présentes dans la recette"*
- **Profil Radar** : *"Filtrer par profil olfactif (intensité, fraîcheur, chaleur, etc.)"*

**Fichier** : `client/src/pages/Recettes.tsx`  
**Temps estimé** : 30 min  
**Impact** : 🟢 Bas

---

#### **2.5 Créer une page /compare-recettes MVP**
**Problème** : Impossible de comparer 2-4 recettes côte à côte.

**Solution** :  
Créer une page `/compare-recettes` avec :
- Sélection de 2 à 4 recettes (via checkboxes sur /recettes)
- Tableau comparatif (colonnes = recettes, lignes = propriétés)
- Profils radar superposés (Chart.js)
- URL partageable (ex : `/compare-recettes?ids=1,2,3`)

**Fichiers** :  
- `client/src/pages/CompareRecettes.tsx` (nouveau)
- `server/routers.ts` (procédure tRPC `recettes.getByIds`)

**Temps estimé** : 3h  
**Impact** : 🔴 Haut

---

#### **2.6 Améliorer les labels des actions sur les cartes**
**Problème** : Les 3 boutons (Comparer, Export, Favoris) ont des icônes peu visibles.

**Solution** :  
Ajouter des tooltips au hover :
- **Comparer** : *"Ajouter à la comparaison"*
- **Export** : *"Exporter en Markdown/JSON"*
- **Favoris** : *"Ajouter aux favoris"*

**Fichier** : `client/src/components/RecetteCard.tsx`  
**Temps estimé** : 30 min  
**Impact** : 🟢 Bas

---

### **Critères "done" Itération 2**
- [ ] Un utilisateur peut trier les 234 recettes par 5 critères différents
- [ ] Un utilisateur peut réinitialiser tous les filtres en 1 clic
- [ ] Un utilisateur peut comparer 2-4 recettes dans un tableau
- [ ] Les tooltips expliquent clairement les actions disponibles

### **Tests**
1. Tester le tri sur /recettes (5 critères)
2. Appliquer 3 filtres, puis cliquer sur "Réinitialiser"
3. Comparer 3 recettes et vérifier le tableau + radars
4. Partager l'URL de comparaison et vérifier qu'elle fonctionne

---

## 📦 ITÉRATION 3 : EXPORTS & FAVORIS (2-3 JOURS)

### **Objectif**
Améliorer la **rétention utilisateur** en permettant de sauvegarder, exporter et organiser les données.

### **Tâches**

#### **3.1 Implémenter système de favoris (localStorage)**
**Problème** : Impossible de sauvegarder des molécules/recettes pour consultation ultérieure.

**Solution** :  
- Stocker les favoris dans `localStorage` (clé : `perfumum_favorites`)
- Ajouter une page `/favoris` listant les molécules/recettes sauvegardées
- Ajouter un bouton "Vider les favoris"

**Fichiers** :  
- `client/src/pages/Favoris.tsx` (nouveau)
- `client/src/hooks/useFavorites.ts` (hook personnalisé)

**Temps estimé** : 2h  
**Impact** : 🟡 Moyen

---

#### **3.2 Créer export Markdown (Notion-ready)**
**Problème** : Impossible d'exporter une recette/molécule en format texte structuré.

**Solution** :  
Créer une fonction `exportToMarkdown()` qui génère un fichier `.md` :

```markdown
# NOM DE LA RECETTE

**Famille** : Pétrichor  
**Prototype** : C1  
**Intensité** : 5/10

## Composition
- Molécule 1 (30%)
- Molécule 2 (50%)
- Molécule 3 (20%)

## Profil Radar
- Intensité : 70
- Fraîcheur : 40
- Chaleur : 60
...

## Notes
Description de la recette...
```

**Fichier** : `client/src/utils/exportMarkdown.ts`  
**Temps estimé** : 1h  
**Impact** : 🟡 Moyen

---

#### **3.3 Créer export JSON structuré**
**Problème** : Impossible d'exporter les données en format machine-readable.

**Solution** :  
Créer une fonction `exportToJSON()` qui génère un fichier `.json` :

```json
{
  "name": "OS PLUVIEUX",
  "family": "Pétrichor",
  "prototype": "C1",
  "intensity": 5,
  "molecules": [
    { "name": "Géosmine", "percentage": 30 },
    { "name": "Pétrichor", "percentage": 50 },
    { "name": "Argile", "percentage": 20 }
  ],
  "radar": {
    "intensity": 70,
    "freshness": 40,
    "warmth": 60,
    "sweetness": 30,
    "spicy": 20,
    "earthy": 90
  }
}
```

**Fichier** : `client/src/utils/exportJSON.ts`  
**Temps estimé** : 30 min  
**Impact** : 🟢 Bas

---

#### **3.4 Ajouter breadcrumbs (fil d'Ariane)**
**Problème** : L'utilisateur ne sait pas où il se trouve dans l'arborescence.

**Solution** :  
Ajouter un fil d'Ariane en haut de chaque page :

```
Home > Molécules > Hexanoic acid
Home > Recettes > OS PLUVIEUX
Home > Gammes > Pétrichor
```

**Fichier** : `client/src/components/Breadcrumbs.tsx` (nouveau)  
**Temps estimé** : 1h  
**Impact** : 🟢 Bas

---

#### **3.5 Ajouter skeleton loaders**
**Problème** : Pas d'indicateur de chargement pendant le fetch des données.

**Solution** :  
Remplacer les spinners par des **skeleton loaders** (cartes grises animées).

**Fichier** : `client/src/components/SkeletonCard.tsx` (nouveau)  
**Temps estimé** : 1h  
**Impact** : 🟢 Bas

---

#### **3.6 Réduire la section actualités sur la home**
**Problème** : Les 3 actualités sont trop détaillées et alourdissent la page.

**Solution** :  
- Afficher **1 seule actualité** sur la home (la plus récente)
- Ajouter un lien "Voir toutes les actualités" vers `/actualites`

**Fichier** : `client/src/pages/Home.tsx`  
**Temps estimé** : 30 min  
**Impact** : 🟢 Bas

---

### **Critères "done" Itération 3**
- [ ] Un utilisateur peut sauvegarder des favoris et les retrouver sur `/favoris`
- [ ] Un utilisateur peut exporter une recette en Markdown et JSON
- [ ] Les breadcrumbs sont visibles sur toutes les pages
- [ ] Les skeleton loaders s'affichent pendant le chargement
- [ ] La home affiche 1 seule actualité au lieu de 3

### **Tests**
1. Ajouter 5 molécules aux favoris, fermer le navigateur, rouvrir → vérifier que les favoris sont toujours là
2. Exporter une recette en Markdown et l'importer dans Notion → vérifier le formatage
3. Exporter une recette en JSON et la parser avec `JSON.parse()` → vérifier la structure
4. Naviguer sur 3 pages différentes et vérifier que les breadcrumbs sont corrects
5. Rafraîchir la page /recettes et vérifier que les skeleton loaders s'affichent

---

## 📊 TABLEAU RÉCAPITULATIF

| Itération | Tâches | Temps total | Impact global |
|-----------|--------|-------------|---------------|
| **Itération 1** | 5 tâches | 1-2 jours | 🔴 Haut (compréhension immédiate) |
| **Itération 2** | 6 tâches | 3-5 jours | 🔴 Haut (engagement utilisateur) |
| **Itération 3** | 6 tâches | 2-3 jours | 🟡 Moyen (rétention utilisateur) |

**Total** : 17 tâches, 6-10 jours, 3 itérations

---

## 🎯 CRITÈRES DE SUCCÈS GLOBAUX

### **Après Itération 1**
- ✅ Un visiteur comprend PERFUMUM en 10 secondes
- ✅ Les 3 parcours sont visuellement différenciés
- ✅ Le CTA principal est clair

### **Après Itération 2**
- ✅ Un utilisateur peut filtrer et trier 234 recettes
- ✅ Un utilisateur peut comparer 2-4 recettes
- ✅ Les tooltips expliquent toutes les actions

### **Après Itération 3**
- ✅ Un utilisateur peut sauvegarder des favoris
- ✅ Un utilisateur peut exporter en Markdown/JSON
- ✅ Le site est **professionnel** et prêt à être partagé

---

## 📝 PROCHAINES ÉTAPES

1. **Valider cette roadmap** avec vous
2. **Commencer l'Itération 1** (1-2 jours)
3. **Tester et valider** avant de passer à l'Itération 2
4. **Itérer** jusqu'à la fin de l'Itération 3
5. **Créer un checkpoint final** avant partage externe
