import { useEffect } from "react";
import { useLocation } from "wouter";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface LegacyRedirectProps {
  to: string;
  tab?: string;
}

/**
 * LegacyRedirect - Redirects old routes to new consolidated pages
 * 
 * This component handles backward compatibility by redirecting
 * legacy URLs to the new consolidated pages with the appropriate tab.
 * 
 * Example usage:
 * <Route path="/familles" component={() => <LegacyRedirect to="/molecules" tab="familles" />} />
 */
export function LegacyRedirect({ to, tab }: LegacyRedirectProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const destination = tab ? `${to}?tab=${tab}` : to;
    setLocation(destination, { replace: true });
  }, [to, tab, setLocation]);

  return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner />
      <span className="ml-2 text-muted-foreground">Redirection...</span>
    </div>
  );
}

/**
 * Factory function to create redirect components for specific routes
 */
export function createRedirect(to: string, tab?: string) {
  return function RedirectComponent() {
    return <LegacyRedirect to={to} tab={tab} />;
  };
}

// Pre-defined redirects for molecules section
export const RedirectToMoleculesList = createRedirect("/molecules", "liste");
export const RedirectToFamilles = createRedirect("/molecules", "familles");
export const RedirectToChemicalFamilies = createRedirect("/molecules", "chimiques");
export const RedirectToChemicalFamilyGraph = createRedirect("/molecules", "graphe");

// Pre-defined redirects for recettes section
export const RedirectToRecettesList = createRedirect("/recettes", "liste");
export const RedirectToAccords = createRedirect("/recettes", "accords");
export const RedirectToFormules = createRedirect("/recettes", "formules");
export const RedirectToFormulesReference = createRedirect("/recettes", "formules");

// Pre-defined redirects for plants section
export const RedirectToPlantsList = createRedirect("/plants", "liste");
export const RedirectToVarietes = createRedirect("/plants", "varietes");
export const RedirectToTerroirs = createRedirect("/plants", "terroirs");

// Pre-defined redirects for compare section
export const RedirectToCompareMolecules = createRedirect("/compare", "molecules");
export const RedirectToCompareTerpenes = createRedirect("/compare", "terpenes");
export const RedirectToCompareRecettes = createRedirect("/compare", "recettes");

// Pre-defined redirects for visualisations section
export const RedirectToGraphes = createRedirect("/visualisations", "graphes");
export const RedirectToMatrices = createRedirect("/visualisations", "matrices");
export const RedirectToHeatmaps = createRedirect("/visualisations", "heatmaps");

// Pre-defined redirects for recherche section
export const RedirectToRechercheAvancee = createRedirect("/recherche", "avancee");
export const RedirectToRechercheScientifique = createRedirect("/recherche", "scientifique");

// Pre-defined redirects for methodologie section
export const RedirectToMethodeAbsorbe = createRedirect("/methodologie", "absorbe");
export const RedirectToGCMS = createRedirect("/methodologie", "gcms");

// Pre-defined redirects for bibliographie section
export const RedirectToReferences = createRedirect("/bibliographie", "references");
export const RedirectToAxes = createRedirect("/bibliographie", "axes");

// Pre-defined redirects for outils section
export const RedirectToFormulation = createRedirect("/outils", "formulation");
export const RedirectToCalculateurs = createRedirect("/outils", "calculateurs");

// Pre-defined redirects for archives section
export const RedirectToArchivesTerrain = createRedirect("/archives", "terrain");
export const RedirectToEtudes = createRedirect("/archives", "etudes");

export default LegacyRedirect;
