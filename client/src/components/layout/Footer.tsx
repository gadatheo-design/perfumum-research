import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 py-12 mt-auto">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8 max-w-3xl mx-auto">
          {/* Section Données */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Données</h3>
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
            </ul>
          </div>

          {/* Section Méthodologie */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Méthodologie</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/methodologie/absorbe" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Méthode ABSORBE
                </Link>
              </li>
              <li>
                <Link href="/glossaire" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Glossaire
                </Link>
              </li>
            </ul>
          </div>

          {/* Section À propos */}
          <div>
            <h3 className="font-semibold text-sm mb-3">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/a-propos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Le Projet
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
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
