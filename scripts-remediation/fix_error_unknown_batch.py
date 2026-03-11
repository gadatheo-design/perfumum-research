#!/usr/bin/env python3
"""
Script batch pour corriger les patterns error.message/error.code/error.stack
sur des variables `error` de type `unknown` dans les fichiers TypeScript.

Transformations appliquées :
1. `catch (error)` → `catch (error: unknown)` (si pas déjà typé)
2. `error.message` → `(error instanceof Error ? error.message : String(error))`
3. `error.code` → `(error instanceof Error ? (error as NodeJS.ErrnoException).code : undefined)`
4. `error.stack` → `(error instanceof Error ? error.stack : undefined)`
"""

import re
import os
import glob

# Fichiers à traiter
TARGET_FILES = [
    "/home/ubuntu/perfumum-research/server/routers/research.ts",
    "/home/ubuntu/perfumum-research/server/routers.ts",
    "/home/ubuntu/perfumum-research/server/db/bibliography.ts",
    "/home/ubuntu/perfumum-research/server/trefle.ts",
    "/home/ubuntu/perfumum-research/server/pubchem.ts",
    "/home/ubuntu/perfumum-research/server/plant-composition-enrichment.ts",
    "/home/ubuntu/perfumum-research/server/coconut.ts",
    "/home/ubuntu/perfumum-research/server/chebi.ts",
]

def fix_file(filepath: str) -> int:
    """Applique les corrections dans un fichier. Retourne le nombre de remplacements."""
    if not os.path.exists(filepath):
        print(f"  SKIP (not found): {filepath}")
        return 0
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    count = 0
    
    # 1. Corriger `catch (error)` → `catch (error: unknown)` (sans typage existant)
    # Ne pas toucher aux catch déjà typés : catch (error: SomeType)
    new_content = re.sub(
        r'\bcatch\s*\(\s*error\s*\)',
        'catch (error: unknown)',
        content
    )
    if new_content != content:
        diff = new_content.count('catch (error: unknown)') - content.count('catch (error: unknown)')
        count += max(0, diff)
        content = new_content
    
    # 2. Corriger `error.message` → helper inline
    # Éviter de remplacer si déjà dans un instanceof check
    # Pattern : error.message (pas précédé de instanceof Error ? error.)
    new_content = re.sub(
        r'(?<!instanceof Error \? error\.)(?<!\? error\.)(?<!error instanceof Error \? error\.)\berror\.message\b(?!\s*:)',
        '(error instanceof Error ? error.message : String(error))',
        content
    )
    if new_content != content:
        diff = abs(new_content.count('error instanceof Error') - content.count('error instanceof Error'))
        count += diff
        content = new_content
    
    # 3. Corriger `error.code` → helper inline (pour les erreurs NodeJS)
    new_content = re.sub(
        r'(?<!\? \(error as NodeJS\.ErrnoException\)\.)\berror\.code\b(?!\s*:)',
        '(error instanceof Error ? (error as NodeJS.ErrnoException).code : undefined)',
        content
    )
    if new_content != content:
        diff = abs(new_content.count('ErrnoException') - content.count('ErrnoException'))
        count += diff
        content = new_content
    
    # 4. Corriger `error.stack` → helper inline
    new_content = re.sub(
        r'(?<!\? error\.)\berror\.stack\b(?!\s*:)',
        '(error instanceof Error ? error.stack : undefined)',
        content
    )
    if new_content != content:
        diff = abs(new_content.count('error instanceof Error ? error.stack') - content.count('error instanceof Error ? error.stack'))
        count += diff
        content = new_content
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  FIXED ({count} replacements): {os.path.basename(filepath)}")
    else:
        print(f"  OK (no changes): {os.path.basename(filepath)}")
    
    return count

def main():
    total = 0
    print("=== Fix error.message on unknown ===\n")
    for filepath in TARGET_FILES:
        total += fix_file(filepath)
    print(f"\nTotal replacements: {total}")

if __name__ == "__main__":
    main()
