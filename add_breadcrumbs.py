#!/usr/bin/env python3
import re
import sys

# Pages to update (excluding those already done: Molecules, BioMineralis, ResinesCBD, LaboratoireRecettes, Accords)
PAGES = [
    "Recettes",
    "Prototypes",
    "Familles",
    "Gammes",
    "GammesMossi",
    "Glossaire",
    "Laboratoire",
    "Recherche",
    "Civilisations",
    "Installations",
    "Reseau",
]

BASE_PATH = "/home/ubuntu/perfumum-research/client/src/pages"

for page in PAGES:
    file_path = f"{BASE_PATH}/{page}.tsx"
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if Breadcrumbs already imported
        if 'import { Breadcrumbs }' in content:
            print(f"○ {page} - already has Breadcrumbs")
            continue
        
        # Add import after first import line
        lines = content.split('\n')
        new_lines = []
        import_added = False
        
        for i, line in enumerate(lines):
            new_lines.append(line)
            # Add import after first import statement
            if not import_added and line.startswith('import '):
                new_lines.append('import { Breadcrumbs } from "@/components/Breadcrumbs";')
                import_added = True
        
        if not import_added:
            print(f"✗ {page} - no import statement found")
            continue
        
        content = '\n'.join(new_lines)
        
        # Add <Breadcrumbs /> component
        # Look for common patterns: return ( <div className="min-h-screen
        patterns = [
            (r'(return \(\s*<div className="min-h-screen[^>]*>)', r'\1\n      <Breadcrumbs />'),
            (r'(return \(\s*<div className="flex flex-col min-h-screen[^>]*>)', r'\1\n      <Breadcrumbs />'),
        ]
        
        component_added = False
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content, count=1)
                component_added = True
                break
        
        if not component_added:
            print(f"⚠ {page} - could not find insertion point, skipping")
            continue
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ {page} - Breadcrumbs added")
        
    except FileNotFoundError:
        print(f"✗ {page} - file not found")
    except Exception as e:
        print(f"✗ {page} - error: {e}")

print("\nDone! Review changes and test pages.")
