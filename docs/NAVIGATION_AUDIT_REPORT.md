# Audit de Navigation — PERFUMUM

> **Date** : 12 janvier 2026  
> **Version** : 1.0  
> **Auteur** : Manus AI

---

## Résumé Exécutif

Le projet PERFUMUM compte actuellement **291 routes uniques** réparties dans le fichier `App.tsx`. Cette fragmentation excessive rend la navigation complexe et la maintenance difficile. Ce rapport propose une stratégie de consolidation pour réduire ce nombre à environ **70-80 routes principales**.

---

## État Actuel

| Métrique | Valeur |
|----------|--------|
| Routes totales | 291 |
| Pages (fichiers .tsx) | 270 |
| Composants | 205 |
| Routes de niveau racine | 184 |
| Routes admin | 23 |
| Routes outils | 8 |
| Routes gammes | 8 |

---

## Analyse par Catégorie

### Routes de Niveau Racine (184)

La majorité des routes sont au niveau racine, ce qui crée une navigation plate et difficile à naviguer. Ces routes devraient être regroupées en catégories logiques.

### Routes Administration (23 routes)

Les routes `/admin/*` sont déjà bien organisées mais pourraient être consolidées en un hub avec onglets :

| Route Actuelle | Consolidation Proposée |
|----------------|------------------------|
| `/admin/molecules` | Hub Admin → Onglet Molécules |
| `/admin/recettes` | Hub Admin → Onglet Recettes |
| `/admin/accords` | Hub Admin → Onglet Accords |
| `/admin/familles` | Hub Admin → Onglet Familles |
| `/admin/matieres` | Hub Admin → Onglet Matières |
| `/admin/validation` | Hub Admin → Onglet Validation |
| `/admin/import-csv` | Hub Admin → Onglet Import |
| `/admin/historique` | Hub Admin → Onglet Historique |

### Routes Gammes (8 routes)

Les gammes olfactives pourraient être consolidées :

| Route Actuelle | Consolidation Proposée |
|----------------|------------------------|
| `/gammes/petrichor` | GammesHub → Onglet Pétrichor |
| `/gammes/volcanique` | GammesHub → Onglet Volcanique |
| `/gammes/glaciaire` | GammesHub → Onglet Glaciaire |
| `/gammes/bio-lab` | GammesHub → Onglet Bio-Lab |
| `/gammes/mossi` | GammesHub → Onglet Mossi |

### Routes Outils (8 routes)

Les outils et calculateurs devraient être regroupés :

| Route Actuelle | Consolidation Proposée |
|----------------|------------------------|
| `/calculateur` | OutilsHub → Onglet Calculateur |
| `/calculateur-ifra` | OutilsHub → Onglet IFRA |
| `/editeur-formulation` | OutilsHub → Onglet Formulation |
| `/matrice-synergies` | OutilsHub → Onglet Synergies |

### Routes Sourcing (5 routes)

Les routes de sourcing géographique :

| Route Actuelle | Consolidation Proposée |
|----------------|------------------------|
| `/sourcing` | SourcingHub (page principale) |
| `/sourcing/france` | SourcingHub → Onglet France |
| `/sourcing/inde` | SourcingHub → Onglet Inde |
| `/sourcing/madagascar` | SourcingHub → Onglet Madagascar |
| `/sourcing/north-america` | SourcingHub → Onglet Amérique du Nord |

---

## Hubs Existants (Déjà Consolidés)

Le projet a déjà commencé la consolidation avec les hubs suivants :

| Hub | Description | Routes Consolidées |
|-----|-------------|-------------------|
| **MoleculesHub** | Molécules, Familles, Familles Chimiques | 3 |
| **RecettesHub** | Recettes, Accords, Formules de Référence | 3 |
| **PlantsHub** | Plantes, Variétés, Terroirs, Carte | 4 |

---

## Plan de Consolidation Recommandé

### Phase 1 : Hubs Prioritaires (Semaine 1-2)

1. **AdminHub** : Consolider les 23 routes admin en 7 onglets
2. **GammesHub** : Consolider les 8 routes gammes en 5 onglets
3. **OutilsHub** : Consolider les 8 routes outils en 5 onglets

### Phase 2 : Hubs Secondaires (Semaine 3-4)

4. **SourcingHub** : Consolider les 5 routes sourcing
5. **RechercheHub** : Consolider les routes de recherche scientifique
6. **MethodologieHub** : Consolider les routes méthodologie

### Phase 3 : Nettoyage (Semaine 5+)

7. Supprimer les routes dupliquées et legacy
8. Configurer les redirections automatiques
9. Mettre à jour la documentation

---

## Structure de Navigation Cible

```
/                           → Accueil
├── /prototypes             → Prototypes C1-C4
│   └── /prototypes/:code   → Détail prototype
├── /molecules-hub          → Hub Molécules (existant)
├── /recettes-hub           → Hub Recettes (existant)
├── /plants-hub             → Hub Plantes (existant)
├── /gammes-hub             → Hub Gammes (à créer)
├── /outils-hub             → Hub Outils (à créer)
├── /sourcing-hub           → Hub Sourcing (à créer)
├── /recherche-hub          → Hub Recherche (à créer)
├── /bibliographie-hub      → Hub Bibliographie (existant)
├── /admin                  → Hub Admin (à consolider)
└── /contributor            → Interface Contributeur
```

---

## Métriques Cibles

| Métrique | Actuel | Cible | Réduction |
|----------|--------|-------|-----------|
| Routes totales | 291 | ~80 | -72% |
| Pages | 270 | ~100 | -63% |
| Temps de navigation moyen | Non mesuré | -50% | - |

---

## Prochaines Étapes

1. [ ] Créer GammesHub avec onglets
2. [ ] Créer OutilsHub avec onglets
3. [ ] Consolider AdminHub
4. [ ] Créer SourcingHub
5. [ ] Configurer les redirections legacy
6. [ ] Mettre à jour le MegaMenu
7. [ ] Tester la navigation mobile
8. [ ] Documenter les nouvelles routes

---

## Notes Techniques

- Utiliser le pattern existant des hubs (MoleculesHub, RecettesHub, PlantsHub)
- Chaque hub utilise des onglets shadcn/ui pour la navigation interne
- Les URLs legacy doivent rediriger vers les nouveaux hubs
- Le MegaMenu doit être mis à jour pour refléter la nouvelle structure
