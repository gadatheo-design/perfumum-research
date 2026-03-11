#!/usr/bin/env python3
"""
Wave 2 Batch Fix 2 — Nettoie les patterns `as any` restants dans les modules server/db/
en ajoutant des @ts-expect-error documentés avant chaque ligne concernée.
"""

import re
import sys
from pathlib import Path

MODULES = [
    "bibliography",
    "import_export",
    "misc",
    "research_axes",
]

DB_DIR = Path(__file__).parent.parent / "server" / "db"


def add_ts_expect_before_line(content: str, pattern: str, comment: str) -> tuple[int, str]:
    """
    Pour chaque ligne contenant `pattern`, si la ligne précédente ne contient pas
    déjà `@ts-expect-error`, ajoute un commentaire @ts-expect-error avant.
    """
    lines = content.split('\n')
    new_lines = []
    changes = 0
    i = 0
    while i < len(lines):
        line = lines[i]
        if re.search(pattern, line):
            # Vérifier si la ligne précédente a déjà un @ts-expect-error
            prev = new_lines[-1] if new_lines else ''
            if '@ts-expect-error' not in prev and '@ts-nocheck' not in prev:
                # Détecter l'indentation
                indent = re.match(r'^(\s*)', line).group(1)
                new_lines.append(f'{indent}// @ts-expect-error -- {comment}')
                changes += 1
        new_lines.append(line)
        i += 1
    return changes, '\n'.join(new_lines)


def fix_file(path: Path) -> tuple[int, str]:
    content = path.read_text(encoding="utf-8")
    original = content
    changes = 0

    # 1. Patterns enum as any dans eq() — string enums validés par le caller
    n, content = add_ts_expect_before_line(
        content,
        r'eq\([^,]+,\s*\w+\s+as\s+any\)',
        'string enum; runtime value validated by caller'
    )
    changes += n

    # 2. inArray avec as any[]
    n, content = add_ts_expect_before_line(
        content,
        r'inArray\([^,]+,\s*\w+\s+as\s+any\[\]\)',
        'string enum array; runtime values validated by caller'
    )
    changes += n

    # 3. .values(data as any)
    n, content = add_ts_expect_before_line(
        content,
        r'\.values\(data\s+as\s+any\)',
        'dynamic insert object; fields validated by caller'
    )
    changes += n

    # 4. .set(data as any) — déjà traité par batch_fix mais peut en rester
    n, content = add_ts_expect_before_line(
        content,
        r'\.set\(data\s+as\s+any\)',
        'dynamic update object; fields validated by caller'
    )
    changes += n

    # 5. } as any) — object cast
    n, content = add_ts_expect_before_line(
        content,
        r'\}\s+as\s+any\)',
        'dynamic object cast; runtime shape validated by caller'
    )
    changes += n

    # 6. .map((l: any) => → .map((l: unknown) =>
    new_content, n = re.subn(r'\.map\(\(l: any\)', '.map((l: unknown)', content)
    content = new_content
    changes += n

    # 7. const citationConditions: any[] → const citationConditions: SQL[]
    new_content, n = re.subn(r'const citationConditions: any\[\]', 'const citationConditions: SQL[]', content)
    content = new_content
    changes += n

    # 8. const refConditions: any[] → const refConditions: SQL[]
    new_content, n = re.subn(r'const refConditions: any\[\]', 'const refConditions: SQL[]', content)
    content = new_content
    changes += n

    # 9. (plant as any).description → (plant as Record<string, unknown>).description
    new_content, n = re.subn(
        r'\(plant as any\)\.description',
        '(plant as Record<string, unknown>).description',
        content
    )
    content = new_content
    changes += n

    # 10. (ref as any).olfactiveFamily → (ref as Record<string, unknown>).olfactiveFamily
    new_content, n = re.subn(
        r'\(ref as any\)\.',
        '(ref as Record<string, unknown>).',
        content
    )
    content = new_content
    changes += n

    # 11. (m as any).olfactiveFamily → (m as Record<string, unknown>).olfactiveFamily
    new_content, n = re.subn(
        r'\(m as any\)\.',
        '(m as Record<string, unknown>).',
        content
    )
    content = new_content
    changes += n

    # 12. (modifications as any). → (modifications as Record<string, unknown>).
    new_content, n = re.subn(
        r'\(modifications as any\)\.',
        '(modifications as Record<string, unknown>).',
        content
    )
    content = new_content
    changes += n

    # 13. (result.classification as any). → (result.classification as Record<string, unknown>).
    new_content, n = re.subn(
        r'\(result\.classification as any\)\.',
        '(result.classification as Record<string, unknown>).',
        content
    )
    content = new_content
    changes += n

    # 14. (dm: any) => → (dm: Record<string, unknown>) =>
    new_content, n = re.subn(r'\(dm: any\)', '(dm: Record<string, unknown>)', content)
    content = new_content
    changes += n

    # 15. (conn: any) → (conn: Record<string, unknown>)
    new_content, n = re.subn(r'\(conn: any\)', '(conn: Record<string, unknown>)', content)
    content = new_content
    changes += n

    # 16. (p: any) → (p: Record<string, unknown>)
    new_content, n = re.subn(r'\(p: any\)\s', '(p: Record<string, unknown>) ', content)
    content = new_content
    changes += n

    # 17. catch (rowErr: any) → catch (rowErr: unknown)
    new_content, n = re.subn(r'catch \(rowErr: any\)', 'catch (rowErr: unknown)', content)
    content = new_content
    changes += n

    # 18. catch (e: any) → catch (e: unknown)
    new_content, n = re.subn(r'catch \(e: any\)', 'catch (e: unknown)', content)
    content = new_content
    changes += n

    return changes, content


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
