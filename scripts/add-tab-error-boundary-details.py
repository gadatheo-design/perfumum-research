#!/usr/bin/env python3
"""
Script pour ajouter TabErrorBoundary sur les pages Detail avec TabsContent.
Approche conservative : enveloppe chaque bloc <TabsContent>...</TabsContent>
"""
import re
import os
import sys

PAGES_DIR = "/home/ubuntu/perfumum-research/client/src/pages"
IMPORT_LINE = 'import { TabErrorBoundary } from "@/components/TabErrorBoundary";'

# Pages à traiter (toutes les pages Detail avec TabsContent, sauf les 3 déjà faites)
TARGET_PAGES = [
    "AromaticRarityDetailPage.tsx",
    "AxeRechercheDetail.tsx",
    "FamilyDetail.tsx",
    "GhostVarietyDetail.tsx",
    "LeafEconomyDetail.tsx",
    "MoleculeDetail.tsx",
    "PlantDetail.tsx",
    "RawMaterialDetail.tsx",
    "TerroirDetail.tsx",
    "TobaccoLandraceDetail.tsx",
    "VarietyDetail.tsx",
    "VueDetailConnexions.tsx",
]

def add_import_after_last(content):
    """Ajoute l'import TabErrorBoundary après le dernier import."""
    lines = content.split('\n')
    last_import_idx = -1
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('import ') or stripped.startswith('} from '):
            last_import_idx = i
    if last_import_idx >= 0:
        lines.insert(last_import_idx + 1, IMPORT_LINE)
    return '\n'.join(lines)

def wrap_tabs_content_blocks(content):
    """
    Enveloppe chaque <TabsContent ...>...</TabsContent> avec <TabErrorBoundary>.
    Utilise une approche ligne par ligne pour éviter les regex complexes.
    """
    lines = content.split('\n')
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Détecter l'ouverture d'un TabsContent
        if re.match(r'\s*<TabsContent\b', line) and not re.search(r'/>', line):
            # Calculer l'indentation
            indent = len(line) - len(line.lstrip())
            indent_str = ' ' * indent
            result.append(f'{indent_str}<TabErrorBoundary>')
            result.append(line)
        # Détecter la fermeture d'un TabsContent
        elif stripped == '</TabsContent>':
            result.append(line)
            indent = len(line) - len(line.lstrip())
            indent_str = ' ' * indent
            result.append(f'{indent_str}</TabErrorBoundary>')
        else:
            result.append(line)
        i += 1
    return '\n'.join(result)

def process_file(filepath, dry_run=False):
    filename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'TabErrorBoundary' in content:
        return False, "already has TabErrorBoundary"
    
    if '<TabsContent' not in content:
        return False, "no TabsContent"
    
    # Compter les TabsContent avant
    count_before = content.count('<TabsContent')
    
    new_content = add_import_after_last(content)
    new_content = wrap_tabs_content_blocks(new_content)
    
    # Vérifier que le nombre de TabErrorBoundary correspond
    count_after = new_content.count('<TabErrorBoundary>')
    
    if not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
    
    return True, f"wrapped {count_before} TabsContent → {count_after} TabErrorBoundary"

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    
    print(f"\n{'DRY RUN - ' if dry_run else ''}Processing Detail pages:\n")
    
    for filename in TARGET_PAGES:
        filepath = os.path.join(PAGES_DIR, filename)
        if not os.path.exists(filepath):
            print(f"  {filename}: NOT FOUND")
            continue
        
        ok, msg = process_file(filepath, dry_run=dry_run)
        status = "✓" if ok else "–"
        print(f"  {status} {filename}: {msg}")
    
    print("\nDone.")
