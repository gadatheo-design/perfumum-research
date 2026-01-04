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
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.globalSearch(input.query);
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
});

export type AppRouter = typeof appRouter;

