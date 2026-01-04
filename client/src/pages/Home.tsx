import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Beaker, Droplets, Flame, Globe2, Snowflake, FlaskConical, Database, BarChart3, Microscope } from "lucide-react";
import { MoleculeOfTheDay } from "@/components/MoleculeOfTheDay";
import { RecentActivity } from "@/components/RecentActivity";
import { ResearchNews } from "@/components/ResearchNews";
import { trpc } from "@/lib/trpc";

export default function Home() {
  // Récupérer les statistiques dynamiques depuis l'API
  const { data: stats } = trpc.dashboard.getStats.useQuery();
  
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
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance mb-6 animate-fadeInUp">
                PERFUMUM
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground/90 text-balance mb-2 animate-fadeInUp font-light tracking-wide" style={{animationDelay: '0.05s'}}>
                <Link href="/methodologie/absorbe" className="hover:text-primary transition-colors underline decoration-primary/30 hover:decoration-primary">
                  ABSORBE
                </Link> — laboratoire atmosphérique olfactif basé à Berne
              </p>
              <p className="text-xl md:text-2xl text-muted-foreground/80 text-balance mb-8 animate-fadeInUp font-light italic" style={{animationDelay: '0.1s'}}>
                Laboratoire de recherche olfactive expérimentale — 10 ans d'exploration moléculaire et artistique
              </p>
              
              {/* Texte de contexte explicatif */}
              <div className="max-w-3xl mx-auto mb-12 animate-fadeInUp" style={{animationDelay: '0.15s'}}>
                <p className="text-base md:text-lg text-muted-foreground/90 leading-relaxed text-balance">
                  PERFUMUM est une plateforme de recherche olfactive expérimentale développée sur 10 ans (2025-2035). 
                  Explorez <strong>{stats?.molecules || '...'} molécules documentées</strong>, <strong>{stats?.recettes || '...'} recettes olfactives</strong> et des méthodologies scientifiques 
                  (GC-MS, synergies moléculaires). Les accords créés sont utilisés dans des projets artistiques site-specific 
                  et archivés selon la méthodologie ABSORBE.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.25s'}}>
                <Button size="lg" className="gap-2 btn-enhanced bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg" asChild>
                  <Link href="/gammes">
                    Consulter les gammes
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="btn-enhanced border-2" asChild>
                  <Link href="/dashboard">
                    Accéder au Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Parcours Utilisateur */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Trois parcours pour explorer PERFUMUM</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Choisissez votre point d'entrée selon votre profil : chercheur scientifique, créateur parfumeur ou curieux explorateur.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Parcours Chercheur */}
                <Card className="brutal-border bg-card hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                  <CardHeader className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Microscope className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">Chercheur</CardTitle>
                    <CardDescription className="text-base">Approche scientifique et méthodologique</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <p className="text-sm text-muted-foreground">
                      Accédez aux données moléculaires, méthodologies GC-MS, synergies chimiques et protocoles de recherche validés.
                    </p>
                    <div className="space-y-2">
                      <Link href="/molecules" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → {stats?.molecules || '...'} Molécules documentées
                      </Link>
                      <Link href="/suggestions-synergies" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → Synergies moléculaires
                      </Link>
                      <Link href="/methodologie/absorbe" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → Méthodologie ABSORBE
                      </Link>
                      <Link href="/methodologie/gcms" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → Protocoles GC-MS
                      </Link>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4 group-hover:border-primary" asChild>
                      <Link href="/molecules">
                        Commencer l'exploration <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Parcours Créateur */}
                <Card className="brutal-border bg-card hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
                  <CardHeader className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                      <FlaskConical className="h-8 w-8 text-purple-500" />
                    </div>
                    <CardTitle className="text-2xl group-hover:text-purple-500 transition-colors">Créateur</CardTitle>
                    <CardDescription className="text-base">Outils de formulation et création</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <p className="text-sm text-muted-foreground">
                      Explorez les recettes, utilisez les calculateurs de proportions et découvrez les fournisseurs de matières premières.
                    </p>
                    <div className="space-y-2">
                      <Link href="/recettes" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → 234 Recettes olfactives
                      </Link>
                      <Link href="/calculateur" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → Calculateur de proportions
                      </Link>
                      <Link href="/sourcing" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → Fournisseurs internationaux
                      </Link>
                      <Link href="/outils-formulation" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → Suite d'outils complète
                      </Link>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4 group-hover:border-purple-500" asChild>
                      <Link href="/recettes">
                        Explorer les recettes <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Parcours Curieux */}
                <Card className="brutal-border bg-card hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
                  <CardHeader className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                      <Globe2 className="h-8 w-8 text-amber-500" />
                    </div>
                    <CardTitle className="text-2xl group-hover:text-amber-500 transition-colors">Curieux</CardTitle>
                    <CardDescription className="text-base">Découverte et exploration libre</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <p className="text-sm text-muted-foreground">
                      Découvrez les gammes thématiques, l'histoire du Pétrichor et les traditions olfactives du monde entier.
                    </p>
                    <div className="space-y-2">
                      <Link href="/gammes" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → 8 Gammes thématiques
                      </Link>
                      <Link href="/gammes/petrichor" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → Pétrichor (terre & pluie)
                      </Link>
                      <Link href="/civilisations" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → Traditions olfactives
                      </Link>
                      <Link href="/recherche/fondements-theoriques" className="block text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors">
                        → Philosophie olfactive
                      </Link>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4 group-hover:border-amber-500" asChild>
                      <Link href="/gammes">
                        Découvrir les gammes <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="section-spacing bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Présentation du projet</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="brutal-border bg-card">
                  <CardHeader>
                    <CardTitle>Vision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      <strong>Perfumum est un laboratoire de recherche</strong>, pas une marque commerciale. C'est une plateforme de recherche-création sur 10 ans (2025-2035) dédiée à l'exploration olfactive expérimentale. Le projet articule design terpénique, résines CBD, et variétés de tabacs rares dans une approche scientifique et artistique.
                    </p>
                    <p className="text-muted-foreground">
                      Cette recherche s'inscrit à la croisée de la parfumerie d'auteur, de l'anthropologie du sensible, et de la chimie organique. Les accords créés sont documentés selon la méthodologie ABSORBE et archivés pour usage scientifique et artistique.
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
                        <span>Développer <strong>5 gammes olfactives</strong> conceptuelles (Pétrichor, Volcanique, Traditions Olfactives, Glaciaire, Bio-Lab)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Documenter <strong>{stats?.molecules || '...'} molécules</strong> et leurs synergies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Créer <strong>{stats?.recettes || '...'} recettes</strong> expérimentales (parfums, résines, tabacs)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Documenter les <strong>pratiques olfactives</strong> de 26 traditions culturelles</span>
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
                    <Button variant="outline" size="sm" className="w-full group-hover:border-petrichor" asChild>
                      <Link href="/gammes/petrichor">
                        Consulter <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
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
                    <Button variant="outline" size="sm" className="w-full group-hover:border-volcanique" asChild>
                      <Link href="/gammes/volcanique">
                        Consulter <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Traditions Olfactives */}
                <Card className="brutal-border bg-card hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-solar-mineralis/10 flex items-center justify-center mb-4 group-hover:bg-solar-mineralis/20 transition-colors">
                      <Globe2 className="h-6 w-6 text-solar-mineralis" />
                    </div>
                    <CardTitle className="group-hover:text-solar-mineralis transition-colors">Traditions Olfactives</CardTitle>
                    <CardDescription>Sacré • Culturel • Rituel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Pratiques olfactives rituelles. 26 traditions culturelles documentées (encens, tabacs sacrés, onguents).
                    </p>
                    <Button variant="outline" size="sm" className="w-full group-hover:border-solar-mineralis" asChild>
                      <Link href="/civilisations">
                        Consulter <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
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
                    <Button variant="outline" size="sm" className="w-full group-hover:border-blue-500" asChild>
                      <Link href="/gammes">
                        En développement <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
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
                    <Button variant="outline" size="sm" className="w-full group-hover:border-pink-500" asChild>
                      <Link href="/bio-mineralis">
                        Consulter <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Accès aux données</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Bases de données, visualisations scientifiques et programmes de recherche.
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
                      → {stats?.molecules || '...'} Molécules
                    </Link>
                    <Link href="/recettes" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → {stats?.recettes || '...'} Recettes
                    </Link>
                    <Link href="/accords" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → {stats?.accords || '...'} Accords
                    </Link>
                    <Link href="/prototypes" className="block w-full text-sm py-2 px-3 rounded-md hover:bg-accent transition-colors cursor-pointer">
                      → {stats?.prototypes || '...'} Prototypes
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

        {/* Research News & Discovery Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Actualités de la recherche</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ResearchNews />
                <MoleculeOfTheDay />
                <RecentActivity />
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 molecular-bg">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-center">
              <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm">
                <div className="text-4xl font-bold text-primary mb-2">{stats?.molecules || '...'}</div>
                <div className="text-sm text-muted-foreground">Molécules</div>
              </div>
              <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm">
                <div className="text-4xl font-bold text-primary mb-2">{stats?.recettes || '...'}</div>
                <div className="text-sm text-muted-foreground">Recettes</div>
              </div>
              <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm">
                <div className="text-4xl font-bold text-primary mb-2">{stats?.accords || '...'}</div>
                <div className="text-sm text-muted-foreground">Accords</div>
              </div>
              <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm">
                <div className="text-4xl font-bold text-primary mb-2">{stats?.prototypes || '...'}</div>
                <div className="text-sm text-muted-foreground">Prototypes</div>
              </div>
              <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm">
                <div className="text-4xl font-bold text-primary mb-2">{stats?.civilisations || '...'}</div>
                <div className="text-sm text-muted-foreground">Traditions Olfactives</div>
              </div>
            </div>
          </div>
        </section>
      </main>

    <Footer />

    </div>
  );
}
