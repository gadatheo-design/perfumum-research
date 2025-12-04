import { Link, useLocation } from "wouter";
import { 
  Search, 
  ChevronDown, 
  Menu, 
  Home,
  Database,
  BarChart3,
  BookOpen,
  Microscope,
  Wrench,
  Beaker,
  Flame,
  Wind,
  TestTube,
  Zap,
  X,
  Leaf,
  Cigarette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const [location] = useLocation();

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
          {/* Le Projet dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60">
              Le Projet
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="animate-scaleIn" align="start">
              <DropdownMenuItem asChild>
                <Link href="/le-projet">
                  <a className="w-full cursor-pointer">Présentation</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/recherche">
                  <a className="w-full cursor-pointer">Dashboard Recherche</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/projet/timeline">
                  <a className="w-full cursor-pointer">Timeline 2025-2035</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/methode-absorbe">
                  <a className="w-full cursor-pointer">Méthode ABSORBE</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/projets">
                  <a className="w-full cursor-pointer">Projets</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/terrains">
                  <a className="w-full cursor-pointer">Terrains</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/collaborations">
                  <a className="w-full cursor-pointer">Collaborations</a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
              <DropdownMenuItem asChild>
                <Link href="/tabacs-resines">
                  <a className="w-full cursor-pointer">Tabacs & Résines</a>
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

          {/* Recherche Scientifique dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60">
              Recherche Scientifique
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="animate-scaleIn" align="start">
              <DropdownMenuItem asChild>
                <Link href="/recherche-scientifique">
                  <a className="w-full cursor-pointer">Vue d'ensemble</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recherche-scientifique/synergies-moleculaires">
                  <a className="w-full cursor-pointer">Synergies Moléculaires</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recherche-scientifique/pyrolyse-combustion">
                  <a className="w-full cursor-pointer">Pyrolyse & Combustion</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recherche-scientifique/courbes-volatilite">
                  <a className="w-full cursor-pointer">Courbes de Volatilité</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recherche-scientifique/degradation-terpenes">
                  <a className="w-full cursor-pointer">Dégradation des Terpènes</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recherche-scientifique/modeles-analytiques-gcms">
                  <a className="w-full cursor-pointer">Modèles Analytiques GC-MS</a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Programmes de Recherche dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60">
              Programmes de Recherche
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="animate-scaleIn" align="start">
              <DropdownMenuItem asChild>
                <Link href="/programmes-recherche">
                  <a className="w-full cursor-pointer">Vue d'ensemble</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/programmes-recherche/resines-cbd">
                  <a className="w-full cursor-pointer">Résines CBD & Terpenic Design</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/programmes-recherche/tabacs-niche">
                  <a className="w-full cursor-pointer">Tabacs Niche</a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Outils dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground/60">
              Outils
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="animate-scaleIn" align="start">
              <DropdownMenuItem asChild>
                <Link href="/laboratoire/matrice-interactive">
                  <a className="w-full cursor-pointer">Matrice Interactive</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/laboratoire/statistiques">
                  <a className="w-full cursor-pointer">Statistiques Avancées</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/chimie/comparaison">
                  <a className="w-full cursor-pointer">Comparaison Molécules</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/laboratoire/recettes">
                  <a className="w-full cursor-pointer">Calculateur de Dosages</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/recherche">
                  <a className="w-full cursor-pointer">Recherche</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/favoris">
                  <a className="w-full cursor-pointer">Favoris</a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader className="flex flex-row items-center justify-between">
                <SheetTitle className="text-2xl font-bold">PERFUMUM</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Fermer</span>
                  </Button>
                </SheetClose>
              </SheetHeader>

              {/* Mobile Search */}
              <div className="mt-4 px-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="pl-9"
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && mobileSearch.trim()) {
                        setMobileMenuOpen(false);
                        window.location.href = `/recherche?q=${encodeURIComponent(mobileSearch)}`;
                      }
                    }}
                  />
                </div>
              </div>

              <nav className="flex flex-col mt-6 space-y-6">
                {/* Accueil */}
                <Link href="/">
                  <a
                    className={cn(
                      "flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px]",
                      location === "/" && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5 flex-shrink-0" />
                    <span>Accueil</span>
                  </a>
                </Link>

                {/* Le Projet Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Le Projet
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <Link href="/le-projet">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/le-projet" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Présentation
                      </a>
                    </Link>
                    <Link href="/dashboard/recherche">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/dashboard/recherche" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard Recherche
                      </a>
                    </Link>
                    <Link href="/projet/timeline">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/projet/timeline" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Timeline 2025-2035
                      </a>
                    </Link>
                    <Link href="/collaborations">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/collaborations" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Collaborations
                      </a>
                    </Link>
                  </div>
                </div>

                {/* Données Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Données
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <Link href="/prototypes">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/prototypes" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Prototypes
                      </a>
                    </Link>
                    <Link href="/familles">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/familles" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Familles Olfactives
                      </a>
                    </Link>
                    <Link href="/chemical-families">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/chemical-families" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Familles Chimiques
                      </a>
                    </Link>
                    <Link href="/molecules">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/molecules" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Molécules
                      </a>
                    </Link>
                    <Link href="/bio-mineralis">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/bio-mineralis" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        BIO-MINERALIS
                      </a>
                    </Link>
                    <Link href="/resines-cbd">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/resines-cbd" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Résines CBD
                      </a>
                    </Link>
                    <Link href="/accords">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/accords" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Accords
                      </a>
                    </Link>
                    <Link href="/experimental-accords">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/experimental-accords" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Accords Expérimentaux
                      </a>
                    </Link>
                    <Link href="/civilisations">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/civilisations" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Civilisations
                      </a>
                    </Link>
                    <Link href="/recettes">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/recettes" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Recettes
                      </a>
                    </Link>
                    <Link href="/gammes">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/gammes" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Gammes
                      </a>
                    </Link>
                    <Link href="/tabacs-resines">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/tabacs-resines" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tabacs & Résines
                      </a>
                    </Link>
                  </div>
                </div>

                {/* Visualisations Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Visualisations
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <Link href="/dashboard">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/dashboard" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </a>
                    </Link>
                    <Link href="/absorbe-scale">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/absorbe-scale" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Échelle ABSORBE
                      </a>
                    </Link>
                    <Link href="/timeline">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/timeline" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Timeline
                      </a>
                    </Link>
                    <Link href="/installations">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/installations" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Installations
                      </a>
                    </Link>
                    <Link href="/reseau">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/reseau" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Réseau de Relations
                      </a>
                    </Link>
                  </div>
                </div>

                {/* Méthodologie Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4">
                    <Beaker className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Méthodologie
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <Link href="/laboratoire">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/laboratoire" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Laboratoire
                      </a>
                    </Link>
                    <Link href="/glossaire">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/glossaire" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Glossaire
                      </a>
                    </Link>
                  </div>
                </div>

                {/* Recherche Scientifique Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4">
                    <Microscope className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Recherche Scientifique
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <Link href="/recherche-scientifique">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/recherche-scientifique" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Vue d'ensemble
                      </a>
                    </Link>
                    <Link href="/recherche-scientifique/synergies-moleculaires">
                      <a
                        className={cn(
                          "flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px]",
                          location === "/recherche-scientifique/synergies-moleculaires" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Zap className="h-4 w-4 flex-shrink-0 text-violet-500" />
                        <span>Synergies Moléculaires</span>
                      </a>
                    </Link>
                    <Link href="/recherche-scientifique/pyrolyse-combustion">
                      <a
                        className={cn(
                          "flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px]",
                          location === "/recherche-scientifique/pyrolyse-combustion" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Flame className="h-4 w-4 flex-shrink-0 text-red-500" />
                        <span>Pyrolyse & Combustion</span>
                      </a>
                    </Link>
                    <Link href="/recherche-scientifique/courbes-volatilite">
                      <a
                        className={cn(
                          "flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px]",
                          location === "/recherche-scientifique/courbes-volatilite" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Wind className="h-4 w-4 flex-shrink-0 text-cyan-500" />
                        <span>Courbes de Volatilité</span>
                      </a>
                    </Link>
                    <Link href="/recherche-scientifique/degradation-terpenes">
                      <a
                        className={cn(
                          "flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px]",
                          location === "/recherche-scientifique/degradation-terpenes" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Flame className="h-4 w-4 flex-shrink-0 text-orange-500" />
                        <span>Dégradation des Terpènes</span>
                      </a>
                    </Link>
                    <Link href="/recherche-scientifique/modeles-analytiques-gcms">
                      <a
                        className={cn(
                          "flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px]",
                          location === "/recherche-scientifique/modeles-analytiques-gcms" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <TestTube className="h-4 w-4 flex-shrink-0 text-purple-500" />
                        <span>Modèles Analytiques GC-MS</span>
                      </a>
                    </Link>
                  </div>
                </div>

                {/* Programmes de Recherche Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4">
                    <Leaf className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Programmes de Recherche
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <Link href="/programmes-recherche">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/programmes-recherche" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Vue d'ensemble
                      </a>
                    </Link>
                    <Link href="/programmes-recherche/resines-cbd">
                      <a
                        className={cn(
                          "flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px]",
                          location === "/programmes-recherche/resines-cbd" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Leaf className="h-4 w-4 flex-shrink-0 text-green-500" />
                        <span>Résines CBD & Terpenic Design</span>
                      </a>
                    </Link>
                    <Link href="/programmes-recherche/tabacs-niche">
                      <a
                        className={cn(
                          "flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px]",
                          location === "/programmes-recherche/tabacs-niche" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Cigarette className="h-4 w-4 flex-shrink-0 text-amber-500" />
                        <span>Tabacs Niche</span>
                      </a>
                    </Link>
                  </div>
                </div>

                {/* Outils Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Outils
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <Link href="/laboratoire/matrice-interactive">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/laboratoire/matrice-interactive" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Matrice Interactive
                      </a>
                    </Link>
                    <Link href="/laboratoire/statistiques">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/laboratoire/statistiques" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Statistiques Avancées
                      </a>
                    </Link>
                    <Link href="/chimie/comparaison">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/chimie/comparaison" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Comparaison Molécules
                      </a>
                    </Link>
                    <Link href="/laboratoire/recettes">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/laboratoire/recettes" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Calculateur de Dosages
                      </a>
                    </Link>
                    <Link href="/favoris">
                      <a
                        className={cn(
                          "block py-3 px-4 rounded-lg hover:bg-accent transition-colors min-h-[44px] flex items-center",
                          location === "/favoris" && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Favoris
                      </a>
                    </Link>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
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
    </header>
  );
}
