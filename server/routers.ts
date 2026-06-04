
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
import { sparqlQidRouter } from './routers/sparql-qid';
import { moleculesQidRouter } from './routers/molecules-qid';
import { taxonomyEnrichmentRouter } from './routers/taxonomy-enrichment';
import { v3MigrationRouter } from './routers/v3-migration';
import { crossrefRouter } from './routers/crossref';
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
import { goodscentsRouter } from './routers/goodscents';
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
import { plantsAdminRouter } from "./routers/plants-admin";
import { europeanaBookmarksRouter } from "./routers/europeana-bookmarks";
import { sparqlSavedQueriesRouter } from "./routers/sparql-saved-queries";
import { cinemaSmellscapesRouter } from "./routers/cinema-smellscapes";
import { importRouter } from "./routers/import";
import { moleculesRouter } from "./routers/molecules";
import { moleculesAdminRouter } from "./routers/molecules-admin";
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
import { completudeRouter } from "./routers/completude";
import { navigationRouter } from "./routers/navigation";
import { forceGraphRouter } from "./routers/force-graph";
import { ghostVarietyExtendedRouter } from "./routers/ghost-variety-extended";
import { progressReportsRouter } from "./routers/progress-reports";
import { notificationsRouter } from "./routers/notifications";
import { orphanMoleculesRouter } from "./routers/orphan-molecules";
import { graphVisualizationRouter } from "./routers/graph-visualization";
import { autoLinkingRouter } from "./routers/auto-linking";
import { linkingCoverageRouter } from "./routers/linking-coverage";
import { axisGraphRouter } from "./routers/axis-graph";
import { thematicAxesRouter } from "./routers/thematic-axes";
import { plantsConservationRouter } from "./routers/plants-conservation";
import { markersRouter } from "./routers/markers";
import { ifraCategoriesRouter } from "./routers/ifra-categories";
import { contentStatsRouter } from "./routers/content-stats";
import { advancedSearchRouter } from "./routers/advanced-search";
import { fullProfilesRouter } from "./routers/full-profiles";
import { terroirSpecialtiesRouter } from "./routers/terroir-specialties";
import { moleculePlantSourcesRouter } from "./routers/molecule-plant-sources";
import { recetteRawMaterialsRouter } from "./routers/recette-raw-materials";
import { plantStatisticsRouter } from "./routers/plant-statistics";
import { extendedSuppliersRouter } from "./routers/extended-suppliers";
import { plantSamplesRouter } from "./routers/plant-samples";
import { plantAnalysesRouter } from "./routers/plant-analyses";
import { analyticalMethodsRouter } from "./routers/analytical-methods";
import { extractionMethodsRouter } from "./routers/extraction-methods";
import { terroirsRouter } from "./routers/terroirs";
import { moleculeScientificDataRouter } from "./routers/molecule-scientific-data";
import { moleculeOriginsRouter } from "./routers/molecule-origins";
import { situatedSmellsRouter } from "./routers/situated-smells";
import { extractionTestsRouter } from "./routers/extraction-tests";
import { fieldArchivesRouter } from "./routers/field-archives";
import { molecularProtocolsRouter } from "./routers/molecular-protocols";
import { climateStudiesRouter } from "./routers/climate-studies";
import { rechercheRadicaleRouter } from "./routers/recherche-radicale";
import { exportRouter } from "./routers/export";
import { citationsRouter } from "./routers/citations";
import { notesRouter } from "./routers/notes";
import { moleculeNotesRouter } from "./routers/molecule-notes";
import { sharedCollectionsRouter } from "./routers/shared-collections";
import { milestonesRouter } from "./routers/milestones";
import { favoritesRouter } from "./routers/favorites";
import { dashboardRouter } from "./routers/dashboard";
import { networkRouter } from "./routers/network";
import { prototypeRouter } from "./routers/prototype";
import { civilisationRouter } from "./routers/civilisation";
import { recetteRouter } from "./routers/recette";
import { moleculeRouter } from "./routers/molecule";
import { searchRouter } from "./routers/search";
import { experimentalAccordsRouter } from "./routers/experimental-accords";
import { absorbeProfilesRouter } from "./routers/absorbe-profiles";
import { timelineRouter } from "./routers/timeline";
import { glossaryRouter } from "./routers/glossary";
import { adminRouter } from "./routers/admin";
import { homeRouter } from "./routers/home";
import { formulationRouter } from "./routers/formulation";
import { tabacsRouter } from "./routers/tabacs";
import { volcaniqueRouter } from "./routers/volcanique";
import { petrichorRouter } from "./routers/petrichor";
import { installationsRouter } from "./routers/installations";
import { civilisationsRouter } from "./routers/civilisations";
import { recommendationsRouter } from "./routers/recommendations";
import { accordsRouter } from "./routers/accords";
import { terpeneSynergiesRouter } from "./routers/terpene-synergies";
import { familiesRouter } from "./routers/families";
import { prototypesRouter } from "./routers/prototypes";
import { authRouter } from "./routers/auth";

