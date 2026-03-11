# Scripts de Remédiation TypeScript — PERFUMUM

Ce dossier contient les outils de remédiation progressive de la dette technique TypeScript du projet PERFUMUM. Chaque script correspond à une vague du plan de remédiation défini dans l'audit du 11 mars 2026.

---

## Vague 1 — `wave1_remove_nocheck.py`

### Objectif

Supprimer `// @ts-nocheck` des **369 fichiers** qui n'utilisent aucun `any` explicite (ni `: any`, ni `as any`). Pour ces fichiers, la directive a été ajoutée par précaution et ne masque aucune erreur TypeScript réelle connue.

**Résultat attendu :** Réduction de ~617 à ~248 fichiers `@ts-nocheck` (60 % de réduction) sans aucune modification de logique applicative.

---

### Prérequis

- Python 3.8+
- Être à la racine du projet : `cd /home/ubuntu/perfumum-research`
- Avoir créé un checkpoint Git avant d'appliquer (recommandé)

---

### Commandes

#### 1. Analyse seule (aucune modification)

```bash
python3 scripts-remediation/wave1_remove_nocheck.py
# ou
python3 scripts-remediation/wave1_remove_nocheck.py --stats
```

Affiche le nombre de fichiers éligibles, les cas limites, et génère `wave1_report.json`.

#### 2. Application complète

```bash
python3 scripts-remediation/wave1_remove_nocheck.py --apply
```

Modifie les 369 fichiers éligibles. Chaque fichier est sauvegardé dans `.wave1-backups/` avant modification.

#### 3. Application par lots (recommandé)

```bash
# Traiter 50 fichiers à la fois, vérifier le serveur entre chaque lot
python3 scripts-remediation/wave1_remove_nocheck.py --apply --batch-size 50
```

Après chaque lot, vérifier que le serveur de développement fonctionne (`curl http://localhost:3000/`). Si tout va bien, lancer le lot suivant.

#### 4. Fichier unique

```bash
python3 scripts-remediation/wave1_remove_nocheck.py --apply --file client/src/components/Breadcrumbs.tsx
```

Utile pour tester sur un fichier spécifique avant d'appliquer en masse.

#### 5. Rollback complet

```bash
python3 scripts-remediation/wave1_remove_nocheck.py --rollback
```

Restaure **tous** les fichiers modifiés depuis les sauvegardes `.wave1-backups/` et supprime le dossier de sauvegardes. À utiliser si des erreurs inattendues apparaissent après l'application.

#### 6. Inclure les cas limites

```bash
python3 scripts-remediation/wave1_remove_nocheck.py --apply --include-edge-cases
```

Inclut les 7 fichiers qui ont `!.` (non-null assertion) mais pas de `any`. Ces fichiers sont éligibles mais nécessitent une vérification manuelle après modification.

---

### Procédure recommandée (approche sécurisée)

```bash
# Étape 1 : Créer un checkpoint Git
# (via l'interface Manus ou git commit)

# Étape 2 : Analyser sans modifier
python3 scripts-remediation/wave1_remove_nocheck.py --stats

# Étape 3 : Appliquer par lots de 50
python3 scripts-remediation/wave1_remove_nocheck.py --apply --batch-size 50
# → Vérifier http://localhost:3000/ dans le navigateur
# → Si OK, continuer

python3 scripts-remediation/wave1_remove_nocheck.py --apply --batch-size 50
# → Vérifier à nouveau
# → Répéter jusqu'à épuisement des fichiers

# Étape 4 : Vérification finale
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
# Doit retourner 200

# Étape 5 : Créer un nouveau checkpoint
# (via l'interface Manus)
```

---

### Fichiers générés

| Fichier | Description |
|---|---|
| `wave1_report.json` | Rapport JSON complet : liste des fichiers éligibles, cas limites, résultats d'exécution |
| `wave1_execution.log` | Journal d'exécution cumulatif (toutes les sessions) |
| `.wave1-backups/` | Sauvegardes des fichiers avant modification (supprimé après rollback réussi) |

---

### Critères d'éligibilité Vague 1

Un fichier est éligible si et seulement si :
1. Sa première ligne contient `// @ts-nocheck`
2. Il ne contient aucune occurrence de `: any` (type explicite)
3. Il ne contient aucune occurrence de `as any` (cast dangereux)

Les fichiers avec `!.` (non-null assertion), `@ts-ignore` ou `@ts-expect-error` sont classés en **cas limites** et exclus par défaut. Ils peuvent être inclus avec `--include-edge-cases`.

---

### Cas limites identifiés (7 fichiers)

Ces 7 fichiers n'ont pas de `any` mais contiennent des `!.` (non-null assertions). Ils sont éligibles mais nécessitent une attention particulière :

