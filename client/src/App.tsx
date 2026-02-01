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
import { GlobalSearch } from "@/components/GlobalSearch";
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
import { AbsorbeXDashboard } from "./pages/AbsorbeXDashboard";
import { AbsorbeXManifeste } from "./pages/AbsorbeXManifeste";
import { AbsorbeXNotesRecherche } from "./pages/AbsorbeXNotesRecherche";
import { AbsorbeXQuantique } from "./pages/AbsorbeXQuantique";
import { AbsorbeXPatrimoine } from "./pages/AbsorbeXPatrimoine";
import { AbsorbeXNeuroOlfaction } from "./pages/AbsorbeXNeuroOlfaction";
import { AbsorbeXOdeursPerdues } from "./pages/AbsorbeXOdeursPerdues";
import { AbsorbeXGuideLaboratoire } from '@/pages/AbsorbeXGuideLaboratoire';
import AromaticRarities from '@/pages/AromaticRarities';
import AromaticRarityDetailPage from '@/pages/AromaticRarityDetailPage';
import ClaimsAndProofs from '@/pages/ClaimsAndProofs';
import { Tabacotheque } from '@/pages/Tabacotheque';
import { ClaimsAndProofsPage } from '@/pages/ClaimsAndProofsPage';

// === PAGES PRINCIPALES ===
import Home from "./pages/Home";
import SystemePerfumum from "./pages/SystemePerfumum";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import Nouveautes from "./pages/Nouveautes";
import LeProjet from "./pages/LeProjet";

// === ADMINISTRATION ===
import Admin from "./pages/Admin";

// import AdminMolecules from "./pages/AdminMolecules"; // Non utilisé - AdminMoleculesIndex est utilisé à la place
import AdminMoleculeNew from "./pages/AdminMoleculeNew";
import AdminRecettes from "./pages/AdminRecettes";
import AdminImportExport from "./pages/AdminImportExport";
import ImportExportPlants from "./pages/ImportExportPlants";
import ImportCSV from "./pages/ImportCSV";
import ImportCSVPreview from "./pages/ImportCSVPreview";
import AdminHistorique from "./pages/AdminHistorique";
import AdminReferences from "./pages/AdminReferences";
import LiaisonRecettesMolecules from "./pages/admin/LiaisonRecettesMolecules";
import MoleculeOriginsAdmin from "./pages/admin/MoleculeOriginsAdmin";
import TerroirsGeocode from "./pages/admin/TerroirsGeocode";
import AdminMoleculesIndex from "./pages/admin/AdminMoleculesIndex";
import AdminAccords from "./pages/admin/AdminAccords";
import AdminFamilles from "./pages/admin/AdminFamilles";
import AdminMatieres from "./pages/admin/AdminMatieres";
import MoleculeRecetteLinking from "./pages/MoleculeRecetteLinking";
import MoleculeRecetteAudit from "./pages/MoleculeRecetteAudit";
import MoleculeRecetteDragDrop from "./pages/MoleculeRecetteDragDrop";
import MoleculeRecetteImportCSV from "./pages/MoleculeRecetteImportCSV";
import PlantTerroirLinking from "./pages/PlantTerroirLinking";
import PlantTerroirAudit from "./pages/PlantTerroirAudit";
import PlantTerroirDragDrop from "./pages/PlantTerroirDragDrop";
import PlantTerroirImportCSV from "./pages/PlantTerroirImportCSV";
import PlantMoleculeAudit from "./pages/PlantMoleculeAudit";
import LinkingDashboard from "./pages/LinkingDashboard";
import AdminValidation from "./pages/AdminValidation";
import AdminChemicalFamilyLinking from "./pages/AdminChemicalFamilyLinking";
import ChemicalFamilyGraph from "./pages/ChemicalFamilyGraph";
import EditeurFormulation from "./pages/outils/EditeurFormulation";
import AdminOrphanMolecules from "./pages/AdminOrphanMolecules";
import AdminAIClassification from "./pages/AdminAIClassification";
import AIClassificationBatch from "./pages/AIClassificationBatch";
import NichePlantMoleculeLinking from "./pages/NichePlantMoleculeLinking";
import ClassificationReviewQueue from "./pages/ClassificationReviewQueue";
import AdminNotifications from "./pages/AdminNotifications";
import AdminProgressReport from "./pages/AdminProgressReport";

