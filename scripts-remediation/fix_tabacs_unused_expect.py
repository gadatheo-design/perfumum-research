#!/usr/bin/env python3
"""
Corrige les @ts-expect-error inutilisés dans tabacs.ts
en remplaçant les patterns 'as any[]' par 'as unknown[]'
"""
import re
from pathlib import Path

path = Path(__file__).parent.parent / "server" / "db" / "tabacs.ts"
content = path.read_text(encoding="utf-8")
changes = 0

# Pattern: @ts-expect-error suivi de return (result[0] as unknown) as any[];
# → retirer le @ts-expect-error et remplacer any[] par unknown[]
lines = content.split('\n')
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    next_line = lines[i+1] if i+1 < len(lines) else ''
    
    # Détecter @ts-expect-error suivi d'une ligne avec as any[]
    if '@ts-expect-error' in line and 'eslint' not in line:
        if 'as any[]' in next_line or 'as any[' in next_line:
            # Retirer le @ts-expect-error et corriger la ligne suivante
            new_lines.append(next_line.replace('as any[]', 'as unknown[]').replace('as any[', 'as unknown['))
            changes += 2
            i += 2
            continue
    
    new_lines.append(line)
    i += 1

content = '\n'.join(new_lines)

# Remplacer les as any[] restants sans @ts-expect-error précédent
new_content, n = re.subn(r'\) as any\[\]', ') as unknown[]', content)
content = new_content
changes += n

path.write_text(content, encoding="utf-8")
print(f"tabacs.ts: {changes} changes")
