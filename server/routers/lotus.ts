/**
 * LOTUS (Linked Open Natural Products) Router
 * 
 * Enrichit les liaisons plante-molécule via Wikidata SPARQL (LOTUS dataset).
 * LOTUS contient ~220 000 paires espèce-molécule, entièrement open-source.
 * Aucune authentification requise.
 * 
 * Référence : Rutz et al. (2022) eLife 11:e70780
 * https://lotus.naturalproducts.net/
 */

import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { plants, molecules, plantMolecules } from "../../drizzle/schema";
import { and, count, eq, like, or, sql } from "drizzle-orm";
import { sparqlQuery } from "../utils/sparql";

const DELAY_MS = 1200; // Délai entre les requêtes batch

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── SPARQL Query ─────────────────────────────────────────────────────────────

async function fetchMoleculesForPlant(latinName: string): Promise<Array<{
  wikidataId: string;
  name: string;
  cas?: string;
  smiles?: string;
  inchikey?: string;
  inchi?: string;
}>> {
  const safeName = latinName.replace(/"/g, '\\"');
  const query = `
SELECT DISTINCT ?molecule ?moleculeName ?cas ?smiles ?inchikey ?inchi WHERE {
  ?molecule wdt:P703 ?plant .
  ?plant wdt:P225 "${safeName}" .
  ?molecule rdfs:label ?moleculeName FILTER(LANG(?moleculeName)="en")
  OPTIONAL { ?molecule wdt:P233 ?smiles }
  OPTIONAL { ?molecule wdt:P231 ?cas }
  OPTIONAL { ?molecule wdt:P234 ?inchikey }
  OPTIONAL { ?molecule wdt:P235 ?inchi }
}
LIMIT 200`;
  // Use shared sparqlQuery helper with retry + exponential backoff
  const bindings = await sparqlQuery(query, { timeoutMs: 30000, maxRetries: 3 });
  return bindings.map((b: any) => ({
    wikidataId: b.molecule?.value?.replace("http://www.wikidata.org/entity/", "") || "",
    name: b.moleculeName?.value || "",
    cas: b.cas?.value || undefined,
    smiles: b.smiles?.value || undefined,
    inchikey: b.inchikey?.value || undefined,
    inchi: b.inchi?.value || undefined,
  })).filter((m: any) => m.wikidataId && m.name);
}

// ─── Matching molécule en DB ──────────────────────────────────────────────────

async function findMoleculeInDb(
  db: any,
  lotusData: { name: string; cas?: string; smiles?: string; inchikey?: string }
): Promise<number | null> {
  // 1. Match par CAS (le plus fiable)
  if (lotusData.cas) {
    const [byCase] = await db.select({ id: molecules.id })
      .from(molecules)
      .where(eq(molecules.casNumber, lotusData.cas))
      .limit(1);
    if (byCase) return byCase.id;
  }

  // 2. Match par InChIKey
  if (lotusData.inchikey) {
    const [byInchikey] = await db.select({ id: molecules.id })
      .from(molecules)
      .where(eq(molecules.inchiKey, lotusData.inchikey))
      .limit(1);
    if (byInchikey) return byInchikey.id;
  }

  // 3. Match par nom exact (insensible à la casse)
  const [byName] = await db.select({ id: molecules.id })
    .from(molecules)
    .where(sql`LOWER(${molecules.name}) = LOWER(${lotusData.name})`)
    .limit(1);
  if (byName) return byName.id;

  // 4. Match par nom IUPAC
  if (lotusData.name.length > 5) {
    const [byIupac] = await db.select({ id: molecules.id })
      .from(molecules)
      .where(sql`LOWER(${molecules.iupacName}) = LOWER(${lotusData.name})`)
      .limit(1);
    if (byIupac) return byIupac.id;
  }

  return null;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const lotusRouter = router({

  /**
   * Statistiques LOTUS pour le dashboard
   */
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("DB non disponible");

    const [[totalPlants], [withLotus], [totalLinks]] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(plants)
        .where(sql`${plants.latinName} IS NOT NULL AND ${plants.latinName} != ''`),
      db.select({ count: sql<number>`COUNT(DISTINCT plant_id)` }).from(plantMolecules)
        .where(sql`source = 'LOTUS'`),
      db.select({ count: sql<number>`COUNT(*)` }).from(plantMolecules)
        .where(sql`source = 'LOTUS'`),
    ]);

    return {
      totalPlants: Number(totalPlants.count),
      plantsWithLotus: Number(withLotus.count),
      totalLotusLinks: Number(totalLinks.count),
    };
  }),

  /**
   * Prévisualiser les molécules LOTUS pour une plante
   */
  previewPlant: publicProcedure
    .input(z.object({
      plantId: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      const [plant] = await db.select().from(plants).where(eq(plants.id, input.plantId)).limit(1);
      if (!plant?.latinName) return { plant: null, molecules: [], error: "Plante sans nom latin" };

      try {
        const lotusMolecules = await fetchMoleculesForPlant(plant.latinName ?? "");
        
        // Pour chaque molécule LOTUS, vérifier si elle est déjà en DB
        const enriched = await Promise.all(lotusMolecules.slice(0, 50).map(async (m) => {
          const dbId = await findMoleculeInDb(db, m);
          
          // Vérifier si la liaison existe déjà
          let alreadyLinked = false;
          if (dbId) {
            const [existing] = await db.select({ plantId: plantMolecules.plantId })
              .from(plantMolecules)
              .where(and(
                eq(plantMolecules.plantId, input.plantId),
                eq(plantMolecules.moleculeId, dbId)
              ))
              .limit(1);
            alreadyLinked = !!existing;
          }

          return {
            ...m,
            dbMoleculeId: dbId,
            alreadyLinked,
            canLink: !!dbId && !alreadyLinked,
          };
        }));

        return {
          plant: { id: plant.id, name: plant.name, latinName: plant.latinName },
          molecules: enriched,
          total: lotusMolecules.length,
          matchable: enriched.filter(m => m.dbMoleculeId).length,
          alreadyLinked: enriched.filter(m => m.alreadyLinked).length,
          newLinks: enriched.filter(m => m.canLink).length,
        };
      } catch (err: any) {
        return { plant: null, molecules: [], error: err.message };
      }
    }),

  /**
   * Enrichir les liaisons plante-molécule d'une plante via LOTUS
   */
  enrichPlantLinks: adminProcedure
    .input(z.object({
      plantId: z.number(),
      dryRun: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      const [plant] = await db.select().from(plants).where(eq(plants.id, input.plantId)).limit(1);
      if (!plant?.latinName) return { success: false, message: "Plante sans nom latin", created: 0 };

      const lotusMolecules = await fetchMoleculesForPlant(plant.latinName ?? "");
      
      let created = 0;
      let skipped = 0;
      let notFound = 0;
      const details: Array<{ name: string; status: "created" | "skipped" | "not_found" }> = [];

      for (const lotusM of lotusMolecules) {
        const dbId = await findMoleculeInDb(db, lotusM);
        
        if (!dbId) {
          notFound++;
          details.push({ name: lotusM.name, status: "not_found" });
          continue;
        }

        // Vérifier si la liaison existe déjà
        const [existing] = await db.select({ plantId: plantMolecules.plantId })
          .from(plantMolecules)
          .where(and(
            eq(plantMolecules.plantId, input.plantId),
            eq(plantMolecules.moleculeId, dbId)
          ))
          .limit(1);

        if (existing) {
          skipped++;
          details.push({ name: lotusM.name, status: "skipped" });
          continue;
        }

        if (!input.dryRun) {
          await db.insert(plantMolecules).values({
            plantId: input.plantId,
            moleculeId: dbId,
            role: "variable",
            isSignature: 0,
            source: "LOTUS",
            notes: `Liaison automatique via LOTUS/Wikidata (${new Date().toISOString().split('T')[0]})`,
          }).onDuplicateKeyUpdate({ set: { role: "variable" } });
        }

        created++;
        details.push({ name: lotusM.name, status: "created" });
      }

      return {
        success: true,
        plant: plant.name,
        latinName: plant.latinName,
        total: lotusMolecules.length,
        created,
        skipped,
        notFound,
        dryRun: input.dryRun,
        details: details.slice(0, 30), // Limiter les détails retournés
      };
    }),

  /**
   * Enrichissement batch de toutes les plantes via LOTUS
   */
  enrichBatch: adminProcedure
    .input(z.object({
      limit: z.number().min(1).max(1000).default(20),
      onlyWithoutLinks: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB non disponible");

      // Récupérer les plantes à traiter
      const plantsToProcess = await db.select({
        id: plants.id,
        name: plants.name,
        latinName: sql<string>`COALESCE(${plants.latinName}, '')`,
      }).from(plants)
        .where(
          input.onlyWithoutLinks
            ? sql`${plants.latinName} IS NOT NULL AND ${plants.latinName} != '' AND ${plants.id} NOT IN (SELECT DISTINCT plant_id FROM plant_molecules WHERE source = 'LOTUS')`
            : sql`${plants.latinName} IS NOT NULL AND ${plants.latinName} != ''`
        )
        .limit(input.limit);

      const results = {
        total: plantsToProcess.length,
        processed: 0,
        totalCreated: 0,
        errors: 0,
        details: [] as Array<{ plant: string; created: number; error?: string }>,
      };

      for (const plant of plantsToProcess) {
        try {
          const lotusMolecules = await fetchMoleculesForPlant(plant.latinName!);
          let created = 0;

          for (const lotusM of lotusMolecules) {
            const dbId = await findMoleculeInDb(db, lotusM);
            if (!dbId) continue;

            const [existing] = await db.select({ plantId: plantMolecules.plantId })
              .from(plantMolecules)
              .where(and(
                eq(plantMolecules.plantId, plant.id),
                eq(plantMolecules.moleculeId, dbId)
              ))
              .limit(1);

            if (!existing) {
              await db.insert(plantMolecules).values({
                plantId: plant.id,
                moleculeId: dbId,
                role: "variable",
                isSignature: 0,
                source: "LOTUS",
                notes: `Liaison automatique via LOTUS/Wikidata (${new Date().toISOString().split('T')[0]})`,
              }).onDuplicateKeyUpdate({ set: { role: "variable" } });
              created++;
            }
          }

          results.processed++;
          results.totalCreated += created;
          results.details.push({ plant: plant.name, created });

          // Rate limiting Wikidata
          await sleep(DELAY_MS);
        } catch (err: any) {
          results.errors++;
          results.details.push({ plant: plant.name, created: 0, error: err.message });
          await sleep(DELAY_MS * 2); // Attendre plus longtemps en cas d'erreur
        }
      }

      return results;
    }),
});
