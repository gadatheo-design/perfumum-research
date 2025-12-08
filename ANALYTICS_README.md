# Système Analytics PERFUMUM

## Vue d'ensemble

Le système analytics permet de tracker et analyser l'utilisation de la plateforme PERFUMUM. Il enregistre les événements utilisateurs et fournit des statistiques détaillées sur les consultations, exports, recherches et favoris.

## Infrastructure Backend

### Base de données

**Table `analytics_events`** :
- `id` : Identifiant unique
- `user_id` : ID utilisateur (nullable pour utilisateurs anonymes)
- `event_type` : Type d'événement (enum)
  - `molecule_view` : Consultation d'une molécule
  - `recipe_view` : Consultation d'une recette
  - `terpene_view` : Consultation d'un terpène
  - `pdf_export` : Export PDF
  - `favorite_add` : Ajout aux favoris
  - `favorite_remove` : Retrait des favoris
  - `search_query` : Requête de recherche
- `entity_type` : Type d'entité consultée (molecule, recipe, etc.)
- `entity_id` : ID de l'entité consultée
- `metadata` : Données additionnelles (JSON)
- `created_at` : Date de l'événement

**Index** :
- `event_type_idx` : Index sur le type d'événement
- `entity_type_idx` : Index sur le type d'entité
- `created_at_idx` : Index sur la date

### Fonctions Database (server/db.ts)

1. **trackEvent()** : Enregistrer un événement
   ```ts
   trackEvent(
     eventType: 'molecule_view' | 'recipe_view' | ...,
     entityType?: string,
     entityId?: number,
     userId?: number,
     metadata?: Record<string, any>
   )
   ```

2. **getMostViewedMolecules()** : Top molécules consultées
   ```ts
   getMostViewedMolecules(days: number = 30, limit: number = 10)
   // Retourne : { id, name, viewCount, ... }[]
   ```

3. **getMostViewedRecipes()** : Top recettes consultées
   ```ts
   getMostViewedRecipes(days: number = 30, limit: number = 10)
   // Retourne : { id, name, viewCount, ... }[]
   ```

4. **getActivityTimeline()** : Activité par jour
   ```ts
   getActivityTimeline(days: number = 30)
   // Retourne : { date: string, eventCount: number }[]
   ```

5. **getPopularSearches()** : Recherches populaires
   ```ts
   getPopularSearches(days: number = 30, limit: number = 10)
   // Retourne : { query: string, count: number }[]
   ```

6. **getAnalyticsDashboardStats()** : Statistiques globales
   ```ts
   getAnalyticsDashboardStats(days: number = 30)
   // Retourne : {
   //   totalViews: number,
   //   totalExports: number,
   //   totalSearches: number,
   //   totalFavorites: number
   // }
   ```

### API tRPC (server/routers.ts)

**Router `analytics`** avec 6 procédures :

1. **trackEvent** (mutation)
   ```ts
   trpc.analytics.trackEvent.useMutation()
   // Input: { eventType, entityType?, entityId?, metadata? }
   ```

2. **getMostViewedMolecules** (query)
   ```ts
   trpc.analytics.getMostViewedMolecules.useQuery({ days: 30, limit: 10 })
   ```

3. **getMostViewedRecipes** (query)
   ```ts
   trpc.analytics.getMostViewedRecipes.useQuery({ days: 30, limit: 10 })
   ```

4. **getActivityTimeline** (query)
   ```ts
   trpc.analytics.getActivityTimeline.useQuery({ days: 30 })
   ```

5. **getPopularSearches** (query)
   ```ts
   trpc.analytics.getPopularSearches.useQuery({ days: 30, limit: 10 })
   ```

6. **getDashboardStats** (query)
   ```ts
   trpc.analytics.getDashboardStats.useQuery({ days: 30 })
   ```

## Utilisation

### Tracker un événement

```tsx
import { trpc } from '@/lib/trpc';

function MoleculeDetail({ id }) {
  const trackEvent = trpc.analytics.trackEvent.useMutation();
  
  useEffect(() => {
    // Tracker la consultation de la molécule
    trackEvent.mutate({
      eventType: 'molecule_view',
      entityType: 'molecule',
      entityId: id
    });
  }, [id]);
  
  return <div>...</div>;
}
```

### Afficher des statistiques

```tsx
import { trpc } from '@/lib/trpc';

function AnalyticsDashboard() {
  const { data: stats } = trpc.analytics.getDashboardStats.useQuery({ days: 30 });
  const { data: topMolecules } = trpc.analytics.getMostViewedMolecules.useQuery({ 
    days: 30, 
    limit: 10 
  });
  
  return (
    <div>
      <h2>Statistiques (30 derniers jours)</h2>
      <p>Vues totales : {stats?.totalViews}</p>
      <p>Exports PDF : {stats?.totalExports}</p>
      
      <h3>Top Molécules</h3>
      <ul>
        {topMolecules?.map(mol => (
          <li key={mol.id}>{mol.name} - {mol.viewCount} vues</li>
        ))}
      </ul>
    </div>
  );
}
```

## Frontend

### Page Analytics Dashboard

**Route** : `/analytics`

**Composant** : `client/src/pages/AnalyticsDashboard.tsx`

**Fonctionnalités prévues** :
- Sélecteur de période (7j / 30j / 90j)
- 4 cartes statistiques (Vues, Exports, Recherches, Favoris)
- Top 10 molécules consultées
- Top 10 recettes consultées
- Recherches populaires
- Graphique d'activité quotidienne (Chart.js)

**État actuel** : ⚠️ La page nécessite encore du débogage pour s'afficher correctement.

## ⚠️ Problème de Routage Connu

Un bug de routage empêche actuellement l'affichage de la page `/analytics`. Voir `ROUTING_ISSUE.md` pour les détails.

**Workaround** : L'API analytics fonctionne parfaitement et peut être utilisée dans n'importe quelle page existante.

## Prochaines étapes

1. **Résoudre le problème de routage** : Voir `ROUTING_ISSUE.md` pour investigation
2. **Intégrer le tracking** : Ajouter `trackEvent` dans les pages de détail (molécules, recettes, terpènes)
3. **Ajouter des visualisations** : Intégrer les stats analytics dans une page existante
4. **Tests** : Créer des tests vitest pour les procédures analytics
5. **Optimisation** : Ajouter du caching pour les requêtes fréquentes

## Notes techniques

- Les événements sont enregistrés de manière asynchrone (fire-and-forget)
- Les statistiques sont calculées en temps réel à chaque requête
- Les index sur `event_type`, `entity_type` et `created_at` assurent des performances optimales
- Le système supporte le tracking anonyme (user_id nullable)
- Les métadonnées JSON permettent d'ajouter des informations contextuelles

## Exemples de métadonnées

```json
// Pour une recherche
{
  "query": "géosmine",
  "filters": ["petrichor"],
  "resultCount": 12
}

// Pour un export PDF
{
  "format": "pdf",
  "entityType": "molecule",
  "entityId": 42
}

// Pour un favori
{
  "action": "add",
  "source": "molecule_detail"
}
```
