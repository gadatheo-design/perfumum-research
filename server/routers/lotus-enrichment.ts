/**
 * lotus-enrichment.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * tRPC router for LOTUS (Natural Products Online) enrichment
 *
 * LOTUS uses Wikidata as its primary data store. Plant-molecule pairs are
 * stored in Wikidata via property P703 ("found in taxon"). This router
 * queries the Wikidata SPARQL endpoint to retrieve molecule data for plants.
 *
 * References:
 *   - LOTUS paper: https://doi.org/10.7554/eLife.70780
 *   - Wikidata SPARQL: https://query.wikidata.org/
 *   - P703 = "found in taxon"
 *   - P235 = InChIKey, P231 = CAS number, P233 = canonical SMILES
 *   - P274 = chemical formula, P2067 = mass, P117 = melting point
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db/core";
import { plants, molecules, plantMolecules } from "../../drizzle/schema";
import { and, eq, isNull, like, or, sql } from 'drizzle-orm';
import { sparqlQuery } from "../utils/sparql";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// sparqlQuery now imported from server/utils/sparql.ts (with retry + backoff)

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface LotusCompound {
  wikidataQid: string;
  name: string;
  inchikey?: string;
  cas?: string;
  smiles?: string;
  formula?: string;
  mass?: string;
  iupacName?: string;
  pubchemCid?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// sparqlQuery is imported from server/utils/sparql.ts above

/** Get molecules found in a taxon via Wikidata P703 */
async function getMoleculesByTaxon(
  scientificName: string,
  limit = 30
): Promise<LotusCompound[]> {
  const safeName = scientificName.replace(/"/g, '\\"');

  const query = `
    SELECT DISTINCT ?compound ?compoundLabel ?inchikey ?cas ?smiles ?formula ?mass ?iupac ?pubchem
    WHERE {
      ?taxon wdt:P225 "${safeName}" .
      ?compound wdt:P703 ?taxon .
      OPTIONAL { ?compound wdt:P235 ?inchikey . }
      OPTIONAL { ?compound wdt:P231 ?cas . }
      OPTIONAL { ?compound wdt:P233 ?smiles . }
      OPTIONAL { ?compound wdt:P274 ?formula . }
      OPTIONAL { ?compound wdt:P2067 ?mass . }
      OPTIONAL { ?compound wdt:P2017 ?iupac . }
      OPTIONAL { ?compound wdt:P662 ?pubchem . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr" . }
    }
    LIMIT ${limit}
  `;

  try {
    const bindings = await sparqlQuery(query);
    return bindings.map((b: any) => ({
      wikidataQid: b.compound?.value?.split("/").pop() ?? "",
      name: b.compoundLabel?.value ?? "",
      inchikey: b.inchikey?.value,
      cas: b.cas?.value,
      smiles: b.smiles?.value,
      formula: b.formula?.value,
      mass: b.mass?.value,
      iupacName: b.iupac?.value,
      pubchemCid: b.pubchem?.value,
    })).filter((c: LotusCompound) => c.wikidataQid && c.name);
  } catch {
    return [];
  }
}

/** Get plants that produce a given molecule (reverse lookup) */
async function getPlantsByMolecule(
  moleculeName: string,
  limit = 20
): Promise<Array<{ wikidataQid: string; scientificName: string; taxonRank?: string }>> {
  const safeName = moleculeName.replace(/"/g, '\\"');

  const query = `
    SELECT DISTINCT ?taxon ?taxonLabel ?rank
    WHERE {
      ?compound rdfs:label "${safeName}"@en .
      ?compound wdt:P703 ?taxon .
      OPTIONAL { ?taxon wdt:P105 ?rankItem . ?rankItem rdfs:label ?rank . FILTER(LANG(?rank) = "en") }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
    }
    LIMIT ${limit}
  `;

  try {
    const bindings = await sparqlQuery(query);
    return bindings.map((b: any) => ({
      wikidataQid: b.taxon?.value?.split("/").pop() ?? "",
      scientificName: b.taxonLabel?.value ?? "",
      taxonRank: b.rank?.value,
    })).filter((p: any) => p.wikidataQid);
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

export const lotusEnrichmentRouter = router({
  /**
   * Health check — verify Wikidata SPARQL is accessible for LOTUS queries
   */
  getStats: publicProcedure.query(async () => {
    try {
      const query = `SELECT ?item WHERE { ?item wdt:P703 wd:Q193178 . } LIMIT 1`;
      const bindings = await sparqlQuery(query);
      return {
        status: "ok",
        message: "LOTUS/Wikidata SPARQL endpoint is accessible",
        source: "Wikidata SPARQL (P703 = found in taxon)",
        testResult: bindings.length > 0 ? "Rosa damascena molecules found" : "No results",
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: "error",
        message: `LOTUS/Wikidata SPARQL not responding: ${error?.message ?? "unknown error"}`,
        timestamp: new Date().toISOString(),
      };
    }
  }),

  /**
   * Get all molecules found in a plant species (LOTUS P703 lookup)
   */
  getMoleculesByPlant: publicProcedure
    .input(z.object({
      scientificName: z.string().min(1),
      limit: z.number().min(1).max(100).optional().default(30),
    }))
    .mutation(async ({ input }) => {
      const compounds = await getMoleculesByTaxon(input.scientificName, input.limit);

      return {
        found: compounds.length > 0,
        scientificName: input.scientificName,
        total: compounds.length,
        compounds,
        source: "Wikidata SPARQL / LOTUS",
        lotusUrl: `https://lotus.naturalproducts.net/search/simple?query=${encodeURIComponent(input.scientificName)}`,
        wikidataUrl: `https://www.wikidata.org/wiki/Special:Search?search=${encodeURIComponent(input.scientificName)}`,
      };
    }),

  /**
   * Get plants that produce a given molecule (reverse lookup)
   */
  getPlantsByMolecule: publicProcedure
    .input(z.object({
      moleculeName: z.string().min(1),
      limit: z.number().min(1).max(50).optional().default(20),
    }))
    .mutation(async ({ input }) => {
      const plantList = await getPlantsByMolecule(input.moleculeName, input.limit);

      return {
        found: plantList.length > 0,
        moleculeName: input.moleculeName,
        total: plantList.length,
        plants: plantList,
        source: "Wikidata SPARQL / LOTUS",
      };
    }),

  /**
   * Get molecular profile for a plant: molecules grouped by chemical class
   */
  getMolecularProfile: publicProcedure
    .input(z.object({ scientificName: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const compounds = await getMoleculesByTaxon(input.scientificName, 50);

      // Group by whether they have InChIKey (confirmed structures) vs name only
      const withStructure = compounds.filter((c) => c.inchikey);
      const nameOnly = compounds.filter((c) => !c.inchikey);

      return {
        found: compounds.length > 0,
        scientificName: input.scientificName,
        total: compounds.length,
        withStructure: withStructure.length,
        nameOnly: nameOnly.length,
        compounds,
        summary: {
          withInChIKey: withStructure.length,
          withCAS: compounds.filter((c) => c.cas).length,
          withSMILES: compounds.filter((c) => c.smiles).length,
          withFormula: compounds.filter((c) => c.formula).length,
          withPubChem: compounds.filter((c) => c.pubchemCid).length,
        },
        source: "Wikidata SPARQL / LOTUS",
        lotusUrl: `https://lotus.naturalproducts.net/search/simple?query=${encodeURIComponent(input.scientificName)}`,
      };
    }),

  /**
   * Batch lookup: get molecule counts for multiple plants
   */
  batchMoleculeCount: publicProcedure
    .input(z.object({
      scientificNames: z.array(z.string().min(1)).min(1).max(10),
    }))
    .mutation(async ({ input }) => {
      const results = [];
      for (const name of input.scientificNames) {
        const compounds = await getMoleculesByTaxon(name, 50);
        results.push({
          scientificName: name,
          moleculeCount: compounds.length,
          withStructure: compounds.filter((c) => c.inchikey).length,
          topMolecules: compounds.slice(0, 5).map((c) => c.name),
        });
        // Polite delay between SPARQL requests
        await new Promise((r) => setTimeout(r, 400));
      }
      return {
        total: results.length,
        results,
        source: "Wikidata SPARQL / LOTUS",
      };
    }),

  /**
   * Full import: create or find molecule, then create plant_molecules link
   * This is the "real" import that creates a proper DB relationship
   */
  importLotusToPlant: publicProcedure
    .input(z.object({
      plantId: z.number(),
      moleculeName: z.string().min(1),
      wikidataQid: z.string().min(1),
      inchikey: z.string().optional(),
      cas: z.string().optional(),
      smiles: z.string().optional(),
      formula: z.string().optional(),
      mass: z.string().optional(),
      iupacName: z.string().optional(),
      pubchemCid: z.string().optional(),
      role: z.enum(["majeur", "secondaire", "trace", "variable"]).optional().default("trace"),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      // 1. Find or create molecule
      let moleculeId: number | null = null;
      let moleculeAction: "found" | "created" = "found";

      // Search by InChIKey first (most precise), then by Wikidata QID, then by name
      const searchConditions = [];
      if (input.inchikey) searchConditions.push(eq(molecules.inchiKey, input.inchikey));
      if (input.wikidataQid) searchConditions.push(eq(molecules.wikidataQid, input.wikidataQid));

      let existingMol = null;
      if (searchConditions.length > 0) {
        const found = await db.select({ id: molecules.id, name: molecules.name })
          .from(molecules)
          .where(or(...searchConditions))
          .limit(1);
        existingMol = found[0] ?? null;
      }

      // Fallback: search by name
      if (!existingMol) {
        const found = await db.select({ id: molecules.id, name: molecules.name })
          .from(molecules)
          .where(like(molecules.name, `%${input.moleculeName}%`))
          .limit(1);
        existingMol = found[0] ?? null;
      }

      if (existingMol) {
        moleculeId = existingMol.id;
        moleculeAction = "found";
        // Update Wikidata QID if missing
        if (input.wikidataQid) {
          await db.update(molecules)
            .set({ wikidataQid: input.wikidataQid })
            .where(and(eq(molecules.id, existingMol.id), isNull(molecules.wikidataQid)));
        }
      } else {
        // Create new molecule from LOTUS data
        const insertResult = await db.insert(molecules).values({
          name: input.moleculeName,
          iupacName: input.iupacName ?? null,
          casNumber: input.cas ?? null,
          chemicalFormula: input.formula ?? null,
          smiles: input.smiles ?? null,
          inchiKey: input.inchikey ?? null,
          wikidataQid: input.wikidataQid,
          molecularWeight: input.mass ? Math.round(parseFloat(input.mass)) : null,
          pubchemCid: input.pubchemCid ? parseInt(input.pubchemCid, 10) : null,
          notes: `Importé depuis LOTUS/Wikidata (${input.wikidataQid}) le ${new Date().toLocaleDateString("fr-FR")}`,
          botanicalSources: "", // Will be enriched later
        });
        moleculeId = Number((insertResult as any).insertId ?? (insertResult as any)[0]?.insertId ?? 0);
        moleculeAction = "created";
      }

      if (!moleculeId) {
        return { success: false, message: "Impossible de créer ou trouver la molécule en base." };
      }

      // 2. Check if plant_molecules link already exists
      const existingLink = await db.select({ plantId: plantMolecules.plantId })
        .from(plantMolecules)
        .where(and(eq(plantMolecules.plantId, input.plantId), eq(plantMolecules.moleculeId, moleculeId)))
        .limit(1);

      if (existingLink.length > 0) {
        return {
          success: false,
          alreadyLinked: true,
          message: `Le lien plante-molécule existe déjà pour "${input.moleculeName}".`,
          moleculeId,
          moleculeAction,
        };
      }

      // 3. Create plant_molecules link
      await db.insert(plantMolecules).values({
        plantId: input.plantId,
        moleculeId,
        role: input.role,
        source: `LOTUS/Wikidata (${input.wikidataQid})`,
        notes: `Importé depuis LOTUS le ${new Date().toLocaleDateString("fr-FR")}`,
      });

      return {
        success: true,
        message: `"${input.moleculeName}" ${moleculeAction === "created" ? "créée et liée" : "trouvée et liée"} à la plante.`,
        moleculeId,
        moleculeAction,
        linkCreated: true,
      };
    }),

  /**
   * Import LOTUS molecule data into the molecules table
   * Links a molecule from LOTUS/Wikidata to a plant in the DB
   */
  importMoleculeLink: publicProcedure
    .input(z.object({
      plantLatinName: z.string().min(1),
      moleculeName: z.string().min(1),
      wikidataQid: z.string().min(1),
      inchikey: z.string().optional(),
      cas: z.string().optional(),
      smiles: z.string().optional(),
      formula: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      // Find plant
      const plantResults = await db
        .select({ id: plants.id, name: plants.name, latinName: sql<string>`COALESCE(${plants.latinName}, '')` })
        .from(plants)
        .where(like(plants.latinName, `%${input.plantLatinName}%`))
        .limit(5);

      if (plantResults.length === 0) {
        return {
          success: false,
          message: `Aucune plante trouvée avec le nom latin "${input.plantLatinName}".`,
          matches: [],
        };
      }

      if (plantResults.length > 1) {
        return {
          success: false,
          message: `Plusieurs plantes correspondent à "${input.plantLatinName}". Précisez le nom.`,
          matches: plantResults.map((r) => ({ id: r.id, name: r.name, latinName: r.latinName })),
        };
      }

      const plant = plantResults[0];

      // Check if molecule already exists by name or InChIKey
      const existingMolecules = await db
        .select({ id: molecules.id, name: molecules.name })
        .from(molecules)
        .where(like(molecules.name, `%${input.moleculeName}%`))
        .limit(3);

      if (existingMolecules.length > 0) {
        return {
          success: false,
          alreadyExists: true,
          message: `La molécule "${input.moleculeName}" existe déjà dans la base (${existingMolecules.map((m) => m.name).join(", ")}). Utilisez la page Molécules pour créer le lien.`,
          existingMolecules: existingMolecules.map((m) => ({ id: m.id, name: m.name })),
          plantId: plant.id,
          plantName: plant.name,
        };
      }

      // Add LOTUS source note to plant
      await db
        .update(plants)
        .set({
          notes: `Molécule LOTUS: ${input.moleculeName} (${input.wikidataQid})${input.inchikey ? ` | InChIKey: ${input.inchikey}` : ""}`,
          wikidataEnrichedAt: new Date(),
        })
        .where(eq(plants.id, plant.id));

      return {
        success: true,
        message: `Molécule "${input.moleculeName}" notée dans la fiche de ${plant.name}. Créez la molécule complète dans la section Molécules pour un lien complet.`,
        plantId: plant.id,
        plantName: plant.name,
        moleculeName: input.moleculeName,
        wikidataQid: input.wikidataQid,
        nextStep: "Créer la molécule dans /admin/molecules avec les données LOTUS",
      };
    }),

  // ─────────────────────────────────────────────────────────────────────────
  // BATCH IMPORT BY GENUS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * List all species of a genus present in PERFUMUM DB
   * Returns species with their plant IDs and current molecule count
   */
  getGenusSpecies: publicProcedure
    .input(z.object({ genus: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const genus = input.genus.trim();
      const speciesInDb = await db
        .select({ id: plants.id, name: plants.name, latinName: sql<string>`COALESCE(${plants.latinName}, '')` })
        .from(plants)
        .where(like(plants.latinName, `${genus} %`))
        .orderBy(plants.latinName);

      // Count existing molecule links per plant
      const speciesWithCounts = await Promise.all(
        speciesInDb.map(async (sp) => {
          const links = await db
            .select({ moleculeId: plantMolecules.moleculeId })
            .from(plantMolecules)
            .where(eq(plantMolecules.plantId, sp.id));
          return {
            id: sp.id,
            name: sp.name,
            latinName: sp.latinName,
            existingMoleculeLinks: links.length,
          };
        })
      );

      return {
        genus,
        speciesCount: speciesInDb.length,
        species: speciesWithCounts,
      };
    }),

  /**
   * Preview: fetch all LOTUS molecules for a genus from Wikidata
   * Returns aggregated data without writing to DB (dry-run)
   */
  previewGenusImport: publicProcedure
    .input(z.object({
      genus: z.string().min(1),
      limitPerSpecies: z.number().min(1).max(100).default(30),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const genus = input.genus.trim();

      // 1. Get species in DB matching this genus
      const speciesInDb = await db
        .select({ id: plants.id, name: plants.name, latinName: sql<string>`COALESCE(${plants.latinName}, '')` })
        .from(plants)
        .where(like(plants.latinName, `${genus} %`))
        .orderBy(plants.latinName);

      if (speciesInDb.length === 0) {
        return {
          genus,
          speciesFound: 0,
          totalMolecules: 0,
          newMolecules: 0,
          existingMolecules: 0,
          preview: [],
          message: `Aucune espèce du genre ${genus} trouvée dans PERFUMUM.`,
        };
      }

      // 2. Fetch molecules for all species in one SPARQL query
      const safeGenus = genus.replace(/"/g, '\\"');
      const sparqlQueryStr = `
        SELECT DISTINCT ?taxon ?taxonLabel ?latinName ?compound ?compoundLabel ?inchikey ?cas ?smiles ?formula ?mass ?iupac ?pubchem
        WHERE {
          ?genus wdt:P225 "${safeGenus}" .
          ?taxon wdt:P171* ?genus .
          ?taxon wdt:P105 wd:Q7432 .
          OPTIONAL { ?taxon wdt:P225 ?latinName . }
          ?compound wdt:P703 ?taxon .
          OPTIONAL { ?compound wdt:P235 ?inchikey . }
          OPTIONAL { ?compound wdt:P231 ?cas . }
          OPTIONAL { ?compound wdt:P233 ?smiles . }
          OPTIONAL { ?compound wdt:P274 ?formula . }
          OPTIONAL { ?compound wdt:P2067 ?mass . }
          OPTIONAL { ?compound wdt:P2017 ?iupac . }
          OPTIONAL { ?compound wdt:P662 ?pubchem . }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr" . }
        }
        LIMIT ${speciesInDb.length * input.limitPerSpecies}
      `;
      // Use shared sparqlQuery helper with retry + exponential backoff
      let bindings: any[] = [];
      try {
        bindings = await sparqlQuery(sparqlQueryStr, { timeoutMs: 30000, maxRetries: 3 });
      } catch {
        // Timeout or rate limit after retries — return empty
      }

      // 3. Group by taxon latin name
      const byTaxon: Record<string, { latinName: string | null; compounds: LotusCompound[] }> = {};
      for (const b of bindings) {
        const latinName = b.latinName?.value ?? b.taxonLabel?.value ?? "";
        if (!latinName) continue;
        const compound: LotusCompound = {
          wikidataQid: b.compound?.value?.split("/").pop() ?? "",
          name: b.compoundLabel?.value ?? "",
          inchikey: b.inchikey?.value,
          cas: b.cas?.value,
          smiles: b.smiles?.value,
          formula: b.formula?.value,
          mass: b.mass?.value,
          iupacName: b.iupac?.value,
          pubchemCid: b.pubchem?.value,
        };
        if (!compound.wikidataQid || !compound.name) continue;
        if (!byTaxon[latinName]) byTaxon[latinName] = { latinName, compounds: [] };
        // Deduplicate by QID
        if (!byTaxon[latinName].compounds.find((c) => c.wikidataQid === compound.wikidataQid)) {
          byTaxon[latinName].compounds.push(compound);
        }
      }

      // 4. Match LOTUS species to DB species and check existing links
      const preview = [];
      let totalNew = 0;
      let totalExisting = 0;

      for (const sp of speciesInDb) {
        const taxonData = sp.latinName ? byTaxon[sp.latinName] : undefined;
        const compounds = taxonData?.compounds ?? [];

        // Check which molecules already exist in DB
        const newCompounds = [];
        const existingCompounds = [];
        for (const c of compounds) {
          const conditions = [];
          if (c.inchikey) conditions.push(eq(molecules.inchiKey, c.inchikey));
          if (c.wikidataQid) conditions.push(eq(molecules.wikidataQid, c.wikidataQid));
          let exists = false;
          if (conditions.length > 0) {
            const found = await db.select({ id: molecules.id })
              .from(molecules)
              .where(or(...conditions))
              .limit(1);
            exists = found.length > 0;
          }
          if (exists) existingCompounds.push(c);
          else newCompounds.push(c);
        }

        totalNew += newCompounds.length;
        totalExisting += existingCompounds.length;

        preview.push({
          plantId: sp.id,
          plantName: sp.name,
          latinName: sp.latinName,
          totalMolecules: compounds.length,
          newMolecules: newCompounds.length,
          existingMolecules: existingCompounds.length,
          compounds: compounds.slice(0, 10), // Preview only first 10
        });
      }

      return {
        genus,
        speciesFound: speciesInDb.length,
        totalMolecules: totalNew + totalExisting,
        newMolecules: totalNew,
        existingMolecules: totalExisting,
        preview,
        message: `${speciesInDb.length} espèces, ${totalNew + totalExisting} molécules LOTUS (${totalNew} nouvelles, ${totalExisting} déjà en base).`,
      };
    }),

  /**
   * Batch import all LOTUS molecules for a genus
   * Processes species one by one, returns per-species results
   */
  batchImportByGenus: publicProcedure
    .input(z.object({
      genus: z.string().min(1),
      limitPerSpecies: z.number().min(1).max(100).default(30),
      defaultRole: z.enum(["majeur", "secondaire", "trace", "variable"]).default("trace"),
      selectedSpeciesIds: z.array(z.number()).optional(), // If empty, import all
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const genus = input.genus.trim();

      // 1. Get species in DB
      let speciesInDb = await db
        .select({ id: plants.id, name: plants.name, latinName: sql<string>`COALESCE(${plants.latinName}, '')` })
        .from(plants)
        .where(like(plants.latinName, `${genus} %`))
        .orderBy(plants.latinName);

      // Filter by selected species if provided
      if (input.selectedSpeciesIds && input.selectedSpeciesIds.length > 0) {
        speciesInDb = speciesInDb.filter((sp) => input.selectedSpeciesIds!.includes(sp.id));
      }

      if (speciesInDb.length === 0) {
        return {
          genus,
          totalProcessed: 0,
          totalCreated: 0,
          totalLinked: 0,
          totalSkipped: 0,
          totalErrors: 0,
          speciesResults: [],
          message: `Aucune espèce du genre ${genus} trouvée dans PERFUMUM.`,
        };
      }

       // 2. Fetch all molecules for the genus in one SPARQL query
      const safeGenus = genus.replace(/"/g, '\\"');
      const sparqlQueryStr2 = `
        SELECT DISTINCT ?taxon ?taxonLabel ?latinName ?compound ?compoundLabel ?inchikey ?cas ?smiles ?formula ?mass ?iupac ?pubchem
        WHERE {
          ?genus wdt:P225 "${safeGenus}" .
          ?taxon wdt:P171* ?genus .
          ?taxon wdt:P105 wd:Q7432 .
          OPTIONAL { ?taxon wdt:P225 ?latinName . }
          ?compound wdt:P703 ?taxon .
          OPTIONAL { ?compound wdt:P235 ?inchikey . }
          OPTIONAL { ?compound wdt:P231 ?cas . }
          OPTIONAL { ?compound wdt:P233 ?smiles . }
          OPTIONAL { ?compound wdt:P274 ?formula . }
          OPTIONAL { ?compound wdt:P2067 ?mass . }
          OPTIONAL { ?compound wdt:P2017 ?iupac . }
          OPTIONAL { ?compound wdt:P662 ?pubchem . }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr" . }
        }
        LIMIT ${speciesInDb.length * input.limitPerSpecies}
      `;
      // Use shared sparqlQuery helper with retry + exponential backoff
      let bindings: any[] = [];
      try {
        bindings = await sparqlQuery(sparqlQueryStr2, { timeoutMs: 30000, maxRetries: 3 });
      } catch (err: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Erreur SPARQL après plusieurs tentatives: ${err.message}`,
        });
      }

      // 3. Group by taxon latin name
      const byTaxon: Record<string, LotusCompound[]> = {};
      for (const b of bindings) {
        const latinName = b.latinName?.value ?? b.taxonLabel?.value ?? "";
        if (!latinName) continue;
        const compound: LotusCompound = {
          wikidataQid: b.compound?.value?.split("/").pop() ?? "",
          name: b.compoundLabel?.value ?? "",
          inchikey: b.inchikey?.value,
          cas: b.cas?.value,
          smiles: b.smiles?.value,
          formula: b.formula?.value,
          mass: b.mass?.value,
          iupacName: b.iupac?.value,
          pubchemCid: b.pubchem?.value,
        };
        if (!compound.wikidataQid || !compound.name) continue;
        if (!byTaxon[latinName]) byTaxon[latinName] = [];
        if (!byTaxon[latinName].find((c) => c.wikidataQid === compound.wikidataQid)) {
          byTaxon[latinName].push(compound);
        }
      }

      // 4. Process each species
      const speciesResults = [];
      let totalCreated = 0;
      let totalLinked = 0;
      let totalSkipped = 0;
      let totalErrors = 0;

      for (const sp of speciesInDb) {
        const compounds = (sp.latinName ? byTaxon[sp.latinName] : undefined) ?? [];
        let created = 0;
        let linked = 0;
        let skipped = 0;
        let errors = 0;

        for (const compound of compounds) {
          try {
            // Find or create molecule
            let moleculeId: number | null = null;

            const searchConditions = [];
            if (compound.inchikey) searchConditions.push(eq(molecules.inchiKey, compound.inchikey));
            if (compound.wikidataQid) searchConditions.push(eq(molecules.wikidataQid, compound.wikidataQid));

            let existingMol = null;
            if (searchConditions.length > 0) {
              const found = await db.select({ id: molecules.id })
                .from(molecules)
                .where(or(...searchConditions))
                .limit(1);
              existingMol = found[0] ?? null;
            }

            if (!existingMol) {
              const found = await db.select({ id: molecules.id })
                .from(molecules)
                .where(like(molecules.name, `%${compound.name}%`))
                .limit(1);
              existingMol = found[0] ?? null;
            }

            if (existingMol) {
              moleculeId = existingMol.id;
              // Update QID if missing
              if (compound.wikidataQid) {
                await db.update(molecules)
                  .set({ wikidataQid: compound.wikidataQid })
                  .where(and(eq(molecules.id, existingMol.id), isNull(molecules.wikidataQid)));
              }
            } else {
              // Create new molecule
              const insertResult = await db.insert(molecules).values({
                name: compound.name,
                iupacName: compound.iupacName ?? null,
                casNumber: compound.cas ?? null,
                chemicalFormula: compound.formula ?? null,
                smiles: compound.smiles ?? null,
                inchiKey: compound.inchikey ?? null,
                wikidataQid: compound.wikidataQid,
                molecularWeight: compound.mass ? Math.round(parseFloat(compound.mass)) : null,
                pubchemCid: compound.pubchemCid ? parseInt(compound.pubchemCid, 10) : null,
                notes: `Importé depuis LOTUS/Wikidata (${compound.wikidataQid}) — genre ${genus}`,
                botanicalSources: sp.latinName,
              });
              moleculeId = Number((insertResult as any).insertId ?? 0);
              created++;
              totalCreated++;
            }

            if (!moleculeId) { errors++; totalErrors++; continue; }

            // Check if link exists
            const existingLink = await db.select({ plantId: plantMolecules.plantId })
              .from(plantMolecules)
              .where(and(eq(plantMolecules.plantId, sp.id), eq(plantMolecules.moleculeId, moleculeId)))
              .limit(1);

            if (existingLink.length > 0) {
              skipped++;
              totalSkipped++;
              continue;
            }

            // Create link
            await db.insert(plantMolecules).values({
              plantId: sp.id,
              moleculeId,
              role: input.defaultRole,
              source: `LOTUS/Wikidata (${compound.wikidataQid})`,
              notes: `Import batch genre ${genus} — ${new Date().toLocaleDateString("fr-FR")}`,
            });
            linked++;
            totalLinked++;
          } catch {
            errors++;
            totalErrors++;
          }
        }

        speciesResults.push({
          plantId: sp.id,
          plantName: sp.name,
          latinName: sp.latinName,
          totalMolecules: compounds.length,
          created,
          linked,
          skipped,
          errors,
        });
      }

      return {
        genus,
        totalProcessed: speciesInDb.length,
        totalCreated,
        totalLinked,
        totalSkipped,
        totalErrors,
        speciesResults,
        message: `Import terminé : ${totalCreated} molécules créées, ${totalLinked} liens établis, ${totalSkipped} déjà liés, ${totalErrors} erreurs.`,
      };
    }),
});
