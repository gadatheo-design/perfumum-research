# Implémentation Prioritaire — PERFUMUM

## Vue d'ensemble

Ce document détaille les trois tâches prioritaires pour finaliser le système de gestion des données PERFUMUM. Ces tâches peuvent être implémentées progressivement par l'équipe.

---

## 1. FINALISER ADMINDATAAUDIT

### Objectif
Créer un dashboard complet d'audit des données pour identifier les lacunes, doublons, et anomalies.

### Procédures tRPC à implémenter

```typescript
// server/routers/audit.ts

export const auditRouter = router({
  // ✅ Déjà implémentée
  getDataStats: publicProcedure.query(async () => {
    // Retourne : molecules, plants, plantMoleculeLinks
  }),

  // ✅ Déjà implémentée
  getMoleculesWithoutFormula: publicProcedure.query(async () => {
    // Retourne : molécules sans formule chimique
  }),

  // ✅ Déjà implémentée
  getOrphanPlants: publicProcedure.query(async () => {
    // Retourne : plantes sans liaisons molécule
  }),

  // ✅ Déjà implémentée
  getOrphanMolecules: publicProcedure.query(async () => {
    // Retourne : molécules sans liaisons plante
  }),

  // ✅ Déjà implémentée
  getCoverageStats: publicProcedure.query(async () => {
    // Retourne : statistiques de couverture (%)
  }),

  // 🔧 À implémenter : Doublons de formules chimiques
  getDuplicateFormulas: publicProcedure.query(async () => {
    const db = await getDb();
    const duplicates = await db
      .select({
        formula: molecules.chemicalFormula,
        count: count(),
        molecules: sql`GROUP_CONCAT(name)`,
      })
      .from(molecules)
      .where(isNotNull(molecules.chemicalFormula))
      .groupBy(molecules.chemicalFormula)
      .having(sql`COUNT(*) > 1`);
    
    return { duplicates, success: true };
  }),

  // 🔧 À implémenter : Doublons de noms
  getDuplicateNames: publicProcedure.query(async () => {
    const db = await getDb();
    const duplicates = await db
      .select({
        name: molecules.name,
        count: count(),
        ids: sql`GROUP_CONCAT(id)`,
      })
      .from(molecules)
      .groupBy(molecules.name)
      .having(sql`COUNT(*) > 1`);
    
    return { duplicates, success: true };
  }),

  // 🔧 À implémenter : Anomalies de poids moléculaire
  getWeightAnomalies: publicProcedure.query(async () => {
    const db = await getDb();
    const anomalies = await db
      .select({
        id: molecules.id,
        name: molecules.name,
        chemicalFormula: molecules.chemicalFormula,
        molecularWeight: molecules.molecularWeight,
      })
      .from(molecules)
      .where(
        sql`${molecules.molecularWeight} < 0 OR ${molecules.molecularWeight} > 1000`
      );
    
    return { anomalies, success: true };
  }),

  // 🔧 À implémenter : Export audit complet
  exportAuditReport: publicProcedure.query(async () => {
    const db = await getDb();
    
    const stats = await db.query.getDataStats();
    const orphanPlants = await db.query.getOrphanPlants();
    const orphanMolecules = await db.query.getOrphanMolecules();
    const duplicates = await db.query.getDuplicateFormulas();
    const coverage = await db.query.getCoverageStats();
    
    return {
      timestamp: new Date().toISOString(),
      stats,
      orphanPlants,
      orphanMolecules,
      duplicates,
      coverage,
      success: true,
    };
  }),
});
```

### Intégration dans AdminDataAudit.tsx

