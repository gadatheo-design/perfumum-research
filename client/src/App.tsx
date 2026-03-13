import { Toaster } from "@/components/ui/sonner";
import React, { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

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
const ExtractionMethods = React.lazy(() => import('./pages/ExtractionMethods'));
const ComparaisonExtractions = React.lazy(() => import('./pages/ComparaisonExtractions'));
const Collaborations = React.lazy(() => import('./pages/Collaborations'));
const Archives = React.lazy(() => import('./pages/Archives'));
const Outils = React.lazy(() => import('./pages/Outils'));
const OutilsHub = React.lazy(() => import('./pages/OutilsHub'));
const PatrimoineMenace = React.lazy(() => import('./pages/PatrimoineMenace'));
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




// Wrapper for lazy-loaded components
const LazyRoute: React.FC<{ path: string; component: React.LazyExoticComponent<React.ComponentType<unknown>> }> = ({ path, component: Component }) => (
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
      <Route path="/systeme" component={SystemePerfumum} /> 
      {/* === ADMINISTRATION === */}
      <Route path="/admin" component={Admin} />
      <Route path="/admin/liaison-recettes-molecules" component={LiaisonRecettesMolecules} />
      <Route path="/molecule-recette-linking" component={MoleculeRecetteLinking} />
      <Route path="/molecule-recette-audit" component={MoleculeRecetteAudit} />
      <Route path="/molecule-recette-dragdrop" component={MoleculeRecetteDragDrop} />
      <Route path="/molecule-recette-import-csv" component={MoleculeRecetteImportCSV} />
      <Route path="/plant-terroir-linking" component={PlantTerroirLinking} />
      <Route path="/plant-terroir-audit" component={PlantTerroirAudit} />
      <Route path="/plant-terroir-dragdrop" component={PlantTerroirDragDrop} />
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
      <Route path="/reseau-liaisons" component={ReseauLiaisons} />
      <Route path="/admin/progress-report" component={AdminProgressReport} />
      <Route path="/admin/molecule-origins" component={MoleculeOriginsAdmin} />
      <Route path="/admin/terroirs-geocode" component={TerroirsGeocode} />
      <Route path="/outils/editeur-formulation" component={EditeurFormulation} />

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
      <Route path="/admin/knapsack-batch" component={KNApSAcKBatch} />
      <Route path="/admin/bundle-visualizer" component={AdminBundleVisualizer} />
      <Route path="/admin/reclassify-molecules" component={AdminReclassifyMolecules} />
      
      {/* === RECHERCHE === */}
      <LazyRoute path="/recherche-avancee" component={RechercheAvancee} />
      <Route path="/recherche-globale" component={RechercheGlobale} />
      
      {/* === PROJET === */}
      <Route path="/le-projet" component={LeProjet} />
      <Route path="/manifeste" component={Manifeste} />
      <Route path="/a-propos" component={APropos} />
      <Route path="/contact" component={Contact} />
      <Route path="/nouveautes" component={Nouveautes} />
      <Route path="/projet/timeline" component={TimelinePerfumum} />
      
      {/* === ABSORBE X - RECHERCHE AVANCÉE === */}
      <Route path="/absorbe-x" component={AbsorbeXDashboard} />
      <Route path="/absorbe-x/manifeste" component={AbsorbeXManifeste} />
      <Route path="/absorbe-x/notes-recherche" component={AbsorbeXNotesRecherche} />
      <Route path="/absorbe-x/quantique" component={AbsorbeXQuantique} />
      <Route path="/absorbe-x/patrimoine" component={AbsorbeXPatrimoine} />
      <Route path="/absorbe-x/neuro-olfaction" component={AbsorbeXNeuroOlfaction} />
      <Route path="/absorbe-x/odeurs-perdues" component={AbsorbeXOdeursPerdues} />
      <Route path="/molecules-disparues" component={MoleculesDisparues} />
      <Route path="/absorbe-x/guide-laboratoire" component={AbsorbeXGuideLaboratoire} />
      
      {/* === TABACOTHÈQUE === */}
      <Route path="/tabacotheque" component={Tabacotheque} />
      <Route path="/perique-compounds" component={PeriqueCompounds} />
      <Route path="/historic-cigarettes" component={HistoricCigarettes} />
      <Route path="/tobacco-landraces" component={TobaccoLandraces} />
      <Route path="/tobacco-landrace/:name" component={TobaccoLandraceDetail} />
      <Route path="/tabac/:id" component={TabacDetail} />
      <Route path="/soil-analysis" component={SoilAnalysis} />
      <Route path="/analyses-pedologiques" component={SoilAnalysis} />
      <Route path="/biosynthetic-pathways" component={BiosyntheticPathways} />
      <Route path="/voies-biosynthetiques" component={BiosyntheticPathways} />
      <Route path="/tps-pathways" component={BiosyntheticPathways} />
      <Route path="/pyrolysis" component={PyrolysisVisualization} />
      <Route path="/pyrolyse" component={PyrolysisVisualization} />
      <Route path="/transformations-pyrolytiques" component={PyrolysisVisualization} />
      <Route path="/terpene-profiles" component={TerpeneProfiles} />
      <Route path="/profils-terpeniques" component={TerpeneProfiles} />
      <Route path="/terpenes" component={TerpeneProfiles} />
      <Route path="/perique-fermentation" component={PeriqueFermentation} />
      <Route path="/fermentation-perique" component={PeriqueFermentation} />
      <Route path="/perique" component={PeriqueFermentation} />
      <Route path="/landrace-comparator" component={LandraceComparator} />
      <Route path="/comparateur-landraces" component={LandraceComparator} />
      <Route path="/compare-landraces" component={LandraceComparator} />
      <Route path="/gcms-chromatograms" component={GCMSChromatograms} />
      <Route path="/chromatogrammes-gcms" component={GCMSChromatograms} />
      <Route path="/chromatograms" component={GCMSChromatograms} />
      <Route path="/compound-search" component={CompoundSearch} />
      <Route path="/recherche-compose" component={CompoundSearch} />
      <Route path="/search-compound" component={CompoundSearch} />
      <Route path="/analysis-hub" component={AnalysisHub} />
      <Route path="/hub-analyse" component={AnalysisHub} />
      <Route path="/gcms-hub" component={AnalysisHub} />
      <Route path="/raw-materials" component={RawMaterialsInventory} />
      <Route path="/matieres-premieres" component={RawMaterialsInventory} />
      <Route path="/inventory" component={RawMaterialsInventory} />
      <Route path="/inventaire" component={RawMaterialsInventory} />
      <Route path="/inventory-dashboard" component={InventoryDashboard} />
      <Route path="/tableau-inventaire" component={InventoryDashboard} />
      <Route path="/stock-dashboard" component={InventoryDashboard} />
      <Route path="/publication-molecule-graph" component={PublicationMoleculeGraph} />
      <Route path="/graphe-publications-molecules" component={PublicationMoleculeGraph} />
      <Route path="/research-graph" component={PublicationMoleculeGraph} />
      <Route path="/ms-spectra" component={MSSpectraViewer} />
      <Route path="/spectres-masse" component={MSSpectraViewer} />
      <Route path="/mass-spectrometry" component={MSSpectraViewer} />
      <Route path="/compare-spectra" component={SpectraComparison} />
      <Route path="/comparaison-spectres" component={SpectraComparison} />
      <Route path="/spectra-comparison" component={SpectraComparison} />
      <Route path="/identify-spectrum" component={SpectraIdentification} />
      <Route path="/identification-spectre" component={SpectraIdentification} />
      <Route path="/spectra-identification" component={SpectraIdentification} />
      
      {/* === RECETTES DE CIGARILLOS === */}
      <LazyRoute path="/recettes-cigarillos" component={CigarilloRecipes} />
      <LazyRoute path="/cigarillo-recipes" component={CigarilloRecipes} />
      <LazyRoute path="/recettes/:slug" component={RecipeDetail} />
      
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
      <Route path="/claims-and-proofs" component={ClaimsAndProofs} />
      
      {/* === MATIÈRES PREMIÈRES RARES === */}
      <Route path="/aromatic-rarities" component={AromaticRarities} />
      <Route path="/aromatic-rarities/:id" component={AromaticRarityDetailPage} />
      <Route path="/matieres-premieres-rares" component={AromaticRarities} />
      
      {/* === ERREURS === */}
      <Route path="/prototypes" component={Prototypes} />
      <Route path="/prototypes/c1" component={C1Fermentum} />
      <Route path="/prototypes/c2" component={C2ClarusVerde} />
      <Route path="/prototypes/c3" component={C3LactaSolis} />
      <Route path="/prototypes/c4" component={C4TerraAmbra} />
      <Route path="/prototypes/:code" component={PrototypeDetail} />
      
      {/* === GAMMES === */}
      {/* Legacy redirects to gammes-hub */}
      <Route path="/gammes" component={() => <SimpleRedirect to="/gammes-hub" />} />
      <Route path="/gammes-hub" component={GammesHub} />
      <Route path="/gammes/petrichor" component={() => <SimpleRedirect to="/gammes-hub?tab=petrichor" />} />
      <Route path="/gammes/volcanique" component={() => <SimpleRedirect to="/gammes-hub?tab=volcanique" />} />
      <Route path="/gammes/glaciaire" component={() => <SimpleRedirect to="/gammes-hub?tab=glaciaire" />} />
      <Route path="/gammes/biolab" component={() => <SimpleRedirect to="/gammes-hub?tab=bio-lab" />} />
      <Route path="/gammes/mossi" component={() => <SimpleRedirect to="/gammes-hub?tab=mossi" />} />
      {/* Note: /gammes/signatures, /gammes/pheromones, /gammes/raretes are not in hub - keep original routes */}
      <Route path="/gammes/signatures" component={GammeSignatures} />
      <Route path="/gammes/pheromones" component={GammePheromones} />
      <Route path="/gammes/raretes" component={GammeRaretes} />
      
      <Route path="/colombie" component={ColombieLine} />
      <Route path="/recette/colombie/:id" component={RecetteColombie} />
      <Route path="/sourcing" component={Sourcing} />
      <Route path="/sourcing/colombie" component={SourcingColombie} />
      <Route path="/sourcing/france" component={SourcingFrance} />
      <Route path="/sourcing/inde" component={SourcingInde} />
      <Route path="/sourcing/madagascar" component={SourcingMadagascar} />
      <Route path="/sourcing/north-america" component={SourcingNorthAmerica} />
      <Route path="/sourcing/tabac" component={SourcingTabac} />
      <Route path="/sourcing/cannabis" component={SourcingCannabis} />
      <Route path="/sourcing-hub" component={SourcingHub} />
      
      {/* === LABORATOIRE === */}
      <Route path="/laboratoire" component={Laboratoire} />
      <Route path="/laboratoire/recettes" component={LaboratoireRecettes} />
      <Route path="/laboratoire/matrice-interactive" component={MatriceInteractive} />
      <Route path="/laboratoire/statistiques" component={Statistiques} />
      <Route path="/inventaire" component={Inventaire} />
      
      {/* === MOLÉCULES (Consolidé) === */}
      <Route path="/molecules-hub" component={MoleculesHub} />
      <Route path="/molecules" component={Molecules} />
      <Route path="/recherche-molecule" component={MoleculeSearch} />
      {/* Lazy-loaded detail pages */}
      <Route path="/molecule/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <MoleculeDetail />
          </Suspense>
        )}
      </Route>
      {/* Alias /molecules/:id → MoleculeDetail (les liens dans l'app utilisent les deux formes) */}
      <Route path="/molecules/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <MoleculeDetail />
          </Suspense>
        )}
      </Route>
      <Route path="/terpene/:id" component={TerpeneDetail} />
      {/* Anciennes routes redirigées vers MoleculesHub */}
      <Route path="/familles" component={Familles} />
      <Route path="/familles/list" component={FamillesList} />
      <Route path="/chemical-families" component={ChemicalFamilies} />
      
      {/* === RECETTES === */}
      <Route path="/recettes" component={RecettesHub} />
      <Route path="/recettes-tl" component={RecettesTL} />
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
      <Route path="/accords-legacy" component={Accords} />
      <Route path="/accords-dedies" component={AccordsDedies} />
      <Route path="/experimental-accords" component={ExperimentalAccords} />
        <Route path="/recherche-radicale" component={RechercheRadicale} />
        <Route path="/recherche/fondements-theoriques" component={FondementsPhilosophiques} />
      
      {/* === RÉSINES CBD === */}
      <Route path="/resines-cbd" component={ResinesCBD} />
      <Route path="/resine-cbd/:id" component={RecetteCBDDetail} />
      <Route path="/protocoles-maturation" component={ProtocolesMaturation} />
      
      {/* === COMPARAISON & VISUALISATION === */}
      <Route path="/compare" component={Compare} />
      <Route path="/compare-terpenes" component={CompareTerpenes} />
      <Route path="/compare-radar" component={CompareRadar} />
      <Route path="/compare-recettes" component={CompareRecettes} />
      <Route path="/compare-molecules-advanced" component={CompareMoleculesAdvanced} />
     <Route path="/comparaison-molecules" component={ComparaisonMolecules} />
      <Route path="/compare-plants" component={ComparePlants} />
      <Route path="/comparaison-plantes" component={ComparePlants} />
      <Route path="/comparateur-avance" component={ComparateurAvance} />
      <Route path="/matrice-synergies" component={MatriceSynergies} />
      <Route path="/graphe-molecules-recettes" component={GrapheMoleculesRecettes} />
      <Route path="/graphe-plante-molecule" component={GraphePlanteMolecule} />
      <Route path="/graphe-synergies" component={SynergiesPage} />
      <Route path="/synergies" component={SynergiesPage} />
      <Route path="/graphe-relations" component={RelationsGraph} />
      <Route path="/suggestions-synergies" component={SuggestionsSynergies} />
      <Route path="/synergies-heatmap" component={SynergiesHeatmap} />
      <Route path="/synergies-graph-visualization" component={SynergiesGraphVisualization} />
      <Route path="/correlations" component={CorrelationsParfumTabacCannabis} />
      <Route path="/parfums" component={ParfumsEmblematiques} />
      <Route path="/muscs" component={MuscsComparatif} />
      <Route path="/recipe-network" component={RecipeNetworkPage} />
      <Route path="/sankey-flow" component={SankeyFlow} />
      <Route path="/enhanced-radar" component={EnhancedRadarDemo} />
      
      {/* === OUTILS === */}
      {/* Legacy redirects to outils-hub */}
      <Route path="/outils" component={() => <SimpleRedirect to="/outils-hub" />} />
      <Route path="/outils-hub" component={OutilsHub} />
      <Route path="/outils-formulation" component={() => <SimpleRedirect to="/outils-hub" />} />
      <Route path="/calculateur" component={() => <SimpleRedirect to="/outils-hub?tab=calculateurs" />} />
      <Route path="/outils/dilution" component={() => <SimpleRedirect to="/outils-hub?tab=calculateurs" />} />
      <Route path="/outils/calculateur-cout" component={() => <SimpleRedirect to="/outils-hub?tab=calculateurs" />} />
      <Route path="/outils/editeur-formulation" component={() => <SimpleRedirect to="/outils-hub?tab=formulation" />} />
      <Route path="/outils/generateur-formules" component={() => <SimpleRedirect to="/outils-hub?tab=formulation" />} />
      {/* Keep these as they're not in hub */}
      <Route path="/analyses" component={CorrelationAnalysis} />
      <Route path="/absorbe-scale" component={AbsorbeScale} />
      <Route path="/outils/enrichissement-pubchem" component={EnrichissementPubChem} />
      <Route path="/outils/carte-origines" component={CarteOrigines} />
      <Route path="/carte-terroirs-recherche" component={CarteTerroirsRecherche} />
      <Route path="/carte-plantes-gps" component={CartePlantesGPS} />
      <Route path="/outils/visualisations-correlation" component={VisualisationsCorrelation} />
      <Route path="/outils/export-bibliographique" component={ExportBibliographique} />
      
      {/* === RECHERCHE SCIENTIFIQUE === */}
      <Route path="/recherche-scientifique" component={RechercheScientifique} />
      <Route path="/recherche-scientifique/synergies-moleculaires" component={SynergiesMoleculaires} />
      <Route path="/recherche-scientifique/pyrolyse-combustion" component={PyrolyseCombustion} />
      <Route path="/recherche-scientifique/courbes-volatilite" component={CourbesVolatilite} />
      <Route path="/recherche-scientifique/degradation-terpenes" component={DegradationTerpenes} />
      <Route path="/recherche-scientifique/modeles-analytiques-gcms" component={ModelesAnalytiquesGCMS} />
      <Route path="/recherche-scientifique/donnees" component={ResearchData} />
      <Route path="/research-data" component={ResearchData} />
      <Route path="/synergies-terpenes-niches" component={SynergiesTerpenesNiches} />
      <Route path="/chimie-tabac" component={ChimieTabac} />
      <Route path="/interactions-tabac-cannabis" component={InteractionsTabacCannabis} />
      <Route path="/comparaison-terpenes" component={ComparaisonTerpenes} />
      <Route path="/outil-formulation" component={OutilFormulation} />
      
      {/* === PROGRAMMES DE RECHERCHE === */}
      <Route path="/programmes-recherche" component={ProgrammesRecherche} />
      <Route path="/programmes-recherche/resines-cbd" component={ResinesCBD} />
      <Route path="/programmes-recherche/tabacs-niche" component={TabacsNiche} />
      
      {/* === JOURNAL & MÉTHODOLOGIE === */}
      <Route path="/journal" component={Journal} />
      <Route path="/methode" component={MethodeAbsorbe} />
      <Route path="/methode-absorbe" component={MethodeAbsorbe} />
          <Route path="/methodologie/absorbe" component={MethodologieAbsorbe} />
          <Route path="/methodologie/recherche" component={MethodologieRecherche} />
          <Route path="/outils/generateur-formules" component={GenerateurFormules} />
      <Route path="/historique-formules" component={HistoriqueFormules} />
      <Route path="/methodologie/echelle-absorbe" component={EchelleAbsorbe} />
      <Route path="/methodologie/pyrolyse" component={Pyrolyse} />
      <Route path="/methodologie/gc-ms" component={GCMS} />
      <Route path="/methodologie/gcms" component={GCMS} />
      
      {/* === CONTENU ÉDITORIAL === */}
      <Route path="/etudes" component={Etudes} />
      <Route path="/etudes-climatiques" component={EtudesClimatiques} />
      <Route path="/etudes-climatiques/:id" component={EtudeClimatiqueDetail} />
      <Route path="/archives-terrain" component={ArchivesTerrain} />
      <Route path="/archives-terrain/:id" component={ArchiveTerrainDetail} />
      <Route path="/protocoles-moleculaires" component={ProtocolesMoleculaires} />
      <Route path="/protocoles-moleculaires/:id" component={ProtocoleMoleculaireDetail} />
      <Route path="/tests-extraction" component={TestsExtraction} />
      <Route path="/tests-extraction/:id" component={TestExtractionDetail} />
      <Route path="/odeurs-situees" component={OdeursSituees} />
      <Route path="/odeurs-situees/:id" component={OdeurSitueeDetail} />
      <Route path="/projets" component={Projets} />
      <Route path="/terrains" component={Terrains} />
      <Route path="/bibliographie" component={BibliographiePage} />
      <Route path="/bibliographie-globale">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <BibliographieGlobale />
          </Suspense>
        )}
      </Route>
      <Route path="/references-v3" component={ReferencesV3} />
      <Route path="/reference-entity-link-manager" component={ReferenceEntityLinkManager} />
      <Route path="/bulk-import-references" component={BulkImportReferences} />
      <Route path="/reseau-liaisons-references" component={ReferenceLinkNetwork} />
      <Route path="/suggest-reference-links" component={SuggestReferenceLinks} />
      <Route path="/visualisations" component={Visualisations} />
      <Route path="/bibliographie-hub" component={Bibliographie} />
      <Route path="/heritage-conservation" component={HeritageConservation} />
      <Route path="/h2-linking" component={H2LinkingInterface} />
      <Route path="/h3-linking" component={H3LinkingInterface} />
      <Route path="/genomics-explorer" component={GenomicsExplorer} />
      <Route path="/tps-genes" component={TpsGenesExplorer} />
      <Route path="/molecular-transformations" component={MolecularTransformations} />
      <Route path="/axes-recherche" component={AxesRecherche} />
      <Route path="/axes-recherche/:code">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <AxeRechercheDetail />
          </Suspense>
        )}
      </Route>
      <Route path="/reseau-axes" component={ReseauAxes} />
      <Route path="/gestion" component={GestionPage} />
      <Route path="/collaborations" component={Collaborations} />
      <Route path="/archives" component={Archives} />
      <Route path="/patrimoine-menace" component={PatrimoineMenace} />
      <Route path="/alternatives-durables" component={AlternativesDurables} />
      <Route path="/archives-olfactives" component={ArchivesOlfactives} />

      <Route path="/glossaire" component={Glossaire} />
      <Route path="/glossaire-visuel-radar" component={GlossaireVisuelRadar} />
      <Route path="/contribuer" component={Contribuer} />
      <Route path="/contributor" component={ContributorInterface} />
      <Route path="/contributor/add" component={ContributorInterface} />
      <Route path="/contributor/links" component={PlantMoleculeLinking} />
      <Route path="/contributor/simple" component={SimplifiedContributorForm} />
      <Route path="/coverage-goal" component={CoverageGoalDashboard} />
      <Route path="/csv-validation-import">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <CSVValidationImport />
          </Suspense>
        )}
      </Route>
      <Route path="/plant-molecule-linking" component={PlantMoleculeLinking} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/timeline/interactive" component={TimelineInteractive} />
      <Route path="/formules-reference" component={FormulesReference} />
      <Route path="/comparaison" component={ComparaisonAvancee} />
      {/* <Route path="/galerie-botaniques" component={GalerieBotaniques} /> */} {/* Intégré dans /plants?tab=gallery */}
      <Route path="/galerie" component={Gallery} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/galerie/import" component={BatchImport} />
      <Route path="/batch-import" component={BatchImport} />
      <Route path="/ifra" component={Ifra} />
      <Route path="/reglementation-ifra" component={Ifra} />
      
      {/* === SAN ANDRÉS / LEAF ECONOMIES === */}
      <Route path="/leaf-economies" component={LeafEconomies} />
      <Route path="/san-andres" component={LeafEconomies} />
      <Route path="/san-andres/leaf-economies" component={LeafEconomies} />
      <Route path="/san-andres/echantillon/:id" component={LeafEconomyDetail} />
      <Route path="/san-andres/echantillon/:id/edit" component={LeafEconomyForm} />
      <Route path="/san-andres/echantillon/new" component={LeafEconomyForm} />
      <Route path="/timeline-botanique" component={TimelineBotanique} />
      <Route path="/botanique-critique" component={BotaniqueCritique} />
      <Route path="/varietes-fantomes" component={VarietesFantomes} />
      <Route path="/ghost-varieties-explorer" component={GhostVarietiesExplorer} />
      <Route path="/ghost-variety/new" component={GhostVarietyForm} />
      <Route path="/ghost-variety/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <GhostVarietyDetail />
          </Suspense>
        )}
      </Route>
      <Route path="/ghost-variety/:id/upload-image" component={GhostVarietyImageUpload} />
      <Route path="/recettes-leaf-economies" component={RecettesLeafEconomies} />
      <Route path="/terp-profiles" component={TerpProfiles} />
      <Route path="/terp-profiles/compare" component={TerpProfilesCompare} />
      <Route path="/plants" component={PlantsHub} />
      <Route path="/plantes" component={PlantsHub} />
      <Route path="/plants-legacy" component={Plants} />
      <Route path="/varietes" component={PlantsHub} />
      <Route path="/plant-varieties" component={PlantsHub} />
      <Route path="/plantes-varietes" component={PlantsHub} />
      <Route path="/varietes-legacy" component={PlantVarieties} />
      <Route path="/varietes/new" component={VarietyForm} />
      <Route path="/varietes/:id" component={VarietyDetail} />
      <Route path="/genealogy" component={GenealogyGraph} />
      <Route path="/arbre-genealogique" component={GenealogyGraph} />
      <Route path="/plantes-varietes/new" component={VarietyForm} />
      <Route path="/carte-varietes" component={CarteVarietes} />
      <Route path="/carte-origines" component={CarteVarietes} />
      <Route path="/chemotypes" component={Chemotypes} />
      <Route path="/phylogenetique" component={PhylogeneticView} />
      <Route path="/phylogenetic" component={PhylogeneticView} />
      <Route path="/famille/:name" component={FamilyDetail} />
      <Route path="/smiles" component={SmilesViewer} />
      <Route path="/structures" component={SmilesViewer} />
      <Route path="/enrichissement" component={EnrichmentDashboard} />
      <Route path="/enrichment" component={EnrichmentDashboard} />
      <Route path="/ifra" component={IFRACompliance} />
      <Route path="/conformite-ifra" component={IFRACompliance} />
      <Route path="/percepts" component={PerceptSearch} />
      <Route path="/recherche-percepts" component={PerceptSearch} />
      <Route path="/stats-olfactives" component={OlfactiveStats} />
      <Route path="/statistiques" component={OlfactiveStats} />
      <Route path="/plants/new" component={PlantForm} />
      <Route path="/plants/:id/edit" component={PlantForm} />
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
            <PlantDetail />
          </Suspense>
        )}
      </Route>
      <Route path="/plantes/:id">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <PlantDetail />
          </Suspense>
        )}
      </Route>
      <Route path="/final-recipes" component={FinalRecipes} />
      <Route path="/recettes-finales" component={FinalRecipes} />
      <Route path="/final-recipes/:id" component={FinalRecipeDetail} />
      <Route path="/recettes-finales/:id" component={FinalRecipeDetail} />
      <Route path="/terroirs" component={PlantsHub} />
      <Route path="/terroirs-legacy" component={Terroirs} />
      <Route path="/terroirs/:id" component={TerroirDetail} />
      <Route path="/chemotypes" component={ChemotypesExplorer} />
      <Route path="/methodes-analytiques" component={AnalyticalMethodsPage} />
      <Route path="/analytical-methods" component={AnalyticalMethodsPage} />
      <Route path="/origines-geographiques" component={OriginesGeographiques} />
      <Route path="/extraction-methods" component={ExtractionMethods} />
      <Route path="/methodes-extraction" component={ExtractionMethods} />
      <Route path="/comparaison-extractions" component={ComparaisonExtractions} />
      <Route path="/he-absolue-co2" component={ComparaisonExtractions} />
      
      {/* === MATIÈRES PREMIÈRES & RELATIONS === */}
      <Route path="/matieres-premieres" component={MatieresPremieres} />
      <Route path="/matieres-premieres/nouvelle" component={RawMaterialForm} />
      <Route path="/matieres-premieres/:id" component={MatierePremierePage} />
      <Route path="/raw-materials" component={RawMaterials} />
      <Route path="/raw-materials/:id" component={RawMaterialDetail} />
      <Route path="/relations-molecule-plante" component={MoleculePlantRelations} />
      <Route path="/molecule-plant-relations" component={MoleculePlantRelations} />
      
      {/* === CIVILISATIONS & TRADITIONS === */}
      <Route path="/civilisations" component={Civilisations} />
      <Route path="/civilisation/:id" component={CivilisationDetail} />
      <Route path="/installations" component={Installations} />
      
      {/* === TABACS & ASSOCIATIONS === */}
      <Route path="/tabacs-resines" component={TabacsResines} />
      <Route path="/tabacs-naturels" component={TabacsNaturels} />
      <Route path="/tabacs-originaux" component={TabacsOriginaux} />
      <Route path="/associations" component={Associations} />
      <Route path="/fournisseurs" component={Fournisseurs} />
      
      {/* === DASHBOARDS === */}
      <Route path="/dashboard" component={DashboardMinimal} />
      <Route path="/dashboard/recherche" component={DashboardRecherche} />
      <Route path="/analytics" component={AnalyticsDashboard} />
      <Route path="/analytics/advanced" component={AnalyticsDashboardAdvanced} />
      <Route path="/mon-dashboard" component={MonDashboard} />
      <Route path="/statistiques" component={Statistics} />
 <LazyRoute path="/recherche" component={RechercheAvancee} />
      <Route path="/recherche-profil-moleculaire" component={RechercheProfilMoleculaire} />
      {/* Route /recherche-avancee déjà définie ligne 364 avec RechercheAvancee */}
      <Route path="/recherche-croisee" component={CrossSearch} />
      <Route path="/timeline-recettes" component={RecipeTimeline} />
      <Route path="/heatmap-correlations" component={RadarCorrelationHeatmap} />
      
      {/* === UTILISATEUR === */}
      <Route path="/favoris" component={Favoris} />
      <Route path="/mes-favoris" component={MyFavorites} />
      <Route path="/reseau" component={Reseau} />
      <Route path="/reseau-molecules-plantes" component={ReseauMoleculePlante} />
      <Route path="/reseau-plantes-molecules" component={PlantMoleculeNetwork} />
      <Route path="/reseau-plantes-terroirs" component={PlantTerroirNetwork} />
      <Route path="/carte-terroirs-plantes" component={CarteTerroirsPlantes} />
      <Route path="/graphe-terroir-plante-molecule" component={GrapheTerroirPlanteMolecule} />
      <Route path="/graphe-molecules-familles-chimiques" component={GrapheMoleculesFamillesChimiques} />
      <Route path="/vue-connexions" component={VueDetailConnexions} />
      <Route path="/graphe-axes-thematiques" component={GrapheAxesThematiques} />
      {/* Alias court */}
      <Route path="/axes-thematiques" component={GrapheAxesThematiques} />
      <Route path="/graphe-references-axes" component={GrapheReferencesAxes} />
      <Route path="/references-graph" component={ReferencesGraph} />
      <Route path="/carte-interactive-terroirs" component={CarteInteractiveTerroirs} />
      <Route path="/carte-terroirs" component={TerroirMapPage} />
      <Route path="/parcours-olfactif">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <ParcoursOlfactif />
          </Suspense>
        )}
      </Route>
      <Route path="/parcours/:code" component={ParcoursDetail} />
      <Route path="/bio-mineralis" component={BioMineralis} />
      <Route path="/admin/duplicates" component={AdminDuplicates} />
      
      
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
