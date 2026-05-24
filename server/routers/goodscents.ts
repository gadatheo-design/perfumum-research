/**
 * GoodScents Import Router
 *
 * Import des profils olfactifs depuis The Good Scents Company
 * Source: https://github.com/pyrfume/pyrfume-data/tree/main/goodscents (MIT License)
 *
 * Fonctionnalités:
 * - Import des descripteurs olfactifs via correspondance CAS number
 * - Statistiques de couverture (molécules PERFUMUM couvertes par GoodScents)
 * - Consultation des profils olfactifs GoodScents par molécule
 * - Import par batch avec progression
 */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  pyrfumeOlfactoryDescriptors,
  pyrfumeDatasets,
  molecules,
} from "../../drizzle/schema";
import { eq, sql, inArray, and } from "drizzle-orm";

const GOODSCENTS_SOURCE_URL =
  "https://raw.githubusercontent.com/pyrfume/pyrfume-data/main/goodscents";

// ============================================================================
// TYPES
// ============================================================================

interface GoodScentsEntry {
  cas: string;
  tgsc_id: string;
  pubchem_cid: string;
  olfactive_descriptors: string[];
  odor_tags: string[];
  odor_description: string;
  strength: string;
  source: string;
  source_year: string;
  smiles: string;
  iupac: string;
  molecular_weight: string;
  gs_name: string;
}

// ============================================================================
// ROUTER
// ============================================================================