```typescript
// client/src/pages/admin/AdminDataAudit.tsx

export function AdminDataAudit() {
  const { data: stats } = trpc.audit.getDataStats.useQuery();
  const { data: orphanPlants } = trpc.audit.getOrphanPlants.useQuery();
  const { data: orphanMolecules } = trpc.audit.getOrphanMolecules.useQuery();
  const { data: coverage } = trpc.audit.getCoverageStats.useQuery();
  const { data: duplicates } = trpc.audit.getDuplicateFormulas.useQuery();

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques Générales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Molécules</p>
              <p className="text-2xl font-bold">{stats?.molecules || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Plantes</p>
              <p className="text-2xl font-bold">{stats?.plants || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Liaisons</p>
              <p className="text-2xl font-bold">{stats?.plantMoleculeLinks || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Couverture des données */}
      <Card>
        <CardHeader>
          <CardTitle>Couverture des Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Molécules avec formule</p>
              <div className="mt-2 h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{
                    width: `${coverage?.molecules?.coverage || 0}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {coverage?.molecules?.withFormula} / {coverage?.molecules?.total}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Plantes avec liaisons</p>
              <div className="mt-2 h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{
                    width: `${coverage?.plants?.coverage || 0}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {coverage?.plants?.withLinks} / {coverage?.plants?.total}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Anomalies Détectées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            🌿 <strong>{orphanPlants?.count || 0} plantes orphelines</strong>
            (sans liaisons molécule)
          </p>
          <p className="text-sm">
            🧪 <strong>{orphanMolecules?.count || 0} molécules orphelines</strong>
            (sans liaisons plante)
          </p>
          <p className="text-sm">
            🔄 <strong>{duplicates?.count || 0} doublons de formules</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Étapes d'implémentation

1. **Ajouter les procédures manquantes** dans `server/routers/audit.ts`
2. **Tester chaque procédure** avec des données réelles
3. **Mettre à jour AdminDataAudit.tsx** pour afficher les résultats
4. **Ajouter des boutons d'action** (export CSV, suppression de doublons, etc.)

---

## 2. IMPLÉMENTER LE SOFT DELETE

### Objectif
Ajouter une colonne `deletedAt` pour la suppression logique (soft delete) plutôt que la suppression physique.

### Modifications du schéma

```typescript
// drizzle/schema.ts

export const molecules = mysqlTable("molecules", {
  // ... colonnes existantes
  deletedAt: timestamp("deleted_at").defaultValue(null),
});

export const plants = mysqlTable("plants", {
  // ... colonnes existantes
  deletedAt: timestamp("deleted_at").defaultValue(null),
});

export const plantMolecules = mysqlTable("plant_molecules", {
  // ... colonnes existantes
  deletedAt: timestamp("deleted_at").defaultValue(null),
});
```

### Migration Drizzle

```bash
# Générer la migration
pnpm db:generate

# Appliquer la migration
pnpm db:push
```

### Procédures tRPC pour soft delete

```typescript
// server/db/molecules.ts

export async function softDeleteMolecule(id: number) {
  const db = await getDb();
  return db
    .update(molecules)
    .set({ deletedAt: new Date() })
    .where(eq(molecules.id, id));
}

export async function restoreMolecule(id: number) {
  const db = await getDb();
  return db
    .update(molecules)
    .set({ deletedAt: null })
    .where(eq(molecules.id, id));
}

export async function getMoleculesIncludingDeleted() {
  const db = await getDb();
  return db.select().from(molecules);
}

export async function getMoleculesExcludingDeleted() {
  const db = await getDb();
  return db
    .select()
    .from(molecules)
    .where(isNull(molecules.deletedAt));
}
```

### Mise à jour des requêtes existantes

```typescript
// Ajouter WHERE clause à toutes les requêtes SELECT
// AVANT : SELECT * FROM molecules
// APRÈS : SELECT * FROM molecules WHERE deleted_at IS NULL

