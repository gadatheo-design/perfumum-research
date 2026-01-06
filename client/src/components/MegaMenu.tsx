import { Link } from "wouter";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Beaker,
  FlaskConical,
  Network,
  Sparkles,
  BookOpen,
  Target,
  Users,
  Leaf,
  Settings,
  Microscope,
  BarChart3,
  Layers,
  Search,
  ShieldCheck,
  Compass,
  Database,
  Wrench,
  FileText,
  Map,
  Image,
  Archive,
  Globe,
  Calculator,
} from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  description?: string;
  count?: number;
  badge?: string;
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

  // Determine grid columns based on number of sections
  const gridCols = sections.length <= 2 ? "grid-cols-2" : sections.length === 3 ? "grid-cols-3" : "grid-cols-4";
  const minWidth = sections.length <= 2 ? "min-w-[500px]" : sections.length === 3 ? "min-w-[700px]" : "min-w-[900px]";

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
          <div className={cn("bg-background border rounded-lg shadow-xl p-6", minWidth)}>
            <div className={cn("grid gap-6", gridCols)}>
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
                              {item.badge && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                  {item.badge}
                                </span>
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
  // === DONNÉES (Catalogues + Recherche) ===
  const donneesSections: MegaMenuSection[] = [
    {
      title: "Catalogues",
      items: [
        {
          label: "Molécules",
          path: "/molecules",
          icon: <Beaker className="h-4 w-4" />,
          description: "Base moléculaire complète",
        },
        {
          label: "Recettes",
          path: "/recettes",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "Formules olfactives",
        },
        {
          label: "Plantes & Variétés",
          path: "/plants",
          icon: <Leaf className="h-4 w-4" />,
          description: "Botanique et terroirs",
        },
        {
          label: "Accords",
          path: "/accords",
          icon: <Layers className="h-4 w-4" />,
          description: "Accords olfactifs",
        },
      ],
    },
    {
      title: "Exploration",
      items: [
        {
          label: "Gammes",
          path: "/gammes",
          icon: <Sparkles className="h-4 w-4" />,
          description: "Collections thématiques",
        },
        {
          label: "Terroirs",
          path: "/terroirs",
          icon: <Map className="h-4 w-4" />,
          description: "Origines géographiques",
        },
        {
          label: "Recherche avancée",
          path: "/recherche-avancee",
          icon: <Search className="h-4 w-4" />,
          description: "Filtres multi-critères",
        },
        {
          label: "Alternatives durables",
          path: "/alternatives-durables",
          icon: <ShieldCheck className="h-4 w-4" />,
          description: "Substituts écologiques",
          badge: "NEW",
        },
      ],
    },
    {
      title: "Visualisations",
      items: [
        {
          label: "Synergies Heatmap",
          path: "/synergies-heatmap",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Matrice de compatibilité",
        },
        {
          label: "Graphe Réseau",
          path: "/recipe-network",
          icon: <Network className="h-4 w-4" />,
          description: "Connexions moléculaires",
        },
        {
          label: "Diagramme Sankey",
          path: "/sankey-flow",
          icon: <Layers className="h-4 w-4" />,
          description: "Flux catégories → recettes",
        },
        {
          label: "Galerie Botaniques",
          path: "/galerie-botaniques",
          icon: <Image className="h-4 w-4" />,
          description: "Images et illustrations",
        },
      ],
    },
  ];

  // === OUTILS (Création + Analyse) ===
  const outilsSections: MegaMenuSection[] = [
    {
      title: "Création",
      items: [
        {
          label: "Éditeur de Formulation",
          path: "/outils/editeur-formulation",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "Création formules interactives",
          badge: "NEW",
        },
        {
          label: "Générateur IA",
          path: "/outils/generateur-formules",
          icon: <Sparkles className="h-4 w-4" />,
          description: "Suggestions intelligentes",
        },
        {
          label: "Calculateur",
          path: "/calculateur",
          icon: <Calculator className="h-4 w-4" />,
          description: "Formulation terpénique",
        },
      ],
    },
    {
      title: "Analyse",
      items: [
        {
          label: "Synergies Moléculaires",
          path: "/synergies",
          icon: <Network className="h-4 w-4" />,
          description: "Effet entourage",
          badge: "NEW",
        },
        {
          label: "Profils Terpéniques",
          path: "/terp-profiles",
          icon: <Leaf className="h-4 w-4" />,
          description: "Références analytiques",
        },
        {
          label: "Conformité IFRA",
          path: "/ifra",
          icon: <ShieldCheck className="h-4 w-4" />,
          description: "Vérification réglementaire",
        },
        {
          label: "Comparaison Profils",
          path: "/terp-profiles/compare",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Radar comparatif",
        },
      ],
    },
  ];

  // === RECHERCHE (Méthodologie + Archives) ===
  const rechercheSections: MegaMenuSection[] = [
    {
      title: "Axes de Recherche",
      items: [
        {
          label: "Vue d'ensemble",
          path: "/axes-recherche",
          icon: <Compass className="h-4 w-4" />,
          description: "Les 5 axes fondamentaux PERFUMUM",
          badge: "NEW",
        },
        {
          label: "Bibliographie Globale",
          path: "/bibliographie-globale",
          icon: <BookOpen className="h-4 w-4" />,
          description: "Sources et références scientifiques",
          badge: "NEW",
        },
      ],
    },
    {
      title: "Méthode ABSORBE",
      items: [
        {
          label: "Présentation",
          path: "/methodologie/absorbe",
          icon: <BookOpen className="h-4 w-4" />,
          description: "Captation atmosphérique",
        },
        {
          label: "Échelle de classification",
          path: "/methodologie/echelle",
          icon: <Layers className="h-4 w-4" />,
          description: "Système de notation",
        },
        {
          label: "GC-MS & Pyrolyse",
          path: "/methodologie/gcms",
          icon: <Microscope className="h-4 w-4" />,
          description: "Analyses chromatographiques",
        },
      ],
    },
    {
      title: "Archives & Terrain",
      items: [
        {
          label: "Archives de Terrain",
          path: "/archives-terrain",
          icon: <Database className="h-4 w-4" />,
          description: "Captations in situ",
        },
        {
          label: "Archives Olfactives",
          path: "/archives-olfactives",
          icon: <Archive className="h-4 w-4" />,
          description: "Manuscrits et formules historiques",
        },
        {
          label: "Civilisations",
          path: "/civilisations",
          icon: <Globe className="h-4 w-4" />,
          description: "Traditions olfactives mondiales",
        },
        {
          label: "Timeline",
          path: "/timeline",
          icon: <FileText className="h-4 w-4" />,
          description: "Chronologie recherche",
        },
      ],
    },
  ];

  // === PROJET (À propos + Administration) ===
  const projetSections: MegaMenuSection[] = [
    {
      title: "Documentation",
      items: [
        {
          label: "Glossaire",
          path: "/glossaire",
          icon: <BookOpen className="h-4 w-4" />,
          description: "Terminologie olfactive",
        },
        {
          label: "Fondements théoriques",
          path: "/recherche/fondements-theoriques",
          icon: <Microscope className="h-4 w-4" />,
          description: "Phénoménologie olfactive",
        },
        {
          label: "Manifeste",
          path: "/manifeste",
          icon: <Target className="h-4 w-4" />,
          description: "Vision 2025-2035",
        },
      ],
    },
    {
      title: "Le Projet",
      items: [
        {
          label: "À propos",
          path: "/a-propos",
          icon: <Users className="h-4 w-4" />,
          description: "Histoire et équipe",
        },
        {
          label: "Nouveautés",
          path: "/nouveautes",
          icon: <Sparkles className="h-4 w-4" />,
          description: "Dernières mises à jour",
          badge: "NEW",
        },
        {
          label: "Contribuer",
          path: "/contribuer",
          icon: <Target className="h-4 w-4" />,
          description: "Rejoindre le projet",
        },
        {
          label: "Administration",
          path: "/admin",
          icon: <Settings className="h-4 w-4" />,
          description: "Gestion du site",
        },
      ],
    },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Menu principal">
      <MegaMenuDropdown trigger="Données" sections={donneesSections} />
      <MegaMenuDropdown trigger="Outils" sections={outilsSections} />
      <MegaMenuDropdown trigger="Recherche" sections={rechercheSections} />
      <MegaMenuDropdown trigger="Projet" sections={projetSections} />
    </nav>
  );
}
