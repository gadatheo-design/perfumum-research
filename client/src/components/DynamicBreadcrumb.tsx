import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BreadcrumbSegment {
  label: string;
  path: string;
  dropdown?: Array<{ label: string; path: string }>;
}

interface DynamicBreadcrumbProps {
  segments?: BreadcrumbSegment[];
  className?: string;
}

// Configuration complète des routes avec leurs labels et parents
const routeConfig: Record<string, { label: string; parent?: string }> = {
  // Pages principales
  "/": { label: "Accueil" },
  "/systeme": { label: "Système PERFUMUM" },
  "/le-projet": { label: "Le Projet" },
  "/a-propos": { label: "À Propos" },
  "/contact": { label: "Contact" },
  "/nouveautes": { label: "Nouveautés" },
  "/manifeste": { label: "Manifeste" },
  
  // Recherche
  "/recherche-avancee": { label: "Recherche Avancée" },
  "/recherche-globale": { label: "Recherche Globale" },
  
  // Prototypes
  "/prototypes": { label: "Prototypes" },
  "/prototypes/c1": { label: "C1 — Fermentum", parent: "/prototypes" },
  "/prototypes/c2": { label: "C2 — Clarus Verde", parent: "/prototypes" },
  "/prototypes/c3": { label: "C3 — Lacta Solis", parent: "/prototypes" },
  "/prototypes/c4": { label: "C4 — Terra Ambra", parent: "/prototypes" },
  
  // Gammes
  "/gammes": { label: "Gammes" },
  "/colombie": { label: "Ligne Colombie", parent: "/gammes" },
  "/sourcing": { label: "Sourcing" },
  "/sourcing/colombie": { label: "Colombie", parent: "/sourcing" },
  "/sourcing/france": { label: "France", parent: "/sourcing" },
  "/sourcing/inde": { label: "Inde", parent: "/sourcing" },
  "/sourcing/madagascar": { label: "Madagascar", parent: "/sourcing" },
  "/sourcing/north-america": { label: "Amérique du Nord", parent: "/sourcing" },
  "/gammes/petrichor": { label: "Petrichor", parent: "/gammes" },
  "/gammes/volcanique": { label: "Volcanique", parent: "/gammes" },
  "/gammes/glaciaire": { label: "Glaciaire", parent: "/gammes" },
  "/gammes/biolab": { label: "BioLab", parent: "/gammes" },
  "/gammes/mossi": { label: "Mossi", parent: "/gammes" },
  "/gammes/signatures": { label: "Signatures", parent: "/gammes" },
  "/gammes/pheromones": { label: "Phéromones", parent: "/gammes" },
  "/gammes/raretes": { label: "Raretés", parent: "/gammes" },
  
  // Laboratoire
  "/laboratoire": { label: "Laboratoire" },
  "/laboratoire/recettes": { label: "Recettes", parent: "/laboratoire" },
  "/laboratoire/matrice-interactive": { label: "Matrice Interactive", parent: "/laboratoire" },
  "/laboratoire/statistiques": { label: "Statistiques", parent: "/laboratoire" },
  "/inventaire": { label: "Inventaire", parent: "/laboratoire" },
  
  // Molécules
  "/molecules": { label: "Molécules" },
  "/terpenes": { label: "Terpènes", parent: "/molecules" },
  "/familles": { label: "Familles Olfactives" },
  "/familles-chimiques": { label: "Familles Chimiques" },
  
  // Recettes
  "/recettes": { label: "Recettes" },
  "/accords": { label: "Accords" },
  "/accords-dedies": { label: "Accords Dédiés" },
  "/accords-experimentaux": { label: "Accords Expérimentaux" },
  "/recherche-radicale": { label: "Recherche Radicale" },
  "/fondements-philosophiques": { label: "Fondements Philosophiques" },
  
  // Résines CBD
  "/resines-cbd": { label: "Résines CBD" },
  "/protocoles-maturation": { label: "Protocoles de Maturation" },
  
  // Comparaison
  "/compare": { label: "Comparer" },
  "/compare-terpenes": { label: "Comparaison Terpènes", parent: "/molecules" },
  "/compare-radar": { label: "Comparaison Radar", parent: "/molecules" },
  "/compare-recettes": { label: "Comparaison Recettes", parent: "/recettes" },
  "/compare-molecules": { label: "Comparaison Molécules", parent: "/molecules" },
  "/compare-plants": { label: "Comparaison Plantes", parent: "/plants" },
  "/comparateur-avance": { label: "Comparateur Avancé" },
  "/matrice-synergies": { label: "Matrice Synergies" },
  "/graphe-molecules-recettes": { label: "Graphe Molécules-Recettes" },
  "/synergies": { label: "Synergies" },
  "/suggestions-synergies": { label: "Suggestions Synergies" },
  "/synergies-heatmap": { label: "Heatmap Synergies" },
  "/reseau-recettes": { label: "Réseau Recettes" },
  "/sankey-flow": { label: "Sankey Flow" },
  
  // Outils
  "/outils": { label: "Outils" },
  "/outils/formulation": { label: "Formulation", parent: "/outils" },
  "/outils/proportions": { label: "Proportions", parent: "/outils" },
  "/outils/dilution": { label: "Dilution", parent: "/outils" },
  "/outils/correlation": { label: "Corrélation", parent: "/outils" },
  "/outils/editeur-formulation": { label: "Éditeur Formulation", parent: "/outils" },
  "/carte-origines": { label: "Carte des Origines" },
  "/export-bibliographique": { label: "Export Bibliographique" },
  "/enrichissement-pubchem": { label: "Enrichissement PubChem" },
  
  // Recherche scientifique
  "/recherche-scientifique": { label: "Recherche Scientifique" },
  "/synergies-moleculaires": { label: "Synergies Moléculaires" },
  "/pyrolyse-combustion": { label: "Pyrolyse & Combustion" },
  "/courbes-volatilite": { label: "Courbes de Volatilité" },
  "/degradation-terpenes": { label: "Dégradation Terpènes" },
  "/modeles-analytiques-gcms": { label: "Modèles GCMS" },
  "/synergies-terpenes-niches": { label: "Synergies Terpènes Niches" },
  "/chimie-tabac": { label: "Chimie du Tabac" },
  "/interactions-tabac-cannabis": { label: "Interactions Tabac-Cannabis" },
  "/comparaison-terpenes": { label: "Comparaison Terpènes" },
  
  // Programmes de recherche
  "/programmes-recherche": { label: "Programmes de Recherche" },
  "/tabacs-niche": { label: "Tabacs de Niche" },
  
  // Journal & Méthodologie
  "/journal": { label: "Journal" },
  "/methode-absorbe": { label: "Méthode ABSORBE" },
  "/methodologie/absorbe": { label: "Méthodologie ABSORBE" },
  "/methodologie-recherche": { label: "Méthodologie de Recherche" },
  "/generateur-formules": { label: "Générateur de Formules" },
  "/historique-formules": { label: "Historique Formules" },
  "/methodologie/echelle-absorbe": { label: "Échelle ABSORBE" },
  "/methodologie/pyrolyse": { label: "Pyrolyse" },
  "/methodologie/gcms": { label: "GC-MS" },
  
  // Études
  "/etudes": { label: "Études" },
  "/etudes-climatiques": { label: "Études Climatiques" },
  "/archives-terrain": { label: "Archives Terrain" },
  "/protocoles-moleculaires": { label: "Protocoles Moléculaires" },
  "/tests-extraction": { label: "Tests d'Extraction" },
  "/odeurs-situees": { label: "Odeurs Situées" },
  "/projets": { label: "Projets" },
  "/terrains": { label: "Terrains" },
  "/bibliographie": { label: "Bibliographie" },
  "/gestion": { label: "Gestion" },
  
  // Leaf Economies
  "/leaf-economies": { label: "Leaf Economies" },
  "/timeline-botanique": { label: "Timeline Botanique" },
  "/botanique-critique": { label: "Botanique Critique" },
  "/varietes-fantomes": { label: "Variétés Fantômes" },
  "/recettes-leaf-economies": { label: "Recettes Leaf Economies" },
  
  // TerpProfiles & Plants
  "/terp-profiles": { label: "TerpProfiles" },
  "/terp-profiles/compare": { label: "Comparer", parent: "/terp-profiles" },
  "/plants": { label: "Plantes" },
  "/plant-varieties": { label: "Variétés de Plantes" },
  "/chemotypes": { label: "Chémotypes" },
  "/final-recipes": { label: "Recettes Finales" },
  "/carte-varietes": { label: "Carte des Variétés" },
  "/terroirs": { label: "Terroirs" },
  "/origines-geographiques": { label: "Origines Géographiques" },
  "/extraction-methods": { label: "Méthodes d'Extraction" },
  
  // Autres
  "/collaborations": { label: "Collaborations" },
  "/archives": { label: "Archives" },
  "/glossaire": { label: "Glossaire" },
  "/glossaire-visuel-radar": { label: "Glossaire Visuel Radar" },
  "/contribuer": { label: "Contribuer" },
  "/timeline": { label: "Timeline" },
  "/projet/timeline": { label: "Timeline du Projet" },
  "/galerie-botaniques": { label: "Galerie Botaniques" },
  "/gallery": { label: "Galerie" },
  "/batch-import": { label: "Import par Lots" },
  "/ifra": { label: "Réglementation IFRA" },
  
  // Civilisations
  "/civilisations": { label: "Civilisations" },
  "/traditions-olfactives": { label: "Traditions Olfactives" },
  "/installations": { label: "Installations" },
  
  // Tabacs
  "/tabacs-resines": { label: "Tabacs & Résines" },
  "/associations": { label: "Associations" },
  "/fournisseurs": { label: "Fournisseurs" },
  "/calculateur-cout": { label: "Calculateur de Coût" },
  
  // Dashboards
  "/dashboard": { label: "Dashboard" },
  "/dashboard-recherche": { label: "Dashboard Recherche" },
  "/analytics": { label: "Analytics" },
  "/mon-dashboard": { label: "Mon Dashboard" },
  "/statistics": { label: "Statistiques" },
  "/recherche": { label: "Recherche" },
  
  // Utilisateur
  "/favoris": { label: "Favoris" },
  "/reseau": { label: "Réseau" },
  "/reseau-molecule-plante": { label: "Réseau Molécule-Plante" },
  "/bio-mineralis": { label: "Bio Mineralis" },
  
  // Matières premières
  "/raw-materials": { label: "Matières Premières" },
  "/molecule-plant-relations": { label: "Relations Molécule-Plante" },
  
  // Admin
  "/admin": { label: "Administration" },
  "/admin/molecules": { label: "Molécules", parent: "/admin" },
  "/admin/recettes": { label: "Recettes", parent: "/admin" },
  "/admin/import-export": { label: "Import/Export", parent: "/admin" },
  "/admin/import-export-plants": { label: "Import/Export Plantes", parent: "/admin" },
  "/admin/historique": { label: "Historique", parent: "/admin" },
  "/admin/references": { label: "Références", parent: "/admin" },
  "/admin/liaison-recettes-molecules": { label: "Liaison Recettes-Molécules", parent: "/admin" },
  "/admin/molecule-origins": { label: "Origines Molécules", parent: "/admin" },
  "/admin/terroirs-geocode": { label: "Géocodage Terroirs", parent: "/admin" },
};

