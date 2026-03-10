import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import { visualizer } from "rollup-plugin-visualizer";

/**
 * Configuration Vite — PERFUMUM
 *
 * Règle de sécurité anti-cycles :
 *   - Les chunks VENDOR ne s'importent JAMAIS entre eux
 *   - Seul react-vendor est extrait manuellement (noyau sans dépendances)
 *   - Les chunks PAGES regroupent les composants par thème fonctionnel
 *   - Tout le reste (node_modules) est laissé à Rollup (auto-splitting)
 *
 * Pourquoi react-vendor seulement ?
 *   React/ReactDOM n'ont aucune dépendance externe → zéro risque de cycle.
 *   Extraire d'autres vendors (lodash, d3, etc.) crée des cycles car ils
 *   importent souvent react ou d'autres vendors.
 */

const isAnalyze = process.env.ANALYZE === "true";

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusRuntime({ injectTo: "body" }),
  // Générer stats.html uniquement quand ANALYZE=true (pnpm run build:analyze)
  ...(isAnalyze
    ? [
        visualizer({
          filename: "dist/public/bundle-stats.html",
          open: false,
          gzipSize: true,
          brotliSize: true,
          template: "treemap", // treemap | sunburst | network
        }),
      ]
    : []),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000,
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ─── VENDOR : React uniquement (aucune dépendance externe → zéro cycle) ───
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react/jsx-runtime")
          ) {
            return "react-vendor";
          }

          // ─── PAGES : regroupement par thème fonctionnel ───────────────────────────
          // Règle : ces chunks n'importent que depuis node_modules ou d'autres pages.
          // Ils ne créent pas de cycles car node_modules → Rollup gère seul.
          const src = id.replace(/\\/g, "/");

          // Admin & Import
          if (
            src.match(
              /\/pages\/(admin\/|Admin|Import|Batch|Audit|Linking|H2Linking|H3Linking|NichePlant|PlantMoleculeLinking|PlantTerroirLinking|MoleculeRecetteLinking|VueDetailConnexions|AdminMolecule|AdminRecettes|AdminImport|AdminGcms|AdminDuplicates|AdminOrphan|AdminCompletude|AdminValidation|AdminContributions|AdminHistorique|AdminProgressReport|AdminChemical|AdminNotifications|AdminAI|AIClassification|EnrichissementPubChem)/
            )
          )
            return "pages-admin";

          // Molécules & Chimie
          if (
            src.match(
              /\/pages\/(Molecule|Molecules|MoleculesHub|MoleculeDetail|MoleculeSearch|MoleculeRecette|MoleculePlant|Familles|FamillesList|FamilyDetail|SmilesViewer|ChemicalFamily|Osmoth)/
            )
          )
            return "pages-molecules";

          // Plantes & Botanique
          if (
            src.match(
              /\/pages\/(Plant|Plants|PlantsHub|PlantDetail|PlantForm|PlantVarieties|PlantsByMolecule|PlantMolecule|PlantTerroir|GalerieBotaniques|TimelineBotanique|PhylogeneticView|TpsGenes|GenomicsExplorer|LeafEconom)/
            )
          )
            return "pages-plants";

          // Tabac & Cannabis
          if (
            src.match(
              /\/pages\/(Tabac|Tabacotheque|Tabacs|Tobacco|Cannabis|Perique|Pyrolyse|Pyrolysis|SourcingTabac|SourcingCannabis|InteractionsTabac|HistoricCigarettes|ResinesCBD|RecetteCBD|LandraceDetail|LandraceComparator|TobaccoLandrace|VarietesFantomes|GhostVariet|TerpProfiles|TerpeneDetail|TerpeneProfiles|DegradationTerpenes|MolecularTransformations|ProtocolesMaturation|ProtocoleMoleculaire)/
            )
          )
            return "pages-tabac";

          // Recettes & Formulation
          if (
            src.match(
              /\/pages\/(Recette|Recettes|RecettesHub|RecipeDetail|RecipeNetwork|RecipeTimeline|FinalRecipe|FormulesReference|GenerateurFormules|OutilFormulation|OutilsFormulation|ProportionsCalculator|DilutionCalculator|LaboratoireRecettes|Laboratoire|Prototypes|PrototypeDetail|AccordsDedies|Accords|ExperimentalAccords)/
            )
          )
            return "pages-recettes";

          // Gammes & Collections
          if (
            src.match(
              /\/pages\/(Gamme|GammesHub|GammesBioLab|GammesGlaciaire|GammesMossi|GammesPetrichor|GammesVolcanique|GammeSignatures|GammeRaretes|GammePheromones|ColombieLine|SourcingColombie|SourcingFrance|SourcingInde|SourcingMadagascar|SourcingNorthAmerica|SourcingHub|Sourcing|AromaticRar)/
            )
          )
            return "pages-gammes";

          // Recherche & Méthode ABSORBE
          if (
            src.match(
              /\/pages\/(Absorbe|AbsorbeX|MethodeAbsorbe|MethodologieRecherche|AxesRecherche|AxeRechercheDetail|ProgrammesRecherche|Recherche|RechercheAvancee|RechercheGlobale|RechercheRadicale|RechercheScientifique|RechercheProfilMoleculaire|AdvancedSearch|CrossSearch|PerceptSearch|ResearchData)/
            )
          )
            return "pages-recherche";

          // Graphes & Visualisations
          if (
            src.match(
              /\/pages\/(Graphe|Reseau|ReseauAxes|ReseauLiaisons|ReseauMolecule|SankeyFlow|RelationsGraph|GenealogyGraph|GrapheAxes|GrapheMolecules|GraphePlante|GrapheReferences|GrapheTerroir|PublicationMolecule|RecipeNetwork|PlantMoleculeNetwork|PlantTerroirNetwork|SynergiesGraph|SynergiesHeatmap|RadarCorrelation|PyrolysisVisualization|MatriceInteractive|MatriceSynergies|VisualisationsCorrelation|Visualisations|EnhancedRadar)/
            )
          )
            return "pages-graphes";

          // Terroirs & Géographie
          if (
            src.match(
              /\/pages\/(Terroir|Terroirs|TerroirDetail|TerroirMapPage|OriginesGeographiques|SoilAnalysis|EtudesClimatiques|EtudeClimatiqueDetail|Etudes|ArchivesTerrain|ArchiveTerrainDetail|Archives|ArchivesOlfactives|HeritageConservation|PatrimoineMenace|AlternativesDurables)/
            )
          )
            return "pages-terroirs";

          // Matières Premières & Extraction
          if (
            src.match(
              /\/pages\/(MatierePremiere|MatieresPremieres|RawMaterial|RawMaterials|ExtractionMethods|TestsExtraction|TestExtractionDetail|GCMSChromatograms|MSSpectraViewer|SpectraComparison|SpectraIdentification|ModelesAnalytiques|AnalyticalMethods|AnalysisHub|TechnicalProtocols|ProtocolDetail|Fournisseurs|Inventaire|InventoryDashboard)/
            )
          )
            return "pages-matieres";

          // Bibliographie & Références
          if (
            src.match(
              /\/pages\/(Bibliographie|BibliographieGlobale|BibliographiePage|ExportBibliographique|References|ReferencesGraph|ReferencesV3|ReferenceLinkNetwork|ReferenceEntityLink|SuggestReferenceLinks|Glossaire|GlossaireVisuel)/
            )
          )
            return "pages-references";

          // Dashboard & Analytics
          if (
            src.match(
              /\/pages\/(Dashboard|DashboardMinimal|DashboardRecherche|MonDashboard|GoalDashboard|AnalyticsDashboard|OlfactiveStats|Statistics|Statistiques|EnrichmentDashboard|LinkingDashboard|Timeline|TimelineInteractive|TimelinePerfumum|Journal|Nouveautes|Favoris|MyFavorites)/
            )
          )
            return "pages-dashboard";

          // Projet & Documentation
          if (
            src.match(
              /\/pages\/(LeProjet|APropos|Manifeste|FondementsPhilosophiques|SystemePerfumum|Projets|ParcoursOlfactif|ParcoursDetail|Installations|OdeursSituees|OdeurSitueeDetail|Gallery|Outils|OutilsHub|GestionPage|Ifra|IFRACompliance|SimplifiedContributor|Associations|SynergiesMoleculaires|SynergiesPage|SynergiesTerpenes|SuggestionsSynergies|MuscsComparatif|BioMineralis|MoleculesDisparues|Benefices|FormulesReference|Historique)/
            )
          )
            return "pages-projet";

          // Pages non catégorisées
          if (src.includes("/pages/")) return "pages-misc";

          // Tout le reste : Rollup décide (évite les cycles vendor)
        },

        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".");
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || "")) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|eot/i.test(ext || "")) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "wouter",
      "@tanstack/react-query",
      "@trpc/client",
      "@trpc/react-query",
    ],
    exclude: ["reactflow"],
    force: false,
  },

  server: {
    host: true,
    allowedHosts: "all",
    hmr: {
      clientPort: 443,
      protocol: "wss",
      overlay: false,
    },
    fs: {
      strict: false,
    },
  },

  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    target: "esnext",
  },

  cacheDir: ".vite",
});
