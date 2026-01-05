#!/usr/bin/env python3
"""
Script d'audit de navigation pour PERFUMUM
Analyse les routes, les liens et identifie les problèmes de navigation
"""

import os
import re
import json
from collections import defaultdict
from pathlib import Path

PROJECT_PATH = "/home/ubuntu/perfumum-research"
PAGES_PATH = f"{PROJECT_PATH}/client/src/pages"
COMPONENTS_PATH = f"{PROJECT_PATH}/client/src/components"
APP_TSX_PATH = f"{PROJECT_PATH}/client/src/App.tsx"

def extract_routes_from_app():
    """Extrait toutes les routes définies dans App.tsx"""
    routes = {}
    with open(APP_TSX_PATH, 'r') as f:
        content = f.read()
    
    # Pattern pour les routes: <Route path="/xxx" component={Xxx} />
    pattern = r'<Route\s+path="([^"]+)"\s+component=\{(\w+)\}'
    matches = re.findall(pattern, content)
    
    for path, component in matches:
        routes[path] = component
    
    return routes

def extract_links_from_file(filepath):
    """Extrait tous les liens <Link href="..."> d'un fichier"""
    links = []
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Pattern pour Link href
        pattern = r'<Link[^>]*href="([^"]+)"'
        matches = re.findall(pattern, content)
        links.extend(matches)
        
        # Pattern pour useLocation navigation
        pattern2 = r'navigate\("([^"]+)"\)'
        matches2 = re.findall(pattern2, content)
        links.extend(matches2)
        
        # Pattern pour window.location
        pattern3 = r'window\.location\.href\s*=\s*["\']([^"\']+)["\']'
        matches3 = re.findall(pattern3, content)
        links.extend(matches3)
        
    except Exception as e:
        pass
    
    return list(set(links))

def get_all_pages():
    """Liste toutes les pages TSX"""
    pages = []
    for root, dirs, files in os.walk(PAGES_PATH):
        for file in files:
            if file.endswith('.tsx'):
                pages.append(os.path.join(root, file))
    return pages

def get_all_components():
    """Liste tous les composants TSX"""
    components = []
    for root, dirs, files in os.walk(COMPONENTS_PATH):
        for file in files:
            if file.endswith('.tsx'):
                components.append(os.path.join(root, file))
    return components

def analyze_navigation():
    """Analyse complète de la navigation"""
    
    # 1. Extraire les routes
    routes = extract_routes_from_app()
    print(f"📍 Routes définies: {len(routes)}")
    
    # 2. Analyser les liens dans toutes les pages
    all_links = defaultdict(list)
    pages = get_all_pages()
    components = get_all_components()
    
    for filepath in pages + components:
        links = extract_links_from_file(filepath)
        for link in links:
            all_links[link].append(filepath)
    
    print(f"🔗 Liens uniques trouvés: {len(all_links)}")
    
    # 3. Identifier les liens cassés (qui ne correspondent à aucune route)
    broken_links = []
    for link, sources in all_links.items():
        # Ignorer les liens externes et les ancres
        if link.startswith('http') or link.startswith('#') or link.startswith('mailto:'):
            continue
        # Ignorer les liens avec paramètres dynamiques
        if ':' in link:
            continue
        # Vérifier si la route existe
        if link not in routes:
            # Vérifier les routes avec paramètres
            found = False
            for route in routes:
                if ':' in route:
                    # Convertir la route en regex
                    route_pattern = re.sub(r':\w+', r'[^/]+', route)
                    if re.match(f'^{route_pattern}$', link):
                        found = True
                        break
            if not found:
                broken_links.append((link, sources))
    
    # 4. Identifier les pages orphelines (sans lien entrant)
    linked_routes = set()
    for link in all_links.keys():
        linked_routes.add(link)
    
    orphan_routes = []
    for route in routes:
        # Ignorer les routes avec paramètres dynamiques
        if ':' in route:
            continue
        if route not in linked_routes:
            orphan_routes.append((route, routes[route]))
    
    # 5. Analyser la couverture du menu principal
    menu_links = []
    header_path = f"{COMPONENTS_PATH}/layout/Header.tsx"
    megamenu_path = f"{COMPONENTS_PATH}/MegaMenu.tsx"
    
    if os.path.exists(header_path):
        menu_links.extend(extract_links_from_file(header_path))
    if os.path.exists(megamenu_path):
        menu_links.extend(extract_links_from_file(megamenu_path))
    
    menu_links = list(set(menu_links))
    
    # Routes non accessibles depuis le menu
    routes_not_in_menu = []
    for route in routes:
        if ':' in route:
            continue
        if route not in menu_links:
            routes_not_in_menu.append((route, routes[route]))
    
    # Générer le rapport
    report = {
        "total_routes": len(routes),
        "total_unique_links": len(all_links),
        "broken_links": broken_links[:20],  # Top 20
        "orphan_routes": orphan_routes[:30],  # Top 30
        "menu_links_count": len(menu_links),
        "routes_not_in_menu": routes_not_in_menu[:50],  # Top 50
        "routes": list(routes.keys())
    }
    
    return report

if __name__ == "__main__":
    report = analyze_navigation()
    
    print("\n" + "="*60)
    print("📊 RAPPORT D'AUDIT DE NAVIGATION - PERFUMUM")
    print("="*60)
    
    print(f"\n📍 Total routes définies: {report['total_routes']}")
    print(f"🔗 Total liens uniques: {report['total_unique_links']}")
    print(f"📋 Liens dans le menu: {report['menu_links_count']}")
    
    print(f"\n❌ LIENS CASSÉS ({len(report['broken_links'])} trouvés):")
    for link, sources in report['broken_links'][:10]:
        print(f"  - {link}")
        for src in sources[:2]:
            print(f"      → {os.path.basename(src)}")
    
    print(f"\n🚫 PAGES ORPHELINES ({len(report['orphan_routes'])} trouvées):")
    for route, component in report['orphan_routes'][:15]:
        print(f"  - {route} ({component})")
    
    print(f"\n📋 ROUTES NON ACCESSIBLES DEPUIS LE MENU ({len(report['routes_not_in_menu'])} trouvées):")
    for route, component in report['routes_not_in_menu'][:20]:
        print(f"  - {route} ({component})")
    
    # Sauvegarder le rapport complet
    with open(f"{PROJECT_PATH}/navigation-audit-report.json", 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n✅ Rapport complet sauvegardé dans navigation-audit-report.json")
