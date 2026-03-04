// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Beaker, ArrowLeft, Lightbulb, Box, Sparkles } from "lucide-react";
import { MoleculeLink } from "@/components/MoleculeLink";
import { CompositionComplete, PrototypeComposition } from "@/components/PrototypeRadarChart";
import { Link } from "wouter";

// Composition du prototype C3
const c3Composition: PrototypeComposition = {
  name: "C3 — LACTA SOLIS",
  color: "#ca8a04", // yellow-600
  molecules: [
    { name: "Frangipani", quantity: "0.6 ml", radarIntensity: 80, radarFreshness: 45, radarWarmth: 60, radarSweetness: 85, radarSpiciness: 10, radarEarthiness: 15 },
    { name: "Neroli", quantity: "0.08 ml", radarIntensity: 70, radarFreshness: 75, radarWarmth: 40, radarSweetness: 65, radarSpiciness: 5, radarEarthiness: 10 },
  ]
};

export default function C3LactaSolis() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-yellow-50/50 to-background dark:from-yellow-950/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/prototypes">
                <Button variant="ghost" size="sm" className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux Prototypes
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg bg-yellow-50 dark:bg-yellow-950/50 flex items-center justify-center">
                  <Sun className="h-10 w-10 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    🌞 C3 — LACTA SOLIS
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Douceur solaire, peau, tendresse
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">Floral solaire / Lactonique / Peau chaude</Badge>
                <Badge variant="outline">Huile (10 ml)</Badge>
                <Badge variant="outline">Maturation 5-7 jours</Badge>
              </div>

              <Card className="bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed">
                    <strong>C3 Lacta Solis</strong> explore la <strong>lumière, la douceur, et la mémoire</strong> : chaleur solaire, texture lactée, intimité de la peau. Ce prototype interroge les odeurs qui évoquent le <strong>réconfort, la proximité corporelle, et la nostalgie</strong> : <em>que signifie une odeur "solaire" ? Comment traduire la sensation de chaleur douce en composition olfactive ?</em>
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
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Concept : Douceur Solaire, Peau, Tendresse
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Le prototype <strong>C3 Lacta Solis</strong> s'inscrit dans une recherche sur <strong>la douceur solaire et la mémoire olfactive</strong> : les odeurs qui évoquent la chaleur, la peau, le réconfort, et les souvenirs d'enfance. Il explore les <strong>notes lactées</strong> en parfumerie, ces molécules qui évoquent le lait, la crème, la peau chaude, et qui créent une sensation de <strong>proximité corporelle</strong>.
                  </p>
                  <p>
                    Cette recherche s'inspire de la philosophie de <strong>Marcel Proust</strong> sur la <em>mémoire involontaire</em> : l'idée que certaines odeurs peuvent déclencher des souvenirs enfouis, des émotions oubliées, des sensations de l'enfance. Les notes lactées sont des odeurs qui évoquent la <strong>première relation</strong> (mère-enfant), la <strong>sécurité</strong>, le <strong>réconfort</strong>.
                  </p>
                  <p>
                    Les molécules choisies évoquent des <strong>paysages tropicaux et des souvenirs solaires</strong> :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Frangipani</strong> (Plumeria) : fleur tropicale crémeuse, évoque la peau chaude, la douceur, le lait de coco</li>
                    <li><strong>Neroli</strong> (Fleur d'oranger) : fleur blanche acidulée, évoque la lumière, la fraîcheur, la joie</li>
                  </ul>
                  <p>
                    La combinaison de ces deux ingrédients crée une <strong>texture florale lactée</strong> : le frangipani apporte une base crémeuse et enveloppante, le neroli apporte une note de tête lumineuse et acidulée. Cette architecture olfactive évoque la <strong>peau chaude au soleil</strong>, les fleurs tropicales, et la douceur des souvenirs d'enfance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-yellow-600" />
                    Recherche sur les Lactones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Les <strong>lactones</strong> sont des molécules cycliques qui évoquent des odeurs <strong>crémeuses, lactées, fruitées</strong>. Elles sont présentes dans de nombreuses matières premières naturelles (pêche, abricot, noix de coco, lait) et sont utilisées en parfumerie pour créer des textures <strong>douces et enveloppantes</strong>.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">γ-Nonalactone (Gamma-Nonalactone)</h4>
                      <p className="text-sm mb-2">Odeur de <strong>pêche, abricot, noix de coco</strong>.</p>
                      <p className="text-sm"><strong>Profil</strong> : crémeux, lacté, fruité, doux</p>
                      <p className="text-sm mt-2"><strong>Usage</strong> : note de cœur, évoque la peau chaude, les fruits tropicaux</p>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">δ-Decalactone (Delta-Decalactone)</h4>
                      <p className="text-sm mb-2">Odeur de <strong>pêche, crème, beurre</strong>.</p>
                      <p className="text-sm"><strong>Profil</strong> : lacté intense, crémeux, beurré</p>
                      <p className="text-sm mt-2"><strong>Usage</strong> : note de cœur, évoque la crème, le lait, la douceur</p>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">γ-Undecalactone (Gamma-Undecalactone)</h4>
                      <p className="text-sm mb-2">Odeur de <strong>pêche mûre, lait de coco</strong>.</p>
                      <p className="text-sm"><strong>Profil</strong> : lacté, fruité, tropical</p>
                      <p className="text-sm mt-2"><strong>Usage</strong> : note de cœur, évoque les tropiques, la chaleur</p>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Massoia Lactone</h4>
                      <p className="text-sm mb-2">Extrait de l'écorce de <em>Cryptocarya massoia</em>.</p>
                      <p className="text-sm"><strong>Profil</strong> : noix de coco, crème, boisé doux</p>
                      <p className="text-sm mt-2"><strong>Usage</strong> : note de cœur/fond, évoque la peau, la chaleur tropicale</p>
                    </div>
                  </div>

                  <p>
                    Dans <strong>C3 Lacta Solis</strong>, nous n'avons pas utilisé de lactones synthétiques pures, mais des <strong>matières premières naturelles riches en lactones</strong> : le frangipani (plumeria) contient naturellement des lactones qui lui donnent sa texture crémeuse et enveloppante. Cette approche crée une <strong>douceur lactée naturelle</strong> plutôt qu'une note lactée synthétique.
                  </p>
                  <p>
                    Le <strong>neroli</strong> (fleur d'oranger) apporte une dimension <strong>acidulée et lumineuse</strong> qui équilibre la douceur lactée du frangipani. Cette combinaison crée une texture <strong>florale-lactée</strong> qui évoque la peau chaude, le lait de fleur, et la douceur solaire.
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
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-yellow-600" />
                    Formule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Frangipani" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.6 ml (6%)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Neroli" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.08 ml (0.8%)</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground">Base MCT (huile de coco fractionnée)</span>
                      <span className="font-mono text-muted-foreground">qsp 10 ml</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    <strong>Note</strong> : La base MCT (Medium Chain Triglycerides) est une huile neutre, inodore, qui ne rancit pas. Elle permet une diffusion lente et prolongée des molécules olfactives sur la peau.
                  </p>
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
                      <span>Mélanger les deux floraux (Frangipani + Neroli) dans 1 ml de MCT</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">2.</span>
                      <span>Homogénéiser pendant 2 minutes (agitation douce)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">3.</span>
                      <span>Ajouter le reste de MCT progressivement</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">4.</span>
                      <span>Laisser maturer 5-7 jours à température ambiante (transformation florale, arrondi des notes)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">5.</span>
                      <span>Réévaluer après maturation : la texture devient plus crémeuse, les notes florales se fondent</span>
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
                      <p className="text-foreground">Crémeux, enveloppant, chaleureux, soyeux</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Stabilité</p>
                      <p className="text-foreground">Très élevée (huile + floraux, pas d'oxydation)</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Résonance émotionnelle</p>
                      <p className="text-foreground">Apaisante, intime, solaire, nostalgique</p>
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
                    <Badge variant="outline">Huile corporelle</Badge>
                    <Badge variant="outline">Parfum de peau</Badge>
                    <Badge variant="outline">Installation textile olfactive</Badge>
                    <Badge variant="outline">Massage / Bien-être</Badge>
                    <Badge variant="outline">Rituel solaire</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Composition Complète & Profil Olfactif</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompositionComplete 
                    composition={c3Composition}
                    description="Profil floral-lactonique doux et solaire. Dominante Douceur (75) équilibrée par Fraîcheur (60) et Chaleur (50). Texture crémeuse et enveloppante."
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
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                    Installation Conceptuelle : "Peau de Lumière"
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    L'installation <strong>"Peau de Lumière"</strong> est une pièce immersive qui explore la dimension phénoménologique de la <strong>douceur solaire et de la mémoire corporelle</strong>. Le visiteur entre dans un espace textile, éclairé par une lumière dorée diffuse, où l'odeur de <strong>C3 Lacta Solis</strong> est imprégnée dans les tissus.
                  </p>
                  
                  <div className="bg-background p-6 rounded-lg border my-6">
                    <h4 className="font-semibold text-foreground mb-4">Dispositif spatial</h4>
                    <ul className="space-y-2 list-disc list-inside">
                      <li><strong>Espace</strong> : Pièce de 4m × 4m × 3m, entièrement recouverte de tissus blancs (voiles, draps, coussins)</li>
                      <li><strong>Lumière</strong> : Éclairage LED doré (2700K) diffus, intensité douce (100-150 lux)</li>
                      <li><strong>Sol</strong> : Tapis moelleux ou matelas, invitation à s'allonger</li>
                      <li><strong>Diffusion</strong> : Tissus imprégnés de C3 Lacta Solis (10 ml par m²), diffusion passive par contact</li>
                      <li><strong>Son</strong> : Silence ou sons naturels très doux (vagues, respiration, battements de cœur)</li>
                    </ul>
                  </div>

                  <div className="bg-background p-6 rounded-lg border my-6">
                    <h4 className="font-semibold text-foreground mb-4">Expérience sensorielle</h4>
                    <p className="mb-4">
                      Le visiteur est invité à <strong>s'allonger</strong> dans cet espace textile pendant 10 à 15 minutes. L'odeur de <strong>C3 Lacta Solis</strong> se déploie progressivement au contact des tissus, créant une sensation de <strong>proximité corporelle</strong> :
                    </p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li><strong>0-3 min</strong> : Perception de la note florale (Neroli), sensation de fraîcheur lumineuse</li>
                      <li><strong>3-8 min</strong> : Émergence de la note lactée (Frangipani), sensation de chaleur enveloppante</li>
                      <li><strong>8-15 min</strong> : Fusion des notes, texture crémeuse et solaire, sensation de réconfort et de nostalgie</li>
                    </ul>
                    <p className="mt-4">
                      L'odeur se diffuse lentement depuis les tissus, créant une <strong>intimité olfactive</strong> : le visiteur est enveloppé par l'odeur, comme par une peau, une couverture, une présence.
                    </p>
                  </div>

                  <div className="bg-background p-6 rounded-lg border my-6">
                    <h4 className="font-semibold text-foreground mb-4">Intention artistique</h4>
                    <p>
                      L'installation vise à créer une <strong>expérience phénoménologique de la douceur et de la mémoire corporelle</strong>. Elle interroge notre rapport à la <strong>peau, au toucher, au réconfort</strong>. En s'allongeant dans cet espace textile, le visiteur est invité à <strong>se laisser envelopper</strong> par l'odeur, à retrouver des sensations d'enfance, de sécurité, de proximité.
                    </p>
                    <p className="mt-4">
                      Cette installation s'inspire des <strong>espaces de soin</strong> (berceaux, lits, cocons) qui utilisent le textile et l'odeur pour créer une sensation de <strong>protection et de réconfort</strong>. Ici, c'est l'odeur qui crée ce réconfort, qui invite le visiteur à <strong>se reposer</strong>, à <strong>se souvenir</strong>, à <strong>se laisser aller</strong>.
                    </p>
                  </div>

                  <p>
                    Cette installation a été conçue en 2024 dans le cadre du projet <strong>PERFUMUM</strong>. Elle s'inscrit dans une série d'installations olfactives qui explorent les <strong>mémoires sensorielles</strong> et les <strong>espaces de soin</strong>.
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
                    Le prototype <strong>C3 Lacta Solis</strong> s'inscrit dans une recherche phénoménologique sur <strong>la perception olfactive de la douceur et de la mémoire corporelle</strong>. Il interroge les questions suivantes :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Que signifie une odeur <strong>"solaire"</strong> ou <strong>"lactée"</strong> ?</li>
                    <li>Comment les odeurs peuvent-elles évoquer la <strong>peau, le toucher, la proximité corporelle</strong> ?</li>
                    <li>Quel est le rapport entre <strong>odeur</strong> et <strong>mémoire</strong> dans notre expérience sensorielle ?</li>
                    <li>Comment la parfumerie peut-elle créer des <strong>espaces de réconfort</strong> et de <strong>soin</strong> ?</li>
                  </ul>
                  <p>
                    Cette recherche s'inspire des travaux de <strong>Marcel Proust</strong> sur la <em>mémoire involontaire</em>, de <strong>Didier Anzieu</strong> sur le <em>Moi-peau</em>, et de <strong>Constance Classen</strong> sur l'<em>anthropologie sensorielle</em>. Elle explore la dimension <strong>affective</strong> et <strong>mémorielle</strong> des odeurs, leur capacité à déclencher des souvenirs, des émotions, des sensations corporelles.
                  </p>
                  <p>
                    Le prototype <strong>C3 Lacta Solis</strong> est destiné à des <strong>huiles corporelles</strong> ou des <strong>parfums de peau</strong> qui créent une intimité olfactive. Il peut aussi servir pour des <strong>installations textiles</strong> (tissus parfumés, coussins, draps) qui évoquent le réconfort et la proximité. Il s'inscrit dans une recherche sur les <strong>odeurs de soin</strong>, les <strong>odeurs de réconfort</strong>, et les <strong>odeurs de mémoire</strong>.
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