// Patterns dynamiques pour les pages de détail
const dynamicRoutePatterns: Array<{
  pattern: RegExp;
  getLabel: (match: RegExpMatchArray) => string;
  parent: string;
}> = [
  { pattern: /^\/molecule\/(\d+)$/, getLabel: () => "Détail Molécule", parent: "/molecules" },
  { pattern: /^\/terpene\/(\d+)$/, getLabel: (m) => getTerpeneNameFromId(m[1]), parent: "/terpenes" },
  { pattern: /^\/recette\/(\d+)$/, getLabel: () => "Détail Recette", parent: "/recettes" },
  { pattern: /^\/recette\/colombie\/(\d+)$/, getLabel: () => "Recette Colombie", parent: "/colombie" },
  { pattern: /^\/recette-cbd\/(\d+)$/, getLabel: () => "Recette CBD", parent: "/resines-cbd" },
  { pattern: /^\/plant\/(\d+)$/, getLabel: () => "Détail Plante", parent: "/plants" },
  { pattern: /^\/plants\/(\d+)$/, getLabel: () => "Détail Plante", parent: "/plants" },
  { pattern: /^\/variety\/(\d+)$/, getLabel: () => "Détail Variété", parent: "/plant-varieties" },
  { pattern: /^\/civilisation\/(\d+)$/, getLabel: () => "Détail Civilisation", parent: "/civilisations" },
  { pattern: /^\/prototypes\/([a-z0-9-]+)$/, getLabel: (m) => `Prototype ${m[1].toUpperCase()}`, parent: "/prototypes" },
  { pattern: /^\/terp-profiles\/(\d+)$/, getLabel: () => "Détail TerpProfile", parent: "/terp-profiles" },
  { pattern: /^\/final-recipes\/(\d+)$/, getLabel: () => "Détail Recette Finale", parent: "/final-recipes" },
  { pattern: /^\/leaf-economy\/(\d+)$/, getLabel: () => "Détail Leaf Economy", parent: "/leaf-economies" },
  { pattern: /^\/etude-climatique\/(\d+)$/, getLabel: () => "Étude Climatique", parent: "/etudes-climatiques" },
  { pattern: /^\/archive-terrain\/(\d+)$/, getLabel: () => "Archive Terrain", parent: "/archives-terrain" },
  { pattern: /^\/protocole-moleculaire\/(\d+)$/, getLabel: () => "Protocole Moléculaire", parent: "/protocoles-moleculaires" },
  { pattern: /^\/test-extraction\/(\d+)$/, getLabel: () => "Test d'Extraction", parent: "/tests-extraction" },
  { pattern: /^\/odeur-situee\/(\d+)$/, getLabel: () => "Odeur Située", parent: "/odeurs-situees" },
  { pattern: /^\/raw-material\/(\d+)$/, getLabel: () => "Matière Première", parent: "/raw-materials" },
];

