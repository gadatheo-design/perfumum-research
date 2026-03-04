// @ts-nocheck
/**
 * MobileMenu - Menu hamburger optimisé pour navigation tactile
 * 
 * Fonctionnalités:
 * - Animations fluides avec framer-motion
 * - Gestes tactiles (swipe pour fermer)
 * - Organisation en accordéons avec icônes
 * - Support du thème clair/sombre
 * - Recherche intégrée
 */

import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Search,
  ChevronRight,
  ChevronDown,
  Home,
  Beaker,
  FlaskConical,
  Atom,
  Sparkles,
  BookOpen,
  TestTube,
  BarChart3,
  Database,
  Info,
  Leaf,
  FileText,
  Layers,
  Command,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Types
interface MenuItem {
  href: string;
  label: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: MenuItem[];
}

// Structure du menu mobile - Synchronisée avec le menu desktop
const mobileMenuSections: MenuSection[] = [
  {
    title: "Accueil",
    href: "/",
    icon: Home,
  },
  // === DONNÉES ===
  {
    title: "Catalogues",
    icon: Database,
    items: [
      { href: "/molecules", label: "Molécules", badge: "HUB" },
      { href: "/recettes", label: "Recettes", badge: "HUB" },
      { href: "/plants", label: "Plantes & Variétés" },
      { href: "/terroirs", label: "Terroirs" },
      { href: "/osmotheque", label: "Osmothèque", badge: "NEW" },
    ],
  },
  {
    title: "Leaf Economies",
    icon: Leaf,
    items: [
      { href: "/leaf-economies", label: "Échantillons botaniques", badge: "NEW" },
      { href: "/timeline-botanique", label: "Timeline botanique" },
      { href: "/final-recipes", label: "Recettes finales" },
      { href: "/recettes-tl", label: "Recettes TL", badge: "NEW" },
    ],
  },
  {
    title: "Exploration",
    icon: Sparkles,
    items: [
      { href: "/gammes-hub", label: "Gammes", badge: "HUB" },
      { href: "/chemotypes", label: "Chémotypes", badge: "NEW" },
      { href: "/carte-plantes-gps", label: "Carte GPS Plantes" },
      { href: "/recherche-avancee", label: "Recherche avancée" },
      { href: "/recherche-molecule", label: "Recherche par Molécule", badge: "NEW" },
      { href: "/alternatives-durables", label: "Alternatives durables", badge: "NEW" },
    ],
  },
  {
    title: "Visualisations",
    icon: BarChart3,
    items: [
      { href: "/visualisations", label: "Hub Visualisations", badge: "HUB" },
      { href: "/synergies-heatmap", label: "Synergies Heatmap" },
      { href: "/recipe-network", label: "Graphe Réseau" },
      { href: "/sankey-flow", label: "Diagramme Sankey" },
    ],
  },
  // === OUTILS ===
  {
    title: "Outils - Accès rapide",
    href: "/outils-hub",
    icon: Layers,
  },
  {
    title: "Création",
    icon: FlaskConical,
    items: [
      { href: "/outils/editeur-formulation", label: "Éditeur de Formulation", badge: "NEW" },
      { href: "/outils/generateur-formules", label: "Générateur IA" },
      { href: "/calculateur", label: "Calculateur" },
    ],
  },
  {
    title: "Analyse",
    icon: TestTube,
    items: [
      { href: "/synergies", label: "Synergies Moléculaires", badge: "NEW" },
      { href: "/terp-profiles", label: "Profils Terpéniques" },
      { href: "/ifra", label: "Conformité IFRA" },
      { href: "/stats-olfactives", label: "Statistiques Olfactives", badge: "NEW" },
      { href: "/percepts", label: "Recherche par Percept" },
      { href: "/terp-profiles/compare", label: "Comparaison Profils" },
    ],
  },
  // === RECHERCHE ===
  {
    title: "Méthode ABSORBE",
    icon: BookOpen,
    items: [
      { href: "/methodologie/absorbe", label: "Présentation" },
      { href: "/methodologie/echelle", label: "Échelle de classification" },
      { href: "/methodologie/gcms", label: "GC-MS & Pyrolyse" },
      { href: "/methodes-analytiques", label: "Méthodes Analytiques", badge: "NEW" },
    ],
  },
  {
    title: "Axes de Recherche",
    icon: Atom,
    items: [
      { href: "/axes-recherche", label: "Vue d'ensemble" },
      { href: "/bibliographie", label: "Bibliographie" },
      { href: "/export-bibliographique", label: "Export bibliographique" },
    ],
  },
  {
    title: "Archives & Terrain",
    icon: Database,
    items: [
      { href: "/archives-terrain", label: "Archives de Terrain" },
      { href: "/archives-olfactives", label: "Archives Olfactives" },
      { href: "/civilisations", label: "Civilisations" },
      { href: "/timeline", label: "Timeline" },
    ],
  },
  // === TABACOTHÈQUE ===
  {
    title: "Tabacothèque",
    icon: Leaf,
    items: [
      { href: "/tabacotheque", label: "Vue d'ensemble", badge: "HUB" },
      { href: "/historic-cigarettes", label: "Cigarettes Historiques", badge: "NEW" },
      { href: "/perique-compounds", label: "Composés du Perique" },
      { href: "/tps-genes", label: "Gènes TPS", badge: "NEW" },
      { href: "/genomics-explorer", label: "Explorateur Génomique" },
      { href: "/molecular-transformations", label: "Transformations Moléculaires", badge: "NEW" },
    ],
  },
  {
    title: "Analyse GC-MS",
    icon: TestTube,
    items: [
      { href: "/gcms-chromatograms", label: "Chromatogrammes", badge: "NEW" },
      { href: "/ms-spectra", label: "Spectres de Masse", badge: "NEW" },
      { href: "/compare-spectra", label: "Comparaison Spectres", badge: "NEW" },
      { href: "/identify-spectrum", label: "Identification", badge: "NEW" },
      { href: "/search-compound", label: "Recherche Composé" },
    ],
  },
  // === PROJET ===
  {
    title: "Documentation",
    icon: FileText,
    items: [
      { href: "/glossaire", label: "Glossaire" },
    ],
  },
  {
    title: "Le Projet",
    icon: Info,
    items: [
      { href: "/a-propos", label: "À propos" },
      { href: "/manifeste", label: "Manifeste" },
      { href: "/contribuer", label: "Contribuer" },
      { href: "/admin", label: "Administration", badge: "ADMIN" },
    ],
  },
];

