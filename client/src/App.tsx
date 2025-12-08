import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useNavigationHistory } from "@/hooks/useNavigationHistory";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminMoleculeNew from "./pages/AdminMoleculeNew";
import AdminImportExport from "./pages/AdminImportExport";
import Projet from "./pages/Projet";
import LeProjet from "./pages/LeProjet";
import Prototypes from "./pages/Prototypes";
import Familles from "./pages/Familles";
import Laboratoire from "./pages/Laboratoire";
import Civilisations from "./pages/Civilisations";
import Installations from "./pages/Installations";
import PrototypeDetail from "./pages/PrototypeDetail";
import Molecules from "./pages/Molecules";
import Compare from "./pages/Compare";
import FamillesList from "./pages/FamillesList";
import Accords from "./pages/Accords";
import { Glossaire } from "./pages/Glossaire";
import { Timeline } from "./pages/Timeline";
import { ChemicalFamilies } from "./pages/ChemicalFamilies";
import { ExperimentalAccords } from "./pages/ExperimentalAccords";
import { AbsorbeScale } from "@/pages/AbsorbeScale";
import Recherche from "./pages/Recherche";
import MoleculeDetail from "./pages/MoleculeDetail";
import RecetteDetail from "./pages/RecetteDetail";
import TerpeneDetail from "./pages/TerpeneDetail";
import CompareTerpenes from "./pages/CompareTerpenes";
import CompareRadar from "./pages/CompareRadar";
import MatriceSynergies from "./pages/MatriceSynergies";
import GalerieBotaniques from "./pages/GalerieBotaniques";
import Recettes from "./pages/Recettes";
import Gammes from "./pages/Gammes";
import GammesPetrichor from "@/pages/GammesPetrichor";
import GammesVolcanique from "@/pages/GammesVolcanique";
import GammesGlaciaire from "@/pages/GammesGlaciaire";
import GammesBioLab from "@/pages/GammesBioLab";
import GammesMossi from "./pages/GammesMossi";
import CivilisationDetail from "./pages/CivilisationDetail";
import C1Fermentum from "./pages/prototypes/C1";
import C2ClarusVerde from "./pages/prototypes/C2";
import C3LactaSolis from "./pages/prototypes/C3";
import C4TerraAmbra from "./pages/prototypes/C4";
import Reseau from "./pages/Reseau";
import BioMineralis from "./pages/BioMineralis";
import ResinesCBD from "@/pages/ResinesCBD";
import RecetteCBDDetail from "@/pages/RecetteCBDDetail";
import GrapheMoleculesRecettes from "@/pages/GrapheMoleculesRecettes";
import ProgrammesRecherche from "@/pages/ProgrammesRecherche";
import TabacsNiche from "@/pages/TabacsNiche";
import LaboratoireRecettes from "./pages/LaboratoireRecettes";
import { Dashboard } from "./pages/Dashboard";
import { RechercheScientifique } from "./pages/RechercheScientifique";
import { SynergiesMoleculaires } from "./pages/SynergiesMoleculaires";
import Statistics from "./pages/Statistics";
import { PyrolyseCombustion } from "./pages/PyrolyseCombustion";
import { CourbesVolatilite } from "@/pages/CourbesVolatilite";
import { DegradationTerpenes } from "@/pages/DegradationTerpenes";
import { ModelesAnalytiquesGCMS } from "@/pages/ModelesAnalytiquesGCMS";
import MatriceInteractive from "@/pages/MatriceInteractive";
import Statistiques from "@/pages/Statistiques";
import ComparaisonMolecules from "@/pages/ComparaisonMolecules";
import DashboardRecherche from "@/pages/DashboardRecherche";
import TimelinePerfumum from "./pages/TimelinePerfumum";
import MethodeAbsorbe from "./pages/MethodeAbsorbe";
import Projets from "./pages/Projets";
import Terrains from "./pages/Terrains";
import Collaborations from "./pages/Collaborations";
import TabacsResines from "./pages/TabacsResines";
import Favoris from "./pages/Favoris";
import MethodologieAbsorbe from "./pages/methodologie/MethodologieAbsorbe";
import Pyrolyse from "./pages/methodologie/Pyrolyse";
import GCMS from "./pages/methodologie/GCMS";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import Etudes from "./pages/Etudes";

