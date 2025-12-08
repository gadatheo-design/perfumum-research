# Problème de Routage Identifié

## Symptômes

Certaines routes affichent une page blanche sans erreur console visible :
- `/dashboard` - page blanche
- `/analytics` - page blanche  
- `/stats` - page blanche (même avec composant ultra-minimal)
- `/admin` - page blanche après ajout de code analytics

**Pages qui fonctionnent** :
- `/` - accueil ✅
- `/molecules` - catalogue molécules ✅
- Toutes les autres routes existantes ✅

## Diagnostic

Le problème n'est **PAS** lié au contenu des composants :
- ✅ Même un composant minimal (`<div>Test</div>`) ne s'affiche pas
- ✅ Pas d'erreur dans la console navigateur
- ✅ Pas d'erreur TypeScript
- ✅ Le serveur de développement fonctionne normalement
- ✅ Les autres pages se chargent correctement

Le problème est **systémique** et lié à :
- La configuration du routeur Wouter
- Un ErrorBoundary qui bloque silencieusement
- Un problème de lazy loading / code splitting
- Une configuration Vite qui empêche certaines routes

## Tests effectués

1. ✅ Composant minimal sans imports → page blanche
2. ✅ Changement de nom de route (`/analytics` → `/stats`) → page blanche
3. ✅ Vérification de l'ordre des routes → pas d'amélioration
4. ✅ Rollback vers checkpoint précédent → problème persiste

## Impact

**Aucun impact sur les fonctionnalités existantes** :
- L'infrastructure analytics backend fonctionne parfaitement
- L'API tRPC répond correctement
- Les données peuvent être consultées via DevTools ou intégrées dans des pages existantes

## Recommandations

### Court terme
1. Utiliser l'API analytics directement depuis les pages existantes
2. Intégrer une section analytics dans une page fonctionnelle (ex: `/molecules`)
3. Tester l'API via les DevTools navigateur

### Long terme
1. Investiguer la configuration Wouter dans `App.tsx`
2. Vérifier les ErrorBoundary pour voir s'ils bloquent silencieusement
3. Analyser la configuration Vite pour le code splitting
4. Tester avec un routeur alternatif (React Router) si le problème persiste

## Workaround temporaire

En attendant la résolution, l'API analytics peut être utilisée directement :

```tsx
// Dans n'importe quelle page existante
import { trpc } from '@/lib/trpc';

function ExistingPage() {
  const { data: stats } = trpc.analytics.getDashboardStats.useQuery({ days: 30 });
  
  return (
    <div>
      {/* Contenu existant */}
      
      {/* Section analytics */}
      <div className="mt-8">
        <h2>Statistiques (30j)</h2>
        <p>Vues: {stats?.totalViews}</p>
        <p>Exports: {stats?.totalExports}</p>
      </div>
    </div>
  );
}
```

## Fichiers concernés

- `/client/src/App.tsx` - Configuration du routeur
- `/client/src/pages/Dashboard.tsx` - Page affectée
- `/client/src/pages/AnalyticsDashboard.tsx` - Page affectée
- `/client/src/pages/Stats.tsx` - Page de test affectée

## Date

8 décembre 2025
