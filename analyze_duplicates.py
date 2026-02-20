#!/usr/bin/env python3
"""
Script d'analyse des doublons dans la base de données PERFUMUM
Analyse les molécules et plantes pour identifier les entrées dupliquées
"""

import mysql.connector
import os
from collections import defaultdict
import json

# Configuration de la connexion
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'perfumum')
}

def connect_db():
    """Connexion à la base de données"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print(f"Erreur de connexion: {err}")
        return None

def analyze_molecule_duplicates(conn):
    """Analyse les doublons dans la table molecules"""
    cursor = conn.cursor(dictionary=True)
    
    print("\n" + "="*80)
    print("ANALYSE DES DOUBLONS - MOLÉCULES")
    print("="*80)
    
    # 1. Doublons par nom
    cursor.execute("""
        SELECT nom, COUNT(*) as count, GROUP_CONCAT(id) as ids
        FROM molecules
        WHERE nom IS NOT NULL AND nom != ''
        GROUP BY nom
        HAVING COUNT(*) > 1
        ORDER BY count DESC
    """)
    
    nom_duplicates = cursor.fetchall()
    print(f"\n📊 Doublons par NOM: {len(nom_duplicates)} noms dupliqués")
    
    total_duplicate_molecules = 0
    if nom_duplicates:
        print("\nTop 10 des noms les plus dupliqués:")
        for i, dup in enumerate(nom_duplicates[:10], 1):
            print(f"  {i}. '{dup['nom']}' - {dup['count']} occurrences (IDs: {dup['ids']})")
            total_duplicate_molecules += dup['count'] - 1
    
    # 2. Doublons par CAS number
    cursor.execute("""
        SELECT cas_number, COUNT(*) as count, GROUP_CONCAT(id) as ids, GROUP_CONCAT(nom) as noms
        FROM molecules
        WHERE cas_number IS NOT NULL AND cas_number != ''
        GROUP BY cas_number
        HAVING COUNT(*) > 1
        ORDER BY count DESC
    """)
    
    cas_duplicates = cursor.fetchall()
    print(f"\n📊 Doublons par CAS NUMBER: {len(cas_duplicates)} CAS dupliqués")
    
    if cas_duplicates:
        print("\nTop 10 des CAS les plus dupliqués:")
        for i, dup in enumerate(cas_duplicates[:10], 1):
            print(f"  {i}. CAS {dup['cas_number']} - {dup['count']} occurrences")
            print(f"     Noms: {dup['noms']}")
            print(f"     IDs: {dup['ids']}")
    
    # 3. Doublons par SMILES
    cursor.execute("""
        SELECT smiles, COUNT(*) as count, GROUP_CONCAT(id) as ids, GROUP_CONCAT(nom) as noms
        FROM molecules
        WHERE smiles IS NOT NULL AND smiles != ''
        GROUP BY smiles
        HAVING COUNT(*) > 1
        ORDER BY count DESC
    """)
    
    smiles_duplicates = cursor.fetchall()
    print(f"\n📊 Doublons par SMILES: {len(smiles_duplicates)} SMILES dupliqués")
    
    if smiles_duplicates:
        print("\nTop 10 des SMILES les plus dupliqués:")
        for i, dup in enumerate(smiles_duplicates[:10], 1):
            print(f"  {i}. SMILES: {dup['smiles'][:50]}... - {dup['count']} occurrences")
            print(f"     Noms: {dup['noms']}")
    
    # 4. Statistiques globales
    cursor.execute("SELECT COUNT(*) as total FROM molecules")
    total_molecules = cursor.fetchone()['total']
    
    cursor.execute("SELECT COUNT(DISTINCT nom) as unique_names FROM molecules WHERE nom IS NOT NULL")
    unique_names = cursor.fetchone()['unique_names']
    
    cursor.execute("SELECT COUNT(DISTINCT cas_number) as unique_cas FROM molecules WHERE cas_number IS NOT NULL AND cas_number != ''")
    unique_cas = cursor.fetchone()['unique_cas']
    
    print(f"\n📈 STATISTIQUES GLOBALES - MOLÉCULES")
    print(f"  Total de molécules: {total_molecules}")
    print(f"  Noms uniques: {unique_names}")
    print(f"  CAS uniques: {unique_cas}")
    print(f"  Doublons estimés (par nom): {total_duplicate_molecules}")
    print(f"  Taux de duplication: {(total_duplicate_molecules/total_molecules*100):.2f}%")
    
    cursor.close()
    
    return {
        'nom_duplicates': len(nom_duplicates),
        'cas_duplicates': len(cas_duplicates),
        'smiles_duplicates': len(smiles_duplicates),
        'total_molecules': total_molecules,
        'estimated_duplicates': total_duplicate_molecules
    }

def analyze_plant_duplicates(conn):
    """Analyse les doublons dans la table plants"""
    cursor = conn.cursor(dictionary=True)
    
    print("\n" + "="*80)
    print("ANALYSE DES DOUBLONS - PLANTES")
    print("="*80)
    
    # 1. Doublons par nom scientifique
    cursor.execute("""
        SELECT scientific_name, COUNT(*) as count, GROUP_CONCAT(id) as ids
        FROM plants
        WHERE scientific_name IS NOT NULL AND scientific_name != ''
        GROUP BY scientific_name
        HAVING COUNT(*) > 1
        ORDER BY count DESC
    """)
    
    scientific_duplicates = cursor.fetchall()
    print(f"\n📊 Doublons par NOM SCIENTIFIQUE: {len(scientific_duplicates)} noms dupliqués")
    
    total_duplicate_plants = 0
    if scientific_duplicates:
        print("\nTop 10 des noms scientifiques les plus dupliqués:")
        for i, dup in enumerate(scientific_duplicates[:10], 1):
            print(f"  {i}. '{dup['scientific_name']}' - {dup['count']} occurrences (IDs: {dup['ids']})")
            total_duplicate_plants += dup['count'] - 1
    
    # 2. Doublons par nom commun
    cursor.execute("""
        SELECT common_name, COUNT(*) as count, GROUP_CONCAT(id) as ids, GROUP_CONCAT(scientific_name) as scientific_names
        FROM plants
        WHERE common_name IS NOT NULL AND common_name != ''
        GROUP BY common_name
        HAVING COUNT(*) > 1
        ORDER BY count DESC
    """)
    
    common_duplicates = cursor.fetchall()
    print(f"\n📊 Doublons par NOM COMMUN: {len(common_duplicates)} noms dupliqués")
    
    if common_duplicates:
        print("\nTop 10 des noms communs les plus dupliqués:")
        for i, dup in enumerate(common_duplicates[:10], 1):
            print(f"  {i}. '{dup['common_name']}' - {dup['count']} occurrences")
            print(f"     Noms scientifiques: {dup['scientific_names']}")
    
    # 3. Statistiques globales
    cursor.execute("SELECT COUNT(*) as total FROM plants")
    total_plants = cursor.fetchone()['total']
    
    cursor.execute("SELECT COUNT(DISTINCT scientific_name) as unique_scientific FROM plants WHERE scientific_name IS NOT NULL")
    unique_scientific = cursor.fetchone()['unique_scientific']
    
    cursor.execute("SELECT COUNT(DISTINCT common_name) as unique_common FROM plants WHERE common_name IS NOT NULL AND common_name != ''")
    unique_common = cursor.fetchone()['unique_common']
    
    print(f"\n📈 STATISTIQUES GLOBALES - PLANTES")
    print(f"  Total de plantes: {total_plants}")
    print(f"  Noms scientifiques uniques: {unique_scientific}")
    print(f"  Noms communs uniques: {unique_common}")
    print(f"  Doublons estimés: {total_duplicate_plants}")
    print(f"  Taux de duplication: {(total_duplicate_plants/total_plants*100):.2f}%")
    
    cursor.close()
    
    return {
        'scientific_duplicates': len(scientific_duplicates),
        'common_duplicates': len(common_duplicates),
        'total_plants': total_plants,
        'estimated_duplicates': total_duplicate_plants
    }

def main():
    """Fonction principale"""
    print("\n🔍 ANALYSE DES DOUBLONS - PERFUMUM DATABASE")
    print("="*80)
    
    conn = connect_db()
    if not conn:
        print("❌ Impossible de se connecter à la base de données")
        return
    
    try:
        # Analyse des molécules
        molecule_stats = analyze_molecule_duplicates(conn)
        
        # Analyse des plantes
        plant_stats = analyze_plant_duplicates(conn)
        
        # Résumé final
        print("\n" + "="*80)
        print("RÉSUMÉ FINAL")
        print("="*80)
        print(f"\n📊 MOLÉCULES:")
        print(f"  - {molecule_stats['nom_duplicates']} noms dupliqués")
        print(f"  - {molecule_stats['cas_duplicates']} CAS dupliqués")
        print(f"  - {molecule_stats['smiles_duplicates']} SMILES dupliqués")
        print(f"  - ~{molecule_stats['estimated_duplicates']} entrées en doublon")
        
        print(f"\n📊 PLANTES:")
        print(f"  - {plant_stats['scientific_duplicates']} noms scientifiques dupliqués")
        print(f"  - {plant_stats['common_duplicates']} noms communs dupliqués")
        print(f"  - ~{plant_stats['estimated_duplicates']} entrées en doublon")
        
        # Sauvegarder les résultats
        results = {
            'molecules': molecule_stats,
            'plants': plant_stats
        }
        
        with open('/home/ubuntu/perfumum-research/duplicate_analysis_results.json', 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n✅ Résultats sauvegardés dans: duplicate_analysis_results.json")
        
    finally:
        conn.close()

if __name__ == "__main__":
    main()
