/**
 * PERFUMUM — Router tRPC Europeana
 * ==================================
 * Procédures pour interroger l'API REST Europeana + IIIF APIs et croiser
 * les collections muséales européennes avec les données PERFUMUM.
 *
 * Sprint 1 (v3) — Nouveautés :
 * - Facettes COUNTRY / YEAR / DATA_PROVIDER / TYPE dans toutes les recherches
 * - Filtres thématiques Europeana (theme=nature, art, manuscript, map, photography)
 * - Filtres proxy_dc_type (herbier, manuscrit, peinture botanique)
 * - 6 nouveaux thèmes : flacons_parfum, illustrations_botaniques, routes_epices,
 *   distillation_alchimie, jardins_botaniques, rituels_olfactifs
 * - Entity API : resolveEntity (QID Wikidata → entité Europeana)
 * - Entity API : searchEntities (autocomplétion entités)
 * - searchFree avec withFacets optionnel
 */

import { z } from "zod";
import { sql } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  searchEuropeanaThematic,
  searchEuropeanaFree,
  searchEuropeanaByWikidataQid,
  searchEuropeanaByPlant,
  searchEuropeanaByMolecule,
  getEuropeanaRecord,
  resolveEuropeanaEntity,
  searchEuropeanaEntities,
  searchIiifFullText,
  getCountryDistribution,
  getThematicConfig,
  buildIiifManifestUrl,
  buildThumbnailUrl,
  THEMATIC_QUERIES,
} from "../europeana";
import mysql from "mysql2/promise";

async function getDbConn() {
  return mysql.createConnection(process.env.DATABASE_URL!);
}

// Tous les thèmes disponibles (existants + nouveaux Sprint 1)
const ALL_THEMES = Object.keys(THEMATIC_QUERIES) as [string, ...string[]];

