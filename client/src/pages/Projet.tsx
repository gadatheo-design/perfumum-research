import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Projet() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Le Projet PERFUMUM
              </h1>
              <p className="text-xl text-muted-foreground">
                Une recherche-création olfactive à l'intersection de l'art, de l'anthropologie et de la phénoménologie
              </p>
            </div>
          </div>
        </section>

        {/* Introduction & Manifeste */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-3xl">Introduction</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Perfumum</strong> est un projet de recherche-création qui explore l'odeur comme médium artistique, forme sensible et dispositif d'expérience. Le projet articule pratique de laboratoire, documentation systématique, recherche théorique et expérimentation artistique pour développer un langage atmosphérique original.
                  </p>
                  <blockquote className="border-l-4 border-primary pl-6 py-4 my-6 italic">
                    "Perfumum n'est pas un projet d'art qui utilise l'odeur : Perfumum est une pensée artistique dont l'odeur est le médium."
                  </blockquote>
                  <p className="text-muted-foreground leading-relaxed">
                    Cette recherche s'inscrit dans une pratique expérimentale inspirée par l'art contemporain, les études olfactives, la muséologie sensorielle, la parfumerie d'auteur et l'anthropologie du sensible. Elle explore <strong>l'air comme espace</strong>, <strong>le corps comme archive</strong>, et <strong>la matière comme pensée</strong>.
                  </p>
                </CardContent>
              </Card>

              <Separator className="my-12" />

              {/* Axes de recherche */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-8">Axes de Recherche</h2>
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>1. Phénoménologie de l'Olfaction</CardTitle>
                      <CardDescription>L'expérience sensible de l'odeur</CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      Exploration de l'odeur comme phénomène perceptif immédiat, pré-réflexif et atmosphérique. Comment l'odeur configure-t-elle l'espace vécu, la temporalité et la présence corporelle ?
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>2. Anthropologie Olfactive</CardTitle>
                      <CardDescription>Cultures et pratiques odorantes</CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      Étude des systèmes olfactifs dans différentes cultures (Royal Mossi, civilisations antiques, pratiques rituelles). Comment les sociétés construisent-elles des univers de sens à travers les odeurs ?
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>3. Chimie Atmosphérique</CardTitle>
                      <CardDescription>Matérialité et composition</CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      Analyse moléculaire des matières premières, étude des interactions chimiques et développement de familles olfactives originales (Bio-Mineralis, Pétrichor, Volcanique, Solar-Mineralis).
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>4. Dispositifs d'Expérience</CardTitle>
                      <CardDescription>Installations et formes de diffusion</CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      Conception d'installations olfactives qui transforment l'espace d'exposition en environnement sensoriel immersif. Exploration de différents modes de diffusion : cônes, brume, plaques chauffées, eau, friction.
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator className="my-12" />

              {/* Méthodologie */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-8">Méthodologie</h2>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Pratique de Laboratoire</h3>
                        <p className="text-muted-foreground">
                          Formulation systématique de compositions olfactives à partir d'une base de données de matières premières (huiles essentielles, absolus, résinoïdes, molécules isolées). Documentation précise des proportions, protocoles et résultats.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">Recherche Théorique</h3>
                        <p className="text-muted-foreground">
                          Articulation entre pratique artistique et corpus théorique (phénoménologie, anthropologie sensorielle, études olfactives, muséologie). Construction d'un cadre conceptuel pour penser l'odeur comme forme artistique.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">Documentation Systématique</h3>
                        <p className="text-muted-foreground">
                          Archivage structuré de toutes les données du projet : compositions, analyses moléculaires, notes de recherche, références bibliographiques, documentation d'installations. Cette base de données constitue à la fois un outil de travail et une œuvre en soi.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">Expérimentation Artistique</h3>
                        <p className="text-muted-foreground">
                          Création d'installations, de dispositifs de diffusion et d'expériences olfactives qui testent les hypothèses de recherche dans des contextes d'exposition. L'œuvre devient le lieu d'une enquête sensible.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-12" />

              {/* Temporalité */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Un Projet au Long Cours</h2>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Perfumum est conçu comme un projet de recherche sur 10 ans (2025-2035), permettant une maturation lente et une accumulation progressive de connaissances. Cette temporalité longue est essentielle pour :
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>Développer une expertise approfondie en formulation olfactive</li>
                      <li>Construire un corpus théorique solide</li>
                      <li>Expérimenter différents dispositifs d'exposition</li>
                      <li>Documenter l'évolution des compositions dans le temps</li>
                      <li>Établir des collaborations durables avec des institutions culturelles et scientifiques</li>
                    </ul>
                  </CardContent>
                </Card>
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
    <Footer />

    </div>
  );
}
