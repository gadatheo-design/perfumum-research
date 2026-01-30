#!/usr/bin/env python3
"""
Script d'import des landraces mondiales PERFUMUM v2.0
Import progressif et sécurisé des 38 landraces de 25 pays
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

def import_landraces_v2(conn, data):
    """Importer les landraces par région et pays"""
    cursor = conn.cursor(buffered=True)
    imported = 0
    skipped = 0
    errors = []
    
    regions = data.get('regions', {})
    
    for region_name, region_data in regions.items():
        print(f"\n  📍 Région: {region_name}")
        pays_data = region_data.get('pays', {})
        
        for pays_name, pays_info in pays_data.items():
            landraces = pays_info.get('landraces', [])
            print(f"    🌍 {pays_name}: {len(landraces)} landraces")
            
            for lr in landraces:
                try:
                    name = lr.get('nom', '')
                    
                    # Vérifier si la landrace existe déjà
                    cursor.execute("SELECT id FROM landraces WHERE name = %s", (name,))
                    existing = cursor.fetchone()
                    
                    if existing:
                        print(f"      ⏭️  '{name}' existe déjà")
                        skipped += 1
                        continue
                    
                    # Préparer les données
                    profil = lr.get('profil_aromatique', {})
                    composition = lr.get('composition_chimique', {})
                    sol = lr.get('sol', {})
                    climat = lr.get('climat', {})
                    
                    # Notes aromatiques
                    notes_primaires = profil.get('notes_primaires', [])
                    notes_secondaires = profil.get('notes_secondaires', [])
                    aroma_chars = ', '.join(notes_primaires + notes_secondaires)
                    
                    # Profil moléculaire
                    molecules_cles = lr.get('molecules_cles', [])
                    molecular_profile = json.dumps({
                        'composition_chimique': composition,
                        'molecules_cles': molecules_cles,
                        'sol': sol,
                        'climat': climat
                    }, ensure_ascii=False)
                    
                    # Régions de culture
                    regions_culture = lr.get('regions_culture', [])
                    origin_region = ', '.join(regions_culture) if regions_culture else ''
                    
                    # Insérer la landrace
                    cursor.execute("""
                        INSERT INTO landraces 
                        (name, origin_country, origin_region, molecular_profile, 
                         aroma_characteristics, flavor_profile, climate_adaptation,
                         cultural_significance, modern_availability, conservation_status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        name,
                        pays_name,
                        origin_region,
                        molecular_profile,
                        aroma_chars,
                        lr.get('histoire', ''),
                        climat.get('type', ''),
                        lr.get('histoire', ''),
                        lr.get('disponibilite', 'Disponible'),
                        'En danger' if '8' in str(lr.get('rarete', '5')) or '9' in str(lr.get('rarete', '5')) or '10' in str(lr.get('rarete', '5')) else 'Stable'
                    ))
                    
                    imported += 1
                    print(f"      ✅ '{name}' importée")
                    
                except Exception as e:
                    errors.append(f"{lr.get('nom', 'Unknown')}: {str(e)}")
                    print(f"      ❌ Erreur pour '{lr.get('nom', 'Unknown')}': {str(e)}")
    
    conn.commit()
    return imported, skipped, errors

def main():
    print("=" * 60)
    print("PERFUMUM - Import Landraces Mondiales v2.0")
    print("=" * 60)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    json_path = '/home/ubuntu/upload/perfumum_landraces_monde_v2_complet.json'
    print(f"📂 Chargement de {json_path}...")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    metadata = data.get('metadata', {})
    print(f"   Version: {metadata.get('version', 'N/A')}")
    print(f"   Total landraces: {metadata.get('total_landraces', 0)}")
    print(f"   Régions: {metadata.get('regions', 0)}")
    print(f"   Pays: {metadata.get('pays', 0)}")
    print()
    
    print("🔌 Connexion à la base de données...")
    conn = connect_db()
    print("   ✅ Connecté")
    
    print("\n🌿 Import des landraces par région...")
    imported, skipped, errors = import_landraces_v2(conn, data)
    
    print("\n" + "=" * 60)
    print("RÉSUMÉ DE L'IMPORT")
    print("=" * 60)
    print(f"Landraces importées: {imported}")
    print(f"Landraces existantes: {skipped}")
    print(f"Erreurs: {len(errors)}")
    
    if errors:
        print("\n⚠️  ERREURS:")
        for err in errors[:10]:
            print(f"   - {err}")
        if len(errors) > 10:
            print(f"   ... et {len(errors) - 10} autres erreurs")
    
    conn.close()
    print("\n✅ Import terminé")

if __name__ == '__main__':
    main()
