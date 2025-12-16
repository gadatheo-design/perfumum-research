import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mountain, Beaker, ArrowLeft } from "lucide-react";
import { MoleculeLink } from "@/components/MoleculeLink";
import { CompositionComplete, PrototypeComposition } from "@/components/PrototypeRadarChart";
import { Link } from "wouter";

// Composition du prototype C4
const c4Composition: PrototypeComposition = {
  name: "C4 — TERRA AMBRA",
  color: "#d97706", // amber-600
  molecules: [
    { name: "Encens", quantity: "0.2 ml", radarIntensity: 75, radarFreshness: 30, radarWarmth: 80, radarSweetness: 35, radarSpiciness: 55, radarEarthiness: 70 },
    { name: "Palo Santo", quantity: "0.15 ml", radarIntensity: 70, radarFreshness: 50, radarWarmth: 65, radarSweetness: 40, radarSpiciness: 30, radarEarthiness: 55 },
    { name: "Santal", quantity: "0.10 ml", radarIntensity: 65, radarFreshness: 25, radarWarmth: 75, radarSweetness: 55, radarSpiciness: 15, radarEarthiness: 60 },
  ]
};

export default function C4TerraAmbra() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-amber-50/50 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/prototypes">
                <Button variant="ghost" size="sm" className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux Prototypes
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Mountain className="h-10 w-10 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    🟤 C4 — TERRA AMBRA
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Temps – gravité – sacré
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">Bois / Résine / Terre sacrée</Badge>
                <Badge variant="outline">Résine CBD (5 g) ou Huile (10 ml)</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Formule */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-8">
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-amber-600" />
                    Formule concentré (1 ml)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Encens" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.2 ml</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Palo Santo" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.15 ml</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <MoleculeLink name="Santal" variant="badge" showHoverCard={true} />
                      <span className="font-mono text-muted-foreground">0.10 ml</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <span className="text-muted-foreground">MCT</span>
                      <span className="font-mono text-muted-foreground">0.55 ml</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Protocole pour résine CBD</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-semibold">1.</span>
                      <span>Préparer le concentré ci-dessus (1 ml total)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">2.</span>
                      <span>Appliquer 1 ml sur 5 g de résine CBD</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">3.</span>
                      <span>Malaxer pendant 15 minutes</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">4.</span>
                      <span>Repos hermétique 48-72h</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">5.</span>
                      <span>Réévaluer et ajuster si nécessaire</span>
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
                      <p className="text-foreground">lent, chaud, ancré</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Stabilité</p>
                      <p className="text-foreground">Très élevée</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Résonance émotionnelle</p>
                      <p className="text-foreground">méditative, enveloppante, sacrée</p>
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
                    <Badge variant="outline">Résine rituelle</Badge>
                    <Badge variant="outline">Installation sonore-olfactive</Badge>
                    <Badge variant="outline">Autel olfactif</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Composition Complète & Profil Olfactif</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompositionComplete 
                    composition={c4Composition}
                    description="Profil boisé-résineux sacré et méditatif"
                  />
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>Axe Philosophique</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <p>
                    <strong>C4 Terra Ambra</strong> explore le <strong>temps, la gravité, et le sacré</strong> : lenteur, ancrage terrestre, dimension rituelle. Ce prototype interroge les odeurs qui évoquent la <strong>profondeur temporelle, la matière ancienne, et la contemplation</strong> : que signifie une odeur "sacrée" ? Comment traduire la sensation de temps long en composition olfactive ?
                  </p>
                  <p>
                    Les molécules choisies (frankincense omanais, palo santo, sandalwood) créent une texture <strong>résineuse et boisée</strong> : le frankincense apporte une note d'encens sacré, le palo santo une fumée douce et mystique, le sandalwood une base crémeuse et méditative. Cette combinaison évoque les <strong>rituels ancestraux</strong>, les temples, et la matière millénaire.
                  </p>
                  <p>
                    Ce prototype est destiné à des <strong>résines rituelles</strong> (hash CBD, encens) ou des <strong>installations sonore-olfactives</strong> qui créent des espaces de contemplation. Il peut aussi servir pour des <strong>autels olfactifs</strong> qui interrogent la dimension spirituelle et temporelle des odeurs.
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
