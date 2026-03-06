// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Leaf,
  Beaker,
  GitBranch,
  MapPin,
  TreeDeciduous,
  Flower2,
  Cigarette,
  Cannabis,
  Droplets,
  Mountain,
  ExternalLink,
  Download,
  BarChart3
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Super-familles botaniques pour classification
const SUPER_FAMILIES: Record<string, { name: string; color: string; families: string[] }> = {
  rosids: {
    name: "Rosids",
    color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    families: ["Rutaceae", "Fabaceae", "Cannabaceae", "Moraceae", "Burseraceae", "Anacardiaceae", "Sapindaceae", "Malvaceae", "Myrtaceae", "Geraniaceae", "Cistaceae", "Dipterocarpaceae"]
  },
  asterids: {
    name: "Asterids",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    families: ["Lamiaceae", "Asteraceae", "Solanaceae", "Oleaceae", "Apocynaceae", "Rubiaceae", "Verbenaceae", "Convolvulaceae", "Boraginaceae", "Caprifoliaceae"]
  },
  magnoliids: {
    name: "Magnoliids",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    families: ["Lauraceae", "Magnoliaceae", "Annonaceae", "Myristicaceae", "Piperaceae", "Aristolochiaceae", "Calycanthaceae"]
  },
  monocots: {
    name: "Monocots",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    families: ["Poaceae", "Zingiberaceae", "Orchidaceae", "Iridaceae", "Asparagaceae", "Amaryllidaceae", "Arecaceae", "Pandanaceae"]
  },
  gymnosperms: {
    name: "Gymnosperms",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    families: ["Pinaceae", "Cupressaceae", "Taxaceae", "Araucariaceae", "Podocarpaceae"]
  }
};

// Trouver la super-famille d'une famille
function getSuperFamily(family: string): { name: string; color: string } | null {
  for (const [key, superFamily] of Object.entries(SUPER_FAMILIES)) {
    if (superFamily.families.includes(family)) {
      return { name: superFamily.name, color: superFamily.color };
    }
  }
  return null;
}

// Icône de catégorie
function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, React.ReactNode> = {
    aromatique: <Leaf className="w-4 h-4" />,
    tabac: <Cigarette className="w-4 h-4" />,
    cannabis: <Cannabis className="w-4 h-4" />,
    resine: <Droplets className="w-4 h-4" />,
    bois: <TreeDeciduous className="w-4 h-4" />,
    fleur: <Flower2 className="w-4 h-4" />,
    racine: <Mountain className="w-4 h-4" />,
    autre: <Beaker className="w-4 h-4" />,
  };
  return icons[category] || icons.autre;
}

