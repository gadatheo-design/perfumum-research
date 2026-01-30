#!/usr/bin/env python3
"""
Script d'import de la tabacothèque PERFUMUM v3.0
Import progressif et sécurisé des landraces, molécules, additifs, terroirs et accords
"""

import json
import os
import mysql.connector
from datetime import datetime

# Configuration de la base de données
DATABASE_URL = os.environ.get('DATABASE_URL', '')

def parse_database_url(url):
    """Parse DATABASE_URL en paramètres de connexion"""
    # Format: mysql://user:pass@host:port/database
    url = url.replace('mysql://', '')
    if '@' in url:
        creds, rest = url.split('@')
        user, password = creds.split(':')
        host_port, database = rest.split('/')
        if ':' in host_port:
            host, port = host_port.split(':')
        else:
            host = host_port
            port = 3306
        # Remove query params
        if '?' in database:
            database = database.split('?')[0]
        return {
            'user': user,
            'password': password,
            'host': host,
            'port': int(port),
            'database': database,
            'ssl_disabled': False
        }
    return None

def connect_db():
    """Établir la connexion à la base de données"""
    config = parse_database_url(DATABASE_URL)
    if config:
        return mysql.connector.connect(**config)
    raise Exception("DATABASE_URL non configurée")

def import_landraces(conn, landraces):
    """Importer les landraces dans la table tobacco_varieties"""
    cursor = conn.cursor()
    imported = 0
    errors = []
    
    for lr in landraces:
        try:
            # Vérifier si la landrace existe déjà
            cursor.execute("SELECT id FROM tobacco_varieties WHERE name = %s", (lr['nom'],))
            existing = cursor.fetchone()
            
            if existing:
                print(f"  ⏭️  Landrace '{lr['nom']}' existe déjà (ID: {existing[0]})")
                continue
            
            # Préparer les données
            terroir_json = json.dumps(lr.get('terroir', {}), ensure_ascii=False)
            profil_json = json.dumps(lr.get('profil_aromatique', {}), ensure_ascii=False)
            composition_json = json.dumps(lr.get('composition_chimique', {}), ensure_ascii=False)
            profil_mol_json = json.dumps(lr.get('profil_moleculaire_unique', {}), ensure_ascii=False)
            usage_json = json.dumps(lr.get('usage_parfumerie', {}), ensure_ascii=False)
            
            # Insérer la landrace
            cursor.execute("""
                INSERT INTO tobacco_varieties 
                (name, origin, type, description, nicotine_content, sugar_content, 
                 aromatic_profile, curing_method, rarity_score, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
            """, (
                lr['nom'],
                lr.get('region_origine', ''),
                lr.get('profil_aromatique', {}).get('famille', 'Oriental'),
                lr.get('profil_aromatique', {}).get('caractere', ''),
                lr.get('composition_chimique', {}).get('nicotine', ''),
                lr.get('composition_chimique', {}).get('sucres_totaux', ''),
                profil_json,
                'Sun-cured',  # Default
                lr.get('rarete', 5)
            ))
            
            imported += 1
            print(f"  ✅ Landrace '{lr['nom']}' importée")
            
        except Exception as e:
            errors.append(f"{lr['nom']}: {str(e)}")
            print(f"  ❌ Erreur pour '{lr['nom']}': {str(e)}")
    
    conn.commit()
    return imported, errors

def import_molecules(conn, molecules):
    """Importer les molécules dans la table molecules"""
    cursor = conn.cursor()
    imported = 0
    errors = []
    
    for mol in molecules:
        try:
            # Vérifier si la molécule existe déjà
            cursor.execute("SELECT id FROM molecules WHERE name = %s", (mol['nom'],))
            existing = cursor.fetchone()
            
            if existing:
                print(f"  ⏭️  Molécule '{mol['nom']}' existe déjà (ID: {existing[0]})")
                continue
            
            # Préparer les notes olfactives
            notes = mol.get('notes', [])
            notes_str = ', '.join(notes) if notes else ''
            
            # Insérer la molécule
            cursor.execute("""
                INSERT INTO molecules 
                (name, category, olfactory_profile, perfumery_use, created_at, updated_at)
                VALUES (%s, %s, %s, %s, NOW(), NOW())
            """, (
                mol['nom'],
                mol.get('categorie', 'Autre'),
                notes_str,
                mol.get('potentiel_perfumerie', '')
            ))
            
            imported += 1
            print(f"  ✅ Molécule '{mol['nom']}' importée")
            
        except Exception as e:
            errors.append(f"{mol['nom']}: {str(e)}")
            print(f"  ❌ Erreur pour '{mol['nom']}': {str(e)}")
    
    conn.commit()
    return imported, errors