function Router() {
  return (
    <Switch>      <Route path={"/"} component={Home} />
         <Route path="/admin" component={Admin} />
      <Route path="/admin/molecule/new" component={AdminMoleculeNew} />
      <Route path="/admin/import-export" component={AdminImportExport} />
      <Route path={"/404"} component={NotFound} />      <Route path="/le-projet" component={LeProjet} />
      <Route path="/prototypes" component={Prototypes} />
      <Route path="/prototypes/c1" component={C1Fermentum} />
      <Route path="/prototypes/c2" component={C2ClarusVerde} />
      <Route path="/prototypes/c3" component={C3LactaSolis} />
      <Route path="/prototypes/c4" component={C4TerraAmbra} />
      <Route path="/prototypes/:code" component={PrototypeDetail} />
      <Route path="/familles" component={Familles} />
      <Route path="/familles/list" component={FamillesList} />
      <Route path="/molecules" component={Molecules} />
      <Route path="/compare" component={Compare} />
      <Route path="/accords" component={Accords} />
      <Route path="/recettes" component={Recettes} />
      <Route path="/gammes" component={Gammes} />
        <Route path="/gammes/petrichor" component={GammesPetrichor} />
        <Route path="/gammes/volcanique" component={GammesVolcanique} />
        <Route path="/gammes/glaciaire" component={GammesGlaciaire} />
        <Route path="/gammes/biolab" component={GammesBioLab} />
      <Route path="/gammes/mossi" component={GammesMossi} />
      <Route path="/glossaire" component={Glossaire} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/chemical-families" component={ChemicalFamilies} />
      <Route path="/experimental-accords" component={ExperimentalAccords} />
        <Route path="/absorbe-scale" component={AbsorbeScale} />
          <Route path="/recherche" component={Recherche} />
      <Route path="/reseau" component={Reseau} />
      <Route path="/bio-mineralis" component={BioMineralis} />
      <Route path="/resines-cbd" component={ResinesCBD} />
      <Route path="/resine-cbd/:id" component={RecetteCBDDetail} />
      <Route path="/graphe-molecules-recettes" component={GrapheMoleculesRecettes} />
          <Route path="/molecule/:id" component={MoleculeDetail} />
          <Route path="/terpene/:id" component={TerpeneDetail} />
          <Route path="/compare-terpenes" component={CompareTerpenes} />
          <Route path="/compare-radar" component={CompareRadar} />
          <Route path="/matrice-synergies" component={MatriceSynergies} />
          <Route path="/galerie-botaniques" component={GalerieBotaniques} />
          <Route path="/recette/:id" component={RecetteDetail} />
          <Route path="/civilisation/:id" component={CivilisationDetail} />
      <Route path="/laboratoire" component={Laboratoire} />
      <Route path="/laboratoire/recettes" component={LaboratoireRecettes} />
      <Route path="/methodologie/absorbe" component={MethodologieAbsorbe} />
          <Route path="/methodologie/pyrolyse" component={Pyrolyse} />
          <Route path="/methodologie/gc-ms" component={GCMS} />
          <Route path="/laboratoire/matrice-interactive" component={MatriceInteractive} />
          <Route path="/laboratoire/statistiques" component={Statistiques} />
          <Route path="/chimie/comparaison" component={ComparaisonMolecules} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/statistiques" component={Statistics} />
          <Route path="/dashboard/recherche" component={DashboardRecherche} />
          <Route path="/projet/timeline" component={TimelinePerfumum} />
        <Route path="/methode-absorbe" component={MethodeAbsorbe} />
        <Route path="/methode" component={MethodeAbsorbe} />
        <Route path="/a-propos" component={APropos} />
        <Route path="/contact" component={Contact} />
        <Route path="/etudes" component={Etudes} />
        <Route path="/projets" component={Projets} />
        <Route path="/terrains" component={Terrains} />
        <Route path="/collaborations" component={Collaborations} />
        <Route path="/tabacs-resines" component={TabacsResines} />
        <Route path="/favoris" component={Favoris} />
      <Route path="/recherche-scientifique" component={RechercheScientifique} />
      <Route path="/recherche-scientifique/synergies-moleculaires" component={SynergiesMoleculaires} />
      <Route path="/recherche-scientifique/pyrolyse-combustion" component={PyrolyseCombustion} />
        <Route path="/recherche-scientifique/courbes-volatilite" component={CourbesVolatilite} />
        <Route path="/recherche-scientifique/degradation-terpenes" component={DegradationTerpenes} />
        <Route path="/recherche-scientifique/modeles-analytiques-gcms" component={ModelesAnalytiquesGCMS} />

        {/* Programmes de Recherche */}
        <Route path="/programmes-recherche" component={ProgrammesRecherche} />
        <Route path="/programmes-recherche/resines-cbd" component={ResinesCBD} />
        <Route path="/programmes-recherche/tabacs-niche" component={TabacsNiche} />
      <Route path="/civilisations" component={Civilisations} />
      <Route path="/installations" component={Installations} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Activer navigation clavier globale
  useKeyboardNavigation();
  
  // Activer historique navigation
  useNavigationHistory();
  
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
        <TooltipProvider>
          <Toaster />
          <Router />
          <PWAInstallPrompt />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
