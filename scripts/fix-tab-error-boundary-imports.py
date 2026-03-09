#!/usr/bin/env python3
"""
Corrige les imports TabErrorBoundary mal insérés à l'intérieur d'un bloc import {...}.
Le problème : le script précédent a inséré la ligne après le dernier 'import' trouvé,
mais certains fichiers ont des imports multi-lignes (import { \n  A,\n  B\n} from ...).
Ce script détecte et corrige ces cas.
"""
import re
import os
import sys

PAGES_DIR = "/home/ubuntu/perfumum-research/client/src/pages"
IMPORT_LINE = 'import { TabErrorBoundary } from "@/components/TabErrorBoundary";'

def fix_file(filepath, dry_run=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if IMPORT_LINE not in content:
        return False, "no TabErrorBoundary import found"
    
    # Détecter si l'import est mal placé (à l'intérieur d'un bloc import multi-ligne)
    # Pattern: une ligne qui commence par "import {" ou "  import {" SANS "}" sur la même ligne
    # suivi de notre import line
    bad_pattern = re.compile(
        r'(import\s*\{[^}]*?\n)\s*' + re.escape(IMPORT_LINE) + r'\n',
        re.DOTALL
    )
    
    if not bad_pattern.search(content):
        return False, "import is correctly placed"
    
    # Retirer l'import mal placé
    content_fixed = bad_pattern.sub(r'\1', content)
    
    # Trouver la fin du dernier import complet (ligne qui se termine par ;)
    # et insérer notre import après
    lines = content_fixed.split('\n')
    last_complete_import_idx = -1
    
    in_multiline_import = False
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('import ') and '{' in stripped and '}' not in stripped:
            in_multiline_import = True
        if in_multiline_import and '}' in stripped and 'from' in stripped:
            in_multiline_import = False
            last_complete_import_idx = i
            continue
        if not in_multiline_import and stripped.startswith('import '):
            last_complete_import_idx = i
    
    if last_complete_import_idx >= 0:
        lines.insert(last_complete_import_idx + 1, IMPORT_LINE)
    
    new_content = '\n'.join(lines)
    
    if not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
    
    return True, f"fixed import placement (was inside multi-line import block)"

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    
    print(f"\n{'DRY RUN - ' if dry_run else ''}Fixing TabErrorBoundary import placements:\n")
    
    fixed_count = 0
    for filename in os.listdir(PAGES_DIR):
        if not filename.endswith('.tsx'):
            continue
        filepath = os.path.join(PAGES_DIR, filename)
        ok, msg = fix_file(filepath, dry_run=dry_run)
        if ok:
            fixed_count += 1
            print(f"  ✓ {filename}: {msg}")
    
    print(f"\nTotal fixed: {fixed_count}")
    print("Done.")
