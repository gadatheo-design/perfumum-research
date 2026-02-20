#!/usr/bin/env python3
"""
Analyse des doublons dans les fichiers CSV de PERFUMUM
"""

import pandas as pd
import os
from collections import Counter
import json

def analyze_molecules_csv():
    """Analyse les doublons dans le fichier molécules"""
    csv_path = '/home/ubuntu/perfumum-research/data/perfumum_molecules_template.csv'
    
    if not os.path.exists(csv_path):
        print(f"❌ Fichier non trouvé: {csv_path}")
        return None
    
    print("\n" + "="*80)
    print("ANALYSE DES DOUBLONS - MOLÉCULES (depuis CSV)")
    print("="*80)
    
    try:
        df = pd.read_csv(csv_path)
        print(f"\n📊 Fichier chargé: {len(df)} lignes, {len(df.columns)} colonnes")
        print(f"Colonnes: {', '.join(df.columns.tolist()[:10])}...")
        
        results = {}
        
        # Identifier les colonnes pertinentes
        name_cols = [col for col in df.columns if 'nom' in col.lower() or 'name' in col.lower()]
        cas_cols = [col for col in df.columns if 'cas' in col.lower()]
        smiles_cols = [col for col in df.columns if 'smiles' in col.lower()]
        
        print(f"\n🔍 Colonnes identifiées:")
        print(f"  - Noms: {name_cols}")
        print(f"  - CAS: {cas_cols}")
        print(f"  - SMILES: {smiles_cols}")
        
        # Analyse par colonne de nom
        for col in name_cols:
            if col in df.columns:
                # Supprimer les valeurs nulles et vides
                values = df[col].dropna()
                values = values[values != '']
                
                if len(values) > 0:
                    duplicates = values[values.duplicated(keep=False)]
                    unique_duplicates = duplicates.unique()
                    
                    print(f"\n📊 Colonne '{col}':")
                    print(f"  - Total de valeurs: {len(values)}")
                    print(f"  - Valeurs uniques: {len(values.unique())}")
                    print(f"  - Valeurs dupliquées: {len(unique_duplicates)}")
                    
                    if len(unique_duplicates) > 0:
                        # Compter les occurrences
                        counts = Counter(duplicates)
                        top_10 = counts.most_common(10)
                        
                        print(f"\n  Top 10 des valeurs les plus dupliquées:")
                        for i, (value, count) in enumerate(top_10, 1):
                            print(f"    {i}. '{value}' - {count} occurrences")
                        
                        results[col] = {
                            'total': len(values),
                            'unique': len(values.unique()),
                            'duplicates': len(unique_duplicates),
                            'top_duplicates': [(v, c) for v, c in top_10]
                        }
        
        # Analyse par CAS
        for col in cas_cols:
            if col in df.columns:
                values = df[col].dropna()
                values = values[values != '']
                
                if len(values) > 0:
                    duplicates = values[values.duplicated(keep=False)]
                    unique_duplicates = duplicates.unique()
                    
                    print(f"\n📊 Colonne CAS '{col}':")
                    print(f"  - Total: {len(values)}")
                    print(f"  - Uniques: {len(values.unique())}")
                    print(f"  - Dupliqués: {len(unique_duplicates)}")
                    
                    if len(unique_duplicates) > 0:
                        counts = Counter(duplicates)
                        top_10 = counts.most_common(10)
                        
                        print(f"\n  Top 10 des CAS dupliqués:")
                        for i, (value, count) in enumerate(top_10, 1):
                            print(f"    {i}. {value} - {count} occurrences")
        
        return results
        
    except Exception as e:
        print(f"❌ Erreur lors de l'analyse: {e}")
        import traceback
        traceback.print_exc()
        return None

