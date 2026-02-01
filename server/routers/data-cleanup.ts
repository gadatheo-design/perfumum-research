/**
 * Router tRPC pour le nettoyage et l'enrichissement des données
 */
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { 
  analyzeDuplicates, 
  mergeDuplicates, 
  enrichWithFormulas,
  DUPLICATES_TO_MERGE,
  MOLECULE_FORMULAS
} from "../data-cleanup";
import {
  analyzeLinkCoverage,
  getMoleculesWithoutRecettes,
  getMoleculesWithoutPlants,
  getPlantsWithoutMolecules
} from "../link-analysis";
import { getDb } from "../db";
import { molecules } from "../../drizzle/schema";
import { sql, eq } from "drizzle-orm";

export const dataCleanupRouter = router({
  // Analyser les doublons
  analyzeDuplicates: publicProcedure.query(async () => {
    return await analyzeDuplicates();
  }),
  
  // Obtenir la liste des doublons à fusionner
  getDuplicatesToMerge: publicProcedure.query(() => {
    return DUPLICATES_TO_MERGE;
  }),
  
  // Prévisualiser la fusion des doublons (dry run)
  previewMergeDuplicates: publicProcedure.query(async () => {
    return await mergeDuplicates(true);
  }),
  
  // Exécuter la fusion des doublons
  executeMergeDuplicates: protectedProcedure.mutation(async () => {
    return await mergeDuplicates(false);
  }),
  
  // Prévisualiser l'enrichissement des formules
  previewEnrichFormulas: publicProcedure.query(async () => {
    return await enrichWithFormulas(true);
  }),
  
  // Exécuter l'enrichissement des formules
  executeEnrichFormulas: protectedProcedure.mutation(async () => {
    return await enrichWithFormulas(false);
  }),
  
  // Obtenir les statistiques de qualité des données
  getDataQualityStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;
    
    const allMolecules = await db.select().from(molecules);
    const total = allMolecules.length;
    
    const stats = {
      total,
      casNumber: {
        filled: allMolecules.filter(m => m.casNumber).length,
        percentage: 0
      },
      iupacName: {
        filled: allMolecules.filter(m => m.iupacName).length,
        percentage: 0
      },
      formula: {
        filled: allMolecules.filter(m => m.chemicalFormula).length,
        percentage: 0
      },
      chemicalClass: {
        filled: allMolecules.filter(m => m.chemicalClass).length,
        percentage: 0
      },
      olfactiveProfile: {
        filled: allMolecules.filter(m => m.olfactiveProfile).length,
        percentage: 0
      },
      smiles: {
        filled: allMolecules.filter(m => m.smiles).length,
        percentage: 0
      },
      molecularWeight: {
        filled: allMolecules.filter(m => m.molecularWeight).length,
        percentage: 0
      },
      boilingPoint: {
        filled: allMolecules.filter(m => m.boilingPoint).length,
        percentage: 0
      },
      pubchemCid: {
        filled: allMolecules.filter(m => m.pubchemCid).length,
        percentage: 0
      }
    };
    
    // Calculer les pourcentages
    Object.keys(stats).forEach(key => {
      if (key !== 'total' && typeof stats[key as keyof typeof stats] === 'object') {
        const field = stats[key as keyof typeof stats] as { filled: number; percentage: number };
        field.percentage = Math.round((field.filled / total) * 1000) / 10;
      }
    });
    
    return stats;
  }),
  
  // Obtenir les molécules sans formule
  getMoleculesWithoutFormula: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const result = await db
      .select({
        id: molecules.id,
        name: molecules.name,
        casNumber: molecules.casNumber,
        chemicalClass: molecules.chemicalClass
      })
      .from(molecules)
      .where(sql`${molecules.chemicalFormula} IS NULL OR ${molecules.chemicalFormula} = ''`)
      .limit(100);
    
    return result;
  }),
  
  // Obtenir les formules de référence disponibles
  getAvailableFormulas: publicProcedure.query(() => {
    return Object.entries(MOLECULE_FORMULAS).map(([name, data]) => ({
      name,
      ...data
    }));
  }),
  
  // Mettre à jour une molécule individuelle
  updateMolecule: protectedProcedure
    .input(z.object({
      id: z.number(),
      formula: z.string().optional(),
      smiles: z.string().optional(),
      molecularWeight: z.string().optional(),
      iupacName: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database not available" };
      
      const updateData: Record<string, string | null> = {};
      if (input.formula !== undefined) updateData.chemicalFormula = input.formula || null;
      if (input.smiles !== undefined) updateData.smiles = input.smiles || null;
      if (input.molecularWeight !== undefined) updateData.molecularWeight = input.molecularWeight || null;
      if (input.iupacName !== undefined) updateData.iupacName = input.iupacName || null;
      
      if (Object.keys(updateData).length === 0) {
        return { success: false, error: "No fields to update" };
      }
      
      await db.update(molecules).set(updateData).where(eq(molecules.id, input.id));
      
      return { success: true, id: input.id };
    }),
  
  // Supprimer un doublon spécifique
  deleteDuplicate: protectedProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database not available" };
      
      await db.delete(molecules).where(eq(molecules.id, input.id));
      
      return { success: true, deletedId: input.id };
    }),
  
  // Analyse des liaisons entre entités
  analyzeLinkCoverage: publicProcedure.query(async () => {
    return await analyzeLinkCoverage();
  }),
  
  // Obtenir les molécules sans liaison avec des recettes
  getMoleculesWithoutRecettes: publicProcedure
    .input(z.object({ limit: z.number().optional().default(50) }).optional())
    .query(async ({ input }) => {
      return await getMoleculesWithoutRecettes(input?.limit || 50);
    }),
  
  // Obtenir les molécules sans liaison avec des plantes
  getMoleculesWithoutPlants: publicProcedure
    .input(z.object({ limit: z.number().optional().default(50) }).optional())
    .query(async ({ input }) => {
      return await getMoleculesWithoutPlants(input?.limit || 50);
    }),
  
  // Obtenir les plantes sans molécules associées
  getPlantsWithoutMolecules: publicProcedure
    .input(z.object({ limit: z.number().optional().default(50) }).optional())
    .query(async ({ input }) => {
      return await getPlantsWithoutMolecules(input?.limit || 50);
    })
});
