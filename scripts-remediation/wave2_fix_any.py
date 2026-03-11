#!/usr/bin/env python3
"""
PERFUMUM — Script de Remédiation TypeScript — Vague 2
======================================================
Traite les fichiers avec `any` explicite en appliquant des transformations
automatiques sûres, et génère un rapport détaillé des cas nécessitant
une intervention manuelle.

Transformations automatiques appliquées :
  T1 — error_param     : (err: any) / (error: any)  →  (err: Error)
  T2 — underscore_cb   : (_: any, ...)               →  (_, ...)
  T3 — event_drag      : (event: any) dans dragstart/dragend  →  (event: DragEvent)
  T4 — onValueChange   : setState(v as any)          →  setState(v as string)
  T5 — array_cast      : (data as any[])             →  (data as unknown[])
  T6 — unknown_cast    : (x as any).prop             →  (x as unknown as ExpectedType)
       → remplacé par (x as Record<string, unknown>).prop quand sûr
  T7 — nocheck_cleanup : retire @ts-nocheck si plus aucun 'any' après corrections

Cas NON traités automatiquement (rapport manuel) :
  - `: any[]` dans les interfaces/props (nécessite de connaître le type réel)
  - `as any` dans les callbacks D3 complexes (nécessite les types D3)
  - `as any` dans les objets littéraux complexes
  - `function({ prop }: any)` (props de composant non typées)

Usage :
  python3 wave2_fix_any.py                    # Dry-run (analyse seule)
  python3 wave2_fix_any.py --apply            # Applique les transformations
  python3 wave2_fix_any.py --apply --batch-size 30
  python3 wave2_fix_any.py --apply --file client/src/pages/AdminMoleculeNew.tsx
  python3 wave2_fix_any.py --rollback         # Annule toutes les modifications
  python3 wave2_fix_any.py --report           # Génère uniquement le rapport manuel

Auteur : Manus AI — 11 mars 2026
"""

import os
import re
import sys
import json
import shutil
import argparse
import datetime
from pathlib import Path
from typing import NamedTuple

# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).parent.parent.resolve()
BACKUP_DIR = BASE_DIR / ".wave2-backups"
REPORT_PATH = BASE_DIR / "wave2_report.json"
MANUAL_REPORT_PATH = BASE_DIR / "wave2_manual_cases.md"
LOG_PATH = BASE_DIR / "wave2_execution.log"

EXCLUDED_DIRS = {"node_modules", "dist", ".git", ".vite", "coverage",
                 ".wave1-backups", ".wave2-backups", "scripts-remediation"}

# ─────────────────────────────────────────────────────────────────────────────
# TRANSFORMATIONS AUTOMATIQUES
# Chaque transformation est un dict avec :
#   id       : identifiant court
#   pattern  : regex à rechercher
#   replace  : remplacement (string ou callable)
#   desc     : description lisible
#   safe     : True = appliqué sans confirmation
#   condition: callable(line) → bool optionnel pour filtrer les faux positifs
# ─────────────────────────────────────────────────────────────────────────────