def import_additifs(conn, additifs):
    """Importer les additifs dans la table tobacco_additives"""
    cursor = conn.cursor()
    imported = 0
    errors = []
    
    for add in additifs:
        try:
            # Vérifier si l'additif existe déjà
            cursor.execute("SELECT id FROM tobacco_additives WHERE name = %s", (add['nom'],))
            existing = cursor.fetchone()
            
            if existing:
                print(f"  ⏭️  Additif '{add['nom']}' existe déjà (ID: {existing[0]})")
                continue
            
            # Préparer les données
            notes = add.get('notes', [])
            notes_str = ', '.join(notes) if notes else ''
            
            # Insérer l'additif
            cursor.execute("""
                INSERT INTO tobacco_additives 
                (name, category, function_desc, aromatic_profile, usage_notes, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
            """, (
                add['nom'],
                add.get('categorie', 'Traditionnel'),
                add.get('fonction', ''),
                notes_str,
                add.get('usage', '')
            ))
            
            imported += 1
            print(f"  ✅ Additif '{add['nom']}' importé")
            
        except Exception as e:
            errors.append(f"{add['nom']}: {str(e)}")
            print(f"  ❌ Erreur pour '{add['nom']}': {str(e)}")
    
    conn.commit()
    return imported, errors

def main():
    """Fonction principale d'import"""
    print("=" * 60)
    print("PERFUMUM - Import Tabacothèque v3.0")
    print("=" * 60)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Charger le fichier JSON
    json_path = '/home/ubuntu/upload/perfumum_tabacotheque_complete_v3.json'
    print(f"📂 Chargement de {json_path}...")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    metadata = data.get('metadata', {})
    print(f"   Version: {metadata.get('version', 'N/A')}")
    print(f"   Statistiques: {metadata.get('statistiques', {})}")
    print()
    
    # Connexion à la base de données
    print("🔌 Connexion à la base de données...")
    conn = connect_db()
    print("   ✅ Connecté")
    print()
    
    # Import des landraces
    landraces = data.get('landraces', [])
    print(f"🌿 Import des landraces ({len(landraces)} entrées)...")
    lr_imported, lr_errors = import_landraces(conn, landraces)
    print(f"   Résultat: {lr_imported} importées, {len(lr_errors)} erreurs")
    print()
    
    # Import des molécules
    molecules = data.get('molecules', [])
    print(f"🧪 Import des molécules ({len(molecules)} entrées)...")
    mol_imported, mol_errors = import_molecules(conn, molecules)
    print(f"   Résultat: {mol_imported} importées, {len(mol_errors)} erreurs")
    print()
    
    # Import des additifs
    additifs = data.get('additifs', [])
    print(f"🧂 Import des additifs ({len(additifs)} entrées)...")
    add_imported, add_errors = import_additifs(conn, additifs)
    print(f"   Résultat: {add_imported} importés, {len(add_errors)} erreurs")
    print()
    
    # Résumé final
    print("=" * 60)
    print("RÉSUMÉ DE L'IMPORT")
    print("=" * 60)
    print(f"Landraces: {lr_imported} importées")
    print(f"Molécules: {mol_imported} importées")
    print(f"Additifs: {add_imported} importés")
    print(f"Total: {lr_imported + mol_imported + add_imported} entrées")
    print()
    
    if lr_errors or mol_errors or add_errors:
        print("⚠️  ERREURS:")
        for err in lr_errors + mol_errors + add_errors:
            print(f"   - {err}")
    
    conn.close()
    print()
    print("✅ Import terminé")

if __name__ == '__main__':
    main()
