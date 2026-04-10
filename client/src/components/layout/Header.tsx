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
  Menu, Sun, Moon, Search,
  Database, Leaf, Compass, BarChart3, Zap, FlaskConical,
  Microscope, BookOpen, Archive, Globe, Info, FileText,
  Brain, Flame, Layers, TestTube, Sparkles, BarChart2, Atom,
  MapPin, TreePine, Command,
} from "lucide-react";
import { MegaNav, MegaMenuOptimized, useMegaMenuSections } from "@/components/MegaMenuOptimized";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { NAV_GROUPS, NavSection } from "@/config/navigationConfig";
import { cn } from "@/lib/utils";

// ── Résolution des icônes (string → ReactNode) ────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Database, Leaf, Compass, BarChart3, Zap, FlaskConical,
  Microscope, BookOpen, Archive, Globe, Info, FileText,
  Brain, Flame, Layers, TestTube, Sparkles, BarChart2, Atom,
  MapPin, TreePine,
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

// ── Bouton de recherche global ────────────────────────────────────────────────
function SearchButton() {
  const openSearch = useCallback(() => {
    window.dispatchEvent(new CustomEvent("open-global-search"));
  }, []);

  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

  return (
    <button
      onClick={openSearch}
      className={cn(
        "hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg",
        "border border-border/60 bg-muted/40 hover:bg-muted/70",
        "text-muted-foreground hover:text-foreground",
        "transition-all duration-200 text-sm",
        "min-w-[180px] max-w-[240px]",
        "group"
      )}
      aria-label="Rechercher (Ctrl+K)"
    >
      <Search className="h-3.5 w-3.5 shrink-0 group-hover:text-primary transition-colors" />
      <span className="flex-1 text-left text-xs">Rechercher…</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-background border border-border/60 text-muted-foreground">
        {isMac ? <Command className="h-2.5 w-2.5" /> : "Ctrl"} K
      </kbd>
    </button>
  );
}

// ── MegaMenuOptimizedNav ──────────────────────────────────────────────────────
function MegaMenuOptimizedNav() {
  const atelierSections     = useNavGroup("Atelier");
  const atlasSections       = useNavGroup("Atlas");
  const bibliothequeSection = useNavGroup("Bibliothèque");
  const projetSections      = useNavGroup("Projet");

  return (
    <nav className="hidden lg:flex items-center gap-6" role="navigation" aria-label="Menu principal">
      <MegaMenuOptimized sections={atelierSections}      trigger="Atelier" />
      <MegaMenuOptimized sections={atlasSections}        trigger="Atlas" />
      <MegaMenuOptimized sections={bibliothequeSection}  trigger="Bibliothèque" />
      <MegaMenuOptimized sections={projetSections}       trigger="Projet" />
    </nav>
  );
}

// ── Logo PERFUMUM ─────────────────────────────────────────────────────────────
function PerfumumLogo() {
  const [location] = useLocation();
  const isHome = location === "/";
  return (
    <Link href="/" className="flex items-center gap-3 group shrink-0">
      {/* Monogramme P */}
      <motion.div
        className={cn(
          "relative w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center shrink-0",
          "bg-foreground text-background font-black text-sm lg:text-base",
          "shadow-md group-hover:shadow-lg transition-shadow duration-200"
        )}
        whileHover={{ scale: 1.05, rotate: -2 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 400 }}
      >
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, letterSpacing: "-0.04em" }}>P</span>
        {/* Accent dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary border-2 border-background" />
      </motion.div>
      {/* Wordmark */}
      <div className="flex flex-col">
        <motion.span
          className="text-base lg:text-lg font-black tracking-tight uppercase leading-none"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, letterSpacing: "-0.03em" }}
          whileHover={{ x: 1 }}
          transition={{ duration: 0.15 }}
        >
          PERFUMUM
        </motion.span>
        <span className="hidden md:block text-[9px] text-muted-foreground/60 tracking-[0.18em] uppercase font-medium leading-none mt-0.5 transition-opacity group-hover:opacity-100 opacity-50">
          Recherche olfactive
        </span>
      </div>
    </Link>
  );
}

// ── Header principal ──────────────────────────────────────────────────────────
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { segments: breadcrumbSegments } = useBreadcrumb();
  const [scrolled, setScrolled] = useState(false);

  // Détection du scroll pour effet d'ombre dynamique
  useMemo(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openSearch = useCallback(() => {
    window.dispatchEvent(new CustomEvent("open-global-search"));
  }, []);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border/60 bg-background/95 backdrop-blur-xl shadow-md shadow-black/5"
          : "border-border/30 bg-background/80 backdrop-blur-xl"
      )}
    >
      <div className="container flex h-14 lg:h-[68px] items-center justify-between gap-4 px-4 lg:px-6">

        {/* Logo */}
        <PerfumumLogo />

        {/* Desktop Navigation */}
        <MegaNav />

        {/* Right side: Search + Theme */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Bouton recherche — desktop */}
          <SearchButton />

          {/* Bouton recherche — mobile (icône seule) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openSearch}
            className="lg:hidden h-9 w-9"
            aria-label="Rechercher"
          >
            <Search className="h-4.5 w-4.5" />
          </Button>

          {/* Séparateur vertical — desktop */}
          <div className="hidden lg:block w-px h-5 bg-border/60" />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="h-4.5 w-4.5" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="h-4.5 w-4.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {/* Menu burger — mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden h-9 w-9"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>

    {/* Breadcrumb sous le header */}
    <div className="sticky top-14 lg:top-[68px] z-40 border-b border-border/40 bg-background/95 backdrop-blur-md">
      <div className="container py-1.5 px-4 lg:px-6">
        <DynamicBreadcrumb segments={breadcrumbSegments ?? undefined} />
      </div>
    </div>

    {/* Mobile Menu */}
    <MobileMenu
      isOpen={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    />
    </>
  );
}