// === PROTOTYPES ===
import Prototypes from "./pages/Prototypes";
import PrototypeDetail from "./pages/PrototypeDetail";
import C1Fermentum from "./pages/prototypes/C1";
import C2ClarusVerde from "./pages/prototypes/C2";
import C3LactaSolis from "./pages/prototypes/C3";
import C4TerraAmbra from "./pages/prototypes/C4";

// === GAMMES ===
import Gammes from "./pages/Gammes";
import GammesPetrichor from "@/pages/GammesPetrichor";
import GammesVolcanique from "@/pages/GammesVolcanique";
import GammesGlaciaire from "@/pages/GammesGlaciaire";
import GammesBioLab from "@/pages/GammesBioLab";
import GammesMossi from "./pages/GammesMossi";
import GammesHub from "./pages/GammesHub";
import GammeSignatures from "./pages/GammeSignatures";
import GammePheromones from "./pages/GammePheromones";
import GammeRaretes from "./pages/GammeRaretes";
import ColombieLine from '@/pages/ColombieLine';
import RecetteColombie from '@/pages/RecetteColombie';
import SourcingColombie from '@/pages/SourcingColombie';
import Sourcing from '@/pages/Sourcing';
import SourcingFrance from '@/pages/SourcingFrance';
import SourcingInde from '@/pages/SourcingInde';
import SourcingMadagascar from '@/pages/SourcingMadagascar';
import SourcingNorthAmerica from '@/pages/SourcingNorthAmerica';

// === LABORATOIRE ===
import Laboratoire from "./pages/Laboratoire";
import LaboratoireRecettes from "./pages/LaboratoireRecettes";
import MatriceInteractive from "@/pages/MatriceInteractive";
import Statistiques from "@/pages/Statistiques";
import Inventaire from "./pages/Inventaire";

// === MOLÉCULES (Lazy loaded for performance) ===
import Molecules from "./pages/Molecules";
const MoleculeDetail = lazy(() => import("./pages/MoleculeDetail"));
import TerpeneDetail from "./pages/TerpeneDetail";
import Familles from "./pages/Familles";
import FamillesList from "./pages/FamillesList";
import { ChemicalFamilies } from "./pages/ChemicalFamilies";
import MoleculesHub from "./pages/MoleculesHub";


// === RECETTES (Lazy loaded for performance) ===
import Recettes from "./pages/Recettes";
const RecetteDetail = lazy(() => import("./pages/RecetteDetail"));
import Accords from "./pages/Accords";
import RecettesHub from "./pages/RecettesHub";

import AccordsDedies from "./pages/AccordsDedies";
import { ExperimentalAccords } from "./pages/ExperimentalAccords";
import RechercheRadicale from "@/pages/RechercheRadicale";
import RecettesTL from "./pages/RecettesTL";
import FondementsPhilosophiques from "@/pages/FondementsPhilosophiques";

// === RÉSINES CBD ===
import ResinesCBD from "@/pages/ResinesCBD";
import RecetteCBDDetail from "@/pages/RecetteCBDDetail";
import ProtocolesMaturation from "./pages/ProtocolesMaturation";

