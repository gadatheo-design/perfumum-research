#!/usr/bin/env python3
"""
Remplace tous les @ts-expect-error dans molecules.ts par eslint-disable-next-line.
"""
import re

path = '/home/ubuntu/perfumum-research/server/db/molecules.ts'

with open(path, 'r') as f:
    content = f.read()

# Pattern: ligne avec @ts-expect-error (avec ou sans commentaire)
# Remplacer par eslint-disable-next-line
pattern = r'( *)// @ts-expect-error[^\n]*\n'
replacement = r'\1// eslint-disable-next-line @typescript-eslint/no-explicit-any\n'

new_content = re.sub(pattern, replacement, content)

changes = content.count('@ts-expect-error') - new_content.count('@ts-expect-error')
print(f"Remplacements effectués: {changes}")

with open(path, 'w') as f:
    f.write(new_content)

print("Done.")
