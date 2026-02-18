# Plan de Lazy-Loading - PERFUMUM

## 🎯 Objectif

Réduire le bundle initial de **1.8 MB** à **~800 KB** en lazy-loadant les pages lourdes.

---

## ✅ Pages Déjà Lazy-Loaded

1. ✅ `MoleculeDetail` (ligne 132) - 202 kB
2. ✅ `RecetteDetail` (ligne 142) - 131 kB
3. ✅ `RechercheAvancee` (ligne 177) - 87 kB
4. ✅ `BibliographieGlobale` (ligne 244) - 193 kB
5. ✅ `AxeRechercheDetail` (ligne 258) - 87 kB
6. ✅ `GhostVarietyDetail` (ligne 271) - 108 kB
7. ✅ `PlantDetail` (ligne 289) - 134 kB

**Total déjà optimisé** : ~942 kB

---

## 🚀 Pages à Lazy-Loader (Priorité Haute)

### Top 10 des Pages Lourdes à Optimiser

D'après l'analyse du build, voici les pages qui devraient être lazy-loaded :

#### 1. Pages de Graphes et Visualisations (Utilisant ReactFlow/D3)

```typescript
// Ligne ~167-181 - Graphes et visualisations
const GrapheMoleculesRecettes = lazy(() => import("./pages/GrapheMoleculesRecettes"));
const GraphePlanteMolecule = lazy(() => import("./pages/GraphePlanteMolecule"));
const SynergiesGraphVisualization = lazy(() => import("./pages/SynergiesGraphVisualization"));
const GenealogyGraph = lazy(() => import("./pages/GenealogyGraph"));
const RelationsGraph = lazy(() => import("./pages/RelationsGraph"));
const ReferenceLinkNetwork = lazy(() => import("./pages/ReferenceLinkNetwork"));
const ReseauAxes = lazy(() => import("./pages/ReseauAxes"));
const ChemicalFamilyGraph = lazy(() => import("./pages/ChemicalFamilyGraph"));
const RecipeNetworkPage = lazy(() => import("./pages/RecipeNetworkPage"));
const SankeyFlow = lazy(() => import("./pages/SankeyFlow"));
```

**Gain estimé** : -400 kB (ReactFlow est lourd)

#### 2. Pages avec Charts (Utilisant Recharts/Chart.js)

```typescript
// Ligne ~174-181 - Pages avec graphiques
const EnhancedRadarDemo = lazy(() => import("./pages/EnhancedRadarDemo"));
const RadarCorrelationHeatmap = lazy(() => import("./pages/RadarCorrelationHeatmap"));
const SynergiesHeatmap = lazy(() => import("./pages/SynergiesHeatmap"));
const CorrelationAnalysis = lazy(() => import("./pages/CorrelationAnalysis"));
const VisualisationsCorrelation = lazy(() => import("./pages/VisualisationsCorrelation"));
const OlfactiveStats = lazy(() => import("./pages/OlfactiveStats"));
const Statistiques = lazy(() => import("./pages/Statistiques"));
```

**Gain estimé** : -300 kB (Recharts est lourd)

#### 3. Pages de Comparaison Avancée

```typescript
// Ligne ~158-166 - Comparaisons
const CompareMoleculesAdvanced = lazy(() => import("./pages/CompareMoleculesAdvanced"));
const ComparateurAvance = lazy(() => import("./pages/ComparateurAvance"));
const ComparaisonMolecules = lazy(() => import("./pages/ComparaisonMolecules"));
const CompareRecettes = lazy(() => import("./pages/CompareRecettes"));
const ComparePlants = lazy(() => import("./pages/ComparePlants"));
const CompareTerpenes = lazy(() => import("./pages/CompareTerpenes"));
const CompareRadar = lazy(() => import("./pages/CompareRadar"));
const ComparaisonTerpenes = lazy(() => import("./pages/ComparaisonTerpenes"));
```

**Gain estimé** : -200 kB

#### 4. Pages Admin Lourdes

```typescript
// Ligne ~53-92 - Administration
const AdminImportExport = lazy(() => import("./pages/AdminImportExport"));
const ImportExportPlants = lazy(() => import("./pages/ImportExportPlants"));
const ImportCSV = lazy(() => import("./pages/ImportCSV"));
const ImportCSVPreview = lazy(() => import("./pages/ImportCSVPreview"));
const AdminAIClassification = lazy(() => import("./pages/AdminAIClassification"));
const AIClassificationBatch = lazy(() => import("./pages/AIClassificationBatch"));
const ClassificationReviewQueue = lazy(() => import("./pages/ClassificationReviewQueue"));
```

**Gain estimé** : -150 kB

#### 5. Pages de Recherche Scientifique

```typescript
// Ligne ~196-210 - Recherche scientifique
const RechercheScientifique = lazy(() => import("./pages/RechercheScientifique"));
const SynergiesMoleculaires = lazy(() => import("./pages/SynergiesMoleculaires"));
const PyrolyseCombustion = lazy(() => import("./pages/PyrolyseCombustion"));
const CourbesVolatilite = lazy(() => import("./pages/CourbesVolatilite"));
const DegradationTerpenes = lazy(() => import("./pages/DegradationTerpenes"));
const ModelesAnalytiquesGCMS = lazy(() => import("./pages/ModelesAnalytiquesGCMS"));
const SynergiesTerpenesNiches = lazy(() => import("./pages/SynergiesTerpenesNiches"));
```

**Gain estimé** : -150 kB

#### 6. Pages AbsorbeX (Recherche Avancée)

