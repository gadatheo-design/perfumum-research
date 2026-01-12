#!/bin/bash

# Liste des fichiers à modifier (sans Breadcrumbs ni DashboardLayout)
FILES=(
  "AdminHistorique"
  "AdminReferences"
  "AlternativesDurables"
  "ArchivesOlfactives"
  "BatchImport"
  "BotaniqueCritique"
  "CarteVarietes"
  "Chemotypes"
  "ColombieLine"
  "ComparaisonTerpenes"
  "CrossSearch"
  "EnrichissementPubChem"
  "ExportBibliographique"
  "ExtractionMethods"
  "FinalRecipes"
  "GhostVarietiesExplorer"
  "GhostVarietyDetail"
  "GhostVarietyForm"
  "GhostVarietyImageUpload"
  "HistoriqueFormules"
  "Ifra"
  "ImportCSV"
  "InteractionsTabacCannabis"
  "LeafEconomies"
  "LeafEconomyForm"
  "LiaisonRecettesMolecules"
  "MoleculePlantRelations"
  "OutilFormulation"
  "PatrimoineMenace"
  "PlantTerroirNetwork"
  "PlantVarieties"
  "Plants"
  "RadarCorrelationHeatmap"
  "RawMaterialForm"
  "RawMaterials"
  "RecettesLeafEconomies"
  "RecettesTL"
  "RechercheGlobale"
  "RechercheRadicale"
  "RecipeNetworkPage"
  "RecipeTimeline"
  "ReferencesV3"
  "SystemePerfumum"
  "TerpProfiles"
  "TerpProfilesCompare"
  "TerroirMapPage"
  "TimelineBotanique"
  "VarietesFantomes"
  "VarietyForm"
  "VisualisationsCorrelation"
)

# Pages dans des sous-dossiers
SUBDIR_FILES=(
  "methodologie/EchelleAbsorbe"
  "methodologie/GCMS"
  "methodologie/MethodologieAbsorbe"
  "methodologie/Pyrolyse"
  "prototypes/C1"
  "prototypes/C2"
  "prototypes/C3"
  "prototypes/C4"
  "admin/LiaisonRecettesMolecules"
)

echo "Ajout des Breadcrumbs aux pages..."
count=0

for file in "${FILES[@]}"; do
  filepath="client/src/pages/${file}.tsx"
  if [ -f "$filepath" ]; then
    # Vérifier si Breadcrumbs n'est pas déjà présent
    if ! grep -q "Breadcrumbs" "$filepath"; then
      # Ajouter l'import après le dernier import existant
      sed -i '/^import.*from/a import { Breadcrumbs } from "@/components/Breadcrumbs";' "$filepath"
      # Supprimer les imports dupliqués
      awk '!seen[$0]++' "$filepath" > tmp && mv tmp "$filepath"
      echo "✅ $file"
      ((count++))
    fi
  fi
done

for file in "${SUBDIR_FILES[@]}"; do
  filepath="client/src/pages/${file}.tsx"
  if [ -f "$filepath" ]; then
    if ! grep -q "Breadcrumbs" "$filepath"; then
      sed -i '/^import.*from/a import { Breadcrumbs } from "@/components/Breadcrumbs";' "$filepath"
      awk '!seen[$0]++' "$filepath" > tmp && mv tmp "$filepath"
      echo "✅ $file"
      ((count++))
    fi
  fi
done

echo ""
echo "Total: $count fichiers modifiés avec import Breadcrumbs"