// Composant AccordionSection pour les sections avec sous-menus
function AccordionSection({
  section,
  isExpanded,
  onToggle,
  onNavigate,
  currentPath,
}: {
  section: MenuSection;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  currentPath: string;
}) {
  const Icon = section.icon;
  const hasActiveChild = section.items?.some(item => currentPath === item.href);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between py-4 px-4 transition-colors",
          "hover:bg-muted/50 active:bg-muted",
          hasActiveChild && "bg-primary/5"
        )}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            hasActiveChild ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <span className={cn(
            "font-medium text-base",
            hasActiveChild && "text-primary"
          )}>
            {section.title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && section.items && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-2 px-4 pl-[72px] space-y-1">
              {section.items.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3 rounded-lg transition-all",
                    "text-sm",
                    currentPath === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted"
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badge === "NEW" || item.badge === "ADMIN" ? "default" : "secondary"}
                      className={cn(
                        "text-xs ml-2",
                        item.badge === "NEW" && "bg-amber-500 text-white",
                        item.badge === "ADMIN" && "bg-red-500 text-white"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Composant SimpleLink pour les liens directs
function SimpleLink({
  section,
  onNavigate,
  currentPath,
}: {
  section: MenuSection;
  onNavigate: () => void;
  currentPath: string;
}) {
  const Icon = section.icon;
  const isActive = currentPath === section.href;

  return (
    <Link
      href={section.href!}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 py-4 px-4 border-b border-border/50 transition-colors",
        "hover:bg-muted/50 active:bg-muted",
        isActive && "bg-primary/5"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
        isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <span className={cn(
        "font-medium text-base",
        isActive && "text-primary"
      )}>
        {section.title}
      </span>
      <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
    </Link>
  );
}

// Composant principal MobileMenu
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const dragControls = useDragControls();

  // Note: Le menu se ferme automatiquement via onNavigate dans les liens

  // Empêcher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Gestion du swipe pour fermer
  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      // Si le swipe est vers la droite avec assez de vélocité ou de distance
      if (info.velocity.x > 500 || info.offset.x > 150) {
        onClose();
      }
    },
    [onClose]
  );

  // Toggle une section
  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Ouvrir la recherche
  const openSearch = () => {
    onClose();
    setTimeout(() => {
      const event = new CustomEvent("open-global-search");
      window.dispatchEvent(event);
    }, 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="x"
            dragControls={dragControls}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[400px] bg-background z-50 shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold tracking-tight">PERFUMUM</span>
                <Badge variant="outline" className="text-xs">
                  Menu
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-10 w-10 rounded-xl"
                  aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-10 w-10 rounded-xl"
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
              <Button
                variant="outline"
                onClick={openSearch}
                className="w-full justify-start gap-3 h-12 rounded-xl bg-muted/50 border-muted-foreground/20"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Rechercher...</span>
                <kbd className="ml-auto hidden sm:flex items-center gap-1 rounded border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  <Command className="h-3 w-3" />K
                </kbd>
              </Button>
            </div>

            {/* Swipe indicator */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Menu Content */}
            <ScrollArea className="flex-1">
              <nav className="pb-safe">
                {mobileMenuSections.map((section, index) => {
                  if (!section.items) {
                    return (
                      <SimpleLink
                        key={index}
                        section={section}
                        onNavigate={onClose}
                        currentPath={location}
                      />
                    );
                  }

                  return (
                    <AccordionSection
                      key={index}
                      section={section}
                      isExpanded={expandedSections.has(index)}
                      onToggle={() => toggleSection(index)}
                      onNavigate={onClose}
                      currentPath={location}
                    />
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Theme Toggle Section */}
            <div className="p-4 border-t bg-muted/30">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 hover:bg-muted/50 transition-colors"
                aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    theme === 'dark' ? "bg-amber-500/20 text-amber-400" : "bg-indigo-500/20 text-indigo-500"
                  )}>
                    {theme === 'dark' ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">
                      {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Appuyez pour changer
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-6 rounded-full p-1 transition-colors",
                  theme === 'dark' ? "bg-amber-500/30" : "bg-indigo-500/30"
                )}>
                  <motion.div
                    className={cn(
                      "w-4 h-4 rounded-full",
                      theme === 'dark' ? "bg-amber-400" : "bg-indigo-500"
                    )}
                    animate={{ x: theme === 'dark' ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Glissez vers la droite pour fermer
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
