#!/usr/bin/env python3
"""
Script d'import des nouvelles références bibliographiques via SQL direct.
Lit le fichier JSON et génère des INSERT statements individuels.
"""

import json
import os

# Lire le fichier JSON des références
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, '../data/new_references_to_import.json')

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"📚 Préparation de {data['totalCount']} références pour import SQL")

# Mapping des domaines vers les valeurs enum valides
domain_mapping = {
    'perfumery': 'chimie_olfactive',
    'genomics': 'botanique',
    'metabolomics': 'chimie_olfactive',
    'biochemistry': 'chimie_olfactive',
    'chemistry': 'chimie_olfactive',
    'archaeochemistry': 'histoire_parfumerie',
    'other': 'autre',
}

# Fonction pour échapper les valeurs SQL
def escape_sql(value):
    if value is None:
        return 'NULL'
    if isinstance(value, int):
        return str(value)
    if isinstance(value, str):
        # Échapper les apostrophes
        escaped = value.replace("'", "''")
        return f"'{escaped}'"
    return 'NULL'

# Générer les INSERT statements individuels
sql_statements = []

for ref in data['references']:
    # Mapper le domaine de recherche
    original_domain = ref.get('researchDomain', 'autre')
    mapped_domain = domain_mapping.get(original_domain, 'autre')
    
    sql = f"""INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, doi, url, tags, notes, research_domain, read_status, relevance_score)
VALUES ({escape_sql(ref.get('entryKey'))}, {escape_sql(ref.get('entryType'))}, {escape_sql(ref.get('title'))}, {escape_sql(ref.get('authors'))}, {ref.get('year') or 'NULL'}, {escape_sql(ref.get('journal'))}, {escape_sql(ref.get('doi'))}, {escape_sql(ref.get('url'))}, {escape_sql(ref.get('tags'))}, {escape_sql(ref.get('notes'))}, {escape_sql(mapped_domain)}, {escape_sql(ref.get('readStatus'))}, {ref.get('relevanceScore') or 70})
ON DUPLICATE KEY UPDATE title = VALUES(title), notes = VALUES(notes), updated_at = NOW();"""
    sql_statements.append(sql)

# Écrire les statements dans un fichier
output_path = os.path.join(script_dir, '../data/import_references_individual.sql')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write("-- Import des références bibliographiques PERFUMUM\n")
    f.write(f"-- Total: {len(sql_statements)} références\n\n")
    for stmt in sql_statements:
        f.write(stmt + "\n\n")

print(f"✅ Fichier SQL généré: {output_path}")
print(f"   {len(sql_statements)} statements INSERT")

# Afficher les 3 premiers pour vérification
print("\n📋 Aperçu des 3 premiers statements:")
for i, stmt in enumerate(sql_statements[:3]):
    print(f"\n--- Statement {i+1} ---")
    print(stmt[:400] + "..." if len(stmt) > 400 else stmt)
