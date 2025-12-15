import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Dna, Microscope, Beaker } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { Link } from "wouter";
import { GammeBadge } from "@/components/GammeBadge";
import { VoirAussi } from "@/components/VoirAussi";

export default function GammesBioLab() {
  const accords = [
    {
      name: "Bio-Lab Résine Pure",
      subtitle: "Extrait CBD + résine vive + fraîcheur verte",
      formula: "CBD Isolate 0.20% • Pinène 0.15% • Limonène 0.12% • Myrcène 0.10% • Linalool 0.08%",
      variations: ["Résine-Intense (+CBD 0.05)", "Résine-Légère (CBD 0.15)"],
      usage: "Résines CBD pures, isolats, cristaux",
      effect: "Résine fraîche, extrait pur, laboratoire propre",
    },
    {
      name: "Bio-Lab Terpène Expérimental",
      subtitle: "Profil terpénique amplifié + biotechnologie",
      formula: "Myrcène 0.18% • Caryophyllène 0.15% • Pinène 0.12% • Limonène 0.10% • Humulène 0.08%",
      variations: ["Terpène-Fort (+Myrcène 0.05)", "Terpène-Équilibré (tous à 0.12)"],
      usage: "Hash terpénique, live resin, full spectrum",
      effect: "Profil terpénique saturé, biotechnologie olfactive",
    },
    {
      name: "Bio-Lab Extraction Froide",
      subtitle: "Ice-O-Lator + fraîcheur + pureté cristalline",
      formula: "CBD Isolate 0.15% • Pinène 0.12% • Menthe 0.08% • Eucalyptus 0.06% • Limonène 0.10%",
      variations: ["Extraction-Pure (+CBD 0.05)", "Extraction-Mentholée (+Menthe 0.05)"],
      usage: "Ice-O-Lator, Frozen Sift, extractions à froid",
      effect: "Pureté cristalline, fraîcheur de laboratoire, extraction propre",
    },
    {
      name: "Bio-Lab Molécule Synthétique",
      subtitle: "Synthèse chimique + odeur de laboratoire + précision",
      formula: "Aldéhyde C12 0.10% • Calone 0.08% • Iso E Super 0.12% • Ambroxan 0.10% • Hedione 0.08%",
      variations: ["Synthèse-Propre (+Calone 0.05)", "Synthèse-Chaude (+Ambroxan 0.05)"],
      usage: "Recherche moléculaire, compositions expérimentales",
      effect: "Laboratoire chimique, synthèse propre, odeur de précision",
    },
  ];

  const radicaux = [
    {
      name: "Bio-Lab Transgénique",
      subtitle: "Organisme modifié, ADN recombiné, odeur post-naturelle",
      formula: "Iso E Super 0.20 • Calone 0.15 • Aldéhyde C12 0.12 • Ambroxan 0.10 • Hedione 0.08",
      effect: "Odeur d'un organisme qui n'existe pas encore, biotechnologie olfactive",
      usage: "Installation immersive biotech, performance sur le vivant modifié",
    },
    {
      name: "Bio-Lab Protocole Zéro",
      subtitle: "Extraction absolue, pureté maximale, absence de trace",
      formula: "CBD Isolate 0.25 • Pinène 0.15 • Limonène 0.12 • Calone 0.08",
      effect: "Pureté absolue, laboratoire stérile, absence d'odeur parasite",
      usage: "Installation sur la pureté, recherche sur l'absence",
    },
    {
      name: "Bio-Lab Fermentation Contrôlée",
      subtitle: "Culture bactérienne, fermentation dirigée, odeur vivante",
      formula: "Myrcène 0.18 • Caryophyllène 0.15 • Spikenard 0.10 • Oud Tea 0.08 • Vetiver 0.06",
      effect: "Fermentation en cours, culture vivante, odeur de transformation",
      usage: "Installation bioart, performance sur la fermentation",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col theme-biolab">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-pink-50/50 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/gammes">
                <a className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour aux Gammes
                </a>
              </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-pink-50 flex items-center justify-center">
                  <FlaskConical className="h-8 w-8 text-pink-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Bio-Lab
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Expérimental, biotechnologie et précision moléculaire
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                <GammeBadge gamme="biolab" size="md" />
<Badge variant="secondary">7 variations</Badge>
                <Badge variant="outline" className="bg-pink-50">15 molécules clés</Badge>
                <Badge variant="outline">Recherche 2024-2025</Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                La gamme <strong>Bio-Lab</strong> explore les territoires olfactifs de la biotechnologie, de l'extraction pure et de la synthèse moléculaire. Inspirée des laboratoires de recherche, des protocoles d'extraction et des manipulations génétiques, cette gamme articule pureté cristalline, précision chimique et expérimentation sur le vivant. PERFUMUM développe <strong>7 variations</strong> qui interrogent les frontières entre naturel et synthétique, extraction et création, pureté et contamination.
              </p>
            </div>
          </div>
        </section>

        {/* Accords Maîtres */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                4 Accords Maîtres
              </h2>
              <p className="text-muted-foreground mb-12 max-w-3xl">
                Les accords maîtres de la gamme Bio-Lab explorent quatre axes : <strong>résine pure</strong>, <strong>terpène expérimental</strong>, <strong>extraction froide</strong> et <strong>molécule synthétique</strong>. Chaque accord possède des variations pour affiner la pureté et l'intensité moléculaire.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                {accords.map((accord, index) => (
                  <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{accord.name}</CardTitle>
                          <CardDescription className="text-base italic">
                            {accord.subtitle}
                          </CardDescription>
                        </div>
                        <FlaskConical className="h-6 w-6 text-pink-600 shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Formule</p>
                        <code className="text-sm bg-muted px-3 py-2 rounded block">
                          {accord.formula}
                        </code>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Variations</p>
                        <div className="flex flex-wrap gap-2">
                          {accord.variations.map((variation, i) => (
                            <Badge key={i} variant="outline">{variation}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Usage</p>
                        <p className="text-sm">{accord.usage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Effet</p>
                        <p className="text-sm italic">{accord.effect}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Radicaux */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">
                3 Radicaux Expérimentaux
              </h2>
              <p className="text-muted-foreground mb-12 max-w-3xl">
                Les radicaux Bio-Lab poussent l'expérimentation vers des <strong>territoires post-naturels</strong> : transgénique, protocole zéro, fermentation contrôlée. Ces compositions ne sont pas destinées à un usage quotidien mais à des installations bioart, performances sur le vivant modifié ou recherches phénoménologiques sur la pureté et la contamination.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                {radicaux.map((radical, index) => (
                  <Card key={index} className="shadow-sm hover:shadow-md transition-shadow border-pink-200">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{radical.name}</CardTitle>
                          <CardDescription className="text-base italic">
                            {radical.subtitle}
                          </CardDescription>
                        </div>
                        <Dna className="h-6 w-6 text-pink-600 shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Formule</p>
                        <code className="text-sm bg-muted px-3 py-2 rounded block">
                          {radical.formula}
                        </code>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Effet</p>
                        <p className="text-sm italic">{radical.effect}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Usage</p>
                        <p className="text-sm">{radical.usage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <GammesConnexes 
          currentGamme="biolab" 
          relatedGammes={["petrichor", "volcanique", "glaciaire"]} 
        />

        {/* Molécules Clés */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">15 Molécules Clés</h2>
              <p className="text-muted-foreground mb-8">
                La gamme Bio-Lab combine molécules naturelles et synthétiques pour créer des profils olfactifs post-naturels.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: "CBD Isolate", role: "Base résineuse", color: "bg-green-100" },
                  { name: "Pinène", role: "Fraîcheur conifère", color: "bg-emerald-100" },
                  { name: "Limonène", role: "Citrus vif", color: "bg-yellow-100" },
                  { name: "Myrcène", role: "Terré herbacé", color: "bg-lime-100" },
                  { name: "Linalool", role: "Floral doux", color: "bg-purple-100" },
                  { name: "Caryophyllène", role: "Épicé boisé", color: "bg-amber-100" },
                  { name: "Humulène", role: "Houblon terré", color: "bg-orange-100" },
                  { name: "Iso E Super", role: "Bois velouté", color: "bg-stone-100" },
                  { name: "Calone", role: "Ozone marin", color: "bg-cyan-100" },
                  { name: "Aldéhyde C12", role: "Métallique propre", color: "bg-slate-100" },
                  { name: "Ambroxan", role: "Ambre synthétique", color: "bg-rose-100" },
                  { name: "Hedione", role: "Jasmin transparent", color: "bg-pink-100" },
                  { name: "Spikenard", role: "Fermenté terreux", color: "bg-brown-100" },
                  { name: "Oud Tea", role: "Bois fermenté", color: "bg-red-100" },
                  { name: "Vetiver", role: "Racine terreuse", color: "bg-teal-100" },
                ].map((mol, i) => (
                  <div key={i} className={`p-3 rounded-lg ${mol.color}`}>
                    <p className="font-medium text-sm">{mol.name}</p>
                    <p className="text-xs text-muted-foreground">{mol.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Méthodologie */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Méthodologie</h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Beaker className="h-5 w-5" />
                      Pureté Moléculaire
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      La gamme Bio-Lab privilégie les <strong>molécules isolées</strong> (CBD isolate, terpènes purs, synthèses chimiques) pour créer des compositions d'une précision extrême. Cette approche permet de contrôler chaque paramètre olfactif et d'explorer les limites de la pureté.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Microscope className="h-5 w-5" />
                      Biotechnologie Olfactive
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Les radicaux Bio-Lab explorent la notion de <strong>biotechnologie olfactive</strong> : comment créer des odeurs qui n'existent pas dans la nature ? Comment manipuler le vivant pour produire de nouvelles molécules ? Ces questions guident la recherche sur les organismes transgéniques et les fermentations contrôlées.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Dna className="h-5 w-5" />
                      Post-Naturalité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      La gamme Bio-Lab interroge la frontière entre <strong>naturel et synthétique</strong>. Les compositions utilisent à la fois des extraits naturels (CBD, terpènes) et des molécules de synthèse (Iso E Super, Calone) pour créer des odeurs hybrides qui questionnent notre rapport au vivant modifié.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        {/* Voir aussi */}
        <VoirAussi 
          items={[
            { title: "Gamme Glaciaire", description: "Fraîcheur et ozone", href: "/gammes/glaciaire", badge: "7 variations" },
            { title: "Gamme Volcanique", description: "Géologie incandescente", href: "/gammes/volcanique", badge: "36 variations" },
            { title: "Chimie du Tabac", description: "Esters aromatiques", href: "/chimie-tabac", badge: "13 molécules" },
            { title: "Synergies moléculaires", description: "Interactions terpènes-niches", href: "/synergies-terpenes-niches" },
          ]} 
        />
      </main>
      <Footer />
    </div>
  );
}
