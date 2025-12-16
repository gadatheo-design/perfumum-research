import { drizzle } from "drizzle-orm/mysql2";
import { recettes } from "../drizzle/schema.ts";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Lire le fichier arch_2.txt
const archContent = readFileSync("/home/ubuntu/upload/arch_2.txt", "utf-8");

// Parser les recettes depuis le fichier
function parseRecettes(content) {
  const recettesList = [];
  const lines = content.split("\n");
  
  let currentRecette = null;
  let currentIngredients = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Détecter le début d'une nouvelle recette
    const recetteMatch = line.match(/^##\s+RECETTE\s+(\d+)\s+[—-]\s+(.+)$/);
    if (recetteMatch) {
      // Sauvegarder la recette précédente si elle existe
      if (currentRecette) {
        recettesList.push({
          ...currentRecette,
          formula: currentIngredients.join("\n"),
        });
      }
      
      // Commencer une nouvelle recette
      currentRecette = {
        name: recetteMatch[2].trim(),
        recetteNumber: parseInt(recetteMatch[1]),
        category: "parfum", // Catégorie par défaut
      };
      currentIngredients = [];
      continue;
    }
    
    // Détecter les ingrédients (lignes avec des pourcentages ou "trace")
    if (currentRecette && line.match(/^[-•]\s+(.+?)\s*:\s*(.+)$/)) {
      const ingredientMatch = line.match(/^[-•]\s+(.+?)\s*:\s*(.+)$/);
      if (ingredientMatch) {
        const ingredient = ingredientMatch[1].trim();
        const quantity = ingredientMatch[2].trim();
        currentIngredients.push(`${ingredient}: ${quantity}`);
      }
    }
  }
  
  // Ajouter la dernière recette
  if (currentRecette) {
    recettesList.push({
      ...currentRecette,
      formula: currentIngredients.join("\n"),
    });
  }
  
  return recettesList;
}

async function importRecettes() {
  console.log("🚀 Début de l'import des recettes...\n");

  try {
    const recettesList = parseRecettes(archContent);
    
    console.log(`📊 Total de recettes trouvées: ${recettesList.length}\n`);
    
    let imported = 0;
    let skipped = 0;
    
    for (const recette of recettesList) {
      // Ne pas importer les recettes sans ingrédients
      if (!recette.formula || recette.formula.trim() === "") {
        skipped++;
        continue;
      }
      
      console.log(`📝 Import de la recette ${recette.recetteNumber}: ${recette.name}...`);
      
      try {
        await db.insert(recettes).values({
          name: recette.name,
          category: recette.category,
          formula: recette.formula,
          intensity: 5, // Valeur par défaut
          stability: "medium", // Valeur par défaut
        });
        
        imported++;
        console.log(`✅ ${recette.name} importée avec succès`);
      } catch (error) {
        console.error(`❌ Erreur lors de l'import de ${recette.name}:`, error.message);
      }
    }

    console.log("\n🎉 Import terminé !");
    console.log(`📊 Résumé: ${imported} recettes importées, ${skipped} ignorées`);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

importRecettes();
