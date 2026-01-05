import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
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
  }),

  // Molecules
  molecules: router({
    list: publicProcedure.query(async () => {
      return await db.getAllMolecules();
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
        return await db.getMoleculeById(input);
      }),
    create: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Expected object");
        return val as any;
      })
      .mutation(async ({ input }) => {
        return await db.createMolecule(input);
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
        return await db.updateMoleculeRadar(input);
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
  }),

  // Recettes
  recettes: router({
    list: publicProcedure
      .input(z.object({
        category: z.enum(["tabac", "resine", "resine_cbd", "cone", "parfum", "encens", "extrait"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        if (input?.category) {
          return await db.getRecettesByCategory(input.category);
        }
        return await db.getAllRecettes();
      }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "number") throw new Error("Expected number");
        return val;
      })
      .query(async ({ input }) => {
        return await db.getRecetteById(input);
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

  // Chemical Families
  chemicalFamilies: router({
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

  // Global Search
  search: router({
    global: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.globalSearch(input.query, input.limit);
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
      return await db.getAllPlants();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getPlantById(input);
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
      
      const stats = {
        total: allMolecules.length,
        withCAS: allMolecules.filter(m => m.casNumber && m.casNumber !== '').length,
        withIUPAC: allMolecules.filter(m => m.iupacName && m.iupacName !== '').length,
        withChemicalClass: allMolecules.filter(m => m.chemicalClass).length,
        withMolecularWeight: allMolecules.filter(m => m.molecularWeight).length,
        withBoilingPoint: allMolecules.filter(m => m.boilingPoint).length,
        withPubChemRef: allMolecules.filter(m => m.references?.some(r => r.type === 'pubchem')).length,
      };
      
      return {
        ...stats,
        missingCAS: stats.total - stats.withCAS,
        missingIUPAC: stats.total - stats.withIUPAC,
        completeness: Math.round((stats.withCAS + stats.withIUPAC) / (stats.total * 2) * 100),
      };
    }),
    
    // Mode batch automatique - obtenir toutes les molécules à enrichir
    getAllMoleculesToEnrich: publicProcedure.query(async () => {
      const allMolecules = await db.getAllMolecules();
      
      // Filtrer les molécules sans CAS ou sans référence PubChem
      const toEnrich = allMolecules.filter(m => 
        !m.casNumber || m.casNumber === '' || !m.references?.some(r => r.type === 'pubchem')
      );
      
      return {
        total: toEnrich.length,
        molecules: toEnrich.map(m => ({
          id: m.id,
          name: m.name,
          hasCAS: !!(m.casNumber && m.casNumber !== ''),
          hasIUPAC: !!(m.iupacName && m.iupacName !== ''),
          hasPubChemRef: !!m.references?.some(r => r.type === 'pubchem'),
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
  // EXPORT BIBLIOGRAPHIQUE
  // ============================================================================
  bibliography: router({
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
        threatFactors: z.record(z.any()).optional(),
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
});

export type AppRouter = typeof appRouter;

