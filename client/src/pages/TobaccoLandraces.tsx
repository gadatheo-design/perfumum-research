import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Leaf, MapPin, Beaker, Star, AlertTriangle, Sparkles, Globe } from "lucide-react";

// Type pour les landraces
interface TobaccoLandrace {
  id: number;
  name: string;
  alternate_names?: string;
  country: string;
  region: string;
  species: string;
  status: string;
  rarity_score: number;
  aromatic_profile: string;
  aromatic_intensity: number;
  dominant_notes: string;
  secondary_notes: string;
  indoles_ppm: number;
  terpenes_floraux_ppm: number;
  lactones_ppm: number;
  molecular_profile_type: string;
  data_certainty: string;
  perfumery_potential_score: number;
  perfumery_applications: string;
  curing_method: string;
  historical_notes?: string;
  source_references: string;
}

// Couleurs par profil moléculaire
const profileColors: Record<string, string> = {
  "cuir-animal": "bg-amber-900 text-amber-100",
  "floral-mielle": "bg-pink-500 text-white",
  "cremeux-gourmand": "bg-orange-400 text-orange-900",
  "mixte": "bg-purple-500 text-white",
  "unknown": "bg-gray-500 text-white",
};

// Couleurs par statut
const statusColors: Record<string, string> = {
  "active": "bg-green-500 text-white",
  "rare": "bg-yellow-500 text-yellow-900",
  "endangered": "bg-orange-500 text-white",
  "extinct": "bg-red-600 text-white",
  "unknown": "bg-gray-400 text-white",
};

// Icônes par région
const regionIcons: Record<string, string> = {
  "Grèce": "🇬🇷",
  "Turquie": "🇹🇷",
  "Chypre": "🇨🇾",
  "Bulgarie": "🇧🇬",
  "Cuba": "🇨🇺",
  "USA": "🇺🇸",
  "Nicaragua": "🇳🇮",
  "Indonésie": "🇮🇩",
  "Amérique du Sud": "🌎",
  "Cameroun": "🇨🇲",
};

