#!/usr/bin/env python3
"""
Script pour remplacer "civilisation" par "tradition olfactive" uniquement dans les textes UI,
en préservant les noms techniques (variables, fonctions, routes API).
"""
import re
from pathlib import Path

# Règles de remplacement
REPLACEMENTS = [
    # Textes UI (entre guillemets, balises JSX)
    (r'(>|\"|\')\s*Civilisations\s*(<|\"|\')' , r'\1Traditions Olfactives\2'),
    (r'(>|\"|\')\s*Civilisation\s*(<|\"|\')' , r'\1Tradition Olfactive\2'),
    (r'(>|\"|\')\s*civilisations\s*(<|\"|\')' , r'\1traditions olfactives\2'),
    (r'(>|\"|\')\s*civilisation\s*(<|\"|\')' , r'\1tradition olfactive\2'),
    
    # Descriptions et commentaires
    (r'civilisations documentées', 'traditions olfactives documentées'),
    (r'civilisations antiques', 'cultures antiques'),
    (r'grandes civilisations', 'grandes cultures'),
    (r'Base de Données Civilisations', 'Base de Données Traditions Olfactives'),
    (r'L\'axe <strong>Civilisations</strong>', 'L\'axe <strong>Traditions olfactives</strong>'),
]

# Fichiers à traiter
FILES_TO_PROCESS = [
    'client/src/pages/Civilisations.tsx',
    'client/src/pages/CivilisationDetail.tsx',
]

def replace_in_file(filepath):
    """Applique les remplacements dans un fichier."""
    path = Path(filepath)
    if not path.exists():
        print(f"⚠️  Fichier non trouvé : {filepath}")
        return
    
    content = path.read_text(encoding='utf-8')
    original = content
    
    for pattern, replacement in REPLACEMENTS:
        content = re.sub(pattern, replacement, content)
    
    if content != original:
        path.write_text(content, encoding='utf-8')
        print(f"✅ Modifié : {filepath}")
    else:
        print(f"⏭️  Aucun changement : {filepath}")

if __name__ == '__main__':
    print("🔄 Remplacement 'Civilisation' → 'Tradition olfactive'...\n")
    for file in FILES_TO_PROCESS:
        replace_in_file(file)
    print("\n✅ Terminé !")
