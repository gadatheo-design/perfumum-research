#!/usr/bin/env python3
"""
Script pour lier automatiquement les recettes aux formules de référence
basé sur la similarité de composition moléculaire.
"""

import json
import sys
from collections import defaultdict
from typing import Dict, List, Tuple

# Charger les formules de référence
with open('/home/ubuntu/perfumum-research/data/FORMULES_REFERENCE_16.json', 'r', encoding='utf-8') as f:
    formules_ref = json.load(f)

# Données des recettes (à remplacer par les vraies données de la DB)
recettes_sample = [
    {
        "id": 1,
        "name": "Recette Test 1",
        "gamme": "Pétrichor",
        "molecules": [
            {"name": "Limonène", "proportion": 20, "role": "tête"},
            {"name": "Linalol", "proportion": 25, "role": "tête"},
            {"name": "Géraniol", "proportion": 15, "role": "cœur"},
            {"name": "Vétivérol", "proportion": 20, "role": "fond"},
            {"name": "Coumarine", "proportion": 20, "role": "fond"}
        ]
    }
]

def calculate_similarity(recette_molecules: List[Dict], formule_molecules: List[Dict]) -> float:
    """
    Calcule un score de similarité entre une recette et une formule de référence.
    
    Critères:
    - Molécules communes (50% du score)
    - Similarité des proportions (30% du score)
    - Similarité des rôles (20% du score)
    """
    
    # Créer des dictionnaires pour faciliter la comparaison
    recette_dict = {m['name']: {'proportion': m['proportion'], 'role': m['role']} 
                    for m in recette_molecules}
    formule_dict = {m['name']: {'proportion': m['proportion'], 'role': m['role']} 
                    for m in formule_molecules}
    
    # 1. Molécules communes (50%)
    recette_names = set(recette_dict.keys())
    formule_names = set(formule_dict.keys())
    common_molecules = recette_names & formule_names
    
    if not formule_names:
        return 0.0
    
    molecule_score = len(common_molecules) / len(formule_names)
    
    # 2. Similarité des proportions (30%)
    proportion_score = 0.0
    if common_molecules:
        proportion_diffs = []
        for mol in common_molecules:
            diff = abs(recette_dict[mol]['proportion'] - formule_dict[mol]['proportion'])
            proportion_diffs.append(1 - (diff / 100))  # Normaliser
        proportion_score = sum(proportion_diffs) / len(proportion_diffs)
    
    # 3. Similarité des rôles (20%)
    role_score = 0.0
    if common_molecules:
        role_matches = sum(1 for mol in common_molecules 
                          if recette_dict[mol]['role'] == formule_dict[mol]['role'])
        role_score = role_matches / len(common_molecules)
    
    # Score final pondéré
    final_score = (molecule_score * 0.5) + (proportion_score * 0.3) + (role_score * 0.2)
    
    return final_score

def find_best_formule_for_recette(recette: Dict) -> Tuple[str, str, float]:
    """
    Trouve la meilleure formule de référence pour une recette donnée.
    
    Returns:
        (formule_name, formule_family, similarity_score)
    """
    best_match = None
    best_score = 0.0
    
    for formule in formules_ref:
        score = calculate_similarity(recette['molecules'], formule['molecules'])
        if score > best_score:
            best_score = score
            best_match = formule
    
    if best_match:
        return (best_match['name'], best_match['family'], best_score)
    return (None, None, 0.0)

def analyze_recettes(recettes: List[Dict]) -> List[Dict]:
    """
    Analyse toutes les recettes et trouve leurs formules de référence correspondantes.
    """
    results = []
    
    for recette in recettes:
        formule_name, formule_family, score = find_best_formule_for_recette(recette)
        
        if score >= 0.3:  # Seuil minimum de similarité
            results.append({
                "recette_id": recette['id'],
                "recette_name": recette['name'],
                "recette_gamme": recette['gamme'],
                "formule_reference": formule_name,
                "formule_family": formule_family,
                "similarity_score": round(score * 100, 2)
            })
    
    return results

def main():
    """Point d'entrée principal."""
    
    # Analyser les recettes
    results = analyze_recettes(recettes_sample)
    
    # Trier par score de similarité décroissant
    results.sort(key=lambda x: x['similarity_score'], reverse=True)
    
    # Afficher les résultats
    print(json.dumps(results, indent=2, ensure_ascii=False))
    
    # Statistiques
    print(f"\n=== STATISTIQUES ===", file=sys.stderr)
    print(f"Total recettes analysées: {len(recettes_sample)}", file=sys.stderr)
    print(f"Recettes avec correspondance: {len(results)}", file=sys.stderr)
    
    # Répartition par famille
    family_counts = defaultdict(int)
    for r in results:
        family_counts[r['formule_family']] += 1
    
    print(f"\nRépartition par famille:", file=sys.stderr)
    for family, count in sorted(family_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {family}: {count}", file=sys.stderr)

if __name__ == "__main__":
    main()
