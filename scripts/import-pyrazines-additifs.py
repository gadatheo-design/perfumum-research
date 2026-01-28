#!/usr/bin/env python3
"""
Script d'import des pyrazines et additifs PERFUMUM
Import progressif et sécurisé
"""

import json
import os
import mysql.connector
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL', '')

def parse_database_url(url):
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
    config = parse_database_url(DATABASE_URL)
    if config:
        return mysql.connector.connect(**config)
    raise Exception("DATABASE_URL non configurée")

def import_pyrazines(conn, pyrazines):
    """Importer les pyrazines dans la table pyrazines"""
    cursor = conn.cursor(buffered=True)
    imported = 0
    skipped = 0
    errors = []
    
    # Vérifier si la table pyrazines existe
    cursor.execute("SHOW TABLES LIKE 'pyrazines'")
    if not cursor.fetchone():
        print("  ⚠️  Table pyrazines n'existe pas, création...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS `pyrazines` (
                `id` int AUTO_INCREMENT NOT NULL,
                `name` varchar(255) NOT NULL,
                `iupac_name` varchar(255),
                `formula` varchar(100),
                `molar_mass` varchar(50),
                `cas_number` varchar(50),
                `category` varchar(100),
                `natural_origin` text,
                `synthesis` text,
                `formation_mechanism` text,
                `olfactory_profile` json,
                `perfumery_usage` json,
                `regulation` json,
                `perfumum_potential` varchar(100),
                `perfumum_notes` text,
                `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
                `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
                CONSTRAINT `pyrazines_id` PRIMARY KEY(`id`)
            )
        """)
        conn.commit()
    
    for pyr in pyrazines:
        try:
            name = pyr.get('nom', '')
            
            # Vérifier si la pyrazine existe déjà
            cursor.execute("SELECT id FROM pyrazines WHERE name = %s", (name,))
            existing = cursor.fetchone()
            
            if existing:
                print(f"  ⏭️  Pyrazine '{name}' existe déjà")
                skipped += 1
                continue
            
            # Préparer les données JSON
            profil = pyr.get('profil_olfactif', {})
            usage = pyr.get('usage_parfumerie', {})
            regl = pyr.get('reglementation', {})
            formation = pyr.get('formation_tabac', {})
            origine = pyr.get('origine', {})
            
            cursor.execute("""
                INSERT INTO pyrazines 
                (name, iupac_name, formula, molar_mass, cas_number, category,
                 natural_origin, synthesis, formation_mechanism, olfactory_profile,
                 perfumery_usage, regulation, perfumum_potential, perfumum_notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                name,
                pyr.get('nom_iupac', ''),
                pyr.get('formule', ''),
                pyr.get('masse_molaire', ''),
                pyr.get('cas', ''),
                pyr.get('categorie', ''),
                origine.get('naturelle', ''),
                origine.get('synthese', ''),
                json.dumps(formation, ensure_ascii=False),
                json.dumps(profil, ensure_ascii=False),
                json.dumps(usage, ensure_ascii=False),
                json.dumps(regl, ensure_ascii=False),
                pyr.get('potentiel_perfumum', ''),
                pyr.get('notes_perfumum', '')
            ))
            
            imported += 1
            print(f"  ✅ Pyrazine '{name}' importée")
            
        except Exception as e:
            errors.append(f"{pyr.get('nom', 'Unknown')}: {str(e)}")
            print(f"  ❌ Erreur pour '{pyr.get('nom', 'Unknown')}': {str(e)}")
    
    conn.commit()
    return imported, skipped, errors

