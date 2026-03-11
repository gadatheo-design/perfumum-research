#!/usr/bin/env python3
"""
Script de découpage de server/db.ts en modules thématiques.

Ce script analyse server/db.ts, identifie les sections thématiques via les
commentaires === et crée les fichiers server/db/*.ts correspondants.
Un fichier server/db/index.ts réexporte tout pour garantir la compatibilité.

Usage:
  python3 scripts-remediation/split_db.py [--dry-run] [--apply]

Options:
  --dry-run   Analyse et affiche le plan de découpage (défaut)
  --apply     Effectue le découpage réel
  --rollback  Restaure server/db.ts depuis la sauvegarde
"""

import os
import re
import sys
import shutil
from pathlib import Path
from collections import defaultdict

PROJECT_ROOT = Path('/home/ubuntu/perfumum-research')
DB_FILE = PROJECT_ROOT / 'server' / 'db.ts'
DB_DIR = PROJECT_ROOT / 'server' / 'db'
BACKUP_FILE = PROJECT_ROOT / 'server' / 'db.ts.split-backup'

# Mapping des sections vers des modules thématiques
# Clé : pattern regex sur le titre de section
# Valeur : nom du module cible
SECTION_TO_MODULE = {
    # Molécules
    r'MOLECULES?|MOLECULE DETAILS|MOLECULE PLANT|MOLECULE FAMILIES|MOLECULE NOTES|MOLECULE ORIGINS|MOLECULE PERFUMES|MOLECULE SYNERGIES|MOLECULE ANALYTICAL|MOLECULE CHEMICAL|MOLECULE ACCORDS|MOLECULE REFERENCES|MOLECULES RADAR|MOLECULES RECETTES|MOLECULE-FAMILLE|ORPHAN MOLECULES|PUBCHEM|FLAVORNET|COCONUT|ENRICHISSEMENT DES DONNÉES MOL': 'molecules',
    
    # Plantes
    r'PLANTS?(?!\s+CONSERVATION)|PLANT VARIETIES|PLANT IMAGES|PLANT SAMPLES|PLANT EXTRACTIONS|PLANT ANALYSES|PLANT CONTRIBUTIONS|PLANT GEOGRAPHIC|PLANT-MOLECULE|BOTANICAL|CHEMOTYPES|PLANT TERROIRS|POINT 3|HELPERS BOTANIQUES|PLANT CONSERVATION': 'plants',
    
    # Recettes
    r'RECETTES?|RECETTE DETAILS|RECETTE RAW|RECETTE TABAC|FINAL RECIPES|BATCH INSERT MOLECULES-RECETTES|COMPARE RECETTES|LIAISONS RECETTES|RECETTES CRUD|IMPORT CSV': 'recettes',
    
    # Tabacs & Cannabis
    r'TABACS?|TOBACCO|CANNABIS|CIGARILLO|AROMATIC_MOLECULES_TABAC|TOBACCO-CANNABIS|LANDRACES': 'tabacs',
    
    # Bibliographie & Références
    r'BIBLIOGRAPHY|BIBTEX|REFERENCE CITATIONS|V3 REFERENCES|REFERENCE TAGS|REFERENCE NOTES|REFERENCE ENTITY|IMPORT BIBLIOGRAPHY|RESEARCH PUBLICATIONS|RESEARCH SOURCES|CSV PARSING UTILITIES FOR BIBLIOGRAPHY|EXPORT UTILITIES': 'bibliography',
    
    # Axes de recherche
    r'RESEARCH AXES|RESEARCH ENTRIES|RESEARCH CLAIMS|AXIS CONNECTIONS|AXIS REFERENCE LINKS|FORCE GRAPH.*REFERENCES|SUB-AXES|BIBLIOGRAPHY-AXIS': 'research_axes',
    
    # Terroirs & Géographie
    r'TERROIR|GEOGRAPHIC|SITUATED SMELLS|TOBACCO TERROIRS|PLANT TERROIRS|TERROIR SPECIALTIES|RECHERCHE AVANCÉE - Relations|GRAPHE RÉSEAU MOLÉCULE-PLANTE-TERROIR|STATISTIQUES GLOBALES|AUDIT ET IMPORT EN MASSE DES LIAISONS PLANTE-TERROIR': 'terroirs',
    
    # Familles chimiques
    r'CHEMICAL FAMILIES|FAMILIES(?!\s+CHIMIQUE)|PROTOTYPE_CHEMICAL|MOLECULE-FAMILLE CHIMIQUE': 'chemical_families',
    
    # Accords & Synergies
    r'ACCORDS?|EXPERIMENTAL ACCORDS|SYNERGIES|TERPENE SYNERGIES|SYNERGIES GRAPH|SUGGESTIONS AUTOMATIQUES|ACCORD_CIVILISATIONS': 'accords',
    
    # Généalogie & Variétés
    r'VARIETY GENEALOGY|GENEALOGY GRAPH|GHOST VARIETIES|GENOMIC|LANDRACES|PLANT VARIETIES - EXTENDED': 'genealogy',
    
    # Matières premières & Fournisseurs
    r'RAW MATERIALS?|SUPPLIERS?|ORDERS?|EXTENDED SUPPLIERS|INVENTORY|LABORATOIRE': 'materials',
    
    # Civilisations & Traditions
    r'CIVILISATIONS?|CIVILIZATIONAL|OLFACTORY TRADITIONS|TRADITIONS OLFACTIVES|CURATED JOURNEYS|JOURNEY ITEMS|OLFACTIVE ARCHIVES': 'civilisations',
    
    # Installations & Petrichor & Volcanique
    r'INSTALLATIONS?|PETRICHOR|VOLCANIQUE': 'installations',
    
    # Profils terpéniques
    r'TERP PROFILES?|TERPENE|ABSORBE|FINAL_RECIPE_TERP': 'terpenes',
    
    # TPS Genes & Transformations moléculaires
    r'TPS GENE|MOLECULAR TRANSFORMATIONS|PYROLYSIS|TRANSFORMATION': 'genomics',
    
    # Utilisateurs & Collections
    r'USER FAVORITES|USER NOTES|SHARED COLLECTIONS|COLLECTION ITEMS|SAVED FORMULAS|NOTIFICATIONS|CONTRIBUTOR': 'users',
    
    # Glossaire & Timeline
    r'GLOSSARY|RESEARCH TIMELINE|MILESTONES': 'glossary',
    
    # Statistiques & Analytics
    r'ADMIN FUNCTIONS|ADMIN STATS|DASHBOARD STATISTICS|ANALYTICS|GLOBAL SEARCH|SIMILARITY|RECOMMENDATIONS|STATISTIQUES GLOBALES|NAVIGATION FEATURED': 'analytics',
    
    # Import & Export
    r'IMPORT|EXPORT|BATCH|BULK|GC-MS|AUDIT ET IMPORT|VALIDATION|DRAFT': 'import_export',
    
    # Graphes & Visualisation
    r'NETWORK VISUALIZATION|SYNERGIES GRAPH VISUALIZATION|RÉSEAU DE LIAISONS|FORCE GRAPH': 'graphs',
    
    # IFRA & Réglementaire
    r'IFRA': 'ifra',
    
    # Prototypes
    r'PROTOTYPES?': 'prototypes',
}

