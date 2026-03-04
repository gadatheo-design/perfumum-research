// @ts-nocheck
import { Link, useLocation } from "wouter";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Mapping complet des chemins vers des labels lisibles
const labelMap: Record<string, string> = {
  // Projet
  "le-projet": "Le Projet",
  "a-propos": "À Propos",
  "contact": "Contact",
  "nouveautes": "Nouveautés",
  "timeline": "Timeline",
  
  // Administration
  "admin": "Administration",
  "molecules": "Molécules",
  "molecule": "Molécule",
  "recettes": "Recettes",
  "recette": "Recette",
  "import-export": "Import/Export",
  "new": "Nouvelle",
  
  // Bibliographie
  "bibliographie": "Bibliographie",
  "bibliographie-globale": "Bibliographie Globale",
  
  // Prototypes
  "prototypes": "Prototypes",
  "c1": "C1 Fermentum",
  "c2": "C2 Clarus Verde",
  "c3": "C3 Lacta Solis",
  "c4": "C4 Terra Ambra",
  
  // Gammes
  "gammes": "Gammes",
  "petrichor": "Pétrichor",
  "volcanique": "Volcanique",
  "glaciaire": "Glaciaire",
  "biolab": "BioLab",
  "mossi": "Royal Mossi",
  "signatures": "Signatures",
  
  // Laboratoire
  "laboratoire": "Laboratoire",
  "matrice-interactive": "Matrice Interactive",
  "statistiques": "Statistiques",
  "inventaire": "Inventaire",
  
  // Molécules
  "familles": "Familles",
  "list": "Liste",
  "chemical-families": "Familles Chimiques",
  "terpene": "Terpène",
  
  // Recettes & Accords
  "accords": "Accords",
  "experimental-accords": "Accords Expérimentaux",
  
  // Résines CBD
  "resines-cbd": "Résines CBD",
  "resine-cbd": "Résine CBD",
  "protocoles-maturation": "Protocoles de Maturation",
  
  // Comparaison & Visualisation
  "compare": "Comparer",
  "compare-terpenes": "Comparer Terpènes",
  "compare-radar": "Comparer Radar",
  "compare-molecules-advanced": "Comparaison Avancée",
  "chimie": "Chimie",
  "comparaison": "Comparaison",
  "matrice-synergies": "Matrice Synergies",
  "correlations": "Corrélations Parfum × Tabac × Cannabis",
  "graphe-molecules-recettes": "Graphe Molécules-Recettes",
  "graphe-synergies": "Graphe Synergies",
  "suggestions-synergies": "Suggestions Synergies",
  
  // Outils
  "outils-formulation": "Outils de Formulation",
  "calculateur": "Calculateur",
  "outils": "Outils",
  "dilution": "Dilution",
  "analyses": "Analyses",
  "absorbe-scale": "Échelle ABSORBE",
  
  // Recherche Scientifique
  "recherche-scientifique": "Recherche Scientifique",
  "synergies-moleculaires": "Synergies Moléculaires",
  "pyrolyse-combustion": "Pyrolyse & Combustion",
  "courbes-volatilite": "Courbes de Volatilité",
  "degradation-terpenes": "Dégradation Terpènes",
  "modeles-analytiques-gcms": "Modèles GC-MS",
  "synergies-terpenes-niches": "Synergies Terpènes × Niches",
  "chimie-tabac": "Chimie du Tabac",
  
  // Programmes de Recherche
  "programmes-recherche": "Programmes de Recherche",
  "tabacs-niche": "Tabacs Niche",
  
  // Méthodologie
  "methode": "Méthodologie",
  "methode-absorbe": "Méthode ABSORBE",
  "methodologie": "Méthodologie",
  "absorbe": "ABSORBE",
  "pyrolyse": "Pyrolyse",
  "gc-ms": "GC-MS",
  
  // Contenu Éditorial
  "etudes": "Études",
  "projets": "Projets",
  "terrains": "Terrains",
  "collaborations": "Collaborations",
  "glossaire": "Glossaire",
  "galerie-botaniques": "Galerie Botaniques",
  
  // Civilisations & Traditions
  "civilisations": "Traditions Olfactives",
  "civilisation": "Tradition",
  "installations": "Installations",
  
  // Tabacs & Associations
  "tabacs-resines": "Tabacs & Résines",
  "associations": "Associations",
  "fournisseurs": "Fournisseurs",
  
  // Dashboards
  "dashboard": "Dashboard",
  "recherche": "Recherche",
  "analytics": "Analytics",
  
  // Utilisateur
  "favoris": "Favoris",
  "reseau": "Réseau",
  "bio-mineralis": "BIO-MINERALIS",
  
  // Projet
  "projet": "Projet",
  
  // San Andrés / Seaflower
  "san-andres": "San Andrés",
  "leaf-economies": "Leaf Economies",
  "echantillon": "Échantillon",
  "terp-profiles": "TerpProfiles",
  "formules": "Formules",
  "recettes-finales": "Recettes Finales",
  "botanique-critique": "Botanique Critique",
  "timeline-botanique": "Timeline Botanique",
  "varietes-fantomes": "Variétés Fantômes",
  "recettes-radicales": "Recettes Radicales",
  
  // Plantes & Variétés
  "plants": "Plantes",
  "plantes": "Plantes",
  "varietes": "Variétés",
  "variete": "Variété",
  "carte-varietes": "Carte des Variétés",
  
  // Archives & Terrains
  "archives-terrain": "Archives Terrain",
  "archive-terrain": "Archive Terrain",
  
  // Protocoles
  "protocoles-moleculaires": "Protocoles Moléculaires",
  "protocole-moleculaire": "Protocole Moléculaire",
  
  // Matières premières
  "matieres-premieres": "Matières Premières",
  "raw-materials": "Matières Premières",
  "raw-material": "Matière Première",
  "suppliers": "Fournisseurs",
  "supplier": "Fournisseur",
  "inventory": "Inventaire",
  
  // Analyse GC-MS
  "analysis-hub": "Hub Analyse",
  "gcms-chromatograms": "Chromatogrammes GC-MS",
  "ms-spectra": "Spectres de Masse",
  "compare-spectra": "Comparaison Spectres",
  "identify-spectrum": "Identification Spectre",
  "search-compound": "Recherche Composé",
  "spectra-comparison": "Comparaison Spectres",
  "spectra-identification": "Identification Spectre",
  
  // Axes de recherche
  "axes-recherche": "Axes de Recherche",
  "axe-recherche": "Axe de Recherche",
  
  // Odeurs situées
  "odeurs-situees": "Odeurs Situées",
  "odeur-situee": "Odeur Située",
  
  // Tests extraction
  "tests-extraction": "Tests d'Extraction",
  "test-extraction": "Test d'Extraction",
  
  // Études climatiques
  "etudes-climatiques": "Études Climatiques",
  "etude-climatique": "Étude Climatique",
  
  // Terpènes
  "terpenes": "Terpènes",
  
  // Terroirs
  "terroirs": "Terroirs",
  "origines": "Origines",
};

