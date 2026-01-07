import { Link, useLocation } from "wouter";
import { Search, Menu, Sun, Moon, ChevronDown, Beaker, FlaskConical, BookOpen, Atom, Mountain, Snowflake, Crown, Sparkles, Home, Info, Mail, FileText, Database, TestTube, Layers, BarChart3, GitBranch, Activity, Leaf, Command } from "lucide-react";
import { MegaMenu } from "@/components/MegaMenu";
import { SmartSearch } from "@/components/SmartSearch";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

// Structure du menu mobile avec sections et sous-menus
const mobileMenuSections = [
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
    title: "Méthode ABSORBE",
    href: "/methodologie/absorbe",
    icon: BookOpen,
  },
  {
    title: "Journal de Recherche",
    href: "/journal",
    icon: FileText,
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
    title: "Recherche Avancée",
    href: "/recherche-avancee",
    icon: Search,
  },
  {
    title: "Molécules",
    icon: Atom,
    items: [
      { href: "/molecules", label: "Toutes les molécules", badge: "199" },
      { href: "/chemical-families", label: "Familles chimiques" },
      { href: "/compare-molecules-advanced", label: "Comparaison avancée" },
      { href: "/matrice-synergies", label: "Matrice synergies" },
      { href: "/plants", label: "Plantes & Variétés", badge: "NEW" },
      { href: "/terroirs", label: "Terroirs", badge: "20" },
      { href: "/extraction-methods", label: "Méthodes d'extraction", badge: "7" },
      { href: "/origines-geographiques", label: "Origines géographiques", badge: "NEW" },
      { href: "/carte-plantes-gps", label: "Carte GPS Plantes", badge: "136" },
    ],
  },
  {
    title: "Recettes",
    icon: Beaker,
    items: [
      { href: "/recettes", label: "Toutes les recettes", badge: "213" },
      { href: "/recettes-tl", label: "Recettes Tagetes lucida", badge: "5 TL" },
      { href: "/compare-recettes", label: "Comparer les recettes", badge: "NEW" },
      { href: "/accords", label: "Accords olfactifs" },
      { href: "/accords-dedies", label: "Accords Dédiés", badge: "NEW" },
      { href: "/prototypes", label: "Prototypes CBD", badge: "4" },
      { href: "/protocoles-maturation", label: "Protocoles maturation" },
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
      { href: "/fournisseurs", label: "Fournisseurs", badge: "12" },
    ],
  },
  {
    title: "Outils IA",
    icon: Sparkles,
    items: [
      { href: "/outils/editeur-formulation", label: "Éditeur de Formulation", badge: "NEW" },
      { href: "/outils/generateur-formules", label: "Générateur de Formules", badge: "NEW" },
      { href: "/synergies", label: "Synergies Moléculaires", badge: "NEW" },
      { href: "/terp-profiles", label: "Profils Terpéniques", badge: "NEW" },
      { href: "/suggestions-synergies", label: "Suggestions Synergies" },
      { href: "/admin/liaison-recettes-molecules", label: "Liaison Recettes-Molécules", badge: "ADMIN" },
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
    ],
  },
  {
    title: "Outils d'Exploration",
    icon: Search,
    items: [
      { href: "/recherche-avancee", label: "Recherche Avancée", badge: "NEW" },
      { href: "/timeline-recettes", label: "Timeline Recettes", badge: "NEW" },
      { href: "/heatmap-correlations", label: "Heatmap Corrélations", badge: "NEW" },
    ],
  },
  {
    title: "Recherche",
    icon: TestTube,
    items: [
      { href: "/recherche-scientifique", label: "Modules scientifiques" },
      { href: "/recherche-radicale", label: "Recherche Radicale", badge: "NEW" },
      { href: "/recherche/fondements-theoriques", label: "Fondements Philosophiques", badge: "NEW" },
      { href: "/chimie-tabac", label: "Chimie du tabac", badge: "NEW" },
      { href: "/synergies-terpenes-niches", label: "Synergies terpènes", badge: "NEW" },
      { href: "/recherche-scientifique/pyrolyse-combustion", label: "Pyrolyse & combustion" },
      { href: "/recherche-scientifique/modeles-analytiques-gcms", label: "Modèles GC-MS" },
    ],
  },
  {
    title: "Documentation",
    icon: BookOpen,
    items: [
      { href: "/glossaire", label: "Glossaire" },
      { href: "/glossaire-visuel-radar", label: "Glossaire Visuel Radar", badge: "NEW" },
      { href: "/methode-absorbe", label: "Méthode ABSORBE" },
      { href: "/civilisations", label: "Traditions olfactives" },
      { href: "/galerie-botaniques", label: "Galerie botaniques" },
    ],
  },
  {
    title: "San Andrés / Leaf Economies",
    icon: Leaf,
    items: [
      { href: "/leaf-economies", label: "Échantillons botaniques", badge: "NEW" },
      { href: "/timeline-botanique", label: "Timeline botanique", badge: "NEW" },
      { href: "/botanique-critique", label: "Botanique critique", badge: "NEW" },
      { href: "/varietes-fantomes", label: "Variétés fantômes", badge: "NEW" },
      { href: "/recettes-leaf-economies", label: "Recettes radicales", badge: "NEW" },
      { href: "/final-recipes", label: "Recettes finales", badge: "9" },
    ],
  },
  {
    title: "Archives & Terrain",
    icon: Database,
    items: [
      { href: "/archives-terrain", label: "Archives de Terrain", badge: "NEW" },
      { href: "/archives-olfactives", label: "Archives Olfactives", badge: "NEW" },
      { href: "/etudes-climatiques", label: "Études Climatiques", badge: "NEW" },
      { href: "/protocoles-moleculaires", label: "Protocoles Moléculaires", badge: "NEW" },
    ],
  },
  {
    title: "Projet",
    icon: Info,
    items: [
      { href: "/mon-dashboard", label: "Mon Dashboard", badge: "NEW" },
      { href: "/le-projet", label: "Le Projet PERFUMUM" },
      { href: "/manifeste", label: "Manifeste", badge: "NEW" },
      { href: "/a-propos", label: "À propos" },
      { href: "/contribuer", label: "Comment Contribuer", badge: "NEW" },
      { href: "/nouveautes", label: "Nouveautés", badge: "NEW" },
      { href: "/timeline", label: "Timeline" },
      { href: "/civilisations", label: "Traditions Olfactives" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

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
        <MegaMenu />

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

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-2">
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
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)]">
                <nav className="p-4">
                  <Accordion type="multiple" className="w-full">
                    {mobileMenuSections.map((section, index) => {
                      const Icon = section.icon;
                      
                      // Lien simple sans sous-menu
                      if (!section.items) {
                        return (
                          <SheetClose key={index} asChild>
                            <Link href={section.href!} className={cn(
                              "flex items-center gap-3 py-3 px-2 rounded-lg transition-colors",
                              location === section.href
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted"
                            )}>
                              <Icon className="h-5 w-5" />
                              {section.title}
                            </Link>
                          </SheetClose>
                        );
                      }
                      
                      // Section avec sous-menu
                      return (
                        <AccordionItem key={index} value={`section-${index}`} className="border-b-0">
                          <AccordionTrigger className="py-3 px-2 hover:bg-muted rounded-lg hover:no-underline">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5" />
                              <span>{section.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-8 space-y-1">
                              {section.items.map((item, itemIndex) => (
                                <SheetClose key={itemIndex} asChild>
                                  <Link href={item.href} className={cn(
                                    "flex items-center justify-between py-2 px-3 rounded-lg transition-colors text-sm",
                                    location === item.href
                                      ? "bg-primary/10 text-primary font-medium"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                  )}>
                                    <span>{item.label}</span>
                                      {item.badge && (
                                        <Badge 
                                          variant={item.badge === "NEW" ? "default" : "secondary"}
                                          className={cn(
                                            "text-xs",
                                            item.badge === "NEW" && "bg-amber-500 text-white"
                                          )}
                                        >
                                          {item.badge}
                                        </Badge>
                                      )}
                                  </Link>
                                </SheetClose>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                  
                  {/* Recherche mobile */}
                  <div className="mt-4 pt-4 border-t">
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          setTimeout(() => {
                            const event = new CustomEvent("open-global-search");
                            window.dispatchEvent(event);
                          }, 100);
                        }}
                      >
                        <Search className="h-4 w-4" />
                        Rechercher...
                      </Button>
                    </SheetClose>
                  </div>
                  
                  {/* Stats rapides - Supprimé car redondant */}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    
    {/* Breadcrumb sous le header */}
    <div className="container py-2 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <DynamicBreadcrumb />
    </div>

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
