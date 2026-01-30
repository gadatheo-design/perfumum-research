#!/usr/bin/env python3
"""
Script d'import des tabacs disparus, hybrides et blends PERFUMUM
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

def create_tables_if_needed(conn):
    """Créer les tables si elles n'existent pas"""
    cursor = conn.cursor()
    
    # Table tobacco_hybrids
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS `tobacco_hybrids` (
            `id` int AUTO_INCREMENT NOT NULL,
            `name` varchar(255) NOT NULL,
            `type` varchar(100),
            `parent_1` varchar(255),
            `parent_2` varchar(255),
            `development_year` varchar(50),
            `country` varchar(100),
            `selection_objective` text,
            `agronomic_characteristics` json,
            `aromatic_profile` json,
            `perfumery_potential` varchar(100),
            `availability` varchar(100),
            `originality_score` int,
            `storytelling` text,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
            CONSTRAINT `tobacco_hybrids_id` PRIMARY KEY(`id`)
        )
    """)
    
    # Table tobacco_blends
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS `tobacco_blends` (
            `id` int AUTO_INCREMENT NOT NULL,
            `name` varchar(255) NOT NULL,
            `type` varchar(100),
            `category` varchar(100),
            `origin_country` varchar(100),
            `producer` varchar(255),
            `year_created` varchar(50),
            `status` varchar(100),
            `composition` json,
            `aromatic_profile` json,
            `history` text,
            `reputation` text,
            `perfumery_potential` varchar(100),
            `storytelling` text,
            `availability` varchar(100),
            `originality_score` int,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
            CONSTRAINT `tobacco_blends_id` PRIMARY KEY(`id`)
        )
    """)
    
    # Table tobacco_extinct_varieties
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS `tobacco_extinct_varieties` (
            `id` int AUTO_INCREMENT NOT NULL,
            `name` varchar(255) NOT NULL,
            `alternative_names` json,
            `status` varchar(100),
            `extinction_year` varchar(50),
            `origin_country` varchar(100),
            `region` varchar(255),
            `history` json,
            `genomics` json,
            `botanical_characteristics` json,
            `aromatic_profile` json,
            `molecular_composition` json,
            `perfumery_potential` json,
            `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
            `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
            CONSTRAINT `tobacco_extinct_id` PRIMARY KEY(`id`)
        )
    """)
    
    conn.commit()
    print("   ✅ Tables créées/vérifiées")

def import_extinct_varieties(conn, varieties):
    """Importer les variétés disparues"""
    cursor = conn.cursor(buffered=True)
    imported = 0
    skipped = 0
    errors = []
    
    for var in varieties:
        try:
            name = var.get('nom', '')
            
            cursor.execute("SELECT id FROM tobacco_extinct_varieties WHERE name = %s", (name,))
            if cursor.fetchone():
                print(f"  ⏭️  '{name}' existe déjà")
                skipped += 1
                continue
            
            cursor.execute("""
                INSERT INTO tobacco_extinct_varieties 
                (name, alternative_names, status, extinction_year, origin_country, region,
                 history, genomics, botanical_characteristics, aromatic_profile,
                 molecular_composition, perfumery_potential)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                name,
                json.dumps(var.get('nom_alternatifs', []), ensure_ascii=False),
                var.get('statut', ''),
                var.get('annee_disparition', ''),
                var.get('pays_origine', ''),
                var.get('region', ''),
                json.dumps(var.get('histoire', {}), ensure_ascii=False),
                json.dumps(var.get('genomique', {}), ensure_ascii=False),
                json.dumps(var.get('caracteristiques_botaniques', {}), ensure_ascii=False),
                json.dumps(var.get('profil_aromatique', {}), ensure_ascii=False),
                json.dumps(var.get('composition_moleculaire_estimee', {}), ensure_ascii=False),
                json.dumps(var.get('potentiel_parfumerie', {}), ensure_ascii=False)
            ))
            
            imported += 1
            print(f"  ✅ '{name}' importée")
            
        except Exception as e:
            errors.append(f"{var.get('nom', 'Unknown')}: {str(e)}")
            print(f"  ❌ Erreur pour '{var.get('nom', 'Unknown')}': {str(e)}")
    
    conn.commit()
    return imported, skipped, errors

