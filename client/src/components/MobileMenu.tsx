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

// Structure du menu mobile
const mobileMenuSections: MenuSection[] = [
  {
    title: "Accueil",
    href: "/",
    icon: Home,
  },
  {
    title: "Système PERFUMUM",
    href: "/systeme",
    icon: Layers,
  },
  {
    title: "Nouveautés",
    href: "/nouveautes",
    icon: Sparkles,
  },
  {
    title: "Gammes",
    icon: Sparkles,
    items: [
      { href: "/gammes", label: "Vue d'ensemble", badge: "7 gammes" },
      { href: "/gammes/petrichor", label: "Pétrichor", badge: "60" },
      { href: "/gammes/volcanique", label: "Volcanique", badge: "36" },
      { href: "/gammes/glaciaire", label: "Glaciaire", badge: "7" },
      { href: "/gammes/biolab", label: "Bio-Lab", badge: "7" },
      { href: "/gammes/mossi", label: "Royal Mossi", badge: "12" },
      { href: "/gammes/signatures", label: "Signatures", badge: "NEW" },
    ],
  },
  {
    title: "Molécules",
    icon: Atom,
    items: [
      { href: "/molecules", label: "Toutes les molécules", badge: "556" },
      { href: "/chemical-families", label: "Familles chimiques" },
      { href: "/compare-molecules-advanced", label: "Comparaison avancée" },
      { href: "/matrice-synergies", label: "Matrice synergies" },
      { href: "/plants", label: "Plantes & Variétés", badge: "144" },
      { href: "/terroirs", label: "Terroirs", badge: "29" },
      { href: "/graphe-terroir-plante-molecule", label: "Graphe Terroir-Plante-Molécule", badge: "NEW" },
    ],
  },
  {
    title: "Recettes",
    icon: Beaker,
    items: [
      { href: "/recettes", label: "Toutes les recettes", badge: "266" },
      { href: "/recettes-tl", label: "Recettes Tagetes lucida", badge: "5 TL" },
      { href: "/compare-recettes", label: "Comparer les recettes" },
      { href: "/accords", label: "Accords olfactifs", badge: "30" },
      { href: "/prototypes", label: "Prototypes CBD", badge: "4" },
    ],
  },
  {
    title: "Laboratoire",
    icon: FlaskConical,
    items: [
      { href: "/laboratoire", label: "Vue d'ensemble" },
      { href: "/inventaire", label: "Inventaire" },
      { href: "/matrice-interactive", label: "Matrice interactive" },
      { href: "/statistiques", label: "Statistiques" },
    ],
  },
  {
    title: "Outils",
    icon: TestTube,
    items: [
      { href: "/outils/editeur-formulation", label: "Éditeur de Formulation" },
      { href: "/outils/generateur-formules", label: "Générateur IA" },
      { href: "/calculateur", label: "Calculateur" },
      { href: "/synergies", label: "Synergies Moléculaires" },
    ],
  },
  {
    title: "Visualisations",
    icon: BarChart3,
    items: [
      { href: "/sankey-flow", label: "Diagramme Sankey" },
      { href: "/enhanced-radar", label: "Radar Enrichi" },
      { href: "/synergies-heatmap", label: "Heatmap Synergies" },
      { href: "/recipe-network", label: "Graphe Réseau" },
      { href: "/graphe-plante-molecule", label: "Graphe Plante-Molécule" },
    ],
  },
  {
    title: "Recherche",
    icon: TestTube,
    items: [
      { href: "/recherche-scientifique", label: "Modules scientifiques" },
      { href: "/methodologie/absorbe", label: "Méthode ABSORBE" },
      { href: "/recherche/fondements-theoriques", label: "Fondements Philosophiques" },
      { href: "/ifra", label: "Restrictions IFRA" },
    ],
  },
  {
    title: "San Andrés / Leaf Economies",
    icon: Leaf,
    items: [
      { href: "/leaf-economies", label: "Échantillons botaniques", badge: "NEW" },
      { href: "/timeline-botanique", label: "Timeline botanique" },
      { href: "/final-recipes", label: "Recettes finales", badge: "9" },
      { href: "/varietes-fantomes", label: "Variétés fantômes" },
    ],
  },
  {
    title: "Documentation",
    icon: BookOpen,
    items: [
      { href: "/glossaire", label: "Glossaire" },
      { href: "/bibliographie", label: "Bibliographie", badge: "NEW" },
      { href: "/axes-recherche", label: "Axes de recherche" },
    ],
  },
  {
    title: "Archives",
    icon: Database,
    items: [
      { href: "/archives-terrain", label: "Archives de Terrain" },
      { href: "/archives-olfactives", label: "Archives Olfactives" },
    ],
  },
  {
    title: "Projet",
    icon: Info,
    items: [
      { href: "/mon-dashboard", label: "Mon Dashboard" },
      { href: "/le-projet", label: "Le Projet PERFUMUM" },
      { href: "/manifeste", label: "Manifeste" },
      { href: "/a-propos", label: "À propos" },
      { href: "/contribuer", label: "Comment Contribuer" },
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
            <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">PERFUMUM</span>
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

            {/* Footer */}
            <div className="p-4 border-t bg-muted/30">
              <p className="text-xs text-center text-muted-foreground">
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
