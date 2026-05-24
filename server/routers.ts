
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
import { laboratoireRouter } from "./routers/laboratoire";
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
import { plantContributionsRouter } from "./routers/plant-contributions";
import { genomicLinksRouter } from "./routers/genomic-links";
import { parcoursOlfactifRouter } from "./routers/parcours-olfactif";
import { curatedJourneysRouter } from "./routers/curated-journeys";
import { contributorRouter } from "./routers/contributor";
import { researchAxesRouter } from "./routers/research-axes";
import { sustainableAlternativesRouter } from "./routers/sustainable-alternatives";
import { plantTerroirsRouter } from "./routers/plant-terroirs";
import { ifraCalculatorRouter } from "./routers/ifra-calculator";
import { terpProfilesRouter } from "./routers/terp-profiles";
import { axisReferenceLinksRouter } from "./routers/axis-reference-links";
import { ghostVarietiesRouter } from "./routers/ghost-varieties";
import { validationRouter } from "./routers/validation";
import { referenceEntityLinksRouter } from "./routers/reference-entity-links";
import { researchEntriesRouter } from "./routers/research-entries";
import { genealogyRouter } from "./routers/genealogy";
import { aromaticAccordsRouter } from "./routers/aromatic-accords";
import { chemotypesRouter } from "./routers/chemotypes";
import { analyticsRouter } from "./routers/analytics";
import { chemicalFamiliesRouter } from "./routers/chemical-families";
import { gcmsImportRouter } from "./routers/gcms-import";
import { moleculeContributionsRouter } from "./routers/molecule-contributions";
import { classificationReviewsRouter } from "./routers/classification-reviews";
import { v3ReferencesRouter } from "./routers/v3-references";
import { referenceCitationsRouter } from "./routers/reference-citations";
import { formulationToolRouter } from "./routers/formulation-tool";
import { terpeneComparisonRouter } from "./routers/terpene-comparison";
import { molecularInteractionsRouter } from "./routers/molecular-interactions";
import { finalRecipesRouter } from "./routers/final-recipes";
import { ifraRestrictionsRouter } from "./routers/ifra-restrictions";
import { historyRouter } from "./routers/history";
import { synergiesRouter } from "./routers/synergies";
import { recipeContributionsRouter } from "./routers/recipe-contributions";
import { terroirContributionsRouter } from "./routers/terroir-contributions";
import { dataQualityRouter } from "./routers/data-quality";
import { crossLinksRouter } from "./routers/cross-links";
import { referenceNotesRouter } from "./routers/reference-notes";
import { referenceTagsRouter } from "./routers/reference-tags";
import { archivesRouter } from "./routers/archives";
import { entourageRulesRouter } from "./routers/entourage-rules";
import { galleryRouter } from "./routers/gallery";
import { uploadRouter } from "./routers/upload";
import { plantMoleculeLinksRouter } from "./routers/plant-molecule-links";
import { formulasRouter } from "./routers/formulas";

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
  laboratoire: laboratoireRouter,

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
  chemicalFamilies: chemicalFamiliesRouter,

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
  synergies: synergiesRouter,

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
  analytics: analyticsRouter,

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
  history: historyRouter,

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
  formulas: formulasRouter,

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
  ifraRestrictions: ifraRestrictionsRouter,

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
  terpProfiles: terpProfilesRouter,

  // ============================================================================
  // FINAL RECIPES (Recettes finales: Parfum, Encens, Espace - Point 3)
  // ============================================================================
  finalRecipes: finalRecipesRouter,

  // Point 3 Étendu - Routes botaniques avancées
  plantVarieties: plantVarietiesRouter,
  
  // Routes pour les liaisons plantes-molécules
  plantMoleculeLinks: plantMoleculeLinksRouter,
  
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
  chemotypes: chemotypesRouter,

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
  upload: uploadRouter,

  // Galerie d'images
  gallery: galleryRouter,

  // Calculateur de conformité IFRA avancé
  ifraCalculator: ifraCalculatorRouter,

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
  
  molecularInteractions: molecularInteractionsRouter,
  
  aromaticAccords: aromaticAccordsRouter,
  
  terpeneComparison: terpeneComparisonRouter,
  
  formulationTool: formulationToolRouter,
  
  entourageRules: entourageRulesRouter,

  // ============================================================================
  // PLANT-TERROIR RELATIONS (Connexions plantes-terroirs pour le graphe)
  // ============================================================================
  plantTerroirs: plantTerroirsRouter,

  // ============================================================================
  // GRAPHE DE RÉSEAU UNIFIÉ (Plantes, Terroirs, Molécules)
  // ============================================================================
  networkGraph: networkGraphRouter,

  // ============================================================================
  // OLFACTIVE ARCHIVES (Archives historiques)
  // ============================================================================
  archives: archivesRouter,

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
  genealogy: genealogyRouter,

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
  sustainableAlternatives: sustainableAlternativesRouter,

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
  researchAxes: researchAxesRouter,

  // ============================================================================
  // RESEARCH ENTRIES (Entrées de recherche)
  // ============================================================================
  researchEntries: researchEntriesRouter,

  // ============================================================================
  // REFERENCE CITATIONS (Citations croisées entre références)
  // ============================================================================
  referenceCitations: referenceCitationsRouter,

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
  
  v3References: v3ReferencesRouter,
  
  referenceTags: referenceTagsRouter,
  
  referenceNotes: referenceNotesRouter,
  
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
  referenceEntityLinks: referenceEntityLinksRouter,
  // ============================================================================
  // CONTRIBUTOR INTERFACE - Détection de doublons et ajout de données
  contributor: contributorRouter,

  // ============================================================================
  // VALIDATION & DRAFT SYSTEM ROUTER
  // ============================================================================
  validation: validationRouter,

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
  curatedJourneys: curatedJourneysRouter,

  // ============================================================================
  // PARCOURS OLFACTIF - FILTRES AVANCÉS
  // ============================================================================
  parcoursOlfactif: parcoursOlfactifRouter,

  // ============================================================================
  // LIENS CROISÉS (CROSS-LINKS)
  // ============================================================================
  crossLinks: crossLinksRouter,

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
  classificationReviews: classificationReviewsRouter,

  // Ghost Varieties (Variétés fantômes - AX1)
  ghostVarieties: ghostVarietiesRouter,

  // Genomic Links (Liaisons génomiques - G1-G3)
  genomicLinks: genomicLinksRouter,

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
  axisReferenceLinks: axisReferenceLinksRouter,

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
  dataQuality: dataQualityRouter,

  // ============================================================================
  // PLANT CONTRIBUTIONS ROUTER
  // ============================================================================
  plantContributions: plantContributionsRouter,

  // ============================================================
  // MOLECULE CONTRIBUTIONS
  // ============================================================
  moleculeContributions: moleculeContributionsRouter,

  // ============================================================
  // TERROIR CONTRIBUTIONS
  // ============================================================
  terroirContributions: terroirContributionsRouter,

  // ============================================================
  // RECIPE CONTRIBUTIONS
  // ============================================================
  recipeContributions: recipeContributionsRouter,

  // ============================================================
  // GC-MS IMPORT — Import de profils moléculaires GC-MS
  // ============================================================
  gcmsImport: gcmsImportRouter,

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

