import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { Link } from "wouter";

export default function GammesMossi() {
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
                <div className="w-16 h-16 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Royal Mossi
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Identité olfactive du Sahel
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-8">
                <Badge variant="secondary">12 variations</Badge>
                <Badge variant="outline">Recherche anthropologique</Badge>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Gamme en cours de développement</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    La gamme <strong>Royal Mossi</strong> explore l'identité olfactive des pratiques Mossi (Burkina Faso, Afrique de l'Ouest) : cuir tanné, fumigations rituelles, peaux tannées, bois du Sahel. Cette recherche s'inscrit dans une <strong>approche anthropologique</strong> qui documente les pratiques olfactives culturelles.
                  </p>
                  <p className="mb-4">
                    Le projet Royal Mossi interroge les <strong>systèmes olfactifs non-occidentaux</strong> et leur inscription dans des pratiques sociales, rituelles et matérielles. Il s'agit de comprendre comment les odeurs structurent l'identité culturelle et les relations au monde dans le contexte sahélien.
                  </p>
                  <p>
                    <strong>Familles principales :</strong> Cuir Mossi, Fumigations, Peaux Tannées, Bois Sahel.
                  </p>
                </CardContent>
              </Card>

              <p className="text-sm text-muted-foreground text-center">
                Documentation complète à venir • Recherche 2023-2025
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
