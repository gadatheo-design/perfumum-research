#!/usr/bin/env python3
"""
Audit des routes du projet PERFUMUM
Analyse App.tsx pour extraire et catégoriser toutes les routes
"""

import re
import json
from pathlib import Path
from collections import defaultdict

def extract_routes(app_tsx_path):
    """Extrait toutes les routes de App.tsx"""
    with open(app_tsx_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern pour extraire les routes
    route_pattern = r'<Route\s+path="([^"]+)"\s+component=\{(\w+)\}'
    routes = re.findall(route_pattern, content)
    
    # Pattern pour extraire les sections (commentaires)
    section_pattern = r'\{/\* === ([^=]+) ===.*?\*/'
    sections = re.findall(section_pattern, content)
    
    return routes, sections

def categorize_routes(routes):
    """Catégorise les routes par domaine fonctionnel"""
    categories = defaultdict(list)
    
    # Définition des catégories basées sur les préfixes de route
    category_rules = [
        (r'^/$', 'Accueil'),
        (r'^/admin', 'Administration'),
        (r'^/prototype', 'Prototypes'),
        (r'^/gamme', 'Gammes'),
        (r'^/laboratoire', 'Laboratoire'),
        (r'^/molecule', 'Molécules'),
        (r'^/terpene', 'Molécules'),
        (r'^/familles', 'Familles'),
        (r'^/chemical-famil', 'Familles'),
        (r'^/recette', 'Recettes'),
        (r'^/accord', 'Accords'),
        (r'^/resine', 'Résines CBD'),
        (r'^/compare', 'Comparaison'),
        (r'^/comparaison', 'Comparaison'),
        (r'^/comparateur', 'Comparaison'),
        (r'^/graphe', 'Visualisations'),
        (r'^/matrice', 'Visualisations'),
        (r'^/synergies', 'Synergies'),
        (r'^/sankey', 'Visualisations'),
        (r'^/radar', 'Visualisations'),
        (r'^/heatmap', 'Visualisations'),
        (r'^/outils', 'Outils'),
        (r'^/calculateur', 'Outils'),
        (r'^/analyses', 'Outils'),
        (r'^/absorbe', 'Méthodologie'),
        (r'^/recherche', 'Recherche'),
        (r'^/programme', 'Programmes'),
        (r'^/journal', 'Journal'),
        (r'^/methode', 'Méthodologie'),
        (r'^/methodologie', 'Méthodologie'),
        (r'^/etude', 'Études'),
        (r'^/archive', 'Archives'),
        (r'^/protocole', 'Protocoles'),
        (r'^/test', 'Tests'),
        (r'^/odeur', 'Odeurs'),
        (r'^/projet', 'Projets'),
        (r'^/terrain', 'Terrains'),
        (r'^/bibliographie', 'Bibliographie'),
        (r'^/reference', 'Références'),
        (r'^/plant', 'Plantes'),
        (r'^/variete', 'Variétés'),
        (r'^/terp-profile', 'Profils Terpéniques'),
        (r'^/terroir', 'Terroirs'),
        (r'^/carte', 'Cartes'),
        (r'^/leaf-econom', 'Leaf Economies'),
        (r'^/san-andres', 'Leaf Economies'),
        (r'^/civilisation', 'Civilisations'),
        (r'^/tradition', 'Traditions'),
        (r'^/tabac', 'Tabacs'),
        (r'^/dashboard', 'Tableaux de bord'),
        (r'^/profile', 'Utilisateur'),
        (r'^/settings', 'Utilisateur'),
        (r'^/glossaire', 'Glossaire'),
        (r'^/timeline', 'Timeline'),
        (r'^/galerie', 'Galerie'),
        (r'^/gallery', 'Galerie'),
        (r'^/ifra', 'IFRA'),
        (r'^/import', 'Import/Export'),
        (r'^/export', 'Import/Export'),
        (r'^/csv', 'Import/Export'),
        (r'^/linking', 'Liaisons'),
        (r'^/audit', 'Audit'),
        (r'^/contributor', 'Contributeur'),
        (r'^/contribuer', 'Contributeur'),
        (r'^/validation', 'Validation'),
        (r'^/notification', 'Notifications'),
        (r'^/coverage', 'Couverture'),
        (r'^/ghost', 'Variétés Fantômes'),
        (r'^/genomic', 'Génomique'),
        (r'^/heritage', 'Patrimoine'),
        (r'^/alternative', 'Alternatives'),
        (r'^/patrimoine', 'Patrimoine'),
        (r'^/sourcing', 'Sourcing'),
        (r'^/supplier', 'Fournisseurs'),
        (r'^/chemotype', 'Chemotypes'),
        (r'^/chimie', 'Chimie'),
        (r'^/interaction', 'Interactions'),
        (r'^/formul', 'Formulation'),
        (r'^/generateur', 'Générateur'),
        (r'^/historique', 'Historique'),
        (r'^/visualisation', 'Visualisations'),
        (r'^/a-propos', 'À propos'),
        (r'^/contact', 'Contact'),
        (r'^/nouveautes', 'Nouveautés'),
        (r'^/le-projet', 'Le Projet'),
        (r'^/systeme', 'Système'),
        (r'^/gestion', 'Gestion'),
        (r'^/collaboration', 'Collaborations'),
        (r'^/axes', 'Axes de Recherche'),
        (r'^/reseau', 'Réseaux'),
        (r'^/h2-linking', 'Liaisons H2'),
        (r'^/h3-linking', 'Liaisons H3'),
        (r'^/bulk', 'Import en masse'),
        (r'^/suggest', 'Suggestions'),
        (r'^/vue', 'Vues'),
        (r'^/inventaire', 'Inventaire'),
        (r'^/statistiques', 'Statistiques'),
        (r'^/colombia', 'Colombie'),
        (r'^/botanique', 'Botanique'),
        (r'^/showcase', 'Showcase'),
    ]
    
    for path, component in routes:
        categorized = False
        for pattern, category in category_rules:
            if re.match(pattern, path, re.IGNORECASE):
                categories[category].append({'path': path, 'component': component})
                categorized = True
                break
        if not categorized:
            categories['Autres'].append({'path': path, 'component': component})
    
    return dict(categories)

def suggest_consolidation(categories):
    """Suggère des regroupements pour réduire le nombre de pages"""
    consolidation = {}
    
    # Règles de consolidation
    consolidation_rules = {
        'Molécules': {
            'main_route': '/molecules',
            'tabs': ['Liste', 'Détail', 'Familles', 'Chimie'],
            'merge_from': ['Familles']
        },
        'Recettes': {
            'main_route': '/recettes',
            'tabs': ['Liste', 'Détail', 'Timeline', 'Formules'],
            'merge_from': ['Accords']
        },
        'Plantes': {
            'main_route': '/plants',
            'tabs': ['Liste', 'Variétés', 'Terroirs', 'Galerie', 'Chemotypes'],
            'merge_from': ['Variétés', 'Terroirs', 'Chemotypes']
        },
        'Comparaison': {
            'main_route': '/compare',
            'tabs': ['Molécules', 'Recettes', 'Plantes', 'Terpènes', 'Radar'],
            'merge_from': []
        },
        'Visualisations': {
            'main_route': '/visualisations',
            'tabs': ['Graphes', 'Matrices', 'Sankey', 'Heatmaps', 'Réseaux'],
            'merge_from': ['Synergies']
        },
        'Recherche': {
            'main_route': '/recherche',
            'tabs': ['Avancée', 'Scientifique', 'Programmes', 'Radicale'],
            'merge_from': ['Programmes']
        },
        'Méthodologie': {
            'main_route': '/methodologie',
            'tabs': ['ABSORBE', 'GC-MS', 'Pyrolyse', 'Protocoles'],
            'merge_from': ['Protocoles']
        },
        'Administration': {
            'main_route': '/admin',
            'tabs': ['Molécules', 'Recettes', 'Plantes', 'Import/Export', 'Validation', 'Liaisons'],
            'merge_from': ['Import/Export', 'Liaisons', 'Validation', 'Audit']
        },
        'Bibliographie': {
            'main_route': '/bibliographie',
            'tabs': ['Références', 'Axes', 'Import', 'Réseau'],
            'merge_from': ['Références', 'Axes de Recherche']
        },
        'Archives': {
            'main_route': '/archives',
            'tabs': ['Terrain', 'Olfactives', 'Études', 'Tests'],
            'merge_from': ['Études', 'Tests', 'Odeurs']
        },
        'Outils': {
            'main_route': '/outils',
            'tabs': ['Formulation', 'Calculateurs', 'Enrichissement', 'Export'],
            'merge_from': ['Formulation', 'Générateur']
        },
        'Cartes': {
            'main_route': '/cartes',
            'tabs': ['Terroirs', 'Origines', 'Variétés', 'GPS'],
            'merge_from': []
        },
    }
    
    return consolidation_rules

def generate_report(routes, categories, consolidation):
    """Génère un rapport d'audit"""
    report = {
        'total_routes': len(routes),
        'categories': {k: len(v) for k, v in categories.items()},
        'routes_by_category': categories,
        'consolidation_plan': consolidation,
        'estimated_after_consolidation': len(consolidation) + 10  # +10 pour pages uniques
    }
    return report

def main():
    app_tsx_path = Path('/home/ubuntu/perfumum-research/client/src/App.tsx')
    
    routes, sections = extract_routes(app_tsx_path)
    print(f"Total routes trouvées: {len(routes)}")
    print(f"Sections identifiées: {len(sections)}")
    
    categories = categorize_routes(routes)
    print(f"\nCatégories identifiées: {len(categories)}")
    
    for cat, items in sorted(categories.items(), key=lambda x: -len(x[1])):
        print(f"  {cat}: {len(items)} routes")
    
    consolidation = suggest_consolidation(categories)
    report = generate_report(routes, categories, consolidation)
    
    # Sauvegarder le rapport
    output_path = Path('/home/ubuntu/perfumum-research/scripts/audit_report.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\nRapport sauvegardé: {output_path}")
    print(f"\nRéduction estimée: {len(routes)} → ~{report['estimated_after_consolidation']} pages principales")

if __name__ == '__main__':
    main()