export const goodscentsRouter = router({
  // --------------------------------------------------------------------------
  // Statistiques de couverture
  // --------------------------------------------------------------------------
  getCoverageStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalMolecules: 0, covered: 0, coveragePercent: 0, totalDescriptors: 0 };

    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(molecules);

    const [coveredResult] = await db
      .select({ count: sql<number>`COUNT(DISTINCT molecule_id)` })
      .from(pyrfumeOlfactoryDescriptors)
      .where(eq(pyrfumeOlfactoryDescriptors.dataset, "goodscents"));

    const [descriptorCountResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(pyrfumeOlfactoryDescriptors)
      .where(eq(pyrfumeOlfactoryDescriptors.dataset, "goodscents"));

    const total = Number(totalResult.count);
    const covered = Number(coveredResult.count);

    return {
      totalMolecules: total,
      covered,
      coveragePercent: total > 0 ? Math.round((covered / total) * 100) : 0,
      totalDescriptors: Number(descriptorCountResult.count),
    };
  }),

  // --------------------------------------------------------------------------
  // Import depuis le JSON pré-traité (endpoint admin)
  // --------------------------------------------------------------------------
  importBatch: protectedProcedure
    .input(
      z.object({
        entries: z.array(
          z.object({
            cas: z.string(),
            descriptors: z.array(z.string()),
            odorDescription: z.string().optional(),
            strength: z.string().optional(),
            source: z.string().optional(),
            sourceYear: z.string().optional(),
          })
        ),
        replaceExisting: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database non disponible");

      const { entries, replaceExisting } = input;

      // Récupérer tous les CAS numbers des molécules PERFUMUM
      const casNumbers = entries.map((e) => e.cas).filter(Boolean);
      if (casNumbers.length === 0) return { matched: 0, imported: 0, skipped: 0 };

      // Trouver les molécules correspondantes par CAS
      const matchedMolecules = await db
        .select({ id: molecules.id, casNumber: molecules.casNumber })
        .from(molecules)
        .where(inArray(molecules.casNumber, casNumbers));

      const casToMoleculeId = new Map<string, number>();
      for (const mol of matchedMolecules) {
        if (mol.casNumber) casToMoleculeId.set(mol.casNumber, mol.id);
      }

      // Supprimer les entrées existantes si demandé
      if (replaceExisting && matchedMolecules.length > 0) {
        const molIds = matchedMolecules.map((m) => m.id);
        await db
          .delete(pyrfumeOlfactoryDescriptors)
          .where(
            and(
              eq(pyrfumeOlfactoryDescriptors.dataset, "goodscents"),
              inArray(pyrfumeOlfactoryDescriptors.moleculeId, molIds)
            )
          );
      }

      // Insérer les descripteurs par batch
      let imported = 0;
      let skipped = 0;
      const BATCH_SIZE = 200;

      const allDescriptorRows: {
        moleculeId: number;
        dataset: string;
        descriptor: string;
        value: null;
        rawValue: string | null;
        sourceUrl: string;
      }[] = [];

      for (const entry of entries) {
        const moleculeId = casToMoleculeId.get(entry.cas);
        if (!moleculeId) {
          skipped++;
          continue;
        }

        for (const descriptor of entry.descriptors) {
          if (!descriptor.trim()) continue;
          allDescriptorRows.push({
            moleculeId,
            dataset: "goodscents",
            descriptor: descriptor.trim().toLowerCase(),
            value: null,
            rawValue: entry.odorDescription || null,
            sourceUrl: GOODSCENTS_SOURCE_URL,
          });
        }
      }

      // Insérer par batch
      for (let i = 0; i < allDescriptorRows.length; i += BATCH_SIZE) {
        const batch = allDescriptorRows.slice(i, i + BATCH_SIZE);
        if (batch.length > 0) {
          await db.insert(pyrfumeOlfactoryDescriptors).values(batch);
          imported += batch.length;
        }
      }

      // Mettre à jour les métadonnées du dataset
      const [existing] = await db
        .select()
        .from(pyrfumeDatasets)
        .where(eq(pyrfumeDatasets.name, "goodscents"));

      const [molCountResult] = await db
        .select({ count: sql<number>`COUNT(DISTINCT molecule_id)` })
        .from(pyrfumeOlfactoryDescriptors)
        .where(eq(pyrfumeOlfactoryDescriptors.dataset, "goodscents"));

      if (existing) {
        await db
          .update(pyrfumeDatasets)
          .set({
            importStatus: "completed",
            moleculeCount: Number(molCountResult.count),
            lastImportedAt: new Date(),
          })
          .where(eq(pyrfumeDatasets.name, "goodscents"));
      } else {
        await db.insert(pyrfumeDatasets).values({
          name: "goodscents",
          displayName: "The Good Scents Company",
          author: "The Good Scents Company",
          year: 2021,
          description:
            "Base de données industrielle avec descripteurs olfactifs, seuils de perception et applications pour ~5000 molécules.",
          sourceUrl: GOODSCENTS_SOURCE_URL,
          citation:
            "The Good Scents Company Information System. www.thegoodscentscompany.com",
          license: "MIT (via Pyrfume)",
          importStatus: "completed",
          moleculeCount: Number(molCountResult.count),
          lastImportedAt: new Date(),
        });
      }

      return {
        matched: casToMoleculeId.size,
        imported,
        skipped,
        totalEntries: entries.length,
      };
    }),

  // --------------------------------------------------------------------------
  // Obtenir les descripteurs GoodScents pour une molécule
  // --------------------------------------------------------------------------
  getDescriptorsForMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return await db
        .select()
        .from(pyrfumeOlfactoryDescriptors)
        .where(
          and(
            eq(pyrfumeOlfactoryDescriptors.moleculeId, input.moleculeId),
            eq(pyrfumeOlfactoryDescriptors.dataset, "goodscents")
          )
        )
        .orderBy(pyrfumeOlfactoryDescriptors.descriptor);
    }),

  // --------------------------------------------------------------------------
  // Rechercher des molécules par descripteur olfactif GoodScents
  // --------------------------------------------------------------------------
  getMoleculesByDescriptor: publicProcedure
    .input(
      z.object({
        descriptor: z.string(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select({
          moleculeId: pyrfumeOlfactoryDescriptors.moleculeId,
          descriptor: pyrfumeOlfactoryDescriptors.descriptor,
          moleculeName: molecules.name,
          casNumber: molecules.casNumber,
        })
        .from(pyrfumeOlfactoryDescriptors)
        .innerJoin(
          molecules,
          eq(pyrfumeOlfactoryDescriptors.moleculeId, molecules.id)
        )
        .where(
          and(
            eq(pyrfumeOlfactoryDescriptors.dataset, "goodscents"),
            eq(pyrfumeOlfactoryDescriptors.descriptor, input.descriptor.toLowerCase())
          )
        )
        .limit(input.limit);

      return results;
    }),

  // --------------------------------------------------------------------------
  // Top descripteurs GoodScents dans la base PERFUMUM
  // --------------------------------------------------------------------------
  getTopDescriptors: publicProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select({
          descriptor: pyrfumeOlfactoryDescriptors.descriptor,
          count: sql<number>`COUNT(DISTINCT molecule_id)`,
        })
        .from(pyrfumeOlfactoryDescriptors)
        .where(eq(pyrfumeOlfactoryDescriptors.dataset, "goodscents"))
        .groupBy(pyrfumeOlfactoryDescriptors.descriptor)
        .orderBy(sql`COUNT(DISTINCT molecule_id) DESC`)
        .limit(input.limit);

      return results;
    }),
});