export const europeanaRouter = router({
  /**
   * Configuration des thèmes disponibles (avec couleurs, plantes, molécules liées,
   * thème Europeana et support facettes)
   */
  thematicConfig: publicProcedure.query(() => {
    return getThematicConfig();
  }),

  /**
   * Recherche thématique PERFUMUM avec pagination curseur, IIIF et facettes
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
      const conn = await getDbConn();
      try {
        const themeToPlants: Record<string, string[]> = {
          rose_damas: ["Rosa damascena", "Rosa centifolia", "Rosa gallica"],
          encens: ["Boswellia sacra", "Boswellia carterii", "Boswellia serrata", "Boswellia papyrifera"],
          tabac_ottoman: ["Nicotiana tabacum", "Nicotiana rustica"],
          houblon: ["Humulus lupulus"],
          nard: ["Nardostachys jatamansi", "Valeriana officinalis"],
          myrrhe: ["Commiphora myrrha", "Commiphora gileadensis"],
          flacons_parfum: ["Rosa damascena", "Commiphora myrrha", "Boswellia sacra"],
          illustrations_botaniques: ["Lavandula angustifolia", "Rosa damascena", "Jasminum grandiflorum"],
          routes_epices: ["Boswellia sacra", "Commiphora myrrha", "Nardostachys jatamansi"],
          distillation_alchimie: ["Lavandula angustifolia", "Rosa damascena", "Boswellia sacra"],
          jardins_botaniques: ["Lavandula angustifolia", "Rosa damascena", "Jasminum grandiflorum"],
          rituels_olfactifs: ["Boswellia sacra", "Commiphora myrrha"],
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
   * Recherche libre par mot-clé avec filtres IIIF et facettes optionnelles
   */
  freeSearch: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(200),
        limit: z.number().int().min(1).max(100).default(24),
        typeFilter: z.enum(["IMAGE", "TEXT", "VIDEO", "SOUND", "3D"]).optional(),
        reusability: z.enum(["open", "restricted", "permission"]).optional(),
        cursor: z.string().optional(),
        withFacets: z.boolean().default(false),
      })
    )
    .query(async ({ input }) => {
      return searchEuropeanaFree(
        input.query,
        input.limit,
        input.typeFilter,
        input.reusability,
        input.cursor,
        input.withFacets
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
      const conn = await getDbConn();
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
      const conn = await getDbConn();
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
   * Entity API — Résoudre une entité Europeana depuis un QID Wikidata
   * Retourne l'identifiant Europeana Entity, les labels multilingues et les liens sameAs
   */
  resolveEntity: publicProcedure
    .input(
      z.object({
        wikidataQid: z.string().min(2), // ex: "Q103129" (Rosa damascena)
      })
    )
    .query(async ({ input }) => {
      const entity = await resolveEuropeanaEntity(input.wikidataQid);
      return entity;
    }),

  /**
   * Entity API — Recherche d'entités Europeana par mot-clé
   * Utile pour l'autocomplétion et la découverte d'entités liées aux plantes/molécules
   */
  searchEntities: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(100),
        type: z.enum(["Agent", "Place", "Concept", "Organisation"]).optional(),
        limit: z.number().int().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      const entities = await searchEuropeanaEntities(
        input.query,
        input.type,
        input.limit
      );
      return entities;
    }),

  /**
   * IIIF Full-Text Search — recherche dans le texte OCR des manuscrits numérisés
   * Retourne les citations historiques primaires avec contexte et lien vers la page
   */
  iiifFullTextSearch: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(200),
        limit: z.number().int().min(1).max(20).default(10),
        themeFilter: z.string().optional(), // ex: "distillation_alchimie"
      })
    )
    .query(async ({ input }) => {
      return searchIiifFullText(input.query, input.limit, input.themeFilter);
    }),

  /**
   * Distribution géographique — répartition par pays pour un thème
   * Basé sur les facettes COUNTRY de l'API Europeana
   */
  countryDistribution: publicProcedure
    .input(
      z.object({
        theme: z.string().min(2),
        limit: z.number().int().min(1).max(50).default(30),
      })
    )
    .query(async ({ input }) => {
      return getCountryDistribution(input.theme, input.limit);
    }),

  /**
   * Statistiques Europeana — état de l'intégration PERFUMUM
   * Inclut la couverture QID, les thèmes disponibles et les capacités Sprint 1
   */
  stats: publicProcedure.query(async () => {
    const apiKey = process.env.EUROPEANA_API_KEY;
    const conn = await getDbConn();
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

      const allThemes = getThematicConfig();
      const newThemes = ["flacons_parfum", "illustrations_botaniques", "routes_epices", "distillation_alchimie", "jardins_botaniques", "rituels_olfactifs"];

      return {
        apiConfigured: !!apiKey,
        iiifAvailable: true, // IIIF Manifest + Thumbnail sans clé
        totalMolecules: Number(totalMolecules),
        totalPlants: Number(totalPlants),
        plantsWithQid: Number(plantsWithQid),
        moleculesWithQid: Number(moleculesWithQid),
        themes: allThemes,
        totalThemes: allThemes.length,
        newThemesCount: newThemes.length,
        // Couverture QID
        plantQidCoverage: Math.round((Number(plantsWithQid) / Number(totalPlants)) * 100),
        moleculeQidCoverage: Math.round((Number(moleculesWithQid) / Number(totalMolecules)) * 100),
        // Capacités Sprint 1
        sprint1: {
          facetsEnabled: true,
          entityApiEnabled: !!apiKey,
          thematicFiltersEnabled: true,
          newThemes,
        },
        // Capacités Sprint 2
        sprint2: {
          iiifFullTextSearch: true,
          countryDistributionMap: true,
          iiifFullTextApiAvailable: !!apiKey,
          mapCountries: 45,
        },
        // Capacités Sprint 3
        sprint3: {
          sparqlEuropeanaEndpoint: true,
          sparqlFederated: true,
          enrichPlantQidBatch: true,
          annotationApi: !!apiKey,
          europeanaTemplates: 4,
        },
      };
    } finally {
      await conn.end();
    }
  }),

  /**
   * Sprint 3.2 — Enrichissement QID Wikidata des plantes via Entity API
   * Parcourt les plantes sans QID Wikidata et tente de les résoudre
   * via l'Entity API Europeana (resolveEntity avec URI Wikidata).
   * Retourne les candidats avec score de confiance (high/medium/low).
   */
  enrichPlantQidBatch: publicProcedure
    .input(
      z.object({
        offset: z.number().int().min(0).default(0),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const apiKey = process.env.EUROPEANA_API_KEY;
      const conn = await getDbConn();
      try {
        // Compter les plantes sans QID
        const [[{ totalWithoutQid }]] = await conn.execute<any[]>(
          "SELECT COUNT(*) as totalWithoutQid FROM plants WHERE wikidata_qid IS NULL OR wikidata_qid = ''"
        );
        const [[{ totalPlants }]] = await conn.execute<any[]>(
          "SELECT COUNT(*) as totalPlants FROM plants"
        );
        const [[{ plantsWithQid }]] = await conn.execute<any[]>(
          "SELECT COUNT(*) as plantsWithQid FROM plants WHERE wikidata_qid IS NOT NULL AND wikidata_qid != ''"
        );

        // Récupérer les plantes sans QID (paginées)
        const [plants] = await conn.execute<any[]>(
          "SELECT id, name, latin_name, family FROM plants WHERE wikidata_qid IS NULL OR wikidata_qid = '' LIMIT ? OFFSET ?",
          [input.limit, input.offset]
        );

        const results: Array<{
          plantId: number;
          plantName: string;
          latinName: string | null;
          family: string | null;
          candidates: Array<{
            entityId: string;
            label: string;
            confidence: "high" | "medium" | "low";
            sameAs: string[];
          }>;
          status: "resolved" | "candidates" | "not_found" | "no_api";
        }> = [];

        if (!apiKey) {
          // Mode sans clé : retourner la liste des plantes à enrichir
          for (const plant of plants) {
            results.push({
              plantId: plant.id,
              plantName: plant.name,
              latinName: plant.latin_name,
              family: plant.family,
              candidates: [],
              status: "no_api",
            });
          }
        } else {
          // Mode avec clé : tenter la résolution via Entity API
          const ENTITY_BASE = "https://api.europeana.eu/entity";
          for (const plant of plants) {
            const searchTerm = plant.latin_name || plant.name;
            try {
              const url = new URL(`${ENTITY_BASE}/suggest`);
              url.searchParams.set("wskey", apiKey);
              url.searchParams.set("text", searchTerm);
              url.searchParams.set("type", "concept");
              url.searchParams.set("rows", "3");
              url.searchParams.set("lang", "en,fr,la");

              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 8_000);
              const resp = await fetch(url.toString(), {
                headers: { "User-Agent": "PERFUMUM-Research/1.0", Accept: "application/json" },
                signal: controller.signal,
              });
              clearTimeout(timeout);

              if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
              const data = await resp.json() as any;
              const items = data.items || [];

              if (items.length === 0) {
                results.push({ plantId: plant.id, plantName: plant.name, latinName: plant.latin_name, family: plant.family, candidates: [], status: "not_found" });
                continue;
              }

              const candidates = items.map((item: any) => {
                const label = item.prefLabel?.en || item.prefLabel?.fr || item.prefLabel?.la ||
                  (typeof item.prefLabel === "string" ? item.prefLabel : searchTerm);
                const sameAs: string[] = Array.isArray(item.sameAs) ? item.sameAs : [];
                const hasWikidata = sameAs.some((s: string) => s.includes("wikidata.org"));
                const labelMatch = label.toLowerCase().includes(searchTerm.toLowerCase().split(" ")[0]);
                const confidence: "high" | "medium" | "low" = hasWikidata && labelMatch ? "high" : hasWikidata || labelMatch ? "medium" : "low";
                return { entityId: item.id || item["@id"] || "", label, confidence, sameAs };
              });

              const highConf = candidates.find((c: any) => c.confidence === "high");
              results.push({
                plantId: plant.id,
                plantName: plant.name,
                latinName: plant.latin_name,
                family: plant.family,
                candidates,
                status: highConf ? "resolved" : candidates.length > 0 ? "candidates" : "not_found",
              });
            } catch {
              results.push({ plantId: plant.id, plantName: plant.name, latinName: plant.latin_name, family: plant.family, candidates: [], status: "not_found" });
            }
          }
        }

        return {
          results,
          pagination: {
            total: Number(totalWithoutQid),
            offset: input.offset,
            limit: input.limit,
            hasMore: input.offset + input.limit < Number(totalWithoutQid),
          },
          coverage: {
            total: Number(totalPlants),
            withQid: Number(plantsWithQid),
            withoutQid: Number(totalWithoutQid),
            percent: Math.round((Number(plantsWithQid) / Number(totalPlants)) * 100),
          },
          apiAvailable: !!apiKey,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Sprint 3.3 — Annotation API : annotations d'un item Europeana
   * Retourne les tags sémantiques, transcriptions et descriptions
   * déposés par les contributeurs Europeana sur un item spécifique.
   */
  getAnnotations: publicProcedure
    .input(
      z.object({
        recordId: z.string().min(5),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const apiKey = process.env.EUROPEANA_API_KEY;
      if (!apiKey) {
        return {
          annotations: [],
          total: 0,
          recordId: input.recordId,
          apiAvailable: false,
          error: "EUROPEANA_API_KEY non configurée.",
        };
      }
      const { getAnnotations } = await import("../europeana");
      return getAnnotations(input.recordId, input.limit);
    }),

  /**
   * Sprint 3.3 — Annotation API : recherche d'annotations par terme
   * Permet de trouver tous les items Europeana taggés avec un terme botanique.
   */
  searchAnnotations: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(200),
        type: z.enum(["tagging", "transcribing", "describing"]).optional(),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const apiKey = process.env.EUROPEANA_API_KEY;
      if (!apiKey) {
        return {
          annotations: [],
          total: 0,
          query: input.query,
          apiAvailable: false,
          error: "EUROPEANA_API_KEY non configurée.",
        };
      }
      const { searchAnnotations } = await import("../europeana");
      return searchAnnotations(input.query, input.type, input.limit);
    }),

  // ── Sauvegarde des QID Wikidata résolus en base de données ─────────────────
  saveQidBatch: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            plantId: z.number().int().positive(),
            qid: z.string().regex(/^Q\d+$/, "Format QID invalide (ex: Q12345)"),
          })
        ).min(1).max(100),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const results: { plantId: number; qid: string; success: boolean; error?: string }[] = [];

      for (const { plantId, qid } of input.items) {
        try {
          await db.execute(
            sql`UPDATE plants SET wikidata_qid = ${qid}, updated_at = NOW() WHERE id = ${plantId}`
          );
          results.push({ plantId, qid, success: true });
        } catch (err) {
          results.push({ plantId, qid, success: false, error: String(err) });
        }
      }

      const saved = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;
      return { saved, failed, results };
    }),
});
