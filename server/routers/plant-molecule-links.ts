import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";

export const plantMoleculeLinksRouter = router({
  getAll: publicProcedure.query(async () => {
    return db.getAllPlantMoleculeLinks();
  }),
  getByPlant: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      return db.getPlantMolecules(input.plantId);
    }),
  getByMolecule: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      return db.getPlantsByMolecule(input.moleculeId);
    }),
  getSignatureMolecules: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      return db.getSignatureMolecules(input.plantId);
    }),
  create: adminProcedure
    .input(z.object({
      plantId: z.number(),
      moleculeId: z.number(),
      percentageMin: z.number().optional(),
      percentageMax: z.number().optional(),
      percentageTypical: z.number().optional(),
      isSignature: z.number().optional(),
      role: z.string().optional(),
      // `update` acceptait déjà `source`, pas `create` : zod écarte les clés
      // inconnues sans rien dire, donc la référence bibliographique saisie
      // dans l'écran d'administration était perdue à chaque création.
      source: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createPlantMoleculeLink(input);
    }),
  delete: adminProcedure
    .input(z.object({
      plantId: z.number(),
      moleculeId: z.number(),
    }))
    .mutation(async ({ input }) => {
      return db.deletePlantMoleculeLink(input.plantId, input.moleculeId);
    }),
  update: adminProcedure
    .input(z.object({
      plantId: z.number(),
      moleculeId: z.number(),
      percentageMin: z.number().nullable().optional(),
      percentageMax: z.number().nullable().optional(),
      percentageTypical: z.number().nullable().optional(),
      isSignature: z.number().optional(),
      role: z.string().optional(),
      source: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { plantId, moleculeId, ...data } = input;
      return db.updatePlantMoleculeLink(plantId, moleculeId, data);
    }),
  getByPlantWithDetails: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      return db.getPlantMoleculesWithPercentages(input.plantId);
    }),
})

