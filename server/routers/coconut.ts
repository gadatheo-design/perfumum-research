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

/**
 * Croise les organismes LOTUS d'une molécule avec les plantes en base
 * et crée automatiquement les liaisons plant_molecules manquantes.
 * 
 * Logique de matching :
 * - Match exact sur latin_name (ex: "Cananga odorata" = "Cananga odorata")
 * - Match par genre si une seule plante du genre est en base
 * - Seules les espèces (rank=species) sont croisées, pas les taxons supérieurs
 */
async function crossRefLotusOrganisms(
  moleculeId: number,
  organisms: { name: string; rank?: string }[]
): Promise<{ newLinks: number; skipped: number }> {
  if (!organisms || organisms.length === 0) return { newLinks: 0, skipped: 0 };

  // Récupérer toutes les plantes avec latin_name
  const allPlants = await db.getAllPlants();
  const plantsWithLatin = allPlants.filter(p => p.latinName && p.latinName.trim() !== '');

  // Construire les index de matching
  const byExact = new Map<string, typeof plantsWithLatin[0]>();
  const byGenus = new Map<string, typeof plantsWithLatin>();

  for (const plant of plantsWithLatin) {
    const latin = plant.latinName!.trim().toLowerCase();
    byExact.set(latin, plant);
    const genus = latin.split(' ')[0];
    if (!byGenus.has(genus)) byGenus.set(genus, []);
    byGenus.get(genus)!.push(plant);
  }

  let newLinks = 0;
  let skipped = 0;

  // Filtrer uniquement les espèces
  const species = organisms.filter(o => o.rank === 'species');

  for (const org of species) {
    const orgName = org.name.trim().toLowerCase()
      .replace(/×\s*/g, '')
      .replace(/\s+var\..*/, '')
      .replace(/\s+subsp\..*/, '')
      .replace(/\s+f\..*/, '')
      .trim();

    // Match exact
    let matchedPlant = byExact.get(orgName);

    // Match par genre si pas de match exact
    if (!matchedPlant) {
      const genus = orgName.split(' ')[0];
      const genusMatches = byGenus.get(genus) || [];
      if (genusMatches.length === 1) {
        matchedPlant = genusMatches[0];
      } else if (genusMatches.length > 1) {
        const twoWords = orgName.split(' ').slice(0, 2).join(' ');
        matchedPlant = genusMatches.find(p =>
          p.latinName!.toLowerCase().startsWith(twoWords)
        );
      }
    }

    if (!matchedPlant) continue;

    // Vérifier si la liaison existe déjà
    const exists = await db.checkPlantMoleculeLinkExists(matchedPlant.id, moleculeId);
    if (exists) {
      skipped++;
      continue;
    }

    // Créer la liaison
    try {
      await db.createPlantMoleculeLink({
        plantId: matchedPlant.id,
        moleculeId,
      });
      newLinks++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('Duplicate') && !msg.includes('ER_DUP')) {
        console.error(`LOTUS crossref error ${matchedPlant.id}:${moleculeId}:`, msg);
      } else {
        skipped++;
      }
    }
  }

  return { newLinks, skipped };
}

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

      // Enrich via COCONUT (avec fallback par CAS si disponible)
      const result = await enrichMoleculeWithTranslationCOCONUT(molecule.name, molecule.casNumber || undefined);
      
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

      // Croisement automatique LOTUS → plant_molecules
      const crossRef = await crossRefLotusOrganisms(
        input.moleculeId,
        result.organisms || []
      );

      return {
        success: true,
        message: `Molécule enrichie via LOTUS: ${result.name}`,
        data: {
          coconutId: result.coconut_id,
          npLikenessScore: result.np_likeness_score,
          organisms: result.organisms,
          newPlantLinks: crossRef.newLinks,
        }
      };
    }),

  /**
   * Batch enrich molecules with COCONUT data
   */
  enrichBatch: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(1000).optional().default(50),
    }))
    .mutation(async ({ input }) => {
      const molecules = await db.getUnenrichedMoleculesForCOCONUT(input.limit);
      
      const results = {
        total: molecules.length,
        enriched: 0,
        withOrganisms: 0,
        errors: 0,
        details: [] as { name: string; success: boolean; organisms?: number; newPlantLinks?: number }[],
      };

      for (const molecule of molecules) {
        try {
          const result = await enrichMoleculeWithTranslationCOCONUT(molecule.name, molecule.casNumber || undefined);
          
          if (result.success && result.coconut_id) {
            await db.updateMoleculeCOCONUTData(molecule.id, {
              coconutId: result.coconut_id,
              npLikenessScore: result.np_likeness_score,
              organisms: result.organisms,
              citations: result.citations,
            });
            
            // Croisement automatique LOTUS → plant_molecules
            const crossRef = await crossRefLotusOrganisms(
              molecule.id,
              result.organisms || []
            );
            
            results.enriched++;
            if (result.organisms && result.organisms.length > 0) {
              results.withOrganisms++;
            }
            
            results.details.push({
              name: molecule.name,
              success: true,
              organisms: result.organisms?.length || 0,
              newPlantLinks: crossRef.newLinks,
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
