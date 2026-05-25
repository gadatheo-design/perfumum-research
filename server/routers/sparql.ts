/**
 * NOSE Phase 5 — Router tRPC SPARQL
 * ====================================
 * Expose les procédures SPARQL pour les requêtes croisées
 * PERFUMUM ↔ Wikidata ↔ Europeana
 */

import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import * as dbModule from "../db";
import { molecules as molTable, plants as plantTable, recettes as recTable, families as famTable, bibliographyEntries as bibTable } from "../../drizzle/schema";
import { like, and, or } from "drizzle-orm";

// Cache SPARQL interne en mémoire (TTL 5 min — fallback rapide)
const _sparqlCache = new Map<string, { result: unknown; exp: number }>();

// TTL du cache DB SPARQL (24h en ms)
const SPARQL_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Calcule le hash SHA-256 d'une requête SPARQL normalisée */
function hashQuery(query: string): string {
  return crypto.createHash("sha256").update(query.trim().replace(/\s+/g, " ")).digest("hex");
}

/** Lit le cache DB pour une requête donnée */
async function readDbCache(queryHash: string): Promise<unknown | null> {
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await conn.execute<mysql.RowDataPacket[]>(
      "SELECT results_json, expires_at FROM sparql_cache WHERE query_hash = ? AND expires_at > NOW() LIMIT 1",
      [queryHash]
    );
    if (rows.length > 0) {
      // Incrémenter le hit count
      await conn.execute("UPDATE sparql_cache SET hit_count = hit_count + 1, last_accessed_at = NOW() WHERE query_hash = ?", [queryHash]);
      await conn.end();
      return JSON.parse(rows[0].results_json as string);
    }
    await conn.end();
    return null;
  } catch { return null; }
}

/** Écrit le résultat dans le cache DB */
async function writeDbCache(queryHash: string, queryText: string, queryType: string, result: unknown, executionTimeMs: number): Promise<void> {
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL!);
    const expiresAt = new Date(Date.now() + SPARQL_CACHE_TTL_MS);
    const resultsJson = JSON.stringify(result);
    const resultObj = (result as Record<string, unknown>)?.results;
    const bindingsArr = resultObj && typeof resultObj === 'object' ? (resultObj as Record<string, unknown>).bindings : undefined;
    const resultCount = Array.isArray(bindingsArr) ? bindingsArr.length : 0;
    await conn.execute(
      `INSERT INTO sparql_cache (query_hash, query_text, query_type, results_json, result_count, execution_time_ms, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE results_json = VALUES(results_json), result_count = VALUES(result_count),
         execution_time_ms = VALUES(execution_time_ms), expires_at = VALUES(expires_at), last_accessed_at = NOW()`,
      [queryHash, queryText.substring(0, 5000), queryType, resultsJson, resultCount, executionTimeMs, expiresAt]
    );
    await conn.end();
  } catch { /* cache write failure is non-fatal */ }
}
import {
  findArtworksForMolecule,
  findPapersForMolecule,
  findCollectionsForPlant,
  findArtworksForMoleculesBatch,
  findMoleculeWikidataInfo,
  executeFreeSparqlQuery,
  getNoseStats,
} from "../sparql";
import mysql from "mysql2/promise";
import crypto from "crypto";

async function getDb() {
  return mysql.createConnection(process.env.DATABASE_URL!);
}

