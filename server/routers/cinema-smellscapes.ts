/**
 * Cinema Smellscapes Router
 * ========================
 * Gestion des occurrences olfactives dans le patrimoine cinématographique.
 * Combine :
 * - Requêtes SPARQL Wikidata (films, réalisateurs, lieux de tournage)
 * - CRUD pour enregistrer les smellscapes identifiés
 * - Liaison avec les molécules/plantes/recettes PERFUMUM
 */
import { z } from "zod";
import mysql from "mysql2/promise";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getMysqlConnection } from "../db/mysqlPool";

async function getConn() {
  return getMysqlConnection();
}

// ─── Types ────────────────────────────────────────────────────────────────────

const SmellTypeEnum = z.enum(["explicit", "implied", "symbolic", "atmospheric", "narrative"]);
const HeritageStatusEnum = z.enum(["active", "endangered", "lost", "reconstructed"]);
const SourceTypeEnum = z.enum(["film", "documentary", "archive", "interview", "academic"]);

const CinemaSmellscapeInput = z.object({
  filmTitle: z.string().min(1),
  filmWikidataQid: z.string().optional(),
  director: z.string().optional(),
  directorQid: z.string().optional(),
  year: z.number().int().min(1888).max(2100).optional(),
  country: z.string().optional(),
  sceneDescription: z.string().min(1),
  timestampScene: z.string().optional(),
  smellDescription: z.string().min(1),
  smellType: SmellTypeEnum.default("atmospheric"),
  olfactoryNotes: z.string().optional(),
  linkedMoleculeIds: z.array(z.number()).optional(),
  linkedPlantIds: z.array(z.number()).optional(),
  linkedRecipeIds: z.array(z.number()).optional(),
  filmingLocation: z.string().optional(),
  filmingLocationQid: z.string().optional(),
  culturalContext: z.string().optional(),
  heritageStatus: HeritageStatusEnum.default("active"),
  researchNotes: z.string().optional(),
  sourceType: SourceTypeEnum.default("film"),
  tags: z.array(z.string()).optional(),
});

// ─── SPARQL Wikidata helpers ──────────────────────────────────────────────────

async function queryWikidata(sparql: string): Promise<any[]> {
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}&format=json`;
  const res = await fetch(url, {
    headers: {
      "Accept": "application/sparql-results+json",
      "User-Agent": "PERFUMUM-Research/1.0 (https://perfumum-h2pjhhjb.manus.space; research@perfumum.art)",
    },
  });
  if (!res.ok) throw new Error(`Wikidata SPARQL error: ${res.status}`);
  const data = await res.json();
  return data.results?.bindings ?? [];
}

function wikidataVal(binding: any, key: string): string {
  return binding?.[key]?.value ?? "";
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const cinemaSmellscapesRouter = router({

  // ── SPARQL: Recherche de films par thème olfactif ──────────────────────────
  searchFilmsByOlfactoryTheme: publicProcedure
    .input(z.object({
      theme: z.string().min(1), // ex: "parfum", "fleur", "terre", "fumée"
      limit: z.number().int().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const { theme, limit } = input;
      const limitVal = Math.floor(Number(limit));
      const sparql = `