export default function FamilyDetail() {
  const params = useParams<{ name: string }>();
  const familyName = decodeURIComponent(params.name || "");
  const [activeTab, setActiveTab] = useState("plants");

  // Récupérer les plantes de cette famille
  const { data: plants, isLoading: isLoadingPlants } = trpc.plants.getByFamily.useQuery(
    { family: familyName },
    { enabled: !!familyName }
  );

  // Récupérer les statistiques de la famille
  const { data: familyStats, isLoading: isLoadingStats } = trpc.plants.getFamilyStats.useQuery(
    { family: familyName },
    { enabled: !!familyName }
  );

  // Récupérer les données phylogénétiques
  const { data: phyloData } = trpc.plants.getFamiliesWithCategories.useQuery();

  const superFamily = getSuperFamily(familyName);

  // Extraire les molécules uniques de toutes les plantes
  const uniqueMolecules = plants?.reduce((acc: Set<string>, plant: any) => {
    if (plant.dominantMolecules) {
      const molecules = typeof plant.dominantMolecules === 'string' 
        ? safeJsonParse(plant.dominantMolecules, []) 
        : plant.dominantMolecules;
      molecules.forEach((m: string) => acc.add(m));
    }
    return acc;
  }, new Set<string>()) || new Set<string>();

  // Extraire les origines uniques
  const uniqueOrigins = plants?.reduce((acc: Set<string>, plant: any) => {
    if (plant.origin) acc.add(plant.origin);
    return acc;
  }, new Set<string>()) || new Set<string>();

  // Compter par catégorie
  const categoryCount = plants?.reduce((acc: Record<string, number>, plant: any) => {
    const cat = plant.category || "autre";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {}) || {};

  if (isLoadingPlants || isLoadingStats) {
    return (
      <>
        <Header />
        <div className="container py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!plants || plants.length === 0) {
    return (
      <>
        <Header />
        <div className="container py-8">
          <div className="text-center py-12">
            <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Famille non trouvée</h2>
            <p className="text-muted-foreground mb-4">
              Aucune plante trouvée pour la famille "{familyName}".
            </p>
            <Link href="/plants">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux plantes
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-8 max-w-6xl">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/plants">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux plantes
            </Button>
          </Link>
          <Link href="/phylogenetique">
            <Button variant="ghost" size="sm">
              <GitBranch className="h-4 w-4 mr-2" />
              Classification phylogénétique
            </Button>
          </Link>
        </div>

        {/* En-tête de la famille */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <GitBranch className="h-6 w-6 text-primary" />
                {superFamily && (
                  <Badge variant="outline" className={superFamily.color}>
                    {superFamily.name}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{familyName}</h1>
              <p className="text-muted-foreground">
                Famille botanique regroupant {plants.length} plante{plants.length > 1 ? "s" : ""} dans la base de données PERFUMUM
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{plants.length}</div>
              <div className="text-sm text-muted-foreground">Plantes</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{uniqueMolecules.size}</div>
              <div className="text-sm text-muted-foreground">Molécules dominantes</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{uniqueOrigins.size}</div>
              <div className="text-sm text-muted-foreground">Origines géographiques</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-foreground">{Object.keys(categoryCount).length}</div>
              <div className="text-sm text-muted-foreground">Catégories</div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="plants">Plantes ({plants.length})</TabsTrigger>
            <TabsTrigger value="molecules">Molécules ({uniqueMolecules.size})</TabsTrigger>
            <TabsTrigger value="origins">Origines ({uniqueOrigins.size})</TabsTrigger>
          </TabsList>

          {/* Liste des plantes */}
          <TabsContent value="plants" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plants.map((plant: any) => (
                <Link key={plant.id} href={`/plants/${plant.id}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <CategoryIcon category={plant.category} />
                        <CardTitle className="text-lg">{plant.name}</CardTitle>
                      </div>
                      {plant.latinName && (
                        <CardDescription className="italic">{plant.latinName}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {plant.origin && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {plant.origin}
                          </div>
                        )}
                        {plant.olfactiveSignature && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {plant.olfactiveSignature}
                          </p>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {plant.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          {/* Liste des molécules */}
          <TabsContent value="molecules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Molécules dominantes de la famille {familyName}
                </CardTitle>
                <CardDescription>
                  Molécules les plus fréquemment présentes dans les plantes de cette famille
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(uniqueMolecules).map((molecule: string) => (
                    <Badge key={molecule} variant="secondary" className="text-sm">
                      {molecule}
                    </Badge>
                  ))}
                </div>
                {uniqueMolecules.size === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Aucune molécule dominante documentée pour cette famille.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Liste des origines */}
          <TabsContent value="origins" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Distribution géographique
                </CardTitle>
                <CardDescription>
                  Origines des plantes de la famille {familyName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from(uniqueOrigins).map((origin: string) => (
                    <Badge key={origin} variant="outline" className="text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      {origin}
                    </Badge>
                  ))}
                </div>
                {uniqueOrigins.size === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Aucune origine géographique documentée pour cette famille.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Familles apparentées */}
        {superFamily && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Familles apparentées ({superFamily.name})
              </CardTitle>
              <CardDescription>
                Autres familles du même groupe phylogénétique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {SUPER_FAMILIES[Object.keys(SUPER_FAMILIES).find(k => SUPER_FAMILIES[k].name === superFamily.name) || ""]?.families
                  .filter(f => f !== familyName)
                  .map((family: string) => (
                    <Link key={family} href={`/famille/${encodeURIComponent(family)}`}>
                      <Badge 
                        variant="outline" 
                        className={`${superFamily.color} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        {family}
                      </Badge>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </>
  );
}
