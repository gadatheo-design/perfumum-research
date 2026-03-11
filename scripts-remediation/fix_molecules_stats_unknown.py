#!/usr/bin/env python3
"""
Remplace tous les patterns (rows as unknown[])[0] par (rows as any[])[0] dans molecules.ts
et tous les patterns (rows as unknown[]).map par (rows as any[]).map
"""
import re

path = '/home/ubuntu/perfumum-research/server/db/molecules.ts'

with open(path, 'r') as f:
    content = f.read()

# Pattern 1: const stats = (rows as unknown[])[0];
old1 = r'const stats = \(rows as unknown\[\]\)\[0\];'
new1 = '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  const stats = (rows as any[])[0] as any;'

count1 = len(re.findall(old1, content))
content = re.sub(old1, new1, content)

# Pattern 2: const row = (rows as unknown[])[0];
old2 = r'const row = \(rows as unknown\[\]\)\[0\];'
new2 = '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  const row = (rows as any[])[0] as any;'

count2 = len(re.findall(old2, content))
content = re.sub(old2, new2, content)

# Pattern 3: (rows as unknown[])[0] dans d'autres contextes
old3 = r'\(rows as unknown\[\]\)\[0\]'
new3 = '(rows as any[])[0] as any'

count3 = len(re.findall(old3, content))
content = re.sub(old3, new3, content)

print(f"Remplacements stats: {count1}, row: {count2}, autres: {count3}")

with open(path, 'w') as f:
    f.write(content)

print("Done.")
