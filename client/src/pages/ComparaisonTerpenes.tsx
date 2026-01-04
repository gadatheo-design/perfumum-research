import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Flame, 
  Leaf, 
  FlaskConical, 
  Network, 
  Plus,
  X,
  Download,
  RefreshCw,
  Info
} from "lucide-react";

// Terpènes pour le radar
const TERPENES = [
  { key: 'myrcene', label: 'Myrcène', description: 'Terreux, musqué, clou de girofle' },
  { key: 'limonene', label: 'Limonène', description: 'Agrumes, citron, orange' },
  { key: 'pinene', label: 'Pinène', description: 'Pin, sapin, résine' },
  { key: 'linalool', label: 'Linalol', description: 'Floral, lavande, épicé' },
  { key: 'caryophyllene', label: 'Caryophyllène', description: 'Poivré, boisé, épicé' },
  { key: 'humulene', label: 'Humulène', description: 'Houblon, terreux, boisé' },
  { key: 'terpinolene', label: 'Terpinolène', description: 'Floral, herbacé, pin' },
  { key: 'ocimene', label: 'Ocimène', description: 'Doux, herbacé, boisé' },
  { key: 'bisabolol', label: 'Bisabolol', description: 'Floral, camomille, doux' },
  { key: 'geraniol', label: 'Géraniol', description: 'Rose, géranium, citrus' },
];

// Couleurs par source
const SOURCE_COLORS = {
  tabac: { fill: 'rgba(217, 119, 6, 0.3)', stroke: '#d97706', name: 'Tabac' },
  cannabis: { fill: 'rgba(22, 163, 74, 0.3)', stroke: '#16a34a', name: 'Cannabis' },
  parfum: { fill: 'rgba(147, 51, 234, 0.3)', stroke: '#9333ea', name: 'Parfum' },
};

interface TerpeneProfile {
  id: number;
  profileId: string;
  name: string;
  sourceType: 'tabac' | 'cannabis' | 'parfum';
  sourceName?: string | null;
  myrcene: number | null;
  limonene: number | null;
  pinene: number | null;
  linalool: number | null;
  caryophyllene: number | null;
  humulene: number | null;
  terpinolene: number | null;
  ocimene: number | null;
  bisabolol: number | null;
  geraniol: number | null;
  dominantNote?: string | null;
  olfactiveDescription?: string | null;
}

