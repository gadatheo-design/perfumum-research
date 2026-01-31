/**
 * Flavornet Router - Descripteurs olfactifs et indices de rétention
 * 
 * Provides endpoints for enriching molecules with olfactory descriptors
 * from the Flavornet database (738 odorants)
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { 
  getFlavornetData, 
  getFlavornetStats, 
  getAllPercepts,
  searchByPercept 
} from "../flavornet";
import * as db from "../db";

export const flavornetRouter = router({
  /**
   * Get Flavornet data for a molecule
   */
  getMoleculeData: publicProcedure
    .input(z.object({
      name: z.string(),
      casNumber: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return getFlavornetData(input.name, input.casNumber);
    }),

  /**
   * Get Flavornet database statistics
   */
  getStats: publicProcedure.query(async () => {
    return getFlavornetStats();
  }),

  /**
   * Get all unique olfactory descriptors
   */
  getAllPercepts: publicProcedure.query(async () => {
    return getAllPercepts();
  }),

  /**
   * Search molecules by olfactory descriptor
   */
  searchByPercept: publicProcedure
    .input(z.object({
      percept: z.string(),
    }))
    .query(async ({ input }) => {
      return searchByPercept(input.percept);
    }),

  /**
   * Enrich a single molecule with Flavornet data
   */
  enrichMolecule: publicProcedure
    .input(z.object({
      moleculeId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const molecule = await db.getMoleculeById(input.moleculeId);
      if (!molecule) {
        return { success: false, message: 'Molécule non trouvée' };
      }

      const flavornetData = getFlavornetData(molecule.name, molecule.casNumber || undefined);
      
      if (!flavornetData) {
        return { 
          success: false, 
          message: 'Molécule non trouvée dans Flavornet'
        };
      }

      // Update the database
      await db.updateMoleculeFlavornetData(input.moleculeId, flavornetData);

      return {
        success: true,
        message: `Molécule enrichie via Flavornet: ${flavornetData.name}`,
        data: {
          percepts: flavornetData.percepts,
          kovatsRI: flavornetData.kovatsRI,
        }
      };
    }),

  /**
   * Batch enrich molecules with Flavornet data
   */
  enrichBatch: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(100),
    }))
    .mutation(async ({ input }) => {
      const molecules = await db.getUnenrichedMoleculesForFlavornet(input.limit);
      
      const results = {
        total: molecules.length,
        enriched: 0,
        withPercepts: 0,
        withKovatsRI: 0,
        errors: 0,
        details: [] as { name: string; success: boolean; percepts?: string[] }[],
      };

      for (const molecule of molecules) {
        try {
          const flavornetData = getFlavornetData(molecule.name, molecule.casNumber || undefined);
          
          if (flavornetData) {
            await db.updateMoleculeFlavornetData(molecule.id, flavornetData);
            
            results.enriched++;
            if (flavornetData.percepts.length > 0) {
              results.withPercepts++;
            }
            if (flavornetData.kovatsRI && Object.keys(flavornetData.kovatsRI).length > 0) {
              results.withKovatsRI++;
            }
            
            results.details.push({
              name: molecule.name,
              success: true,
              percepts: flavornetData.percepts,
            });
          } else {
            results.details.push({
              name: molecule.name,
              success: false,
            });
          }
        } catch (error) {
          results.errors++;
          results.details.push({
            name: molecule.name,
            success: false,
          });
        }
      }

      return results;
    }),

  /**
   * Get molecules with Flavornet percepts
   */
  getMoleculesWithPercepts: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    }))
    .query(async ({ input }) => {
      return db.getMoleculesWithFlavornetPercepts(input.limit, input.offset);
    }),

  /**
   * Get Flavornet enrichment statistics
   */
  getEnrichmentStats: publicProcedure.query(async () => {
    return db.getFlavornetEnrichmentStats();
  }),
});