def _make_transformations():
    return [
        # T1 — Paramètre d'erreur tRPC/catch
        # (err: any) → (err: Error)  |  (error: any) → (error: Error)
        {
            'id': 'T1_error_param',
            'desc': "Paramètre d'erreur : (err: any) → (err: Error)",
            'safe': True,
            'pattern': re.compile(r'\b(err|error)\s*:\s*any\b'),
            'replace': r'\1: Error',
        },
        # T2 — Paramètre ignoré dans callback : (_: any) → (_)
        {
            'id': 'T2_underscore_cb',
            'desc': "Paramètre ignoré : (_: any) → (_)",
            'safe': True,
            'pattern': re.compile(r'\(_\s*:\s*any\b'),
            'replace': '(_',
        },
        # T3 — Paramètre d'événement drag D3 : (event: any) dans fonctions drag
        # Seulement dans les fonctions nommées dragstarted/dragged/dragended
        {
            'id': 'T3_drag_event',
            'desc': "Événement drag D3 : (event: any) → (event: MouseEvent)",
            'safe': True,
            'pattern': re.compile(r'function\s+drag(?:started|ged|ended)\s*\(\s*event\s*:\s*any\b'),
            'replace': lambda m: m.group(0).replace('event: any', 'event: MouseEvent'),
        },
        # T4 — Cast onValueChange shadcn/ui : setState(v as any) → setState(v as string)
        # Contexte : onValueChange={(v) => setState(v as any)}
        {
            'id': 'T4_onvaluechange',
            'desc': "Cast onValueChange : (v as any) → (v as string)",
            'safe': True,
            'pattern': re.compile(r'onValueChange=\{[^}]*\bas\s+any\b[^}]*\}'),
            'replace': lambda m: m.group(0).replace('as any', 'as string'),
        },
        # T5 — Cast tableau : (data as any[]) → (data as unknown[])
        # Plus sûr que any[], permet quand même l'itération
        {
            'id': 'T5_array_cast',
            'desc': "Cast tableau : (x as any[]) → (x as unknown[])",
            'safe': True,
            'pattern': re.compile(r'\bas\s+any\[\]'),
            'replace': 'as unknown[]',
        },
        # T6 — Accès propriété via cast : (x as any).prop → (x as Record<string, unknown>).prop
        # Pattern : (identifier as any).something
        {
            'id': 'T6_property_access',
            'desc': "Accès propriété : (x as any).prop → (x as Record<string, unknown>).prop",
            'safe': True,
            'pattern': re.compile(r'\((\w[\w.]*)\s+as\s+any\)\.'),
            'replace': r'(\1 as Record<string, unknown>).',
        },
        # T7 — Paramètre de callback simple dans .map()/.filter() quand le nom est générique
        # (item: any) → (item) quand item n'est utilisé que pour accéder à .id/.name/.label
        # NOTE: Cette transformation est semi-sûre, on la marque safe=False
        {
            'id': 'T7_generic_callback',
            'desc': "Callback générique : (item: any) => item.x → (item) => item.x [semi-auto]",
            'safe': False,  # Nécessite validation manuelle
            'pattern': re.compile(r'\((\w+)\s*:\s*any\)\s*=>'),
            'replace': r'(\1) =>',
        },
    ]


# ─────────────────────────────────────────────────────────────────────────────
# ANALYSE D'UN FICHIER
# ─────────────────────────────────────────────────────────────────────────────

class FileAnalysis(NamedTuple):
    path: str
    lines: int
    total_any: int
    as_any_count: int
    explicit_any_count: int
    auto_fixable_count: int    # Nombre de 'any' corrigeables automatiquement
    manual_count: int          # Nombre de 'any' nécessitant intervention manuelle
    auto_transforms: list      # Liste des transformations applicables
    manual_cases: list         # Liste des cas manuels avec contexte


def analyze_file(rel_path: str) -> FileAnalysis | None:
    """Analyse un fichier et identifie les transformations applicables."""
    full_path = BASE_DIR / rel_path
    try:
        content = full_path.read_text(encoding='utf-8', errors='ignore')
        lines = content.split('\n')

        if not lines or '@ts-nocheck' not in lines[0]:
            return None
        if ': any' not in content and 'as any' not in content:
            return None

        total_any = content.count(': any') + content.count('as any')
        as_any_count = content.count('as any')
        explicit_any_count = content.count(': any')

        transformations = _make_transformations()
        auto_transforms = []
        manual_cases = []

        # Simuler les transformations sur chaque ligne
        for i, line in enumerate(lines):
            line_any_before = line.count(': any') + line.count('as any')
            if line_any_before == 0:
                continue

            line_modified = line
            applied = []

            for t in transformations:
                if not t['safe']:
                    continue
                if callable(t['replace']):
                    new_line = t['pattern'].sub(t['replace'], line_modified)
                else:
                    new_line = t['pattern'].sub(t['replace'], line_modified)

                if new_line != line_modified:
                    applied.append(t['id'])
                    line_modified = new_line

            line_any_after = line_modified.count(': any') + line_modified.count('as any')
            remaining = line_any_after

            if applied:
                auto_transforms.append({
                    'line': i + 1,
                    'original': line.strip()[:100],
                    'transformed': line_modified.strip()[:100],
                    'transforms': applied,
                    'remaining_any': remaining,
                })

            # Les 'any' restants après transformation → cas manuels
            if remaining > 0:
                # Classifier le type de cas manuel
                case_type = _classify_manual_case(line_modified)
                manual_cases.append({
                    'line': i + 1,
                    'content': line_modified.strip()[:120],
                    'type': case_type,
                    'any_count': remaining,
                })

        # Cas manuels sur les lignes non touchées par les transformations
        for i, line in enumerate(lines):
            if ': any' not in line and 'as any' not in line:
                continue
            # Vérifier si cette ligne est déjà dans auto_transforms
            already_handled = any(t['line'] == i + 1 for t in auto_transforms)
            if not already_handled:
                case_type = _classify_manual_case(line)
                manual_cases.append({
                    'line': i + 1,
                    'content': line.strip()[:120],
                    'type': case_type,
                    'any_count': line.count(': any') + line.count('as any'),
                })

        auto_fixable = sum(t['line'] for t in auto_transforms if t['remaining_any'] == 0)
        auto_fixable_count = len([t for t in auto_transforms if t['remaining_any'] == 0])
        manual_count = len(manual_cases)

        return FileAnalysis(
            path=rel_path,
            lines=len(lines),
            total_any=total_any,
            as_any_count=as_any_count,
            explicit_any_count=explicit_any_count,
            auto_fixable_count=auto_fixable_count,
            manual_count=manual_count,
            auto_transforms=auto_transforms,
            manual_cases=manual_cases,
        )
    except Exception as e:
        return None