// ── Types pour les réponses LLM enrichissement ────────────────────────────────
export interface PlantEnrichmentLLM {
  olfactiveProfile: string[];
  therapeuticProperties: string[];
  dominantMolecules: string[];
  traditionalUse: string;
  habitat: string;
  description: string;
}
export interface RawMaterialEnrichmentLLM {
  description: string;
  olfactiveProfile: string[];
  therapeuticProperties: string[];
  keyMolecules: string[];
  usagesInPerfumery: string;
  extractionDetails: string;
  qualityMarkers: string[];
}
export interface MoleculeEnrichmentLLM {
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
  goodscents: goodscentsRouter,
  
  auth: authRouter,

  // Prototypes
  prototypes: prototypesRouter,

  // Families
  families: familiesRouter,

  // Laboratoire (Matières Premières)
  laboratoire: laboratoireRouter,

  // Plants admin (Rapport 18 : delete, updateFields, enrichFromGBIF, enrichFromWikidata)
  plantsAdmin: plantsAdminRouter,

  // Europeana Bookmarks (Rapport 20 : bibliothèque iconographique personnelle)
  europeanaBookmarks: europeanaBookmarksRouter,
  // SPARQL Saved Queries (Rapport 21 : bibliothèque de requêtes SPARQL personnelles)
  sparqlSaved: sparqlSavedQueriesRouter,
  cinemaSmellscapes: cinemaSmellscapesRouter,

  // Molecules (avec cache pour optimisation)
  molecules: moleculesRouter,
  // Molecules admin (Rapport 17 : delete, updateFields, enrichFromWikidata, getFullById)
  moleculesAdmin: moleculesAdminRouter,

  // PubChem IUPAC batch
  pubchemIupac: pubchemIupacRouter,

    // Terpene Synergies
  terpeneSynergies: terpeneSynergiesRouter,

  // Accords
  accords: accordsRouter,

  // Recettes (avec cache pour optimisation)
  recettes: recettesInlineRouter,

  // Recommandations
  recommendations: recommendationsRouter,

  // Civilisations
  civilisations: civilisationsRouter,

  // Installations
  installations: installationsRouter,

  // Petrichor
  petrichor: petrichorRouter,

  // Volcanique
  volcanique: volcaniqueRouter,

  // Tabacs
  tabacs: tabacsRouter,

  // Formulation
  formulation: formulationRouter,

  // Home
  home: homeRouter,

  // Admin
  admin: adminRouter,

  // Glossary
  glossary: glossaryRouter,

  // Timeline
  timeline: timelineRouter,

  // Chemical Families (Enrichi)
  chemicalFamilies: chemicalFamiliesRouter,

  // Experimental Accords
  absorbeProfiles: absorbeProfilesRouter,

  experimentalAccords: experimentalAccordsRouter,

  // Global Search (avec cache pour optimisation)
  search: searchRouter,

  // Molecule details
  molecule: moleculeRouter,

  // Recette details
  recette: recetteRouter,

  // Civilisation details
  civilisation: civilisationRouter,

  // Prototype details
  prototype: prototypeRouter,

  // Network visualization
  network: networkRouter,
  // Dashboard statistics
  dashboard: dashboardRouter,

  // Synergies Moléculaires
  synergies: synergiesRouter,

  // Favorites
  favorites: favoritesRouter,

  // Milestones
  milestones: milestonesRouter,

  // ============================================================================
  // PHASE 4: COLLABORATION & PARTAGE - tRPC Procedures
  // ============================================================================

  // Shared Collections
  sharedCollections: sharedCollectionsRouter,

  // Molecule Notes
  moleculeNotes: moleculeNotesRouter,

  // User Notes
  notes: notesRouter,

  // Citations
  citations: citationsRouter,

  // Analytics
  analytics: analyticsRouter,

  // Export CSV
  export: exportRouter,

  // Import CSV
  import: importRouter,

  // Historique des modifications
  history: historyRouter,

  // Recherche Radicale
  rechercheRadicale: rechercheRadicaleRouter,

  // Saved Formulas (Historique des formules générées)
  formulas: formulasRouter,

  // Climate Studies (Études climatiques)
  climateStudies: climateStudiesRouter,

  // Molecular Protocols (Protocoles moléculaires)
  molecularProtocols: molecularProtocolsRouter,

  // Field Archives (Archives terrain)
  fieldArchives: fieldArchivesRouter,

  // Extraction Tests (Tests d'extraction)
  extractionTests: extractionTestsRouter,

  // Situated Smells (Odeurs situées)
  situatedSmells: situatedSmellsRouter,

