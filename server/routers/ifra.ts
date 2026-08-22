/**
 * IFRA (International Fragrance Association) Router
 * 
 * Provides endpoints for regulatory compliance data
 */

import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getIFRAData, getAllIFRARestrictions, getIFRAStats, type IFRAData } from "../ifra";
import * as db from "../db";

export const ifraRouter = router({
  /**
   * Get IFRA regulatory data for a specific molecule
   */
  getMoleculeStatus: publicProcedure
    .input(z.object({
      moleculeName: z.string(),
      casNumber: z.string().optional(),
    }))
    .query(({ input }) => {
      return getIFRAData(input.moleculeName, input.casNumber);
    }),

  /**
   * Get all IFRA restrictions (for reference/display)
   */
  getAllRestrictions: publicProcedure.query(() => {
    return getAllIFRARestrictions();
  }),

  /**
   * Get IFRA database statistics
   */
  getStats: publicProcedure.query(() => {
    return getIFRAStats();
  }),

  /**
   * Enrich a single molecule with IFRA data
   */
  enrichMolecule: adminProcedure
    .input(z.object({
      moleculeId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const molecule = await db.getMoleculeById(input.moleculeId);
      if (!molecule) {
        return { success: false, message: 'Molécule non trouvée' };
      }

      const ifraData = getIFRAData(molecule.name, molecule.casNumber || undefined);
      
      // Update the molecule in the database
      await db.updateMoleculeIFRAData(input.moleculeId, ifraData);
      
      return {
        success: true,
        status: ifraData.status,
        data: ifraData,
        message: ifraData.status === 'not_regulated' 
          ? 'Molécule non réglementée IFRA'
          : `Molécule ${ifraData.status === 'banned' ? 'interdite' : ifraData.status === 'restricted' ? 'restreinte' : 'nécessitant spécification'} IFRA`,
      };
    }),

  /**
   * Batch enrich molecules with IFRA data
   */
  enrichBatch: adminProcedure
    .input(z.object({
      limit: z.number().optional().default(100),
    }))
    .mutation(async ({ input }) => {
      const molecules = await db.getUnenrichedMoleculesForIFRA(input.limit);
      
      const results = {
        total: molecules.length,
        enriched: 0,
        banned: 0,
        restricted: 0,
        specRequired: 0,
        notRegulated: 0,
        errors: 0,
      };

      for (const molecule of molecules) {
        try {
          const ifraData = getIFRAData(molecule.name, molecule.casNumber || undefined);
          await db.updateMoleculeIFRAData(molecule.id, ifraData);
          
          results.enriched++;
          if (ifraData.status === 'banned') results.banned++;
          else if (ifraData.status === 'restricted') results.restricted++;
          else if (ifraData.status === 'specification_required') results.specRequired++;
          else results.notRegulated++;
        } catch (error) {
          results.errors++;
        }
      }

      return results;
    }),

  /**
   * Get molecules by IFRA status
   */
  getMoleculesByStatus: publicProcedure
    .input(z.object({
      status: z.enum(['not_regulated', 'banned', 'restricted', 'specification_required']),
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    }))
    .query(async ({ input }) => {
      return db.getMoleculesByIFRAStatus(input.status, input.limit, input.offset);
    }),

  /**
   * Get IFRA enrichment statistics
   */
  getEnrichmentStats: publicProcedure.query(async () => {
    return db.getIFRAEnrichmentStats();
  }),

  /**
   * Get molecules that need IFRA enrichment
   */
  getUnenriched: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      return db.getUnenrichedMoleculesForIFRA(input.limit);
    }),
});
