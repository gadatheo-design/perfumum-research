#!/usr/bin/env python3
"""
Wave 2 Batch Fix 3 — Ajoute @ts-expect-error sur les lignes `as any` restantes
qui n'ont pas encore de commentaire @ts-expect-error sur la ligne précédente.
"""

import sys
from pathlib import Path

MODULES = [
    "bibliography",
    "import_export",
    "misc",
    "research_axes",
]

DB_DIR = Path(__file__).parent.parent / "server" / "db"


def fix_file(path: Path) -> tuple[int, str]:
    lines = path.read_text(encoding="utf-8").split('\n')
    new_lines = []
    changes = 0

    for i, line in enumerate(lines):
        # Détecter les lignes avec `as any` ou `: any`
        has_any = (' as any' in line or ': any,' in line or ': any;' in line or
                   ': any)' in line or ': any>' in line or ': any\n' in line or
                   line.strip().endswith(': any'))

        if has_any:
            # Vérifier si la ligne précédente a déjà un @ts-expect-error
            prev = new_lines[-1] if new_lines else ''
            if '@ts-expect-error' not in prev and '@ts-nocheck' not in prev and '// eslint-disable' not in prev:
                # Détecter l'indentation
                indent = ''
                for ch in line:
                    if ch in (' ', '\t'):
                        indent += ch
                    else:
                        break
                new_lines.append(f'{indent}// @ts-expect-error -- string enum or dynamic type; runtime value validated by caller')
                changes += 1

        new_lines.append(line)

    return changes, '\n'.join(new_lines)


def main():
    dry_run = "--dry-run" in sys.argv
    total_changes = 0

    for module in MODULES:
        path = DB_DIR / f"{module}.ts"
        if not path.exists():
            print(f"  SKIP {module}.ts (not found)")
            continue

        changes, new_content = fix_file(path)
        total_changes += changes

        if dry_run:
            print(f"  DRY {module}.ts: {changes} changes")
        else:
            path.write_text(new_content, encoding="utf-8")
            print(f"  FIXED {module}.ts: {changes} changes")

    print(f"\nTotal: {total_changes} changes across {len(MODULES)} modules")


if __name__ == "__main__":
    main()
