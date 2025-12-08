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

export function DynamicBreadcrumb({ segments, className = "" }: DynamicBreadcrumbProps) {
  const [location] = useLocation();

  // Si segments n'est pas fourni, générer automatiquement depuis l'URL
  const breadcrumbSegments = segments || generateSegmentsFromPath(location);

  return (
    <nav className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      {/* Home */}
      <Link href="/">
        <a className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Accueil</span>
        </a>
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
                      <Link href={item.path}>
                        <a className="w-full cursor-pointer">{item.label}</a>
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
              <Link href={segment.path}>
                <a className="hover:text-foreground transition-colors font-medium">
                  {segment.label}
                </a>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// Générer les segments automatiquement depuis le path
function generateSegmentsFromPath(path: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];
  
  // Cas spéciaux
  if (path === "/") return [];
  
  if (path === "/terpenes") {
    segments.push({
      label: "Terpènes",
      path: "/terpenes",
      dropdown: [
        { label: "Myrcène", path: "/terpene/1" },
        { label: "Limonène", path: "/terpene/2" },
        { label: "β-Pinène", path: "/terpene/3" },
        { label: "β-Caryophyllène", path: "/terpene/4" },
        { label: "Linalool", path: "/terpene/5" },
        { label: "α-Pinène", path: "/terpene/6" },
        { label: "Humulène", path: "/terpene/7" },
      ],
    });
  } else if (path.startsWith("/terpene/")) {
    segments.push({
      label: "Terpènes",
      path: "/terpenes",
      dropdown: [
        { label: "Myrcène", path: "/terpene/1" },
        { label: "Limonène", path: "/terpene/2" },
        { label: "β-Pinène", path: "/terpene/3" },
        { label: "β-Caryophyllène", path: "/terpene/4" },
        { label: "Linalool", path: "/terpene/5" },
        { label: "α-Pinène", path: "/terpene/6" },
        { label: "Humulène", path: "/terpene/7" },
      ],
    });
    segments.push({
      label: getTerpeneNameFromId(path.split("/")[2]),
      path,
    });
  } else if (path === "/resines-cbd") {
    segments.push({
      label: "Résines CBD",
      path: "/resines-cbd",
    });
  } else if (path.startsWith("/recette/")) {
    segments.push({
      label: "Résines CBD",
      path: "/resines-cbd",
    });
    segments.push({
      label: "Détail Recette",
      path,
    });
  } else if (path === "/graphe-molecules-recettes") {
    segments.push({
      label: "Graphe Molécules-Recettes",
      path: "/graphe-molecules-recettes",
    });
  } else if (path === "/matrice-synergies") {
    segments.push({
      label: "Matrice Synergies",
      path: "/matrice-synergies",
    });
  } else if (path === "/compare-terpenes") {
    segments.push({
      label: "Terpènes",
      path: "/terpenes",
    });
    segments.push({
      label: "Comparaison",
      path: "/compare-terpenes",
    });
  } else if (path === "/compare-radar") {
    segments.push({
      label: "Terpènes",
      path: "/terpenes",
    });
    segments.push({
      label: "Comparaison Radar",
      path: "/compare-radar",
    });
  } else if (path === "/galerie-botaniques") {
    segments.push({
      label: "Galerie Botaniques",
      path: "/galerie-botaniques",
    });
  } else if (path === "/admin") {
    segments.push({
      label: "Administration",
      path: "/admin",
    });
  } else if (path === "/admin/import-export") {
    segments.push({
      label: "Administration",
      path: "/admin",
    });
    segments.push({
      label: "Import/Export CSV",
      path: "/admin/import-export",
    });
  } else if (path.startsWith("/molecule/")) {
    segments.push({
      label: "Molécules",
      path: "/molecules",
    });
    segments.push({
      label: "Détail Molécule",
      path,
    });
  } else if (path.startsWith("/civilisation/")) {
    segments.push({
      label: "Traditions Olfactives",
      path: "/traditions-olfactives",
    });
    segments.push({
      label: "Détail Civilisation",
      path,
    });
  } else {
    // Fallback générique
    const parts = path.split("/").filter(Boolean);
    parts.forEach((part, i) => {
      const partPath = "/" + parts.slice(0, i + 1).join("/");
      segments.push({
        label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
        path: partPath,
      });
    });
  }
  
  return segments;
}

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
  };
  return terpenes[id] || `Terpène #${id}`;
}
