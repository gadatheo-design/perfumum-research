// @ts-nocheck
import { safeJsonParse } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Leaf, 
  Wind, 
  TreeDeciduous, 
  Sparkles,
  BarChart3,
  Info
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// Radar Chart Component for comparison
function ComparisonRadarChart({ profiles }: { profiles: any[] }) {
  const size = 300;
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const axes = ["Vent", "Bois", "Disparition", "Structure", "Diffusion"];
  const angleSlice = (Math.PI * 2) / axes.length;

  const colors = [
    "hsl(var(--primary))",
    "hsl(142, 76%, 36%)", // green
    "hsl(38, 92%, 50%)",  // amber
    "hsl(280, 68%, 60%)", // purple
    "hsl(199, 89%, 48%)", // cyan
    "hsl(0, 72%, 51%)",   // red
  ];

  const getPoint = (value: number, index: number) => {
    const radius = (value / 100) * maxRadius;
    const angle = angleSlice * index - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const getProfileData = (profile: any) => [
    profile.radarVent || 50,
    profile.radarBois || 50,
    profile.radarDisparition || 50,
    profile.radarStructure || 50,
    profile.radarDiffusion || 50,
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} className="mx-auto">
        {/* Grid circles */}
        {[25, 50, 75, 100].map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / 100) * maxRadius}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
          />
        ))}
        {/* Axis lines and labels */}
        {axes.map((axis, i) => {
          const point = getPoint(100, i);
          const labelPoint = getPoint(115, i);
          return (
            <g key={i}>
              <line
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="currentColor"
                strokeOpacity={0.2}
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-muted-foreground"
              >
                {axis}
              </text>
            </g>
          );
        })}
        {/* Profile polygons */}
        {profiles.map((profile, profileIndex) => {
          const data = getProfileData(profile);
          const pathData = data
            .map((value, i) => {
              const point = getPoint(value, i);
              return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
            })
            .join(" ") + " Z";

          return (
            <g key={profile.id}>
              <path
                d={pathData}
                fill={colors[profileIndex % colors.length]}
                fillOpacity={0.15}
                stroke={colors[profileIndex % colors.length]}
                strokeWidth={2}
              />
              {data.map((value, i) => {
                const point = getPoint(value, i);
                return (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill={colors[profileIndex % colors.length]}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4">
        {profiles.map((profile, index) => (
          <div key={profile.id} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm">{profile.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bar Chart for molecule comparison
function MoleculeBarChart({ profiles }: { profiles: any[] }) {
  const allMolecules = useMemo(() => {
    const moleculeSet = new Set<string>();
    profiles.forEach(profile => {
      try {
        const concentrate = typeof profile.concentrate === 'string' 
          ? safeJsonParse(profile.concentrate, null) 
          : profile.concentrate;
        if (Array.isArray(concentrate)) {
          concentrate.forEach((item: any) => {
            if (item.ingredient) moleculeSet.add(item.ingredient);
          });
        }
      } catch (e) {}
    });
    return Array.from(moleculeSet).slice(0, 10); // Top 10 molecules
  }, [profiles]);

  const colors = [
    "hsl(var(--primary))",
    "hsl(142, 76%, 36%)",
    "hsl(38, 92%, 50%)",
    "hsl(280, 68%, 60%)",
    "hsl(199, 89%, 48%)",
    "hsl(0, 72%, 51%)",
  ];

  const getPercentage = (profile: any, molecule: string) => {
    try {
      const concentrate = typeof profile.concentrate === 'string' 
        ? safeJsonParse(profile.concentrate, null) 
        : profile.concentrate;
      if (Array.isArray(concentrate)) {
        const item = concentrate.find((c: any) => c.ingredient === molecule);
        return item?.percentage || 0;
      }
    } catch (e) {}
    return 0;
  };

  return (
    <div className="space-y-4">
      {allMolecules.map((molecule) => (
        <div key={molecule} className="space-y-1">
          <div className="text-sm font-medium">{molecule}</div>
          <div className="flex gap-1">
            {profiles.map((profile, index) => {
              const percentage = getPercentage(profile, molecule);
              return (
                <div key={profile.id} className="flex-1">
                  <div 
                    className="h-6 rounded transition-all"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: colors[index % colors.length],
                      minWidth: percentage > 0 ? '4px' : '0'
                    }}
                    title={`${profile.name}: ${percentage}%`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-4 border-t">
        {profiles.map((profile, index) => (
          <div key={profile.id} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm">{profile.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TerpProfilesCompare() {
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const { data: profiles, isLoading } = trpc.terpProfiles.list.useQuery();

  const selectedProfilesData = useMemo(() => {
    if (!profiles) return [];
    return profiles.filter((p: any) => selectedProfiles.includes(p.id));
  }, [profiles, selectedProfiles]);

  const toggleProfile = (id: number) => {
    setSelectedProfiles(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id);
      }
      if (prev.length >= 6) {
        return prev; // Max 6 profiles
      }
      return [...prev, id];
    });
  };

  const getCollectionIcon = (collection: string) => {
    if (collection?.includes('Tabac')) return <Leaf className="w-4 h-4 text-amber-600" />;
    if (collection?.includes('Cannabis')) return <Sparkles className="w-4 h-4 text-green-600" />;
    if (collection?.includes('Parfumerie')) return <Wind className="w-4 h-4 text-purple-600" />;
    return <TreeDeciduous className="w-4 h-4" />;
  };

  const getCollectionColor = (collection: string) => {
    if (collection?.includes('Tabac')) return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
    if (collection?.includes('Cannabis')) return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30';
    if (collection?.includes('Parfumerie')) return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30';
    return 'bg-muted text-muted-foreground border-border';
  };

  // Group profiles by collection
  const groupedProfiles = useMemo(() => {
    if (!profiles) return {};
    return profiles.reduce((acc: Record<string, any[]>, profile: any) => {
      const collection = profile.collection || 'Autres';
      if (!acc[collection]) acc[collection] = [];
      acc[collection].push(profile);
      return acc;
    }, {});
  }, [profiles]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      <main className="flex-1 container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/terp-profiles">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Comparaison des Profils Terpéniques</h1>
            <p className="text-muted-foreground mt-1">
              Sélectionnez jusqu'à 6 profils pour les comparer visuellement
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Profils disponibles
              </CardTitle>
              <CardDescription>
                {selectedProfiles.length}/6 profils sélectionnés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedProfiles).map(([collection, collectionProfiles]) => (
                      <div key={collection}>
                        <div className="flex items-center gap-2 mb-2">
                          {getCollectionIcon(collection)}
                          <span className="text-sm font-medium">{collection}</span>
                        </div>
                        <div className="space-y-2 pl-6">
                          {(collectionProfiles as any[]).map((profile: any) => (
                            <div
                              key={profile.id}
                              className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                                selectedProfiles.includes(profile.id)
                                  ? 'bg-primary/10 border-primary'
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => toggleProfile(profile.id)}
                            >
                              <Checkbox
                                checked={selectedProfiles.includes(profile.id)}
                                onCheckedChange={() => toggleProfile(profile.id)}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{profile.name}</div>
                                <Badge variant="outline" className={`text-xs ${getCollectionColor(collection)}`}>
                                  {profile.climaticAxis}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Comparison View */}
          <div className="lg:col-span-2 space-y-6">
            {selectedProfilesData.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Info className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucun profil sélectionné</h3>
                  <p className="text-muted-foreground">
                    Sélectionnez des profils dans la liste pour les comparer
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="radar" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="radar">Radar Climatique</TabsTrigger>
                  <TabsTrigger value="molecules">Composition</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                </TabsList>

                <TabsContent value="radar" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparaison Radar</CardTitle>
                      <CardDescription>
                        Axes climatiques: Vent, Bois, Disparition, Structure, Diffusion
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ComparisonRadarChart profiles={selectedProfilesData} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="molecules" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Composition Moléculaire</CardTitle>
                      <CardDescription>
                        Pourcentages des molécules principales
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MoleculeBarChart profiles={selectedProfilesData} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <div className="grid gap-4">
                    {selectedProfilesData.map((profile: any) => (
                      <Card key={profile.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              {getCollectionIcon(profile.collection)}
                              {profile.name}
                            </CardTitle>
                            <Badge variant="outline" className={getCollectionColor(profile.collection)}>
                              {profile.collection}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-1">Lecture olfactive</div>
                            <p className="text-sm text-muted-foreground">
                              {profile.olfactiveReading || 'Non renseigné'}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium mb-1">Axe climatique</div>
                              <Badge variant="secondary">{profile.climaticAxis}</Badge>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">Temporalité</div>
                              <Badge variant="secondary">{profile.temporality}</Badge>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">Intensité</div>
                              <Badge variant="secondary">{profile.intensity}</Badge>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">Lisibilité</div>
                              <Badge variant="secondary">{profile.readability}</Badge>
                            </div>
                          </div>
                          {profile.criticalNotes && (
                            <div>
                              <div className="text-sm font-medium mb-1">Notes critiques</div>
                              <p className="text-sm text-muted-foreground">{profile.criticalNotes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
