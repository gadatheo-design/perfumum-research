/**
 * Router tRPC pour l'enrichissement des propriétés thérapeutiques
 */

import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { 
  getTherapeuticData, 
  getTherapeuticStats, 
  searchByProperty, 
  getAllProperties,
  formatTherapeuticProperties 
} from "../therapeutic";
import { getDb } from "../db";
import { molecules } from "../../drizzle/schema";
import { eq, isNull, or, sql } from "drizzle-orm";

export const therapeuticRouter = router({
  // Obtenir les statistiques de la base thérapeutique
  getStats: publicProcedure.query(() => {
    return getTherapeuticStats();
  }),

  // Obtenir toutes les propriétés thérapeutiques uniques
  getAllProperties: publicProcedure.query(() => {
    return getAllProperties();
  }),

  // Rechercher par propriété thérapeutique
  searchByProperty: publicProcedure
    .input(z.object({ property: z.string() }))
    .query(({ input }) => {
      return searchByProperty(input.property);
    }),

  // Enrichir une molécule avec ses propriétés thérapeutiques
  enrichMolecule: adminProcedure
    .input(z.object({ 
      moleculeId: z.number(),
      name: z.string(),
      casNumber: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const therapeuticData = getTherapeuticData(input.name, input.casNumber);
      
      if (!therapeuticData) {
        return { success: false, message: 'Aucune donnée thérapeutique trouvée' };
      }

      const properties = formatTherapeuticProperties(therapeuticData);
      
      const db = await getDb();
      if (!db) return { success: false, message: 'Database not available' };
      
      await db.update(molecules)
        .set({ therapeuticProperties: properties })
        .where(eq(molecules.id, input.moleculeId));

      return { 
        success: true, 
        properties,
        source: therapeuticData.source
      };
    }),

  // Enrichir toutes les molécules sans propriétés thérapeutiques
  enrichBatch: protectedProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) return { total: 0, enriched: 0, details: [] };
    
    // Récupérer les molécules sans propriétés thérapeutiques
    const unenrichedMolecules = await db.select({
      id: molecules.id,
      name: molecules.name,
      casNumber: molecules.casNumber,
    })
    .from(molecules)
    .where(
      or(
        isNull(molecules.therapeuticProperties),
        sql`${molecules.therapeuticProperties} = ''`
      )
    )
    .limit(500);

    let enriched = 0;
    const details: Array<{ name: string; success: boolean; properties?: string }> = [];

    for (const mol of unenrichedMolecules) {
      const therapeuticData = getTherapeuticData(mol.name, mol.casNumber || undefined);
      
      if (therapeuticData) {
        const properties = formatTherapeuticProperties(therapeuticData);
        
        await db.update(molecules)
          .set({ therapeuticProperties: properties })
          .where(eq(molecules.id, mol.id));
        
        enriched++;
        details.push({ name: mol.name, success: true, properties });
      } else {
        details.push({ name: mol.name, success: false });
      }
    }

    return {
      total: unenrichedMolecules.length,
      enriched,
      details: details.slice(0, 50) // Limiter les détails pour éviter une réponse trop grande
    };
  }),

  // Obtenir les statistiques d'enrichissement des molécules
  getEnrichmentStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { total: 0, enriched: 0, percentage: 0 };
    
    const result = await db.select({
      total: sql<number>`COUNT(*)`,
      enriched: sql<number>`SUM(CASE WHEN ${molecules.therapeuticProperties} IS NOT NULL AND ${molecules.therapeuticProperties} != '' THEN 1 ELSE 0 END)`,
    })
    .from(molecules);

    const stats = result[0];
    return {
      total: Number(stats.total),
      enriched: Number(stats.enriched),
      percentage: Math.round((Number(stats.enriched) / Number(stats.total)) * 100),
    };
  }),
});
