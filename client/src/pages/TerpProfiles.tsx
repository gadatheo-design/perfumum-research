// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { TerpProfileForm } from "@/components/forms/TerpProfileForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wind, 
  TreeDeciduous, 
  Sparkles, 
  Search, 
  Plus, 
  Filter,
  Leaf,
  FlaskConical,
  ArrowLeft,
  Radar,
  Clock,
  Target
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// Radar Chart Component for Terp Profile visualization
function TerpRadarChart({ profile }: { profile: any }) {
  const radarData = [
    { axis: "Vent", value: profile.radarVent || 50 },
    { axis: "Bois", value: profile.radarBois || 50 },
    { axis: "Disparition", value: profile.radarDisparition || 50 },
    { axis: "Structure", value: profile.radarStructure || 50 },
    { axis: "Diffusion", value: profile.radarDiffusion || 50 },
  ];

  const size = 120;
  const center = size / 2;
  const maxRadius = size / 2 - 10;
  const angleSlice = (Math.PI * 2) / radarData.length;

  const getPoint = (value: number, index: number) => {
    const radius = (value / 100) * maxRadius;
    const angle = angleSlice * index - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const pathData = radarData
    .map((d, i) => {
      const point = getPoint(d.value, i);
      return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ") + " Z";

  return (
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
      {/* Axis lines */}
      {radarData.map((_, i) => {
        const point = getPoint(100, i);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="currentColor"
            strokeOpacity={0.2}
          />
        );
      })}
      {/* Data polygon */}
      <path
        d={pathData}
        fill="hsl(var(--primary))"
        fillOpacity={0.3}
        stroke="hsl(var(--primary))"
        strokeWidth={2}
      />
      {/* Data points */}
      {radarData.map((d, i) => {
        const point = getPoint(d.value, i);
        return (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={3}
            fill="hsl(var(--primary))"
          />
        );
      })}
    </svg>
  );
}

// Climatic Axis Badge Component
function ClimaticAxisBadge({ axis }: { axis: string }) {
  const axisConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    vent: { icon: <Wind className="w-3 h-3" />, color: "bg-sky-500/20 text-sky-400 border-sky-500/30", label: "Vent" },
    bois: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Bois" },
    disparition: { icon: <Sparkles className="w-3 h-3" />, color: "bg-violet-500/20 text-violet-400 border-violet-500/30", label: "Disparition" },
    vent_bois: { icon: <Wind className="w-3 h-3" />, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Vent + Bois" },
    bois_disparition: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "Bois + Disparition" },
    vent_disparition: { icon: <Wind className="w-3 h-3" />, color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", label: "Vent + Disparition" },
    vent_bois_disparition: { icon: <Target className="w-3 h-3" />, color: "bg-rose-500/20 text-rose-400 border-rose-500/30", label: "Triple Axe" },
  };

  const config = axisConfig[axis] || axisConfig.vent;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Usage Badge Component
function UsageBadge({ usage }: { usage: string }) {
  const usageConfig: Record<string, { label: string; color: string }> = {
    parfum: { label: "Parfum", color: "bg-pink-500/20 text-pink-400" },
    encens: { label: "Encens", color: "bg-amber-500/20 text-amber-400" },
    espace: { label: "Espace", color: "bg-cyan-500/20 text-cyan-400" },
    parfum_encens: { label: "Parfum + Encens", color: "bg-orange-500/20 text-orange-400" },
    parfum_espace: { label: "Parfum + Espace", color: "bg-purple-500/20 text-purple-400" },
    encens_espace: { label: "Encens + Espace", color: "bg-teal-500/20 text-teal-400" },
    tous: { label: "Tous usages", color: "bg-emerald-500/20 text-emerald-400" },
  };

  const config = usageConfig[usage] || usageConfig.parfum;

  return (
    <Badge variant="secondary" className={config.color}>
      {config.label}
    </Badge>
  );
}

// Terp Profile Card Component
function TerpProfileCard({ profile }: { profile: any }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {profile.name}
            </CardTitle>
            <CardDescription className="font-mono text-xs mt-1">
              {profile.profileId}
            </CardDescription>
          </div>
          <TerpRadarChart profile={profile} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <ClimaticAxisBadge axis={profile.climaticAxis} />
          {profile.usage && <UsageBadge usage={profile.usage} />}
        </div>
        
        {profile.function && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {profile.function}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {profile.temporality && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="capitalize">{profile.temporality.replace('_', ' ')}</span>
            </div>
          )}
          {profile.intensity && (
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span className="capitalize">{profile.intensity}</span>
            </div>
          )}
        </div>

        {profile.olfactiveReading && (
          <p className="text-xs italic text-muted-foreground border-l-2 border-primary/30 pl-2 line-clamp-2">
            "{profile.olfactiveReading}"
          </p>
        )}

        <div className="pt-2 flex justify-end">
          <Link href={`/terp-profiles/${profile.id}`}>
            <Button variant="ghost" size="sm" className="text-xs">
              Voir la fiche →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TerpProfiles() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAxis, setSelectedAxis] = useState<string>("all");
  const [selectedUsage, setSelectedUsage] = useState<string>("all");

  const { data: profiles, isLoading } = trpc.terpProfiles.list.useQuery();

  // Filter profiles
  const filteredProfiles = profiles?.filter((profile: any) => {
    const matchesSearch = 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.profileId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (profile.function && profile.function.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAxis = selectedAxis === "all" || profile.climaticAxis === selectedAxis;
    const matchesUsage = selectedUsage === "all" || profile.usage === selectedUsage;

    return matchesSearch && matchesAxis && matchesUsage;
  }) || [];

  // Group by climatic axis
  const groupedByAxis = filteredProfiles.reduce((acc: any, profile: any) => {
    const axis = profile.climaticAxis || "other";
    if (!acc[axis]) acc[axis] = [];
    acc[axis].push(profile);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div className="container py-8 space-y-8">
      <Breadcrumbs />
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/leaf-economies">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Leaf Economies
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              TerpProfiles
            </h1>
            <p className="text-muted-foreground mt-1">
              Fiches interactives San Andrés — Formules analytiques et profils climatiques
            </p>
          </div>
          <TerpProfileForm />
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, ID ou fonction..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedAxis} onValueChange={setSelectedAxis}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Axe climatique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les axes</SelectItem>
                  <SelectItem value="vent">Vent</SelectItem>
                  <SelectItem value="bois">Bois</SelectItem>
                  <SelectItem value="disparition">Disparition</SelectItem>
                  <SelectItem value="vent_bois">Vent + Bois</SelectItem>
                  <SelectItem value="bois_disparition">Bois + Disparition</SelectItem>
                  <SelectItem value="vent_disparition">Vent + Disparition</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedUsage} onValueChange={setSelectedUsage}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <FlaskConical className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Usage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les usages</SelectItem>
                  <SelectItem value="parfum">Parfum</SelectItem>
                  <SelectItem value="encens">Encens</SelectItem>
                  <SelectItem value="espace">Espace</SelectItem>
                  <SelectItem value="tous">Tous usages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-sky-500/10 border-sky-500/20">
            <CardContent className="pt-4 text-center">
              <Wind className="w-6 h-6 mx-auto text-sky-400 mb-2" />
              <div className="text-2xl font-bold text-sky-400">
                {groupedByAxis.vent?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Axe Vent</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="pt-4 text-center">
              <TreeDeciduous className="w-6 h-6 mx-auto text-amber-400 mb-2" />
              <div className="text-2xl font-bold text-amber-400">
                {groupedByAxis.bois?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Axe Bois</div>
            </CardContent>
          </Card>
          <Card className="bg-violet-500/10 border-violet-500/20">
            <CardContent className="pt-4 text-center">
              <Sparkles className="w-6 h-6 mx-auto text-violet-400 mb-2" />
              <div className="text-2xl font-bold text-violet-400">
                {groupedByAxis.disparition?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Axe Disparition</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <CardContent className="pt-4 text-center">
              <Leaf className="w-6 h-6 mx-auto text-emerald-400 mb-2" />
              <div className="text-2xl font-bold text-emerald-400">
                {filteredProfiles.length}
              </div>
              <div className="text-xs text-muted-foreground">Total fiches</div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/4 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProfiles.length === 0 ? (
          <Card className="bg-card/50">
            <CardContent className="py-12 text-center">
              <Radar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune fiche trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedAxis !== "all" || selectedUsage !== "all"
                  ? "Essayez de modifier vos filtres de recherche."
                  : "Commencez par créer votre première fiche TerpProfile."}
              </p>
              <Button onClick={() => toast({ title: "Information", description: "Fonctionnalité en cours de développement" })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une fiche
                </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="grid" className="space-y-6">
            <TabsList>
              <TabsTrigger value="grid">Grille</TabsTrigger>
              <TabsTrigger value="by-axis">Par axe climatique</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile: any) => (
                  <TerpProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="by-axis" className="space-y-8">
              {Object.entries(groupedByAxis).map(([axis, axisProfiles]: [string, any]) => (
                <div key={axis}>
                  <div className="flex items-center gap-2 mb-4">
                    <ClimaticAxisBadge axis={axis} />
                    <span className="text-sm text-muted-foreground">
                      ({axisProfiles.length} fiche{axisProfiles.length > 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {axisProfiles.map((profile: any) => (
                      <TerpProfileCard key={profile.id} profile={profile} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Footer />
    </>
  );
}
