// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Beaker, ArrowLeft, Lightbulb, Box, Sparkles } from "lucide-react";
import { MoleculeLink } from "@/components/MoleculeLink";
import { CompositionComplete, PrototypeComposition } from "@/components/PrototypeRadarChart";
import { Link } from "wouter";

// Composition du prototype C2
const c2Composition: PrototypeComposition = {
  name: "C2 — CLARUS VERDE",
  color: "#16a34a", // green-600
  molecules: [
    { name: "Juniper", quantity: "0.15 ml", radarIntensity: 60, radarFreshness: 85, radarWarmth: 25, radarSweetness: 20, radarSpiciness: 45, radarEarthiness: 35 },
    { name: "Makrut", quantity: "0.10 ml", radarIntensity: 70, radarFreshness: 95, radarWarmth: 15, radarSweetness: 20, radarSpiciness: 25, radarEarthiness: 10 },
    { name: "Vetiver", quantity: "0.20 ml", radarIntensity: 75, radarFreshness: 35, radarWarmth: 55, radarSweetness: 20, radarSpiciness: 30, radarEarthiness: 85 },
  ]
};

export default function C2ClarusVerde() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-green-50/50 to-background dark:from-green-950/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/prototypes">
                <Button variant="ghost" size="sm" className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux Prototypes
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg bg-green-50 dark:bg-green-950/50 flex items-center justify-center">
                  <Leaf className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    💚 C2 — CLARUS VERDE
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Verticalité, transparence, lumière verte
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">Vert / Résine / Agrume acide</Badge>
                <Badge variant="outline">Alcool (5 ml)</Badge>
                <Badge variant="outline">Repos 48h minimum</Badge>
              </div>

              <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed">
                    <strong>C2 Clarus Verde</strong> explore la <strong>transparence et la matière-lumière</strong> : clarté cristalline, verticalité végétale, acidité tranchante. Ce prototype interroge les odeurs qui évoquent la <strong>pureté, la fraîcheur, et l'immédiateté</strong> : <em>que signifie une odeur "claire" ? Comment traduire la sensation de transparence en composition olfactive ?</em>
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
                    <Lightbulb className="h-5 w-5 text-green-600" />
                    Concept : Verticalité, Transparence, Lumière Verte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Le prototype <strong>C2 Clarus Verde</strong> s'inscrit dans une recherche sur <strong>la verticalité et la transparence</strong> : les odeurs qui évoquent la lumière, la clarté, la pureté. Il explore les <strong>notes vertes</strong> en parfumerie, ces molécules qui évoquent la chlorophylle, la sève, les feuilles froissées, et qui créent une sensation de <strong>fraîcheur immédiate</strong>.
                  </p>
                  <p>
                    Cette recherche s'inspire de la philosophie de <strong>Gaston Bachelard</strong> sur <em>l'air et les songes</em> : l'idée que certaines odeurs évoquent l'<strong>élévation, la légèreté, la montée verticale</strong>. Les notes vertes sont des odeurs qui "montent", qui créent une sensation de <strong>clarté mentale</strong> et de <strong>purification</strong>.
                  </p>
                  <p>
                    Les molécules choisies évoquent des <strong>paysages végétaux lumineux</strong> :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Genévrier</strong> (Juniper) : note résineuse mentholée, évoque la forêt de conifères, la montagne, l'air pur</li>
                    <li><strong>Combava</strong> (Makrut Lime) : zeste d'agrume acide, évoque la fraîcheur citronnée, la transparence, la lumière</li>
                    <li><strong>Vétiver haïtien</strong> (Vetiver) : racine terreuse, évoque l'ancrage, la stabilité, la profondeur</li>
                  </ul>
                  <p>
                    La combinaison de ces trois ingrédients crée une <strong>architecture olfactive verticale</strong> : le vétiver ancre la composition dans la terre, le juniper crée une montée résineuse, et le makrut apporte une note de tête citronnée qui évoque la lumière.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-green-600" />
                    Étude des Molécules Vertes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    Les <strong>notes vertes</strong> en parfumerie sont des molécules qui évoquent la <strong>chlorophylle, la sève, les feuilles froissées</strong>. Elles créent une sensation de <strong>fraîcheur immédiate</strong> et de <strong>naturel</strong>. Voici quelques exemples de molécules vertes explorées dans le cadre de <strong>PERFUMUM</strong> :
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Galbanum</h4>
                      <p className="text-sm mb-2">Résine de <em>Ferula galbaniflua</em>, originaire d'Iran.</p>
                      <p className="text-sm"><strong>Profil</strong> : vert intense, terreux, résineux, légèrement amer</p>
                      <p className="text-sm mt-2"><strong>Usage</strong> : note de tête puissante, évoque la sève verte, les feuilles froissées</p>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Violet Leaf (Feuille de Violette)</h4>
                      <p className="text-sm mb-2">Absolu de feuilles de <em>Viola odorata</em>.</p>
                      <p className="text-sm"><strong>Profil</strong> : vert aqueux, concombre, légèrement floral</p>
                      <p className="text-sm mt-2"><strong>Usage</strong> : note de cœur, évoque la rosée, la fraîcheur végétale</p>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Fig (Figue)</h4>
                      <p className="text-sm mb-2">Accord synthétique évoquant la figue et ses feuilles.</p>
                      <p className="text-sm"><strong>Profil</strong> : vert lacté, boisé, légèrement sucré</p>
                      <p className="text-sm mt-2"><strong>Usage</strong> : note de cœur, évoque le lait de figue, la chaleur méditerranéenne</p>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">Cis-3-Hexenol</h4>
                      <p className="text-sm mb-2">Molécule synthétique, "odeur de l'herbe coupée".</p>
                      <p className="text-sm"><strong>Profil</strong> : vert intense, herbacé, frais</p>
                      <p className="text-sm mt-2"><strong>Usage</strong> : note de tête, évoque l'herbe fraîchement coupée</p>
                    </div>
                  </div>

                  <p>
                    Dans <strong>C2 Clarus Verde</strong>, nous avons choisi de ne pas utiliser ces molécules vertes "classiques", mais de créer une <strong>verticalité verte</strong> à partir de matières premières plus <strong>résineuses et terreuses</strong> (juniper, vetiver) équilibrées par une note citronnée acide (makrut). Cette approche crée une <strong>transparence verte</strong> plus <strong>minérale et structurée</strong> que les notes vertes florales ou herbacées.
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
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-green-600" />
                    Formule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Juniper" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.15 ml</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Makrut" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.10 ml</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Vetiver" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.20 ml</span>
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
                      <span>Mélanger Juniper + Makrut dans 1 ml d'alcool (notes de tête)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">2.</span>
                      <span>Ajouter le Vetiver (note de fond, ancrage terreux)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">3.</span>
                      <span>Compléter avec l'alcool restant</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">4.</span>
                      <span>Repos 48h minimum (idéalement 3-4 jours pour fusion des notes)</span>
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
                      <p className="text-foreground">Tranchant, cristallin, mentholé vert, résine fraîche</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Stabilité</p>
                      <p className="text-foreground">Moyenne (volatilité du Makrut compensée par le Vetiver)</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Résonance émotionnelle</p>
                      <p className="text-foreground">Clarté mentale, verticalité, purification, élévation</p>
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
                    <Badge variant="outline">Diffusion spatiale</Badge>
                    <Badge variant="outline">Parfum d'atmosphère</Badge>
                    <Badge variant="outline">Installation paysage</Badge>
                    <Badge variant="outline">Méditation / Clarté mentale</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Composition Complète & Profil Olfactif</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompositionComplete 
                    composition={c2Composition}
                    description="Profil vert-frais avec une base terreuse. Dominante Fraîcheur (72) équilibrée par Terreux (43) et Épices (33). Architecture verticale : terre → résine → lumière."
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
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    Installation Conceptuelle : "Colonne de Lumière"
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    L'installation <strong>"Colonne de Lumière"</strong> est une pièce immersive qui explore la dimension phénoménologique de la <strong>verticalité et de la transparence</strong>. Le visiteur entre dans un espace vertical, éclairé par une lumière verte diffuse, où l'odeur de <strong>C2 Clarus Verde</strong> est diffusée en continu.
                  </p>
                  
                  <div className="bg-background p-6 rounded-lg border my-6">
                    <h4 className="font-semibold text-foreground mb-4">Dispositif spatial</h4>
                    <ul className="space-y-2 list-disc list-inside">
                      <li><strong>Espace</strong> : Colonne verticale de 2m × 2m × 5m, parois en verre dépoli</li>
                      <li><strong>Lumière</strong> : Éclairage LED vert (520-540 nm) diffus, intensité progressive du bas vers le haut</li>
                      <li><strong>Sol</strong> : Miroir ou surface réfléchissante pour créer une sensation d'infini vertical</li>
                      <li><strong>Diffusion</strong> : Diffuseurs ultrasoniques placés au sol, brume montante qui suit la lumière</li>
                      <li><strong>Son</strong> : Silence ou fréquences très hautes (8000-12000 Hz) à faible volume</li>
                    </ul>
                  </div>

                  <div className="bg-background p-6 rounded-lg border my-6">
                    <h4 className="font-semibold text-foreground mb-4">Expérience sensorielle</h4>
                    <p className="mb-4">
                      Le visiteur est invité à <strong>se tenir debout</strong> au centre de la colonne pendant 5 à 10 minutes. L'odeur de <strong>C2 Clarus Verde</strong> se déploie progressivement, créant une sensation de <strong>montée verticale</strong> :
                    </p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li><strong>0-2 min</strong> : Perception de la base terreuse (Vetiver), ancrage au sol</li>
                      <li><strong>2-5 min</strong> : Émergence de la note résineuse (Juniper), sensation de montée</li>
                      <li><strong>5-10 min</strong> : Déploiement de la note citronnée (Makrut), sensation de lumière et de clarté</li>
                    </ul>
                    <p className="mt-4">
                      La brume olfactive monte lentement dans la colonne, créant une <strong>visualisation de l'odeur</strong> : le visiteur peut observer la matière olfactive en train de monter, de se diffuser, de se transformer.
                    </p>
                  </div>

                  <div className="bg-background p-6 rounded-lg border my-6">
                    <h4 className="font-semibold text-foreground mb-4">Intention artistique</h4>
                    <p>
                      L'installation vise à créer une <strong>expérience phénoménologique de la verticalité</strong>. Elle interroge notre rapport à l'<strong>élévation, à la clarté, à la purification</strong>. En se tenant debout dans cet espace, le visiteur est invité à <strong>s'élever</strong> avec l'odeur, à suivre son mouvement ascendant.
                    </p>
                    <p className="mt-4">
                      Cette installation s'inspire des <strong>architectures sacrées</strong> (cathédrales, temples) qui utilisent la verticalité pour créer une sensation d'<strong>élévation spirituelle</strong>. Ici, c'est l'odeur qui crée cette élévation, qui invite le visiteur à <strong>monter</strong> avec elle.
                    </p>
                  </div>

                  <p>
                    Cette installation a été conçue en 2024 dans le cadre du projet <strong>PERFUMUM</strong>. Elle s'inscrit dans une série d'installations olfactives qui explorent les <strong>architectures sensorielles</strong> et les <strong>espaces phénoménologiques</strong>.
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
                    Le prototype <strong>C2 Clarus Verde</strong> s'inscrit dans une recherche phénoménologique sur <strong>la perception olfactive de la verticalité et de la transparence</strong>. Il interroge les questions suivantes :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Que signifie une odeur <strong>"claire"</strong> ou <strong>"transparente"</strong> ?</li>
                    <li>Comment les odeurs peuvent-elles évoquer la <strong>verticalité</strong> et l'<strong>élévation</strong> ?</li>
                    <li>Quel est le rapport entre <strong>lumière</strong> et <strong>odeur</strong> dans notre perception sensorielle ?</li>
                    <li>Comment la parfumerie peut-elle créer des <strong>architectures olfactives verticales</strong> ?</li>
                  </ul>
                  <p>
                    Cette recherche s'inspire des travaux de <strong>Gaston Bachelard</strong> sur <em>l'air et les songes</em>, de <strong>Gernot Böhme</strong> sur les <em>atmosphères</em>, et de <strong>Juhani Pallasmaa</strong> sur l'<em>architecture sensorielle</em>. Elle explore la dimension <strong>spatiale</strong> et <strong>architecturale</strong> des odeurs, leur capacité à créer des <strong>espaces phénoménologiques</strong>.
                  </p>
                  <p>
                    Le prototype <strong>C2 Clarus Verde</strong> est destiné à des <strong>installations immersives</strong> qui interrogent la relation à l'espace, à la lumière, et à la verticalité. Il peut aussi servir de <strong>parfum d'atmosphère</strong> pour des espaces de méditation, de travail intellectuel, ou de création artistique.
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
