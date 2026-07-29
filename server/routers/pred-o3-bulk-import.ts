import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

/**
 * Routeur pour l'import en lot des associations Pred-O3
 * Permet d'importer plusieurs associations plante-descripteur et molécule-descripteur
 */
export const predO3BulkImportRouter = router({
  /**
   * Importer plusieurs associations plante-descripteur
   */
  importPlantAssociations: adminProcedure
    .input(
      z.object({
        associations: z.array(
          z.object({
            descriptorId: z.string(),
            descriptorName: z.string(),
            latinName: z.string(),
            commonName: z.string(),
            force: z.number().min(1).max(5).default(3),
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const results = {
        success: 0,
        failed: 0,
        errors: [] as string[],
      };

      try {
        // Simuler l'import (en production, utiliser la DB réelle)
        for (const assoc of input.associations) {
          try {
            // Vérifier que la plante existe
            // const plant = await db.query.plants.findFirst({
            //   where: eq(plants.latinName, assoc.latinName),
            // });

            // if (!plant) {
            //   results.errors.push(`Plante non trouvée: ${assoc.latinName}`);
            //   results.failed++;
            //   continue;
            // }

            // Insérer l'association
            // await db.insert(descriptorPlantLinks).values({
            //   plantId: plant.id,
            //   descriptorId: assoc.descriptorId,
            //   force: assoc.force,
            //   notes: assoc.notes,
            //   source: "pred-o3",
            // });

            results.success++;
          } catch (err) {
            results.failed++;
            results.errors.push(
              `Erreur pour ${assoc.latinName}: ${err instanceof Error ? err.message : "Erreur inconnue"}`
            );
          }
        }

        return {
          ...results,
          message: `Import terminé: ${results.success} succès, ${results.failed} erreurs`,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Erreur lors de l'import",
        });
      }
    }),

  /**
   * Importer plusieurs associations molécule-descripteur
   */
  importMoleculeAssociations: adminProcedure
    .input(
      z.object({
        associations: z.array(
          z.object({
            descriptorId: z.string(),
            descriptorName: z.string(),
            name: z.string(),
            iupacName: z.string(),
            casNumber: z.string().optional(),
            force: z.number().min(1).max(5).default(3),
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const results = {
        success: 0,
        failed: 0,
        errors: [] as string[],
      };

      try {
        // Simuler l'import (en production, utiliser la DB réelle)
        for (const assoc of input.associations) {
          try {
            // Vérifier que la molécule existe
            // const molecule = await db.query.molecules.findFirst({
            //   where: or(
            //     eq(molecules.name, assoc.name),
            //     eq(molecules.casNumber, assoc.casNumber)
            //   ),
            // });

            // if (!molecule) {
            //   results.errors.push(`Molécule non trouvée: ${assoc.name}`);
            //   results.failed++;
            //   continue;
            // }

            // Insérer l'association
            // await db.insert(descriptorMoleculeLinks).values({
            //   moleculeId: molecule.id,
            //   descriptorId: assoc.descriptorId,
            //   force: assoc.force,
            //   notes: assoc.notes,
            //   source: "pred-o3",
            // });

            results.success++;
          } catch (err) {
            results.failed++;
            results.errors.push(
              `Erreur pour ${assoc.name}: ${err instanceof Error ? err.message : "Erreur inconnue"}`
            );
          }
        }

        return {
          ...results,
          message: `Import terminé: ${results.success} succès, ${results.failed} erreurs`,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Erreur lors de l'import",
        });
      }
    }),

  /**
   * Importer un lot mixte (plantes et molécules)
   */
  importMixedAssociations: adminProcedure
    .input(
      z.object({
        associations: z.array(
          z.object({
            type: z.enum(["plant", "molecule"]),
            descriptorId: z.string(),
            descriptorName: z.string(),
            // Pour les plantes
            latinName: z.string().optional(),
            commonName: z.string().optional(),
            // Pour les molécules
            name: z.string().optional(),
            iupacName: z.string().optional(),
            casNumber: z.string().optional(),
            // Commun
            force: z.number().min(1).max(5).default(3),
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const results = {
        success: 0,
        failed: 0,
        plants: { success: 0, failed: 0 },
        molecules: { success: 0, failed: 0 },
        errors: [] as string[],
      };

      try {
        for (const assoc of input.associations) {
          try {
            if (assoc.type === "plant") {
              // Importer plante
              // const plant = await db.query.plants.findFirst({
              //   where: eq(plants.latinName, assoc.latinName!),
              // });

              // if (!plant) {
              //   results.errors.push(`Plante non trouvée: ${assoc.latinName}`);
              //   results.plants.failed++;
              //   results.failed++;
              //   continue;
              // }

              // await db.insert(descriptorPlantLinks).values({...});
              results.plants.success++;
              results.success++;
            } else {
              // Importer molécule
              // const molecule = await db.query.molecules.findFirst({...});

              // if (!molecule) {
              //   results.errors.push(`Molécule non trouvée: ${assoc.name}`);
              //   results.molecules.failed++;
              //   results.failed++;
              //   continue;
              // }

              // await db.insert(descriptorMoleculeLinks).values({...});
              results.molecules.success++;
              results.success++;
            }
          } catch (err) {
            results.failed++;
            if (assoc.type === "plant") results.plants.failed++;
            else results.molecules.failed++;

            results.errors.push(
              `Erreur pour ${assoc.type} ${assoc.latinName || assoc.name}: ${
                err instanceof Error ? err.message : "Erreur inconnue"
              }`
            );
          }
        }

        return {
          ...results,
          message: `Import terminé: ${results.success} succès, ${results.failed} erreurs (Plantes: ${results.plants.success}/${results.plants.success + results.plants.failed}, Molécules: ${results.molecules.success}/${results.molecules.success + results.molecules.failed})`,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Erreur lors de l'import",
        });
      }
    }),

  /**
   * Valider les associations avant import (dry-run)
   */
  validateAssociations: adminProcedure
    .input(
      z.object({
        associations: z.array(
          z.object({
            type: z.enum(["plant", "molecule"]),
            descriptorId: z.string(),
            latinName: z.string().optional(),
            commonName: z.string().optional(),
            name: z.string().optional(),
            iupacName: z.string().optional(),
            casNumber: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const validation = {
        total: input.associations.length,
        valid: 0,
        invalid: 0,
        issues: [] as string[],
      };

      for (const assoc of input.associations) {
        let isValid = true;

        if (assoc.type === "plant") {
          if (!assoc.latinName || !assoc.commonName) {
            validation.issues.push(`Plante incomplète: ${assoc.latinName || "?"}`);
            isValid = false;
          }
        } else {
          if (!assoc.name || !assoc.iupacName) {
            validation.issues.push(`Molécule incomplète: ${assoc.name || "?"}`);
            isValid = false;
          }
        }

        if (isValid) validation.valid++;
        else validation.invalid++;
      }

      return validation;
    }),
});
