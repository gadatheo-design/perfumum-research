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

// Cache SPARQL interne (TTL 5 min)
const _sparqlCache = new Map<string, { result: unknown; exp: number }>();
import {
  findArtworksForMolecule,
  findPapersForMolecule,
  findCollectionsForPlant,
  findArtworksForMoleculesBatch,
  executeFreeSparqlQuery,
  getNoseStats,
} from "../sparql";
import mysql from "mysql2/promise";

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
      const cache = _sparqlCache;
      const cacheKey = input.query;
      if (input.useCache) {
        const entry = cache.get(cacheKey);
        if (entry && Date.now() < entry.exp) return entry.result;
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
        if (input.useCache) cache.set(cacheKey, { result, exp: Date.now() + 5 * 60 * 1000 });
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
});
