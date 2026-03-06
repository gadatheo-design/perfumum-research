import { useState } from "react";
import { safeJsonParse } from "@/lib/utils";
import { Link } from "wouter";
import { ChevronRight, Cigarette, ExternalLink, Loader2, MapPin, Wind, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

// Catégories niche — données éditoriales conservées, enrichies avec IDs DB
const NICHE_CATEGORIES = [
  {
    id: "sacres",
    title: "A. Tabacs Sacrés & Ancestraux",
    icon: "🔮",
    color: "border-l-4 border-l-purple-500",
    dbNames: ["Nicotiana rustica", "Mapacho", "Hopi", "Cherokee", "Qom"],
    varieties: [
      { name: "Mapacho Noir", origin: "Pérou, Amazonie", notes: "encens noir, cuir humide, terre sacrée", usage: "Encens Noir, Civilisations Sacrées, Hash Rituel", dbName: "Nicotiana rustica" },
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
    dbNames: ["Makedonikos Basma", "Basma", "Karagach", "Erzurum", "Sumatra"],
    varieties: [
      { name: "Makedonikos Basma", origin: "Macédoine", notes: "pierre chaude, citron vert sec", usage: "Pétrichor Clair, Clarus Verde", dbName: "Basma" },
      { name: "Prilep Special", origin: "Macédoine", notes: "argile jaune, humidité sèche", usage: "Terre Humide, Clarus Verde" },
      { name: "Karagach Dark", origin: "Bulgarie", notes: "humus, cave froide", usage: "Pétrichor sombre, Terra Ambra", dbName: "Djebel" },
      { name: "Erzurum Basma Noir", origin: "Turquie", notes: "soufre doux, pierre noire", usage: "Volcanique, Ash", dbName: "Xanthi" },
      { name: "Sumatra Black", origin: "Indonésie", notes: "humus tropical, bois mouillé", usage: "Sundarban Soil, Malabar Zodiac" }
    ]
  },
  {
    id: "lactone",
    title: "C. Tabacs Lactone / Cheese",
    icon: "🧈",
    color: "border-l-4 border-l-yellow-500",
    dbNames: ["Burley", "Katerini", "Malawi"],
    varieties: [
      { name: "Burley Blanc Lactone", origin: "USA", notes: "beurre blanc, lait fermenté", usage: "Lacta Solis, Sang Lactonique", dbName: "Burley" },
      { name: "Katerini Cream Cut", origin: "Grèce", notes: "crème aigre, sésame", usage: "Clausura Blanc, Collagène", dbName: "Katerini" },
      { name: "Malawi Silk", origin: "Malawi", notes: "beurre fumé, karité", usage: "Solar Lactone, Bio-Lab" }
    ]
  },
  {
    id: "glaciaire",
    title: "D. Tabacs Glaciaires & Ozone",
    icon: "❄️",
    color: "border-l-4 border-l-cyan-500",
    dbNames: ["Virginia", "Blue Ridge", "Siberian"],
    varieties: [
      { name: "Virginia Ionique", origin: "USA", notes: "ozone, eau distillée", usage: "Longyear Ice, Glace Liquide", dbName: "Virginia Bright" },
      { name: "Blue Ridge Arctic", origin: "USA", notes: "menthol naturel, pin froid", usage: "Aurora Ionique, Cryo-poussière" },
      { name: "Siberian Ghost", origin: "Russie", notes: "métal froid, neige", usage: "Archive Polaire, Crypte Blanche" }
    ]
  },
  {
    id: "umami",
    title: "E. Tabacs Umami / Bouillon",
    icon: "🍲",
    color: "border-l-4 border-l-orange-500",
    dbNames: ["Burley", "Rustica", "Izmir"],
    varieties: [
      { name: "Burley Umami", origin: "USA", notes: "bouillon clair, colle animale", usage: "Clausura Bouillon", dbName: "Burley" },
      { name: "Rustica d'Éthiopie", origin: "Éthiopie", notes: "viande séchée, bouillon noir", usage: "Ossuaire, Bouillon Noir", dbName: "Nicotiana rustica" },
      { name: "Izmir \"Taverna Cut\"", origin: "Turquie", notes: "figue sèche, caramel noir", usage: "Kyphi, Cuisine Engloutie", dbName: "Izmir/Smyrna" }
    ]
  },
  {
    id: "cuir",
    title: "F. Tabacs Cuir / Sang / Archives",
    icon: "📜",
    color: "border-l-4 border-l-stone-500",
    dbNames: ["Nicotiana Sylvestris", "Rustica", "Sumatra"],
    varieties: [
      { name: "Nicotiana Sylvestris", origin: "Argentine", notes: "fleur blanche sacrée, cuir clair", usage: "Post-Humain, Fleur Lactone" },
      { name: "Rustica du Caucase", origin: "Caucase", notes: "fer, sang froid, cryptes", usage: "Ossuaire, Crypte", dbName: "Nicotiana rustica" },
      { name: "Sumatra Brown Cured", origin: "Indonésie", notes: "manuscrits brûlés, coton chaud", usage: "Nag Hammadi, Manuscrit Noir" }
    ]
  },
  {
    id: "volcanique",
    title: "G. Tabacs Volcaniques",
    icon: "🌋",
    color: "border-l-4 border-l-red-500",
    dbNames: ["Java", "Canary"],
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
    dbNames: ["Virginia", "Krumovgrad", "Burley", "Samsoun", "Latakia"],
    varieties: [
      { name: "Brightleaf Ancien", origin: "USA", notes: "lumineux, contrastes", usage: "contrastes lumineux pour hash sombres" },
      { name: "Virginia Gold \"Honey Cut\"", origin: "USA", notes: "miel, floral", usage: "lactones & fleurs solaires", dbName: "Virginia Gold" },
      { name: "Krumovgrad Noir", origin: "Bulgarie", notes: "sombre, Maillard", usage: "Civilisations, Ossuaire, Maillard", dbName: "Krumovgrad" },
      { name: "Burley Fermentum", origin: "USA", notes: "fermenté, collagène", usage: "module Collagène / Pétrichor", dbName: "Burley" },
      { name: "Samsoun Antique", origin: "Turquie", notes: "épices, encens chaud", usage: "épices, encens chaud", dbName: "Samsoun" },
      { name: "Latakia Clair", origin: "Syrie/Chypre", notes: "fumée aristocratique", usage: "noblesse, fumée aristocratique", dbName: "Latakia" }
    ]
  }
];

const climateLabels: Record<string, string> = {
  mediterranean: "Méditerranéen",
  continental: "Continental",
  oceanic: "Océanique",
  tropical: "Tropical",
  subtropical: "Subtropical",
  arid: "Aride",
  semi_arid: "Semi-aride",
  alpine: "Alpin",
  equatorial: "Équatorial",
  other: "Autre",
};

export default function TabacsNiche() {
  const [search, setSearch] = useState("");
  const { data: allTabacs, isLoading } = trpc.tabacs.listWithTerroir.useQuery();

  // Créer un index nom → données DB
  const tabacIndex: Record<string, any> = {};
  if (allTabacs) {
    allTabacs.forEach((t: any) => {
      tabacIndex[t.name.toLowerCase()] = t;
    });
  }

  // Trouver le tabac DB correspondant à une variété niche
  const findDbTabac = (variety: any) => {
    if (!variety.dbName || !allTabacs) return null;
    return allTabacs.find((t: any) =>
      t.name.toLowerCase().includes(variety.dbName.toLowerCase()) ||
      variety.dbName.toLowerCase().includes(t.name.toLowerCase())
    ) ?? null;
  };

  const filteredCategories = NICHE_CATEGORIES.map(cat => ({
    ...cat,
    varieties: cat.varieties.filter(v =>
      !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.origin.toLowerCase().includes(search.toLowerCase()) ||
      v.notes.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => !search || cat.varieties.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Breadcrumbs */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/programmes-recherche" className="hover:text-foreground transition-colors">Programmes-recherche</Link>
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
              <div className="text-3xl font-bold text-primary">{isLoading ? "..." : (allTabacs?.length ?? 42)}</div>
              <div className="text-sm text-muted-foreground">Tabacs en DB</div>
            </div>
            <div className="bg-card px-6 py-3 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">Continents</div>
            </div>
          </div>

          {/* Recherche */}
          <div className="mt-6 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une variété, une origine, une note..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container py-8">
        {search ? (
          // Mode recherche : affichage linéaire
          <div className="space-y-8">
            {filteredCategories.map(category => (
              <div key={category.id}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.title}
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {category.varieties.map((variety, idx) => (
                    <VarietyCard key={idx} variety={variety} dbTabac={findDbTabac(variety)} />
                  ))}
                </div>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <p className="text-center text-muted-foreground py-12">Aucune variété trouvée pour "{search}"</p>
            )}
          </div>
        ) : (
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

            {NICHE_CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                <Card className={category.color}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <span className="text-3xl">{category.icon}</span>
                      {category.title}
                    </CardTitle>
                    <CardDescription>
                      {category.varieties.length} variété{category.varieties.length > 1 ? 's' : ''} rare{category.varieties.length > 1 ? 's' : ''}
                      {isLoading && <span className="ml-2 text-xs"><Loader2 className="inline w-3 h-3 animate-spin" /> Chargement DB...</span>}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  {category.varieties.map((variety, idx) => (
                    <VarietyCard key={idx} variety={variety} dbTabac={findDbTabac(variety)} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

function VarietyCard({ variety, dbTabac }: { variety: any; dbTabac: any }) {
  const parseProfile = (raw: any): string[] => {
    if (!raw) return [];
    try {
      const parsed = safeJsonParse(raw, null);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return [String(raw)];
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
          {dbTabac && (
            <Badge className="bg-green-500/20 text-green-700 border-green-500/30 text-xs">
              DB ✓
            </Badge>
          )}
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

        {/* Données DB enrichies */}
        {dbTabac && (
          <div className="pt-3 border-t space-y-3">
            {/* Profil aromatique DB */}
            {dbTabac.aromaticProfile && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Profil DB
                </div>
                <div className="flex flex-wrap gap-1">
                  {parseProfile(dbTabac.aromaticProfile).map((note: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Intensité DB */}
            {dbTabac.intensity && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Intensité :</span>
                <div className="flex-1 bg-muted h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${(dbTabac.intensity / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono">{dbTabac.intensity}/10</span>
              </div>
            )}

            {/* Terroir DB */}
            {dbTabac.terroir_name && (
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-green-700">{dbTabac.terroir_name}</span>
                  {dbTabac.terroir_region && (
                    <span className="text-xs text-muted-foreground ml-1">· {dbTabac.terroir_region}</span>
                  )}
                </div>
              </div>
            )}

            {/* Lien fiche */}
            <Link href={`/tabac/${dbTabac.id}`}>
              <span className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
                <ExternalLink className="w-3 h-3" />
                Fiche complète : {dbTabac.name}
              </span>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
