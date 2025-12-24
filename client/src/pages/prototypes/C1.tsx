import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Beaker, ArrowLeft, Lightbulb, Box, Sparkles } from "lucide-react";
import { MoleculeLink } from "@/components/MoleculeLink";
import { CompositionComplete, PrototypeComposition } from "@/components/PrototypeRadarChart";
import { Link } from "wouter";

// Composition du prototype C1
const c1Composition: PrototypeComposition = {
  name: "C1 — FERMENTUM",
  color: "#9333ea", // purple-600
  molecules: [
    { name: "Vetiver", quantity: "0.10 ml", radarIntensity: 75, radarFreshness: 35, radarWarmth: 55, radarSweetness: 20, radarSpiciness: 30, radarEarthiness: 85 },
    { name: "Ambre Gris", quantity: "0.05 ml", radarIntensity: 80, radarFreshness: 25, radarWarmth: 70, radarSweetness: 45, radarSpiciness: 15, radarEarthiness: 60 },
    { name: "Makrut", quantity: "0.08 ml", radarIntensity: 70, radarFreshness: 95, radarWarmth: 15, radarSweetness: 20, radarSpiciness: 25, radarEarthiness: 10 },
    { name: "Mitti Attar", quantity: "0.05 ml", radarIntensity: 60, radarFreshness: 40, radarWarmth: 45, radarSweetness: 15, radarSpiciness: 10, radarEarthiness: 100 },
  ]
};

