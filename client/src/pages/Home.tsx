import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Beaker, Droplets, Flame, Globe2, Snowflake, FlaskConical, Database, BarChart3, Microscope } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-spacing psychedelic-gradient moire-pattern relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="container">
            <div className="max-w-4xl mx-auto text-center content-spacing relative z-10">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance mb-8 animate-fadeInUp">
                PERFUMUM
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground/90 text-balance mb-2 animate-fadeInUp font-light tracking-wide" style={{animationDelay: '0.05s'}}>
                ABSORBE — laboratoire atmosphérique olfactif basé à Berne
              </p>
              <p className="text-2xl md:text-3xl text-muted-foreground text-balance mb-4 animate-fadeInUp font-medium" style={{animationDelay: '0.1s'}}>
                Plateforme de Recherche & Développement
              </p>
              <p className="text-lg md:text-xl text-muted-foreground/80 text-balance mb-12 animate-fadeInUp max-w-2xl mx-auto" style={{animationDelay: '0.2s'}}>
                Design terpénique, résines CBD et variétés de tabacs rares
              </p>
              <div className="flex flex-wrap gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                <Link href="/gammes">
                  <Button size="lg" className="gap-2">
                    Explorer les atmosphères
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    Accéder au Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="section-spacing bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Qu'est-ce que Perfumum ?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="brutal-border bg-card">
                  <CardHeader>
                    <CardTitle>Vision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Perfumum est une <strong>plateforme de recherche-création sur 10 ans (2025-2035)</strong> dédiée à l'exploration olfactive expérimentale. Le projet articule design terpénique, résines CBD, et variétés de tabacs rares dans une approche scientifique et artistique.
                    </p>
                    <p className="text-muted-foreground">
                      Cette recherche s'inscrit à la croisée de la parfumerie d'auteur, de l'anthropologie du sensible, et de la chimie organique.
                    </p>
                  </CardContent>
                </Card>

                <Card className="brutal-border bg-card">
                  <CardHeader>
                    <CardTitle>Objectifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Développer <strong>5 gammes olfactives</strong> conceptuelles (Pétrichor, Volcanique, Civilisations, Glaciaire, Bio-Lab)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Documenter <strong>131 molécules</strong> et leurs synergies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Créer <strong>142 recettes</strong> expérimentales (parfums, résines, tabacs)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Explorer les <strong>pratiques olfactives</strong> de 26 civilisations</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Gammes Perfumeum Section */}
        <section className="section-spacing molecular-bg">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Les 5 Gammes Perfumeum</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Cinq univers olfactifs conceptuels structurant la recherche PERFUMUM, chacun explorant des territoires sensoriels distincts.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Pétrichor */}
                <Card className="brutal-border bg-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-petrichor/10 flex items-center justify-center mb-4 group-hover:bg-petrichor/20 transition-colors">
                      <Droplets className="h-6 w-6 text-petrichor" />
                    </div>
                    <CardTitle className="group-hover:text-petrichor transition-colors">Pétrichor</CardTitle>
                    <CardDescription>Terre • Minéral • Pluie</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Odeur de la terre après la pluie. 60 variations explorant géosmine, argile, pierre mouillée, humus.
                    </p>
                    <Link href="/gammes/petrichor">
                      <Button variant="outline" size="sm" className="w-full group-hover:border-petrichor">
                        Explorer <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Volcanique */}
                <Card className="brutal-border bg-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-volcanique/10 flex items-center justify-center mb-4 group-hover:bg-volcanique/20 transition-colors">
                      <Flame className="h-6 w-6 text-volcanique" />
                    </div>
                    <CardTitle className="group-hover:text-volcanique transition-colors">Volcanique</CardTitle>
                    <CardDescription>Fumée • Pyrolyse • Intensité</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Matières pyrolysées et fumées. 36 variations explorant cendres, résines brûlées, bois carbonisé.
                    </p>
                    <Link href="/gammes/volcanique">
                      <Button variant="outline" size="sm" className="w-full group-hover:border-volcanique">
                        Explorer <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Civilisations */}
                <Card className="brutal-border bg-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-solar-mineralis/10 flex items-center justify-center mb-4 group-hover:bg-solar-mineralis/20 transition-colors">
                      <Globe2 className="h-6 w-6 text-solar-mineralis" />
                    </div>
                    <CardTitle className="group-hover:text-solar-mineralis transition-colors">Civilisations</CardTitle>
                    <CardDescription>Sacré • Culturel • Rituel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Pratiques olfactives rituelles. 26 civilisations documentées (encens, tabacs sacrés, onguents).
                    </p>
                    <Link href="/civilisations">
                      <Button variant="outline" size="sm" className="w-full group-hover:border-solar-mineralis">
                        Explorer <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Glaciaire */}
                <Card className="brutal-border bg-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                      <Snowflake className="h-6 w-6 text-blue-500" />
                    </div>
                    <CardTitle className="group-hover:text-blue-500 transition-colors">Glaciaire</CardTitle>
                    <CardDescription>Fraîcheur • Ozone • Altitude</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Notes fraîches et ozonnées. Air pur, glace, altitude, notes métalliques et minérales froides.
                    </p>
                    <Link href="/gammes">
                      <Button variant="outline" size="sm" className="w-full group-hover:border-blue-500">
                        En développement <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Bio-Lab */}
                <Card className="brutal-border bg-card hover:shadow-lg transition-all duration-300 group md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                      <FlaskConical className="h-6 w-6 text-pink-500" />
                    </div>
                    <CardTitle className="group-hover:text-pink-500 transition-colors">Bio-Lab</CardTitle>
                    <CardDescription>Expérimental • Biotechnologie • Avant-garde</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Recherche expérimentale. BIO-MINERALIS (os, cuir fossilisé), résines CBD, design moléculaire.
                    </p>
                    <Link href="/bio-mineralis">
                      <Button variant="outline" size="sm" className="w-full group-hover:border-pink-500">
                        Explorer <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Exploration Section */}
        <section className="section-spacing bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Explorer les Données</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Accédez aux bases de données, visualisations scientifiques et programmes de recherche.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Données */}
                <Card className="brutal-border bg-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">Base de Données</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/molecules" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → 131 Molécules
                    </Link>
                    <Link href="/recettes" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → 142 Recettes
                    </Link>
                    <Link href="/accords" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → 25 Accords
                    </Link>
                    <Link href="/prototypes" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → 4 Prototypes
                    </Link>
                  </CardContent>
                </Card>

                {/* Recherche Scientifique */}
                <Card className="brutal-border bg-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                      <Microscope className="h-6 w-6 text-purple-500" />
                    </div>
                    <CardTitle className="group-hover:text-purple-500 transition-colors">Recherche Scientifique</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/recherche-scientifique/synergies" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → Synergies Moléculaires
                    </Link>
                    <Link href="/recherche-scientifique/pyrolyse" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → Pyrolyse & Combustion
                    </Link>
                    <Link href="/recherche-scientifique/volatilite" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → Courbes de Volatilité
                    </Link>
                    <Link href="/recherche-scientifique/degradation" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → Dégradation Terpènes
                    </Link>
                  </CardContent>
                </Card>

                {/* Programmes de Recherche */}
                <Card className="brutal-border bg-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                      <BarChart3 className="h-6 w-6 text-green-500" />
                    </div>
                    <CardTitle className="group-hover:text-green-500 transition-colors">Programmes R&D</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/programmes-recherche/resines-cbd" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → Résines CBD & Design Terpénique
                    </Link>
                    <Link href="/programmes-recherche/tabacs-niche" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → Tabacs Niche (30+ variétés)
                    </Link>
                    <Link href="/dashboard" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → Dashboard Analytics
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 molecular-bg">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">131</div>
                <div className="text-sm text-muted-foreground">Molécules</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">142</div>
                <div className="text-sm text-muted-foreground">Recettes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">25</div>
                <div className="text-sm text-muted-foreground">Accords</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">4</div>
                <div className="text-sm text-muted-foreground">Prototypes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">26</div>
                <div className="text-sm text-muted-foreground">Civilisations</div>
              </div>
            </div>
          </div>
        </section>
      </main>

    <Footer />

    </div>
  );
}