def analyze_plants_csv():
    """Analyse les doublons dans les fichiers plantes"""
    csv_paths = [
        '/home/ubuntu/perfumum-research/data/perfumum_plants_template_30_col_bfa_car.csv',
        '/home/ubuntu/perfumum-research/data/absorbe_plantes_rares_fantomes_25.csv'
    ]
    
    print("\n" + "="*80)
    print("ANALYSE DES DOUBLONS - PLANTES (depuis CSV)")
    print("="*80)
    
    all_results = {}
    
    for csv_path in csv_paths:
        if not os.path.exists(csv_path):
            print(f"\n⚠️  Fichier non trouvé: {csv_path}")
            continue
        
        print(f"\n📁 Analyse de: {os.path.basename(csv_path)}")
        
        try:
            df = pd.read_csv(csv_path)
            print(f"  Lignes: {len(df)}, Colonnes: {len(df.columns)}")
            
            # Identifier les colonnes pertinentes
            scientific_cols = [col for col in df.columns if 'scientific' in col.lower() or 'latin' in col.lower()]
            common_cols = [col for col in df.columns if 'common' in col.lower() or 'vernacular' in col.lower() or 'nom' in col.lower()]
            
            print(f"  Colonnes scientifiques: {scientific_cols}")
            print(f"  Colonnes communes: {common_cols}")
            
            # Analyse par nom scientifique
            for col in scientific_cols:
                if col in df.columns:
                    values = df[col].dropna()
                    values = values[values != '']
                    
                    if len(values) > 0:
                        duplicates = values[values.duplicated(keep=False)]
                        unique_duplicates = duplicates.unique()
                        
                        print(f"\n  📊 Colonne '{col}':")
                        print(f"    - Total: {len(values)}")
                        print(f"    - Uniques: {len(values.unique())}")
                        print(f"    - Dupliqués: {len(unique_duplicates)}")
                        
                        if len(unique_duplicates) > 0:
                            counts = Counter(duplicates)
                            top_10 = counts.most_common(10)
                            
                            print(f"\n    Top 10 des noms scientifiques dupliqués:")
                            for i, (value, count) in enumerate(top_10, 1):
                                print(f"      {i}. '{value}' - {count} occurrences")
            
            # Analyse par nom commun
            for col in common_cols:
                if col in df.columns:
                    values = df[col].dropna()
                    values = values[values != '']
                    
                    if len(values) > 0:
                        duplicates = values[values.duplicated(keep=False)]
                        unique_duplicates = duplicates.unique()
                        
                        print(f"\n  📊 Colonne '{col}':")
                        print(f"    - Total: {len(values)}")
                        print(f"    - Uniques: {len(values.unique())}")
                        print(f"    - Dupliqués: {len(unique_duplicates)}")
                        
                        if len(unique_duplicates) > 0 and len(unique_duplicates) < 50:
                            counts = Counter(duplicates)
                            top_10 = counts.most_common(10)
                            
                            print(f"\n    Top 10 des noms communs dupliqués:")
                            for i, (value, count) in enumerate(top_10, 1):
                                print(f"      {i}. '{value}' - {count} occurrences")
        
        except Exception as e:
            print(f"  ❌ Erreur: {e}")
    
    return all_results

def analyze_relations_csv():
    """Analyse les doublons dans les relations plantes-molécules"""
    csv_path = '/home/ubuntu/perfumum-research/data/perfumum_plants_molecules_relations.csv'
    
    if not os.path.exists(csv_path):
        print(f"\n⚠️  Fichier non trouvé: {csv_path}")
        return None
    
    print("\n" + "="*80)
    print("ANALYSE DES RELATIONS PLANTES-MOLÉCULES")
    print("="*80)
    
    try:
        df = pd.read_csv(csv_path)
        print(f"\n📊 Fichier chargé: {len(df)} relations")
        print(f"Colonnes: {', '.join(df.columns.tolist())}")
        
        # Identifier les colonnes
        print(f"\n🔍 Analyse des doublons de relations...")
        
        # Supposons que les colonnes sont plant_id et molecule_id
        if 'plant_id' in df.columns and 'molecule_id' in df.columns:
            # Créer une clé composite
            df['relation_key'] = df['plant_id'].astype(str) + '_' + df['molecule_id'].astype(str)
            
            duplicates = df[df['relation_key'].duplicated(keep=False)]
            
            print(f"\n📊 Relations dupliquées: {len(duplicates)}")
            
            if len(duplicates) > 0:
                print(f"\n  Exemples de relations dupliquées:")
                print(duplicates[['plant_id', 'molecule_id']].head(10))
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Fonction principale"""
    print("\n🔍 ANALYSE DES DOUBLONS - PERFUMUM (depuis fichiers CSV)")
    print("="*80)
    
    # Analyse des molécules
    molecule_results = analyze_molecules_csv()
    
    # Analyse des plantes
    plant_results = analyze_plants_csv()
    
    # Analyse des relations
    analyze_relations_csv()
    
    print("\n" + "="*80)
    print("✅ ANALYSE TERMINÉE")
    print("="*80)

if __name__ == "__main__":
    main()
