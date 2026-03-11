#!/usr/bin/env python3
"""
Wave 2 Batch Fix — Nettoie les patterns `any` communs dans les modules server/db/
sans casser la logique métier.

Transformations appliquées :
1. `// @ts-nocheck` en tête de fichier → retiré
2. `catch (error: any)` → `catch (error: unknown)` + `.message` → `(error as Error).message`
3. `const conditions: any[]` → `const conditions: SQL[]` (Drizzle)
4. `query = query.where(...) as any` → `// @ts-expect-error -- Drizzle query builder chain\n    query = query.where(...)`
5. `query = query.limit(...) as any` → idem
6. `query = query.offset(...) as any` → idem
7. `query = query.orderBy(...) as any` → idem
8. `.set(data as any)` → `// @ts-expect-error -- dynamic update object\n    .set(data as any)` (conserve le any mais documente)
9. `as any)` dans les eq/inArray pour les enums → `// @ts-expect-error -- string enum\n    ...`
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


def fix_file(path: Path) -> tuple[int, str]:
    content = path.read_text(encoding="utf-8")
    original = content
    changes = 0

    # 1. Retirer @ts-nocheck en tête
    if content.startswith("// @ts-nocheck\n"):
        content = content[len("// @ts-nocheck\n"):]
        changes += 1

    # 2. catch (error: any) → catch (error: unknown)
    new_content, n = re.subn(r'catch \(error: any\)', 'catch (error: unknown)', content)
    content = new_content
    changes += n

    # 3. error.message → (error as Error).message (seulement après catch unknown)
    # On cherche les patterns `error.message` dans les blocs catch
    new_content, n = re.subn(
        r'(catch \(error: unknown\)[^}]*?)error\.message',
        lambda m: m.group(0).replace('error.message', '(error as Error).message'),
        content,
        flags=re.DOTALL
    )
    content = new_content
    changes += n

    # 4. const conditions: any[] → const conditions: SQL[]
    new_content, n = re.subn(r'const conditions: any\[\]', 'const conditions: SQL[]', content)
    content = new_content
    changes += n

    # 5. let references: any[] → let references: unknown[]
    new_content, n = re.subn(r'let references: any\[\]', 'let references: unknown[]', content)
    content = new_content
    changes += n

    # 6. const results: any[] → const results: unknown[]
    new_content, n = re.subn(r'const results: any\[\]', 'const results: unknown[]', content)
    content = new_content
    changes += n

    # 7. query = query.where(...) as any → @ts-expect-error + sans cast
    new_content, n = re.subn(
        r'(\s+)(query = query\.where\([^;]+\)) as any;',
        r'\1// @ts-expect-error -- Drizzle query builder chain; runtime usage is correct\n\1\2;',
        content
    )
    content = new_content
    changes += n

    # 8. query = query.limit(...) as any → @ts-expect-error + sans cast
    new_content, n = re.subn(
        r'(\s+)(query = query\.limit\([^;]+\)) as any;',
        r'\1// @ts-expect-error -- Drizzle query builder chain; runtime usage is correct\n\1\2;',
        content
    )
    content = new_content
    changes += n

    # 9. query = query.offset(...) as any → @ts-expect-error + sans cast
    new_content, n = re.subn(
        r'(\s+)(query = query\.offset\([^;]+\)) as any;',
        r'\1// @ts-expect-error -- Drizzle query builder chain; runtime usage is correct\n\1\2;',
        content
    )
    content = new_content
    changes += n

    # 10. query = query.orderBy(...) as any → @ts-expect-error + sans cast
    new_content, n = re.subn(
        r'(\s+)(query = query\.orderBy\([^;]+\)) as any;',
        r'\1// @ts-expect-error -- Drizzle query builder chain; runtime usage is correct\n\1\2;',
        content
    )
    content = new_content
    changes += n

    # 11. countQuery = countQuery.where(...) as any → @ts-expect-error + sans cast
    new_content, n = re.subn(
        r'(\s+)(countQuery = countQuery\.where\([^;]+\)) as any;',
        r'\1// @ts-expect-error -- Drizzle query builder chain; runtime usage is correct\n\1\2;',
        content
    )
    content = new_content
    changes += n

    # 12. .set(data as any) → @ts-expect-error + .set(data as any) (documente)
    # Ajoute le commentaire si la ligne précédente ne contient pas déjà @ts-expect-error
    def add_ts_expect(m):
        return '// @ts-expect-error -- dynamic update object; fields validated by caller\n    .set(data as any)'
    new_content, n = re.subn(
        r'\.set\(data as any\)',
        add_ts_expect,
        content
    )
    content = new_content
    changes += n

    # 13. rows as any[] → rows as unknown[]
    new_content, n = re.subn(r'rows as any\[\]', 'rows as unknown[]', content)
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