def _classify_manual_case(line: str) -> str:
    """Classe un cas manuel par type pour le rapport."""
    s = line.strip()
    if re.search(r':\s*any\[\]', s):
        return 'array_type_prop'
    if re.search(r'function\s*\w*\s*\(\s*\{[^}]*\}\s*:\s*any\)', s):
        return 'destructured_props'
    if re.search(r'function\s+\w+\s*\([^)]*:\s*any', s):
        return 'function_param'
    if re.search(r'(?:const|let|var)\s+\w+\s*:\s*any\b', s):
        return 'local_variable'
    if re.search(r'\w+\s*:\s*any[;,]', s):
        return 'interface_property'
    if re.search(r'\((?:d|node|link|source|target|datum)\s*:\s*any\)', s):
        return 'd3_callback'
    if re.search(r'\bas\s+any\b', s):
        return 'as_any_complex'
    if re.search(r'\((\w+)\s*:\s*any\)\s*=>', s):
        return 'callback_param'
    return 'other'


# ─────────────────────────────────────────────────────────────────────────────
# APPLICATION DES TRANSFORMATIONS
# ─────────────────────────────────────────────────────────────────────────────

class TransformResult(NamedTuple):
    path: str
    success: bool
    action: str
    any_before: int
    any_after: int
    transforms_applied: list
    detail: str


def apply_transforms(rel_path: str, include_semi_safe: bool = False) -> TransformResult:
    """Applique les transformations automatiques sur un fichier."""
    full_path = BASE_DIR / rel_path
    try:
        original = full_path.read_text(encoding='utf-8', errors='ignore')
        lines = original.split('\n')

        if not lines or '@ts-nocheck' not in lines[0]:
            return TransformResult(rel_path, False, 'skipped', 0, 0, [], 'Pas de @ts-nocheck')

        any_before = original.count(': any') + original.count('as any')
        if any_before == 0:
            return TransformResult(rel_path, False, 'skipped', 0, 0, [], 'Aucun any trouvé')

        transformations = _make_transformations()
        if include_semi_safe:
            active_transforms = transformations
        else:
            active_transforms = [t for t in transformations if t['safe']]

        modified_lines = []
        all_applied = []

        for line in lines:
            new_line = line
            for t in active_transforms:
                if callable(t['replace']):
                    candidate = t['pattern'].sub(t['replace'], new_line)
                else:
                    candidate = t['pattern'].sub(t['replace'], new_line)
                if candidate != new_line:
                    all_applied.append(t['id'])
                    new_line = candidate
            modified_lines.append(new_line)

        modified = '\n'.join(modified_lines)
        any_after = modified.count(': any') + modified.count('as any')

        # T7 — Si plus aucun 'any', retirer @ts-nocheck
        if any_after == 0 and modified_lines and '@ts-nocheck' in modified_lines[0]:
            modified_lines = modified_lines[1:]
            # Supprimer la ligne vide éventuelle
            if modified_lines and modified_lines[0].strip() == '':
                modified_lines = modified_lines[1:]
            modified = '\n'.join(modified_lines)
            all_applied.append('T_NOCHECK_REMOVED')

        if modified == original:
            return TransformResult(rel_path, False, 'skipped', any_before, any_after,
                                   [], 'Aucune transformation applicable')

        # Sauvegarde avant écriture
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)
        backup_path = BACKUP_DIR / rel_path.replace('/', '__')
        shutil.copy2(full_path, backup_path)

        # Écriture
        full_path.write_text(modified, encoding='utf-8')

        reduced = any_before - any_after
        detail = (f"{reduced}/{any_before} any supprimés"
                  + (" + @ts-nocheck retiré" if 'T_NOCHECK_REMOVED' in all_applied else ""))

        return TransformResult(rel_path, True, 'modified', any_before, any_after,
                               list(set(all_applied)), detail)

    except PermissionError:
        return TransformResult(rel_path, False, 'error', 0, 0, [], 'Permission refusée')
    except Exception as e:
        return TransformResult(rel_path, False, 'error', 0, 0, [], str(e))


