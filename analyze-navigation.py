#!/usr/bin/env python3
"""Audit de navigation PERFUMUM.

- Extrait les routes déclarées dans App.tsx
- Extrait les liens internes depuis les pages/composants
- Détecte liens cassés, routes orphelines, et couverture menu
"""

from __future__ import annotations

import json
import os
import re
from collections import defaultdict
from pathlib import Path

PROJECT_PATH = Path(__file__).resolve().parent
PAGES_PATH = PROJECT_PATH / "client/src/pages"
COMPONENTS_PATH = PROJECT_PATH / "client/src/components"
APP_TSX_PATH = PROJECT_PATH / "client/src/App.tsx"
REPORT_PATH = PROJECT_PATH / "navigation-audit-report.json"

MENU_CANDIDATES = [
    COMPONENTS_PATH / "layout/Header.tsx",
    COMPONENTS_PATH / "MegaMenu.tsx",
    COMPONENTS_PATH / "MegaMenuOptimized.tsx",
    COMPONENTS_PATH / "MobileMenu.tsx",
    COMPONENTS_PATH / "MobileBottomNav.tsx",
]

EXCLUDED_PREFIXES = (
    "http",
    "#",
    "mailto:",
    "tel:",
    "/api/",
)


def normalize_link(link: str) -> str:
    """Normalise un lien interne pour comparaison de routes."""
    if not link:
        return link
    link = link.strip()
    if "?" in link:
        link = link.split("?", 1)[0]
    if "#" in link:
        link = link.split("#", 1)[0]
    if len(link) > 1 and link.endswith("/"):
        link = link.rstrip("/")
    return link


def should_ignore_link(link: str) -> bool:
    if not link:
        return True
    if not link.startswith("/"):
        return True
    return link.startswith(EXCLUDED_PREFIXES)


def extract_routes_from_app() -> dict[str, str]:
    """Extrait toutes les routes déclarées via Route/LazyRoute dans App.tsx."""
    content = APP_TSX_PATH.read_text(encoding="utf-8")
    pattern = r'<(?:Route|LazyRoute)\s+path=["\']([^"\']+)["\']'
    routes: dict[str, str] = {}
    for route in re.findall(pattern, content):
        routes[normalize_link(route)] = "Route"
    return routes


def extract_links_from_file(filepath: Path) -> list[str]:
    """Extrait les liens statiques internes d'un fichier TS/TSX."""
    try:
        content = filepath.read_text(encoding="utf-8")
    except Exception:
        return []

    links: set[str] = set()
    patterns = [
        r'<Link[^>]*href=["\']([^"\']+)["\']',
        r'<a[^>]*href=["\']([^"\']+)["\']',
        r'navigate\(["\']([^"\']+)["\']\)',
        r'window\.location\.href\s*=\s*["\']([^"\']+)["\']',
        r'\b(?:href|path|to)\s*:\s*["\']([^"\']+)["\']',
    ]

    for pattern in patterns:
        links.update(re.findall(pattern, content))

    return sorted(links)


def get_all_tsx_in(path: Path) -> list[Path]:
    return [p for p in path.rglob("*.tsx") if p.is_file()]


def match_dynamic_route(link: str, routes: dict[str, str]) -> bool:
    for route in routes:
        if ":" not in route:
            continue
        route_pattern = re.sub(r":\w+", r"[^/]+", route)
        if re.match(f"^{route_pattern}$", link):
            return True
    return False


def analyze_navigation() -> dict:
    routes = extract_routes_from_app()
    print(f"📍 Routes définies: {len(routes)}")

    all_links: dict[str, list[str]] = defaultdict(list)
    for filepath in get_all_tsx_in(PAGES_PATH) + get_all_tsx_in(COMPONENTS_PATH):
        for raw_link in extract_links_from_file(filepath):
            normalized = normalize_link(raw_link)
            if not normalized:
                continue
            all_links[normalized].append(str(filepath.relative_to(PROJECT_PATH)))

    print(f"🔗 Liens uniques trouvés: {len(all_links)}")

    broken_links: list[tuple[str, list[str]]] = []
    for link, sources in sorted(all_links.items()):
        if should_ignore_link(link):
            continue
        if ":" in link:
            continue

        if link not in routes and not match_dynamic_route(link, routes):
            broken_links.append((link, sorted(set(sources))))

    linked_routes = {
        link
        for link in all_links.keys()
        if not should_ignore_link(link)
    }

    orphan_routes = [
        (route, routes[route])
        for route in sorted(routes.keys())
        if ":" not in route and route not in linked_routes
    ]

    menu_links: set[str] = set()
    for menu_path in MENU_CANDIDATES:
        if menu_path.exists():
            menu_links.update(normalize_link(link) for link in extract_links_from_file(menu_path))

    menu_links = {link for link in menu_links if not should_ignore_link(link)}

    routes_not_in_menu = [
        (route, routes[route])
        for route in sorted(routes.keys())
        if ":" not in route and route not in menu_links
    ]

    return {
        "total_routes": len(routes),
        "total_unique_links": len(all_links),
        "broken_links": broken_links,
        "orphan_routes": orphan_routes[:100],
        "menu_links_count": len(menu_links),
        "routes_not_in_menu": routes_not_in_menu[:200],
        "routes": sorted(routes.keys()),
    }


def main() -> int:
    if not APP_TSX_PATH.exists():
        raise SystemExit(f"❌ App.tsx introuvable: {APP_TSX_PATH}")

    report = analyze_navigation()

    print("\n" + "=" * 60)
    print("📊 RAPPORT D'AUDIT DE NAVIGATION - PERFUMUM")
    print("=" * 60)

    print(f"\n📍 Total routes définies: {report['total_routes']}")
    print(f"🔗 Total liens uniques: {report['total_unique_links']}")
    print(f"📋 Liens dans le menu: {report['menu_links_count']}")

    print(f"\n❌ LIENS CASSÉS ({len(report['broken_links'])} trouvés):")
    for link, sources in report["broken_links"][:15]:
        print(f"  - {link}")
        for src in sources[:3]:
            print(f"      → {Path(src).name}")

    print(f"\n🚫 PAGES ORPHELINES ({len(report['orphan_routes'])} trouvées, top 15):")
    for route, component in report["orphan_routes"][:15]:
        print(f"  - {route} ({component})")

    print(
        f"\n📋 ROUTES NON ACCESSIBLES DEPUIS LE MENU ({len(report['routes_not_in_menu'])} trouvées, top 20):"
    )
    for route, component in report["routes_not_in_menu"][:20]:
        print(f"  - {route} ({component})")

    REPORT_PATH.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\n✅ Rapport complet sauvegardé dans {REPORT_PATH.name}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
