import { Link } from "wouter";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Beaker,
  Droplets,
  Network,
  Sparkles,
  BarChart3,
  Image,
  Leaf,
  FlaskConical,
  Users,
  Map,
  FileText,
  Settings,
} from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  description?: string;
  count?: number;
}

interface MegaMenuSection {
  title: string;
  items: MenuItem[];
}

interface MegaMenuProps {
  trigger: string;
  sections: MegaMenuSection[];
}

function MegaMenuDropdown({ trigger, sections }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <button className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
        {trigger}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
          <div className="bg-background border rounded-lg shadow-xl p-6 min-w-[600px]">
            <div className="grid grid-cols-3 gap-6">
              {sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link key={item.path} href={item.path}>
                        <a
                          onClick={() => setIsOpen(false)}
                          className="flex items-start gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                        >
                          {item.icon && (
                            <div className="text-muted-foreground group-hover:text-foreground transition-colors mt-0.5">
                              {item.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.label}</span>
                              {item.count !== undefined && (
                                <span className="text-xs text-muted-foreground">({item.count})</span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MegaMenu() {
  const etudesSections: MegaMenuSection[] = [
    {
      title: "Molécules",
      items: [
        {
          label: "Terpènes",
          path: "/terpenes",
          icon: <Leaf className="h-4 w-4" />,
          description: "7 terpènes majeurs du cannabis",
          count: 7,
        },
        {
          label: "Toutes les molécules",
          path: "/molecules",
          icon: <Beaker className="h-4 w-4" />,
          description: "Base complète 131 molécules",
          count: 131,
        },
        {
          label: "Familles chimiques",
          path: "/familles-chimiques",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "11 familles olfactives",
        },
      ],
    },
    {
      title: "Visualisations",
      items: [
        {
          label: "Graphe D3.js",
          path: "/graphe-molecules-recettes",
          icon: <Network className="h-4 w-4" />,
          description: "Relations molécules-recettes",
        },
        {
          label: "Matrice synergies",
          path: "/matrice-synergies",
          icon: <Sparkles className="h-4 w-4" />,
          description: "21 combinaisons terpéniques",
        },
        {
          label: "Comparaison radar",
          path: "/compare-radar",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Profils olfactifs superposés",
        },
        {
          label: "Galerie botaniques",
          path: "/galerie-botaniques",
          icon: <Image className="h-4 w-4" />,
          description: "Illustrations scientifiques",
        },
      ],
    },
    {
      title: "Outils",
      items: [
        {
          label: "Comparateur terpènes",
          path: "/compare-terpenes",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Comparer 2-4 terpènes",
        },
        {
          label: "Glossaire",
          path: "/glossaire",
          icon: <FileText className="h-4 w-4" />,
          description: "Termes techniques",
        },
      ],
    },
  ];

  const resinesSections: MegaMenuSection[] = [
    {
      title: "Collections",
      items: [
        {
          label: "Collection Classique",
          path: "/resines-cbd?collection=classique",
          icon: <Droplets className="h-4 w-4" />,
          description: "5 résines validées",
          count: 5,
        },
        {
          label: "Collection Expérimentale",
          path: "/resines-cbd?collection=experimentale",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "5 prototypes en test",
          count: 5,
        },
        {
          label: "Toutes les résines",
          path: "/resines-cbd",
          icon: <Droplets className="h-4 w-4" />,
          description: "Catalogue complet",
          count: 10,
        },
      ],
    },
    {
      title: "Analyse",
      items: [
        {
          label: "Timeline aromatique",
          path: "/resines-cbd",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Évolution tête/cœur/fond",
        },
        {
          label: "Compositions",
          path: "/graphe-molecules-recettes",
          icon: <Network className="h-4 w-4" />,
          description: "Voir dans le graphe",
        },
      ],
    },
    {
      title: "Documentation",
      items: [
        {
          label: "Méthodologie",
          path: "/methode",
          icon: <FileText className="h-4 w-4" />,
          description: "Protocoles de recherche",
        },
      ],
    },
  ];

  const petrichorSections: MegaMenuSection[] = [
    {
      title: "Gammes",
      items: [
        {
          label: "C1 — Fermentum",
          path: "/gammes/petrichor/c1-fermentum",
          icon: <Droplets className="h-4 w-4" />,
          description: "Notes fermentées",
        },
        {
          label: "C2 — Clarus Verde",
          path: "/gammes/petrichor/c2-clarus-verde",
          icon: <Leaf className="h-4 w-4" />,
          description: "Fraîcheur végétale",
        },
        {
          label: "C3 — Lacta Solis",
          path: "/gammes/petrichor/c3-lacta-solis",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "Chaleur lactée",
        },
        {
          label: "C4 — Terra Ambra",
          path: "/gammes/petrichor/c4-terra-ambra",
          icon: <Beaker className="h-4 w-4" />,
          description: "Profondeur ambrée",
        },
      ],
    },
    {
      title: "Traditions",
      items: [
        {
          label: "12 Civilisations",
          path: "/traditions-olfactives",
          icon: <Users className="h-4 w-4" />,
          description: "Histoire mondiale",
          count: 12,
        },
        {
          label: "Carte temporelle",
          path: "/timeline",
          icon: <Map className="h-4 w-4" />,
          description: "Frise chronologique",
        },
      ],
    },
    {
      title: "Projets",
      items: [
        {
          label: "Installations",
          path: "/installations",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "Dispositifs olfactifs",
        },
      ],
    },
  ];

  const adminSections: MegaMenuSection[] = [
    {
      title: "Gestion",
      items: [
        {
          label: "Dashboard",
          path: "/admin",
          icon: <Settings className="h-4 w-4" />,
          description: "Administration",
        },
        {
          label: "Nouvelle molécule",
          path: "/admin/molecule/new",
          icon: <Beaker className="h-4 w-4" />,
          description: "Ajouter une entrée",
        },
        {
          label: "Import/Export CSV",
          path: "/admin/import-export",
          icon: <FileText className="h-4 w-4" />,
          description: "Gestion données",
        },
      ],
    },
    {
      title: "Favoris",
      items: [
        {
          label: "Mes favoris",
          path: "/favoris",
          icon: <Sparkles className="h-4 w-4" />,
          description: "Sélection personnelle",
        },
      ],
    },
    {
      title: "Informations",
      items: [
        {
          label: "À propos",
          path: "/a-propos",
          icon: <FileText className="h-4 w-4" />,
          description: "Le projet PERFUMUM",
        },
        {
          label: "Contact",
          path: "/contact",
          icon: <Users className="h-4 w-4" />,
          description: "Nous contacter",
        },
      ],
    },
  ];

  return (
    <div className="hidden lg:flex items-center space-x-1">
      <MegaMenuDropdown trigger="Études" sections={etudesSections} />
      <MegaMenuDropdown trigger="Résines CBD" sections={resinesSections} />
      <MegaMenuDropdown trigger="Pétrichor" sections={petrichorSections} />
      <MegaMenuDropdown trigger="Admin" sections={adminSections} />
    </div>
  );
}