# ─────────────────────────────────────────────────────────────────────────────
# ROLLBACK
# ─────────────────────────────────────────────────────────────────────────────

def rollback_all() -> int:
    if not BACKUP_DIR.exists():
        print('[INFO] Aucune sauvegarde trouvée. Rien à restaurer.')
        return 0
    restored = 0
    for backup_file in BACKUP_DIR.iterdir():
        rel_path = backup_file.name.replace('__', '/')
        target = BASE_DIR / rel_path
        if target.exists():
            shutil.copy2(backup_file, target)
            restored += 1
            print(f'  [RESTAURÉ] {rel_path}')
        else:
            print(f'  [WARN] Cible introuvable : {rel_path}')
    return restored


# ─────────────────────────────────────────────────────────────────────────────
# RAPPORT MANUEL
# ─────────────────────────────────────────────────────────────────────────────

def generate_manual_report(analyses: list) -> str:
    """Génère un rapport Markdown des cas nécessitant une intervention manuelle."""
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')

    # Regrouper par type de cas
    by_type = {}
    for fa in analyses:
        for mc in fa.manual_cases:
            t = mc['type']
            if t not in by_type:
                by_type[t] = []
            by_type[t].append({'file': fa.path, 'line': mc['line'],
                                'content': mc['content'], 'any_count': mc['any_count']})

    type_descriptions = {
        'array_type_prop':    ('Propriétés typées `any[]`', 'Remplacer par le type réel ou `unknown[]`'),
        'destructured_props': ('Props de composant destructurées `({ prop }: any)`', 'Créer une interface Props'),
        'function_param':     ('Paramètres de fonction `(x: any)`', 'Inférer depuis le contexte ou utiliser `unknown`'),
        'local_variable':     ('Variables locales `const x: any`', 'Inférer le type depuis l\'initialisation'),
        'interface_property': ('Propriétés d\'interface `: any`', 'Définir le type réel'),
        'd3_callback':        ('Callbacks D3 `(d: any)`', 'Utiliser les types D3 : `SimulationNodeDatum`, `HierarchyNode`, etc.'),
        'as_any_complex':     ('Casts complexes `as any`', 'Utiliser `as unknown as TargetType` ou `satisfies`'),
        'callback_param':     ('Paramètres de callback `(item: any) =>`', 'Inférer depuis le type du tableau source'),
        'other':              ('Autres cas', 'Analyse manuelle requise'),
    }

    lines = [
        f'# PERFUMUM — Rapport Vague 2 : Cas Manuels',
        f'',
        f'Généré le {now}',
        f'',
        f'Ce rapport liste les occurrences de `any` qui **ne peuvent pas être corrigées automatiquement**',
        f'et nécessitent une intervention manuelle. Elles sont classées par type de problème.',
        f'',
        f'---',
        f'',
        f'## Résumé',
        f'',
        f'| Type | Occurrences | Fichiers |',
        f'|---|---|---|',
    ]

    for t, cases in sorted(by_type.items(), key=lambda x: -len(x[1])):
        files_count = len(set(c['file'] for c in cases))
        desc = type_descriptions.get(t, (t, ''))[0]
        lines.append(f'| {desc} | {len(cases)} | {files_count} |')

    total_manual = sum(len(v) for v in by_type.values())
    total_files = len(set(c['file'] for cases in by_type.values() for c in cases))
    lines += [
        f'| **TOTAL** | **{total_manual}** | **{total_files}** |',
        f'',
        f'---',
        f'',
    ]

    # Détail par type
    for t, cases in sorted(by_type.items(), key=lambda x: -len(x[1])):
        desc, fix = type_descriptions.get(t, (t, 'Analyse manuelle'))
        lines += [
            f'## {desc}',
            f'',
            f'**Correction suggérée :** {fix}',
            f'',
        ]

        # Grouper par fichier
        by_file = {}
        for c in cases:
            if c['file'] not in by_file:
                by_file[c['file']] = []
            by_file[c['file']].append(c)

        for filepath, file_cases in sorted(by_file.items()):
            lines.append(f'### `{filepath}`')
            lines.append(f'')
            for c in file_cases[:8]:  # Max 8 exemples par fichier
                lines.append(f'- **L{c["line"]}** : `{c["content"]}`')
            if len(file_cases) > 8:
                lines.append(f'- *... et {len(file_cases) - 8} autres occurrences*')
            lines.append(f'')

    lines += [
        f'---',
        f'',
        f'## Guide de correction rapide',
        f'',
        f'### Callbacks D3',
        f'```typescript',
        f'// Avant',
        f'.attr("cx", (d: any) => d.x)',
        f'',
        f'// Après — avec type D3',
        f'import type {{ SimulationNodeDatum }} from "d3";',
        f'interface GraphNode extends SimulationNodeDatum {{ id: string; x?: number; }}',
        f'.attr("cx", (d: GraphNode) => d.x ?? 0)',
        f'```',
        f'',
        f'### Props de composant',
        f'```typescript',
        f'// Avant',
        f'function Card({{ title, value }}: any) {{',
        f'',
        f'// Après',
        f'interface CardProps {{ title: string; value: number; }}',
        f'function Card({{ title, value }}: CardProps) {{',
        f'```',
        f'',
        f'### Variables locales',
        f'```typescript',
        f'// Avant',
        f'const dataPoint: any = {{ axis: axis.label }};',
        f'',
        f'// Après',
        f'const dataPoint: Record<string, string | number> = {{ axis: axis.label }};',
        f'// ou laisser TypeScript inférer :',
        f'const dataPoint = {{ axis: axis.label }};',
        f'```',
        f'',
        f'### Casts complexes `as any`',
        f'```typescript',
        f'// Avant',
        f'(someObj as any).specialProp',
        f'',
        f'// Après — double cast sûr',
        f'(someObj as unknown as {{ specialProp: string }}).specialProp',
        f'// ou avec Record si la structure est inconnue',
        f'(someObj as Record<string, unknown>).specialProp as string',
        f'```',
        f'',
        f'*Rapport généré par wave2_fix_any.py — Projet PERFUMUM*',
    ]

    return '\n'.join(lines)