// === COMPARAISON & VISUALISATION ===
import Compare from "./pages/Compare";
import CompareTerpenes from "./pages/CompareTerpenes";
import CompareRadar from "./pages/CompareRadar";
import CompareRecettes from "./pages/CompareRecettes";
import CompareMoleculesAdvanced from "./pages/CompareMoleculesAdvanced";
import ComparaisonMolecules from "@/pages/ComparaisonMolecules";
import ComparePlants from "./pages/ComparePlants";
import ComparateurAvance from "@/pages/ComparateurAvance";
import MatriceSynergies from "./pages/MatriceSynergies";
import GrapheMoleculesRecettes from "@/pages/GrapheMoleculesRecettes";
import GraphePlanteMolecule from "@/pages/GraphePlanteMolecule";
import SynergiesPage from "./pages/SynergiesPage";
import SuggestionsSynergies from "./pages/SuggestionsSynergies";
import { SynergiesHeatmap } from "./pages/SynergiesHeatmap";
import { RecipeNetworkPage } from "./pages/RecipeNetworkPage";
import SankeyFlow from "./pages/SankeyFlow";
import EnhancedRadarDemo from "./pages/EnhancedRadarDemo";
import AdvancedSearch from "./pages/AdvancedSearch";
import CrossSearch from "./pages/CrossSearch";
const RechercheAvancee = lazy(() => import("./pages/RechercheAvancee"));
import RechercheProfilMoleculaire from "./pages/RechercheProfilMoleculaire";
import RecipeTimeline from "./pages/RecipeTimeline";
import FormulesReference from "./pages/FormulesReference";
import RadarCorrelationHeatmap from "./pages/RadarCorrelationHeatmap";

// === OUTILS ===
import OutilsFormulation from "./pages/OutilsFormulation";
import ProportionsCalculator from "./pages/ProportionsCalculator";
import DilutionCalculator from "./pages/DilutionCalculator";
import CorrelationAnalysis from "./pages/CorrelationAnalysis";
import { AbsorbeScale } from "@/pages/AbsorbeScale";
import EnrichissementPubChem from "./pages/EnrichissementPubChem";
import CarteOrigines from "./pages/CarteOrigines";
import CarteTerroirsRecherche from "./pages/CarteTerroirsRecherche";
import CartePlantesGPS from "./pages/CartePlantesGPS";
import VisualisationsCorrelation from "./pages/VisualisationsCorrelation";
import ExportBibliographique from "./pages/ExportBibliographique";

// === RECHERCHE SCIENTIFIQUE ===
import { RechercheScientifique } from "./pages/RechercheScientifique";
import SynergiesMoleculaires from "./pages/SynergiesMoleculaires";
import { PyrolyseCombustion } from "./pages/PyrolyseCombustion";
import { CourbesVolatilite } from "@/pages/CourbesVolatilite";
import { DegradationTerpenes } from "@/pages/DegradationTerpenes";
import { ModelesAnalytiquesGCMS } from "@/pages/ModelesAnalytiquesGCMS";
import SynergiesTerpenesNiches from "./pages/SynergiesTerpenesNiches";
import SynergiesGraphVisualization from "./pages/SynergiesGraphVisualization";
import ChimieTabac from "./pages/ChimieTabac";
import InteractionsTabacCannabis from "./pages/InteractionsTabacCannabis";
import ComparaisonTerpenes from "./pages/ComparaisonTerpenes";
import OutilFormulation from "./pages/OutilFormulation";
import ResearchData from "./pages/ResearchData";

// === PROGRAMMES DE RECHERCHE ===
import ProgrammesRecherche from "@/pages/ProgrammesRecherche";
import TabacsNiche from "@/pages/TabacsNiche";

// === JOURNAL & MÉTHODOLOGIE ===
import Journal from "./pages/Journal";

// === MÉTHODOLOGIE ===
import MethodeAbsorbe from "./pages/MethodeAbsorbe";
import MethodologieAbsorbe from "@/pages/methodologie/MethodologieAbsorbe";
import { MethodologieRecherche } from "@/pages/MethodologieRecherche";
import GenerateurFormules from "./pages/GenerateurFormules";
import HistoriqueFormules from "./pages/HistoriqueFormules";
import EchelleAbsorbe from "./pages/methodologie/EchelleAbsorbe";
import Pyrolyse from "./pages/methodologie/Pyrolyse";
import GCMS from "./pages/methodologie/GCMS";

