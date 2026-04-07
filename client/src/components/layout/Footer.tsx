import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 py-12 mt-auto">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 max-w-4xl mx-auto">
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
              <li>
                <Link href="/accords" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Accords
                </Link>
              </li>
              <li>
                <Link href="/gammes" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Gammes
                </Link>
              </li>
              <li>
                <Link href="/plants" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Plantes
                </Link>
              </li>
              <li>
                <Link href="/terroirs" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Terroirs
                </Link>
              </li>
              <li>
                <Link href="/leaf-economies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  San Andrés
                </Link>
              </li>
            </ul>
          </div>

          {/* Section Outils */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Outils</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/recherche-avancee" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Recherche avancée
                </Link>
              </li>
              <li>
                <Link href="/outils/editeur-formulation" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Éditeur de formulation
                </Link>
              </li>
              <li>
                <Link href="/calculateur" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Calculateur
                </Link>
              </li>
              <li>
                <Link href="/synergies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Synergies
                </Link>
              </li>
              <li>
                <Link href="/terp-profiles" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  TerpProfiles
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
              <li>
                <Link href="/recherche-scientifique" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Recherche scientifique
                </Link>
              </li>
              <li>
                <Link href="/ifra" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Normes IFRA
                </Link>
              </li>
            </ul>
          </div>

          {/* Section À propos */}
          <div>
            <h3 className="font-semibold text-sm mb-3">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/le-projet" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Le Projet
                </Link>
              </li>
              <li>
                <Link href="/manifeste" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Manifeste
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/nouveautes" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Nouveautés
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
            Tous droits réservés Juan Bastos (2025-2035).
          </p>
        </div>
      </div>
    </footer>
  );
}