# ─────────────────────────────────────────────────────────────────────────────
# RAPPORT JSON + RÉSUMÉ TERMINAL
# ─────────────────────────────────────────────────────────────────────────────

def save_json_report(analyses: list, results: list, dry_run: bool):
    report = {
        'generated_at': datetime.datetime.now().isoformat(),
        'mode': 'dry-run' if dry_run else 'apply',
        'project': str(BASE_DIR),
        'summary': {
            'files_analyzed': len(analyses),
            'total_any_occurrences': sum(a.total_any for a in analyses),
            'auto_fixable_occurrences': sum(a.auto_fixable_count for a in analyses),
            'manual_occurrences': sum(a.manual_count for a in analyses),
            'files_modified': sum(1 for r in results if r.action == 'modified'),
            'any_removed': sum(r.any_before - r.any_after for r in results if r.success),
            'nocheck_removed': sum(1 for r in results if 'T_NOCHECK_REMOVED' in r.transforms_applied),
        },
        'file_analyses': [
            {
                'path': a.path,
                'lines': a.lines,
                'total_any': a.total_any,
                'auto_fixable': a.auto_fixable_count,
                'manual': a.manual_count,
                'manual_cases': a.manual_cases[:5],
            }
            for a in analyses
        ],
        'execution_results': [
            {
                'path': r.path,
                'success': r.success,
                'action': r.action,
                'any_before': r.any_before,
                'any_after': r.any_after,
                'transforms': r.transforms_applied,
                'detail': r.detail,
            }
            for r in results
        ],
    }
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    return report['summary']


