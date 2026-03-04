// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Dna, Brain, Sparkles } from "lucide-react";
import { GammesConnexes } from "@/components/GammesConnexes";
import { CascadeBiosynthetique } from "@/components/CascadeBiosynthetique";
import { ProtocolesDilution } from "@/components/ProtocolesDilution";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function GammePheromones() {
  // Récupérer les molécules phéromones depuis la base de données
  const { data: molecules, isLoading } = trpc.molecules.list.useQuery();
  
  const pheromones = molecules?.filter((m: { family: string | null; name: string }) => 
    m.family === 'Phéromone' || 
    m.name?.toLowerCase().includes('androst')
  ) || [];

  const accords = [
    {
      name: "Pheromona Truffle",
      subtitle: "Androsténol + truffe noire + musc animal",
      formula: "Androsténol 0.0005% • Truffe Noire 0.15% • Musc 0.12% • Ambroxan 0.10%",
      variations: ["Truffle-Intense (+Truffe 0.05)", "Truffle-Subtil (Androsténol 0.0003)"],
      usage: "Parfums de séduction, compositions animales subtiles",
      effect: "Attraction subliminale, profondeur terreuse, mystère animal",
    },
    {
      name: "Pheromona Skin",
      subtitle: "Androstadienone + peau propre + musqué doux",
      formula: "Androstadienone 0.001% • Iso E Super 0.15% • Hedione 0.12% • Musc Blanc 0.10%",
      variations: ["Skin-Clean (+Hedione 0.05)", "Skin-Warm (+Ambroxan 0.05)"],
      usage: "Parfums \"seconde peau\", compositions intimes",
      effect: "Proximité olfactive, confort, intimité",
    },
    {
      name: "Pheromona Alpha",
      subtitle: "Androsténone + bois + dominance",
      formula: "Androsténone 0.0008% • Cèdre 0.18% • Vétiver 0.15% • Cuir 0.10%",
      variations: ["Alpha-Boisé (+Cèdre 0.05)", "Alpha-Cuiré (+Cuir 0.05)"],
      usage: "Parfums masculins affirmés, compositions de caractère",
      effect: "Présence, assurance, charisme olfactif",
    },
    {
      name: "Pheromona Cascade",
      subtitle: "Trio phéromonal + évolution temporelle",
      formula: "Androstadienone 0.0008% → Androsténone 0.0005% → Androsténol 0.0003%",
      variations: ["Cascade-Rapide (2h)", "Cascade-Lente (8h)"],
      usage: "Compositions évolutives, parfums de longue tenue",
      effect: "Évolution olfactive mimant le cycle naturel des phéromones",
    },
  ];

  const recherches = [
    {
      name: "Voie Biosynthétique",
      description: "Androstadienol → Androstadienone → Androsténone → Androsténol",
      enzymes: "3β-HSD, 5α-réductase, 3-cétostéroïde réductase",
      application: "Comprendre la cascade enzymatique pour optimiser les dosages",
    },
    {
      name: "Récepteur OR7D4",
      description: "Polymorphisme génétique affectant la perception de l'Androsténone",
      variantes: "RT/RT (urineux), RT/WM (boisé/floral), WM/WM (anosmie)",
      application: "Adapter les compositions selon les profils génétiques",
    },
    {
      name: "Seuils de Détection",
      description: "Androsténone : 0.2 ppb à 0.2 ppm (variable selon génotype)",
      facteur: "Facteur 1000x entre les individus les plus et moins sensibles",
      application: "Dosages infinitésimaux pour effet subliminal",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-rose-50/50 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Link href="/gammes" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                  ← Retour aux Gammes
                </Link>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-rose-50 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-rose-600" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                    Phéromones
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Communication chimique, attraction et biosynthèse stéroïdienne
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-6 flex-wrap">
                <Badge variant="secondary" className="bg-rose-100">Gamme Expérimentale</Badge>
                <Badge variant="secondary">{pheromones.length} molécules</Badge>
                <Badge variant="outline" className="bg-rose-50">4 accords</Badge>
                <Badge variant="outline">Recherche 2024-2025</Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                La gamme <strong>Phéromones</strong> explore les molécules de communication chimique humaine : 
                <strong> Androsténol</strong> (truffe, musc terreux), <strong>Androsténone</strong> (urineux/boisé selon génotype) 
                et <strong>Androstadienone</strong> (musqué subtil). Ces stéroïdes 16-androstènes, présents naturellement 
                dans la sueur et les sécrétions, sont utilisés à doses infinitésimales pour créer des compositions 
                aux effets subliminaux. PERFUMUM développe <strong>4 accords maîtres</strong> qui interrogent les frontières 
                entre parfumerie et neurobiologie.
              </p>
            </div>
          </div>
        </section>

        {/* Molécules Phéromones */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Dna className="h-8 w-8 text-rose-600" />
                Les 3 Phéromones Stéroïdiennes
              </h2>
              <p className="text-muted-foreground mb-8 max-w-3xl">
                Ces trois molécules forment une cascade biosynthétique : l'Androstadienone est le précurseur 
                de l'Androsténone, qui peut être convertie en Androsténol. Chacune possède un profil olfactif 
                et des effets psychophysiologiques distincts.
              </p>
              
              {/* Graphique de la cascade biosynthétique */}
              <div className="mb-12">
                <CascadeBiosynthetique />
              </div>
              
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Chargement des molécules...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pheromones.map((mol: { id: number; name: string; chemicalFormula: string | null; olfactiveProfile: string | null; family: string | null; radarIntensity: number | null; radarEarthiness: number | null }) => (
                    <Link key={mol.id} href={`/molecules/${mol.id}`}>
                      <Card className="shadow-sm hover:shadow-lg transition-all cursor-pointer border-rose-200 hover:border-rose-400">
                        <CardHeader>
                          <CardTitle className="text-xl">{mol.name}</CardTitle>
                          <CardDescription className="font-mono text-sm">
                            {mol.chemicalFormula || 'C₁₉H₃₀O'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Profil olfactif</p>
                            <p className="text-sm line-clamp-3">{mol.olfactiveProfile || mol.family}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              Intensité: {mol.radarIntensity || 50}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Terreux: {mol.radarEarthiness || 50}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Accords Maîtres */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-rose-600" />
                4 Accords Maîtres
              </h2>
              <p className="text-muted-foreground mb-12 max-w-3xl">
                Les accords maîtres de la gamme Phéromones explorent quatre axes : <strong>truffe animale</strong>, 
                <strong> peau propre</strong>, <strong>dominance boisée</strong> et <strong>cascade évolutive</strong>. 
                Chaque accord utilise des doses infinitésimales de phéromones (0.0003% à 0.001%) pour un effet subliminal.
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
                        <Heart className="h-6 w-6 text-rose-600 shrink-0" />
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Usage</p>
                          <p className="text-sm">{accord.usage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Effet</p>
                          <p className="text-sm italic">{accord.effect}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recherche & Méthodologie */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Brain className="h-8 w-8 text-rose-600" />
                Recherche & Méthodologie
              </h2>
              <p className="text-muted-foreground mb-12 max-w-3xl">
                L'utilisation des phéromones en parfumerie nécessite une compréhension approfondie de leur 
                biosynthèse, de leur perception génétiquement variable, et de leurs seuils de détection 
                extrêmement bas.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recherches.map((item, index) => (
                  <Card key={index} className="shadow-sm border-rose-200">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{item.description}</p>
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium">
                          {item.enzymes && `Enzymes: ${item.enzymes}`}
                          {item.variantes && `Variantes: ${item.variantes}`}
                          {item.facteur && `Facteur: ${item.facteur}`}
                        </p>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-rose-600">Application</p>
                        <p className="text-sm">{item.application}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Protocoles de Dilution */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <ProtocolesDilution />
            </div>
          </div>
        </section>

        {/* Avertissement */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-amber-800">
                    <strong>Note de recherche :</strong> Les effets des phéromones humaines restent scientifiquement 
                    débattus. Si l'Androsténone et l'Androstadienone ont montré des effets mesurables sur l'humeur 
                    et l'attention dans certaines études, leur qualification de "phéromones" au sens strict 
                    (communication chimique inconsciente) n'est pas établie. Les compositions PERFUMUM utilisent 
                    ces molécules pour leur intérêt olfactif et conceptuel, sans prétendre à des effets garantis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <GammesConnexes 
          currentGamme="pheromones" 
          relatedGammes={["biolab", "signatures", "traditions"]} 
        />
      </main>

      <Footer />
    </div>
  );
}
