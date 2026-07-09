import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { db } from "../db";
import {
  odorDescriptors,
  moleculeOdorDescriptors,
  olfactoryReceptors,
  moleculeReceptorInteractions,
  moleculeChemicalProperties,
} from "../../drizzle/schema-pred-o3";
import { molecules } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

/**
 * Routeur pour importer les données Pred-O3
 */
export const predO3ImportRouter = router({
  /**
   * Importe les descripteurs olfactifs
   */
  importOdorDescriptors: protectedProcedure
    .input(
      z.object({
        descriptors: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().optional(),
            frequency: z.number().optional(),
            category: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const inserted: string[] = [];
        const updated: string[] = [];

        for (const descriptor of input.descriptors) {
          // Vérifier si le descripteur existe
          const existing = await db
            .select()
            .from(odorDescriptors)
            .where(eq(odorDescriptors.id, descriptor.id))
            .limit(1);

          if (existing.length > 0) {
            // Mettre à jour
            await db
              .update(odorDescriptors)
              .set({
                name: descriptor.name,
                description: descriptor.description,
                frequency: descriptor.frequency,
                category: descriptor.category,
                updatedAt: new Date(),
              })
              .where(eq(odorDescriptors.id, descriptor.id));
            updated.push(descriptor.id);
          } else {
            // Insérer
            await db.insert(odorDescriptors).values({
              id: descriptor.id,
              name: descriptor.name,
              description: descriptor.description,
              frequency: descriptor.frequency || 0,
              category: descriptor.category,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            inserted.push(descriptor.id);
          }
        }

        return {
          success: true,
          inserted: inserted.length,
          updated: updated.length,
          total: input.descriptors.length,
        };
      } catch (error) {
        console.error("Erreur import descripteurs:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de l'import des descripteurs olfactifs",
        });
      }
    }),

  /**
   * Importe les récepteurs olfactifs
   */
  importOlfactoryReceptors: protectedProcedure
    .input(
      z.object({
        receptors: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            organism: z.enum(["human", "mouse", "rat", "other"]),
            geneId: z.string().optional(),
            uniprotId: z.string().optional(),
            description: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const inserted: string[] = [];
        const updated: string[] = [];

        for (const receptor of input.receptors) {
          const existing = await db
            .select()
            .from(olfactoryReceptors)
            .where(eq(olfactoryReceptors.id, receptor.id))
            .limit(1);

          if (existing.length > 0) {
            await db
              .update(olfactoryReceptors)
              .set({
                name: receptor.name,
                organism: receptor.organism,
                geneId: receptor.geneId,
                uniprotId: receptor.uniprotId,
                description: receptor.description,
                updatedAt: new Date(),
              })
              .where(eq(olfactoryReceptors.id, receptor.id));
            updated.push(receptor.id);
          } else {
            await db.insert(olfactoryReceptors).values({
              id: receptor.id,
              name: receptor.name,
              organism: receptor.organism,
              geneId: receptor.geneId,
              uniprotId: receptor.uniprotId,
              description: receptor.description,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            inserted.push(receptor.id);
          }
        }

        return {
          success: true,
          inserted: inserted.length,
          updated: updated.length,
          total: input.receptors.length,
        };
      } catch (error) {
        console.error("Erreur import récepteurs:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de l'import des récepteurs olfactifs",
        });
      }
    }),

  /**
   * Lie une molécule à des descripteurs olfactifs
   */
  linkMoleculeToDescriptors: protectedProcedure
    .input(
      z.object({
        moleculeId: z.number(),
        descriptors: z.array(
          z.object({
            descriptorId: z.string(),
            confidence: z.number().min(0).max(1).default(1),
            source: z.string().default("pred-o3"),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Vérifier que la molécule existe
        const molecule = await db
          .select()
          .from(molecules)
          .where(eq(molecules.id, input.moleculeId))
          .limit(1);

        if (molecule.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Molécule non trouvée",
          });
        }

        const linked: string[] = [];

        for (const descriptor of input.descriptors) {
          // Vérifier que le descripteur existe
          const desc = await db
            .select()
            .from(odorDescriptors)
            .where(eq(odorDescriptors.id, descriptor.descriptorId))
            .limit(1);

          if (desc.length === 0) {
            continue;
          }

          // Vérifier si la liaison existe
          const existing = await db
            .select()
            .from(moleculeOdorDescriptors)
            .where(
              and(
                eq(moleculeOdorDescriptors.moleculeId, input.moleculeId),
                eq(moleculeOdorDescriptors.descriptorId, descriptor.descriptorId)
              )
            )
            .limit(1);

          if (existing.length === 0) {
            await db.insert(moleculeOdorDescriptors).values({
              moleculeId: input.moleculeId,
              descriptorId: descriptor.descriptorId,
              confidence: descriptor.confidence.toString(),
              source: descriptor.source,
              createdAt: new Date(),
            });
            linked.push(descriptor.descriptorId);
          }
        }

        return {
          success: true,
          linked: linked.length,
          total: input.descriptors.length,
        };
      } catch (error) {
        console.error("Erreur liaison molécule-descripteurs:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la liaison molécule-descripteurs",
        });
      }
    }),

  /**
   * Importe les propriétés chimiques d'une molécule
   */
  importChemicalProperties: protectedProcedure
    .input(
      z.object({
        moleculeId: z.number(),
        smiles: z.string().optional(),
        inchi: z.string().optional(),
        inchiKey: z.string().optional(),
        molecularFormula: z.string().optional(),
        molecularWeight: z.number().optional(),
        logP: z.number().optional(),
        hbdCount: z.number().optional(),
        hbaCount: z.number().optional(),
        rotableBonds: z.number().optional(),
        polarSurfaceArea: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Vérifier que la molécule existe
        const molecule = await db
          .select()
          .from(molecules)
          .where(eq(molecules.id, input.moleculeId))
          .limit(1);

        if (molecule.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Molécule non trouvée",
          });
        }

        // Vérifier si les propriétés existent
        const existing = await db
          .select()
          .from(moleculeChemicalProperties)
          .where(eq(moleculeChemicalProperties.moleculeId, input.moleculeId))
          .limit(1);

        if (existing.length > 0) {
          // Mettre à jour
          await db
            .update(moleculeChemicalProperties)
            .set({
              smiles: input.smiles,
              inchi: input.inchi,
              inchiKey: input.inchiKey,
              molecularFormula: input.molecularFormula,
              molecularWeight: input.molecularWeight?.toString(),
              logP: input.logP?.toString(),
              hbdCount: input.hbdCount,
              hbaCount: input.hbaCount,
              rotableBonds: input.rotableBonds,
              polarSurfaceArea: input.polarSurfaceArea?.toString(),
              updatedAt: new Date(),
            })
            .where(eq(moleculeChemicalProperties.moleculeId, input.moleculeId));
        } else {
          // Insérer
          await db.insert(moleculeChemicalProperties).values({
            moleculeId: input.moleculeId,
            smiles: input.smiles,
            inchi: input.inchi,
            inchiKey: input.inchiKey,
            molecularFormula: input.molecularFormula,
            molecularWeight: input.molecularWeight?.toString(),
            logP: input.logP?.toString(),
            hbdCount: input.hbdCount,
            hbaCount: input.hbaCount,
            rotableBonds: input.rotableBonds,
            polarSurfaceArea: input.polarSurfaceArea?.toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        return { success: true };
      } catch (error) {
        console.error("Erreur import propriétés chimiques:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de l'import des propriétés chimiques",
        });
      }
    }),

  /**
   * Récupère les statistiques d'import
   */
  getImportStats: protectedProcedure.query(async () => {
    try {
      const [descriptorCount, receptorCount, moleculeDescriptorCount] =
        await Promise.all([
          db.select().from(odorDescriptors),
          db.select().from(olfactoryReceptors),
          db.select().from(moleculeOdorDescriptors),
        ]);

      return {
        odorDescriptors: descriptorCount.length,
        olfactoryReceptors: receptorCount.length,
        moleculeDescriptorLinks: moleculeDescriptorCount.length,
      };
    } catch (error) {
      console.error("Erreur récupération stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erreur lors de la récupération des statistiques",
      });
    }
  }),
});