// === CONTENU ÉDITORIAL ===
import Etudes from "./pages/Etudes";
import EtudesClimatiques from "./pages/EtudesClimatiques";
import EtudeClimatiqueDetail from "./pages/EtudeClimatiqueDetail";
import ArchivesTerrain from "./pages/ArchivesTerrain";
import ArchiveTerrainDetail from "./pages/ArchiveTerrainDetail";
import ProtocolesMoleculaires from "./pages/ProtocolesMoleculaires";
import ProtocoleMoleculaireDetail from "./pages/ProtocoleMoleculaireDetail";
import TestsExtraction from "./pages/TestsExtraction";
import TestExtractionDetail from "./pages/TestExtractionDetail";
import OdeursSituees from "./pages/OdeursSituees";
import OdeurSitueeDetail from "./pages/OdeurSitueeDetail";
import Projets from "./pages/Projets";
import Terrains from "./pages/Terrains";
import BibliographiePage from "./pages/BibliographiePage";
// Lazy-loaded: BibliographieGlobale (1129 lignes)
const BibliographieGlobale = lazy(() => import("./pages/BibliographieGlobale"));
import ReferencesV3 from "./pages/ReferencesV3";
import ReferenceEntityLinkManager from "./pages/ReferenceEntityLinkManager";
import BulkImportReferences from "./pages/BulkImportReferences";
import ReferenceLinkNetwork from "./pages/ReferenceLinkNetwork";
import SuggestReferenceLinks from "./pages/SuggestReferenceLinks";
import Visualisations from "./pages/Visualisations";
import Bibliographie from "./pages/Bibliographie";
import HeritageConservation from "./pages/HeritageConservation";
import H2LinkingInterface from "./pages/H2LinkingInterface";
import H3LinkingInterface from "./pages/H3LinkingInterface";
import GenomicsExplorer from "./pages/GenomicsExplorer";
import AxesRecherche from "./pages/AxesRecherche";
// Lazy-loaded: AxeRechercheDetail (1117 lignes)
const AxeRechercheDetail = lazy(() => import("./pages/AxeRechercheDetail"));
import ReseauAxes from "./pages/ReseauAxes";
import RelationsGraph from "./pages/RelationsGraph";
import GestionPage from "./pages/GestionPage";
import LeafEconomies from "./pages/LeafEconomies";
import LeafEconomyDetail from "./pages/LeafEconomyDetail";
import LeafEconomyForm from "./pages/LeafEconomyForm";
import TimelineBotanique from "./pages/TimelineBotanique";
import BotaniqueCritique from "./pages/BotaniqueCritique";
import VarietesFantomes from "./pages/VarietesFantomes";
import GhostVarietiesExplorer from "./pages/GhostVarietiesExplorer";
import GhostVarietyForm from "./pages/GhostVarietyForm";
// Lazy-loaded: GhostVarietyDetail (1197 lignes)
const GhostVarietyDetail = lazy(() => import("./pages/GhostVarietyDetail"));
import GhostVarietyImageUpload from "./pages/GhostVarietyImageUpload";
import RecettesLeafEconomies from "./pages/RecettesLeafEconomies";
import TerpProfiles from "./pages/TerpProfiles";
import TerpProfilesCompare from "./pages/TerpProfilesCompare";
import Plants from "./pages/Plants";
import PlantVarieties from "./pages/PlantVarieties";
import PhylogeneticView from "./pages/PhylogeneticView";
import FamilyDetail from "./pages/FamilyDetail";
import SmilesViewer from "./pages/SmilesViewer";
import EnrichmentDashboard from "./pages/EnrichmentDashboard";
import IFRACompliance from "./pages/IFRACompliance";
import PerceptSearch from "./pages/PerceptSearch";
import OlfactiveStats from "./pages/OlfactiveStats";
import PlantsHub from "./pages/PlantsHub";
import Chemotypes from "./pages/Chemotypes";
import FinalRecipes from "./pages/FinalRecipes";
// Lazy-loaded: PlantDetail (1057 lignes)
const PlantDetail = lazy(() => import("./pages/PlantDetail"));
import PlantForm from "./pages/PlantForm";
import VarietyForm from "./pages/VarietyForm";
import VarietyDetail from "./pages/VarietyDetail";
import GenealogyGraph from "./pages/GenealogyGraph";
import CarteVarietes from "./pages/CarteVarietes";
import Terroirs from "./pages/Terroirs";
import TerroirDetail from "./pages/TerroirDetail";
import ChemotypesExplorer from "./pages/ChemotypesExplorer";
import AnalyticalMethodsPage from "./pages/AnalyticalMethodsPage";
import OriginesGeographiques from "./pages/OriginesGeographiques";
import ExtractionMethods from "./pages/ExtractionMethods";
import ComparaisonExtractions from "./pages/ComparaisonExtractions";
import Collaborations from "./pages/Collaborations";
import Archives from "./pages/Archives";
import Outils from "./pages/Outils";
import OutilsHub from "./pages/OutilsHub";
import PatrimoineMenace from './pages/PatrimoineMenace';
import AlternativesDurables from './pages/AlternativesDurables';
import ArchivesOlfactives from "./pages/ArchivesOlfactives";
import { Glossaire } from "./pages/Glossaire";
import GlossaireVisuelRadar from "./pages/GlossaireVisuelRadar";
import Contribuer from "./pages/Contribuer";
import ContributorInterface from "./pages/ContributorInterface";
import SimplifiedContributorForm from "./pages/SimplifiedContributorForm";
import CoverageGoalDashboard from "./pages/CoverageGoalDashboard";
// Lazy-loaded: CSVValidationImport (1067 lignes)
const CSVValidationImport = lazy(() => import("./pages/CSVValidationImport"));
import PlantMoleculeLinking from "./pages/PlantMoleculeLinking";
import Manifeste from "./pages/Manifeste";
import { Timeline } from "./pages/Timeline";
import TimelineInteractive from "./pages/TimelineInteractive";
import ComparaisonAvancee from "./pages/ComparaisonAvancee";
import TimelinePerfumum from "./pages/TimelinePerfumum";
// import GalerieBotaniques from "./pages/GalerieBotaniques"; // Maintenant intégré dans Plants.tsx
import Gallery from "./pages/Gallery";
import BatchImport from "./pages/BatchImport";
import Ifra from "./pages/Ifra";

