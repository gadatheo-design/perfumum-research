#!/usr/bin/env python3
"""
Script de récupération des données Notion via MCP pour PERFUMUM.
Lit les résultats depuis les fichiers sauvegardés par manus-mcp-cli.
"""
import subprocess, json, time, os, glob, re
from pathlib import Path

RESULTS_DIR = Path("/home/ubuntu/.mcp/tool-results")

def call_notion(tool, params):
    """Appelle un outil Notion MCP et retourne le résultat JSON."""
    result = subprocess.run(
        ['manus-mcp-cli', 'tool', 'call', tool, '-s', 'notion',
         '-i', json.dumps(params)],
        capture_output=True, text=True, timeout=45
    )
    # Trouver le fichier de résultat le plus récent
    files = sorted(RESULTS_DIR.glob(f"*_notion_{tool.replace('-','_')}*"), 
                   key=lambda f: f.stat().st_mtime, reverse=True)
    if files:
        content = files[0].read_text()
        try:
            return json.loads(content)
        except:
            pass
    # Fallback: parser stdout
    stdout = result.stdout
    if 'Tool execution result:\n' in stdout:
        json_str = stdout.split('Tool execution result:\n')[1].strip()
        try:
            return json.loads(json_str)
        except:
            pass
    return None

def search_notion(query):
    """Recherche dans Notion et retourne les résultats."""
    data = call_notion('notion-search', {"query": query})
    if data and 'results' in data:
        return data['results']
    return []

def fetch_page(page_id):
    """Récupère une page Notion."""
    return call_notion('notion-fetch', {"id": page_id})

# ============================================================
# 1. Récupérer les recettes depuis la base ABSORBE — Recettes
# ============================================================
print("\n" + "="*60)
print("RÉCUPÉRATION DES RECETTES NOTION")
print("="*60)

recettes_results = []
# Chercher par catégorie
for query in ["recette tabac ABSORBE", "recette résine ABSORBE", "recette encens ABSORBE", 
              "recette parfum ABSORBE", "recette cône ABSORBE", "formule ABSORBE"]:
    results = search_notion(query)
    for r in results:
        if r.get('type') == 'page' and r.get('id') not in [x.get('id') for x in recettes_results]:
            # Filtrer pour ne garder que les pages qui semblent être des recettes
            title = r.get('title', '')
            highlight = r.get('highlight', '')
            if any(kw in highlight.lower() for kw in ['recette', 'formule', 'composition', '%', 'ml', 'goutte']):
                recettes_results.append(r)
    time.sleep(0.3)

print(f"Recettes potentielles trouvées: {len(recettes_results)}")
for r in recettes_results[:10]:
    print(f"  {r.get('title','?')[:60]}")

# ============================================================
# 2. Récupérer les plantes depuis RES-04 Base Plantes
# ============================================================
print("\n" + "="*60)
print("RÉCUPÉRATION DES PLANTES NOTION")
print("="*60)

# La page RES-04 contient une base de plantes aromatiques
plantes_page = fetch_page("b9ed79b5-1d7c-4a0e-b8ac-09d6faa9e6de")
if plantes_page:
    text = plantes_page.get('text', '')
    print(f"Page RES-04 récupérée: {len(text)} caractères")
    # Sauvegarder pour analyse
    with open('/tmp/res04_plantes.txt', 'w') as f:
        f.write(text)
    print("Sauvegardé dans /tmp/res04_plantes.txt")
    print(f"Aperçu: {text[:500]}")

# ============================================================
# 3. Récupérer les terroirs de tabac
# ============================================================
print("\n" + "="*60)
print("RÉCUPÉRATION DES TERROIRS NOTION")
print("="*60)

# Chercher la page Terroirs de Tabac
terroirs_results = search_notion("PERFUMUM Terroirs de Tabac")
for r in terroirs_results[:5]:
    print(f"  [{r.get('type')}] {r.get('title','?')[:60]} — {r.get('id','')[:8]}")

# Récupérer la page principale des terroirs
if terroirs_results:
    terroirs_page = fetch_page(terroirs_results[0].get('id'))
    if terroirs_page:
        text = terroirs_page.get('text', '')
        print(f"Page Terroirs récupérée: {len(text)} caractères")
        with open('/tmp/terroirs_tabac.txt', 'w') as f:
            f.write(text)
        print("Sauvegardé dans /tmp/terroirs_tabac.txt")

# ============================================================
# 4. Récupérer la bibliographie complète
# ============================================================
print("\n" + "="*60)
print("RÉCUPÉRATION DE LA BIBLIOGRAPHIE NOTION")
print("="*60)

biblio_results = search_notion("Bibliographie PERFUMUM")
for r in biblio_results[:5]:
    print(f"  [{r.get('type')}] {r.get('title','?')[:60]} — {r.get('id','')[:8]}")

# ============================================================
# 5. Récupérer les pages de recettes spécifiques
# ============================================================
print("\n" + "="*60)
print("RÉCUPÉRATION PAGES RECETTES SPÉCIFIQUES")
print("="*60)

# Pages de recettes identifiées dans les recherches précédentes
recette_pages = [
    ("Recettes & Formules", "2b0dbb3d-5e6c-805c-a939-c0b6a7a3a7ba"),
    ("PF-15 Recettes Résine/Hash Pétrichor", "2fddbb3d-5e6c-8090-a7c2-c926bf8dcabb"),
    ("Haute Parfumerie Fumée", "2fcdbb3d-5e6c-8095-896c-da5d38c9788e"),
]

for name, page_id in recette_pages:
    page = fetch_page(page_id)
    if page:
        text = page.get('text', '')
        print(f"\n{name}: {len(text)} caractères")
        # Sauvegarder
        safe_name = name.replace('/', '_').replace(' ', '_')[:30]
        with open(f'/tmp/recette_{safe_name}.txt', 'w') as f:
            f.write(text)
        print(f"  Aperçu: {text[:200]}")
    time.sleep(0.5)

print("\n✅ Récupération terminée")
print(f"Fichiers sauvegardés dans /tmp/")
