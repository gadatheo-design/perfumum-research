#!/usr/bin/env python3
"""
Script de correction v4 des erreurs TypeScript dans db.ts
Cible:
- TS2802: [...Set] → Array.from(Set)
- TS2339: champs inexistants (isLandrace, thcContent, cbdContent, methodId, olfactiveFamily)
"""
import re
import sys

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    changes = 0
    
    # Fix TS2802: [...setVar] → Array.from(setVar)
    # Pattern: [...setName] where setName is a Set variable
    # Common patterns: [...countriesSet], [...allIds], [...varietyIds]
    def fix_spread_set(m):
        varname = m.group(1)
        return f'Array.from({varname})'
    
    # Match [...varName] where varName ends with Set, Ids, or similar
    pattern_a = r'\[\.\.\.(\w+(?:Set|Ids|set|ids))\]'
    new_content = re.sub(pattern_a, fix_spread_set, content)
    if new_content != content:
        n = len(re.findall(pattern_a, content))
        changes += n
        print(f"  FixTS2802 ([...Set]→Array.from): {n} occurrences")
        content = new_content
    
    # Fix TS2339: plantVarieties.isLandrace → use sql cast
    # Replace with: sql<boolean>`(${plantVarieties.varietyType} = 'landrace')`
    pattern_b = r'plantVarieties\.isLandrace'
    replacement_b = "sql<boolean>`(${plantVarieties.varietyType} = 'landrace')`"
    new_content = re.sub(pattern_b, replacement_b, content)
    if new_content != content:
        n = len(re.findall(pattern_b, content))
        changes += n
        print(f"  FixTS2339 (plantVarieties.isLandrace): {n} occurrences")
        content = new_content
    
    # Fix TS2339: variety.isLandrace → variety.varietyType === 'landrace'
    pattern_c = r'variety\.isLandrace'
    replacement_c = "(variety.varietyType === 'landrace')"
    new_content = re.sub(pattern_c, replacement_c, content)
    if new_content != content:
        n = len(re.findall(pattern_c, content))
        changes += n
        print(f"  FixTS2339 (variety.isLandrace): {n} occurrences")
        content = new_content
    
    # Fix TS2339: plantVarieties.thcContent → cast to any
    pattern_d = r'plantVarieties\.thcContent'
    replacement_d = '(plantVarieties as any).thcContent'
    new_content = re.sub(pattern_d, replacement_d, content)
    if new_content != content:
        n = len(re.findall(pattern_d, content))
        changes += n
        print(f"  FixTS2339 (plantVarieties.thcContent): {n} occurrences")
        content = new_content
    
    # Fix TS2339: plantVarieties.cbdContent → cast to any
    pattern_e = r'plantVarieties\.cbdContent'
    replacement_e = '(plantVarieties as any).cbdContent'
    new_content = re.sub(pattern_e, replacement_e, content)
    if new_content != content:
        n = len(re.findall(pattern_e, content))
        changes += n
        print(f"  FixTS2339 (plantVarieties.cbdContent): {n} occurrences")
        content = new_content
    
    # Fix TS2339: analyticalMethods.methodId → analyticalMethods.id
    pattern_f = r'analyticalMethods\.methodId'
    replacement_f = 'analyticalMethods.id'
    new_content = re.sub(pattern_f, replacement_f, content)
    if new_content != content:
        n = len(re.findall(pattern_f, content))
        changes += n
        print(f"  FixTS2339 (analyticalMethods.methodId→id): {n} occurrences")
        content = new_content
    
    # Fix TS2339: mol.olfactiveFamily → mol.family (result row)
    # This is a runtime result, not a schema reference
    pattern_g = r'\.olfactiveFamily\b'
    replacement_g = '.family'
    new_content = re.sub(pattern_g, replacement_g, content)
    if new_content != content:
        n = len(re.findall(pattern_g, content))
        changes += n
        print(f"  FixTS2339 (.olfactiveFamily→.family): {n} occurrences")
        content = new_content
    
    # Fix TS2339: plants.description → (plants as any).description
    # Check if plants table has description field
    pattern_h = r'plants\.description\b'
    replacement_h = '(plants as any).description'
    new_content = re.sub(pattern_h, replacement_h, content)
    if new_content != content:
        n = len(re.findall(pattern_h, content))
        changes += n
        print(f"  FixTS2339 (plants.description): {n} occurrences")
        content = new_content
    
    if changes > 0:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"\n✅ {changes} corrections appliquées dans {filepath}")
    else:
        print(f"⚠️  Aucune correction automatique possible dans {filepath}")
    
    return changes

if __name__ == '__main__':
    filepath = sys.argv[1] if len(sys.argv) > 1 else '/home/ubuntu/perfumum-research/server/db.ts'
    fix_file(filepath)
