import { Link } from "wouter";
import { ChevronRight, Cigarette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TabacsNiche() {
  // 8 catégories de tabacs
  const categories = [
    {
      id: "sacres",
      title: "A. Tabacs Sacrés & Ancestraux",
      icon: "🔮",
      color: "border-l-4 border-l-purple-500",
      varieties: [
        { name: "Mapacho Noir", origin: "Pérou, Amazonie", notes: "encens noir, cuir humide, terre sacrée", usage: "Encens Noir, Civilisations Sacrées, Hash Rituel" },
        { name: "Samauma Rustica", origin: "Amazonie", notes: "miel blanc, forêt primaire", usage: "Encens clair, Sogdian Caravan" },
        { name: "Hopi Sacred Tobacco", origin: "USA", notes: "pierre chaude, fumée blanche", usage: "Desertum, Argiles Sacrées" },
        { name: "Cherokee Purple", origin: "Appalaches", notes: "prune noire, pierres mouillées", usage: "Ossuaire Nocturne, Archivum" },
        { name: "Qom Sácer", origin: "Gran Chaco", notes: "poussière chaude, fumée sèche", usage: "Akrotiri Ash, Volcanique" }
      ]
    },
    {
      id: "petrichor",
      title: "B. Tabacs Pétrichor & Minéraux",
      icon: "🌧️",
      color: "border-l-4 border-l-slate-500",
      varieties: [
        { name: "Makedonikos Basma", origin: "Macédoine", notes: "pierre chaude, citron vert sec", usage: "Pétrichor Clair, Clarus Verde" },
        { name: "Prilep Special", origin: "Macédoine", notes: "argile jaune, humidité sèche", usage: "Terre Humide, Clarus Verde" },
        { name: "Karagach Dark", origin: "Bulgarie", notes: "humus, cave froide", usage: "Pétrichor sombre, Terra Ambra" },
        { name: "Erzurum Basma Noir", origin: "Turquie", notes: "soufre doux, pierre noire", usage: "Volcanique, Ash" },
        { name: "Sumatra Black", origin: "Indonésie", notes: "humus tropical, bois mouillé", usage: "Sundarban Soil, Malabar Zodiac" }
      ]
    },
    {
      id: "lactone",
      title: "C. Tabacs Lactone / Cheese",
      icon: "🧈",
      color: "border-l-4 border-l-yellow-500",
      varieties: [
        { name: "Burley Blanc Lactone", origin: "USA", notes: "beurre blanc, lait fermenté", usage: "Lacta Solis, Sang Lactonique" },
        { name: "Katerini Cream Cut", origin: "Grèce", notes: "crème aigre, sésame", usage: "Clausura Blanc, Collagène" },
        { name: "Malawi Silk", origin: "Malawi", notes: "beurre fumé, karité", usage: "Solar Lactone, Bio-Lab" }
      ]
    },
    {
      id: "glaciaire",
      title: "D. Tabacs Glaciaires & Ozone",
      icon: "❄️",
      color: "border-l-4 border-l-cyan-500",
      varieties: [
        { name: "Virginia Ionique", origin: "USA", notes: "ozone, eau distillée", usage: "Longyear Ice, Glace Liquide" },
        { name: "Blue Ridge Arctic", origin: "USA", notes: "menthol naturel, pin froid", usage: "Aurora Ionique, Cryo-poussière" },
        { name: "Siberian Ghost", origin: "Russie", notes: "métal froid, neige", usage: "Archive Polaire, Crypte Blanche" }
      ]
    },
    {
      id: "umami",
      title: "E. Tabacs Umami / Bouillon",
      icon: "🍲",
      color: "border-l-4 border-l-orange-500",
      varieties: [
        { name: "Burley Umami", origin: "USA", notes: "bouillon clair, colle animale", usage: "Clausura Bouillon" },
        { name: "Rustica d'Éthiopie", origin: "Éthiopie", notes: "viande séchée, bouillon noir", usage: "Ossuaire, Bouillon Noir" },
        { name: "Izmir \"Taverna Cut\"", origin: "Turquie", notes: "figue sèche, caramel noir", usage: "Kyphi, Cuisine Engloutie" }
      ]
    },
    {
      id: "cuir",
      title: "F. Tabacs Cuir / Sang / Archives",
      icon: "📜",
      color: "border-l-4 border-l-stone-500",
      varieties: [
        { name: "Nicotiana Sylvestris", origin: "Argentine", notes: "fleur blanche sacrée, cuir clair", usage: "Post-Humain, Fleur Lactone" },
        { name: "Rustica du Caucase", origin: "Caucase", notes: "fer, sang froid, cryptes", usage: "Ossuaire, Crypte" },
        { name: "Sumatra Brown Cured", origin: "Indonésie", notes: "manuscrits brûlés, coton chaud", usage: "Nag Hammadi, Manuscrit Noir" }
      ]
    },
    {
      id: "volcanique",
      title: "G. Tabacs Volcaniques",
      icon: "🌋",
      color: "border-l-4 border-l-red-500",
      varieties: [
        { name: "Java Volcano Leaf", origin: "Indonésie", notes: "cendre chaude, pierre rouge", usage: "Volcanique, Askja" },
        { name: "Canary Lava Tobacco", origin: "Îles Canaries", notes: "roche noire, sel", usage: "Atlantide, Caldera" }
      ]
    },
    {
      id: "hash",
      title: "H. Tabacs pour Résines Cannoli & Hash Design",
      icon: "🌿",
      color: "border-l-4 border-l-green-500",
      varieties: [
        { name: "Brightleaf Ancien", origin: "USA", notes: "lumineux, contrastes", usage: "contrastes lumineux pour hash sombres" },
        { name: "Virginia Gold \"Honey Cut\"", origin: "USA", notes: "miel, floral", usage: "lactones & fleurs solaires" },
        { name: "Krumovgrad Noir", origin: "Bulgarie", notes: "sombre, Maillard", usage: "Civilisations, Ossuaire, Maillard" },
        { name: "Burley Fermentum", origin: "USA", notes: "fermenté, collagène", usage: "module Collagène / Pétrichor" },
        { name: "Samsoun Antique", origin: "Turquie", notes: "épices, encens chaud", usage: "épices, encens chaud" },
        { name: "Latakia Clair", origin: "Syrie/Chypre", notes: "fumée aristocratique", usage: "noblesse, fumée aristocratique" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Breadcrumbs */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/">
              <a className="hover:text-foreground transition-colors">Accueil</a>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/programmes-recherche">
              <a className="hover:text-foreground transition-colors">Programmes-recherche</a>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Tabacs-niche</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5" />
        
        <div className="container relative py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-lg bg-amber-500/10">
              <Cigarette className="h-10 w-10 text-amber-500" />
            </div>
            <div>
              <Badge className="bg-amber-500 mb-2">Catalogue</Badge>
              <h1 className="text-4xl font-bold tracking-tight">
                Variétés de Tabacs Niche · Perfumeum
              </h1>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Sélection de tabacs rares, disparus, rituels ou expérimentaux utilisés pour créer des accords combustibles, 
            des résines CBD conceptualisées, et des explorations olfactives inspirées des civilisations perdues, 
            des sols volcaniques, des pluies sacrées et des ateliers anciens.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-card px-6 py-3 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-primary">8</div>
              <div className="text-sm text-muted-foreground">Catégories</div>
            </div>
            <div className="bg-card px-6 py-3 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-primary">30+</div>
              <div className="text-sm text-muted-foreground">Variétés</div>
            </div>
            <div className="bg-card px-6 py-3 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">Continents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container py-8">
        <Tabs defaultValue="sacres" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
            <TabsTrigger value="sacres">Sacrés</TabsTrigger>
            <TabsTrigger value="petrichor">Pétrichor</TabsTrigger>
            <TabsTrigger value="lactone">Lactone</TabsTrigger>
            <TabsTrigger value="glaciaire">Glaciaires</TabsTrigger>
            <TabsTrigger value="umami">Umami</TabsTrigger>
            <TabsTrigger value="cuir">Cuir</TabsTrigger>
            <TabsTrigger value="volcanique">Volcaniques</TabsTrigger>
            <TabsTrigger value="hash">Hash Design</TabsTrigger>
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <Card className={category.color}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <span className="text-3xl">{category.icon}</span>
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.varieties.length} variété{category.varieties.length > 1 ? 's' : ''} rare{category.varieties.length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                {category.varieties.map((variety, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{variety.name}</CardTitle>
                          {variety.origin && (
                            <Badge variant="outline" className="mb-3">
                              {variety.origin}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold mb-2">Notes olfactives</div>
                        <p className="text-sm text-muted-foreground italic">
                          {variety.notes}
                        </p>
                      </div>

                      <div>
                        <div className="text-sm font-semibold mb-2">Usage Perfumeum</div>
                        <p className="text-sm text-muted-foreground">
                          {variety.usage}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Footer Info */}
      <div className="bg-muted/50 border-t">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold">Positionnement</h3>
            <p className="text-muted-foreground leading-relaxed">
              Ces tabacs niche sont utilisés comme <strong>matrices combustibles</strong> pour créer des accords 
              olfactifs avec les résines CBD, encens et matières premières rares. Ils servent de support 
              structurel et narratif dans les gammes Perfumeum (Pétrichor, Volcanique, Civilisations, Bio-Lab).
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sourcing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Variétés rares issues de petits producteurs, semences anciennes et terroirs spécifiques. 
                    Certaines variétés sont en voie de disparition ou réservées à des usages cérémoniels.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Préparation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Séchage naturel, fermentation contrôlée selon les variétés. Pas de traitement chimique. 
                    Conservation en conditions optimales (température, hygrométrie).
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Respect Culturel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reconnaissance des origines sacrées et rituelles. Respect des traditions ancestrales 
                    et des sensibilités culturelles des territoires d'origine.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
