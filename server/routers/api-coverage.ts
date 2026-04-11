/**
 * api-coverage.ts
 * Dashboard de couverture des APIs pour chaque plante.
 * Retourne pour chaque plante quelles APIs ont retourné des données (GBIF, POWO, NCBI, Wikidata, ITIS)
 * avec un score de complétude et des filtres.
 */

import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { plants } from "../../drizzle/schema";
import { sql, like, isNull, isNotNull } from "drizzle-orm";

export const apiCoverageRouter = router({

  /**
   * Retourne le rapport de couverture global pour toutes les plantes.
   * Chaque plante a un score de complétude basé sur les IDs disponibles.
   */
  getGlobalCoverage: publicProcedure
    .input(z.object({
      filter: z.enum(["all", "missing_gbif", "missing_powo", "missing_ncbi", "missing_wikidata", "missing_itis", "incomplete", "complete"]).default("all"),
      genus: z.string().optional(),
      category: z.string().optional(),
      limit: z.number().min(1).max(500).default(100),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { plants: [], total: 0, stats: {} };

      // Construire la requête de base
      let query = db.select({
        id: plants.id,
        name: plants.name,
        latinName: plants.latinName,
        family: plants.family,
        category: plants.category,
        gbifId: plants.gbifId,
        powId: plants.powId,
        ncbiTaxId: plants.ncbiTaxId,
        wikidataQid: plants.wikidataQid,
        itisId: plants.itisId,
        wikidataEnrichedAt: plants.wikidataEnrichedAt,
      }).from(plants);

      // Filtres
      const conditions: any[] = [];

      if (input.genus) {
        conditions.push(sql`${plants.latinName} LIKE ${input.genus + " %"} OR ${plants.latinName} = ${input.genus}`);
      }

      if (input.category) {
        conditions.push(sql`${plants.category} = ${input.category}`);
      }

      switch (input.filter) {
        case "missing_gbif":
          conditions.push(isNull(plants.gbifId));
          break;
        case "missing_powo":
          conditions.push(isNull(plants.powId));
          break;
        case "missing_ncbi":
          conditions.push(isNull(plants.ncbiTaxId));
          break;
        case "missing_wikidata":
          conditions.push(isNull(plants.wikidataQid));
          break;
        case "missing_itis":
          conditions.push(isNull(plants.itisId));
          break;
        case "incomplete":
          // Plantes avec au moins 1 ID manquant
          conditions.push(sql`(${plants.gbifId} IS NULL OR ${plants.powId} IS NULL OR ${plants.ncbiTaxId} IS NULL OR ${plants.wikidataQid} IS NULL)`);
          break;
        case "complete":
          // Plantes avec tous les IDs principaux
          conditions.push(isNotNull(plants.gbifId));
          conditions.push(isNotNull(plants.powId));
          conditions.push(isNotNull(plants.ncbiTaxId));
          conditions.push(isNotNull(plants.wikidataQid));
          break;
      }

      if (conditions.length > 0) {
        query = query.where(sql.join(conditions, sql` AND `)) as any;
      }

      const allResults = await (query as any).orderBy(plants.name).limit(input.limit).offset(input.offset);

      // Calculer le score de complétude pour chaque plante
      const plantsWithScore = allResults.map((p: any) => {
        const apis = {
          gbif: !!p.gbifId,
          powo: !!p.powId,
          ncbi: !!p.ncbiTaxId,
          wikidata: !!p.wikidataQid,
          itis: !!p.itisId,
        };
        const score = Object.values(apis).filter(Boolean).length;
        const maxScore = 5;
        const completenessPercent = Math.round((score / maxScore) * 100);
        return { ...p, apis, score, maxScore, completenessPercent };
      });

      // Statistiques globales (sur toutes les plantes, sans filtre)
      const allPlants = await db.select({
        gbifId: plants.gbifId,
        powId: plants.powId,
        ncbiTaxId: plants.ncbiTaxId,
        wikidataQid: plants.wikidataQid,
        itisId: plants.itisId,
      }).from(plants);

      const stats = {
        total: allPlants.length,
        withGbif: allPlants.filter((p) => p.gbifId).length,
        withPowo: allPlants.filter((p) => p.powId).length,
        withNcbi: allPlants.filter((p) => p.ncbiTaxId).length,
        withWikidata: allPlants.filter((p) => p.wikidataQid).length,
        withItis: allPlants.filter((p) => p.itisId).length,
        fullyEnriched: allPlants.filter((p) => p.gbifId && p.powId && p.ncbiTaxId && p.wikidataQid).length,
        incomplete: allPlants.filter((p) => !p.gbifId || !p.powId || !p.ncbiTaxId || !p.wikidataQid).length,
        avgScore: allPlants.length > 0
          ? Math.round(allPlants.reduce((acc, p) => {
              return acc + [p.gbifId, p.powId, p.ncbiTaxId, p.wikidataQid, p.itisId].filter(Boolean).length;
            }, 0) / allPlants.length * 10) / 10
          : 0,
      };

      return {
        plants: plantsWithScore,
        total: allResults.length,
        stats,
      };
    }),

  /**
   * Retourne la liste des genres avec leur taux de couverture.
   */
  getGenraCoverage: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const allPlants = await db.select({
      latinName: plants.latinName,
      gbifId: plants.gbifId,
      powId: plants.powId,
      ncbiTaxId: plants.ncbiTaxId,
      wikidataQid: plants.wikidataQid,
    }).from(plants).where(isNotNull(plants.latinName));

    // Grouper par genre (premier mot du nom latin)
    const genreMap = new Map<string, {
      total: number;
      withGbif: number;
      withPowo: number;
      withNcbi: number;
      withWikidata: number;
    }>();

    for (const p of allPlants) {
      if (!p.latinName) continue;
      const genus = p.latinName.split(" ")[0];
      if (!genus) continue;
      const existing = genreMap.get(genus) || { total: 0, withGbif: 0, withPowo: 0, withNcbi: 0, withWikidata: 0 };
      existing.total++;
      if (p.gbifId) existing.withGbif++;
      if (p.powId) existing.withPowo++;
      if (p.ncbiTaxId) existing.withNcbi++;
      if (p.wikidataQid) existing.withWikidata++;
      genreMap.set(genus, existing);
    }

    return Array.from(genreMap.entries())
      .map(([genus, data]) => ({
        genus,
        ...data,
        completenessPercent: Math.round(
          ((data.withGbif + data.withPowo + data.withNcbi + data.withWikidata) / (data.total * 4)) * 100
        ),
      }))
      .sort((a, b) => b.total - a.total);
  }),
});
