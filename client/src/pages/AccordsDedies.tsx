// @ts-nocheck
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles, Beaker, Layers, Wind, Clock, ChevronDown, ChevronUp, FlaskConical, Droplets, Leaf } from "lucide-react";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";

// Radar Chart Component for Olfactive Profile
function OlfactiveRadar({ 
  data 
}: { 
  data: { label: string; value: number; color: string }[] 
}) {
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const angleStep = (2 * Math.PI) / data.length;
  
  // Calculate points for the polygon
  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (item.value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 25) * Math.cos(angle),
      labelY: center + (radius + 25) * Math.sin(angle),
      ...item
    };
  });
  
  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  
  // Grid circles
  const gridCircles = [0.25, 0.5, 0.75, 1].map(scale => (
    <circle
      key={scale}
      cx={center}
      cy={center}
      r={radius * scale}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.1}
      strokeWidth={1}
    />
  ));
  
  // Grid lines
  const gridLines = data.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2;
    return (
      <line
        key={index}
        x1={center}
        y1={center}
        x2={center + radius * Math.cos(angle)}
        y2={center + radius * Math.sin(angle)}
        stroke="currentColor"
        strokeOpacity={0.1}
        strokeWidth={1}
      />
    );
  });
  
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[200px] mx-auto">
      {gridCircles}
      {gridLines}
      <polygon
        points={polygonPoints}
        fill="hsl(var(--primary))"
        fillOpacity={0.2}
        stroke="hsl(var(--primary))"
        strokeWidth={2}
      />
      {points.map((point, index) => (
        <g key={index}>
          <circle
            cx={point.x}
            cy={point.y}
            r={4}
            fill="hsl(var(--primary))"
          />
          <text
            x={point.labelX}
            y={point.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] fill-muted-foreground font-medium"
          >
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Note Pyramid Component
function NotePyramid({ 
  topNotes, 
  heartNotes, 
  baseNotes 
}: { 
  topNotes?: { molecule: string; percentage: number; source: string }[];
  heartNotes?: { molecule: string; percentage: number; source: string }[];
  baseNotes?: { molecule: string; percentage: number; source: string }[];
}) {
  const sourceColors: Record<string, string> = {
    tabac: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
    cannabis: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
    parfum: "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
  };
  
  const NoteSection = ({ 
    title, 
    icon: Icon, 
    notes, 
    bgColor 
  }: { 
    title: string; 
    icon: any; 
    notes?: { molecule: string; percentage: number; source: string }[];
    bgColor: string;
  }) => (
    <div className={`p-4 rounded-lg ${bgColor}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4" />
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      {notes && notes.length > 0 ? (
        <div className="space-y-2">
          {notes.map((note, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <span className="text-sm">{note.molecule}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${sourceColors[note.source] || ''}`}>
                  {note.source}
                </Badge>
                <span className="text-xs text-muted-foreground">{note.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">Non défini</p>
      )}
    </div>
  );
  
  return (
    <div className="space-y-3">
      <NoteSection 
        title="Notes de Tête" 
        icon={Wind} 
        notes={topNotes} 
        bgColor="bg-sky-500/10"
      />
      <NoteSection 
        title="Notes de Cœur" 
        icon={Droplets} 
        notes={heartNotes} 
        bgColor="bg-rose-500/10"
      />
      <NoteSection 
        title="Notes de Fond" 
        icon={Layers} 
        notes={baseNotes} 
        bgColor="bg-amber-500/10"
      />
    </div>
  );
}

// Accord Card Component
function AccordCard({ accord, expanded, onToggle }: { 
  accord: any; 
  expanded: boolean;
  onToggle: () => void;
}) {
  const categoryLabels: Record<string, { label: string; color: string }> = {
    fumoir: { label: "Fumoir", color: "bg-amber-500/20 text-amber-700 dark:text-amber-400" },
    hash: { label: "Hash", color: "bg-orange-500/20 text-orange-700 dark:text-orange-400" },
    herbal: { label: "Herbacé", color: "bg-green-500/20 text-green-700 dark:text-green-400" },
    hybrid: { label: "Hybride", color: "bg-purple-500/20 text-purple-700 dark:text-purple-400" },
  };
  
  const diffusionLabels: Record<string, string> = {
    faible: "Diffusion faible",
    moyenne: "Diffusion moyenne",
    forte: "Diffusion forte",
  };
  
  const tenacityLabels: Record<string, string> = {
    fugace: "Fugace",
    modérée: "Modérée",
    tenace: "Tenace",
  };
  
  // Build radar data from terpene profile
  const radarData = useMemo(() => {
    if (!accord.terpeneProfile) return [];
    return accord.terpeneProfile.slice(0, 6).map((t: any) => ({
      label: t.terpene?.substring(0, 6) || 'N/A',
      value: t.percentage || 0,
      color: 'hsl(var(--primary))'
    }));
  }, [accord.terpeneProfile]);
  
  const categoryInfo = categoryLabels[accord.category] || { label: accord.category, color: "bg-muted" };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className={categoryInfo.color}>
                {categoryInfo.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{accord.accordId}</span>
            </div>
            <CardTitle className="text-2xl">{accord.name}</CardTitle>
          </div>
          <div className="flex gap-2">
            {accord.diffusion && (
              <Badge variant="outline" className="text-xs">
                <Wind className="h-3 w-3 mr-1" />
                {diffusionLabels[accord.diffusion] || accord.diffusion}
              </Badge>
            )}
            {accord.tenacity && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {tenacityLabels[accord.tenacity] || accord.tenacity}
              </Badge>
            )}
          </div>
        </div>
        {accord.description && (
          <CardDescription className="mt-2 text-base">
            {accord.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          {accord.targetEffect && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Effet Recherché</p>
              <p className="text-sm font-medium">{accord.targetEffect}</p>
            </div>
          )}
          {accord.dilutionRecommendation && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Dilution</p>
              <p className="text-sm font-medium">{accord.dilutionRecommendation}</p>
            </div>
          )}
          {accord.sillage && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sillage</p>
              <p className="text-sm font-medium capitalize">{accord.sillage}</p>
            </div>
          )}
        </div>
        
        {/* Expandable Content */}
        <Button 
          variant="ghost" 
          className="w-full justify-between"
          onClick={onToggle}
        >
          <span className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Voir la composition détaillée
          </span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {expanded && (
          <div className="space-y-6 pt-4 border-t animate-in slide-in-from-top-2 duration-300">
            <Tabs defaultValue="pyramid" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pyramid">Pyramide</TabsTrigger>
                <TabsTrigger value="formula">Formule</TabsTrigger>
                <TabsTrigger value="terpenes">Terpènes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pyramid" className="mt-4">
                <NotePyramid 
                  topNotes={accord.topNotes}
                  heartNotes={accord.heartNotes}
                  baseNotes={accord.baseNotes}
                />
              </TabsContent>
              
              <TabsContent value="formula" className="mt-4">
                {accord.formula ? (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {accord.formula}
                    </pre>
                  </div>
                ) : accord.formulaJson ? (
                  <div className="space-y-2">
                    {accord.formulaJson.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.role}
                          </Badge>
                          <span className="text-sm">{item.ingredient}</span>
                        </div>
                        <span className="text-sm font-mono">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    Formule non disponible
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="terpenes" className="mt-4">
                {radarData.length > 0 ? (
                  <div className="flex flex-col items-center gap-4">
                    <OlfactiveRadar data={radarData} />
                    <div className="w-full space-y-2">
                      {accord.terpeneProfile?.map((t: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <span className="text-sm font-medium">{t.terpene}</span>
                          <div className="flex items-center gap-4">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${t.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-mono w-12 text-right">{t.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    Profil terpénique non disponible
                  </p>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Key Interactions */}
            {accord.keyInteractions && accord.keyInteractions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  Interactions Clés
                </h4>
                <div className="grid gap-2">
                  {accord.keyInteractions.map((interaction: any, idx: number) => (
                    <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {interaction.type}
                        </Badge>
                        <span className="text-sm font-medium">{interaction.interaction}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{interaction.effect}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Usage Recommendations */}
            {accord.usageRecommendations && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Recommandations d'Usage
                </h4>
                <p className="text-sm text-muted-foreground">
                  {accord.usageRecommendations}
                </p>
              </div>
            )}
            
            {/* Inspiration */}
            {accord.inspiration && (
              <div className="p-4 border-l-4 border-primary/50 bg-muted/30 rounded-r-lg">
                <p className="text-sm italic text-muted-foreground">
                  <span className="font-semibold not-italic">Inspiration:</span> {accord.inspiration}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AccordsDedies() {
  const { data: aromaticAccords, isLoading: loadingAromatic } = trpc.aromaticAccords.list.useQuery();
  const { data: accords, isLoading: loadingAccords } = trpc.accords.list.useQuery();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedAccords, setExpandedAccords] = useState<Set<number>>(new Set());
  
  const isLoading = loadingAromatic || loadingAccords;
  
  // Toggle expanded state
  const toggleExpanded = (id: number) => {
    setExpandedAccords(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  // Combine and filter accords
  const filteredAromaticAccords = useMemo(() => {
    if (!aromaticAccords) return [];
    
    return aromaticAccords.filter(accord => {
      const matchesSearch = 
        accord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        accord.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        accord.accordId?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === "all" || accord.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [aromaticAccords, searchQuery, categoryFilter]);
  
  // Filter classic accords
  const filteredClassicAccords = useMemo(() => {
    if (!accords) return [];
    
    return accords.filter(accord => {
      const matchesSearch = 
        accord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        accord.olfactiveProfile?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [accords, searchQuery]);
  
  // Category options
  const categoryOptions = [
    { value: "fumoir", label: "Fumoir" },
    { value: "hash", label: "Hash" },
    { value: "herbal", label: "Herbacé" },
    { value: "hybrid", label: "Hybride" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Accords Olfactifs
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
                Explorez les accords olfactifs du projet PERFUMUM — compositions moléculaires uniques combinant tabac, cannabis et parfumerie traditionnelle.
              </p>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Beaker className="h-4 w-4" />
                  {aromaticAccords?.length || 0} accords aromatiques
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  {accords?.length || 0} accords classiques
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Rechercher un accord..."
                  />
                </div>
                <FilterSelect
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={categoryOptions}
                  placeholder="Catégorie"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Aromatic Accords Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Accords Aromatiques</h2>
                  <p className="text-muted-foreground">
                    Compositions avancées avec pyramide olfactive et profil terpénique
                  </p>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredAromaticAccords.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Beaker className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun accord aromatique trouvé</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Les accords aromatiques seront ajoutés prochainement
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredAromaticAccords.map((accord) => (
                    <AccordCard 
                      key={accord.id} 
                      accord={accord}
                      expanded={expandedAccords.has(accord.id)}
                      onToggle={() => toggleExpanded(accord.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Classic Accords Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Accords Classiques</h2>
                  <p className="text-muted-foreground">
                    {filteredClassicAccords.length} accord{filteredClassicAccords.length > 1 ? 's' : ''} de la base PERFUMUM
                  </p>
                </div>
              </div>
              
              {loadingAccords ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredClassicAccords.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucun accord classique trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClassicAccords.map((accord) => (
                    <Card key={accord.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg">{accord.name}</CardTitle>
                          {accord.texture && (
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {accord.texture}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {accord.olfactiveProfile && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {accord.olfactiveProfile}
                          </p>
                        )}
                        {accord.emotionalResonance && (
                          <p className="text-sm italic text-muted-foreground/80 line-clamp-2">
                            "{accord.emotionalResonance}"
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
