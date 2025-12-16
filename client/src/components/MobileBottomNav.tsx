import { Link, useLocation } from "wouter";
import { Home, Beaker, Search, Heart, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  activePattern?: RegExp;
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
      icon: <Beaker className="h-5 w-5" />,
      label: "Molécules",
      path: "/molecules",
      activePattern: /^\/(molecules|molecule|terpenes|terpene)/,
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: "Recherche",
      path: "#",
      activePattern: /^$/,
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Favoris",
      path: "/favoris",
      activePattern: /^\/favoris/,
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.activePattern?.test(location) || false;

          if (item.path === "#") {
            // Bouton recherche spécial
            return (
              <button
                key={item.label}
                onClick={handleSearchClick}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                  "hover:bg-muted/80 active:scale-95 hover:-translate-y-0.5"
                )}
              >
                <div className={cn("transition-colors", "text-muted-foreground")}>
                  {item.icon}
                </div>
                <span className={cn("text-xs font-medium transition-colors", "text-muted-foreground")}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link key={item.label} href={item.path}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                  "hover:bg-muted/80 active:scale-95 hover:-translate-y-0.5",
                  isActive && "bg-primary/10 shadow-lg shadow-primary/20"
                )}
              >
                <div
                  className={cn(
                    "transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