  // Leaf Economies (San Andrés / Seaflower Research)
  leafEconomies: leafEconomiesRouter,

  // Geographic Origins (Terroirs de production)
  geographicOrigins: geographicOriginsRouter,

  // Molecule Origins (Relations molécules-terroirs)
  moleculeOrigins: moleculeOriginsRouter,

  // IFRA Restrictions
  ifraRestrictions: ifraRestrictionsRouter,

  // Molecule Scientific Data
  moleculeScientificData: moleculeScientificDataRouter,

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
  
  terroirs: terroirsRouter,
  
  extractionMethods: extractionMethodsRouter,
  
  // Méthodes analytiques (GC-MS, PTR-MS, etc.)
  analyticalMethods: analyticalMethodsRouter,
  
  plantAnalyses: plantAnalysesRouter,
  
  // ============================================================
  // ENRICHISSEMENT IA — Plantes
  // ============================================================
  aiEnrichPlant: aiEnrichPlantRouter,

  // ============================================================
  // ENRICHISSEMENT IA — Matières Premières
  // ============================================================
  aiEnrichRawMaterial: aiEnrichRawMaterialRouter,

  aiEnrichMolecule: aiEnrichMoleculeRouter,


  plantSamples: plantSamplesRouter,
  
  extendedSuppliers: extendedSuppliersRouter,
  
  plantStatistics: plantStatisticsRouter,

  // ============================================================================
  // MATIÈRES PREMIÈRES ET RELATIONS MOLÉCULE-PLANTE-TERROIR
  // ============================================================================
  
  rawMaterials: rawMaterialsInlineRouter,
  recetteRawMaterials: recetteRawMaterialsRouter,
  moleculePlantSources: moleculePlantSourcesRouter,

  terroirSpecialties: terroirSpecialtiesRouter,

  // Profils complets avec toutes les relations
  fullProfiles: fullProfilesRouter,

  // Recherche avancée
  advancedSearch: advancedSearchRouter,

  // Statistiques de contenu
  contentStats: contentStatsRouter,

  // Chémotypes (variations chimiques au sein d'une même espèce)
  chemotypes: chemotypesRouter,

  // Catégories IFRA et calcul des limites
  ifraCategories: ifraCategoriesRouter,

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
  markers: markersRouter,

  // ============================================================================
  // VARIETY GENEALOGY (Généalogie des variétés)
  // ============================================================================
  genealogy: genealogyRouter,

  // ============================================================================
  // PLANTS CONSERVATION (Conservation des plantes)
  // ============================================================================
  plantsConservation: plantsConservationRouter,

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
  
  thematicAxes: thematicAxesRouter,
  
  v3References: v3ReferencesRouter,
  
  referenceTags: referenceTagsRouter,
  
  referenceNotes: referenceNotesRouter,
  
  axisGraph: axisGraphRouter,
  
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
  linkingCoverage: linkingCoverageRouter,

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
  autoLinking: autoLinkingRouter,

  // ============================================================================
  // GRAPH VISUALIZATION (Visualisation graphique des références)
  // ============================================================================
  graphVisualization: graphVisualizationRouter,

  // ============================================================================
  // ORPHAN MOLECULES CLASSIFICATION
  // ============================================================================
  orphanMolecules: orphanMoleculesRouter,

  // ============================================================================
  // NOTIFICATIONS SYSTEM
  // ============================================================================
  notifications: notificationsRouter,

  // ============================================================================
  // CLASSIFICATION PROGRESS REPORTS
  // ============================================================================
  progressReports: progressReportsRouter,

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
  ghostVarietyExtended: ghostVarietyExtendedRouter,

  // Ghost Variety Links (Liaisons variétés fantômes ↔ molécules/plantes)
  ghostVarietyLinks: ghostVarietyLinksRouter,

  // ============================================================================
  // AXIS REFERENCE LINKS (Liaisons axes-références pour le graphe)
  // ============================================================================
  axisReferenceLinks: axisReferenceLinksRouter,

  // ============================================================================
  // FORCE GRAPH VISUALIZATION
  // ============================================================================
  forceGraph: forceGraphRouter,

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

  navigation: navigationRouter,

  completude: completudeRouter,

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
  // Rapport 12 — QID Picker : recherche d'entités avec QID, catalogue, résolution
  sparqlQid: sparqlQidRouter,
  // Rapport 15 — Enrichissement QID Wikidata pour les molécules sans identifiant
  moleculesQid: moleculesQidRouter,
  // Rapport 16 — Enrichissement taxonomique (family/genus) pour les plantes sans famille
  taxonomyEnrichment: taxonomyEnrichmentRouter,
  // Axe 1.4 Rapport 7 — Migration v3_references → bibliography_entries
  v3Migration: v3MigrationRouter,
  // Axe 3.3 Rapport 7 — Réseau de citations CrossRef
  crossref: crossrefRouter,
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

