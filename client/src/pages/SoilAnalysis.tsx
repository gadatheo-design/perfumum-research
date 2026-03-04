// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mountain, 
  Droplets, 
  Leaf, 
  FlaskConical, 
  ArrowLeftRight,
  MapPin,
  Thermometer,
  Wind,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { D3RadarChart, D3RadarLegend } from "@/components/D3RadarChart";

// Données enrichies pour la visualisation
const terroirProfiles = {
  "Vuelta Abajo": {
    country: "Cuba",
    region: "Pinar del Río",
    color: "#8B4513", // Brun-rouge
    bgGradient: "from-amber-900/20 to-orange-800/10",
    signature: "Cuir fin, boisé, épices douces",
    analogie: "Orchestre symphonique",
    minerals: {
      fer: { level: "Élevé", value: 75, color: "#B8860B" },
      potassium: { level: "Élevé", value: 80, color: "#DAA520" },
      magnesium: { level: "Modéré", value: 55, color: "#9ACD32" },
      calcium: { level: "Élevé", value: 70, color: "#F5DEB3" },
      soufre: { level: "Modéré", value: 40, color: "#FFD700" }
    },
    aromaProfile: ["Cuir fin", "Bois de cèdre", "Épices douces", "Miel", "Terre humide"],
    perfumeryUse: "Note de fond noble dans un parfum de luxe"
  },
  "Estelí": {
    country: "Nicaragua",
    region: "Estelí",
    color: "#1a1a1a", // Noir volcanique
    bgGradient: "from-slate-900/30 to-zinc-800/20",
    signature: "Poivre noir, terre volcanique, café",
    analogie: "Heavy metal à pleine puissance",
    minerals: {
      fer: { level: "Très élevé", value: 95, color: "#8B0000" },
      potassium: { level: "Très élevé", value: 90, color: "#FF4500" },
      magnesium: { level: "Élevé", value: 75, color: "#32CD32" },
      calcium: { level: "Modéré", value: 50, color: "#DEB887" },
      soufre: { level: "Élevé", value: 70, color: "#FFD700" }
    },
    aromaProfile: ["Poivre noir", "Terre volcanique", "Café torréfié", "Cacao", "Épices fortes"],
    perfumeryUse: "Note de cœur audacieuse ou signature inoubliable"
  }
};

