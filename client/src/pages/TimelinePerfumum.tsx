import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GammeBadge } from "@/components/GammeBadge";
import { Calendar, Beaker, FlaskConical, TrendingUp, Target } from "lucide-react";

type TimelineEvent = {
  id: number;
  year: number;
  quarter: string;
  title: string;
  description: string;
  category: "gamme" | "prototype" | "synergie" | "milestone";
  gamme?: "petrichor" | "volcanique" | "civilisations" | "glaciaire" | "biolab";
  status: "completed" | "in-progress" | "planned";
};

const timelineEvents: TimelineEvent[] = [
  // 2025
  {
    id: 1,
    year: 2025,
    quarter: "Q1",
    title: "Lancement Projet PERFUMUM",
    description: "Initialisation recherche longitudinale 10 ans : design terpénique, résines CBD, tabacs rares",
    category: "milestone",
    status: "completed"
  },
  {
    id: 2,
    year: 2025,
    quarter: "Q2",
    title: "Gamme Pétrichor — Exploration",
    description: "Développement accords terre/minéral/pluie : Terre Humide, Ozone Post-Pluie, Pierre Mouillée",
    category: "gamme",
    gamme: "petrichor",
    status: "completed"
  },
  {
    id: 3,
    year: 2025,
    quarter: "Q3",
    title: "Gamme Volcanique — Pyrolyse",
    description: "Recherche fumée/combustion : Bois Brûlé, Cendre Chaude, Fumée Douce, Tabac Pyrolysé",
    category: "gamme",
    gamme: "volcanique",
    status: "completed"
  },
  {
    id: 4,
    year: 2025,
    quarter: "Q4",
    title: "Prototype C1 — Clarus Verde",
    description: "Premier prototype gamme Pétrichor : fraîcheur verte + minéralité + notes aquatiques",
    category: "prototype",
    gamme: "petrichor",
    status: "completed"
  },
  {
    id: 5,
    year: 2025,
    quarter: "Q4",
    title: "41 Synergies Documentées",
    description: "Matrice Tabacs × Molécules : 8 tabacs, 131 molécules, 28 familles chimiques",
    category: "synergie",
    status: "completed"
  },

  // 2026
  {
    id: 6,
    year: 2026,
    quarter: "Q1",
    title: "Gamme Civilisations — Anthropologie Olfactive",
    description: "Recherche Royal Mossi : systèmes olfactifs sahéliens, fumigations rituelles, matières culturelles",
    category: "gamme",
    gamme: "civilisations",
    status: "in-progress"
  },
  {
    id: 7,
    year: 2026,
    quarter: "Q2",
    title: "Gamme Glaciaire — Fraîcheur Structurée",
    description: "Exploration ozone/menthe/altitude : Ozone Pur, Menthe Givrée, Montagne Froide",
    category: "gamme",
    gamme: "glaciaire",
    status: "in-progress"
  },
  {
    id: 8,
    year: 2026,
    quarter: "Q3",
    title: "Gamme Bio-Lab — Biotechnologie Olfactive",
    description: "Recherche expérimentale : Résine Pure, Terpène Expérimental, Extraction Froide, Molécule Synthétique",
    category: "gamme",
    gamme: "biolab",
    status: "planned"
  },
  {
    id: 9,
    year: 2026,
    quarter: "Q4",
    title: "Prototype C2 — Lacta Solis",
    description: "Gamme Civilisations : lait/soleil/sacré avec notes lactées, miel, encens",
    category: "prototype",
    gamme: "civilisations",
    status: "planned"
  },

  // 2027
  {
    id: 10,
    year: 2027,
    quarter: "Q1",
    title: "100+ Synergies Identifiées",
    description: "Expansion matrice : nouvelles combinaisons tabacs × molécules, 4 types synergies",
    category: "synergie",
    status: "planned"
  },
  {
    id: 11,
    year: 2027,
    quarter: "Q2",
    title: "Prototype C3 — Terra Ambra",
    description: "Gamme Pétrichor/Volcanique : terre/ambre/fumée avec notes minérales chaudes",
    category: "prototype",
    gamme: "petrichor",
    status: "planned"
  },
  {
    id: 12,
    year: 2027,
    quarter: "Q3",
    title: "Recherche Pyrolyse Avancée",
    description: "Étude combustion contrôlée : courbes volatilité, dégradation terpènes, modèles GC-MS",
    category: "milestone",
    status: "planned"
  },

  // 2028-2035 (Sample future milestones)
  {
    id: 13,
    year: 2028,
    quarter: "Q2",
    title: "200+ Molécules Documentées",
    description: "Expansion base de données : nouvelles familles chimiques, profils olfactifs, synergies",
    category: "milestone",
    status: "planned"
  },
  {
    id: 14,
    year: 2030,
    quarter: "Q1",
    title: "Bilan Mi-Parcours (5 ans)",
    description: "Évaluation recherche : 10+ prototypes, 5 gammes consolidées, 300+ synergies",
    category: "milestone",
    status: "planned"
  },
  {
    id: 15,
    year: 2035,
    quarter: "Q4",
    title: "Finalisation Projet PERFUMUM",
    description: "Synthèse 10 ans recherche : publication académique, archive complète, transmission connaissances",
    category: "milestone",
    status: "planned"
  }
];

