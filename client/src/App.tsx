import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminMoleculeNew from "./pages/AdminMoleculeNew";
import Projet from "./pages/Projet";
import LeProjet from "./pages/LeProjet";
import Prototypes from "./pages/Prototypes";
import Familles from "./pages/Familles";
import Laboratoire from "./pages/Laboratoire";
import Civilisations from "./pages/Civilisations";
import Installations from "./pages/Installations";
import PrototypeDetail from "./pages/PrototypeDetail";
import Molecules from "./pages/Molecules";
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
import Recettes from "./pages/Recettes";
import Gammes from "./pages/Gammes";
import GammesPetrichor from "./pages/GammesPetrichor";
import GammesVolcanique from "./pages/GammesVolcanique";
import GammesMossi from "./pages/GammesMossi";
import CivilisationDetail from "./pages/CivilisationDetail";
import C1Fermentum from "./pages/prototypes/C1";
import C2ClarusVerde from "./pages/prototypes/C2";
import C3LactaSolis from "./pages/prototypes/C3";
import C4TerraAmbra from "./pages/prototypes/C4";
import Reseau from "./pages/Reseau";

function Router() {
  return (
    <Switch>      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/molecules/new"} component={AdminMoleculeNew} />
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
      <Route path="/accords" component={Accords} />
      <Route path="/recettes" component={Recettes} />
      <Route path="/gammes" component={Gammes} />
      <Route path="/gammes/petrichor" component={GammesPetrichor} />
      <Route path="/gammes/volcanique" component={GammesVolcanique} />
      <Route path="/gammes/mossi" component={GammesMossi} />
      <Route path="/glossaire" component={Glossaire} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/chemical-families" component={ChemicalFamilies} />
      <Route path="/experimental-accords" component={ExperimentalAccords} />
        <Route path="/absorbe-scale" component={AbsorbeScale} />
          <Route path="/recherche" component={Recherche} />
      <Route path="/reseau" component={Reseau} />
          <Route path="/molecule/:id" component={MoleculeDetail} />
          <Route path="/recette/:id" component={RecetteDetail} />
          <Route path="/civilisation/:id" component={CivilisationDetail} />
      <Route path="/laboratoire" component={Laboratoire} />
      <Route path="/civilisations" component={Civilisations} />
      <Route path="/installations" component={Installations} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
