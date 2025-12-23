import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 py-12 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Section À propos */}
          <div>
            <h3 className="font-semibold text-sm mb-3">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/le-projet" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Le Projet PERFUMUM
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contribuer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Comment Contribuer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Section Méthodologie */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Méthodologie</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/methode-absorbe" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Méthode ABSORBE
                </Link>
              </li>
              <li>
                <Link href="/glossaire" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Glossaire
                </Link>
              </li>
              <li>
                <Link href="/glossaire-visuel-radar" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Glossaire Visuel Radar
                </Link>
              </li>
              <li>
                <Link href="/civilisations" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Traditions olfactives
                </Link>
              </li>
            </ul>
          </div>

          {/* Section Ressources */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/molecules" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Molécules
                </Link>
              </li>
              <li>
                <Link href="/recettes" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Recettes
                </Link>
              </li>
              <li>
                <Link href="/gammes" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Gammes olfactives
                </Link>
              </li>
              <li>
                <Link href="/archives" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Archives
                </Link>
              </li>
            </ul>
          </div>

          {/* Section Légal */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Légal</h3>
            <ul className="space-y-2">
              <li>
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Jean-Alphonse Bastos
                </p>
              </li>
              <li>
                <p className="text-xs text-muted-foreground">
                  ABSORBE™ — Godinje, Montenegro
                </p>
              </li>
              <li>
                <p className="text-xs text-muted-foreground">
                  UNLMTD™ trademark
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation et copyright */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground text-center">
            Tous droits réservés. PERFUMUM est un projet de recherche long terme (2025-2035).
          </p>
        </div>
      </div>
    </footer>
  );
}
