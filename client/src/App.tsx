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

function Router() {
  return (
    <Switch>      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/molecules/new"} component={AdminMoleculeNew} />
      <Route path={"/404"} component={NotFound} />     <Route path="/prototypes" component={Prototypes} />
      <Route path="/prototypes/:code" component={PrototypeDetail} />
      <Route path="/familles" component={Familles} />
      <Route path="/familles/list" component={FamillesList} />
      <Route path="/molecules" component={Molecules} />
      <Route path="/accords" component={Accords} />
      <Route path="/glossaire" component={Glossaire} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/chemical-families" component={ChemicalFamilies} />
      <Route path="/experimental-accords" component={ExperimentalAccords} />
        <Route path="/absorbe-scale" component={AbsorbeScale} />
          <Route path="/recherche" component={Recherche} />
          <Route path="/molecule/:id" component={MoleculeDetail} />
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
