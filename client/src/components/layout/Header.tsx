/**
 * Header.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Les données de navigation proviennent exclusivement de :
 *   client/src/config/navigationConfig.ts
 *
 * Pour ajouter / modifier une entrée de menu, éditer UNIQUEMENT navigationConfig.ts.
 * Ce fichier ne contient que la logique d'affichage.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { Link, useLocation } from "wouter";
import {
  Search, Menu, Sun, Moon, Command,
  Database, Leaf, Compass, BarChart3, Zap, FlaskConical,
  Microscope, BookOpen, Archive, Globe, Info, FileText,
  Brain, Flame, Layers, TestTube, Sparkles, BarChart2, Atom,
} from "lucide-react";
import { MegaMenuOptimized, useMegaMenuSections } from "@/components/MegaMenuOptimized";
import { MobileMenu } from "@/components/MobileMenu";
import { SmartSearch } from "@/components/SmartSearch";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { NAV_GROUPS, NavSection } from "@/config/navigationConfig";

// ── Résolution des icônes (string → ReactNode) ────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Database, Leaf, Compass, BarChart3, Zap, FlaskConical,
  Microscope, BookOpen, Archive, Globe, Info, FileText,
  Brain, Flame, Layers, TestTube, Sparkles, BarChart2, Atom,
};

function resolveIcon(name: string) {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon className="h-4 w-4" /> : null;
}

/**
 * Convertit les sections d'un groupe navigationConfig en format attendu
 * par useMegaMenuSections (category + icon ReactNode + items avec id).
 */
function useNavGroup(trigger: string) {
  const group = useMemo(
    () => NAV_GROUPS.find((g) => g.trigger === trigger),
    [trigger]
  );

  const rawSections = useMemo(() => {
    if (!group) return [];
    return group.sections.map((section: NavSection, si: number) => ({
      category: section.title,
      icon: resolveIcon(section.icon),
      items: (section.items ?? []).map((item, ii) => ({
        id: `${trigger}-${si}-${ii}`,
        label: item.label,
        href: item.href,
        badge: item.badge,
      })),
    }));
  }, [group, trigger]);

  return useMegaMenuSections(rawSections);
}

// ── MegaMenuOptimizedNav ──────────────────────────────────────────────────────
function MegaMenuOptimizedNav() {
  const donneesSections     = useNavGroup("Données");
  const narrationSections   = useNavGroup("Narration");
  const outilsSections      = useNavGroup("Outils");
  const rechercheSections   = useNavGroup("Recherche");
  const tabacothequeSections = useNavGroup("Tabacothèque");
  const projetSections      = useNavGroup("Projet");

  return (
    <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Menu principal">
      <MegaMenuOptimized sections={donneesSections}      trigger="Données" />
      <MegaMenuOptimized sections={narrationSections}    trigger="Narration" />
      <MegaMenuOptimized sections={outilsSections}       trigger="Outils" />
      <MegaMenuOptimized sections={rechercheSections}    trigger="Recherche" />
      <MegaMenuOptimized sections={tabacothequeSections} trigger="Tabacothèque" />
      <MegaMenuOptimized sections={projetSections}       trigger="Projet" />
    </nav>
  );
}

// ── Header principal ──────────────────────────────────────────────────────────
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { segments: breadcrumbSegments } = useBreadcrumb();

  // Écouter l'événement global pour ouvrir la recherche
  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true);
    window.addEventListener("open-global-search", handleOpenSearch);
    return () => window.removeEventListener("open-global-search", handleOpenSearch);
  }, []);

  // Raccourci clavier Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 transition-all duration-300 shadow-sm">
      <div className="container flex h-14 lg:h-[72px] items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex flex-col group">
          <motion.span
            className="text-xl lg:text-2xl font-bold tracking-tight"
            whileHover={{ letterSpacing: "0.06em" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            PERFUMUM
          </motion.span>
          <span className="hidden md:block text-[10px] text-muted-foreground/70 tracking-wide font-light -mt-1 transition-opacity group-hover:opacity-100 opacity-70">
            Recherche olfactive expérimentale
          </span>
        </Link>

        {/* Desktop Navigation */}
        <MegaMenuOptimizedNav />

        {/* Search Button & Theme Toggle — desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSearchOpen(true)}
            className="text-muted-foreground hover:text-foreground gap-2 px-3 min-w-[200px] justify-between"
            aria-label="Ouvrir la recherche"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="text-sm">Rechercher...</span>
            </span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <Command className="h-3 w-3" />K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile: Search + Theme + Menu */}
        <div className="lg:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="h-10 w-10"
            aria-label="Ouvrir la recherche"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10"
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
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
            onClick={() => setMobileMenuOpen(true)}
            className="h-10 w-10"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>

    {/* Breadcrumb sous le header */}
    <div className="sticky top-14 lg:top-[72px] z-40 border-b border-border/50 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container py-1.5 sm:py-2 px-4 lg:px-6">
        <DynamicBreadcrumb segments={breadcrumbSegments ?? undefined} />
      </div>
    </div>

    {/* Mobile Menu */}
    <MobileMenu
      isOpen={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    />

    {/* Dialog de recherche SmartSearch */}
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Recherche globale</DialogTitle>
        <SmartSearch
          variant="hero"
          autoFocus={true}
          onResultSelect={() => setSearchOpen(false)}
          placeholder="Rechercher molécules, recettes, plantes, accords..."
        />
      </DialogContent>
    </Dialog>
    </>
  );
}
