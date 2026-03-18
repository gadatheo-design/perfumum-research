/**
 * NOSE Phase 5 — Router tRPC SPARQL
 * ====================================
 * Expose les procédures SPARQL pour les requêtes croisées
 * PERFUMUM ↔ Wikidata ↔ Europeana
 */

import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
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
        
        const qids = rows.map((r: any) => r.wikidata_qid);
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
      const qids = qidRows.map((r: any) => r.wikidata_qid);

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
    ];
  }),
});