// === CIVILISATIONS & TRADITIONS ===
import Civilisations from "./pages/Civilisations";
import CivilisationDetail from "./pages/CivilisationDetail";
import Installations from "./pages/Installations";

// === TABACS & ASSOCIATIONS ===
import TabacsResines from "./pages/TabacsResines";
import Associations from "./pages/Associations";
import Fournisseurs from "./pages/Fournisseurs";
import CalculateurCout from "./pages/CalculateurCout";

// === DASHBOARDS ===
import { DashboardMinimal } from "./pages/DashboardMinimal";
import DashboardRecherche from "./pages/DashboardRecherche";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import AnalyticsDashboardAdvanced from "./pages/AnalyticsDashboardAdvanced";
import MonDashboard from "./pages/MonDashboard";
import Statistics from "./pages/Statistics";
import Recherche from "./pages/Recherche";
import RechercheGlobale from "./pages/RechercheGlobale";

// === UTILISATEUR ===
import Favoris from "./pages/Favoris";
import { MyFavorites } from "./pages/MyFavorites";
import Reseau from "./pages/Reseau";
import ReseauMoleculePlante from "./pages/ReseauMoleculePlante";
import PlantMoleculeNetwork from "./pages/PlantMoleculeNetwork";
import BioMineralis from "./pages/BioMineralis";