export default function TimelinePerfumum() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedGamme, setSelectedGamme] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const years = Array.from(new Set(timelineEvents.map(e => e.year))).sort();
  
  const filteredEvents = timelineEvents.filter(event => {
    if (selectedYear && event.year !== selectedYear) return false;
    if (selectedGamme && event.gamme !== selectedGamme) return false;
    if (selectedCategory && event.category !== selectedCategory) return false;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "gamme": return <Beaker className="h-4 w-4" />;
      case "prototype": return <FlaskConical className="h-4 w-4" />;
      case "synergie": return <TrendingUp className="h-4 w-4" />;
      case "milestone": return <Target className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "gamme": return "oklch(0.60 0.15 270)";
      case "prototype": return "oklch(0.55 0.18 25)";
      case "synergie": return "oklch(0.55 0.12 160)";
      case "milestone": return "oklch(0.68 0.20 330)";
      default: return "oklch(0.65 0.15 60)";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="default" className="bg-green-600">Terminé</Badge>;
      case "in-progress": return <Badge variant="default" className="bg-blue-600">En cours</Badge>;
      case "planned": return <Badge variant="outline">Planifié</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 section-spacing">
        <div className="container">
          <Breadcrumbs />
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Timeline PERFUMUM 2025-2035</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Frise chronologique interactive de la recherche longitudinale sur 10 ans : gammes explorées, 
              prototypes développés, synergies identifiées et jalons scientifiques. Filtrable par année, 
              gamme et catégorie.
            </p>
          </div>

          {/* Filters */}
          <Card className="brutal-border mb-8">
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
              <CardDescription>Affiner la timeline par année, gamme ou catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {/* Year Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Année</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedYear === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedYear(null)}
                    >
                      Toutes
                    </Button>
                    {years.map(year => (
                      <Button
                        key={year}
                        variant={selectedYear === year ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedYear(year)}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Gamme Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Gamme</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedGamme === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedGamme(null)}
                    >
                      Toutes
                    </Button>
                    {["petrichor", "volcanique", "civilisations", "glaciaire", "biolab"].map(gamme => (
                      <GammeBadge
                        key={gamme}
                        gamme={gamme as any}
                        size="sm"
                        onClick={() => setSelectedGamme(selectedGamme === gamme ? null : gamme)}
                        className={`cursor-pointer ${selectedGamme === gamme ? 'ring-2' : 'opacity-60 hover:opacity-100'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Catégorie</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Toutes
                    </Button>
                    {["gamme", "prototype", "synergie", "milestone"].map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      >
                        {getCategoryIcon(category)}
                        <span className="ml-1 capitalize">{category === "milestone" ? "Jalon" : category}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                {filteredEvents.length} événement(s) affiché(s)
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block"></div>

            {/* Events */}
            <div className="space-y-8">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Year Marker (only show when year changes) */}
                  {(index === 0 || event.year !== filteredEvents[index - 1].year) && (
                    <div className="mb-4">
                      <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                          {event.year}
                        </div>
                        <h2 className="text-3xl font-bold md:hidden">{event.year}</h2>
                      </div>
                    </div>
                  )}

                  {/* Event Card */}
                  <div className="md:ml-24">
                    <Card 
                      className="brutal-border hover:shadow-lg transition-shadow"
                      style={{ borderLeftColor: getCategoryColor(event.category), borderLeftWidth: '4px' }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {event.year} {event.quarter}
                              </Badge>
                              {getStatusBadge(event.status)}
                              {event.gamme && (
                                <GammeBadge gamme={event.gamme} size="sm" showIcon={false} />
                              )}
                            </div>
                            <CardTitle className="flex items-center gap-2">
                              {getCategoryIcon(event.category)}
                              {event.title}
                            </CardTitle>
                          </div>
                        </div>
                        <CardDescription>{event.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <Card className="brutal-border mt-12">
            <CardHeader>
              <CardTitle>Statistiques Timeline</CardTitle>
              <CardDescription>Vue d'ensemble de la recherche 2025-2035</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {timelineEvents.filter(e => e.category === "gamme").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Gammes explorées</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {timelineEvents.filter(e => e.category === "prototype").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Prototypes développés</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {timelineEvents.filter(e => e.category === "synergie").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Jalons synergies</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {timelineEvents.filter(e => e.status === "completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Événements terminés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
