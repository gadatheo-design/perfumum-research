import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Beaker, ArrowLeft } from "lucide-react";
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
        <section className="section-spacing bg-gradient-to-b from-green-50/50 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/prototypes">
                <Button variant="ghost" size="sm" className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux Prototypes
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg bg-green-50 flex items-center justify-center">
                  <Leaf className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    💚 C2 — CLARUS VERDE
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Transparence – matière-lumière
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">Vert / Résine / Agrume acide</Badge>
                <Badge variant="outline">Alcool (5 ml)</Badge>
              </div>
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
                      <span>Mélanger Juniper + Makrut dans 1 ml d'alcool</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">2.</span>
                      <span>Ajouter le Vetiver</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">3.</span>
                      <span>Compléter avec l'alcool restant</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">4.</span>
                      <span>Repos 48h minimum</span>
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
                      <p className="text-foreground">tranchant, cristallin, mentholé vert</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Stabilité</p>
                      <p className="text-foreground">Moyenne (volatilité du Makrut)</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Résonance émotionnelle</p>
                      <p className="text-foreground">clarté mentale, verticalité</p>
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
                    description="Profil vert-frais avec une base terreuse"
                  />
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>Axe Philosophique</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <p>
                    <strong>C2 Clarus Verde</strong> explore la <strong>transparence et la matière-lumière</strong> : clarté cristalline, verticalité végétale, acidité tranchante. Ce prototype interroge les odeurs qui évoquent la <strong>pureté, la fraîcheur, et l'immédiateté</strong> : que signifie une odeur "claire" ? Comment traduire la sensation de transparence en composition olfactive ?
                  </p>
                  <p>
                    Les molécules choisies (juniper, makrut, vetiver haïtien) créent une texture <strong>verte et résineuse</strong> : le juniper apporte une note de genévrier mentholé, le makrut une acidité citronnée tranchante, le vetiver haïtien une base terreuse qui ancre l'ensemble. Cette combinaison évoque un <strong>paysage végétal lumineux</strong>.
                  </p>
                  <p>
                    Ce prototype est destiné à des <strong>diffusions spatiales</strong> (brume, spray) qui transforment l'atmosphère d'un lieu. Il peut aussi servir de <strong>parfum d'atmosphère</strong> pour des installations "paysage" qui évoquent la forêt, la montagne, ou les espaces végétaux ouverts.
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
