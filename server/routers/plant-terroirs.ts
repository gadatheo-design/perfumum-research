import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { plants, terroirs } from "../../drizzle/schema";

export const plantTerroirsRouter = router({
  // Récupérer toutes les relations plantes-terroirs
  getAll: publicProcedure.query(async () => {
    // Récupérer toutes les plantes et leurs terroirs
    const plants = await db.getAllPlants();
    const allRelations: Array<{
      plantId: number;
      plantName: string;
      terroirId: number;
      localName?: string;
    }> = [];
    
    for (const plant of plants) {
      const terroirs = await db.getPlantTerroirs(plant.id);
      terroirs.forEach((t: Record<string,unknown>) => {
        allRelations.push({
          plantId: plant.id,
          plantName: plant.name,
          terroirId: t.terroirId as number,
          localName: t.localName as string | undefined,
        });
      });
    }
    
    return allRelations;
  }),
  
  // Récupérer les terroirs d'une plante
  getByPlant: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getPlantTerroirs(input);
    }),
  
  // Récupérer les plantes d'un terroir
  getByTerroir: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return db.getTerroirPlants(input);
    }),
  
  // Ajouter une relation plante-terroir
  create: protectedProcedure
    .input(z.object({
      plantId: z.number(),
      terroirId: z.number(),
      localName: z.string().optional(),
      cultivationStart: z.number().optional(),
      annualProduction: z.string().optional(),
      qualityNotes: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.addPlantTerroir(input);
    }),
  
  // Supprimer une relation plante-terroir
  delete: protectedProcedure
    .input(z.object({
      plantId: z.number(),
      terroirId: z.number(),
    }))
    .mutation(async ({ input }) => {
      return db.removePlantTerroir(input.plantId, input.terroirId);
    }),
  
  // Statistiques pour le graphe de réseau
  getNetworkStats: publicProcedure.query(async () => {
    const plants = await db.getAllPlants();
    let totalRelations = 0;
    const plantsWithTerroirs = new Set<number>();
    const terroirsWithPlants = new Set<number>();
    
    for (const plant of plants) {
      const terroirs = await db.getPlantTerroirs(plant.id);
      if (terroirs.length > 0) {
        plantsWithTerroirs.add(plant.id);
        terroirs.forEach((t: Record<string,unknown>) => {
          terroirsWithPlants.add(t.terroirId as number);
          totalRelations++;
        });
      }
    }
    
    return {
      totalRelations,
      plantsWithTerroirs: plantsWithTerroirs.size,
      terroirsWithPlants: terroirsWithPlants.size,
    };
  }),
  
  // Audit des liaisons existantes
  getAuditStats: publicProcedure.query(async () => {
    return db.getPlantTerroirAuditStats();
  }),
  
  // Toutes les relations avec noms
  getAllWithNames: publicProcedure.query(async () => {
    return db.getAllPlantTerroirRelationsWithNames();
  }),
  
  // Suggestions de liaisons basées sur les origines
  getSuggestions: publicProcedure.query(async () => {
    return db.suggestPlantTerroirLinks();
  }),
  
  // Import en masse depuis CSV
  bulkImport: protectedProcedure
    .input(z.array(z.object({
      plantId: z.number().optional(),
      plantName: z.string().optional(),
      terroirId: z.number().optional(),
      terroirName: z.string().optional(),
      localName: z.string().optional(),
      cultivationStart: z.number().optional(),
      annualProduction: z.string().optional(),
      qualityNotes: z.string().optional(),
      notes: z.string().optional(),
    })))
    .mutation(async ({ input }) => {
      return db.bulkImportPlantTerroirs(input);
    }),
  
  // Création de liaisons multiples (drag-drop)
  createMultiple: protectedProcedure
    .input(z.array(z.object({
      plantId: z.number(),
      terroirId: z.number(),
      localName: z.string().optional(),
      notes: z.string().optional(),
    })))
    .mutation(async ({ input }) => {
      return db.createMultiplePlantTerroirs(input);
    }),
})

