import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Beaker, Flower2, Globe, Palette } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-spacing psychedelic-gradient moire-pattern relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="container">
            <div className="max-w-4xl mx-auto text-center content-spacing relative z-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-6 animate-fadeInUp">
                PERFUMUM
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground text-balance mb-4 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                Recherche Olfactive
              </p>
              <blockquote className="text-lg md:text-xl italic text-foreground/80 border-l-4 border-primary pl-6 py-4 my-8 text-left max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                "Perfumum n'est pas un projet d'art qui utilise l'odeur : Perfumum est une pensée artistique dont l'odeur est le médium."
              </blockquote>
              <div className="flex flex-wrap gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                <Link href="/prototypes">
                  <Button size="lg" className="gap-2">
                    Explorer les Prototypes
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/projet">
                  <Button size="lg" variant="outline">
                    Découvrir le Projet
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Sections Grid */}
        <section className="section-spacing molecular-bg">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Prototypes */}
              <Link href="/prototypes">
                <a className="block h-full">
                  <Card className="h-full brutal-border transition-all duration-300 cursor-pointer group animate-fadeInUp bg-card" style={{animationDelay: '0.1s'}}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Palette className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        Prototypes C1-C4
                      </CardTitle>
                      <CardDescription>
                        4 compositions fondamentales
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Chapitres atmosphériques explorant des axes existentiels et phénoménologiques
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </Link>

              {/* Familles */}
              <Link href="/familles">
                <a className="block h-full">
                  <Card className="h-full brutal-border transition-all duration-300 cursor-pointer group animate-fadeInUp bg-card" style={{animationDelay: '0.2s'}}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-petrichor/10 flex items-center justify-center mb-4 group-hover:bg-petrichor/20 transition-colors">
                        <Flower2 className="h-6 w-6 text-petrichor" />
                      </div>
                      <CardTitle className="group-hover:text-petrichor transition-colors">
                        Familles Olfactives
                      </CardTitle>
                      <CardDescription>
                        6+ familles étendues
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Bio-Mineralis, Pétrichor (60 variations), Volcanique (36 variations), Solar-Mineralis
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </Link>

              {/* Laboratoire */}
              <Link href="/laboratoire">
                <a className="block h-full">
                  <Card className="h-full brutal-border transition-all duration-300 cursor-pointer group animate-fadeInUp bg-card" style={{animationDelay: '0.3s'}}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-volcanique/10 flex items-center justify-center mb-4 group-hover:bg-volcanique/20 transition-colors">
                        <Beaker className="h-6 w-6 text-volcanique" />
                      </div>
                      <CardTitle className="group-hover:text-volcanique transition-colors">
                        Laboratoire
                      </CardTitle>
                      <CardDescription>
                        100+ molécules, 120+ accords
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Base de données complète de matières premières, molécules, accords et recettes
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </Link>

              {/* Civilisations */}
              <Link href="/civilisations">
                <a className="block h-full">
                  <Card className="h-full brutal-border transition-all duration-300 cursor-pointer group animate-fadeInUp bg-card" style={{animationDelay: '0.4s'}}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-solar-mineralis/10 flex items-center justify-center mb-4 group-hover:bg-solar-mineralis/20 transition-colors">
                        <Globe className="h-6 w-6 text-solar-mineralis" />
                      </div>
                      <CardTitle className="group-hover:text-solar-mineralis transition-colors">
                        Civilisations
                      </CardTitle>
                      <CardDescription>
                        25+ cultures olfactives
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Approche anthropologique des cultures olfactives à travers l'histoire
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">4</div>
                <div className="text-sm text-muted-foreground">Prototypes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">6+</div>
                <div className="text-sm text-muted-foreground">Familles</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">120+</div>
                <div className="text-sm text-muted-foreground">Accords</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <div className="text-sm text-muted-foreground">Molécules</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">160+</div>
                <div className="text-sm text-muted-foreground">Recettes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">25+</div>
                <div className="text-sm text-muted-foreground">Civilisations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">12+</div>
                <div className="text-sm text-muted-foreground">Installations</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section-spacing">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center content-spacing">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                L'odeur comme médium
              </h2>
              <div className="prose prose-lg mx-auto text-left">
                <p className="text-muted-foreground">
                  Perfumum explore <strong>l'air comme espace</strong>, <strong>le corps comme archive</strong>, et <strong>la matière comme pensée</strong>. Le projet s'inscrit dans une pratique expérimentale inspirée par l'art contemporain, les études olfactives, la muséologie sensorielle, la parfumerie d'auteur et l'anthropologie du sensible.
                </p>
                <p className="text-muted-foreground">
                  Cette recherche-création articule pratique de laboratoire, documentation systématique, recherche théorique et expérimentation artistique pour développer un langage atmosphérique original.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/projet">
                  <Button variant="outline" size="lg">
                    En savoir plus sur le projet
                  </Button>
                </Link>
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
            <nav className="flex gap-6">
              <Link href="/projet">
                <a className="hover:text-foreground transition-colors">Le Projet</a>
              </Link>
              <Link href="/laboratoire">
                <a className="hover:text-foreground transition-colors">Laboratoire</a>
              </Link>
              <Link href="/installations">
                <a className="hover:text-foreground transition-colors">Installations</a>
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