def print_summary(analyses: list, results: list, dry_run: bool):
    total_any = sum(a.total_any for a in analyses)
    auto_fix = sum(a.auto_fixable_count for a in analyses)
    manual = sum(a.manual_count for a in analyses)

    print('\n' + '═' * 62)
    print('  PERFUMUM — Remédiation TypeScript — Vague 2')
    print('  Mode : ' + ('DRY-RUN (aucune modification)' if dry_run else 'APPLY'))
    print('═' * 62)
    print(f'\n📊 ANALYSE DES {len(analyses)} FICHIERS AVEC `any`')
    print(f'  Total occurrences `any`         : {total_any:4d}')
    print(f'  ✅ Corrigibles automatiquement   : {auto_fix:4d}')
    print(f'  📋 Nécessitent intervention      : {manual:4d}')
    print(f'  Taux de correction automatique  : {auto_fix*100//total_any if total_any else 0}%')

    if results:
        modified = [r for r in results if r.action == 'modified']
        skipped = [r for r in results if r.action == 'skipped']
        errors = [r for r in results if r.action == 'error']
        any_removed = sum(r.any_before - r.any_after for r in results if r.success)
        nocheck_removed = sum(1 for r in results if 'T_NOCHECK_REMOVED' in r.transforms_applied)

        print(f'\n⚙️  RÉSULTATS D\'EXÉCUTION')
        print(f'  ✅ Fichiers modifiés            : {len(modified)}')
        print(f'  🗑️  Occurrences `any` supprimées : {any_removed}')
        print(f'  🏷️  @ts-nocheck retirés          : {nocheck_removed}')
        print(f'  ⏭️  Ignorés                      : {len(skipped)}')
        print(f'  ❌ Erreurs                      : {len(errors)}')

        if errors:
            print(f'\n  Fichiers en erreur :')
            for r in errors:
                print(f'    {r.path} — {r.detail}')

    print(f'\n📄 Rapport JSON    : {REPORT_PATH}')
    print(f'📋 Rapport manuel  : {MANUAL_REPORT_PATH}')
    if not dry_run and results:
        print(f'💾 Sauvegardes     : {BACKUP_DIR}')
        print(f'↩️  Rollback        : python3 {Path(__file__).name} --rollback')
    print('═' * 62 + '\n')


