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
  Menu, Sun, Moon,
  Database, Leaf, Compass, BarChart3, Zap, FlaskConical,
  Microscope, BookOpen, Archive, Globe, Info, FileText,
  Brain, Flame, Layers, TestTube, Sparkles, BarChart2, Atom,
  MapPin, TreePine,
} from "lucide-react";
import { MegaMenuOptimized, useMegaMenuSections } from "@/components/MegaMenuOptimized";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { NAV_GROUPS, NavSection } from "@/config/navigationConfig";

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

// ── MegaMenuOptimizedNav ──────────────────────────────────────────────────────
function MegaMenuOptimizedNav() {
  const atelierSections     = useNavGroup("Atelier");
  const atlasSections       = useNavGroup("Atlas");
  const bibliothequeSection = useNavGroup("Bibliothèque");
  const projetSections      = useNavGroup("Projet");

  return (
    <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Menu principal">
      <MegaMenuOptimized sections={atelierSections}      trigger="Atelier" />
      <MegaMenuOptimized sections={atlasSections}        trigger="Atlas" />
      <MegaMenuOptimized sections={bibliothequeSection}  trigger="Bibliothèque" />
      <MegaMenuOptimized sections={projetSections}       trigger="Projet" />
    </nav>
  );
}

// ── Header principal ──────────────────────────────────────────────────────────
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { segments: breadcrumbSegments } = useBreadcrumb();

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 transition-all duration-300 shadow-sm">
      <div className="container flex h-14 lg:h-[72px] items-center justify-between px-4 lg:px-6">
        {/* Logo — Swiss Modern sans-serif bold */}
        <Link href="/" className="flex flex-col group">
          <motion.span
            className="text-lg lg:text-xl font-black tracking-tight uppercase"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, letterSpacing: "-0.02em" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            PERFUMUM
          </motion.span>
          <span className="hidden md:block text-[10px] text-muted-foreground/70 tracking-[0.15em] uppercase font-medium -mt-1 transition-opacity group-hover:opacity-100 opacity-60">
            Recherche olfactive
          </span>
        </Link>

        {/* Desktop Navigation */}
        <MegaMenuOptimizedNav />

        {/* Theme Toggle — desktop */}
        <div className="hidden lg:flex items-center gap-4">
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

        {/* Mobile: Theme + Menu */}
        <div className="lg:hidden flex items-center gap-2">
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


    </>
  );
}