def import_additifs(conn, additifs):
    """Importer les additifs dans la table tobacco_additives"""
    cursor = conn.cursor(buffered=True)
    imported = 0
    skipped = 0
    errors = []
    
    for add in additifs:
        try:
            name = add.get('nom', '')
            
            # Vérifier si l'additif existe déjà
            cursor.execute("SELECT id FROM tobacco_additives WHERE name = %s", (name,))
            existing = cursor.fetchone()
            
            if existing:
                print(f"  ⏭️  Additif '{name}' existe déjà")
                skipped += 1
                continue
            
            # Préparer les données JSON
            profil = add.get('profil_aromatique', {})
            influence = add.get('influence_tabac', {})
            molecules = add.get('molecules_cles', [])
            perfumerie = add.get('applications_parfumerie', {})
            
            cursor.execute("""
                INSERT INTO tobacco_additives 
                (name, scientific_name, category, type, origin, form, usage_type,
                 concentration, main_function, aromatic_profile, tobacco_influence,
                 key_molecules, perfumery_applications, regulatory_status, toxicity)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                name,
                add.get('nom_scientifique', ''),
                add.get('categorie', ''),
                add.get('type', ''),
                add.get('origine', ''),
                add.get('forme', ''),
                add.get('utilisation', ''),
                add.get('concentration', ''),
                add.get('fonction_principale', ''),
                json.dumps(profil, ensure_ascii=False),
                json.dumps(influence, ensure_ascii=False),
                json.dumps(molecules, ensure_ascii=False),
                json.dumps(perfumerie, ensure_ascii=False),
                add.get('statut_reglementaire', ''),
                add.get('toxicite', '')
            ))
            
            imported += 1
            print(f"  ✅ Additif '{name}' importé")
            
        except Exception as e:
            errors.append(f"{add.get('nom', 'Unknown')}: {str(e)}")
            print(f"  ❌ Erreur pour '{add.get('nom', 'Unknown')}': {str(e)}")
    
    conn.commit()
    return imported, skipped, errors

def main():
    print("=" * 60)
    print("PERFUMUM - Import Pyrazines et Additifs")
    print("=" * 60)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Connexion
    print("🔌 Connexion à la base de données...")
    conn = connect_db()
    print("   ✅ Connecté")
    print()
    
    # Import pyrazines
    pyr_path = '/home/ubuntu/upload/perfumum_pyrazines.json'
    print(f"📂 Chargement de {pyr_path}...")
    with open(pyr_path, 'r', encoding='utf-8') as f:
        pyr_data = json.load(f)
    
    pyrazines = pyr_data.get('pyrazines', [])
    print(f"\n🧪 Import des pyrazines ({len(pyrazines)} entrées)...")
    pyr_imported, pyr_skipped, pyr_errors = import_pyrazines(conn, pyrazines)
    print(f"   Résultat: {pyr_imported} importées, {pyr_skipped} existantes, {len(pyr_errors)} erreurs")
    
    # Import additifs
    add_path = '/home/ubuntu/upload/perfumum_additifs_tabac.json'
    print(f"\n📂 Chargement de {add_path}...")
    with open(add_path, 'r', encoding='utf-8') as f:
        add_data = json.load(f)
    
    additifs = add_data.get('additifs', [])
    print(f"\n🧂 Import des additifs ({len(additifs)} entrées)...")
    add_imported, add_skipped, add_errors = import_additifs(conn, additifs)
    print(f"   Résultat: {add_imported} importés, {add_skipped} existants, {len(add_errors)} erreurs")
    
    # Résumé
    print("\n" + "=" * 60)
    print("RÉSUMÉ DE L'IMPORT")
    print("=" * 60)
    print(f"Pyrazines: {pyr_imported} importées, {pyr_skipped} existantes")
    print(f"Additifs: {add_imported} importés, {add_skipped} existants")
    print(f"Total: {pyr_imported + add_imported} nouvelles entrées")
    
    if pyr_errors or add_errors:
        print("\n⚠️  ERREURS:")
        for err in (pyr_errors + add_errors)[:10]:
            print(f"   - {err}")
    
    conn.close()
    print("\n✅ Import terminé")

if __name__ == '__main__':
    main()
