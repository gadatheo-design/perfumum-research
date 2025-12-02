import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, Calendar, Scroll } from "lucide-react";
import { trpc } from "@/lib/trpc";

function CivilisationsDatabase() {
  const { data: civilisations, isLoading } = trpc.civilisations.list.useQuery();

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement des civilisations...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Base de Données Civilisations
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {civilisations?.length || 0} civilisations documentées avec leurs pratiques olfactives, matériaux symboliques et contextes culturels
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {civilisations?.map((civ) => (
              <Card key={civ.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{civ.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {civ.region}
                      </CardDescription>
                    </div>
                    {civ.temporality && (
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {civ.temporality}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {civ.longDescription && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {civ.longDescription}
                    </p>
                  )}
                  {civ.temporality && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Scroll className="h-4 w-4" />
                        Temporalité
                      </h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {civ.temporality}
                      </p>
                    </div>
                  )}
                  {civ.symbolicMaterials && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Matériaux Symboliques</h4>
                      <div className="flex flex-wrap gap-2">
                        {civ.symbolicMaterials.split(',').map((material, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {material.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Civilisations() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-solar-mineralis/10 mb-6">
                <Globe className="h-8 w-8 text-solar-mineralis" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Civilisations
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Approche anthropologique des cultures olfactives à travers l'histoire
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-lg text-muted-foreground leading-relaxed">
                L'axe <strong>Civilisations</strong> du projet Perfumum explore comment différentes cultures ont construit des <strong>univers olfactifs</strong> spécifiques, articulant matières symboliques, pratiques rituelles et cosmologies sensibles. Cette approche anthropologique permet de comprendre l'odeur comme fait culturel et vecteur de sens collectif.
              </p>
            </div>

            {/* Featured Example: Royal Mossi */}
            <div className="max-w-4xl mx-auto mb-16">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-3xl mb-2">Royal Mossi</CardTitle>
                      <CardDescription className="text-base">
                        Système olfactif de la royauté Mossi (Burkina Faso)
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      Cas d'étude principal
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Contexte</h4>
                    <p className="text-muted-foreground">
                      Le système Royal Mossi articule des matières symboliques (argile, résine, eau) dans des pratiques rituelles liées au pouvoir, à la terre et à l'ancestralité. L'odeur y joue un rôle central dans la légitimation du pouvoir royal et la médiation avec les ancêtres.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Matières Symboliques</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Argile sacrée", "Résine de karité", "Eau lustrale", "Cendre rituelle", "Tabac cérémoniel"].map((matiere, idx) => (
                        <span key={idx} className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                          {matiere}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Accord Signature</h4>
                    <p className="text-muted-foreground">
                      Composition olfactive inspirée du système Royal Mossi, articulant terre, résine et fumée dans une texture atmosphérique évoquant le sacré, l'ancestralité et le pouvoir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Temporalities */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Temporalités Culturelles
              </h2>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Archaïque</CardTitle>
                    <CardDescription>Cultures préhistoriques et premiers systèmes olfactifs</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Exploration des pratiques olfactives des sociétés de chasseurs-cueilleurs : fumigation, marquage territorial, rituels funéraires. Comment les premières cultures humaines ont-elles construit des univers de sens à travers les odeurs ?
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Antique</CardTitle>
                    <CardDescription>Civilisations anciennes (Égypte, Mésopotamie, Grèce, Rome)</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Étude des systèmes olfactifs élaborés des grandes civilisations antiques : parfumerie égyptienne, encens mésopotamiens, aromates grecs, onguents romains. L'odeur comme marqueur social, médium religieux et technologie du corps.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Médiéval</CardTitle>
                    <CardDescription>Pratiques olfactives du Moyen Âge</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Exploration des univers olfactifs médiévaux : encens liturgique, aromates médicinaux, parfums courtois. Articulation entre sacré chrétien, médecine humorale et raffinement aristocratique.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Abyssal</CardTitle>
                    <CardDescription>Cultures des profondeurs marines et souterraines</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Approche spéculative des univers olfactifs liés aux profondeurs : grottes sacrées, mines rituelles, abysses marins. Exploration des odeurs de la terre profonde, de l'eau abyssale et des espaces souterrains.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Futuriste</CardTitle>
                    <CardDescription>Projections olfactives spéculatives</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Exploration prospective des futurs possibles de l'olfaction : biotechnologies olfactives, atmosphères synthétiques, mémoires odorantes artificielles. Comment les cultures futures pourraient-elles transformer nos rapports aux odeurs ?
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Approche Méthodologique
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recherche Bibliographique</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Étude des sources anthropologiques, historiques et ethnographiques sur les pratiques olfactives des différentes cultures. Construction d'un corpus de références permettant de situer les pratiques dans leurs contextes culturels spécifiques.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Traduction Olfactive</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Création de compositions olfactives inspirées par les systèmes culturels étudiés. Il ne s'agit pas de reconstitution historique mais de <strong>traduction sensible</strong> : comment traduire en odeur les qualités atmosphériques d'un univers culturel ?
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Articulation Théorique</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Réflexion sur les enjeux épistémologiques et éthiques de cette approche. Comment éviter l'appropriation culturelle ? Comment respecter la complexité des systèmes olfactifs étudiés ? Comment articuler recherche anthropologique et création artistique ?
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Database Civilisations */}
        <CivilisationsDatabase />

        {/* Statistics */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">
                Données Actuelles
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">25+</div>
                  <div className="text-sm text-muted-foreground">Cultures Étudiées</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">5</div>
                  <div className="text-sm text-muted-foreground">Temporalités</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">15+</div>
                  <div className="text-sm text-muted-foreground">Accords Signature</div>
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
