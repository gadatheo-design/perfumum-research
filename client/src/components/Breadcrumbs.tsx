import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";

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
  "raw-materials": "Matières Premières",
  "raw-material": "Matière Première",
  
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
};

interface BreadcrumbsProps {
  /** Custom label for the current page (useful for dynamic pages like /molecules/:id) */
  currentLabel?: string;
  /** Custom breadcrumb items to override automatic parsing */
  customItems?: Array<{ label: string; path?: string }>;
}

export function Breadcrumbs({ currentLabel, customItems }: BreadcrumbsProps = {}) {
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
  
  // If custom items are provided, use them instead
  if (customItems && customItems.length > 0) {
    return (
      <nav 
        className="container py-4" 
        aria-label="Fil d'Ariane"
        role="navigation"
      >
        <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1" aria-label="Retour à l'accueil">
              <Home className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Accueil</span>
            </Link>
          </li>
          
          {customItems.map((item, index) => {
            const isLast = index === customItems.length - 1;
            
            return (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {isLast || !item.path ? (
                  <span 
                    className="text-foreground font-medium"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.path} className="hover:text-foreground transition-colors hover:underline">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav 
      className="container py-4" 
      aria-label="Fil d'Ariane"
      role="navigation"
    >
      <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1" aria-label="Retour à l'accueil">
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Accueil</span>
          </Link>
        </li>
        
        {segments.map((segment, index) => {
          const path = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          // Use currentLabel for the last segment if provided
          const label = isLast && currentLabel ? currentLabel : getLabel(segment);
          
          return (
            <li key={path} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {isLast ? (
                <span 
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {label}
                </span>
              ) : (
                <Link href={path} className="hover:text-foreground transition-colors hover:underline">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
