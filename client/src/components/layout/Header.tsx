import { Link, useLocation } from "wouter";
import { Search, Menu, Sun, Moon, Command } from "lucide-react";
import { MegaMenuOptimized, useMegaMenuSections } from "@/components/MegaMenuOptimized";
import { MobileMenu } from "@/components/MobileMenu";
import { SmartSearch } from "@/components/SmartSearch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

// Composant MegaMenuOptimizedNav pour remplacer l'ancien MegaMenu
function MegaMenuOptimizedNav() {
  // === DONNÉES (Catalogues + Recherche) ===
  const donneesSections = [
    {
      category: "Catalogues",
      items: [
        { id: "1", label: "Molécules", href: "/molecules", badge: "HUB" },
        { id: "2", label: "Recettes", href: "/recettes", badge: "HUB" },
        { id: "3", label: "Plantes & Variétés", href: "/plants" },
        { id: "4", label: "Terroirs", href: "/terroirs" },
      ],
    },
    {
      category: "Leaf Economies",
      items: [
        { id: "5", label: "Échantillons botaniques", href: "/leaf-economies", badge: "NEW" },
        { id: "6", label: "Timeline botanique", href: "/timeline-botanique" },
        { id: "7", label: "Recettes finales", href: "/final-recipes" },
        { id: "8", label: "Recettes TL", href: "/recettes-tl", badge: "NEW" },
      ],
    },
    {
      category: "Exploration",
      items: [
        { id: "9", label: "Gammes", href: "/gammes-hub", badge: "HUB" },
        { id: "10", label: "Carte GPS Plantes", href: "/carte-plantes-gps" },
        { id: "11", label: "Recherche avancée", href: "/recherche-avancee" },
        { id: "12", label: "Alternatives durables", href: "/alternatives-durables", badge: "NEW" },
      ],
    },
    {
      category: "Visualisations",
      items: [
        { id: "13", label: "Hub Visualisations", href: "/visualisations", badge: "HUB" },
        { id: "14", label: "Synergies Heatmap", href: "/synergies-heatmap" },
        { id: "15", label: "Graphe Réseau", href: "/recipe-network" },
        { id: "16", label: "Diagramme Sankey", href: "/sankey-flow" },
      ],
    },
  ];

  // === OUTILS (Création + Analyse) ===
  const outilsSections = [
    {
      category: "Accès rapide",
      items: [
        { id: "17", label: "Hub Outils", href: "/outils-hub", badge: "HUB" },
      ],
    },
    {
      category: "Création",
      items: [
        { id: "18", label: "Éditeur de Formulation", href: "/outils/editeur-formulation", badge: "NEW" },
        { id: "19", label: "Générateur IA", href: "/outils/generateur-formules" },
        { id: "20", label: "Calculateur", href: "/calculateur" },
      ],
    },
    {
      category: "Analyse",
      items: [
        { id: "21", label: "Synergies Moléculaires", href: "/synergies", badge: "NEW" },
        { id: "22", label: "Profils Terpéniques", href: "/terp-profiles" },
        { id: "23", label: "Conformité IFRA", href: "/ifra" },
        { id: "24", label: "Comparaison Profils", href: "/terp-profiles/compare" },
      ],
    },
  ];

  // === RECHERCHE (Méthodologie + Archives + Axes) ===
  const rechercheSections = [
    {
      category: "Méthode ABSORBE",
      items: [
        { id: "25", label: "Présentation", href: "/methodologie/absorbe" },
        { id: "26", label: "Échelle de classification", href: "/methodologie/echelle" },
        { id: "27", label: "GC-MS & Pyrolyse", href: "/methodologie/gcms" },
      ],
    },
    {
      category: "Axes de Recherche",
      items: [
        { id: "28", label: "Vue d'ensemble", href: "/axes-recherche" },
        { id: "29", label: "Bibliographie", href: "/bibliographie" },
        { id: "30", label: "Export bibliographique", href: "/export-bibliographique" },
      ],
    },
    {
      category: "Archives & Terrain",
      items: [
        { id: "31", label: "Archives de Terrain", href: "/archives-terrain" },
        { id: "32", label: "Archives Olfactives", href: "/archives-olfactives" },
        { id: "33", label: "Civilisations", href: "/civilisations" },
        { id: "34", label: "Timeline", href: "/timeline" },
      ],
    },
  ];

  // === PROJET (À propos + Administration) ===
  const projetSections = [
    {
      category: "Documentation",
      items: [
        { id: "35", label: "Glossaire", href: "/glossaire" },
      ],
    },
    {
      category: "Le Projet",
      items: [
        { id: "36", label: "À propos", href: "/a-propos" },
        { id: "37", label: "Manifeste", href: "/manifeste" },
        { id: "38", label: "Contribuer", href: "/contribuer" },
        { id: "39", label: "Administration", href: "/admin" },
      ],
    },
  ];

  const menuSections = useMegaMenuSections(donneesSections);
  const outilsMenuSections = useMegaMenuSections(outilsSections);
  const rechercheMenuSections = useMegaMenuSections(rechercheSections);
  const projetMenuSections = useMegaMenuSections(projetSections);

  return (
    <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Menu principal">
      <MegaMenuOptimized sections={menuSections} trigger="Données" />
      <MegaMenuOptimized sections={outilsMenuSections} trigger="Outils" />
      <MegaMenuOptimized sections={rechercheMenuSections} trigger="Recherche" />
      <MegaMenuOptimized sections={projetMenuSections} trigger="Projet" />
    </nav>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

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
        <Link href="/" className="flex flex-col transition-opacity hover:opacity-80">
          <span className="text-xl lg:text-2xl font-bold tracking-tight">PERFUMUM</span>
          <span className="hidden md:block text-[10px] text-muted-foreground/70 tracking-wide font-light -mt-1">Recherche olfactive expérimentale</span>
        </Link>

        {/* Desktop Navigation - Mega Menu Optimized */}
        <MegaMenuOptimizedNav />

        {/* Search Button & Theme Toggle */}
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
          {/* Bouton de recherche visible sur mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="h-10 w-10"
            aria-label="Ouvrir la recherche"
          >
            <Search className="h-5 w-5" />
          </Button>
          {/* Toggle thème sur mobile */}
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
          {/* Menu hamburger */}
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
    
    {/* Breadcrumb sous le header - sticky sur mobile pour navigation dans les pages profondes */}
    <div className="sticky top-14 lg:top-[72px] z-40 border-b border-border/50 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container py-1.5 sm:py-2 px-4 lg:px-6">
        <DynamicBreadcrumb />
      </div>
    </div>

    {/* Mobile Menu Component */}
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