// Helper pour obtenir le nom du terpène depuis l'ID
function getTerpeneNameFromId(id: string): string {
  const terpenes: Record<string, string> = {
    "1": "Myrcène",
    "2": "Limonène",
    "3": "β-Pinène",
    "4": "β-Caryophyllène",
    "5": "Linalool",
    "6": "α-Pinène",
    "7": "Humulène",
    "8": "Terpinolène",
    "9": "Ocimène",
    "10": "Géraniol",
  };
  return terpenes[id] || `Terpène #${id}`;
}

// Construire la chaîne de breadcrumb depuis un path
function buildBreadcrumbChain(path: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];
  
  if (path === "/") return segments;
  
  // Vérifier d'abord les routes statiques
  const staticConfig = routeConfig[path];
  if (staticConfig) {
    // Construire la chaîne des parents
    const chain: BreadcrumbSegment[] = [];
    let currentPath = path;
    
    while (currentPath && currentPath !== "/") {
      const config = routeConfig[currentPath];
      if (config) {
        chain.unshift({ label: config.label, path: currentPath });
        currentPath = config.parent || "";
      } else {
        break;
      }
    }
    
    return chain;
  }
  
  // Vérifier les routes dynamiques
  for (const { pattern, getLabel, parent } of dynamicRoutePatterns) {
    const match = path.match(pattern);
    if (match) {
      // Ajouter la chaîne des parents
      const parentConfig = routeConfig[parent];
      if (parentConfig) {
        let currentPath = parent;
        const parentChain: BreadcrumbSegment[] = [];
        
        while (currentPath && currentPath !== "/") {
          const config = routeConfig[currentPath];
          if (config) {
            parentChain.unshift({ label: config.label, path: currentPath });
            currentPath = config.parent || "";
          } else {
            break;
          }
        }
        
        segments.push(...parentChain);
      }
      
      // Ajouter la page actuelle
      segments.push({ label: getLabel(match), path });
      return segments;
    }
  }
  
  // Fallback: construire depuis les segments du path
  const parts = path.split("/").filter(Boolean);
  let currentPath = "";
  
  for (const part of parts) {
    currentPath += `/${part}`;
    const config = routeConfig[currentPath];
    if (config) {
      segments.push({ label: config.label, path: currentPath });
    } else {
      const label = part
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      segments.push({ label, path: currentPath });
    }
  }
  
  return segments;
}

