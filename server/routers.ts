
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
import { getAllRecettesWithRadar, filterRecettesByRadar, invalidateRadarCache, invalidateRadarCacheForRecette, type RadarFilters } from "./db-recettes-radar";
import { getSimilarRecettes, getSimilarMolecules, getRecommendedRecettesFromFavorites } from "./db-recommendations";
import { koppenRouter } from "./routers/koppen";
import { tobaccoRouter } from "./routers/tobacco";
import { researchRouter } from "./routers/research";
import { rawMaterialsRouter, suppliersRouter } from "./routers/raw-materials";
import { recipesRouter } from "./routers/recipes";
import { protocolsRouter } from "./routers/protocols";
import { landracesRouter } from "./routers/landraces";
import { ifraRouter } from "./routers/ifra";
import { coconutRouter } from "./routers/coconut";
import { gbifRouter } from "./routers/gbif";
import { lotusRouter } from "./routers/lotus";
import { knapsackRouter } from "./routers/knapsack";
import { flavornetRouter } from "./routers/flavornet";
import { therapeuticRouter } from "./routers/therapeutic";
import { chemicalFamiliesRouter } from "./routers/chemical-families";
import { molecularSynergiesRouter } from "./routers/molecular-synergies";
import { dataCleanupRouter } from "./routers/data-cleanup";
import { smilesEnrichmentRouter } from "./routers/smiles-cas-enrichment";
import { plantCompositionRouter } from "./routers/plant-composition";
import { duplicatesRouter } from "./routers/duplicates";
import { bibliographyExportRouter } from "./routers/bibliography-export";
import { moleculeManagerRouter } from "./routers/moleculeManager";
import { correlationsRouter } from "./routers/correlations";
import { cigarilloMoleculeLinksRouter } from "./routers/cigarilloMoleculeLinks";
import { wikimediaImagesRouter } from "./routers/wikimedia-images";
import { extractionMethodsAdminRouter } from './routers/extraction-methods-admin';
import { olfactiveEmissionsRouter } from './routers/olfactive-emissions';
import { olfactiveExperiencesRouter } from './routers/olfactive-experiences';
import { storylinesRouter } from './routers/storylines';
import { wikidataRouter } from './routers/wikidata';
import { sparqlRouter } from './routers/sparql';
import { europeanaRouter } from './routers/europeana';
import { p5dataRouter } from './routers/p5data';
import { auditRouter } from './routers/audit';
import { varietyImagesRouter } from './routers/variety-images';
import { varietyGenealogyImportRouter } from './routers/variety-genealogy-import';
import { wikidataSyncRouter } from './routers/wikidata-sync';
import { phylogenyRouter } from './routers/phylogeny';
import { gbifEnrichmentRouter } from './routers/gbif-enrichment';
import { tropicosEnrichmentRouter } from './routers/tropicos-enrichment';
import { lotusEnrichmentRouter } from './routers/lotus-enrichment';
import { coconutEnrichmentRouter } from './routers/coconut-enrichment';
import { iucnEnrichmentRouter } from './routers/iucn-enrichment';
import { ncbiTaxonomyRouter } from './routers/ncbi-taxonomy';
import { powoKewRouter } from './routers/powo-kew';
import { wikidataPhyloRouter } from './routers/wikidata-phylo';
import { phyloBatchRouter } from './routers/phylo-batch';
import { apiCoverageRouter } from './routers/api-coverage';
import { resinMaturationRouter } from './routers/resin-maturation';
import { extractionProcessesRouter } from './routers/extraction-processes';
import { resinTobaccoRecipesRouter } from './routers/resin-tobacco-recipes';
import { importExportRouter } from './routers/import-export';
import { pyrfumeRouter } from './routers/pyrfume';
import { 
  withCache, 
  CACHE_KEYS, 
  CACHE_TTL, 
  invalidateMoleculeCache, 
  invalidatePlantCache, 
  invalidateRecetteCache 
} from "./cache";

import { aiRouter } from "./routers/ai";
import { bibliographyRouter } from "./routers/bibliography";
import { plantsRouter } from "./routers/plants";
import { importRouter } from "./routers/import";
import { moleculesRouter } from "./routers/molecules";
import type { SQL } from "drizzle-orm";
import { laboratoireInlineRouter } from "./routers/laboratoire-inline";
import { pubchemIupacRouter } from "./routers/pubchem-iupac";
import { aiEnrichPlantRouter } from "./routers/ai-enrich-plant";
import { aiEnrichRawMaterialRouter } from "./routers/ai-enrich-raw-material";
import { aiEnrichMoleculeRouter } from "./routers/ai-enrich-molecule";
import { pubchemBatchRouter } from "./routers/pubchem-batch";
import { networkGraphRouter } from "./routers/network-graph";
import { recettesInlineRouter } from "./routers/recettes-inline";
import { rawMaterialsInlineRouter } from "./routers/raw-materials-inline";
import { ghostVarietyLinksRouter } from "./routers/ghost-variety-links";
import { citationExportRouter } from "./routers/citation-export";
import { plantVarietiesRouter } from "./routers/plant-varieties";
import { geographicOriginsRouter } from "./routers/geographic-origins";
import { batchImportRouter } from "./routers/batch-import";
import { visualizationsRouter } from "./routers/visualizations";
import { leafEconomiesRouter } from "./routers/leaf-economies";
import { olfactiveArchivesRouter } from "./routers/olfactive-archives";
import { bibliographySourcesRouter } from "./routers/bibliography-sources";

