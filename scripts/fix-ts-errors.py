#!/usr/bin/env python3
"""
Script de correction automatique des erreurs TypeScript dans db.ts
Corrige les patterns:
1. TS2352: result[0] as any[] → (result as any).rows ?? result
2. TS2352: const [x] = await db.execute(...) → const _r = await db.execute(...); const x = ((_r as any).rows ?? _r)[0]
3. TS2554: db.execute(query, params) → db.execute(sql`...`) (manual)
4. TS7006: implicit any params
"""
import re
import sys

def fix_db_ts(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    changes = 0
    
    # Fix 1: result[0] as any[] → ((result as any).rows ?? result) as any[]
    # Pattern: return result[0] as any[];
    pattern1 = r'return result\[0\] as any\[\];'
    replacement1 = 'return ((result as any).rows ?? result) as any[];'
    new_content = re.sub(pattern1, replacement1, content)
    if new_content != content:
        n = len(re.findall(pattern1, content))
        changes += n
        print(f"  Fix1 (result[0] as any[]): {n} occurrences")
        content = new_content
    
    # Fix 2: const rows = result[0] as any[];
    pattern2 = r'const rows = result\[0\] as any\[\];'
    replacement2 = 'const rows = ((result as any).rows ?? result) as any[];'
    new_content = re.sub(pattern2, replacement2, content)
    if new_content != content:
        n = len(re.findall(pattern2, content))
        changes += n
        print(f"  Fix2 (const rows = result[0]): {n} occurrences")
        content = new_content
    
    # Fix 3: const [total] = await db.execute(sql`...`);
    # Remplacer par: const _total = await db.execute(sql`...`); const [total] = (((_total as any).rows ?? _total) as any[]);
    # Pattern: const [varname] = await db.execute(sql`...`);
    def fix_destructured_execute(m):
        varname = m.group(1)
        query = m.group(2)
        return f'const _{varname} = await db.execute({query});\n  const [{varname}] = ((_{varname} as any).rows ?? _{varname}) as any[];'
    
    pattern3 = r'const \[(\w+)\] = await db\.execute\((sql`[^`]*`)\);'
    new_content = re.sub(pattern3, fix_destructured_execute, content, flags=re.DOTALL)
    if new_content != content:
        n = len(re.findall(r'const \[(\w+)\] = await db\.execute\(sql`', content))
        changes += n
        print(f"  Fix3 (const [x] = await db.execute): {n} occurrences")
        content = new_content
    
    # Fix 4: Multi-line version of Fix 3
    # const [total] = await db.execute(sql`
    #   SELECT ...
    # `);
    pattern4 = r'const \[(\w+)\] = await db\.execute\((sql`[\s\S]*?`)\);'
    new_content = re.sub(pattern4, fix_destructured_execute, content)
    if new_content != content:
        n = len(re.findall(r'const \[(\w+)\] = await db\.execute\(sql`', content))
        changes += n
        print(f"  Fix4 (multi-line const [x] = await db.execute): {n} occurrences")
        content = new_content
    
    # Fix 5: (result as any[]) → ((result as any).rows ?? result) as any[]
    pattern5 = r'\(result as any\[\]\)'
    replacement5 = '((result as any).rows ?? result) as any[]'
    new_content = re.sub(pattern5, replacement5, content)
    if new_content != content:
        n = len(re.findall(pattern5, content))
        changes += n
        print(f"  Fix5 ((result as any[])): {n} occurrences")
        content = new_content
    
    # Fix 6: db.execute(string, params) → db.execute(sql`string`)
    # This is complex, skip for now - handle manually
    
    if changes > 0:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"\n✅ {changes} corrections appliquées dans {filepath}")
    else:
        print(f"⚠️  Aucune correction automatique possible dans {filepath}")
    
    return changes

if __name__ == '__main__':
    filepath = sys.argv[1] if len(sys.argv) > 1 else '/home/ubuntu/perfumum-research/server/db.ts'
    fix_db_ts(filepath)
