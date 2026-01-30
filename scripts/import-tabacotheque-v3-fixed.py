#!/usr/bin/env python3
"""
Script d'import de la tabacothèque PERFUMUM v3.0 - Version corrigée
Utilise les tables existantes: landraces, molecules, tobacco_additives
"""

import json
import os
import mysql.connector
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL', '')

def parse_database_url(url):
    """Parse DATABASE_URL en paramètres de connexion"""
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
    """Importer les landraces dans la table landraces existante"""
    cursor = conn.cursor(buffered=True)
    imported = 0
    skipped = 0
    errors = []
    
    for lr in landraces:
        try:
            name = lr.get('nom', '')
            
            # Vérifier si la landrace existe déjà
            cursor.execute("SELECT id FROM landraces WHERE name = %s", (name,))
            existing = cursor.fetchone()
            
            if existing:
                print(f"  ⏭️  Landrace '{name}' existe déjà (ID: {existing[0]})")
                skipped += 1
                continue
            
            # Préparer les données JSON
            terroir = lr.get('terroir', {})
            profil = lr.get('profil_aromatique', {})
            composition = lr.get('composition_chimique', {})
            profil_mol = lr.get('profil_moleculaire_unique', {})
            usage = lr.get('usage_parfumerie', {})
            
            molecular_profile = json.dumps({
                'composition_chimique': composition,
                'profil_moleculaire': profil_mol
            }, ensure_ascii=False)
            
            # Extraire les descripteurs pour aroma_characteristics
            descripteurs = profil.get('descripteurs', [])
            aroma_chars = ', '.join(descripteurs) if descripteurs else profil.get('caractere', '')
            
            # Insérer la landrace
            cursor.execute("""
                INSERT INTO landraces 
                (name, origin_country, origin_region, molecular_profile, 
                 aroma_characteristics, flavor_profile, climate_adaptation,
                 modern_availability, conservation_status, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
            """, (
                name,
                lr.get('region_origine', 'Inconnu'),
                ', '.join(terroir.get('zones_production', [])) if terroir.get('zones_production') else '',
                molecular_profile,
                aroma_chars,
                profil.get('caractere', ''),
                terroir.get('climat', ''),
                'Disponible' if lr.get('rarete', 5) < 7 else 'Rare',
                'En danger' if lr.get('rarete', 5) >= 8 else 'Stable'
            ))
            
            imported += 1
            print(f"  ✅ Landrace '{name}' importée")
            
        except Exception as e:
            errors.append(f"{lr.get('nom', 'Unknown')}: {str(e)}")
            print(f"  ❌ Erreur pour '{lr.get('nom', 'Unknown')}': {str(e)}")
    
    conn.commit()
    return imported, skipped, errors

def import_molecules(conn, molecules):
    """Importer les molécules dans la table molecules existante"""
    cursor = conn.cursor(buffered=True)
    imported = 0
    skipped = 0
    errors = []
    
    # D'abord, obtenir la structure de la table molecules
    cursor.execute("DESCRIBE molecules")
    columns = [row[0] for row in cursor.fetchall()]
    print(f"  📋 Colonnes disponibles: {columns[:10]}...")
    
    for mol in molecules:
        try:
            name = mol.get('nom', '')
            
            # Vérifier si la molécule existe déjà
            cursor.execute("SELECT id FROM molecules WHERE name = %s", (name,))
            existing = cursor.fetchone()
            
            if existing:
                print(f"  ⏭️  Molécule '{name}' existe déjà (ID: {existing[0]})")
                skipped += 1
                continue
            
            # Préparer les notes olfactives
            notes = mol.get('notes', [])
            notes_str = ', '.join(notes) if notes else ''
            
            # Insérer avec les colonnes qui existent
            if 'olfactory_profile' in columns:
                cursor.execute("""
                    INSERT INTO molecules (name, olfactory_profile, created_at, updated_at)
                    VALUES (%s, %s, NOW(), NOW())
                """, (name, notes_str))
            else:
                cursor.execute("""
                    INSERT INTO molecules (name, created_at, updated_at)
                    VALUES (%s, NOW(), NOW())
                """, (name,))
            
            imported += 1
            print(f"  ✅ Molécule '{name}' importée")
            
        except Exception as e:
            errors.append(f"{mol.get('nom', 'Unknown')}: {str(e)}")
            print(f"  ❌ Erreur pour '{mol.get('nom', 'Unknown')}': {str(e)}")
    
    conn.commit()
    return imported, skipped, errors

def main():
    """Fonction principale d'import"""
    print("=" * 60)
    print("PERFUMUM - Import Tabacothèque v3.0 (Corrigé)")
    print("=" * 60)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Charger le fichier JSON
    json_path = '/home/ubuntu/upload/perfumum_tabacotheque_complete_v3.json'
    print(f"📂 Chargement de {json_path}...")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    metadata = data.get('metadata', {})
    stats = metadata.get('statistiques', {})
    print(f"   Version: {metadata.get('version', 'N/A')}")
    print(f"   Landraces: {stats.get('landraces', 0)}")
    print(f"   Molécules: {stats.get('molecules', 0)}")
    print(f"   Additifs: {stats.get('additifs', 0)}")
    print()
    
    # Connexion à la base de données
    print("🔌 Connexion à la base de données...")
    conn = connect_db()
    print("   ✅ Connecté")
    print()
    
    # Import des landraces
    landraces = data.get('landraces', [])
    print(f"🌿 Import des landraces ({len(landraces)} entrées)...")
    lr_imported, lr_skipped, lr_errors = import_landraces(conn, landraces)
    print(f"   Résultat: {lr_imported} importées, {lr_skipped} existantes, {len(lr_errors)} erreurs")
    print()
    
    # Import des molécules
    molecules = data.get('molecules', [])
    print(f"🧪 Import des molécules ({len(molecules)} entrées)...")
    mol_imported, mol_skipped, mol_errors = import_molecules(conn, molecules)
    print(f"   Résultat: {mol_imported} importées, {mol_skipped} existantes, {len(mol_errors)} erreurs")
    print()
    
    # Résumé final
    print("=" * 60)
    print("RÉSUMÉ DE L'IMPORT")
    print("=" * 60)
    print(f"Landraces: {lr_imported} importées, {lr_skipped} existantes")
    print(f"Molécules: {mol_imported} importées, {mol_skipped} existantes")
    print(f"Total nouvelles entrées: {lr_imported + mol_imported}")
    print()
    
    if lr_errors or mol_errors:
        print("⚠️  ERREURS:")
        for err in (lr_errors + mol_errors)[:10]:
            print(f"   - {err}")
        if len(lr_errors + mol_errors) > 10:
            print(f"   ... et {len(lr_errors + mol_errors) - 10} autres erreurs")
    
    conn.close()
    print()
    print("✅ Import terminé")

if __name__ == '__main__':
    main()