interface BreadcrumbsProps {
  /** Custom label for the current page (useful for dynamic pages like /molecules/:id) */
  currentLabel?: string;
  /** Custom breadcrumb items to override automatic parsing */
  customItems?: Array<{ label: string; path?: string }>;
  /** Maximum number of items to show before collapsing (default: 4 on desktop, 2 on mobile) */
  maxItems?: number;
}

export function Breadcrumbs({ currentLabel, customItems, maxItems }: BreadcrumbsProps = {}) {
  const [location] = useLocation();
  
  // Parse location into breadcrumb segments
  const segments = location.split("/").filter(Boolean);
  
  // Don't show breadcrumbs on homepage
  if (segments.length === 0) return null;
  
  // Helper to format segment label
  const getLabel = (segment: string): string => {
    // Check if it's a known label
    if (labelMap[segment]) {
      return labelMap[segment];
    }
    
    // Check if it's an ID (numeric or UUID-like)
    if (/^\d+$/.test(segment) || /^[a-f0-9-]{36}$/i.test(segment)) {
      return `#${segment.slice(0, 8)}`;
    }
    
    // Format unknown segments: replace hyphens with spaces and capitalize
    return segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  // Build items array
  const items = useMemo(() => {
    if (customItems && customItems.length > 0) {
      return customItems;
    }
    
    return segments.map((segment, index) => ({
      label: index === segments.length - 1 && currentLabel ? currentLabel : getLabel(segment),
      path: index === segments.length - 1 ? undefined : "/" + segments.slice(0, index + 1).join("/"),
    }));
  }, [customItems, segments, currentLabel]);
  
  // Determine if we need to collapse items
  const shouldCollapse = items.length > (maxItems || 3);
  
  // Items to show in collapsed view
  const collapsedItems = useMemo(() => {
    if (!shouldCollapse) return null;
    
    // Show first item, collapsed middle items, and last item
    const middleItems = items.slice(1, -1);
    return {
      first: items[0],
      middle: middleItems,
      last: items[items.length - 1],
    };
  }, [items, shouldCollapse]);
  
  // Render a single breadcrumb item
  const renderItem = (item: { label: string; path?: string }, isLast: boolean, key: string | number) => (
    <li key={key} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
      <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-muted-foreground/50" aria-hidden="true" />
      {isLast || !item.path ? (
        <span 
          className="text-foreground font-medium truncate max-w-[120px] sm:max-w-[200px] md:max-w-none"
          aria-current={isLast ? "page" : undefined}
          title={item.label}
        >
          {item.label}
        </span>
      ) : (
        <Link 
          href={item.path} 
          className="hover:text-foreground transition-colors hover:underline truncate max-w-[100px] sm:max-w-[150px] md:max-w-none"
          title={item.label}
        >
          {item.label}
        </Link>
      )}
    </li>
  );
  
  return (
    <nav 
      className="container py-3 sm:py-4" 
      aria-label="Fil d'Ariane"
      role="navigation"
    >
      <ol className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
        {/* Home link */}
        <li className="flex-shrink-0">
          <Link 
            href="/" 
            className="hover:text-foreground transition-colors flex items-center gap-1 p-1 -m-1 rounded-md hover:bg-muted/50" 
            aria-label="Retour à l'accueil"
          >
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="sr-only">Accueil</span>
          </Link>
        </li>
        
        {shouldCollapse && collapsedItems ? (
          <>
            {/* First item */}
            {renderItem(collapsedItems.first, false, "first")}
            
            {/* Collapsed middle items */}
            {collapsedItems.middle.length > 0 && (
              <li className="flex items-center gap-1.5 sm:gap-2">
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-muted-foreground/50" aria-hidden="true" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 hover:bg-muted"
                      aria-label={`${collapsedItems.middle.length} éléments masqués`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[150px]">
                    {collapsedItems.middle.map((item, idx) => (
                      <DropdownMenuItem key={idx} asChild>
                        {item.path ? (
                          <Link href={item.path} className="cursor-pointer">
                            {item.label}
                          </Link>
                        ) : (
                          <span>{item.label}</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            )}
            
            {/* Last item */}
            {renderItem(collapsedItems.last, true, "last")}
          </>
        ) : (
          // Non-collapsed view
          items.map((item, index) => renderItem(item, index === items.length - 1, index))
        )}
      </ol>
    </nav>
  );
}
