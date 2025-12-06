import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, GraduationCap } from "lucide-react";

export default function APropos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                À Propos
              </h1>
              <p className="text-xl text-muted-foreground">
                PERFUMUM / ABSORBE — Recherche olfactive expérimentale basée à Berne, Suisse
              </p>
            </div>
          </div>
        </section>

        {/* ABSORBE */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">ABSORBE</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>ABSORBE</strong> est un laboratoire atmosphérique olfactif fondé en 2020 à Berne. 
                    Il développe une méthode de recherche-création qui articule parfumerie d'auteur, chimie organique 
                    et anthropologie du sensible.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    L'approche ABSORBE ne vise pas la création de produits finis, mais l'exploration d'<strong>atmosphères olfactives</strong> : 
                    des environnements sensoriels habitables, documentés avec rigueur scientifique et restitués sous forme d'installations, 
                    de performances ou de créations olfactives expérimentales.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    La méthode repose sur 7 axes de captation : Air, Lieu, Odeur, Fumé, Son, Image, Texte. 
                    Chaque projet terrain suit ce protocole pour garantir une documentation complète et reproductible.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">PERFUMUM</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>PERFUMUM</strong> est la plateforme de recherche décennale (2025-2035) développée par ABSORBE. 
                    Elle structure l'exploration olfactive autour de 5 gammes atmosphériques : Pétrichor, Volcanique, Traditions Olfactives, 
                    Glaciaire, Bio-Lab.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Le projet documente 131 molécules olfactives, 142 recettes expérimentales, 26 traditions olfactives et leurs pratiques 
                    culturelles, ainsi que 4 prototypes atmosphériques. Cette base de données constitue un outil de recherche 
                    scientifique et artistique unique.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    PERFUMUM s'inscrit dans une démarche de <strong>recherche académique</strong> orientée vers un master 
                    puis un doctorat en anthropologie du sensible et design olfactif.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <CardTitle>Localisation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Berne, Suisse
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Laboratoire ABSORBE — Espace de recherche et d'expérimentation olfactive
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <CardTitle>Orientation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Recherche académique
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Master (2026-2028) • Doctorat (2028-2032)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Collaborations
              </h2>
              <p className="text-muted-foreground mb-6">
                ABSORBE / PERFUMUM est ouvert aux collaborations artistiques, scientifiques et institutionnelles. 
                Les projets peuvent prendre la forme d'installations, de performances, de recherches académiques, 
                ou de créations olfactives sur mesure.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Nous contacter →
              </a>
            </div>
          </div>
        </section>
      </main>
    <Footer />

    </div>
  );
}
