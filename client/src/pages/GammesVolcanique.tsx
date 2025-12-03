import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mountain } from "lucide-react";
import { Link } from "wouter";

export default function GammesVolcanique() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="section-spacing">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/gammes">
                <a className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour aux Gammes
                </a>
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Mountain className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Volcanique
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Géologie incandescente
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-8">
                <Badge variant="secondary">36 variations</Badge>
                <Badge variant="outline">En développement</Badge>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Gamme en cours de développement</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    La gamme <strong>Volcanique</strong> explore les odeurs de la matière géologique en transformation : soufre, cendre, pierre chaude, fumée noire, minéral brûlé, lave refroidie. 36 variations sont prévues pour documenter ces phénomènes olfactifs extrêmes.
                  </p>
                  <p className="mb-4">
                    Cette recherche s'inscrit dans la continuité de la gamme Pétrichor en explorant les <strong>transformations thermiques</strong> de la matière minérale. Les accords Volcanique interrogent les effets de la chaleur, de la combustion et du refroidissement sur les odeurs géologiques.
                  </p>
                  <p>
                    <strong>Familles principales :</strong> Soufre Pur, Cendre Chaude, Pierre Calcinée, Fumée Noire, Minéral Brûlé, Lave Refroidie.
                  </p>
                </CardContent>
              </Card>

              <p className="text-sm text-muted-foreground text-center">
                Documentation complète à venir • Recherche 2024-2026
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
