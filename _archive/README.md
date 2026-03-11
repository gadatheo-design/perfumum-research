# Archive PERFUMUM

Ce dossier contient des fichiers archivés lors de la session de stabilisation du **11 mars 2026**.
Ces fichiers ne sont **pas supprimés** mais mis en quarantaine — ils peuvent être restaurés si nécessaire.

## Contenu

### `drizzle/`

| Fichier | Raison de l'archivage |
|---|---|
| `0000_chubby_rumiko_fujikawa.sql` | Migration SQL en double — non référencée dans `drizzle/meta/_journal.json` |
| `0000_last_nemesis.sql` | Migration SQL en double — non référencée dans `drizzle/meta/_journal.json` |
| `add-geographic-zones.sql` | Migration manuelle hors journal Drizzle — déjà appliquée en DB |
| `schema-tobacco-cannabis.ts` | Schéma Drizzle supplémentaire non importé dans `drizzle/schema.ts` |
| `schema_modification_history.ts` | Schéma Drizzle supplémentaire non importé dans `drizzle/schema.ts` |

### `server/`

| Fichier | Raison de l'archivage |
|---|---|
| `data-import.ts` | Router tRPC non connecté à `server/routers.ts` |
| `genealogy-procedure.ts` | Procédure tRPC non connectée à `server/routers.ts` |
| `import-data.ts` | Script d'import de données non utilisé |
| `db.ts.split-backup` | Sauvegarde de `server/db.ts` avant le découpage en modules thématiques |

## Restauration

Pour restaurer un fichier :
```bash
# Exemple : restaurer data-import.ts
cp _archive/server/data-import.ts server/routers/data-import.ts
```

## Note sur db.ts.split-backup

Si le découpage de `server/db.ts` en modules thématiques (`server/db/`) cause des problèmes,
restaurer avec :
```bash
cp _archive/server/db.ts.split-backup server/db.ts
rm -rf server/db/
```
