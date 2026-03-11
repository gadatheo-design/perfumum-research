// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Beaker, 
  BookOpen, 
  Lightbulb, 
  Target, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function LeProjet() {
  const prototypes = [
    {
      id: 1,
      code: "C1",
      name: "FERMENTUM",
      concept: "L'organique, l'intime, la matière vivante",
      forme: "Troublant, vivant",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      id: 2,
      code: "C2",
      name: "CLARUS VERDE",
      concept: "Verticalité, transparence, lumière verte",
      forme: "Vertical, clair",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      id: 3,
      code: "C3",
      name: "LACTA SOLIS",
      concept: "Douceur solaire, peau, tendresse",
      forme: "Chaleur, peau",
      color: "from-yellow-400 to-amber-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      id: 4,
      code: "C4",
      name: "TERRA AMBRA",
      concept: "Gravité, lenteur, sacré",
      forme: "Lenteur, gravité",
      color: "from-stone-600 to-amber-700",
      bgColor: "bg-stone-50",
      borderColor: "border-stone-300"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge variant="outline" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Recherche Olfactive, Artistique & Anthropologique
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                PERFUMUM
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground italic">
                "Perfumum n'est pas un projet d'art qui utilise l'odeur : Perfumum est une pensée artistique dont l'odeur est le médium."
              </p>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Un atelier de recherche olfactive consacré à l'étude des odeurs comme <strong>formes sensibles</strong>, comme <strong>matières conceptuelles</strong> et comme <strong>dispositifs d'expérience</strong>.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link href="/prototypes">
                  <Button size="lg" className="gap-2">
                    Explorer les Prototypes
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/laboratoire">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Beaker className="h-4 w-4" />
                    Méthodologie
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">L'Odeur comme Médium</h2>
                <p className="text-lg text-muted-foreground">
                  Le projet avance l'idée que l'odeur n'est pas une simple évocation ou un décor sensoriel : <strong>c'est un médium autonome</strong>, capable de produire du sens, des atmosphères, des récits, des états affectifs et des modes d'attention nouveaux.
                </p>
              </div>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">L'air</div>
                      <p className="text-sm text-muted-foreground">comme espace</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">Le corps</div>
                      <p className="text-sm text-muted-foreground">comme archive</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-primary">La matière</div>
                      <p className="text-sm text-muted-foreground">comme pensée</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/80">
                  Perfumum s'inscrit dans une pratique expérimentale inspirée par <strong>l'art contemporain</strong> (atmosphères, spatialisation, matérialité), <strong>les études olfactives</strong> (Le Guérer, Drobnick, Tolaas), <strong>la muséologie sensorielle</strong> (Clara Muller), <strong>la parfumerie d'auteur</strong> (Kurkdjian, Malle, Roques), <strong>l'anthropologie du sensible</strong> (Howes, Corbin), et <strong>la phénoménologie</strong> (Merleau-Ponty).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prototypes Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Les Quatre Prototypes</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Les prototypes C1–C4 constituent le cœur du système Perfumum. <strong>Ils ne cherchent pas à plaire, mais à faire apparaître une idée.</strong> Ils fonctionnent comme des <strong>"chapitres atmosphériques"</strong>.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {prototypes.map((proto) => (
                  <Link key={proto.id} href={`/prototype/${proto.id}`}>
                    <Card className={`${proto.borderColor} border-2 hover:shadow-lg transition-all cursor-pointer h-full`}>
                      <CardHeader className={proto.bgColor}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`text-2xl font-bold bg-gradient-to-r ${proto.color} bg-clip-text text-transparent`}>
                            {proto.code}
                          </div>
                          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                        </div>
                        <CardTitle className="text-2xl">{proto.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Axe Conceptuel</h4>
                          <p className="text-foreground">{proto.concept}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Forme Sensible</h4>
                          <Badge variant="secondary">{proto.forme}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center pt-4">
                <Link href="/prototypes">
                  <Button variant="outline" size="lg" className="gap-2">
                    Voir tous les Prototypes
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Positionnement Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Positionnement</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Ce que Perfumum n'est pas */}
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-900">
                      <XCircle className="h-5 w-5" />
                      Ce que Perfumum n'est pas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Un projet de parfumerie commerciale</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Une collection de "senteurs bien-être"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Un exercice de marketing sensoriel</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Une illustration olfactive d'un autre médium</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Ce que Perfumum est */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-900">
                      <CheckCircle2 className="h-5 w-5" />
                      Ce que Perfumum est
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Une recherche artistique autonome</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Un laboratoire de formes sensibles</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Une pratique expérimentale rigoureuse</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Un langage atmosphérique original</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Une contribution aux études olfactives et à l'art contemporain</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Ambitions Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-center">Ambitions</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Court terme */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Court Terme (2025-2026)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">Finaliser les quatre prototypes C1–C4</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">Documenter la méthodologie et les processus</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">Développer des dispositifs d'exposition</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">Établir des collaborations institutionnelles</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Moyen terme */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Moyen Terme (2027-2030)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">Présenter Perfumum dans des contextes muséaux et artistiques</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">Publier des articles et communications sur la recherche</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">Développer une structure hybride (atelier, marque, cellule de recherche)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">Établir Perfumum comme référence dans les études olfactives</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">Explorer PERFUMUM</h2>
              <p className="text-lg text-muted-foreground">
                Découvrez les prototypes, la méthodologie, les visualisations et l'ensemble de la recherche olfactive.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link href="/prototypes">
                  <Button size="lg" className="gap-2">
                    <Beaker className="h-4 w-4" />
                    Les Prototypes
                  </Button>
                </Link>
                <Link href="/laboratoire">
                  <Button size="lg" variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Laboratoire
                  </Button>
                </Link>
                <Link href="/absorbe-scale">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Échelle ABSORBE
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    <Footer />

    </div>
  );
}
