import React from "react";
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
  FileText,
  Map,
  Archive,
  Globe,
  Calculator,
  Library,
  Download,
  GitBranch,
  Clock,
  ChevronRight,
  Palette,
  Cigarette,
  Package,
  Truck,
  Building2,
  Skull,
  Atom,
  TreePine,
  Flame,
  Waves,
  ScanLine,
  Dna,
  ScrollText,
  PenLine,
  Zap,
  LayoutGrid,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  description?: string;
  count?: number;
  badge?: "HUB" | "NEW" | string;
  featured?: boolean;
}

interface MegaMenuSection {
  title: string;
  color?: string; // accent color class for section header
  items: MenuItem[];
}

interface MegaMenuProps {
  trigger: string;
  triggerIcon?: React.ReactNode;
  sections: MegaMenuSection[];
  featured?: MenuItem; // top featured card
  accentColor?: string; // e.g. "violet" | "amber" | "emerald" | "sky"
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function ItemBadge({ badge }: { badge: string }) {
  if (badge === "HUB") {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-primary/15 text-primary">
        HUB
      </span>
    );
  }
  if (badge === "NEW") {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        NEW
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground">
      {badge}
    </span>
  );
}

// ─── Single menu item ─────────────────────────────────────────────────────────

const NavItem = React.forwardRef<
  HTMLAnchorElement,
  {
    item: MenuItem;
    onClose: () => void;
    tabIndex?: number;
    onKeyDown?: (e: React.KeyboardEvent<HTMLAnchorElement>) => void;
  }
>(({ item, onClose, tabIndex, onKeyDown }, ref) => (
  <Link
    href={item.path}
    ref={ref}
    onClick={onClose}
    onKeyDown={onKeyDown}
    tabIndex={tabIndex}
    role="menuitem"
    className={cn(
      "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150",
      "hover:bg-muted/70 focus:outline-none focus:bg-muted/70",
      "focus-visible:ring-2 focus-visible:ring-primary/40"
    )}
  >
    {item.icon && (
      <span className="shrink-0 text-muted-foreground/70 group-hover:text-primary transition-colors duration-150">
        {item.icon}
      </span>
    )}
    <span className="flex-1 min-w-0">
      <span className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[13px] font-medium text-foreground/85 group-hover:text-foreground leading-tight">
          {item.label}
        </span>
        {item.badge && <ItemBadge badge={item.badge} />}
      </span>
      {item.description && (
        <span className="block text-[11px] text-muted-foreground/70 mt-0.5 leading-tight line-clamp-1">
          {item.description}
        </span>
      )}
    </span>
  </Link>
));
NavItem.displayName = "NavItem";

// ─── Featured card ────────────────────────────────────────────────────────────