// Composant Radar Chart SVG
function RadarChart({ profiles, size = 400 }: { profiles: TerpeneProfile[]; size?: number }) {
  const center = size / 2;
  const radius = (size - 80) / 2;
  const angleStep = (2 * Math.PI) / TERPENES.length;

  // Calculer les points pour un profil
  const getPoints = (profile: TerpeneProfile) => {
    return TERPENES.map((terpene, i) => {
      const value = (profile[terpene.key as keyof TerpeneProfile] as number) || 0;
      const normalizedValue = Math.min(value, 100) / 100;
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * normalizedValue * Math.cos(angle);
      const y = center + radius * normalizedValue * Math.sin(angle);
      return { x, y, value };
    });
  };

  // Générer les cercles de grille
  const gridCircles = [20, 40, 60, 80, 100];

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grille de fond */}
      <g className="grid">
        {/* Cercles concentriques */}
        {gridCircles.map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={radius * (level / 100)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        ))}
        
        {/* Lignes radiales et labels */}
        {TERPENES.map((terpene, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          const labelX = center + (radius + 30) * Math.cos(angle);
          const labelY = center + (radius + 30) * Math.sin(angle);
          
          return (
            <g key={terpene.key}>
              <line
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeWidth={1}
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-current opacity-70"
                fontSize={11}
              >
                {terpene.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Profils */}
      {profiles.map((profile, profileIndex) => {
        const points = getPoints(profile);
        const pathData = points.map((p, i) => 
          `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
        ).join(' ') + ' Z';
        
        const colors = SOURCE_COLORS[profile.sourceType];
        
        return (
          <g key={profile.id}>
            {/* Zone remplie */}
            <path
              d={pathData}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={2}
              className="transition-all duration-300"
            />
            
            {/* Points */}
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={4}
                fill={colors.stroke}
                className="transition-all duration-300"
              />
            ))}
          </g>
        );
      })}

      {/* Légende des niveaux */}
      {gridCircles.map((level) => (
        <text
          key={level}
          x={center + 5}
          y={center - radius * (level / 100) + 4}
          className="text-xs fill-current opacity-40"
          fontSize={9}
        >
          {level}
        </text>
      ))}
    </svg>
  );
}

export default function ComparaisonTerpenes() {
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  // Fetch profiles
  const { data: profiles, isLoading } = trpc.terpeneComparison.list.useQuery();

  // Filter profiles by source
  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    if (sourceFilter === "all") return profiles;
    return profiles.filter(p => p.sourceType === sourceFilter);
  }, [profiles, sourceFilter]);

  // Get selected profile objects
  const selectedProfileObjects = useMemo(() => {
    if (!profiles) return [];
    return profiles.filter(p => selectedProfiles.includes(p.id));
  }, [profiles, selectedProfiles]);

  // Toggle profile selection
  const toggleProfile = (id: number) => {
    setSelectedProfiles(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id);
      }
      if (prev.length >= 5) {
        return prev; // Max 5 profiles
      }
      return [...prev, id];
    });
  };

  // Find aromatic bridges (common high terpenes)
  const aromaticBridges = useMemo(() => {
    if (selectedProfileObjects.length < 2) return [];
    
    const bridges: Array<{ terpene: string; profiles: string[]; avgValue: number }> = [];
    
    TERPENES.forEach(terpene => {
      const profilesWithHighValue = selectedProfileObjects.filter(p => {
        const value = p[terpene.key as keyof TerpeneProfile] as number;
        return value && value >= 30;
      });
      
      if (profilesWithHighValue.length >= 2) {
        const avgValue = profilesWithHighValue.reduce((sum, p) => {
          return sum + ((p[terpene.key as keyof TerpeneProfile] as number) || 0);
        }, 0) / profilesWithHighValue.length;
        
        bridges.push({
          terpene: terpene.label,
          profiles: profilesWithHighValue.map(p => p.name),
          avgValue: Math.round(avgValue)
        });
      }
    });
    
    return bridges.sort((a, b) => b.avgValue - a.avgValue);
  }, [selectedProfileObjects]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-green-900 text-white">
        <div className="container py-8">
          <Link href="/interactions-tabac-cannabis">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux interactions
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Comparaison Terpénique</h1>
              <p className="text-white/70 mt-1">
                Superposez les profils du tabac, cannabis et parfumerie
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6">
            {Object.entries(SOURCE_COLORS).map(([key, { stroke, name }]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: stroke }} />
                <span className="text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Selection */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sélection des profils</CardTitle>
                <CardDescription>
                  Choisissez jusqu'à 5 profils à comparer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Source Filter */}
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les sources</SelectItem>
                    <SelectItem value="tabac">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-amber-500" />
                        Tabac
                      </div>
                    </SelectItem>
                    <SelectItem value="cannabis">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-500" />
                        Cannabis
                      </div>
                    </SelectItem>
                    <SelectItem value="parfum">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-purple-500" />
                        Parfum
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Profile List */}
                <ScrollArea className="h-[400px] pr-4">
                  {isLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : filteredProfiles.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Network className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Aucun profil disponible</p>
                      <p className="text-sm">Les profils seront ajoutés prochainement.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredProfiles.map(profile => {
                        const isSelected = selectedProfiles.includes(profile.id);
                        const colors = SOURCE_COLORS[profile.sourceType as keyof typeof SOURCE_COLORS];
                        
                        return (
                          <div
                            key={profile.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => toggleProfile(profile.id)}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox 
                                checked={isSelected}
                                onCheckedChange={() => toggleProfile(profile.id)}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: colors.stroke }}
                                  />
                                  <span className="font-medium truncate">{profile.name}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {profile.sourceName || colors.name}
                                </div>
                                {profile.dominantNote && (
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    {profile.dominantNote}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>

                {/* Selected count */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    {selectedProfiles.length}/5 sélectionnés
                  </span>
                  {selectedProfiles.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedProfiles([])}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Effacer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radar Chart */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Graphique Radar</CardTitle>
                    <CardDescription>
                      Visualisation comparative des profils terpéniques
                    </CardDescription>
                  </div>
                  {selectedProfileObjects.length > 0 && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedProfileObjects.length === 0 ? (
                  <div className="h-[400px] flex items-center justify-center text-center">
                    <div>
                      <Network className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Sélectionnez des profils</h3>
                      <p className="text-muted-foreground max-w-md">
                        Choisissez au moins un profil dans la liste de gauche pour visualiser 
                        sa composition terpénique sur le graphique radar.
                      </p>
                    </div>
                  </div>
                ) : (
                  <RadarChart profiles={selectedProfileObjects as TerpeneProfile[]} size={450} />
                )}
              </CardContent>
            </Card>

            {/* Aromatic Bridges */}
            {aromaticBridges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Ponts Aromatiques Identifiés
                  </CardTitle>
                  <CardDescription>
                    Terpènes communs entre les profils sélectionnés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {aromaticBridges.map((bridge, i) => (
                      <div 
                        key={i}
                        className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{bridge.terpene}</span>
                          <Badge variant="secondary">{bridge.avgValue}%</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Présent dans: {bridge.profiles.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Profiles Details */}
            {selectedProfileObjects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Détails des profils</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedProfileObjects.map(profile => {
                      const colors = SOURCE_COLORS[profile.sourceType as keyof typeof SOURCE_COLORS];
                      
                      return (
                        <div 
                          key={profile.id}
                          className="p-4 rounded-lg border"
                          style={{ borderLeftColor: colors.stroke, borderLeftWidth: 4 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{profile.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {profile.sourceName || colors.name}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleProfile(profile.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {profile.olfactiveDescription && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {profile.olfactiveDescription}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {TERPENES.map(terpene => {
                              const value = profile[terpene.key as keyof typeof profile] as number;
                              if (!value || value < 10) return null;
                              
                              return (
                                <Badge 
                                  key={terpene.key}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {terpene.label}: {value}%
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Terpene Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Référence des Terpènes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {TERPENES.map(terpene => (
                    <div key={terpene.key} className="flex items-start gap-3 p-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <div className="font-medium text-sm">{terpene.label}</div>
                        <div className="text-xs text-muted-foreground">{terpene.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