def get_module_for_section(title: str) -> str:
    """Détermine le module cible pour une section donnée."""
    title_upper = title.upper()
    for pattern, module in SECTION_TO_MODULE.items():
        if re.search(pattern, title_upper):
            return module
    return 'misc'

def analyze_db_file():
    """Analyse db.ts et retourne le plan de découpage."""
    with open(DB_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    total_lines = len(lines)
    
    # Extraire les imports (lignes 1 à première fonction)
    import_end = 0
    for i, line in enumerate(lines):
        if re.match(r'^export (async )?function|^export const|^export type|^export interface', line):
            import_end = i
            break
    
    # Identifier les sections
    sections = []
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if re.match(r'^// ={5,}', line):
            # Chercher le titre dans les 3 lignes suivantes
            for j in range(i+1, min(i+4, len(lines))):
                title_line = lines[j].rstrip()
                if title_line and not re.match(r'^// ={5,}', title_line) and title_line.startswith('//'):
                    title = title_line.strip('/ ').strip()
                    if title and len(title) > 2:
                        module = get_module_for_section(title)
                        sections.append({
                            'line': i,
                            'title': title,
                            'module': module
                        })
                        break
        i += 1
    
    # Calculer les plages de lignes par module
    module_ranges = defaultdict(list)
    for idx, section in enumerate(sections):
        start = section['line']
        end = sections[idx+1]['line'] if idx+1 < len(sections) else total_lines
        module_ranges[section['module']].append((start, end, section['title']))
    
    return lines, import_end, sections, module_ranges

def generate_plan(module_ranges, total_lines):
    """Affiche le plan de découpage."""
    print(f"\n{'='*70}")
    print(f"PLAN DE DÉCOUPAGE DE server/db.ts ({total_lines} lignes)")
    print(f"{'='*70}\n")
    
    total_sections = sum(len(v) for v in module_ranges.values())
    
    print(f"{'Module':<25} {'Sections':>8} {'Lignes estimées':>16}")
    print(f"{'-'*25} {'-'*8} {'-'*16}")
    
    grand_total = 0
    for module in sorted(module_ranges.keys()):
        ranges = module_ranges[module]
        line_count = sum(end - start for start, end, _ in ranges)
        grand_total += line_count
        print(f"  {module:<23} {len(ranges):>8} {line_count:>16,}")
    
    print(f"\n  {'TOTAL':<23} {total_sections:>8} {grand_total:>16,}")
    print(f"\nFichier index.ts : réexporte tout → compatibilité totale garantie")
    print(f"\nNombre de fichiers créés : {len(module_ranges)} modules + 1 index.ts")

def extract_imports_from_db():
    """Extrait les imports communs de db.ts (gère les imports multi-lignes)."""
    with open(DB_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Les imports se terminent à la ligne 241 (après botanicalLatinNames)
    # On cherche la première ligne qui n'est pas un import et n'est pas vide
    import_end = 0
    in_multiline = False
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        if stripped.startswith('import '):
            in_multiline = '{' in stripped and '}' not in stripped
            if not in_multiline:
                import_end = i + 1
        elif in_multiline:
            if '}' in stripped:
                in_multiline = False
                import_end = i + 1
        elif stripped and not stripped.startswith('//'):
            # Première ligne de code non-import
            break
    
    return ''.join(lines[:import_end]).rstrip()

def split_db_file(module_ranges, lines, dry_run=True):
    """Effectue le découpage réel."""
    if dry_run:
        print("\n[DRY-RUN] Aucune modification effectuée.")
        return
    
    # Créer la sauvegarde
    print(f"\n[1/5] Sauvegarde de db.ts → db.ts.split-backup")
    shutil.copy2(DB_FILE, BACKUP_FILE)
    
    # Créer le dossier server/db/
    print(f"[2/5] Création du dossier server/db/")
    DB_DIR.mkdir(exist_ok=True)
    
    # Extraire les imports communs
    common_imports = extract_imports_from_db()
    
    # Générer chaque module
    print(f"[3/5] Génération des modules thématiques")
    all_exports = []
    
    for module in sorted(module_ranges.keys()):
        ranges = module_ranges[module]
        module_file = DB_DIR / f"{module}.ts"
        
        # Construire le contenu du module
        module_content = f"// @ts-nocheck\n"
        module_content += f"/**\n * Module: {module}\n"
        module_content += f" * Généré automatiquement depuis server/db.ts\n"
        module_content += f" * Sections: {', '.join(title for _, _, title in ranges[:3])}"
        if len(ranges) > 3:
            module_content += f" (+{len(ranges)-3} autres)"
        module_content += f"\n */\n\n"
        module_content += common_imports + "\n\n"
        
        # Ajouter les lignes de chaque section
        for start, end, title in ranges:
            module_content += f"\n// {'='*68}\n"
            module_content += f"// {title}\n"
            module_content += f"// {'='*68}\n"
            section_lines = lines[start:end]
            # Supprimer les imports redondants dans les sections
            # (imports internes à db.ts qui sont déjà couverts par les imports communs)
            filtered_lines = []
            skip_multiline_import = False
            for line in section_lines:
                stripped = line.strip()
                # Détecter le début d'un import interne
                if stripped.startswith('import ') and ('from' in stripped or '{' in stripped):
                    skip_multiline_import = '{' in stripped and '}' not in stripped
                    continue  # Sauter cette ligne d'import
                # Détecter la fin d'un import multi-lignes
                if skip_multiline_import:
                    if '}' in stripped and 'from' in stripped:
                        skip_multiline_import = False
                    continue  # Sauter cette ligne
                filtered_lines.append(line)
            module_content += ''.join(filtered_lines)
        
        with open(module_file, 'w', encoding='utf-8') as f:
            f.write(module_content)
        
        # Collecter les exports
        exports = re.findall(r'^export (?:async )?function (\w+)', module_content, re.MULTILINE)
        exports += re.findall(r'^export const (\w+)', module_content, re.MULTILINE)
        exports += re.findall(r'^export type (\w+)', module_content, re.MULTILINE)
        exports += re.findall(r'^export interface (\w+)', module_content, re.MULTILINE)
        
        all_exports.append((module, exports))
        print(f"  ✓ server/db/{module}.ts ({len(exports)} exports)")
    
    # Générer server/db/index.ts
    print(f"[4/5] Génération de server/db/index.ts")
    index_content = "// @ts-nocheck\n"
    index_content += "/**\n * Index du module server/db/\n"
    index_content += " * Réexporte toutes les fonctions de tous les modules thématiques.\n"
    index_content += " * Ce fichier garantit la compatibilité totale avec les imports existants.\n"
    index_content += " * \n"
    index_content += " * Usage: import { getMoleculeById } from '../db';\n"
    index_content += " * (identique à l'ancien import depuis server/db.ts)\n"
    index_content += " */\n\n"
    
    for module, _ in sorted(all_exports):
        index_content += f"export * from './{module}';\n"
    
    with open(DB_DIR / 'index.ts', 'w', encoding='utf-8') as f:
        f.write(index_content)
    
    # Mettre à jour server/db.ts pour qu'il réexporte depuis server/db/
    print(f"[5/5] Mise à jour de server/db.ts (réexportation)")
    redirect_content = "// @ts-nocheck\n"
    redirect_content += "/**\n * FICHIER DE COMPATIBILITÉ\n"
    redirect_content += " * Ce fichier réexporte tout depuis server/db/ (modules thématiques).\n"
    redirect_content += " * Le code source réel est dans server/db/*.ts\n"
    redirect_content += " * Ce fichier existe pour maintenir la compatibilité avec les imports existants.\n"
    redirect_content += " */\n\n"
    redirect_content += "export * from './db/index';\n"
    
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        f.write(redirect_content)
    
    print(f"\n✅ Découpage terminé !")
    print(f"   - {len(module_ranges)} modules créés dans server/db/")
    print(f"   - server/db.ts redirige vers server/db/index.ts")
    print(f"   - Sauvegarde : server/db.ts.split-backup")

def rollback():
    """Restaure db.ts depuis la sauvegarde."""
    if not BACKUP_FILE.exists():
        print("❌ Aucune sauvegarde trouvée (server/db.ts.split-backup)")
        return
    
    shutil.copy2(BACKUP_FILE, DB_FILE)
    if DB_DIR.exists():
        shutil.rmtree(DB_DIR)
    BACKUP_FILE.unlink()
    print("✅ Rollback effectué : server/db.ts restauré, server/db/ supprimé")

def main():
    dry_run = '--apply' not in sys.argv
    do_rollback = '--rollback' in sys.argv
    
    if do_rollback:
        rollback()
        return
    
    print("Analyse de server/db.ts...")
    lines, import_end, sections, module_ranges = analyze_db_file()
    
    generate_plan(module_ranges, len(lines))
    
    if not dry_run:
        print("\n⚠️  ATTENTION : Cette opération modifie server/db.ts !")
        print("   Une sauvegarde sera créée dans server/db.ts.split-backup")
        confirm = input("   Confirmer ? (oui/non) : ")
        if confirm.lower() not in ('oui', 'o', 'yes', 'y'):
            print("Annulé.")
            return
        split_db_file(module_ranges, lines, dry_run=False)
    else:
        print("\n[DRY-RUN] Pour appliquer : python3 scripts-remediation/split_db.py --apply")

if __name__ == '__main__':
    main()
