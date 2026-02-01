#!/usr/bin/env python3
"""
Script pour supprimer les doublons dans la base de données Flavornet.
Garde la première occurrence de chaque numéro CAS.
"""
import re

def dedupe_flavornet():
    with open('/home/ubuntu/perfumum-research/server/flavornet.ts', 'r') as f:
        content = f.read()
    
    # Trouver le début et la fin de FLAVORNET_DATABASE
    db_start = content.find('const FLAVORNET_DATABASE: Record<string, FlavornetData> = {')
    db_end = content.find('};', db_start) + 2
    
    # Extraire la partie avant, la base de données, et la partie après
    before = content[:db_start]
    db_content = content[db_start:db_end]
    after = content[db_end:]
    
    # Parser les entrées de la base de données
    # Pattern pour les entrées sur une seule ligne
    single_line_pattern = r"'([0-9-]+)':\s*\{[^}]+\}"
    # Pattern pour les entrées sur plusieurs lignes
    multi_line_pattern = r"'([0-9-]+)':\s*\{\s*casNumber:[^}]+\}"
    
    # Extraire toutes les entrées
    entries = {}
    lines = db_content.split('\n')
    current_entry = []
    current_cas = None
    in_entry = False
    
    result_lines = []
    seen_cas = set()
    
    for line in lines:
        # Vérifier si c'est le début d'une entrée
        cas_match = re.search(r"'([0-9-]+)':\s*\{", line)
        
        if cas_match:
            cas = cas_match.group(1)
            if cas in seen_cas:
                # Skip cette entrée (doublon)
                # Si l'entrée est sur plusieurs lignes, on doit ignorer jusqu'à la fin
                if not line.rstrip().endswith('},'):
                    in_entry = True
                    current_cas = cas
                continue
            else:
                seen_cas.add(cas)
                result_lines.append(line)
                if not line.rstrip().endswith('},') and not line.rstrip().endswith('}'):
                    in_entry = True
                    current_cas = cas
        elif in_entry:
            # On est dans une entrée multi-lignes
            result_lines.append(line)
            if '},' in line or ('}' in line and 'source' in line):
                in_entry = False
                current_cas = None
        else:
            result_lines.append(line)
    
    new_db_content = '\n'.join(result_lines)
    
    # Reconstruire le fichier
    new_content = before + new_db_content + after
    
    with open('/home/ubuntu/perfumum-research/server/flavornet.ts', 'w') as f:
        f.write(new_content)
    
    print(f"Doublons supprimés. {len(seen_cas)} entrées uniques conservées.")

if __name__ == '__main__':
    dedupe_flavornet()