// === MATIÈRES PREMIÈRES & RELATIONS ===
import RawMaterials from "./pages/RawMaterials";
import RawMaterialDetail from "./pages/RawMaterialDetail";
import RawMaterialForm from "./pages/RawMaterialForm";
import MoleculePlantRelations from "./pages/MoleculePlantRelations";
import PlantTerroirNetwork from "./pages/PlantTerroirNetwork";
import CarteTerroirsPlantes from "./pages/CarteTerroirsPlantes";
import GrapheTerroirPlanteMolecule from "./pages/GrapheTerroirPlanteMolecule";
import GrapheMoleculesFamillesChimiques from "./pages/GrapheMoleculesFamillesChimiques";
import VueDetailConnexions from "./pages/VueDetailConnexions";
import GrapheAxesThematiques from "./pages/GrapheAxesThematiques";
import GrapheReferencesAxes from "./pages/GrapheReferencesAxes";
import ReferencesGraph from "./pages/ReferencesGraph";
import CarteInteractiveTerroirs from "./pages/CarteInteractiveTerroirs";
import TerroirMapPage from "./pages/TerroirMapPage";
// Lazy-loaded: ParcoursOlfactif (1294 lignes)
const ParcoursOlfactif = lazy(() => import("./pages/ParcoursOlfactif"));
import ParcoursDetail from "./pages/ParcoursDetail";
import PeriqueCompounds from "./pages/PeriqueCompounds";
import HistoricCigarettes from "./pages/HistoricCigarettes";
import TpsGenesExplorer from "./pages/TpsGenesExplorer";
import MolecularTransformations from "./pages/MolecularTransformations";
import TobaccoLandraces from "./pages/TobaccoLandraces";
import TobaccoLandraceDetail from "./pages/TobaccoLandraceDetail";
import SoilAnalysis from "./pages/SoilAnalysis";
import BiosyntheticPathways from "./pages/BiosyntheticPathways";
import PyrolysisVisualization from "./pages/PyrolysisVisualization";
import TerpeneProfiles from "./pages/TerpeneProfiles";
import PeriqueFermentation from "./pages/PeriqueFermentation";
import LandraceComparator from "./pages/LandraceComparator";
import GCMSChromatograms from "./pages/GCMSChromatograms";
import CompoundSearch from "./pages/CompoundSearch";
import MSSpectraViewer from "./pages/MSSpectraViewer";
import SpectraComparison from "./pages/SpectraComparison";
import SpectraIdentification from "./pages/SpectraIdentification";
import AnalysisHub from "./pages/AnalysisHub";
import RawMaterialsInventory from "./pages/RawMaterialsInventory";
import InventoryDashboard from "./pages/InventoryDashboard";
import PublicationMoleculeGraph from "./pages/PublicationMoleculeGraph";

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
      <Route path="/admin/niche-plant-linking" component={NichePlantMoleculeLinking} />
      <Route path="/admin/classification-review" component={ClassificationReviewQueue} />
      <Route path="/admin/notifications" component={AdminNotifications} />
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
      <Route path="/absorbe-x/guide-laboratoire" component={AbsorbeXGuideLaboratoire} />
      
      {/* === TABACOTHÈQUE === */}
      <Route path="/tabacotheque" component={Tabacotheque} />
      <Route path="/perique-compounds" component={PeriqueCompounds} />
      <Route path="/historic-cigarettes" component={HistoricCigarettes} />
      <Route path="/tobacco-landraces" component={TobaccoLandraces} />
      <Route path="/tobacco-landrace/:name" component={TobaccoLandraceDetail} />
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
      
      {/* === LABORATOIRE === */}
      <Route path="/laboratoire" component={Laboratoire} />
      <Route path="/laboratoire/recettes" component={LaboratoireRecettes} />
      <Route path="/laboratoire/matrice-interactive" component={MatriceInteractive} />
      <Route path="/laboratoire/statistiques" component={Statistiques} />
      <Route path="/inventaire" component={Inventaire} />
      
      {/* === MOLÉCULES (Consolidé) === */}
      <Route path="/molecules-hub" component={MoleculesHub} />
      <Route path="/molecules" component={Molecules} />
      {/* Lazy-loaded detail pages */}
      <Route path="/molecule/:id">
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
      <Route path="/matieres-premieres" component={RawMaterials} />
      <Route path="/matieres-premieres/nouvelle" component={RawMaterialForm} />
      <Route path="/matieres-premieres/:id" component={RawMaterialDetail} />
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
      
      
      {/* === ERREURS === */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
            <GlobalSearch />
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
