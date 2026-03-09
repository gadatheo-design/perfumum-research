#!/usr/bin/env python3
"""
Convertit les imports statiques de pages dans App.tsx en React.lazy()
pour activer le code-splitting automatique par page.

Avant:
  import MoleculeDetail from '@/pages/MoleculeDetail';

Après:
  const MoleculeDetail = React.lazy(() => import('@/pages/MoleculeDetail'));
"""

import re
import sys
import shutil
from pathlib import Path

APP_TSX = Path("/home/ubuntu/perfumum-research/client/src/App.tsx")
BACKUP = Path("/home/ubuntu/perfumum-research/client/src/App.tsx.bak")

# Imports à NE PAS convertir en lazy (utilisés au niveau du layout/provider)
KEEP_STATIC = {
    "react",
    "wouter",
    "@tanstack/react-query",
    "@trpc/client",
    "@trpc/react-query",
    "sonner",
    "next-themes",
    "lucide-react",
    # Composants de layout utilisés partout
    "DashboardLayout",
    "DashboardLayoutSkeleton",
    "AuthProvider",
    "ThemeProvider",
    "Toaster",
    # Hooks et contextes
    "useAuth",
    "trpc",
    # Pages critiques (chargées immédiatement)
    "Home",
    "NotFound",
}

def should_keep_static(import_line: str) -> bool:
    """Retourne True si l'import doit rester statique."""
    for keep in KEEP_STATIC:
        if keep in import_line:
            return True
    return False

def convert_default_import(line: str) -> str | None:
    """
    Convertit un import par défaut en React.lazy.
    Ex: import Foo from '@/pages/Foo' → const Foo = React.lazy(() => import('@/pages/Foo'));
    """
    m = re.match(r'^import\s+(\w+)\s+from\s+[\'"]([^"\']+)[\'"];?\s*$', line.strip())
    if m:
        name, path = m.group(1), m.group(2)
        if '/pages/' in path or './pages/' in path:
            return f"const {name} = React.lazy(() => import('{path}'));"
    return None

def convert_named_import(line: str) -> str | None:
    """
    Convertit un import nommé en React.lazy.
    Ex: import { Foo } from '@/pages/Foo' → const Foo = React.lazy(() => import('@/pages/Foo').then(m => ({ default: m.Foo })));
    """
    m = re.match(r'^import\s+\{\s*(\w+)\s*\}\s+from\s+[\'"]([^"\']+)[\'"];?\s*$', line.strip())
    if m:
        name, path = m.group(1), m.group(2)
        if '/pages/' in path or './pages/' in path:
            return f"const {name} = React.lazy(() => import('{path}').then(m => ({{ default: m.{name} }})));"
    return None

def main(dry_run: bool = True):
    content = APP_TSX.read_text()
    lines = content.split('\n')
    
    converted = []
    lazy_count = 0
    kept_count = 0
    
    # Vérifier si React est importé avec lazy
    has_react_import = any('import React' in l or "import * as React" in l for l in lines)
    has_suspense = 'Suspense' in content
    
    for line in lines:
        stripped = line.strip()
        
        # Tenter la conversion si c'est un import de page
        if stripped.startswith('import ') and ('/pages/' in stripped or './pages/' in stripped):
            if should_keep_static(stripped):
                converted.append(line)
                kept_count += 1
                continue
            
            # Essayer import par défaut
            lazy_line = convert_default_import(stripped)
            if not lazy_line:
                # Essayer import nommé
                lazy_line = convert_named_import(stripped)
            
            if lazy_line:
                converted.append(lazy_line)
                lazy_count += 1
                if dry_run:
                    print(f"  LAZY: {stripped[:80]}")
                    print(f"     → {lazy_line[:80]}")
            else:
                # Import complexe (multiple nommés) → garder statique
                converted.append(line)
                kept_count += 1
                if dry_run:
                    print(f"  KEEP (complex): {stripped[:80]}")
        else:
            converted.append(line)
    
    print(f"\n{'DRY-RUN' if dry_run else 'APPLIED'}: {lazy_count} imports convertis en lazy, {kept_count} gardés statiques")
    
    if not dry_run:
        # Backup
        shutil.copy(APP_TSX, BACKUP)
        print(f"Backup: {BACKUP}")
        
        new_content = '\n'.join(converted)
        
        # S'assurer que React est importé correctement pour React.lazy
        if not has_react_import:
            new_content = new_content.replace(
                "import { useState,",
                "import React, { useState,",
                1
            )
            # Si pas trouvé, ajouter au début
            if "import React" not in new_content:
                new_content = "import React, { Suspense } from 'react';\n" + new_content
        
        # Ajouter Suspense si pas présent
        if not has_suspense and 'Suspense' not in new_content:
            new_content = new_content.replace(
                "import { useState,",
                "import { Suspense, useState,",
                1
            )
        
        APP_TSX.write_text(new_content)
        print(f"✓ App.tsx mis à jour ({lazy_count} imports lazy)")
        
        # Vérifier que Suspense est utilisé dans le JSX
        if '<Suspense' not in new_content:
            print("⚠️  Suspense doit être ajouté manuellement dans le JSX de App.tsx")
            print("   Enveloppez les <Route> dans : <Suspense fallback={<div>Chargement...</div>}>")

if __name__ == "__main__":
    dry = "--apply" not in sys.argv
    main(dry_run=dry)
