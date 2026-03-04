// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function Installations() {
  const diffusionModes = [
    {
      name: "Cônes",
      description: "Combustion lente de compositions compactées. Diffusion verticale, fumée visible, temporalité rituelle.",
      characteristics: ["Visibilité", "Rituel", "Lenteur"],
    },
    {
      name: "Brume",
      description: "Diffusion par nébulisation ultrasonique. Atmosphère vaporeuse, diffusion homogène, texture aérienne.",
      characteristics: ["Homogénéité", "Légèreté", "Enveloppement"],
    },
    {
      name: "Plaque Chauffée",
      description: "Évaporation douce sur surface chaude. Contrôle précis de l'intensité, diffusion progressive.",
      characteristics: ["Contrôle", "Progression", "Subtilité"],
    },
    {
      name: "Eau",
      description: "Diffusion par contact aqueux. Texture humide, évaporation naturelle, temporalité longue.",
      characteristics: ["Humidité", "Naturalité", "Durée"],
    },
    {
      name: "Friction",
      description: "Libération par frottement. Activation corporelle, diffusion localisée, interaction tactile.",
      characteristics: ["Corporalité", "Localisation", "Activation"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Installations
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Dispositifs d'expérience transformant l'espace en environnement sensoriel immersif
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Les installations olfactives constituent le <strong>volet artistique</strong> du projet Perfumum. Elles transforment les compositions développées en laboratoire en <strong>dispositifs d'expérience</strong> qui configurent l'espace, le temps et la perception. L'installation devient le lieu d'une enquête sensible où le visiteur expérimente directement les hypothèses de recherche.
              </p>
            </div>

            {/* Concept */}
            <div className="max-w-4xl mx-auto mb-16">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">L'Odeur comme Dispositif Spatial</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Contrairement aux médiums visuels ou sonores, <strong>l'odeur ne se laisse pas cadrer</strong>. Elle diffuse, se propage, envahit l'espace de manière incontrôlable. Cette qualité atmosphérique fait de l'odeur un médium idéal pour explorer les notions d'<strong>immersion, d'enveloppement et de présence</strong>.
                  </p>
                  <p className="leading-relaxed">
                    Les installations olfactives de Perfumum explorent cette spécificité : comment l'odeur configure-t-elle l'espace d'exposition ? Comment transforme-t-elle la relation du visiteur à l'environnement ? Comment crée-t-elle des <strong>zones atmosphériques</strong> qui modifient la perception et l'attention ?
                  </p>
                  <blockquote className="border-l-4 border-primary pl-6 py-4 my-6 italic">
                    "L'installation olfactive ne montre pas une odeur, elle crée un espace olfactif."
                  </blockquote>
                </CardContent>
              </Card>
            </div>

            {/* Diffusion Modes */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Modes de Diffusion
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Le mode de diffusion n'est pas un simple détail technique mais une <strong>décision artistique</strong> qui influence radicalement l'expérience. Chaque mode produit une temporalité, une spatialité et une texture atmosphérique spécifiques.
              </p>
              <div className="grid gap-6">
                {diffusionModes.map((mode, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{mode.name}</CardTitle>
                          <CardDescription>{mode.description}</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-1.5 shrink-0">
                          {mode.characteristics.map((char, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dimensions */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Dimensions de l'Expérience
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Spatialité</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Comment l'odeur configure-t-elle l'espace ? Elle ne crée pas de limites visuelles mais des <strong>zones atmosphériques</strong> qui modifient la perception de la distance, de la proximité et de l'échelle. L'espace devient fluide, mouvant, poreux.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Temporalité</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    L'odeur impose sa propre temporalité : diffusion progressive, persistance, évaporation. Le visiteur ne peut pas accélérer ou ralentir cette temporalité. Il doit <strong>s'ajuster au rythme de l'odeur</strong>, accepter sa lenteur ou sa fugacité.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Corporalité</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    L'odeur pénètre le corps par la respiration. Elle ne reste pas à distance comme l'image ou le son mais <strong>s'incorpore littéralement</strong>. Cette dimension corporelle fait de l'expérience olfactive une expérience intime, viscérale, parfois troublante.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mémoire</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    L'odeur active des mémoires involontaires, des associations inconscientes. Elle court-circuite la pensée conceptuelle pour toucher directement <strong>l'expérience vécue</strong>. Cette dimension mémorielle fait de l'installation olfactive un dispositif d'exploration de la mémoire sensible.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Documentation et Archive
              </h2>
              <Card>
                <CardContent className="pt-6 space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Comment documenter une expérience olfactive ? L'odeur ne se photographie pas, ne s'enregistre pas. La documentation des installations olfactives pose donc des <strong>défis méthodologiques spécifiques</strong>.
                  </p>
                  <p className="leading-relaxed">
                    Perfumum développe un protocole de documentation multi-modal :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Photographies</strong> de l'espace et des dispositifs de diffusion</li>
                    <li><strong>Schémas</strong> de la configuration spatiale et des flux olfactifs</li>
                    <li><strong>Descriptions textuelles</strong> des compositions utilisées</li>
                    <li><strong>Témoignages</strong> de visiteurs sur leur expérience</li>
                    <li><strong>Échantillons</strong> des compositions conservés en archive</li>
                    <li><strong>Notes de régie</strong> sur les paramètres techniques de diffusion</li>
                  </ul>
                  <p className="leading-relaxed">
                    Cette documentation constitue une <strong>archive sensible</strong> permettant de retracer l'évolution du projet et de transmettre les connaissances accumulées.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">
                Données Actuelles
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">12+</div>
                  <div className="text-sm text-muted-foreground">Installations Documentées</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">5</div>
                  <div className="text-sm text-muted-foreground">Modes de Diffusion</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">Lieux d'Exposition</div>
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
    <Footer />

    </div>
  );
}
