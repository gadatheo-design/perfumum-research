import { Link, useLocation } from "wouter";
import { Search, Menu, Sun, Moon, ChevronDown, Beaker, FlaskConical, BookOpen, Atom, Mountain, Snowflake, Crown, Sparkles, Home, Info, Mail, FileText, Database, TestTube, Layers, BarChart3, GitBranch, Activity } from "lucide-react";
import { MegaMenu } from "@/components/MegaMenu";
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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    title: "Méthode ABSORBE",
    href: "/methodologie/absorbe",
    icon: BookOpen,
  },
  {
    title: "Méthodologie de Recherche",
    href: "/methodologie/recherche",
    icon: TestTube,
  },
  {
    title: "Échelle ABSORBE",
    href: "/methodologie/echelle-absorbe",
    icon: Atom,
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
    title: "Molécules",
    icon: Atom,
    items: [
      { href: "/molecules", label: "Toutes les molécules", badge: "176" },
      { href: "/chemical-families", label: "Familles chimiques" },
      { href: "/compare-molecules-advanced", label: "Comparaison avancée" },
      { href: "/matrice-synergies", label: "Matrice synergies" },
    ],
  },
  {
    title: "Recettes",
    icon: Beaker,
    items: [
      { href: "/recettes", label: "Toutes les recettes", badge: "195" },
      { href: "/compare-recettes", label: "Comparer les recettes", badge: "NEW" },
      { href: "/accords", label: "Accords olfactifs" },
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
      { href: "/outils/generateur-formules", label: "Générateur de Formules", badge: "NEW" },
      { href: "/suggestions-synergies", label: "Suggestions Synergies" },
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
    title: "Projet",
    icon: Info,
    items: [
      { href: "/le-projet", label: "Le Projet PERFUMUM" },
      { href: "/a-propos", label: "À propos" },
      { href: "/contribuer", label: "Comment Contribuer", badge: "NEW" },
      { href: "/nouveautes", label: "Nouveautés", badge: "NEW" },
      { href: "/timeline", label: "Timeline" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 transition-all duration-300 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col transition-opacity hover:opacity-80">
          <span className="text-2xl font-bold tracking-tight">PERFUMUM</span>
          <span className="hidden md:block text-[10px] text-muted-foreground/70 tracking-wide font-light -mt-1">Recherche olfactive expérimentale</span>
        </Link>

        {/* Desktop Navigation - Mega Menu */}
        <MegaMenu />

        {/* Search Icon & Theme Toggle */}
        <div className="hidden lg:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const event = new CustomEvent("open-global-search");
              window.dispatchEvent(event);
            }}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Ouvrir la recherche"
          >
            <Search className="h-5 w-5" />
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
                  
                  {/* Stats rapides */}
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Base de données</p>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="font-bold">176</span>
                        <span className="text-muted-foreground ml-1">molécules</span>
                      </div>
                      <div>
                        <span className="font-bold">195</span>
                        <span className="text-muted-foreground ml-1">recettes</span>
                      </div>
                    </div>
                  </div>
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
