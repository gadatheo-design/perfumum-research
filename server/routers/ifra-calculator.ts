import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const ifraCalculatorRouter = router({
  // Vérifier la conformité d'une formule complète
  checkFormula: publicProcedure
    .input(z.object({
      categoryCode: z.string(),
      ingredients: z.array(z.object({
        moleculeId: z.number(),
        concentration: z.number(), // % dans la formule finale
      })),
    }))
    .query(async ({ input }) => {
      const restrictions = await db.getAllIfraRestrictions();
      const results: Array<{
        moleculeId: number;
        moleculeName: string;
        concentration: number;
        limit: number | null;
        isCompliant: boolean;
        margin: number | null;
        restrictionType: string;
      }> = [];
      
      // Mapping des codes de catégorie vers les colonnes
      const categoryMap: Record<string, string> = {
        '1': 'category1',
        '2': 'category2',
        '3': 'category3',
        '4': 'category4',
        '5A': 'category5a',
        '5B': 'category5b',
        '5C': 'category5c',
        '5D': 'category5d',
        '6': 'category6',
        '7A': 'category7a',
        '7B': 'category7b',
        '8': 'category8',
        '9': 'category9',
        '10A': 'category10a',
        '10B': 'category10b',
        '11A': 'category11a',
        '11B': 'category11b',
      };
      
      const column = categoryMap[input.categoryCode.toUpperCase()];
      
      for (const ingredient of input.ingredients) {
        const restriction = restrictions.find((r) => r.molecule.id === ingredient.moleculeId);
        
        if (!restriction) {
          // Pas de restriction connue
          results.push({
            moleculeId: ingredient.moleculeId,
            moleculeName: 'Molécule inconnue',
            concentration: ingredient.concentration,
            limit: null,
            isCompliant: true,
            margin: null,
            restrictionType: 'no_restriction',
          });
          continue;
        }
        
        const limit = column ? (restriction.restriction as Record<string,unknown>)[column] : null;
        const limitNum = limit ? parseFloat(String(limit)) : null;
        
        let isCompliant = true;
        let margin: number | null = null;
        
        if (restriction.restriction.restrictionType === 'prohibited') {
          isCompliant = false;
        } else if (limitNum !== null && limitNum > 0) {
          isCompliant = ingredient.concentration <= limitNum;
          margin = limitNum - ingredient.concentration;
        }
        
        results.push({
          moleculeId: ingredient.moleculeId,
          moleculeName: restriction.molecule.name,
          concentration: ingredient.concentration,
          limit: limitNum,
          isCompliant,
          margin,
          restrictionType: restriction.restriction.restrictionType || 'no_restriction',
        });
      }
      
      const allCompliant = results.every(r => r.isCompliant);
      const nonCompliantCount = results.filter(r => !r.isCompliant).length;
      
      return {
        isCompliant: allCompliant,
        nonCompliantCount,
        totalIngredients: input.ingredients.length,
        results,
      };
    }),
  
  // Récupérer les limites pour une catégorie donnée
  getLimitsForCategory: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const restrictions = await db.getAllIfraRestrictions();
      
      const categoryMap: Record<string, string> = {
        '1': 'category1',
        '2': 'category2',
        '3': 'category3',
        '4': 'category4',
        '5A': 'category5a',
        '5B': 'category5b',
        '5C': 'category5c',
        '5D': 'category5d',
        '6': 'category6',
        '7A': 'category7a',
        '7B': 'category7b',
        '8': 'category8',
        '9': 'category9',
        '10A': 'category10a',
        '10B': 'category10b',
        '11A': 'category11a',
        '11B': 'category11b',
      };
      
      const column = categoryMap[input.toUpperCase()];
      
      return restrictions.map((r) => ({
        moleculeId: r.molecule.id,
        moleculeName: r.molecule.name,
        casNumber: r.molecule.casNumber,
        limit: column ? (r.restriction as Record<string,unknown>)[column] : null,
        restrictionType: r.restriction.restrictionType,
        reason: r.restriction.reasonForRestriction,
      })).filter((r) => r.limit !== null || r.restrictionType === 'prohibited');
    }),
})

