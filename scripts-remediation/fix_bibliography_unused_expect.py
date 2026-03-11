#!/usr/bin/env python3
"""
Retire les @ts-expect-error inutilisés dans bibliography.ts.
Les lignes @ts-expect-error inutilisés sont aux lignes 279, 283, 296, 301 (SQL undefined),
315 (l unknown), 415, 529, 807, 971, 1030.

Stratégie : pour les @ts-expect-error inutilisés, on retire la ligne du commentaire.
Pour SQL<unknown> | undefined → SQL<unknown>, on ajoute un cast.
Pour 'l' is of type 'unknown', on ajoute un cast explicite.
"""

import re

filepath = "/home/ubuntu/perfumum-research/server/db/bibliography.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Lignes avec @ts-expect-error inutilisés (1-indexed)
unused_expect_lines = {279, 283, 296, 415, 529, 807, 971, 1030}

# Construire la nouvelle liste de lignes
new_lines = []
i = 0
while i < len(lines):
    lineno = i + 1  # 1-indexed
    line = lines[i]
    
    if lineno in unused_expect_lines:
        stripped = line.strip()
        if '@ts-expect-error' in stripped:
            # Retirer cette ligne
            i += 1
            continue
    
    new_lines.append(line)
    i += 1

# Corriger SQL<unknown> | undefined → SQL<unknown> (ligne 301 originale)
# Chercher le pattern et ajouter un cast
result = []
for line in new_lines:
    # Corriger les maps avec 'l' unknown (ligne 315 originale)
    # Pattern: .map(l => l.something) → .map((l: Record<string, unknown>) => ...)
    if re.search(r'\.map\(l\s*=>', line) and 'Record<string' not in line:
        line = re.sub(r'\.map\(l\s*=>', '.map((l: Record<string, unknown>) =>', line)
    
    # Corriger SQL | undefined → ajouter ! ou cast
    if 'SQL<unknown> | undefined' in line and 'as SQL<unknown>' not in line:
        # Chercher le pattern et ajouter un cast
        line = re.sub(
            r'(\w+)\s+as\s+SQL<unknown>\s*\|\s*undefined',
            r'\1 as SQL<unknown>',
            line
        )
    
    result.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(result)

print(f"Fixed {filepath}")
print(f"Removed {len(lines) - len(new_lines)} @ts-expect-error lines")
