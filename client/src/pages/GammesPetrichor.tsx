import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Beaker, Flame, Wind } from "lucide-react";
import { Link } from "wouter";

export default function GammesPetrichor() {
  const accords = [
    {
      name: "Pétrichor Hash Prima",
      subtitle: "Terre vive + pluie chaude + hash vert",
      formula: "Mitti Attar 0.25% • Vetiver Assam 0.20% • Frankincense Noir 0.10% • Juniper 0.08% • Palo Santo 0.05% • Ambergris 0.03%",
      variations: ["Prima-Verte (+Makrut 0.03)", "Prima-Fumée (+Frankincense 0.05)", "Prima-Humide (+Mitti 0.05)"],
      usage: "Hash moelleux, pollen, résines grasses CBD",
      effect: "Terre humide après la pluie, végétal vert, fumée légère",
    },
    {
      name: "Pétrichor Tabac Fermenté",
      subtitle: "Tabac brun + cave humide",
      formula: "Mitti Attar 0.20% • Vetiver Haiti 0.15% • Oud Tea 0.10% • Santal 0.08% • Black Frankincense 0.07% • Spikenard 0.05% • Neroli Réserve 0.02%",
      variations: ["Fermenté-Fort (+Spikenard 0.03)", "Fermenté-Léger (Oud Tea 0.05)"],
      usage: "Résines brunes, hash à texture terre",
      effect: "Cave humide, tabac brun fermenté, terre organique",
    },
    {
      name: "Pétrichor Minéral Hash",
      subtitle: "Pierre + poussière + pluie froide",
      formula: "Mitti Attar 0.18% • Vetiver Assam 0.18% • Frankincense 0.10% • Makrut 0.05% • Juniper 0.06% • Oud Tea 0.05% • Ambergris 0.02%",
      variations: ["Minéral-Chaud (+Palo 0.03)", "Minéral-Froid (+Juniper 0.04)"],
      usage: "Ice-O-Lator, Frozen Sift, résines filtrées",
      effect: "Pierre mouillée, poussière minérale, pluie froide",
    },
    {
      name: "Pétrichor Floral Salé",
      subtitle: "Fleur blanche humide + pluie + sel + poussière",
      formula: "Mitti Attar 0.22% • Neroli 0.05% • Frangipani 0.05% • Vetiver Haiti 0.12% • Black Frankincense 0.06% • Ambergris 0.03%",
      variations: ["Floral-Salé fort (+Ambergris 0.02)", "Floral-Sec (Mitti 0.18)"],
      usage: "Libanais rouge, résines fraîches",
      effect: "Fleur blanche mouillée, sel marin, terre humide",
    },
    {
      name: "Pétrichor Animal Fumé",
      subtitle: "Sol humide + cendre + panse animale + pluie",
      formula: "Mitti Attar 0.25% • Vetiver Assam 0.20% • Palo Santo 0.10% • Frankincense Noir 0.10% • Spikenard 0.07% • Oud Tea 0.05% • Ambergris 0.03%",
      variations: ["Animal Noir (+Spikenard 0.03)", "Animal Noble (+Santal 0.05)"],
      usage: "CBN/CBG, hash noir, résines grasses",
      effect: "Terre animale, fumée noire, pluie sur cendre",
    },
    {
      name: "Pétrichor Métallique Humide",
      subtitle: "Pluie sur fer / poussière minérale / vapeur",
      formula: "Mitti Attar 0.15% • Vetiver Haiti 0.15% • Frankincense Noir 0.10% • Makrut 0.07% • Juniper 0.10% • Ambergris 0.02% • Palo Santo 0.03%",
      variations: ["Métallique-Chaud (+Palo 0.05)", "Métallique-Froid (+Juniper 0.05)"],
      usage: "Tabac blond + hash semi-sec",
      effect: "Barre métallique mouillée, pluie d'été, poussière chaude",
    },
  ];

  const radicaux = [
    {
      name: "Pétrichor Radioactif",
      subtitle: "Pluie sur sol irradié, métal brûlant, ozone déchiré",
      formula: "Mitti Attar 0.10 • Juniper 0.15 • Makrut 0.07 • Frankincense Noir 0.12 • Ambergris 0.03 • Spikenard 0.08 • Vetiver Assam pyrolysé 0.02",
      effect: "Poussière jaune soufflée, pluie sale, sol qui ne vit plus",
      usage: "Installation immersive zone contaminée, réflexion post-catastrophe",
    },
    {
      name: "Pétrichor sur Béton Humain",
      subtitle: "Pluie sur béton, poussière de ciment, eau stagnante urbaine",
      formula: "Mitti 0.12 • Vetiver Haiti 0.18 • Frankincense 0.15 • Palo Santo 0.05 • Makrut 0.03 • Ambergris 0.02",
      effect: "Petrichor d'une ville vide : poussière de béton mouillée + solvant léger",
      usage: "Installation ville après la pluie, sculpture olfactive béton-mouillé",
    },
    {
      name: "Pétrichor sur Cendres Humaines",
      subtitle: "Pluie sur cendre tiède, odeur minérale post-incinération",
      formula: "Mitti 0.20 • Frankincense Noir 0.10 • Oud Tea 0.05 • Santal 0.06 • Ambergris 0.03 • Spikenard 0.05",
      effect: "Pluie sur cendres humaines encore chaudes — minéral blanc, trace animale, humidité froide",
      usage: "Performance sur mémoire, deuil, rite • Protocole théorique dissolution-identité",
    },
    {
      name: "Pétrichor sur Fer Rouge",
      subtitle: "Pluie hurlante sur fer incandescent",
      formula: "Juniper 0.15 • Makrut 0.08 • Mitti 0.10 • Vetiver Assam 0.12 • Frankincense 0.07 • Ambergris 0.02",
      effect: "Explosion vapeur / eau sur métal brûlant. Choc thermique en deux phases : chaude puis froide",
      usage: "Installation avec éléments métalliques chauffés, recherche transformation matière → énergie",
    },
    {
      name: "Pétrichor Sépulcral",
      subtitle: "Pluie sur vieille tombe ouverte — pierre + bois pourri + tissu humide",
      formula: "Mitti 0.25 • Vetiver Assam 0.15 • Frankincense Noir 0.10 • Palo Santo 0.05 • Spikenard 0.08 • Ambergris 0.03",
      effect: "Pluie sur terre retournée, humidité ancienne + fibres décomposées",
      usage: "Installation immersive temps profond, œuvre mémorielle archéologique",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-blue-50/50 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/gammes">
                <a className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour aux Gammes
                </a>
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Droplets className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Pétrichor
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    L'odeur de la pluie sur la terre
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">60 variations</Badge>
                <Badge variant="outline">Recherche 2020-2025</Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Le <strong>pétrichor</strong> est le nom scientifique de l'odeur caractéristique qui se dégage lorsque la pluie tombe sur un sol sec. Ce phénomène olfactif, découvert en 1964 par deux chercheurs australiens, résulte de la libération de composés organiques (géosmine, huiles végétales) emprisonnés dans la terre et la roche. PERFUMUM explore ce territoire sensoriel à travers <strong>60 variations</strong> qui interrogent les transformations de la matière, les effets thermiques et les pratiques culturelles.
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
                Les accords maîtres constituent le <strong>cœur de la gamme Pétrichor</strong>. Chacun explore une facette du phénomène : terre vive, tabac fermenté, minéral froid, floral salé, animal fumé, métallique humide. Chaque accord possède plusieurs variations qui permettent d'affiner le profil olfactif selon l'usage.
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
                        <Beaker className="h-6 w-6 text-blue-600 flex-shrink-0" />
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

        {/* Série Radicale */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="h-8 w-8 text-orange-600" />
                <h2 className="text-3xl font-bold">
                  Série Radicale — Radicalis Extremis
                </h2>
              </div>
              <p className="text-muted-foreground mb-8 max-w-3xl">
                Ces cinq accords sont des <strong>extensions extrêmes du phénomène du pétrichor</strong>, chacun conçu comme un <strong>dispositif sensoriel</strong>, pas comme un parfum. Ils interrogent des situations limites : pluie sur sol irradié, béton humain, cendres humaines, fer rouge, tombe ouverte. <strong>Non destinés à un usage commercial</strong>. Œuvres olfactives uniquement.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                {radicaux.map((accord, index) => (
                  <Card key={index} className="shadow-sm border-l-4 border-l-orange-500">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{accord.name}</CardTitle>
                          <CardDescription className="text-base">{accord.subtitle}</CardDescription>
                        </div>
                        <Wind className="h-6 w-6 text-orange-600 flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Architecture</h4>
                        <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                          {accord.formula}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Effet</h4>
                        <p className="text-sm text-muted-foreground italic">{accord.effect}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Usage artistique</h4>
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
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Approche de Recherche
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Phénomène Scientifique</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Le pétrichor est un <strong>phénomène olfactif documenté scientifiquement</strong> depuis 1964. PERFUMUM l'explore non pas pour le reproduire fidèlement mais pour en faire un <strong>point de départ conceptuel</strong> : que signifie l'odeur de la pluie sur différentes matières (terre, béton, métal, cendre) ? Comment traduire ces transformations en formules olfactives ?
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Variations Systématiques</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Chaque accord maître est décliné en <strong>variations systématiques</strong> qui modifient l'intensité, la température, la texture. Cette approche permet d'explorer l'espace olfactif de manière méthodique et de documenter les effets de chaque transformation. Les 60 variations forment un <strong>corpus cohérent</strong> qui peut être consulté, comparé, analysé.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dimension Artistique</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    La série radicale (Radicalis Extremis) pousse l'exploration jusqu'à des <strong>situations limites</strong> : pluie sur sol irradié, cendres humaines, fer rouge. Ces accords ne sont pas des parfums mais des <strong>dispositifs conceptuels</strong> qui interrogent la transformation de la matière, la mémoire, le deuil, la violence. Ils sont destinés à des <strong>installations artistiques</strong> ou des <strong>performances</strong>.
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
