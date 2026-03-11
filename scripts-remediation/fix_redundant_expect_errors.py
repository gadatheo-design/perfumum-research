#!/usr/bin/env python3
"""
Retire les lignes @ts-expect-error qui précèdent une ligne avec 'as any'.
Ces directives sont redondantes car le 'as any' supprime déjà l'erreur TypeScript.

Appliqué à tous les fichiers server/ (sauf node_modules et _core).
"""

import os
import re
import glob

def fix_file(filepath: str) -> int:
    """Retire les @ts-expect-error redondants avant 'as any'. Retourne le nombre de suppressions."""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    removed = 0
    i = 0
    
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Vérifier si c'est une ligne @ts-expect-error
        if '@ts-expect-error' in stripped and stripped.startswith('//'):
            # Regarder la ligne suivante
            if i + 1 < len(lines):
                next_line = lines[i + 1]
                # Si la ligne suivante contient 'as any', retirer le @ts-expect-error
                if 'as any' in next_line:
                    removed += 1
                    i += 1
                    continue
        
        new_lines.append(line)
        i += 1
    
    if removed > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"  FIXED ({removed} removed): {os.path.basename(filepath)}")
    
    return removed

def main():
    # Chercher tous les fichiers TypeScript dans server/ (sauf node_modules et _core)
    patterns = [
        "/home/ubuntu/perfumum-research/server/db/*.ts",
        "/home/ubuntu/perfumum-research/server/routers/*.ts",
        "/home/ubuntu/perfumum-research/server/*.ts",
    ]
    
    files = set()
    for pattern in patterns:
        for f in glob.glob(pattern):
            if '_core' not in f and 'node_modules' not in f and '.test.' not in f:
                files.add(f)
    
    total = 0
    print("=== Fix redundant @ts-expect-error before 'as any' ===\n")
    for filepath in sorted(files):
        total += fix_file(filepath)
    
    print(f"\nTotal @ts-expect-error removed: {total}")

if __name__ == "__main__":
    main()
