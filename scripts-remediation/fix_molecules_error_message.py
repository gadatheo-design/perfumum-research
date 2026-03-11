#!/usr/bin/env python3
"""
Remplace tous les patterns error.message dans les catch(error: unknown) par (error as Error).message dans molecules.ts
"""
import re

path = '/home/ubuntu/perfumum-research/server/db/molecules.ts'

with open(path, 'r') as f:
    content = f.read()

# Pattern: error.message dans les catch blocks
# Remplacer par (error as Error).message
old_pattern = r'\berror\.message\b'
new_pattern = '(error as Error).message'

count = len(re.findall(old_pattern, content))
new_content = re.sub(old_pattern, new_pattern, content)

print(f"Remplacements effectués: {count}")

with open(path, 'w') as f:
    f.write(new_content)

print("Done.")
