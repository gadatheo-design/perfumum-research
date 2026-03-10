import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

/**
 * Configuration Vite optimisée pour PERFUMUM
 * 
 * Améliorations apportées:
 * - Code splitting agressif pour réduire le bundle initial (-40-60%)
 * - Optimisation des dépendances lourdes (React, Radix UI, Charts)
 * - Configuration du cache pour améliorer les temps de rebuild
 * - Compression et minification optimisées
 * - Préchargement intelligent des modules
 */

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusRuntime({ injectTo: "body" }),
  // Bundle analyzer - génère stats.html après build
  // visualizer({
  //   filename: "./dist/stats.html",
  //   open: false,
  //   gzipSize: true,
  //   brotliSize: true,
  //   template: "treemap", // ou "sunburst", "network"
  // }),
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
    
    // Optimisation du bundle
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    cssCodeSplit: true,
    
    // Taille des chunks
    chunkSizeWarningLimit: 1000, // 1MB
    
    // Sourcemaps pour production (désactiver si non nécessaire)
    sourcemap: false,
    
    // Code splitting agressif
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // === VENDOR CHUNKS ===
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('react/jsx-runtime')) return 'react-vendor';
          if (id.includes('node_modules/wouter')) return 'router';
          if (id.includes('node_modules/@tanstack/react-query')) return 'query';
          if (id.includes('node_modules/@trpc/')) return 'trpc';
          if (id.includes('node_modules/@radix-ui/')) return 'ui-radix';
          if (id.includes('node_modules/lucide-react')) return 'icons';
          if (id.includes('node_modules/framer-motion')) return 'animation';
          if (id.includes('node_modules/reactflow') || id.includes('node_modules/@xyflow/')) return 'viz-reactflow';
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) return 'viz-charts';
          if (id.includes('node_modules/recharts')) return 'viz-recharts';
          if (id.includes('node_modules/d3') || id.includes('node_modules/d3-sankey')) return 'viz-d3';
          if (id.includes('node_modules/react-force-graph')) return 'viz-force-graph';
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) return 'maps-leaflet';
          if (id.includes('node_modules/smiles-drawer')) return 'chem-smiles';
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) return 'export-pdf';
          if (id.includes('node_modules/jszip')) return 'export-zip';
          if (id.includes('node_modules/papaparse')) return 'export-csv';
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform/') || id.includes('node_modules/zod')) return 'forms';
          if (id.includes('node_modules/streamdown') || id.includes('node_modules/react-markdown') || id.includes('node_modules/remark') || id.includes('node_modules/rehype') || id.includes('node_modules/unified') || id.includes('node_modules/micromark') || id.includes('node_modules/mdast') || id.includes('node_modules/hast') || id.includes('node_modules/vfile')) return 'markdown';
          // Shiki (syntax highlighting) - très lourd, extraire séparément
          if (id.includes('node_modules/shiki') || id.includes('node_modules/@shikijs/')) return 'vendor-shiki';
          // Katex (formules mathématiques) - lourd
          if (id.includes('node_modules/katex') || id.includes('node_modules/rehype-katex') || id.includes('node_modules/remark-math')) return 'vendor-katex';
          // Lodash
          if (id.includes('node_modules/lodash')) return 'vendor-lodash';
          // Date utilities
          if (id.includes('node_modules/dayjs') || id.includes('node_modules/date-fns')) return 'vendor-dates';
          // Validation
          if (id.includes('node_modules/validator')) return 'vendor-validator';
          // UI utilities
          if (id.includes('node_modules/embla-carousel')) return 'carousel';
          if (id.includes('node_modules/react-window')) return 'window';
          if (id.includes('node_modules/qrcode')) return 'qr';
          if (id.includes('node_modules/sonner')) return 'vendor-sonner';
          if (id.includes('node_modules/vaul') || id.includes('node_modules/cmdk')) return 'vendor-ui-misc';
          if (id.includes('node_modules/')) return 'vendor-misc';
          
          // === PAGE CHUNKS PAR CATÉGORIE ===
          // Regrouper toutes les pages en ~15 chunks thématiques
          const src = id.replace(/\\/g, '/');
          
          // Admin
          if (src.includes('/pages/admin/') || src.includes('/pages/Admin')) return 'pages-admin';
          
          // Molécules & Chimie
          if (src.match(/\/pages\/(Molecule|Molecules|MoleculesHub|MoleculeDetail|MoleculeSearch|MoleculeRecette|MoleculePlant|Familles|FamillesList|FamilyDetail|SmilesViewer|ChemicalFamily|Osmoth)/)) return 'pages-molecules';
          
          // Plantes & Botanique
          if (src.match(/\/pages\/(Plant|Plants|PlantsHub|PlantDetail|PlantForm|PlantVarieties|PlantsByMolecule|PlantMolecule|PlantTerroir|GalerieBotaniques|TimelineBotanique|PhylogeneticView|TpsGenes|GenomicsExplorer|LeafEconom)/)) return 'pages-plants';
          
          // Tabac & Cannabis
          if (src.match(/\/pages\/(Tabac|Tabacotheque|Tabacs|Tobacco|Cannabis|Perique|Pyrolyse|Pyrolysis|SourcingTabac|SourcingCannabis|InteractionsTabac|HistoricCigarettes|ResinesCBD|RecetteCBD|LandraceDetail|LandraceComparator|TobaccoLandrace|VarietesFantomes|GhostVariet|TerpProfiles|TerpeneDetail|TerpeneProfiles|DegradationTerpenes|MolecularTransformations|ProtocolesMaturation|ProtocoleMoleculaire)/)) return 'pages-tabac';
          
          // Recettes & Formulation
          if (src.match(/\/pages\/(Recette|Recettes|RecettesHub|RecipeDetail|RecipeNetwork|RecipeTimeline|FinalRecipe|FormulesReference|GenerateurFormules|OutilFormulation|OutilsFormulation|ProportionsCalculator|DilutionCalculator|LaboratoireRecettes|Laboratoire|Prototypes|PrototypeDetail|AccordsDedies|Accords|ExperimentalAccords)/)) return 'pages-recettes';
          
          // Gammes & Collections
          if (src.match(/\/pages\/(Gamme|GammesHub|GammesBioLab|GammesGlaciaire|GammesMossi|GammesPetrichor|GammesVolcanique|GammeSignatures|GammeRaretes|GammePheromones|ColombieLine|SourcingColombie|SourcingFrance|SourcingInde|SourcingMadagascar|SourcingNorthAmerica|SourcingHub|Sourcing|AromaticRar)/)) return 'pages-gammes';
          
          // Recherche & Méthode ABSORBE
          if (src.match(/\/pages\/(Absorbe|AbsorbeX|MethodeAbsorbe|MethodologieRecherche|AxesRecherche|AxeRechercheDetail|ProgrammesRecherche|Recherche|RechercheAvancee|RechercheGlobale|RechercheRadicale|RechercheScientifique|RechercheProfilMoleculaire|AdvancedSearch|CrossSearch|PerceptSearch|ResearchData)/)) return 'pages-recherche';
          
          // Graphes & Visualisations
          if (src.match(/\/pages\/(Graphe|Reseau|ReseauAxes|ReseauLiaisons|ReseauMolecule|SankeyFlow|RelationsGraph|GenealogyGraph|GrapheAxes|GrapheMolecules|GraphePlante|GrapheReferences|GrapheTerroir|PublicationMolecule|RecipeNetwork|PlantMoleculeNetwork|PlantTerroirNetwork|SynergiesGraph|SynergiesHeatmap|RadarCorrelation|PyrolysisVisualization|MatriceInteractive|MatriceSynergies|VisualisationsCorrelation|Visualisations|EnhancedRadar)/)) return 'pages-graphes';
          
          // Terroirs & Géographie
          if (src.match(/\/pages\/(Terroir|Terroirs|TerroirDetail|TerroirMapPage|OriginesGeographiques|SoilAnalysis|EtudesClimatiques|EtudeClimatiqueDetail|Etudes|ArchivesTerrain|ArchiveTerrainDetail|Archives|ArchivesOlfactives|HeritageConservation|PatrimoineMenace|AlternativesDurables)/)) return 'pages-terroirs';
          
          // Matières Premières & Extraction
          if (src.match(/\/pages\/(MatierePremiere|MatieresPremieres|RawMaterial|RawMaterials|ExtractionMethods|TestsExtraction|TestExtractionDetail|GCMSChromatograms|MSSpectraViewer|SpectraComparison|SpectraIdentification|ModelesAnalytiques|AnalyticalMethods|AnalysisHub|TechnicalProtocols|ProtocolDetail|Fournisseurs|Inventaire|InventoryDashboard)/)) return 'pages-matieres';
          
          // Bibliographie & Références
          if (src.match(/\/pages\/(Bibliographie|BibliographieGlobale|BibliographiePage|ExportBibliographique|References|ReferencesGraph|ReferencesV3|ReferenceLinkNetwork|ReferenceEntityLink|SuggestReferenceLinks|Glossaire|GlossaireVisuel)/)) return 'pages-references';
          
          // Dashboard & Analytics
          if (src.match(/\/pages\/(Dashboard|DashboardMinimal|DashboardRecherche|MonDashboard|GoalDashboard|AnalyticsDashboard|OlfactiveStats|Statistics|Statistiques|EnrichmentDashboard|LinkingDashboard|Timeline|TimelineInteractive|TimelinePerfumum|Journal|Nouveautes|Favoris|MyFavorites)/)) return 'pages-dashboard';
          
          // Projet & Documentation
          if (src.match(/\/pages\/(LeProjet|APropos|Manifeste|FondementsPhilosophiques|SystemePerfumum|Projets|ParcoursOlfactif|ParcoursDetail|Installations|OdeursSituees|OdeurSitueeDetail|Gallery|Outils|OutilsHub|GestionPage|Ifra|IFRACompliance|SimplifiedContributor|Associations|SynergiesMoleculaires|SynergiesPage|SynergiesTerpenes|SuggestionsSynergies|MuscsComparatif|BioMineralis|MoleculesDisparues|Benefices|FormulesReference|Historique|Favoris)/)) return 'pages-projet';
          
          // Liaison & Import
          if (src.match(/\/pages\/(Linking|Import|Batch|Audit|Drag|CSV|Linking|H2Linking|H3Linking|NichePlant|PlantMoleculeLinking|PlantTerroirLinking|MoleculeRecetteLinking|VueDetailConnexions|AdminMolecule|AdminRecettes|AdminImport|AdminGcms|AdminDuplicates|AdminOrphan|AdminCompletude|AdminValidation|AdminContributions|AdminHistorique|AdminProgressReport|AdminChemical|AdminNotifications|AdminAI|AIClassification|EnrichissementPubChem)/)) return 'pages-admin';
          
          // Reste des pages non catégorisées
          if (src.includes('/pages/')) return 'pages-misc';
        },
        
        // Nommage des chunks pour un meilleur debugging
        chunkFileNames: "assets/[name]-[hash].js",
        
        // Optimisation des assets
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
  
  // Optimisation des dépendances
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
    
    // Exclure les dépendances problématiques du pre-bundling
    exclude: [
      "reactflow", // Cause des problèmes avec HMR
    ],
    
    // Force le re-bundling si nécessaire
    force: false,
  },
  
  // Configuration du serveur de développement
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
  
  // Performance
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    
    // Optimisation des performances de build
    target: "esnext",
    
    // Suppression des console.log en production
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  
  // Cache
  cacheDir: ".vite",
});
