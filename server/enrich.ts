/**
 * Endpoint tRPC pour l'enrichissement automatique des liaisons molécules-recettes
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { molecules, recettes, moleculesRecettes } from "../drizzle/schema";
import { eq, isNull, sql } from "drizzle-orm";

// Mapping des gammes vers des mots-clés olfactifs
const gammeKeywords: Record<string, string[]> = {
  'Pétrichor': ['terre', 'pluie', 'humide', 'minéral', 'géosmine', 'mousse', 'vétiver', 'patchouli'],
  'Volcanique': ['fumée', 'soufre', 'cendre', 'pierre', 'minéral', 'chaud', 'cade', 'goudron'],
  'Glaciaire': ['froid', 'menthe', 'eucalyptus', 'pin', 'frais', 'cristal', 'camphre'],
  'Colombie': ['café', 'cacao', 'tabac', 'terre', 'bois', 'épice', 'vanille'],
  'Civilisations': ['encens', 'résine', 'myrrhe', 'oliban', 'bois', 'sacré', 'benjoin'],
  'Mossi': ['karité', 'beurre', 'doux', 'crémeux', 'lactone', 'lait']
};

// Mapping des catégories vers des profils olfactifs
const categoryProfiles: Record<string, string[]> = {
  'tabac': ['tabac', 'foin', 'miel', 'cuir', 'fumée'],
  'resine': ['résine', 'bois', 'baumier', 'ambré', 'épicé'],
  'encens': ['encens', 'oliban', 'myrrhe', 'sacré', 'fumée'],
  'parfum': ['floral', 'fruité', 'boisé', 'musqué'],
  'cone': ['bois', 'résine', 'épicé', 'fumée'],
  'extrait': ['concentré', 'intense', 'riche']
};

// Fonction pour calculer un score de pertinence molécule-recette
function calculateRelevanceScore(molecule: any, recipe: any): number {
  let score = 0;
  
  const molProfile = (molecule.olfactiveProfile || '').toLowerCase();
  const molName = (molecule.name || '').toLowerCase();
  
  // Correspondance par gamme
  const recipeGamme = recipe.gamme || '';
  const keywords = gammeKeywords[recipeGamme] || [];
  keywords.forEach(kw => {
    if (molProfile.includes(kw) || molName.includes(kw)) {
      score += 15;
    }
  });
  
  // Correspondance par catégorie
  const catKeywords = categoryProfiles[recipe.category] || [];
  catKeywords.forEach(kw => {
    if (molProfile.includes(kw) || molName.includes(kw)) {
      score += 12;
    }
  });
  
  // Correspondance par texture
  if (recipe.texture && molProfile.includes(recipe.texture.toLowerCase())) {
    score += 10;
  }
  
  // Correspondance par notes (tête/cœur/fond)
  const allNotes = [recipe.notesTete, recipe.notesCoeur, recipe.notesFond]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  
  if (allNotes) {
    const noteWords = allNotes.split(/\s+/).filter((w: string) => w.length > 3);
    noteWords.forEach((word: string) => {
      if (molProfile.includes(word) || molName.includes(word)) {
        score += 5;
      }
    });
  }
  
  // Bonus pour molécules communes et polyvalentes
  const commonMolecules = ['linalol', 'géraniol', 'limonène', 'pinène', 'caryophyllène', 'eugénol'];
  if (commonMolecules.some(cm => molName.includes(cm))) {
    score += 5;
  }
  
  // Bonus aléatoire pour diversité (0-3 points)
  score += Math.floor(Math.random() * 4);
  
  return score;
}

// Fonction pour déterminer le rôle olfactif basé sur la volatilité
function determineRole(molecule: any): 'tête' | 'cœur' | 'fond' {
  const vol = molecule.volatility || 50;
  if (vol >= 70) return 'tête';
  if (vol >= 40) return 'cœur';
  return 'fond';
}

// Endpoint pour enrichir toutes les recettes orphelines
export const enrichOrphanRecipes = publicProcedure
  .input(z.object({
    dryRun: z.boolean().optional().default(false),
    limit: z.number().optional().default(50)
  }))
  .mutation(async ({ input }: { input: { dryRun: boolean; limit: number } }) => {
    const { dryRun, limit } = input;
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    // Récupérer toutes les recettes orphelines (sans molécules)
    const orphanRecipes = await db
      .select()
      .from(recettes)
      .leftJoin(moleculesRecettes, eq(recettes.id, moleculesRecettes.recetteId))
      .where(isNull(moleculesRecettes.recetteId))
      .limit(limit);
    
    // Récupérer toutes les molécules
    const allMolecules = await db.select().from(molecules);
    
    const results = [];
    
    for (const { recettes: recipe } of orphanRecipes) {
      if (!recipe) continue;
      
      // Calculer les scores pour toutes les molécules
      const scoredMolecules = allMolecules.map((mol: any) => ({
        molecule: mol,
        score: calculateRelevanceScore(mol, recipe)
      }));
      
      // Trier par score décroissant
      scoredMolecules.sort((a: any, b: any) => b.score - a.score);
      
      // Sélectionner les 6-8 meilleures molécules
      const numMolecules = 6 + Math.floor(Math.random() * 3); // 6-8 molécules
      const topMolecules = scoredMolecules.slice(0, numMolecules);
      
      // Répartir les proportions de façon réaliste
      const roles = topMolecules.map((tm: any) => determineRole(tm.molecule));
      const teteCount = roles.filter((r: string) => r === 'tête').length || 1;
      const coeurCount = roles.filter((r: string) => r === 'cœur').length || 1;
      const fondCount = roles.filter((r: string) => r === 'fond').length || 1;
      
      const teteTotal = 20 + Math.floor(Math.random() * 15); // 20-35%
      const coeurTotal = 35 + Math.floor(Math.random() * 15); // 35-50%
      const fondTotal = 100 - teteTotal - coeurTotal; // Reste
      
      const selectedMolecules = topMolecules.map((tm: any, i: number): { molecule: any; proportion: number; role: 'tête' | 'cœur' | 'fond' } => {
        const role = roles[i];
        let proportion;
        
        if (role === 'tête') {
          proportion = Math.round(teteTotal / teteCount);
        } else if (role === 'cœur') {
          proportion = Math.round(coeurTotal / coeurCount);
        } else {
          proportion = Math.round(fondTotal / fondCount);
        }
        
        return {
          molecule: tm.molecule,
          proportion: Math.max(5, Math.min(40, proportion)), // Entre 5% et 40%
          role
        };
      });
      
      // Normaliser pour que la somme = 100%
      const totalProp = selectedMolecules.reduce((sum: number, sm: any) => sum + sm.proportion, 0);
      if (totalProp !== 100) {
        const factor = 100 / totalProp;
        selectedMolecules.forEach((sm: any) => {
          sm.proportion = Math.round(sm.proportion * factor);
        });
        
        // Ajuster le dernier pour atteindre exactement 100%
        const newTotal = selectedMolecules.reduce((sum: number, sm: any) => sum + sm.proportion, 0);
        selectedMolecules[selectedMolecules.length - 1].proportion += (100 - newTotal);
      }
      
      // Insérer les liaisons dans la base de données (si pas en dry run)
      if (!dryRun) {
        for (const sm of selectedMolecules) {
          try {
            await db.insert(moleculesRecettes).values({
              moleculeId: sm.molecule.id,
              recetteId: recipe.id,
              proportion: sm.proportion.toString(),
              role: sm.role,
              notes: 'Auto-généré par enrichissement automatique'
            });
          } catch (err) {
            // Ignorer les doublons
            console.error(`Erreur insertion: ${err}`);
          }
        }
      }
      
      results.push({
        recipeId: recipe.id,
        recipeName: recipe.name,
        gamme: recipe.gamme,
        moleculesAdded: selectedMolecules.length,
        molecules: selectedMolecules.map((sm: any) => ({
          id: sm.molecule.id,
          name: sm.molecule.name,
          proportion: sm.proportion,
          role: sm.role
        }))
      });
    }
    
    return {
      success: true,
      dryRun,
      recipesProcessed: results.length,
      totalLinksCreated: results.reduce((sum: number, r: any) => sum + r.moleculesAdded, 0),
      results
    };
  });
