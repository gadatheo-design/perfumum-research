import { Link } from "wouter";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <span className="text-2xl font-bold tracking-tight">PERFUMUM</span>
          </a>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/le-projet">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Le Projet
            </a>
          </Link>
          <Link href="/prototypes">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Prototypes
            </a>
          </Link>
          <Link href="/familles">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Familles
            </a>
          </Link>
          <Link href="/chemical-families">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Chimie
            </a>
          </Link>
          <Link href="/accords">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Accords
            </a>
          </Link>
          <Link href="/experimental-accords">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Expérimental
            </a>
          </Link>
          <Link href="/laboratoire">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Laboratoire
            </a>
          </Link>
          <Link href="/glossaire">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Glossaire
            </a>
          </Link>
          <Link href="/timeline">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Timeline
            </a>
          </Link>
          <Link href="/absorbe-scale">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              ABSORBE
            </a>
          </Link>
          <Link href="/recherche">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Recherche
            </a>
          </Link>
          <Link href="/civilisations">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Civilisations
            </a>
          </Link>
          <Link href="/installations">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Installations
            </a>
          </Link>
        </nav>

        {/* Search */}
        <div className="flex items-center space-x-2">
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
