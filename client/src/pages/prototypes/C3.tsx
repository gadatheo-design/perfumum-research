import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Beaker, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function C3LactaSolis() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-yellow-50/50 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/prototypes">
                <Button variant="ghost" size="sm" className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux Prototypes
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Sun className="h-10 w-10 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    🌞 C3 — LACTA SOLIS
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Lumière – douceur – mémoire
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">Floral solaire / Lactonique / Peau chaude</Badge>
                <Badge variant="outline">Huile (10 ml)</Badge>
              </div>
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
                  <ul className="space-y-2 font-mono text-sm text-muted-foreground">
                    <li>• Plumeria (Frangipani) : 0.6 ml</li>
                    <li>• Neroli Bouquetier : 0.08 ml</li>
                    <li>• Base MCT : qsp 10 ml</li>
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
                      <span>Mélanger les deux floraux dans 1 ml de MCT</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">2.</span>
                      <span>Homogénéiser pendant 2 minutes</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">3.</span>
                      <span>Ajouter le reste de MCT</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">4.</span>
                      <span>Laisser maturer 5-7 jours — transformation florale</span>
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
                      <p className="text-foreground">crémeux, enveloppant, chaleureux</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Stabilité</p>
                      <p className="text-foreground">Très élevée (huile + floraux)</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Résonance émotionnelle</p>
                      <p className="text-foreground">apaisante, intime, solaire</p>
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
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>Axe Philosophique</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <p>
                    <strong>C3 Lacta Solis</strong> explore la <strong>lumière, la douceur, et la mémoire</strong> : chaleur solaire, texture lactée, intimité de la peau. Ce prototype interroge les odeurs qui évoquent le <strong>réconfort, la proximité corporelle, et la nostalgie</strong> : que signifie une odeur "solaire" ? Comment traduire la sensation de chaleur douce en composition olfactive ?
                  </p>
                  <p>
                    Les molécules choisies (plumeria, neroli) créent une texture <strong>florale lactée</strong> : le plumeria (frangipani) apporte une note crémeuse et enveloppante, le neroli une acidité florale qui éclaire l'ensemble. Cette combinaison évoque la <strong>peau chaude au soleil</strong>, les fleurs tropicales, et la douceur des souvenirs d'enfance.
                  </p>
                  <p>
                    Ce prototype est destiné à des <strong>huiles corporelles</strong> ou des <strong>parfums de peau</strong> qui créent une intimité olfactive. Il peut aussi servir pour des <strong>installations textiles</strong> (tissus parfumés, coussins, draps) qui évoquent le réconfort et la proximité.
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