SELECT DISTINCT ?film ?filmLabel ?director ?directorLabel ?year ?country ?countryLabel ?genre ?genreLabel WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P57 ?director .
  OPTIONAL { ?film wdt:P577 ?releaseDate . BIND(YEAR(?releaseDate) AS ?year) }
  OPTIONAL { ?film wdt:P495 ?country }
  OPTIONAL { ?film wdt:P136 ?genre }
  ?film rdfs:label ?filmLabel .
  FILTER(LANG(?filmLabel) IN ("fr", "en"))
  FILTER(CONTAINS(LCASE(?filmLabel), LCASE("${theme.replace(/"/g, '')}")))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT ${limitVal}`;
      const bindings = await queryWikidata(sparql);
      return bindings.map(b => ({
        qid: wikidataVal(b, "film").replace("http://www.wikidata.org/entity/", ""),
        title: wikidataVal(b, "filmLabel"),
        director: wikidataVal(b, "directorLabel"),
        directorQid: wikidataVal(b, "director").replace("http://www.wikidata.org/entity/", ""),
        year: wikidataVal(b, "year") ? parseInt(wikidataVal(b, "year")) : null,
        country: wikidataVal(b, "countryLabel"),
        genre: wikidataVal(b, "genreLabel"),
      }));
    }),

  // ── SPARQL: Films d'un réalisateur avec contexte olfactif potentiel ─────────
  searchFilmsByDirector: publicProcedure
    .input(z.object({
      directorName: z.string().min(1),
      limit: z.number().int().min(1).max(30).default(15),
    }))
    .query(async ({ input }) => {
      const { directorName, limit } = input;
      const limitVal = Math.floor(Number(limit));
      const sparql = `
SELECT DISTINCT ?film ?filmLabel ?year ?country ?countryLabel ?genre ?genreLabel ?director ?directorLabel WHERE {
  ?director wdt:P31 wd:Q5 .
  ?director rdfs:label ?directorLabel .
  FILTER(LANG(?directorLabel) = "fr" || LANG(?directorLabel) = "en")
  FILTER(CONTAINS(LCASE(?directorLabel), LCASE("${directorName.replace(/"/g, '')}")))
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P57 ?director .
  OPTIONAL { ?film wdt:P577 ?releaseDate . BIND(YEAR(?releaseDate) AS ?year) }
  OPTIONAL { ?film wdt:P495 ?country }
  OPTIONAL { ?film wdt:P136 ?genre }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
ORDER BY ?year
LIMIT ${limitVal}`;
      const bindings = await queryWikidata(sparql);
      return bindings.map(b => ({
        qid: wikidataVal(b, "film").replace("http://www.wikidata.org/entity/", ""),
        title: wikidataVal(b, "filmLabel"),
        director: wikidataVal(b, "directorLabel"),
        directorQid: wikidataVal(b, "director").replace("http://www.wikidata.org/entity/", ""),
        year: wikidataVal(b, "year") ? parseInt(wikidataVal(b, "year")) : null,
        country: wikidataVal(b, "countryLabel"),
        genre: wikidataVal(b, "genreLabel"),
      }));
    }),

  // ── SPARQL: Films tournés dans un lieu spécifique ──────────────────────────
  searchFilmsByLocation: publicProcedure
    .input(z.object({
      locationName: z.string().min(1),
      limit: z.number().int().min(1).max(30).default(15),
    }))
    .query(async ({ input }) => {
      const { locationName, limit } = input;
      const limitVal = Math.floor(Number(limit));
      const sparql = `
SELECT DISTINCT ?film ?filmLabel ?location ?locationLabel ?director ?directorLabel ?year WHERE {
  ?location rdfs:label ?locationLabel .
  FILTER(LANG(?locationLabel) IN ("fr", "en"))
  FILTER(CONTAINS(LCASE(?locationLabel), LCASE("${locationName.replace(/"/g, '')}")))
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P915 ?location .
  OPTIONAL { ?film wdt:P57 ?director }
  OPTIONAL { ?film wdt:P577 ?releaseDate . BIND(YEAR(?releaseDate) AS ?year) }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
ORDER BY ?year
LIMIT ${limitVal}`;
      const bindings = await queryWikidata(sparql);
      return bindings.map(b => ({
        qid: wikidataVal(b, "film").replace("http://www.wikidata.org/entity/", ""),
        title: wikidataVal(b, "filmLabel"),
        director: wikidataVal(b, "directorLabel"),
        directorQid: wikidataVal(b, "director").replace("http://www.wikidata.org/entity/", ""),
        year: wikidataVal(b, "year") ? parseInt(wikidataVal(b, "year")) : null,
        location: wikidataVal(b, "locationLabel"),
        locationQid: wikidataVal(b, "location").replace("http://www.wikidata.org/entity/", ""),
      }));
    }),

  // ── SPARQL: Films avec plantes / botanique dans leur contexte ──────────────
  searchFilmsWithBotanicalContext: publicProcedure
    .input(z.object({
      plantName: z.string().min(1),
      limit: z.number().int().min(1).max(30).default(15),
    }))
    .query(async ({ input }) => {
      const { plantName, limit } = input;
      const limitVal = Math.floor(Number(limit));
      const sparql = `
SELECT DISTINCT ?film ?filmLabel ?director ?directorLabel ?year ?subject ?subjectLabel WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P921 ?subject .
  ?subject rdfs:label ?subjectLabel .
  FILTER(LANG(?subjectLabel) IN ("fr", "en"))
  FILTER(CONTAINS(LCASE(?subjectLabel), LCASE("${plantName.replace(/"/g, '')}")))
  OPTIONAL { ?film wdt:P57 ?director }
  OPTIONAL { ?film wdt:P577 ?releaseDate . BIND(YEAR(?releaseDate) AS ?year) }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
ORDER BY ?year
LIMIT ${limitVal}`;
      const bindings = await queryWikidata(sparql);
      return bindings.map(b => ({
        qid: wikidataVal(b, "film").replace("http://www.wikidata.org/entity/", ""),
        title: wikidataVal(b, "filmLabel"),
        director: wikidataVal(b, "directorLabel"),
        directorQid: wikidataVal(b, "director").replace("http://www.wikidata.org/entity/", ""),
        year: wikidataVal(b, "year") ? parseInt(wikidataVal(b, "year")) : null,
        subject: wikidataVal(b, "subjectLabel"),
        subjectQid: wikidataVal(b, "subject").replace("http://www.wikidata.org/entity/", ""),
      }));
    }),

  // ── SPARQL: Détail complet d'un film par QID ──────────────────────────────
  getFilmDetails: publicProcedure
    .input(z.object({ qid: z.string().regex(/^Q\d+$/) }))
    .query(async ({ input }) => {
      const sparql = `
SELECT ?film ?filmLabel ?director ?directorLabel ?year ?country ?countryLabel
       ?genre ?genreLabel ?location ?locationLabel ?subject ?subjectLabel
       ?image ?officialWebsite ?imdbId WHERE {
  BIND(wd:${input.qid} AS ?film)
  OPTIONAL { ?film wdt:P57 ?director }
  OPTIONAL { ?film wdt:P577 ?releaseDate . BIND(YEAR(?releaseDate) AS ?year) }
  OPTIONAL { ?film wdt:P495 ?country }
  OPTIONAL { ?film wdt:P136 ?genre }
  OPTIONAL { ?film wdt:P915 ?location }
  OPTIONAL { ?film wdt:P921 ?subject }
  OPTIONAL { ?film wdt:P18 ?image }
  OPTIONAL { ?film wdt:P856 ?officialWebsite }
  OPTIONAL { ?film wdt:P345 ?imdbId }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT 30`;
      const bindings = await queryWikidata(sparql);
      if (!bindings.length) return null;
      const first = bindings[0];
      const locations = [...new Set(bindings.map(b => wikidataVal(b, "locationLabel")).filter(Boolean))];
      const subjects = [...new Set(bindings.map(b => wikidataVal(b, "subjectLabel")).filter(Boolean))];
      const genres = [...new Set(bindings.map(b => wikidataVal(b, "genreLabel")).filter(Boolean))];
      return {
        qid: input.qid,
        title: wikidataVal(first, "filmLabel"),
        director: wikidataVal(first, "directorLabel"),
        directorQid: wikidataVal(first, "director").replace("http://www.wikidata.org/entity/", ""),
        year: wikidataVal(first, "year") ? parseInt(wikidataVal(first, "year")) : null,
        country: wikidataVal(first, "countryLabel"),
        genres,
        filmingLocations: locations,
        subjects,
        image: wikidataVal(first, "image"),
        imdbId: wikidataVal(first, "imdbId"),
        wikidataUrl: `https://www.wikidata.org/wiki/${input.qid}`,
      };
    }),

  // ── SPARQL: Requêtes thématiques pré-construites ──────────────────────────
  getPrebuiltQueries: publicProcedure.query(() => {
    return [
      {
        id: "tarkovsky_films",
        name: "Films de Tarkovski",
        description: "Filmographie complète d'Andreï Tarkovski avec lieux de tournage",
        category: "Réalisateurs emblématiques",
        sparql: `SELECT ?film ?filmLabel ?year ?country ?countryLabel ?location ?locationLabel WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P57 wd:Q46096 .
  OPTIONAL { ?film wdt:P577 ?d . BIND(YEAR(?d) AS ?year) }
  OPTIONAL { ?film wdt:P495 ?country }
  OPTIONAL { ?film wdt:P915 ?location }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} ORDER BY ?year`,
      },
      {
        id: "kiarostami_films",
        name: "Films de Kiarostami",
        description: "Filmographie d'Abbas Kiarostami — paysages iraniens et nature",
        category: "Réalisateurs emblématiques",
        sparql: `SELECT ?film ?filmLabel ?year ?location ?locationLabel WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P57 wd:Q159047 .
  OPTIONAL { ?film wdt:P577 ?d . BIND(YEAR(?d) AS ?year) }
  OPTIONAL { ?film wdt:P915 ?location }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} ORDER BY ?year`,
      },
      {
        id: "films_forest_nature",
        name: "Films — Forêt & Nature",
        description: "Films dont le sujet principal inclut forêts, nature, végétation",
        category: "Contextes botaniques",
        sparql: `SELECT DISTINCT ?film ?filmLabel ?director ?directorLabel ?year WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P921 ?subject .
  ?subject wdt:P31/wdt:P279* wd:Q4421 .
  OPTIONAL { ?film wdt:P57 ?director }
  OPTIONAL { ?film wdt:P577 ?d . BIND(YEAR(?d) AS ?year) }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} ORDER BY ?year LIMIT 30`,
      },
      {
        id: "films_perfume_scent",
        name: "Films — Parfum & Odeur",
        description: "Films dont le sujet ou titre évoque le parfum, l'odorat",
        category: "Thèmes olfactifs",
        sparql: `SELECT DISTINCT ?film ?filmLabel ?director ?directorLabel ?year ?country ?countryLabel WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P921 ?subject .
  VALUES ?subject { wd:Q1289248 wd:Q7946 wd:Q11476 wd:Q2995644 }
  OPTIONAL { ?film wdt:P57 ?director }
  OPTIONAL { ?film wdt:P577 ?d . BIND(YEAR(?d) AS ?year) }
  OPTIONAL { ?film wdt:P495 ?country }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} ORDER BY ?year LIMIT 30`,
      },
      {
        id: "films_garden_flowers",
        name: "Films — Jardins & Fleurs",
        description: "Films avec jardins, fleurs ou horticulture comme sujet",
        category: "Contextes botaniques",
        sparql: `SELECT DISTINCT ?film ?filmLabel ?director ?directorLabel ?year WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P921 ?subject .
  ?subject wdt:P31/wdt:P279* wd:Q1107656 .
  OPTIONAL { ?film wdt:P57 ?director }
  OPTIONAL { ?film wdt:P577 ?d . BIND(YEAR(?d) AS ?year) }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} ORDER BY ?year LIMIT 30`,
      },
      {
        id: "films_incense_ritual",
        name: "Films — Encens & Rituel",
        description: "Films traitant de rituels, encens, pratiques olfactives sacrées",
        category: "Thèmes olfactifs",
        sparql: `SELECT DISTINCT ?film ?filmLabel ?director ?directorLabel ?year ?country ?countryLabel WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P921 ?subject .
  VALUES ?subject { wd:Q131569 wd:Q1198 wd:Q9174 wd:Q2706 }
  OPTIONAL { ?film wdt:P57 ?director }
  OPTIONAL { ?film wdt:P577 ?d . BIND(YEAR(?d) AS ?year) }
  OPTIONAL { ?film wdt:P495 ?country }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} ORDER BY ?year LIMIT 30`,
      },
      {
        id: "films_iran_landscape",
        name: "Films — Paysages iraniens",
        description: "Films tournés en Iran — paysages désertiques, roses de Chiraz",
        category: "Terroirs cinématographiques",
        sparql: `SELECT DISTINCT ?film ?filmLabel ?director ?directorLabel ?year ?location ?locationLabel WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P915 ?location .
  ?location wdt:P17 wd:Q794 .
  OPTIONAL { ?film wdt:P57 ?director }
  OPTIONAL { ?film wdt:P577 ?d . BIND(YEAR(?d) AS ?year) }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} ORDER BY ?year LIMIT 30`,
      },
      {
        id: "films_japan_tea",
        name: "Films — Japon & Cérémonie du thé",
        description: "Films japonais avec cérémonie du thé, jardins zen, nature",
        category: "Terroirs cinématographiques",
        sparql: `SELECT DISTINCT ?film ?filmLabel ?director ?directorLabel ?year WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film wdt:P495 wd:Q17 .
  ?film wdt:P921 ?subject .
  VALUES ?subject { wd:Q7946 wd:Q8269924 wd:Q131569 wd:Q4421 wd:Q728455 }
  OPTIONAL { ?film wdt:P57 ?director }
  OPTIONAL { ?film wdt:P577 ?d . BIND(YEAR(?d) AS ?year) }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
} ORDER BY ?year LIMIT 30`,
      },
    ];
  }),

  // ── SPARQL: Exécuter une requête libre ────────────────────────────────────
  executeFreeSparql: publicProcedure
    .input(z.object({ sparql: z.string().min(10) }))
    .query(async ({ input }) => {
      const bindings = await queryWikidata(input.sparql);
      if (!bindings.length) return { columns: [], rows: [] };
      const columns = Object.keys(bindings[0]);
      const rows = bindings.map(b =>
        Object.fromEntries(columns.map(col => [col, wikidataVal(b, col)]))
      );
      return { columns, rows };
    }),

  // ── CRUD: Enregistrer un smellscape ──────────────────────────────────────
  save: protectedProcedure
    .input(CinemaSmellscapeInput)
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
      const [result] = await conn.execute<mysql.OkPacket>(
        `INSERT INTO cinema_smellscapes
          (film_title, film_wikidata_qid, director, director_qid, year, country,
           scene_description, timestamp_scene, smell_description, smell_type,
           olfactory_notes, linked_molecule_ids, linked_plant_ids, linked_recipe_ids,
           filming_location, filming_location_qid, cultural_context, heritage_status,
           research_notes, source_type, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          input.filmTitle,
          input.filmWikidataQid ?? null,
          input.director ?? null,
          input.directorQid ?? null,
          input.year ?? null,
          input.country ?? null,
          input.sceneDescription,
          input.timestampScene ?? null,
          input.smellDescription,
          input.smellType,
          input.olfactoryNotes ?? null,
          input.linkedMoleculeIds ? JSON.stringify(input.linkedMoleculeIds) : null,
          input.linkedPlantIds ? JSON.stringify(input.linkedPlantIds) : null,
          input.linkedRecipeIds ? JSON.stringify(input.linkedRecipeIds) : null,
          input.filmingLocation ?? null,
          input.filmingLocationQid ?? null,
          input.culturalContext ?? null,
          input.heritageStatus,
          input.researchNotes ?? null,
          input.sourceType,
          input.tags ? JSON.stringify(input.tags) : null,
        ]
      );
      return { id: result.insertId, success: true };
      } finally { await conn.end(); }
    }),

  // ── CRUD: Lister tous les smellscapes ────────────────────────────────────
  list: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      smellType: SmellTypeEnum.optional(),
      heritageStatus: HeritageStatusEnum.optional(),
      sourceType: SourceTypeEnum.optional(),
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const conn = await getConn();
      try {
      const { search, smellType, heritageStatus, sourceType } = input;
      const limitVal = Math.floor(Number(input.limit));
      const offsetVal = Math.floor(Number(input.offset));

      let where = "WHERE 1=1";
      const params: any[] = [];

      if (search) {
        where += " AND (film_title LIKE ? OR director LIKE ? OR smell_description LIKE ? OR scene_description LIKE ?)";
        const s = `%${search}%`;
        params.push(s, s, s, s);
      }
      if (smellType) { where += " AND smell_type = ?"; params.push(smellType); }
      if (heritageStatus) { where += " AND heritage_status = ?"; params.push(heritageStatus); }
      if (sourceType) { where += " AND source_type = ?"; params.push(sourceType); }

      const [rows] = await conn.execute<mysql.RowDataPacket[]>(
        `SELECT * FROM cinema_smellscapes ${where} ORDER BY created_at DESC LIMIT ${limitVal} OFFSET ${offsetVal}`,
        params
      );
      const [countRows] = await conn.execute<mysql.RowDataPacket[]>(
        `SELECT COUNT(*) as total FROM cinema_smellscapes ${where}`,
        params
      );

      return {
        items: rows.map((r: any) => ({
          ...r,
          linkedMoleculeIds: r.linked_molecule_ids ? JSON.parse(r.linked_molecule_ids) : [],
          linkedPlantIds: r.linked_plant_ids ? JSON.parse(r.linked_plant_ids) : [],
          linkedRecipeIds: r.linked_recipe_ids ? JSON.parse(r.linked_recipe_ids) : [],
          tags: r.tags ? JSON.parse(r.tags) : [],
        })),
        total: countRows[0]?.total ?? 0,
      };
      } finally { await conn.end(); }
    }),

  // ── CRUD: Obtenir un smellscape par ID ───────────────────────────────────
  getById: publicProcedure
    .input(z.number().int())
    .query(async ({ input }) => {
      const conn = await getConn();
      try {
      const [rows] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT * FROM cinema_smellscapes WHERE id = ?",
        [input]
      );
      if (!rows.length) return null;
      const r = rows[0];
      return {
        ...r,
        linkedMoleculeIds: r.linked_molecule_ids ? JSON.parse(r.linked_molecule_ids) : [],
        linkedPlantIds: r.linked_plant_ids ? JSON.parse(r.linked_plant_ids) : [],
        linkedRecipeIds: r.linked_recipe_ids ? JSON.parse(r.linked_recipe_ids) : [],
        tags: r.tags ? JSON.parse(r.tags) : [],
      };
      } finally { await conn.end(); }
    }),

  // ── CRUD: Supprimer un smellscape ────────────────────────────────────────
  remove: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
      await conn.execute("DELETE FROM cinema_smellscapes WHERE id = ?", [input]);
      return { success: true };
      } finally { await conn.end(); }
    }),

  // ── CRUD: Mettre à jour les notes ────────────────────────────────────────
  updateNotes: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      researchNotes: z.string(),
      olfactoryNotes: z.string().optional(),
      culturalContext: z.string().optional(),
      heritageStatus: HeritageStatusEnum.optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const conn = await getConn();
      try {
      await conn.execute(
        `UPDATE cinema_smellscapes
         SET research_notes = ?, olfactory_notes = ?, cultural_context = ?,
             heritage_status = COALESCE(?, heritage_status),
             tags = ?
         WHERE id = ?`,
        [
          input.researchNotes,
          input.olfactoryNotes ?? null,
          input.culturalContext ?? null,
          input.heritageStatus ?? null,
          input.tags ? JSON.stringify(input.tags) : null,
          input.id,
        ]
      );
      return { success: true };
      } finally { await conn.end(); }
    }),

  // ── Stats ─────────────────────────────────────────────────────────────────
  stats: publicProcedure.query(async () => {
    const conn = await getConn();
    try {
    const [rows] = await conn.execute<mysql.RowDataPacket[]>(`
      SELECT
        COUNT(*) as total,
        COUNT(DISTINCT film_wikidata_qid) as uniqueFilms,
        COUNT(DISTINCT director) as uniqueDirectors,
        SUM(CASE WHEN smell_type = 'explicit' THEN 1 ELSE 0 END) as explicit,
        SUM(CASE WHEN smell_type = 'atmospheric' THEN 1 ELSE 0 END) as atmospheric,
        SUM(CASE WHEN smell_type = 'symbolic' THEN 1 ELSE 0 END) as symbolic,
        SUM(CASE WHEN heritage_status = 'endangered' THEN 1 ELSE 0 END) as endangered,
        SUM(CASE WHEN heritage_status = 'lost' THEN 1 ELSE 0 END) as lost
      FROM cinema_smellscapes
    `);
    return rows[0];
    } finally { await conn.end(); }
  }),
});
