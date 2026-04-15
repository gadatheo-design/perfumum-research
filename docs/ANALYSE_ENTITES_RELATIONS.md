# Analyse des Entités et Relations - PERFUMUM

**Date**: 2 décembre 2025
**Objectif**: Définir la structure des pages de détail avec graphes de relations

---

## Entités Principales

### 1. Molécules (`molecules`)
**Champs clés**:
- id, name, formula, family
- olfactiveProfile, functionalEffect, emotionalResonance
- source, variability

**Relations**:
- `family` → Famille chimique (texte)
- Utilisée dans → Recettes (via `molecule_recettes`)
- Associée à → Prototypes (via familles chimiques)

**Page de détail** `/molecule/:id`:
- Informations de base
- Profil olfactif complet
- Graphe : Famille chimique → Molécule → Recettes utilisant cette molécule
- Liste des prototypes contenant cette famille chimique

---

### 2. Recettes (`recettes`)
**Champs clés**:
- id, name, formula, familyId, accordId
- type, notes

**Relations**:
- `familyId` → Famille olfactive
- `accordId` → Accord
- Contient → Molécules (via `molecule_recettes`)

**Page de détail** `/recette/:id`:
- Informations de base (nom, formule, type)
- Famille et Accord associés
- Graphe : Famille → Recette → Molécules → Familles chimiques
- Notes et contexte

---

### 3. Civilisations (`civilisations`)
**Champs clés**:
- id, name, region, temporality
- longDescription, symbolicMaterials
- signatureAccordId, bibliographicReferences

**Relations**:
- `signatureAccordId` → Accord signature
- Associée à → Accords expérimentaux (via tables de jonction)
- Liée à → Prototypes (contexte anthropologique)

**Page de détail** `/civilisation/:id`:
- Informations de base (nom, région, temporalité)
- Description longue et matériaux symboliques
- Graphe : Civilisation → Accord signature → Recettes
- Références bibliographiques

---

### 4. Prototypes (`prototypes`)
**Champs clés**:
- id, name, code, formula
- olfactiveFamily, conceptualNote

**Relations**:
- Profil ABSORBE → `absorbe_profiles`
- Familles chimiques → `prototype_chemical_families`
- Variations → `petrichor`, `volcanique`
- Civilisations (contexte anthropologique)

**Page de détail** `/prototype/:id`:
- Informations de base (nom, code, formule)
- Profil ABSORBE (diagramme radar)
- Graphe : Prototype → Familles chimiques → Molécules
- Variations Pétrichor/Volcanique
- Contexte civilisationnel

---

## Tables de Jonction Identifiées

1. `molecule_recettes` : Molécules ↔ Recettes
2. `prototype_chemical_families` : Prototypes ↔ Familles chimiques
3. `petrichor_experimental_accords` : Variations Pétrichor ↔ Accords standards
4. `volcanique_experimental_accords` : Variations Volcanique ↔ Accords extrêmes

---

## Structure Commune des Pages de Détail

### Layout
```
┌─────────────────────────────────────────┐
│ Header avec navigation                   │
├─────────────────────────────────────────┤
│ Titre de l'entité + Badge type          │
├─────────────────────────────────────────┤
│ Section 1: Informations de base         │
│ - Carte avec détails principaux         │
│ - Badges (famille, type, statut)        │
├─────────────────────────────────────────┤
│ Section 2: Graphe de relations          │
│ - Visualisation interactive              │
│ - Légende et contrôles                  │
├─────────────────────────────────────────┤
│ Section 3: Entités liées                │
│ - Cartes cliquables vers autres détails │
├─────────────────────────────────────────┤
│ Section 4: Métadonnées                  │
│ - Dates, sources, références            │
└─────────────────────────────────────────┘
```

### Bibliothèque de Graphes
**Choix**: **React Flow** (react-flow-renderer)
- Léger et performant
- Interactif (zoom, pan, drag)
- Personnalisable
- Bonne documentation
- Types TypeScript natifs

**Alternative**: Cytoscape.js (plus complexe mais plus puissant)

---

## Prochaines Étapes

1. Installer react-flow-renderer
2. Créer un composant `RelationGraph` réutilisable
3. Créer les procédures tRPC pour récupérer les entités avec leurs relations
4. Implémenter les pages de détail une par une
5. Ajouter des liens depuis les listes vers les pages de détail
