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

        {/* 6 Molecular Families */}
        <section className="py-16 bg-gradient-to-b from-background to-amber-50/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                6 Familles Moléculaires Royal Mossi
              </h2>
              <p className="text-muted-foreground mb-12 max-w-3xl">
                L'analyse moléculaire de la gamme Royal Mossi révèle <strong>6 familles chimiques</strong> qui structurent l'identité olfactive sahélienne : sesquiterpènes racinaires (terre, humidité sèche), phénols fumés (bois brûlé), aldéhydes secs (poussière chaude), résines orientales (encens rituel), composés ferriques (terre rouge), et molécules de cuir (animalité noble). Ces <strong>20 molécules-clés</strong> constituent l'architecture olfactive du Sahel.
              </p>
              
              <div className="grid gap-6">
                {/* Famille 1: Sesquiterpènes racinaires */}
                <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-white">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-amber-700">1</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">Sesquiterpènes racinaires</CardTitle>
                        <CardDescription>Terre, humidité sèche, racines profondes</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white/60 rounded-lg p-3 border border-amber-100">
                        <div className="font-semibold text-sm mb-1">Vétivénol (C15H26O)</div>
                        <div className="text-xs text-muted-foreground">racine, terre, humidité sèche</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-amber-100">
                        <div className="font-semibold text-sm mb-1">Vétivone (C15H22O)</div>
                        <div className="text-xs text-muted-foreground">racine sombre, terre humide</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-amber-100">
                        <div className="font-semibold text-sm mb-1">Khusimol (C15H26O)</div>
                        <div className="text-xs text-muted-foreground">boisé, racinaire, velouté</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-amber-100">
                        <div className="font-semibold text-sm mb-1">β-guaïène (C15H24)</div>
                        <div className="text-xs text-muted-foreground">boisé, épicé, terreux</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-amber-100">
                        <div className="font-semibold text-sm mb-1">α-humulène (C15H24)</div>
                        <div className="text-xs text-muted-foreground">houblon, boisé, terreux</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground italic mt-3">
                      <strong>Synergie clé :</strong> Vétiver + Terre rouge ferrique → sol Sahélien sous soleil brûlant
                    </div>
                  </CardContent>
                </Card>

                {/* Famille 2: Phénols & fumées sèches */}
                <Card className="border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-orange-700">2</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">Phénols & fumées sèches</CardTitle>
                        <CardDescription>Bois brûlé, fumée douce, médicinal</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white/60 rounded-lg p-3 border border-orange-100">
                        <div className="font-semibold text-sm mb-1">4-methyl-guaiacol (C8H10O2)</div>
                        <div className="text-xs text-muted-foreground">fumée douce, vanillé fumé</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-orange-100">
                        <div className="font-semibold text-sm mb-1">Phénol boisé (C6H6O)</div>
                        <div className="text-xs text-muted-foreground">fumée, bois brûlé, médicinal</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground italic mt-3">
                      <strong>Synergie clé :</strong> Guaiacol + Vétiver → tambour brûlé après cérémonie
                    </div>
                  </CardContent>
                </Card>

                {/* Famille 3: Aldéhydes secs */}
                <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-white">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-yellow-700">3</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">Aldéhydes secs</CardTitle>
                        <CardDescription>Poussière chaude, métallique, minéral</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white/60 rounded-lg p-3 border border-yellow-100">
                        <div className="font-semibold text-sm mb-1">Aldéhyde C-10 (C10H20O)</div>
                        <div className="text-xs text-muted-foreground">métallique, poussière chaude</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-yellow-100">
                        <div className="font-semibold text-sm mb-1">Aldéhyde C-11 (C11H22O)</div>
                        <div className="text-xs text-muted-foreground">aldéhydique, poudré, chaud</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-yellow-100">
                        <div className="font-semibold text-sm mb-1">Aldéhyde C-12 (C12H24O)</div>
                        <div className="text-xs text-muted-foreground">aldéhydique, métallique, sec</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-yellow-100">
                        <div className="font-semibold text-sm mb-1">Aldéhyde métallique</div>
                        <div className="text-xs text-muted-foreground">métallique, froid, minéral</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground italic mt-3">
                      <strong>Synergie clé :</strong> Aldéhydes + poussière ferrique → vent rouge chaud Sahel
                    </div>
                  </CardContent>
                </Card>

                {/* Famille 4: Résines orientales Mandé */}
                <Card className="border-rose-200 bg-gradient-to-br from-rose-50/50 to-white">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-rose-700">4</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">Résines orientales Mandé</CardTitle>
                        <CardDescription>Encens rituel, balsamique, sacré</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white/60 rounded-lg p-3 border border-rose-100">
                        <div className="font-semibold text-sm mb-1">Furanosesquiterpènes (C15H20O)</div>
                        <div className="text-xs text-muted-foreground">résine, épicé, balsamique</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-rose-100">
                        <div className="font-semibold text-sm mb-1">Furanoeudesmanes (C15H22O)</div>
                        <div className="text-xs text-muted-foreground">résine, boisé, balsamique</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-rose-100">
                        <div className="font-semibold text-sm mb-1">Incensol (C20H34O)</div>
                        <div className="text-xs text-muted-foreground">encens, résine, balsamique</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-rose-100">
                        <div className="font-semibold text-sm mb-1">Incensol acetate (C22H36O2)</div>
                        <div className="text-xs text-muted-foreground">encens, résine douce</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-rose-100">
                        <div className="font-semibold text-sm mb-1">Mechoulim</div>
                        <div className="text-xs text-muted-foreground">résine, balsamique, sacré</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground italic mt-3">
                      <strong>Synergie clé :</strong> Myrrhe + Encens + Terre rouge → liturgie ancestrale Mandé/Mossi
                    </div>
                  </CardContent>
                </Card>

                {/* Famille 5: Composés ferriques & terre rouge */}
                <Card className="border-red-200 bg-gradient-to-br from-red-50/50 to-white">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-red-700">5</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">Composés ferriques & terre rouge</CardTitle>
                        <CardDescription>Métal, poussière rouge, chaleur</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                        <div className="font-semibold text-sm mb-1">Oxydes de fer volatils</div>
                        <div className="text-xs text-muted-foreground">métal, poussière rouge, chaleur</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                        <div className="font-semibold text-sm mb-1">Complexes terre minérale</div>
                        <div className="text-xs text-muted-foreground">terre rouge, poussière chaude</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground italic mt-3">
                      <strong>Signature unique :</strong> Terre rouge sahélienne sous soleil brûlant
                    </div>
                  </CardContent>
                </Card>

                {/* Famille 6: Molécules de cuir */}
                <Card className="border-stone-200 bg-gradient-to-br from-stone-50/50 to-white">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-stone-700">6</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">Molécules de cuir</CardTitle>
                        <CardDescription>Animal, fumé, ambre noir</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white/60 rounded-lg p-3 border border-stone-100">
                        <div className="font-semibold text-sm mb-1">Quinoléine (C9H7N)</div>
                        <div className="text-xs text-muted-foreground">cuir, animal, fumé</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3 border border-stone-100">
                        <div className="font-semibold text-sm mb-1">Labdanum diterpenes (C20H32)</div>
                        <div className="text-xs text-muted-foreground">ambre noir, cuir végétal</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground italic mt-3">
                      <strong>Synergie clé :</strong> Cuir Mossi + Myrrhe → accord sacré-roi
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Architecture Moléculaire */}
              <div className="mt-12 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-xl p-8 border border-amber-200">
                <h3 className="text-2xl font-bold mb-6 text-center">Architecture Moléculaire Royal Mossi</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/80 rounded-lg p-6 border border-amber-200">
                    <div className="text-3xl font-bold text-amber-700 mb-2">60%</div>
                    <div className="font-semibold mb-2">Base (immobile, sacrée)</div>
                    <div className="text-sm text-muted-foreground">Racines + Cuir + Résine</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-6 border border-orange-200">
                    <div className="text-3xl font-bold text-orange-700 mb-2">30%</div>
                    <div className="font-semibold mb-2">Cœur (soleil, poussière)</div>
                    <div className="text-sm text-muted-foreground">Terre rouge + Aldéhydes chauds</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-6 border border-yellow-200">
                    <div className="text-3xl font-bold text-yellow-700 mb-2">10%</div>
                    <div className="font-semibold mb-2">Tête (brillance)</div>
                    <div className="text-sm text-muted-foreground">Minéral + Vent + Lumière sèche</div>
                  </div>
                </div>
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
