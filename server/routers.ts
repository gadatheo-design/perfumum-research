import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

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
      return await db.getSynergiesGraphData();
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
});

export type AppRouter = typeof appRouter;
