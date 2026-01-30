import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Mapping des chemins vers des labels lisibles
const pathLabels: Record<string, string> = {
  molecules: "Molécules",
  molecule: "Molécule",
  recettes: "Recettes",
  recette: "Recette",
  accords: "Accords",
  accord: "Accord",
  prototypes: "Prototypes",
  prototype: "Prototype",
  gammes: "Gammes",
  civilisations: "Traditions Olfactives",
  methodologie: "Méthodologie",
  absorbe: "ABSORBE",
  gcms: "GC-MS",
  pyrolyse: "Pyrolyse",
  echelle: "Échelle ABSORBE",
  recherche: "Recherche",
  dashboard: "Dashboard",
  admin: "Administration",
  favoris: "Favoris",
  timeline: "Timeline",
  glossaire: "Glossaire",
  "a-propos": "À propos",
  contribuer: "Contribuer",
  manifeste: "Manifeste",
  colombie: "Colombie",
  sourcing: "Sourcing",
  ifra: "Normes IFRA",
  "bio-mineralis": "Bio-Mineralis",
  "recherche-avancee": "Recherche Avancée",
  "formules-reference": "Formules de Référence",
  "suggestions-synergies": "Synergies",
  "heatmap-correlations": "Heatmap Corrélations",
  "recipe-network": "Graphe Réseau",
  "timeline-recettes": "Timeline Recettes",
  "mon-dashboard": "Mon Dashboard",
  "archives-terrain": "Archives de Terrain",
  "etudes-climatiques": "Études Climatiques",
  "protocoles-moleculaires": "Protocoles Moléculaires",
  "recherche-scientifique": "Recherche Scientifique",
  "programmes-recherche": "Programmes R&D",
};

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  const [location] = useLocation();
  
  // Si des items sont fournis, les utiliser directement
  if (items && items.length > 0) {
    return (
      <Breadcrumb className={className}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Home className="h-3.5 w-3.5" />
                <span className="sr-only">Accueil</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {items.map((item, index) => (
            <span key={index} className="contents">
              <BreadcrumbSeparator>
                <ChevronRight className="h-3.5 w-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  
  // Sinon, générer automatiquement à partir de l'URL
  const pathSegments = location.split("/").filter(Boolean);
  
  if (pathSegments.length === 0) {
    return null; // Pas de breadcrumb sur la page d'accueil
  }
  
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    
    return {
      label,
      href: isLast ? undefined : href,
    };
  });
  
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only">Accueil</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <span key={index} className="contents">
            <BreadcrumbSeparator>
              <ChevronRight className="h-3.5 w-3.5" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-medium">{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