// Exemple : getAllMolecules
export async function getAllMolecules() {
  const db = await getDb();
  return db
    .select()
    .from(molecules)
    .where(isNull(molecules.deletedAt)); // ← Ajouter cette ligne
}
```

### Avantages du soft delete

✅ **Récupération** : Restaurer les données supprimées accidentellement  
✅ **Audit** : Tracer quand et quoi a été supprimé  
✅ **Intégrité référentielle** : Garder les liaisons historiques  
✅ **Conformité** : Respecter les exigences de rétention de données  

### Étapes d'implémentation

1. **Ajouter la colonne `deletedAt`** au schéma
2. **Générer et appliquer la migration** (`pnpm db:push`)
3. **Créer les fonctions soft delete/restore** dans `server/db/`
4. **Mettre à jour toutes les requêtes SELECT** pour exclure les enregistrements supprimés
5. **Tester les opérations CRUD** avec soft delete
6. **Ajouter une page admin** pour gérer les éléments supprimés

---

## 3. RAPPORT DÉTAILLÉ SUR LES 11 OUTILS D'ENRICHISSEMENT API

### 11 Outils d'enrichissement API

| # | Outil | Source | Fonction | Statut |
|---|-------|--------|----------|--------|
| 1 | **KNApSAcK Batch** | KNApSAcK | Liaisons plante-molécule | ✅ Corrigé |
| 2 | **PubChem Batch** | PubChem | Molécules par CAS, IUPAC | ✅ Fonctionnel |
| 3 | **PubChem IUPAC Batch** | PubChem | Molécules par noms IUPAC | ✅ Fonctionnel |
| 4 | **SMILES Batch** | Chimie | Molécules par SMILES | ✅ Fonctionnel |
| 5 | **ChEBI Batch** | ChEBI | Molécules biologiques | ✅ Fonctionnel |
| 6 | **COCONUT Batch** | COCONUT | Molécules naturelles | ✅ Fonctionnel |
| 7 | **LOTUS Batch** | LOTUS | Liaisons plante-molécule | ✅ Fonctionnel |
| 8 | **GBIF Batch** | GBIF | Géolocalisation plantes | ✅ Fonctionnel |
| 9 | **Wikidata Batch** | Wikidata | Enrichissement QID | ✅ Fonctionnel |
| 10 | **Wikimedia Batch** | Wikimedia | Images plantes/molécules | ✅ Fonctionnel |
| 11 | **Europeana QID Batch** | Europeana | Données culturelles | ✅ Fonctionnel |

### Détails de chaque outil

#### 1. KNApSAcK Batch
- **Source** : KNApSAcK (Base de données des métabolites secondaires des plantes)
- **Fonction** : Importer les liaisons plante-molécule
- **Matching** : Formule chimique + poids moléculaire (tolérance 0.01)
- **Statut** : ✅ Corrigé (erreur SQL résolue)
- **Accès** : `/admin/knapsack-batch`

#### 2. PubChem Batch
- **Source** : PubChem (Base de données chimique du NCBI)
- **Fonction** : Importer les molécules par CAS number
- **Matching** : CAS number exact
- **Statut** : ✅ Fonctionnel
- **Accès** : `/admin/pubchem-batch`

#### 3. PubChem IUPAC Batch
- **Source** : PubChem
- **Fonction** : Importer les molécules par noms IUPAC
- **Matching** : Normalisation des noms IUPAC
- **Statut** : ✅ Fonctionnel
- **Accès** : `/admin/pubchem-iupac-batch`

#### 4. SMILES Batch
- **Source** : Notation SMILES (Simplified Molecular Input Line Entry System)
- **Fonction** : Importer les molécules par SMILES
- **Matching** : Validation SMILES + matching chimique
- **Statut** : ✅ Fonctionnel
- **Accès** : `/admin/smiles-batch`

#### 5. ChEBI Batch
- **Source** : ChEBI (Chemical Entities of Biological Interest)
- **Fonction** : Importer les molécules biologiques
- **Matching** : ChEBI ID + InChI
- **Statut** : ✅ Fonctionnel
- **Accès** : `/admin/chebi-batch`

#### 6. COCONUT Batch
- **Source** : COCONUT (COllection of Open Natural prodUcTs)
- **Fonction** : Importer les molécules naturelles
- **Matching** : COCONUT ID + structure chimique
- **Statut** : ✅ Fonctionnel
- **Accès** : `/admin/coconut-batch`

#### 7. LOTUS Batch
- **Source** : LOTUS (Natural Products Occurrence Database)
- **Fonction** : Importer les liaisons plante-molécule
- **Matching** : LOTUS ID + formule chimique
- **Statut** : ✅ Fonctionnel
- **Accès** : `/admin/lotus-batch`

#### 8. GBIF Batch
- **Source** : GBIF (Global Biodiversity Information Facility)
- **Fonction** : Importer les données géographiques des plantes
- **Matching** : Nom scientifique + GBIF ID
- **Statut** : ✅ Fonctionnel
- **Accès** : `/admin/gbif-batch`

#### 9. Wikidata Batch
- **Source** : Wikidata (Base de connaissances collaborative)
- **Fonction** : Enrichir les données avec QIDs Wikidata
- **Matching** : Nom + propriétés Wikidata
- **Statut** : ✅ Fonctionnel
- **Accès** : `/admin/wikidata-batch`

#### 10. Wikimedia Batch
- **Source** : Wikimedia Commons (Bibliothèque d'images libre)
- **Fonction** : Importer les images de plantes et molécules
- **Matching** : Nom scientifique + titre image
- **Statut** : ✅ Fonctionnel
- **Accès** : `/admin/wikimedia-batch`

#### 11. Europeana QID Batch
- **Source** : Europeana (Agrégateur de patrimoine culturel européen)
- **Fonction** : Importer les données culturelles et historiques
- **Matching** : QID Wikidata + métadonnées Europeana
- **Statut** : ✅ Fonctionnel
- **Accès** : `/admin/europeana-qid-batch`

### Workflow d'enrichissement recommandé

```
1. EXPLORATION
   └─ EuropeanaExplorer → Identifier les ressources pertinentes
   └─ SparqlExplorer → Requêtes personnalisées Wikidata

