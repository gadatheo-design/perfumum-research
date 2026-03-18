/**
 * PERFUMUM — Router tRPC Europeana
 * ==================================
 * Procédures pour interroger l'API REST Europeana + IIIF APIs et croiser
 * les collections muséales européennes avec les données PERFUMUM.
 *
 * Nouveautés v2 :
 * - Support IIIF Manifest v3 (sans clé API)
 * - Thumbnail API v3 (sans clé API, meilleure résolution)
 * - Pagination curseur (deep pagination)
 * - getRecord : détail complet d'un item via Record API
 * - searchByPlant / searchByMolecule : utilise latin_name + cas_number
 * - Nouveaux thèmes : nard, myrrhe
 * - Stats enrichies avec couverture IIIF
 */

import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import {
  searchEuropeanaThematic,
  searchEuropeanaFree,
  searchEuropeanaByWikidataQid,
  searchEuropeanaByPlant,
  searchEuropeanaByMolecule,
  getEuropeanaRecord,
  getThematicConfig,
  buildIiifManifestUrl,
  buildThumbnailUrl,
  THEMATIC_QUERIES,
} from "../europeana";
import mysql from "mysql2/promise";

async function getDb() {
  return mysql.createConnection(process.env.DATABASE_URL!);
}

// Tous les thèmes disponibles
const ALL_THEMES = Object.keys(THEMATIC_QUERIES) as [string, ...string[]];

export const europeanaRouter = router({
  /**
   * Configuration des thèmes disponibles (avec couleurs, plantes, molécules liées)
   */
  thematicConfig: publicProcedure.query(() => {
    return getThematicConfig();
  }),

  /**
   * Recherche thématique PERFUMUM avec pagination curseur et IIIF
   */
  thematicSearch: publicProcedure
    .input(
      z.object({
        theme: z.enum(ALL_THEMES as [string, ...string[]]),
        limit: z.number().int().min(1).max(100).default(24),
        start: z.number().int().min(1).default(1),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const result = await searchEuropeanaThematic(
        input.theme,
        input.limit,
        input.start,
        input.cursor
      );

      // Enrichir avec les liens PERFUMUM depuis la base de données
      const conn = await getDb();
      try {
        const themeToPlants: Record<string, string[]> = {
          rose_damas: ["Rosa damascena", "Rosa centifolia", "Rosa gallica"],
          encens: ["Boswellia sacra", "Boswellia carterii", "Boswellia serrata", "Boswellia papyrifera"],
          tabac_ottoman: ["Nicotiana tabacum", "Nicotiana rustica"],
          houblon: ["Humulus lupulus"],
          nard: ["Nardostachys jatamansi", "Valeriana officinalis"],
          myrrhe: ["Commiphora myrrha", "Commiphora gileadensis"],
        };

        const plantNames = themeToPlants[input.theme] || [];
        if (plantNames.length > 0) {
          const placeholders = plantNames.map(() => "?").join(", ");
          const [plants] = await conn.execute<any[]>(
            `SELECT id, name, latin_name FROM plants WHERE latin_name IN (${placeholders}) OR name IN (${placeholders}) LIMIT 10`,
            [...plantNames, ...plantNames]
          );

          if (plants.length > 0) {
            result.items = result.items.map((item) => ({
              ...item,
              relatedPlantId: item.relatedPlantId || plants[0]?.id,
              relatedPlantName: item.relatedPlantName || plants[0]?.name || plants[0]?.latin_name,
            }));
          }
        }
      } catch (e) {
        // Non-bloquant
      } finally {
        await conn.end();
      }

      return result;
    }),

  /**
   * Recherche libre par mot-clé avec filtres IIIF
   */
  freeSearch: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(200),
        limit: z.number().int().min(1).max(100).default(24),
        typeFilter: z.enum(["IMAGE", "TEXT", "VIDEO", "SOUND", "3D"]).optional(),
        reusability: z.enum(["open", "restricted", "permission"]).optional(),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return searchEuropeanaFree(
        input.query,
        input.limit,
        input.typeFilter,
        input.reusability,
        input.cursor
      );
    }),

  /**
   * Détail complet d'un item Europeana via Record API + IIIF Manifest
   */
  getRecord: publicProcedure
    .input(
      z.object({
        recordId: z.string().min(3), // ex: "/9200365/BibliographicResource_3000126284840"
      })
    )
    .query(async ({ input }) => {
      const record = await getEuropeanaRecord(input.recordId);
      if (!record) {
        // Retourner au moins les URLs IIIF (sans clé)
        return {
          id: input.recordId,
          title: "Détail non disponible",
          iiifManifestUrl: buildIiifManifestUrl(input.recordId),
          thumbnailUrlLarge: buildThumbnailUrl(input.recordId, 400),
          europeanaUrl: `https://www.europeana.eu/item${input.recordId}`,
          apiAvailable: false,
        };
      }
      return record;
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
          "SELECT id, name, wikidata_qid, cas_number FROM molecules WHERE id = ?",
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

        // Essayer d'abord par QID Wikidata, sinon par nom
        let result;
        if (mol.wikidata_qid) {
          result = await searchEuropeanaByWikidataQid(mol.wikidata_qid, mol.name, input.limit);
        } else {
          result = await searchEuropeanaByMolecule(mol.name, mol.cas_number, input.limit);
        }

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

        // Essayer d'abord par QID Wikidata, sinon par nom latin
        let result;
        if (plant.wikidata_qid) {
          result = await searchEuropeanaByWikidataQid(
            plant.wikidata_qid,
            plant.latin_name || plant.name,
            input.limit
          );
        } else {
          result = await searchEuropeanaByPlant(plant.name, plant.latin_name, input.limit);
        }

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
   * Statistiques Europeana — état de l'intégration PERFUMUM
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
        "SELECT COUNT(*) as plantsWithQid FROM plants WHERE wikidata_qid IS NOT NULL AND wikidata_qid != ''"
      );
      const [[{ moleculesWithQid }]] = await conn.execute<any[]>(
        "SELECT COUNT(*) as moleculesWithQid FROM molecules WHERE wikidata_qid IS NOT NULL AND wikidata_qid != ''"
      );

      return {
        apiConfigured: !!apiKey,
        iiifAvailable: true, // IIIF Manifest + Thumbnail sans clé
        totalMolecules: Number(totalMolecules),
        totalPlants: Number(totalPlants),
        plantsWithQid: Number(plantsWithQid),
        moleculesWithQid: Number(moleculesWithQid),
        themes: getThematicConfig(),
        // Couverture QID
        plantQidCoverage: Math.round((Number(plantsWithQid) / Number(totalPlants)) * 100),
        moleculeQidCoverage: Math.round((Number(moleculesWithQid) / Number(totalMolecules)) * 100),
      };
    } finally {
      await conn.end();
    }
  }),
});
