import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mountain, Beaker, Flame } from "lucide-react";
import { Link } from "wouter";

export default function GammesVolcanique() {
  const accords = [
    {
      name: "Volcanique Soufre Pur",
      subtitle: "Soufre brûlant + vapeur acide + minéral chaud",
      formula: "Frankincense Noir 0.25% • Vetiver Assam 0.15% • Juniper 0.12% • Makrut 0.08% • Spikenard 0.05% • Ambergris 0.02%",
      variations: ["Soufre-Chaud (+Palo Santo 0.05)", "Soufre-Acide (+Makrut 0.05)", "Soufre-Fumée (+Frankincense 0.08)"],
      usage: "Installations immersives, recherche géologique, accords extrêmes",
      effect: "Soufre volcanique, vapeur acide, chaleur minérale intense",
    },
    {
      name: "Volcanique Cendre Chaude",
      subtitle: "Cendre tiède + poussière volcanique + fumée noire",
      formula: "Frankincense Noir 0.30% • Vetiver Haiti 0.18% • Palo Santo 0.10% • Oud Tea 0.08% • Spikenard 0.06% • Mitti Attar 0.03%",
      variations: ["Cendre-Fumée (+Oud Tea 0.05)", "Cendre-Terre (+Mitti 0.05)", "Cendre-Résine (+Frankincense 0.10)"],
      usage: "Hash noir, résines sombres, installations post-éruption",
      effect: "Cendre volcanique tiède, fumée noire, poussière minérale",
    },
    {
      name: "Volcanique Pierre Calcinée",
      subtitle: "Pierre brûlée + minéral sec + chaleur résiduelle",
      formula: "Vetiver Assam 0.25% • Frankincense 0.20% • Mitti Attar 0.12% • Santal 0.08% • Juniper 0.05% • Ambergris 0.02%",
      variations: ["Pierre-Chaude (+Palo Santo 0.08)", "Pierre-Sèche (Mitti 0.08)", "Pierre-Fumée (+Frankincense 0.10)"],
      usage: "Tabac brun, résines minérales, sculptures olfactives",
      effect: "Pierre volcanique calcinée, minéral sec, chaleur résiduelle",
    },
    {
      name: "Volcanique Fumée Noire",
      subtitle: "Fumée épaisse + cendre + soufre léger",
      formula: "Frankincense Noir 0.28% • Oud Tea 0.15% • Vetiver Assam 0.12% • Palo Santo 0.08% • Spikenard 0.05% • Makrut 0.02%",
      variations: ["Fumée-Dense (+Oud Tea 0.08)", "Fumée-Soufre (+Makrut 0.04)", "Fumée-Résine (+Frankincense 0.10)"],
      usage: "Hash très sombre, résines CBN, installations fumée",
      effect: "Fumée volcanique noire, cendre dense, soufre subtil",
    },
    {
      name: "Volcanique Minéral Brûlé",
      subtitle: "Minéral incandescent + pierre rouge + vapeur",
      formula: "Vetiver Haiti 0.22% • Frankincense 0.18% • Juniper 0.12% • Makrut 0.08% • Mitti Attar 0.05% • Ambergris 0.02%",
      variations: ["Minéral-Rouge (+Spikenard 0.05)", "Minéral-Vapeur (+Juniper 0.08)", "Minéral-Sec (Mitti 0.03)"],
      usage: "Tabac blond fumé, résines claires, recherche thermique",
      effect: "Minéral brûlé incandescent, pierre rouge, vapeur chaude",
    },
    {
      name: "Volcanique Lave Refroidie",
      subtitle: "Lave solidifiée + pierre noire + fumée froide",
      formula: "Vetiver Assam 0.20% • Frankincense Noir 0.15% • Santal 0.10% • Oud Tea 0.08% • Mitti Attar 0.08% • Ambergris 0.03%",
      variations: ["Lave-Noire (+Oud Tea 0.05)", "Lave-Pierre (+Mitti 0.05)", "Lave-Fumée (+Frankincense 0.08)"],
      usage: "Hash refroidi, résines solidifiées, installations géologiques",
      effect: "Lave solidifiée noire, pierre volcanique froide, fumée résiduelle",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-orange-50/50 to-background">
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
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">36 variations</Badge>
                <Badge variant="outline">Recherche 2023-2025</Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                La gamme <strong>Volcanique</strong> explore les odeurs de la matière géologique en transformation thermique : soufre brûlant, cendre chaude, pierre calcinée, fumée noire, minéral incandescent, lave refroidie. Ces <strong>36 variations</strong> documentent les effets de la chaleur extrême, de la combustion et du refroidissement sur les odeurs minérales. Chaque accord interroge un état de la matière volcanique, de l'incandescence à la solidification.
              </p>
            </div>
          </div>
        </section>

        {/* Accords Maîtres */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                6 Accords Maîtres
              </h2>
              <p className="text-muted-foreground mb-12 max-w-3xl">
                Les accords maîtres Volcanique explorent les <strong>transformations thermiques de la matière minérale</strong>. Chaque accord documente un état spécifique : soufre pur (vapeur acide), cendre chaude (poussière volcanique), pierre calcinée (minéral sec), fumée noire (cendre dense), minéral brûlé (incandescence), lave refroidie (solidification). Ces formules sont des <strong>outils de recherche</strong> sur les effets olfactifs de la chaleur extrême.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                {accords.map((accord, index) => (
                  <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{accord.name}</CardTitle>
                          <CardDescription className="text-base">{accord.subtitle}</CardDescription>
                        </div>
                        <Beaker className="h-6 w-6 text-orange-600 flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Formule mère</h4>
                        <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                          {accord.formula}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Variations</h4>
                        <div className="flex flex-wrap gap-2">
                          {accord.variations.map((variation, idx) => (
                            <Badge key={idx} variant="outline">{variation}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Effet olfactif</h4>
                        <p className="text-sm text-muted-foreground">{accord.effect}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Usage</h4>
                        <p className="text-sm text-muted-foreground">{accord.usage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Approche de Recherche
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transformations Thermiques</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    La gamme Volcanique documente les <strong>effets olfactifs de la chaleur extrême</strong> sur la matière minérale. Chaque accord explore un état thermique : incandescence (soufre, minéral brûlé), combustion (cendre, fumée), refroidissement (pierre calcinée, lave solidifiée). Cette approche permet de comprendre comment la <strong>température transforme les odeurs géologiques</strong>.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Géologie Olfactive</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Ces accords ne reproduisent pas fidèlement les odeurs volcaniques mais en font un <strong>point de départ conceptuel</strong> : que signifie l'odeur du soufre, de la cendre, de la pierre brûlée ? Comment traduire ces phénomènes géologiques en formules olfactives ? La gamme Volcanique est une <strong>recherche sur la matière minérale en transformation</strong>.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Applications Artistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Les accords Volcanique sont destinés à des <strong>installations immersives</strong> qui interrogent les transformations géologiques, la violence thermique, et la matière extrême. Ils peuvent aussi être utilisés pour des <strong>résines sombres</strong> (hash noir, CBN) ou des <strong>tabacs fumés</strong> qui évoquent la cendre et la fumée volcanique.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
