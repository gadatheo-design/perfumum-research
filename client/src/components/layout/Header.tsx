import { Link, useLocation } from "wouter";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

// Updated: 2025-12-06 05:48 - Added theme toggle
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/etudes", label: "Études" },
    { href: "/gammes/petrichor", label: "Pétrichor" },
    { href: "/methode", label: "Méthode" },
    { href: "/projets", label: "Projets" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 transition-all duration-300 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <span className="text-2xl font-bold tracking-tight">PERFUMUM</span>
          </a>
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
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Basculer le thème</span>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link href={item.href}>
                      <a
                        className={cn(
                          "text-lg transition-colors hover:text-foreground/80",
                          location === item.href
                            ? "text-foreground font-semibold"
                            : "text-foreground/60"
                        )}
                      >
                        {item.label}
                      </a>
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link href="/recherche">
                    <a className="flex items-center gap-2 text-lg text-foreground/60 hover:text-foreground/80 transition-colors">
                      <Search className="h-5 w-5" />
                      Recherche
                    </a>
                  </Link>
                </SheetClose>
                {/* Theme Toggle Mobile */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-lg text-foreground/60 hover:text-foreground/80 transition-colors text-left"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-5 w-5" />
                      Mode clair
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5" />
                      Mode sombre
                    </>
                  )}
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
