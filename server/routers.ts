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
    getGlobalStats: publicProcedure.query(async () => {
      return await db.getGlobalMoleculeStats();
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
        category: z.enum(["tabac", "resine", "cone", "parfum", "encens", "extrait"]).optional(),
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

  // Admin
  admin: router({
    getStats: publicProcedure.query(async () => {
      return await db.getAdminStats();
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
    
    getByType: publicProcedure
      .input(z.object({ type: z.string() }))
      .query(async ({ input }) => {
        return await db.getSynergiesByType(input.type);
      }),
    
    getStats: publicProcedure.query(async () => {
      return await db.getSynergiesStats();
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
});

export type AppRouter = typeof appRouter;
