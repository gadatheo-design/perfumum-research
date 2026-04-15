# Guide de Maintenance PERFUMUM

Procédures de maintenance, troubleshooting et bonnes pratiques pour assurer la stabilité du projet sur 10 ans.

---

## Table des Matières

1. [Workflow de Développement Sécurisé](#workflow-de-développement-sécurisé)
2. [Système de Checkpoints](#système-de-checkpoints)
3. [Problèmes Critiques Connus](#problèmes-critiques-connus)
4. [Procédures de Récupération](#procédures-de-récupération)
5. [Maintenance Base de Données](#maintenance-base-de-données)
6. [Optimisation Performances](#optimisation-performances)
7. [Sécurité](#sécurité)
8. [Monitoring](#monitoring)

---

## Workflow de Développement Sécurisé

### Règles d'Or

Le projet PERFUMUM a connu plusieurs incidents critiques de corruption du système de build Vite. Pour éviter toute perte de données et garantir la stabilité, suivre **impérativement** ce workflow :

#### 1. Checkpoint AVANT toute modification

Avant de modifier du code, **toujours** créer un checkpoint via l'interface Manus ou la commande :

```bash
# Via UI Manus : bouton "Save Checkpoint" avec message descriptif
# Le checkpoint permet un rollback instantané en cas de problème
```

**Exemple de message** : "Avant enrichissement page MoleculeDetail avec 18 nouveaux champs"

#### 2. Modifications progressives

Ne jamais modifier plusieurs fichiers simultanément. Procéder par étapes :

1. Modifier **un seul fichier**
2. Tester dans le navigateur
3. Vérifier console (0 erreurs)
4. Passer au fichier suivant

#### 3. Tests après chaque modification

Après chaque modification, **obligatoirement** :

```bash
# Vérifier que le serveur tourne sans erreur
# Ouvrir le navigateur sur la page modifiée
# Vérifier console JavaScript (F12)
# Tester la navigation
```

#### 4. Checkpoint APRÈS validation

Une fois les modifications validées et testées, créer un nouveau checkpoint :

**Exemple de message** : "Page MoleculeDetail enrichie : 18 champs ajoutés, tests OK"

### Fichiers à Risque

Certains fichiers sont **particulièrement sensibles** et peuvent déclencher une corruption du build Vite s'ils sont modifiés sans précaution :

| Fichier | Risque | Précaution |
|---------|--------|------------|
| `client/src/pages/MoleculeDetail.tsx` | 🔴 **CRITIQUE** | Checkpoint obligatoire + tests immédiats |
| `client/src/pages/RecetteDetail.tsx` | 🔴 **CRITIQUE** | Checkpoint obligatoire + tests immédiats |
| `client/src/App.tsx` | 🟠 **ÉLEVÉ** | Vérifier routes après modification |
| `drizzle/schema.ts` | 🟠 **ÉLEVÉ** | Toujours `pnpm db:push` après modification |
| `server/routers.ts` | 🟡 **MODÉRÉ** | Vérifier types TypeScript |

**Raison** : Les pages `MoleculeDetail` et `RecetteDetail` utilisent React Flow, une bibliothèque qui entre en conflit avec le Hot Module Replacement (HMR) de Vite lors de modifications concurrentes.

### Zones Sûres

Les fichiers suivants peuvent être modifiés sans risque majeur :

- Fichiers dans `client/src/components/` (composants réutilisables)
- Fichiers dans `client/src/lib/` (utilitaires)
- Fichiers dans `client/src/hooks/` (hooks custom)
- Fichiers CSS (`client/src/index.css`, `client/src/mobile-touch.css`)
- Documentation (`.md`)

---

## Système de Checkpoints

### Checkpoints Critiques

Les checkpoints suivants sont des **points de restauration sûrs** en cas de problème :

| Version | Date | Description | Statut |
|---------|------|-------------|--------|
| `3b58d71d` | 2025-01-09 08:16 | ✅ **STABLE** - Après nettoyage ultra-profond, site 100% fonctionnel | **RECOMMANDÉ** |
| `48895002` | 2025-01-09 07:43 | Backend analytics complet + Dashboard restauré | Stable |
| `f481147f` | 2025-01-09 07:30 | Infrastructure analytics (avant bug routage) | Stable |
| `08fcf641` | 2025-01-09 07:23 | Documentation bug routage | Stable |

### Créer un Checkpoint

Via l'interface Manus :

1. Cliquer sur "Save Checkpoint" dans le header
2. Entrer un message descriptif (obligatoire)
3. Attendre confirmation (5-10 secondes)

**Bonnes pratiques pour messages** :
- Décrire **ce qui a été fait** (pas ce qui va être fait)
- Mentionner les fichiers modifiés
- Indiquer si tests OK
- Exemple : "Ajout composant RadarChart + intégration dans 3 pages, tests OK"

### Rollback vers un Checkpoint

En cas de problème, rollback immédiat :

**Via UI Manus** :
1. Aller dans l'onglet "Checkpoints"
2. Sélectionner le checkpoint stable (ex: `3b58d71d`)
3. Cliquer sur "Rollback"
4. Confirmer (⚠️ perte des modifications non sauvegardées)

**Via Git** (si accès SSH) :
```bash
cd /home/ubuntu/perfumum-research
git reset --hard 3b58d71d
pnpm dev
```

---

## Problèmes Critiques Connus

### 1. Corruption Système de Build Vite

**Symptômes** :
- Pages blanches (écran blanc total)
- Routes dynamiques cassées (`/molecule/:id` affiche page blanche)
- Erreurs HMR dans console : `WebSocket connection failed`
- Erreurs TypeScript fantômes (fichiers non modifiés)

**Cause Racine** :
Conflit entre React Flow (bibliothèque de graphes) et le Hot Module Replacement (HMR) de Vite lors de modifications concurrentes de fichiers pages détail.

**Déclencheurs Connus** :
- Modification de `MoleculeDetail.tsx` ou `RecetteDetail.tsx`
- Modifications simultanées de plusieurs fichiers
- Ajout/suppression de dépendances sans redémarrage serveur
- Cache Vite fragmenté après plusieurs cycles HMR

**Solution Immédiate** :

```bash
# Étape 1 : Rollback vers checkpoint stable
# Via UI Manus : sélectionner checkpoint 3b58d71d

# Étape 2 : Nettoyage ultra-profond
cd /home/ubuntu/perfumum-research
rm -rf node_modules .vite dist .turbo .cache
pnpm store prune
pnpm install
pnpm dev
```

**Prévention** :
- ✅ Checkpoint avant toute modification de pages détail
- ✅ Tester après chaque modification
- ✅ Éviter modifications simultanées
- ✅ Redémarrer serveur après ajout dépendances

### 2. Routes Dynamiques Cassées

**Symptômes** :
- `/molecule/:id` affiche page blanche
- `/recette/:id` affiche page blanche
- Routes statiques (`/molecules`, `/dashboard`) fonctionnent ✅

**Cause** :
Cache Vite corrompu ou conflit React Flow (voir problème 1)

**Solution** :

```bash
# Option 1 : Redémarrage serveur simple
# Via UI Manus : bouton "Restart Server"

# Option 2 : Nettoyage cache Vite
rm -rf .vite
pnpm dev

# Option 3 : Rollback checkpoint (si options 1-2 échouent)
# Via UI Manus : rollback vers 3b58d71d
```

**Note Importante** : Ne **jamais** créer de nouvelles routes `/molecule/:id/full` pour contourner le problème. Cela ne résout rien et ajoute de la complexité.

### 3. Erreurs TypeScript Fantômes

**Symptômes** :
- Erreurs TypeScript sur fichiers non modifiés
- `tsc` signale 2 erreurs mais compilation fonctionne
- Erreur : "Entry point of type library 'vite/client'"

**Cause** :
Cache TypeScript Language Server désynchronisé

**Solution** :

```bash
# Redémarrer TypeScript Language Server
# Dans VSCode : Cmd+Shift+P > "TypeScript: Restart TS Server"

# Ou nettoyer cache TypeScript
rm -rf node_modules/.cache
pnpm dev
```

**Workaround** :
Ces erreurs sont **cosmétiques** et n'empêchent pas le fonctionnement du site. Elles peuvent être ignorées si le site fonctionne correctement dans le navigateur.

### 4. WebSocket HMR Déconnecté

**Symptômes** :
- Console affiche : `WebSocket connection to 'ws://...' failed`
- Hot reload ne fonctionne pas (modifications nécessitent refresh manuel)

**Cause** :
Configuration WebSocket Vite incompatible avec environnement Manus

**Solution** :

Vérifier que `vite.config.ts` contient :

```typescript
export default defineConfig({
  server: {
    hmr: {
      protocol: "wss",
      clientPort: 443,
    },
  },
});
```

Si absent, ajouter et redémarrer serveur.

---

## Procédures de Récupération

### Scénario 1 : Site Complètement Cassé

**Situation** : Toutes les pages affichent blanc, impossible de naviguer

**Procédure** :

```bash
# 1. Rollback vers checkpoint stable
# Via UI Manus : rollback 3b58d71d

# 2. Vérifier que le rollback a fonctionné
cd /home/ubuntu/perfumum-research
git log --oneline -5

# 3. Nettoyage ultra-profond
rm -rf node_modules .vite dist .turbo .cache
pnpm store prune

# 4. Réinstallation complète (71 packages)
pnpm install

# 5. Redémarrage serveur
pnpm dev

# 6. Tester dans navigateur
# Ouvrir https://3000-xxx.manusvm.computer/
# Vérifier page d'accueil + dashboard + molecules
```

**Temps estimé** : 5-10 minutes

### Scénario 2 : Routes Dynamiques Cassées Uniquement

**Situation** : `/molecules` fonctionne mais `/molecule/1` affiche blanc

**Procédure** :

```bash
# 1. Redémarrage serveur simple
# Via UI Manus : bouton "Restart Server"

# 2. Si échec, nettoyage cache Vite
rm -rf .vite
pnpm dev

# 3. Si échec, rollback checkpoint
# Via UI Manus : rollback 3b58d71d
```

**Temps estimé** : 2-5 minutes

### Scénario 3 : Perte de Données

**Situation** : Modifications non sauvegardées perdues après rollback

**Procédure** :

```bash
# 1. Vérifier historique Git
git reflog

# 2. Identifier commit avant rollback
git reflog | grep "avant rollback"

# 3. Récupérer fichiers spécifiques
git show <commit_hash>:chemin/fichier.tsx > fichier_recupere.tsx

# 4. Comparer versions
diff fichier_recupere.tsx client/src/pages/fichier.tsx

# 5. Réappliquer modifications manuellement
# (copier-coller sections pertinentes)
```

**Note** : C'est pourquoi les checkpoints fréquents sont **cruciaux**.

---

## Maintenance Base de Données

### Migrations

Après modification du schéma (`drizzle/schema.ts`), **toujours** pousser vers la base de données :

```bash
# Générer migration (optionnel, pour historique)
pnpm db:generate

# Pousser schéma vers TiDB Cloud
pnpm db:push
```

**⚠️ Attention** : `db:push` écrase le schéma distant. Pour production, utiliser `db:generate` + `db:migrate`.

### Backup Base de Données

**Méthode 1 : Export via Drizzle Studio**

```bash
# Ouvrir interface graphique
pnpm db:studio

# Naviguer vers table > Export > CSV
```

**Méthode 2 : Export SQL via TiDB Cloud**

1. Se connecter à TiDB Cloud console
2. Sélectionner cluster PERFUMUM
3. Onglet "Backup" > "Create Backup"
4. Télécharger dump SQL

**Fréquence recommandée** : Backup hebdomadaire minimum, quotidien en phase de développement actif.

### Nettoyage Données Obsolètes

```sql
-- Supprimer événements analytics > 1 an
DELETE FROM analytics_events 
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Supprimer notes utilisateur orphelines
DELETE FROM user_notes 
WHERE entity_type = 'molecule' 
AND entity_id NOT IN (SELECT id FROM molecules);

-- Vacuum (TiDB ne supporte pas VACUUM, auto-géré)
```

---

## Optimisation Performances

### Frontend

**Code Splitting** :
Les pages lourdes (Admin, Recherche Scientifique, Programmes R&D) utilisent déjà `React.lazy()` pour chargement différé.

**Images** :
- Format WebP (économie 90% vs PNG)
- Lazy loading (`loading="lazy"`)
- Dimensions optimales (1200px max)

**Exemple** :
```tsx
<img 
  src="/images/petrichor-souterrain.webp" 
  loading="lazy" 
  alt="Pétrichor Souterrain" 
/>
```

**Fonts** :
- Google Fonts avec `display=swap`
- Préchargement fonts critiques

### Backend

**Requêtes DB** :
- Index sur colonnes fréquemment filtrées (`chemicalFamily`, `category`)
- Limit 100 par défaut sur listes
- Pagination pour tables >1000 entrées

**Cache** :
- Service worker cache assets statiques (CSS, JS, images)
- LocalStorage pour favoris, historique recherche

### Monitoring Performances

```bash
# Analyser bundle size
pnpm build
pnpm vite-bundle-visualizer

# Lighthouse audit
# Ouvrir DevTools > Lighthouse > Generate Report
```

**Cibles** :
- Performance : >90
- Accessibility : >95
- Best Practices : >90
- SEO : >90

---

## Sécurité

### Authentification

L'authentification OAuth Manus est gérée automatiquement. Les tokens sont stockés dans cookies HTTP-only sécurisés.

**Vérifier session** :
```typescript
// Dans composant React
const { data: user } = trpc.auth.me.useQuery();
if (!user) {
  // Rediriger vers login
  window.location.href = getLoginUrl();
}
```

### Protection Routes Admin

Les routes `/admin/*` sont protégées par `protectedProcedure` dans tRPC :

```typescript
// server/routers.ts
adminProcedure: protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
}),
```

### Validation Données

Toutes les entrées utilisateur sont validées côté serveur via Zod :

```typescript
// Exemple
input: z.object({
  name: z.string().min(1).max(255),
  concentration: z.number().min(0).max(100),
}),
```

### Secrets

Les secrets (API keys, DATABASE_URL) sont injectés automatiquement par Manus. **Ne jamais** commiter de secrets dans Git.

**Vérifier** :
```bash
# Vérifier qu'aucun secret n'est dans le code
grep -r "DATABASE_URL" client/src/
# Résultat attendu : aucun match
```

---

## Monitoring

### Logs Serveur

```bash
# Voir logs en temps réel
# Via UI Manus : onglet "Logs"

# Ou via SSH
tail -f /home/ubuntu/perfumum-research/server.log
```

### Analytics

Le système analytics track 7 types d'événements :

| Type | Description |
|------|-------------|
| `page_view` | Vue de page |
| `molecule_view` | Consultation molécule |
| `recipe_view` | Consultation recette |
| `search` | Recherche effectuée |
| `export` | Export PDF/CSV |
| `favorite_add` | Ajout favori |
| `favorite_remove` | Retrait favori |

**Consulter stats** :
```typescript
// Via tRPC
const stats = await trpc.analytics.getDashboardStats.query();
console.log(stats.totalEvents); // Total événements
console.log(stats.mostViewedMolecules); // Top 10 molécules
```

### Erreurs Frontend

Les erreurs JavaScript sont capturées par `ErrorBoundary` :

```tsx
// client/src/components/ErrorBoundary.tsx
// Affiche message d'erreur user-friendly
// Log erreur dans console pour debugging
```

### Health Checks

```bash
# Vérifier que le serveur répond
curl https://3000-xxx.manusvm.computer/api/health

# Vérifier connexion DB
pnpm db:studio
# Si interface s'ouvre, connexion OK
```

---

## Checklist Maintenance Mensuelle

- [ ] Backup base de données (export SQL)
- [ ] Vérifier logs erreurs (onglet Logs Manus)
- [ ] Analyser stats analytics (top 10 pages, recherches)
- [ ] Tester routes critiques (`/molecules`, `/recettes`, `/dashboard`)
- [ ] Vérifier espace disque (TiDB Cloud console)
- [ ] Mettre à jour dépendances (si nécessaire, avec précaution)
- [ ] Créer checkpoint mensuel ("Checkpoint mensuel YYYY-MM")
- [ ] Tester PWA installation (iOS + Android)
- [ ] Vérifier certificat SSL (renouvellement auto Manus)
- [ ] Audit Lighthouse (cible >90 sur 4 métriques)

---

## Contact Support

En cas de problème non résolu par ce guide :

**Support Manus** : https://help.manus.im  
**Documentation Manus** : https://docs.manus.im  
**Email projet** : contact@perfumum.ch (à configurer)

---

**Version** : 1.0.0  
**Dernière mise à jour** : 9 janvier 2025  
**Auteur** : Manus AI pour PERFUMUM  
**Checkpoint stable recommandé** : `3b58d71d`