export default function C1Fermentum() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-950/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/prototypes">
                <Button variant="ghost" size="sm" className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux Prototypes
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center">
                  <Droplets className="h-10 w-10 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    🟣 C1 — FERMENTUM
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Organique, intime, vivant
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">Fermentaire / Organique / Animalité noble</Badge>
                <Badge variant="outline">Base alcool (5 ml)</Badge>
                <Badge variant="outline">Maturation 72h minimum</Badge>
              </div>

              <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed">
                    <strong>C1 Fermentum</strong> explore la <strong>matière vivante en transformation</strong> : fermentation, organicité, animalité noble. Ce prototype interroge les processus biologiques qui produisent des odeurs (décomposition, maturation, métabolisme) et leur dimension phénoménologique : <em>que signifie sentir la vie en train de se transformer ?</em>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Concept Approfondi */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    Concept : Organique, Intime, Vivant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Le prototype <strong>C1 Fermentum</strong> s'inscrit dans une recherche sur <strong>l'organicité du monde</strong> : les odeurs qui émergent des processus biologiques de transformation, de décomposition et de maturation. Il interroge notre rapport à la matière vivante, aux substances organiques en mutation, et aux odeurs que la culture occidentale a souvent rejetées comme "sales" ou "taboues".
                  </p>
                  <p>
                    Cette recherche s'inspire de la philosophie de <strong>Maurice Merleau-Ponty</strong> sur la <em>chair du monde</em> : l'idée que nous sommes tissés de la même matière que le monde, et que nos perceptions olfactives nous mettent en contact direct avec cette matérialité partagée. Sentir une odeur organique, c'est sentir la vie elle-même dans sa dimension la plus intime et la plus troublante.
                  </p>
                  <p>
                    Les molécules choisies évoquent des <strong>états de la matière organique</strong> :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Terre humide</strong> (Mitti Attar) : le pétrichor, l'odeur de la pluie sur la terre sèche, évoque la vie qui renaît</li>
                    <li><strong>Animalité marine</strong> (Ambre Gris) : substance sécrétée par le cachalot, évoque la vie océanique et la transformation biologique</li>
                    <li><strong>Acidité végétale</strong> (Makrut) : zeste de combava, évoque la fermentation lactique et les processus enzymatiques</li>
                    <li><strong>Racine fermentée</strong> (Vetiver) : racine de vétiver, évoque la terre, l'humidité, la décomposition végétale</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-purple-600" />
                    Matières Taboues : Cuir, Indole, Animalité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Le prototype <strong>C1 Fermentum</strong> travaille avec des <strong>matières olfactives taboues</strong> dans la culture occidentale moderne : les odeurs animales, fécales, corporelles, qui évoquent la proximité avec le vivant dans sa dimension la plus crue.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Indole</h4>
                      <p className="text-sm">Présent dans les fleurs (jasmin, tubéreuse) mais aussi dans les fèces. Évoque la dualité beauté/saleté.</p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Skatole</h4>
                      <p className="text-sm">Odeur fécale à haute concentration, mais florale et musquée à faible dose. Paradoxe olfactif.</p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Acides gras</h4>
                      <p className="text-sm">Odeurs de fromage, de sueur, de cuir. Évoquent le corps, la peau, l'intimité.</p>
                    </div>
                  </div>
                  <p>
                    Ces molécules sont utilisées en parfumerie fine pour apporter de la <strong>profondeur, de la chaleur et de la sensualité</strong>. Elles créent une texture <strong>lactonique et charnelle</strong> qui évoque la proximité avec le corps et le vivant.
                  </p>
                  <p>
                    Dans le contexte de <strong>PERFUMUM</strong>, ces matières sont explorées non pas comme des "défauts" à masquer, mais comme des <strong>qualités olfactives à part entière</strong>, porteuses de sens et d'émotion.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Formule */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-8">
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-purple-600" />
                    Formule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Vetiver" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.10 ml</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Ambre Gris" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.05 ml</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Makrut" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.08 ml</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Mitti Attar" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.05 ml</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground">Éthanol 95°</span>
                      <span className="font-mono text-muted-foreground">qsp 5 ml</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Protocole de Fabrication</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-semibold">1.</span>
                      <span>Mélanger les matières premières dans 0.5 ml d'alcool</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">2.</span>
                      <span>Ajouter progressivement le reste d'alcool</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">3.</span>
                      <span>Laisser maturer 72h minimum (idéalement 1 semaine)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">4.</span>
                      <span>Réévaluer après maturation : les notes organiques se fondent et s'arrondissent</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Effet tactile</p>
                      <p className="text-foreground">Lactonique, humide, charnel, enveloppant</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Stabilité</p>
                      <p className="text-foreground">Élevée (animalité + terre + acide)</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Résonance émotionnelle</p>
                      <p className="text-foreground">Intime, troublante, enveloppante, méditative</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Résine CBD signature</Badge>
                    <Badge variant="outline">Installation immersive</Badge>
                    <Badge variant="outline">Accord cœur pour compositions complexes</Badge>
                    <Badge variant="outline">Recherche phénoménologique</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Composition Complète & Profil Olfactif</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompositionComplete 
                    composition={c1Composition}
                    description="Profil terreux-animal avec une fraîcheur acidulée. Dominante organicité (Terreux 88) équilibrée par une pointe de fraîcheur citronnée (Makrut)."
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Installation Conceptuelle */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Installation Conceptuelle : "Chambre de Fermentation"
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    L'installation <strong>"Chambre de Fermentation"</strong> est une pièce immersive qui explore la dimension phénoménologique de la matière organique en transformation. Le visiteur entre dans un espace clos, faiblement éclairé, où l'odeur de <strong>C1 Fermentum</strong> est diffusée en continu.
                  </p>
                  
                  <div className="bg-background p-6 rounded-lg border my-6">
                    <h4 className="font-semibold text-foreground mb-4">Dispositif spatial</h4>
                    <ul className="space-y-2 list-disc list-inside">
                      <li><strong>Espace</strong> : Pièce de 3m × 3m × 2.5m, murs en béton brut</li>
                      <li><strong>Lumière</strong> : Éclairage indirect tamisé (50 lux), couleur ambrée</li>
                      <li><strong>Sol</strong> : Terre battue ou béton ciré, légèrement humide</li>
                      <li><strong>Diffusion</strong> : Diffuseurs ultrasoniques dissimulés dans les angles, diffusion continue à faible intensité</li>
                      <li><strong>Son</strong> : Silence ou bruit blanc très doux (respiration, battements de cœur)</li>
                    </ul>
                  </div>

                  <div className="bg-background p-6 rounded-lg border my-6">
                    <h4 className="font-semibold text-foreground mb-4">Expérience sensorielle</h4>
                    <p className="mb-4">
                      Le visiteur est invité à <strong>rester immobile</strong> pendant 5 à 10 minutes dans cet espace. L'odeur de <strong>C1 Fermentum</strong> se déploie progressivement, révélant ses différentes facettes :
                    </p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li><strong>0-2 min</strong> : Perception de la terre humide (Mitti Attar), sensation de fraîcheur minérale</li>
                      <li><strong>2-5 min</strong> : Émergence de l'animalité marine (Ambre Gris), sensation de chaleur enveloppante</li>
                      <li><strong>5-10 min</strong> : Fusion des notes, texture lactonique et charnelle, sensation d'intimité avec la matière</li>
                    </ul>
                  </div>

                  <div className="bg-background p-6 rounded-lg border my-6">
                    <h4 className="font-semibold text-foreground mb-4">Intention artistique</h4>
                    <p>
                      L'installation vise à créer une <strong>expérience phénoménologique</strong> de la matière organique en transformation. Elle interroge notre rapport au vivant, à la décomposition, à la fermentation, et aux odeurs que la culture occidentale a souvent rejetées.
                    </p>
                    <p className="mt-4">
                      En restant immobile dans cet espace, le visiteur est invité à <strong>accueillir</strong> ces odeurs, à les laisser pénétrer son corps, à observer les sensations qu'elles provoquent. L'installation crée un espace de <strong>méditation olfactive</strong> où le visiteur peut explorer sa propre relation à la matière vivante.
                    </p>
                  </div>

                  <p>
                    Cette installation a été présentée pour la première fois en 2024 dans le cadre du projet <strong>ABSORBE</strong> à Berne, Suisse. Elle s'inscrit dans une série d'installations olfactives qui explorent les <strong>atmosphères</strong> et les <strong>lieux</strong> à travers l'odorat.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Axe Philosophique */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>Axe Philosophique & Phénoménologique</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <p>
                    Le prototype <strong>C1 Fermentum</strong> s'inscrit dans une recherche phénoménologique sur <strong>la perception olfactive de la matière vivante</strong>. Il interroge les questions suivantes :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Que signifie <strong>sentir la vie</strong> en train de se transformer ?</li>
                    <li>Comment les odeurs organiques nous mettent-elles en contact avec notre propre <strong>corporéité</strong> ?</li>
                    <li>Pourquoi certaines odeurs (fécales, animales, corporelles) sont-elles considérées comme <strong>taboues</strong> dans la culture occidentale ?</li>
                    <li>Comment la parfumerie peut-elle <strong>réhabiliter</strong> ces odeurs et leur donner une dimension esthétique ?</li>
                  </ul>
                  <p>
                    Cette recherche s'inspire des travaux de <strong>Maurice Merleau-Ponty</strong> sur la <em>chair du monde</em>, de <strong>Georges Bataille</strong> sur l'<em>informe</em> et le <em>bas matérialisme</em>, et de <strong>Julia Kristeva</strong> sur l'<em>abject</em>. Elle explore la dimension <strong>troublante</strong> et <strong>fascinante</strong> des odeurs organiques, qui nous rappellent que nous sommes des êtres vivants, mortels, inscrits dans la matière.
                  </p>
                  <p>
                    Le prototype <strong>C1 Fermentum</strong> est destiné à des <strong>installations immersives</strong> qui interrogent la relation au corps, à la matière organique, et aux processus de transformation. Il peut aussi servir d'<strong>accord cœur</strong> pour des compositions plus complexes qui nécessitent une base animalière et terreuse.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
