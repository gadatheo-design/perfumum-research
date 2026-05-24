import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { recettes, terroirs } from "../../drizzle/schema";

export const crossLinksRouter = router({
  // Récupérer les recettes qui utilisent une molécule
  getRecettesByMolecule: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getRecettesByMolecule(input);
    }),
  
  // Récupérer les molécules similaires (même famille chimique ou profil olfactif proche)
  getSimilarMolecules: publicProcedure
    .input(z.object({
      moleculeId: z.number(),
      limit: z.number().optional().default(5),
    }))
    .query(async ({ input }) => {
      return db.getSimilarMoleculesByProfile(input.moleculeId, input.limit);
    }),
  
  // Récupérer les recettes similaires
  getSimilarRecettes: publicProcedure
    .input(z.object({
      recetteId: z.number(),
      limit: z.number().optional().default(5),
    }))
    .query(async ({ input }) => {
      return db.getSimilarRecettesByProfile(input.recetteId, input.limit);
    }),
  
  // Récupérer les plantes similaires
  getSimilarPlants: publicProcedure
    .input(z.object({
      plantId: z.number(),
      limit: z.number().optional().default(5),
    }))
    .query(async ({ input }) => {
      return db.getSimilarPlantsByProfile(input.plantId, input.limit);
    }),
  
  // Récupérer les terroirs similaires
  getSimilarTerroirs: publicProcedure
    .input(z.object({
      terroirId: z.number(),
      limit: z.number().optional().default(5),
    }))
    .query(async ({ input }) => {
      return db.getSimilarTerroirsByProfile(input.terroirId, input.limit);
    }),
  
  // Récupérer les matières premières liées à une molécule
  getRawMaterialsByMolecule: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getRawMaterialsByMolecule(input);
    }),
  
  // Récupérer les terroirs liés à une plante
  getTerroirsByPlant: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getTerroirsByPlant(input);
    }),
  
  // Récupérer les plantes liées à un terroir
  getPlantsByTerroir: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getPlantsByTerroir(input);
    }),
  
  // Récupérer les matières premières similaires
  getSimilarRawMaterials: publicProcedure
    .input(z.object({
      rawMaterialId: z.number(),
      limit: z.number().optional().default(5),
    }))
    .query(async ({ input }) => {
      return db.getSimilarRawMaterialsByProfile(input.rawMaterialId, input.limit);
    }),
})