function FeaturedCard({ item, onClose, accentColor }: { item: MenuItem; onClose: () => void; accentColor?: string }) {
  const colorMap: Record<string, string> = {
    violet: "from-violet-500/10 to-purple-500/5 border-violet-500/20 hover:border-violet-500/40",
    amber: "from-amber-500/10 to-orange-500/5 border-amber-500/20 hover:border-amber-500/40",
    emerald: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20 hover:border-emerald-500/40",
    sky: "from-sky-500/10 to-blue-500/5 border-sky-500/20 hover:border-sky-500/40",
    rose: "from-rose-500/10 to-pink-500/5 border-rose-500/20 hover:border-rose-500/40",
  };
  const iconColorMap: Record<string, string> = {
    violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    rose: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  };
  const accent = accentColor || "violet";

  return (
    <Link
      href={item.path}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 px-4 py-3 mb-4 rounded-xl border bg-gradient-to-r transition-all duration-200 group",
        colorMap[accent] || colorMap.violet
      )}
    >
      {item.icon && (
        <div className={cn("p-2 rounded-lg shrink-0 transition-transform group-hover:scale-105", iconColorMap[accent] || iconColorMap.violet)}>
          {item.icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{item.label}</span>
          {item.badge && <ItemBadge badge={item.badge} />}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground/70 group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function MegaMenuDropdown({ trigger, triggerIcon, sections, featured, accentColor }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allItems = sections.flatMap((s) => s.items);

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        if (!isOpen) { e.preventDefault(); setIsOpen(true); setFocusedIndex(0); }
      } else if (e.key === "Escape") {
        e.preventDefault(); close(); triggerRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) { setIsOpen(true); setFocusedIndex(0); }
        else setFocusedIndex((p) => (p + 1) % allItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (isOpen) setFocusedIndex((p) => (p - 1 + allItems.length) % allItems.length);
      } else if (e.key === "Tab" && isOpen) {
        close();
      }
    },
    [isOpen, allItems.length, close]
  );

  useEffect(() => {
    if (isOpen && focusedIndex >= 0) itemsRef.current[focusedIndex]?.focus();
  }, [focusedIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(close, 180);
  };

  // Grid layout: 1-2 sections → 2 cols, 3 → 3 cols, 4+ → 4 cols
  const cols = sections.length <= 2 ? "grid-cols-2" : sections.length === 3 ? "grid-cols-3" : "grid-cols-4";
  const minW = sections.length <= 2 ? "min-w-[480px]" : sections.length === 3 ? "min-w-[680px]" : "min-w-[880px]";

  let itemIndex = 0;

  // Accent color for trigger underline
  const underlineMap: Record<string, string> = {
    violet: "after:bg-violet-500",
    amber: "after:bg-amber-500",
    emerald: "after:bg-emerald-500",
    sky: "after:bg-sky-500",
    rose: "after:bg-rose-500",
  };
  const underlineClass = underlineMap[accentColor || "violet"] || underlineMap.violet;

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          "relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-md transition-all duration-200",
          "text-foreground/65 hover:text-foreground",
          "after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:transition-all after:duration-200",
          isOpen
            ? cn("text-foreground bg-muted/40", underlineClass, "after:opacity-100 after:scale-x-100")
            : "after:opacity-0 after:scale-x-0",
          `hover:${underlineClass} hover:after:opacity-60 hover:after:scale-x-100`
        )}
      >
        {triggerIcon && <span className="opacity-60">{triggerIcon}</span>}
        {trigger}
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 opacity-40 transition-transform duration-200",
            isOpen ? "rotate-90" : "rotate-0"
          )}
        />
      </button>

      {/* Dropdown panel */}
      <div
        ref={menuRef}
        className={cn(
          "absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50",
          "transition-all duration-200 ease-out origin-top",
          isOpen
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
        )}
        role="menu"
        aria-label={trigger}
      >
        {/* Arrow */}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-background border-l border-t border-border/40 z-10" />

        <div
          className={cn(
            "relative bg-background/97 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-xl shadow-black/10 p-5",
            minW
          )}
        >
          {/* Featured card */}
          {featured && <FeaturedCard item={featured} onClose={close} accentColor={accentColor} />}

          {/* Sections grid */}
          <div className={cn("grid gap-x-6 gap-y-1", cols)}>
            {sections.map((section, si) => (
              <div key={si} role="group" aria-labelledby={`mm-section-${si}`}>
                {/* Section header */}
                <div className="flex items-center gap-2 mb-2 px-3">
                  <span
                    id={`mm-section-${si}`}
                    className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.12em]"
                  >
                    {section.title}
                  </span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>

                {/* Items */}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const idx = itemIndex++;
                    return (
                      <NavItem
                        key={item.path}
                        item={item}
                        ref={(el) => { itemsRef.current[idx] = el; }}
                        onClose={close}
                        tabIndex={isOpen ? 0 : -1}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") { e.preventDefault(); close(); triggerRef.current?.focus(); }
                          else if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIndex((idx + 1) % allItems.length); }
                          else if (e.key === "ArrowUp") { e.preventDefault(); setFocusedIndex((idx - 1 + allItems.length) % allItems.length); }
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function MegaMenu() {

  // ══════════════════════════════════════════════════
  // DONNÉES — Catalogues & Exploration
  // ══════════════════════════════════════════════════
  const donneesSections: MegaMenuSection[] = [
    {
      title: "Catalogues principaux",
      items: [
        {
          label: "Molécules",
          path: "/molecules",
          icon: <Atom className="h-4 w-4" />,
          description: "1 719 molécules olfactives",
          badge: "HUB",
        },
        {
          label: "Recettes",
          path: "/recettes",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "Formules & accords",
          badge: "HUB",
        },
        {
          label: "Matières Premières",
          path: "/matieres-premieres",
          icon: <Beaker className="h-4 w-4" />,
          description: "372 entrées — HE, absolues, résines…",
          badge: "NEW",
        },
        {
          label: "Plantes & Variétés",
          path: "/plants",
          icon: <Leaf className="h-4 w-4" />,
          description: "431 espèces botaniques",
        },
        {
          label: "Terroirs",
          path: "/terroirs",
          icon: <Map className="h-4 w-4" />,
          description: "Origines géographiques",
        },
        {
          label: "Gammes",
          path: "/gammes-hub",
          icon: <Palette className="h-4 w-4" />,
          description: "Collections thématiques",
          badge: "HUB",
        },
      ],
    },
    {
      title: "Botanique & Patrimoine",
      items: [
        {
          label: "Classification Phylogénétique",
          path: "/phylogenetique",
          icon: <Dna className="h-4 w-4" />,
          description: "Familles botaniques",
          badge: "NEW",
        },
        {
          label: "Arbre Généalogique",
          path: "/genealogy",
          icon: <GitBranch className="h-4 w-4" />,
          description: "Lignées & croisements",
          badge: "NEW",
        },
        {
          label: "Herbier des Disparus",
          path: "/ghost-varieties-explorer",
          icon: <Skull className="h-4 w-4" />,
          description: "Variétés éteintes & menacées",
          badge: "NEW",
        },
        {
          label: "Osmothèque",
          path: "/osmotheque",
          icon: <Archive className="h-4 w-4" />,
          description: "Patrimoine olfactif historique",
          badge: "NEW",
        },
        {
          label: "Structures SMILES",
          path: "/smiles",
          icon: <ScanLine className="h-4 w-4" />,
          description: "Visualisation moléculaire 2D",
          badge: "NEW",
        },
      ],
    },
    {
      title: "Tabac & Cannabis",
      items: [
        {
          label: "Tabacs Niche",
          path: "/tabacs-niche",
          icon: <Cigarette className="h-4 w-4" />,
          description: "Variétés rares & précieuses",
        },
        {
          label: "Tabacs Naturels",
          path: "/tabacs-naturels",
          icon: <Leaf className="h-4 w-4" />,
          description: "Variétés naturelles & terroir",
          badge: "NEW",
        },
        {
          label: "Cigarettes Historiques",
          path: "/historic-cigarettes",
          icon: <Archive className="h-4 w-4" />,
          description: "Archives olfactives tabac",
        },
        {
          label: "Recettes Cigarillos",
          path: "/recettes-cigarillos",
          icon: <FlaskConical className="h-4 w-4" />,
          description: "32 formulations cigarillos",
        },
        {
          label: "Chémotypes",
          path: "/chemotypes",
          icon: <Dna className="h-4 w-4" />,
          description: "Variations chimiques par origine",
          badge: "NEW",
        },
      ],
    },
    {
      title: "Exploration & Recherche",
      items: [
        {
          label: "Recherche avancée",
          path: "/recherche-avancee",
          icon: <Search className="h-4 w-4" />,
          description: "Filtres multi-critères",
        },
        {
          label: "Recherche par Molécule",
          path: "/recherche-molecule",
          icon: <Atom className="h-4 w-4" />,
          description: "Plantes → molécule",
          badge: "NEW",
        },
        {
          label: "Carte GPS Plantes",
          path: "/carte-plantes-gps",
          icon: <Compass className="h-4 w-4" />,
          description: "Localisation géographique",
        },
        {
          label: "Alternatives durables",
          path: "/alternatives-durables",
          icon: <ShieldCheck className="h-4 w-4" />,
          description: "Substituts écologiques",
          badge: "NEW",
        },
        {
          label: "Leaf Economies",
          path: "/leaf-economies",
          icon: <TreePine className="h-4 w-4" />,
          description: "Programme San Andrés",
          badge: "NEW",
        },
      ],
    },
  ];

  const donneesFeatured: MenuItem = {
    label: "Hub Visualisations",
    path: "/visualisations",
    icon: <Network className="h-5 w-5" />,
    description: "Graphes, heatmaps, Sankey, réseaux de liaisons — toutes les visualisations",
    badge: "HUB",
  };

  // ══════════════════════════════════════════════════
  // OUTILS — Création & Analyse
  // ══════════════════════════════════════════════════
  const outilsSections: MegaMenuSection[] = [
    {
      title: "Création",
      items: [
        {
          label: "Éditeur de Formulation",
          path: "/outils/editeur-formulation",
          icon: <PenLine className="h-4 w-4" />,
          description: "Formules interactives",
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
          icon: <Zap className="h-4 w-4" />,
          description: "Effet entourage",
          badge: "NEW",
        },
        {
          label: "Profils Terpéniques",
          path: "/terp-profiles",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Références analytiques",
        },
        {
          label: "Comparaison Profils",
          path: "/terp-profiles/compare",
          icon: <Layers className="h-4 w-4" />,
          description: "Radar comparatif",
        },
        {
          label: "Statistiques Olfactives",
          path: "/stats-olfactives",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Répartition percepts & IFRA",
          badge: "NEW",
        },
        {
          label: "Conformité IFRA",
          path: "/ifra",
          icon: <ShieldCheck className="h-4 w-4" />,
          description: "Vérification réglementaire",
        },
        {
          label: "Recherche par Percept",
          path: "/percepts",
          icon: <Waves className="h-4 w-4" />,
          description: "Explorer par descripteur",
        },
        {
          label: "Enrichissement PubChem",
          path: "/enrichissement",
          icon: <Database className="h-4 w-4" />,
          description: "Données moléculaires",
          badge: "NEW",
        },
      ],
    },
    {
      title: "Sourcing",
      items: [
        {
          label: "Hub Sourcing",
          path: "/sourcing-hub",
          icon: <Building2 className="h-4 w-4" />,
          description: "Tous les fournisseurs",
          badge: "NEW",
        },
        {
          label: "Sourcing Tabac",
          path: "/sourcing/tabac",
          icon: <Truck className="h-4 w-4" />,
          description: "Fournisseurs spécialisés",
        },
        {
          label: "Sourcing Cannabis",
          path: "/sourcing/cannabis",
          icon: <Package className="h-4 w-4" />,
          description: "Fournisseurs cannabis",
        },
      ],
    },
  ];

  const outilsFeatured: MenuItem = {
    label: "Hub Outils",
    path: "/outils-hub",
    icon: <LayoutGrid className="h-5 w-5" />,
    description: "Tous les outils de formulation, analyse et calcul",
    badge: "HUB",
  };

  // ══════════════════════════════════════════════════
  // VISUALISATIONS — Graphes & Cartes
  // ══════════════════════════════════════════════════
  const visualisationsSections: MegaMenuSection[] = [
    {
      title: "Réseaux & Graphes",
      items: [
        {
          label: "Réseau de Liaisons",
          path: "/reseau-liaisons",
          icon: <Network className="h-4 w-4" />,
          description: "Recettes ↔ Matières ↔ Molécules",
          badge: "NEW",
        },
        {
          label: "Graphe Réseau",
          path: "/recipe-network",
          icon: <GitBranch className="h-4 w-4" />,
          description: "Connexions moléculaires",
        },
        {
          label: "Corrélations",
          path: "/correlations",
          icon: <Layers className="h-4 w-4" />,
          description: "Parfum × Tabac × Cannabis",
          badge: "NEW",
        },
        {
          label: "Diagramme Sankey",
          path: "/sankey-flow",
          icon: <Waves className="h-4 w-4" />,
          description: "Flux catégories → recettes",
        },
      ],
    },
    {
      title: "Analyses Visuelles",
      items: [
        {
          label: "Synergies Heatmap",
          path: "/synergies-heatmap",
          icon: <Flame className="h-4 w-4" />,
          description: "Matrice de compatibilité",
        },
        {
          label: "Parfums emblématiques",
          path: "/parfums",
          icon: <Sparkles className="h-4 w-4" />,
          description: "Parfum → molécules",
        },
        {
          label: "Muscs — Guide comparatif",
          path: "/muscs",
          icon: <Microscope className="h-4 w-4" />,
          description: "CITES, IFRA, biodégradabilité",
          badge: "NEW",
        },
        {
          label: "Timeline botanique",
          path: "/timeline-botanique",
          icon: <Clock className="h-4 w-4" />,
          description: "Chronologie T0–T4",
        },
      ],
    },
  ];

  const visualisationsFeatured: MenuItem = {
    label: "Hub Visualisations",
    path: "/visualisations",
    icon: <Network className="h-5 w-5" />,
    description: "Toutes les visualisations interactives du projet",
    badge: "HUB",
  };

  // ══════════════════════════════════════════════════
  // RECHERCHE — Méthode, Archives, Bibliographie
  // ══════════════════════════════════════════════════
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
          path: "/methodologie/echelle-absorbe",
          icon: <Layers className="h-4 w-4" />,
          description: "Système de notation",
        },
        {
          label: "GC-MS & Pyrolyse",
          path: "/methodologie/gc-ms",
          icon: <Microscope className="h-4 w-4" />,
          description: "Analyses chromatographiques",
        },
        {
          label: "Méthodes Analytiques",
          path: "/methodes-analytiques",
          icon: <ScanLine className="h-4 w-4" />,
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
          description: "11 programmes actifs",
          badge: "11 axes",
        },
        {
          label: "Bibliographie",
          path: "/bibliographie",
          icon: <Library className="h-4 w-4" />,
          description: "1 179 références scientifiques",
        },
        {
          label: "Export bibliographique",
          path: "/outils/export-bibliographique",
          icon: <Download className="h-4 w-4" />,
          description: "BibTeX, RIS, EndNote",
        },
      ],
    },
    {
      title: "Archives & Traditions",
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
          description: "Manuscrits & formules historiques",
        },
        {
          label: "Traditions Olfactives",
          path: "/civilisations",
          icon: <Globe className="h-4 w-4" />,
          description: "Héritages olfactifs mondiaux",
        },
        {
          label: "Timeline",
          path: "/timeline",
          icon: <Clock className="h-4 w-4" />,
          description: "Chronologie de la recherche",
        },
      ],
    },
  ];

  // ══════════════════════════════════════════════════
  // PROJET — Documentation & Administration
  // ══════════════════════════════════════════════════
  const projetSections: MegaMenuSection[] = [
    {
      title: "Documentation",
      items: [
        {
          label: "Glossaire",
          path: "/glossaire",
          icon: <ScrollText className="h-4 w-4" />,
          description: "Terminologie olfactive",
        },
        {
          label: "Manifeste",
          path: "/manifeste",
          icon: <FileText className="h-4 w-4" />,
          description: "Vision 2025–2035",
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
          description: "Histoire & équipe",
        },
        {
          label: "Contribuer",
          path: "/contribuer",
          icon: <Target className="h-4 w-4" />,
          description: "Rejoindre le projet",
        },
        {
          label: "Tableau de complétude",
          path: "/admin/completude",
          icon: <BarChart3 className="h-4 w-4" />,
          description: "Scores d'enrichissement",
          badge: "NEW",
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
    <nav
      className="hidden lg:flex items-center gap-0.5"
      role="navigation"
      aria-label="Menu principal"
    >
      <MegaMenuDropdown
        trigger="Données"
        triggerIcon={<Database className="h-3.5 w-3.5" />}
        sections={donneesSections}
        featured={donneesFeatured}
        accentColor="violet"
      />
      <MegaMenuDropdown
        trigger="Outils"
        triggerIcon={<FlaskConical className="h-3.5 w-3.5" />}
        sections={outilsSections}
        featured={outilsFeatured}
        accentColor="amber"
      />
      <MegaMenuDropdown
        trigger="Visualisations"
        triggerIcon={<Network className="h-3.5 w-3.5" />}
        sections={visualisationsSections}
        featured={visualisationsFeatured}
        accentColor="sky"
      />
      <MegaMenuDropdown
        trigger="Recherche"
        triggerIcon={<Microscope className="h-3.5 w-3.5" />}
        sections={rechercheSections}
        accentColor="emerald"
      />
      <MegaMenuDropdown
        trigger="Projet"
        triggerIcon={<Target className="h-3.5 w-3.5" />}
        sections={projetSections}
        accentColor="rose"
      />
    </nav>
  );
}
