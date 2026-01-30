import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import {
  getAllPlantVarieties,
  getPlantVarietiesByPlant,
  getPlantVarietyById,
  createPlantVariety,
  updatePlantVariety,
  deletePlantVariety,
  getAllTerroirs,
  getTerroirsByCountry,
  getTerroirById,
  createTerroir,
  updateTerroir,
  deleteTerroir,
  getAllExtractionMethods,
  getExtractionMethodById,
  createExtractionMethod,
  updateExtractionMethod,
  deleteExtractionMethod,
  getAllPlantAnalyses,
  getPlantAnalysesByPlant,
  getPlantAnalysisById,
  createPlantAnalysis,
  updatePlantAnalysis,
  deletePlantAnalysis,
  getAllPlantSamples,
  getPlantSamplesByPlant,
  getPlantSampleById,
  createPlantSample,
  updatePlantSample,
  deletePlantSample,
  getAllExtendedSuppliers,
  getExtendedSupplierById,
  createExtendedSupplier,
  updateExtendedSupplier,
  deleteExtendedSupplier,
  getPlantStatistics,
  getPlantWithFullDetails,
  searchPlantsByMolecule,
  searchPlantsByTerroir,
} from "./db";
import { getAllRecettesWithRadar, filterRecettesByRadar, type RadarFilters } from "./db-recettes-radar";
import { getSimilarRecettes, getSimilarMolecules, getRecommendedRecettesFromFavorites } from "./db-recommendations";
import { koppenRouter } from "./routers/koppen";
import { tobaccoRouter } from "./routers/tobacco";
import { researchRouter } from "./routers/research";
import { rawMaterialsRouter, suppliersRouter } from "./routers/raw-materials";
import { 
  withCache, 
  CACHE_KEYS, 
  CACHE_TTL, 
  invalidateMoleculeCache, 
  invalidatePlantCache, 
  invalidateRecetteCache 
} from "./cache";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Prototypes
  prototypes: router({
    list: publicProcedure.query(async () => {
      return await db.getAllPrototypes();
    }),
    getByCode: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "string") throw new Error("Expected string");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getPrototypeByCode(input);
      }),
  }),

  // Families
  families: router({
    list: publicProcedure.query(async () => {
      return await db.getAllFamilies();
    }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getFamilyById(input);
      }),
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        type: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createFamily(input);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateFamilyFull(id, data);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteFamily(input);
      }),
  }),

  // Laboratoire (Matières Premières)
  laboratoire: router({
    list: publicProcedure.query(async () => {
      return await db.getAllMatieres();
    }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getMatiereById(input);
      }),
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        botanicalName: z.string().optional(),
        type: z.enum(["huile_essentielle", "absolu", "resinoid", "concrete", "co2", "teinture", "poudre", "alcoolat", "autre"]),
        olfactiveFamily: z.string().optional(),
        note: z.enum(["tete", "coeur", "fond", "tete_coeur", "coeur_fond"]).optional(),
        origin: z.string().optional(),
        extractionMethod: z.enum(["distillation", "extraction_solvant", "co2_supercritique", "expression", "teinture", "autre"]).optional(),
        olfactiveProfile: z.string().optional(),
        character: z.string().optional(),
        supplier: z.string().optional(),
        pricePerMl: z.number().optional(),
        stock: z.number().optional(),
        status: z.enum(["en_stock", "a_commander", "epuise"]).optional(),
        technicalNotes: z.string().optional(),
        manipulationNotes: z.string().optional(),
        maxTemperature: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createMatiere(input);
      }),
    updateStock: publicProcedure
      .input(z.object({
        id: z.number(),
        stock: z.number(),
        status: z.enum(["en_stock", "a_commander", "epuise"]).optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateMatiereStock(input.id, input.stock, input.status);
        return { success: true };
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        botanicalName: z.string().optional(),
        type: z.enum(["huile_essentielle", "absolu", "resinoid", "concrete", "co2", "teinture", "poudre", "alcoolat", "autre"]).optional(),
        olfactiveFamily: z.string().optional(),
        note: z.enum(["tete", "coeur", "fond", "tete_coeur", "coeur_fond"]).optional(),
        origin: z.string().optional(),
        extractionMethod: z.enum(["distillation", "extraction_solvant", "co2_supercritique", "expression", "teinture", "autre"]).optional(),
        olfactiveProfile: z.string().optional(),
        character: z.string().optional(),
        supplier: z.string().optional(),
        pricePerMl: z.number().optional(),
        stock: z.number().optional(),
        status: z.enum(["en_stock", "a_commander", "epuise"]).optional(),
        technicalNotes: z.string().optional(),
        manipulationNotes: z.string().optional(),
        maxTemperature: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateMatiereFull(id, data);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteMatiere(input);
      }),
  }),

  // Molecules (avec cache pour optimisation)
  molecules: router({
    list: publicProcedure.query(async () => {
      return await withCache(
        CACHE_KEYS.MOLECULES_LIST,
        () => db.getAllMolecules(),
        CACHE_TTL.MEDIUM
      );
    }),
    
    getSimilar: publicProcedure
      .input(z.object({
        id: z.number(),
        limit: z.number().default(3),
      }))
      .query(async ({ input }) => {
        return await db.getSimilarMolecules(input.id, input.limit);
      }),
    
    getUsageStats: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getMoleculeUsageStats(input);
      }),
    getGlobalStats: publicProcedure.query(async () => {
      return await db.getGlobalMoleculeStats();
    }),
    getTimelineData: publicProcedure.query(async () => {
      return await db.getMoleculeTimelineData();
    }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await withCache(
          CACHE_KEYS.MOLECULE_DETAIL(input),
          () => db.getMoleculeById(input),
          CACHE_TTL.MEDIUM
        );
      }),
    create: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Expected object");
        return val as any;
      })
      .mutation(async ({ input }) => {
        const result = await db.createMolecule(input);
        invalidateMoleculeCache(); // Invalider le cache après création
        return result;
      }),
    updateRadar: publicProcedure
      .input(z.object({
        id: z.number(),
        radarIntensity: z.number().min(0).max(100),
        radarFreshness: z.number().min(0).max(100),
        radarWarmth: z.number().min(0).max(100),
        radarSweetness: z.number().min(0).max(100),
        radarSpiciness: z.number().min(0).max(100),
        radarEarthiness: z.number().min(0).max(100),
      }))
      .mutation(async ({ input }) => {
        const result = await db.updateMoleculeRadar(input);
        invalidateMoleculeCache(input.id); // Invalider le cache après mise à jour
        return result;
      }),
    // Recherche de molécules par nom
    search: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        const allMolecules = await db.getAllMolecules();
        const queryLower = input.query.toLowerCase();
        // Recherche par nom (correspondance partielle)
        const matches = allMolecules.filter(m => 
          m.name.toLowerCase().includes(queryLower) ||
          (m.chemicalFormula && m.chemicalFormula.toLowerCase().includes(queryLower))
        ).slice(0, input.limit);
        return { molecules: matches, total: matches.length };
      }),
    // Suggestions par profil radar
    getSuggestionsByRadar: publicProcedure
      .input(z.object({
        radarIntensity: z.number().min(0).max(100),
        radarFreshness: z.number().min(0).max(100),
        radarWarmth: z.number().min(0).max(100),
        radarSweetness: z.number().min(0).max(100),
        radarSpiciness: z.number().min(0).max(100),
        radarEarthiness: z.number().min(0).max(100),
        limit: z.number().min(1).max(50).default(10),
      }))
      .query(async ({ input }) => {
        const allMolecules = await db.getAllMolecules();
        
        // Calculer la distance euclidienne pour chaque molécule
        const moleculesWithScore = allMolecules.map(m => {
          const diff1 = (m.radarIntensity || 50) - input.radarIntensity;
          const diff2 = (m.radarFreshness || 50) - input.radarFreshness;
          const diff3 = (m.radarWarmth || 50) - input.radarWarmth;
          const diff4 = (m.radarSweetness || 50) - input.radarSweetness;
          const diff5 = (m.radarSpiciness || 50) - input.radarSpiciness;
          const diff6 = (m.radarEarthiness || 50) - input.radarEarthiness;
          
          const distance = Math.sqrt(
            diff1 * diff1 +
            diff2 * diff2 +
            diff3 * diff3 +
            diff4 * diff4 +
            diff5 * diff5 +
            diff6 * diff6
          );
          
          // Distance maximale théorique : sqrt(6 * 100^2) = ~244.95
          // Score de compatibilité : 100% si distance = 0, 0% si distance = 244.95
          const maxDistance = Math.sqrt(6 * 100 * 100);
          const compatibilityScore = Math.round((1 - distance / maxDistance) * 100);
          
          return {
            ...m,
            compatibilityScore,
          };
        });
        
        // Trier par score décroissant et limiter
        const sorted = moleculesWithScore
          .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
          .slice(0, input.limit);
        
        return sorted;
      }),
    updateReferences: publicProcedure
      .input(z.object({
        id: z.number(),
        references: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateMoleculeReferences(input.id, input.references);
      }),
    
    // Liaison molécules-recettes
    linkToRecette: publicProcedure
      .input(z.object({
        recetteId: z.number(),
        molecules: z.array(z.object({
          moleculeId: z.number(),
          proportion: z.number(),
          role: z.enum(["tête", "cœur", "fond"]),
        })),
      }))
      .mutation(async ({ input }) => {
        return await db.linkMoleculesToRecette(input.recetteId, input.molecules);
      }),
    
    getByRecette: publicProcedure
      .input(z.object({
        recetteId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getMoleculesByRecette(input.recetteId);
      }),
    
    getAll: publicProcedure.query(async () => {
      return await db.getAllMolecules();
    }),
    
    // Audit des liaisons molécule-recette
    getRecetteAuditStats: publicProcedure.query(async () => {
      return db.getMoleculeRecetteAuditStats();
    }),
    
    // Toutes les relations avec noms
    getAllRecetteRelationsWithNames: publicProcedure.query(async () => {
      return db.getAllMoleculeRecetteRelationsWithNames();
    }),
    
    // Suggestions de liaisons
    getRecetteSuggestions: publicProcedure.query(async () => {
      return db.suggestMoleculeRecetteLinks();
    }),
    
    // Import en masse depuis CSV
    bulkImportRecettes: protectedProcedure
      .input(z.array(z.object({
        moleculeId: z.number().optional(),
        moleculeName: z.string().optional(),
        recetteId: z.number().optional(),
        recetteName: z.string().optional(),
        proportion: z.number().optional(),
        role: z.string().optional(),
        notes: z.string().optional(),
      })))
      .mutation(async ({ input }) => {
        return db.bulkImportMoleculeRecettes(input);
      }),
    
    // Création de liaisons multiples (drag-drop)
    createMultipleRecettes: protectedProcedure
      .input(z.array(z.object({
        moleculeId: z.number(),
        recetteId: z.number(),
        proportion: z.number().optional(),
        role: z.string().optional(),
        notes: z.string().optional(),
      })))
      .mutation(async ({ input }) => {
        return db.createMultipleMoleculeRecettes(input);
      }),
    
    // Gènes TPS (Terpene Synthases) associés à une molécule
    getTpsGenes: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getTpsGenesByMolecule(input);
      }),
    
    // Transformations pyrolytiques d'une molécule
    getPyrolysisTransformations: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getPyrolysisTransformationsByMolecule(input);
      }),
    
    // Produits de pyrolyse d'une molécule
    getPyrolysisProducts: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getPyrolysisTransformationsByProduct(input);
      }),
  }),

  // Terpene Synergies
  terpeneSynergies: router({
    listAll: publicProcedure.query(async () => {
      return await db.getAllTerpeneSynergies();
    }),
    getByPair: publicProcedure
      .input(z.object({
        terpene1Id: z.number(),
        terpene2Id: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getTerpeneSynergyByPair(input.terpene1Id, input.terpene2Id);
      }),
  }),

  // Accords
  accords: router({
    list: publicProcedure.query(async () => {
      return await db.getAllAccords();
    }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getAccordById(input);
      }),
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        familyId: z.number().nullable().optional(),
        olfactiveProfile: z.string().optional(),
        emotionalResonance: z.string().optional(),
        texture: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createAccord(input);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        familyId: z.number().nullable().optional(),
        olfactiveProfile: z.string().optional(),
        emotionalResonance: z.string().optional(),
        texture: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateAccordFull(id, data);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteAccord(input);
      }),
  }),

  // Recettes (avec cache pour optimisation)
  recettes: router({
    list: publicProcedure
      .input(z.object({
        category: z.enum(["tabac", "resine", "resine_cbd", "cone", "parfum", "encens", "extrait"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        if (input?.category) {
          // Cache par catégorie
          return await withCache(
            `recettes:category:${input.category}`,
            () => db.getRecettesByCategory(input.category),
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
        return await db.createRecette(input);
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
        return await db.updateRecette(id, data);
      }),
    
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteRecette(input);
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
        return await db.insertMoleculeRecetteAssociation(
          input.recetteId,
          input.moleculeId,
          input.proportion,
          input.notes
        );
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
  }),

  // Recommandations
  recommendations: router({
    similarRecettes: publicProcedure
      .input(z.object({
        recetteId: z.number(),
        limit: z.number().optional().default(5),
      }))
      .query(async ({ input }) => {
        return await getSimilarRecettes(input.recetteId, input.limit);
      }),
    similarMolecules: publicProcedure
      .input(z.object({
        moleculeId: z.number(),
        limit: z.number().optional().default(5),
      }))
      .query(async ({ input }) => {
        return await getSimilarMolecules(input.moleculeId, input.limit);
      }),
    fromFavorites: publicProcedure
      .input(z.object({
        favoriteMoleculeIds: z.array(z.number()),
        limit: z.number().optional().default(10),
      }))
      .query(async ({ input }) => {
        return await getRecommendedRecettesFromFavorites(input.favoriteMoleculeIds, input.limit);
      }),
  }),

  // Civilisations
  civilisations: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCivilisations();
    }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getCivilisationById(input);
      }),
  }),

  // Installations
  installations: router({
    list: publicProcedure.query(async () => {
      return await db.getAllInstallations();
    }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getInstallationById(input);
      }),
  }),

  // Petrichor
  petrichor: router({
    list: publicProcedure.query(async () => {
      return await db.getAllPetrichor();
    }),
  }),

  // Volcanique
  volcanique: router({
    list: publicProcedure.query(async () => {
      return await db.getAllVolcanique();
    }),
  }),

  // Tabacs
  tabacs: router({
    list: publicProcedure.query(async () => {
      return await db.getAllTabacs();
    }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getTabacById(input);
      }),
    getSuggestions: publicProcedure
      .input(z.object({
        olfactiveProfile: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.getTabacsByProfile(input.olfactiveProfile);
      }),
  }),

  // Formulation
  formulation: router({
    calculateDilution: publicProcedure
      .input(z.object({
        moleculeName: z.string(),
        targetConcentration: z.number(), // %
        finalVolume: z.number(), // mL
        stockConcentration: z.number().optional(), // % (default 100%)
      }))
      .mutation(async ({ input }) => {
        const stockConc = input.stockConcentration || 100;
        const volumeStock = (input.targetConcentration / stockConc) * input.finalVolume;
        const volumeSolvent = input.finalVolume - volumeStock;
        
        return {
          moleculeName: input.moleculeName,
          targetConcentration: input.targetConcentration,
          finalVolume: input.finalVolume,
          stockConcentration: stockConc,
          volumeStock: Math.round(volumeStock * 100) / 100,
          volumeSolvent: Math.round(volumeSolvent * 100) / 100,
          formula: `${Math.round(volumeStock * 100) / 100} mL stock + ${Math.round(volumeSolvent * 100) / 100} mL solvant = ${input.finalVolume} mL à ${input.targetConcentration}%`,
        };
      }),
  }),

  // Home
  home: router({
    getMoleculeOfTheDay: publicProcedure.query(async () => {
      // Sélection aléatoire basée sur la date du jour
      const today = new Date().toISOString().split('T')[0];
      const seed = today.split('-').join(''); // YYYYMMDD
      const molecules = await db.getAllMolecules();
      if (molecules.length === 0) return null;
      const index = parseInt(seed) % molecules.length;
      return molecules[index];
    }),
    getRecentActivity: publicProcedure.query(async () => {
      // Récupérer les 10 derniers ajouts (molécules, recettes, prototypes)
      const molecules = await db.getAllMolecules();
      const recettes = await db.getAllRecettes();
      
      const activity = [
        ...molecules.slice(0, 5).map(m => ({ type: 'molecule' as const, item: m, date: new Date() })),
        ...recettes.slice(0, 5).map(r => ({ type: 'recette' as const, item: r, date: new Date() })),
      ];
      
      return activity.slice(0, 10);
    }),
  }),

  // Admin
  admin: router({
    getStats: publicProcedure.query(async () => {
      return await db.getAdminStats();
    }),
    enrichMoleculeData: publicProcedure.mutation(async () => {
      return await db.enrichMoleculeData();
    }),
  }),

  // Glossary
  glossary: router({
    list: publicProcedure.query(async () => {
      return await db.getAllGlossaryTerms();
    }),
    search: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "string") throw new Error("Expected string");
        return val;
      })
      .query(async ({ input }) => {
        return await db.searchGlossaryTerms(input);
      }),
    getByCategory: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "string") throw new Error("Expected string");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getGlossaryTermsByCategory(input);
      }),
  }),

  // Timeline
  timeline: router({
    list: publicProcedure.query(async () => {
      return await db.getAllMilestones();
    }),
    getByPhase: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "string") throw new Error("Expected string");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getMilestonesByPhase(input);
      }),
    getByYear: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getMilestonesByYear(input);
      }),
    stats: publicProcedure.query(async () => {
      return await db.getTimelineStats();
    }),
  }),

  // Chemical Families (Enrichi)
  chemicalFamilies: router({
    // Liste toutes les familles chimiques de la table dédiée
    listAll: publicProcedure.query(async () => {
      return await db.getAllChemicalFamilies();
    }),
    // Liste avec comptage des molécules liées
    listWithCount: publicProcedure.query(async () => {
      return await db.getChemicalFamiliesWithMoleculeCount();
    }),
    // Récupérer une famille par ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getChemicalFamilyById(input.id);
      }),
    // Récupérer une famille par type
    getByType: publicProcedure
      .input(z.object({ type: z.string() }))
      .query(async ({ input }) => {
        return await db.getChemicalFamilyByType(input.type);
      }),
    // Récupérer les molécules d'une famille (via table de liaison)
    getMoleculesById: publicProcedure
      .input(z.object({ familyId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMoleculesByChemicalFamilyId(input.familyId);
      }),
    // Récupérer les familles chimiques d'une molécule
    getForMolecule: publicProcedure
      .input(z.object({ moleculeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getChemicalFamiliesForMolecule(input.moleculeId);
      }),
    // Lier une molécule à une famille
    linkMolecule: protectedProcedure
      .input(z.object({ moleculeId: z.number(), chemicalFamilyId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.linkMoleculeToChemicalFamily(input.moleculeId, input.chemicalFamilyId);
      }),
    // Supprimer la liaison molécule-famille
    unlinkMolecule: protectedProcedure
      .input(z.object({ moleculeId: z.number(), chemicalFamilyId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.unlinkMoleculeFromChemicalFamily(input.moleculeId, input.chemicalFamilyId);
      }),
    // Créer une nouvelle famille chimique
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        type: z.string(),
        subcategory: z.string().optional(),
        description: z.string().optional(),
        olfactiveRole: z.string().optional(),
        volatility: z.string().optional(),
        polarity: z.string().optional(),
        molecularWeightRange: z.string().optional(),
        typicalNotes: z.string().optional(),
        exampleMolecules: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createChemicalFamily(input);
      }),
    // Mettre à jour une famille chimique
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z.string().optional(),
        subcategory: z.string().optional(),
        description: z.string().optional(),
        olfactiveRole: z.string().optional(),
        volatility: z.string().optional(),
        polarity: z.string().optional(),
        molecularWeightRange: z.string().optional(),
        typicalNotes: z.string().optional(),
        exampleMolecules: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateChemicalFamily(id, data);
      }),
    // Supprimer une famille chimique
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteChemicalFamily(input.id);
      }),
    // Anciennes fonctions pour compatibilité
    list: publicProcedure.query(async () => {
      return await db.getChemicalFamilies();
    }),
    getMolecules: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "string") throw new Error("Expected string");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getMoleculesByFamily(input);
      }),
    // Récupérer toutes les liaisons molécule-famille chimique (pour graphe)
    getAllLinks: publicProcedure.query(async () => {
      return await db.getAllMoleculeChemicalFamilyLinks();
    }),
    // Export CSV des liaisons
    exportCSV: publicProcedure.query(async () => {
      return await db.exportMoleculeChemicalFamilyLinksCSV();
    }),
    // Export JSON des liaisons
    exportJSON: publicProcedure.query(async () => {
      return await db.exportMoleculeChemicalFamilyLinksJSON();
    }),
  }),

  // Experimental Accords
  absorbeProfiles: router({
    list: publicProcedure.query(async () => {
      return await db.getAbsorbeProfiles();
    }),
    getByPrototypeId: publicProcedure
      .input(z.object({ prototypeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAbsorbeProfileByPrototypeId(input.prototypeId);
      }),
  }),

  experimentalAccords: router({
    list: publicProcedure.query(async () => {
      return await db.getAllExperimentalAccords();
    }),
    getByType: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getExperimentalAccordsByType(input);
      }),
  }),

  // Global Search (avec cache pour optimisation)
  search: router({
    global: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        // Cache les résultats de recherche pendant 1 minute
        return await withCache(
          CACHE_KEYS.SEARCH_GLOBAL(input.query),
          () => db.globalSearch(input.query, input.limit),
          CACHE_TTL.SHORT
        );
      }),
    // Synonymes olfactifs - récupère les synonymes d'un terme
    getSynonyms: publicProcedure
      .input(z.object({ term: z.string() }))
      .query(async ({ input }) => {
        return db.getOlfactiveSynonyms(input.term);
      }),
    // Expansion de requête - étend une requête avec ses synonymes
    expandQuery: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return db.expandOlfactiveSearchQuery(input.query);
      }),
    // Catégorisation - identifie le domaine olfactif d'un terme
    categorizeTerm: publicProcedure
      .input(z.object({ term: z.string() }))
      .query(async ({ input }) => {
        return db.categorizeOlfactiveSearchTerm(input.term);
      }),
    // Statistiques du dictionnaire de synonymes
    getDictionaryStats: publicProcedure
      .query(async () => {
        return db.getOlfactiveDictionaryStats();
      }),
  }),

  // Molecule details
  molecule: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMoleculeWithRelations(input.id);
      }),
    getAllRelationships: publicProcedure
      .query(async () => {
        return await db.getAllMoleculeRecetteRelationships();
      }),
  }),

  // Recette details
  recette: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getRecetteWithRelations(input.id);
      }),
  }),

  // Civilisation details
  civilisation: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCivilisationDetailsWithRelations(input.id);
      }),
  }),

  // Prototype details
  prototype: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPrototypeWithRelations(input.id);
      }),
  }),

  // Network visualization
  network: router({
    getRelationships: publicProcedure.query(async () => {
      return await db.getNetworkRelationships();
    }),
    
    // Nouveau: Réseau molécule-plante-terroir
    getMoleculePlantTerroirNetwork: publicProcedure.query(async () => {
      return await db.getMoleculePlantTerroirNetwork();
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
  }),
  // Dashboard statistics
  dashboard: router({
    getStats: publicProcedure.query(async () => {
      return await db.getDashboardStats();
    }),
    
    getRecipesByStatus: publicProcedure.query(async () => {
      return await db.getRecipesByStatus();
    }),
    
    getRecipesByCategory: publicProcedure.query(async () => {
      return await db.getRecipesByCategory();
    }),
    
    getMoleculesByFamily: publicProcedure.query(async () => {
      return await db.getMoleculesFamilyStats();
    }),
    
    getRecentActivity: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getRecentActivity(input?.limit);
      }),
  }),

  // Synergies Moléculaires
  synergies: router({
    list: publicProcedure.query(async () => {
      return await db.getAllSynergies();
    }),
    
    getAllMoleculeSynergies: publicProcedure.query(async () => {
      return await db.getAllMoleculeSynergies();
    }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getSynergyById(input);
      }),
    
    getByType: publicProcedure
      .input(z.enum(["potentialisation", "stabilisation", "transformation", "masquage"]))
      .query(async ({ input }) => {
        return await db.getSynergiesByType(input);
      }),
    
    getGraphData: publicProcedure.query(async () => {
      return await db.getMoleculeSynergiesGraphData();
    }),
    
    getStats: publicProcedure.query(async () => {
      return await db.getSynergiesStats();
    }),
    
    getSuggestions: publicProcedure
      .input(z.object({
        minSimilarity: z.number().min(0).max(100).optional(),
        limit: z.number().min(1).max(50).optional()
      }).optional())
      .query(async ({ input }) => {
        return await db.getSynergySuggestions(input?.minSimilarity, input?.limit);
      }),
    
    // Nouvelles procédures pour le générateur IA
    getAllForGenerator: publicProcedure.query(async () => {
      return db.getMolecularSynergiesForGenerator();
    }),
    
    getSuggestionsForMolecule: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getSynergySuggestionsForMolecule(input);
      }),
    
    getBetweenMolecules: publicProcedure
      .input(z.object({
        molecule1Id: z.number(),
        molecule2Id: z.number(),
      }))
      .query(async ({ input }) => {
        const allSynergies = await db.getMolecularSynergiesForGenerator();
        
        const terpeneSyn = allSynergies.terpeneSynergies?.find(
          (s: any) => (s.terpene1Id === input.molecule1Id && s.terpene2Id === input.molecule2Id) ||
               (s.terpene2Id === input.molecule1Id && s.terpene1Id === input.molecule2Id)
        );
        
        const molSyn = allSynergies.moleculeSynergies?.find(
          (s: any) => (s.molecule1Id === input.molecule1Id && s.molecule2Id === input.molecule2Id) ||
               (s.molecule2Id === input.molecule1Id && s.molecule1Id === input.molecule2Id)
        );
        
        return {
          terpeneSynergy: terpeneSyn || null,
          moleculeSynergy: molSyn || null,
          hasDocumentedSynergy: !!(terpeneSyn || molSyn),
        };
      }),
    
    // Nouvelles procédures pour la visualisation graphique
    getGraphVisualizationData: publicProcedure.query(async () => {
      return db.getMolecularSynergiesGraphVisualization();
    }),
    
    getSuggestionsForMolecules: publicProcedure
      .input(z.array(z.number()))
      .query(async ({ input }) => {
        return db.getSynergySuggestionsForMolecules(input);
      }),
  }),

  // Favorites
  favorites: router({
    add: publicProcedure
      .input(z.object({ moleculeId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.addFavorite(ctx.user.id, input.moleculeId);
      }),
    
    remove: publicProcedure
      .input(z.object({ moleculeId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.removeFavorite(ctx.user.id, input.moleculeId);
      }),
    
    list: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      return await db.getUserFavorites(ctx.user.id);
    }),
    
    isFavorite: publicProcedure
      .input(z.object({ moleculeId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) return false;
        return await db.isFavorite(ctx.user.id, input.moleculeId);
      }),
  }),

  // Milestones
  milestones: router({
    list: publicProcedure.query(async () => {
      return await db.getMilestones();
    }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getMilestoneById(input);
      }),
    
    create: publicProcedure
      .input(z.object({
        date: z.date(),
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        type: z.enum(["prototype", "discovery", "collaboration", "publication", "other"]),
        moleculeId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.createMilestone({
          ...input,
          userId: ctx.user.id,
        });
      }),
    
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        date: z.date().optional(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        type: z.enum(["prototype", "discovery", "collaboration", "publication", "other"]).optional(),
        moleculeId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        const { id, ...data } = input;
        return await db.updateMilestone(id, data);
      }),
    
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.deleteMilestone(input);
      }),
  }),

  // ============================================================================
  // PHASE 4: COLLABORATION & PARTAGE - tRPC Procedures
  // ============================================================================

  // Shared Collections
  sharedCollections: router({
    create: publicProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        moleculeIds: z.array(z.number()),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        
        // Generate unique token
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // Expires in 24 hours
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        
        return await db.createSharedCollection({
          token,
          title: input.title,
          description: input.description,
          moleculeIds: input.moleculeIds,
          creatorId: ctx.user.id,
          expiresAt,
        });
      }),
    
    getByToken: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getSharedCollectionByToken(input);
      }),
    
    listMine: publicProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.getUserSharedCollections(ctx.user.id);
      }),
  }),

  // Molecule Notes
  moleculeNotes: router({
    get: publicProcedure
      .input(z.number()) // moleculeId
      .query(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.getMoleculeNote(ctx.user.id, input);
      }),
    
    upsert: publicProcedure
      .input(z.object({
        moleculeId: z.number(),
        note: z.string(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.upsertMoleculeNote({
          userId: ctx.user.id,
          moleculeId: input.moleculeId,
          note: input.note,
          tags: input.tags,
        });
      }),
    
    listMine: publicProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.getUserMoleculeNotes(ctx.user.id);
      }),
    
    delete: publicProcedure
      .input(z.number()) // moleculeId
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.deleteMoleculeNote(ctx.user.id, input);
      }),
  }),

  // User Notes
  notes: router({
    create: publicProcedure
      .input(z.object({
        entityType: z.string(),
        entityId: z.number(),
        content: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.createUserNote(input.entityType, input.entityId, input.content);
      }),
    
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        content: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateUserNote(input.id, input.content);
      }),
    
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteUserNote(input);
      }),
    
    getByEntity: publicProcedure
      .input(z.object({
        entityType: z.string(),
        entityId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getUserNoteByEntity(input.entityType, input.entityId);
      }),
    
    search: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.searchUserNotes(input);
      }),
  }),

  // Citations
  citations: router({
    generate: publicProcedure
      .input(z.object({
        entityType: z.enum(["molecule", "recipe", "prototype", "accord"]),
        entityId: z.number(),
        format: z.enum(["apa", "mla", "chicago", "bibtex"]).default("apa"),
      }))
      .mutation(async ({ input }) => {
        return await db.generateCitation(
          input.entityType,
          input.entityId,
          input.format
        );
      }),
    
    get: publicProcedure
      .input(z.object({
        entityType: z.string(),
        entityId: z.number(),
        format: z.string().default("apa"),
      }))
      .query(async ({ input }) => {
        return await db.getCitation(
          input.entityType,
          input.entityId,
          input.format
        );
      }),
  }),

  // Analytics
  analytics: router({
    getStatistics: publicProcedure.query(async () => {
      const molecules = await db.getAllMolecules();
      const recettes = await db.getAllRecettes();
      
      // Distribution familles chimiques
      const familyDistribution: Record<string, number> = {};
      molecules.forEach(m => {
        if (m.family) {
          familyDistribution[m.family] = (familyDistribution[m.family] || 0) + 1;
        }
      });
      
      // Top 10 molécules (par ordre alphabétique pour l'instant)
      const topMolecules = molecules
        .slice(0, 10)
        .map(molecule => ({
          molecule,
          views: Math.floor(Math.random() * 100) + 1 // Simulé pour l'instant
        }));
      
      // Évolution mensuelle (simulée pour l'instant)
      const monthlyData = [
        { month: 'Jan', molecules: 15, recettes: 18 },
        { month: 'Fév', molecules: 22, recettes: 25 },
        { month: 'Mar', molecules: 31, recettes: 34 },
        { month: 'Avr', molecules: 45, recettes: 48 },
        { month: 'Mai', molecules: 67, recettes: 72 },
        { month: 'Juin', molecules: 89, recettes: 95 },
        { month: 'Juil', molecules: 105, recettes: 112 },
        { month: 'Août', molecules: 118, recettes: 128 },
        { month: 'Sep', molecules: 125, recettes: 136 },
        { month: 'Oct', molecules: 129, recettes: 140 },
        { month: 'Nov', molecules: 131, recettes: 142 },
        { month: 'Déc', molecules: 131, recettes: 142 },
      ];
      
      return {
        familyDistribution,
        topMolecules,
        monthlyData,
        totalMolecules: molecules.length,
        totalRecettes: recettes.length,
      };
    }),
    
    trackEvent: publicProcedure
      .input(z.object({
        eventType: z.enum(['molecule_view', 'recipe_view', 'terpene_view', 'pdf_export', 'favorite_add', 'favorite_remove', 'search_query']),
        entityType: z.string().optional(),
        entityId: z.number().optional(),
        metadata: z.any().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.trackEvent(
          input.eventType,
          input.entityType,
          input.entityId,
          ctx.user?.id,
          input.metadata
        );
        return { success: true };
      }),

    getMostViewedMolecules: publicProcedure
      .input(z.object({
        days: z.number().default(30),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        return await db.getMostViewedMolecules(input.days, input.limit);
      }),

    getMostViewedRecipes: publicProcedure
      .input(z.object({
        days: z.number().default(30),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        return await db.getMostViewedRecipes(input.days, input.limit);
      }),

    getActivityTimeline: publicProcedure
      .input(z.object({
        days: z.number().default(30),
      }))
      .query(async ({ input }) => {
        return await db.getActivityTimeline(input.days);
      }),

    getPopularSearches: publicProcedure
      .input(z.object({
        days: z.number().default(30),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        return await db.getPopularSearches(input.days, input.limit);
      }),

    getDashboardStats: publicProcedure
      .input(z.object({
        days: z.number().default(30),
      }))
      .query(async ({ input }) => {
        return await db.getAnalyticsDashboardStats(input.days);
      }),
  }),

  // Export CSV
  export: router({
    molecules: publicProcedure.query(async () => {
      const molecules = await db.getAllMolecules();
      const { objectsToCSV } = await import('./csv-utils');
      return objectsToCSV(molecules);
    }),

    recettes: publicProcedure.query(async () => {
      const recettes = await db.getAllRecettes();
      const { objectsToCSV } = await import('./csv-utils');
      return objectsToCSV(recettes);
    }),

    accords: publicProcedure.query(async () => {
      const accords = await db.getAllAccords();
      const { objectsToCSV } = await import('./csv-utils');
      return objectsToCSV(accords);
    }),

    familles: publicProcedure.query(async () => {
      const familles = await db.getAllFamilies();
      const { objectsToCSV } = await import('./csv-utils');
      return objectsToCSV(familles);
    }),

    matieres: publicProcedure.query(async () => {
      const matieres = await db.getAllMatieres();
      const { objectsToCSV } = await import('./csv-utils');
      return objectsToCSV(matieres);
    }),
  }),

  // Import CSV
  import: router({
    // Validate and preview CSV data before import
    validateCSV: publicProcedure
      .input(z.object({
        entityType: z.enum(["molecules", "recettes", "accords", "familles", "matieres"]),
        csvData: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects, parseValue } = await import('./csv-utils');
        
        try {
          let parsedData: any[] = [];
          let errors: string[] = [];
          
          switch (input.entityType) {
            case "molecules":
              parsedData = csvToObjects(input.csvData, (row) => ({
                nom: row.nom || null,
                formule: row.formule || null,
                masseMoleculaire: parseValue(row.masseMoleculaire, "number"),
                pointEbullition: parseValue(row.pointEbullition, "number"),
                familleChimique: row.familleChimique || null,
                description: row.description || null,
                noteOlfactive: row.noteOlfactive || null,
                intensite: parseValue(row.intensite, "number"),
                tenacite: parseValue(row.tenacite, "number"),
                diffusion: parseValue(row.diffusion, "number"),
                gamme: row.gamme || null,
              }));
              
              // Validate required fields
              parsedData.forEach((item, index) => {
                if (!item.nom) errors.push(`Ligne ${index + 2}: nom requis`);
              });
              break;
              
            case "recettes":
              parsedData = csvToObjects(input.csvData, (row) => ({
                nom: row.nom || null,
                description: row.description || null,
                gamme: row.gamme || null,
                notes: row.notes || null,
                dateCreation: parseValue(row.dateCreation, "date"),
              }));
              
              parsedData.forEach((item, index) => {
                if (!item.nom) errors.push(`Ligne ${index + 2}: nom requis`);
              });
              break;
              
            case "accords":
              parsedData = csvToObjects(input.csvData, (row) => ({
                nom: row.nom || null,
                description: row.description || null,
                familleId: parseValue(row.familleId, "number"),
              }));
              
              parsedData.forEach((item, index) => {
                if (!item.nom) errors.push(`Ligne ${index + 2}: nom requis`);
              });
              break;
              
            case "familles":
              parsedData = csvToObjects(input.csvData, (row) => ({
                nom: row.nom || null,
                description: row.description || null,
              }));
              
              parsedData.forEach((item, index) => {
                if (!item.nom) errors.push(`Ligne ${index + 2}: nom requis`);
              });
              break;
              
            case "matieres":
              parsedData = csvToObjects(input.csvData, (row) => ({
                nom: row.nom || null,
                type: row.type || null,
                origine: row.origine || null,
                fournisseur: row.fournisseur || null,
                quantite: parseValue(row.quantite, "number"),
                unite: row.unite || null,
                prixUnitaire: parseValue(row.prixUnitaire, "number"),
                dateAchat: parseValue(row.dateAchat, "date"),
                notes: row.notes || null,
              }));
              
              parsedData.forEach((item, index) => {
                if (!item.nom) errors.push(`Ligne ${index + 2}: nom requis`);
              });
              break;
          }
          
          return {
            success: errors.length === 0,
            data: parsedData,
            errors,
            rowCount: parsedData.length,
          };
        } catch (error) {
          return {
            success: false,
            data: [],
            errors: [`Erreur de parsing CSV: ${error instanceof Error ? error.message : 'Erreur inconnue'}`],
            rowCount: 0,
          };
        }
      }),

    // Import molecules from CSV
    molecules: publicProcedure
      .input(z.object({
        csvData: z.string(),
        mode: z.enum(["create", "update", "upsert"]).default("create"),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects, parseValue } = await import('./csv-utils');
        
        const parsedData = csvToObjects(input.csvData, (row) => ({
          nom: row.nom || null,
          formule: row.formule || null,
          masseMoleculaire: parseValue(row.masseMoleculaire, "number"),
          pointEbullition: parseValue(row.pointEbullition, "number"),
          familleChimique: row.familleChimique || null,
          description: row.description || null,
          noteOlfactive: row.noteOlfactive || null,
          intensite: parseValue(row.intensite, "number"),
          tenacite: parseValue(row.tenacite, "number"),
          diffusion: parseValue(row.diffusion, "number"),
          gamme: row.gamme || null,
        }));
        
        let created = 0;
        let updated = 0;
        let errors: string[] = [];
        
        for (const item of parsedData) {
          try {
            if (!item.nom) {
              errors.push(`Molécule sans nom ignorée`);
              continue;
            }
            
            if (input.mode === "create") {
              await db.createMolecule(item);
              created++;
            } else if (input.mode === "update" || input.mode === "upsert") {
              // Check if molecule exists by name
              const existing = await db.getMoleculeByName(item.nom);
              
              if (existing) {
                await db.updateMolecule(existing.id, item);
                updated++;
              } else if (input.mode === "upsert") {
                await db.createMolecule(item);
                created++;
              } else {
                errors.push(`Molécule "${item.nom}" introuvable pour mise à jour`);
              }
            }
          } catch (error) {
            errors.push(`Erreur pour "${item.nom}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          }
        }
        
        return {
          success: errors.length === 0,
          created,
          updated,
          errors,
        };
      }),

    // Import recettes from CSV
    recettes: publicProcedure
      .input(z.object({
        csvData: z.string(),
        mode: z.enum(["create", "update", "upsert"]).default("create"),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects, parseValue } = await import('./csv-utils');
        
        const parsedData = csvToObjects(input.csvData, (row) => ({
          nom: row.nom || null,
          description: row.description || null,
          gamme: row.gamme || null,
          notes: row.notes || null,
          dateCreation: parseValue(row.dateCreation, "date"),
        }));
        
        let created = 0;
        let updated = 0;
        let errors: string[] = [];
        
        for (const item of parsedData) {
          try {
            if (!item.nom) {
              errors.push(`Recette sans nom ignorée`);
              continue;
            }
            
            // Mapper les données CSV vers le format attendu par createRecette
            const recetteData = {
              name: item.nom,
              category: "tabac" as const,
              description: item.description || undefined,
              notes: item.notes || undefined,
            };
            
            if (input.mode === "create") {
              await db.createRecette(recetteData);
              created++;
            } else if (input.mode === "update" || input.mode === "upsert") {
              const existing = await db.getRecetteByName(item.nom);
              
              if (existing) {
                await db.updateRecette(existing.id, {
                  name: item.nom,
                  description: item.description,
                  notes: item.notes,
                });
                updated++;
              } else if (input.mode === "upsert") {
                await db.createRecette(recetteData);
                created++;
              } else {
                errors.push(`Recette "${item.nom}" introuvable pour mise à jour`);
              }
            }
          } catch (error) {
            errors.push(`Erreur pour "${item.nom}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          }
        }
        
        return {
          success: errors.length === 0,
          created,
          updated,
          errors,
        };
      }),

    // Import accords from CSV
    accords: publicProcedure
      .input(z.object({
        csvData: z.string(),
        mode: z.enum(["create", "update", "upsert"]).default("create"),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects, parseValue } = await import('./csv-utils');
        
        const parsedData = csvToObjects(input.csvData, (row) => ({
          nom: row.nom || null,
          description: row.description || null,
          familleId: parseValue(row.familleId, "number"),
        }));
        
        let created = 0;
        let updated = 0;
        let errors: string[] = [];
        
        for (const item of parsedData) {
          try {
            if (!item.nom) {
              errors.push(`Accord sans nom ignoré`);
              continue;
            }
            
            if (input.mode === "create") {
              await db.createAccord(item);
              created++;
            } else if (input.mode === "update" || input.mode === "upsert") {
              const existing = await db.getAccordByName(item.nom);
              
              if (existing) {
                await db.updateAccord(existing.id, item);
                updated++;
              } else if (input.mode === "upsert") {
                await db.createAccord(item);
                created++;
              } else {
                errors.push(`Accord "${item.nom}" introuvable pour mise à jour`);
              }
            }
          } catch (error) {
            errors.push(`Erreur pour "${item.nom}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          }
        }
        
        return {
          success: errors.length === 0,
          created,
          updated,
          errors,
        };
      }),

    // Import familles from CSV
    familles: publicProcedure
      .input(z.object({
        csvData: z.string(),
        mode: z.enum(["create", "update", "upsert"]).default("create"),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects } = await import('./csv-utils');
        
        const parsedData = csvToObjects(input.csvData, (row) => ({
          nom: row.nom || null,
          description: row.description || null,
        }));
        
        let created = 0;
        let updated = 0;
        let errors: string[] = [];
        
        for (const item of parsedData) {
          try {
            if (!item.nom) {
              errors.push(`Famille sans nom ignorée`);
              continue;
            }
            
            if (input.mode === "create") {
              await db.createFamily(item);
              created++;
            } else if (input.mode === "update" || input.mode === "upsert") {
              const existing = await db.getFamilyByName(item.nom);
              
              if (existing) {
                await db.updateFamily(existing.id, item);
                updated++;
              } else if (input.mode === "upsert") {
                await db.createFamily(item);
                created++;
              } else {
                errors.push(`Famille "${item.nom}" introuvable pour mise à jour`);
              }
            }
          } catch (error) {
            errors.push(`Erreur pour "${item.nom}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          }
        }
        
        return {
          success: errors.length === 0,
          created,
          updated,
          errors,
        };
      }),

    // Import matieres from CSV
    matieres: publicProcedure
      .input(z.object({
        csvData: z.string(),
        mode: z.enum(["create", "update", "upsert"]).default("create"),
      }))
      .mutation(async ({ input }) => {
        const { csvToObjects, parseValue } = await import('./csv-utils');
        
        const parsedData = csvToObjects(input.csvData, (row) => ({
          nom: row.nom || null,
          type: row.type || null,
          origine: row.origine || null,
          fournisseur: row.fournisseur || null,
          quantite: parseValue(row.quantite, "number"),
          unite: row.unite || null,
          prixUnitaire: parseValue(row.prixUnitaire, "number"),
          dateAchat: parseValue(row.dateAchat, "date"),
          notes: row.notes || null,
        }));
        
        let created = 0;
        let updated = 0;
        let errors: string[] = [];
        
        for (const item of parsedData) {
          try {
            if (!item.nom) {
              errors.push(`Matière sans nom ignorée`);
              continue;
            }
            
            // Mapper les données CSV vers le format attendu par createMatiere
            const matiereData = {
              name: item.nom,
              type: (item.type as "huile_essentielle" | "absolu" | "resinoid" | "concrete" | "co2" | "teinture" | "poudre" | "alcoolat" | "autre") || "autre",
              origin: item.origine || undefined,
              supplier: item.fournisseur || undefined,
              stock: item.quantite || undefined,
              technicalNotes: item.notes || undefined,
            };
            
            if (input.mode === "create") {
              await db.createMatiere(matiereData);
              created++;
            } else if (input.mode === "update" || input.mode === "upsert") {
              const existing = await db.getMatiereByName(item.nom);
              
              if (existing) {
                await db.updateMatiere(existing.id, item);
                updated++;
              } else if (input.mode === "upsert") {
                await db.createMatiere(matiereData);
                created++;
              } else {
                errors.push(`Matière "${item.nom}" introuvable pour mise à jour`);
              }
            }
          } catch (error) {
            errors.push(`Erreur pour "${item.nom}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
          }
        }
        
        return {
          success: errors.length === 0,
          created,
          updated,
          errors,
        };
      }),
  }),

  // Historique des modifications
  history: router({
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
    undo: publicProcedure
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
  }),

  // Recherche Radicale
  rechercheRadicale: router({
    list: publicProcedure.query(async () => {
      return await db.getAllRechercheRadicale();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getRechercheRadicaleById(input);
      }),
    getBySerie: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getRechercheRadicaleBySerie(input);
      }),
  }),

  // Saved Formulas (Historique des formules générées)
  formulas: router({
    save: publicProcedure
      .input(z.object({
        radarProfile: z.object({
          intensity: z.number().min(0).max(100),
          freshness: z.number().min(0).max(100),
          warmth: z.number().min(0).max(100),
          sweetness: z.number().min(0).max(100),
          spiciness: z.number().min(0).max(100),
          earthiness: z.number().min(0).max(100),
        }),
        suggestions: z.array(z.object({
          id: z.number(),
          name: z.string(),
          compatibilityScore: z.number(),
          radarIntensity: z.number().optional(),
          radarFreshness: z.number().optional(),
          radarWarmth: z.number().optional(),
          radarSweetness: z.number().optional(),
          radarSpiciness: z.number().optional(),
          radarEarthiness: z.number().optional(),
        })),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.saveFormula({
          userId: ctx.user.id,
          radarProfile: input.radarProfile,
          suggestions: input.suggestions,
          notes: input.notes,
        });
      }),
    
    getHistory: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Not authenticated");
      return await db.getFormulaHistory(ctx.user.id);
    }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getFormulaById(input);
      }),
    
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        await db.deleteFormula(input);
        return { success: true };
      }),
    
    updateNotes: publicProcedure
      .input(z.object({
        id: z.number(),
        notes: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Not authenticated");
        return await db.updateFormulaNotes(input.id, input.notes);
      }),
  }),

  // Climate Studies (Études climatiques)
  climateStudies: router({
    list: publicProcedure.query(async () => {
      return await db.getAllClimateStudies();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getClimateStudyById(input);
      }),
  }),

  // Molecular Protocols (Protocoles moléculaires)
  molecularProtocols: router({
    list: publicProcedure.query(async () => {
      return await db.getAllMolecularProtocols();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getMolecularProtocolById(input);
      }),
    getByStudyId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getMolecularProtocolsByStudyId(input);
      }),
  }),

  // Field Archives (Archives terrain)
  fieldArchives: router({
    list: publicProcedure.query(async () => {
      return await db.getAllFieldArchives();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getFieldArchiveById(input);
      }),
  }),

  // Extraction Tests (Tests d'extraction)
  extractionTests: router({
    list: publicProcedure.query(async () => {
      return await db.getAllExtractionTests();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getExtractionTestById(input);
      }),
    getByArchiveId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getExtractionTestsByArchiveId(input);
      }),
  }),

  // Situated Smells (Odeurs situées)
  situatedSmells: router({
    list: publicProcedure.query(async () => {
      return await db.getAllSituatedSmells();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getSituatedSmellById(input);
      }),
  }),

  // Leaf Economies (San Andrés / Seaflower Research)
  leafEconomies: router({
    list: publicProcedure.query(async () => {
      return await db.getAllLeafEconomies();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getLeafEconomyById(input);
      }),
    getBySampleId: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getLeafEconomyBySampleId(input);
      }),
    getByCategory: publicProcedure
      .input(z.enum(['aromatique', 'tabac', 'cannabis']))
      .query(async ({ input }) => {
        return await db.getLeafEconomiesByCategory(input);
      }),
    getByIsland: publicProcedure
      .input(z.enum(['san_andres', 'providencia', 'autre']))
      .query(async ({ input }) => {
        return await db.getLeafEconomiesByIsland(input);
      }),
    getByStatus: publicProcedure
      .input(z.enum(['brut', 'a_analyser', 'analyse', 'traduction', 'archive']))
      .query(async ({ input }) => {
        return await db.getLeafEconomiesByStatus(input);
      }),
    search: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.searchLeafEconomies(input);
      }),
    withAnalysis: publicProcedure.query(async () => {
      return await db.getLeafEconomiesWithAnalysis();
    }),
    withoutAnalysis: publicProcedure.query(async () => {
      return await db.getLeafEconomiesWithoutAnalysis();
    }),
    create: publicProcedure
      .input(z.object({
        sampleId: z.string().min(1),
        date: z.date().optional(),
        island: z.enum(['san_andres', 'providencia', 'autre']).optional(),
        preciseLocation: z.string().optional(),
        sourceContact: z.string().optional(),
        category: z.enum(['aromatique', 'tabac', 'cannabis']),
        species: z.string().optional(),
        claimedVariety: z.string().optional(),
        usedPart: z.enum(['feuille', 'fleur', 'resine', 'tige', 'autre']).optional(),
        state: z.enum(['frais', 'sec', 'rehydrate']).optional(),
        curingTreatment: z.enum(['aucun', 'air_cured', 'flue_cured', 'sun_cured', 'autre']).optional(),
        extraction: z.enum(['aucune', 'maceration_alcool', 'maceration_mct', 'distillation', 'headspace']).optional(),
        ratioParameters: z.string().optional(),
        duration: z.string().optional(),
        odorNotes: z.string().optional(),
        climaticAxis: z.string().optional(),
        usage: z.string().optional(),
        analysisAvailable: z.number().optional(),
        analysisMethod: z.enum(['gc_ms', 'hplc', 'autre']).optional(),
        topMoleculesList: z.string().optional(),
        topMolecule1: z.string().optional(),
        topMolecule2: z.string().optional(),
        topMolecule3: z.string().optional(),
        relativePercentages: z.string().optional(),
        absorbeInterpretation: z.string().optional(),
        status: z.enum(['brut', 'a_analyser', 'analyse', 'traduction', 'archive']).optional(),
        mediaLinks: z.string().optional(),
        imageUrl: z.string().optional(),
        ethicalNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createLeafEconomy(input);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          sampleId: z.string().optional(),
          date: z.date().optional(),
          island: z.enum(['san_andres', 'providencia', 'autre']).optional(),
          preciseLocation: z.string().optional(),
          sourceContact: z.string().optional(),
          category: z.enum(['aromatique', 'tabac', 'cannabis']).optional(),
          species: z.string().optional(),
          claimedVariety: z.string().optional(),
          usedPart: z.enum(['feuille', 'fleur', 'resine', 'tige', 'autre']).optional(),
          state: z.enum(['frais', 'sec', 'rehydrate']).optional(),
          curingTreatment: z.enum(['aucun', 'air_cured', 'flue_cured', 'sun_cured', 'autre']).optional(),
          extraction: z.enum(['aucune', 'maceration_alcool', 'maceration_mct', 'distillation', 'headspace']).optional(),
          ratioParameters: z.string().optional(),
          duration: z.string().optional(),
          odorNotes: z.string().optional(),
          climaticAxis: z.string().optional(),
          usage: z.string().optional(),
          analysisAvailable: z.number().optional(),
          analysisMethod: z.enum(['gc_ms', 'hplc', 'autre']).optional(),
          topMoleculesList: z.string().optional(),
          topMolecule1: z.string().optional(),
          topMolecule2: z.string().optional(),
          topMolecule3: z.string().optional(),
          relativePercentages: z.string().optional(),
          absorbeInterpretation: z.string().optional(),
          status: z.enum(['brut', 'a_analyser', 'analyse', 'traduction', 'archive']).optional(),
          mediaLinks: z.string().optional(),
          imageUrl: z.string().optional(),
          ethicalNotes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updateLeafEconomy(input.id, input.data);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteLeafEconomy(input);
        return { success: true };
      }),
    // Upload d'image botanique pour LeafEconomy
    uploadImage: protectedProcedure
      .input(z.object({
        leafEconomyId: z.number(),
        imageData: z.string(), // Base64 encoded image data
        fileName: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Extraire les données base64 (enlever le préfixe data:...)
        const base64Data = input.imageData.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const extension = input.fileName.split('.').pop() || 'jpg';
        const fileKey = `leaf-economies/${input.leafEconomyId}/botanical-${timestamp}-${randomSuffix}.${extension}`;
        
        // Upload vers S3
        const { storagePut } = await import('./storage');
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        // Mettre à jour l'URL dans la base de données
        await db.updateLeafEconomyImage(input.leafEconomyId, url);
        
        return { url, key: fileKey };
      }),
    // Mettre à jour l'URL de l'image
    updateImage: protectedProcedure
      .input(z.object({
        leafEconomyId: z.number(),
        imageUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateLeafEconomyImage(input.leafEconomyId, input.imageUrl);
      }),
    // Supprimer l'image
    deleteImage: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteLeafEconomyImage(input);
      }),
  }),

  // Geographic Origins (Terroirs de production)
  geographicOrigins: router({
    list: publicProcedure.query(async () => {
      return await db.getAllGeographicOrigins();
    }),
    listWithMoleculeCount: publicProcedure.query(async () => {
      return await db.getAllGeographicOriginsWithMoleculeCount();
    }),
    getMoleculesWithDetails: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getOriginMoleculesWithDetails(input);
      }),
    searchByMolecule: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.searchOriginsByMoleculeName(input);
      }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getGeographicOriginById(input);
      }),
    getByCountry: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getGeographicOriginsByCountry(input);
      }),
    getMolecules: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getOriginMolecules(input);
      }),
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        country: z.string().min(1),
        region: z.string().optional(),
        terroir: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        altitude: z.number().optional(),
        climate: z.string().optional(),
        soilType: z.string().optional(),
        harvestPeriod: z.string().optional(),
        productionMethod: z.string().optional(),
        qualityIndicators: z.string().optional(),
        historicalContext: z.string().optional(),
        economicImportance: z.string().optional(),
        sustainabilityNotes: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createGeographicOrigin(input);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          country: z.string().optional(),
          region: z.string().optional(),
          terroir: z.string().optional(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          altitude: z.number().optional(),
          climate: z.string().optional(),
          soilType: z.string().optional(),
          harvestPeriod: z.string().optional(),
          productionMethod: z.string().optional(),
          qualityIndicators: z.string().optional(),
          historicalContext: z.string().optional(),
          economicImportance: z.string().optional(),
          sustainabilityNotes: z.string().optional(),
          imageUrl: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updateGeographicOrigin(input.id, input.data);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteGeographicOrigin(input);
        return { success: true };
      }),
    // Géocodage automatique d'un terroir
    geocode: publicProcedure
      .input(z.object({
        id: z.number(),
        address: z.string().optional(), // Si non fourni, utilise name + country + region
      }))
      .mutation(async ({ input }) => {
        const origin = await db.getGeographicOriginById(input.id);
        if (!origin) {
          throw new Error('Origine non trouvée');
        }
        
        // Construire l'adresse de recherche
        const searchAddress = input.address || 
          [origin.region, origin.country].filter(Boolean).join(', ') ||
          origin.name;
        
        // Appeler l'API Google Geocoding via le proxy Manus
        const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
        const FORGE_BASE_URL = process.env.BUILT_IN_FORGE_API_URL || 'https://forge.butterfly-effect.dev';
        
        const geocodeUrl = `${FORGE_BASE_URL}/v1/maps/proxy/maps/api/geocode/json?address=${encodeURIComponent(searchAddress)}&key=${FORGE_API_KEY}`;
        
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        
        if (data.status !== 'OK' || !data.results || data.results.length === 0) {
          throw new Error(`Géocodage échoué: ${data.status || 'Aucun résultat'}`);
        }
        
        const result = data.results[0];
        const { lat, lng } = result.geometry.location;
        
        // Mettre à jour les coordonnées dans la base de données
        await db.updateGeographicOrigin(input.id, {
          latitude: lat.toString(),
          longitude: lng.toString(),
        });
        
        return {
          success: true,
          latitude: lat,
          longitude: lng,
          formattedAddress: result.formatted_address,
        };
      }),
    // Géocodage en masse de tous les terroirs sans coordonnées
    geocodeBatch: publicProcedure
      .mutation(async () => {
        const origins = await db.getAllGeographicOrigins();
        const originsWithoutCoords = origins.filter((o: any) => !o.latitude || !o.longitude);
        
        const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
        const FORGE_BASE_URL = process.env.BUILT_IN_FORGE_API_URL || 'https://forge.butterfly-effect.dev';
        
        const results: { id: number; name: string; success: boolean; error?: string; latitude?: number; longitude?: number }[] = [];
        
        for (const origin of originsWithoutCoords) {
          try {
            const searchAddress = [origin.region, origin.country].filter(Boolean).join(', ') || origin.name;
            const geocodeUrl = `${FORGE_BASE_URL}/v1/maps/proxy/maps/api/geocode/json?address=${encodeURIComponent(searchAddress)}&key=${FORGE_API_KEY}`;
            
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            
            if (data.status === 'OK' && data.results && data.results.length > 0) {
              const { lat, lng } = data.results[0].geometry.location;
              await db.updateGeographicOrigin(origin.id, {
                latitude: lat.toString(),
                longitude: lng.toString(),
              });
              results.push({ id: origin.id, name: origin.name, success: true, latitude: lat, longitude: lng });
            } else {
              results.push({ id: origin.id, name: origin.name, success: false, error: data.status || 'Aucun résultat' });
            }
            
            // Pause pour éviter le rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            results.push({ id: origin.id, name: origin.name, success: false, error: (error as Error).message });
          }
        }
        
        return {
          total: originsWithoutCoords.length,
          success: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          results,
        };
      }),
  }),

  // Molecule Origins (Relations molécules-terroirs)
  moleculeOrigins: router({
    getByMolecule: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getMoleculeOrigins(input);
      }),
    add: publicProcedure
      .input(z.object({
        moleculeId: z.number(),
        originId: z.number(),
        isPrimaryOrigin: z.number().optional(),
        qualityRating: z.number().optional(),
        productionVolume: z.string().optional(),
        priceRange: z.string().optional(),
        specificCharacteristics: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.addMoleculeOrigin(input);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          isPrimaryOrigin: z.number().optional(),
          qualityRating: z.number().optional(),
          productionVolume: z.string().optional(),
          priceRange: z.string().optional(),
          specificCharacteristics: z.string().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateMoleculeOrigin(input.id, input.data);
        return { success: true };
      }),
    remove: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.removeMoleculeOrigin(input);
        return { success: true };
      }),
  }),

  // IFRA Restrictions
  ifraRestrictions: router({
    list: publicProcedure.query(async () => {
      return await db.getAllIfraRestrictions();
    }),
    getByMolecule: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getMoleculeIfraRestrictions(input);
      }),
    getRestricted: publicProcedure.query(async () => {
      return await db.getRestrictedMolecules();
    }),
    create: publicProcedure
      .input(z.object({
        moleculeId: z.number(),
        ifraAmendment: z.string().optional(),
        effectiveDate: z.date().optional(),
        category1: z.string().optional(),
        category2: z.string().optional(),
        category3: z.string().optional(),
        category4: z.string().optional(),
        category5a: z.string().optional(),
        category5b: z.string().optional(),
        category5c: z.string().optional(),
        category5d: z.string().optional(),
        category6: z.string().optional(),
        category7a: z.string().optional(),
        category7b: z.string().optional(),
        category8: z.string().optional(),
        category9: z.string().optional(),
        category10a: z.string().optional(),
        category10b: z.string().optional(),
        category11a: z.string().optional(),
        category11b: z.string().optional(),
        restrictionType: z.enum(['prohibited', 'restricted', 'specification', 'no_restriction']).optional(),
        reasonForRestriction: z.string().optional(),
        alternativeSuggestions: z.string().optional(),
        notes: z.string().optional(),
        sourceUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createIfraRestriction(input);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          ifraAmendment: z.string().optional(),
          effectiveDate: z.date().optional(),
          category1: z.string().optional(),
          category2: z.string().optional(),
          category3: z.string().optional(),
          category4: z.string().optional(),
          category5a: z.string().optional(),
          category5b: z.string().optional(),
          category5c: z.string().optional(),
          category5d: z.string().optional(),
          category6: z.string().optional(),
          category7a: z.string().optional(),
          category7b: z.string().optional(),
          category8: z.string().optional(),
          category9: z.string().optional(),
          category10a: z.string().optional(),
          category10b: z.string().optional(),
          category11a: z.string().optional(),
          category11b: z.string().optional(),
          restrictionType: z.enum(['prohibited', 'restricted', 'specification', 'no_restriction']).optional(),
          reasonForRestriction: z.string().optional(),
          alternativeSuggestions: z.string().optional(),
          notes: z.string().optional(),
          sourceUrl: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateIfraRestriction(input.id, input.data);
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteIfraRestriction(input);
        return { success: true };
      }),
  }),

  // Molecule Scientific Data
  moleculeScientificData: router({
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        iupacName: z.string().optional(),
        casNumber: z.string().optional(),
        chemicalClass: z.enum(['terpene', 'sesquiterpene', 'diterpene', 'monoterpene', 'aldehyde', 'ketone', 'alcohol', 'ester', 'ether', 'phenol', 'lactone', 'coumarin', 'musk', 'nitrile', 'sulfur_compound', 'heterocyclic', 'aromatic', 'aliphatic', 'other']).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateMoleculeScientificData(id, data);
      }),
    getWithoutCas: publicProcedure.query(async () => {
      return await db.getMoleculesWithoutCas();
    }),
    getWithCas: publicProcedure.query(async () => {
      return await db.getMoleculesWithCas();
    }),
  }),

  // ============================================================================
  // PLANTS (Plantes aromatiques avec variétés et états botaniques)
  // ============================================================================
  plants: router({
    list: publicProcedure.query(async () => {
      return await withCache(
        CACHE_KEYS.PLANTS_LIST,
        () => db.getAllPlants(),
        CACHE_TTL.MEDIUM
      );
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await withCache(
          CACHE_KEYS.PLANT_DETAIL(input),
          () => db.getPlantById(input),
          CACHE_TTL.MEDIUM
        );
      }),
    getByCategory: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getPlantsByCategory(input);
      }),
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        latinName: z.string().optional(),
        family: z.string().optional(),
        category: z.enum(["aromatique", "tabac", "cannabis", "resine", "bois", "fleur", "racine", "autre"]),
        origin: z.string().optional(),
        habitat: z.string().optional(),
        olfactiveSignature: z.string().optional(),
        dominantMolecules: z.string().optional(),
        chemotypes: z.string().optional(),
        climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition"]).optional(),
        traditionalUse: z.string().optional(),
        absorbeUse: z.string().optional(),
        botanicalStates: z.array(z.object({
          state: z.string(),
          name: z.string(),
          odor: z.string(),
          molecules: z.array(z.string()),
          usage: z.string(),
        })).optional(),
        notes: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createPlant(input as any);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          latinName: z.string().optional(),
          family: z.string().optional(),
          category: z.enum(["aromatique", "tabac", "cannabis", "resine", "bois", "fleur", "racine", "autre"]).optional(),
          origin: z.string().optional(),
          habitat: z.string().optional(),
          olfactiveSignature: z.string().optional(),
          dominantMolecules: z.string().optional(),
          chemotypes: z.string().optional(),
          climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition"]).optional(),
          traditionalUse: z.string().optional(),
          absorbeUse: z.string().optional(),
          botanicalStates: z.array(z.object({
            state: z.string(),
            name: z.string(),
            odor: z.string(),
            molecules: z.array(z.string()),
            usage: z.string(),
          })).optional(),
          notes: z.string().optional(),
          imageUrl: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updatePlant(input.id, input.data as any);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deletePlant(input);
        return { success: true };
      }),
    getMolecules: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getPlantMolecules(input);
      }),
    // Gestion des images botaniques
    uploadImage: protectedProcedure
      .input(z.object({
        plantId: z.number(),
        imageData: z.string(), // Base64 encoded image data
        fileName: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Extraire les données base64 (enlever le préfixe data:...)
        const base64Data = input.imageData.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const extension = input.fileName.split('.').pop() || 'jpg';
        const fileKey = `plants/${input.plantId}/botanical-${timestamp}-${randomSuffix}.${extension}`;
        
        // Upload vers S3
        const { storagePut } = await import('./storage');
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        // Mettre à jour l'URL dans la base de données
        await db.updatePlantImage(input.plantId, url);
        
        return { url, key: fileKey };
      }),
    updateImage: protectedProcedure
      .input(z.object({
        plantId: z.number(),
        imageUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.updatePlantImage(input.plantId, input.imageUrl);
      }),
    deleteImage: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deletePlantImage(input);
      }),
    getWithImages: publicProcedure.query(async () => {
      return await db.getPlantsWithImages();
    }),
    getWithoutImages: publicProcedure.query(async () => {
      return await db.getPlantsWithoutImages();
    }),
    // Plantes avec coordonnées GPS pour la carte
    getWithGPS: publicProcedure.query(async () => {
      return await db.getPlantsWithGPS();
    }),
    getWithGPSByCategory: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getPlantsWithGPSByCategory(input);
      }),
  }),

  // ============================================================================
  // TERP PROFILES (Fiches interactives San Andrés - Point 1 & 2)
  // ============================================================================
  terpProfiles: router({
    list: publicProcedure.query(async () => {
      return await db.getAllTerpProfiles();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getTerpProfileById(input);
      }),
    getByProfileId: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getTerpProfileByProfileId(input);
      }),
    getByClimaticAxis: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getTerpProfilesByClimaticAxis(input);
      }),
    getByUsage: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getTerpProfilesByUsage(input);
      }),
    create: publicProcedure
      .input(z.object({
        profileId: z.string().min(1),
        name: z.string().min(1),
        collection: z.string().optional(),
        type: z.string().optional(),
        climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition", "vent_bois_disparition"]),
        secondaryAxis: z.enum(["vent", "bois", "disparition", "none"]).optional(),
        function: z.string().optional(),
        usage: z.enum(["parfum", "encens", "espace", "parfum_encens", "parfum_espace", "encens_espace", "tous"]).optional(),
        level: z.string().optional(),
        plantSources: z.string().optional(),
        keyMolecules: z.string().optional(),
        concentrate: z.array(z.object({
          ingredient: z.string(),
          percentage: z.number(),
        })).optional(),
        olfactiveReading: z.string().optional(),
        temporality: z.enum(["rapide", "moyenne", "longue", "tres_courte", "variable"]).optional(),
        temporalityDescription: z.string().optional(),
        recommendedUsage: z.string().optional(),
        criticalNotes: z.string().optional(),
        connections: z.array(z.object({
          type: z.enum(["compare", "complete"]),
          profileId: z.string(),
          name: z.string(),
        })).optional(),
        intensity: z.enum(["faible", "moyenne", "structurelle"]).optional(),
        readability: z.enum(["abstrait", "lisible", "structure"]).optional(),
        nonIdentifiable: z.number().optional(),
        radarVent: z.number().optional(),
        radarBois: z.number().optional(),
        radarDisparition: z.number().optional(),
        radarStructure: z.number().optional(),
        radarDiffusion: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createTerpProfile(input as any);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          collection: z.string().optional(),
          type: z.string().optional(),
          climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition", "vent_bois_disparition"]).optional(),
          secondaryAxis: z.enum(["vent", "bois", "disparition", "none"]).optional(),
          function: z.string().optional(),
          usage: z.enum(["parfum", "encens", "espace", "parfum_encens", "parfum_espace", "encens_espace", "tous"]).optional(),
          level: z.string().optional(),
          plantSources: z.string().optional(),
          keyMolecules: z.string().optional(),
          concentrate: z.array(z.object({
            ingredient: z.string(),
            percentage: z.number(),
          })).optional(),
          olfactiveReading: z.string().optional(),
          temporality: z.enum(["rapide", "moyenne", "longue", "tres_courte", "variable"]).optional(),
          temporalityDescription: z.string().optional(),
          recommendedUsage: z.string().optional(),
          criticalNotes: z.string().optional(),
          connections: z.array(z.object({
            type: z.enum(["compare", "complete"]),
            profileId: z.string(),
            name: z.string(),
          })).optional(),
          intensity: z.enum(["faible", "moyenne", "structurelle"]).optional(),
          readability: z.enum(["abstrait", "lisible", "structure"]).optional(),
          nonIdentifiable: z.number().optional(),
          radarVent: z.number().optional(),
          radarBois: z.number().optional(),
          radarDisparition: z.number().optional(),
          radarStructure: z.number().optional(),
          radarDiffusion: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updateTerpProfile(input.id, input.data as any);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteTerpProfile(input);
        return { success: true };
      }),
    getPlants: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getTerpProfilePlants(input);
      }),
    getMolecules: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getTerpProfileMolecules(input);
      }),
    // Récupérer les recettes liées à un TerpProfile
    getRecettes: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getRecettesForTerpProfile(input);
      }),
    // Récupérer les TerpProfiles liés aux molécules de Tagetes lucida
    getForTagetesLucida: publicProcedure
      .query(async () => {
        return await db.getTerpProfilesForTagetesLucida();
      }),
  }),

  // ============================================================================
  // FINAL RECIPES (Recettes finales: Parfum, Encens, Espace - Point 3)
  // ============================================================================
  finalRecipes: router({
    list: publicProcedure.query(async () => {
      return await db.getAllFinalRecipes();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getFinalRecipeById(input);
      }),
    getByRecipeId: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getFinalRecipeByRecipeId(input);
      }),
    getByType: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getFinalRecipesByType(input);
      }),
    getByClimaticAxis: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return await db.getFinalRecipesByClimaticAxis(input);
      }),
    getRadical: publicProcedure.query(async () => {
      return await db.getRadicalRecipes();
    }),
    create: publicProcedure
      .input(z.object({
        recipeId: z.string().min(1),
        name: z.string().min(1),
        recipeType: z.enum(["parfum", "encens", "espace"]),
        function: z.string().optional(),
        climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition", "vent_bois_disparition"]),
        base: z.string().optional(),
        concentrate: z.array(z.object({
          ingredient: z.string(),
          percentage: z.number(),
        })).optional(),
        dilution: z.string().optional(),
        restPeriod: z.string().optional(),
        form: z.string().optional(),
        combustionTime: z.string().optional(),
        protocol: z.string().optional(),
        supports: z.string().optional(),
        expectedResult: z.string().optional(),
        successCriteria: z.string().optional(),
        risks: z.string().optional(),
        notes: z.string().optional(),
        usage: z.string().optional(),
        terpProfileIds: z.array(z.string()).optional(),
        isRadical: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createFinalRecipe(input as any);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          recipeType: z.enum(["parfum", "encens", "espace"]).optional(),
          function: z.string().optional(),
          climaticAxis: z.enum(["vent", "bois", "disparition", "vent_bois", "bois_disparition", "vent_disparition", "vent_bois_disparition"]).optional(),
          base: z.string().optional(),
          concentrate: z.array(z.object({
            ingredient: z.string(),
            percentage: z.number(),
          })).optional(),
          dilution: z.string().optional(),
          restPeriod: z.string().optional(),
          form: z.string().optional(),
          combustionTime: z.string().optional(),
          protocol: z.string().optional(),
          supports: z.string().optional(),
          expectedResult: z.string().optional(),
          successCriteria: z.string().optional(),
          risks: z.string().optional(),
          notes: z.string().optional(),
          usage: z.string().optional(),
          terpProfileIds: z.array(z.string()).optional(),
          isRadical: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return await db.updateFinalRecipe(input.id, input.data as any);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteFinalRecipe(input);
        return { success: true };
      }),
  }),

  // Point 3 Étendu - Routes botaniques avancées
  plantVarieties: router({
    getAll: publicProcedure.query(async () => {
      return getAllPlantVarieties();
    }),
    getByPlant: publicProcedure
      .input(z.object({ plantId: z.number() }))
      .query(async ({ input }) => {
        return getPlantVarietiesByPlant(input.plantId);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getPlantVarietyById(input.id);
      }),
    // Nouvelles procédures pour filtres avancés
    getWithFilters: publicProcedure
      .input(z.object({
        plantCategory: z.string().optional(),
        varietyType: z.string().optional(),
        conservationStatus: z.string().optional(),
        countryOfOrigin: z.string().optional(),
        searchQuery: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return db.getPlantVarietiesWithFilters(input);
      }),
    getCritical: publicProcedure.query(async () => {
      return db.getCriticalVarieties();
    }),
    getConservationStats: publicProcedure.query(async () => {
      return db.getConservationStats();
    }),
    getWithMolecules: publicProcedure
      .input(z.object({ varietyId: z.number() }))
      .query(async ({ input }) => {
        return db.getVarietyWithMolecules(input.varietyId);
      }),
    getByType: publicProcedure
      .input(z.object({ varietyType: z.string() }))
      .query(async ({ input }) => {
        return db.getVarietiesByType(input.varietyType);
      }),
    getCannabisLandraces: publicProcedure.query(async () => {
      return db.getCannabisLandraces();
    }),
    getTobaccoVarieties: publicProcedure.query(async () => {
      return db.getTobaccoVarieties();
    }),
    getUniqueCountries: publicProcedure.query(async () => {
      return db.getUniqueVarietyCountries();
    }),
    updateConservationStatus: publicProcedure
      .input(z.object({
        varietyId: z.number(),
        conservationStatus: z.string().optional(),
        conservationNotes: z.string().optional(),
        threatFactors: z.array(z.string()).optional(),
        conservationEfforts: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.updateVarietyConservationStatus(input.varietyId, input);
      }),
    // CRUD complet pour les variétés
    create: publicProcedure
      .input(z.object({
        plantId: z.number(),
        name: z.string().min(1),
        latinName: z.string().optional(),
        varietyType: z.enum(['cultivar', 'chemotype', 'landrace', 'hybrid', 'clone', 'wild', 'other']),
        breeder: z.string().optional(),
        yearRegistered: z.number().optional(),
        countryOfOrigin: z.string().optional(),
        parentVarieties: z.array(z.string()).optional(),
        distinctiveFeatures: z.string().optional(),
        morphology: z.object({
          height: z.string().optional(),
          leafShape: z.string().optional(),
          flowerColor: z.string().optional(),
          growthHabit: z.string().optional(),
        }).optional(),
        dominantMolecules: z.array(z.object({
          molecule: z.string(),
          percentage: z.number(),
          role: z.string(),
        })).optional(),
        molecularProfile: z.array(z.object({
          molecule: z.string(),
          minPercent: z.number(),
          maxPercent: z.number(),
          typical: z.number(),
        })).optional(),
        olfactiveDescription: z.string().optional(),
        olfactiveNotes: z.object({
          top: z.array(z.string()),
          heart: z.array(z.string()),
          base: z.array(z.string()),
        }).optional(),
        yieldPerHectare: z.string().optional(),
        essentialOilYield: z.string().optional(),
        harvestPeriod: z.string().optional(),
        optimalHarvestStage: z.string().optional(),
        commercialAvailability: z.enum(['widely_available', 'limited', 'rare', 'research_only', 'extinct', 'unknown']).optional(),
        suppliers: z.array(z.string()).optional(),
        conservationStatus: z.enum(['critical', 'endangered', 'vulnerable', 'near_threatened', 'stable', 'data_deficient', 'unknown']).optional(),
        conservationNotes: z.string().optional(),
        threatFactors: z.array(z.string()).optional(),
        conservationEfforts: z.string().optional(),
        notes: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Générer un varietyId unique
        const prefix = input.varietyType === 'landrace' ? 'PV-LAN' : 'PV-VAR';
        const count = await db.getPlantVarietiesCount();
        const varietyId = `${prefix}-${String(count + 1).padStart(3, '0')}`;
        return createPlantVariety({ ...input, varietyId });
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        latinName: z.string().optional(),
        varietyType: z.enum(['cultivar', 'chemotype', 'landrace', 'hybrid', 'clone', 'wild', 'other']).optional(),
        breeder: z.string().optional(),
        yearRegistered: z.number().optional(),
        countryOfOrigin: z.string().optional(),
        parentVarieties: z.array(z.string()).optional(),
        distinctiveFeatures: z.string().optional(),
        morphology: z.object({
          height: z.string().optional(),
          leafShape: z.string().optional(),
          flowerColor: z.string().optional(),
          growthHabit: z.string().optional(),
        }).optional(),
        dominantMolecules: z.array(z.object({
          molecule: z.string(),
          percentage: z.number(),
          role: z.string(),
        })).optional(),
        molecularProfile: z.array(z.object({
          molecule: z.string(),
          minPercent: z.number(),
          maxPercent: z.number(),
          typical: z.number(),
        })).optional(),
        olfactiveDescription: z.string().optional(),
        olfactiveNotes: z.object({
          top: z.array(z.string()),
          heart: z.array(z.string()),
          base: z.array(z.string()),
        }).optional(),
        yieldPerHectare: z.string().optional(),
        essentialOilYield: z.string().optional(),
        harvestPeriod: z.string().optional(),
        optimalHarvestStage: z.string().optional(),
        commercialAvailability: z.enum(['widely_available', 'limited', 'rare', 'research_only', 'extinct', 'unknown']).optional(),
        suppliers: z.array(z.string()).optional(),
        conservationStatus: z.enum(['critical', 'endangered', 'vulnerable', 'near_threatened', 'stable', 'data_deficient', 'unknown']).optional(),
        conservationNotes: z.string().optional(),
        threatFactors: z.array(z.string()).optional(),
        conservationEfforts: z.string().optional(),
        notes: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updatePlantVariety(id, data);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deletePlantVariety(input.id);
      }),
    // Récupérer toutes les plantes pour le sélecteur
    getPlants: publicProcedure.query(async () => {
      return db.getAllPlantsForSelect();
    }),
  }),
  
  // Routes pour les liaisons plantes-molécules
  plantMoleculeLinks: router({
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
    create: publicProcedure
      .input(z.object({
        plantId: z.number(),
        moleculeId: z.number(),
        percentageMin: z.number().optional(),
        percentageMax: z.number().optional(),
        percentageTypical: z.number().optional(),
        isSignature: z.number().optional(),
        role: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createPlantMoleculeLink(input);
      }),
    delete: publicProcedure
      .input(z.object({
        plantId: z.number(),
        moleculeId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return db.deletePlantMoleculeLink(input.plantId, input.moleculeId);
      }),
  }),
  
  terroirs: router({
    getAll: publicProcedure.query(async () => {
      return getAllTerroirs();
    }),
    getByCountry: publicProcedure
      .input(z.object({ country: z.string() }))
      .query(async ({ input }) => {
        return getTerroirsByCountry(input.country);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getTerroirById(input.id);
      }),
  }),
  
  extractionMethods: router({
    getAll: publicProcedure.query(async () => {
      return getAllExtractionMethods();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getExtractionMethodById(input.id);
      }),
  }),
  
  // Méthodes analytiques (GC-MS, PTR-MS, etc.)
  analyticalMethods: router({
    list: publicProcedure.query(async () => {
      return await db.getAllAnalyticalMethods();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getAnalyticalMethodById(input.id);
      }),
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await db.getAnalyticalMethodsByCategory(input.category);
      }),
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.searchAnalyticalMethods(input.query);
      }),
  }),
  
  plantAnalyses: router({
    getAll: publicProcedure.query(async () => {
      return getAllPlantAnalyses();
    }),
    getByPlant: publicProcedure
      .input(z.object({ plantId: z.number() }))
      .query(async ({ input }) => {
        return getPlantAnalysesByPlant(input.plantId);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getPlantAnalysisById(input.id);
      }),
  }),
  
  plantSamples: router({
    getAll: publicProcedure.query(async () => {
      return getAllPlantSamples();
    }),
    getByPlant: publicProcedure
      .input(z.object({ plantId: z.number() }))
      .query(async ({ input }) => {
        return getPlantSamplesByPlant(input.plantId);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getPlantSampleById(input.id);
      }),
  }),
  
  extendedSuppliers: router({
    getAll: publicProcedure.query(async () => {
      return getAllExtendedSuppliers();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getExtendedSupplierById(input.id);
      }),
  }),
  
  plantStatistics: router({
    getOverview: publicProcedure.query(async () => {
      return getPlantStatistics();
    }),
    getPlantWithDetails: publicProcedure
      .input(z.object({ plantId: z.number() }))
      .query(async ({ input }) => {
        return getPlantWithFullDetails(input.plantId);
      }),
    searchByMolecule: publicProcedure
      .input(z.object({ moleculeName: z.string() }))
      .query(async ({ input }) => {
        return searchPlantsByMolecule(input.moleculeName);
      }),
    searchByTerroir: publicProcedure
      .input(z.object({ terroirId: z.number() }))
      .query(async ({ input }) => {
        return searchPlantsByTerroir(input.terroirId);
      }),
    getPlantMoleculesWithIfra: publicProcedure
      .input(z.object({ plantId: z.number() }))
      .query(async ({ input }) => {
        // Récupérer les molécules de la plante avec leurs restrictions IFRA
        const molecules = await db.getPlantMoleculesWithPercentages(input.plantId);
        
        // Pour chaque molécule, récupérer ses restrictions IFRA
        const moleculesWithIfra = await Promise.all(
          molecules.map(async (mol) => {
            const ifraRestrictions = await db.getMoleculeIfraRestrictions(mol.molecule.id);
            return {
              moleculeId: mol.molecule.id,
              molecule: mol.molecule,
              percentageTypical: mol.percentageTypical,
              percentageMin: mol.percentageMin,
              percentageMax: mol.percentageMax,
              role: mol.role,
              isSignature: mol.isSignature,
              ifraRestrictions,
            };
          })
        );
        
        return moleculesWithIfra;
      }),
  }),

  // ============================================================================
  // MATIÈRES PREMIÈRES ET RELATIONS MOLÉCULE-PLANTE-TERROIR
  // ============================================================================
  
  rawMaterials: router({
    getAll: publicProcedure.query(async () => {
      return db.getAllRawMaterials();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getRawMaterialById(input);
      }),
    getByMaterialId: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getRawMaterialByMaterialId(input);
      }),
    getByCategory: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getRawMaterialsByCategory(input);
      }),
    getByPlant: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getRawMaterialsByPlant(input);
      }),
    getByTerroir: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getRawMaterialsByTerroir(input);
      }),
    getMolecules: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getRawMaterialMolecules(input);
      }),
    create: protectedProcedure
      .input(z.object({
        materialId: z.string().min(1),
        name: z.string().min(1),
        latinName: z.string().optional(),
        category: z.enum(['huile_essentielle', 'absolue', 'concrete', 'resinoid', 'teinture', 'co2_extract', 'hydrolat', 'beurre', 'cire', 'oleoresine', 'infusion', 'maceration', 'distillat', 'autre']),
        plantId: z.number().optional(),
        plantPart: z.enum(['fleur', 'feuille', 'tige', 'racine', 'ecorce', 'bois', 'resine', 'graine', 'fruit', 'zeste', 'plante_entiere', 'bourgeon', 'autre']).optional(),
        terroirId: z.number().optional(),
        originCountry: z.string().optional(),
        originRegion: z.string().optional(),
        extractionMethodId: z.number().optional(),
        extractionYield: z.string().optional(),
        extractionNotes: z.string().optional(),
        olfactiveFamily: z.enum(['floral', 'boise', 'agrume', 'epice', 'herbace', 'balsamique', 'musque', 'animal', 'vert', 'fruité', 'marin', 'terreux', 'fumé', 'gourmand', 'aromatique', 'autre']).optional(),
        olfactiveProfile: z.string().optional(),
        topNotes: z.string().optional(),
        heartNotes: z.string().optional(),
        baseNotes: z.string().optional(),
        intensity: z.number().optional(),
        tenacity: z.number().optional(),
        quality: z.enum(['conventionnel', 'bio', 'sauvage', 'biodynamique', 'aop', 'igp', 'fair_trade']).optional(),
        priceRange: z.enum(['economique', 'standard', 'premium', 'luxe', 'rare']).optional(),
        availability: z.enum(['disponible', 'saisonnier', 'rare', 'en_rupture', 'discontinue']).optional(),
        usageNotes: z.string().optional(),
        blendingTips: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createRawMaterial(input as any);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          latinName: z.string().optional(),
          category: z.enum(['huile_essentielle', 'absolue', 'concrete', 'resinoid', 'teinture', 'co2_extract', 'hydrolat', 'beurre', 'cire', 'oleoresine', 'infusion', 'maceration', 'distillat', 'autre']).optional(),
          plantId: z.number().optional(),
          plantPart: z.enum(['fleur', 'feuille', 'tige', 'racine', 'ecorce', 'bois', 'resine', 'graine', 'fruit', 'zeste', 'plante_entiere', 'bourgeon', 'autre']).optional(),
          terroirId: z.number().optional(),
          originCountry: z.string().optional(),
          originRegion: z.string().optional(),
          olfactiveProfile: z.string().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateRawMaterial(input.id, input.data as any);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteRawMaterial(input);
        return { success: true };
      }),
    addMolecule: protectedProcedure
      .input(z.object({
        rawMaterialId: z.number(),
        moleculeId: z.number(),
        percentage: z.string().optional(),
        isSignature: z.number().optional(),
        variability: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.addMoleculeToRawMaterial(input as any);
      }),
    removeMolecule: protectedProcedure
      .input(z.object({
        rawMaterialId: z.number(),
        moleculeId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.removeMoleculeFromRawMaterial(input.rawMaterialId, input.moleculeId);
        return { success: true };
      }),
  }),

  moleculePlantSources: router({
    getByMolecule: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getMoleculePlantSources(input);
      }),
    getByPlant: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getPlantMoleculeSources(input);
      }),
    add: protectedProcedure
      .input(z.object({
        moleculeId: z.number(),
        plantId: z.number(),
        plantPart: z.string().optional(),
        percentageInPlant: z.string().optional(),
        percentageInOil: z.string().optional(),
        variability: z.enum(['stable', 'variable', 'tres_variable', 'chemotype_dependant']).optional(),
        isMainSource: z.number().optional(),
        isPrimarySource: z.number().optional(),
        bestExtractionMethod: z.string().optional(),
        extractionYield: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.addMoleculePlantSource(input as any);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          plantPart: z.string().optional(),
          percentageInPlant: z.string().optional(),
          percentageInOil: z.string().optional(),
          variability: z.enum(['stable', 'variable', 'tres_variable', 'chemotype_dependant']).optional(),
          isMainSource: z.number().optional(),
          isPrimarySource: z.number().optional(),
          bestExtractionMethod: z.string().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateMoleculePlantSource(input.id, input.data as any);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteMoleculePlantSource(input);
        return { success: true };
      }),
  }),

  terroirSpecialties: router({
    getByTerroir: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getTerroirSpecialties(input);
      }),
    getByPlant: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getPlantTerroirSpecialties(input);
      }),
    add: protectedProcedure
      .input(z.object({
        terroirId: z.number(),
        plantId: z.number().optional(),
        rawMaterialId: z.number().optional(),
        isSignature: z.number().optional(),
        importance: z.enum(['majeure', 'significative', 'mineure', 'emergente']).optional(),
        annualProduction: z.string().optional(),
        productionTrend: z.enum(['croissante', 'stable', 'decroissante', 'variable']).optional(),
        qualityReputation: z.enum(['exceptionnelle', 'excellente', 'bonne', 'standard']).optional(),
        uniqueCharacteristics: z.string().optional(),
        historicalContext: z.string().optional(),
        traditionSince: z.string().optional(),
        economicImportance: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.addTerroirSpecialty(input as any);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          isSignature: z.number().optional(),
          importance: z.enum(['majeure', 'significative', 'mineure', 'emergente']).optional(),
          annualProduction: z.string().optional(),
          productionTrend: z.enum(['croissante', 'stable', 'decroissante', 'variable']).optional(),
          qualityReputation: z.enum(['exceptionnelle', 'excellente', 'bonne', 'standard']).optional(),
          uniqueCharacteristics: z.string().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateTerroirSpecialty(input.id, input.data as any);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteTerroirSpecialty(input);
        return { success: true };
      }),
  }),

  // Profils complets avec toutes les relations
  fullProfiles: router({
    getMolecule: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getFullMoleculeProfile(input);
      }),
    getPlant: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getFullPlantProfile(input);
      }),
    getTerroir: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getFullTerroirProfile(input);
      }),
  }),

  // Recherche avancée
  advancedSearch: router({
    moleculesByPlant: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.searchMoleculesByPlantSource(input);
      }),
    rawMaterialsByMolecule: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.searchRawMaterialsByMolecule(input);
      }),
    // Recherche croisée terroirs ↔ plantes ↔ molécules
    crossSearch: publicProcedure
      .input(z.object({
        terroirIds: z.array(z.number()).optional(),
        terroirCountries: z.array(z.string()).optional(),
        terroirClimates: z.array(z.string()).optional(),
        plantIds: z.array(z.number()).optional(),
        plantCategories: z.array(z.string()).optional(),
        plantFamilies: z.array(z.string()).optional(),
        moleculeIds: z.array(z.number()).optional(),
        moleculeFamilies: z.array(z.string()).optional(),
        chemicalClasses: z.array(z.string()).optional(),
        searchQuery: z.string().optional(),
        includeRelations: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.crossSearch(input || {});
      }),
    // Options de filtres pour la recherche croisée
    getCrossSearchFilterOptions: publicProcedure.query(async () => {
      return db.getCrossSearchFilterOptions();
    }),
  }),

  // Statistiques de contenu
  contentStats: router({
    getAll: publicProcedure.query(async () => {
      return db.getContentStatistics();
    }),
  }),

  // Chémotypes (variations chimiques au sein d'une même espèce)
  chemotypes: router({
    getAll: publicProcedure.query(async () => {
      return db.getAllChemotypes();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getChemotypeById(input);
      }),
    getByPlantId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getChemotypesByPlantId(input);
      }),
    getByPlantName: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getChemotypesByPlantName(input);
      }),
    search: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.searchChemotypes(input);
      }),
    getStats: publicProcedure.query(async () => {
      return db.getChemotypesStats();
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        code: z.string().optional(),
        plantId: z.number().optional(),
        plantName: z.string(),
        latinName: z.string().optional(),
        dominantMoleculeId: z.number().optional(),
        dominantMoleculeName: z.string(),
        dominantPercentage: z.string().optional(),
        dominantPercentageMin: z.number().optional(),
        dominantPercentageMax: z.number().optional(),
        secondaryMolecules: z.array(z.object({
          name: z.string(),
          percentage: z.string().optional(),
          percentageMin: z.number().optional(),
          percentageMax: z.number().optional(),
        })).optional(),
        origin: z.string().optional(),
        terroir: z.string().optional(),
        altitude: z.string().optional(),
        climate: z.string().optional(),
        olfactiveProfile: z.string().optional(),
        olfactiveNotes: z.object({
          top: z.array(z.string()),
          heart: z.array(z.string()),
          base: z.array(z.string()),
        }).optional(),
        intensity: z.number().optional(),
        therapeuticProperties: z.string().optional(),
        contraindications: z.string().optional(),
        toxicity: z.enum(['faible', 'modérée', 'élevée']).optional(),
        perfumeryUse: z.string().optional(),
        blendingNotes: z.string().optional(),
        recommendedDilution: z.string().optional(),
        climaticAxis: z.enum(['vent', 'bois', 'disparition', 'vent_bois', 'bois_disparition', 'vent_disparition']).optional(),
        imageUrl: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createChemotype(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          code: z.string().optional(),
          plantId: z.number().optional(),
          plantName: z.string().optional(),
          latinName: z.string().optional(),
          dominantMoleculeId: z.number().optional(),
          dominantMoleculeName: z.string().optional(),
          dominantPercentage: z.string().optional(),
          dominantPercentageMin: z.number().optional(),
          dominantPercentageMax: z.number().optional(),
          origin: z.string().optional(),
          terroir: z.string().optional(),
          altitude: z.string().optional(),
          climate: z.string().optional(),
          olfactiveProfile: z.string().optional(),
          intensity: z.number().optional(),
          therapeuticProperties: z.string().optional(),
          contraindications: z.string().optional(),
          toxicity: z.enum(['faible', 'modérée', 'élevée']).optional(),
          perfumeryUse: z.string().optional(),
          blendingNotes: z.string().optional(),
          recommendedDilution: z.string().optional(),
          climaticAxis: z.enum(['vent', 'bois', 'disparition', 'vent_bois', 'bois_disparition', 'vent_disparition']).optional(),
          imageUrl: z.string().optional(),
          notes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateChemotype(input.id, input.data);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteChemotype(input);
      }),
  }),

  // Catégories IFRA et calcul des limites
  ifraCategories: router({
    list: publicProcedure.query(async () => {
      return db.getAllIfraCategories();
    }),
    getByCode: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getIfraCategoryByCode(input);
      }),
    calculateLimit: publicProcedure
      .input(z.object({
        moleculeId: z.number(),
        categoryCode: z.string(),
      }))
      .query(async ({ input }) => {
        return db.calculateIfraLimit(input.moleculeId, input.categoryCode);
      }),
    checkCompliance: publicProcedure
      .input(z.object({
        moleculeId: z.number(),
        categoryCode: z.string(),
        concentration: z.number(),
      }))
      .query(async ({ input }) => {
        return db.checkIfraCompliance(input.moleculeId, input.categoryCode, input.concentration);
      }),
    searchByName: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.searchIfraRestrictionsByName(input);
      }),
    getStats: publicProcedure.query(async () => {
      return db.getIfraStats();
    }),
  }),

  // Upload d'images pour les échantillons botaniques
  upload: router({
    leafEconomyImage: protectedProcedure
      .input(z.object({
        leafEconomyId: z.number(),
        imageData: z.string(), // Base64 encoded image
        fileName: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { storagePut } = await import('./storage');
        
        // Décoder le base64
        const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const extension = input.fileName.split('.').pop() || 'jpg';
        const fileKey = `leaf-economies/${input.leafEconomyId}/${timestamp}-${randomSuffix}.${extension}`;
        
        // Upload vers S3
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        // Mettre à jour la base de données
        await db.updateLeafEconomy(input.leafEconomyId, { imageUrl: url });
        
        return { url };
      }),
    
    // Upload générique vers S3 pour la galerie
    galleryImage: protectedProcedure
      .input(z.object({
        imageData: z.string(), // Base64 encoded image
        fileName: z.string(),
        contentType: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        leafEconomyId: z.number().optional(),
        plantId: z.number().optional(),
        category: z.enum(['echantillon', 'extraction', 'analyse', 'terrain', 'equipement', 'autre']).default('echantillon'),
        tags: z.array(z.string()).optional(),
        location: z.string().optional(),
        capturedAt: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { storagePut } = await import('./storage');
        
        // Décoder le base64
        const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const extension = input.fileName.split('.').pop() || 'jpg';
        const fileKey = `gallery/${input.category}/${timestamp}-${randomSuffix}.${extension}`;
        
        // Upload vers S3
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        // Créer l'entrée dans la base de données
        const imageData = await db.createSampleImage({
          url,
          fileKey,
          fileName: input.fileName,
          mimeType: input.contentType,
          fileSize: buffer.length,
          title: input.title,
          description: input.description,
          leafEconomyId: input.leafEconomyId,
          plantId: input.plantId,
          category: input.category,
          tags: input.tags,
          location: input.location,
          capturedAt: input.capturedAt ? new Date(input.capturedAt) : undefined,
          uploadedBy: ctx.user?.id,
        });
        
        return imageData;
      }),
  }),

  // Galerie d'images
  gallery: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        leafEconomyId: z.number().optional(),
        plantId: z.number().optional(),
        limit: z.number().default(50),
      }).optional())
      .query(async ({ input }) => {
        if (input?.category) {
          return db.getSampleImagesByCategory(input.category);
        }
        if (input?.leafEconomyId) {
          return db.getSampleImagesByLeafEconomy(input.leafEconomyId);
        }
        if (input?.plantId) {
          return db.getSampleImagesByPlant(input.plantId);
        }
        return db.getAllSampleImages();
      }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getSampleImageById(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          category: z.enum(['echantillon', 'extraction', 'analyse', 'terrain', 'equipement', 'autre']).optional(),
          tags: z.array(z.string()).optional(),
          location: z.string().optional(),
          capturedAt: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateSampleImage(input.id, {
          ...input.data,
          capturedAt: input.data.capturedAt ? new Date(input.data.capturedAt) : undefined,
        });
      }),
    
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteSampleImage(input);
        return { success: true };
      }),
    
    searchByTags: publicProcedure
      .input(z.array(z.string()))
      .query(async ({ input }) => {
        return db.searchSampleImagesByTags(input);
      }),
    
    getStats: publicProcedure.query(async () => {
      return db.getSampleImagesStats();
    }),
  }),

  // Calculateur de conformité IFRA avancé
  ifraCalculator: router({
    // Vérifier la conformité d'une formule complète
    checkFormula: publicProcedure
      .input(z.object({
        categoryCode: z.string(),
        ingredients: z.array(z.object({
          moleculeId: z.number(),
          concentration: z.number(), // % dans la formule finale
        })),
      }))
      .query(async ({ input }) => {
        const restrictions = await db.getAllIfraRestrictions();
        const results: Array<{
          moleculeId: number;
          moleculeName: string;
          concentration: number;
          limit: number | null;
          isCompliant: boolean;
          margin: number | null;
          restrictionType: string;
        }> = [];
        
        // Mapping des codes de catégorie vers les colonnes
        const categoryMap: Record<string, string> = {
          '1': 'category1',
          '2': 'category2',
          '3': 'category3',
          '4': 'category4',
          '5A': 'category5a',
          '5B': 'category5b',
          '5C': 'category5c',
          '5D': 'category5d',
          '6': 'category6',
          '7A': 'category7a',
          '7B': 'category7b',
          '8': 'category8',
          '9': 'category9',
          '10A': 'category10a',
          '10B': 'category10b',
          '11A': 'category11a',
          '11B': 'category11b',
        };
        
        const column = categoryMap[input.categoryCode.toUpperCase()];
        
        for (const ingredient of input.ingredients) {
          const restriction = restrictions.find(r => r.molecule.id === ingredient.moleculeId);
          
          if (!restriction) {
            // Pas de restriction connue
            results.push({
              moleculeId: ingredient.moleculeId,
              moleculeName: 'Molécule inconnue',
              concentration: ingredient.concentration,
              limit: null,
              isCompliant: true,
              margin: null,
              restrictionType: 'no_restriction',
            });
            continue;
          }
          
          const limit = column ? (restriction.restriction as any)[column] : null;
          const limitNum = limit ? parseFloat(limit) : null;
          
          let isCompliant = true;
          let margin: number | null = null;
          
          if (restriction.restriction.restrictionType === 'prohibited') {
            isCompliant = false;
          } else if (limitNum !== null && limitNum > 0) {
            isCompliant = ingredient.concentration <= limitNum;
            margin = limitNum - ingredient.concentration;
          }
          
          results.push({
            moleculeId: ingredient.moleculeId,
            moleculeName: restriction.molecule.name,
            concentration: ingredient.concentration,
            limit: limitNum,
            isCompliant,
            margin,
            restrictionType: restriction.restriction.restrictionType || 'no_restriction',
          });
        }
        
        const allCompliant = results.every(r => r.isCompliant);
        const nonCompliantCount = results.filter(r => !r.isCompliant).length;
        
        return {
          isCompliant: allCompliant,
          nonCompliantCount,
          totalIngredients: input.ingredients.length,
          results,
        };
      }),
    
    // Récupérer les limites pour une catégorie donnée
    getLimitsForCategory: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const restrictions = await db.getAllIfraRestrictions();
        
        const categoryMap: Record<string, string> = {
          '1': 'category1',
          '2': 'category2',
          '3': 'category3',
          '4': 'category4',
          '5A': 'category5a',
          '5B': 'category5b',
          '5C': 'category5c',
          '5D': 'category5d',
          '6': 'category6',
          '7A': 'category7a',
          '7B': 'category7b',
          '8': 'category8',
          '9': 'category9',
          '10A': 'category10a',
          '10B': 'category10b',
          '11A': 'category11a',
          '11B': 'category11b',
        };
        
        const column = categoryMap[input.toUpperCase()];
        
        return restrictions.map(r => ({
          moleculeId: r.molecule.id,
          moleculeName: r.molecule.name,
          casNumber: r.molecule.casNumber,
          limit: column ? (r.restriction as any)[column] : null,
          restrictionType: r.restriction.restrictionType,
          reason: r.restriction.reasonForRestriction,
        })).filter(r => r.limit !== null || r.restrictionType === 'prohibited');
      }),
  }),

  // Import batch d'images
  batchImport: router({
    getCsvTemplate: publicProcedure.query(() => {
      return {
        headers: ['filename', 'title', 'description', 'category', 'leaf_economy_id', 'plant_id', 'tags', 'location', 'captured_at'],
        categories: ['echantillon', 'extraction', 'analyse', 'terrain', 'equipement', 'autre'],
        example: 'photo1.jpg,Ma photo,Description de la photo,echantillon,1,,botanique;terrain,San Andrés,2024-01-15',
        instructions: [
          'filename (requis): Nom du fichier image dans le ZIP',
          'title: Titre de l\'image',
          'description: Description détaillée',
          'category: echantillon, extraction, analyse, terrain, equipement, autre',
          'leaf_economy_id: ID de l\'échantillon LeafEconomy associé',
          'plant_id: ID de la plante associée',
          'tags: Tags séparés par des points-virgules',
          'location: Lieu de la prise de vue',
          'captured_at: Date de capture (YYYY-MM-DD)',
        ],
      };
    }),

    validateCsv: protectedProcedure
      .input(z.object({ csvContent: z.string() }))
      .mutation(async ({ input }) => {
        const lines = input.csvContent.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          return { valid: false, error: 'Le CSV doit contenir au moins un en-tête et une ligne de données', totalRows: 0, validRows: 0, rows: [] };
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        if (!headers.includes('filename')) {
          return { valid: false, error: 'La colonne "filename" est requise', totalRows: 0, validRows: 0, rows: [] };
        }

        const filenameIndex = headers.indexOf('filename');
        const titleIndex = headers.indexOf('title');
        const descriptionIndex = headers.indexOf('description');
        const categoryIndex = headers.indexOf('category');
        const leafEconomyIdIndex = headers.indexOf('leaf_economy_id');
        const plantIdIndex = headers.indexOf('plant_id');
        const tagsIndex = headers.indexOf('tags');
        const locationIndex = headers.indexOf('location');

        const validCategories = ['echantillon', 'extraction', 'analyse', 'terrain', 'equipement', 'autre'];
        const rows: any[] = [];
        let validCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const filename = values[filenameIndex] || '';
          const category = values[categoryIndex] || 'echantillon';
          const tags = tagsIndex >= 0 && values[tagsIndex] ? values[tagsIndex].split(';').map(t => t.trim()).filter(Boolean) : [];

          const row = {
            filename,
            title: titleIndex >= 0 ? values[titleIndex] : '',
            description: descriptionIndex >= 0 ? values[descriptionIndex] : '',
            category,
            leafEconomyId: leafEconomyIdIndex >= 0 && values[leafEconomyIdIndex] ? parseInt(values[leafEconomyIdIndex]) : null,
            plantId: plantIdIndex >= 0 && values[plantIdIndex] ? parseInt(values[plantIdIndex]) : null,
            tags,
            location: locationIndex >= 0 ? values[locationIndex] : '',
            valid: true,
            error: '',
          };

          if (!filename) {
            row.valid = false;
            row.error = 'Nom de fichier manquant';
          } else if (!validCategories.includes(category.toLowerCase())) {
            row.valid = false;
            row.error = `Catégorie invalide: ${category}`;
          }

          if (row.valid) validCount++;
          rows.push(row);
        }

        return {
          valid: validCount === rows.length,
          totalRows: rows.length,
          validRows: validCount,
          rows,
          error: validCount < rows.length ? `${rows.length - validCount} ligne(s) avec erreurs` : null,
        };
      }),

    importZip: protectedProcedure
      .input(z.object({
        zipData: z.string(), // Base64 encoded ZIP
        csvContent: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const JSZip = (await import('jszip')).default;
        const { storagePut } = await import('./storage');

        // Décoder le ZIP
        const zipBuffer = Buffer.from(input.zipData, 'base64');
        const zip = await JSZip.loadAsync(zipBuffer);

        // Parser le CSV
        const lines = input.csvContent.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const filenameIndex = headers.indexOf('filename');
        const titleIndex = headers.indexOf('title');
        const descriptionIndex = headers.indexOf('description');
        const categoryIndex = headers.indexOf('category');
        const leafEconomyIdIndex = headers.indexOf('leaf_economy_id');
        const plantIdIndex = headers.indexOf('plant_id');
        const tagsIndex = headers.indexOf('tags');
        const locationIndex = headers.indexOf('location');

        const results: Array<{ filename: string; success: boolean; imageId?: number; error?: string }> = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const filename = values[filenameIndex];

          try {
            // Trouver le fichier dans le ZIP
            let zipFile = zip.file(filename);
            if (!zipFile) {
              // Essayer avec une recherche par regex
              const matches = zip.file(new RegExp(filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
              if (Array.isArray(matches) && matches.length > 0) {
                zipFile = matches[0];
              }
            }
            if (!zipFile) {
              results.push({ filename, success: false, error: 'Fichier non trouvé dans le ZIP' });
              continue;
            }

            // Extraire le fichier
            const fileData = await zipFile.async('nodebuffer');
            const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
            const mimeType = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

            // Générer un nom unique
            const uniqueFilename = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

            // Upload vers S3
            const { url } = await storagePut(uniqueFilename, fileData, mimeType);

            // Créer l'entrée en base
            const imageData = {
              url,
              fileKey: uniqueFilename,
              fileName: filename,
              mimeType,
              fileSize: fileData.length,
              title: titleIndex >= 0 && values[titleIndex] ? values[titleIndex] : filename,
              description: descriptionIndex >= 0 && values[descriptionIndex] ? values[descriptionIndex] : null,
              category: (categoryIndex >= 0 && values[categoryIndex] ? values[categoryIndex].toLowerCase() : 'echantillon') as 'echantillon' | 'extraction' | 'analyse' | 'terrain' | 'equipement' | 'autre',
              leafEconomyId: leafEconomyIdIndex >= 0 && values[leafEconomyIdIndex] ? parseInt(values[leafEconomyIdIndex]) : null,
              plantId: plantIdIndex >= 0 && values[plantIdIndex] ? parseInt(values[plantIdIndex]) : null,
              tags: tagsIndex >= 0 && values[tagsIndex] ? values[tagsIndex].split(';').map(t => t.trim()).filter(Boolean) : null,
              location: locationIndex >= 0 && values[locationIndex] ? values[locationIndex] : null,
              uploadedBy: ctx.user.id,
            };

            const newImage = await db.createSampleImage(imageData);
            results.push({ filename, success: true, imageId: newImage?.id });
          } catch (error) {
            results.push({ filename, success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' });
          }
        }

        return {
          totalProcessed: results.length,
          successCount: results.filter(r => r.success).length,
          errorCount: results.filter(r => !r.success).length,
          results,
        };
      }),
  }),

  // =======  // ========================================================================
  // CSV IMPORT
  // ========================================================================

  importMolecules: protectedProcedure
    .input(
      z.object({
        molecules: z.array(
          z.object({
            name: z.string(),
            family: z.string().optional(),
            odorKey: z.string().optional(),
            role: z.string().optional(),
            climaticAxis: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const imported = [];
      const errors = [];

      for (const mol of input.molecules) {
        try {
          const existing = await db.getMoleculeByName(mol.name);
          if (existing) {
            errors.push(`Molécule "${mol.name}" existe déjà`);
            continue;
          }

          const result = await db.createMolecule({
            name: mol.name,
            family: mol.family || null,
            olfactiveProfile: mol.odorKey || null,
            functionalEffect: mol.role || null,
            notes: mol.climaticAxis ? `Axe climatique: ${mol.climaticAxis}` : null,
          });
          imported.push(result);
        } catch (error) {
          errors.push(`Erreur pour "${mol.name}": ${error}`);
        }
      }

      return {
        success: true,
        imported: imported.length,
        errors,
      };
    }),

  importPlants: protectedProcedure
    .input(
      z.object({
        plants: z.array(
          z.object({
            name: z.string(),
            latinName: z.string().optional(),
            family: z.string().optional(),
            category: z.string().optional(),
            origin: z.string().optional(),
            habitat: z.string().optional(),
            olfactiveSignature: z.string().optional(),
            dominantMolecules: z.string().optional(),
            climaticAxis: z.string().optional(),
            traditionalUse: z.string().optional(),
            absorbeUse: z.string().optional(),
            kingdom: z.string().optional(),
            division: z.string().optional(),
            class: z.string().optional(),
            order: z.string().optional(),
            genus: z.string().optional(),
            species: z.string().optional(),
            lifeCycle: z.string().optional(),
            harvestPeriod: z.string().optional(),
            essentialOilYield: z.string().optional(),
            notes: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const imported = [];
      const errors = [];

      for (const plant of input.plants) {
        try {
          const existing = await db.getPlantByLatinName(plant.latinName || plant.name);
          if (existing) {
            errors.push(`Plante "${plant.name}" existe déjà`);
            continue;
          }

          // Map category to enum value
          let category: "aromatique" | "tabac" | "cannabis" | "resine" | "bois" | "fleur" | "racine" | "autre" = "autre";
          if (plant.category === "aromatique") category = "aromatique";
          else if (plant.category === "tabac") category = "tabac";
          else if (plant.category === "cannabis") category = "cannabis";
          else if (plant.category === "resine") category = "resine";
          else if (plant.category === "bois") category = "bois";
          else if (plant.category === "fleur") category = "fleur";
          else if (plant.category === "racine") category = "racine";

          // Map climatic axis to enum value
          let climaticAxis: "vent" | "bois" | "disparition" | "vent_bois" | "bois_disparition" | "vent_disparition" | null = null;
          if (plant.climaticAxis?.includes("vent") && plant.climaticAxis?.includes("bois")) climaticAxis = "vent_bois";
          else if (plant.climaticAxis?.includes("bois") && plant.climaticAxis?.includes("disparition")) climaticAxis = "bois_disparition";
          else if (plant.climaticAxis?.includes("vent") && plant.climaticAxis?.includes("disparition")) climaticAxis = "vent_disparition";
          else if (plant.climaticAxis?.includes("vent")) climaticAxis = "vent";
          else if (plant.climaticAxis?.includes("bois")) climaticAxis = "bois";
          else if (plant.climaticAxis?.includes("disparition")) climaticAxis = "disparition";

          const result = await db.createPlant({
            name: plant.name,
            latinName: plant.latinName || null,
            family: plant.family || null,
            category,
            origin: plant.origin || null,
            habitat: plant.habitat || null,
            olfactiveSignature: plant.olfactiveSignature || null,
            dominantMolecules: plant.dominantMolecules || null,
            climaticAxis,
            traditionalUse: plant.traditionalUse || null,
            absorbeUse: plant.absorbeUse || null,
            notes: [
              plant.kingdom && `Règne: ${plant.kingdom}`,
              plant.division && `Division: ${plant.division}`,
              plant.class && `Classe: ${plant.class}`,
              plant.order && `Ordre: ${plant.order}`,
              plant.genus && `Genre: ${plant.genus}`,
              plant.species && `Espèce: ${plant.species}`,
              plant.lifeCycle && `Cycle: ${plant.lifeCycle}`,
              plant.harvestPeriod && `Récolte: ${plant.harvestPeriod}`,
              plant.essentialOilYield && `Rendement HE: ${plant.essentialOilYield}`,
              plant.notes,
            ]
              .filter(Boolean)
              .join(" | "),
          });
          imported.push(result);
        } catch (error) {
          errors.push(`Erreur pour "${plant.name}": ${error}`);
        }
      }

      return {
        success: true,
        imported: imported.length,
        errors,
      };
    }),

  // ========================================================================
  // SYSTEM
  // ====================================================================================
  pubchem: router({
    // Enrichir une seule molécule
    enrichMolecule: publicProcedure
      .input(z.object({
        moleculeId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { enrichMolecule, inferChemicalClass } = await import('./pubchem');
        
        // Récupérer la molécule
        const molecule = await db.getMoleculeById(input.moleculeId);
        if (!molecule) {
          throw new Error('Molécule non trouvée');
        }
        
        // Enrichir via PubChem
        const result = await enrichMolecule(molecule.name);
        
        if (result.success) {
          // Mettre à jour la molécule
          const chemicalClass = inferChemicalClass(result.iupacName, result.molecularFormula);
          
          await db.updateMoleculeScientificData(input.moleculeId, {
            casNumber: result.casNumber || molecule.casNumber || undefined,
            iupacName: result.iupacName || molecule.iupacName || undefined,
            chemicalClass: (chemicalClass || molecule.chemicalClass || undefined) as any,
          });
          
          // Ajouter une référence PubChem
          const existingRefs = molecule.references || [];
          const pubchemRef = {
            title: `PubChem CID: ${result.pubchemCID}`,
            url: `https://pubchem.ncbi.nlm.nih.gov/compound/${result.pubchemCID}`,
            type: 'pubchem' as const,
          };
          
          // Éviter les doublons
          if (!existingRefs.some(r => r.type === 'pubchem' && r.url === pubchemRef.url)) {
            await db.updateMoleculeReferences(input.moleculeId, JSON.stringify([...existingRefs, pubchemRef]));
          }
        }
        
        return result;
      }),
    
    // Enrichir plusieurs molécules en lot
    enrichBatch: publicProcedure
      .input(z.object({
        moleculeIds: z.array(z.number()),
      }))
      .mutation(async ({ input }) => {
        const { enrichMolecule, inferChemicalClass } = await import('./pubchem');
        
        const results: Array<{
          moleculeId: number;
          moleculeName: string;
          success: boolean;
          casNumber?: string;
          iupacName?: string;
          error?: string;
        }> = [];
        
        for (const moleculeId of input.moleculeIds) {
          const molecule = await db.getMoleculeById(moleculeId);
          if (!molecule) {
            results.push({
              moleculeId,
              moleculeName: 'Inconnu',
              success: false,
              error: 'Molécule non trouvée',
            });
            continue;
          }
          
          const result = await enrichMolecule(molecule.name);
          
          if (result.success) {
            const chemicalClass = inferChemicalClass(result.iupacName, result.molecularFormula);
            
            await db.updateMoleculeScientificData(moleculeId, {
              casNumber: result.casNumber || molecule.casNumber || undefined,
              iupacName: result.iupacName || molecule.iupacName || undefined,
              chemicalClass: (chemicalClass || molecule.chemicalClass || undefined) as any,
            });
            
            // Ajouter référence PubChem
            const existingRefs = molecule.references || [];
            if (result.pubchemCID && !existingRefs.some(r => r.type === 'pubchem')) {
              await db.updateMoleculeReferences(moleculeId, JSON.stringify([...existingRefs, {
                title: `PubChem CID: ${result.pubchemCID}`,
                url: `https://pubchem.ncbi.nlm.nih.gov/compound/${result.pubchemCID}`,
                type: 'pubchem' as const,
              }]));
            }
          }
          
          results.push({
            moleculeId,
            moleculeName: molecule.name,
            success: result.success,
            casNumber: result.casNumber,
            iupacName: result.iupacName,
            error: result.error,
          });
          
          // Délai pour respecter les limites de l'API
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        return {
          total: results.length,
          success: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          results,
        };
      }),
    
    // Obtenir les molécules à enrichir
    getMoleculesToEnrich: publicProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const allMolecules = await db.getAllMolecules();
        
        // Filtrer les molécules sans CAS ou IUPAC
        const toEnrich = allMolecules.filter(m => 
          !m.casNumber || m.casNumber === '' || !m.iupacName || m.iupacName === ''
        );
        
        return {
          total: toEnrich.length,
          molecules: toEnrich.slice(input.offset, input.offset + input.limit),
        };
      }),
    
    // Statistiques d'enrichissement
    getEnrichmentStats: publicProcedure.query(async () => {
      const allMolecules = await db.getAllMolecules();
      
      // Helper pour parser les références (peut être string JSON ou tableau)
      const parseRefs = (refs: any): any[] => {
        if (!refs) return [];
        if (Array.isArray(refs)) return refs;
        if (typeof refs === 'string') {
          try {
            const parsed = JSON.parse(refs);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };
      
      const stats = {
        total: allMolecules.length,
        withCAS: allMolecules.filter(m => m.casNumber && m.casNumber !== '').length,
        withIUPAC: allMolecules.filter(m => m.iupacName && m.iupacName !== '').length,
        withChemicalClass: allMolecules.filter(m => m.chemicalClass).length,
        withMolecularWeight: allMolecules.filter(m => m.molecularWeight).length,
        withBoilingPoint: allMolecules.filter(m => m.boilingPoint).length,
        withPubChemRef: allMolecules.filter(m => parseRefs(m.references).some((r: any) => r.type === 'pubchem')).length,
      };
      
      return {
        ...stats,
        missingCAS: stats.total - stats.withCAS,
        missingIUPAC: stats.total - stats.withIUPAC,
        completeness: stats.total > 0 ? Math.round((stats.withCAS + stats.withIUPAC) / (stats.total * 2) * 100) : 0,
      };
    }),
    
    // Mode batch automatique - obtenir toutes les molécules à enrichir
    getAllMoleculesToEnrich: publicProcedure.query(async () => {
      const allMolecules = await db.getAllMolecules();
      
      // Helper pour parser les références (peut être string JSON ou tableau)
      const parseRefs = (refs: any): any[] => {
        if (!refs) return [];
        if (Array.isArray(refs)) return refs;
        if (typeof refs === 'string') {
          try {
            const parsed = JSON.parse(refs);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };
      
      // Filtrer les molécules sans CAS ou sans référence PubChem
      const toEnrich = allMolecules.filter(m => 
        !m.casNumber || m.casNumber === '' || !parseRefs(m.references).some((r: any) => r.type === 'pubchem')
      );
      
      return {
        total: toEnrich.length,
        molecules: toEnrich.map(m => ({
          id: m.id,
          name: m.name,
          hasCAS: !!(m.casNumber && m.casNumber !== ''),
          hasIUPAC: !!(m.iupacName && m.iupacName !== ''),
          hasPubChemRef: parseRefs(m.references).some((r: any) => r.type === 'pubchem'),
        })),
      };
    }),
    
    // Mode batch automatique - enrichir un lot avec progression
    enrichBatchAuto: publicProcedure
      .input(z.object({
        batchSize: z.number().min(1).max(20).default(10),
        startIndex: z.number().min(0).default(0),
      }))
      .mutation(async ({ input }) => {
        const { enrichMolecule, inferChemicalClass } = await import('./pubchem');
        
        const allMolecules = await db.getAllMolecules();
        
        // Filtrer les molécules sans CAS ou sans référence PubChem
        const toEnrich = allMolecules.filter(m => 
          !m.casNumber || m.casNumber === '' || !m.references?.some(r => r.type === 'pubchem')
        );
        
        // Prendre le lot demandé
        const batch = toEnrich.slice(input.startIndex, input.startIndex + input.batchSize);
        
        const results: Array<{
          moleculeId: number;
          moleculeName: string;
          success: boolean;
          casNumber?: string;
          iupacName?: string;
          error?: string;
        }> = [];
        
        for (const molecule of batch) {
          try {
            const result = await enrichMolecule(molecule.name);
            
            if (result.success) {
              const chemicalClass = inferChemicalClass(result.iupacName, result.molecularFormula);
              
              await db.updateMoleculeScientificData(molecule.id, {
                casNumber: result.casNumber || molecule.casNumber || undefined,
                iupacName: result.iupacName || molecule.iupacName || undefined,
                chemicalClass: (chemicalClass || molecule.chemicalClass || undefined) as any,
              });
              
              // Ajouter référence PubChem
              const existingRefs = molecule.references || [];
              if (result.pubchemCID && !existingRefs.some(r => r.type === 'pubchem')) {
                await db.updateMoleculeReferences(molecule.id, JSON.stringify([...existingRefs, {
                  title: `PubChem CID: ${result.pubchemCID}`,
                  url: `https://pubchem.ncbi.nlm.nih.gov/compound/${result.pubchemCID}`,
                  type: 'pubchem' as const,
                }]));
              }
            }
            
            results.push({
              moleculeId: molecule.id,
              moleculeName: molecule.name,
              success: result.success,
              casNumber: result.casNumber,
              iupacName: result.iupacName,
              error: result.error,
            });
          } catch (error) {
            results.push({
              moleculeId: molecule.id,
              moleculeName: molecule.name,
              success: false,
              error: error instanceof Error ? error.message : 'Erreur inconnue',
            });
          }
          
          // Délai pour respecter les limites de l'API PubChem (5 req/s)
          await new Promise(resolve => setTimeout(resolve, 600));
        }
        
        return {
          batchIndex: input.startIndex,
          batchSize: batch.length,
          totalRemaining: toEnrich.length - input.startIndex - batch.length,
          totalToEnrich: toEnrich.length,
          processed: results.length,
          success: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          hasMore: input.startIndex + batch.length < toEnrich.length,
          nextStartIndex: input.startIndex + batch.length,
          results,
        };
      }),
  }),

  // ============================================================================
  // VISUALISATIONS ET CORRÉLATIONS
  // ============================================================================
  visualizations: router({
    // Données pour le graphique masse moléculaire vs point d'ébullition
    getMolecularWeightVsBoilingPoint: publicProcedure.query(async () => {
      const molecules = await db.getAllMolecules();
      
      return molecules
        .filter(m => m.molecularWeight && m.boilingPoint)
        .map(m => ({
          id: m.id,
          name: m.name,
          molecularWeight: m.molecularWeight,
          boilingPoint: m.boilingPoint,
          chemicalClass: m.chemicalClass || 'other',
          family: m.family || 'Inconnue',
        }));
    }),
    
    // Données pour le graphique classe chimique vs famille olfactive
    getChemicalClassVsOlfactiveFamily: publicProcedure.query(async () => {
      const molecules = await db.getAllMolecules();
      
      // Créer une matrice de corrélation
      const matrix: Record<string, Record<string, number>> = {};
      
      for (const m of molecules) {
        const chemClass = m.chemicalClass || 'other';
        const family = m.family || 'Inconnue';
        
        if (!matrix[chemClass]) {
          matrix[chemClass] = {};
        }
        matrix[chemClass][family] = (matrix[chemClass][family] || 0) + 1;
      }
      
      // Convertir en format pour heatmap
      const data: Array<{ chemicalClass: string; family: string; count: number }> = [];
      
      for (const [chemClass, families] of Object.entries(matrix)) {
        for (const [family, count] of Object.entries(families)) {
          data.push({ chemicalClass: chemClass, family, count });
        }
      }
      
      return {
        data,
        chemicalClasses: Object.keys(matrix),
        families: Array.from(new Set(molecules.map(m => m.family || 'Inconnue'))),
      };
    }),
    
    // Distribution des propriétés moléculaires
    getMolecularPropertyDistribution: publicProcedure
      .input(z.object({
        property: z.enum(['molecularWeight', 'boilingPoint', 'logP', 'complexity', 'intensity']),
      }))
      .query(async ({ input }) => {
        const molecules = await db.getAllMolecules();
        
        const values = molecules
          .map(m => m[input.property] as number | null)
          .filter((v): v is number => v !== null && v !== undefined);
        
        if (values.length === 0) {
          return { bins: [], min: 0, max: 0, mean: 0, median: 0 };
        }
        
        const min = Math.min(...values);
        const max = Math.max(...values);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const sorted = [...values].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        
        // Créer des bins pour l'histogramme
        const binCount = 20;
        const binSize = (max - min) / binCount;
        const bins: Array<{ min: number; max: number; count: number }> = [];
        
        for (let i = 0; i < binCount; i++) {
          const binMin = min + i * binSize;
          const binMax = min + (i + 1) * binSize;
          const count = values.filter(v => v >= binMin && v < binMax).length;
          bins.push({ min: binMin, max: binMax, count });
        }
        
        return { bins, min, max, mean, median };
      }),
    
    // Corrélation entre deux propriétés
    getPropertyCorrelation: publicProcedure
      .input(z.object({
        propertyX: z.enum(['molecularWeight', 'boilingPoint', 'logP', 'complexity', 'intensity', 'volatility']),
        propertyY: z.enum(['molecularWeight', 'boilingPoint', 'logP', 'complexity', 'intensity', 'volatility']),
      }))
      .query(async ({ input }) => {
        const molecules = await db.getAllMolecules();
        
        const points = molecules
          .filter(m => m[input.propertyX] !== null && m[input.propertyY] !== null)
          .map(m => ({
            id: m.id,
            name: m.name,
            x: m[input.propertyX] as number,
            y: m[input.propertyY] as number,
            chemicalClass: m.chemicalClass || 'other',
          }));
        
        // Calculer le coefficient de corrélation de Pearson
        if (points.length < 2) {
          return { points, correlation: 0, rSquared: 0 };
        }
        
        const n = points.length;
        const sumX = points.reduce((a, p) => a + p.x, 0);
        const sumY = points.reduce((a, p) => a + p.y, 0);
        const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
        const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
        const sumY2 = points.reduce((a, p) => a + p.y * p.y, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        const correlation = denominator === 0 ? 0 : numerator / denominator;
        const rSquared = correlation * correlation;
        
        return { points, correlation: Math.round(correlation * 1000) / 1000, rSquared: Math.round(rSquared * 1000) / 1000 };
      }),
    
    // Statistiques par classe chimique
    getStatsByChemicalClass: publicProcedure.query(async () => {
      const molecules = await db.getAllMolecules();
      
      const statsByClass: Record<string, {
        count: number;
        avgMolecularWeight: number;
        avgBoilingPoint: number;
        avgLogP: number;
        families: string[];
      }> = {};
      
      for (const m of molecules) {
        const chemClass = m.chemicalClass || 'other';
        
        if (!statsByClass[chemClass]) {
          statsByClass[chemClass] = {
            count: 0,
            avgMolecularWeight: 0,
            avgBoilingPoint: 0,
            avgLogP: 0,
            families: [],
          };
        }
        
        statsByClass[chemClass].count++;
        if (m.molecularWeight) statsByClass[chemClass].avgMolecularWeight += m.molecularWeight;
        if (m.boilingPoint) statsByClass[chemClass].avgBoilingPoint += m.boilingPoint;
        if (m.logP) statsByClass[chemClass].avgLogP += m.logP;
        if (m.family && !statsByClass[chemClass].families.includes(m.family)) {
          statsByClass[chemClass].families.push(m.family);
        }
      }
      
      // Calculer les moyennes
      for (const chemClass of Object.keys(statsByClass)) {
        const stats = statsByClass[chemClass];
        const count = stats.count;
        stats.avgMolecularWeight = Math.round(stats.avgMolecularWeight / count);
        stats.avgBoilingPoint = Math.round(stats.avgBoilingPoint / count);
        stats.avgLogP = Math.round(stats.avgLogP / count);
      }
      
      return statsByClass;
    }),
  }),

  // ============================================================================
  // EXPORT BIBLIOGRAPHIQUE (Citations)
  // ============================================================================
  citationExport: router({
    // Générer une citation pour une molécule
    generateMoleculeCitation: publicProcedure
      .input(z.object({
        moleculeId: z.number(),
        format: z.enum(['apa', 'chicago', 'bibtex']),
      }))
      .query(async ({ input }) => {
        const molecule = await db.getMoleculeById(input.moleculeId);
        if (!molecule) {
          throw new Error('Molécule non trouvée');
        }
        
        const currentYear = new Date().getFullYear();
        const accessDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        
        // Trouver la référence PubChem si elle existe
        const pubchemRef = molecule.references?.find(r => r.type === 'pubchem');
        const pubchemCID = pubchemRef?.url?.split('/').pop();
        
        let citation = '';
        
        switch (input.format) {
          case 'apa':
            if (pubchemCID) {
              citation = `National Center for Biotechnology Information (${currentYear}). PubChem Compound Summary for CID ${pubchemCID}, ${molecule.name}. Retrieved ${accessDate}, from https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}`;
            } else {
              citation = `${molecule.name}. (${currentYear}). In PERFUMUM Research Database. Retrieved ${accessDate}.`;
            }
            if (molecule.casNumber) {
              citation += ` CAS: ${molecule.casNumber}.`;
            }
            break;
            
          case 'chicago':
            if (pubchemCID) {
              citation = `National Center for Biotechnology Information. "PubChem Compound Summary for CID ${pubchemCID}, ${molecule.name}." PubChem. Accessed ${accessDate}. https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}.`;
            } else {
              citation = `"${molecule.name}." PERFUMUM Research Database. Accessed ${accessDate}.`;
            }
            if (molecule.casNumber) {
              citation += ` CAS Registry Number: ${molecule.casNumber}.`;
            }
            break;
            
          case 'bibtex':
            const key = molecule.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            if (pubchemCID) {
              citation = `@misc{pubchem_${key},
  author = {{National Center for Biotechnology Information}},
  title = {PubChem Compound Summary for CID ${pubchemCID}, ${molecule.name}},
  year = {${currentYear}},
  url = {https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}},
  note = {Accessed: ${accessDate}${molecule.casNumber ? `, CAS: ${molecule.casNumber}` : ''}}
}`;
            } else {
              citation = `@misc{perfumum_${key},
  title = {${molecule.name}},
  year = {${currentYear}},
  howpublished = {PERFUMUM Research Database},
  note = {${molecule.casNumber ? `CAS: ${molecule.casNumber}, ` : ''}Accessed: ${accessDate}}
}`;
            }
            break;
        }
        
        return {
          citation,
          format: input.format,
          molecule: {
            id: molecule.id,
            name: molecule.name,
            casNumber: molecule.casNumber,
            iupacName: molecule.iupacName,
          },
        };
      }),
    
    // Générer une citation pour une recette
    generateRecetteCitation: publicProcedure
      .input(z.object({
        recetteId: z.number(),
        format: z.enum(['apa', 'chicago', 'bibtex']),
      }))
      .query(async ({ input }) => {
        const recette = await db.getRecetteById(input.recetteId);
        if (!recette) {
          throw new Error('Recette non trouvée');
        }
        
        const currentYear = new Date().getFullYear();
        const accessDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        const creationYear = recette.createdAt ? new Date(recette.createdAt).getFullYear() : currentYear;
        
        let citation = '';
        
        switch (input.format) {
          case 'apa':
            citation = `PERFUMUM Research. (${creationYear}). ${recette.name}. PERFUMUM Research Database. Retrieved ${accessDate}.`;
            break;
            
          case 'chicago':
            citation = `PERFUMUM Research. "${recette.name}." PERFUMUM Research Database, ${creationYear}. Accessed ${accessDate}.`;
            break;
            
          case 'bibtex':
            const key = recette.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            citation = `@misc{perfumum_${key},
  author = {{PERFUMUM Research}},
  title = {${recette.name}},
  year = {${creationYear}},
  howpublished = {PERFUMUM Research Database},
  note = {Accessed: ${accessDate}}
}`;
            break;
        }
        
        return {
          citation,
          format: input.format,
          recette: {
            id: recette.id,
            name: recette.name,
          },
        };
      }),
    
    // Générer des citations groupées
    generateBulkCitations: publicProcedure
      .input(z.object({
        moleculeIds: z.array(z.number()).optional(),
        recetteIds: z.array(z.number()).optional(),
        format: z.enum(['apa', 'chicago', 'bibtex']),
      }))
      .query(async ({ input }) => {
        const citations: Array<{ type: 'molecule' | 'recette'; id: number; name: string; citation: string }> = [];
        
        // Générer les citations pour les molécules
        if (input.moleculeIds && input.moleculeIds.length > 0) {
          for (const id of input.moleculeIds) {
            const molecule = await db.getMoleculeById(id);
            if (molecule) {
              const currentYear = new Date().getFullYear();
              const accessDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
              const pubchemRef = molecule.references?.find(r => r.type === 'pubchem');
              const pubchemCID = pubchemRef?.url?.split('/').pop();
              
              let citation = '';
              if (input.format === 'apa') {
                citation = pubchemCID 
                  ? `National Center for Biotechnology Information (${currentYear}). PubChem Compound Summary for CID ${pubchemCID}, ${molecule.name}. Retrieved ${accessDate}, from https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}`
                  : `${molecule.name}. (${currentYear}). In PERFUMUM Research Database. Retrieved ${accessDate}.`;
              } else if (input.format === 'chicago') {
                citation = pubchemCID
                  ? `National Center for Biotechnology Information. "PubChem Compound Summary for CID ${pubchemCID}, ${molecule.name}." PubChem. Accessed ${accessDate}. https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}.`
                  : `"${molecule.name}." PERFUMUM Research Database. Accessed ${accessDate}.`;
              } else {
                const key = molecule.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                citation = pubchemCID
                  ? `@misc{pubchem_${key}, author = {{NCBI}}, title = {${molecule.name}}, year = {${currentYear}}, url = {https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCID}}}`
                  : `@misc{perfumum_${key}, title = {${molecule.name}}, year = {${currentYear}}, howpublished = {PERFUMUM Research Database}}`;
              }
              
              citations.push({ type: 'molecule', id: molecule.id, name: molecule.name, citation });
            }
          }
        }
        
        // Générer les citations pour les recettes
        if (input.recetteIds && input.recetteIds.length > 0) {
          for (const id of input.recetteIds) {
            const recette = await db.getRecetteById(id);
            if (recette) {
              const currentYear = new Date().getFullYear();
              const accessDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
              
              let citation = '';
              if (input.format === 'apa') {
                citation = `PERFUMUM Research. (${currentYear}). ${recette.name}. PERFUMUM Research Database. Retrieved ${accessDate}.`;
              } else if (input.format === 'chicago') {
                citation = `PERFUMUM Research. "${recette.name}." PERFUMUM Research Database, ${currentYear}. Accessed ${accessDate}.`;
              } else {
                const key = recette.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
                citation = `@misc{perfumum_${key}, author = {{PERFUMUM Research}}, title = {${recette.name}}, year = {${currentYear}}}`;
              }
              
              citations.push({ type: 'recette', id: recette.id, name: recette.name, citation });
            }
          }
        }
        
        return {
          format: input.format,
          count: citations.length,
          citations,
        };
      }),
  }),

  // ============================================================================
  // TOBACCO-CANNABIS-PERFUME INTERACTIONS
  // ============================================================================
  
  molecularInteractions: router({
    list: publicProcedure.query(async () => {
      return await db.getAllMolecularInteractions();
    }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getMolecularInteractionById(input);
      }),
    
    getByCategory: publicProcedure
      .input(z.enum(['tabac_cannabis', 'tabac_parfum', 'cannabis_parfum', 'tabac_cannabis_parfum']))
      .query(async ({ input }) => {
        return await db.getMolecularInteractionsByCategory(input);
      }),
    
    getBySynergyType: publicProcedure
      .input(z.enum(['entourage', 'potentiation', 'bridge', 'stabilization', 'transformation', 'masking']))
      .query(async ({ input }) => {
        return await db.getMolecularInteractionsBySynergyType(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        interactionId: z.string(),
        name: z.string(),
        sourceCategory: z.enum(['tabac_cannabis', 'tabac_parfum', 'cannabis_parfum', 'tabac_cannabis_parfum']),
        molecule1Id: z.number().optional(),
        molecule2Id: z.number().optional(),
        molecule3Id: z.number().optional(),
        terpeneProfile: z.array(z.object({
          name: z.string(),
          percentage: z.number(),
          source: z.enum(['tabac', 'cannabis', 'parfum']),
          function: z.string().optional(),
        })).optional(),
        synergyType: z.enum(['entourage', 'potentiation', 'bridge', 'stabilization', 'transformation', 'masking']),
        compatibilityScore: z.number().min(0).max(100).default(50),
        description: z.string().optional(),
        olfactiveResult: z.string().optional(),
        applications: z.string().optional(),
        scientificBasis: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createMolecularInteraction(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        interactionId: z.string().optional(),
        name: z.string().optional(),
        sourceCategory: z.enum(['tabac_cannabis', 'tabac_parfum', 'cannabis_parfum', 'tabac_cannabis_parfum']).optional(),
        molecule1Id: z.number().optional().nullable(),
        molecule2Id: z.number().optional().nullable(),
        molecule3Id: z.number().optional().nullable(),
        terpeneProfile: z.array(z.object({
          name: z.string(),
          percentage: z.number(),
          source: z.enum(['tabac', 'cannabis', 'parfum']),
          function: z.string().optional(),
        })).optional(),
        synergyType: z.enum(['entourage', 'potentiation', 'bridge', 'stabilization', 'transformation', 'masking']).optional(),
        compatibilityScore: z.number().min(0).max(100).optional(),
        description: z.string().optional().nullable(),
        olfactiveResult: z.string().optional().nullable(),
        applications: z.string().optional().nullable(),
        scientificBasis: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateMolecularInteraction(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteMolecularInteraction(input);
        return { success: true };
      }),
    
    getGraphData: publicProcedure.query(async () => {
      return await db.getInteractionsGraphData();
    }),
  }),
  
  aromaticAccords: router({
    list: publicProcedure.query(async () => {
      return await db.getAllAromaticAccords();
    }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getAromaticAccordById(input);
      }),
    
    getByCategory: publicProcedure
      .input(z.enum(['fumoir', 'hash', 'herbal', 'hybrid']))
      .query(async ({ input }) => {
        return await db.getAromaticAccordsByCategory(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        accordId: z.string(),
        name: z.string(),
        category: z.enum(['fumoir', 'hash', 'herbal', 'hybrid']),
        topNotes: z.array(z.object({
          molecule: z.string(),
          percentage: z.number(),
          source: z.enum(['tabac', 'cannabis', 'parfum']),
        })).optional(),
        heartNotes: z.array(z.object({
          molecule: z.string(),
          percentage: z.number(),
          source: z.enum(['tabac', 'cannabis', 'parfum']),
        })).optional(),
        baseNotes: z.array(z.object({
          molecule: z.string(),
          percentage: z.number(),
          source: z.enum(['tabac', 'cannabis', 'parfum']),
        })).optional(),
        formula: z.string().optional(),
        formulaJson: z.array(z.object({
          ingredient: z.string(),
          percentage: z.number(),
          source: z.enum(['tabac', 'cannabis', 'parfum']),
          role: z.enum(['top', 'heart', 'base', 'modifier']),
        })).optional(),
        terpeneProfile: z.array(z.object({
          terpene: z.string(),
          percentage: z.number(),
          contribution: z.string(),
        })).optional(),
        description: z.string().optional(),
        inspiration: z.string().optional(),
        targetEffect: z.string().optional(),
        diffusion: z.enum(['faible', 'moyenne', 'forte']).optional(),
        tenacity: z.enum(['fugace', 'modérée', 'tenace']).optional(),
        sillage: z.enum(['intime', 'modéré', 'puissant']).optional(),
        usageRecommendations: z.string().optional(),
        dilutionRecommendation: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createAromaticAccord(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        accordId: z.string().optional(),
        name: z.string().optional(),
        category: z.enum(['fumoir', 'hash', 'herbal', 'hybrid']).optional(),
        topNotes: z.array(z.object({
          molecule: z.string(),
          percentage: z.number(),
          source: z.enum(['tabac', 'cannabis', 'parfum']),
        })).optional(),
        heartNotes: z.array(z.object({
          molecule: z.string(),
          percentage: z.number(),
          source: z.enum(['tabac', 'cannabis', 'parfum']),
        })).optional(),
        baseNotes: z.array(z.object({
          molecule: z.string(),
          percentage: z.number(),
          source: z.enum(['tabac', 'cannabis', 'parfum']),
        })).optional(),
        formula: z.string().optional().nullable(),
        formulaJson: z.array(z.object({
          ingredient: z.string(),
          percentage: z.number(),
          source: z.enum(['tabac', 'cannabis', 'parfum']),
          role: z.enum(['top', 'heart', 'base', 'modifier']),
        })).optional(),
        terpeneProfile: z.array(z.object({
          terpene: z.string(),
          percentage: z.number(),
          contribution: z.string(),
        })).optional(),
        description: z.string().optional().nullable(),
        inspiration: z.string().optional().nullable(),
        targetEffect: z.string().optional().nullable(),
        diffusion: z.enum(['faible', 'moyenne', 'forte']).optional(),
        tenacity: z.enum(['fugace', 'modérée', 'tenace']).optional(),
        sillage: z.enum(['intime', 'modéré', 'puissant']).optional(),
        usageRecommendations: z.string().optional().nullable(),
        dilutionRecommendation: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateAromaticAccord(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteAromaticAccord(input);
        return { success: true };
      }),
  }),
  
  terpeneComparison: router({
    list: publicProcedure.query(async () => {
      return await db.getAllTerpeneComparisonProfiles();
    }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getTerpeneComparisonProfileById(input);
      }),
    
    getBySource: publicProcedure
      .input(z.enum(['tabac', 'cannabis', 'parfum']))
      .query(async ({ input }) => {
        return await db.getTerpeneComparisonProfilesBySource(input);
      }),
    
    getComparisonData: publicProcedure
      .input(z.array(z.number()))
      .query(async ({ input }) => {
        return await db.getTerpeneComparisonData(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        profileId: z.string(),
        name: z.string(),
        sourceType: z.enum(['tabac', 'cannabis', 'parfum']),
        sourceId: z.number().optional(),
        sourceName: z.string().optional(),
        myrcene: z.number().min(0).max(100).default(0),
        limonene: z.number().min(0).max(100).default(0),
        pinene: z.number().min(0).max(100).default(0),
        linalool: z.number().min(0).max(100).default(0),
        caryophyllene: z.number().min(0).max(100).default(0),
        humulene: z.number().min(0).max(100).default(0),
        terpinolene: z.number().min(0).max(100).default(0),
        ocimene: z.number().min(0).max(100).default(0),
        bisabolol: z.number().min(0).max(100).default(0),
        geraniol: z.number().min(0).max(100).default(0),
        additionalTerpenes: z.array(z.object({
          name: z.string(),
          value: z.number(),
        })).optional(),
        dominantNote: z.string().optional(),
        olfactiveDescription: z.string().optional(),
        aromaticBridges: z.array(z.object({
          terpene: z.string(),
          bridgesWith: z.string(),
          commonality: z.number(),
        })).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createTerpeneComparisonProfile(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        profileId: z.string().optional(),
        name: z.string().optional(),
        sourceType: z.enum(['tabac', 'cannabis', 'parfum']).optional(),
        sourceId: z.number().optional().nullable(),
        sourceName: z.string().optional().nullable(),
        myrcene: z.number().min(0).max(100).optional(),
        limonene: z.number().min(0).max(100).optional(),
        pinene: z.number().min(0).max(100).optional(),
        linalool: z.number().min(0).max(100).optional(),
        caryophyllene: z.number().min(0).max(100).optional(),
        humulene: z.number().min(0).max(100).optional(),
        terpinolene: z.number().min(0).max(100).optional(),
        ocimene: z.number().min(0).max(100).optional(),
        bisabolol: z.number().min(0).max(100).optional(),
        geraniol: z.number().min(0).max(100).optional(),
        additionalTerpenes: z.array(z.object({
          name: z.string(),
          value: z.number(),
        })).optional(),
        dominantNote: z.string().optional().nullable(),
        olfactiveDescription: z.string().optional().nullable(),
        aromaticBridges: z.array(z.object({
          terpene: z.string(),
          bridgesWith: z.string(),
          commonality: z.number(),
        })).optional(),
        notes: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateTerpeneComparisonProfile(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteTerpeneComparisonProfile(input);
        return { success: true };
      }),
  }),
  
  formulationTool: router({
    list: publicProcedure.query(async () => {
      return await db.getAllFormulationSuggestions();
    }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getFormulationSuggestionById(input);
      }),
    
    getByType: publicProcedure
      .input(z.enum(['parfum', 'encens', 'tabac_blend', 'cannabis_blend', 'hybrid']))
      .query(async ({ input }) => {
        return await db.getFormulationSuggestionsByType(input);
      }),
    
    getByBaseMolecule: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getFormulationSuggestionsByBaseMolecule(input);
      }),
    
    generateSuggestions: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.generateFormulationSuggestions(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        suggestionId: z.string(),
        name: z.string(),
        baseMoleculeId: z.number().optional(),
        baseMoleculeName: z.string().optional(),
        suggestedMolecules: z.array(z.object({
          moleculeId: z.number(),
          moleculeName: z.string(),
          reason: z.string(),
          synergyType: z.string(),
          compatibilityScore: z.number(),
          proportion: z.string(),
        })).optional(),
        synergyRules: z.array(z.object({
          rule: z.string(),
          description: z.string(),
          source: z.string(),
        })).optional(),
        expectedOlfactiveProfile: z.string().optional(),
        expectedEffects: z.array(z.object({
          effect: z.string(),
          intensity: z.number(),
        })).optional(),
        formulationType: z.enum(['parfum', 'encens', 'tabac_blend', 'cannabis_blend', 'hybrid']),
        difficulty: z.enum(['débutant', 'intermédiaire', 'avancé']).optional(),
        technicalNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createFormulationSuggestion(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        suggestionId: z.string().optional(),
        name: z.string().optional(),
        baseMoleculeId: z.number().optional().nullable(),
        baseMoleculeName: z.string().optional().nullable(),
        suggestedMolecules: z.array(z.object({
          moleculeId: z.number(),
          moleculeName: z.string(),
          reason: z.string(),
          synergyType: z.string(),
          compatibilityScore: z.number(),
          proportion: z.string(),
        })).optional(),
        synergyRules: z.array(z.object({
          rule: z.string(),
          description: z.string(),
          source: z.string(),
        })).optional(),
        expectedOlfactiveProfile: z.string().optional().nullable(),
        expectedEffects: z.array(z.object({
          effect: z.string(),
          intensity: z.number(),
        })).optional(),
        formulationType: z.enum(['parfum', 'encens', 'tabac_blend', 'cannabis_blend', 'hybrid']).optional(),
        difficulty: z.enum(['débutant', 'intermédiaire', 'avancé']).optional(),
        technicalNotes: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateFormulationSuggestion(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteFormulationSuggestion(input);
        return { success: true };
      }),
  }),
  
  entourageRules: router({
    list: publicProcedure.query(async () => {
      return await db.getAllEntourageRules();
    }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getEntourageRuleById(input);
      }),
    
    getByType: publicProcedure
      .input(z.enum(['entourage', 'potentiation', 'modulation', 'stabilization', 'enhancement', 'contrast']))
      .query(async ({ input }) => {
        return await db.getEntourageRulesByType(input);
      }),
    
    create: protectedProcedure
      .input(z.object({
        ruleId: z.string(),
        name: z.string(),
        ruleType: z.enum(['entourage', 'potentiation', 'modulation', 'stabilization', 'enhancement', 'contrast']),
        primaryMolecules: z.array(z.object({
          name: z.string(),
          role: z.string(),
        })).optional(),
        secondaryMolecules: z.array(z.object({
          name: z.string(),
          role: z.string(),
        })).optional(),
        description: z.string(),
        mechanism: z.string().optional(),
        olfactiveResult: z.string().optional(),
        applicableTo: z.array(z.string()).optional(),
        scientificBasis: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createEntourageRule(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        ruleId: z.string().optional(),
        name: z.string().optional(),
        ruleType: z.enum(['entourage', 'potentiation', 'modulation', 'stabilization', 'enhancement', 'contrast']).optional(),
        primaryMolecules: z.array(z.object({
          name: z.string(),
          role: z.string(),
        })).optional(),
        secondaryMolecules: z.array(z.object({
          name: z.string(),
          role: z.string(),
        })).optional(),
        description: z.string().optional(),
        mechanism: z.string().optional().nullable(),
        olfactiveResult: z.string().optional().nullable(),
        applicableTo: z.array(z.string()).optional(),
        scientificBasis: z.string().optional().nullable(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateEntourageRule(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteEntourageRule(input);
        return { success: true };
      }),
  }),

  // ============================================================================
  // PLANT-TERROIR RELATIONS (Connexions plantes-terroirs pour le graphe)
  // ============================================================================
  plantTerroirs: router({
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
        terroirs.forEach((t: any) => {
          allRelations.push({
            plantId: plant.id,
            plantName: plant.name,
            terroirId: t.terroirId,
            localName: t.localName,
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
          terroirs.forEach((t: any) => {
            terroirsWithPlants.add(t.terroirId);
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
  }),

  // ============================================================================
  // GRAPHE DE RÉSEAU UNIFIÉ (Plantes, Terroirs, Molécules)
  // ============================================================================
  networkGraph: router({
    // Données complètes pour le graphe de réseau
    getFullNetworkData: publicProcedure.query(async () => {
      const dbInstance = await db.getDb();
      if (!dbInstance) return { nodes: [], links: [] };
      
      const nodes: Array<{
        id: string;
        name: string;
        type: 'plant' | 'terroir' | 'molecule' | 'rawMaterial';
        data?: any;
      }> = [];
      
      const links: Array<{
        source: string;
        target: string;
        type: 'plant-terroir' | 'plant-molecule' | 'rawMaterial-terroir' | 'rawMaterial-molecule';
        value?: number;
      }> = [];
      
      // Récupérer les plantes
      const plants = await db.getAllPlants();
      plants.forEach(plant => {
        nodes.push({
          id: `plant-${plant.id}`,
          name: plant.name,
          type: 'plant',
          data: { latinName: plant.latinName, category: plant.category },
        });
      });
      
      // Récupérer les terroirs
      const terroirs = await db.getAllTerroirs();
      terroirs.forEach(terroir => {
        nodes.push({
          id: `terroir-${terroir.id}`,
          name: terroir.name,
          type: 'terroir',
          data: { country: terroir.country, region: terroir.region, climateType: terroir.climateType },
        });
      });
      
      // Récupérer les relations plantes-terroirs
      const allPlants = await db.getAllPlants();
      const plantTerroirLinks: Array<{ plantId: number; terroirId: number }> = [];
      
      // Récupérer les terroirs de chaque plante
      for (const plant of allPlants.slice(0, 50)) {
        const plantTerroirs = await db.getPlantTerroirs(plant.id);
        plantTerroirs.forEach((pt: any) => {
          plantTerroirLinks.push({ plantId: plant.id, terroirId: pt.terroirId });
        });
      }
      
      plantTerroirLinks.forEach((rel: { plantId: number; terroirId: number }) => {
        links.push({
          source: `plant-${rel.plantId}`,
          target: `terroir-${rel.terroirId}`,
          type: 'plant-terroir',
        });
      });
      
      // Récupérer les molécules principales
      const molecules = await db.getAllMolecules();
      molecules.slice(0, 100).forEach(mol => {
        nodes.push({
          id: `molecule-${mol.id}`,
          name: mol.name,
          type: 'molecule',
          data: { family: mol.family, chemicalClass: mol.chemicalClass },
        });
      });
      
      // Récupérer les relations plantes-molécules
      const plantMoleculeLinks: Array<{ plantId: number; moleculeId: number; percentageTypical: number }> = [];
      
      for (const plant of allPlants.slice(0, 50)) {
        const plantMols = await db.getPlantMolecules(plant.id);
        plantMols.forEach((pm: any) => {
          if (molecules.slice(0, 100).some(m => m.id === pm.molecule.id)) {
            plantMoleculeLinks.push({ 
              plantId: plant.id, 
              moleculeId: pm.molecule.id,
              percentageTypical: Number(pm.percentageTypical) || 1
            });
          }
        });
      }
      
      plantMoleculeLinks.forEach((rel) => {
        links.push({
          source: `plant-${rel.plantId}`,
          target: `molecule-${rel.moleculeId}`,
          type: 'plant-molecule',
          value: rel.percentageTypical,
        });
      });
      
      // Récupérer les matières premières
      const rawMaterials = await db.getAllRawMaterials();
      rawMaterials.forEach(rm => {
        nodes.push({
          id: `rawMaterial-${rm.id}`,
          name: rm.name,
          type: 'rawMaterial',
          data: { category: rm.category, plantPart: rm.plantPart },
        });
        
        // Lien vers le terroir
        if (rm.terroirId) {
          links.push({
            source: `rawMaterial-${rm.id}`,
            target: `terroir-${rm.terroirId}`,
            type: 'rawMaterial-terroir',
          });
        }
        
        // Lien vers la plante
        if (rm.plantId) {
          links.push({
            source: `rawMaterial-${rm.id}`,
            target: `plant-${rm.plantId}`,
            type: 'plant-molecule',
          });
        }
      });
      
      return { nodes, links };
    }),
    
    // Données filtrées par type
    getFilteredNetworkData: publicProcedure
      .input(z.object({
        showPlants: z.boolean().default(true),
        showTerroirs: z.boolean().default(true),
        showMolecules: z.boolean().default(true),
        showRawMaterials: z.boolean().default(false),
        countryFilter: z.string().optional(),
        categoryFilter: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const dbInstance = await db.getDb();
        if (!dbInstance) return { nodes: [], links: [] };
        
        const nodes: Array<{
          id: string;
          name: string;
          type: 'plant' | 'terroir' | 'molecule' | 'rawMaterial';
          data?: any;
        }> = [];
        
        const links: Array<{
          source: string;
          target: string;
          type: string;
          value?: number;
        }> = [];
        
        // Récupérer les plantes si demandé
        if (input.showPlants) {
          const plants = await db.getAllPlants();
          const filteredPlants = input.categoryFilter 
            ? plants.filter(p => p.category === input.categoryFilter)
            : plants;
          
          filteredPlants.forEach(plant => {
            nodes.push({
              id: `plant-${plant.id}`,
              name: plant.name,
              type: 'plant',
              data: { latinName: plant.latinName, category: plant.category },
            });
          });
        }
        
        // Récupérer les terroirs si demandé
        if (input.showTerroirs) {
          const terroirs = await db.getAllTerroirs();
          const filteredTerroirs = input.countryFilter
            ? terroirs.filter(t => t.country === input.countryFilter)
            : terroirs;
          
          filteredTerroirs.forEach(terroir => {
            nodes.push({
              id: `terroir-${terroir.id}`,
              name: terroir.name,
              type: 'terroir',
              data: { country: terroir.country, region: terroir.region },
            });
          });
        }
        
        // Récupérer les molécules si demandé
        if (input.showMolecules) {
          const molecules = await db.getAllMolecules();
          molecules.slice(0, 50).forEach(mol => {
            nodes.push({
              id: `molecule-${mol.id}`,
              name: mol.name,
              type: 'molecule',
              data: { family: mol.family },
            });
          });
        }
        
        // Récupérer les relations plantes-terroirs
        if (input.showPlants && input.showTerroirs) {
          const plantIds = new Set(nodes.filter(n => n.type === 'plant').map(n => parseInt(n.id.split('-')[1])));
          const terroirIds = new Set(nodes.filter(n => n.type === 'terroir').map(n => parseInt(n.id.split('-')[1])));
          
          // Récupérer les terroirs de chaque plante
          for (const plantId of Array.from(plantIds)) {
            const plantTerroirs = await db.getPlantTerroirs(plantId);
            plantTerroirs.forEach((pt: any) => {
              if (terroirIds.has(pt.terroirId)) {
                links.push({
                  source: `plant-${plantId}`,
                  target: `terroir-${pt.terroirId}`,
                  type: 'plant-terroir',
                });
              }
            });
          }
        }
        
        // Récupérer les relations plantes-molécules
        if (input.showPlants && input.showMolecules) {
          const plantIds = new Set(nodes.filter(n => n.type === 'plant').map(n => parseInt(n.id.split('-')[1])));
          const moleculeIds = new Set(nodes.filter(n => n.type === 'molecule').map(n => parseInt(n.id.split('-')[1])));
          
          // Récupérer les molécules de chaque plante
          for (const plantId of Array.from(plantIds)) {
            const plantMols = await db.getPlantMolecules(plantId);
            plantMols.forEach((pm: any) => {
              if (moleculeIds.has(pm.molecule.id)) {
                links.push({
                  source: `plant-${plantId}`,
                  target: `molecule-${pm.molecule.id}`,
                  type: 'plant-molecule',
                  value: Number(pm.percentageTypical) || 1,
                });
              }
            });
          }
        }
        
        return { nodes, links };
      }),
  }),

  // ============================================================================
  // OLFACTIVE ARCHIVES (Archives historiques)
  // ============================================================================
  archives: router({
    list: publicProcedure
      .input(z.object({
        civilization: z.string().optional(),
        type: z.enum(["manuscript","formula","archaeological","botanical_illustration"]).optional(),
        period: z.string().optional(),
        q: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(25),
        offset: z.number().int().min(0).default(0),
      }).optional())
      .query(async ({ input }) => {
        return await db.listOlfactiveArchives(input ?? {});
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number().int().min(1) }))
      .query(async ({ input }) => {
        return await db.getOlfactiveArchiveById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        type: z.enum(["manuscript","formula","archaeological","botanical_illustration"]),
        dateCreated: z.string().optional(),
        civilization: z.string().optional(),
        plantIds: z.array(z.number()).default([]),
        moleculeIds: z.array(z.number()).default([]),
        description: z.string().optional(),
        provenance: z.string().optional(),
        authenticityLevel: z.enum(["confirmed","probable","hypothetical"]).default("probable"),
        references: z.array(z.any()).default([]),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createOlfactiveArchive(input as any);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number().int().min(1),
        title: z.string().min(1).optional(),
        type: z.enum(["manuscript","formula","archaeological","botanical_illustration"]).optional(),
        dateCreated: z.string().optional(),
        civilization: z.string().optional(),
        plantIds: z.array(z.number()).optional(),
        moleculeIds: z.array(z.number()).optional(),
        description: z.string().optional(),
        provenance: z.string().optional(),
        authenticityLevel: z.enum(["confirmed","probable","hypothetical"]).optional(),
        references: z.array(z.any()).optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateOlfactiveArchive(id, data as any);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number().int().min(1) }))
      .mutation(async ({ input }) => {
        return await db.deleteOlfactiveArchive(input.id);
      }),
    
    search: publicProcedure
      .input(z.object({ 
        q: z.string().min(1), 
        limit: z.number().int().min(1).max(50).default(25) 
      }))
      .query(async ({ input }) => {
        return await db.searchOlfactiveArchives(input.q, input.limit);
      }),
  }),

  // ============================================================================
  // CIVILIZATIONAL MARKERS (Marqueurs historiques)
  // ============================================================================
  markers: router({
    list: publicProcedure
      .input(z.object({
        civilization: z.string().optional(),
        period: z.string().optional(),
        usageType: z.enum(["ritual","medical","commercial","funerary","cosmetic"]).optional(),
        plantId: z.number().int().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.listCivilizationalMarkers(input ?? {});
      }),
    
    getByPlant: publicProcedure
      .input(z.object({ plantId: z.number().int().min(1) }))
      .query(async ({ input }) => {
        return await db.getCivilizationalMarkersByPlant(input.plantId);
      }),
    
    getByCivilization: publicProcedure
      .input(z.object({ civilization: z.string().min(1) }))
      .query(async ({ input }) => {
        return await db.getCivilizationalMarkersByCivilization(input.civilization);
      }),
    
    getByPeriod: publicProcedure
      .input(z.object({ period: z.string().min(1) }))
      .query(async ({ input }) => {
        return await db.getCivilizationalMarkersByPeriod(input.period);
      }),
    
    create: protectedProcedure
      .input(z.object({
        plantId: z.number().int().min(1),
        civilization: z.string().min(1),
        period: z.string().optional(),
        startYear: z.number().int().optional(),
        endYear: z.number().int().optional(),
        usageType: z.enum(["ritual","medical","commercial","funerary","cosmetic"]),
        historicalSignificance: z.string().optional(),
        tradeRoutes: z.array(z.any()).default([]),
        archaeologicalEvidence: z.string().optional(),
        primarySources: z.array(z.any()).default([]),
      }))
      .mutation(async ({ input }) => {
        return await db.createCivilizationalMarker(input as any);
      }),
  }),

  // ============================================================================
  // VARIETY GENEALOGY (Généalogie des variétés)
  // ============================================================================
  genealogy: router({
    getTree: publicProcedure
      .input(z.object({ varietyId: z.number().int().min(1) }))
      .query(async ({ input }) => {
        return await db.getVarietyGenealogyTree(input.varietyId);
      }),
    
    getAncestors: publicProcedure
      .input(z.object({ 
        varietyId: z.number().int().min(1), 
        depth: z.number().int().min(1).max(10).default(5) 
      }))
      .query(async ({ input }) => {
        return await db.getVarietyAncestors(input.varietyId, input.depth);
      }),
    
    getDescendants: publicProcedure
      .input(z.object({ 
        varietyId: z.number().int().min(1), 
        depth: z.number().int().min(1).max(10).default(5) 
      }))
      .query(async ({ input }) => {
        return await db.getVarietyDescendants(input.varietyId, input.depth);
      }),
    
    addRelationship: protectedProcedure
      .input(z.object({
        varietyId: z.number().int().min(1),
        parentVarietyId: z.number().int().min(1),
        relationshipType: z.enum(["parent","hybrid","clone","mutation"]).default("parent"),
        crossDate: z.number().int().optional(),
        breeder: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.addVarietyRelationship(input as any);
      }),
    
    updateRelationship: protectedProcedure
      .input(z.object({
        id: z.number().int().min(1),
        relationshipType: z.enum(["parent","hybrid","clone","mutation"]).optional(),
        crossDate: z.number().int().optional(),
        breeder: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateVarietyRelationship(id, data as any);
      }),
    
    // Données du graphe généalogique pour D3.js
    getGraphData: publicProcedure
      .input(z.object({
        plantType: z.enum(["cannabis", "tobacco", "all"]).default("all"),
        includeModern: z.boolean().default(true),
        includeLandraces: z.boolean().default(true),
      }).optional())
      .query(async ({ input }) => {
        return await db.getGenealogyGraphData(input ?? {});
      }),
    
    // Généalogie complète d'une variété
    getFullGenealogy: publicProcedure
      .input(z.object({
        varietyId: z.number().int().min(1),
        depth: z.number().int().min(1).max(10).default(5),
      }))
      .query(async ({ input }) => {
        return await db.getVarietyFullGenealogy(input.varietyId, input.depth);
      }),
  }),

  // ============================================================================
  // PLANTS CONSERVATION (Conservation des plantes)
  // ============================================================================
  plantsConservation: router({
    listThreatened: publicProcedure
      .input(z.object({
        iucn: z.enum(["EX","EW","CR","EN","VU","NT","LC","DD","NE"]).optional(),
        cites: z.enum(["I","II","III","NONE","UNKNOWN"]).optional(),
        region: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.listThreatenedPlants(input ?? {});
      }),
    
    getConservationStatus: publicProcedure
      .input(z.object({ plantId: z.number().int().min(1) }))
      .query(async ({ input }) => {
        return await db.getPlantConservationStatus(input.plantId);
      }),
    
    updateConservationStatus: protectedProcedure
      .input(z.object({
        plantId: z.number().int().min(1),
        conservationStatus: z.enum(["EX","EW","CR","EN","VU","NT","LC","DD","NE"]).optional(),
        citesAppendix: z.enum(["I","II","III","NONE","UNKNOWN"]).optional(),
        conservationNotes: z.string().optional(),
        threatFactors: z.record(z.string(), z.any()).optional(),
        sustainableAlternatives: z.string().optional(),
        lastAssessmentYear: z.number().int().optional(),
        historicalStatus: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { plantId, ...data } = input;
        return await db.updatePlantConservationStatus(plantId, data);
      }),
    
    listGeographicZones: publicProcedure
      .input(z.object({
        zoneType: z.enum(["threatened_concentration", "sustainable_alternatives", "biodiversity_hotspot", "conservation_area"]).optional(),
        threatLevel: z.enum(["critical", "high", "medium", "low", "stable"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.listGeographicZones(input ?? {});
      }),
    
    getPlantsByZone: publicProcedure
      .input(z.object({
        zoneId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getPlantsByGeographicZone(input.zoneId);
      }),
  }),

  // ============================================================================
  // SUSTAINABLE ALTERNATIVES (Alternatives durables)
  // ============================================================================
  sustainableAlternatives: router({
    // Liste toutes les alternatives
    list: publicProcedure
      .query(async () => {
        return await db.getAllSustainableAlternatives();
      }),
    
    // Récupère une alternative par ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getSustainableAlternativeById(input.id);
      }),
    
    // Récupère les alternatives pour une espèce menacée
    getByThreatenedPlant: publicProcedure
      .input(z.object({ plantId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAlternativesByThreatenedPlant(input.plantId);
      }),
    
    // Récupère les alternatives par type
    getByType: publicProcedure
      .input(z.object({ 
        type: z.enum(['natural_plant', 'cultivated', 'synthetic', 'biotechnology', 'blend', 'other']) 
      }))
      .query(async ({ input }) => {
        return await db.getAlternativesByType(input.type);
      }),
    
    // Recherche avec filtres
    search: publicProcedure
      .input(z.object({
        threatenedPlantId: z.number().optional(),
        alternativeType: z.enum(['natural_plant', 'cultivated', 'synthetic', 'biotechnology', 'blend', 'other']).optional(),
        availability: z.enum(['widely_available', 'available', 'limited', 'rare', 'research_only']).optional(),
        olfactiveSimilarity: z.enum(['identical', 'very_similar', 'similar', 'partial', 'inspired', 'different']).optional(),
        searchQuery: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.searchSustainableAlternatives(input ?? {});
      }),
    
    // Liste les espèces menacées avec leurs alternatives
    listThreatenedWithAlternatives: publicProcedure
      .query(async () => {
        return await db.getThreatenedPlantsWithAlternatives();
      }),
    
    // Liste les alternatives groupées par espèce
    listGroupedBySpecies: publicProcedure
      .query(async () => {
        return await db.getAlternativesGroupedBySpecies();
      }),
    
    // Statistiques
    getStats: publicProcedure
      .query(async () => {
        return await db.getAlternativesStats();
      }),
    
    // Créer une alternative (protégé)
    create: protectedProcedure
      .input(z.object({
        threatenedPlantId: z.number(),
        threatenedPlantName: z.string(),
        alternativePlantId: z.number().optional(),
        alternativeName: z.string(),
        alternativeType: z.enum(['natural_plant', 'cultivated', 'synthetic', 'biotechnology', 'blend', 'other']),
        olfactiveSimilarity: z.enum(['identical', 'very_similar', 'similar', 'partial', 'inspired', 'different']).optional(),
        olfactiveNotes: z.string().optional(),
        availability: z.enum(['widely_available', 'available', 'limited', 'rare', 'research_only']).optional(),
        sustainabilityScore: z.number().min(1).max(10).optional(),
        certifications: z.array(z.string()).optional(),
        priceComparison: z.enum(['much_cheaper', 'cheaper', 'similar', 'more_expensive', 'much_more_expensive']).optional(),
        suppliers: z.array(z.string()).optional(),
        usageRecommendations: z.string().optional(),
        keyMolecules: z.array(z.object({
          name: z.string(),
          percentage: z.number().optional(),
          note: z.string().optional(),
        })).optional(),
        references: z.array(z.object({
          title: z.string(),
          author: z.string().optional(),
          year: z.number().optional(),
          url: z.string().optional(),
          type: z.enum(['academic', 'industry', 'supplier', 'other']),
        })).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createSustainableAlternative(input as any);
      }),
    
    // Mettre à jour une alternative (protégé)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        threatenedPlantId: z.number().optional(),
        threatenedPlantName: z.string().optional(),
        alternativePlantId: z.number().optional(),
        alternativeName: z.string().optional(),
        alternativeType: z.enum(['natural_plant', 'cultivated', 'synthetic', 'biotechnology', 'blend', 'other']).optional(),
        olfactiveSimilarity: z.enum(['identical', 'very_similar', 'similar', 'partial', 'inspired', 'different']).optional(),
        olfactiveNotes: z.string().optional(),
        availability: z.enum(['widely_available', 'available', 'limited', 'rare', 'research_only']).optional(),
        sustainabilityScore: z.number().min(1).max(10).optional(),
        certifications: z.array(z.string()).optional(),
        priceComparison: z.enum(['much_cheaper', 'cheaper', 'similar', 'more_expensive', 'much_more_expensive']).optional(),
        suppliers: z.array(z.string()).optional(),
        usageRecommendations: z.string().optional(),
        keyMolecules: z.array(z.object({
          name: z.string(),
          percentage: z.number().optional(),
          note: z.string().optional(),
        })).optional(),
        references: z.array(z.object({
          title: z.string(),
          author: z.string().optional(),
          year: z.number().optional(),
          url: z.string().optional(),
          type: z.enum(['academic', 'industry', 'supplier', 'other']),
        })).optional(),
        notes: z.string().optional(),
        verified: z.boolean().optional(),
        verifiedBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateSustainableAlternative(id, data as any);
      }),
    
    // Supprimer une alternative (protégé)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteSustainableAlternative(input.id);
      }),
  }),

  // ============================================================================
  // ARCHIVES OLFACTIVES (Manuscrits, formules historiques, archéologie)
  // ============================================================================
  olfactiveArchives: router({
    // Liste des archives avec filtres
    list: publicProcedure
      .input(z.object({
        civilization: z.string().optional(),
        type: z.enum(['manuscript', 'formula', 'archaeological', 'botanical_illustration']).optional(),
        q: z.string().optional(),
        limit: z.number().default(25),
        offset: z.number().default(0),
      }).optional())
      .query(async ({ input }) => {
        return db.listOlfactiveArchives(input || {});
      }),
    
    // Récupérer une archive par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getOlfactiveArchiveById(input);
      }),
    
    // Recherche full-text
    search: publicProcedure
      .input(z.object({
        q: z.string(),
        limit: z.number().default(25),
      }))
      .query(async ({ input }) => {
        return db.searchOlfactiveArchives(input.q, input.limit);
      }),
    
    // Créer une archive (protégé)
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        type: z.enum(['manuscript', 'formula', 'archaeological', 'botanical_illustration']),
        dateCreated: z.string().optional(),
        civilization: z.string().optional(),
        plantIds: z.array(z.number()).optional(),
        moleculeIds: z.array(z.number()).optional(),
        description: z.string().optional(),
        provenance: z.string().optional(),
        authenticityLevel: z.enum(['confirmed', 'probable', 'hypothetical']).default('probable'),
        references: z.array(z.object({
          author: z.string().optional(),
          year: z.number().optional(),
          title: z.string(),
          type: z.string(),
          url: z.string().optional(),
        })).optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createOlfactiveArchive(input as any);
      }),
    
    // Mettre à jour une archive (protégé)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        type: z.enum(['manuscript', 'formula', 'archaeological', 'botanical_illustration']).optional(),
        dateCreated: z.string().optional(),
        civilization: z.string().optional(),
        plantIds: z.array(z.number()).optional(),
        moleculeIds: z.array(z.number()).optional(),
        description: z.string().optional(),
        provenance: z.string().optional(),
        authenticityLevel: z.enum(['confirmed', 'probable', 'hypothetical']).optional(),
        references: z.array(z.object({
          author: z.string().optional(),
          year: z.number().optional(),
          title: z.string(),
          type: z.string(),
          url: z.string().optional(),
        })).optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateOlfactiveArchive(id, data as any);
      }),
    
    // Supprimer une archive (protégé)
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteOlfactiveArchive(input);
      }),
    
    // Obtenir les civilisations distinctes
    getCivilizations: publicProcedure.query(async () => {
      const archives = await db.listOlfactiveArchives({ limit: 1000 });
      const civilizationsSet = new Set(archives.map(a => a.civilization).filter(Boolean));
      const civilizations = Array.from(civilizationsSet) as string[];
      return civilizations.sort();
    }),
    
    // Statistiques
    getStats: publicProcedure.query(async () => {
      const archives = await db.listOlfactiveArchives({ limit: 1000 });
      const byType: Record<string, number> = {};
      const byCivilization: Record<string, number> = {};
      const byAuthenticity: Record<string, number> = {};
      
      archives.forEach(a => {
        byType[a.type] = (byType[a.type] || 0) + 1;
        if (a.civilization) {
          byCivilization[a.civilization] = (byCivilization[a.civilization] || 0) + 1;
        }
        byAuthenticity[a.authenticityLevel] = (byAuthenticity[a.authenticityLevel] || 0) + 1;
      });
      
      return {
        total: archives.length,
        byType,
        byCivilization,
        byAuthenticity,
      };
    }),
  }),

  // ============================================================================
  // BIBLIOGRAPHY (Références bibliographiques)
  // ============================================================================
  bibliography: router({
    // Lister toutes les références avec filtres
    list: publicProcedure
      .input(z.object({
        entryType: z.string().optional(),
        researchDomain: z.string().optional(),
        year: z.number().optional(),
        yearMin: z.number().optional(),
        yearMax: z.number().optional(),
        readStatus: z.string().optional(),
        search: z.string().optional(),
        axisId: z.number().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAllBibliographyEntries(input || {});
      }),
    
    // Obtenir une référence par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getBibliographyEntryById(input);
      }),
    
    // Obtenir une référence par clé
    getByKey: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getBibliographyEntryByKey(input);
      }),
    
    // Créer une nouvelle référence
    create: protectedProcedure
      .input(z.object({
        entryKey: z.string(),
        entryType: z.enum(['article', 'book', 'inbook', 'incollection', 'inproceedings', 'conference', 'thesis', 'mastersthesis', 'phdthesis', 'techreport', 'manual', 'unpublished', 'misc', 'online', 'patent', 'standard', 'dataset', 'software']).default('article'),
        title: z.string(),
        authors: z.string().optional(),
        year: z.number().optional(),
        journal: z.string().optional(),
        booktitle: z.string().optional(),
        publisher: z.string().optional(),
        volume: z.string().optional(),
        number: z.string().optional(),
        pages: z.string().optional(),
        edition: z.string().optional(),
        chapter: z.string().optional(),
        doi: z.string().optional(),
        isbn: z.string().optional(),
        issn: z.string().optional(),
        pmid: z.string().optional(),
        arxivId: z.string().optional(),
        url: z.string().optional(),
        abstract: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        language: z.string().optional(),
        researchDomain: z.enum(['chimie_olfactive', 'botanique', 'ethnobotanique', 'histoire_parfumerie', 'neurologie_olfactive', 'extraction', 'formulation', 'reglementation', 'durabilite', 'tabac_cannabis', 'methodologie', 'autre']).optional(),
        relevanceScore: z.number().optional(),
        tags: z.array(z.string()).optional(),
        notes: z.string().optional(),
        annotation: z.string().optional(),
        pdfUrl: z.string().optional(),
        readStatus: z.enum(['unread', 'reading', 'read', 'to_review']).optional(),
        linkedMoleculeIds: z.array(z.number()).optional(),
        linkedPlantIds: z.array(z.number()).optional(),
        linkedRecetteIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createBibliographyEntry({
          ...input,
          addedBy: ctx.user?.id,
        } as any);
      }),
    
    // Mettre à jour une référence
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        entryKey: z.string().optional(),
        entryType: z.enum(['article', 'book', 'inbook', 'incollection', 'inproceedings', 'conference', 'thesis', 'mastersthesis', 'phdthesis', 'techreport', 'manual', 'unpublished', 'misc', 'online', 'patent', 'standard', 'dataset', 'software']).optional(),
        title: z.string().optional(),
        authors: z.string().optional(),
        year: z.number().optional(),
        journal: z.string().optional(),
        booktitle: z.string().optional(),
        publisher: z.string().optional(),
        volume: z.string().optional(),
        number: z.string().optional(),
        pages: z.string().optional(),
        doi: z.string().optional(),
        isbn: z.string().optional(),
        issn: z.string().optional(),
        url: z.string().optional(),
        abstract: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        researchDomain: z.enum(['chimie_olfactive', 'botanique', 'ethnobotanique', 'histoire_parfumerie', 'neurologie_olfactive', 'extraction', 'formulation', 'reglementation', 'durabilite', 'tabac_cannabis', 'methodologie', 'autre']).optional(),
        relevanceScore: z.number().optional(),
        tags: z.array(z.string()).optional(),
        notes: z.string().optional(),
        annotation: z.string().optional(),
        readStatus: z.enum(['unread', 'reading', 'read', 'to_review']).optional(),
        linkedMoleculeIds: z.array(z.number()).optional(),
        linkedPlantIds: z.array(z.number()).optional(),
        linkedRecetteIds: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateBibliographyEntry(id, data as any);
      }),
    
    // Supprimer une référence
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteBibliographyEntry(input);
      }),
    
    // Statistiques
    getStats: publicProcedure.query(async () => {
      return db.getBibliographyStats();
    }),
    
    // Import en masse (BibTeX)
    importBibTeX: protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        const entries = db.parseBibTeX(input);
        const entriesWithUser = entries.map(e => ({
          ...e,
          addedBy: ctx.user?.id,
        }));
        return db.bulkCreateBibliographyEntries(entriesWithUser as any[]);
      }),
    
    // Import en masse (CSV)
    importCSV: protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        const entries = db.parseCSVBibliography(input);
        const entriesWithUser = entries.map(e => ({
          ...e,
          addedBy: ctx.user?.id,
        }));
        return db.bulkCreateBibliographyEntries(entriesWithUser as any[]);
      }),
    
    // Export BibTeX
    exportBibTeX: publicProcedure
      .input(z.array(z.number()).optional())
      .query(async ({ input }) => {
        const result = await db.getAllBibliographyEntries({});
        const entries = result.entries || [];
        const filteredEntries = input && input.length > 0
          ? entries.filter((e: any) => input.includes(e.id))
          : entries;
        return db.exportToBibTeX(filteredEntries);
      }),
    
    // Export APA
    exportAPA: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const entry = await db.getBibliographyEntryById(input);
        if (!entry) return null;
        return db.exportToAPA(entry);
      }),
    
    // Export Chicago
    exportChicago: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const entry = await db.getBibliographyEntryById(input);
        if (!entry) return null;
        return db.exportToChicago(entry);
      }),
    
    // Lier une référence à un axe
    linkToAxis: protectedProcedure
      .input(z.object({
        bibliographyId: z.number(),
        axisId: z.number(),
        relevance: z.enum(['primaire', 'secondaire', 'contextuelle']).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.linkBibliographyToAxis(input.bibliographyId, input.axisId, input.relevance, input.notes);
      }),
    
    // Délier une référence d'un axe
    unlinkFromAxis: protectedProcedure
      .input(z.object({
        bibliographyId: z.number(),
        axisId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return db.unlinkBibliographyFromAxis(input.bibliographyId, input.axisId);
      }),
    
    // Obtenir les axes liés à une référence
    getLinkedAxes: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getAxesByBibliography(input);
      }),
  }),

  // ============================================================================
  // RESEARCH AXES (Axes de recherche)
  // ============================================================================
  researchAxes: router({
    // Lister tous les axes
    list: publicProcedure
      .input(z.object({
        status: z.string().optional(),
        category: z.string().optional(),
        priority: z.string().optional(),
        parentAxisId: z.number().nullable().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAllResearchAxes(input || {});
      }),
    
    // Obtenir un axe par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getResearchAxisById(input);
      }),
    
    // Obtenir un axe par code
    getByCode: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getResearchAxisByCode(input);
      }),
    
    // Créer un nouvel axe
    create: protectedProcedure
      .input(z.object({
        axisCode: z.string(),
        name: z.string(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        objectives: z.string().optional(),
        methodology: z.string().optional(),
        category: z.enum(['fondamental', 'applique', 'experimental', 'theorique', 'historique', 'ethnographique', 'technique']).optional(),
        status: z.enum(['planifie', 'en_cours', 'pause', 'termine', 'archive']).optional(),
        priority: z.enum(['haute', 'moyenne', 'basse']).optional(),
        startDate: z.date().optional(),
        targetEndDate: z.date().optional(),
        progressPercent: z.number().optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
        parentAxisId: z.number().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createResearchAxis({
          ...input,
          createdBy: ctx.user?.id,
        } as any);
      }),
    
    // Mettre à jour un axe
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        axisCode: z.string().optional(),
        name: z.string().optional(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        objectives: z.string().optional(),
        methodology: z.string().optional(),
        category: z.enum(['fondamental', 'applique', 'experimental', 'theorique', 'historique', 'ethnographique', 'technique']).optional(),
        status: z.enum(['planifie', 'en_cours', 'pause', 'termine', 'archive']).optional(),
        priority: z.enum(['haute', 'moyenne', 'basse']).optional(),
        startDate: z.date().optional(),
        targetEndDate: z.date().optional(),
        actualEndDate: z.date().optional(),
        progressPercent: z.number().optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
        parentAxisId: z.number().nullable().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateResearchAxis(id, data as any);
      }),
    
    // Supprimer un axe
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteResearchAxis(input);
      }),
    
    // Statistiques
    getStats: publicProcedure.query(async () => {
      return db.getResearchAxesStats();
    }),
    
    // Obtenir les références bibliographiques liées
    getBibliography: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getBibliographyByAxis(input);
      }),
    
    // Obtenir les sous-axes d'un axe parent
    getSubAxes: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getSubAxes(input);
      }),
    
    // Obtenir un axe avec ses sous-axes
    getWithSubAxes: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getAxisWithSubAxes(input);
      }),
    
    // Obtenir la hiérarchie complète des axes
    getHierarchy: publicProcedure.query(async () => {
      return db.getAxisHierarchy();
    }),
  }),

  // ============================================================================
  // RESEARCH ENTRIES (Entrées de recherche)
  // ============================================================================
  researchEntries: router({
    // Lister toutes les entrées avec filtres
    list: publicProcedure
      .input(z.object({
        axisId: z.number().optional(),
        entryType: z.string().optional(),
        status: z.string().optional(),
        importance: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAllResearchEntries(input || {});
      }),
    
    // Obtenir une entrée par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getResearchEntryById(input);
      }),
    
    // Obtenir une entrée par code
    getByCode: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getResearchEntryByCode(input);
      }),
    
    // Obtenir les entrées d'un axe
    getByAxis: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getResearchEntriesByAxis(input);
      }),
    
    // Obtenir le prochain code d'entrée
    getNextCode: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getNextEntryCode(input);
      }),
    
    // Créer une nouvelle entrée
    create: protectedProcedure
      .input(z.object({
        entryCode: z.string(),
        axisId: z.number(),
        title: z.string(),
        content: z.string().optional(),
        summary: z.string().optional(),
        entryType: z.enum(['note', 'observation', 'hypothese', 'resultat', 'conclusion', 'question', 'idee', 'protocole', 'donnees', 'analyse', 'reference', 'citation', 'media', 'lien', 'autre']).optional(),
        status: z.enum(['brouillon', 'en_revision', 'valide', 'archive']).optional(),
        importance: z.enum(['critique', 'haute', 'moyenne', 'basse', 'reference']).optional(),
        entryDate: z.date().optional(),
        attachments: z.array(z.object({
          name: z.string(),
          url: z.string(),
          type: z.string(),
          size: z.number().optional(),
        })).optional(),
        bibliographyIds: z.array(z.number()).optional(),
        linkedMoleculeIds: z.array(z.number()).optional(),
        linkedPlantIds: z.array(z.number()).optional(),
        linkedRecetteIds: z.array(z.number()).optional(),
        linkedPrototypeIds: z.array(z.number()).optional(),
        tags: z.array(z.string()).optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createResearchEntry({
          ...input,
          createdBy: ctx.user?.id,
        } as any);
      }),
    
    // Mettre à jour une entrée
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        entryCode: z.string().optional(),
        axisId: z.number().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        summary: z.string().optional(),
        entryType: z.enum(['note', 'observation', 'hypothese', 'resultat', 'conclusion', 'question', 'idee', 'protocole', 'donnees', 'analyse', 'reference', 'citation', 'media', 'lien', 'autre']).optional(),
        status: z.enum(['brouillon', 'en_revision', 'valide', 'archive']).optional(),
        importance: z.enum(['critique', 'haute', 'moyenne', 'basse', 'reference']).optional(),
        entryDate: z.date().optional(),
        attachments: z.array(z.object({
          name: z.string(),
          url: z.string(),
          type: z.string(),
          size: z.number().optional(),
        })).optional(),
        bibliographyIds: z.array(z.number()).optional(),
        linkedMoleculeIds: z.array(z.number()).optional(),
        linkedPlantIds: z.array(z.number()).optional(),
        linkedRecetteIds: z.array(z.number()).optional(),
        linkedPrototypeIds: z.array(z.number()).optional(),
        tags: z.array(z.string()).optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateResearchEntry(id, data as any);
      }),
    
    // Supprimer une entrée
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteResearchEntry(input);
      }),
  }),

  // ============================================================================
  // REFERENCE CITATIONS (Citations croisées entre références)
  // ============================================================================
  referenceCitations: router({
    // Lister toutes les citations avec filtres
    list: publicProcedure
      .input(z.object({
        citingId: z.number().optional(),
        citedId: z.number().optional(),
        citationType: z.string().optional(),
        verified: z.boolean().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAllReferenceCitations(input || {});
      }),
    
    // Obtenir une citation par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getReferenceCitationById(input);
      }),
    
    // Obtenir le graphe complet des citations pour visualisation
    getGraph: publicProcedure
      .input(z.object({
        citationType: z.string().optional(),
        researchDomain: z.string().optional(),
        minWeight: z.number().optional(),
        verified: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getCitationGraph(input || {});
      }),
    
    // Obtenir les citations d'une référence (qui cite cette référence)
    getCitationsOf: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getCitationsOf(input);
      }),
    
    // Obtenir les références citées par une référence
    getCitedBy: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getCitedBy(input);
      }),
    
    // Créer une nouvelle citation
    create: protectedProcedure
      .input(z.object({
        citingId: z.number(),
        citedId: z.number(),
        citationType: z.enum(['direct', 'indirect', 'methodological', 'theoretical', 'data', 'critique', 'support', 'comparison']).optional(),
        context: z.string().optional(),
        pageNumber: z.string().optional(),
        notes: z.string().optional(),
        weight: z.number().min(1).max(5).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createReferenceCitation({
          ...input,
          addedBy: ctx.user?.id,
        });
      }),
    
    // Mettre à jour une citation
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        citationType: z.enum(['direct', 'indirect', 'methodological', 'theoretical', 'data', 'critique', 'support', 'comparison']).optional(),
        context: z.string().optional(),
        pageNumber: z.string().optional(),
        notes: z.string().optional(),
        weight: z.number().min(1).max(5).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateReferenceCitation(id, data);
      }),
    
    // Supprimer une citation
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteReferenceCitation(input);
      }),
    
    // Vérifier une citation
    verify: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        return db.verifyReferenceCitation(input, ctx.user?.id);
      }),
    
    // Statistiques du graphe de citations
    getStats: publicProcedure.query(async () => {
      return db.getCitationGraphStats();
    }),
  }),

  // ============================================================================
  // V3 REFERENCES (Pack Niche Innovations)
  // ============================================================================
  
  thematicAxes: router({
    // Liste tous les axes thématiques
    list: publicProcedure.query(async () => {
      return db.getAllThematicAxes();
    }),
    
    // Alias getAll pour compatibilité
    getAll: publicProcedure.query(async () => {
      return db.getAllThematicAxes();
    }),
    
    // Obtenir un axe par son code
    getByCode: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getThematicAxisByCode(input);
      }),
  }),
  
  v3References: router({
    // Liste toutes les références v3
    list: publicProcedure.query(async () => {
      return db.getAllV3References();
    }),
    
    // Alias getAll pour compatibilité
    getAll: publicProcedure.query(async () => {
      return db.getAllV3References();
    }),
    
    // Obtenir une référence par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getV3ReferenceById(input);
      }),
    
    // Obtenir une référence par clé
    getByKey: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getV3ReferenceByKey(input);
      }),
    
    // Obtenir les références par axe
    getByAxis: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getV3ReferencesByAxis(input);
      }),
    
    // Obtenir les références par méta-axe
    getByMetaAxis: publicProcedure
      .input(z.enum(['meta_a', 'meta_b', 'meta_c', 'other']))
      .query(async ({ input }) => {
        return db.getV3ReferencesByMetaAxis(input);
      }),
    
    // Rechercher des références
    search: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.searchV3References(input);
      }),
    
    // Mettre à jour les notes utilisateur
    updateUserNotes: protectedProcedure
      .input(z.object({
        id: z.number(),
        userNotes: z.string(),
      }))
      .mutation(async ({ input }) => {
        return db.updateV3ReferenceUserNotes(input.id, input.userNotes);
      }),
    
    // Mettre à jour le statut de lecture
    updateReadStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        readStatus: z.enum(['unread', 'reading', 'read', 'to_review']),
      }))
      .mutation(async ({ input }) => {
        return db.updateV3ReferenceReadStatus(input.id, input.readStatus);
      }),
    
    // Mettre à jour le score de pertinence
    updateRelevance: protectedProcedure
      .input(z.object({
        id: z.number(),
        relevanceScore: z.number().min(0).max(100),
      }))
      .mutation(async ({ input }) => {
        return db.updateV3ReferenceRelevance(input.id, input.relevanceScore);
      }),
    
    // Statistiques
    getStats: publicProcedure.query(async () => {
      return db.getV3ReferencesStats();
    }),
    
    // Obtenir les tags d'une référence
    getTags: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getTagsForV3Reference(input);
      }),
    
    // Obtenir les notes d'une référence
    getNotes: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getNotesForV3Reference(input);
      }),
  }),
  
  referenceTags: router({
    // Liste tous les tags
    list: publicProcedure.query(async () => {
      return db.getAllReferenceTags();
    }),
    
    // Obtenir les tags par catégorie
    getByCategory: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getReferenceTagsByCategory(input);
      }),
    
    // Obtenir un tag par slug
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getReferenceTagBySlug(input);
      }),
    
    // Créer un tag
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        category: z.enum(['theme', 'method', 'source_type', 'region', 'period', 'material', 'discipline', 'project', 'custom']).optional(),
        description: z.string().optional(),
        color: z.string().optional(),
        parentId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createReferenceTag(input);
      }),
    
    // Mettre à jour un tag
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        color: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateReferenceTag(id, data);
      }),
    
    // Supprimer un tag
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteReferenceTag(input);
      }),
    
    // Ajouter un tag à une référence
    addToReference: protectedProcedure
      .input(z.object({
        referenceId: z.number(),
        tagId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return db.addTagToV3Reference(input.referenceId, input.tagId);
      }),
    
    // Retirer un tag d'une référence
    removeFromReference: protectedProcedure
      .input(z.object({
        referenceId: z.number(),
        tagId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return db.removeTagFromV3Reference(input.referenceId, input.tagId);
      }),
    
    // Obtenir les références par tag
    getReferences: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getV3ReferencesByTag(input);
      }),
  }),
  
  referenceNotes: router({
    // Obtenir une note par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getReferenceNoteById(input);
      }),
    
    // Créer une note
    create: protectedProcedure
      .input(z.object({
        referenceId: z.number(),
        noteType: z.enum(['summary', 'critique', 'quote', 'methodology', 'connection', 'idea', 'question', 'todo', 'general']).optional(),
        title: z.string().optional(),
        content: z.string(),
        pageNumber: z.string().optional(),
        importance: z.enum(['low', 'medium', 'high', 'critical']).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createReferenceNote({
          ...input,
          createdBy: ctx.user?.id,
        });
      }),
    
    // Mettre à jour une note
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        noteType: z.enum(['summary', 'critique', 'quote', 'methodology', 'connection', 'idea', 'question', 'todo', 'general']).optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        pageNumber: z.string().optional(),
        importance: z.enum(['low', 'medium', 'high', 'critical']).optional(),
        isResolved: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateReferenceNote(id, data);
      }),
    
    // Supprimer une note
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteReferenceNote(input);
      }),
    
    // Obtenir les notes par type
    getByType: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getReferenceNotesByType(input);
      }),
    
    // Obtenir les notes non résolues
    getUnresolved: publicProcedure.query(async () => {
      return db.getUnresolvedReferenceNotes();
    }),
  }),
  
  axisGraph: router({
    // Obtenir les données du graphe
    getData: publicProcedure.query(async () => {
      return db.getAxisGraphData();
    }),
    
    // Obtenir toutes les connexions
    getConnections: publicProcedure.query(async () => {
      return db.getAllAxisConnections();
    }),
    
    // Obtenir les connexions pour un axe
    getConnectionsForAxis: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getAxisConnectionsForAxis(input);
      }),
    
    // Créer une connexion
    createConnection: protectedProcedure
      .input(z.object({
        sourceAxisId: z.number(),
        targetAxisId: z.number(),
        strength: z.number().min(1).max(10).optional(),
        connectionType: z.enum(['related', 'complementary', 'dependent', 'overlap']).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createAxisConnection(input);
      }),
    
    // Mettre à jour la force d'une connexion
    updateStrength: protectedProcedure
      .input(z.object({
        sourceId: z.number(),
        targetId: z.number(),
        strength: z.number().min(1).max(10),
      }))
      .mutation(async ({ input }) => {
        return db.updateAxisConnectionStrength(input.sourceId, input.targetId, input.strength);
      }),
    
    // Supprimer une connexion
    deleteConnection: protectedProcedure
      .input(z.object({
        sourceId: z.number(),
        targetId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return db.deleteAxisConnection(input.sourceId, input.targetId);
      }),
  }),
  
  // ============================================================================
  // REFERENCE ENTITY LINKS (Liaisons références ↔ entités)
  // ============================================================================
  referenceEntityLinks: router({
    // Créer une liaison
    create: protectedProcedure
      .input(z.object({
        referenceId: z.number(),
        entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']),
        entityId: z.number(),
        linkType: z.enum(['documents', 'mentions', 'analyzes', 'conserves', 'reconstructs', 'sources', 'validates', 'contextualizes']).optional(),
        relevanceScore: z.number().min(0).max(100).optional(),
        notes: z.string().optional(),
        context: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createReferenceEntityLink({
          ...input,
          createdBy: ctx.user?.id,
        });
      }),
    
    // Obtenir les liaisons pour une référence
    getForReference: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getLinksForReference(input);
      }),
    
    // Obtenir les références liées à une entité
    getForEntity: publicProcedure
      .input(z.object({
        entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']),
        entityId: z.number(),
      }))
      .query(async ({ input }) => {
        return db.getReferencesForEntity(input.entityType, input.entityId);
      }),
    
    // Mettre à jour une liaison
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        linkType: z.enum(['documents', 'mentions', 'analyzes', 'conserves', 'reconstructs', 'sources', 'validates', 'contextualizes']).optional(),
        relevanceScore: z.number().min(0).max(100).optional(),
        notes: z.string().optional(),
        context: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateReferenceEntityLink(id, data);
      }),
    
    // Supprimer une liaison
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteReferenceEntityLink(input);
      }),
    
    // Obtenir les statistiques
    getStats: publicProcedure.query(async () => {
      return db.getReferenceEntityLinkStats();
    }),
    
    // Bulk import from CSV
    bulkImportFromCSV: protectedProcedure
      .input(z.array(z.object({
        referenceId: z.number(),
        entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']),
        entityId: z.number(),
        linkType: z.enum(['documents', 'mentions', 'analyzes', 'conserves', 'reconstructs', 'sources', 'validates', 'contextualizes']).optional(),
        relevanceScore: z.number().min(0).max(100).optional(),
        notes: z.string().optional(),
        context: z.string().optional(),
      })))
      .mutation(async ({ input, ctx }) => {
        return db.bulkImportReferenceEntityLinks(input, ctx.user?.id);
      }),
    
    // Suggest links based on keywords
    suggestLinks: publicProcedure
      .input(z.object({
        referenceId: z.number().optional(),
        entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']).optional(),
        minScore: z.number().min(0).max(100).optional(),
        limit: z.number().min(1).max(500).optional(),
      }))
      .query(async ({ input }) => {
        return db.suggestReferenceEntityLinks(input);
      }),
    
    // Apply suggested links in bulk
    applySuggestions: protectedProcedure
      .input(z.array(z.object({
        referenceId: z.number(),
        entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']),
        entityId: z.number(),
        score: z.number().min(0).max(100),
      })))
      .mutation(async ({ input, ctx }) => {
        return db.applySuggestedLinks(input, ctx.user?.id);
      }),
    }),
    // Get graph data for D3.js visualization
    getGraphData: publicProcedure.query(async () => {
      return db.getReferenceEntityLinkGraphData();
    }),
  // ============================================================================
  // CONTRIBUTOR INTERFACE - Détection de doublons et ajout de données
  contributor: router({
    findMoleculeDuplicates: publicProcedure
      .input(z.object({
        name: z.string().optional(),
        casNumber: z.string().optional(),
        iupacName: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return db.findMoleculeDuplicates(input);
      }),
    
    // Détection de doublons pour les plantes
    findPlantDuplicates: publicProcedure
      .input(z.object({
        name: z.string().optional(),
        latinName: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return db.findPlantDuplicates(input);
      }),
    
    // Auto-complétion molécules
    searchMolecules: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        return db.searchMoleculesForAutocomplete(input.query, input.limit);
      }),
    
    // Auto-complétion plantes
    searchPlants: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        return db.searchPlantsForAutocomplete(input.query, input.limit);
      }),
    
    // Statistiques des liaisons plante-molécule
    getPlantMoleculeStats: publicProcedure.query(async () => {
      return db.getPlantMoleculeLinksStats();
    }),
    
    // Vérifier si une liaison existe
    checkLinkExists: publicProcedure
      .input(z.object({
        plantId: z.number(),
        moleculeId: z.number(),
      }))
      .query(async ({ input }) => {
        return db.checkPlantMoleculeLinkExists(input.plantId, input.moleculeId);
      }),
    
    // Créer une liaison plante-molécule
    createPlantMoleculeLink: protectedProcedure
      .input(z.object({
        plantId: z.number(),
        moleculeId: z.number(),
        percentageMin: z.number().optional(),
        percentageMax: z.number().optional(),
        percentageTypical: z.number().optional(),
        isSignature: z.number().default(0),
        role: z.enum(['majeur', 'secondaire', 'trace', 'variable']).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Vérifier si la liaison existe déjà
        const exists = await db.checkPlantMoleculeLinkExists(input.plantId, input.moleculeId);
        if (exists) {
          throw new Error('Cette liaison existe déjà');
        }
        return db.createPlantMoleculeLink(input);
      }),
    
    // Supprimer une liaison plante-molécule
    deletePlantMoleculeLink: protectedProcedure
      .input(z.object({
        plantId: z.number(),
        moleculeId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.deletePlantMoleculeLink(input.plantId, input.moleculeId);
        return { success: true };
      }),
    
    // Récupérer les plantes orphelines (sans liaisons)
    getOrphanPlants: publicProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return db.getOrphanPlants(input.limit);
      }),
    
    // Récupérer les molécules orphelines (sans liaisons)
    getOrphanMolecules: publicProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return db.getOrphanMolecules(input.limit);
      }),
    
    // Récupérer toutes les liaisons avec détails
    getAllPlantMoleculeLinks: publicProcedure
      .input(z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.getAllPlantMoleculeLinks();
      }),
    
    // Statistiques d'enrichissement PubChem
    getEnrichmentStats: publicProcedure.query(async () => {
      return db.getMoleculeEnrichmentStats();
    }),
    
    // Molécules candidates pour enrichissement
    getMoleculesForEnrichment: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return db.getMoleculesForPubChemEnrichment(input.limit);
      }),
    
    // Enrichir une molécule via PubChem (utilise le service existant)
    enrichMoleculeFromPubChem: protectedProcedure
      .input(z.object({
        moleculeId: z.number(),
        pubchemData: z.object({
          casNumber: z.string().optional(),
          iupacName: z.string().optional(),
          chemicalFormula: z.string().optional(),
          molecularWeight: z.number().optional(),
          pubchemCid: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.enrichMoleculeFromPubChem(input.moleculeId, input.pubchemData);
      }),
  }),

  // ============================================================================
  // VALIDATION & DRAFT SYSTEM ROUTER
  // ============================================================================
  validation: router({
    // Get validation statistics
    getStats: publicProcedure.query(async () => {
      return db.getValidationStats();
    }),

    // Get pending molecules
    getPendingMolecules: protectedProcedure.query(async () => {
      return db.getPendingMolecules();
    }),

    // Get pending plants
    getPendingPlants: protectedProcedure.query(async () => {
      return db.getPendingPlants();
    }),

    // Validate a molecule (admin only)
    validateMolecule: protectedProcedure
      .input(z.object({ moleculeId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.validateMolecule(input.moleculeId, ctx.user.id);
      }),

    // Reject a molecule (admin only)
    rejectMolecule: protectedProcedure
      .input(z.object({ moleculeId: z.number(), reason: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.rejectMolecule(input.moleculeId, ctx.user.id, input.reason);
      }),

    // Validate a plant (admin only)
    validatePlant: protectedProcedure
      .input(z.object({ plantId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.validatePlant(input.plantId, ctx.user.id);
      }),

    // Reject a plant (admin only)
    rejectPlant: protectedProcedure
      .input(z.object({ plantId: z.number(), reason: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.rejectPlant(input.plantId, ctx.user.id, input.reason);
      }),

    // Submit molecule for review
    submitMoleculeForReview: protectedProcedure
      .input(z.object({ moleculeId: z.number() }))
      .mutation(async ({ input }) => {
        return db.submitMoleculeForReview(input.moleculeId);
      }),

    // Submit plant for review
    submitPlantForReview: protectedProcedure
      .input(z.object({ plantId: z.number() }))
      .mutation(async ({ input }) => {
        return db.submitPlantForReview(input.plantId);
      }),

    // Get pending contributions with details
    getPendingContributions: protectedProcedure.query(async () => {
      return db.getPendingContributions();
    }),

    // Get new contributions since a date
    getNewContributionsSince: protectedProcedure
      .input(z.object({ since: z.date() }))
      .query(async ({ input }) => {
        return db.getNewContributionsSince(input.since);
      }),

    // Send notification to admin about pending contributions
    notifyAdminPendingContributions: protectedProcedure
      .mutation(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        
        const summary = await db.generatePendingContributionsSummary();
        if (!summary) {
          return { success: true, message: 'Aucune contribution en attente' };
        }

        const { notifyOwner } = await import('./_core/notification');
        const sent = await notifyOwner({
          title: summary.title,
          content: summary.content,
        });

        return {
          success: sent,
          message: sent ? 'Notification envoyée' : 'Échec de l\'envoi de la notification',
          stats: summary.stats,
        };
      }),
  }),

  // ============================================================================
  // LINKING COVERAGE & AUTO-LINK ROUTER
  // ============================================================================
  linkingCoverage: router({
    // Get overall coverage statistics
    getStats: publicProcedure.query(async () => {
      return db.getLinkingCoverageStats();
    }),

    // Auto-link molecules to recettes (dry run)
    previewAutoLink: protectedProcedure
      .input(z.object({
        maxLinks: z.number().default(50),
      }))
      .query(async ({ input }) => {
        return db.autoLinkMoleculeRecettes({ maxLinks: input.maxLinks, dryRun: true });
      }),

    // Execute auto-link molecule-recette
    executeAutoLink: protectedProcedure
      .input(z.object({
        maxLinks: z.number().default(50),
      }))
      .mutation(async ({ input }) => {
        return db.autoLinkMoleculeRecettes({ maxLinks: input.maxLinks, dryRun: false });
      }),

    // Auto-link plants to molecules (dry run)
    previewPlantMoleculeAutoLink: protectedProcedure
      .input(z.object({
        maxLinks: z.number().default(50),
      }))
      .query(async ({ input }) => {
        return db.autoLinkPlantMolecules({ maxLinks: input.maxLinks, dryRun: true });
      }),

    // Execute plant-molecule auto-link
    executePlantMoleculeAutoLink: protectedProcedure
      .input(z.object({
        maxLinks: z.number().default(50),
      }))
      .mutation(async ({ input }) => {
        return db.autoLinkPlantMolecules({ maxLinks: input.maxLinks, dryRun: false });
      }),

    // Get plant-molecule audit stats
    getPlantMoleculeAuditStats: publicProcedure.query(async () => {
      return db.getPlantMoleculeAuditStats();
    }),
  }),

  // ============================================================================
  // CURATED JOURNEYS (Parcours olfactifs prédéfinis)
  // ============================================================================
  curatedJourneys: router({
    // Liste des parcours publiés
    listPublished: publicProcedure.query(async () => {
      return db.getAllPublishedJourneys();
    }),

    // Liste de tous les parcours (admin)
    listAll: protectedProcedure.query(async () => {
      return db.getAllJourneys();
    }),

    // Parcours mis en avant
    getFeatured: publicProcedure.query(async () => {
      return db.getFeaturedJourneys();
    }),

    // Récupérer un parcours par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getJourneyById(input);
      }),

    // Récupérer un parcours par code
    getByCode: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getJourneyByCode(input);
      }),

    // Récupérer un parcours complet avec ses éléments
    getFull: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getFullJourney(input);
      }),

    // Parcours par thème
    getByTheme: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.getJourneysByTheme(input);
      }),

    // Statistiques des parcours
    getStats: publicProcedure.query(async () => {
      return db.getJourneysStats();
    }),

    // Créer un parcours
    create: protectedProcedure
      .input(z.object({
        code: z.string().min(1).max(50),
        name: z.string().min(1).max(255),
        nameEn: z.string().max(255).optional(),
        description: z.string().optional(),
        shortDescription: z.string().max(500).optional(),
        theme: z.enum(["geographic", "olfactive", "botanical", "historical", "seasonal", "therapeutic", "culinary", "sacred", "luxury", "sustainable", "custom"]),
        emoji: z.string().max(10).optional(),
        coverImageUrl: z.string().max(500).optional(),
        color: z.string().max(20).optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
        estimatedDuration: z.number().optional(),
        isPublished: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createJourney({ ...input, createdBy: ctx.user.id });
      }),

    // Mettre à jour un parcours
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          code: z.string().min(1).max(50).optional(),
          name: z.string().min(1).max(255).optional(),
          nameEn: z.string().max(255).optional(),
          description: z.string().optional(),
          shortDescription: z.string().max(500).optional(),
          theme: z.enum(["geographic", "olfactive", "botanical", "historical", "seasonal", "therapeutic", "culinary", "sacred", "luxury", "sustainable", "custom"]).optional(),
          emoji: z.string().max(10).optional(),
          coverImageUrl: z.string().max(500).optional(),
          color: z.string().max(20).optional(),
          difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
          estimatedDuration: z.number().optional(),
          isPublished: z.boolean().optional(),
          isFeatured: z.boolean().optional(),
          sortOrder: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateJourney(input.id, input.data);
      }),

    // Supprimer un parcours
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteJourney(input);
      }),

    // Récupérer les éléments d'un parcours
    getItems: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getJourneyItems(input);
      }),

    // Ajouter un élément à un parcours
    addItem: protectedProcedure
      .input(z.object({
        journeyId: z.number(),
        itemType: z.enum(["terroir", "plant", "molecule"]),
        terroirId: z.number().optional(),
        plantId: z.number().optional(),
        moleculeId: z.number().optional(),
        sortOrder: z.number().optional(),
        stepNumber: z.number().optional(),
        groupName: z.string().max(100).optional(),
        contextDescription: z.string().optional(),
        isHighlight: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.addJourneyItem(input);
      }),

    // Supprimer un élément d'un parcours
    removeItem: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.removeJourneyItem(input);
      }),

    // Mettre à jour l'ordre d'un élément
    updateItemOrder: protectedProcedure
      .input(z.object({
        itemId: z.number(),
        sortOrder: z.number(),
      }))
      .mutation(async ({ input }) => {
        return db.updateJourneyItemOrder(input.itemId, input.sortOrder);
      }),
  }),

  // ============================================================================
  // PARCOURS OLFACTIF - FILTRES AVANCÉS
  // ============================================================================
  parcoursOlfactif: router({
    // Récupérer les terroirs avec filtres
    getTerroirsWithFilters: publicProcedure
      .input(z.object({
        climate: z.string().optional(),
        country: z.string().optional(),
        search: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const allTerroirs = await db.getAllTerroirs();
        let filtered = allTerroirs;
        
        if (input.climate) {
          filtered = filtered.filter(t => t.climateType === input.climate);
        }
        if (input.country) {
          filtered = filtered.filter(t => t.country === input.country);
        }
        if (input.search) {
          const search = input.search.toLowerCase();
          filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(search) ||
            (t.productionHistory && t.productionHistory.toLowerCase().includes(search)) ||
            (t.region && t.region.toLowerCase().includes(search))
          );
        }
        return filtered;
      }),

    // Récupérer les plantes avec filtres
    getPlantsWithFilters: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        family: z.string().optional(),
        search: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const allPlants = await db.getAllPlants();
        let filtered = allPlants;
        
        if (input.category) {
          filtered = filtered.filter(p => p.category === input.category);
        }
        if (input.family) {
          filtered = filtered.filter(p => p.family === input.family);
        }
        if (input.search) {
          const search = input.search.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) ||
            (p.latinName && p.latinName.toLowerCase().includes(search)) ||
            (p.olfactiveSignature && p.olfactiveSignature.toLowerCase().includes(search))
          );
        }
        return filtered;
      }),

    // Récupérer les molécules avec filtres
    getMoleculesWithFilters: publicProcedure
      .input(z.object({
        family: z.string().optional(),
        gamme: z.string().optional(),
        search: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const allMolecules = await db.getAllMolecules();
        let filtered = allMolecules;
        
        if (input.family) {
          filtered = filtered.filter(m => m.family === input.family);
        }
        if (input.gamme) {
          filtered = filtered.filter(m => m.chemicalClass === input.gamme);
        }
        if (input.search) {
          const search = input.search.toLowerCase();
          filtered = filtered.filter(m => 
            m.name.toLowerCase().includes(search) ||
            (m.olfactiveProfile && m.olfactiveProfile.toLowerCase().includes(search)) ||
            (m.olfactiveProfile && m.olfactiveProfile.toLowerCase().includes(search))
          );
        }
        return filtered;
      }),

    // Récupérer les options de filtres disponibles
    getFilterOptions: publicProcedure.query(async () => {
      const terroirs = await db.getAllTerroirs();
      const plants = await db.getAllPlants();
      const molecules = await db.getAllMolecules();

      // Extraire les valeurs uniques pour les filtres
      const climates = Array.from(new Set(terroirs.map(t => t.climateType).filter(Boolean))) as string[];
      const countries = Array.from(new Set(terroirs.map(t => t.country).filter(Boolean))) as string[];
      const plantCategories = Array.from(new Set(plants.map(p => p.category).filter(Boolean))) as string[];
      const olfactiveFamilies = Array.from(new Set(plants.map(p => p.family).filter(Boolean))) as string[];
      const moleculeFamilies = Array.from(new Set(molecules.map(m => m.family).filter(Boolean))) as string[];
      const gammes = Array.from(new Set(molecules.map(m => m.chemicalClass).filter(Boolean))) as string[];

      return {
        climates: climates.sort(),
        countries: countries.sort(),
        plantCategories: plantCategories.sort(),
        olfactiveFamilies: olfactiveFamilies.sort(),
        moleculeFamilies: moleculeFamilies.sort(),
        gammes: gammes.sort(),
      };
    }),

    // Récupérer les liaisons plante-molécule enrichies
    getEnrichedPlantMoleculeLinks: publicProcedure
      .input(z.object({
        plantId: z.number().optional(),
        moleculeId: z.number().optional(),
      }))
      .query(async ({ input }) => {
        if (input.plantId) {
          return db.getPlantMoleculesWithPercentages(input.plantId);
        }
        if (input.moleculeId) {
          return db.getMoleculePlantsWithPercentages(input.moleculeId);
        }
        return db.getAllPlantMoleculeLinks();
      }),

    // Statistiques du parcours
    getStats: publicProcedure.query(async () => {
      const terroirs = await db.getAllTerroirs();
      const plants = await db.getAllPlants();
      const molecules = await db.getAllMolecules();
      const plantMoleculeLinks = await db.getAllPlantMoleculeLinks();
      const plantTerroirLinks = await db.getAllPlantTerroirRelationsWithNames();

      return {
        terroirCount: terroirs.length,
        plantCount: plants.length,
        moleculeCount: molecules.length,
        plantMoleculeLinkCount: plantMoleculeLinks.length,
        plantTerroirLinkCount: plantTerroirLinks.length,
      };
    }),
  }),

  // ============================================================================
  // LIENS CROISÉS (CROSS-LINKS)
  // ============================================================================
  crossLinks: router({
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
  }),

  // ============================================================================
  // AUTOMATIC ENTITY LINKING (Liaisons automatiques par mots-clés)
  // ============================================================================
  autoLinking: router({
    // Suggérer des liaisons pour une référence
    suggestForReference: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.suggestEntityLinksForReference(input);
      }),
    
    // Suggérer des liaisons en masse
    bulkSuggest: publicProcedure
      .input(z.object({
        minScore: z.number().min(0).max(100).optional(),
        limit: z.number().min(1).max(500).optional(),
        entityTypes: z.array(z.enum(['molecule', 'plant', 'terroir'])).optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.bulkSuggestEntityLinks(input || {});
      }),
    
    // Créer des liaisons en masse
    batchCreate: protectedProcedure
      .input(z.array(z.object({
        referenceId: z.number(),
        entityType: z.enum(['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier']),
        entityId: z.number(),
        linkType: z.enum(['documents', 'mentions', 'analyzes', 'conserves', 'reconstructs', 'sources', 'validates', 'contextualizes']).optional(),
        relevanceScore: z.number().min(0).max(100).optional(),
        notes: z.string().optional(),
      })))
      .mutation(async ({ input, ctx }) => {
        return db.batchCreateEntityLinks(
          input.map(link => ({ ...link, createdBy: ctx.user?.id }))
        );
      }),
  }),

  // ============================================================================
  // GRAPH VISUALIZATION (Visualisation graphique des références)
  // ============================================================================
  graphVisualization: router({
    // Obtenir les données pour le graphe
    getGraphData: publicProcedure.query(async () => {
      return db.getReferencesGroupedByAxis();
    }),
    
    // Obtenir les statistiques du graphe
    getStats: publicProcedure.query(async () => {
      return db.getGraphVisualizationStats();
    }),
    
    // Obtenir les détails d'une référence avec ses entités liées
    getReferenceDetails: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getReferenceWithLinkedEntities(input);
      }),
  }),

  // ============================================================================
  // ORPHAN MOLECULES CLASSIFICATION
  // ============================================================================
  orphanMolecules: router({
    // Obtenir les statistiques des molécules orphelines
    getStats: publicProcedure.query(async () => {
      return db.getOrphanMoleculeStats();
    }),

    // Lister les molécules orphelines avec filtres
    list: publicProcedure
      .input(z.object({
        filter: z.enum(['all', 'no_family', 'no_chemical_class', 'no_cas', 'no_iupac', 'no_formula', 'no_olfactive_profile', 'no_radar']).default('all'),
        limit: z.number().default(100),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return db.getOrphanMoleculesList(input.filter, input.limit, input.offset);
      }),

    // Classifier des molécules en masse
    batchClassify: protectedProcedure
      .input(z.array(z.object({
        moleculeId: z.number(),
        family: z.string().optional(),
        chemicalClass: z.string().optional(),
        olfactiveProfile: z.string().optional(),
      })))
      .mutation(async ({ input }) => {
        return db.batchClassifyMolecules(input);
      }),
  }),

  // ============================================================================
  // NOTIFICATIONS SYSTEM
  // ============================================================================
  notifications: router({
    // Lister les notifications
    list: publicProcedure
      .input(z.object({
        unreadOnly: z.boolean().default(false),
        type: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional())
      .query(async ({ input }) => {
        return db.getNotifications(input || {});
      }),

    // Marquer une notification comme lue
    markAsRead: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        return db.markNotificationAsRead(input, ctx.user?.id);
      }),

    // Marquer toutes les notifications comme lues
    markAllAsRead: protectedProcedure
      .mutation(async ({ ctx }) => {
        return db.markAllNotificationsAsRead(ctx.user?.id);
      }),

    // Supprimer une notification
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteNotification(input);
      }),

    // Créer une notification (admin)
    create: protectedProcedure
      .input(z.object({
        type: z.enum(['import_orphan_molecules', 'new_contribution', 'validation_required', 'classification_milestone', 'system_alert', 'data_quality', 'other']),
        title: z.string(),
        message: z.string(),
        severity: z.enum(['info', 'warning', 'error', 'success']).default('info'),
        entityType: z.string().optional(),
        entityId: z.number().optional(),
        metadata: z.object({}).passthrough().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createNotification(input as any);
      }),
  }),

  // ============================================================================
  // CLASSIFICATION PROGRESS REPORTS
  // ============================================================================
  progressReports: router({
    // Créer un snapshot de l'état actuel
    createSnapshot: protectedProcedure
      .input(z.object({
        notes: z.string().optional(),
      }).optional())
      .mutation(async ({ input, ctx }) => {
        return db.createClassificationSnapshot(input?.notes, ctx.user?.id);
      }),

    // Obtenir le dernier snapshot
    getLatest: publicProcedure.query(async () => {
      return db.getLatestSnapshot();
    }),

    // Lister les snapshots
    listSnapshots: publicProcedure
      .input(z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getClassificationSnapshots(input || {});
      }),

    // Obtenir le rapport de progression complet
    getReport: publicProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getProgressReport(input?.startDate, input?.endDate);
      }),
  }),

  // ============================================================================
  // AI-ASSISTED CLASSIFICATION
  // ============================================================================
  ai: router({
    // Classifier une molécule avec l'IA
    classifyMolecule: publicProcedure
      .input(z.object({
        name: z.string(),
        iupacName: z.string().optional(),
        casNumber: z.string().optional(),
        chemicalFormula: z.string().optional(),
        olfactiveProfile: z.string().optional(),
        botanicalSources: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        // Construire le contexte pour l'IA
        const moleculeContext = [
          `Nom: ${input.name}`,
          input.iupacName ? `Nom IUPAC: ${input.iupacName}` : null,
          input.casNumber ? `Numéro CAS: ${input.casNumber}` : null,
          input.chemicalFormula ? `Formule chimique: ${input.chemicalFormula}` : null,
          input.olfactiveProfile ? `Profil olfactif: ${input.olfactiveProfile}` : null,
          input.botanicalSources ? `Sources botaniques: ${input.botanicalSources}` : null,
        ].filter(Boolean).join("\n");

        const systemPrompt = `Tu es un expert en chimie des parfums et en olfaction. Tu dois analyser une molécule aromatique et suggérer sa classification.

Classes chimiques disponibles:
- terpene: Terpènes généraux (hydrocarbures dérivés de l'isoprène)
- monoterpene: Monoterpènes (C10, ex: limonène, pinène)
- sesquiterpene: Sesquiterpènes (C15, ex: caryophyllène)
- diterpene: Diterpènes (C20)
- aldehyde: Aldéhydes (groupe -CHO, ex: citral, vanilline)
- ketone: Cétones (groupe C=O, ex: carvone, ionone)
- alcohol: Alcools (groupe -OH, ex: linalol, géraniol)
- ester: Esters (groupe -COO-, ex: acétate de linalyle)
- ether: Éthers (groupe C-O-C, ex: anéthol)
- phenol: Phénols (groupe -OH sur cycle aromatique, ex: eugénol)
- lactone: Lactones (esters cycliques, ex: coumarine)
- coumarin: Coumarines spécifiquement
- musk: Muscs (macrocycliques ou nitromuscs)
- nitrile: Nitriles (groupe -CN)
- sulfur_compound: Composés soufrés (thiols, sulfures)
- heterocyclic: Hétérocycliques (cycles avec N, O, S)
- aromatic: Composés aromatiques généraux
- aliphatic: Composés aliphatiques
- other: Autre classe

Familles olfactives disponibles:
- floral: Notes florales (rose, jasmin, muguet)
- boise: Notes boisées (cèdre, santal, vétiver)
- agrume: Notes agrumes/hespéridées (citron, orange, bergamote)
- epice: Notes épicées (cannelle, clou de girofle, poivre)
- herbace: Notes herbacées (lavande, romarin, thym)
- balsamique: Notes balsamiques (benjoin, tolu, vanille)
- musque: Notes musquées
- animal: Notes animales (ambre gris, castoreum)
- vert: Notes vertes (feuille, gazon, galbanum)
- fruite: Notes fruitées (pomme, pêche, baies)
- marin: Notes marines/ozôniques
- terreux: Notes terreuses (mousse, terre, champignon)
- fume: Notes fumées/cuirées
- gourmand: Notes gourmandes (caramel, chocolat, café)
- aromatique: Notes aromatiques (herbes de Provence)
- autre: Autre famille

Réponds UNIQUEMENT avec un objet JSON valide, sans texte supplémentaire.`;

        const userPrompt = `Analyse cette molécule et suggère sa classification:

${moleculeContext}

Réponds avec un JSON contenant:
- chemicalClass: la classe chimique la plus appropriée (une seule valeur parmi la liste)
- chemicalClassConfidence: niveau de confiance (0-100)
- chemicalClassReasoning: explication courte de ton choix
- olfactiveFamily: la famille olfactive principale (une seule valeur parmi la liste)
- olfactiveFamilyConfidence: niveau de confiance (0-100)
- olfactiveFamilyReasoning: explication courte de ton choix
- suggestedOlfactiveProfile: description olfactive suggérée si non fournie
- additionalNotes: notes supplémentaires utiles pour le chercheur`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "molecule_classification",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    chemicalClass: {
                      type: "string",
                      enum: ["terpene", "sesquiterpene", "diterpene", "monoterpene", "aldehyde", "ketone", "alcohol", "ester", "ether", "phenol", "lactone", "coumarin", "musk", "nitrile", "sulfur_compound", "heterocyclic", "aromatic", "aliphatic", "other"],
                      description: "Classe chimique principale de la molécule"
                    },
                    chemicalClassConfidence: {
                      type: "number",
                      description: "Niveau de confiance pour la classe chimique (0-100)"
                    },
                    chemicalClassReasoning: {
                      type: "string",
                      description: "Explication du choix de classe chimique"
                    },
                    olfactiveFamily: {
                      type: "string",
                      enum: ["floral", "boise", "agrume", "epice", "herbace", "balsamique", "musque", "animal", "vert", "fruite", "marin", "terreux", "fume", "gourmand", "aromatique", "autre"],
                      description: "Famille olfactive principale"
                    },
                    olfactiveFamilyConfidence: {
                      type: "number",
                      description: "Niveau de confiance pour la famille olfactive (0-100)"
                    },
                    olfactiveFamilyReasoning: {
                      type: "string",
                      description: "Explication du choix de famille olfactive"
                    },
                    suggestedOlfactiveProfile: {
                      type: "string",
                      description: "Description olfactive suggérée"
                    },
                    additionalNotes: {
                      type: "string",
                      description: "Notes supplémentaires pour le chercheur"
                    }
                  },
                  required: ["chemicalClass", "chemicalClassConfidence", "chemicalClassReasoning", "olfactiveFamily", "olfactiveFamilyConfidence", "olfactiveFamilyReasoning", "suggestedOlfactiveProfile", "additionalNotes"],
                  additionalProperties: false
                }
              }
            }
          });

          const content = response.choices[0]?.message?.content;
          if (typeof content === "string") {
            const parsed = JSON.parse(content);
            return {
              success: true,
              classification: parsed,
              inputData: input,
            };
          }
          throw new Error("Réponse IA invalide");
        } catch (error) {
          console.error("Erreur classification IA:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
            inputData: input,
          };
        }
      }),

    // Classifier plusieurs molécules en batch
    classifyMoleculesBatch: protectedProcedure
      .input(z.array(z.object({
        id: z.number(),
        name: z.string(),
        iupacName: z.string().optional(),
        casNumber: z.string().optional(),
        chemicalFormula: z.string().optional(),
        olfactiveProfile: z.string().optional(),
        botanicalSources: z.string().optional(),
      })))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const results: Array<{
          id: number;
          name: string;
          success: boolean;
          classification?: any;
          error?: string;
        }> = [];

        // Traiter par lots de 5 pour éviter les timeouts
        for (let i = 0; i < input.length; i += 5) {
          const batch = input.slice(i, i + 5);
          
          const batchPromises = batch.map(async (molecule) => {
            const moleculeContext = [
              `Nom: ${molecule.name}`,
              molecule.iupacName ? `Nom IUPAC: ${molecule.iupacName}` : null,
              molecule.casNumber ? `Numéro CAS: ${molecule.casNumber}` : null,
              molecule.chemicalFormula ? `Formule chimique: ${molecule.chemicalFormula}` : null,
              molecule.olfactiveProfile ? `Profil olfactif: ${molecule.olfactiveProfile}` : null,
              molecule.botanicalSources ? `Sources botaniques: ${molecule.botanicalSources}` : null,
            ].filter(Boolean).join("\n");

            try {
              const response = await invokeLLM({
                messages: [
                  { role: "system", content: `Tu es un expert en chimie des parfums. Analyse cette molécule et suggère sa classification chimique et olfactive. Réponds UNIQUEMENT en JSON valide.` },
                  { role: "user", content: `Molécule:\n${moleculeContext}\n\nRéponds avec: chemicalClass (terpene|sesquiterpene|diterpene|monoterpene|aldehyde|ketone|alcohol|ester|ether|phenol|lactone|coumarin|musk|nitrile|sulfur_compound|heterocyclic|aromatic|aliphatic|other), olfactiveFamily (floral|boise|agrume|epice|herbace|balsamique|musque|animal|vert|fruite|marin|terreux|fume|gourmand|aromatique|autre), confidence (0-100), reasoning.` },
                ],
                response_format: {
                  type: "json_schema",
                  json_schema: {
                    name: "batch_classification",
                    strict: true,
                    schema: {
                      type: "object",
                      properties: {
                        chemicalClass: { type: "string" },
                        olfactiveFamily: { type: "string" },
                        confidence: { type: "number" },
                        reasoning: { type: "string" }
                      },
                      required: ["chemicalClass", "olfactiveFamily", "confidence", "reasoning"],
                      additionalProperties: false
                    }
                  }
                }
              });

              const content = response.choices[0]?.message?.content;
              if (typeof content === "string") {
                return {
                  id: molecule.id,
                  name: molecule.name,
                  success: true,
                  classification: JSON.parse(content),
                };
              }
              throw new Error("Réponse invalide");
            } catch (error) {
              return {
                id: molecule.id,
                name: molecule.name,
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);
        }

        return {
          total: input.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          results,
        };
      }),

    // Suggérer un profil olfactif basé sur le nom et la structure
    suggestOlfactiveProfile: publicProcedure
      .input(z.object({
        name: z.string(),
        chemicalClass: z.string().optional(),
        chemicalFormula: z.string().optional(),
        botanicalSources: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");

        const context = [
          `Nom: ${input.name}`,
          input.chemicalClass ? `Classe chimique: ${input.chemicalClass}` : null,
          input.chemicalFormula ? `Formule: ${input.chemicalFormula}` : null,
          input.botanicalSources ? `Sources: ${input.botanicalSources}` : null,
        ].filter(Boolean).join("\n");

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: "Tu es un parfumeur expert. Décris le profil olfactif de cette molécule de manière précise et poétique, en utilisant le vocabulaire professionnel de la parfumerie. Limite ta réponse à 2-3 phrases." },
              { role: "user", content: `Décris le profil olfactif de cette molécule:\n${context}` },
            ],
          });

          const content = response.choices[0]?.message?.content;
          return {
            success: true,
            profile: typeof content === "string" ? content : "",
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
          };
        }
      }),

    // ============================================================================
    // CLASSIFICATION EN MASSE AVEC DONNÉES DES PLANTES SOURCES
    // ============================================================================

    /**
     * Récupère les molécules sans classe chimique avec leurs plantes sources
     * pour enrichir le contexte de classification IA
     */
    getUnclassifiedMoleculesWithPlants: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(500).default(100),
        offset: z.number().min(0).default(0),
      }))
      .query(async ({ input }) => {
        // Récupérer les molécules sans classe chimique
        const { molecules: unclassifiedMolecules, total } = await db.getOrphanMoleculesList('no_chemical_class', input.limit, input.offset);
        
        // Pour chaque molécule, récupérer les plantes sources liées
        const moleculesWithPlants = await Promise.all(
          unclassifiedMolecules.map(async (molecule) => {
            const plantLinks = await db.getPlantsByMolecule(molecule.id);
            const plantSources = plantLinks.map(link => ({
              id: link.plant.id,
              name: link.plant.name,
              latinName: link.plant.latinName,
              family: link.plant.family,
              category: link.plant.category,
              percentageTypical: link.percentageTypical,
              role: link.role,
              isSignature: link.isSignature,
            }));
            
            return {
              ...molecule,
              plantSources,
              plantSourcesCount: plantSources.length,
              botanicalContext: plantSources.length > 0 
                ? `Présent dans: ${plantSources.map(p => `${p.name} (${p.latinName || 'N/A'}, famille ${p.family || 'inconnue'}${p.percentageTypical ? `, ${p.percentageTypical}%` : ''})`).join('; ')}`
                : null,
            };
          })
        );

        return {
          molecules: moleculesWithPlants,
          total,
          limit: input.limit,
          offset: input.offset,
        };
      }),

    /**
     * Classification en masse améliorée avec contexte botanique enrichi
     * Utilise les données des plantes sources pour améliorer la précision
     */
    classifyMoleculesBatchEnhanced: protectedProcedure
      .input(z.object({
        moleculeIds: z.array(z.number()).min(1).max(50),
        autoApply: z.boolean().default(false), // Si true, applique automatiquement les classifications
        confidenceThreshold: z.number().min(0).max(100).default(70), // Seuil de confiance pour auto-apply
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const results: Array<{
          id: number;
          name: string;
          success: boolean;
          classification?: {
            chemicalClass: string;
            chemicalClassConfidence: number;
            chemicalClassReasoning: string;
            olfactiveFamily: string;
            olfactiveFamilyConfidence: number;
            olfactiveFamilyReasoning: string;
            suggestedOlfactiveProfile?: string;
            botanicalContextUsed: boolean;
          };
          applied?: boolean;
          error?: string;
        }> = [];

        // Récupérer toutes les molécules avec leurs plantes sources
        const moleculesData = await Promise.all(
          input.moleculeIds.map(async (id) => {
            const molecule = await db.getMoleculeById(id);
            if (!molecule) return null;
            
            const plantLinks = await db.getPlantsByMolecule(id);
            return {
              molecule,
              plantSources: plantLinks.map(link => ({
                name: link.plant.name,
                latinName: link.plant.latinName,
                family: link.plant.family,
                category: link.plant.category,
                percentageTypical: link.percentageTypical,
                role: link.role,
                isSignature: link.isSignature,
              })),
            };
          })
        );

        // Filtrer les molécules valides
        const validMolecules = moleculesData.filter((m): m is NonNullable<typeof m> => m !== null);

        // Traiter par lots de 5 pour éviter les timeouts
        for (let i = 0; i < validMolecules.length; i += 5) {
          const batch = validMolecules.slice(i, i + 5);
          
          const batchPromises = batch.map(async ({ molecule, plantSources }) => {
            // Construire le contexte enrichi avec les données botaniques
            const botanicalContext = plantSources.length > 0
              ? `\n\nSOURCES BOTANIQUES (${plantSources.length} plante(s)):\n` + 
                plantSources.map((p, idx) => 
                  `${idx + 1}. ${p.name} (${p.latinName || 'N/A'})\n` +
                  `   - Famille botanique: ${p.family || 'inconnue'}\n` +
                  `   - Catégorie: ${p.category || 'non spécifiée'}\n` +
                  `   - Concentration typique: ${p.percentageTypical || 'non spécifiée'}%\n` +
                  `   - Rôle: ${p.role || 'non spécifié'}\n` +
                  `   - Molécule signature: ${p.isSignature ? 'Oui' : 'Non'}`
                ).join('\n')
              : '';

            const moleculeContext = [
              `NOM: ${molecule.name}`,
              molecule.iupacName ? `NOM IUPAC: ${molecule.iupacName}` : null,
              molecule.casNumber ? `NUMÉRO CAS: ${molecule.casNumber}` : null,
              molecule.chemicalFormula ? `FORMULE CHIMIQUE: ${molecule.chemicalFormula}` : null,
              molecule.olfactiveProfile ? `PROFIL OLFACTIF EXISTANT: ${molecule.olfactiveProfile}` : null,
              molecule.family ? `FAMILLE OLFACTIVE EXISTANTE: ${molecule.family}` : null,
              botanicalContext,
            ].filter(Boolean).join("\n");

            const systemPrompt = `Tu es un expert en chimie des parfums et en phytochimie. Tu dois analyser une molécule aromatique et déterminer sa classification chimique et olfactive.

IMPORTANT: Utilise les informations sur les SOURCES BOTANIQUES pour affiner ta classification. Les familles botaniques donnent des indices précieux sur la classe chimique probable:
- Lamiaceae (menthe, lavande, thym): souvent monoterpènes, alcools terpéniques
- Rutaceae (agrumes): monoterpènes, aldéhydes, coumarines
- Asteraceae (camomille, armoise): sesquiterpènes, lactones
- Lauraceae (cannelle, laurier): aldéhydes aromatiques, phénols
- Myrtaceae (eucalyptus, girofle): oxydes terpéniques, phénols
- Zingiberaceae (gingembre, curcuma): sesquiterpènes, cétones
- Apiaceae (anis, fenouil): phénylpropanoïdes, éthers
- Pinaceae (pin, sapin): monoterpènes, résines
- Cannabaceae (cannabis, houblon): sesquiterpènes, monoterpènes
- Burseraceae (encens, myrrhe): diterpènes, sesquiterpènes

Classes chimiques disponibles:
- terpene, monoterpene, sesquiterpene, diterpene
- aldehyde, ketone, alcohol, ester, ether
- phenol, lactone, coumarin
- musk, nitrile, sulfur_compound
- heterocyclic, aromatic, aliphatic, other

Familles olfactives disponibles:
- floral, boise, agrume, epice, herbace, balsamique
- musque, animal, vert, fruite, marin, terreux
- fume, gourmand, aromatique, autre`;

            const userPrompt = `Analyse cette molécule et fournis sa classification:\n\n${moleculeContext}\n\nRéponds en JSON avec:
- chemicalClass: la classe chimique principale
- chemicalClassConfidence: niveau de confiance (0-100)
- chemicalClassReasoning: explication du choix (mentionner les indices botaniques utilisés)
- olfactiveFamily: la famille olfactive principale
- olfactiveFamilyConfidence: niveau de confiance (0-100)
- olfactiveFamilyReasoning: explication du choix
- suggestedOlfactiveProfile: description olfactive suggérée (2-3 phrases)`;

            try {
              const response = await invokeLLM({
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: userPrompt },
                ],
                response_format: {
                  type: "json_schema",
                  json_schema: {
                    name: "enhanced_classification",
                    strict: true,
                    schema: {
                      type: "object",
                      properties: {
                        chemicalClass: { 
                          type: "string",
                          enum: ["terpene", "sesquiterpene", "diterpene", "monoterpene", "aldehyde", "ketone", "alcohol", "ester", "ether", "phenol", "lactone", "coumarin", "musk", "nitrile", "sulfur_compound", "heterocyclic", "aromatic", "aliphatic", "other"]
                        },
                        chemicalClassConfidence: { type: "number" },
                        chemicalClassReasoning: { type: "string" },
                        olfactiveFamily: { 
                          type: "string",
                          enum: ["floral", "boise", "agrume", "epice", "herbace", "balsamique", "musque", "animal", "vert", "fruite", "marin", "terreux", "fume", "gourmand", "aromatique", "autre"]
                        },
                        olfactiveFamilyConfidence: { type: "number" },
                        olfactiveFamilyReasoning: { type: "string" },
                        suggestedOlfactiveProfile: { type: "string" }
                      },
                      required: ["chemicalClass", "chemicalClassConfidence", "chemicalClassReasoning", "olfactiveFamily", "olfactiveFamilyConfidence", "olfactiveFamilyReasoning", "suggestedOlfactiveProfile"],
                      additionalProperties: false
                    }
                  }
                }
              });

              const content = response.choices[0]?.message?.content;
              if (typeof content === "string") {
                const classification = JSON.parse(content);
                
                // Auto-apply si demandé et confiance suffisante
                let applied = false;
                if (input.autoApply && 
                    classification.chemicalClassConfidence >= input.confidenceThreshold) {
                  await db.batchClassifyMolecules([{
                    moleculeId: molecule.id,
                    chemicalClass: classification.chemicalClass,
                    family: classification.olfactiveFamily,
                    olfactiveProfile: classification.suggestedOlfactiveProfile || undefined,
                  }]);
                  applied = true;
                }

                return {
                  id: molecule.id,
                  name: molecule.name,
                  success: true,
                  classification: {
                    ...classification,
                    botanicalContextUsed: plantSources.length > 0,
                  },
                  applied,
                };
              }
              throw new Error("Réponse invalide");
            } catch (error) {
              return {
                id: molecule.id,
                name: molecule.name,
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);
        }

        const successful = results.filter(r => r.success);
        const applied = results.filter(r => r.applied);

        return {
          total: input.moleculeIds.length,
          processed: validMolecules.length,
          successful: successful.length,
          failed: results.filter(r => !r.success).length,
          applied: applied.length,
          results,
          summary: {
            withBotanicalContext: results.filter(r => r.classification?.botanicalContextUsed).length,
            highConfidence: successful.filter(r => r.classification && r.classification.chemicalClassConfidence >= 80).length,
            mediumConfidence: successful.filter(r => r.classification && r.classification.chemicalClassConfidence >= 50 && r.classification.chemicalClassConfidence < 80).length,
            lowConfidence: successful.filter(r => r.classification && r.classification.chemicalClassConfidence < 50).length,
          },
        };
      }),

    /**
     * Classification automatique de toutes les molécules sans classe chimique
     * Traite par lots avec progression
     */
    classifyAllUnclassified: protectedProcedure
      .input(z.object({
        batchSize: z.number().min(5).max(50).default(20),
        autoApply: z.boolean().default(false),
        confidenceThreshold: z.number().min(0).max(100).default(75),
        maxMolecules: z.number().min(1).max(500).default(100),
      }))
      .mutation(async ({ input, ctx }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        // Récupérer toutes les molécules sans classe chimique
        const { molecules: unclassifiedMolecules, total } = await db.getOrphanMoleculesList(
          'no_chemical_class', 
          input.maxMolecules, 
          0
        );

        if (unclassifiedMolecules.length === 0) {
          return {
            success: true,
            message: "Aucune molécule à classifier",
            total: 0,
            processed: 0,
            successful: 0,
            failed: 0,
            applied: 0,
            results: [],
          };
        }

        const allResults: Array<{
          id: number;
          name: string;
          success: boolean;
          classification?: any;
          applied?: boolean;
          error?: string;
        }> = [];

        // Traiter par lots
        for (let offset = 0; offset < unclassifiedMolecules.length; offset += input.batchSize) {
          const batch = unclassifiedMolecules.slice(offset, offset + input.batchSize);
          
          // Récupérer les plantes sources pour chaque molécule du lot
          const batchWithPlants = await Promise.all(
            batch.map(async (molecule) => {
              const plantLinks = await db.getPlantsByMolecule(molecule.id);
              return {
                molecule,
                plantSources: plantLinks.map(link => ({
                  name: link.plant.name,
                  latinName: link.plant.latinName,
                  family: link.plant.family,
                  category: link.plant.category,
                  percentageTypical: link.percentageTypical,
                  role: link.role,
                })),
              };
            })
          );

          // Classifier chaque molécule du lot
          const batchPromises = batchWithPlants.map(async ({ molecule, plantSources }) => {
            const botanicalContext = plantSources.length > 0
              ? `\nSources botaniques: ${plantSources.map(p => `${p.name} (${p.family || 'famille inconnue'})`).join(', ')}`
              : '';

            const context = [
              `Nom: ${molecule.name}`,
              molecule.iupacName ? `IUPAC: ${molecule.iupacName}` : null,
              molecule.casNumber ? `CAS: ${molecule.casNumber}` : null,
              molecule.chemicalFormula ? `Formule: ${molecule.chemicalFormula}` : null,
              molecule.olfactiveProfile ? `Profil: ${molecule.olfactiveProfile}` : null,
              botanicalContext,
            ].filter(Boolean).join("\n");

            try {
              const response = await invokeLLM({
                messages: [
                  { 
                    role: "system", 
                    content: `Tu es un expert en chimie des parfums. Analyse cette molécule et suggère sa classe chimique. Utilise les sources botaniques comme indices (ex: Lamiaceae → monoterpènes, Rutaceae → aldéhydes/coumarines, etc.).` 
                  },
                  { 
                    role: "user", 
                    content: `Molécule:\n${context}\n\nClasse chimique parmi: terpene, monoterpene, sesquiterpene, diterpene, aldehyde, ketone, alcohol, ester, ether, phenol, lactone, coumarin, musk, nitrile, sulfur_compound, heterocyclic, aromatic, aliphatic, other` 
                  },
                ],
                response_format: {
                  type: "json_schema",
                  json_schema: {
                    name: "quick_classification",
                    strict: true,
                    schema: {
                      type: "object",
                      properties: {
                        chemicalClass: { type: "string" },
                        confidence: { type: "number" },
                        reasoning: { type: "string" }
                      },
                      required: ["chemicalClass", "confidence", "reasoning"],
                      additionalProperties: false
                    }
                  }
                }
              });

              const content = response.choices[0]?.message?.content;
              if (typeof content === "string") {
                const classification = JSON.parse(content);
                
                let applied = false;
                if (input.autoApply && classification.confidence >= input.confidenceThreshold) {
                  await db.batchClassifyMolecules([{
                    moleculeId: molecule.id,
                    chemicalClass: classification.chemicalClass,
                  }]);
                  applied = true;
                }

                return {
                  id: molecule.id,
                  name: molecule.name,
                  success: true,
                  classification,
                  applied,
                };
              }
              throw new Error("Réponse invalide");
            } catch (error) {
              return {
                id: molecule.id,
                name: molecule.name,
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          allResults.push(...batchResults);
        }

        const successful = allResults.filter(r => r.success);
        const applied = allResults.filter(r => r.applied);

        // Créer une notification si des molécules ont été classifiées
        if (applied.length > 0) {
          await db.createNotification({
            type: 'classification_milestone',
            title: 'Classification IA terminée',
            message: `${applied.length} molécules ont été classifiées automatiquement sur ${allResults.length} traitées.`,
            severity: 'success',
            metadata: {
              count: applied.length,
              moleculeIds: applied.map(r => r.id),
            },
          });
        }

        return {
          success: true,
          message: `Classification terminée: ${successful.length}/${allResults.length} réussies, ${applied.length} appliquées`,
          total: unclassifiedMolecules.length,
          totalInDatabase: total,
          processed: allResults.length,
          successful: successful.length,
          failed: allResults.filter(r => !r.success).length,
          applied: applied.length,
          results: allResults,
        };
      }),

    /**
     * Statistiques sur les molécules non classifiées
     */
    getUnclassifiedStats: publicProcedure.query(async () => {
      const { total: noChemicalClass } = await db.getOrphanMoleculesList('no_chemical_class', 1, 0);
      const { total: noFamily } = await db.getOrphanMoleculesList('no_family', 1, 0);
      const { total: noOlfactiveProfile } = await db.getOrphanMoleculesList('no_olfactive_profile', 1, 0);
      const { total: noCas } = await db.getOrphanMoleculesList('no_cas', 1, 0);
      const { total: noIupac } = await db.getOrphanMoleculesList('no_iupac', 1, 0);
      const { total: noFormula } = await db.getOrphanMoleculesList('no_formula', 1, 0);
      
      const allMolecules = await db.getAllMolecules();
      const totalMolecules = allMolecules.length;

      // Compter les molécules avec plantes sources
      const moleculesWithPlants = new Set<number>();
      for (const mol of allMolecules) {
        const plants = await db.getPlantsByMolecule(mol.id);
        if (plants.length > 0) {
          moleculesWithPlants.add(mol.id);
        }
      }

      return {
        totalMolecules,
        noChemicalClass,
        noFamily,
        noOlfactiveProfile,
        noCas,
        noIupac,
        noFormula,
        withPlantSources: moleculesWithPlants.size,
        classificationRate: Math.round(((totalMolecules - noChemicalClass) / totalMolecules) * 100),
        familyRate: Math.round(((totalMolecules - noFamily) / totalMolecules) * 100),
        plantLinkageRate: Math.round((moleculesWithPlants.size / totalMolecules) * 100),
      };
    }),
  }),

  // ============================================================================
  // CLASSIFICATION REVIEWS (Low Confidence Review Queue)
  // ============================================================================
  classificationReviews: router({
    // Obtenir les statistiques des révisions
    getStats: publicProcedure.query(async () => {
      return db.getReviewStats();
    }),

    // Lister les révisions en attente
    getPending: publicProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        maxConfidence: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getPendingReviews(input || {});
      }),

    // Obtenir une révision par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getReviewById(input);
      }),

    // Approuver une révision
    approve: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        return db.approveReview(input, ctx.user?.id);
      }),

    // Rejeter une révision
    reject: protectedProcedure
      .input(z.object({
        reviewId: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.rejectReview(input.reviewId, ctx.user?.id, input.notes);
      }),

    // Modifier et appliquer une révision
    modifyAndApply: protectedProcedure
      .input(z.object({
        reviewId: z.number(),
        chemicalClass: z.string().optional(),
        olfactiveFamily: z.string().optional(),
        olfactiveProfile: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.modifyAndApplyReview(
          input.reviewId,
          {
            chemicalClass: input.chemicalClass,
            olfactiveFamily: input.olfactiveFamily,
            olfactiveProfile: input.olfactiveProfile,
          },
          ctx.user?.id,
          input.notes
        );
      }),

    // Ignorer une révision
    skip: protectedProcedure
      .input(z.object({
        reviewId: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.skipReview(input.reviewId, ctx.user?.id, input.notes);
      }),

    // Créer une révision manuellement
    create: protectedProcedure
      .input(z.object({
        moleculeId: z.number(),
        aiChemicalClass: z.string().optional(),
        aiChemicalClassConfidence: z.number().optional(),
        aiChemicalClassReasoning: z.string().optional(),
        aiOlfactiveFamily: z.string().optional(),
        aiOlfactiveFamilyConfidence: z.number().optional(),
        aiOlfactiveFamilyReasoning: z.string().optional(),
        aiSuggestedOlfactiveProfile: z.string().optional(),
        aiBotanicalContextUsed: z.boolean().optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createClassificationReview(input);
      }),
  }),

  // Ghost Varieties (Variétés fantômes - AX1)
  ghostVarieties: router({
    list: publicProcedure.query(async () => {
      return db.getAllGhostVarieties();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getGhostVarietyById(input);
      }),
    getByType: publicProcedure
      .input(z.enum(['rose', 'jasmine', 'tobacco', 'cannabis', 'lavender', 'citrus', 'aromatic_herb', 'resin_tree', 'other']))
      .query(async ({ input }) => {
        return db.getGhostVarietiesByType(input);
      }),
    getByStatus: publicProcedure
      .input(z.enum(['extinct', 'extinct_wild', 'critically_endangered', 'endangered', 'vulnerable', 'near_threatened', 'reconstructed', 'unknown']))
      .query(async ({ input }) => {
        return db.getGhostVarietiesByStatus(input);
      }),
    search: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return db.searchGhostVarieties(input);
      }),
    getStats: publicProcedure.query(async () => {
      return db.getGhostVarietiesStats();
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        scientificName: z.string().optional(),
        commonNames: z.array(z.string()).optional(),
        plantFamily: z.string().optional(),
        genus: z.string().optional(),
        species: z.string().optional(),
        cultivar: z.string().optional(),
        varietyType: z.enum(['rose', 'jasmine', 'tobacco', 'cannabis', 'lavender', 'citrus', 'aromatic_herb', 'resin_tree', 'other']),
        conservationStatus: z.enum(['extinct', 'extinct_wild', 'critically_endangered', 'endangered', 'vulnerable', 'near_threatened', 'reconstructed', 'unknown']),
        lastDocumentedYear: z.number().optional(),
        lastDocumentedLocation: z.string().optional(),
        peakCultivationPeriod: z.string().optional(),
        disappearanceCauses: z.array(z.string()).optional(),
        olfactiveProfile: z.string().optional(),
        molecularProfile: z.array(z.object({
          molecule: z.string(),
          percentage: z.number().optional(),
          note: z.string().optional(),
        })).optional(),
        reconstructionAttempts: z.array(z.object({
          year: z.number(),
          institution: z.string().optional(),
          method: z.string().optional(),
          success: z.boolean().optional(),
          notes: z.string().optional(),
        })).optional(),
        historicalSources: z.array(z.object({
          title: z.string(),
          author: z.string().optional(),
          year: z.number().optional(),
          type: z.string().optional(),
        })).optional(),
        description: z.string().optional(),
        historicalSignificance: z.string().optional(),
        notes: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createGhostVariety({
          ...input,
          createdBy: ctx.user?.id,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          scientificName: z.string().optional(),
          commonNames: z.array(z.string()).optional(),
          plantFamily: z.string().optional(),
          genus: z.string().optional(),
          species: z.string().optional(),
          cultivar: z.string().optional(),
          varietyType: z.enum(['rose', 'jasmine', 'tobacco', 'cannabis', 'lavender', 'citrus', 'aromatic_herb', 'resin_tree', 'other']).optional(),
          conservationStatus: z.enum(['extinct', 'extinct_wild', 'critically_endangered', 'endangered', 'vulnerable', 'near_threatened', 'reconstructed', 'unknown']).optional(),
          lastDocumentedYear: z.number().optional(),
          lastDocumentedLocation: z.string().optional(),
          peakCultivationPeriod: z.string().optional(),
          disappearanceCauses: z.array(z.string()).optional(),
          olfactiveProfile: z.string().optional(),
          description: z.string().optional(),
          historicalSignificance: z.string().optional(),
          notes: z.string().optional(),
          imageUrl: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateGhostVariety(input.id, input.data);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteGhostVariety(input);
      }),
  }),

  // Genomic Links (Liaisons génomiques - G1-G3)
  genomicLinks: router({
    // Molecule links
    moleculeLinks: router({
      list: publicProcedure.query(async () => {
        return db.getAllGenomicMoleculeLinks();
      }),
      getForMolecule: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
          return db.getGenomicLinksForMolecule(input);
        }),
      getByAxis: publicProcedure
        .input(z.enum(['G1', 'G2', 'G3']))
        .query(async ({ input }) => {
          return db.getGenomicMoleculeLinksByAxis(input);
        }),
      getForReference: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
          return db.getGenomicMoleculeLinksForReference(input);
        }),
      create: protectedProcedure
        .input(z.object({
          referenceId: z.number(),
          moleculeId: z.number(),
          genomicAxis: z.enum(['G1', 'G2', 'G3']),
          linkType: z.enum(['biosynthesis', 'characterization', 'quantification', 'pathway', 'gene_association', 'regulation', 'evolution', 'application', 'other']).optional(),
          relevanceScore: z.number().min(0).max(100).optional(),
          confidence: z.enum(['high', 'medium', 'low']).optional(),
          geneNames: z.array(z.string()).optional(),
          pathwayName: z.string().optional(),
          enzymeNames: z.array(z.string()).optional(),
          notes: z.string().optional(),
          excerpt: z.string().optional(),
          pageNumbers: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          return db.createGenomicMoleculeLink({
            ...input,
            createdBy: ctx.user?.id,
          });
        }),
      delete: protectedProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
          return db.deleteGenomicMoleculeLink(input);
        }),
    }),
    // Plant links
    plantLinks: router({
      list: publicProcedure.query(async () => {
        return db.getAllGenomicPlantLinks();
      }),
      getForPlant: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
          return db.getGenomicLinksForPlant(input);
        }),
      getByAxis: publicProcedure
        .input(z.enum(['G1', 'G2', 'G3']))
        .query(async ({ input }) => {
          return db.getGenomicPlantLinksByAxis(input);
        }),
      getForReference: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
          return db.getGenomicPlantLinksForReference(input);
        }),
      create: protectedProcedure
        .input(z.object({
          referenceId: z.number(),
          plantId: z.number(),
          genomicAxis: z.enum(['G1', 'G2', 'G3']),
          linkType: z.enum(['genome_sequencing', 'transcriptomics', 'metabolomics', 'phylogenetics', 'breeding', 'gene_editing', 'marker_development', 'comparative', 'other']).optional(),
          relevanceScore: z.number().min(0).max(100).optional(),
          confidence: z.enum(['high', 'medium', 'low']).optional(),
          genomeVersion: z.string().optional(),
          assemblyAccession: z.string().optional(),
          sequencingMethod: z.string().optional(),
          notes: z.string().optional(),
          excerpt: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          return db.createGenomicPlantLink({
            ...input,
            createdBy: ctx.user?.id,
          });
        }),
      delete: protectedProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
          return db.deleteGenomicPlantLink(input);
        }),
    }),
    // Stats
    getStats: publicProcedure.query(async () => {
      return db.getGenomicLinksStats();
    }),
    // Bulk create molecule links
    bulkCreateMoleculeLinks: protectedProcedure
      .input(z.object({
        links: z.array(z.object({
          referenceId: z.number(),
          moleculeId: z.number(),
          genomicAxis: z.enum(['G1', 'G2', 'G3']),
          linkType: z.string().optional(),
          relevanceScore: z.number().min(0).max(100).optional(),
          confidence: z.enum(['high', 'medium', 'low']).optional(),
          notes: z.string().optional(),
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.bulkCreateGenomicMoleculeLinks(input.links, ctx.user?.id);
      }),
    // Bulk create plant links
    bulkCreatePlantLinks: protectedProcedure
      .input(z.object({
        links: z.array(z.object({
          referenceId: z.number(),
          plantId: z.number(),
          genomicAxis: z.enum(['G1', 'G2', 'G3']),
          linkType: z.string().optional(),
          relevanceScore: z.number().min(0).max(100).optional(),
          confidence: z.enum(['high', 'medium', 'low']).optional(),
          notes: z.string().optional(),
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.bulkCreateGenomicPlantLinks(input.links, ctx.user?.id);
      }),
  }),

  // Ghost Variety Extended Operations
  ghostVarietyExtended: router({
    // Get variety with all relations
    getWithRelations: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getGhostVarietyWithRelations(input);
      }),
    // Get molecules for linking
    getMoleculesForLinking: publicProcedure.query(async () => {
      return db.getMoleculesForGhostVarietyLinking();
    }),
    // Get plants for linking
    getPlantsForLinking: publicProcedure.query(async () => {
      return db.getPlantsForGhostVarietyLinking();
    }),
    // Search molecules for autocomplete
    searchMolecules: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return db.searchMoleculesForGhostVariety(input.query, input.limit);
      }),
    // Search plants for autocomplete
    searchPlants: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return db.searchPlantsForGhostVariety(input.query, input.limit);
      }),
  }),

  // Ghost Variety Links (Liaisons variétés fantômes ↔ molécules/plantes)
  ghostVarietyLinks: router({
    // Molecule links
    moleculeLinks: router({
      getForVariety: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
          return db.getGhostVarietyMoleculeLinks(input);
        }),
      create: protectedProcedure
        .input(z.object({
          ghostVarietyId: z.number(),
          moleculeId: z.number(),
          linkType: z.enum(['dominant', 'characteristic', 'trace', 'reconstructed', 'historical', 'hypothetical', 'other']).optional(),
          percentage: z.number().optional(),
          minPercentage: z.number().optional(),
          maxPercentage: z.number().optional(),
          confidence: z.enum(['high', 'medium', 'low']).optional(),
          sourceType: z.enum(['gc_ms_analysis', 'historical_text', 'reconstruction', 'comparative', 'expert_opinion', 'other']).optional(),
          notes: z.string().optional(),
          sourceReference: z.string().optional(),
          analysisYear: z.number().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          return db.createGhostVarietyMoleculeLink({
            ...input,
            percentage: input.percentage?.toString(),
            minPercentage: input.minPercentage?.toString(),
            maxPercentage: input.maxPercentage?.toString(),
            createdBy: ctx.user?.id,
          });
        }),
      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          data: z.object({
            linkType: z.enum(['dominant', 'characteristic', 'trace', 'reconstructed', 'historical', 'hypothetical', 'other']).optional(),
            percentage: z.number().optional(),
            minPercentage: z.number().optional(),
            maxPercentage: z.number().optional(),
            confidence: z.enum(['high', 'medium', 'low']).optional(),
            sourceType: z.enum(['gc_ms_analysis', 'historical_text', 'reconstruction', 'comparative', 'expert_opinion', 'other']).optional(),
            notes: z.string().optional(),
            sourceReference: z.string().optional(),
            analysisYear: z.number().optional(),
          }),
        }))
        .mutation(async ({ input }) => {
          return db.updateGhostVarietyMoleculeLink(input.id, {
            ...input.data,
            percentage: input.data.percentage?.toString(),
            minPercentage: input.data.minPercentage?.toString(),
            maxPercentage: input.data.maxPercentage?.toString(),
          });
        }),
      delete: protectedProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
          return db.deleteGhostVarietyMoleculeLink(input);
        }),
    }),
    // Plant links
    plantLinks: router({
      getForVariety: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
          return db.getGhostVarietyPlantLinks(input);
        }),
      create: protectedProcedure
        .input(z.object({
          ghostVarietyId: z.number(),
          plantId: z.number(),
          relationshipType: z.enum(['parent_species', 'related_variety', 'hybrid_parent', 'descendant', 'comparison', 'reconstruction_base', 'other']).optional(),
          confidence: z.enum(['high', 'medium', 'low']).optional(),
          geneticSimilarity: z.number().min(0).max(100).optional(),
          notes: z.string().optional(),
          sourceReference: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          return db.createGhostVarietyPlantLink({
            ...input,
            createdBy: ctx.user?.id,
          });
        }),
      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          data: z.object({
            relationshipType: z.enum(['parent_species', 'related_variety', 'hybrid_parent', 'descendant', 'comparison', 'reconstruction_base', 'other']).optional(),
            confidence: z.enum(['high', 'medium', 'low']).optional(),
            geneticSimilarity: z.number().min(0).max(100).optional(),
            notes: z.string().optional(),
            sourceReference: z.string().optional(),
          }),
        }))
        .mutation(async ({ input }) => {
          return db.updateGhostVarietyPlantLink(input.id, input.data);
        }),
      delete: protectedProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
          return db.deleteGhostVarietyPlantLink(input);
        }),
    }),
    // Images
    images: router({
      getForVariety: publicProcedure
        .input(z.number())
        .query(async ({ input }) => {
          return db.getGhostVarietyImages(input);
        }),
      create: protectedProcedure
        .input(z.object({
          ghostVarietyId: z.number(),
          url: z.string(),
          fileKey: z.string(),
          filename: z.string().optional(),
          mimeType: z.string().optional(),
          fileSize: z.number().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          imageType: z.enum(['botanical_illustration', 'photograph', 'herbarium', 'reconstruction', 'artistic', 'microscopy', 'other']).optional(),
          source: z.string().optional(),
          attribution: z.string().optional(),
          year: z.number().optional(),
          license: z.string().optional(),
          sortOrder: z.number().optional(),
          isPrimary: z.boolean().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          return db.createGhostVarietyImage({
            ...input,
            uploadedBy: ctx.user?.id,
          });
        }),
      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          data: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            imageType: z.enum(['botanical_illustration', 'photograph', 'herbarium', 'reconstruction', 'artistic', 'microscopy', 'other']).optional(),
            source: z.string().optional(),
            attribution: z.string().optional(),
            year: z.number().optional(),
            license: z.string().optional(),
            sortOrder: z.number().optional(),
          }),
        }))
        .mutation(async ({ input }) => {
          return db.updateGhostVarietyImage(input.id, input.data);
        }),
      delete: protectedProcedure
        .input(z.number())
        .mutation(async ({ input }) => {
          return db.deleteGhostVarietyImage(input);
        }),
      setPrimary: protectedProcedure
        .input(z.object({
          ghostVarietyId: z.number(),
          imageId: z.number(),
        }))
        .mutation(async ({ input }) => {
          return db.setGhostVarietyPrimaryImage(input.ghostVarietyId, input.imageId);
        }),
      // Upload image to S3 and create record
      upload: protectedProcedure
        .input(z.object({
          ghostVarietyId: z.number(),
          imageData: z.string(), // Base64 encoded image data
          contentType: z.string(),
          filename: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          imageType: z.enum(['botanical_illustration', 'photograph', 'herbarium', 'reconstruction', 'artistic', 'microscopy', 'other']).optional(),
          source: z.string().optional(),
          attribution: z.string().optional(),
          year: z.number().optional(),
          license: z.string().optional(),
          isPrimary: z.boolean().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const { storagePut } = await import('./storage');
          
          // Décoder le base64
          const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Générer un nom de fichier unique
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const ext = input.contentType.split('/')[1] || 'jpg';
          const fileKey = `ghost-varieties/${input.ghostVarietyId}/${timestamp}-${randomSuffix}.${ext}`;
          
          // Upload vers S3
          const { url } = await storagePut(fileKey, buffer, input.contentType);
          
          // Créer l'entrée en base de données
          return db.createGhostVarietyImage({
            ghostVarietyId: input.ghostVarietyId,
            url,
            fileKey,
            filename: input.filename,
            mimeType: input.contentType,
            fileSize: buffer.length,
            title: input.title,
            description: input.description,
            imageType: input.imageType,
            source: input.source,
            attribution: input.attribution,
            year: input.year,
            license: input.license,
            isPrimary: input.isPrimary,
            uploadedBy: ctx.user?.id,
          });
        }),
    }),
    // Complete variety data
    getComplete: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getGhostVarietyComplete(input);
      }),
    // Linking stats
    getStats: publicProcedure.query(async () => {
      return db.getGhostVarietyLinkingStats();
    }),
  }),

  // ============================================================================
  // AXIS REFERENCE LINKS (Liaisons axes-références pour le graphe)
  // ============================================================================
  axisReferenceLinks: router({
    // Liste toutes les liaisons
    list: publicProcedure
      .input(z.object({
        axisId: z.number().optional(),
        referenceId: z.number().optional(),
        linkType: z.string().optional(),
        confidence: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAllAxisReferenceLinks(input || {});
      }),
    
    // Obtenir une liaison par ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getAxisReferenceLinkById(input);
      }),
    
    // Obtenir les liaisons pour un axe avec détails
    getByAxis: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getAxisReferenceLinksWithDetails(input);
      }),
    
    // Obtenir les liaisons pour une référence avec détails
    getByReference: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getReferenceAxisLinksWithDetails(input);
      }),
    
    // Données du graphe pour D3.js
    getGraphData: publicProcedure.query(async () => {
      return db.getAxisReferenceGraphData();
    }),
    
    // Statistiques
    getStats: publicProcedure.query(async () => {
      return db.getAxisReferenceLinkStats();
    }),
    
    // Créer une liaison
    create: protectedProcedure
      .input(z.object({
        axisId: z.number(),
        referenceId: z.number(),
        linkType: z.string().optional(),
        relevanceScore: z.number().min(0).max(100).optional(),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        notes: z.string().optional(),
        excerpt: z.string().optional(),
        pageNumbers: z.string().optional(),
        displayWeight: z.number().min(1).max(10).optional(),
        isHighlighted: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createAxisReferenceLink({
          ...input,
          createdBy: ctx.user?.id,
        });
      }),
    
    // Mettre à jour une liaison
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        linkType: z.string().optional(),
        relevanceScore: z.number().min(0).max(100).optional(),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        notes: z.string().optional(),
        excerpt: z.string().optional(),
        pageNumbers: z.string().optional(),
        displayWeight: z.number().min(1).max(10).optional(),
        isHighlighted: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateAxisReferenceLink(id, data);
      }),
    
    // Supprimer une liaison
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.deleteAxisReferenceLink(input);
      }),
    
    // Créer plusieurs liaisons en masse
    bulkCreate: protectedProcedure
      .input(z.array(z.object({
        axisId: z.number(),
        referenceId: z.number(),
        linkType: z.string().optional(),
        relevanceScore: z.number().optional(),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        notes: z.string().optional(),
      })))
      .mutation(async ({ input, ctx }) => {
        const links = input.map(link => ({
          ...link,
          createdBy: ctx.user?.id,
        }));
        return db.bulkCreateAxisReferenceLinks(links);
      }),
  }),

  // ============================================================================
  // FORCE GRAPH VISUALIZATION
  // ============================================================================
  forceGraph: router({
    // Obtenir les données du graphe de force pour références-axes
    getReferencesAxesData: publicProcedure
      .input(z.object({
        includeReferences: z.boolean().default(true),
        metaAxisFilter: z.string().optional(),
        minRelevanceScore: z.number().default(0),
      }).optional())
      .query(async ({ input }) => {
        return db.getForceGraphDataReferencesAxes(input || {});
      }),
    
     // Obtenir les données du graphe d'axes uniquement
    getAxisGraphData: publicProcedure.query(async () => {
      return db.getAxisGraphData();
    }),
  }),

  // Köppen Climate Data
  koppen: koppenRouter,
  // Tobacco & PERFUMUM Data
  tobacco: tobaccoRouter,
  // Research Data
  research: researchRouter,
  // Raw Materials & Suppliers
  rawMaterials: rawMaterialsRouter,
  suppliers: suppliersRouter,
});
export type AppRouter = typeof appRouter;

