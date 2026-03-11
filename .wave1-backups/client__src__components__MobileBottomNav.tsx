// @ts-nocheck
import { Link, useLocation } from "wouter";
import { Home, Beaker, Search, FlaskConical, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  activePattern?: RegExp;
  isSearch?: boolean;
}

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
      icon: <Compass className="h-5 w-5" />,
      label: "Explorer",
      path: "/gammes",
      activePattern: /^\/(gammes|colombie|sourcing)/,
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: "Recherche",
      path: "#",
      isSearch: true,
    },
    {
      icon: <Beaker className="h-5 w-5" />,
      label: "Molécules",
      path: "/molecules",
      activePattern: /^\/(molecules|molecule|terpenes|terpene)/,
    },
    {
      icon: <FlaskConical className="h-5 w-5" />,
      label: "Recettes",
      path: "/recettes",
      activePattern: /^\/(recettes|recette)/,
    },
  ];

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const event = new CustomEvent("open-global-search");
    window.dispatchEvent(event);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.activePattern?.test(location) || false;

          if (item.isSearch) {
            return (
              <button
                key={item.label}
                onClick={handleSearchClick}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-2 rounded-xl transition-all duration-200",
                  "hover:bg-primary/5 active:scale-95"
                )}
                aria-label="Ouvrir la recherche"
              >
                <div className="relative">
                  <div className="relative p-2 rounded-full bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                </div>
                <span className="text-[10px] font-medium text-primary mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link key={item.label} href={item.path}>
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-2 rounded-xl transition-all duration-200 cursor-pointer relative",
                  "hover:bg-muted/50",
                  isActive && "bg-primary/5"
                )}
              >
                {/* Indicateur actif — point lumineux en haut */}
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
