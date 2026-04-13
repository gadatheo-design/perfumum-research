import { Toaster } from "@/components/ui/sonner";
import React, { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Wrapper qui ajoute Header/Footer aux pages de détail qui n'en ont pas
const WithLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);
import { TooltipProvider } from "@/components/ui/tooltip";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useNavigationHistory } from "@/hooks/useNavigationHistory";
import { GlobalSearchAdvanced } from "@/components/GlobalSearchAdvanced";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { ScrollToTop } from "./components/ScrollToTop";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { PageTransition } from "./components/PageTransition";
import { NavigationProgressBar } from "./components/NavigationProgressBar";
import { LegacyRedirect, SimpleRedirect } from "./components/LegacyRedirect";
// Guided navigation
import { GuidedNavigationProvider } from "./contexts/GuidedNavigationContext";
import { GuidedNavigationBar, GuidedNavigationWidget, TourSelector } from "./components/GuidedNavigation";

// === ABSORBE X - RECHERCHE AVANCÉE ===
const AbsorbeXDashboard = React.lazy(() => import('./pages/AbsorbeXDashboard').then(m => ({ default: m.AbsorbeXDashboard })));
const AbsorbeXManifeste = React.lazy(() => import('./pages/AbsorbeXManifeste').then(m => ({ default: m.AbsorbeXManifeste })));
const AbsorbeXNotesRecherche = React.lazy(() => import('./pages/AbsorbeXNotesRecherche').then(m => ({ default: m.AbsorbeXNotesRecherche })));
const AbsorbeXQuantique = React.lazy(() => import('./pages/AbsorbeXQuantique').then(m => ({ default: m.AbsorbeXQuantique })));
const AbsorbeXPatrimoine = React.lazy(() => import('./pages/AbsorbeXPatrimoine').then(m => ({ default: m.AbsorbeXPatrimoine })));
const AbsorbeXNeuroOlfaction = React.lazy(() => import('./pages/AbsorbeXNeuroOlfaction').then(m => ({ default: m.AbsorbeXNeuroOlfaction })));
const AbsorbeXOdeursPerdues = React.lazy(() => import('./pages/AbsorbeXOdeursPerdues').then(m => ({ default: m.AbsorbeXOdeursPerdues })));
const MoleculesDisparues = React.lazy(() => import('./pages/MoleculesDisparues').then(m => ({ default: m.MoleculesDisparues })));
const AbsorbeXGuideLaboratoire = React.lazy(() => import('@/pages/AbsorbeXGuideLaboratoire').then(m => ({ default: m.AbsorbeXGuideLaboratoire })));
const AromaticRarities = React.lazy(() => import('@/pages/AromaticRarities'));
const AromaticRarityDetailPage = React.lazy(() => import('@/pages/AromaticRarityDetailPage'));
const Conservation = React.lazy(() => import('@/pages/Conservation'));
const ClaimsAndProofs = React.lazy(() => import('@/pages/ClaimsAndProofs'));
const Tabacotheque = React.lazy(() => import('@/pages/Tabacotheque').then(m => ({ default: m.Tabacotheque })));
const ClaimsAndProofsPage = React.lazy(() => import('@/pages/ClaimsAndProofsPage').then(m => ({ default: m.ClaimsAndProofsPage })));
const AdminDuplicates = React.lazy(() => import('@/pages/AdminDuplicates'));

