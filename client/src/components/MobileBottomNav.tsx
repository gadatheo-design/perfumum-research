import { Link, useLocation } from "wouter";
import { Home, Beaker, Search, Heart, User } from "lucide-react";
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
      label: "Études",
      path: "/terpenes",
      activePattern: /^\/(terpenes|terpene|molecules|molecule|resines-cbd|recette|graphe|matrice|compare)/,
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
      icon: <User className="h-5 w-5" />,
      label: "Admin",
      path: "/admin",
      activePattern: /^\/admin/,
    },
  ];

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const event = new CustomEvent("open-global-search");
    window.dispatchEvent(event);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
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
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-muted active:scale-95"
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
              <a
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-muted active:scale-95",
                  isActive && "bg-primary/10"
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
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