```typescript
// Ligne ~29-42 - AbsorbeX
const AbsorbeXDashboard = lazy(() => import("./pages/AbsorbeXDashboard"));
const AbsorbeXManifeste = lazy(() => import("./pages/AbsorbeXManifeste"));
const AbsorbeXNotesRecherche = lazy(() => import("./pages/AbsorbeXNotesRecherche"));
const AbsorbeXQuantique = lazy(() => import("./pages/AbsorbeXQuantique"));
const AbsorbeXPatrimoine = lazy(() => import("./pages/AbsorbeXPatrimoine"));
const AbsorbeXNeuroOlfaction = lazy(() => import("./pages/AbsorbeXNeuroOlfaction"));
const AbsorbeXOdeursPerdues = lazy(() => import("./pages/AbsorbeXOdeursPerdues"));
const AbsorbeXGuideLaboratoire = lazy(() => import("./pages/AbsorbeXGuideLaboratoire"));
```

**Gain estimé** : -100 kB

---

## 📊 Gain Total Estimé

| Catégorie | Pages | Gain Estimé |
|-----------|-------|-------------|
| Graphes (ReactFlow) | 10 | -400 kB |
| Charts (Recharts) | 7 | -300 kB |
| Comparaisons | 8 | -200 kB |
| Admin | 7 | -150 kB |
| Recherche | 7 | -150 kB |
| AbsorbeX | 8 | -100 kB |
| **TOTAL** | **47** | **-1.3 MB** |

**Bundle initial actuel** : 1.8 MB gzip  
**Bundle initial après lazy-loading** : **~500-800 KB gzip** 🎉

---

## 🔧 Implémentation

### Étape 1 : Modifier App.tsx

Remplacer les imports statiques par des imports dynamiques :

```typescript
// ❌ AVANT (import statique)
import GrapheMoleculesRecettes from "./pages/GrapheMoleculesRecettes";

// ✅ APRÈS (import dynamique)
const GrapheMoleculesRecettes = lazy(() => import("./pages/GrapheMoleculesRecettes"));
```

### Étape 2 : Vérifier le Suspense Wrapper

Le fichier App.tsx a déjà un `PageLoader` (ligne 6-10) :

```typescript
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);
```

Il faut s'assurer que toutes les routes sont wrappées dans un `<Suspense>` :

```typescript
<Suspense fallback={<PageLoader />}>
  <Switch>
    <Route path="/graphe-molecules-recettes" component={GrapheMoleculesRecettes} />
    {/* ... autres routes ... */}
  </Switch>
</Suspense>
```

### Étape 3 : Tester Localement

```bash
cd /home/ubuntu/perfumum-research
pnpm build
pnpm preview
```

Vérifier dans DevTools → Network :
- Les pages lazy-loaded ne sont PAS dans le bundle initial
- Elles se chargent uniquement quand on navigue vers elles

---

## ⚠️ Considérations Importantes

### 1. UX - Temps de Chargement

**Trade-off** :
- ✅ Bundle initial beaucoup plus léger (-60%)
- ⚠️ Légère latence lors de la première navigation vers une page lazy-loaded

**Solution** : Précharger les pages importantes avec `<link rel="prefetch">` :

```typescript
// Précharger les pages fréquemment visitées
useEffect(() => {
  if (isHomePage) {
    // Précharger Molecules et Recettes
    import("./pages/Molecules");
    import("./pages/Recettes");
  }
}, [isHomePage]);
```

### 2. SEO - Référencement

**Impact** : Aucun si le site est déjà client-side rendered (CSR)

**Si SSR/SSG nécessaire** :
- Les pages lazy-loaded ne seront pas pré-rendues
- Solution : Utiliser Vite SSR ou Next.js

### 3. Erreurs de Chargement

**Gestion des erreurs** :

```typescript
const PageLoader = () => (
  <ErrorBoundary fallback={<div>Erreur de chargement</div>}>
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  </ErrorBoundary>
);
```

---

## 📝 Checklist d'Implémentation

### Phase 1 : Graphes et Visualisations (Priorité 1)
- [ ] Lazy-loader les 10 pages de graphes
- [ ] Tester la navigation vers chaque page
- [ ] Vérifier que ReactFlow se charge correctement
- [ ] Mesurer le gain de bundle (-400 kB)

### Phase 2 : Charts et Statistiques (Priorité 2)
- [ ] Lazy-loader les 7 pages avec charts
- [ ] Tester les graphiques Recharts
- [ ] Vérifier les animations
- [ ] Mesurer le gain de bundle (-300 kB)

### Phase 3 : Comparaisons (Priorité 3)
- [ ] Lazy-loader les 8 pages de comparaison
- [ ] Tester les fonctionnalités de comparaison
- [ ] Vérifier les performances
- [ ] Mesurer le gain de bundle (-200 kB)

### Phase 4 : Admin et Recherche (Priorité 4)
- [ ] Lazy-loader les pages admin
- [ ] Lazy-loader les pages de recherche scientifique
- [ ] Lazy-loader les pages AbsorbeX
- [ ] Mesurer le gain total (-400 kB)

### Phase 5 : Validation Finale
- [ ] Build de production complet
- [ ] Analyser avec bundle visualizer
- [ ] Tester toutes les pages lazy-loaded
- [ ] Mesurer les Core Web Vitals
- [ ] Déployer sur Vercel

---

## 🎯 Résultat Attendu

### Avant Lazy-Loading

```
Bundle initial: 13.5 MB (1.8 MB gzip)
Temps de chargement (3G): ~15-20s
FCP: ~3-4s
LCP: ~5-6s
```

### Après Lazy-Loading

```
Bundle initial: 3-4 MB (500-800 KB gzip)
Temps de chargement (3G): ~5-8s
FCP: ~1-1.5s
LCP: ~2-2.5s
```

**Amélioration** : **-60-70% temps de chargement initial** 🚀

---

**Date** : 18 février 2026  
**Version** : 1.0
