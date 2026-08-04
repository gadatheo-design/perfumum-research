import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const historyRouter = router({
  // Récupérer l'historique d'une entité
  getByEntity: publicProcedure
    .input(z.object({
      entityType: z.enum(["molecule", "recette", "accord", "famille", "matiere"]),
      entityId: z.number(),
      limit: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      return await db.getModificationHistory(input.entityType, input.entityId, input.limit);
    }),

  // Récupérer tout l'historique récent
  getRecent: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(100),
    }))
    .query(async ({ input }) => {
      return await db.getRecentModifications(input.limit);
    }),

  // Annuler une modification
  undo: adminProcedure
    .input(z.object({
      modificationId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const modification = await db.getModificationById(input.modificationId);
      if (!modification) {
        throw new Error("Modification introuvable");
      }

      // Récupérer les anciennes valeurs
      const oldData = typeof modification.stateBefore === 'string' 
        ? JSON.parse(modification.stateBefore) 
        : modification.stateBefore;

      // Restaurer selon le type d'entité
      switch (modification.entityType) {
        case "molecule":
          if (modification.operation === "delete") {
            await db.createMolecule(oldData);
          } else {
            await db.updateMolecule(modification.entityId, oldData);
          }
          break;
        case "recette":
          if (modification.operation === "delete") {
            await db.createRecette(oldData);
          } else {
            await db.updateRecette(modification.entityId, oldData);
          }
          break;
        case "accord":
          if (modification.operation === "delete") {
            await db.createAccord(oldData);
          } else {
            await db.updateAccord(modification.entityId, oldData);
          }
          break;
        case "famille":
          if (modification.operation === "delete") {
            await db.createFamily(oldData);
          } else {
            await db.updateFamily(modification.entityId, oldData);
          }
          break;
        case "matiere":
          if (modification.operation === "delete") {
            await db.createMatiere(oldData);
          } else {
            await db.updateMatiere(modification.entityId, oldData);
          }
          break;
        default:
          throw new Error(`Type d'entité non supporté: ${modification.entityType}`);
      }

      // Marquer la modification comme annulée
      await db.markModificationAsUndone(input.modificationId);

      return { success: true };
    }),
})

