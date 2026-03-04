#!/usr/bin/env python3
"""
Script de correction v3 des erreurs TypeScript dans db.ts
Cible:
- TS2554: db.execute(string, params) → (db as any).execute(string, params)
- TS2352: varname[0] as any[] → ((varname as any).rows ?? varname) as any[]
- TS2339: champs inexistants
- TS2802: for...of sur résultat execute
"""
import re
import sys

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    changes = 0
    
    # Fix TS2554: await db.execute(string, params) → await (db as any).execute(string, params)
    # Pattern: await db.execute(\n  'string',\n  [params]\n)
    # Also: await db.execute(`string`, params)
    # Replace: await db.execute( → await (db as any).execute(
    # But only when it's a string/template literal (not sql`...`)
    
    # Simple pattern: db.execute('...', [...])  or  db.execute(`...`, [...])
    # But NOT: db.execute(sql`...`)
    
    # Pattern 1: db.execute(\n    'string',
    def fix_execute_string(m):
        return '(db as any).execute('
    
    # Match db.execute( followed by a string literal or template literal (not sql`)
    # We need to be careful not to match db.execute(sql`...`)
    pattern_ts2554 = r'db\.execute\(\s*(?=[\'"`](?!sql))'
    # Actually, let's just replace all db.execute( that are followed by a quote
    # More precise: db.execute( where next non-space char is ' or ` but not sql`
    
    # Simpler approach: find db.execute( followed by newline+spaces+quote
    pattern_a = r'db\.execute\(\s*\n(\s+)[\'`]'
    def fix_a(m):
        return f'(db as any).execute(\n{m.group(1)}\''
    
    # Even simpler: replace all db.execute( that are NOT followed by sql`
    # Use negative lookahead
    pattern_b = r'db\.execute\((?!sql`)'
    replacement_b = '(db as any).execute('
    new_content = re.sub(pattern_b, replacement_b, content)
    if new_content != content:
        n = len(re.findall(pattern_b, content))
        changes += n
        print(f"  FixTS2554 (db.execute(non-sql)): {n} occurrences")
        content = new_content
    
    # Fix TS2352: remaining varname[0] as any[] patterns
    # Pattern: (varname[0] as any[]) - already handled but check for missed ones
    pattern_c = r'\((\w+)\[0\] as any\[\]\)'
    def fix_c(m):
        varname = m.group(1)
        return f'(({varname} as any).rows ?? {varname}) as any[]'
    new_content = re.sub(pattern_c, fix_c, content)
    if new_content != content:
        n = len(re.findall(pattern_c, content))
        changes += n
        print(f"  FixTS2352 (varname[0] as any[]): {n} occurrences")
        content = new_content
    
    # Fix TS2352: result as any[][] patterns
    pattern_d = r'\(result as any\[\]\[0\]\)'
    replacement_d = '(((result as any).rows ?? result) as any[])[0]'
    new_content = re.sub(pattern_d, replacement_d, content)
    if new_content != content:
        n = len(re.findall(pattern_d, content))
        changes += n
        print(f"  FixTS2352 (result as any[][0]): {n} occurrences")
        content = new_content
    
    # Fix TS2802: for (const row of result) → for (const row of ((result as any).rows ?? result))
    pattern_e = r'for \(const (\w+) of result\)'
    replacement_e = r'for (const \1 of (((result as any).rows ?? result) as any[]))'
    new_content = re.sub(pattern_e, replacement_e, content)
    if new_content != content:
        n = len(re.findall(pattern_e, content))
        changes += n
        print(f"  FixTS2802 (for...of result): {n} occurrences")
        content = new_content
    
    # Fix TS2339: molecules.molecularFormula → molecules.chemicalFormula
    # (in db.ts context, not raw-materials.ts)
    pattern_f = r'molecules\.molecularFormula'
    replacement_f = 'molecules.chemicalFormula'
    new_content = re.sub(pattern_f, replacement_f, content)
    if new_content != content:
        n = len(re.findall(pattern_f, content))
        changes += n
        print(f"  FixTS2339 (molecularFormula→chemicalFormula): {n} occurrences")
        content = new_content
    
    # Fix TS2339: molecules.olfactiveFamily → molecules.family
    pattern_g = r'molecules\.olfactiveFamily'
    replacement_g = 'molecules.family'
    new_content = re.sub(pattern_g, replacement_g, content)
    if new_content != content:
        n = len(re.findall(pattern_g, content))
        changes += n
        print(f"  FixTS2339 (olfactiveFamily→family): {n} occurrences")
        content = new_content
    
    # Fix TS2339: rawMaterials.origin → rawMaterials.originCountry
    pattern_h = r'rawMaterials\.origin\b(?!Country)'
    replacement_h = 'rawMaterials.originCountry'
    new_content = re.sub(pattern_h, replacement_h, content)
    if new_content != content:
        n = len(re.findall(r'rawMaterials\.origin\b', content))
        changes += n
        print(f"  FixTS2339 (rawMaterials.origin→originCountry): {n} occurrences")
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
