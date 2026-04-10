import { Link, useLocation } from "wouter";
import { Home, FlaskConical, BookOpen, Library, FolderOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";


interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  activePattern?: RegExp;
}

/**
 * MobileBottomNav
 * Barre de navigation fixe en bas de l'écran (mobile uniquement, < lg).
 * Reflète les 4 groupes de navigationConfig.ts :
 *   Accueil / Atelier / Atlas / Bibliothèque / Projet
 */
export function MobileBottomNav() {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Masquer la nav si on scroll vers le bas, afficher si on scroll vers le haut
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems: NavItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Accueil",
      path: "/",
      activePattern: /^\/$/, 
    },
    {
      icon: <FlaskConical className="h-5 w-5" />,
      label: "Atelier",
      path: "/plantes",
      activePattern:
        /^\/(plantes|plant|molecules|molecule|recettes|recette|gammes|tabacotheque|tabac|terroirs|osmotheque|synergies|ifra|sourcing|smiles|matieres|final-recipes|calculateur|terpenes|terpene|conservation|inventory|analysis-hub|landraces|chemotypes|perique|tps-genes|molecular-transform|protocoles|aromatic|alternatives)/
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Atlas",
      path: "/storylines",
      activePattern:
        /^\/(storylines|storyline|galerie-olfactive|atlas|civilisations|traditions-olfactives|archives-olfactives|timeline|phylogenetique|genealogy|ghost|leaf-economies|carte-plantes|nicotiana-explorer|classification-phylogenetique|europeana|comparaison-genres)/
    },
    {
      icon: <Library className="h-5 w-5" />,
      label: "Biblio.",
      path: "/axes-recherche",
      activePattern:
        /^\/(axes-recherche|bibliographie|visualisations|reseau|recipe-network|correlations|sankey|synergies-heatmap|stats|recherche|parfums|muscs|enrichissement|percepts|absorbe|methodologie|methodes|gcms|ms-spectra|visualisation|compound-search|claims|smiles|molecules-disparues)/
    },
    {
      icon: <FolderOpen className="h-5 w-5" />,
      label: "Projet",
      path: "/a-propos",
      activePattern: /^\/(a-propos|contribuer|admin|glossaire|manifeste|outils-hub|prototypes|projet)/,
    },
  ];

  return (
    <motion.nav
      animate={isVisible ? { y: 0 } : { y: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-2xl border-t border-primary/10 shadow-2xl safe-area-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const isActive = item.activePattern?.test(location) || false;

          return (
            <Link key={item.label} href={item.path}>
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-2 px-1 rounded-xl transition-all duration-200 cursor-pointer relative",
                  "hover:bg-muted/40",
                  isActive && "bg-primary/8"
                )}
              >
                {/* Indicateur actif — barre épaisse en haut */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      key="dot"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      className="absolute top-0 left-0 right-0 h-1 rounded-b-lg bg-gradient-to-r from-primary/60 via-primary to-primary/60"
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  animate={isActive ? { y: -3, scale: 1.15 } : { y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200 relative",
                    isActive
                      ? "text-primary bg-primary/15 shadow-md"
                      : "text-muted-foreground hover:text-foreground/70"
                  )}
                >
                  {item.icon}
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                </motion.div>

                <span
                  className={cn(
                    "text-[10px] font-medium transition-all duration-200 whitespace-nowrap",
                    isActive ? "text-primary font-bold tracking-wide" : "text-muted-foreground text-[9px]"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
