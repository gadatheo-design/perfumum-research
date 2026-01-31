# Analyse du fichier Commence.zip

**Date d'analyse** : 31 janvier 2026  
**Contenu** : 44 fichiers Markdown + 6 images PNG

---

## 1. Vue d'ensemble du contenu

Le dossier contient une documentation riche et structurée autour de trois axes principaux :

### A. Recherche scientifique sur la perception sensorielle (8 fichiers)

| Fichier | Contenu | Intérêt |
|:--------|:--------|:--------|
| Introduction.md | Analyse de l'étude Cain et al. (1987) sur l'irritation et l'insatisfaction | ⭐⭐⭐ Fondamental pour comprendre la perception de la fumée |
| Impact de l'Air, de la Température... | Effets environnementaux sur la perception des arômes de combustion | ⭐⭐⭐ Données scientifiques sur tabac, cannabis, encens |
| Le Duo Dynamique... | Mécanismes température/humidité sur la combustion | ⭐⭐⭐ Paramètres techniques de dégustation |
| L'Orchestration Sensorielle... | Environnement et perception de la fumée de tabac | ⭐⭐⭐ Contexte sensoriel |
| De l'Irritation Passive... | Analyse comparative Cain (1987) vs Rees (2025) | ⭐⭐ Évolution de la recherche |
| L'Art de la Tromperie... | Industrie du tabac et ventilation des filtres | ⭐⭐ Contexte historique |

### B. Recettes et formulations de cigarillos (15+ fichiers)

| Collection | Nombre de recettes | Concept |
|:-----------|:-------------------|:--------|
| **Archives Vivantes** | 15 recettes | Patrimoine botanique : landraces cannabis + tabacs anciens + molécules osmothèque |
| **Archives Vivantes v2.0** | 15 recettes | Version améliorée avec protocoles détaillés |
| **Haute Parfumerie Fumée** | 10 recettes | Cigarillos d'exception avec accords parfumerie |
| **Recettes individuelles** | 4 recettes | Triptyque de Cannabis, Éloge du Tabac, Ambre Gris Océanique, etc. |

**Exemples de recettes notables** :
- **Chypre Afghan** : Landrace Afghan + Perique + Mousse de Chêne
- **Fougère Tropicale** : Thai Stick + Virginia Gold + Coumarine
- **Cuir de Durban** : Durban Poison + Burley 21 + Accord Cuir
- **Triptyque de Cannabis** : 3 expressions cannabis (Cherry Wine, Triple O, Lifter US) + Krumovgrad

### C. Protocoles techniques (10+ fichiers)

| Protocole | Application |
|:----------|:------------|
| Cryo-Micronisation de la Résine | Transformation résine en poudre fine |
| Nébulisation à Froid pour Crude Oil CBD | Application homogène d'extraits |
| Maturation et Roulage | Temps de repos, conditions, techniques |
| Analyse Sensorielle | Validation des techniques |
| Espaces Sensoriels Immersifs | Conception de lieux de dégustation |

### D. Notes de recherche (14 fichiers)

| Thème | Contenu |
|:------|:--------|
| notes_terpenes_cannabis.md | Profils terpéniques OG Kush et variétés premium |
| notes_landraces_tabac.md | 14 landraces cannabis + 8 variétés tabac anciennes |
| notes_osmotheque_molecules.md | 10 molécules disparues/restreintes + applications |
| notes_produits_transformes_cannabis.md | Pollens, résines, extraits |
| notes_contexte_physique_luxe.md | Design d'expérience de dégustation |
| notes_protocoles_mesure.md | Méthodes de mesure et validation |

---

## 2. Proposition d'implémentation

### Phase 1 : Nouvelle section "Recettes & Formulations" (Priorité haute)

**Créer une nouvelle entité `recipes` avec** :
- Nom de la recette
- Collection d'appartenance
- Composition (cannabis, tabac, molécules parfumerie)
- Profil terpénique attendu
- Protocole de fabrication
- Profil de dégustation
- Accords suggérés

**Pages à créer** :
- `/recettes` : Liste des collections avec filtres
- `/recettes/:id` : Détail d'une recette avec composition visuelle

**Estimation** : 40+ recettes à importer

### Phase 2 : Nouvelle section "Protocoles Techniques" (Priorité haute)

**Créer une entité `protocols` avec** :
- Nom du protocole
- Catégorie (maturation, extraction, analyse, etc.)
- Équipements requis
- Étapes détaillées
- Paramètres de contrôle
- Coûts estimés

**Pages à créer** :
- `/protocoles` : Liste des protocoles par catégorie
- `/protocoles/:id` : Détail avec diagrammes et étapes

**Estimation** : 10+ protocoles à importer

### Phase 3 : Enrichissement des données existantes (Priorité moyenne)

**Landraces cannabis** : Ajouter les 14 landraces documentées avec profils terpéniques détaillés
- Afghan, Hindu Kush, Mazar-i-Sharif
- Durban Poison, Thai Stick, Acapulco Gold
- Malawi Gold, Lamb's Bread, Panama Red, Colombian Gold
- Nepalese, Lebanese, Kerala, Punto Rojo

**Tabacs anciens** : Ajouter les 8 variétés patrimoniales
- One Sucker, Virginia Gold, Burley 21, Louisiana Perique
- Sacred Wyandot, Tabac de la Semois, Ancient Tobacco, Hopi Tobacco

**Molécules osmothèque** : Enrichir la base de molécules avec les 10 molécules historiques
- Muscs nitrés, Mousse de Chêne, Coumarine, Safrole
- Huile de Bois de Rose, Civette, Castoreum, Ambre Gris
- Aldéhydes classiques, Eugénol

### Phase 4 : Section "Recherche Sensorielle" (Priorité moyenne)

**Créer une section documentaire** :
- Articles scientifiques sur la perception
- Études de référence (Cain 1987, Rees 2025)
- Mécanismes de perception
- Impact environnemental sur la dégustation

### Phase 5 : Section "Espaces de Dégustation" (Priorité basse)

**Créer une section sur le design d'expérience** :
- Spécifications techniques pour espaces sensoriels
- Protocoles de validation
- Études de cas (Cabinet Temporel)

---

## 3. Connexions avec les données existantes

| Données Commence.zip | Connexions site existant |
|:---------------------|:-------------------------|
| Landraces cannabis | → Plantes (chemotypes), Molécules (terpènes) |
| Tabacs anciens | → Plantes (Perique, Latakia, etc.), Composés Perique |
| Molécules parfumerie | → Molécules, Familles olfactives |
| Recettes | → Plantes, Molécules, Méthodes analytiques |
| Protocoles | → Méthodes analytiques, Recherche |
| Études perception | → Recherche, Sources bibliographiques |

---

## 4. Estimation du travail

| Phase | Effort | Durée estimée |
|:------|:-------|:--------------|
| Phase 1 : Recettes | Élevé | 2-3 sessions |
| Phase 2 : Protocoles | Moyen | 1-2 sessions |
| Phase 3 : Enrichissement | Moyen | 1-2 sessions |
| Phase 4 : Recherche sensorielle | Faible | 1 session |
| Phase 5 : Espaces dégustation | Faible | 1 session |

---

## 5. Recommandation

**Commencer par la Phase 1 (Recettes)** car :
1. C'est le cœur du projet (interaction tabac/cannabis/parfum)
2. Les données sont riches et structurées
3. Crée une valeur immédiate pour la recherche
4. Permet de valider le modèle de données avant les autres phases

**Prochaine action suggérée** : Créer le schéma de base de données pour les recettes et importer les 3 premières recettes comme prototype.
