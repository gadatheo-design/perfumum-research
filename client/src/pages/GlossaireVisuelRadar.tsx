// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Flame, Droplets, Leaf, Candy, Spade, Mountain } from "lucide-react";

export default function GlossaireVisuelRadar() {
  const radarAxes = [
    {
      icon: Flame,
      name: "Intensité",
      description: "Force de projection olfactive et persistance dans l'air",
      color: "text-red-600",
      bgColor: "bg-red-50",
      scale: "0 = Discret, subtil · 100 = Puissant, envahissant",
      examples: [
        { name: "Géosmine", value: 95, id: 1, description: "Odeur de terre mouillée extrêmement puissante, détectable à 5 ppt" },
        { name: "Linalol", value: 65, id: 2, description: "Floral doux, présence modérée mais persistante" },
        { name: "Vanilline", value: 75, id: 3, description: "Sucrée gourmande, projection moyenne-forte" }
      ],
      comparisons: [
        "Géosmine (95) vs Linalol (65) : Différence de 30 points = Géosmine 2× plus intense",
        "Molécules à haute intensité (>80) : utilisées en traces (0.001-0.1%)",
        "Molécules à faible intensité (<40) : peuvent être utilisées jusqu'à 10-20%"
      ]
    },
    {
      icon: Droplets,
      name: "Fraîcheur",
      description: "Notes aqueuses, mentholées, citriques et ozones",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      scale: "0 = Chaud, sec · 100 = Frais, aquatique",
      examples: [
        { name: "Limonène", value: 95, id: 4, description: "Agrume pur, zeste de citron, fraîcheur éclatante" },
        { name: "α-Pinène", value: 85, id: 5, description: "Conifère frais, résine verte, air de montagne" },
        { name: "Ambroxan", value: 20, id: 6, description: "Ambre chaud, sec, opposé à la fraîcheur" }
      ],
      comparisons: [
        "Limonène (95) vs Ambroxan (20) : Contraste maximal chaud/froid",
        "Notes de tête fraîches (>80) : évaporent rapidement (15-30min)",
        "Fraîcheur + Chaleur élevées = Contraste dynamique (ex: menthe + vanille)"
      ]
    },
    {
      icon: Leaf,
      name: "Chaleur",
      description: "Notes fumées, torréfiées, boisées et résineuses",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      scale: "0 = Froid, aérien · 100 = Chaud, fumé",
      examples: [
        { name: "Vétiver", value: 90, id: 7, description: "Racine fumée, boisé profond, chaleur terreuse" },
        { name: "Palo Santo", value: 85, id: 8, description: "Bois sacré, résine chaude, fumée douce" },
        { name: "Makrut Lime", value: 15, id: 9, description: "Agrume vert froid, absence de chaleur" }
      ],
      comparisons: [
        "Vétiver (90) vs Makrut (15) : Écart de 75 points = Opposés polaires",
        "Chaleur + Terreux élevés (>80 chacun) = Profil boisé-fumé classique",
        "Chaleur sans Terreux = Fumé aérien (encens, résine pure)"
      ]
    },
    {
      icon: Candy,
      name: "Douceur",
      description: "Notes sucrées, miellées, fruitées et lactées",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      scale: "0 = Amer, sec · 100 = Sucré, gourmand",
      examples: [
        { name: "Vanilline", value: 90, id: 3, description: "Vanille pure, douceur gourmande maximale" },
        { name: "δ-Décalactone", value: 80, id: 10, description: "Pêche lactée, douceur fruitée crémeuse" },
        { name: "Skatole", value: 10, id: 11, description: "Animal sec, absence totale de douceur" }
      ],
      comparisons: [
        "Vanilline (90) vs Skatole (10) : Contraste doux/animal extrême",
        "Douceur + Épicé faibles (<30) = Profil sec, minéral",
        "Douceur élevée (>80) + Chaleur basse (<30) = Gourmand frais (fruits rouges)"
      ]
    },
    {
      icon: Spade,
      name: "Épicé",
      description: "Notes poivrées, piquantes, aromatiques et chaudes",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      scale: "0 = Doux, neutre · 100 = Piquant, épicé",
      examples: [
        { name: "β-Caryophyllène", value: 95, id: 12, description: "Poivre noir pur, piquant intense, chaleur épicée" },
        { name: "Eugénol", value: 85, id: 13, description: "Clou de girofle, épicé aromatique chaud" },
        { name: "Linalol", value: 25, id: 2, description: "Floral doux, très peu épicé" }
      ],
      comparisons: [
        "Caryophyllène (95) vs Linalol (25) : Différence de 70 points = Contraste épicé/floral",
        "Épicé + Chaleur élevés (>80) = Profil oriental classique",
        "Épicé + Fraîcheur élevés (>80) = Épices vertes (basilic, estragon)"
      ]
    },
    {
      icon: Mountain,
      name: "Terreux",
      description: "Notes de terre, minéral, boisé et végétal sec",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      scale: "0 = Aérien, floral · 100 = Terre, minéral",
      examples: [
        { name: "Géosmine", value: 100, id: 1, description: "Terre mouillée pure, minéral absolu" },
        { name: "Vétiver", value: 90, id: 7, description: "Racine terreuse, boisé profond" },
        { name: "Neroli", value: 15, id: 14, description: "Fleur d'oranger aérienne, peu terreux" }
      ],
      comparisons: [
        "Géosmine (100) vs Neroli (15) : Écart maximal terre/fleur",
        "Terreux + Fraîcheur élevés (>70) = Pétrichor (terre + pluie)",
        "Terreux + Douceur élevés (>70) = Boisé lactonique (santal crémeux)"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Glossaire Visuel Radar
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Comprendre les 6 axes du profil olfactif radar utilisés dans la méthodologie ABSORBE et le système PERFUMUM.
              </p>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground">
                  Chaque molécule est caractérisée par 6 valeurs (0-100) qui définissent son profil olfactif. Ces axes permettent de comparer objectivement les molécules, d'identifier des synergies et de prédire l'évolution aromatique des formulations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Axes Radar */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-12">
              {radarAxes.map((axis, index) => {
                const Icon = axis.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-lg ${axis.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`h-8 w-8 ${axis.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-3xl mb-2">{axis.name}</CardTitle>
                          <CardDescription className="text-base mb-3">
                            {axis.description}
                          </CardDescription>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-mono">{axis.scale}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Exemples de molécules */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Molécules représentatives</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                          {axis.examples.map((example, idx) => (
                            <Link key={idx} href={`/molecule/${example.id}`}>
                              <div className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{example.name}</h4>
                                  <Badge variant="secondary" className="text-lg px-3 py-1">
                                    {example.value}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{example.description}</p>
                                {/* Barre de progression visuelle */}
                                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${axis.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${example.value}%` }}
                                  />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Comparaisons et insights */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Comparaisons et insights</h3>
                        <div className="space-y-2">
                          {axis.comparisons.map((comparison, idx) => (
                            <div key={idx} className="border-l-4 border-primary/20 pl-4 py-2 text-sm">
                              {comparison}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Guide d'utilisation */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Guide d'utilisation des profils radar</h2>
              <div className="prose prose-lg max-w-none space-y-4">
                <div className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="text-xl font-semibold mb-2">1. Identifier les contrastes</h3>
                  <p className="text-muted-foreground">
                    Un écart de plus de 50 points entre deux molécules sur un axe crée un contraste marqué. Exemple : Géosmine (Terreux 100) vs Neroli (Terreux 15) = contraste terre/fleur maximal.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="text-xl font-semibold mb-2">2. Calculer la similarité</h3>
                  <p className="text-muted-foreground">
                    La distance euclidienne entre deux profils radar indique leur similarité olfactive. Une distance inférieure à 30 suggère une synergie potentielle. Utilisez le <Link href="/compare-radar" className="text-primary hover:underline">Comparateur Radar</Link> pour calculer automatiquement.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="text-xl font-semibold mb-2">3. Prédire l'évolution aromatique</h3>
                  <p className="text-muted-foreground">
                    Les molécules à haute Fraîcheur (supérieure à 80) évaporent rapidement (notes de tête). Les molécules à haute Chaleur + Terreux (supérieurs à 70 chacun) persistent longtemps (notes de fond). Combinez les deux pour créer une pyramide olfactive équilibrée.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6 py-2">
                  <h3 className="text-xl font-semibold mb-2">4. Explorer les gammes PERFUMUM</h3>
                  <p className="text-muted-foreground">
                    Chaque gamme a un profil radar caractéristique : <strong>Pétrichor</strong> (Terreux + Fraîcheur élevés), <strong>Volcanique</strong> (Chaleur + Épicé élevés), <strong>Glaciaire</strong> (Fraîcheur maximale, Chaleur minimale), <strong>Bio-Lab</strong> (Douceur + Intensité élevés).
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/compare-radar">
                  <button className="btn-enhanced px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    Comparer des profils radar
                  </button>
                </Link>
                <Link href="/molecules">
                  <button className="btn-enhanced px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors">
                    Explorer les 209 molécules
                  </button>
                </Link>
                <Link href="/methode-absorbe">
                  <button className="btn-enhanced px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors">
                    Méthodologie ABSORBE
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
