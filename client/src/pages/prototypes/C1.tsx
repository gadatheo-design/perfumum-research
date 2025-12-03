import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Beaker, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function C1Fermentum() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-purple-50/50 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/prototypes">
                <Button variant="ghost" size="sm" className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux Prototypes
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Droplets className="h-10 w-10 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    🟣 C1 — FERMENTUM
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Matière vivante – organicité du monde
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">Fermentaire / Organique / Animalité noble</Badge>
                <Badge variant="outline">Base alcool (5 ml)</Badge>
              </div>
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
                  <ul className="space-y-2 font-mono text-sm text-muted-foreground">
                    <li>• Vetiver Assam : 0.10 ml</li>
                    <li>• Ambergris : 0.05 ml</li>
                    <li>• Makrut : 0.08 ml</li>
                    <li>• Mitti Attar : 0.05 ml</li>
                    <li>• Éthanol 95° : qsp 5 ml</li>
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
                      <span>Laisser maturer 72h minimum</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">4.</span>
                      <span>Réévaluer après maturation</span>
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
                      <p className="text-foreground">lactonique, humide, charnel</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Stabilité</p>
                      <p className="text-foreground">Élevée (animalité + terre + acide)</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Résonance émotionnelle</p>
                      <p className="text-foreground">intime, troublante, enveloppante</p>
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
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>Axe Philosophique</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <p>
                    <strong>C1 Fermentum</strong> explore la <strong>matière vivante en transformation</strong> : fermentation, organicité, animalité noble. Ce prototype interroge les processus biologiques qui produisent des odeurs (décomposition, maturation, métabolisme) et leur dimension phénoménologique : que signifie sentir la vie en train de se transformer ?
                  </p>
                  <p>
                    Les molécules choisies (vetiver, ambergris, makrut, mitti) évoquent des <strong>états de la matière organique</strong> : terre humide (mitti), animalité marine (ambergris), acidité végétale (makrut), racine fermentée (vetiver). Ensemble, elles créent une texture <strong>lactonique et charnelle</strong> qui évoque la proximité avec le vivant.
                  </p>
                  <p>
                    Ce prototype est destiné à des <strong>installations immersives</strong> qui interrogent la relation au corps, à la matière organique, et aux processus de transformation. Il peut aussi servir d'<strong>accord cœur</strong> pour des compositions plus complexes qui nécessitent une base animalière et terreuse.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