// === PAGES PRINCIPALES ===
import Home from "./pages/Home";
const SystemePerfumum = React.lazy(() => import('./pages/SystemePerfumum'));
const APropos = React.lazy(() => import('./pages/APropos'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Nouveautes = React.lazy(() => import('./pages/Nouveautes'));
const LeProjet = React.lazy(() => import('./pages/LeProjet'));
const VisualisationGCMS = React.lazy(() => import('./pages/VisualisationGCMS'));

// === ADMINISTRATION ===
const Admin = React.lazy(() => import('./pages/Admin'));

// import AdminMolecules from "./pages/AdminMolecules"; // Non utilisé - AdminMoleculesIndex est utilisé à la place
const AdminMoleculeNew = React.lazy(() => import('./pages/AdminMoleculeNew'));
const AdminRecettes = React.lazy(() => import('./pages/AdminRecettes'));
const AdminImportExport = React.lazy(() => import('./pages/AdminImportExport'));
const ImportExportPlants = React.lazy(() => import('./pages/ImportExportPlants'));
const ImportCSV = React.lazy(() => import('./pages/ImportCSV'));
const ImportCSVPreview = React.lazy(() => import('./pages/ImportCSVPreview'));
const AdminHistorique = React.lazy(() => import('./pages/AdminHistorique'));
const AdminReferences = React.lazy(() => import('./pages/AdminReferences'));
const LiaisonRecettesMolecules = React.lazy(() => import('./pages/admin/LiaisonRecettesMolecules'));
const MoleculeOriginsAdmin = React.lazy(() => import('./pages/admin/MoleculeOriginsAdmin'));
const TerroirsGeocode = React.lazy(() => import('./pages/admin/TerroirsGeocode'));
const AdminMoleculesIndex = React.lazy(() => import('./pages/admin/AdminMoleculesIndex'));
const AdminAccords = React.lazy(() => import('./pages/admin/AdminAccords'));
const AdminFamilles = React.lazy(() => import('./pages/admin/AdminFamilles'));
const AdminMatieres = React.lazy(() => import('./pages/admin/AdminMatieres'));
const MoleculeRecetteLinking = React.lazy(() => import('./pages/MoleculeRecetteLinking'));
const MoleculeRecetteAudit = React.lazy(() => import('./pages/MoleculeRecetteAudit'));
const MoleculeRecetteDragDrop = React.lazy(() => import('./pages/MoleculeRecetteDragDrop'));
const MoleculeRecetteImportCSV = React.lazy(() => import('./pages/MoleculeRecetteImportCSV'));
const PlantTerroirLinking = React.lazy(() => import('./pages/PlantTerroirLinking'));
const PlantTerroirAudit = React.lazy(() => import('./pages/PlantTerroirAudit'));
const PlantTerroirDragDrop = React.lazy(() => import('./pages/PlantTerroirDragDrop'));
const PlantTerroirImportCSV = React.lazy(() => import('./pages/PlantTerroirImportCSV'));
const PlantMoleculeAudit = React.lazy(() => import('./pages/PlantMoleculeAudit'));
const LinkingDashboard = React.lazy(() => import('./pages/LinkingDashboard'));
const AdminValidation = React.lazy(() => import('./pages/AdminValidation'));
const AdminChemicalFamilyLinking = React.lazy(() => import('./pages/AdminChemicalFamilyLinking'));
const ChemicalFamilyGraph = lazy(() => import("./pages/ChemicalFamilyGraph"));
const EditeurFormulation = React.lazy(() => import('./pages/outils/EditeurFormulation'));
const AdminOrphanMolecules = React.lazy(() => import('./pages/AdminOrphanMolecules'));
const AdminAIClassification = lazy(() => import("./pages/AdminAIClassification"));
const AIClassificationBatch = lazy(() => import("./pages/AIClassificationBatch"));
const NichePlantMoleculeLinking = React.lazy(() => import('./pages/NichePlantMoleculeLinking'));
const ClassificationReviewQueue = lazy(() => import("./pages/ClassificationReviewQueue"));
const AdminNotifications = React.lazy(() => import('./pages/AdminNotifications'));
const AdminCompletude = React.lazy(() => import('./pages/AdminCompletude'));
const ReseauLiaisons = React.lazy(() => import('./pages/ReseauLiaisons'));
const AdminProgressReport = React.lazy(() => import('./pages/AdminProgressReport'));
const AdminContributions = React.lazy(() => import('./pages/AdminContributions'));
const AdminGcmsImport = React.lazy(() => import('./pages/AdminGcmsImport'));
const DataQuality = React.lazy(() => import('./pages/admin/DataQuality'));
const MoleculeManager = React.lazy(() => import('./pages/admin/MoleculeManager'));
const AdminPlantMolecules = React.lazy(() => import('./pages/admin/AdminPlantMolecules'));
const AdminSynergies = React.lazy(() => import('./pages/admin/AdminSynergies'));
const CigarilloMoleculeLinking = React.lazy(() => import('./pages/admin/CigarilloMoleculeLinking'));
const PubChemBatch = React.lazy(() => import('./pages/admin/PubChemBatch'));
const AIBatchEnrich = React.lazy(() => import('./pages/admin/AIBatchEnrich'));
const AIBatchEnrichMolecules = React.lazy(() => import('./pages/admin/AIBatchEnrichMolecules'));
const ChEBIBatch = React.lazy(() => import('./pages/admin/ChEBIBatch'));
const PubChemIupacBatch = React.lazy(() => import('./pages/admin/PubChemIupacBatch'));
const GBIFBatch = React.lazy(() => import('./pages/admin/GBIFBatch'));
const WikimediaBatch = React.lazy(() => import('./pages/admin/WikimediaBatch'));
const SmilesBatch = React.lazy(() => import('./pages/admin/SmilesBatch'));
const LOTUSBatch = React.lazy(() => import('./pages/admin/LOTUSBatch'));
const BibliographicEnrichment = React.lazy(() => import('./pages/admin/BibliographicEnrichment'));
const WikidataBatch = React.lazy(() => import('./pages/admin/WikidataBatch'));
const SparqlExplorer = React.lazy(() => import('./pages/admin/SparqlExplorer'));
const EuropeanaExplorer = React.lazy(() => import('./pages/admin/EuropeanaExplorer'));
const EuropeanaMap = React.lazy(() => import('./pages/admin/EuropeanaMap'));
const ExtractionMethods = React.lazy(() => import('./pages/admin/ExtractionMethods'));
const EuropeanaQidBatch = React.lazy(() => import('./pages/admin/EuropeanaQidBatch'));
const WikidataSync = React.lazy(() => import('./pages/admin/WikidataSync'));
const VarietyImagesAdmin = React.lazy(() => import('./pages/admin/VarietyImagesAdmin'));
const VarietyGenealogyImport = React.lazy(() => import('./pages/admin/VarietyGenealogyImport'));
const COCONUTBatch = React.lazy(() => import('./pages/admin/COCONUTBatch'));

const AdminThermalMatrix = React.lazy(() => import('./pages/AdminThermalMatrix'));
const AdminNOSE = React.lazy(() => import('./pages/AdminNOSE'));
const AdminStorylines = React.lazy(() => import('./pages/AdminStorylines'));
const StorylineDetail = React.lazy(() => import('./pages/StorylineDetail'));
const StorylineIndex = React.lazy(() => import('./pages/StorylineIndex'));
const GalerieOlfactive = React.lazy(() => import('./pages/GalerieOlfactive'));
const AtlasOlfactif = React.lazy(() => import('./pages/AtlasOlfactif'));
const KNApSAcKBatch = React.lazy(() => import('./pages/admin/KNApSAcKBatch'));
const AdminBundleVisualizer = React.lazy(() => import('./pages/AdminBundleVisualizer'));
const AdminReclassifyMolecules = React.lazy(() => import('./pages/AdminReclassifyMolecules'));

// === PROTOTYPES ===
const Prototypes = React.lazy(() => import('./pages/Prototypes'));
const PrototypeDetail = React.lazy(() => import('./pages/PrototypeDetail'));
const C1Fermentum = React.lazy(() => import('./pages/prototypes/C1'));
const C2ClarusVerde = React.lazy(() => import('./pages/prototypes/C2'));
const C3LactaSolis = React.lazy(() => import('./pages/prototypes/C3'));
const C4TerraAmbra = React.lazy(() => import('./pages/prototypes/C4'));

// === GAMMES ===
const Gammes = React.lazy(() => import('./pages/Gammes'));
const GammesHub = React.lazy(() => import('./pages/GammesHub'));
const GammeSignatures = React.lazy(() => import('./pages/GammeSignatures'));
const GammePheromones = React.lazy(() => import('./pages/GammePheromones'));
const GammeRaretes = React.lazy(() => import('./pages/GammeRaretes'));
const ColombieLine = React.lazy(() => import('@/pages/ColombieLine'));
const CorpusBurkinaFaso = React.lazy(() => import('@/pages/CorpusBurkinaFaso'));
const RecetteColombie = React.lazy(() => import('@/pages/RecetteColombie'));
const SourcingColombie = React.lazy(() => import('@/pages/SourcingColombie'));
const Sourcing = React.lazy(() => import('@/pages/Sourcing'));
const SourcingFrance = React.lazy(() => import('@/pages/SourcingFrance'));
const SourcingInde = React.lazy(() => import('@/pages/SourcingInde'));
const SourcingMadagascar = React.lazy(() => import('@/pages/SourcingMadagascar'));
const SourcingNorthAmerica = React.lazy(() => import('@/pages/SourcingNorthAmerica'));
const SourcingTabac = React.lazy(() => import('@/pages/SourcingTabac'));
const SourcingCannabis = React.lazy(() => import('@/pages/SourcingCannabis'));
const SourcingHub = React.lazy(() => import('@/pages/SourcingHub'));

// === LABORATOIRE ===
const Laboratoire = React.lazy(() => import('./pages/Laboratoire'));
const LaboratoireRecettes = React.lazy(() => import('./pages/LaboratoireRecettes'));
const MatriceInteractive = React.lazy(() => import('@/pages/MatriceInteractive'));
const Statistiques = React.lazy(() => import('@/pages/Statistiques'));
const Inventaire = React.lazy(() => import('./pages/Inventaire'));

// === MOLÉCULES (Lazy loaded for performance) ===
const Molecules = React.lazy(() => import('./pages/Molecules'));
const MoleculeSearch = React.lazy(() => import('./pages/MoleculeSearch'));
const MoleculeDetail = lazy(() => import("./pages/MoleculeDetail"));
const TerpeneDetail = React.lazy(() => import('./pages/TerpeneDetail'));
const Familles = React.lazy(() => import('./pages/Familles'));
const FamillesList = React.lazy(() => import('./pages/FamillesList'));
const ChemicalFamilies = React.lazy(() => import('./pages/ChemicalFamilies').then(m => ({ default: m.ChemicalFamilies })));
const MoleculesHub = React.lazy(() => import('./pages/MoleculesHub'));


// === RECETTES (Lazy loaded for performance) ===
const Recettes = React.lazy(() => import('./pages/Recettes'));
const RecetteDetail = lazy(() => import("./pages/RecetteDetail"));
const Accords = React.lazy(() => import('./pages/Accords'));
const RecettesHub = React.lazy(() => import('./pages/RecettesHub'));

const AccordsDedies = React.lazy(() => import('./pages/AccordsDedies'));
const ExperimentalAccords = React.lazy(() => import('./pages/ExperimentalAccords').then(m => ({ default: m.ExperimentalAccords })));
const RechercheRadicale = React.lazy(() => import('@/pages/RechercheRadicale'));
const RecettesTL = React.lazy(() => import('./pages/RecettesTL'));
const FondementsPhilosophiques = React.lazy(() => import('@/pages/FondementsPhilosophiques'));

// === RÉSINES CBD ===
const ResinesCBD = React.lazy(() => import('@/pages/ResinesCBD'));
const RecetteCBDDetail = React.lazy(() => import('@/pages/RecetteCBDDetail'));
const ProtocolesMaturation = React.lazy(() => import('./pages/ProtocolesMaturation'));

// === COMPARAISON & VISUALISATION ===
const Compare = React.lazy(() => import('./pages/Compare'));
const CompareTerpenes = React.lazy(() => import('./pages/CompareTerpenes'));
const CompareRadar = React.lazy(() => import('./pages/CompareRadar'));
const CompareRecettes = React.lazy(() => import('./pages/CompareRecettes'));
const CompareMoleculesAdvanced = React.lazy(() => import('./pages/CompareMoleculesAdvanced'));
const ComparaisonMolecules = React.lazy(() => import('@/pages/ComparaisonMolecules'));
const ComparePlants = React.lazy(() => import('./pages/ComparePlants'));
const ComparateurAvance = React.lazy(() => import('@/pages/ComparateurAvance'));
const MatriceSynergies = React.lazy(() => import('./pages/MatriceSynergies'));
const GrapheMoleculesRecettes = lazy(() => import("@/pages/GrapheMoleculesRecettes"));
const GraphePlanteMolecule = lazy(() => import("@/pages/GraphePlanteMolecule"));
const SynergiesPage = React.lazy(() => import('./pages/SynergiesPage'));
const SuggestionsSynergies = React.lazy(() => import('./pages/SuggestionsSynergies'));
const SynergiesHeatmap = lazy(() => import("./pages/SynergiesHeatmap").then(m => ({ default: m.SynergiesHeatmap })));
const RecipeNetworkPage = lazy(() => import("./pages/RecipeNetworkPage").then(m => ({ default: m.RecipeNetworkPage })));
const SankeyFlow = lazy(() => import("./pages/SankeyFlow"));
const EnhancedRadarDemo = lazy(() => import("./pages/EnhancedRadarDemo"));
const CrossSearch = React.lazy(() => import('./pages/CrossSearch'));
const RechercheAvancee = lazy(() => import("./pages/RechercheAvancee"));
const RechercheProfilMoleculaire = React.lazy(() => import('./pages/RechercheProfilMoleculaire'));
const RecipeTimeline = React.lazy(() => import('./pages/RecipeTimeline'));
const RadarCorrelationHeatmap = lazy(() => import("./pages/RadarCorrelationHeatmap"));

// === OUTILS ===
const CorrelationAnalysis = React.lazy(() => import('./pages/CorrelationAnalysis'));
const AbsorbeScale = React.lazy(() => import('@/pages/AbsorbeScale').then(m => ({ default: m.AbsorbeScale })));
const EnrichissementPubChem = React.lazy(() => import('./pages/EnrichissementPubChem'));
const CarteOrigines = React.lazy(() => import('./pages/CarteOrigines'));
const CarteTerroirsRecherche = React.lazy(() => import('./pages/CarteTerroirsRecherche'));
const CartePlantesGPS = React.lazy(() => import('./pages/CartePlantesGPS'));
const VisualisationsCorrelation = React.lazy(() => import('./pages/VisualisationsCorrelation'));
const ExportBibliographique = React.lazy(() => import('./pages/ExportBibliographique'));

// === RECHERCHE SCIENTIFIQUE ===
const RechercheScientifique = React.lazy(() => import('./pages/RechercheScientifique').then(m => ({ default: m.RechercheScientifique })));
const SynergiesMoleculaires = React.lazy(() => import('./pages/SynergiesMoleculaires'));
const PyrolyseCombustion = React.lazy(() => import('./pages/PyrolyseCombustion').then(m => ({ default: m.PyrolyseCombustion })));
const CourbesVolatilite = React.lazy(() => import('@/pages/CourbesVolatilite').then(m => ({ default: m.CourbesVolatilite })));
const DegradationTerpenes = React.lazy(() => import('@/pages/DegradationTerpenes').then(m => ({ default: m.DegradationTerpenes })));
const ModelesAnalytiquesGCMS = React.lazy(() => import('@/pages/ModelesAnalytiquesGCMS').then(m => ({ default: m.ModelesAnalytiquesGCMS })));
const SynergiesTerpenesNiches = React.lazy(() => import('./pages/SynergiesTerpenesNiches'));
const SynergiesGraphVisualization = lazy(() => import("./pages/SynergiesGraphVisualization"));
const ChimieTabac = React.lazy(() => import('./pages/ChimieTabac'));
const InteractionsTabacCannabis = React.lazy(() => import('./pages/InteractionsTabacCannabis'));
const ComparaisonTerpenes = React.lazy(() => import('./pages/ComparaisonTerpenes'));
const OutilFormulation = React.lazy(() => import('./pages/OutilFormulation'));
const ResearchData = React.lazy(() => import('./pages/ResearchData'));

// === PROGRAMMES DE RECHERCHE ===
const ProgrammesRecherche = React.lazy(() => import('@/pages/ProgrammesRecherche'));
const TabacsNiche = React.lazy(() => import('@/pages/TabacsNiche'));

// === JOURNAL & MÉTHODOLOGIE ===
const Journal = React.lazy(() => import('./pages/Journal'));

// === MÉTHODOLOGIE ===
const MethodeAbsorbe = React.lazy(() => import('./pages/MethodeAbsorbe'));
const MethodologieAbsorbe = React.lazy(() => import('@/pages/methodologie/MethodologieAbsorbe'));
const MethodologieRecherche = React.lazy(() => import('@/pages/MethodologieRecherche').then(m => ({ default: m.MethodologieRecherche })));
const GenerateurFormules = React.lazy(() => import('./pages/GenerateurFormules'));
const HistoriqueFormules = React.lazy(() => import('./pages/HistoriqueFormules'));
const EchelleAbsorbe = React.lazy(() => import('./pages/methodologie/EchelleAbsorbe'));
const Pyrolyse = React.lazy(() => import('./pages/methodologie/Pyrolyse'));
const GCMS = React.lazy(() => import('./pages/methodologie/GCMS'));

// === CONTENU ÉDITORIAL ===
const Etudes = React.lazy(() => import('./pages/Etudes'));
const EtudesClimatiques = React.lazy(() => import('./pages/EtudesClimatiques'));
const EtudeClimatiqueDetail = React.lazy(() => import('./pages/EtudeClimatiqueDetail'));
const ArchivesTerrain = React.lazy(() => import('./pages/ArchivesTerrain'));
const ArchiveTerrainDetail = React.lazy(() => import('./pages/ArchiveTerrainDetail'));
const ProtocolesMoleculaires = React.lazy(() => import('./pages/ProtocolesMoleculaires'));
const ProtocoleMoleculaireDetail = React.lazy(() => import('./pages/ProtocoleMoleculaireDetail'));
const TestsExtraction = React.lazy(() => import('./pages/TestsExtraction'));
const TestExtractionDetail = React.lazy(() => import('./pages/TestExtractionDetail'));
const OdeursSituees = React.lazy(() => import('./pages/OdeursSituees'));
const OdeurSitueeDetail = React.lazy(() => import('./pages/OdeurSitueeDetail'));
const Projets = React.lazy(() => import('./pages/Projets'));
const Terrains = React.lazy(() => import('./pages/Terrains'));
const BibliographiePage = React.lazy(() => import('./pages/BibliographiePage'));
// Lazy-loaded: BibliographieGlobale (1129 lignes)
const BibliographieGlobale = lazy(() => import("./pages/BibliographieGlobale"));
const ReferencesV3 = React.lazy(() => import('./pages/ReferencesV3'));
const ReferenceEntityLinkManager = React.lazy(() => import('./pages/ReferenceEntityLinkManager'));
const BulkImportReferences = React.lazy(() => import('./pages/BulkImportReferences'));
const ReferenceLinkNetwork = lazy(() => import("./pages/ReferenceLinkNetwork"));
const SuggestReferenceLinks = React.lazy(() => import('./pages/SuggestReferenceLinks'));
const Visualisations = React.lazy(() => import('./pages/Visualisations'));
const Bibliographie = React.lazy(() => import('./pages/Bibliographie'));
const HeritageConservation = React.lazy(() => import('./pages/HeritageConservation'));
const H2LinkingInterface = React.lazy(() => import('./pages/H2LinkingInterface'));
const H3LinkingInterface = React.lazy(() => import('./pages/H3LinkingInterface'));
const GenomicsExplorer = React.lazy(() => import('./pages/GenomicsExplorer'));
const AxesRecherche = React.lazy(() => import('./pages/AxesRecherche'));
// Lazy-loaded: AxeRechercheDetail (1117 lignes)
const AxeRechercheDetail = lazy(() => import("./pages/AxeRechercheDetail"));
const ReseauAxes = lazy(() => import("./pages/ReseauAxes"));
const RelationsGraph = lazy(() => import("./pages/RelationsGraph"));
const GestionPage = React.lazy(() => import('./pages/GestionPage'));
const LeafEconomies = React.lazy(() => import('./pages/LeafEconomies'));
const LeafEconomyDetail = React.lazy(() => import('./pages/LeafEconomyDetail'));
const LeafEconomyForm = React.lazy(() => import('./pages/LeafEconomyForm'));
const TimelineBotanique = React.lazy(() => import('./pages/TimelineBotanique'));
const BotaniqueCritique = React.lazy(() => import('./pages/BotaniqueCritique'));
const VarietesFantomes = React.lazy(() => import('./pages/VarietesFantomes'));
const GhostVarietiesExplorer = React.lazy(() => import('./pages/GhostVarietiesExplorer'));
const GhostVarietyForm = React.lazy(() => import('./pages/GhostVarietyForm'));
// Lazy-loaded: GhostVarietyDetail (1197 lignes)
const GhostVarietyDetail = lazy(() => import("./pages/GhostVarietyDetail"));
const GhostVarietyImageUpload = React.lazy(() => import('./pages/GhostVarietyImageUpload'));
const RecettesLeafEconomies = React.lazy(() => import('./pages/RecettesLeafEconomies'));
const TerpProfiles = React.lazy(() => import('./pages/TerpProfiles'));
const TerpProfilesCompare = React.lazy(() => import('./pages/TerpProfilesCompare'));
const Plants = React.lazy(() => import('./pages/Plants'));
const PlantVarieties = React.lazy(() => import('./pages/PlantVarieties'));
const PhylogeneticView = React.lazy(() => import('./pages/PhylogeneticView'));
const FamilyDetail = React.lazy(() => import('./pages/FamilyDetail'));
const SmilesViewer = React.lazy(() => import('./pages/SmilesViewer'));
const EnrichmentDashboard = React.lazy(() => import('./pages/EnrichmentDashboard'));
const IFRACompliance = React.lazy(() => import('./pages/IFRACompliance'));
const PerceptSearch = React.lazy(() => import('./pages/PerceptSearch'));
const OlfactiveStats = React.lazy(() => import('./pages/OlfactiveStats'));
const PlantsHub = React.lazy(() => import('./pages/PlantsHub'));
const Chemotypes = React.lazy(() => import('./pages/Chemotypes'));
const FinalRecipes = React.lazy(() => import('./pages/FinalRecipes'));
const FinalRecipeDetail = React.lazy(() => import('./pages/FinalRecipeDetail'));
// Lazy-loaded: PlantDetail (1057 lignes)
const PlantDetail = lazy(() => import("./pages/PlantDetail"));
const PlantsByMolecule = lazy(() => import("./pages/PlantsByMolecule"));
const PlantForm = React.lazy(() => import('./pages/PlantForm'));
const VarietyForm = React.lazy(() => import('./pages/VarietyForm'));
const VarietyDetail = React.lazy(() => import('./pages/VarietyDetail'));
const GenealogyGraph = lazy(() => import("./pages/GenealogyGraph"));
const CarteVarietes = React.lazy(() => import('./pages/CarteVarietes'));
const Terroirs = React.lazy(() => import('./pages/Terroirs'));
const TerroirDetail = React.lazy(() => import('./pages/TerroirDetail'));
const ChemotypesExplorer = React.lazy(() => import('./pages/ChemotypesExplorer'));
const AnalyticalMethodsPage = React.lazy(() => import('./pages/AnalyticalMethodsPage'));
const OriginesGeographiques = React.lazy(() => import('./pages/OriginesGeographiques'));
const ComparaisonExtractions = React.lazy(() => import('./pages/ComparaisonExtractions'));
const Collaborations = React.lazy(() => import('./pages/Collaborations'));
const Archives = React.lazy(() => import('./pages/Archives'));
const Outils = React.lazy(() => import('./pages/Outils'));
const OutilsHub = React.lazy(() => import('./pages/OutilsHub'));
const PatrimoineMenace = React.lazy(() => import('./pages/PatrimoineMenace'));
const ExplorerParOdeur = React.lazy(() => import('./pages/ExplorerParOdeur'));
const AlternativesDurables = React.lazy(() => import('./pages/AlternativesDurables'));
const ArchivesOlfactives = React.lazy(() => import('./pages/ArchivesOlfactives'));
const Glossaire = React.lazy(() => import('./pages/Glossaire').then(m => ({ default: m.Glossaire })));
const GlossaireVisuelRadar = React.lazy(() => import('./pages/GlossaireVisuelRadar'));
const Contribuer = React.lazy(() => import('./pages/Contribuer'));
const ContributorInterface = React.lazy(() => import('./pages/ContributorInterface'));
const SimplifiedContributorForm = React.lazy(() => import('./pages/SimplifiedContributorForm'));
const CoverageGoalDashboard = React.lazy(() => import('./pages/CoverageGoalDashboard'));
// Lazy-loaded: CSVValidationImport (1067 lignes)
const CSVValidationImport = lazy(() => import("./pages/CSVValidationImport"));
const PlantMoleculeLinking = React.lazy(() => import('./pages/PlantMoleculeLinking'));
const Manifeste = React.lazy(() => import('./pages/Manifeste'));
const Timeline = React.lazy(() => import('./pages/Timeline').then(m => ({ default: m.Timeline })));
const TimelineInteractive = React.lazy(() => import('./pages/TimelineInteractive'));
const FormulesReference = React.lazy(() => import('./pages/FormulesReference'));
const ComparaisonAvancee = React.lazy(() => import('./pages/ComparaisonAvancee'));
const TimelinePerfumum = React.lazy(() => import('./pages/TimelinePerfumum'));
// import GalerieBotaniques from "./pages/GalerieBotaniques"; // Maintenant intégré dans Plants.tsx
const Gallery = React.lazy(() => import('./pages/Gallery'));
const BatchImport = React.lazy(() => import('./pages/BatchImport'));
const Ifra = React.lazy(() => import('./pages/Ifra'));

// === CIVILISATIONS & TRADITIONS ===
const Civilisations = React.lazy(() => import('./pages/Civilisations'));
const CivilisationDetail = React.lazy(() => import('./pages/CivilisationDetail'));
const Installations = React.lazy(() => import('./pages/Installations'));

// === TABACS & ASSOCIATIONS ===
const TabacsResines = React.lazy(() => import('./pages/TabacsResines'));
const TabacsNaturels = React.lazy(() => import('./pages/TabacsNaturels'));
const TabacsOriginaux = React.lazy(() => import('./pages/TabacsOriginaux'));
const TabacDetail = React.lazy(() => import('./pages/TabacDetail'));
const Associations = React.lazy(() => import('./pages/Associations'));
const Fournisseurs = React.lazy(() => import('./pages/Fournisseurs'));

// === DASHBOARDS ===
const DashboardMinimal = React.lazy(() => import('./pages/DashboardMinimal').then(m => ({ default: m.DashboardMinimal })));
const DashboardRecherche = React.lazy(() => import('./pages/DashboardRecherche'));
const AnalyticsDashboard = React.lazy(() => import('./pages/AnalyticsDashboard'));
const AnalyticsDashboardAdvanced = React.lazy(() => import('./pages/AnalyticsDashboardAdvanced'));
const MonDashboard = React.lazy(() => import('./pages/MonDashboard'));
const Statistics = React.lazy(() => import('./pages/Statistics'));
const Recherche = React.lazy(() => import('./pages/Recherche'));
const RechercheGlobale = React.lazy(() => import('./pages/RechercheGlobale'));

// === UTILISATEUR ===
const Favoris = React.lazy(() => import('./pages/Favoris'));
const MyFavorites = React.lazy(() => import('./pages/MyFavorites').then(m => ({ default: m.MyFavorites })));
const Reseau = React.lazy(() => import('./pages/Reseau'));
const ReseauMoleculePlante = React.lazy(() => import('./pages/ReseauMoleculePlante'));
const PlantMoleculeNetwork = React.lazy(() => import('./pages/PlantMoleculeNetwork'));
const BioMineralis = React.lazy(() => import('./pages/BioMineralis'));

// === MATIÈRES PREMIÈRES & RELATIONS ===
const MatieresPremieres = React.lazy(() => import('./pages/MatieresPremieres'));
const MatierePremierePage = React.lazy(() => import('./pages/MatierePremierePage'));
const RawMaterials = React.lazy(() => import('./pages/RawMaterials'));
const RawMaterialDetail = React.lazy(() => import('./pages/RawMaterialDetail'));
const RawMaterialForm = React.lazy(() => import('./pages/RawMaterialForm'));
const MoleculePlantRelations = React.lazy(() => import('./pages/MoleculePlantRelations'));
const PlantTerroirNetwork = React.lazy(() => import('./pages/PlantTerroirNetwork'));
const CarteTerroirsPlantes = React.lazy(() => import('./pages/CarteTerroirsPlantes'));
const GrapheTerroirPlanteMolecule = React.lazy(() => import('./pages/GrapheTerroirPlanteMolecule'));
const GrapheMoleculesFamillesChimiques = React.lazy(() => import('./pages/GrapheMoleculesFamillesChimiques'));
const VueDetailConnexions = React.lazy(() => import('./pages/VueDetailConnexions'));
const GrapheAxesThematiques = React.lazy(() => import('./pages/GrapheAxesThematiques'));
const GrapheReferencesAxes = React.lazy(() => import('./pages/GrapheReferencesAxes'));
const ReferencesGraph = React.lazy(() => import('./pages/ReferencesGraph'));
const CarteInteractiveTerroirs = React.lazy(() => import('./pages/CarteInteractiveTerroirs'));
const TerroirMapPage = React.lazy(() => import('./pages/TerroirMapPage'));
// Lazy-loaded: ParcoursOlfactif (1294 lignes)
const ParcoursOlfactif = lazy(() => import("./pages/ParcoursOlfactif"));
const ParcoursDetail = React.lazy(() => import('./pages/ParcoursDetail'));
const PeriqueCompounds = React.lazy(() => import('./pages/PeriqueCompounds'));
const HistoricCigarettes = React.lazy(() => import('./pages/HistoricCigarettes'));
const TpsGenesExplorer = React.lazy(() => import('./pages/TpsGenesExplorer'));
const MolecularTransformations = React.lazy(() => import('./pages/MolecularTransformations'));
const TobaccoLandraces = React.lazy(() => import('./pages/TobaccoLandraces'));
const TobaccoLandraceDetail = React.lazy(() => import('./pages/TobaccoLandraceDetail'));
const SoilAnalysis = React.lazy(() => import('./pages/SoilAnalysis'));
const BiosyntheticPathways = React.lazy(() => import('./pages/BiosyntheticPathways'));
const PyrolysisVisualization = React.lazy(() => import('./pages/PyrolysisVisualization'));
const TerpeneProfiles = React.lazy(() => import('./pages/TerpeneProfiles'));
const PeriqueFermentation = React.lazy(() => import('./pages/PeriqueFermentation'));
const LandraceComparator = React.lazy(() => import('./pages/LandraceComparator'));
const GCMSChromatograms = React.lazy(() => import('./pages/GCMSChromatograms'));
const CompoundSearch = React.lazy(() => import('./pages/CompoundSearch'));
const MSSpectraViewer = React.lazy(() => import('./pages/MSSpectraViewer'));
const SpectraComparison = React.lazy(() => import('./pages/SpectraComparison'));
const SpectraIdentification = React.lazy(() => import('./pages/SpectraIdentification'));
const AnalysisHub = React.lazy(() => import('./pages/AnalysisHub'));
const RawMaterialsInventory = React.lazy(() => import('./pages/RawMaterialsInventory'));
const InventoryDashboard = React.lazy(() => import('./pages/InventoryDashboard'));
const PublicationMoleculeGraph = React.lazy(() => import('./pages/PublicationMoleculeGraph'));
const CorrelationsParfumTabacCannabis = React.lazy(() => import('./pages/CorrelationsParfumTabacCannabis'));
const ParfumsEmblematiques = React.lazy(() => import('./pages/ParfumsEmblematiques'));
const MuscsComparatif = React.lazy(() => import('./pages/MuscsComparatif'));

// === NOUVELLES SECTIONS : RECETTES, PROTOCOLES, LANDRACES ===
const CigarilloRecipes = lazy(() => import("./pages/CigarilloRecipes"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const TechnicalProtocols = lazy(() => import("./pages/TechnicalProtocols"));
const ProtocolDetail = lazy(() => import("./pages/ProtocolDetail"));
const CannabisLandraces = lazy(() => import("./pages/CannabisLandraces"));
const LandraceDetail = lazy(() => import("./pages/LandraceDetail"));
const OsmothequeMolecules = lazy(() => import("./pages/OsmothequeMolecules"));
const NicotianaPhylogeny = React.lazy(() => import('./components/NicotianaPhylogeny').then(m => ({ default: m.NicotianaPhylogeny })));
const NicotianaSpeciesDetail = React.lazy(() => import('./pages/NicotianaSpeciesDetail'));
const NicotianaExplorer = React.lazy(() => import('./pages/NicotianaExplorer'));
const VarietyGenealogyPage = React.lazy(() => import('./pages/VarietyGenealogyPage').then(m => ({ default: m.VarietyGenealogyPage })));
const GBIFEnrichment = React.lazy(() => import('./pages/admin/GBIFEnrichment'));
const TropicosEnrichment = React.lazy(() => import('./pages/admin/TropicosEnrichment'));
const LOTUSEnrichment = React.lazy(() => import('./pages/admin/LOTUSEnrichment'));
const LotusPlantLinker = React.lazy(() => import('./pages/admin/LotusPlantLinker'));
const LotusBatchGenus = React.lazy(() => import('./pages/admin/LotusBatchGenus'));
const COCONUTEnrichment = React.lazy(() => import('./pages/admin/COCONUTEnrichment'));
const IUCNEnrichment = React.lazy(() => import('./pages/admin/IUCNEnrichment'));
const PhyloEnrichment = React.lazy(() => import('./pages/admin/PhyloEnrichment'));
const ApiCoverage = React.lazy(() => import('./pages/admin/ApiCoverage'));
const ResinMaturation = React.lazy(() => import('./pages/ResinMaturation'));
const ExtractionProcesses = React.lazy(() => import('./pages/ExtractionProcesses'));




// Wrapper for lazy-loaded components
// LazyRoute avec WithLayout (Header + Footer) — pour les pages publiques
const LazyRoute: React.FC<{ path: string; component: React.LazyExoticComponent<React.ComponentType<unknown>> }> = ({ path, component: Component }) => (
  <Route path={path}>
    {() => (
      <WithLayout>
        <Suspense fallback={<PageLoader />}>
          <Component />
        </Suspense>
      </WithLayout>
    )}
  </Route>
);

// LazyRouteRaw sans WithLayout — pour les pages admin/dashboard qui gèrent leur propre layout
const LazyRouteRaw: React.FC<{ path: string; component: React.LazyExoticComponent<React.ComponentType<unknown>> }> = ({ path, component: Component }) => (
  <Route path={path}>
    {() => (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    )}
  </Route>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Switch>
      
      {/* === PAGES PRINCIPALES === */}
      <Route path="/" component={Home} />
      <Route path="/systeme">{() => <WithLayout><SystemePerfumum /></WithLayout>}</Route>
      <Route path="/nicotiana-explorer">{() => <WithLayout><Suspense fallback={<PageLoader />}><NicotianaExplorer /></Suspense></WithLayout>}</Route>
      <Route path="/variety-genealogy/:genus">{() => <WithLayout><Suspense fallback={<PageLoader />}><VarietyGenealogyPage /></Suspense></WithLayout>}</Route>
      <Route path="/nicotiana-phylogeny">{() => <WithLayout><Suspense fallback={<PageLoader />}><NicotianaPhylogeny /></Suspense></WithLayout>}</Route>
      <Route path="/nicotiana-species/:speciesId">{() => <WithLayout><Suspense fallback={<PageLoader />}><NicotianaSpeciesDetail /></Suspense></WithLayout>}</Route>
      {/* === ADMINISTRATION === */}
      <Route path="/admin" component={Admin} />
      <Route path="/admin/liaison-recettes-molecules" component={LiaisonRecettesMolecules} />
      <Route path="/molecule-recette-linking" component={MoleculeRecetteLinking} />
      <Route path="/molecule-recette-audit" component={MoleculeRecetteAudit} />
      <LazyRoute path="/molecule-recette-dragdrop" component={MoleculeRecetteDragDrop} />
      <Route path="/molecule-recette-import-csv" component={MoleculeRecetteImportCSV} />
      <Route path="/plant-terroir-linking" component={PlantTerroirLinking} />
      <Route path="/plant-terroir-audit" component={PlantTerroirAudit} />
      <LazyRoute path="/plant-terroir-dragdrop" component={PlantTerroirDragDrop} />
      <Route path="/plant-terroir-import-csv" component={PlantTerroirImportCSV} />
      <Route path="/plant-molecule-audit" component={PlantMoleculeAudit} />
      <Route path="/linking-dashboard" component={LinkingDashboard} />
      <Route path="/admin/validation" component={AdminValidation} />
      <Route path="/admin/orphan-molecules" component={AdminOrphanMolecules} />
      <Route path="/admin/ai-classification" component={AdminAIClassification} />
      <Route path="/admin/ai-classification-batch" component={AIClassificationBatch} />
      <Route path="/admin/ai-batch-enrich" component={AIBatchEnrich} />
      <Route path="/admin/ai-batch-enrich-molecules" component={AIBatchEnrichMolecules} />
          <Route path="/admin/pubchem-iupac-batch" component={PubChemIupacBatch} />
      <Route path="/admin/niche-plant-linking" component={NichePlantMoleculeLinking} />
      <Route path="/admin/classification-review" component={ClassificationReviewQueue} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      <Route path="/admin/completude" component={AdminCompletude} />
      <LazyRoute path="/reseau-liaisons" component={ReseauLiaisons} />
      <Route path="/admin/progress-report" component={AdminProgressReport} />
      <Route path="/admin/molecule-origins" component={MoleculeOriginsAdmin} />
      <Route path="/admin/terroirs-geocode" component={TerroirsGeocode} />
      <LazyRoute path="/outils/editeur-formulation" component={EditeurFormulation} />

      <Route path="/admin/molecules" component={AdminMoleculesIndex} />
      <Route path="/admin/molecules/new" component={AdminMoleculeNew} />
      <Route path="/admin/accords" component={AdminAccords} />
      <Route path="/admin/familles" component={AdminFamilles} />
      <Route path="/admin/chemical-family-linking" component={AdminChemicalFamilyLinking} />
      <Route path="/graphe-familles-chimiques" component={ChemicalFamilyGraph} />
      <Route path="/admin/matieres" component={AdminMatieres} />
      <Route path="/admin/recettes" component={AdminRecettes} />
      <Route path="/admin/import-export" component={AdminImportExport} />
      <Route path="/admin/import-export-plants" component={ImportExportPlants} />
      <Route path="/admin/import-csv" component={ImportCSV} />
      <Route path="/admin/import-csv-preview" component={ImportCSVPreview} />
      <Route path="/admin/historique" component={AdminHistorique} />
      <Route path="/admin/references" component={AdminReferences} />
      <Route path="/admin/data-quality" component={DataQuality} />
      <Route path="/admin/contributions" component={AdminContributions} />
      <Route path="/admin/gcms-import" component={AdminGcmsImport} />
      <Route path="/admin/molecule-manager" component={MoleculeManager} />
      <Route path="/admin/plant-molecules" component={AdminPlantMolecules} />
      <Route path="/admin/synergies" component={AdminSynergies} />
      <Route path="/admin/liaison-cigarillos-molecules" component={CigarilloMoleculeLinking} />
      <Route path="/admin/pubchem-batch" component={PubChemBatch} />
      <Route path="/admin/chebi-batch" component={ChEBIBatch} />
      <Route path="/admin/gbif-batch" component={GBIFBatch} />
      <Route path="/admin/wikimedia-batch" component={WikimediaBatch} />
      <Route path="/admin/smiles-batch" component={SmilesBatch} />
      <Route path="/admin/lotus-batch" component={LOTUSBatch} />
      <Route path="/admin/bibliographic-enrichment" component={BibliographicEnrichment} />
      <Route path="/admin/extraction-methods" component={ExtractionMethods} />
      <Route path="/admin/wikidata-batch" component={WikidataBatch} />
      <Route path="/admin/sparql-explorer" component={SparqlExplorer} />
      <Route path="/admin/europeana" component={EuropeanaExplorer} />
      <Route path="/europeana-map" component={EuropeanaMap} />
      <Route path="/admin/europeana-map" component={EuropeanaMap} />
      <Route path="/admin/europeana-qid-batch" component={EuropeanaQidBatch} />
      <Route path="/admin/coconut-batch" component={COCONUTBatch} />
      <Route path="/admin/knapsack-batch" component={KNApSAcKBatch} />
      <Route path="/admin/bundle-visualizer" component={AdminBundleVisualizer} />
      <Route path="/admin/reclassify-molecules" component={AdminReclassifyMolecules} />

      <Route path="/admin/thermal-matrix" component={AdminThermalMatrix} />
      <Route path="/admin/nose" component={AdminNOSE} />
      <Route path="/admin/storylines" component={AdminStorylines} />
      <Route path="/admin/wikidata-sync" component={WikidataSync} />
      <Route path="/admin/variety-images" component={VarietyImagesAdmin} />
      <Route path="/admin/variety-genealogy-import" component={VarietyGenealogyImport} />
      <Route path="/storylines"><WithLayout><Suspense fallback={<PageLoader />}><StorylineIndex /></Suspense></WithLayout></Route>
      <Route path="/storyline/:slug">{(params) => <WithLayout><Suspense fallback={<PageLoader />}><StorylineDetail /></Suspense></WithLayout>}</Route>
      <Route path="/galerie-olfactive"><WithLayout><Suspense fallback={<PageLoader />}><GalerieOlfactive /></Suspense></WithLayout></Route>
      <Route path="/atlas"><WithLayout><Suspense fallback={<PageLoader />}><AtlasOlfactif /></Suspense></WithLayout></Route>
      
      {/* === RECHERCHE === */}
      <LazyRoute path="/recherche-avancee" component={RechercheAvancee} />
      <LazyRoute path="/recherche-globale" component={RechercheGlobale} />
      
      {/* === PROJET === */}
      <LazyRoute path="/le-projet" component={LeProjet} />
      <Route path="/manifeste">{() => <WithLayout><Manifeste /></WithLayout>}</Route>
      <LazyRoute path="/a-propos" component={APropos} />
      <LazyRoute path="/contact" component={Contact} />
      <LazyRoute path="/nouveautes" component={Nouveautes} />
      <LazyRoute path="/projet/timeline" component={TimelinePerfumum} />
      
      {/* === ABSORBE X - RECHERCHE AVANCÉE === */}
      <Route path="/absorbe-x">{() => <WithLayout><AbsorbeXDashboard /></WithLayout>}</Route>
      <Route path="/absorbe-x/manifeste">{() => <WithLayout><AbsorbeXManifeste /></WithLayout>}</Route>
      <Route path="/absorbe-x/notes-recherche">{() => <WithLayout><AbsorbeXNotesRecherche /></WithLayout>}</Route>
      <Route path="/absorbe-x/quantique">{() => <WithLayout><AbsorbeXQuantique /></WithLayout>}</Route>
      <Route path="/absorbe-x/patrimoine">{() => <WithLayout><AbsorbeXPatrimoine /></WithLayout>}</Route>
      <Route path="/absorbe-x/neuro-olfaction">{() => <WithLayout><AbsorbeXNeuroOlfaction /></WithLayout>}</Route>
      <Route path="/absorbe-x/odeurs-perdues">{() => <WithLayout><AbsorbeXOdeursPerdues /></WithLayout>}</Route>
      <LazyRoute path="/molecules-disparues" component={MoleculesDisparues} />
      <Route path="/absorbe-x/guide-laboratoire">{() => <WithLayout><AbsorbeXGuideLaboratoire /></WithLayout>}</Route>
      
      {/* === TABACOTHÈQUE === */}
      <LazyRoute path="/tabacotheque" component={Tabacotheque} />
      <LazyRoute path="/perique-compounds" component={PeriqueCompounds} />
      <LazyRoute path="/historic-cigarettes" component={HistoricCigarettes} />
      <LazyRoute path="/tobacco-landraces" component={TobaccoLandraces} />
      <LazyRoute path="/tobacco-landrace/:name" component={TobaccoLandraceDetail} />
      <Route path="/tabac/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <WithLayout><TabacDetail /></WithLayout>
          </Suspense>
        )}
      </Route>
      <LazyRoute path="/soil-analysis" component={SoilAnalysis} />
      <LazyRoute path="/analyses-pedologiques" component={SoilAnalysis} />
      <LazyRoute path="/biosynthetic-pathways" component={BiosyntheticPathways} />
      <LazyRoute path="/voies-biosynthetiques" component={BiosyntheticPathways} />
      <LazyRoute path="/tps-pathways" component={BiosyntheticPathways} />
      <LazyRoute path="/pyrolysis" component={PyrolysisVisualization} />
      <LazyRoute path="/pyrolyse" component={PyrolysisVisualization} />
      <LazyRoute path="/transformations-pyrolytiques" component={PyrolysisVisualization} />
      <LazyRoute path="/terpene-profiles" component={TerpeneProfiles} />
      <LazyRoute path="/profils-terpeniques" component={TerpeneProfiles} />
      <LazyRoute path="/terpenes" component={TerpeneProfiles} />
      <LazyRoute path="/perique-fermentation" component={PeriqueFermentation} />
      <LazyRoute path="/fermentation-perique" component={PeriqueFermentation} />
      <LazyRoute path="/perique" component={PeriqueFermentation} />
      <LazyRoute path="/landrace-comparator" component={LandraceComparator} />
      <LazyRoute path="/comparateur-landraces" component={LandraceComparator} />
      <LazyRoute path="/compare-landraces" component={LandraceComparator} />
      <LazyRoute path="/gcms-chromatograms" component={GCMSChromatograms} />
      <LazyRoute path="/chromatogrammes-gcms" component={GCMSChromatograms} />
      <LazyRoute path="/chromatograms" component={GCMSChromatograms} />
      <LazyRoute path="/compound-search" component={CompoundSearch} />
      <LazyRoute path="/recherche-compose" component={CompoundSearch} />
      <LazyRoute path="/search-compound" component={CompoundSearch} />
      <LazyRoute path="/analysis-hub" component={AnalysisHub} />
      <LazyRoute path="/hub-analyse" component={AnalysisHub} />
      <LazyRoute path="/gcms-hub" component={AnalysisHub} />
      <LazyRoute path="/raw-materials" component={RawMaterialsInventory} />
      <LazyRoute path="/matieres-premieres" component={RawMaterialsInventory} />
      <LazyRoute path="/inventory" component={RawMaterialsInventory} />
      <LazyRoute path="/inventaire" component={RawMaterialsInventory} />
      <LazyRoute path="/inventory-dashboard" component={InventoryDashboard} />
      <LazyRoute path="/tableau-inventaire" component={InventoryDashboard} />
      <LazyRoute path="/stock-dashboard" component={InventoryDashboard} />
      <LazyRoute path="/publication-molecule-graph" component={PublicationMoleculeGraph} />
      <LazyRoute path="/graphe-publications-molecules" component={PublicationMoleculeGraph} />
      <LazyRoute path="/research-graph" component={PublicationMoleculeGraph} />
      <LazyRoute path="/ms-spectra" component={MSSpectraViewer} />
      <LazyRoute path="/spectres-masse" component={MSSpectraViewer} />
      <LazyRoute path="/mass-spectrometry" component={MSSpectraViewer} />
      <LazyRoute path="/compare-spectra" component={SpectraComparison} />
      <LazyRoute path="/comparaison-spectres" component={SpectraComparison} />
      <LazyRoute path="/spectra-comparison" component={SpectraComparison} />
      <LazyRoute path="/identify-spectrum" component={SpectraIdentification} />
      <LazyRoute path="/identification-spectre" component={SpectraIdentification} />
      <LazyRoute path="/spectra-identification" component={SpectraIdentification} />
      
      {/* === RECETTES DE CIGARILLOS === */}
      <LazyRoute path="/recettes-cigarillos" component={CigarilloRecipes} />
      <LazyRoute path="/cigarillo-recipes" component={CigarilloRecipes} />
      <Route path="/recettes/:slug">{() => <WithLayout><RecipeDetail /></WithLayout>}</Route>
      
      {/* === PROTOCOLES TECHNIQUES === */}
      <LazyRoute path="/protocoles" component={TechnicalProtocols} />
      <LazyRoute path="/protocols" component={TechnicalProtocols} />
      <LazyRoute path="/protocoles/:slug" component={ProtocolDetail} />
      
      {/* === LANDRACES CANNABIS === */}
      <LazyRoute path="/landraces" component={CannabisLandraces} />
      <LazyRoute path="/cannabis-landraces" component={CannabisLandraces} />
      <LazyRoute path="/landraces/:slug" component={LandraceDetail} />
      
      {/* === OSMOTHÈQUE === */}
      <LazyRoute path="/osmotheque" component={OsmothequeMolecules} />
      
      {/* === CLAIMS & PREUVES === */}
      <LazyRoute path="/claims-and-proofs" component={ClaimsAndProofs} />
      
      {/* === MATIÈRES PREMIÈRES RARES === */}
      <LazyRoute path="/aromatic-rarities" component={AromaticRarities} />
      <LazyRoute path="/aromatic-rarities/:id" component={AromaticRarityDetailPage} />
      <LazyRoute path="/matieres-premieres-rares" component={AromaticRarities} />

      {/* === CONSERVATION === */}
      <Route path="/conservation">{() => <WithLayout><Conservation /></WithLayout>}</Route>
      
      {/* === PROTOTYPES === */}
      <LazyRoute path="/prototypes" component={Prototypes} />
      <LazyRoute path="/prototypes/c1" component={C1Fermentum} />
      <LazyRoute path="/prototypes/c2" component={C2ClarusVerde} />
      <LazyRoute path="/prototypes/c3" component={C3LactaSolis} />
      <LazyRoute path="/prototypes/c4" component={C4TerraAmbra} />
      <LazyRoute path="/prototypes/:code" component={PrototypeDetail} />
      
      {/* === GAMMES === */}
      {/* Legacy redirects to gammes-hub */}
      <Route path="/gammes" component={() => <SimpleRedirect to="/gammes-hub" />} />
      <LazyRoute path="/gammes-hub" component={GammesHub} />
      <Route path="/gammes/petrichor" component={() => <SimpleRedirect to="/gammes-hub?tab=petrichor" />} />
      <Route path="/gammes/volcanique" component={() => <SimpleRedirect to="/gammes-hub?tab=volcanique" />} />
      <Route path="/gammes/glaciaire" component={() => <SimpleRedirect to="/gammes-hub?tab=glaciaire" />} />
      <Route path="/gammes/biolab" component={() => <SimpleRedirect to="/gammes-hub?tab=bio-lab" />} />
      <Route path="/gammes/mossi" component={() => <SimpleRedirect to="/gammes-hub?tab=mossi" />} />
      {/* Note: /gammes/signatures, /gammes/pheromones, /gammes/raretes are not in hub - keep original routes */}
      <LazyRoute path="/gammes/signatures" component={GammeSignatures} />
      <LazyRoute path="/gammes/pheromones" component={GammePheromones} />
      <Route path="/gammes/raretes">{() => <WithLayout><GammeRaretes /></WithLayout>}</Route>
      
      <LazyRoute path="/colombie" component={ColombieLine} />
      <LazyRoute path="/corpus-burkina" component={CorpusBurkinaFaso} />
      <Route path="/recette/colombie/:id">{() => <WithLayout><RecetteColombie /></WithLayout>}</Route>
      <LazyRoute path="/sourcing" component={Sourcing} />
      <LazyRoute path="/sourcing/colombie" component={SourcingColombie} />
      <LazyRoute path="/sourcing/france" component={SourcingFrance} />
      <LazyRoute path="/sourcing/inde" component={SourcingInde} />
      <LazyRoute path="/sourcing/madagascar" component={SourcingMadagascar} />
      <LazyRoute path="/sourcing/north-america" component={SourcingNorthAmerica} />
      <LazyRoute path="/sourcing/tabac" component={SourcingTabac} />
      <Route path="/sourcing/cannabis">{() => <WithLayout><SourcingCannabis /></WithLayout>}</Route>
      <LazyRoute path="/sourcing-hub" component={SourcingHub} />
      
      {/* === LABORATOIRE === */}
      <LazyRoute path="/laboratoire" component={Laboratoire} />
      <Route path="/laboratoire/recettes">{() => <WithLayout><LaboratoireRecettes /></WithLayout>}</Route>
      <LazyRoute path="/laboratoire/matrice-interactive" component={MatriceInteractive} />
      <LazyRoute path="/laboratoire/statistiques" component={Statistiques} />
      <LazyRoute path="/inventaire" component={Inventaire} />
      
      {/* === MOLÉCULES (Consolidé) === */}
      <LazyRoute path="/molecules-hub" component={MoleculesHub} />
      <LazyRoute path="/molecules" component={Molecules} />
      <LazyRoute path="/recherche-molecule" component={MoleculeSearch} />
      {/* Lazy-loaded detail pages */}
      <Route path="/molecule/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <WithLayout><MoleculeDetail /></WithLayout>
          </Suspense>
        )}
      </Route>
      {/* Alias /molecules/:id → MoleculeDetail (les liens dans l'app utilisent les deux formes) */}
      <Route path="/molecules/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <WithLayout><MoleculeDetail /></WithLayout>
          </Suspense>
        )}
      </Route>
      <LazyRoute path="/terpene/:id" component={TerpeneDetail} />
      {/* Anciennes routes redirigées vers MoleculesHub */}
      <LazyRoute path="/familles" component={Familles} />
      <LazyRoute path="/familles/list" component={FamillesList} />
      <LazyRoute path="/chemical-families" component={ChemicalFamilies} />
      
      {/* === RECETTES === */}
      <LazyRoute path="/recettes" component={RecettesHub} />
      <LazyRoute path="/recettes-tl" component={RecettesTL} />
      <Route path="/recette/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <RecetteDetail />
          </Suspense>
        )}
      </Route>
      {/* Anciennes routes redirigées vers RecettesHub */}
      {/* Legacy redirects for accords and formules-reference */}
      <Route path="/accords" component={() => <SimpleRedirect to="/recettes-hub?tab=accords" />} />
      <Route path="/formules-reference" component={() => <SimpleRedirect to="/recettes-hub?tab=formules" />} />
      <LazyRoute path="/accords-legacy" component={Accords} />
      <LazyRoute path="/accords-dedies" component={AccordsDedies} />
      <LazyRoute path="/experimental-accords" component={ExperimentalAccords} />
        <Route path="/recherche-radicale">{() => <WithLayout><RechercheRadicale /></WithLayout>}</Route>
        <Route path="/recherche/fondements-theoriques">{() => <WithLayout><FondementsPhilosophiques /></WithLayout>}</Route>
      
      {/* === RÉSINES CBD === */}
      <LazyRoute path="/resines-cbd" component={ResinesCBD} />
      <LazyRoute path="/resine-cbd/:id" component={RecetteCBDDetail} />
      <LazyRoute path="/protocoles-maturation" component={ProtocolesMaturation} />
      
      {/* === COMPARAISON & VISUALISATION === */}
      <LazyRoute path="/compare" component={Compare} />
      <LazyRoute path="/compare-terpenes" component={CompareTerpenes} />
      <LazyRoute path="/compare-radar" component={CompareRadar} />
      <LazyRoute path="/compare-recettes" component={CompareRecettes} />
      <Route path="/compare-molecules-advanced">{() => <WithLayout><CompareMoleculesAdvanced /></WithLayout>}</Route>
      <LazyRoute path="/comparaison-molecules" component={ComparaisonMolecules} />
      <LazyRoute path="/compare-plants" component={ComparePlants} />
      <LazyRoute path="/comparaison-plantes" component={ComparePlants} />
      <LazyRoute path="/comparateur-avance" component={ComparateurAvance} />
      <LazyRoute path="/matrice-synergies" component={MatriceSynergies} />
      <LazyRoute path="/graphe-molecules-recettes" component={GrapheMoleculesRecettes} />
      <LazyRoute path="/graphe-plante-molecule" component={GraphePlanteMolecule} />
      <LazyRoute path="/graphe-synergies" component={SynergiesPage} />
      <LazyRoute path="/synergies" component={SynergiesPage} />
      <LazyRoute path="/graphe-relations" component={RelationsGraph} />
      <LazyRoute path="/suggestions-synergies" component={SuggestionsSynergies} />
      <LazyRoute path="/synergies-heatmap" component={SynergiesHeatmap} />
      <LazyRoute path="/synergies-graph-visualization" component={SynergiesGraphVisualization} />
      <Route path="/correlations">{() => <WithLayout><CorrelationsParfumTabacCannabis /></WithLayout>}</Route>
      <LazyRoute path="/parfums" component={ParfumsEmblematiques} />
      <LazyRoute path="/muscs" component={MuscsComparatif} />
      <Route path="/recipe-network">{() => <WithLayout><RecipeNetworkPage /></WithLayout>}</Route>
      <LazyRoute path="/sankey-flow" component={SankeyFlow} />
      <LazyRoute path="/enhanced-radar" component={EnhancedRadarDemo} />
      
      {/* === OUTILS === */}
      {/* Legacy redirects to outils-hub */}
      <Route path="/outils" component={() => <SimpleRedirect to="/outils-hub" />} />
      <LazyRoute path="/outils-hub" component={OutilsHub} />
      <Route path="/outils-formulation" component={() => <SimpleRedirect to="/outils-hub" />} />
      <Route path="/calculateur" component={() => <SimpleRedirect to="/outils-hub?tab=calculateurs" />} />
      <Route path="/outils/dilution" component={() => <SimpleRedirect to="/outils-hub?tab=calculateurs" />} />
      <Route path="/outils/calculateur-cout" component={() => <SimpleRedirect to="/outils-hub?tab=calculateurs" />} />
      <Route path="/outils/editeur-formulation" component={() => <SimpleRedirect to="/outils-hub?tab=formulation" />} />
      <Route path="/outils/generateur-formules" component={() => <SimpleRedirect to="/outils-hub?tab=formulation" />} />
      {/* Keep these as they're not in hub */}
      <Route path="/analyses">{() => <WithLayout><CorrelationAnalysis /></WithLayout>}</Route>
      <LazyRoute path="/absorbe-scale" component={AbsorbeScale} />
      <LazyRoute path="/outils/enrichissement-pubchem" component={EnrichissementPubChem} />
      <LazyRoute path="/outils/carte-origines" component={CarteOrigines} />
      <LazyRoute path="/carte-terroirs-recherche" component={CarteTerroirsRecherche} />
      <LazyRoute path="/carte-plantes-gps" component={CartePlantesGPS} />
      <LazyRoute path="/outils/visualisations-correlation" component={VisualisationsCorrelation} />
      <LazyRoute path="/outils/export-bibliographique" component={ExportBibliographique} />
      
      {/* === RECHERCHE SCIENTIFIQUE === */}
      <Route path="/recherche-scientifique">{() => <WithLayout><RechercheScientifique /></WithLayout>}</Route>
      <LazyRoute path="/recherche-scientifique/synergies-moleculaires" component={SynergiesMoleculaires} />
      <LazyRoute path="/recherche-scientifique/pyrolyse-combustion" component={PyrolyseCombustion} />
      <LazyRoute path="/recherche-scientifique/courbes-volatilite" component={CourbesVolatilite} />
      <LazyRoute path="/recherche-scientifique/degradation-terpenes" component={DegradationTerpenes} />
      <LazyRoute path="/recherche-scientifique/modeles-analytiques-gcms" component={ModelesAnalytiquesGCMS} />
      <LazyRoute path="/recherche-scientifique/donnees" component={ResearchData} />
      <LazyRoute path="/research-data" component={ResearchData} />
      <LazyRoute path="/synergies-terpenes-niches" component={SynergiesTerpenesNiches} />
      <LazyRoute path="/chimie-tabac" component={ChimieTabac} />
      <LazyRoute path="/interactions-tabac-cannabis" component={InteractionsTabacCannabis} />
      <LazyRoute path="/comparaison-terpenes" component={ComparaisonTerpenes} />
      <LazyRoute path="/outil-formulation" component={OutilFormulation} />
      
      {/* === PROGRAMMES DE RECHERCHE === */}
      <Route path="/programmes-recherche">{() => <WithLayout><ProgrammesRecherche /></WithLayout>}</Route>
      <Route path="/programmes-recherche/resines-cbd">{() => <WithLayout><ResinesCBD /></WithLayout>}</Route>
      <Route path="/programmes-recherche/tabacs-niche">{() => <WithLayout><TabacsNiche /></WithLayout>}</Route>
      
      {/* === JOURNAL & MÉTHODOLOGIE === */}
      <Route path="/journal">{() => <WithLayout><Journal /></WithLayout>}</Route>
      <Route path="/methode">{() => <WithLayout><MethodeAbsorbe /></WithLayout>}</Route>
      <Route path="/methode-absorbe">{() => <WithLayout><MethodeAbsorbe /></WithLayout>}</Route>
      <Route path="/methodologie/absorbe">{() => <WithLayout><MethodologieAbsorbe /></WithLayout>}</Route>
      <Route path="/methodologie/recherche">{() => <WithLayout><MethodologieRecherche /></WithLayout>}</Route>
      <Route path="/outils/generateur-formules">{() => <WithLayout><GenerateurFormules /></WithLayout>}</Route>
      <Route path="/historique-formules">{() => <WithLayout><HistoriqueFormules /></WithLayout>}</Route>
      <Route path="/methodologie/echelle-absorbe">{() => <WithLayout><EchelleAbsorbe /></WithLayout>}</Route>
      <Route path="/methodologie/pyrolyse">{() => <WithLayout><Pyrolyse /></WithLayout>}</Route>
      <Route path="/methodologie/gc-ms">{() => <WithLayout><GCMS /></WithLayout>}</Route>
      <Route path="/methodologie/gcms">{() => <WithLayout><GCMS /></WithLayout>}</Route>
      
      {/* === CONTENU ÉDITORIAL === */}
      <LazyRoute path="/etudes" component={Etudes} />
      <LazyRoute path="/etudes-climatiques" component={EtudesClimatiques} />
      <LazyRoute path="/etudes-climatiques/:id" component={EtudeClimatiqueDetail} />
      <LazyRoute path="/archives-terrain" component={ArchivesTerrain} />
      <LazyRoute path="/archives-terrain/:id" component={ArchiveTerrainDetail} />
      <LazyRoute path="/protocoles-moleculaires" component={ProtocolesMoleculaires} />
      <LazyRoute path="/protocoles-moleculaires/:id" component={ProtocoleMoleculaireDetail} />
      <LazyRoute path="/tests-extraction" component={TestsExtraction} />
      <LazyRoute path="/tests-extraction/:id" component={TestExtractionDetail} />
      <LazyRoute path="/odeurs-situees" component={OdeursSituees} />
      <LazyRoute path="/odeurs-situees/:id" component={OdeurSitueeDetail} />
      <LazyRoute path="/projets" component={Projets} />
      <LazyRoute path="/terrains" component={Terrains} />
      <LazyRoute path="/bibliographie" component={BibliographiePage} />
      <Route path="/bibliographie-globale">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <BibliographieGlobale />
          </Suspense>
        )}
      </Route>
      <LazyRoute path="/references-v3" component={ReferencesV3} />
      <LazyRoute path="/reference-entity-link-manager" component={ReferenceEntityLinkManager} />
      <LazyRoute path="/bulk-import-references" component={BulkImportReferences} />
      <LazyRoute path="/reseau-liaisons-references" component={ReferenceLinkNetwork} />
      <LazyRoute path="/suggest-reference-links" component={SuggestReferenceLinks} />
      <LazyRoute path="/visualisations" component={Visualisations} />
      <LazyRoute path="/bibliographie-hub" component={Bibliographie} />
      <LazyRoute path="/heritage-conservation" component={HeritageConservation} />
      <LazyRoute path="/h2-linking" component={H2LinkingInterface} />
      <LazyRoute path="/h3-linking" component={H3LinkingInterface} />
      <LazyRoute path="/genomics-explorer" component={GenomicsExplorer} />
      <LazyRoute path="/tps-genes" component={TpsGenesExplorer} />
      <LazyRoute path="/molecular-transformations" component={MolecularTransformations} />
      <LazyRoute path="/axes-recherche" component={AxesRecherche} />
      <Route path="/axes-recherche/:code">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <AxeRechercheDetail />
          </Suspense>
        )}
      </Route>
      <LazyRoute path="/reseau-axes" component={ReseauAxes} />
      <LazyRoute path="/gestion" component={GestionPage} />
      <Route path="/collaborations">{() => <WithLayout><Collaborations /></WithLayout>}</Route>
      <LazyRoute path="/archives" component={Archives} />
      <LazyRoute path="/patrimoine-menace" component={PatrimoineMenace} />
      <Route path="/explorer-par-odeur">{() => <WithLayout><ExplorerParOdeur /></WithLayout>}</Route>
      <LazyRoute path="/alternatives-durables" component={AlternativesDurables} />
      <LazyRoute path="/archives-olfactives" component={ArchivesOlfactives} />

      <LazyRoute path="/glossaire" component={Glossaire} />
      <LazyRoute path="/glossaire-visuel-radar" component={GlossaireVisuelRadar} />
      <LazyRoute path="/contribuer" component={Contribuer} />
      <LazyRoute path="/contributor" component={ContributorInterface} />
      <LazyRoute path="/contributor/add" component={ContributorInterface} />
      <LazyRoute path="/contributor/links" component={PlantMoleculeLinking} />
      <LazyRoute path="/contributor/simple" component={SimplifiedContributorForm} />
      <LazyRoute path="/coverage-goal" component={CoverageGoalDashboard} />
      <Route path="/csv-validation-import">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <CSVValidationImport />
          </Suspense>
        )}
      </Route>
      <LazyRoute path="/plant-molecule-linking" component={PlantMoleculeLinking} />
      <LazyRoute path="/timeline" component={Timeline} />
      <LazyRoute path="/timeline/interactive" component={TimelineInteractive} />
      <LazyRoute path="/formules-reference" component={FormulesReference} />
      <LazyRoute path="/comparaison" component={ComparaisonAvancee} />
      {/* <Route path="/galerie-botaniques" component={GalerieBotaniques} /> */} {/* Intégré dans /plants?tab=gallery */}
      <LazyRoute path="/galerie" component={Gallery} />
      <LazyRoute path="/gallery" component={Gallery} />
      <LazyRoute path="/galerie/import" component={BatchImport} />
      <LazyRoute path="/batch-import" component={BatchImport} />
      <LazyRoute path="/ifra" component={Ifra} />
      <LazyRoute path="/reglementation-ifra" component={Ifra} />
      
      {/* === VISUALISATIONS INTERACTIVES === */}
      <LazyRoute path="/visualisation/gcms" component={VisualisationGCMS} />
      
      {/* === SAN ANDRÉS / LEAF ECONOMIES === */}
      <LazyRoute path="/leaf-economies" component={LeafEconomies} />
      <LazyRoute path="/san-andres" component={LeafEconomies} />
      <LazyRoute path="/san-andres/leaf-economies" component={LeafEconomies} />
      <LazyRoute path="/san-andres/echantillon/:id" component={LeafEconomyDetail} />
      <LazyRoute path="/san-andres/echantillon/:id/edit" component={LeafEconomyForm} />
      <LazyRoute path="/san-andres/echantillon/new" component={LeafEconomyForm} />
      <LazyRoute path="/timeline-botanique" component={TimelineBotanique} />
      <LazyRoute path="/botanique-critique" component={BotaniqueCritique} />
      <LazyRoute path="/varietes-fantomes" component={VarietesFantomes} />
      <LazyRoute path="/ghost-varieties-explorer" component={GhostVarietiesExplorer} />
      <LazyRoute path="/ghost-variety/new" component={GhostVarietyForm} />
      <Route path="/ghost-variety/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <GhostVarietyDetail />
          </Suspense>
        )}
      </Route>
      <LazyRoute path="/ghost-variety/:id/upload-image" component={GhostVarietyImageUpload} />
      <Route path="/recettes-leaf-economies">{() => <WithLayout><RecettesLeafEconomies /></WithLayout>}</Route>
      <LazyRoute path="/terp-profiles" component={TerpProfiles} />
      <LazyRoute path="/terp-profiles/compare" component={TerpProfilesCompare} />
      <LazyRoute path="/plants" component={PlantsHub} />
      <LazyRoute path="/plantes" component={PlantsHub} />
      <LazyRoute path="/plants-legacy" component={Plants} />
      <LazyRoute path="/varietes" component={PlantsHub} />
      <LazyRoute path="/plant-varieties" component={PlantsHub} />
      <LazyRoute path="/plantes-varietes" component={PlantsHub} />
      <LazyRoute path="/varietes-legacy" component={PlantVarieties} />
      <LazyRoute path="/varietes/new" component={VarietyForm} />
      <LazyRoute path="/varietes/:id" component={VarietyDetail} />
      <LazyRoute path="/genealogy" component={GenealogyGraph} />
      <LazyRoute path="/arbre-genealogique" component={GenealogyGraph} />
      <LazyRoute path="/plantes-varietes/new" component={VarietyForm} />
      <LazyRoute path="/carte-varietes" component={CarteVarietes} />
      <LazyRoute path="/carte-origines" component={CarteVarietes} />
      <LazyRoute path="/chemotypes" component={Chemotypes} />
      <LazyRoute path="/phylogenetique" component={PhylogeneticView} />
      <LazyRoute path="/phylogenetic" component={PhylogeneticView} />
      <LazyRoute path="/famille/:name" component={FamilyDetail} />
      <LazyRoute path="/smiles" component={SmilesViewer} />
      <LazyRoute path="/structures" component={SmilesViewer} />
      <LazyRoute path="/enrichissement" component={EnrichmentDashboard} />
      <LazyRoute path="/enrichment" component={EnrichmentDashboard} />
      <LazyRoute path="/ifra" component={IFRACompliance} />
      <LazyRoute path="/conformite-ifra" component={IFRACompliance} />
      <LazyRoute path="/percepts" component={PerceptSearch} />
      <LazyRoute path="/recherche-percepts" component={PerceptSearch} />
      <LazyRoute path="/stats-olfactives" component={OlfactiveStats} />
      <LazyRoute path="/statistiques" component={OlfactiveStats} />
      <LazyRoute path="/plants/new" component={PlantForm} />
      <LazyRoute path="/plants/:id/edit" component={PlantForm} />
      <Route path="/plantes/par-molecule">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <PlantsByMolecule />
          </Suspense>
        )}
      </Route>
      <Route path="/plants/by-molecule">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <PlantsByMolecule />
          </Suspense>
        )}
      </Route>
      <Route path="/plants/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <WithLayout><PlantDetail /></WithLayout>
          </Suspense>
        )}
      </Route>
      <Route path="/plantes/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <WithLayout><PlantDetail /></WithLayout>
          </Suspense>
        )}
      </Route>
      <LazyRoute path="/final-recipes" component={FinalRecipes} />
      <LazyRoute path="/recettes-finales" component={FinalRecipes} />
      <LazyRoute path="/final-recipes/:id" component={FinalRecipeDetail} />
      <LazyRoute path="/recettes-finales/:id" component={FinalRecipeDetail} />
      <LazyRoute path="/terroirs" component={PlantsHub} />
      <LazyRoute path="/terroirs-legacy" component={Terroirs} />
      <LazyRoute path="/terroirs/:id" component={TerroirDetail} />
      <LazyRoute path="/chemotypes" component={ChemotypesExplorer} />
      <LazyRoute path="/methodes-analytiques" component={AnalyticalMethodsPage} />
      <LazyRoute path="/analytical-methods" component={AnalyticalMethodsPage} />
      <LazyRoute path="/origines-geographiques" component={OriginesGeographiques} />
      <LazyRoute path="/extraction-methods" component={ExtractionMethods} />
      <LazyRoute path="/methodes-extraction" component={ExtractionMethods} />
      <LazyRoute path="/comparaison-extractions" component={ComparaisonExtractions} />
      <LazyRoute path="/he-absolue-co2" component={ComparaisonExtractions} />
      
      {/* === MATIÈRES PREMIÈRES & RELATIONS === */}
      <LazyRoute path="/matieres-premieres" component={MatieresPremieres} />
      <LazyRoute path="/matieres-premieres/nouvelle" component={RawMaterialForm} />
      <LazyRoute path="/matieres-premieres/:id" component={MatierePremierePage} />
      <LazyRoute path="/raw-materials" component={RawMaterials} />
      <LazyRoute path="/raw-materials/:id" component={RawMaterialDetail} />
      <LazyRoute path="/relations-molecule-plante" component={MoleculePlantRelations} />
      <LazyRoute path="/molecule-plant-relations" component={MoleculePlantRelations} />
      
      {/* === CIVILISATIONS & TRADITIONS === */}
      <LazyRoute path="/civilisations" component={Civilisations} />
      <LazyRoute path="/civilisation/:id" component={CivilisationDetail} />
      <LazyRoute path="/installations" component={Installations} />
      
      {/* === TABACS & ASSOCIATIONS === */}
      <Route path="/tabacs-resines">{() => <WithLayout><TabacsResines /></WithLayout>}</Route>
      <LazyRoute path="/tabacs-naturels" component={TabacsNaturels} />
      <LazyRoute path="/tabacs-originaux" component={TabacsOriginaux} />
      <LazyRoute path="/associations" component={Associations} />
      <LazyRoute path="/fournisseurs" component={Fournisseurs} />
      
      {/* === DASHBOARDS === */}
      <LazyRoute path="/dashboard" component={DashboardMinimal} />
      <LazyRoute path="/dashboard/recherche" component={DashboardRecherche} />
      <LazyRoute path="/analytics" component={AnalyticsDashboard} />
      <LazyRoute path="/analytics/advanced" component={AnalyticsDashboardAdvanced} />
      <LazyRoute path="/mon-dashboard" component={MonDashboard} />
      <LazyRoute path="/statistiques" component={Statistics} />
      <LazyRoute path="/recherche" component={RechercheAvancee} />
      <LazyRoute path="/recherche-profil-moleculaire" component={RechercheProfilMoleculaire} />
      {/* Route /recherche-avancee déjà définie ligne 364 avec RechercheAvancee */}
      <LazyRoute path="/recherche-croisee" component={CrossSearch} />
      <Route path="/timeline-recettes">{() => <WithLayout><RecipeTimeline /></WithLayout>}</Route>
      <Route path="/heatmap-correlations">{() => <WithLayout><RadarCorrelationHeatmap /></WithLayout>}</Route>
      
      {/* === UTILISATEUR === */}
      <LazyRoute path="/favoris" component={Favoris} />
      <Route path="/mes-favoris">{() => <WithLayout><MyFavorites /></WithLayout>}</Route>
      <LazyRoute path="/reseau" component={Reseau} />
      <LazyRoute path="/reseau-molecules-plantes" component={ReseauMoleculePlante} />
      <LazyRoute path="/reseau-plantes-molecules" component={PlantMoleculeNetwork} />
      <LazyRoute path="/reseau-plantes-terroirs" component={PlantTerroirNetwork} />
      <LazyRoute path="/carte-terroirs-plantes" component={CarteTerroirsPlantes} />
      <LazyRoute path="/graphe-terroir-plante-molecule" component={GrapheTerroirPlanteMolecule} />
      <LazyRoute path="/graphe-molecules-familles-chimiques" component={GrapheMoleculesFamillesChimiques} />
      <LazyRoute path="/vue-connexions" component={VueDetailConnexions} />
      <LazyRoute path="/graphe-axes-thematiques" component={GrapheAxesThematiques} />
      {/* Alias court */}
      <LazyRoute path="/axes-thematiques" component={GrapheAxesThematiques} />
      <LazyRoute path="/graphe-references-axes" component={GrapheReferencesAxes} />
      <LazyRoute path="/references-graph" component={ReferencesGraph} />
      <LazyRoute path="/carte-interactive-terroirs" component={CarteInteractiveTerroirs} />
      <LazyRoute path="/carte-terroirs" component={TerroirMapPage} />
      <Route path="/parcours-olfactif">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <ParcoursOlfactif />
          </Suspense>
        )}
      </Route>
      <LazyRoute path="/parcours/:code" component={ParcoursDetail} />
      <Route path="/bio-mineralis">{() => <WithLayout><BioMineralis /></WithLayout>}</Route>
      <Route path="/admin/duplicates" component={AdminDuplicates} />
      
      {/* === ENRICHISSEMENT APIs === */}
      <LazyRouteRaw path="/admin/gbif-enrichment" component={GBIFEnrichment} />
      <LazyRouteRaw path="/admin/tropicos-enrichment" component={TropicosEnrichment} />
      <LazyRouteRaw path="/admin/lotus-enrichment" component={LOTUSEnrichment} />
      <LazyRouteRaw path="/admin/lotus-plant-linker" component={LotusPlantLinker} />
      <LazyRouteRaw path="/admin/lotus-batch-genus" component={LotusBatchGenus} />
      <LazyRouteRaw path="/admin/coconut-enrichment" component={COCONUTEnrichment} />
      <LazyRouteRaw path="/admin/iucn-enrichment" component={IUCNEnrichment} />
      <LazyRouteRaw path="/admin/phylo-enrichment" component={PhyloEnrichment} />
      <LazyRouteRaw path="/admin/api-coverage" component={ApiCoverage} />
      <LazyRouteRaw path="/resines-encens" component={ResinMaturation} />
      <LazyRoute path="/extraction-procedes" component={ExtractionProcesses} />
      
      {/* === ERREURS === */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function App() {
  // Activer navigation clavier globale
  // useKeyboardNavigation();
  
  // Activer historique navigation
  // useNavigationHistory();
  
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
        <GuidedNavigationProvider>
          <TooltipProvider>
            <NavigationProgressBar />
            <Toaster />
            <GoogleAnalytics />
            <GlobalSearchAdvanced />
            <GuidedNavigationBar />
            <TourSelector />
            <PageTransition>
              <Router />
            </PageTransition>
            <GuidedNavigationWidget />
            <MobileBottomNav />
            <ScrollToTop />
            <PWAInstallPrompt />
          </TooltipProvider>
        </GuidedNavigationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
