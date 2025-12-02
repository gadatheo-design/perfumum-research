import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Projet from "./pages/Projet";
import Prototypes from "./pages/Prototypes";
import Familles from "./pages/Familles";
import Laboratoire from "./pages/Laboratoire";
import Civilisations from "./pages/Civilisations";
import Installations from "./pages/Installations";
import PrototypeDetail from "./pages/PrototypeDetail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projet" component={Projet} />
      <Route path="/prototypes" component={Prototypes} />
      <Route path="/prototypes/:code" component={PrototypeDetail} />
      <Route path="/familles" component={Familles} />
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
