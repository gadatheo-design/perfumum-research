import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, GraduationCap, Beaker, BookOpen, Users, Calendar } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function APropos() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: absorbeRef, isVisible: absorbeVisible } = useScrollAnimation();
  const { ref: perfumumRef, isVisible: perfumumVisible } = useScrollAnimation();
  const { ref: infoRef, isVisible: infoVisible } = useScrollAnimation();
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full mb-6 border border-primary/20">
                <Beaker className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Recherche Olfactive</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                À Propos
              </h1>
              
              <p className="text-lg text-muted-foreground mb-2">
                PERFUMUM / ABSORBE — Laboratoire atmosphérique olfactif
              </p>
              
              <p className="text-muted-foreground">
                Basé à Berne, Suisse — Recherche expérimentale depuis 2020
              </p>
            </div>
          </div>
        </section>

        {/* ABSORBE Section */}
        <div ref={absorbeRef} className="py-20 bg-gradient-to-b from-background to-muted/10">
          <div className="container">
            <div className={`max-w-4xl mx-auto transition-all duration-700 delay-100 ${absorbeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Card className="brutal-border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Beaker className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl">ABSORBE</CardTitle>
                      <p className="text-sm text-muted-foreground">Laboratoire atmosphérique olfactif</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    <strong className="text-foreground">ABSORBE</strong> est un laboratoire atmosphérique olfactif fondé en 2020 à Berne. 
                    Il développe une méthode de recherche-création qui articule parfumerie d'auteur, chimie organique 
                    et anthropologie du sensible.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    L'approche ABSORBE ne vise pas la création de produits finis, mais l'exploration d'<strong className="text-foreground">atmosphères olfactives</strong> : 
                    des environnements sensoriels habitables, documentés avec rigueur scientifique et restitués sous forme d'installations, 
                    de performances ou de créations olfactives expérimentales.
                  </p>
                  
                  <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
                    <h4 className="font-semibold mb-3 text-foreground">Les 7 axes de captation</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                      {['Air', 'Lieu', 'Odeur', 'Fumé', 'Son', 'Image', 'Texte'].map((axe, i) => (
                        <div key={axe} className="text-center p-3 bg-background rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                          <span className="text-xs text-muted-foreground block mb-1">0{i + 1}</span>
                          <span className="font-medium text-sm">{axe}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* PERFUMUM Section */}
        <div ref={perfumumRef} className="py-20 bg-muted/20">
          <div className="container">
            <div className={`max-w-4xl mx-auto transition-all duration-700 delay-100 ${perfumumVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Card className="brutal-border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <BookOpen className="h-7 w-7 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl">PERFUMUM</CardTitle>
                      <p className="text-sm text-muted-foreground">Plateforme de recherche décennale</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    <strong className="text-foreground">PERFUMUM</strong> est la plateforme de recherche décennale (2025-2035) développée par ABSORBE. 
                    Elle structure l'exploration olfactive autour de 5 gammes atmosphériques.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { name: 'Pétrichor', color: 'bg-gamme-petrichor' },
                      { name: 'Volcanique', color: 'bg-gamme-volcanique' },
                      { name: 'Civilisations', color: 'bg-gamme-civilisations' },
                      { name: 'Glaciaire', color: 'bg-gamme-glaciaire' },
                      { name: 'Bio-Lab', color: 'bg-gamme-biolab' }
                    ].map((gamme) => (
                      <div key={gamme.name} className="text-center p-3 bg-background rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                        <div className={`w-4 h-4 ${gamme.color} rounded-full mx-auto mb-2`}></div>
                        <span className="font-medium text-xs">{gamme.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    Le projet documente des centaines de molécules olfactives, recettes expérimentales, traditions olfactives et leurs pratiques 
                    culturelles, ainsi que des prototypes atmosphériques. Cette base de données constitue un outil de recherche 
                    scientifique et artistique unique.
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-4 border border-border/50">
                    <GraduationCap className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>
                      PERFUMUM s'inscrit dans une démarche de <strong className="text-foreground">recherche académique</strong> orientée vers un master 
                      puis un doctorat en anthropologie du sensible et design olfactif.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div ref={infoRef} className="py-20">
          <div className="container">
            <div className={`max-w-4xl mx-auto transition-all duration-700 delay-100 ${infoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="brutal-border hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Localisation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-foreground mb-1">Berne, Suisse</p>
                    <p className="text-sm text-muted-foreground">
                      Laboratoire ABSORBE — Espace de recherche et d'expérimentation olfactive
                    </p>
                  </CardContent>
                </Card>

                <Card className="brutal-border hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                        <GraduationCap className="h-5 w-5 text-purple-500" />
                      </div>
                      <CardTitle className="text-lg">Orientation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-foreground mb-1">Recherche académique</p>
                    <p className="text-sm text-muted-foreground">
                      Master (2026-2028) • Doctorat (2028-2032)
                    </p>
                  </CardContent>
                </Card>

                <Card className="brutal-border hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                        <Calendar className="h-5 w-5 text-amber-500" />
                      </div>
                      <CardTitle className="text-lg">Durée</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-foreground mb-1">10 ans (2025-2035)</p>
                    <p className="text-sm text-muted-foreground">
                      Projet de recherche long terme avec documentation continue
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div ref={contactRef} className="py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container relative z-10">
            <div className={`max-w-2xl mx-auto text-center transition-all duration-700 delay-100 ${contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Collaborations
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                ABSORBE / PERFUMUM est ouvert aux collaborations artistiques, scientifiques et institutionnelles. 
                Les projets peuvent prendre la forme d'installations, de performances, de recherches académiques, 
                ou de créations olfactives sur mesure.
              </p>
              
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Nous contacter
                <span className="ml-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
