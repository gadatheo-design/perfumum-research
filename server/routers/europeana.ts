/**
 * PERFUMUM — Router tRPC Europeana
 * ==================================
 * Procédures pour interroger l'API REST Europeana et croiser
 * les collections muséales européennes avec les données PERFUMUM.
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import {
  searchEuropeanaThematic,
  searchEuropeanaFree,
  searchEuropeanaByWikidataQid,
  getThematicConfig,
} from "../europeana";
import mysql from "mysql2/promise";

async function getDb() {
  return mysql.createConnection(process.env.DATABASE_URL!);
}

export const europeanaRouter = router({
  /**
   * Configuration des thèmes disponibles
   */
  thematicConfig: publicProcedure.query(() => {
    return getThematicConfig();
  }),

  /**
   * Recherche thématique PERFUMUM (Rose de Damas, Encens, Tabac ottoman, Houblon)
   */
  thematicSearch: publicProcedure
    .input(
      z.object({
        theme: z.enum(["rose_damas", "encens", "tabac_ottoman", "houblon"]),
        limit: z.number().int().min(1).max(100).default(24),
        start: z.number().int().min(1).default(1),
      })
    )
    .query(async ({ input }) => {
      const result = await searchEuropeanaThematic(input.theme, input.limit, input.start);

      // Enrichir avec les liens PERFUMUM depuis la base de données
      const conn = await getDb();
      try {
        // Récupérer les plantes liées au thème
        const themeToPlants: Record<string, string[]> = {
          rose_damas: ["Rosa damascena", "Rosa centifolia", "Rosa gallica"],
          encens: ["Boswellia sacra", "Boswellia carterii", "Boswellia serrata", "Boswellia papyrifera"],
          tabac_ottoman: ["Nicotiana tabacum", "Nicotiana rustica"],
          houblon: ["Humulus lupulus"],
        };

        const plantNames = themeToPlants[input.theme] || [];
        if (plantNames.length > 0) {
          const placeholders = plantNames.map(() => "?").join(", ");
          const [plants] = await conn.execute<any[]>(
            `SELECT id, name, latin_name FROM plants WHERE latin_name IN (${placeholders}) OR name IN (${placeholders}) LIMIT 10`,
            [...plantNames, ...plantNames]
          );

          // Attacher les IDs des plantes PERFUMUM aux items
          result.items = result.items.map((item) => ({
            ...item,
            relatedPlantId: plants[0]?.id,
            relatedPlantName: plants[0]?.name || plants[0]?.latin_name,
          }));
        }
      } catch (e) {
        // Non-bloquant
      } finally {
        await conn.end();
      }

      return result;
    }),

  /**
   * Recherche libre par mot-clé
   */
  freeSearch: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(200),
        limit: z.number().int().min(1).max(100).default(24),
        typeFilter: z.enum(["IMAGE", "TEXT", "VIDEO", "SOUND", "3D"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return searchEuropeanaFree(input.query, input.limit, input.typeFilter);
    }),

  /**
   * Recherche Europeana par QID Wikidata d'une molécule PERFUMUM
   */
  searchByMolecule: publicProcedure
    .input(
      z.object({
        moleculeId: z.number().int().positive(),
        limit: z.number().int().min(1).max(50).default(12),
      })
    )
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<any[]>(
          "SELECT id, name, wikidata_qid FROM molecules WHERE id = ?",
          [input.moleculeId]
        );
        if (!rows.length) {
          return {
            items: [],
            total: 0,
            query: "",
            theme: "molecule",
            apiAvailable: false,
            error: "Molécule introuvable",
          };
        }
        const mol = rows[0];
        const result = await searchEuropeanaByWikidataQid(
          mol.wikidata_qid || "",
          mol.name,
          input.limit
        );
        return {
          ...result,
          moleculeName: mol.name,
          moleculeId: mol.id,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Recherche Europeana par QID Wikidata d'une plante PERFUMUM
   */
  searchByPlant: publicProcedure
    .input(
      z.object({
        plantId: z.number().int().positive(),
        limit: z.number().int().min(1).max(50).default(12),
      })
    )
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<any[]>(
          "SELECT id, name, latin_name, wikidata_qid FROM plants WHERE id = ?",
          [input.plantId]
        );
        if (!rows.length) {
          return {
            items: [],
            total: 0,
            query: "",
            theme: "plant",
            apiAvailable: false,
            error: "Plante introuvable",
          };
        }
        const plant = rows[0];
        const searchName = plant.latin_name || plant.name;
        const result = await searchEuropeanaByWikidataQid(
          plant.wikidata_qid || "",
          searchName,
          input.limit
        );
        return {
          ...result,
          plantName: plant.name,
          plantLatinName: plant.latin_name,
          plantId: plant.id,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Statistiques Europeana — état de l'intégration
   */
  stats: publicProcedure.query(async () => {
    const apiKey = process.env.EUROPEANA_API_KEY;
    const conn = await getDb();
    try {
      const [[{ totalMolecules }]] = await conn.execute<any[]>(
        "SELECT COUNT(*) as totalMolecules FROM molecules"
      );
      const [[{ totalPlants }]] = await conn.execute<any[]>(
        "SELECT COUNT(*) as totalPlants FROM plants"
      );
      const [[{ plantsWithQid }]] = await conn.execute<any[]>(
        "SELECT COUNT(*) as plantsWithQid FROM plants WHERE wikidata_qid IS NOT NULL"
      );
      const [[{ moleculesWithQid }]] = await conn.execute<any[]>(
        "SELECT COUNT(*) as moleculesWithQid FROM molecules WHERE wikidata_qid IS NOT NULL"
      );

      return {
        apiConfigured: !!apiKey,
        totalMolecules: Number(totalMolecules),
        totalPlants: Number(totalPlants),
        plantsWithQid: Number(plantsWithQid),
        moleculesWithQid: Number(moleculesWithQid),
        themes: Object.keys({
          rose_damas: true,
          encens: true,
          tabac_ottoman: true,
          houblon: true,
        }),
      };
    } finally {
      await conn.end();
    }
  }),
});
