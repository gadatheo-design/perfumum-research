// @ts-nocheck
import { Link } from "wouter";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  FileText,
  Map,
  Image,
  Archive,
  Globe,
  Calculator,
  Library,
  Download,
  GitBranch,
  Clock,
  ChevronRight,
  Palette,
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
  highlight?: MenuItem;
}

// Virtual list for large sections (>10 items)
const VirtualizedSection: React.FC<{
  items: MenuItem[];
  maxHeight: number;
  onItemClick: () => void;
}> = ({ items, maxHeight, onItemClick }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = 48; // Approximate height of each item
  const containerHeight = Math.min(items.length * itemHeight, maxHeight);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    Math.ceil((scrollTop + containerHeight) / itemHeight) + 1,
    items.length
  );
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
    >
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={onItemClick}
              className={cn(
                "flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group",
                "hover:bg-muted/80 hover:translate-x-0.5",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-muted/80"
              )}
              role="menuitem"
              style={{ height: itemHeight }}
            >
              {item.icon && (
                <div className="text-muted-foreground group-hover:text-primary transition-colors mt-0.5 shrink-0">
                  {item.icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
                      item.badge === "NEW" 
                        ? "bg-green-500/15 text-green-600 dark:text-green-400"
                        : "bg-primary/10 text-primary"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

function MegaMenuDropdown({ trigger, sections, highlight }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Delayed close for better UX
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setFocusedIndex(-1);
    }, 150);
  };

  // Track item index across sections
  let itemIndex = 0;

  // Determine grid columns based on number of sections
  const gridCols = sections.length <= 2 ? "grid-cols-2" : sections.length === 3 ? "grid-cols-3" : "grid-cols-4";
  const minWidth = sections.length <= 2 ? "min-w-[520px]" : sections.length === 3 ? "min-w-[720px]" : "min-w-[920px]";

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        ref={triggerRef}
        className={cn(
          "px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md",
          "text-foreground/70 hover:text-foreground hover:bg-muted/50",
          isOpen && "text-foreground bg-muted/50"
        )}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </button>

      {/* Dropdown with animation */}
      <div 
        ref={menuRef}
        className={cn(
          "absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50",
          "transition-all duration-200 ease-out",
          isOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
        role="menu"
        aria-label={trigger}
      >
        <div className={cn(
          "bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-5",
          minWidth
        )}>
          {/* Highlight section if provided */}
          {highlight && (
            <Link
              href={highlight.path}
              onClick={() => {
                setIsOpen(false);
                setFocusedIndex(-1);
              }}
              className="flex items-center gap-4 p-4 mb-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-all group"
            >
              {highlight.icon && (
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  {highlight.icon}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{highlight.label}</span>
                  {highlight.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                      {highlight.badge}
                    </span>
                  )}
                </div>
                {highlight.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">{highlight.description}</p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          )}

          <div className={cn("grid gap-6", gridCols)}>
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} role="group" aria-labelledby={`section-${sectionIndex}`}>
                <h3 
                  id={`section-${sectionIndex}`}
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3"
                >
                  {section.title}
                </h3>
                {/* Use virtualization for sections with 10+ items */}
                {section.items.length > 10 ? (
                  <VirtualizedSection
                    items={section.items}
                    maxHeight={384}
                    onItemClick={() => {
                      setIsOpen(false);
                      setFocusedIndex(-1);
                    }}
                  />
                ) : (
                  <div className="space-y-0.5">
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
                            "flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group",
                            "hover:bg-muted/80 hover:translate-x-0.5",
                            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-muted/80"
                          )}
                          role="menuitem"
                          tabIndex={isOpen ? 0 : -1}
                        >
                          {item.icon && (
                            <div className="text-muted-foreground group-hover:text-primary transition-colors mt-0.5 shrink-0">
                              {item.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground">
                                {item.label}
                              </span>
                              {item.count !== undefined && (
                                <span className="text-xs text-muted-foreground">({item.count})</span>
                              )}
                              {item.badge && (
                                <span className={cn(
                                  "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
                                  item.badge === "NEW" 
                                    ? "bg-green-500/15 text-green-600 dark:text-green-400"
                                    : "bg-primary/10 text-primary"
                                )}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
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
          description: "Molécules, familles olfactives et chimiques",
          badge: "HUB",
        },
        {
          label: "Recettes",
          path: "/recettes",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "Recettes, accords et formules de référence",
          badge: "HUB",
        },
        {
          label: "Plantes & Variétés",
          path: "/plants",
          icon: <Leaf className="h-4 w-4" />,
          description: "Botanique et terroirs",
        },

        {
          label: "Terroirs",
          path: "/terroirs",
          icon: <Map className="h-4 w-4" />,
          description: "Origines géographiques",
        },
        {
          label: "Classification Phylogénétique",
          path: "/phylogenetique",
          icon: <GitBranch className="h-4 w-4" />,
          description: "Familles botaniques et molécules",
          badge: "NEW",
        },
        {
          label: "Osmothèque",
          path: "/osmotheque",
          icon: <Archive className="h-4 w-4" />,
          description: "Molécules historiques et patrimoine olfactif",
          badge: "NEW",
        },
        {
          label: "Structures SMILES",
          path: "/smiles",
          icon: <Beaker className="h-4 w-4" />,
          description: "Visualisation moléculaire 2D",
          badge: "NEW",
        },
      ],
    },
    {
      title: "Leaf Economies",
      items: [
        {
          label: "Échantillons botaniques",
          path: "/leaf-economies",
          icon: <Leaf className="h-4 w-4" />,
          description: "Programme San Andrés",
          badge: "NEW",
        },
        {
          label: "Timeline botanique",
          path: "/timeline-botanique",
          icon: <Clock className="h-4 w-4" />,
          description: "Chronologie T0-T4",
        },
        {
          label: "Recettes finales",
          path: "/final-recipes",
          icon: <Beaker className="h-4 w-4" />,
          description: "Parfum, encens, espace",
        },
        {
          label: "Recettes TL",
          path: "/recettes-tl",
          icon: <Leaf className="h-4 w-4" />,
          description: "Tagetes lucida",
          badge: "NEW",
        },
      ],
    },
    {
      title: "Exploration",
      items: [
        {
          label: "Gammes",
          path: "/gammes-hub",
          icon: <Palette className="h-4 w-4" />,
          description: "Collections thématiques",
          badge: "HUB",
        },
        {
          label: "Chémotypes",
          path: "/chemotypes",
          icon: <Leaf className="h-4 w-4" />,
          description: "Variations chimiques par origine",
          badge: "NEW",
        },
        {
          label: "Carte GPS Plantes",
          path: "/carte-plantes-gps",
          icon: <Compass className="h-4 w-4" />,
          description: "Localisation géographique",
        },
        {
          label: "Recherche avancée",
          path: "/recherche-avancee",
          icon: <Search className="h-4 w-4" />,
          description: "Filtres multi-critères",
        },
        {
          label: "Recherche par Molécule",
          path: "/recherche-molecule",
          icon: <Beaker className="h-4 w-4" />,
          description: "Trouver les plantes par molécule",
          badge: "NEW",
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
          label: "Hub Visualisations",
          path: "/visualisations",
          icon: <Network className="h-4 w-4" />,
          description: "Toutes les visualisations",
          badge: "HUB",
        },
        {
          label: "Synergies Heatmap",
          path: "/synergies-heatmap",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Matrice de compatibilité",
        },
        {
          label: "Corrélations Parfum × Tabac × Cannabis",
          path: "/correlations",
          icon: <GitBranch className="h-4 w-4" />,
          description: "Molécules communes inter-domaines",
          badge: "NEW",
        },
        {
          label: "Parfums emblématiques",
          path: "/parfums",
          icon: <Sparkles className="h-4 w-4" />,
          description: "Navigation inverse parfum → molécules",
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

      ],
    },
  ];

  // === OUTILS (Création + Analyse) ===
  const outilsSections: MegaMenuSection[] = [
    {
      title: "Accès rapide",
      items: [
        {
          label: "Hub Outils",
          path: "/outils-hub",
          icon: <Sparkles className="h-4 w-4" />,
          description: "Tous les outils en un seul endroit",
          badge: "HUB",
        },
      ],
    },
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
          label: "Statistiques Olfactives",
          path: "/stats-olfactives",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Répartition percepts & IFRA",
          badge: "NEW",
        },
        {
          label: "Recherche par Percept",
          path: "/percepts",
          icon: <Search className="h-4 w-4" />,
          description: "Explorer par descripteur olfactif",
        },
        {
          label: "Comparaison Profils",
          path: "/terp-profiles/compare",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Radar comparatif",
        },
        {
          label: "Enrichissement PubChem",
          path: "/enrichissement",
          icon: <Database className="h-4 w-4" />,
          description: "Enrichir les données moléculaires",
          badge: "NEW",
        },
      ],
    },
  ];

  // Highlight pour Outils
  const outilsHighlight: MenuItem = {
    label: "Hub Outils",
    path: "/outils-hub",
    icon: <Sparkles className="h-5 w-5" />,
    description: "Accédez à tous les outils de formulation, analyse et calcul en un seul endroit",
    badge: "Nouveau",
  };

  // === RECHERCHE (Méthodologie + Archives + Axes) ===
  const rechercheSections: MegaMenuSection[] = [
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
        {
          label: "Méthodes Analytiques",
          path: "/methodes-analytiques",
          icon: <Microscope className="h-4 w-4" />,
          description: "GC-MS, PTR-MS, HPLC, IR, RMN",
          badge: "NEW",
        },
      ],
    },
    {
      title: "Axes de Recherche",
      items: [
        {
          label: "Vue d'ensemble",
          path: "/axes-recherche",
          icon: <GitBranch className="h-4 w-4" />,
          description: "Tous les programmes",
          badge: "11 axes",
        },
        {
          label: "Bibliographie",
          path: "/bibliographie",
          icon: <Library className="h-4 w-4" />,
          description: "Références scientifiques",
        },
        {
          label: "Export bibliographique",
          path: "/export-bibliographique",
          icon: <Download className="h-4 w-4" />,
          description: "BibTeX, RIS, EndNote",
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
          label: "Manifeste",
          path: "/manifeste",
          icon: <Target className="h-4 w-4" />,
          description: "Vision 2025-2035",
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
    <nav className="hidden lg:flex items-center gap-0.5" role="navigation" aria-label="Menu principal">
      <MegaMenuDropdown trigger="Données" sections={donneesSections} />
      <MegaMenuDropdown trigger="Outils" sections={outilsSections} highlight={outilsHighlight} />
      <MegaMenuDropdown trigger="Recherche" sections={rechercheSections} />
      <MegaMenuDropdown trigger="Projet" sections={projetSections} />
    </nav>
  );
}
