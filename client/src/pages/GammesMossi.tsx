import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Beaker } from "lucide-react";
import { Link } from "wouter";

export default function GammesMossi() {
  const accords = [
    {
      name: "Royal Mossi Cuir Tanné",
      subtitle: "Cuir végétal + fumigations + terre sèche",
      formula: "Santal 0.20% • Vetiver Assam 0.15% • Spikenard 0.12% • Frankincense 0.10% • Mitti Attar 0.08% • Palo Santo 0.05%",
      variations: ["Cuir-Fumé (+Palo Santo 0.08)", "Cuir-Sec (Mitti 0.05)", "Cuir-Résine (+Frankincense 0.08)"],
      usage: "Résines nobles, hash artisanal, installations anthropologiques",
      effect: "Cuir tanné végétal, fumigations rituelles, terre sèche sahélienne",
    },
    {
      name: "Royal Mossi Fumigations",
      subtitle: "Fumée rituelle + bois sacré + résine noire",
      formula: "Frankincense Noir 0.25% • Palo Santo 0.15% • Spikenard 0.10% • Vetiver Haiti 0.10% • Oud Tea 0.05% • Ambergris 0.02%",
      variations: ["Fumigation-Dense (+Frankincense 0.10)", "Fumigation-Bois (+Palo Santo 0.10)", "Fumigation-Animal (+Spikenard 0.08)"],
      usage: "Encens rituels, résines cérémonielles, performances olfactives",
      effect: "Fumée rituelle épaisse, bois sacré brûlé, résine noire",
    },
    {
      name: "Royal Mossi Peaux Tannées",
      subtitle: "Peau animale + fumée + terre rouge",
      formula: "Spikenard 0.18% • Santal 0.15% • Vetiver Assam 0.12% • Mitti Attar 0.10% • Frankincense 0.08% • Ambergris 0.03%",
      variations: ["Peau-Fumée (+Frankincense 0.08)", "Peau-Terre (+Mitti 0.08)", "Peau-Animal (+Spikenard 0.10)"],
      usage: "Hash animalier, résines grasses, recherche anthropologique",
      effect: "Peau tannée animale, fumée subtile, terre rouge sahélienne",
    },
    {
      name: "Royal Mossi Bois Sahel",
      subtitle: "Bois sec + poussière + soleil brûlant",
      formula: "Santal 0.22% • Palo Santo 0.15% • Vetiver Haiti 0.12% • Frankincense 0.08% • Mitti Attar 0.05% • Juniper 0.03%",
      variations: ["Bois-Sec (Mitti 0.03)", "Bois-Fumé (+Palo Santo 0.10)", "Bois-Résine (+Frankincense 0.10)"],
      usage: "Tabac blond, résines claires, installations paysage",
      effect: "Bois sahélien sec, poussière chaude, soleil brûlant",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-amber-50/50 to-background">
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
              <div className="flex gap-2 mb-6">
                <Badge variant="secondary">12 variations</Badge>
                <Badge variant="outline">Recherche anthropologique 2023-2025</Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                La gamme <strong>Royal Mossi</strong> explore l'identité olfactive des pratiques Mossi (Burkina Faso, Afrique de l'Ouest) : cuir tanné végétal, fumigations rituelles, peaux tannées, bois sahélien sec. Ces <strong>12 variations</strong> documentent les <strong>systèmes olfactifs non-occidentaux</strong> et leur inscription dans des pratiques sociales, rituelles et matérielles. Cette recherche interroge comment les odeurs structurent l'identité culturelle et les relations au monde dans le contexte sahélien.
              </p>
            </div>
          </div>
        </section>

        {/* Accords Maîtres */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                4 Familles Principales
              </h2>
              <p className="text-muted-foreground mb-12 max-w-3xl">
                Les accords Royal Mossi explorent quatre <strong>territoires olfactifs sahéliens</strong> : le cuir tanné (transformation végétale des peaux), les fumigations (pratiques rituelles), les peaux tannées (animalité noble), et les bois du Sahel (matière sèche brûlée par le soleil). Ces formules sont des <strong>outils de recherche anthropologique</strong> qui documentent les pratiques olfactives d'Afrique de l'Ouest.
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
                        <Beaker className="h-6 w-6 text-amber-600 flex-shrink-0" />
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
                Approche Anthropologique
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Systèmes Olfactifs Non-Occidentaux</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    La gamme Royal Mossi interroge les <strong>pratiques olfactives sahéliennes</strong> : fumigations rituelles, tannage végétal des peaux, usage du bois sec et des résines. Ces pratiques structurent l'identité culturelle Mossi et inscrivent les odeurs dans des <strong>systèmes sociaux et rituels</strong>. Cette recherche documente comment les odeurs sont mobilisées dans des contextes non-occidentaux.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Matières Sahéliennes</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Les accords Royal Mossi utilisent des <strong>matières premières spécifiques</strong> : santal (bois sec), spikenard (animalité noble), mitti attar (terre rouge), palo santo (fumigations), frankincense (résine rituelle). Ces molécules évoquent les <strong>paysages olfactifs du Sahel</strong> : poussière chaude, bois brûlé par le soleil, terre sèche, fumée rituelle.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dimension Éthique</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Cette recherche s'inscrit dans une <strong>approche respectueuse</strong> des pratiques culturelles Mossi. Les accords ne sont pas des reproductions fidèles mais des <strong>interprétations olfactives</strong> qui interrogent les systèmes olfactifs sahéliens. Ils sont destinés à des <strong>installations anthropologiques</strong> ou des <strong>recherches académiques</strong>, pas à une commercialisation exotisante.
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
