#!/usr/bin/env python3
"""
Script d'audit de navigation pour PERFUMUM
Analyse les routes, les liens et identifie les problèmes de navigation
"""

import json
import os
import re
from collections import defaultdict
from pathlib import Path

PROJECT_PATH = str(Path(__file__).resolve().parent)
PAGES_PATH = f"{PROJECT_PATH}/client/src/pages"
COMPONENTS_PATH = f"{PROJECT_PATH}/client/src/components"
APP_TSX_PATH = f"{PROJECT_PATH}/client/src/App.tsx"


def extract_routes_from_app():
    """Extrait toutes les routes définies dans App.tsx."""
    routes = {}
    with open(APP_TSX_PATH, "r") as f:
        content = f.read()

    # Capture <Route ... path="..."> et <LazyRoute ... path="...">
    pattern = r'<(?:Route|LazyRoute)\s+path=["\']([^"\']+)["\']'
    for path in re.findall(pattern, content):
        routes[path] = "Route"

    return routes


def extract_links_from_file(filepath):
    """Extrait les liens de navigation statiques d'un fichier TSX."""
    links = []
    try:
        with open(filepath, "r") as f:
            content = f.read()

        # <Link href="..."> ou <Link href='...'>
        links.extend(re.findall(r'<Link[^>]*href=["\']([^"\']+)["\']', content))

        # navigate("...") ou navigate('...')
        links.extend(re.findall(r'navigate\(["\']([^"\']+)["\']\)', content))

        # window.location.href = "..."
        links.extend(re.findall(r'window\.location\.href\s*=\s*["\']([^"\']+)["\']', content))
    except Exception:
        pass

    return list(set(links))


def get_all_tsx_in(path):
    files = []
    for root, _, filenames in os.walk(path):
        for filename in filenames:
            if filename.endswith(".tsx"):
                files.append(os.path.join(root, filename))
    return files


def normalize_link(link):
    if "?" in link:
        link = link.split("?", 1)[0]
    return link


def analyze_navigation():
    routes = extract_routes_from_app()
    print(f"📍 Routes définies: {len(routes)}")

    all_links = defaultdict(list)
    for filepath in get_all_tsx_in(PAGES_PATH) + get_all_tsx_in(COMPONENTS_PATH):
        for link in extract_links_from_file(filepath):
            all_links[link].append(filepath)

    print(f"🔗 Liens uniques trouvés: {len(all_links)}")

    broken_links = []
    for raw_link, sources in all_links.items():
        if raw_link.startswith(("http", "#", "mailto:")):
            continue
        if not raw_link.startswith("/"):
            continue
        if raw_link.startswith("/api/"):
            continue
        link = normalize_link(raw_link)
        if ":" in link:
            continue

        if link not in routes:
            found = False
            for route in routes:
                if ":" in route:
                    route_pattern = re.sub(r":\w+", r"[^/]+", route)
                    if re.match(f"^{route_pattern}$", link):
                        found = True
                        break
            if not found:
                broken_links.append((link, sources))

    linked_routes = {normalize_link(link) for link in all_links.keys()}

    orphan_routes = []
    for route in routes:
        if ":" in route:
            continue
        if route not in linked_routes:
            orphan_routes.append((route, routes[route]))

    menu_links = []
    menu_candidates = [
        f"{COMPONENTS_PATH}/layout/Header.tsx",
        f"{COMPONENTS_PATH}/MegaMenu.tsx",
        f"{COMPONENTS_PATH}/MegaMenuOptimized.tsx",
        f"{COMPONENTS_PATH}/MobileMenu.tsx",
        f"{COMPONENTS_PATH}/MobileBottomNav.tsx",
    ]
    for menu_path in menu_candidates:
        if os.path.exists(menu_path):
            menu_links.extend(extract_links_from_file(menu_path))

    menu_links = list(set(normalize_link(link) for link in menu_links))

    routes_not_in_menu = []
    for route in routes:
        if ":" in route:
            continue
        if route not in menu_links:
            routes_not_in_menu.append((route, routes[route]))

    return {
        "total_routes": len(routes),
        "total_unique_links": len(all_links),
        "broken_links": broken_links[:20],
        "orphan_routes": orphan_routes[:30],
        "menu_links_count": len(menu_links),
        "routes_not_in_menu": routes_not_in_menu[:50],
        "routes": list(routes.keys()),
    }


if __name__ == "__main__":
    if not os.path.exists(APP_TSX_PATH):
        raise SystemExit(
            f"❌ App.tsx introuvable ({APP_TSX_PATH}). Lancez ce script depuis le repo PERFUMUM."
        )

    report = analyze_navigation()

    print("\n" + "=" * 60)
    print("📊 RAPPORT D'AUDIT DE NAVIGATION - PERFUMUM")
    print("=" * 60)

    print(f"\n📍 Total routes définies: {report['total_routes']}")
    print(f"🔗 Total liens uniques: {report['total_unique_links']}")
    print(f"📋 Liens dans le menu: {report['menu_links_count']}")

    print(f"\n❌ LIENS CASSÉS ({len(report['broken_links'])} trouvés):")
    for link, sources in report["broken_links"][:10]:
        print(f"  - {link}")
        for src in sources[:2]:
            print(f"      → {os.path.basename(src)}")

    print(f"\n🚫 PAGES ORPHELINES ({len(report['orphan_routes'])} trouvées):")
    for route, component in report["orphan_routes"][:15]:
        print(f"  - {route} ({component})")

    print(
        f"\n📋 ROUTES NON ACCESSIBLES DEPUIS LE MENU ({len(report['routes_not_in_menu'])} trouvées):"
    )
    for route, component in report["routes_not_in_menu"][:20]:
        print(f"  - {route} ({component})")

    with open(f"{PROJECT_PATH}/navigation-audit-report.json", "w") as f:
        json.dump(report, f, indent=2)

    print("\n✅ Rapport complet sauvegardé dans navigation-audit-report.json")
