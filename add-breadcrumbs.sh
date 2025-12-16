#!/bin/bash

# List of pages to add Breadcrumbs (excluding Home, Molecules already has it)
PAGES=(
  "ResinesCBD"
  "Accords"
  "Recettes"
  "Laboratoire"
  "LaboratoireRecettes"
  "Glossaire"
  "Prototypes"
  "Familles"
  "GammesMossi"
  "ChemicalFamilies"
  "Gammes"
  "GammesPetrichor"
  "GammesVolcanique"
  "Civilisations"
  "CivilisationDetail"
  "Installations"
  "Reseau"
  "Recherche"
)

for page in "${PAGES[@]}"; do
  FILE="/home/ubuntu/perfumum-research/client/src/pages/${page}.tsx"
  
  if [ -f "$FILE" ]; then
    # Check if Breadcrumbs is already imported
    if ! grep -q "import { Breadcrumbs }" "$FILE"; then
      echo "Adding Breadcrumbs to $page..."
      
      # Add import after first import line
      sed -i '1a import { Breadcrumbs } from "@/components/Breadcrumbs";' "$FILE"
      
      # Add <Breadcrumbs /> after first <div> in return statement
      # This is a simplified approach - might need manual adjustment for some pages
      sed -i '0,/<div className="min-h-screen/s//<div className="min-h-screen/; /<div className="min-h-screen/a\      <Breadcrumbs \/>/' "$FILE"
      
      echo "✓ $page updated"
    else
      echo "○ $page already has Breadcrumbs"
    fi
  else
    echo "✗ $page not found"
  fi
done

echo ""
echo "Done! Please review the changes and test the pages."
