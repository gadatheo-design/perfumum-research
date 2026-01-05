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

// === PAGES PRINCIPALES ===
import Home from "./pages/Home";
import SystemePerfumum from "./pages/SystemePerfumum";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import Nouveautes from "./pages/Nouveautes";
import LeProjet from "./pages/LeProjet";

// === ADMINISTRATION ===
import Admin from "./pages/Admin";
import TestTRPC from "./pages/TestTRPC";
import TestSimple from "./pages/TestSimple";
import TestRecetteCard from "./pages/TestRecetteCard";
import AdminMolecules from "./pages/AdminMolecules";
import AdminMoleculeNew from "./pages/AdminMoleculeNew";
import AdminRecettes from "./pages/AdminRecettes";
import AdminImportExport from "./pages/AdminImportExport";
import ImportExportPlants from "./pages/ImportExportPlants";
import AdminHistorique from "./pages/AdminHistorique";
import AdminReferences from "./pages/AdminReferences";
import LiaisonRecettesMolecules from "./pages/admin/LiaisonRecettesMolecules";
import MoleculeOriginsAdmin from "./pages/admin/MoleculeOriginsAdmin";
import TerroirsGeocode from "./pages/admin/TerroirsGeocode";
import EditeurFormulation from "./pages/outils/EditeurFormulation";

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

// === RECETTES ===
import Recettes from "./pages/Recettes";
import RecetteDetail from "./pages/RecetteDetail";
import Accords from "./pages/Accords";
import AccordsDedies from "./pages/AccordsDedies";
import { ExperimentalAccords } from "./pages/ExperimentalAccords";
import RechercheRadicale from "@/pages/RechercheRadicale";
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
import SynergiesPage from "./pages/SynergiesPage";
import SuggestionsSynergies from "./pages/SuggestionsSynergies";
import { SynergiesHeatmap } from "./pages/SynergiesHeatmap";
import { RecipeNetworkPage } from "./pages/RecipeNetworkPage";
import SankeyFlow from "./pages/SankeyFlow";
import EnhancedRadarDemo from "./pages/EnhancedRadarDemo";
import AdvancedSearch from "./pages/AdvancedSearch";
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
import GestionPage from "./pages/GestionPage";
import LeafEconomies from "./pages/LeafEconomies";
import LeafEconomyDetail from "./pages/LeafEconomyDetail";
import LeafEconomyForm from "./pages/LeafEconomyForm";
import TimelineBotanique from "./pages/TimelineBotanique";
import BotaniqueCritique from "./pages/BotaniqueCritique";
import VarietesFantomes from "./pages/VarietesFantomes";
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
import OriginesGeographiques from "./pages/OriginesGeographiques";
import ExtractionMethods from "./pages/ExtractionMethods";
import Collaborations from "./pages/Collaborations";
import Archives from "./pages/Archives";
import Outils from "./pages/Outils";
import { Glossaire } from "./pages/Glossaire";
import GlossaireVisuelRadar from "./pages/GlossaireVisuelRadar";
import Contribuer from "./pages/Contribuer";
import Manifeste from "./pages/Manifeste";
import { Timeline } from "./pages/Timeline";
import TimelinePerfumum from "./pages/TimelinePerfumum";
import GalerieBotaniques from "./pages/GalerieBotaniques";
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
import MonDashboard from "./pages/MonDashboard";
import Statistics from "./pages/Statistics";
import Recherche from "./pages/Recherche";
import RechercheGlobale from "./pages/RechercheGlobale";

// === UTILISATEUR ===
import Favoris from "./pages/Favoris";
import Reseau from "./pages/Reseau";
import ReseauMoleculePlante from "./pages/ReseauMoleculePlante";
import BioMineralis from "./pages/BioMineralis";

// === MATIÈRES PREMIÈRES & RELATIONS ===
import RawMaterials from "./pages/RawMaterials";
import RawMaterialDetail from "./pages/RawMaterialDetail";
import MoleculePlantRelations from "./pages/MoleculePlantRelations";

// === PAGES TECHNIQUES ===
import TestMinimal from "./pages/TestMinimal";


