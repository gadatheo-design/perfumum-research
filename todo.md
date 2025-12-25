# TODO — PERFUMUM Research

**Projet** : PERFUMUM — Plateforme de recherche olfactive expérimentale  
**Durée** : 10 ans (2025-2035)  
**Dernière mise à jour** : 25 décembre 2025

---

## 🚀 ITÉRATION 1 : QUICK WINS (Compréhension immédiate)

### Objectif
Améliorer la compréhension immédiate du site pour qu'un visiteur comprenne en 10 secondes ce qu'est PERFUMUM et où trouver les données.

### Tâches

- [x] 1.1 Ajouter texte de contexte sur la home (2-3 lignes après le titre principal)
- [x] 1.2 Ajouter tagline sous le logo dans le header
- [x] 1.3 Améliorer la hiérarchie visuelle des 3 parcours (icônes, couleurs, tailles)
- [x] 1.4 Différencier les boutons CTA (primaire vs secondaire)
- [x] 1.5 Simplifier le footer (réduire de 12 à 6 liens essentiels)

### Critères "done"
- [ ] Un visiteur comprend en 10 secondes ce qu'est PERFUMUM
- [ ] Les 3 parcours sont visuellement différenciés
- [ ] Le CTA principal est clairement identifié
- [ ] Le footer est lisible et non surchargé

---

## 📋 ITÉRATION 2 : COMPARAISON & FILTRES (À venir)

- [ ] 2.1 Ajouter un dropdown "Trier par" sur /recettes
- [ ] 2.2 Ajouter un bouton "Réinitialiser les filtres"
- [ ] 2.3 Améliorer le placeholder de recherche
- [ ] 2.4 Ajouter des tooltips sur les filtres avancés
- [ ] 2.5 Créer une page /compare-recettes MVP
- [ ] 2.6 Améliorer les labels des actions sur les cartes

---

## 📦 ITÉRATION 3 : EXPORTS & FAVORIS (À venir)

- [ ] 3.1 Implémenter système de favoris (localStorage)
- [ ] 3.2 Créer export Markdown (Notion-ready)
- [ ] 3.3 Créer export JSON structuré
- [ ] 3.4 Ajouter breadcrumbs (fil d'Ariane)
- [ ] 3.5 Ajouter skeleton loaders
- [ ] 3.6 Réduire la section actualités sur la home

---

## 📊 BASE DE DONNÉES ACTUELLE

- 176 molécules documentées
- 195 recettes expérimentales
- 25 accords olfactifs
- 4 prototypes fondamentaux (C1-C4)
- 26 traditions olfactives culturelles
- 7 installations artistiques

---

## 🐛 BUGS CONNUS

### Pages blanches en développement (HMR Vite)
- Dashboard - Page blanche (bug HMR dev uniquement)
- Recettes - Page blanche (bug HMR dev uniquement)
- Graphe D3.js - Page blanche (bug HMR dev uniquement)

**Note** : Ces bugs disparaissent automatiquement en production (build).

---

## ⚠️ RÈGLES DE DÉVELOPPEMENT

### Règle des 3 tentatives
Ne JAMAIS répéter la même action plus de 3 fois. Si une solution ne fonctionne pas après 3 essais :
1. Arrêter immédiatement
2. Documenter le problème dans KNOWN_ISSUES.md
3. Informer l'utilisateur
4. Proposer une approche alternative

### Règle des 15 minutes
Si un problème technique bloque le travail pendant plus de 15 minutes :
1. Informer l'utilisateur du blocage
2. Expliquer ce qui a été tenté
3. Demander s'il faut continuer ou passer à autre chose

### Avant toute modification
Lire obligatoirement :
- KNOWN_ISSUES.md — Problèmes récurrents
- DEVELOPMENT_GUIDE.md — Guide de développement
- Ce fichier todo.md — État des tâches

---

## 📝 NOTES

- Projet long terme (10 ans), priorité à la stabilité > vitesse
- Documentation obligatoire pour chaque modification
- Checkpoints fréquents pour sauvegarder l'état
- Tester avant et après chaque modification


---

## 🌍 AXES RÉGIONAUX : COLOMBIE & BURKINA FASO (À intégrer)

### Contexte
Deux axes de recherche olfactive majeurs à structurer dans le site :
- **Colombie** : Humidité, fermentation, stratification (pôle HUMIDE/FERMENTÉ/INSTABLE)
- **Burkina Faso / Mossi** : Sécheresse, autorité, combustion (pôle SEC/RITUEL/ÉPURÉ)

### Tâches d'intégration

#### Phase 1 : Structure de base
- [ ] Créer page `/axes-regionaux` (vue d'ensemble)
- [ ] Créer page `/axes-regionaux/colombie` avec sections :
  - [ ] Positionnement conceptuel
  - [ ] Axes moléculaires dominants (Humidité/sol, Fermentation, Air tropical)
  - [ ] Contextes d'usage site-specific
  - [ ] 10 typologies de recettes
  - [ ] Contraintes techniques
- [ ] Créer page `/axes-regionaux/burkina-faso` avec sections :
  - [ ] Positionnement conceptuel
  - [ ] Axes moléculaires dominants (Sec/minéral, Animalité, Bois/pouvoir)
  - [ ] Contextes d'usage
  - [ ] 10 typologies de recettes
  - [ ] Dimension éthique

#### Phase 2 : Données et relations
- [ ] Ajouter champ `axe_regional` dans table `recettes` (enum: 'colombie', 'burkina_faso', null)
- [ ] Créer 10 recettes colombiennes (Pétrichor équatorial, Fermentation tropicale, etc.)
- [ ] Créer 10 recettes burkinabées (Terre sahélienne, Fumée des ancêtres, etc.)
- [ ] Lier molécules spécifiques à chaque axe (Géosmin pour Colombie, Phénols secs pour Burkina)

#### Phase 3 : Filtres et comparaisons
- [ ] Ajouter filtre "Axe régional" sur page `/recettes`
- [ ] Créer page `/compare-axes` (Colombie ↔ Burkina Faso)
- [ ] Tableau comparatif : Humidité vs Sécheresse, Fermentation vs Combustion, etc.
- [ ] Visualisation radar superposée (profils olfactifs opposés)

#### Phase 4 : Navigation et exports
- [ ] Ajouter "Axes Régionaux" dans le menu principal
- [ ] Créer liens croisés : depuis `/gammes` vers `/axes-regionaux`
- [ ] Export Markdown par recette avec mention de l'axe régional
- [ ] Export JSON avec métadonnées d'axe

### Priorité
**Moyenne** — À intégrer après l'Itération 3 (Exports & Favoris)

### Fichier source
`/home/ubuntu/upload/Pasted_content_14.txt` — Document de référence complet
