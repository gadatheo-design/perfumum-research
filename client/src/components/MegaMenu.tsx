import { Link } from "wouter";
import { useState, useRef, useEffect, useCallback } from "react";
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
  Lightbulb,
  Database,
  Truck,
  Flame,
  Zap,
  Clock,
  Bell,
  Search,
  LineChart,
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Flatten all items for keyboard navigation
  const allItems = sections.flatMap(section => section.items);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => (prev + 1) % allItems.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
    }
  }, [isOpen, allItems.length]);

  // Focus item when focusedIndex changes
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && itemsRef.current[focusedIndex]) {
      itemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Track item index across sections
  let itemIndex = 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setFocusedIndex(-1);
      }}
    >
      {/* Trigger */}
      <button
        ref={triggerRef}
        className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
          role="menu"
          aria-label={trigger}
        >
          <div className="bg-background border rounded-lg shadow-xl p-6 min-w-[600px]">
            <div className="grid grid-cols-3 gap-6">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} role="group" aria-labelledby={`section-${sectionIndex}`}>
                  <h3 
                    id={`section-${sectionIndex}`}
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
                  >
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const currentIndex = itemIndex++;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          ref={(el) => { itemsRef.current[currentIndex] = el; }}
                          onClick={() => {
                            setIsOpen(false);
                            setFocusedIndex(-1);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              e.preventDefault();
                              setIsOpen(false);
                              setFocusedIndex(-1);
                              triggerRef.current?.focus();
                            } else if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setFocusedIndex((currentIndex + 1) % allItems.length);
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              setFocusedIndex((currentIndex - 1 + allItems.length) % allItems.length);
                            }
                          }}
                          className={cn(
                            "flex items-start gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors group",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:bg-muted"
                          )}
                          role="menuitem"
                          tabIndex={isOpen ? 0 : -1}
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
                        </Link>
                      );
                    })}
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
          label: "Recherche globale",
          path: "/recherche",
          icon: <Search className="h-4 w-4" />,
          description: "Rechercher dans toutes les données",
        },
        {
          label: "Outils de formulation",
          path: "/outils-formulation",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "Suite complète d'outils",
        },
        {
          label: "Calculateur de proportions",
          path: "/calculateur",
          icon: <Beaker className="h-4 w-4" />,
          description: "Créer formules terpéniques",
        },
        {
          label: "Analyses de corrélations",
          path: "/analyses",
          icon: <Sparkles className="h-4 w-4" />,
          description: "Co-occurrences terpènes",
        },
        {
          label: "Comparateur terpènes",
          path: "/compare-terpenes",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Comparer 2-4 terpènes",
        },
        {
          label: "Comparateur avancé",
          path: "/comparateur-avance",
          icon: <Network className="h-4 w-4" />,
          description: "Molécules & recettes avec radar",
        },
        {
          label: "Glossaire",
          path: "/glossaire",
          icon: <FileText className="h-4 w-4" />,
          description: "Termes techniques",
        },
        {
          label: "Glossaire Visuel Radar",
          path: "/glossaire-visuel-radar",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Comprendre les profils radar",
        },
        {
          label: "Fournisseurs",
          path: "/fournisseurs",
          icon: <Truck className="h-4 w-4" />,
          description: "12 fournisseurs référencés",
          count: 12,
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
        {
          label: "Échelle ABSORBE",
          path: "/methodologie/echelle-absorbe",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "7 catégories olfactives",
        },
        {
          label: "Protocoles maturation",
          path: "/protocoles-maturation",
          icon: <Clock className="h-4 w-4" />,
          description: "Temps de cure et conditions",
        },
        {
          label: "Chimie du Tabac",
          path: "/chimie-tabac",
          icon: <Flame className="h-4 w-4" />,
          description: "Esters et acides gras",
        },
        {
          label: "Synergies Terpènes",
          path: "/synergies-terpenes-niches",
          icon: <Zap className="h-4 w-4" />,
          description: "Interactions moléculaires",
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
          label: "26 Traditions Olfactives",
          path: "/civilisations",
          icon: <Users className="h-4 w-4" />,
          description: "Histoire mondiale",
          count: 26,
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
        {
          label: "Recherche Radicale",
          path: "/recherche-radicale",
          icon: <Flame className="h-4 w-4" />,
          description: "Série Pétrichor Radicalis Extremis",
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
          label: "Molécules",
          path: "/admin/molecules",
          icon: <Database className="h-4 w-4" />,
          description: "Gérer les profils radar",
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
      title: "Intelligence IA",
      items: [
        {
          label: "Analytics",
          path: "/analytics",
          icon: <LineChart className="h-4 w-4" />,
          description: "Statistiques et tendances",
        },
        {
          label: "Suggestions Synergies",
          path: "/suggestions-synergies",
          icon: <Lightbulb className="h-4 w-4" />,
          description: "Paires moléculaires similaires",
        },
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
        {
          label: "Nouveautés",
          path: "/nouveautes",
          icon: <Bell className="h-4 w-4" />,
          description: "Dernières mises à jour",
        },
        {
          label: "Comment Contribuer",
          path: "/contribuer",
          icon: <Users className="h-4 w-4" />,
          description: "Rejoindre le projet",
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
