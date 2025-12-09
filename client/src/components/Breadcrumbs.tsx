import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const [location] = useLocation();
  
  // Parse location into breadcrumb segments
  const segments = location.split("/").filter(Boolean);
  
  // Don't show breadcrumbs on homepage
  if (segments.length === 0) return null;
  
  // Map paths to readable labels
  const labelMap: Record<string, string> = {
    "prototypes": "Prototypes",
    "familles": "Familles",
    "laboratoire": "Laboratoire",
    "recettes": "Recettes",
    "molecules": "Molécules",
    "accords": "Accords",
    "tabacs": "Tabacs",
    "civilisations": "Traditions Olfactives",
    "projet": "Le Projet",
    "recherche": "Recherche",
    "bio-mineralis": "BIO-MINERALIS",
    "resines-cbd": "Résines CBD",
    "gammes": "Gammes",
    "mossi": "Royal Mossi",
  };
  
  return (
    <nav className="container py-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link href="/">
            <a className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="sr-only">Accueil</span>
            </a>
          </Link>
        </li>
        
        {segments.map((segment, index) => {
          const path = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
          
          return (
            <li key={path} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              {isLast ? (
                <span className="text-foreground font-medium">{label}</span>
              ) : (
                <Link href={path}>
                  <a className="hover:text-foreground transition-colors">{label}</a>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
