# PERFUMUM — Analyse de l'état actuel

**Date** : 04 janvier 2026

## 📊 Statistiques de la base de données

- **448 molécules** documentées
- **261 recettes** olfactives
- **26 accords** créés
- **4 prototypes** (C1-C4)
- **27 traditions** olfactives
- **168 pages** frontend
- **~70 tables** dans le schéma de base de données

## ✅ Fonctionnalités existantes

### Pages principales
- Page d'accueil avec 3 parcours (Chercheur, Créateur, Curieux)
- 5 gammes thématiques (Pétrichor, Volcanique, Traditions, Glaciaire, Bio-Lab)
- Catalogue de molécules avec fiches détaillées
- Catalogue de recettes avec filtres
- Dashboard analytics
- Système de recherche avancée
- Comparateurs (molécules, recettes, plantes)
- Outils de formulation (calculateur de coût, proportions)
- Système de favoris
- Export Markdown/JSON
- TerpProfiles (fiches analytiques)
- Recettes finales (parfum, encens, espace)
- États botaniques (tabac, cannabis)
- Timeline botanique
- Variétés fantômes
- Recherche radicale

### Design
- Mode sombre/clair
- Design responsive (desktop/mobile)
- Navigation par menu déroulant
- Cartes interactives avec icônes
- Graphiques radar pour profils olfactifs

## 🔴 Lacunes identifiées

### Contenu à enrichir
1. **Données scientifiques incomplètes** : Beaucoup de molécules sans IUPAC, CAS, ou classe chimique
2. **Origines géographiques** : Peu de données sur les terroirs et provenances
3. **Restrictions IFRA** : Non intégrées aux fiches molécules
4. **Bibliographie** : Sources académiques limitées
5. **Images** : Peu de visuels botaniques ou moléculaires

### Fonctionnalités manquantes
1. **Import CSV/Excel** pour les plantes et analyses GC-MS
2. **Export PDF** des fiches plantes
3. **Galerie d'images** pour les plantes
4. **Timeline d'évolution** des recherches
5. **Cartes interactives** des terroirs

### Architecture
1. **Versioning des données** non implémenté
2. **Conventions de nommage** non documentées
3. **Standards de saisie** non formalisés

## 🎯 Opportunités d'amélioration

### Court terme (1-2 jours)
- Enrichir les données scientifiques des molécules existantes
- Ajouter les numéros CAS et noms IUPAC
- Compléter les classes chimiques

### Moyen terme (3-5 jours)
- Intégrer les restrictions IFRA
- Ajouter les origines géographiques détaillées
- Créer le système d'import CSV

### Long terme (1-2 semaines)
- Développer la galerie d'images
- Créer les cartes interactives des terroirs
- Implémenter le versioning des données

## 📁 Fichiers de documentation existants

- `docs/CONVENTIONS.md` - Conventions du projet
- `docs/GLOSSAIRE_BOTANIQUE.md` - Glossaire botanique
- `docs/GUIDE_SAISIE_BOTANIQUE.md` - Guide de saisie
- `docs/analyse-donnees-formulation.md` - Analyse des données
- `docs/matieres-premieres-prioritaires.md` - Matières premières
- `docs/molecules-rares-proposition.md` - Molécules rares
- `docs/protocole-petrichor-sacre.md` - Protocole Pétrichor
- `roadmap-3-iterations.md` - Roadmap UX