def import_hybrids(conn, hybrids):
    """Importer les hybrides"""
    cursor = conn.cursor(buffered=True)
    imported = 0
    skipped = 0
    errors = []
    
    for hyb in hybrids:
        try:
            name = hyb.get('nom', '')
            
            cursor.execute("SELECT id FROM tobacco_hybrids WHERE name = %s", (name,))
            if cursor.fetchone():
                print(f"  ⏭️  '{name}' existe déjà")
                skipped += 1
                continue
            
            origine = hyb.get('origine_genetique', {})
            agro = hyb.get('caracteristiques_agronomiques', {})
            profil = hyb.get('profil_aromatique', {})
            
            cursor.execute("""
                INSERT INTO tobacco_hybrids 
                (name, type, parent_1, parent_2, development_year, country,
                 selection_objective, agronomic_characteristics, aromatic_profile,
                 perfumery_potential, availability, originality_score, storytelling)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                name,
                hyb.get('type', ''),
                origine.get('parent_1', ''),
                origine.get('parent_2', ''),
                origine.get('annee_developpement', ''),
                origine.get('pays', ''),
                hyb.get('objectif_selection', ''),
                json.dumps(agro, ensure_ascii=False),
                json.dumps(profil, ensure_ascii=False),
                hyb.get('potentiel_parfumerie', ''),
                hyb.get('disponibilite', ''),
                hyb.get('originalite', 0),
                hyb.get('storytelling', '')
            ))
            
            imported += 1
            print(f"  ✅ '{name}' importé")
            
        except Exception as e:
            errors.append(f"{hyb.get('nom', 'Unknown')}: {str(e)}")
            print(f"  ❌ Erreur pour '{hyb.get('nom', 'Unknown')}': {str(e)}")
    
    conn.commit()
    return imported, skipped, errors

def import_blends(conn, blends):
    """Importer les blends"""
    cursor = conn.cursor(buffered=True)
    imported = 0
    skipped = 0
    errors = []
    
    for blend in blends:
        try:
            name = blend.get('nom', '')
            
            cursor.execute("SELECT id FROM tobacco_blends WHERE name = %s", (name,))
            if cursor.fetchone():
                print(f"  ⏭️  '{name}' existe déjà")
                skipped += 1
                continue
            
            origine = blend.get('origine', {})
            composition = blend.get('composition', {})
            profil = blend.get('profil_aromatique', {})
            
            cursor.execute("""
                INSERT INTO tobacco_blends 
                (name, type, category, origin_country, producer, year_created, status,
                 composition, aromatic_profile, history, reputation,
                 perfumery_potential, storytelling, availability, originality_score)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                name,
                blend.get('type', ''),
                blend.get('categorie', ''),
                origine.get('pays', ''),
                origine.get('producteur_actuel', origine.get('producteur_historique', '')),
                origine.get('annee_creation', ''),
                origine.get('statut', ''),
                json.dumps(composition, ensure_ascii=False),
                json.dumps(profil, ensure_ascii=False),
                blend.get('histoire', ''),
                blend.get('reputation', ''),
                blend.get('potentiel_parfumerie', ''),
                blend.get('storytelling', ''),
                blend.get('disponibilite', ''),
                blend.get('score_originalite', 0)
            ))
            
            imported += 1
            print(f"  ✅ '{name}' importé")
            
        except Exception as e:
            errors.append(f"{blend.get('nom', 'Unknown')}: {str(e)}")
            print(f"  ❌ Erreur pour '{blend.get('nom', 'Unknown')}': {str(e)}")
    
    conn.commit()
    return imported, skipped, errors

def main():
    print("=" * 60)
    print("PERFUMUM - Import Tabacs Disparus, Hybrides et Blends")
    print("=" * 60)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    print("🔌 Connexion à la base de données...")
    conn = connect_db()
    print("   ✅ Connecté")
    
    print("\n📋 Création des tables si nécessaire...")
    create_tables_if_needed(conn)
    
    # Import tabacs disparus
    print("\n📂 Chargement des tabacs disparus...")
    with open('/home/ubuntu/upload/perfumum_tabacs_disparus_v1.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    varieties = data.get('varietes_disparues', [])
    print(f"\n🦴 Import des variétés disparues ({len(varieties)} entrées)...")
    ext_imported, ext_skipped, ext_errors = import_extinct_varieties(conn, varieties)
    
    # Import hybrides
    print("\n📂 Chargement des hybrides...")
    with open('/home/ubuntu/upload/perfumum_hybrides_tabac.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    hybrids = data.get('hybrides', [])
    print(f"\n🧬 Import des hybrides ({len(hybrids)} entrées)...")
    hyb_imported, hyb_skipped, hyb_errors = import_hybrids(conn, hybrids)
    
    # Import blends
    print("\n📂 Chargement des blends...")
    with open('/home/ubuntu/upload/perfumum_blends_tabac.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    blends = data.get('blends', [])
    print(f"\n🍂 Import des blends ({len(blends)} entrées)...")
    blend_imported, blend_skipped, blend_errors = import_blends(conn, blends)
    
    # Résumé
    print("\n" + "=" * 60)
    print("RÉSUMÉ DE L'IMPORT")
    print("=" * 60)
    print(f"Variétés disparues: {ext_imported} importées, {ext_skipped} existantes")
    print(f"Hybrides: {hyb_imported} importés, {hyb_skipped} existants")
    print(f"Blends: {blend_imported} importés, {blend_skipped} existants")
    print(f"Total: {ext_imported + hyb_imported + blend_imported} nouvelles entrées")
    
    all_errors = ext_errors + hyb_errors + blend_errors
    if all_errors:
        print("\n⚠️  ERREURS:")
        for err in all_errors[:10]:
            print(f"   - {err}")
    
    conn.close()
    print("\n✅ Import terminé")

if __name__ == '__main__':
    main()