2. IMPORT
   └─ KNApSAcK Batch → Liaisons plante-molécule
   └─ PubChem Batch → Molécules par CAS
   └─ LOTUS Batch → Liaisons alternatives
   └─ GBIF Batch → Géolocalisation

3. ENRICHISSEMENT
   └─ ChEBI Batch → Données biologiques
   └─ COCONUT Batch → Molécules naturelles
   └─ Wikidata Batch → QIDs et propriétés
   └─ Wikimedia Batch → Images

4. VALIDATION
   └─ DataQuality → Détection d'anomalies
   └─ AdminDataAudit → Audit complet

5. CORRECTION
   └─ MoleculeManager → Édition manuelle
   └─ AdminMatieres → Gestion des plantes
   └─ AdminPlantMolecules → Liaisons

6. EXPORT
   └─ Export CSV/JSON → Sauvegarde
```

### Métriques de succès

- **Couverture** : % de molécules avec formule chimique
- **Liaisons** : % de plantes avec au moins une molécule
- **Doublons** : Nombre de doublons identifiés et supprimés
- **Orphelines** : Nombre d'entités sans liaisons
- **Qualité** : % de données validées

### Points d'amélioration

1. **Automatisation** : Créer des jobs programmés pour les imports réguliers
2. **Validation** : Ajouter des validations côté serveur pour chaque import
3. **Logging** : Implémenter des logs détaillés pour chaque étape
4. **Rollback** : Ajouter la possibilité d'annuler les imports échoués
5. **Notifications** : Alerter l'admin quand un import est terminé

---

## RÉSUMÉ DES TÂCHES

| Tâche | Priorité | Effort | Impact | Statut |
|-------|----------|--------|--------|--------|
| AdminDataAudit | 🔴 Haute | 4h | Audit complet | 🔧 En cours |
| Soft Delete | 🟡 Moyenne | 3h | Sécurité données | ⏳ À faire |
| Rapport API | 🟢 Basse | 2h | Documentation | ✅ Complété |

---

## PROCHAINES ÉTAPES

1. **Finaliser AdminDataAudit** : Implémenter les procédures tRPC manquantes
2. **Tester soft delete** : Créer la migration et tester CRUD
3. **Documenter le workflow** : Créer un guide pour l'équipe
4. **Planifier l'enrichissement** : Définir les priorités par source API
5. **Mesurer la progression** : Suivre les métriques de couverture

---

**Dernière mise à jour** : 2026-04-07  
**Version** : 1.0  
**Auteur** : Manus Agent  
**Statut** : Prêt pour implémentation collaborative