function LandraceCard({ landrace }: { landrace: TobaccoLandrace }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{regionIcons[landrace.country] || "🌿"}</span>
              {landrace.name}
            </CardTitle>
            {landrace.alternate_names && (
              <CardDescription className="text-xs mt-1">
                {landrace.alternate_names}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge className={statusColors[landrace.status] || statusColors.unknown}>
              {landrace.status}
            </Badge>
            <Badge className={profileColors[landrace.molecular_profile_type] || profileColors.unknown}>
              {landrace.molecular_profile_type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Localisation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{landrace.country} — {landrace.region}</span>
        </div>

        {/* Profil aromatique */}
        <div>
          <p className="text-sm font-medium mb-1">Profil aromatique</p>
          <p className="text-sm text-muted-foreground">{landrace.aromatic_profile}</p>
        </div>

        {/* Notes dominantes */}
        <div className="flex flex-wrap gap-1">
          {landrace.dominant_notes.split(", ").map((note, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {note}
            </Badge>
          ))}
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Intensité</p>
            <Progress value={landrace.aromatic_intensity * 10} className="h-2" />
            <p className="text-xs text-right mt-0.5">{landrace.aromatic_intensity}/10</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Rareté</p>
            <Progress value={landrace.rarity_score * 10} className="h-2" />
            <p className="text-xs text-right mt-0.5">{landrace.rarity_score}/10</p>
          </div>
        </div>

        {/* Potentiel parfumerie */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Potentiel parfumerie</span>
          </div>
          <Badge variant="secondary" className="text-lg font-bold">
            {landrace.perfumery_potential_score}/10
          </Badge>
        </div>

        {/* Concentrations moléculaires */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-muted rounded">
            <p className="font-medium">{landrace.indoles_ppm}</p>
            <p className="text-muted-foreground">Indoles (ppm)</p>
          </div>
          <div className="p-2 bg-muted rounded">
            <p className="font-medium">{landrace.terpenes_floraux_ppm}</p>
            <p className="text-muted-foreground">Terpènes</p>
          </div>
          <div className="p-2 bg-muted rounded">
            <p className="font-medium">{landrace.lactones_ppm}</p>
            <p className="text-muted-foreground">Lactones</p>
          </div>
        </div>

        {/* Méthode de séchage */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Leaf className="h-3 w-3" />
          <span>{landrace.curing_method}</span>
        </div>

        {/* Certitude des données */}
        {landrace.data_certainty !== "confirmed" && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <AlertTriangle className="h-3 w-3" />
            <span>Données {landrace.data_certainty === "hypothetical" ? "hypothétiques" : "estimées"}</span>
          </div>
        )}

        {/* Notes historiques */}
        {landrace.historical_notes && (
          <p className="text-xs text-muted-foreground italic border-l-2 pl-2">
            {landrace.historical_notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function TobaccoLandraces() {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: landracesData, isLoading: landracesLoading } = trpc.tobacco.getLandraces.useQuery();
  const { data: statsData, isLoading: statsLoading } = trpc.tobacco.getLandracesStats.useQuery();

  const landraces = landracesData?.data || [];
  const stats = statsData?.data;

  // Filtrer par profil moléculaire
  const filteredLandraces = activeTab === "all" 
    ? landraces 
    : landraces.filter((l: TobaccoLandrace) => l.molecular_profile_type === activeTab);

  if (landracesLoading || statsLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Leaf className="h-8 w-8 text-green-600" />
          Landraces de Tabac — Profils Moléculaires
        </h1>
        <p className="text-muted-foreground mt-2">
          Collection de {stats?.total || 0} landraces de tabac du monde entier avec leurs profils moléculaires et applications en parfumerie.
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Landraces</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.byCountry?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Pays</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.byProfile?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Profils</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.byStatus?.find((s: any) => s.status === "extinct")?.count || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Disparues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres par profil moléculaire */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">
            Tous ({landraces.length})
          </TabsTrigger>
          <TabsTrigger value="cuir-animal" className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-900"></span>
            Cuir-Animal
          </TabsTrigger>
          <TabsTrigger value="floral-mielle" className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
            Floral-Miellé
          </TabsTrigger>
          <TabsTrigger value="cremeux-gourmand" className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            Crémeux-Gourmand
          </TabsTrigger>
          <TabsTrigger value="mixte" className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Mixte
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Grille des landraces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLandraces.map((landrace: TobaccoLandrace) => (
          <LandraceCard key={landrace.id} landrace={landrace} />
        ))}
      </div>

      {filteredLandraces.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Leaf className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucune landrace trouvée pour ce filtre.</p>
        </div>
      )}

      {/* Légende des profils */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Profils Moléculaires</CardTitle>
          <CardDescription>
            Classification des landraces selon leur signature chimique dominante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-900/10 rounded-lg border border-amber-900/20">
              <h4 className="font-medium text-amber-900 mb-2">🦌 Cuir-Animal</h4>
              <p className="text-sm text-muted-foreground">
                Riche en indoles (100-300 ppm). Notes de cuir, fumé, animal. 
                Exemples : Latakia, Corojo, Nicotiana rustica.
              </p>
            </div>
            <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <h4 className="font-medium text-pink-700 mb-2">🌸 Floral-Miellé</h4>
              <p className="text-sm text-muted-foreground">
                Riche en terpènes floraux (200-300 ppm). Notes florales, miellées, encens.
                Exemples : Basma, Yenidje, Djebel.
              </p>
            </div>
            <div className="p-4 bg-orange-400/10 rounded-lg border border-orange-400/20">
              <h4 className="font-medium text-orange-700 mb-2">🍯 Crémeux-Gourmand</h4>
              <p className="text-sm text-muted-foreground">
                Riche en lactones (50-100 ppm). Notes crémeuses, fruitées, sucrées.
                Exemples : Perique, Izmir, Virginia.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
