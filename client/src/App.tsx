import { Toaster } from "@/components/ui/sonner";
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
import { PageTransition } from "./components/PageTransition";

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

// === MOLÉCULES ===
import Molecules from "./pages/Molecules";
import MoleculeDetail from "./pages/MoleculeDetail";
import TerpeneDetail from "./pages/TerpeneDetail";
import Familles from "./pages/Familles";
import FamillesList from "./pages/FamillesList";
import { ChemicalFamilies } from "./pages/ChemicalFamilies";
import MoleculesHub from "./pages/MoleculesHub";
import { RedirectToFamilles, RedirectToChemicalFamilies, RedirectToChemicalFamilyGraph } from "./components/LegacyRedirect";

// === RECETTES ===
import Recettes from "./pages/Recettes";
import RecetteDetail from "./pages/RecetteDetail";
import Accords from "./pages/Accords";
import RecettesHub from "./pages/RecettesHub";
import { RedirectToAccords, RedirectToFormulesReference } from "./components/LegacyRedirect";
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
import RechercheAvancee from "./pages/RechercheAvancee";
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
import BibliographieGlobale from "./pages/BibliographieGlobale";
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
import AxeRechercheDetail from "./pages/AxeRechercheDetail";
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
import GhostVarietyDetail from "./pages/GhostVarietyDetail";
import GhostVarietyImageUpload from "./pages/GhostVarietyImageUpload";
import RecettesLeafEconomies from "./pages/RecettesLeafEconomies";
import TerpProfiles from "./pages/TerpProfiles";
import TerpProfilesCompare from "./pages/TerpProfilesCompare";
import Plants from "./pages/Plants";
import PlantVarieties from "./pages/PlantVarieties";
import Chemotypes from "./pages/Chemotypes";
import FinalRecipes from "./pages/FinalRecipes";
import PlantDetail from "./pages/PlantDetail";
import PlantForm from "./pages/PlantForm";
import VarietyForm from "./pages/VarietyForm";
import VarietyDetail from "./pages/VarietyDetail";
import CarteVarietes from "./pages/CarteVarietes";
import Terroirs from "./pages/Terroirs";
import TerroirDetail from "./pages/TerroirDetail";
import OriginesGeographiques from "./pages/OriginesGeographiques";
import ExtractionMethods from "./pages/ExtractionMethods";
import Collaborations from "./pages/Collaborations";
import Archives from "./pages/Archives";
import Outils from "./pages/Outils";
import PatrimoineMenace from './pages/PatrimoineMenace';
import AlternativesDurables from './pages/AlternativesDurables';
import ArchivesOlfactives from "./pages/ArchivesOlfactives";
import { Glossaire } from "./pages/Glossaire";
import GlossaireVisuelRadar from "./pages/GlossaireVisuelRadar";
import Contribuer from "./pages/Contribuer";
import ContributorInterface from "./pages/ContributorInterface";
import SimplifiedContributorForm from "./pages/SimplifiedContributorForm";
import CoverageGoalDashboard from "./pages/CoverageGoalDashboard";
import CSVValidationImport from "./pages/CSVValidationImport";
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
import ParcoursOlfactif from "./pages/ParcoursOlfactif";
import ParcoursDetail from "./pages/ParcoursDetail";




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
      <Route path="/recherche-avancee" component={RechercheAvancee} />
      <Route path="/recherche-globale" component={RechercheGlobale} />
      
      {/* === PROJET === */}
      <Route path="/le-projet" component={LeProjet} />
      <Route path="/manifeste" component={Manifeste} />
      <Route path="/a-propos" component={APropos} />
      <Route path="/contact" component={Contact} />
      <Route path="/nouveautes" component={Nouveautes} />
      <Route path="/projet/timeline" component={TimelinePerfumum} />
      
      {/* === PROTOTYPES === */}
      <Route path="/prototypes" component={Prototypes} />
      <Route path="/prototypes/c1" component={C1Fermentum} />
      <Route path="/prototypes/c2" component={C2ClarusVerde} />
      <Route path="/prototypes/c3" component={C3LactaSolis} />
      <Route path="/prototypes/c4" component={C4TerraAmbra} />
      <Route path="/prototypes/:code" component={PrototypeDetail} />
      
      {/* === GAMMES === */}
      <Route path="/gammes" component={Gammes} />
      <Route path="/colombie" component={ColombieLine} />
      <Route path="/recette/colombie/:id" component={RecetteColombie} />
      <Route path="/sourcing" component={Sourcing} />
      <Route path="/sourcing/colombie" component={SourcingColombie} />
      <Route path="/sourcing/france" component={SourcingFrance} />
      <Route path="/sourcing/inde" component={SourcingInde} />
      <Route path="/sourcing/madagascar" component={SourcingMadagascar} />
      <Route path="/sourcing/north-america" component={SourcingNorthAmerica} />
      <Route path="/gammes/petrichor" component={GammesPetrichor} />
      <Route path="/gammes/volcanique" component={GammesVolcanique} />
      <Route path="/gammes/glaciaire" component={GammesGlaciaire} />
      <Route path="/gammes/biolab" component={GammesBioLab} />
      <Route path="/gammes/mossi" component={GammesMossi} />
      <Route path="/gammes/signatures" component={GammeSignatures} />
      <Route path="/gammes/pheromones" component={GammePheromones} />
      <Route path="/gammes/raretes" component={GammeRaretes} />
      
      {/* === LABORATOIRE === */}
      <Route path="/laboratoire" component={Laboratoire} />
      <Route path="/laboratoire/recettes" component={LaboratoireRecettes} />
      <Route path="/laboratoire/matrice-interactive" component={MatriceInteractive} />
      <Route path="/laboratoire/statistiques" component={Statistiques} />
      <Route path="/inventaire" component={Inventaire} />
      
      {/* === MOLÉCULES (Consolidé) === */}
      <Route path="/molecules-hub" component={MoleculesHub} />
      <Route path="/molecules" component={Molecules} />
      <Route path="/molecule/:id" component={MoleculeDetail} />
      <Route path="/terpene/:id" component={TerpeneDetail} />
      {/* Anciennes routes redirigées vers MoleculesHub */}
      <Route path="/familles" component={Familles} />
      <Route path="/familles/list" component={FamillesList} />
      <Route path="/chemical-families" component={ChemicalFamilies} />
      
      {/* === RECETTES === */}
      <Route path="/recettes" component={RecettesHub} />
      <Route path="/recettes-tl" component={RecettesTL} />
      <Route path="/recette/:id" component={RecetteDetail} />
      {/* Anciennes routes redirigées vers RecettesHub */}
      <Route path="/accords" component={RedirectToAccords} />
      <Route path="/formules-reference" component={RedirectToFormulesReference} />
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
      <Route path="/outils-formulation" component={OutilsFormulation} />
      <Route path="/calculateur" component={ProportionsCalculator} />
      <Route path="/outils/dilution" component={DilutionCalculator} />
      <Route path="/outils/calculateur-cout" component={CalculateurCout} />
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
      <Route path="/bibliographie-globale" component={BibliographieGlobale} />
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
      <Route path="/axes-recherche" component={AxesRecherche} />
      <Route path="/axes-recherche/:code" component={AxeRechercheDetail} />
      <Route path="/reseau-axes" component={ReseauAxes} />
      <Route path="/gestion" component={GestionPage} />
      <Route path="/collaborations" component={Collaborations} />
      <Route path="/archives" component={Archives} />
      <Route path="/patrimoine-menace" component={PatrimoineMenace} />
      <Route path="/alternatives-durables" component={AlternativesDurables} />
      <Route path="/archives-olfactives" component={ArchivesOlfactives} />
      <Route path="/outils" component={Outils} />
      <Route path="/glossaire" component={Glossaire} />
      <Route path="/glossaire-visuel-radar" component={GlossaireVisuelRadar} />
      <Route path="/contribuer" component={Contribuer} />
      <Route path="/contributor" component={ContributorInterface} />
      <Route path="/contributor/add" component={ContributorInterface} />
      <Route path="/contributor/links" component={PlantMoleculeLinking} />
      <Route path="/contributor/simple" component={SimplifiedContributorForm} />
      <Route path="/coverage-goal" component={CoverageGoalDashboard} />
      <Route path="/csv-validation-import" component={CSVValidationImport} />
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
      <Route path="/ghost-variety/:id" component={GhostVarietyDetail} />
      <Route path="/ghost-variety/:id/upload-image" component={GhostVarietyImageUpload} />
      <Route path="/recettes-leaf-economies" component={RecettesLeafEconomies} />
      <Route path="/terp-profiles" component={TerpProfiles} />
      <Route path="/terp-profiles/compare" component={TerpProfilesCompare} />
      <Route path="/plants" component={Plants} />
      <Route path="/plantes" component={Plants} />
      <Route path="/varietes" component={PlantVarieties} />
      <Route path="/plant-varieties" component={PlantVarieties} />
      <Route path="/plantes-varietes" component={PlantVarieties} />
      <Route path="/varietes/new" component={VarietyForm} />
      <Route path="/varietes/:id" component={VarietyDetail} />
      <Route path="/plantes-varietes/new" component={VarietyForm} />
      <Route path="/carte-varietes" component={CarteVarietes} />
      <Route path="/carte-origines" component={CarteVarietes} />
      <Route path="/chemotypes" component={Chemotypes} />
      <Route path="/plants/new" component={PlantForm} />
      <Route path="/plants/:id/edit" component={PlantForm} />
      <Route path="/plants/:id" component={PlantDetail} />
      <Route path="/plantes/:id" component={PlantDetail} />
      <Route path="/final-recipes" component={FinalRecipes} />
      <Route path="/recettes-finales" component={FinalRecipes} />
      <Route path="/terroirs" component={Terroirs} />
      <Route path="/terroirs/:id" component={TerroirDetail} />
      <Route path="/origines-geographiques" component={OriginesGeographiques} />
      <Route path="/extraction-methods" component={ExtractionMethods} />
      <Route path="/methodes-extraction" component={ExtractionMethods} />
      
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
 <Route path="/recherche" component={RechercheAvancee} />
      <Route path="/recherche-profil-moleculaire" component={RechercheProfilMoleculaire} />
      {/* Route /recherche-avancee déjà définie ligne 364 avec RechercheAvancee */}
      <Route path="/recherche-croisee" component={CrossSearch} />
      <Route path="/timeline-recettes" component={RecipeTimeline} />
      <Route path="/heatmap-correlations" component={RadarCorrelationHeatmap} />
      
      {/* === UTILISATEUR === */}
      <Route path="/favoris" component={Favoris} />
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
      <Route path="/parcours-olfactif" component={ParcoursOlfactif} />
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
        <TooltipProvider>
          <Toaster />
          <GlobalSearch />
          <PageTransition>
            <Router />
          </PageTransition>
          <MobileBottomNav />
          <ScrollToTop />
          <PWAInstallPrompt />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
