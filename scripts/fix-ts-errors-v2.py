#!/usr/bin/env python3
"""
Script de correction v2 des erreurs TypeScript dans db.ts
Cible les patterns restants après fix-ts-errors.py
"""
import re
import sys

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    changes = 0
    
    # Fix A: (familyResult[0] as any[]) → ((familyResult as any).rows ?? familyResult) as any[]
    # Pattern générique: (varname[0] as any[])
    def fix_var_bracket_cast(m):
        varname = m.group(1)
        return f'(({varname} as any).rows ?? {varname}) as any[]'
    
    pattern_a = r'\((\w+)\[0\] as any\[\]\)'
    new_content = re.sub(pattern_a, fix_var_bracket_cast, content)
    if new_content != content:
        n = len(re.findall(pattern_a, content))
        changes += n
        print(f"  FixA (varname[0] as any[]): {n} occurrences")
        content = new_content
    
    # Fix B: (varname[0] as any[]).map → ((varname as any).rows ?? varname) as any[]).map
    # Already covered by Fix A
    
    # Fix C: db.execute(string, params) → db.execute(sql`...`)
    # These are complex - replace with a helper pattern
    # Pattern: db.execute('SELECT ...', [params])
    # Replace with: db.execute(sql.raw('SELECT ...'))
    # Actually better: wrap with (await db.execute(...) as any).rows ?? []
    
    # Fix D: const [countResult] = await db.execute(countQuery, queryParams);
    # → const _countResult = await db.execute(sql.raw(countQuery)); const countResult = ((_countResult as any).rows ?? _countResult)[0];
    def fix_destructured_string_execute(m):
        varname = m.group(1)
        query_var = m.group(2)
        params_var = m.group(3)
        if params_var:
            return f'const _{varname} = await (db as any).query({query_var}, {params_var});\n  const {varname} = (_{varname} as any).rows ?? _{varname};'
        else:
            return f'const _{varname} = await (db as any).query({query_var});\n  const {varname} = (_{varname} as any).rows ?? _{varname};'
    
    # Pattern: const [varname] = await db.execute(queryVar, paramsVar);
    pattern_d = r'const \[(\w+)\] = await db\.execute\((\w+),\s*(\w+)\);'
    new_content = re.sub(pattern_d, fix_destructured_string_execute, content)
    if new_content != content:
        n = len(re.findall(pattern_d, content))
        changes += n
        print(f"  FixD (const [x] = await db.execute(var, params)): {n} occurrences")
        content = new_content
    
    # Fix E: const [varname] = await db.execute(queryVar);
    def fix_destructured_string_execute_no_params(m):
        varname = m.group(1)
        query_var = m.group(2)
        return f'const _{varname} = await (db as any).query({query_var});\n  const {varname} = (_{varname} as any).rows ?? _{varname};'
    
    pattern_e = r'const \[(\w+)\] = await db\.execute\((\w+)\);'
    new_content = re.sub(pattern_e, fix_destructured_string_execute_no_params, content)
    if new_content != content:
        n = len(re.findall(pattern_e, content))
        changes += n
        print(f"  FixE (const [x] = await db.execute(var)): {n} occurrences")
        content = new_content
    
    # Fix F: const molecules = rows as any[]; where rows is from execute
    # Pattern: const molecules = rows as any[];
    # This is usually fine if rows is already any[], skip
    
    # Fix G: (result[0] as any[])[0] → ((result as any).rows ?? result)[0]
    pattern_g = r'\(result\[0\] as any\[\]\)\[0\]'
    replacement_g = '((result as any).rows ?? result)[0]'
    new_content = re.sub(pattern_g, replacement_g, content)
    if new_content != content:
        n = len(re.findall(pattern_g, content))
        changes += n
        print(f"  FixG ((result[0] as any[])[0]): {n} occurrences")
        content = new_content
    
    # Fix H: Generic (anyVar[0] as T[]) patterns
    pattern_h = r'\((\w+)\[0\] as \{ id: number; name: string; \}\[\]\)'
    def fix_typed_cast(m):
        varname = m.group(1)
        return f'(({varname} as any).rows ?? {varname}) as {{ id: number; name: string; }}[]'
    new_content = re.sub(pattern_h, fix_typed_cast, content)
    if new_content != content:
        n = len(re.findall(pattern_h, content))
        changes += n
        print(f"  FixH (typed cast): {n} occurrences")
        content = new_content
    
    # Fix I: TS2802 - using iterator (for...of on result)
    # Pattern: for (const row of result) → for (const row of ((result as any).rows ?? result))
    pattern_i = r'for \(const (\w+) of result\)'
    replacement_i = r'for (const \1 of ((result as any).rows ?? result))'
    new_content = re.sub(pattern_i, replacement_i, content)
    if new_content != content:
        n = len(re.findall(pattern_i, content))
        changes += n
        print(f"  FixI (for...of result): {n} occurrences")
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
