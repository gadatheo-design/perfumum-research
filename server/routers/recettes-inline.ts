import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import * as db from "../db";
import { SQL } from "drizzle-orm";
import { filterRecettesByRadar, getAllRecettesWithRadar, invalidateRadarCache, invalidateRadarCacheForRecette} from "../db-recettes-radar";
import { CACHE_KEYS, CACHE_TTL, invalidateRecetteCache, withCache } from "../cache";

export const recettesInlineRouter = router({
  list: publicProcedure
    .input(z.object({
      category: z.enum(["tabac", "resine", "resine_cbd", "cone", "parfum", "encens", "extrait"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      if (input?.category) {
        // Cache par catégorie
        return await withCache(
          `recettes:category:${input.category}`,
          () => db.getRecettesByCategory(input.category!),
          CACHE_TTL.MEDIUM
        );
      }
      return await withCache(
        CACHE_KEYS.RECETTES_LIST,
        () => db.getAllRecettes(),
        CACHE_TTL.MEDIUM
      );
    }),
  getById: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await withCache(
        CACHE_KEYS.RECETTE_DETAIL(input),
        () => db.getRecetteById(input),
        CACHE_TTL.MEDIUM
      );
    }),
  getMolecules: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getRecetteMolecules(input);
    }),
  getAllWithMolecules: publicProcedure
    .query(async () => {
      return await db.getAllRecettesWithMolecules();
    }),
  getWithMoleculesForCompare: publicProcedure
    .input(z.object({ recetteIds: z.array(z.number()) }))
    .query(async ({ input }) => {
      return await db.getAllRecettesWithMoleculesForCompare(input.recetteIds);
    }),
  getVariations: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getRecetteVariations(input);
    }),
  getParent: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getRecetteParent(input);
    }),
  
  getFormulesReference: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    })
    .query(async ({ input }) => {
      return await db.getRecetteFormulesReference(input);
    }),
  
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      category: z.enum(["tabac", "resine", "resine_cbd", "cone", "parfum", "encens", "extrait"]),
      familyId: z.number().optional(),
      accordId: z.number().optional(),
      tabacId: z.number().optional(),
      civilisationId: z.number().optional(),
      description: z.string().optional(),
      ingredients: z.string().optional(),
      formula: z.string().optional(),
      protocol: z.string().optional(),
      notes: z.string().optional(),
      texture: z.string().optional(),
      intensity: z.number().min(1).max(10).optional(),
      stability: z.enum(["low", "medium", "high"]).optional(),
      combustionTemperature: z.number().optional(),
      maturationTime: z.number().optional(),
      costEstimate: z.number().optional(),
      productionTime: z.number().optional(),
      status: z.enum(["experimental", "testing", "validated", "production"]).optional(),
      notesTete: z.string().optional(),
      notesCoeur: z.string().optional(),
      notesFond: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await db.createRecette(input);
      invalidateRecetteCache();
      invalidateRadarCache();
      return result;
    }),
  
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      category: z.enum(["tabac", "resine", "resine_cbd", "cone", "parfum", "encens", "extrait"]).optional(),
      familyId: z.number().optional().nullable(),
      accordId: z.number().optional().nullable(),
      tabacId: z.number().optional().nullable(),
      civilisationId: z.number().optional().nullable(),
      description: z.string().optional().nullable(),
      ingredients: z.string().optional().nullable(),
      formula: z.string().optional().nullable(),
      protocol: z.string().optional().nullable(),
      notes: z.string().optional().nullable(),
      texture: z.string().optional().nullable(),
      intensity: z.number().min(1).max(10).optional().nullable(),
      stability: z.enum(["low", "medium", "high"]).optional().nullable(),
      combustionTemperature: z.number().optional().nullable(),
      maturationTime: z.number().optional().nullable(),
      costEstimate: z.number().optional().nullable(),
      productionTime: z.number().optional().nullable(),
      status: z.enum(["experimental", "testing", "validated", "production"]).optional(),
      notesTete: z.string().optional().nullable(),
      notesCoeur: z.string().optional().nullable(),
      notesFond: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const result = await db.updateRecette(id, data);
      invalidateRecetteCache(id);
      invalidateRadarCache();
      return result;
    }),
  
  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      const result = await db.deleteRecette(input);
      invalidateRecetteCache();
      invalidateRadarCache();
      return result;
    }),
  
  // Enrichir les associations molécules-recettes pour une gamme
  enrichGamme: publicProcedure
    .input(z.object({
      gamme: z.enum(['volcanique', 'glaciaire', 'biolab', 'petrichor']),
    }))
    .mutation(async ({ input }) => {
      return await db.enrichGammeAssociations(input.gamme);
    }),
  
  // Ajouter une association molécule-recette
  addMoleculeAssociation: publicProcedure
    .input(z.object({
      recetteId: z.number(),
      moleculeId: z.number(),
      proportion: z.number().min(0).max(100),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await db.insertMoleculeRecetteAssociation(
        input.recetteId,
        input.moleculeId,
        input.proportion,
        input.notes
      );
      // Invalider uniquement le cache radar de cette recette (invalidation sélective)
      invalidateRadarCacheForRecette(input.recetteId);
      return result;
    }),
  
  // Récupérer les recettes sans associations pour une gamme
  getWithoutMolecules: publicProcedure
    .input(z.object({
      gamme: z.enum(['volcanique', 'glaciaire', 'biolab', 'petrichor']),
    }))
    .query(async ({ input }) => {
      return await db.getRecettesWithoutMoleculesByGamme(input.gamme);
    }),
  
  // Récupérer les TerpProfiles liés à une recette
  getTerpProfiles: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getTerpProfilesForRecette(input);
    }),
  
  // Récupérer les recettes TL avec leurs TerpProfiles
  getTLWithTerpProfiles: publicProcedure
    .query(async () => {
      return await db.getRecettesTLWithTerpProfiles();
    }),
  
  // Récupérer les recettes contenant une molécule donnée (par nom)
  getByMoleculeName: publicProcedure
    .input(z.object({
      moleculeName: z.string().min(1),
      limit: z.number().optional().default(8),
    }))
    .query(async ({ input }) => {
      return await db.getRecettesByMoleculeName(input.moleculeName, input.limit);
    }),

  // Liste des recettes avec profil radar moyen calculé
  listWithRadar: publicProcedure
    .input(z.object({
      intensityMin: z.number().optional(),
      intensityMax: z.number().optional(),
      freshnessMin: z.number().optional(),
      freshnessMax: z.number().optional(),
      warmthMin: z.number().optional(),
      warmthMax: z.number().optional(),
      sweetnessMin: z.number().optional(),
      sweetnessMax: z.number().optional(),
      spicinessMin: z.number().optional(),
      spicinessMax: z.number().optional(),
      earthinessMin: z.number().optional(),
      earthinessMax: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      const recettes = await getAllRecettesWithRadar();
      if (input) {
        return filterRecettesByRadar(recettes, input);
      }
      return recettes;
    }),
});
