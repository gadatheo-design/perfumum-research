// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Lightbulb, Target, Layers } from "lucide-react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function EchelleAbsorbe() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/20">
          <div className="container">
      <Breadcrumbs />
            <div className="max-w-4xl mx-auto">
              <Link href="/methodologie/absorbe">
                <Button variant="ghost" size="sm" className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la Méthodologie
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Échelle ABSORBE
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Système de classification olfactive en 7 catégories
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">Méthodologie</Badge>
                <Badge variant="outline">7 catégories</Badge>
                <Badge variant="outline">Échelle 0-10</Badge>
              </div>

              <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed">
                    L'<strong>échelle ABSORBE</strong> est un système de classification olfactive développé dans le cadre du projet <strong>PERFUMUM</strong>. Elle permet d'évaluer et de cartographier les profils olfactifs selon <strong>7 dimensions fondamentales</strong>, créant ainsi un langage commun pour décrire et comparer les matières premières, les accords et les compositions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    Origine et Philosophie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    L'échelle <strong>ABSORBE</strong> est née d'un besoin de <strong>structurer la perception olfactive</strong> au-delà des classifications traditionnelles (notes de tête/cœur/fond, familles olfactives). Elle s'inspire de plusieurs approches :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>La roue des arômes</strong> (vin, café, bière) : approche sensorielle et descriptive</li>
                    <li><strong>Les profils radar</strong> (parfumerie, œnologie) : visualisation multidimensionnelle</li>
                    <li><strong>La phénoménologie de l'odeur</strong> (Merleau-Ponty, Bachelard) : dimension expérientielle et atmosphérique</li>
                  </ul>
                  <p>
                    Le nom <strong>ABSORBE</strong> est un acronyme qui désigne les 7 catégories fondamentales :
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
                    <div className="p-3 bg-background rounded-lg border">
                      <strong className="text-foreground">A</strong>tmosphérique
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <strong className="text-foreground">B</strong>rut
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <strong className="text-foreground">S</strong>olaire
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <strong className="text-foreground">O</strong>rganique
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <strong className="text-foreground">R</strong>ésineux
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <strong className="text-foreground">B</strong>alsamique
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <strong className="text-foreground">É</strong>picé
                    </div>
                  </div>
                  <p>
                    Chaque catégorie est évaluée sur une <strong>échelle de 0 à 10</strong>, permettant de créer un <strong>profil radar</strong> unique pour chaque matière première ou composition.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Les 7 Catégories */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Les 7 Catégories ABSORBE</h2>
                <p className="text-muted-foreground text-lg">
                  Chaque catégorie représente une dimension olfactive fondamentale, avec ses molécules prototypiques et ses caractéristiques sensorielles.
                </p>
              </div>

              {/* A - Atmosphérique */}
              <Card className="border-l-4 border-l-sky-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">🌫️</span>
                    <div>
                      <div className="text-2xl">A — Atmosphérique</div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        Aérien, éthéré, diffus, spatial
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Les notes <strong>atmosphériques</strong> évoquent l'<strong>air, l'espace, la légèreté</strong>. Elles créent une sensation de <strong>diffusion</strong>, de <strong>flou</strong>, d'<strong>immatérialité</strong>. Ce sont des odeurs qui "flottent", qui créent une <strong>ambiance</strong> plutôt qu'une présence marquée.
                  </p>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Molécules prototypiques</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">10/10</Badge>
                        <span className="text-sm">Encens (Oliban)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">9/10</Badge>
                        <span className="text-sm">Calone (note marine)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">8/10</Badge>
                        <span className="text-sm">Aldéhydes (C10-C12)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">7/10</Badge>
                        <span className="text-sm">Iso E Super</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Caractéristiques sensorielles</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Sensation de <strong>légèreté</strong> et d'<strong>élévation</strong></li>
                      <li>Diffusion <strong>lente et homogène</strong> dans l'espace</li>
                      <li>Évoque l'<strong>air pur</strong>, la <strong>brume</strong>, la <strong>fumée</strong></li>
                      <li>Crée une <strong>atmosphère</strong> plutôt qu'une odeur définie</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* B - Brut */}
              <Card className="border-l-4 border-l-stone-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">🪨</span>
                    <div>
                      <div className="text-2xl">B — Brut</div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        Minéral, pierreux, métallique, sec
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Les notes <strong>brutes</strong> évoquent la <strong>pierre, le métal, la terre sèche</strong>. Elles créent une sensation de <strong>dureté</strong>, de <strong>minéralité</strong>, de <strong>sécheresse</strong>. Ce sont des odeurs qui évoquent la <strong>matière inorganique</strong>, le <strong>pétrichor</strong>, les <strong>roches chauffées</strong>.
                  </p>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Molécules prototypiques</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">10/10</Badge>
                        <span className="text-sm">Géosmine (pétrichor)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">9/10</Badge>
                        <span className="text-sm">Mitti Attar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">8/10</Badge>
                        <span className="text-sm">Cèdre Atlas (note sèche)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">7/10</Badge>
                        <span className="text-sm">Vétiver (racine sèche)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Caractéristiques sensorielles</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Sensation de <strong>sécheresse</strong> et de <strong>dureté</strong></li>
                      <li>Évoque la <strong>pierre</strong>, le <strong>métal</strong>, la <strong>terre sèche</strong></li>
                      <li>Note <strong>minérale</strong> et <strong>poudreuse</strong></li>
                      <li>Crée une <strong>base solide</strong> et <strong>stable</strong></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* S - Solaire */}
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">☀️</span>
                    <div>
                      <div className="text-2xl">S — Solaire</div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        Chaleureux, lumineux, doré, enveloppant
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Les notes <strong>solaires</strong> évoquent la <strong>chaleur, la lumière, la douceur</strong>. Elles créent une sensation de <strong>rayonnement</strong>, de <strong>chaleur enveloppante</strong>, de <strong>confort</strong>. Ce sont des odeurs qui évoquent le <strong>soleil sur la peau</strong>, les <strong>fleurs tropicales</strong>, la <strong>vanille</strong>.
                  </p>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Molécules prototypiques</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">10/10</Badge>
                        <span className="text-sm">Vanilline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">9/10</Badge>
                        <span className="text-sm">Frangipani (Plumeria)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">8/10</Badge>
                        <span className="text-sm">Ylang-Ylang</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">7/10</Badge>
                        <span className="text-sm">Néroli</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Caractéristiques sensorielles</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Sensation de <strong>chaleur</strong> et de <strong>douceur</strong></li>
                      <li>Évoque le <strong>soleil</strong>, la <strong>peau chaude</strong>, les <strong>fleurs tropicales</strong></li>
                      <li>Note <strong>lactée</strong>, <strong>crémeuse</strong>, <strong>enveloppante</strong></li>
                      <li>Crée une <strong>intimité</strong> et un <strong>réconfort</strong></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* O - Organique */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">🍄</span>
                    <div>
                      <div className="text-2xl">O — Organique</div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        Vivant, fermenté, animal, charnel
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Les notes <strong>organiques</strong> évoquent la <strong>matière vivante, la fermentation, l'animalité</strong>. Elles créent une sensation de <strong>corporéité</strong>, de <strong>proximité avec le vivant</strong>, de <strong>transformation biologique</strong>. Ce sont des odeurs qui évoquent le <strong>cuir</strong>, le <strong>musc</strong>, la <strong>terre humide</strong>.
                  </p>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Molécules prototypiques</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">10/10</Badge>
                        <span className="text-sm">Indole (jasmin/fécal)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">9/10</Badge>
                        <span className="text-sm">Ambre Gris</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">8/10</Badge>
                        <span className="text-sm">Castoreum</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">7/10</Badge>
                        <span className="text-sm">Vétiver (note humide)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Caractéristiques sensorielles</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Sensation de <strong>corporéité</strong> et de <strong>proximité</strong></li>
                      <li>Évoque la <strong>peau</strong>, le <strong>cuir</strong>, la <strong>terre humide</strong></li>
                      <li>Note <strong>animale</strong>, <strong>musquée</strong>, <strong>fermentée</strong></li>
                      <li>Crée une <strong>intimité troublante</strong> et <strong>charnelle</strong></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* R - Résineux */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">🌲</span>
                    <div>
                      <div className="text-2xl">R — Résineux</div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        Conifère, résine, boisé vert, mentholé
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Les notes <strong>résineuses</strong> évoquent les <strong>conifères, la résine, les forêts</strong>. Elles créent une sensation de <strong>fraîcheur verte</strong>, de <strong>verticalité</strong>, de <strong>pureté</strong>. Ce sont des odeurs qui évoquent le <strong>pin</strong>, le <strong>genévrier</strong>, le <strong>cyprès</strong>.
                  </p>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Molécules prototypiques</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">10/10</Badge>
                        <span className="text-sm">Pin sylvestre</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">9/10</Badge>
                        <span className="text-sm">Genévrier (Juniper)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">8/10</Badge>
                        <span className="text-sm">Cyprès</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">7/10</Badge>
                        <span className="text-sm">Cèdre (note verte)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Caractéristiques sensorielles</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Sensation de <strong>fraîcheur</strong> et de <strong>verticalité</strong></li>
                      <li>Évoque la <strong>forêt</strong>, la <strong>montagne</strong>, l'<strong>air pur</strong></li>
                      <li>Note <strong>mentholée</strong>, <strong>résineuse</strong>, <strong>verte</strong></li>
                      <li>Crée une <strong>clarté mentale</strong> et une <strong>purification</strong></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* B - Balsamique */}
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">🍯</span>
                    <div>
                      <div className="text-2xl">B — Balsamique</div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        Doux, mielleux, résineux chaud, ambré
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Les notes <strong>balsamiques</strong> évoquent le <strong>miel, la résine chaude, l'ambre</strong>. Elles créent une sensation de <strong>douceur</strong>, de <strong>chaleur enveloppante</strong>, de <strong>profondeur</strong>. Ce sont des odeurs qui évoquent le <strong>benjoin</strong>, le <strong>styrax</strong>, la <strong>vanille</strong>.
                  </p>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Molécules prototypiques</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">10/10</Badge>
                        <span className="text-sm">Benjoin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">9/10</Badge>
                        <span className="text-sm">Styrax</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">8/10</Badge>
                        <span className="text-sm">Tolu Balsam</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">7/10</Badge>
                        <span className="text-sm">Vanille (note ambrée)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Caractéristiques sensorielles</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Sensation de <strong>douceur</strong> et de <strong>chaleur</strong></li>
                      <li>Évoque le <strong>miel</strong>, la <strong>résine chaude</strong>, l'<strong>ambre</strong></li>
                      <li>Note <strong>sucrée</strong>, <strong>enveloppante</strong>, <strong>profonde</strong></li>
                      <li>Crée une <strong>stabilité</strong> et un <strong>réconfort</strong></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* É - Épicé */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">🌶️</span>
                    <div>
                      <div className="text-2xl">É — Épicé</div>
                      <div className="text-sm font-normal text-muted-foreground mt-1">
                        Piquant, chaud, aromatique, stimulant
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Les notes <strong>épicées</strong> évoquent les <strong>épices, la chaleur, la stimulation</strong>. Elles créent une sensation de <strong>piquant</strong>, de <strong>chaleur</strong>, d'<strong>énergie</strong>. Ce sont des odeurs qui évoquent le <strong>poivre</strong>, la <strong>cannelle</strong>, le <strong>clou de girofle</strong>.
                  </p>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Molécules prototypiques</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">10/10</Badge>
                        <span className="text-sm">Poivre noir</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">9/10</Badge>
                        <span className="text-sm">Cannelle (Cinnamaldéhyde)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">8/10</Badge>
                        <span className="text-sm">Clou de girofle (Eugénol)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">7/10</Badge>
                        <span className="text-sm">Cardamome</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Caractéristiques sensorielles</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Sensation de <strong>chaleur</strong> et de <strong>piquant</strong></li>
                      <li>Évoque les <strong>épices</strong>, la <strong>cuisine</strong>, les <strong>marchés</strong></li>
                      <li>Note <strong>aromatique</strong>, <strong>stimulante</strong>, <strong>énergisante</strong></li>
                      <li>Crée une <strong>dynamique</strong> et une <strong>vivacité</strong></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Utilisation */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Utilisation de l'Échelle ABSORBE
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>
                    L'échelle <strong>ABSORBE</strong> peut être utilisée de plusieurs manières dans le cadre de <strong>PERFUMUM</strong> :
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">1. Évaluation des matières premières</h4>
                      <p className="text-sm">
                        Chaque matière première (huile essentielle, absolu, molécule synthétique) peut être évaluée selon les 7 catégories ABSORBE, créant ainsi un <strong>profil radar unique</strong>. Cela permet de comparer les matières premières entre elles et d'identifier des <strong>synergies olfactives</strong>.
                      </p>
                    </div>

                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">2. Création d'accords</h4>
                      <p className="text-sm">
                        En combinant plusieurs matières premières, on peut créer des <strong>accords</strong> dont le profil ABSORBE est la moyenne pondérée des profils individuels. Cela permet de <strong>prédire</strong> le profil olfactif d'un accord avant de le réaliser physiquement.
                      </p>
                    </div>

                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">3. Analyse des prototypes</h4>
                      <p className="text-sm">
                        Les prototypes <strong>C1, C2, C3, C4</strong> peuvent être analysés selon l'échelle ABSORBE, révélant leurs <strong>dominantes olfactives</strong> et leurs <strong>équilibres internes</strong>. Cela permet de comprendre leur <strong>structure</strong> et d'identifier des pistes d'amélioration.
                      </p>
                    </div>

                    <div className="p-4 bg-background rounded-lg border">
                      <h4 className="font-semibold text-foreground mb-2">4. Recherche de synergies</h4>
                      <p className="text-sm">
                        En comparant les profils ABSORBE de différentes matières premières, on peut identifier des <strong>complémentarités</strong> (profils opposés qui s'équilibrent) ou des <strong>renforcements</strong> (profils similaires qui s'amplifient).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-600" />
                    Grille d'Évaluation (0-10)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    Pour évaluer une matière première selon l'échelle ABSORBE, utilisez la grille suivante pour chaque catégorie :
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Score</th>
                          <th className="text-left p-2 font-semibold">Intensité</th>
                          <th className="text-left p-2 font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="p-2 font-mono">0</td>
                          <td className="p-2">Absent</td>
                          <td className="p-2">Aucune trace de cette catégorie</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">1-2</td>
                          <td className="p-2">Trace</td>
                          <td className="p-2">Présence très discrète, presque imperceptible</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">3-4</td>
                          <td className="p-2">Faible</td>
                          <td className="p-2">Présence perceptible mais secondaire</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">5-6</td>
                          <td className="p-2">Modéré</td>
                          <td className="p-2">Présence claire et équilibrée</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">7-8</td>
                          <td className="p-2">Fort</td>
                          <td className="p-2">Présence marquée et structurante</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">9-10</td>
                          <td className="p-2">Dominant</td>
                          <td className="p-2">Caractéristique principale, définit l'odeur</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
