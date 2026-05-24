import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { plantMolecules } from "../../drizzle/schema";

export const networkRouter = router({
  getRelationships: publicProcedure.query(async () => {
    return await db.getNetworkRelationships();
  }),
  
  // Nouveau: Réseau molécule-plante-terroir (procédure complète - peut être volumineuse)
  getMoleculePlantTerroirNetwork: publicProcedure.query(async () => {
    return await db.getMoleculePlantTerroirNetwork();
  }),
  
  // Procédures séparées pour réduire la taille des payloads
  getNetworkEntities: publicProcedure.query(async () => {
    const data = await db.getMoleculePlantTerroirNetwork();
    return data.entities;
  }),
  
  getNetworkPlantMoleculeRelations: publicProcedure.query(async () => {
    const data = await db.getMoleculePlantTerroirNetwork();
    return data.relationships.plantMolecules;
  }),
  
  getNetworkTerroirPlantRelations: publicProcedure.query(async () => {
    const data = await db.getMoleculePlantTerroirNetwork();
    return data.relationships.terroirPlants;
  }),
  
  // Molécules d'une plante avec pourcentages
  getPlantMoleculesWithPercentages: publicProcedure
    .input(z.object({ plantId: z.number() }))
    .query(async ({ input }) => {
      return await db.getPlantMoleculesWithPercentages(input.plantId);
    }),
  
  // Plantes contenant une molécule avec pourcentages
  getMoleculePlantsWithPercentages: publicProcedure
    .input(z.object({ moleculeId: z.number() }))
    .query(async ({ input }) => {
      return await db.getMoleculePlantsWithPercentages(input.moleculeId);
    }),
})

