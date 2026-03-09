#!/usr/bin/env python3
"""
Script pour ajouter TabErrorBoundary sur toutes les pages avec TabsContent.
Cible uniquement les pages "detail" ou pages importantes avec des onglets.
"""
import re
import os
import sys

PAGES_DIR = "/home/ubuntu/perfumum-research/client/src/pages"
IMPORT_LINE = 'import { TabErrorBoundary } from "@/components/TabErrorBoundary";'

# Pages déjà traitées manuellement (MoleculeDetail, PlantDetail, RawMaterialDetail)
# + pages admin/utilitaires où les erreurs d'onglet sont moins critiques
SKIP_PAGES = {
    "MoleculeDetail.tsx",
    "PlantDetail.tsx", 
    "RawMaterialDetail.tsx",
}

def has_tabs_content(content):
    return "<TabsContent" in content

def has_tab_error_boundary(content):
    return "TabErrorBoundary" in content

def has_import(content):
    return "TabErrorBoundary" in content

def add_import(content):
    """Ajoute l'import TabErrorBoundary après le dernier import existant."""
    lines = content.split('\n')
    last_import_idx = -1
    for i, line in enumerate(lines):
        if line.strip().startswith('import '):
            last_import_idx = i
    if last_import_idx >= 0:
        lines.insert(last_import_idx + 1, IMPORT_LINE)
    return '\n'.join(lines)

def wrap_tabs_content(content):
    """Enveloppe chaque <TabsContent ...> ... </TabsContent> avec TabErrorBoundary."""
    # Ajouter TabErrorBoundary autour de chaque TabsContent
    # Pattern: <TabsContent ...> ... </TabsContent>
    content = re.sub(
        r'(\s*)(<TabsContent\b)',
        r'\1<TabErrorBoundary>\n\1\2',
        content
    )
    content = re.sub(
        r'(</TabsContent>)',
        r'\1\n</TabErrorBoundary>',
        content
    )
    return content

def process_file(filepath):
    filename = os.path.basename(filepath)
    if filename in SKIP_PAGES:
        return False, "skipped (already processed)"
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if not has_tabs_content(content):
        return False, "no TabsContent"
    
    if has_tab_error_boundary(content):
        return False, "already has TabErrorBoundary"
    
    # Ajouter l'import
    new_content = add_import(content)
    # Envelopper les TabsContent
    new_content = wrap_tabs_content(new_content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True, "processed"

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    processed = []
    skipped = []
    
    for filename in sorted(os.listdir(PAGES_DIR)):
        if not filename.endswith('.tsx'):
            continue
        filepath = os.path.join(PAGES_DIR, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if not has_tabs_content(content):
            continue
        if has_tab_error_boundary(content):
            skipped.append(f"  {filename}: already has TabErrorBoundary")
            continue
        if filename in SKIP_PAGES:
            skipped.append(f"  {filename}: manually processed")
            continue
            
        if dry_run:
            processed.append(f"  {filename}: would be processed")
        else:
            ok, msg = process_file(filepath)
            if ok:
                processed.append(f"  {filename}: {msg}")
            else:
                skipped.append(f"  {filename}: {msg}")
    
    print(f"\n{'DRY RUN - ' if dry_run else ''}Results:")
    print(f"\nProcessed ({len(processed)}):")
    for p in processed:
        print(p)
    print(f"\nSkipped ({len(skipped)}):")
    for s in skipped:
        print(s)
