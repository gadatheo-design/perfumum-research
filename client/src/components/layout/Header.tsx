import { Link } from "wouter";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 transition-all duration-300 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <span className="text-2xl font-bold tracking-tight">PERFUMUM</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {/* Le Projet - standalone */}
          <Link href="/le-projet">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Le Projet
            </a>
          </Link>

          {/* Données dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60">
              Données
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="animate-scaleIn" align="start">
              <DropdownMenuItem asChild>
                <Link href="/prototypes">
                  <a className="w-full cursor-pointer">Prototypes</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/familles">
                  <a className="w-full cursor-pointer">Familles Olfactives</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/chemical-families">
                  <a className="w-full cursor-pointer">Familles Chimiques</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/molecules">
                  <a className="w-full cursor-pointer">Molécules</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/bio-mineralis">
                  <a className="w-full cursor-pointer">BIO-MINERALIS</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resines-cbd">
                  <a className="w-full cursor-pointer">Résines CBD</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/accords">
                  <a className="w-full cursor-pointer">Accords</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recettes">
                  <a className="w-full cursor-pointer">Recettes</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/gammes">
                  <a className="w-full cursor-pointer">Gammes</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/experimental-accords">
                  <a className="w-full cursor-pointer">Accords Expérimentaux</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/civilisations">
                  <a className="w-full cursor-pointer">Civilisations</a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Visualisations dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60">
              Visualisations
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="animate-scaleIn" align="start">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <a className="w-full cursor-pointer">Dashboard</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/absorbe-scale">
                  <a className="w-full cursor-pointer">Échelle ABSORBE</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/timeline">
                  <a className="w-full cursor-pointer">Timeline</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/installations">
                  <a className="w-full cursor-pointer">Installations</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/reseau">
                  <a className="w-full cursor-pointer">Réseau de Relations</a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Méthodologie dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60">
              Méthodologie
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="animate-scaleIn" align="start">
              <DropdownMenuItem asChild>
                <Link href="/laboratoire">
                  <a className="w-full cursor-pointer">Laboratoire</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/glossaire">
                  <a className="w-full cursor-pointer">Glossaire</a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Recherche Scientifique - standalone */}
          <Link href="/recherche-scientifique">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Recherche Scientifique
            </a>
          </Link>

          {/* Outils dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60">
              Outils
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="animate-scaleIn" align="start">
              <DropdownMenuItem asChild>
                <Link href="/laboratoire/recettes">
                  <a className="w-full cursor-pointer">Calculateur de Dosages</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/molecules">
                  <a className="w-full cursor-pointer">Molécules</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/laboratoire/recettes">
                  <a className="w-full cursor-pointer">R&D Recettes</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/laboratoire">
                  <a className="w-full cursor-pointer">Laboratoire</a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Recherche - standalone */}
          <Link href="/recherche">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Recherche
            </a>
          </Link>
        </nav>

        {/* Mobile Menu Button + Search */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/recherche">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Desktop Search Icon */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/recherche">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-16 right-0 bottom-0 w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
          {/* Le Projet */}
          <div>
            <Link href="/le-projet">
              <a
                className="block text-lg font-medium py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Le Projet
              </a>
            </Link>
          </div>

          {/* Données Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4">
              Données
            </h3>
            <div className="space-y-1">
              <Link href="/prototypes">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Prototypes
                </a>
              </Link>
              <Link href="/familles">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Familles Olfactives
                </a>
              </Link>
              <Link href="/chemical-families">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Familles Chimiques
                </a>
              </Link>
              <Link href="/molecules">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Molécules
                </a>
              </Link>
              <Link href="/bio-mineralis">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  BIO-MINERALIS
                </a>
              </Link>
              <Link href="/resines-cbd">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Résines CBD
                </a>
              </Link>
              <Link href="/accords">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accords
                </a>
              </Link>
              <Link href="/experimental-accords">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accords Expérimentaux
                </a>
              </Link>
              <Link href="/civilisations">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Civilisations
                </a>
              </Link>
              <Link href="/recettes">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recettes
                </a>
              </Link>
              <Link href="/gammes">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gammes
                </a>
              </Link>
            </div>
          </div>

          {/* Visualisations Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4">
              Visualisations
            </h3>
            <div className="space-y-1">
              <Link href="/dashboard">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </a>
              </Link>
              <Link href="/absorbe-scale">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Échelle ABSORBE
                </a>
              </Link>
              <Link href="/timeline">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Timeline
                </a>
              </Link>
              <Link href="/installations">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Installations
                </a>
              </Link>
              <Link href="/reseau">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Réseau de Relations
                </a>
              </Link>
            </div>
          </div>

          {/* Méthodologie Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4">
              Méthodologie
            </h3>
            <div className="space-y-1">
              <Link href="/laboratoire">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Laboratoire
                </a>
              </Link>
              <Link href="/glossaire">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Glossaire
                </a>
              </Link>
            </div>
          </div>

          {/* Recherche Scientifique Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4">
              Recherche Scientifique
            </h3>
            <div className="space-y-1">
              <Link href="/recherche-scientifique">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Modules de Recherche
                </a>
              </Link>
            </div>
          </div>

          {/* Outils Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4">
              Outils
            </h3>
            <div className="space-y-1">
              <Link href="/laboratoire/recettes">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Calculateur de Dosages
                </a>
              </Link>
              <Link href="/molecules">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Molécules
                </a>
              </Link>
              <Link href="/laboratoire/recettes">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  R&D Recettes
                </a>
              </Link>
              <Link href="/laboratoire">
                <a
                  className="block py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Laboratoire
                </a>
              </Link>
            </div>
          </div>

          {/* Recherche */}
          <div className="pt-4 border-t border-border">
            <Link href="/recherche">
              <a
                className="block text-lg font-medium py-4 px-4 rounded-lg hover:bg-accent transition-colors min-h-[48px] flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Recherche
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
