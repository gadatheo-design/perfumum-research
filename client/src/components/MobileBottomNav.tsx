import { Link, useLocation } from "wouter";
import { Home, FlaskConical, BookOpen, Library, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
        /^\/(plantes|plant|molecules|molecule|recettes|recette|gammes|tabacotheque|tabac|terroirs|osmotheque|synergies|ifra|sourcing|smiles|matieres|final-recipes|calculateur|terpenes|terpene)/,
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Atlas",
      path: "/storylines",
      activePattern:
        /^\/(storylines|storyline|galerie-olfactive|atlas|civilisations|archives-olfactives|timeline|phylogenetique|genealogy|ghost|leaf-economies|carte-plantes)/,
    },
    {
      icon: <Library className="h-5 w-5" />,
      label: "Biblio.",
      path: "/axes-recherche",
      activePattern:
        /^\/(axes-recherche|bibliographie|visualisations|reseau|recipe-network|correlations|sankey|synergies-heatmap|stats|recherche|parfums|muscs|enrichissement|percepts|absorbe|methodologie|methodes|gcms|ms-spectra)/,
    },
    {
      icon: <FolderOpen className="h-5 w-5" />,
      label: "Projet",
      path: "/a-propos",
      activePattern: /^\/(a-propos|contribuer|admin|glossaire|manifeste|outils-hub)/,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.activePattern?.test(location) || false;

          return (
            <Link key={item.label} href={item.path}>
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-2 rounded-xl transition-all duration-200 cursor-pointer relative",
                  "hover:bg-muted/50",
                  isActive && "bg-primary/5"
                )}
              >
                {/* Indicateur actif — barre en haut */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      key="dot"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-primary"
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  animate={isActive ? { y: -1 } : { y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                </motion.div>

                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
