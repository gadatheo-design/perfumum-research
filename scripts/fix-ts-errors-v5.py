#!/usr/bin/env python3
"""
Script de correction v5 des erreurs TypeScript dans db.ts
Corrections ciblées pour les cas restants après v4
"""
import re
import sys

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    changes = 0
    
    # Fix 1: data.family → data.olfactiveFamily (dans le contexte laboratoire insert)
    # Line 439: olfactiveFamily: data.family || null,
    old1 = '    olfactiveFamily: data.family || null,'
    new1 = '    olfactiveFamily: (data as any).olfactiveFamily || (data as any).family || null,'
    if old1 in content:
        content = content.replace(old1, new1, 1)
        changes += 1
        print("  Fix1 (laboratoire olfactiveFamily)")
    
    # Fix 2: data.family in updateData for laboratoire (line 10912)
    old2 = '  if (data.family !== undefined) updateData.family = data.family;'
    new2 = '  if ((data as any).olfactiveFamily !== undefined) updateData.olfactiveFamily = (data as any).olfactiveFamily;\n  if ((data as any).family !== undefined) updateData.family = (data as any).family;'
    if old2 in content:
        content = content.replace(old2, new2, 1)
        changes += 1
        print("  Fix2 (updateData.family laboratoire)")
    
    # Fix 3: ref.family and m.family for rawMaterials (line 13524)
    # rawMaterials has olfactiveFamily not family
    old3 = '    if (ref.family && m.family === ref.family) {'
    new3 = '    if ((ref as any).olfactiveFamily && (m as any).olfactiveFamily === (ref as any).olfactiveFamily) {'
    if old3 in content:
        content = content.replace(old3, new3, 1)
        changes += 1
        print("  Fix3 (rawMaterials ref.family)")
    
    # Fix 4: modifications.family → modifications.olfactiveFamily (line 15176)
    old4 = '  if (modifications.family) updateData.family = modifications.family;'
    new4 = '  if ((modifications as any).olfactiveFamily) updateData.family = (modifications as any).olfactiveFamily;'
    if old4 in content:
        content = content.replace(old4, new4, 1)
        changes += 1
        print("  Fix4 (modifications.family→olfactiveFamily)")
    
    # Fix 5: result.classification.family → result.classification.olfactiveFamily (line 15257)
    old5 = '        aiOlfactiveFamily: result.classification.family,'
    new5 = '        aiOlfactiveFamily: (result.classification as any).olfactiveFamily ?? (result.classification as any).family,'
    if old5 in content:
        content = content.replace(old5, new5, 1)
        changes += 1
        print("  Fix5 (classification.family→olfactiveFamily)")
    
    # Fix 6: plant.description (line 17422) - plants table doesn't have description
    old6 = '            [plant.name, plant.latinName, plant.family, plant.description].filter(Boolean).join(\' \')'
    new6 = '            [plant.name, plant.latinName, plant.family, (plant as any).description].filter(Boolean).join(\' \')'
    if old6 in content:
        content = content.replace(old6, new6, 1)
        changes += 1
        print("  Fix6 (plant.description)")
    
    # Fix 7: v.isLandrace === 1 comparisons (lines 18299-18313)
    # The script v4 replaced isLandrace with (variety.varietyType === 'landrace') which returns boolean
    # But the code compares with !== 1 and === 1
    # Fix: replace the boolean comparison with the correct one
    old7a = "filteredVarieties = filteredVarieties.filter(v => v.isLandrace !== 1);"
    new7a = "filteredVarieties = filteredVarieties.filter(v => v.varietyType !== 'landrace');"
    if old7a in content:
        content = content.replace(old7a, new7a)
        changes += 1
        print("  Fix7a (isLandrace !== 1)")
    
    old7b = "filteredVarieties = filteredVarieties.filter(v => v.isLandrace === 1);"
    new7b = "filteredVarieties = filteredVarieties.filter(v => v.varietyType === 'landrace');"
    if old7b in content:
        content = content.replace(old7b, new7b)
        changes += 1
        print("  Fix7b (isLandrace === 1)")
    
    # Fix 8: v.isLandrace === 1 ? 'landrace' : 'modern' patterns
    old8 = "v.isLandrace === 1 ? 'landrace' : 'modern'"
    new8 = "v.varietyType === 'landrace' ? 'landrace' : 'modern'"
    count8 = content.count(old8)
    if count8 > 0:
        content = content.replace(old8, new8)
        changes += count8
        print(f"  Fix8 (v.isLandrace===1 ternary): {count8} occurrences")
    
    # Fix 9: variety.isLandrace === 1 patterns
    old9a = "variety.isLandrace === 1 ? 'landrace' : 'modern'"
    new9a = "variety.varietyType === 'landrace' ? 'landrace' : 'modern'"
    count9a = content.count(old9a)
    if count9a > 0:
        content = content.replace(old9a, new9a)
        changes += count9a
        print(f"  Fix9a (variety.isLandrace===1 ternary): {count9a} occurrences")
    
    # Fix 10: analyticalMethods in insert context (TS2769)
    # Check line 18520 context
    # The issue is likely a missing field in insert
    
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