| Fichier | Raison |
|---|---|
| `client/src/components/MolecularRadar.tsx` | `!.` présent |
| `client/src/components/charts/EnhancedHeatmap.tsx` | `!.` présent |
| `client/src/hooks/useCollaboration.ts` | `!.` présent |
| `client/src/pages/AIClassificationBatch.tsx` | `!.` présent |
| `client/src/pages/CorrelationAnalysis.tsx` | `!.` présent |
| `client/src/pages/Favoris.tsx` | `!.` présent |
| `client/src/pages/GammesMossi.tsx` | `!.` présent |

Après suppression de `@ts-nocheck` sur ces fichiers, TypeScript pourrait signaler des erreurs `TS2531` (Object is possibly null) sur les lignes avec `!.`. Ces erreurs sont des vrais positifs qui indiquent des accès potentiellement dangereux à des valeurs nulles.

---

### Résultats des tests (11 mars 2026)

| Test | Résultat |
|---|---|
| Dry-run sur 616 fichiers | ✅ 369 éligibles identifiés correctement |
| Application sur 1 fichier (`useAuth.ts`) | ✅ `@ts-nocheck` supprimé, sauvegarde créée |
| Rollback sur 1 fichier | ✅ Fichier restauré, backup supprimé |
| Application sur 10 fichiers (batch) | ✅ 10/10 modifiés, serveur HTTP 200 |
| Rollback sur 10 fichiers | ✅ 10/10 restaurés |

---

#---

## Vague 2 — `wave2_fix_any.py`

### Objectif

Traiter les **240 fichiers** qui contiennent des `any` explicites (`: any` ou `as any`) en appliquant 6 transformations automatiques sûres, et générer un rapport complet des 2 464 cas nécessitant une intervention manuelle.

**Résultat attendu :** Suppression automatique de ~131 occurrences `any` (8 % du total), retrait de `@ts-nocheck` sur les fichiers entièrement corrigés, et rapport Markdown actionnable pour les 2 464 cas restants.

---

### Transformations automatiques (T1–T6)

| ID | Pattern | Transformation | Occurrences |
|---|---|---|---|
| T1 | `(err: any)` / `(error: any)` | `(err: Error)` | ~30 |
| T2 | `(_: any, ...)` | `(_, ...)` | ~15 |
| T3 | `function dragstarted(event: any)` | `(event: MouseEvent)` | ~5 |
| T4 | `onValueChange={(v) => setState(v as any)}` | `as string` | ~21 |
| T5 | `(data as any[])` | `(data as unknown[])` | ~18 |
| T6 | `(x as any).prop` | `(x as Record<string, unknown>).prop` | ~55 |
| T7 | `@ts-nocheck` auto-retiré si 0 `any` restant | — | — |

---

### Commandes

```bash
# Depuis la racine du projet
cd /home/ubuntu/perfumum-research

# 1. Analyse + génération du rapport manuel (aucune modification)
python3 scripts-remediation/wave2_fix_any.py

# 2. Générer uniquement le rapport des cas manuels
python3 scripts-remediation/wave2_fix_any.py --report

# 3. Appliquer par lots de 30
python3 scripts-remediation/wave2_fix_any.py --apply --batch-size 30

# 4. Appliquer sur un fichier unique
python3 scripts-remediation/wave2_fix_any.py --apply --file client/src/components/AddInventoryModal.tsx

# 5. Rollback complet
python3 scripts-remediation/wave2_fix_any.py --rollback

# 6. Inclure les transformations semi-sûres (T7 callbacks génériques)
python3 scripts-remediation/wave2_fix_any.py --apply --include-semi-safe
```

---

### Fichiers générés

| Fichier | Description |
|---|---|
| `wave2_report.json` | Rapport JSON complet |
| `wave2_manual_cases.md` | Rapport Markdown des 2 464 cas manuels, classés par type |
| `wave2_execution.log` | Journal cumulatif d'exécution |
| `.wave2-backups/` | Sauvegardes avant modification |

---

### Résultats des tests (11 mars 2026)

| Test | Résultat |
|---|---|
| Dry-run sur 240 fichiers | 131 corrections auto identifiées, rapport manuel généré |
| `AdminMoleculeNew.tsx` : `(error: any)` → `(error: Error)` | `@ts-nocheck` retiré automatiquement |
| `AdminReferences.tsx` : `(_: any, i)` → `(_, i)` | `@ts-nocheck` retiré automatiquement |
| `AddInventoryModal.tsx` : `v as any` → `v as string` | `@ts-nocheck` retiré automatiquement |
| Batch de 10 fichiers | 4 modifiés, 6 ignorés (aucune transformation applicable), serveur HTTP 200 |
| Rollback complet | 4/4 fichiers restaurés |

---

## Vagues futures (à venir)

| Vague | Script | Cible | Statut |
|---|---|---|---|
| 3 | `wave3_d3_types.py` | 35 composants D3 (494 callbacks `(d: any)`) | À créer |
| 4 | `wave4_define_interfaces.py` | ~60 pages avec `as any` | À créer |
| 5 | Manuel | 27 fichiers difficiles (score > 50) | Refactorisation manuelle |

---

*Documentation générée le 11 mars 2026 — Projet PERFUMUM*