// ── Types pour les réponses LLM enrichissement ────────────────────────────────
interface PlantEnrichmentLLM {
  olfactiveProfile: string[];
  therapeuticProperties: string[];
  dominantMolecules: string[];
  traditionalUse: string;
  habitat: string;
  description: string;
}
interface RawMaterialEnrichmentLLM {
  description: string;
  olfactiveProfile: string[];
  therapeuticProperties: string[];
  keyMolecules: string[];
  usagesInPerfumery: string;
  extractionDetails: string;
  qualityMarkers: string[];
}
interface MoleculeEnrichmentLLM {
  olfactiveProfile: string[];
  therapeuticProperties: string[];
  family: string;
  iupac_name: string;
  notes: string;
}
// ─────────────────────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  importExport: importExportRouter,
  pyrfume: pyrfumeRouter,
  
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
  laboratoire: laboratoireInlineRouter,

  // Molecules (avec cache pour optimisation)
  molecules: moleculesRouter,

  // PubChem IUPAC batch
  pubchemIupac: pubchemIupacRouter,

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
  recettes: recettesInlineRouter,

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
    listWithTerroir: publicProcedure.query(async () => {
      return await db.getTabacsWithTerroir();
    }),
    listByType: publicProcedure
      .input(z.object({ type: z.enum(['blond', 'brun', 'oriental', 'experimental']) }))
      .query(async ({ input }) => {
        return await db.getTabacsByType(input.type);
      }),
    getWithMolecules: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getTabacWithMolecules(input);
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
    enrichMoleculeData: protectedProcedure.mutation(async () => {
      return await db.enrichMoleculeData();
    }),
    getBundleStats: publicProcedure.query(async () => {
      // Lit les fichiers JS du build de production et retourne leurs tailles
      const fs = await import('fs');
      const path = await import('path');
      const distDir = path.join(process.cwd(), 'dist', 'public', 'assets');
      try {
        const files = fs.readdirSync(distDir);
        const chunks = files
          .filter((f: string) => f.endsWith('.js'))
          .map((f: string) => {
            const fullPath = path.join(distDir, f);
            const stat = fs.statSync(fullPath);
            return { name: `assets/${f}`, size: stat.size };
          })
          .sort((a: { name: string; size: number }, b: { name: string; size: number }) => b.size - a.size);
        return { chunks, totalSize: chunks.reduce((acc: number, c: { size: number }) => acc + c.size, 0) };
      } catch {
        return { chunks: [], totalSize: 0 };
      }
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

    getKoppenStats: publicProcedure.query(async () => {
      return await db.getKoppenZoneStats();
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
          (s: Record<string, unknown>) => (s.terpene1Id === input.molecule1Id && s.terpene2Id === input.molecule2Id) ||
               (s.terpene2Id === input.molecule1Id && s.terpene1Id === input.molecule2Id)
        );
        
        const molSyn = allSynergies.moleculeSynergies?.find(
          (s: Record<string, unknown>) => (s.molecule1Id === input.molecule1Id && s.molecule2Id === input.molecule2Id) ||
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
        metadata: z.unknown().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.trackEvent(
          input.eventType,
          input.entityType,
          input.entityId,
          ctx.user?.id,
          input.metadata as Record<string, any> | undefined
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
  import: importRouter,

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
  leafEconomies: leafEconomiesRouter,

  // Geographic Origins (Terroirs de production)
  geographicOrigins: geographicOriginsRouter,

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
  plants: plantsRouter,

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
        return await db.createTerpProfile(input);
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
        return await db.updateTerpProfile(input.id, input.data);
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
        return await db.createFinalRecipe(input);
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
        return await db.updateFinalRecipe(input.id, input.data);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        await db.deleteFinalRecipe(input);
        return { success: true };
      }),
    // Parfums emblématiques d'une plante
    getPlantPerfumes: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getPlantPerfumes(input);
      }),
  }),

  // Point 3 Étendu - Routes botaniques avancées
  plantVarieties: plantVarietiesRouter,
  
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
    update: publicProcedure
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
    getByMoleculeId: publicProcedure
      .input(z.object({ moleculeId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAnalyticalMethodsByMoleculeId(input.moleculeId);
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
  
  // ============================================================
  // ENRICHISSEMENT IA — Plantes
  // ============================================================
  aiEnrichPlant: aiEnrichPlantRouter,

  // ============================================================
  // ENRICHISSEMENT IA — Matières Premières
  // ============================================================
  aiEnrichRawMaterial: aiEnrichRawMaterialRouter,

  aiEnrichMolecule: aiEnrichMoleculeRouter,


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
    getTabacSuppliers: publicProcedure.query(async () => {
      const all = await getAllExtendedSuppliers();
      return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('TABAC'));
    }),
    getCannabisSuppliers: publicProcedure.query(async () => {
      const all = await getAllExtendedSuppliers();
      return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('CANNA'));
    }),
    getByCategory: publicProcedure
      .input(z.object({ category: z.enum(['tabac', 'cannabis', 'parfum', 'botanique', 'all']) }))
      .query(async ({ input }) => {
        const all = await getAllExtendedSuppliers();
        if (input.category === 'tabac') return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('TABAC'));
        if (input.category === 'cannabis') return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('CANNA'));
        if (input.category === 'parfum') return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('PARF'));
        if (input.category === 'botanique') return all.filter((s: Record<string,unknown>) => String(s.supplierId ?? '').startsWith('BOTA'));
        return all;
      }),
    getByCountry: publicProcedure
      .input(z.object({ country: z.string() }))
      .query(async ({ input }) => {
        const all = await getAllExtendedSuppliers();
        return all.filter((s: Record<string,unknown>) => s.country === input.country);
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
    search: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        const allPlants = await db.getAllPlants();
        const q = input.query.toLowerCase();
        return allPlants
          .filter((p: Record<string,unknown>) =>
            String(p.name ?? '').toLowerCase().includes(q) ||
            String(p.latinName ?? '').toLowerCase().includes(q) ||
            String(p.latin_name ?? '').toLowerCase().includes(q)
          )
          .slice(0, 20);
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
  
  rawMaterials: rawMaterialsInlineRouter,
  recetteRawMaterials: router({
    getByRecette: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getRecetteRawMaterials(input);
      }),
    getByRawMaterial: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return db.getRecettesForRawMaterial(input);
      }),
    add: protectedProcedure
      .input(z.object({
        recetteId: z.number(),
        rawMaterialId: z.number(),
        role: z.enum(['base', 'coeur', 'tete', 'fixateur', 'modificateur', 'autre']).optional(),
        dosage: z.string().optional(),
        dosageUnit: z.string().optional(),
        percentage: z.string().optional(),
        notes: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.addRecetteRawMaterial(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          role: z.enum(['base', 'coeur', 'tete', 'fixateur', 'modificateur', 'autre']).optional(),
          dosage: z.string().optional(),
          dosageUnit: z.string().optional(),
          percentage: z.string().optional(),
          notes: z.string().optional(),
          sortOrder: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateRecetteRawMaterial(input.id, input.data);
      }),
    remove: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return db.removeRecetteRawMaterial(input);
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
        return db.addMoleculePlantSource(input);
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
        return db.updateMoleculePlantSource(input.id, input.data);
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
        return db.addTerroirSpecialty(input);
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
        return db.updateTerroirSpecialty(input.id, input.data);
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

    reorder: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          id: z.number(),
          sortOrder: z.number(),
        })),
      }))
      .mutation(async ({ input }) => {
        return db.reorderSampleImages(input.items);
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
          const restriction = restrictions.find((r) => r.molecule.id === ingredient.moleculeId);
          
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
          
          const limit = column ? (restriction.restriction as Record<string,unknown>)[column] : null;
          const limitNum = limit ? parseFloat(String(limit)) : null;
          
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
        
        return restrictions.map((r) => ({
          moleculeId: r.molecule.id,
          moleculeName: r.molecule.name,
          casNumber: r.molecule.casNumber,
          limit: column ? (r.restriction as Record<string,unknown>)[column] : null,
          restrictionType: r.restriction.restrictionType,
          reason: r.restriction.reasonForRestriction,
        })).filter((r) => r.limit !== null || r.restrictionType === 'prohibited');
      }),
  }),

  // Import batch d'images
  batchImport: batchImportRouter,

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
        } catch (error: unknown) {
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
        } catch (error: unknown) {
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
  pubchem: pubchemBatchRouter,

  // ============================================================================
  // VISUALISATIONS ET CORRÉLATIONS
  // ============================================================================
  visualizations: visualizationsRouter,

  // ============================================================================
  // EXPORT BIBLIOGRAPHIQUE (Citations)
  // ============================================================================
  citationExport: citationExportRouter,

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
  }),

  // ============================================================================
  // GRAPHE DE RÉSEAU UNIFIÉ (Plantes, Terroirs, Molécules)
  // ============================================================================
  networkGraph: networkGraphRouter,

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
        return await db.createOlfactiveArchive(input);
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
        return await db.updateOlfactiveArchive(id, data);
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
        return await db.createCivilizationalMarker(input);
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
        return await db.addVarietyRelationship(input);
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
        return await db.updateVarietyRelationship(id, data);
      }),
    
    removeRelationship: protectedProcedure
      .input(z.object({
        id: z.number().int().min(1),
      }))
      .mutation(async ({ input }) => {
        return await db.removeVarietyRelationship(input.id);
      }),
    
    // Données du graphe généalogique pour D3.js
    getGraphData: publicProcedure
      .input(z.object({
        plantType: z.enum(["cannabis", "tobacco", "aromatic", "flower", "other", "all"]).default("all"),
        includeModern: z.boolean().default(true),
        includeLandraces: z.boolean().default(true),
        relationshipTypes: z.array(z.enum(["parent", "hybrid", "clone", "mutation"])).optional(),
        region: z.string().optional(),
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

    // Arbre généalogique enrichi avec les noms des plantes
    getTreeWithNames: publicProcedure
      .input(z.object({ varietyId: z.number().int().min(1) }))
      .query(async ({ input }) => {
        const dbConn = await db.getDb();
        if (!dbConn) return { parents: [], children: [] };
        const { sql } = await import('drizzle-orm');
        const [parents] = await (dbConn as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
          `SELECT vg.id, vg.variety_id, vg.parent_variety_id, vg.relationship_type, vg.cross_date, vg.breeder, vg.notes,
                  p.name as parent_name, p.latin_name as parent_latin_name, p.category as parent_category
           FROM variety_genealogy vg
           JOIN plants p ON vg.parent_variety_id = p.id
           WHERE vg.variety_id = ${input.varietyId}`
        ));
        const [children] = await (dbConn as unknown as {execute:(q:unknown)=>Promise<[Record<string,unknown>[],unknown]>}).execute(sql.raw(
          `SELECT vg.id, vg.variety_id, vg.parent_variety_id, vg.relationship_type, vg.cross_date, vg.breeder, vg.notes,
                  p.name as child_name, p.latin_name as child_latin_name, p.category as child_category
           FROM variety_genealogy vg
           JOIN plants p ON vg.variety_id = p.id
           WHERE vg.parent_variety_id = ${input.varietyId}`
        ));
        return {
          parents: Array.isArray(parents) ? parents : [],
          children: Array.isArray(children) ? children : [],
        };
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
        return await db.createSustainableAlternative(input);
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
        return await db.updateSustainableAlternative(id, data);
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
  olfactiveArchives: olfactiveArchivesRouter,

  // ============================================================================
  // BIBLIOGRAPHY (Références bibliographiques)
  // ============================================================================
  bibliography: bibliographyRouter,
  // ============================================================================
  // BIBLIOGRAPHY SOURCES (Publications scientifiques OpenAlex))
  // ============================================================================
  bibliographySources: bibliographySourcesRouter,

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
        });
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
        return db.updateResearchAxis(id, data);
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
        });
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
        return db.updateResearchEntry(id, data);
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
    
    // Get graph data for D3.js visualization
    getGraphData: publicProcedure.query(async () => {
      return db.getReferenceEntityLinkGraphData();
    }),
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
          filtered = filtered.filter((t) => t.climateType === input.climate);
        }
        if (input.country) {
          filtered = filtered.filter((t) => t.country === input.country);
        }
        if (input.search) {
          const search = input.search.toLowerCase();
          filtered = filtered.filter((t) => 
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
          filtered = filtered.filter((p) => p.category === input.category);
        }
        if (input.family) {
          filtered = filtered.filter((p) => p.family === input.family);
        }
        if (input.search) {
          const search = input.search.toLowerCase();
          filtered = filtered.filter((p) => 
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
      const climates = Array.from(new Set(terroirs.map((t) => t.climateType).filter(Boolean))) as string[];
      const countries = Array.from(new Set(terroirs.map((t) => t.country).filter(Boolean))) as string[];
      const plantCategories = Array.from(new Set(plants.map((p) => p.category).filter(Boolean))) as string[];
      const olfactiveFamilies = Array.from(new Set(plants.map((p) => p.family).filter(Boolean))) as string[];
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
          input.map((link) => ({ ...link, createdBy: ctx.user?.id }))
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
        return db.createNotification(input);
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
  ai: aiRouter,

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
  ghostVarietyLinks: ghostVarietyLinksRouter,

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
        const links = input.map((link) => ({
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
  // Raw Materials & Suppliers (rawMaterials inline above, suppliersRouter imported)
  suppliers: suppliersRouter,
  // Cigarillo Recipes
  recipes: recipesRouter,
  // Technical Protocols
  protocols: protocolsRouter,
  // Cannabis Landraces
  landraces: landracesRouter,
  // IFRA Regulatory Compliance
  ifra: ifraRouter,
  // COCONUT Natural Products Database
  coconut: coconutRouter,
  // GBIF Biodiversity Data
  gbif: gbifRouter,
  lotus: lotusRouter,
  knapsack: knapsackRouter,
  // Flavornet Olfactory Descriptors
  flavornet: flavornetRouter,
  therapeutic: therapeuticRouter,
  // Chemical Families Classification (inline definition above, imported router not added again)
  // Molecular Synergies (masquage, neutralisation, etc.)
  molecularSynergies: molecularSynergiesRouter,
  // Data Cleanup and Enrichment
  dataCleanup: dataCleanupRouter,
  // SMILES and CAS Enrichment
  smilesEnrichment: smilesEnrichmentRouter,
  // Plant Composition Enrichment
  plantComposition: plantCompositionRouter,
  // Duplicate Detection and Management
  duplicates: duplicatesRouter,
  // Molecule Manager - Gestion des doublons et relations plantes-molécules
  moleculeManager: moleculeManagerRouter,
  // Corrélations moléculaires inter-domaines (parfum × tabac × cannabis)
  correlations: correlationsRouter,
  // Cigarillo-Molecule Links
  cigarilloMoleculeLinks: cigarilloMoleculeLinksRouter,
  // Wikimedia Images Enrichment (Feature 4.7)
  wikimediaImages: wikimediaImagesRouter,
  extractionMethodsAdmin: extractionMethodsAdminRouter,
  // Data Quality Dashboard
  dataQuality: router({
    getMetrics: publicProcedure.query(async () => {
      const { getDb } = await import("./db");
      const dbInstance = await getDb();
      if (!dbInstance) return null;
      const { sql } = await import("drizzle-orm");

      const [molRes] = await dbInstance.execute(sql`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as with_cas,
          SUM(CASE WHEN smiles IS NOT NULL AND smiles != '' THEN 1 ELSE 0 END) as with_smiles,
          SUM(CASE WHEN chemical_class IS NOT NULL AND chemical_class != '' THEN 1 ELSE 0 END) as with_class,
          SUM(CASE WHEN validation_status = 'valide' THEN 1 ELSE 0 END) as validated,
          SUM(CASE WHEN validation_status = 'en_revision' THEN 1 ELSE 0 END) as in_review,
          SUM(CASE WHEN validation_status = 'brouillon' THEN 1 ELSE 0 END) as draft,
          SUM(CASE WHEN pubchem_cid IS NOT NULL THEN 1 ELSE 0 END) as with_pubchem,
          COUNT(DISTINCT family) as distinct_families
        FROM molecules
      `) as unknown as [Record<string,unknown>[], unknown];

      const [tabRes] = await dbInstance.execute(sql`
        SELECT COUNT(*) as total,
          SUM(CASE WHEN ttl.tabac_id IS NOT NULL THEN 1 ELSE 0 END) as with_terroir
        FROM tabacs t
        LEFT JOIN tabac_terroir_links ttl ON ttl.tabac_id = t.id
      `) as unknown as [Record<string,unknown>[], unknown];

      const [cigRes] = await dbInstance.execute(sql`
        SELECT COUNT(*) as total,
          SUM(CASE WHEN terpene_profile IS NOT NULL AND terpene_profile != '' THEN 1 ELSE 0 END) as with_terpene
        FROM cigarillo_recipes
      `) as unknown as [Record<string,unknown>[], unknown];

      const [accordRes] = await dbInstance.execute(sql`
        SELECT COUNT(*) as total,
          SUM(CASE WHEN description IS NOT NULL AND description != '' THEN 1 ELSE 0 END) as with_desc
        FROM accords
      `) as unknown as [Record<string,unknown>[], unknown];

      const [plantRes] = await dbInstance.execute(sql`
        SELECT COUNT(*) as total,
          SUM(CASE WHEN latin_name IS NOT NULL AND latin_name != '' THEN 1 ELSE 0 END) as with_latin,
          SUM(CASE WHEN family IS NOT NULL AND family != '' THEN 1 ELSE 0 END) as with_family,
          SUM(CASE WHEN validation_status = 'valide' THEN 1 ELSE 0 END) as validated
        FROM plants
      `) as unknown as [Record<string,unknown>[], unknown];

      const [synRes] = await dbInstance.execute(sql`
        SELECT COUNT(*) as total FROM molecule_synergies
      `) as unknown as [Record<string,unknown>[], unknown];

      const [pmRes] = await dbInstance.execute(sql`
        SELECT COUNT(*) as total,
          COUNT(DISTINCT plant_id) as plants_with_molecules
        FROM plant_molecules
      `) as unknown as [Record<string,unknown>[], unknown];

      const [recipeRes] = await dbInstance.execute(sql`
        SELECT COUNT(*) as total FROM recipes
      `) as unknown as [Record<string,unknown>[], unknown];

      return {
        molecules: molRes[0],
        tabacs: tabRes[0],
        cigarillos: cigRes[0],
        accords: accordRes[0],
        plants: plantRes[0],
        synergies: synRes[0],
        plantMolecules: pmRes[0],
        recipes: recipeRes[0],
        generatedAt: new Date().toISOString(),
      };
    }),
  }),

  // ============================================================================
  // PLANT CONTRIBUTIONS ROUTER
  // ============================================================================
  plantContributions: router({
    // Get contributions for a specific plant
    getByPlant: publicProcedure
      .input(z.object({
        plantId: z.number(),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
      }))
      .query(async ({ input }) => {
        return db.getPlantContributions(input.plantId, input.status);
      }),

    // Submit a new contribution (authenticated users)
    submit: protectedProcedure
      .input(z.object({
        plantId: z.number(),
        contributionType: z.enum(['image', 'molecule', 'terroir', 'note', 'bibliography', 'gcms_analysis', 'tradition_olfactive']),
        imageUrl: z.string().optional(),
        imageCaption: z.string().optional(),
        imageSource: z.string().optional(),
        moleculeId: z.number().optional(),
        moleculeName: z.string().optional(),
        moleculeConcentration: z.string().optional(),
        moleculeSource: z.string().optional(),
        terroir: z.string().optional(),
        region: z.string().optional(),
        country: z.string().optional(),
        terroirNotes: z.string().optional(),
        noteContent: z.string().optional(),
        noteCategory: z.string().optional(),
        description: z.string().optional(),
        references: z.string().optional(),
        // Bibliographie
        bibTitle: z.string().optional(),
        bibAuthors: z.string().optional(),
        bibYear: z.number().optional(),
        bibJournal: z.string().optional(),
        bibDoi: z.string().optional(),
        bibUrl: z.string().optional(),
        bibType: z.string().optional(),
        // GC-MS
        gcmsMethod: z.string().optional(),
        gcmsMolecules: z.any().optional(),
        gcmsConditions: z.string().optional(),
        // Tradition olfactive
        traditionPeriod: z.string().optional(),
        traditionCulture: z.string().optional(),
        traditionUsage: z.string().optional(),
        traditionSources: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.submitPlantContribution({
          ...input,
          userId: ctx.user.openId,
          userName: ctx.user.name || undefined,
        });
      }),

    // Get all contributions for admin
    getAll: protectedProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
      }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.getAllContributionsForAdmin(input?.status);
      }),

    // Get pending contributions for admin
    getPending: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.getAllPendingContributionsForAdmin();
      }),

    // Approve a contribution
    approve: protectedProcedure
      .input(z.object({
        contributionId: z.number(),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.reviewPlantContribution(
          input.contributionId,
          'approved',
          ctx.user.name || ctx.user.openId,
          input.adminNotes
        );
      }),

    // Reject a contribution
    reject: protectedProcedure
      .input(z.object({
        contributionId: z.number(),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return db.reviewPlantContribution(
          input.contributionId,
          'rejected',
          ctx.user.name || ctx.user.openId,
          input.adminNotes
        );
      }),

    // Get contribution statistics
    getStats: publicProcedure
      .query(async () => {
        return db.getContributionStats();
      }),
  }),

  // ============================================================
  // MOLECULE CONTRIBUTIONS
  // ============================================================
  moleculeContributions: router({
    submit: protectedProcedure
      .input(z.object({
        moleculeId: z.number(),
        contributionType: z.enum(['source','therapeutic','usage','synonym','image','note']),
        sourceTitle: z.string().optional(),
        sourceAuthors: z.string().optional(),
        sourceYear: z.number().optional(),
        sourceDoi: z.string().optional(),
        sourceUrl: z.string().optional(),
        therapeuticProperty: z.string().optional(),
        therapeuticEvidence: z.string().optional(),
        therapeuticNotes: z.string().optional(),
        usageContext: z.string().optional(),
        usageDescription: z.string().optional(),
        synonymName: z.string().optional(),
        synonymLanguage: z.string().optional(),
        imageUrl: z.string().optional(),
        imageCaption: z.string().optional(),
        noteContent: z.string().optional(),
        noteCategory: z.string().optional(),
        description: z.string().optional(),
        bibliographyRefs: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        await conn.execute(`
          INSERT INTO molecule_contributions
            (molecule_id, user_id, user_name, contribution_type,
             source_title, source_authors, source_year, source_doi, source_url,
             therapeutic_property, therapeutic_evidence, therapeutic_notes,
             usage_context, usage_description,
             synonym_name, synonym_language,
             image_url, image_caption,
             note_content, note_category,
             description, bibliography_refs)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `, [
          input.moleculeId, ctx.user.openId, ctx.user.name || null, input.contributionType,
          input.sourceTitle || null, input.sourceAuthors || null, input.sourceYear || null,
          input.sourceDoi || null, input.sourceUrl || null,
          input.therapeuticProperty || null, input.therapeuticEvidence || null, input.therapeuticNotes || null,
          input.usageContext || null, input.usageDescription || null,
          input.synonymName || null, input.synonymLanguage || null,
          input.imageUrl || null, input.imageCaption || null,
          input.noteContent || null, input.noteCategory || null,
          input.description || null, input.bibliographyRefs || null,
        ]);
        await conn.end();
        return { success: true };
      }),
    getByMolecule: publicProcedure
      .input(z.object({ moleculeId: z.number(), status: z.enum(['pending','approved','rejected']).optional() }))
      .query(async ({ input }) => {
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        const [rows] = await conn.execute(
          `SELECT * FROM molecule_contributions WHERE molecule_id = ?${input.status ? ' AND status = ?' : ''} ORDER BY created_at DESC`,
          input.status ? [input.moleculeId, input.status] : [input.moleculeId]
        );
        await conn.end();
        return rows as Record<string, unknown>[];
      }),
    getAll: protectedProcedure
      .input(z.object({ status: z.enum(['pending','approved','rejected']).optional() }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        const [rows] = await conn.execute(
          `SELECT mc.*, m.name as molecule_name FROM molecule_contributions mc
           LEFT JOIN molecules m ON mc.molecule_id = m.id
           ${input?.status ? 'WHERE mc.status = ?' : ''}
           ORDER BY mc.created_at DESC`,
          input?.status ? [input.status] : []
        );
        await conn.end();
        return rows as Record<string, unknown>[];
      }),
    review: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(['approved','rejected']), adminNotes: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        await conn.execute(
          `UPDATE molecule_contributions SET status=?, admin_notes=?, reviewed_by=?, reviewed_at=NOW() WHERE id=?`,
          [input.status, input.adminNotes || null, ctx.user.name || ctx.user.openId, input.id]
        );
        await conn.end();
        return { success: true };
      }),
  }),

  // ============================================================
  // TERROIR CONTRIBUTIONS
  // ============================================================
  terroirContributions: router({
    submit: protectedProcedure
      .input(z.object({
        terroirId: z.number(),
        contributionType: z.enum(['image','plant_link','note','production_data','history']),
        imageUrl: z.string().optional(),
        imageCaption: z.string().optional(),
        plantName: z.string().optional(),
        plantId: z.number().optional(),
        plantNotes: z.string().optional(),
        productionYear: z.number().optional(),
        productionQuantity: z.string().optional(),
        productionQuality: z.string().optional(),
        historyPeriod: z.string().optional(),
        historyContent: z.string().optional(),
        noteContent: z.string().optional(),
        noteCategory: z.string().optional(),
        description: z.string().optional(),
        bibliographyRefs: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        await conn.execute(`
          INSERT INTO terroir_contributions
            (terroir_id, user_id, user_name, contribution_type,
             image_url, image_caption, plant_name, plant_id, plant_notes,
             production_year, production_quantity, production_quality,
             history_period, history_content,
             note_content, note_category, description, bibliography_refs)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `, [
          input.terroirId, ctx.user.openId, ctx.user.name || null, input.contributionType,
          input.imageUrl || null, input.imageCaption || null,
          input.plantName || null, input.plantId || null, input.plantNotes || null,
          input.productionYear || null, input.productionQuantity || null, input.productionQuality || null,
          input.historyPeriod || null, input.historyContent || null,
          input.noteContent || null, input.noteCategory || null,
          input.description || null, input.bibliographyRefs || null,
        ]);
        await conn.end();
        return { success: true };
      }),
    getAll: protectedProcedure
      .input(z.object({ status: z.enum(['pending','approved','rejected']).optional() }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        const [rows] = await conn.execute(
          `SELECT tc.*, t.name as terroir_name FROM terroir_contributions tc
           LEFT JOIN terroirs t ON tc.terroir_id = t.id
           ${input?.status ? 'WHERE tc.status = ?' : ''}
           ORDER BY tc.created_at DESC`,
          input?.status ? [input.status] : []
        );
        await conn.end();
        return rows as Record<string, unknown>[];
      }),
    review: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(['approved','rejected']), adminNotes: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        await conn.execute(
          `UPDATE terroir_contributions SET status=?, admin_notes=?, reviewed_by=?, reviewed_at=NOW() WHERE id=?`,
          [input.status, input.adminNotes || null, ctx.user.name || ctx.user.openId, input.id]
        );
        await conn.end();
        return { success: true };
      }),
  }),

  // ============================================================
  // RECIPE CONTRIBUTIONS
  // ============================================================
  recipeContributions: router({
    submit: protectedProcedure
      .input(z.object({
        recipeId: z.number(),
        contributionType: z.enum(['ingredient','variant','note','image','correction']),
        ingredientName: z.string().optional(),
        ingredientQuantity: z.string().optional(),
        ingredientUnit: z.string().optional(),
        ingredientNotes: z.string().optional(),
        variantName: z.string().optional(),
        variantDescription: z.string().optional(),
        imageUrl: z.string().optional(),
        imageCaption: z.string().optional(),
        noteContent: z.string().optional(),
        noteCategory: z.string().optional(),
        description: z.string().optional(),
        bibliographyRefs: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        await conn.execute(`
          INSERT INTO recipe_contributions
            (recipe_id, user_id, user_name, contribution_type,
             ingredient_name, ingredient_quantity, ingredient_unit, ingredient_notes,
             variant_name, variant_description,
             image_url, image_caption,
             note_content, note_category, description, bibliography_refs)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `, [
          input.recipeId, ctx.user.openId, ctx.user.name || null, input.contributionType,
          input.ingredientName || null, input.ingredientQuantity || null,
          input.ingredientUnit || null, input.ingredientNotes || null,
          input.variantName || null, input.variantDescription || null,
          input.imageUrl || null, input.imageCaption || null,
          input.noteContent || null, input.noteCategory || null,
          input.description || null, input.bibliographyRefs || null,
        ]);
        await conn.end();
        return { success: true };
      }),
    getAll: protectedProcedure
      .input(z.object({ status: z.enum(['pending','approved','rejected']).optional() }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        const [rows] = await conn.execute(
          `SELECT rc.* FROM recipe_contributions rc
           ${input?.status ? 'WHERE rc.status = ?' : ''}
           ORDER BY rc.created_at DESC`,
          input?.status ? [input.status] : []
        );
        await conn.end();
        return rows as Record<string, unknown>[];
      }),
    review: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(['approved','rejected']), adminNotes: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const mysql = await import('mysql2/promise');
        const conn = await mysql.createConnection(process.env.DATABASE_URL!);
        await conn.execute(
          `UPDATE recipe_contributions SET status=?, admin_notes=?, reviewed_by=?, reviewed_at=NOW() WHERE id=?`,
          [input.status, input.adminNotes || null, ctx.user.name || ctx.user.openId, input.id]
        );
        await conn.end();
        return { success: true };
      }),
  }),

  // ============================================================
  // GC-MS IMPORT — Import de profils moléculaires GC-MS
  // ============================================================
  gcmsImport: router({

    // Rechercher une plante par nom pour l'import GC-MS
    searchPlant: protectedProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return db.searchPlantsForGcms(input.query);
      }),

    // Rechercher une molécule existante par nom
    searchMolecule: protectedProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return db.searchMoleculesForGcms(input.query);
      }),

    // Prévisualiser un import (dry-run) sans écrire en base
    preview: protectedProcedure
      .input(z.object({
        plantId: z.number(),
        molecules: z.array(z.object({
          moleculeId: z.number().optional(),
          moleculeName: z.string(),
          percentageMin: z.number().min(0).max(100).optional(),
          percentageMax: z.number().min(0).max(100).optional(),
          percentageTypical: z.number().min(0).max(100).optional(),
          role: z.enum(['majeur', 'secondaire', 'trace', 'variable']).default('secondaire'),
          isSignature: z.boolean().default(false),
          source: z.string().optional(),
          notes: z.string().optional(),
        })),
        overwriteExisting: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return db.previewGcmsImport(input.plantId, input.molecules, input.overwriteExisting);
      }),

    // Importer un lot de molécules GC-MS pour une plante
    importBatch: protectedProcedure
      .input(z.object({
        plantId: z.number(),
        molecules: z.array(z.object({
          moleculeId: z.number().optional(),
          moleculeName: z.string(),
          percentageMin: z.number().min(0).max(100).optional(),
          percentageMax: z.number().min(0).max(100).optional(),
          percentageTypical: z.number().min(0).max(100).optional(),
          role: z.enum(['majeur', 'secondaire', 'trace', 'variable']).default('secondaire'),
          isSignature: z.boolean().default(false),
          source: z.string().optional(),
          notes: z.string().optional(),
        })),
        overwriteExisting: z.boolean().default(false),
        bibliography: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return db.importGcmsBatch(input.plantId, input.molecules, input.overwriteExisting, input.bibliography);
      }),

    // Importer depuis un CSV parsé côté client
    importFromCsv: protectedProcedure
      .input(z.object({
        rows: z.array(z.object({
          plantName: z.string(),
          moleculeName: z.string(),
          percentageMin: z.number().optional(),
          percentageMax: z.number().optional(),
          percentageTypical: z.number().optional(),
          role: z.string().optional(),
          isSignature: z.boolean().optional(),
          source: z.string().optional(),
          notes: z.string().optional(),
        })),
        overwriteExisting: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return db.importGcmsFromCsv(input.rows, input.overwriteExisting);
      }),

    // Récupérer les profils GC-MS existants pour une plante
    getProfile: protectedProcedure
      .input(z.object({ plantId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return db.getGcmsProfile(input.plantId);
      }),
  }),

  navigation: router({
    getFeaturedItems: publicProcedure.query(async () => {
      return await withCache(
        'navigation:featured_items',
        () => db.getMegaMenuFeaturedItems(),
        CACHE_TTL.MEDIUM
      );
    }),
  }),

  completude: router({
    globalStats: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return db.getCompletudeGlobalStats();
      }),
    rawMaterials: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(200).default(50),
        offset: z.number().min(0).default(0),
        sortBy: z.enum(['score_asc', 'score_desc', 'name']).default('score_asc'),
        minScore: z.number().min(0).max(100).optional(),
        maxScore: z.number().min(0).max(100).optional(),
        category: z.string().optional(),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return db.getCompletudeRawMaterials(input);
      }),
    plants: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(500).default(50),
        offset: z.number().min(0).default(0),
        sortBy: z.enum(['score_asc', 'score_desc', 'name']).default('score_asc'),
        minScore: z.number().min(0).max(100).optional(),
        maxScore: z.number().min(0).max(100).optional(),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return db.getCompletudePlants(input);
      }),
    terroirs: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(200).default(50),
        offset: z.number().min(0).default(0),
        sortBy: z.enum(['score_asc', 'score_desc', 'name']).default('score_asc'),
        minScore: z.number().min(0).max(100).optional(),
        maxScore: z.number().min(0).max(100).optional(),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return db.getCompletudeTerroirs(input);
      }),
    getNetworkData: publicProcedure
      .input(z.object({
        limit: z.number().min(10).max(200).default(50),
        includeRecettes: z.boolean().default(true),
        includeRawMaterials: z.boolean().default(true),
        includeMolecules: z.boolean().default(true),
      }))
      .query(async ({ input }) => {
        return db.getNetworkData(input);
      }),
  }),

  // NOSE Phase 1 — Olfactive Emissions (od:L12 Smell Emission)
  olfactiveEmissions: olfactiveEmissionsRouter,
  // NOSE Phase 2 — Olfactive Experiences (od:L13 Smell Experience)
  olfactiveExperiences: olfactiveExperiencesRouter,
  // NOSE Phase 3 — Storylines / Atlas Mnémosyne
  storylines: storylinesRouter,
  // NOSE Phase 4 — Wikidata QIDs (interopérabilité Odeuropa/Europeana)
  wikidata: wikidataRouter,
  // NOSE Phase 5 — SPARQL Wikidata/Europeana (requêtes croisées)
  sparql: sparqlRouter,
  europeana: europeanaRouter,
  // API p5.js — Endpoints publics pour sketches p5.js externes (editor.p5js.org)
  p5data: p5dataRouter,
  // Audit — Analyse et nettoyage des données
  audit: auditRouter,
  // Variety Images — Morphological images for plant varieties
  varietyImages: varietyImagesRouter,
  // Variety Genealogy Import — CSV import for plant genealogies
  varietyGenealogyImport: varietyGenealogyImportRouter,
  // Wikidata Sync — Synchronize variety data with Wikidata
  wikidataSync: wikidataSyncRouter,
  // Phylogeny — Phylogenetic tree visualization for genera
  phylogeny: phylogenyRouter,
  // GBIF Enrichment — Global Biodiversity Information Facility
  gbifEnrichment: gbifEnrichmentRouter,
  // Tropicos Enrichment — Missouri Botanical Garden
  tropicosEnrichment: tropicosEnrichmentRouter,
  // LOTUS Enrichment — Natural Products Online
  lotusEnrichment: lotusEnrichmentRouter,
  // COCONUT Enrichment — Collection of Open Natural Products
  coconutEnrichment: coconutEnrichmentRouter,
  // IUCN Enrichment — IUCN Red List Conservation Status
  iucnEnrichment: iucnEnrichmentRouter,
  // NCBI Taxonomy u2014 National Center for Biotechnology Information
  ncbiTaxonomy: ncbiTaxonomyRouter,
  // POWO/Kew u2014 Plants of the World Online (Kew Gardens)
  powoKew: powoKewRouter,
  // Wikidata Phylo u2014 Phylogenetic data from Wikidata SPARQL
  wikidataPhylo: wikidataPhyloRouter,
  // Phylo Batch — Batch enrichment by genus with 5 APIs in parallel
  phyloBatch: phyloBatchRouter,
  // API Coverage — Dashboard de couverture des APIs pour chaque plante
  apiCoverage: apiCoverageRouter,
  extractionProcesses: extractionProcessesRouter,
  resinTobaccoRecipes: resinTobaccoRecipesRouter,
  // Resin Maturation
  resinMaturation: resinMaturationRouter,
});
export type AppRouter = typeof appRouter;