// Composant barre de progression minérale
function MineralBar({ name, level, value, color }: { name: string; level: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">{level}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// Composant carte de terroir
function TerroirCard({ terroir, data }: { terroir: string; data: typeof terroirProfiles["Vuelta Abajo"] }) {
  return (
    <Card className={`bg-gradient-to-br ${data.bgGradient} border-2`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full border-2 border-white/20"
            style={{ backgroundColor: data.color }}
          />
          <div>
            <CardTitle className="text-xl">{terroir}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {data.region}, {data.country}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Signature olfactive */}
        <div className="p-4 bg-background/50 rounded-lg">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Signature Olfactive</h4>
          <p className="text-lg font-medium">{data.signature}</p>
          <p className="text-sm text-muted-foreground mt-1 italic">"{data.analogie}"</p>
        </div>

        {/* Profil minéral */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Profil Minéral
          </h4>
          {Object.entries(data.minerals).map(([mineral, info]) => (
            <MineralBar 
              key={mineral}
              name={mineral.charAt(0).toUpperCase() + mineral.slice(1)}
              level={info.level}
              value={info.value}
              color={info.color}
            />
          ))}
        </div>

        {/* Notes aromatiques */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Notes Aromatiques
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.aromaProfile.map((note) => (
              <Badge key={note} variant="secondary">{note}</Badge>
            ))}
          </div>
        </div>

        {/* Usage parfumerie */}
        <div className="p-3 bg-primary/10 rounded-lg">
          <h4 className="text-xs font-semibold text-primary mb-1">Usage en Parfumerie</h4>
          <p className="text-sm">{data.perfumeryUse}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SoilAnalysis() {
  const [selectedTerroir1, setSelectedTerroir1] = useState("Vuelta Abajo");
  const [selectedTerroir2, setSelectedTerroir2] = useState("Estelí");
  
  const { data: soilData, isLoading } = trpc.tobacco.getSoilAnalyses.useQuery();
  const { data: comparisonData } = trpc.tobacco.compareSoils.useQuery({
    terroir1: selectedTerroir1,
    terroir2: selectedTerroir2
  });

  return (
    <div className="container py-8 space-y-8">
      {/* En-tête */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/recherche-scientifique" className="hover:text-foreground">Recherche</Link>
          <ChevronRight className="h-4 w-4" />
          <span>Analyses Pédologiques</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <Mountain className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Analyses Pédologiques</h1>
            <p className="text-muted-foreground">
              Le sol comme matrice de l'arôme — Étude comparative des terroirs
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Leaf className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-lg">
                Le profil aromatique d'un tabac est l'expression directe de son <strong>terroir</strong>. 
                La composition minérale, la texture, l'origine géologique et le pH du sol sont les 
                catalyseurs des réactions biochimiques qui créent les précurseurs d'arômes dans la plante.
              </p>
              <p className="text-muted-foreground">
                Cette analyse compare les deux plus grands terroirs du monde pour expliquer scientifiquement 
                comment leurs sols radicalement différents donnent naissance à des profils aromatiques 
                diamétralement opposés.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Comparaison
          </TabsTrigger>
          <TabsTrigger value="mechanisms" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Mécanismes
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Mountain className="h-4 w-4" />
            Données Brutes
          </TabsTrigger>
        </TabsList>

        {/* Onglet Comparaison */}
        <TabsContent value="comparison" className="space-y-6">
          {/* Sélecteurs de terroirs */}
          <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Select value={selectedTerroir1} onValueChange={setSelectedTerroir1}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Terroir 1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vuelta Abajo">Vuelta Abajo (Cuba)</SelectItem>
                <SelectItem value="Estelí">Estelí (Nicaragua)</SelectItem>
              </SelectContent>
            </Select>
            
            <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
            
            <Select value={selectedTerroir2} onValueChange={setSelectedTerroir2}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Terroir 2" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vuelta Abajo">Vuelta Abajo (Cuba)</SelectItem>
                <SelectItem value="Estelí">Estelí (Nicaragua)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Radar Chart Comparatif */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Profils Minéraux Comparés
              </CardTitle>
              <CardDescription>
                Visualisation radar des concentrations minérales relatives
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <D3RadarChart
                data={[
                  {
                    name: "Vuelta Abajo",
                    color: "#D97706",
                    values: [
                      { axis: "Fer (Fe)", value: 75 },
                      { axis: "Potassium (K)", value: 80 },
                      { axis: "Magnésium (Mg)", value: 55 },
                      { axis: "Calcium (Ca)", value: 70 },
                      { axis: "Soufre (S)", value: 40 },
                      { axis: "Matière Org.", value: 40 }
                    ]
                  },
                  {
                    name: "Estelí",
                    color: "#475569",
                    values: [
                      { axis: "Fer (Fe)", value: 95 },
                      { axis: "Potassium (K)", value: 90 },
                      { axis: "Magnésium (Mg)", value: 75 },
                      { axis: "Calcium (Ca)", value: 50 },
                      { axis: "Soufre (S)", value: 70 },
                      { axis: "Matière Org.", value: 65 }
                    ]
                  }
                ]}
                width={450}
                height={400}
                maxValue={100}
                levels={5}
                opacityArea={0.3}
              />
              <D3RadarLegend
                items={[
                  { name: "Vuelta Abajo (Cuba)", color: "#D97706" },
                  { name: "Estelí (Nicaragua)", color: "#475569" }
                ]}
              />
            </CardContent>
          </Card>

          {/* Cartes de comparaison */}
          <div className="grid md:grid-cols-2 gap-6">
            {terroirProfiles[selectedTerroir1 as keyof typeof terroirProfiles] && (
              <TerroirCard 
                terroir={selectedTerroir1}
                data={terroirProfiles[selectedTerroir1 as keyof typeof terroirProfiles]}
              />
            )}
            {terroirProfiles[selectedTerroir2 as keyof typeof terroirProfiles] && (
              <TerroirCard 
                terroir={selectedTerroir2}
                data={terroirProfiles[selectedTerroir2 as keyof typeof terroirProfiles]}
              />
            )}
          </div>

          {/* Tableau comparatif */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-5 w-5" />
                Tableau Comparatif des Données Pédologiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Caractéristique</th>
                      <th className="text-left py-3 px-4 font-semibold text-amber-600">Vuelta Abajo</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Estelí</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Influence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4 font-medium">Type de sol</td>
                      <td className="py-3 px-4">Limoneux-argileux rougeâtre</td>
                      <td className="py-3 px-4">Andisol volcanique noir</td>
                      <td className="py-3 px-4 text-muted-foreground">Texture, rétention d'eau</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Origine géologique</td>
                      <td className="py-3 px-4">Roches calcaires</td>
                      <td className="py-3 px-4">Cendres volcaniques</td>
                      <td className="py-3 px-4 text-muted-foreground">Concentration minérale</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">pH</td>
                      <td className="py-3 px-4">6.0-7.0 (neutre)</td>
                      <td className="py-3 px-4">5.5-6.5 (acide)</td>
                      <td className="py-3 px-4 text-muted-foreground">Assimilation minéraux</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Matière organique</td>
                      <td className="py-3 px-4">3-5%</td>
                      <td className="py-3 px-4">5-8%</td>
                      <td className="py-3 px-4 text-muted-foreground">Richesse nutriments</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Fer (Fe)</td>
                      <td className="py-3 px-4">Élevé</td>
                      <td className="py-3 px-4 font-semibold">Très élevé</td>
                      <td className="py-3 px-4 text-muted-foreground">Catalyseur enzymatique</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Potassium (K)</td>
                      <td className="py-3 px-4">Élevé</td>
                      <td className="py-3 px-4 font-semibold">Très élevé</td>
                      <td className="py-3 px-4 text-muted-foreground">Combustion, sucres</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Mécanismes */}
        <TabsContent value="mechanisms" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rôle du Fer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <FlaskConical className="h-5 w-5 text-red-600" />
                  </div>
                  Le Rôle du Fer (Fe)
                </CardTitle>
                <CardDescription>Catalyseur de complexité et de puissance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Le fer est un cofacteur essentiel pour les enzymes impliquées dans la biosynthèse 
                  des <strong>terpènes</strong> et des <strong>phénols</strong>, précurseurs d'arômes majeurs.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border-l-4 border-amber-500">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Vuelta Abajo</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Fer élevé → Activité enzymatique régulière → Notes subtiles de cuir, bois, épices douces
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-lg border-l-4 border-slate-500">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Estelí</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Fer très élevé → Suractivité enzymatique → Pyrazines et thiols → Notes poivrées, grillées
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Influence du pH */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Droplets className="h-5 w-5 text-blue-600" />
                  </div>
                  L'Influence du pH
                </CardTitle>
                <CardDescription>La clé d'assimilation des minéraux</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Le pH du sol contrôle la solubilité et donc la <strong>disponibilité des minéraux</strong> 
                  pour la plante. C'est un facteur déterminant du profil aromatique.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border-l-4 border-amber-500">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">pH 6.0-7.0 (Neutre)</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Assimilation équilibrée → Profil harmonieux → <strong>Élégance</strong>
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-lg border-l-4 border-slate-500">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">pH 5.5-6.5 (Acide)</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Absorption différentielle → Composés de stress → <strong>Puissance</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Synergie K/Mg */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Leaf className="h-5 w-5 text-green-600" />
                  </div>
                  Synergie Potassium-Magnésium
                </CardTitle>
                <CardDescription>Combustion et douceur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Badge variant="outline">K</Badge> Potassium
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Crucial pour la <strong>combustion</strong> lente et complète</li>
                      <li>• Libération progressive des arômes</li>
                      <li>• Synthèse des sucres → Notes douces par caramélisation</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Badge variant="outline">Mg</Badge> Magnésium
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Au cœur de la molécule de <strong>chlorophylle</strong></li>
                      <li>• Associé à la douceur perçue du tabac</li>
                      <li>• Ratio K/Mg détermine l'équilibre puissance/douceur</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Données Brutes */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Données de la Base de Données</CardTitle>
              <CardDescription>
                Analyses pédologiques stockées dans PERFUMUM
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : soilData?.success && soilData.data.length > 0 ? (
                <div className="space-y-4">
                  {soilData.data.map((soil: any, index: number) => (
                    <Card key={index} className="bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {soil.terroir_name}
                        </CardTitle>
                        <CardDescription>{soil.country} — {soil.region}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium">{soil.soil_type}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">pH:</span>
                            <p className="font-medium">{soil.ph_range}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Matière organique:</span>
                            <p className="font-medium">{soil.organic_matter}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Signature:</span>
                            <p className="font-medium">{soil.aromatic_signature}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Mountain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune analyse pédologique disponible</p>
                  <p className="text-sm mt-2">Les données seront ajoutées prochainement</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Conclusion */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Conclusion pour la Parfumerie
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-background/50 rounded-lg">
              <h4 className="font-medium text-amber-600 mb-2">Vuelta Abajo</h4>
              <p className="text-sm text-muted-foreground">
                Un absolu de tabac de Vuelta Abajo apportera une <strong>complexité et une élégance inégalées</strong>, 
                idéal pour une note de fond noble dans un parfum de luxe.
              </p>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              <h4 className="font-medium text-slate-600 mb-2">Estelí</h4>
              <p className="text-sm text-muted-foreground">
                Un absolu de tabac d'Estelí offrira une <strong>puissance et un caractère épicé-poivré uniques</strong>, 
                parfaits pour une note de cœur audacieuse ou une signature inoubliable.
              </p>
            </div>
          </div>
          <p className="text-sm text-center mt-4 text-muted-foreground italic">
            Le choix d'un terroir n'est pas seulement une question de sourcing, 
            mais un véritable acte de création qui définit l'âme même du parfum.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