function Router() {
  return (
    <Switch>
      {/* === TEST === */}
      <Route path="/test-trpc" component={TestTRPC} />
      <Route path="/test-simple" component={TestSimple} />

      
      {/* === PAGES PRINCIPALES === */}
      <Route path="/" component={Home} />
      <Route path="/systeme" component={SystemePerfumum} /> 
      {/* === ADMINISTRATION === */}
      <Route path="/admin" component={Admin} />
      <Route path="/admin/liaison-recettes-molecules" component={LiaisonRecettesMolecules} />
      <Route path="/admin/molecule-origins" component={MoleculeOriginsAdmin} />
      <Route path="/admin/terroirs-geocode" component={TerroirsGeocode} />
      <Route path="/outils/editeur-formulation" component={EditeurFormulation} />
      <Route path="/admin/test-trpc" component={TestTRPC} />
      <Route path="/admin/test-simple" component={TestSimple} />
      <Route path="/test-recette-card" component={TestRecetteCard} />
      <Route path="/admin/molecules/new" component={AdminMoleculeNew} />
      <Route path="/admin/recettes" component={AdminRecettes} />
      <Route path="/admin/import-export" component={AdminImportExport} />
      <Route path="/admin/import-export-plants" component={ImportExportPlants} />
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
      
      {/* === MOLÉCULES === */}
      <Route path="/molecules" component={Molecules} />
      <Route path="/molecule/:id" component={MoleculeDetail} />
      <Route path="/terpene/:id" component={TerpeneDetail} />
      <Route path="/familles" component={Familles} />
      <Route path="/familles/list" component={FamillesList} />
      <Route path="/chemical-families" component={ChemicalFamilies} />
      
      {/* === RECETTES === */}
      <Route path="/recettes" component={Recettes} />
      <Route path="/recette/:id" component={RecetteDetail} />
      <Route path="/accords" component={Accords} />
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
      <Route path="/graphe-synergies" component={SynergiesPage} />
      <Route path="/synergies" component={SynergiesPage} />
      <Route path="/suggestions-synergies" component={SuggestionsSynergies} />
      <Route path="/synergies-heatmap" component={SynergiesHeatmap} />
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
      <Route path="/gestion" component={GestionPage} />
      <Route path="/collaborations" component={Collaborations} />
      <Route path="/archives" component={Archives} />
      <Route path="/outils" component={Outils} />
      <Route path="/glossaire" component={Glossaire} />
      <Route path="/glossaire-visuel-radar" component={GlossaireVisuelRadar} />
      <Route path="/contribuer" component={Contribuer} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/galerie-botaniques" component={GalerieBotaniques} />
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
      <Route path="/terroirs/:id" component={Terroirs} />
      <Route path="/origines-geographiques" component={OriginesGeographiques} />
      <Route path="/extraction-methods" component={ExtractionMethods} />
      <Route path="/methodes-extraction" component={ExtractionMethods} />
      
      {/* === MATIÈRES PREMIÈRES & RELATIONS === */}
      <Route path="/matieres-premieres" component={RawMaterials} />
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
      <Route path="/mon-dashboard" component={MonDashboard} />
      <Route path="/statistiques" component={Statistics} />
 <Route path="/recherche" component={RechercheAvancee} />
      <Route path="/recherche-profil-moleculaire" component={RechercheProfilMoleculaire} />
      <Route path="/recherche-avancee" component={AdvancedSearch} />
      <Route path="/timeline-recettes" component={RecipeTimeline} />
      <Route path="/heatmap-correlations" component={RadarCorrelationHeatmap} />
      <Route path="/formules-reference" component={FormulesReference} />
      
      {/* === UTILISATEUR === */}
      <Route path="/favoris" component={Favoris} />
      <Route path="/reseau" component={Reseau} />
      <Route path="/reseau-molecules-plantes" component={ReseauMoleculePlante} />
      <Route path="/bio-mineralis" component={BioMineralis} />
      
      {/* === PAGES TECHNIQUES === */}
      <Route path="/test-minimal" component={TestMinimal} />
      
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
          <Router />
          <MobileBottomNav />
          <ScrollToTop />
          <PWAInstallPrompt />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
