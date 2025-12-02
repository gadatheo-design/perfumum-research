import { Link } from "wouter";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 transition-all duration-300 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <span className="text-2xl font-bold tracking-tight">PERFUMUM</span>
          </a>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {/* Le Projet - standalone */}
          <Link href="/le-projet">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Le Projet
            </a>
          </Link>

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
                <Link href="/accords">
                  <a className="w-full cursor-pointer">Accords</a>
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

          {/* Recherche - standalone */}
          <Link href="/recherche">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60">
              Recherche
            </a>
          </Link>
        </nav>

        {/* Search Icon */}
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
