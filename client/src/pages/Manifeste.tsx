import { Link } from "wouter";
import { BookOpen, Beaker, Compass, Calendar, Target, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function Manifeste() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Breadcrumbs />
        
        {/* Hero */}
        <div className="text-center mb-16 mt-8">
          <h1 className="text-5xl font-bold mb-4 uppercase tracking-tight">
            MANIFESTE
          </h1>
          <p className="text-xl text-muted-foreground">
            ABSORBE — Laboratoire atmosphérique olfactif
          </p>
        </div>

        {/* Section 1 : Hiérarchie conceptuelle */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold uppercase">Hiérarchie conceptuelle</h2>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              <strong>ABSORBE</strong> est un laboratoire de recherche-création basé à Berne, Suisse. 
              Il développe une méthodologie originale d'investigation atmosphérique par l'olfaction, 
              croisant phénoménologie, chimie analytique et anthropologie sensible.
            </p>
            
            <div className="bg-muted/30 p-8 rounded-lg border-l-4 border-primary my-8">
              <p className="text-2xl font-bold text-center mb-4">
                ABSORBE ⊃ PERFUMUM ⊃ GAMMES
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">ABSORBE</h3>
                  <p className="text-sm text-muted-foreground">
                    Cadre méthodologique et philosophique. Définit les protocoles de captation, 
                    d'analyse et de restitution des atmosphères.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">PERFUMUM</h3>
                  <p className="text-sm text-muted-foreground">
                    Plateforme de recherche et développement. Base de données moléculaires, 
                    recettes, synergies et outils de formulation.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">GAMMES</h3>
                  <p className="text-sm text-muted-foreground">
                    Applications concrètes. Pétrichor, Volcanique, Colombie, Phéromones, 
                    Raretés — chaque gamme explore un territoire olfactif.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed">
              <strong>PERFUMUM</strong> n'est pas une marque commerciale mais un <em>laboratoire de recherche</em> 
              au service de la méthodologie ABSORBE. Il centralise 10 ans de données moléculaires (2025-2035), 
              documente les synergies chimiques et propose des outils d'aide à la formulation pour chercheurs, 
              parfumeurs et créateurs.
            </p>
          </div>
        </section>

        {/* Section 2 : Démarche */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Compass className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold uppercase">Démarche</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <BookOpen className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-3">1. Captation Terrain</h3>
              <p className="text-sm text-muted-foreground">
                Observation phénoménologique des lieux (forêts, musées, friches). 
                Prélèvements atmosphériques, mesures GC-MS, notes sensorielles.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <Beaker className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-3">2. Analyse Moléculaire</h3>
              <p className="text-sm text-muted-foreground">
                Identification des composés volatils, profils radar olfactifs, 
                documentation des synergies chimiques et effets sensoriels.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-3">3. Restitution</h3>
              <p className="text-sm text-muted-foreground">
                Formulation de recettes, installations olfactives immersives, 
                publications scientifiques et partage avec la communauté.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 : Timeline 2025-2035 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold uppercase">Timeline 2025-2035</h2>
          </div>
          
          <div className="space-y-6">
            {/* 2025 */}
            <div className="border-l-4 border-primary pl-6">
              <h3 className="font-bold text-xl mb-2">2025 — Fondation</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Lancement plateforme PERFUMUM (288 molécules, 234 recettes)</li>
                <li>• Gammes Pétrichor, Volcanique, Colombie, Phéromones</li>
                <li>• Système de synergies moléculaires (25 synergies actives)</li>
                <li>• Outils de formulation (calculateurs, comparateurs radar)</li>
              </ul>
            </div>

            {/* 2026-2027 */}
            <div className="border-l-4 border-muted pl-6">
              <h3 className="font-bold text-xl mb-2">2026-2027 — Développement</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Générateur de formules IA (suggestions basées profils radar)</li>
                <li>• Expansion base de données (500+ molécules)</li>
                <li>• Protocoles de maturation et vieillissement</li>
                <li>• Collaborations internationales (Colombie, Japon, Maroc)</li>
              </ul>
            </div>

            {/* 2028-2029 */}
            <div className="border-l-4 border-muted pl-6">
              <h3 className="font-bold text-xl mb-2">2028-2029 — Expansion</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Publications scientifiques (revues académiques)</li>
                <li>• Installations artistiques immersives (musées, biennales)</li>
                <li>• API publique pour développeurs et chercheurs</li>
                <li>• Forum communautaire et contributions ouvertes</li>
              </ul>
            </div>

            {/* 2030-2035 */}
            <div className="border-l-4 border-muted pl-6">
              <h3 className="font-bold text-xl mb-2">2030-2035 — Maturité</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Archive complète 10 ans de recherche atmosphérique</li>
                <li>• 1000+ molécules documentées avec profils radar</li>
                <li>• Réseau international de contributeurs et collaborateurs</li>
                <li>• Transmission méthodologie ABSORBE (formations, ateliers)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 : Principes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold uppercase mb-6">Principes</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3">Rigueur scientifique</h3>
              <p className="text-sm text-muted-foreground">
                Protocoles GC-MS standardisés, validation des données, 
                références bibliographiques académiques, reproductibilité des expériences.
              </p>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3">Sensibilité phénoménologique</h3>
              <p className="text-sm text-muted-foreground">
                Observation incarnée des atmosphères, attention aux qualités sensibles, 
                documentation des résonances émotionnelles et mémorielles.
              </p>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3">Ouverture collaborative</h3>
              <p className="text-sm text-muted-foreground">
                Partage des données et méthodologies, contributions communautaires, 
                transparence des processus, licences ouvertes.
              </p>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3">Durabilité long terme</h3>
              <p className="text-sm text-muted-foreground">
                Projet décennal (2025-2035), documentation pérenne, 
                transmission des savoirs, autonomie financière et technique.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-primary/5 p-8 rounded-lg border">
          <h3 className="text-2xl font-bold mb-4">Rejoindre le projet</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            PERFUMUM est ouvert aux collaborations : chercheurs, parfumeurs, artistes, 
            institutions académiques. Consultez la page "Comment Contribuer" pour participer.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contribuer">
              <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Comment Contribuer
              </a>
            </Link>
            <Link href="/methodologie/absorbe">
              <a className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors">
                Méthode ABSORBE
              </a>
            </Link>
            <Link href="/timeline">
              <a className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors">
                Timeline Recherche
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
