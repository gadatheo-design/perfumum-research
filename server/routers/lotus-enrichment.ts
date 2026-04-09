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
import { eq, like, and, or, isNull } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";
const SPARQL_TIMEOUT_MS = 22000;
const LOTUS_USER_AGENT =
  "PERFUMUM-Research/1.0 (https://perfumum.manus.space; olfactory-research-lotus) Node.js/fetch";

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

async function sparqlQuery(query: string): Promise<any[]> {
  const url = new URL(SPARQL_ENDPOINT);
  url.searchParams.set("query", query.trim());
  url.searchParams.set("format", "json");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SPARQL_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": LOTUS_USER_AGENT,
        "Accept-Language": "en",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`SPARQL HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data?.results?.bindings ?? [];
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("LOTUS/Wikidata SPARQL request timed out");
    }
    throw err;
  }
}

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
        .select({ id: plants.id, name: plants.name, latinName: plants.latinName })
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
});
