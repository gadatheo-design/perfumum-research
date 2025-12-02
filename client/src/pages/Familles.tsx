import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Familles() {
  const families = [
    {
      name: "Bio-Mineralis",
      type: "biomineralis",
      description: "Famille explorant l'intersection entre le vivant et le minéral, articulant matières organiques fossilisées et textures pierreuses.",
      accords: ["Os + Pluie", "Cuir Fossilisé", "Os Carbonisé", "Pétrichor Anthropique", "Sève/Chair/Roche", "Nécro-Géo Sacré"],
      variationCount: 6,
      color: "bg-bio-mineralis",
    },
    {
      name: "Pétrichor",
      type: "petrichor",
      description: "Odeur de la terre mouillée après la pluie. 60 variations explorant différents types de sols, climats et temporalités.",
      accords: ["Pétrichor Clair", "Pétrichor Noir", "Argile Humide", "Bois Humide", "Racine", "Mousse", "Désert", "Marin", "Glaciaire", "Urbain", "Sacré"],
      variationCount: 60,
      color: "bg-petrichor text-white",
    },
    {
      name: "Volcanique",
      type: "volcanique",
      description: "Famille minérale évoquant les phénomènes tectoniques et volcaniques. 36 variations de basalte, soufre, vapeur et poussière.",
      accords: ["Basalte Chaud", "Basalte Froid", "Vapeur", "Soufre", "Poussière Tectonique", "Magma Blanc", "Pierre Poreuse"],
      variationCount: 36,
      color: "bg-volcanique text-white",
    },
    {
      name: "Solar-Mineralis",
      type: "solarmineralis",
      description: "Famille articulant chaleur solaire et minéralité. Exploration des pierres chauffées, sables brûlants et cristaux lumineux.",
      accords: ["Pierre Solaire", "Sable Chaud", "Cristal Lumineux", "Sel Solaire"],
      variationCount: 12,
      color: "bg-solar-mineralis",
    },
    {
      name: "Série Perfumeum 12",
      type: "perfumeum12",
      description: "Collection de 12 compositions atmosphériques autonomes explorant différentes qualités sensibles et conceptuelles.",
      accords: ["Composition 1", "Composition 2", "Composition 3", "..."],
      variationCount: 12,
      color: "bg-primary text-white",
    },
    {
      name: "Nécro-Géo Sacré",
      type: "necrogeo",
      description: "Famille explorant les dimensions funéraires, géologiques et sacrées de l'olfaction. Articulation entre mort, terre et rituel.",
      accords: ["Terre Funéraire", "Résine Sacrée", "Cendre Rituelle", "Myrrhe Noire"],
      variationCount: 8,
      color: "bg-foreground text-background",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Familles Olfactives
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Systèmes de classification et d'exploration des qualités sensibles
              </p>
              <Link href="/familles/list">
                <Button size="lg" className="mt-4">
                  Voir toutes les familles
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Les familles olfactives constituent des <strong>systèmes d'organisation</strong> permettant de cartographier les qualités sensibles explorées dans le projet Perfumum. Chaque famille regroupe des variations autour d'un axe conceptuel et sensoriel commun, créant des constellations de compositions interconnectées.
              </p>
            </div>

            {/* Families Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {families.map((family, index) => (
                <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                  <div className={`h-2 ${family.color}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{family.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {family.variationCount} variations
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {family.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {family.description}
                    </p>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Accords principaux :</h4>
                      <div className="flex flex-wrap gap-2">
                        {family.accords.map((accord, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                          >
                            {accord}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Construction des Familles
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Approche Systémique</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Les familles ne sont pas des catégories figées mais des <strong>systèmes évolutifs</strong> qui se développent au fil de la recherche. Chaque nouvelle composition peut enrichir une famille existante ou suggérer l'émergence d'une nouvelle famille.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Variations et Déclinaisons</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Au sein de chaque famille, les variations explorent différentes <strong>intensités, textures et temporalités</strong> d'une même qualité sensible. Par exemple, le Pétrichor se décline en 60 variations selon le type de sol, le climat et la saison.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interconnexions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Les familles ne sont pas isolées mais <strong>dialoguent entre elles</strong>. Bio-Mineralis articule Pétrichor et Volcanique ; Solar-Mineralis combine chaleur et minéralité. Ces intersections créent des zones de transition fertiles pour l'exploration.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Documentation Moléculaire</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Chaque famille est documentée au niveau moléculaire : quelles molécules caractérisent cette famille ? Quelles interactions chimiques produisent ces qualités sensibles ? Cette approche permet une <strong>compréhension fine</strong> des mécanismes olfactifs.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Vue d'Ensemble
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">6+</div>
                  <div className="text-sm text-muted-foreground">Familles Principales</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">134+</div>
                  <div className="text-sm text-muted-foreground">Variations Totales</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">120+</div>
                  <div className="text-sm text-muted-foreground">Accords Documentés</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 PERFUMUM — Recherche Olfactive</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
