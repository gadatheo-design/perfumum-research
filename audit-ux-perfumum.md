# AUDIT UX RAPIDE — PERFUMUM
**Date** : 25 décembre 2025  
**Focus** : Compréhension immédiate, page /recettes, navigation, actions disponibles  
**Méthodologie** : Analyse heuristique + parcours utilisateur

---

## 🎯 RÉSUMÉ EXÉCUTIF

Le site PERFUMUM présente une **structure solide** avec une identité visuelle cohérente (laboratoire, sobre). Cependant, plusieurs **frictions UX** ralentissent la compréhension immédiate et l'accès aux fonctionnalités clés. Les améliorations proposées sont **incrémentales** et **testables** sans refonte complète.

**Score global** : 7/10 (bon, avec potentiel d'amélioration rapide)

---

## 📊 10 POINTS D'AMÉLIORATION (CLASSÉS PAR IMPACT)

### 🔴 IMPACT HAUT (Priorité 1)

#### 1. **Absence de texte de contexte explicite sur la home**

**Problème** : Le visiteur doit déduire ce qu'est PERFUMUM à partir de fragments dispersés ("laboratoire atmosphérique olfactif", "Plateforme de Recherche & Développement"). Aucun texte de 2-3 lignes n'explique clairement **ce qu'on peut faire** sur le site.

**Pourquoi c'est critique** : Un chercheur, artiste ou curieux qui arrive sur le site ne comprend pas immédiatement s'il peut consulter des données, créer des recettes, ou simplement lire.

**Solution simple** :  
Ajouter un bloc de texte de 2-3 lignes **juste après le titre principal** :

> *"PERFUMUM est une plateforme de recherche olfactive expérimentale. Explorez 288 molécules documentées, 234 recettes olfactives et des outils de formulation. Consultez les méthodologies scientifiques (GC-MS, synergies moléculaires) ou découvrez les gammes thématiques (Pétrichor, Volcanique, Traditions)."*

**Ordre de mise en œuvre** : Itération 1 (quick win)

---

#### 2. **Navigation principale peu explicite (3 menus : Recherche, Méthodologie, Communauté)**

**Problème** : Les 3 menus principaux sont **trop génériques**. "Recherche" ne dit pas si c'est une barre de recherche, une base de données, ou une page de résultats. "Méthodologie" et "Communauté" sont des concepts abstraits.

**Pourquoi c'est critique** : L'utilisateur doit **deviner** où trouver les molécules, les recettes, ou les outils. Cela augmente la charge cognitive et le taux de rebond.

**Solution simple** :  
Renommer les menus pour être **descriptifs** :
- **"Recherche"** → **"Données"** (ou "Base de données")
- **"Méthodologie"** → **"Méthodologie"** (OK, mais ajouter un sous-titre "Protocoles & Outils")
- **"Communauté"** → **"À propos"** (ou "Projet & Contact")

Ou bien, adopter une structure plus classique :
- **Molécules** | **Recettes** | **Outils** | **Méthodologie** | **À propos**

**Ordre de mise en œuvre** : Itération 1 (quick win)

---

#### 3. **Hiérarchie visuelle faible entre les 3 parcours (Chercheur, Créateur, Curieux)**

**Problème** : Les 3 cartes de parcours sont **identiques visuellement** (même taille, même poids). L'utilisateur ne sait pas par où commencer ni quel parcours correspond à son profil.

**Pourquoi c'est critique** : La section "Trois parcours" est une **excellente idée conceptuelle**, mais elle manque de **guidage visuel**. Un visiteur lambda ne sait pas s'il est "Chercheur", "Créateur" ou "Curieux".

**Solution simple** :  
- Ajouter des **icônes distinctives** (microscope, palette, boussole)
- Utiliser des **couleurs d'accentuation** différentes pour chaque parcours
- Ajouter un **quiz rapide** (1 question) : *"Que souhaitez-vous faire ?"* → Redirection automatique

**Ordre de mise en œuvre** : Itération 1 (quick win)

---

### 🟡 IMPACT MOYEN (Priorité 2)

#### 4. **Page /recettes non testée (besoin d'accès)**

**Problème** : Impossible d'auditer la page /recettes sans y accéder. Hypothèses basées sur la structure générale :
- Absence probable de **filtres visibles** (famille, support, statut, intensité)
- Absence probable de **recherche texte** en temps réel
- Absence probable de **tri** (date, popularité, intensité)

**Pourquoi c'est important** : La page /recettes est le **cœur fonctionnel** du site pour les créateurs. Sans filtres efficaces, l'utilisateur est perdu dans 234 recettes.

**Solution simple** :  
- Ajouter une **barre de recherche** en haut de page (placeholder : "Rechercher une recette...")
- Ajouter des **filtres visibles** (dropdowns ou tags) : Famille, Support, Statut, Intensité
- Ajouter un **tri basique** (dropdown) : Plus récentes, Plus anciennes, Intensité croissante/décroissante

**Ordre de mise en œuvre** : Itération 2 (comparaison & filtres)

---

#### 5. **Absence d'actions claires sur les cartes molécules/recettes**

**Problème** : Les cartes molécules et recettes affichées sur la home (ex : "Hexanoic acid", "OS PLUVIEUX") sont **passives**. Aucune action visible (Comparer, Exporter, Ajouter aux favoris).

**Pourquoi c'est important** : L'utilisateur ne sait pas **ce qu'il peut faire** avec ces cartes. Sont-elles cliquables ? Peut-on les comparer ? Les exporter ?

**Solution simple** :  
Ajouter 3 actions sur chaque carte (au hover ou en permanence) :
- **Comparer** (icône balance)
- **Exporter** (icône téléchargement)
- **Favoris** (icône étoile)

**Ordre de mise en œuvre** : Itération 2 (comparaison & actions)

---

#### 6. **Boutons CTA peu différenciés ("Consulter les gammes" vs "Accéder au Dashboard")**

**Problème** : Les 2 boutons principaux ont **le même poids visuel** (même taille, même position). L'utilisateur ne sait pas lequel est l'action **primaire**.

**Pourquoi c'est important** : Un bon design UX guide l'utilisateur vers **l'action principale**. Ici, "Consulter les gammes" semble être le CTA principal, mais il n'est pas mis en avant.

**Solution simple** :  
- **"Consulter les gammes"** → Bouton primaire (fond violet, texte blanc)
- **"Accéder au Dashboard"** → Bouton secondaire (fond transparent, bordure)

**Ordre de mise en œuvre** : Itération 1 (quick win)

---

### 🟢 IMPACT BAS (Priorité 3)

#### 7. **Section "Actualités de la recherche" trop longue**

**Problème** : Les 3 actualités affichées sur la home sont **trop détaillées** (titres longs, descriptions complètes). Cela alourdit la page et dilue l'attention.

**Pourquoi c'est secondaire** : Les actualités sont utiles, mais elles ne doivent pas **dominer** la page d'accueil. L'utilisateur vient pour les données, pas pour lire des articles.

**Solution simple** :  
- Réduire à **1 seule actualité** sur la home (la plus récente)
- Ajouter un lien "Voir toutes les actualités" vers une page dédiée

**Ordre de mise en œuvre** : Itération 3 (polish)

---

#### 8. **Absence de breadcrumbs (fil d'Ariane)**

**Problème** : L'utilisateur ne sait pas **où il se trouve** dans l'arborescence du site. Pas de fil d'Ariane visible.

**Pourquoi c'est secondaire** : Le site est relativement **plat** (peu de niveaux de profondeur), donc les breadcrumbs ne sont pas critiques. Mais ils améliorent l'orientation.

**Solution simple** :  
Ajouter un fil d'Ariane en haut de chaque page (ex : Home > Molécules > Hexanoic acid)

**Ordre de mise en œuvre** : Itération 3 (polish)

---

#### 9. **Absence d'indicateur de progression (loading states)**

**Problème** : Lors du chargement des données (molécules, recettes), aucun indicateur de progression n'est visible. L'utilisateur ne sait pas si le site est en train de charger ou s'il est bloqué.

**Pourquoi c'est secondaire** : Le site semble **rapide** (pas de latence visible), donc ce n'est pas critique. Mais c'est une bonne pratique UX.

**Solution simple** :  
Ajouter des **skeleton loaders** (cartes grises animées) pendant le chargement des données.

**Ordre de mise en œuvre** : Itération 3 (polish)

---

#### 10. **Footer trop dense (12 liens)**

**Problème** : Le footer contient **12 liens** répartis en 3 colonnes. C'est beaucoup pour un site de recherche. L'utilisateur ne sait pas quels liens sont **essentiels**.

**Pourquoi c'est secondaire** : Le footer est rarement consulté sur la home. Mais il peut être simplifié pour améliorer la lisibilité.

**Solution simple** :  
Réduire à **6 liens essentiels** :
- À propos
- Contact
- Glossaire
- Molécules
- Recettes
- Méthodologie

**Ordre de mise en œuvre** : Itération 3 (polish)

---

## 🗓️ ORDRE DE MISE EN ŒUVRE (3 ITÉRATIONS)

### **Itération 1 : Quick Wins (1-2 jours)**
- Point 1 : Ajouter texte de contexte sur la home
- Point 2 : Renommer les menus principaux
- Point 3 : Améliorer la hiérarchie visuelle des 3 parcours
- Point 6 : Différencier les boutons CTA

**Critère "done"** : Un visiteur comprend en 10 secondes ce qu'est PERFUMUM et où trouver les données.

---

### **Itération 2 : Comparaison & Filtres (3-5 jours)**
- Point 4 : Ajouter filtres et recherche sur /recettes
- Point 5 : Ajouter actions (Comparer, Exporter, Favoris) sur les cartes

**Critère "done"** : Un utilisateur peut filtrer 234 recettes et comparer 2-4 molécules.

---

### **Itération 3 : Polish & Exports (2-3 jours)**
- Point 7 : Réduire la section actualités
- Point 8 : Ajouter breadcrumbs
- Point 9 : Ajouter skeleton loaders
- Point 10 : Simplifier le footer

**Critère "done"** : Le site est **professionnel** et prêt à être partagé avec des artistes/clients.

---

## 🎯 PROCHAINES ÉTAPES

1. **Valider cet audit** avec vous
2. **Prioriser** les points à implémenter (itération 1, 2 ou 3)
3. **Implémenter** les améliorations par itération
4. **Tester** chaque itération avant de passer à la suivante

---

**Note** : Cet audit est basé sur la page d'accueil uniquement. Un audit complet de la page /recettes nécessite un accès direct.