export function DynamicBreadcrumb({ segments, className = "" }: DynamicBreadcrumbProps) {
  const [location] = useLocation();

  // Si segments n'est pas fourni, générer automatiquement depuis l'URL
  const breadcrumbSegments = segments || buildBreadcrumbChain(location);

  // Ne pas afficher sur la page d'accueil
  if (location === "/" && !segments) {
    return null;
  }

  // Ne pas afficher si vide
  if (breadcrumbSegments.length === 0) {
    return null;
  }

  return (
    <nav className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      {/* Home */}
      <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Accueil</span>
      </Link>

      {breadcrumbSegments.map((segment, index) => {
        const isLast = index === breadcrumbSegments.length - 1;

        return (
          <div key={segment.path} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            
            {segment.dropdown && segment.dropdown.length > 0 ? (
              // Segment avec dropdown
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:text-foreground transition-colors font-medium">
                  {segment.label}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {segment.dropdown.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link href={item.path} className="w-full cursor-pointer">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isLast ? (
              // Dernier segment (actuel, non cliquable)
              <span className="font-medium text-foreground">{segment.label}</span>
            ) : (
              // Segment intermédiaire cliquable
              <Link href={segment.path} className="hover:text-foreground transition-colors font-medium">
                {segment.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default DynamicBreadcrumb;
