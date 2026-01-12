import { Link, useLocation } from "wouter";
import { Search, Menu, Sun, Moon, Command } from "lucide-react";
import { MegaMenu } from "@/components/MegaMenu";
import { MegaMenuOptimized, useMegaMenuSections, useMegaMenuPerformance } from "@/components/MegaMenuOptimized";
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
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col transition-opacity hover:opacity-80">
          <span className="text-2xl font-bold tracking-tight">PERFUMUM</span>
          <span className="hidden md:block text-[10px] text-muted-foreground/70 tracking-wide font-light -mt-1">Recherche olfactive expérimentale</span>
        </Link>

        {/* Desktop Navigation - Mega Menu */}
        <MegaMenu /> {/* TODO: Replace with MegaMenuOptimized */}

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

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
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
    <div className="container py-2 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <DynamicBreadcrumb />
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
