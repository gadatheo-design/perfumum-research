/**
 * COCONUT (COlleCtion of Open NatUral producTs) Router
 * 
 * Provides endpoints for enriching molecules with natural product data
 * from the COCONUT database (716k+ molecules, 70k+ organisms)
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { 
  searchCOCONUT, 
  getCOCONUTMolecule, 
  enrichMoleculeWithTranslationCOCONUT 
} from "../coconut";
import * as db from "../db";

export const coconutRouter = router({
  /**
   * Search COCONUT database for a molecule
   */
  search: publicProcedure
    .input(z.object({
      query: z.string(),
      limit: z.number().optional().default(5),
    }))
    .query(async ({ input }) => {
      return searchCOCONUT(input.query, input.limit);
    }),

  /**
   * Get detailed molecule data from COCONUT
   */
  getMolecule: publicProcedure
    .input(z.object({
      coconutId: z.string(),
    }))
    .query(async ({ input }) => {
      return getCOCONUTMolecule(input.coconutId);
    }),

  /**
   * Enrich a single molecule with COCONUT data
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

      // Check if already enriched
      if (molecule.coconutId) {
        return { 
          success: false, 
          message: 'Cette molécule est déjà enrichie via COCONUT',
          data: { coconutId: molecule.coconutId }
        };
      }

      // Enrich via COCONUT
      const result = await enrichMoleculeWithTranslationCOCONUT(molecule.name);
      
      if (!result.success || !result.coconut_id) {
        return { 
          success: false, 
          message: result.error || 'Molécule non trouvée dans COCONUT'
        };
      }

      // Update the database
      await db.updateMoleculeCOCONUTData(input.moleculeId, {
        coconutId: result.coconut_id,
        npLikenessScore: result.np_likeness_score,
        organisms: result.organisms,
        citations: result.citations,
      });

      return {
        success: true,
        message: `Molécule enrichie via COCONUT: ${result.name}`,
        data: {
          coconutId: result.coconut_id,
          npLikenessScore: result.np_likeness_score,
          organisms: result.organisms,
        }
      };
    }),

  /**
   * Batch enrich molecules with COCONUT data
   */
  enrichBatch: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(50),
    }))
    .mutation(async ({ input }) => {
      const molecules = await db.getUnenrichedMoleculesForCOCONUT(input.limit);
      
      const results = {
        total: molecules.length,
        enriched: 0,
        withOrganisms: 0,
        errors: 0,
        details: [] as { name: string; success: boolean; organisms?: number }[],
      };

      for (const molecule of molecules) {
        try {
          const result = await enrichMoleculeWithTranslationCOCONUT(molecule.name);
          
          if (result.success && result.coconut_id) {
            await db.updateMoleculeCOCONUTData(molecule.id, {
              coconutId: result.coconut_id,
              npLikenessScore: result.np_likeness_score,
              organisms: result.organisms,
              citations: result.citations,
            });
            
            results.enriched++;
            if (result.organisms && result.organisms.length > 0) {
              results.withOrganisms++;
            }
            
            results.details.push({
              name: molecule.name,
              success: true,
              organisms: result.organisms?.length || 0,
            });
          } else {
            results.details.push({
              name: molecule.name,
              success: false,
            });
          }
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 300));
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
   * Get molecules with COCONUT organism data
   */
  getMoleculesWithOrganisms: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    }))
    .query(async ({ input }) => {
      return db.getMoleculesWithCOCONUTOrganisms(input.limit, input.offset);
    }),

  /**
   * Get COCONUT enrichment statistics
   */
  getEnrichmentStats: publicProcedure.query(async () => {
    return db.getCOCONUTEnrichmentStats();
  }),

  /**
   * Get molecules that need COCONUT enrichment
   */
  getUnenriched: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      return db.getUnenrichedMoleculesForCOCONUT(input.limit);
    }),
});