# ─────────────────────────────────────────────────────────────────────────────
# POINT D'ENTRÉE
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description='PERFUMUM — Remédiation @ts-nocheck — Vague 2',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples :
  python3 wave2_fix_any.py                         # Analyse seule (dry-run)
  python3 wave2_fix_any.py --apply                 # Applique toutes les transformations
  python3 wave2_fix_any.py --apply --batch-size 30 # Par lots de 30 fichiers
  python3 wave2_fix_any.py --apply --file client/src/pages/AdminMoleculeNew.tsx
  python3 wave2_fix_any.py --rollback              # Annule toutes les modifications
  python3 wave2_fix_any.py --report                # Génère uniquement le rapport manuel
        """
    )
    parser.add_argument('--apply', action='store_true',
                        help='Applique les transformations')
    parser.add_argument('--rollback', action='store_true',
                        help='Restaure tous les fichiers depuis les sauvegardes')
    parser.add_argument('--report', action='store_true',
                        help='Génère uniquement le rapport des cas manuels')
    parser.add_argument('--file', type=str, default=None,
                        help='Traiter un seul fichier (chemin relatif)')
    parser.add_argument('--batch-size', type=int, default=0,
                        help='Nombre maximum de fichiers à traiter (0 = tous)')
    parser.add_argument('--include-semi-safe', action='store_true',
                        help='Inclure les transformations semi-sûres (T7 callbacks génériques)')
    args = parser.parse_args()

    # ── Mode rollback ──────────────────────────────────────────────────────
    if args.rollback:
        print('\n↩️  ROLLBACK en cours...')
        n = rollback_all()
        print(f'\n✅ {n} fichier(s) restauré(s) depuis {BACKUP_DIR}')
        if n > 0:
            shutil.rmtree(BACKUP_DIR)
            print(f'🗑️  Dossier de sauvegardes supprimé.')
        return

    # ── Collecte des fichiers cibles ───────────────────────────────────────
    if args.file:
        target_paths = [args.file]
    else:
        target_paths = []
        for root, dirs, files in os.walk(BASE_DIR):
            dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
            for f in files:
                if not f.endswith(('.ts', '.tsx')):
                    continue
                path = Path(root) / f
                rel = str(path.relative_to(BASE_DIR))
                target_paths.append(rel)

    # ── Analyse ────────────────────────────────────────────────────────────
    print(f'\n🔍 Analyse de {len(target_paths)} fichiers...')
    analyses = []
    for rel in target_paths:
        fa = analyze_file(rel)
        if fa is not None:
            analyses.append(fa)

    print(f'  → {len(analyses)} fichiers avec `any` identifiés')

    # Générer le rapport manuel (toujours)
    manual_md = generate_manual_report(analyses)
    MANUAL_REPORT_PATH.write_text(manual_md, encoding='utf-8')
    print(f'  → Rapport manuel généré : {MANUAL_REPORT_PATH}')

    # ── Mode rapport seul ──────────────────────────────────────────────────
    if args.report or (not args.apply):
        print_summary(analyses, [], dry_run=True)
        save_json_report(analyses, [], dry_run=True)
        if not args.apply:
            auto_fix = sum(a.auto_fixable_count for a in analyses)
            total_any = sum(a.total_any for a in analyses)
            print(f'💡 Pour appliquer les {auto_fix}/{total_any} corrections automatiques :')
            print(f'   python3 {Path(__file__).name} --apply')
            if args.batch_size == 0:
                print(f'   python3 {Path(__file__).name} --apply --batch-size 30')
        return

    # ── Mode apply ────────────────────────────────────────────────────────
    # Filtrer les fichiers qui ont des transformations applicables
    targets = [a for a in analyses if a.auto_fixable_count > 0 or a.as_any_count > 0]

    if args.batch_size > 0:
        targets = targets[:args.batch_size]
        print(f'  [INFO] Batch limité à {args.batch_size} fichiers')

    print(f'\n⚙️  Application sur {len(targets)} fichiers...')
    results = []

    for i, fa in enumerate(targets, 1):
        result = apply_transforms(fa.path, include_semi_safe=args.include_semi_safe)
        results.append(result)

        icon = '✅' if result.success else ('⏭️' if result.action == 'skipped' else '❌')
        reduction = f'{result.any_before}→{result.any_after}' if result.success else ''
        print(f'  [{i:3d}/{len(targets)}] {icon} {fa.path} {reduction}')
        if not result.success and result.action not in ('skipped',):
            print(f'         → {result.detail}')

    # ── Rapport final ──────────────────────────────────────────────────────
    print_summary(analyses, results, dry_run=False)
    save_json_report(analyses, results, dry_run=False)

    # Log
    with open(LOG_PATH, 'a', encoding='utf-8') as log:
        log.write(f'\n{"="*60}\n')
        log.write(f'Exécution : {datetime.datetime.now().isoformat()}\n')
        log.write(f'Mode : apply | Batch : {args.batch_size or "all"}\n')
        modified = sum(1 for r in results if r.action == 'modified')
        any_removed = sum(r.any_before - r.any_after for r in results if r.success)
        log.write(f'Résultat : {modified}/{len(targets)} fichiers | {any_removed} any supprimés\n')
        for r in results:
            log.write(f'  [{r.action.upper():10s}] {r.path} — {r.detail}\n')


if __name__ == '__main__':
    main()