export const sparqlRouter = router({
  /**
   * Œuvres d'art Europeana/musées pour une molécule
   */
  artworksForMolecule: publicProcedure
    .input(
      z.object({
        moleculeId: z.number().int().positive(),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<any[]>(
          "SELECT id, name, wikidata_qid FROM molecules WHERE id = ? AND wikidata_qid IS NOT NULL",
          [input.moleculeId]
        );
        if (!rows.length || !rows[0].wikidata_qid) {
          return { artworks: [], error: "Molécule sans QID Wikidata" };
        }
        const mol = rows[0];
        const artworks = await findArtworksForMolecule(
          mol.wikidata_qid,
          mol.name,
          input.limit
        );
        return { artworks, moleculeName: mol.name, qid: mol.wikidata_qid };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Publications scientifiques pour une molécule
   */
  papersForMolecule: publicProcedure
    .input(
      z.object({
        moleculeId: z.number().int().positive(),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<any[]>(
          "SELECT id, name, wikidata_qid FROM molecules WHERE id = ? AND wikidata_qid IS NOT NULL",
          [input.moleculeId]
        );
        if (!rows.length || !rows[0].wikidata_qid) {
          return { papers: [], error: "Molécule sans QID Wikidata" };
        }
        const mol = rows[0];
        const papers = await findPapersForMolecule(
          mol.wikidata_qid,
          mol.name,
          input.limit
        );
        return { papers, moleculeName: mol.name, qid: mol.wikidata_qid };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Collections muséales pour une plante
   */
  collectionsForPlant: publicProcedure
    .input(
      z.object({
        plantId: z.number().int().positive(),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<any[]>(
          "SELECT id, name, wikidata_qid FROM plants WHERE id = ? AND wikidata_qid IS NOT NULL",
          [input.plantId]
        );
        if (!rows.length || !rows[0].wikidata_qid) {
          return { collections: [], error: "Plante sans QID Wikidata" };
        }
        const plant = rows[0];
        const collections = await findCollectionsForPlant(
          plant.wikidata_qid,
          plant.name,
          input.limit
        );
        return { collections, plantName: plant.name, qid: plant.wikidata_qid };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Œuvres d'art pour un batch de molécules (vue globale NOSE)
   */
  artworksBatch: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(50),
        familyFilter: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        let query = "SELECT id, name, wikidata_qid, family FROM molecules WHERE wikidata_qid IS NOT NULL";
        const params: any[] = [];
        if (input.familyFilter) {
          query += " AND family = ?";
          params.push(input.familyFilter);
        }
        query += " LIMIT 50";
        
        const [rows] = await conn.execute<any[]>(query, params);
        if (!rows.length) {
          return { artworks: [], total: 0 };
        }
        
        const qids = rows.map((r: any) => r.wikidata_qid as string);
        const artworks = await findArtworksForMoleculesBatch(qids, input.limit);
        
        return { artworks, total: artworks.length, moleculesChecked: rows.length };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Requête SPARQL libre (mode expert)
   */
  freeQuery: protectedProcedure
    .input(
      z.object({
        sparql: z.string().min(10).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      const result = await executeFreeSparqlQuery(input.sparql);
      return result;
    }),

  /**
   * Statistiques NOSE globales
   */
  noseStats: publicProcedure.query(async () => {
    const conn = await getDb();
    try {
      // Molécules avec QID Wikidata
      const [[{ totalWithQid }]] = await conn.execute<any[]>(
        "SELECT COUNT(*) as totalWithQid FROM molecules WHERE wikidata_qid IS NOT NULL"
      );
      const [[{ totalMolecules }]] = await conn.execute<any[]>(
        "SELECT COUNT(*) as totalMolecules FROM molecules"
      );
      const [[{ plantsWithQid }]] = await conn.execute<any[]>(
        "SELECT COUNT(*) as plantsWithQid FROM plants WHERE wikidata_qid IS NOT NULL"
      );
      const [[{ totalPlants }]] = await conn.execute<any[]>(
        "SELECT COUNT(*) as totalPlants FROM plants"
      );

      // Récupérer les QIDs pour les stats SPARQL (limité à 50)
      const [qidRows] = await conn.execute<any[]>(
        "SELECT wikidata_qid FROM molecules WHERE wikidata_qid IS NOT NULL LIMIT 50"
      );
      const qids = qidRows.map((r: any) => r.wikidata_qid as string);

      const sparqlStats = await getNoseStats(qids);

      return {
        molecules: {
          total: Number(totalMolecules),
          withQid: Number(totalWithQid),
          percent: Math.round((Number(totalWithQid) / Number(totalMolecules)) * 100),
        },
        plants: {
          total: Number(totalPlants),
          withQid: Number(plantsWithQid),
          percent: Math.round((Number(plantsWithQid) / Number(totalPlants)) * 100),
        },
        sparql: sparqlStats,
      };
    } finally {
      await conn.end();
    }
  }),

  /**
   * Templates de requêtes SPARQL prédéfinies
   */
  queryTemplates: publicProcedure.query(() => {
    return [
      {
        id: "artworks_molecule",
        name: "Œuvres d'art contenant une molécule",
        description: "Trouve les œuvres d'art qui dépeignent ou ont pour sujet une molécule spécifique",
        category: "art",
        sparql: `SELECT DISTINCT ?artwork ?artworkLabel ?image ?creatorLabel ?date ?collectionLabel WHERE {
  VALUES ?molecule { wd:Q{{QID}} }
  { ?artwork wdt:P180 ?molecule . } UNION { ?artwork wdt:P921 ?molecule . }
  OPTIONAL { ?artwork wdt:P18 ?image . }
  OPTIONAL { ?artwork wdt:P170 ?creator . }
  OPTIONAL { ?artwork wdt:P571 ?date . }
  OPTIONAL { ?artwork wdt:P195 ?collection . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 20`,
      },
      {
        id: "papers_molecule",
        name: "Publications scientifiques sur une molécule",
        description: "Trouve les articles scientifiques ayant une molécule comme sujet principal",
        category: "science",
        sparql: `SELECT DISTINCT ?paper ?paperLabel ?doi ?date ?journalLabel WHERE {
  VALUES ?molecule { wd:Q{{QID}} }
  ?paper wdt:P921 ?molecule .
  ?paper wdt:P31 wd:Q13442814 .
  OPTIONAL { ?paper wdt:P356 ?doi . }
  OPTIONAL { ?paper wdt:P577 ?date . }
  OPTIONAL { ?paper wdt:P1433 ?journal . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
ORDER BY DESC(?date)
LIMIT 20`,
      },
      {
        id: "plant_herbaria",
        name: "Herbiers et collections botaniques",
        description: "Trouve les spécimens d'une plante dans les herbiers et musées",
        category: "botanique",
        sparql: `SELECT DISTINCT ?item ?itemLabel ?collectionLabel ?countryLabel ?image WHERE {
  VALUES ?plant { wd:Q{{QID}} }
  { ?item wdt:P180 ?plant . } UNION { ?item wdt:P921 ?plant . }
  OPTIONAL { ?item wdt:P195 ?collection . }
  OPTIONAL { ?item wdt:P17 ?country . }
  OPTIONAL { ?item wdt:P18 ?image . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 20`,
      },
      {
        id: "molecule_uses",
        name: "Usages d'une molécule (parfumerie, médecine, cuisine)",
        description: "Trouve les usages documentés d'une molécule dans différents domaines",
        category: "usage",
        sparql: `SELECT DISTINCT ?use ?useLabel ?domain ?domainLabel WHERE {
  VALUES ?molecule { wd:Q{{QID}} }
  ?molecule wdt:P366 ?use .
  OPTIONAL { ?use wdt:P279 ?domain . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 30`,
      },
      {
        id: "perfume_compositions",
        name: "Parfums contenant une molécule",
        description: "Trouve les parfums documentés sur Wikidata contenant cette molécule",
        category: "parfumerie",
        sparql: `SELECT DISTINCT ?perfume ?perfumeLabel ?brandLabel ?year WHERE {
  VALUES ?molecule { wd:Q{{QID}} }
  ?perfume wdt:P31/wdt:P279* wd:Q131696 .  # instance of perfume
  { ?perfume wdt:P527 ?molecule . } UNION { ?perfume wdt:P186 ?molecule . }
  OPTIONAL { ?perfume wdt:P176 ?brand . }
  OPTIONAL { ?perfume wdt:P571 ?year . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 20`,
      },
      {
        id: "europeana_plant",
        name: "Représentations d'une plante dans l'art européen",
        description: "Trouve les représentations artistiques d'une plante dans les collections européennes",
        category: "europeana",
        sparql: `SELECT DISTINCT ?item ?itemLabel ?image ?creatorLabel ?date ?collectionLabel ?europeanaId WHERE {
  VALUES ?plant { wd:Q{{QID}} }
  ?item wdt:P180 ?plant .
  OPTIONAL { ?item wdt:P18 ?image . }
  OPTIONAL { ?item wdt:P170 ?creator . }
  OPTIONAL { ?item wdt:P571 ?date . }
  OPTIONAL { ?item wdt:P195 ?collection . }
  OPTIONAL { ?item wdt:P727 ?europeanaId . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 20`,
      },
      {
        id: "europeana_federated_plant",
        name: "[Fédéré] Plante Wikidata × Europeana (P727)",
        description: "Requête fédérée : croise les QID Wikidata des plantes avec leurs identifiants Europeana (P727) pour trouver les collections muséales correspondantes",
        category: "europeana-federated",
        sparql: `SELECT DISTINCT ?plant ?plantLabel ?europeanaId ?image WHERE {
  VALUES ?plant { wd:Q{{QID}} }
  ?plant wdt:P727 ?europeanaId .
  OPTIONAL { ?plant wdt:P18 ?image . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 20`,
      },
      {
        id: "europeana_federated_molecule",
        name: "[Fédéré] Molécule Wikidata × Europeana (P727)",
        description: "Requête fédérée : croise les QID Wikidata des molécules aromatiques avec leurs identifiants Europeana pour trouver les collections liées",
        category: "europeana-federated",
        sparql: `SELECT DISTINCT ?molecule ?moleculeLabel ?europeanaId ?formula WHERE {
  VALUES ?molecule { wd:Q{{QID}} }
  ?molecule wdt:P727 ?europeanaId .
  OPTIONAL { ?molecule wdt:P274 ?formula . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 20`,
      },
      {
        id: "europeana_federated_manuscripts",
        name: "[Fédéré] Manuscrits botaniques Wikidata × Europeana",
        description: "Trouve les manuscrits botaniques médiévaux sur Wikidata qui ont un identifiant Europeana (P727) — herbiers, traités de botanique, pharmacopées",
        category: "europeana-federated",
        sparql: `SELECT DISTINCT ?manuscript ?manuscriptLabel ?europeanaId ?date ?libraryLabel WHERE {
  ?manuscript wdt:P31/wdt:P279* wd:Q87167 .  # manuscrit
  ?manuscript wdt:P921 ?subject .
  ?subject wdt:P279*/wdt:P31* wd:Q756 .  # plante
  ?manuscript wdt:P727 ?europeanaId .
  OPTIONAL { ?manuscript wdt:P571 ?date . }
  OPTIONAL { ?manuscript wdt:P485 ?library . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 20`,
      },
      {
        id: "europeana_federated_perfume_bottles",
        name: "[Fédéré] Flacons de parfum historiques Wikidata × Europeana",
        description: "Trouve les flacons de parfum historiques sur Wikidata qui ont un identifiant Europeana — objets de collection, flacons anciens, flacons de maisons historiques",
        category: "europeana-federated",
        sparql: `SELECT DISTINCT ?bottle ?bottleLabel ?europeanaId ?date ?collectionLabel WHERE {
  ?bottle wdt:P31/wdt:P279* wd:Q1361551 .  # flacon de parfum
  ?bottle wdt:P727 ?europeanaId .
  OPTIONAL { ?bottle wdt:P571 ?date . }
  OPTIONAL { ?bottle wdt:P195 ?collection . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 20`,
      },

      // ─── AXE 2.4 : Templates temporels et généalogiques (Rapport 8) ────────────────────

      {
        id: "temporal_publications_molecule",
        name: "[Temporel] Évolution chronologique des publications (molécule)",
        description: "Visualise l'évolution dans le temps des publications scientifiques sur une molécule aromatique, groupées par année",
        category: "temporal",
        sparql: `SELECT ?year (COUNT(?paper) AS ?count) WHERE {
  VALUES ?molecule { wd:Q{{QID}} }
  ?paper wdt:P921 ?molecule ;
         wdt:P31 wd:Q13442814 ;
         wdt:P577 ?date .
  BIND(YEAR(?date) AS ?year)
  FILTER(?year >= 1900 && ?year <= 2025)
}
GROUP BY ?year
ORDER BY ?year`,
      },
      {
        id: "temporal_publications_plant",
        name: "[Temporel] Évolution chronologique des publications (plante)",
        description: "Visualise l'évolution dans le temps des publications scientifiques sur une plante aromatique, groupées par année",
        category: "temporal",
        sparql: `SELECT ?year (COUNT(?paper) AS ?count) WHERE {
  VALUES ?plant { wd:Q{{QID}} }
  ?paper wdt:P921 ?plant ;
         wdt:P31 wd:Q13442814 ;
         wdt:P577 ?date .
  BIND(YEAR(?date) AS ?year)
  FILTER(?year >= 1900 && ?year <= 2025)
}
GROUP BY ?year
ORDER BY ?year`,
      },
      {
        id: "temporal_artworks_timeline",
        name: "[Temporel] Chronologie des œuvres d'art liées à une molécule",
        description: "Explore la chronologie des œuvres d'art représentant ou liées à une molécule aromatique, de l'Antiquité à nos jours",
        category: "temporal",
        sparql: `SELECT ?artwork ?artworkLabel ?year ?creatorLabel ?collectionLabel WHERE {
  VALUES ?molecule { wd:Q{{QID}} }
  { ?artwork wdt:P180 ?molecule . } UNION { ?artwork wdt:P921 ?molecule . }
  ?artwork wdt:P571 ?date .
  BIND(YEAR(?date) AS ?year)
  OPTIONAL { ?artwork wdt:P170 ?creator . }
  OPTIONAL { ?artwork wdt:P195 ?collection . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
ORDER BY ?year
LIMIT 50`,
      },
      {
        id: "genealogy_plant_taxonomy",
        name: "[Généalogie] Taxonomie complète d'une plante (famille → genre → espèce)",
        description: "Reconstruit l'arbre taxonomique complet d'une plante aromatique depuis la famille jusqu'à l'espèce, avec les sous-taxons",
        category: "genealogy",
        sparql: `SELECT ?taxon ?taxonLabel ?rank ?rankLabel ?parentLabel WHERE {
  VALUES ?plant { wd:Q{{QID}} }
  ?plant wdt:P171* ?taxon .
  ?taxon wdt:P105 ?rank .
  OPTIONAL { ?taxon wdt:P171 ?parent . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
ORDER BY ?rank`,
      },
      {
        id: "genealogy_molecule_derivatives",
        name: "[Généalogie] Dérivés et analogues d'une molécule",
        description: "Explore les dérivés chimiques, analogues structuraux et molécules parent d'une molécule aromatique",
        category: "genealogy",
        sparql: `SELECT DISTINCT ?related ?relatedLabel ?relation ?relationLabel ?formula WHERE {
  VALUES ?molecule { wd:Q{{QID}} }
  {
    ?molecule wdt:P279 ?related .
    BIND("sous-classe de" AS ?relation)
  } UNION {
    ?related wdt:P279 ?molecule .
    BIND("super-classe de" AS ?relation)
  } UNION {
    ?molecule wdt:P527 ?related .
    BIND("a pour partie" AS ?relation)
  } UNION {
    ?related wdt:P527 ?molecule .
    BIND("partie de" AS ?relation)
  }
  OPTIONAL { ?related wdt:P274 ?formula . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 30`,
      },
      {
        id: "genealogy_plant_cultivars",
        name: "[Généalogie] Cultivars et variétés d'une plante aromatique",
        description: "Liste tous les cultivars, variétés et sous-espèces d'une plante aromatique avec leur origine géographique",
        category: "genealogy",
        sparql: `SELECT DISTINCT ?cultivar ?cultivarLabel ?countryLabel ?date WHERE {
  VALUES ?plant { wd:Q{{QID}} }
  ?cultivar wdt:P171 ?plant .
  ?cultivar wdt:P31/wdt:P279* wd:Q4886 .  # cultivar
  OPTIONAL { ?cultivar wdt:P17 ?country . }
  OPTIONAL { ?cultivar wdt:P571 ?date . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 30`,
      },
      {
        id: "temporal_perfume_history",
        name: "[Temporel] Histoire de la parfumerie par ère",
        description: "Explore les parfums historiques et maisons de parfumerie groupés par période historique",
        category: "temporal",
        sparql: `SELECT ?perfume ?perfumeLabel ?year ?brandLabel WHERE {
  ?perfume wdt:P31/wdt:P279* wd:Q131696 .
  ?perfume wdt:P571 ?date .
  BIND(YEAR(?date) AS ?year)
  OPTIONAL { ?perfume wdt:P176 ?brand . }
  FILTER(?year >= 1800)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
ORDER BY ?year
LIMIT 50`,
      },
      {
        id: "genealogy_olfactive_family",
        name: "[Généalogie] Arbre des familles olfactives",
        description: "Reconstruit la hiérarchie des familles olfactives (accord → famille → sous-famille) depuis Wikidata",
        category: "genealogy",
        sparql: `SELECT DISTINCT ?family ?familyLabel ?parentLabel ?description WHERE {
  ?family wdt:P31/wdt:P279* wd:Q1289248 .  # famille olfactive
  OPTIONAL { ?family wdt:P279 ?parent . }
  OPTIONAL { ?family schema:description ?description . FILTER(LANG(?description) = "fr") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
}
LIMIT 50`,
      },
    ];
  }),

  /**
   * Sprint 3.1 — Requête SPARQL directe sur l'endpoint Europeana natif
   * Endpoint : https://sparql.europeana.eu/
   * Modèle de données : EDM (Europeana Data Model)
   * Préfixes disponibles : edm:, dc:, dcterms:, skos:, ore:, foaf:
   */
  europeanaQuery: publicProcedure
    .input(
      z.object({
        sparql: z.string().min(10).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      const EUROPEANA_SPARQL_ENDPOINT = "https://sparql.europeana.eu/";
      const TIMEOUT_MS = 20_000;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const response = await fetch(EUROPEANA_SPARQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/sparql-results+json",
            "User-Agent": "PERFUMUM-Research/1.0",
          },
          body: new URLSearchParams({ query: input.sparql }).toString(),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          const text = await response.text();
          return {
            success: false,
            results: [],
            vars: [],
            error: `Europeana SPARQL HTTP ${response.status}: ${text.slice(0, 200)}`,
          };
        }

        const data = await response.json() as any;
        const vars: string[] = data.head?.vars || [];
        const bindings = data.results?.bindings || [];

        const results = bindings.map((binding: any) => {
          const row: Record<string, string> = {};
          for (const v of vars) {
            if (binding[v]) {
              row[v] = binding[v].value || "";
            }
          }
          return row;
        });

        return { success: true, results, vars, total: results.length };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Erreur SPARQL Europeana";
        return { success: false, results: [], vars: [], error: msg };
      }
    }),

  /**
   * Sprint 3.1 — Templates SPARQL EDM Europeana
   * Retourne les templates de requêtes SPARQL pour l'endpoint Europeana natif
   */
  /**
   * Axe 2.1 — Requête SPARQL interne PERFUMUM
   * Traduit les requêtes SPARQL SELECT en requêtes SQL sur les données PERFUMUM
   * Supporte : perfumum:Molecule, perfumum:Plant, perfumum:Recipe, perfumum:OlfactiveFamily, perfumum:BibliographyEntry
   */
  internalQuery: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(5000),
      useCache: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const startTime = Date.now();
      const cache = _sparqlCache;
      const cacheKey = input.query;
      if (input.useCache) {
        // 1. Cache mémoire (5 min)
        const entry = cache.get(cacheKey);
        if (entry && Date.now() < entry.exp) return entry.result;
        // 2. Cache DB (24h)
        const qHash = hashQuery(input.query);
        const dbCached = await readDbCache(qHash);
        if (dbCached !== null) {
          cache.set(cacheKey, { result: dbCached, exp: Date.now() + 5 * 60 * 1000 });
          return dbCached;
        }
      }

      // Parseur minimal SPARQL → type d'entité
      const q = input.query.replace(/\s+/g, " ").trim();
      const whereMatch = q.match(/WHERE\s*\{(.*?)\}/is);
      const whereClause = whereMatch ? whereMatch[1] : "";
      const limitMatch = q.match(/LIMIT\s+(\d+)/i);
      const offsetMatch = q.match(/OFFSET\s+(\d+)/i);
      const limit = limitMatch ? Math.min(parseInt(limitMatch[1]), 1000) : 100;
      const offset = offsetMatch ? parseInt(offsetMatch[1]) : 0;

      // Terme de recherche FILTER(CONTAINS(?name, "..."))
      const filterMatch = whereClause.match(/FILTER\s*\(\s*CONTAINS\s*\(\s*\?\w+\s*,\s*"([^"]+)"\s*\)\s*\)/i);
      const searchTerm = filterMatch ? filterMatch[1] : undefined;

      // Détection du type d'entité
      let entityType = "Unknown";
      if (whereClause.includes("perfumum:Molecule")) entityType = "Molecule";
      else if (whereClause.includes("perfumum:Plant")) entityType = "Plant";
      else if (whereClause.includes("perfumum:Recipe")) entityType = "Recipe";
      else if (whereClause.includes("perfumum:OlfactiveFamily")) entityType = "OlfactiveFamily";
      else if (whereClause.includes("perfumum:BibliographyEntry") || whereClause.includes("perfumum:Bibliography")) entityType = "Bibliography";

      const PERFUMUM_DATA = "http://perfumum.research/data/";
      const uri = (t: string, id: number) => ({ type: "uri" as const, value: `${PERFUMUM_DATA}${t}/${id}` });
      const lit = (v: unknown) => ({ type: "literal" as const, value: String(v ?? "") });

      try {
        const db = await dbModule.getDb();
        if (!db) return { error: "DB_ERROR", message: "Base de données non disponible", query: input.query };

        let bindings: Record<string, { type: string; value: string }>[] = [];
        let vars: string[] = [];

        if (entityType === "Molecule") {
          const conds = searchTerm ? [like(molTable.name, `%${searchTerm}%`)] : [];
          const rows = await db.select({ id: molTable.id, name: molTable.name, casNumber: molTable.casNumber, iupacName: molTable.iupacName, wikidataQid: molTable.wikidataQid }).from(molTable).where(conds.length ? and(...conds) : undefined).limit(limit).offset(offset);
          vars = ["molecule", "name", "casNumber", "iupacName", "wikidataQid"];
          bindings = rows.map((r: typeof rows[0]) => ({ molecule: uri("molecule", r.id), name: lit(r.name), casNumber: lit(r.casNumber), iupacName: lit(r.iupacName), wikidataQid: lit(r.wikidataQid) }));
        } else if (entityType === "Plant") {
          const conds = searchTerm ? [or(like(plantTable.name, `%${searchTerm}%`), like(plantTable.latinName, `%${searchTerm}%`))] : [];
          const rows = await db.select({ id: plantTable.id, name: plantTable.name, latinName: plantTable.latinName, family: plantTable.family, wikidataQid: plantTable.wikidataQid }).from(plantTable).where(conds.length ? and(...conds) : undefined).limit(limit).offset(offset);
          vars = ["plant", "name", "latinName", "family", "wikidataQid"];
          bindings = rows.map((r: typeof rows[0]) => ({ plant: uri("plant", r.id), name: lit(r.name), latinName: lit(r.latinName), family: lit(r.family), wikidataQid: lit(r.wikidataQid) }));
        } else if (entityType === "Recipe") {
          const conds = searchTerm ? [like(recTable.name, `%${searchTerm}%`)] : [];
          const rows = await db.select({ id: recTable.id, name: recTable.name, description: recTable.description, wikidataQid: recTable.wikidataQid }).from(recTable).where(conds.length ? and(...conds) : undefined).limit(limit).offset(offset);
          vars = ["recipe", "name", "description", "wikidataQid"];
          bindings = rows.map((r: typeof rows[0]) => ({ recipe: uri("recipe", r.id), name: lit(r.name), description: lit(r.description), wikidataQid: lit(r.wikidataQid) }));
        } else if (entityType === "OlfactiveFamily") {
          const conds = searchTerm ? [like(famTable.name, `%${searchTerm}%`)] : [];
          const rows = await db.select({ id: famTable.id, name: famTable.name, type: famTable.type, description: famTable.description, wikidataQid: famTable.wikidataQid }).from(famTable).where(conds.length ? and(...conds) : undefined).limit(limit).offset(offset);
          vars = ["family", "name", "type", "description", "wikidataQid"];
          bindings = rows.map((r: typeof rows[0]) => ({ family: uri("family", r.id), name: lit(r.name), type: lit(r.type), description: lit(r.description), wikidataQid: lit(r.wikidataQid) }));
        } else if (entityType === "Bibliography") {
          const conds = searchTerm ? [like(bibTable.title, `%${searchTerm}%`)] : [];
          const rows = await db.select({ id: bibTable.id, title: bibTable.title, authors: bibTable.authors, year: bibTable.year, doi: bibTable.doi, wikidataQid: bibTable.wikidataQid }).from(bibTable).where(conds.length ? and(...conds) : undefined).limit(limit).offset(offset);
          vars = ["entry", "title", "authors", "year", "doi", "wikidataQid"];
          bindings = rows.map((r: typeof rows[0]) => ({ entry: uri("bibliography", r.id), title: lit(r.title), authors: lit(r.authors), year: lit(r.year), doi: lit(r.doi), wikidataQid: lit(r.wikidataQid) }));
        } else {
          return { error: "UNSUPPORTED_ENTITY", message: "Type d'entité non supporté. Utilisez perfumum:Molecule, perfumum:Plant, perfumum:Recipe, perfumum:OlfactiveFamily, ou perfumum:BibliographyEntry.", query: input.query };
        }

        const result = { head: { vars }, results: { bindings } };
        if (input.useCache) {
          cache.set(cacheKey, { result, exp: Date.now() + 5 * 60 * 1000 });
          // Écrire aussi dans le cache DB (TTL 24h)
          const qHash = hashQuery(input.query);
          void writeDbCache(qHash, input.query, "SELECT", result, Date.now() - startTime);
        }
        return result;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return { error: "EXECUTION_ERROR", message, query: input.query };
      }
    }),

  /**
   * Axe 2.1 — Exemples de requêtes SPARQL internes PERFUMUM
   */
  internalExamples: publicProcedure.query(() => {
    return [
      { title: "Toutes les molécules", query: `SELECT ?molecule ?name ?casNumber WHERE {\n  ?molecule a perfumum:Molecule ;\n            perfumum:name ?name .\n} LIMIT 100` },
      { title: "Recherche molécule", query: `SELECT ?molecule ?name ?casNumber WHERE {\n  ?molecule a perfumum:Molecule ;\n            perfumum:name ?name .\n  FILTER(CONTAINS(?name, "linalool"))\n} LIMIT 20` },
      { title: "Plantes avec Wikidata", query: `SELECT ?plant ?name ?latinName ?wikidataQid WHERE {\n  ?plant a perfumum:Plant ;\n         perfumum:name ?name ;\n         perfumum:wikidataQid ?wikidataQid .\n} LIMIT 50` },
      { title: "Recettes", query: `SELECT ?recipe ?name ?description WHERE {\n  ?recipe a perfumum:Recipe ;\n          perfumum:name ?name .\n} LIMIT 30` },
      { title: "Familles olfactives", query: `SELECT ?family ?name ?type WHERE {\n  ?family a perfumum:OlfactiveFamily .\n} LIMIT 20` },
      { title: "Bibliographie", query: `SELECT ?entry ?title ?authors ?year WHERE {\n  ?entry a perfumum:BibliographyEntry ;\n         perfumum:title ?title .\n  FILTER(CONTAINS(?title, "olfact"))\n} LIMIT 20` },
    ];
  }),

  /**
   * Axe 2.5 — Statistiques du cache SPARQL DB
   */
  getCacheStats: publicProcedure.query(async () => {
    try {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      const [total] = await conn.execute<mysql.RowDataPacket[]>("SELECT COUNT(*) as cnt FROM sparql_cache");
      const [active] = await conn.execute<mysql.RowDataPacket[]>("SELECT COUNT(*) as cnt FROM sparql_cache WHERE expires_at > NOW()");
      const [expired] = await conn.execute<mysql.RowDataPacket[]>("SELECT COUNT(*) as cnt FROM sparql_cache WHERE expires_at <= NOW()");
      const [hits] = await conn.execute<mysql.RowDataPacket[]>("SELECT SUM(hit_count) as total_hits, AVG(hit_count) as avg_hits, MAX(hit_count) as max_hits FROM sparql_cache");
      const [topQueries] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT query_text, hit_count, result_count, execution_time_ms, expires_at FROM sparql_cache ORDER BY hit_count DESC LIMIT 5"
      );
      await conn.end();
      return {
        total: Number(total[0].cnt),
        active: Number(active[0].cnt),
        expired: Number(expired[0].cnt),
        totalHits: Number(hits[0].total_hits ?? 0),
        avgHits: Number(hits[0].avg_hits ?? 0),
        maxHits: Number(hits[0].max_hits ?? 0),
        topQueries: topQueries as Record<string, unknown>[],
      };
    } catch (e) {
      return { total: 0, active: 0, expired: 0, totalHits: 0, avgHits: 0, maxHits: 0, topQueries: [], error: String(e) };
    }
  }),

  /**
   * Axe 2.5 — Vider le cache SPARQL DB (entrées expirées ou tout)
   */
  clearSparqlCache: protectedProcedure
    .input(z.object({ expiredOnly: z.boolean().default(true) }))
    .mutation(async ({ input }) => {
      try {
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        let deleted = 0;
        if (input.expiredOnly) {
          const [result] = await conn.execute<mysql.OkPacket>("DELETE FROM sparql_cache WHERE expires_at <= NOW()");
          deleted = result.affectedRows;
        } else {
          const [result] = await conn.execute<mysql.OkPacket>("DELETE FROM sparql_cache");
          deleted = result.affectedRows;
          _sparqlCache.clear();
        }
        await conn.end();
        return { deleted, message: `${deleted} entrée(s) supprimée(s) du cache SPARQL` };
      } catch (e) {
        throw new Error(`Erreur nettoyage cache: ${e}`);
      }
    }),

  europeanaTemplates: publicProcedure.query(() => {
    return [
      {
        id: "edm_plant_search",
        name: "Plantes aromatiques dans les collections EDM",
        description: "Cherche les objets culturels liés aux plantes aromatiques dans le modèle EDM Europeana",
        sparql: `PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?item ?title ?provider ?date WHERE {
  ?item a edm:ProvidedCHO .
  ?item dc:subject ?subject .
  FILTER(REGEX(STR(?subject), "rose|jasmine|lavender|frankincense|myrrh", "i"))
  OPTIONAL { ?item dc:title ?title . }
  OPTIONAL { ?item edm:dataProvider ?provider . }
  OPTIONAL { ?item dc:date ?date . }
}
LIMIT 15`,
      },
      {
        id: "edm_manuscripts",
        name: "Manuscrits botaniques médiévaux (EDM)",
        description: "Trouve les manuscrits botaniques dans les collections Europeana via le modèle EDM",
        sparql: `PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?item ?title ?provider ?type WHERE {
  ?item a edm:ProvidedCHO .
  ?item dc:type ?type .
  FILTER(REGEX(STR(?type), "manuscript|herbarium|herbal", "i"))
  OPTIONAL { ?item dc:title ?title . }
  OPTIONAL { ?item edm:dataProvider ?provider . }
}
LIMIT 15`,
      },
      {
        id: "edm_perfume_bottles",
        name: "Flacons de parfum historiques (EDM)",
        description: "Trouve les flacons et objets liés à la parfumerie dans les collections Europeana",
        sparql: `PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>

SELECT ?item ?title ?provider ?date WHERE {
  ?item a edm:ProvidedCHO .
  { ?item dc:subject ?s . FILTER(REGEX(STR(?s), "perfume|parfum|scent|fragrance", "i")) }
  UNION
  { ?item dc:type ?t . FILTER(REGEX(STR(?t), "bottle|flacon|vial", "i")) }
  OPTIONAL { ?item dc:title ?title . }
  OPTIONAL { ?item edm:dataProvider ?provider . }
  OPTIONAL { ?item dc:date ?date . }
}
LIMIT 15`,
      },
      {
        id: "edm_spice_routes",
        name: "Routes des épices et commerce olfactif (EDM)",
        description: "Trouve les cartes, documents et objets liés aux routes commerciales des épices et aromates",
        sparql: `PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?item ?title ?provider ?spatial WHERE {
  ?item a edm:ProvidedCHO .
  ?item dc:subject ?subject .
  FILTER(REGEX(STR(?subject), "spice|epice|épice|trade|commerce|incense|encens", "i"))
  OPTIONAL { ?item dc:title ?title . }
  OPTIONAL { ?item edm:dataProvider ?provider . }
  OPTIONAL { ?item dcterms:spatial ?spatial . }
}
LIMIT 15`,
      },
    ];
  }),

  /**
   * Axe 2.2 — Requête fédérée PERFUMUM ↔ Wikidata
   * Enrichit les données PERFUMUM avec des informations Wikidata via SERVICE SPARQL
   */
  federatedWikidata: publicProcedure
    .input(z.object({
      entityType: z.enum(["molecule", "plant", "family"]),
      entityId: z.number().int().positive(),
      queryType: z.enum(["taxonomy", "publications", "images", "related", "timeline"]).default("publications"),
      limit: z.number().min(1).max(50).default(20),
      useCache: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      // 1. Récupérer le QID Wikidata de l'entité
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      let qid: string | null = null;
      let entityName = "";
      try {
        let table = "molecules"; let nameCol = "name";
        if (input.entityType === "plant") { table = "plants"; nameCol = "name"; }
        else if (input.entityType === "family") { table = "olfactive_families"; nameCol = "name"; }
        const [rows] = await conn.execute<mysql.RowDataPacket[]>(
          `SELECT wikidata_qid, ${nameCol} as name FROM ${table} WHERE id = ? LIMIT 1`,
          [input.entityId]
        );
        if (rows.length > 0) { qid = rows[0].wikidata_qid as string | null; entityName = rows[0].name as string; }
      } finally { await conn.end(); }

      if (!qid) return { found: false, entityId: input.entityId, entityType: input.entityType, message: "Entité sans QID Wikidata — impossible d'interroger Wikidata" };

      // 2. Construire la requête SPARQL Wikidata selon le type
      const cacheKey = `federated_wikidata_${qid}_${input.queryType}_${input.limit}`;
      if (input.useCache) {
        const cached = _sparqlCache.get(cacheKey);
        if (cached && Date.now() < cached.exp) return cached.result;
        const qHash = hashQuery(cacheKey);
        const dbCached = await readDbCache(qHash);
        if (dbCached !== null) { _sparqlCache.set(cacheKey, { result: dbCached, exp: Date.now() + 5 * 60 * 1000 }); return dbCached; }
      }

      let sparqlQuery = "";
      const WIKIDATA_SPARQL = "https://query.wikidata.org/sparql";

      if (input.queryType === "taxonomy") {
        sparqlQuery = `SELECT ?parent ?parentLabel ?rank ?rankLabel WHERE {
  wd:${qid} wdt:P171* ?parent .
  ?parent wdt:P105 ?rank .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
} LIMIT ${input.limit}`;
      } else if (input.queryType === "publications") {
        sparqlQuery = `SELECT ?work ?workLabel ?date ?doi WHERE {
  ?work wdt:P921 wd:${qid} .
  OPTIONAL { ?work wdt:P577 ?date . }
  OPTIONAL { ?work wdt:P356 ?doi . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
} ORDER BY DESC(?date) LIMIT ${input.limit}`;
      } else if (input.queryType === "images") {
        sparqlQuery = `SELECT ?image ?depictsLabel WHERE {
  wd:${qid} wdt:P18 ?image .
  OPTIONAL { wd:${qid} rdfs:label ?depictsLabel . FILTER(LANG(?depictsLabel) = "fr") }
} LIMIT ${input.limit}`;
      } else if (input.queryType === "related") {
        sparqlQuery = `SELECT ?related ?relatedLabel ?relation ?relationLabel WHERE {
  { wd:${qid} ?relation ?related . ?related wdt:P31 wd:Q11173 . }
  UNION
  { ?related ?relation wd:${qid} . ?related wdt:P31 wd:Q11173 . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
} LIMIT ${input.limit}`;
      } else if (input.queryType === "timeline") {
        sparqlQuery = `SELECT ?year (COUNT(?work) AS ?count) WHERE {
  ?work wdt:P921 wd:${qid} .
  ?work wdt:P577 ?date .
  BIND(YEAR(?date) AS ?year)
  FILTER(?year >= 1900 && ?year <= 2030)
} GROUP BY ?year ORDER BY ?year`;
      }

      try {
        const startTime = Date.now();
        const url = `${WIKIDATA_SPARQL}?query=${encodeURIComponent(sparqlQuery)}&format=json`;
        const res = await fetch(url, {
          headers: { "Accept": "application/sparql-results+json", "User-Agent": "PERFUMUM-Research/1.0 (https://perfumum-h2pjhhjb.manus.space)" },
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) return { found: true, qid, entityName, error: `Wikidata HTTP ${res.status}`, results: [] };
        const data = await res.json() as Record<string, unknown>;
        const bindings = ((data.results as Record<string, unknown>)?.bindings as Record<string, unknown>[]) ?? [];
        const vars = ((data.head as Record<string, unknown>)?.vars as string[]) ?? [];
        const execMs = Date.now() - startTime;
        const result = { found: true, qid, entityName, entityType: input.entityType, queryType: input.queryType, vars, bindings, count: bindings.length, executionMs: execMs, sparqlQuery };
        if (input.useCache) {
          _sparqlCache.set(cacheKey, { result, exp: Date.now() + 5 * 60 * 1000 });
          void writeDbCache(hashQuery(cacheKey), sparqlQuery, "FEDERATED_WIKIDATA", result, execMs);
        }
        return result;
      } catch (err) {
        return { found: true, qid, entityName, error: String(err instanceof Error ? err.message : err), results: [] };
      }
    }),

  /**
   * Axe 2.2 — Requête fédérée PERFUMUM ↔ OpenAlex
   * Enrichit les données PERFUMUM avec les publications OpenAlex par entité
   */
  federatedOpenAlex: publicProcedure
    .input(z.object({
      entityType: z.enum(["molecule", "plant", "family"]),
      entityId: z.number().int().positive(),
      queryType: z.enum(["publications", "timeline", "authors", "concepts"]).default("publications"),
      limit: z.number().min(1).max(50).default(20),
      useCache: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      let entityName = "";
      let casNumber: string | null = null;
      let latinName: string | null = null;
      try {
        if (input.entityType === "molecule") {
          const [rows] = await conn.execute<mysql.RowDataPacket[]>("SELECT name, cas_number FROM molecules WHERE id = ? LIMIT 1", [input.entityId]);
          if (rows.length > 0) { entityName = rows[0].name as string; casNumber = rows[0].cas_number as string | null; }
        } else if (input.entityType === "plant") {
          const [rows] = await conn.execute<mysql.RowDataPacket[]>("SELECT name, latin_name FROM plants WHERE id = ? LIMIT 1", [input.entityId]);
          if (rows.length > 0) { entityName = rows[0].name as string; latinName = rows[0].latin_name as string | null; }
        } else {
          const [rows] = await conn.execute<mysql.RowDataPacket[]>("SELECT name FROM olfactive_families WHERE id = ? LIMIT 1", [input.entityId]);
          if (rows.length > 0) entityName = rows[0].name as string;
        }
      } finally { await conn.end(); }

      if (!entityName) return { found: false, entityId: input.entityId, message: "Entité introuvable" };

      const searchTerm = latinName ?? casNumber ?? entityName;
      const cacheKey = `federated_openalex_${input.entityType}_${input.entityId}_${input.queryType}_${input.limit}`;
      if (input.useCache) {
        const cached = _sparqlCache.get(cacheKey);
        if (cached && Date.now() < cached.exp) return cached.result;
        const dbCached = await readDbCache(hashQuery(cacheKey));
        if (dbCached !== null) { _sparqlCache.set(cacheKey, { result: dbCached, exp: Date.now() + 5 * 60 * 1000 }); return dbCached; }
      }

      try {
        const startTime = Date.now();
        let url = "";
        if (input.queryType === "publications") {
          url = `https://api.openalex.org/works?search=${encodeURIComponent(searchTerm)}&per-page=${input.limit}&sort=cited_by_count:desc&mailto=perfumum-research@contact.fr`;
        } else if (input.queryType === "timeline") {
          url = `https://api.openalex.org/works?search=${encodeURIComponent(searchTerm)}&group_by=publication_year&mailto=perfumum-research@contact.fr`;
        } else if (input.queryType === "authors") {
          url = `https://api.openalex.org/authors?search=${encodeURIComponent(searchTerm)}&per-page=${input.limit}&mailto=perfumum-research@contact.fr`;
        } else if (input.queryType === "concepts") {
          url = `https://api.openalex.org/concepts?search=${encodeURIComponent(searchTerm)}&per-page=${input.limit}&mailto=perfumum-research@contact.fr`;
        }
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!res.ok) return { found: true, entityName, error: `OpenAlex HTTP ${res.status}`, results: [] };
        const data = await res.json() as Record<string, unknown>;
        const execMs = Date.now() - startTime;
        const result = { found: true, entityName, entityType: input.entityType, queryType: input.queryType, searchTerm, data, executionMs: execMs };
        if (input.useCache) {
          _sparqlCache.set(cacheKey, { result, exp: Date.now() + 5 * 60 * 1000 });
          void writeDbCache(hashQuery(cacheKey), url, "FEDERATED_OPENALEX", result, execMs);
        }
        return result;
      } catch (err) {
        return { found: true, entityName, error: String(err instanceof Error ? err.message : err), results: [] };
      }
    }),

  /**
   * Axe 2.2 — Requête fédérée libre : PERFUMUM + Wikidata en parallèle
   * Pour une molécule ou plante, retourne les données PERFUMUM + enrichissement Wikidata
   */
  federatedEnrich: publicProcedure
    .input(z.object({
      entityType: z.enum(["molecule", "plant"]),
      entityId: z.number().int().positive(),
    }))
    .query(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        let perfumumData: Record<string, unknown> = {};
        let qid: string | null = null;
        if (input.entityType === "molecule") {
          const [rows] = await conn.execute<mysql.RowDataPacket[]>(
            "SELECT id, name, cas_number, iupac_name, wikidata_qid, chemical_class, molecular_formula FROM molecules WHERE id = ? LIMIT 1",
            [input.entityId]
          );
          if (rows.length > 0) { perfumumData = rows[0] as Record<string, unknown>; qid = rows[0].wikidata_qid as string | null; }
        } else {
          const [rows] = await conn.execute<mysql.RowDataPacket[]>(
            "SELECT id, name, latin_name, family, wikidata_qid, origin_country FROM plants WHERE id = ? LIMIT 1",
            [input.entityId]
          );
          if (rows.length > 0) { perfumumData = rows[0] as Record<string, unknown>; qid = rows[0].wikidata_qid as string | null; }
        }
        if (!perfumumData.id) return { found: false };

        // Enrichissement Wikidata si QID disponible
        let wikidataData: Record<string, unknown> | null = null;
        if (qid) {
          try {
            const sparql = `SELECT ?prop ?propLabel ?value ?valueLabel WHERE {
  wd:${qid} ?prop ?value .
  FILTER(?prop IN (wdt:P31, wdt:P279, wdt:P171, wdt:P18, wdt:P117, wdt:P231, wdt:P2067, wdt:P274))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
} LIMIT 30`;
            const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
            const res = await fetch(url, { headers: { "Accept": "application/sparql-results+json", "User-Agent": "PERFUMUM-Research/1.0" }, signal: AbortSignal.timeout(10000) });
            if (res.ok) {
              const data = await res.json() as Record<string, unknown>;
              wikidataData = { qid, bindings: ((data.results as Record<string, unknown>)?.bindings ?? []) };
            }
          } catch { /* non-fatal */ }
        }
        return { found: true, perfumumData, wikidataData, qid };
      } finally { await conn.end(); }
    }),

  /**
   * Propriétés chimiques complètes d'une molécule via Wikidata
   * Retourne formule, CAS, SMILES, InChI, usages, sources naturelles
   */
  moleculeWikidataInfo: publicProcedure
    .input(z.object({
      moleculeId: z.number().int().positive(),
    }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<any[]>(
          "SELECT id, name, wikidata_qid, cas_number, iupac_name FROM molecules WHERE id = ? LIMIT 1",
          [input.moleculeId]
        );
        if (!rows.length) return { found: false, error: "Molécule introuvable" };
        const mol = rows[0];
        if (!mol.wikidata_qid) {
          return {
            found: true,
            hasQid: false,
            moleculeName: mol.name,
            perfumumData: { casNumber: mol.cas_number, iupacName: mol.iupac_name },
            wikidataInfo: null,
            wikidataUrl: null,
          };
        }
        const wikidataInfo = await findMoleculeWikidataInfo(mol.wikidata_qid, mol.name);
        return {
          found: true,
          hasQid: true,
          moleculeName: mol.name,
          qid: mol.wikidata_qid,
          wikidataUrl: `https://www.wikidata.org/wiki/${mol.wikidata_qid}`,
          perfumumData: { casNumber: mol.cas_number, iupacName: mol.iupac_name },
          wikidataInfo,
        };
      } finally {
        await conn.end();
      }
    }),

  /**
   * Publications pour une molécule avec fallback OpenAlex si Wikidata retourne 0 résultats
   */
  papersForMoleculeWithFallback: publicProcedure
    .input(z.object({
      moleculeId: z.number().int().positive(),
      limit: z.number().int().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const conn = await getDb();
      try {
        const [rows] = await conn.execute<any[]>(
          "SELECT id, name, wikidata_qid, cas_number FROM molecules WHERE id = ? AND wikidata_qid IS NOT NULL LIMIT 1",
          [input.moleculeId]
        );
        if (!rows.length || !rows[0].wikidata_qid) {
          return { papers: [], source: "none", error: "Molécule sans QID Wikidata" };
        }
        const mol = rows[0];
        // 1. Essayer Wikidata d'abord
        const wikidataPapers = await findPapersForMolecule(mol.wikidata_qid, mol.name, input.limit);
        if (wikidataPapers.length > 0) {
          return { papers: wikidataPapers, source: "wikidata", moleculeName: mol.name, qid: mol.wikidata_qid };
        }
        // 2. Fallback OpenAlex si Wikidata retourne 0
        try {
          const searchQuery = mol.cas_number ? `${mol.name} ${mol.cas_number}` : mol.name;
          const oaUrl = `https://api.openalex.org/works?search=${encodeURIComponent(searchQuery)}&filter=type:article&sort=cited_by_count:desc&per-page=${input.limit}&mailto=perfumum@research.fr`;
          const oaRes = await fetch(oaUrl, { signal: AbortSignal.timeout(15000) });
          if (oaRes.ok) {
            const oaData = await oaRes.json() as Record<string, unknown>;
            const results = (oaData.results as Record<string, unknown>[]) ?? [];
            const papers = results.map((r: Record<string, unknown>) => ({
              qid: "",
              title: (r.title as string) || "Sans titre",
              doi: r.doi ? String(r.doi).replace("https://doi.org/", "") : undefined,
              date: r.publication_date ? String(r.publication_date).substring(0, 10) : undefined,
              journal: (r.primary_location as Record<string, unknown>)?.source ? ((r.primary_location as Record<string, unknown>).source as Record<string, unknown>)?.display_name as string : undefined,
              authors: (r.authorships as Record<string, unknown>[])?.slice(0, 3).map((a: Record<string, unknown>) => (a.author as Record<string, unknown>)?.display_name).filter(Boolean).join(", "),
              wikidataUrl: r.doi ? `https://doi.org/${String(r.doi).replace("https://doi.org/", "")}` : "",
              moleculeName: mol.name,
              moleculeQid: mol.wikidata_qid,
              citedByCount: r.cited_by_count as number,
            }));
            return { papers, source: "openalex", moleculeName: mol.name, qid: mol.wikidata_qid };
          }
        } catch { /* fallback failed */ }
        return { papers: [], source: "wikidata", moleculeName: mol.name, qid: mol.wikidata_qid };
      } finally {
        await conn.end();
      }
    }),
});
