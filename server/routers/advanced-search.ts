/**
 * advanced-search.ts — Routeur tRPC pour la recherche avancée PERFUMUM
 * ─────────────────────────────────────────────────────────────────────
 * Architecture SPARQL-ready pour préparer les requêtes fédérées du Rapport 7 :
 *   - crossSearch : recherche croisée terroirs ↔ plantes ↔ molécules (actif)
 *   - getCrossSearchFilterOptions : options de filtres dynamiques (actif)
 *   - federatedSearchPreview : aperçu des sources fédérées (stub Rapport 7)
 *   - getSparqlTemplates : templates SPARQL temporels/généalogiques (stub Rapport 7)
 *   - getSearchSuggestions : suggestions de recherche en temps réel (actif)
 */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import * as mysql from "mysql2/promise";

export const advancedSearchRouter = router({
  // ── Recherche par plante source ──────────────────────────────────────────
  moleculesByPlant: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.searchMoleculesByPlantSource(input);
    }),

  // ── Recherche par molécule ───────────────────────────────────────────────
  rawMaterialsByMolecule: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return db.searchRawMaterialsByMolecule(input);
    }),

  // ── Recherche croisée terroirs ↔ plantes ↔ molécules ────────────────────
  crossSearch: publicProcedure
    .input(z.object({
      terroirIds: z.array(z.number()).optional(),
      terroirCountries: z.array(z.string()).optional(),
      terroirClimates: z.array(z.string()).optional(),
      plantIds: z.array(z.number()).optional(),
      plantCategories: z.array(z.string()).optional(),
      plantFamilies: z.array(z.string()).optional(),
      moleculeIds: z.array(z.number()).optional(),
      moleculeFamilies: z.array(z.string()).optional(),
      chemicalClasses: z.array(z.string()).optional(),
      searchQuery: z.string().optional(),
      includeRelations: z.boolean().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.crossSearch(input || {});
    }),

  // ── Options de filtres dynamiques ────────────────────────────────────────
  getCrossSearchFilterOptions: publicProcedure.query(async () => {
    return db.getCrossSearchFilterOptions();
  }),

  // ── Suggestions de recherche en temps réel ───────────────────────────────
  // Retourne des suggestions rapides depuis les noms de molécules, plantes et terroirs
  getSearchSuggestions: publicProcedure
    .input(z.object({
      query: z.string().min(2).max(100),
      limit: z.number().min(1).max(20).default(8),
    }))
    .query(async ({ input }) => {
      const conn = await mysql.createConnection(process.env.DATABASE_URL!);
      try {
        const term = `%${input.query}%`;
        const lim = input.limit;

        // Requêtes parallèles pour les 3 entités
        const [molResult, plantResult, terroirResult] = await Promise.all([
          conn.execute<mysql.RowDataPacket[]>(
            `SELECT id, name, family FROM molecules WHERE name LIKE ? ORDER BY name LIMIT ?`,
            [term, lim]
          ),
          conn.execute<mysql.RowDataPacket[]>(
            `SELECT id, name, latin_name as latinName, category FROM plants WHERE name LIKE ? OR latin_name LIKE ? ORDER BY name LIMIT ?`,
            [term, term, lim]
          ),
          conn.execute<mysql.RowDataPacket[]>(
            `SELECT id, name, country, climate_type as climateType FROM terroirs WHERE name LIKE ? OR country LIKE ? ORDER BY name LIMIT ?`,
            [term, term, lim]
          ),
        ]);

        const [molRows] = molResult;
        const [plantRows] = plantResult;
        const [terroirRows] = terroirResult;

        return {
          molecules: (molRows ?? []).map((r: any) => ({
            id: r.id,
            name: r.name,
            family: r.family,
            type: "molecule" as const,
          })),
          plants: (plantRows ?? []).map((r: any) => ({
            id: r.id,
            name: r.name,
            latinName: r.latinName,
            category: r.category,
            type: "plant" as const,
          })),
          terroirs: (terroirRows ?? []).map((r: any) => ({
            id: r.id,
            name: r.name,
            country: r.country,
            climateType: r.climateType,
            type: "terroir" as const,
          })),
        };
      } catch (err) {
        console.error("Error in getSearchSuggestions:", err);
        return { molecules: [], plants: [], terroirs: [] };
      } finally {
        await conn.end();
      }
    }),

  // ── [RAPPORT 7] Aperçu des sources fédérées ──────────────────────────────
  // Stub SPARQL-ready : retourne les métadonnées des sources fédérées disponibles
  // Sera activé dans le Rapport 7 avec les requêtes SERVICE SPARQL réelles
  getFederatedSourcesStatus: publicProcedure.query(async () => {
    return {
      sources: [
        {
          id: "wikidata",
          label: "Wikidata",
          description: "Propriétés chimiques (CAS, InChI), taxons botaniques, données GBIF",
          endpoint: "https://query.wikidata.org/sparql",
          status: "planned" as const,
          rapport: "R7",
          capabilities: ["chemical_properties", "botanical_taxa", "gbif_data"],
          sparqlTemplate: `
# Template SPARQL Wikidata — Rapport 7
# Requête fédérée : molécule PERFUMUM → Wikidata
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
SELECT ?molecule ?cas ?inchi ?taxon WHERE {
  SERVICE <https://query.wikidata.org/sparql> {
    ?molecule wdt:P231 ?cas .  # CAS Registry Number
    OPTIONAL { ?molecule wdt:P234 ?inchi }  # InChI
    OPTIONAL { ?molecule wdt:P703 ?taxon }  # Found in taxon
  }
}`,
        },
        {
          id: "openalex",
          label: "OpenAlex",
          description: "Publications scientifiques, citations, auteurs ORCID",
          endpoint: "https://api.openalex.org",
          status: "planned" as const,
          rapport: "R7",
          capabilities: ["publications", "citations", "authors_orcid"],
          sparqlTemplate: `
# Template SPARQL OpenAlex — Rapport 7
# Requête fédérée : molécule PERFUMUM → publications OpenAlex
PREFIX schema: <https://schema.org/>
SELECT ?paper ?title ?doi ?year WHERE {
  SERVICE <https://semopenalex.org/sparql> {
    ?paper schema:about <{molecule_wikidata_uri}> ;
           schema:name ?title ;
           schema:datePublished ?year .
    OPTIONAL { ?paper schema:identifier ?doi }
  }
}`,
        },
        {
          id: "europeana",
          label: "Europeana",
          description: "Iconographie patrimoniale, manuscrits, herbiers numérisés",
          endpoint: "https://api.europeana.eu/record/v2",
          status: "planned" as const,
          rapport: "R7",
          capabilities: ["iconography", "manuscripts", "herbaria"],
          sparqlTemplate: `
# Template SPARQL Europeana — Rapport 7
# Requête fédérée : plante PERFUMUM → iconographie Europeana
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
SELECT ?item ?title ?image ?institution WHERE {
  SERVICE <https://sparql.europeana.eu/> {
    ?item edm:isShownBy ?image ;
          dc:title ?title ;
          edm:dataProvider ?institution .
    FILTER(CONTAINS(LCASE(?title), "{plant_name}"))
  }
}`,
        },
      ],
      // Filtres temporels (Rapport 7 — templates SPARQL temporels)
      temporalTemplates: [
        {
          id: "temporal_range",
          label: "Plage temporelle",
          description: "Filtrer les données par période historique",
          status: "planned" as const,
          rapport: "R7",
        },
        {
          id: "genealogical",
          label: "Généalogique",
          description: "Tracer les lignées de variétés et cultivars",
          status: "planned" as const,
          rapport: "R7",
        },
      ],
    };
  }),

  // ── [RAPPORT 7] Templates SPARQL sauvegardés ─────────────────────────────
  // Stub : retourne les templates SPARQL disponibles pour la recherche fédérée
  getSparqlTemplates: publicProcedure
    .input(z.object({
      type: z.enum(["temporal", "genealogical", "federated", "all"]).default("all"),
    }).optional())
    .query(async () => {
      // Stub — sera connecté aux templates SPARQL réels dans le Rapport 7
      return {
        templates: [],
        totalCount: 0,
        status: "planned" as const,
        message: "Les templates SPARQL temporels et généalogiques seront disponibles dans le Rapport 7",
      };
    }),
});
