#!/usr/bin/env python3
"""
Remplace tous les (rows as unknown[]).map(r => par (rows as any[]).map((r: any) => dans molecules.ts
"""
import re

path = '/home/ubuntu/perfumum-research/server/db/molecules.ts'

with open(path, 'r') as f:
    content = f.read()

# Pattern: (rows as unknown[]).map(r =>
old_pattern = r'\(rows as unknown\[\]\)\.map\(r =>'
new_pattern = '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  return (rows as any[]).map((r: any) =>'

# Compter les occurrences
count = len(re.findall(old_pattern, content))
print(f"Occurrences trouvées: {count}")

# Remplacer
# Attention: le return est avant le (rows as unknown[])
# On remplace juste la partie map
new_content = re.sub(
    r'  return \(rows as unknown\[\]\)\.map\(r =>',
    '  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  return (rows as any[]).map((r: any) =>',
    content
)

changes = count
print(f"Remplacements effectués: {changes}")

with open(path, 'w') as f:
    f.write(new_content)

print("Done.")
