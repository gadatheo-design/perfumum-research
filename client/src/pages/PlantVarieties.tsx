// @ts-nocheck
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter,
  Leaf,
  TreeDeciduous,
  Cigarette,
  Cannabis,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  ArrowLeft,
  MapPin,
  Beaker,
  ChevronRight,
  FlaskConical,
  Dna,
  Globe,
  Info,
  Plus
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Conservation Status Configuration
const conservationStatusConfig: Record<string, { 
  label: string; 
  color: string; 
  icon: React.ReactNode;
  description: string;
}> = {
  critical: { 
    label: "Critique", 
    color: "bg-red-500/20 text-red-400 border-red-500/50", 
    icon: <AlertTriangle className="w-3 h-3" />,
    description: "En danger critique d'extinction"
  },
  endangered: { 
    label: "En danger", 
    color: "bg-orange-500/20 text-orange-400 border-orange-500/50", 
    icon: <AlertCircle className="w-3 h-3" />,
    description: "Risque élevé d'extinction"
  },
  vulnerable: { 
    label: "Vulnérable", 
    color: "bg-amber-500/20 text-amber-400 border-amber-500/50", 
    icon: <ShieldAlert className="w-3 h-3" />,
    description: "Risque d'extinction à moyen terme"
  },
  near_threatened: { 
    label: "Quasi menacé", 
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50", 
    icon: <ShieldAlert className="w-3 h-3" />,
    description: "Proche du seuil de vulnérabilité"
  },
  stable: { 
    label: "Stable", 
    color: "bg-green-500/20 text-green-400 border-green-500/50", 
    icon: <ShieldCheck className="w-3 h-3" />,
    description: "Population stable, préoccupation mineure"
  },
  data_deficient: { 
    label: "Données insuffisantes", 
    color: "bg-gray-500/20 text-gray-400 border-gray-500/50", 
    icon: <HelpCircle className="w-3 h-3" />,
    description: "Informations insuffisantes pour évaluer"
  },
  unknown: { 
    label: "Inconnu", 
    color: "bg-slate-500/20 text-slate-400 border-slate-500/50", 
    icon: <HelpCircle className="w-3 h-3" />,
    description: "Statut non évalué"
  },
};

// Variety Type Configuration
const varietyTypeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  landrace: { label: "Landrace", color: "bg-emerald-500/20 text-emerald-400", icon: <Leaf className="w-3 h-3" /> },
  cultivar: { label: "Cultivar", color: "bg-blue-500/20 text-blue-400", icon: <FlaskConical className="w-3 h-3" /> },
  chemotype: { label: "Chémotype", color: "bg-purple-500/20 text-purple-400", icon: <Beaker className="w-3 h-3" /> },
  hybrid: { label: "Hybride", color: "bg-pink-500/20 text-pink-400", icon: <Dna className="w-3 h-3" /> },
  clone: { label: "Clone", color: "bg-cyan-500/20 text-cyan-400", icon: <Dna className="w-3 h-3" /> },
  wild: { label: "Sauvage", color: "bg-lime-500/20 text-lime-400", icon: <TreeDeciduous className="w-3 h-3" /> },
  other: { label: "Autre", color: "bg-gray-500/20 text-gray-400", icon: <Leaf className="w-3 h-3" /> },
};

// Plant Category Configuration
const plantCategoryConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  cannabis: { label: "Cannabis", icon: <Cannabis className="w-4 h-4" /> },
  tabac: { label: "Tabac", icon: <Cigarette className="w-4 h-4" /> },
  aromatique: { label: "Aromatique", icon: <Leaf className="w-4 h-4" /> },
  resine: { label: "Résine", icon: <Beaker className="w-4 h-4" /> },
  bois: { label: "Bois", icon: <TreeDeciduous className="w-4 h-4" /> },
};

// Conservation Status Badge Component
function ConservationStatusBadge({ status }: { status: string | null }) {
  const config = conservationStatusConfig[status || 'unknown'] || conservationStatusConfig.unknown;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={`${config.color} flex items-center gap-1 cursor-help`}>
          {config.icon}
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Variety Type Badge Component
function VarietyTypeBadge({ type }: { type: string }) {
  const config = varietyTypeConfig[type] || varietyTypeConfig.other;
  
  return (
    <Badge variant="secondary" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Variety Card Component
function VarietyCard({ variety, plant }: { variety: any; plant: any }) {
  const dominantMolecules = variety.dominantMolecules ? 
    (typeof variety.dominantMolecules === 'string' ? JSON.parse(variety.dominantMolecules) : variety.dominantMolecules) 
    : [];

  const isCritical = variety.conservationStatus === 'critical' || variety.conservationStatus === 'endangered';

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm ${isCritical ? 'ring-1 ring-red-500/30' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                {variety.name}
              </CardTitle>
              {isCritical && (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              )}
            </div>
            {variety.latinName && (
              <CardDescription className="italic text-xs mt-1 truncate">
                {variety.latinName}
              </CardDescription>
            )}
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            {variety.varietyId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <VarietyTypeBadge type={variety.varietyType} />
          <ConservationStatusBadge status={variety.conservationStatus} />
        </div>

        {plant && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {plantCategoryConfig[plant.category]?.icon}
            <span className="font-medium">{plant.name}</span>
            {plant.latinName && <span className="italic">({plant.latinName})</span>}
          </div>
        )}

        {variety.countryOfOrigin && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {variety.countryOfOrigin}
          </div>
        )}

        {variety.olfactiveDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {variety.olfactiveDescription}
          </p>
        )}

        {dominantMolecules.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Terpènes dominants:</div>
            <div className="flex flex-wrap gap-1">
              {dominantMolecules.slice(0, 4).map((mol: any, index: number) => (
                <Badge key={index} variant="outline" className="text-xs bg-primary/5">
                  {mol.molecule} {mol.percentage && `(${mol.percentage}%)`}
                </Badge>
              ))}
              {dominantMolecules.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{dominantMolecules.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {variety.threatFactors && variety.threatFactors.length > 0 && (
          <div className="text-xs text-red-400/80 flex items-start gap-1">
            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{variety.threatFactors.join(", ")}</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Link href={`/plants/${variety.plantId}`}>
            <Button variant="ghost" size="sm" className="text-xs">
              Voir la plante
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className={`${color} border-0`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-background/50">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
function VarietyCardSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2 mt-1" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

export default function PlantVarieties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch data
  const { data: varietiesData, isLoading: isLoadingVarieties } = trpc.plantVarieties.getWithFilters.useQuery({
    plantCategory: selectedCategory !== "all" ? selectedCategory : undefined,
    varietyType: selectedType !== "all" ? selectedType : undefined,
    conservationStatus: selectedStatus !== "all" ? selectedStatus : undefined,
    countryOfOrigin: selectedCountry !== "all" ? selectedCountry : undefined,
    searchQuery: searchQuery || undefined,
  });

  const { data: criticalVarieties } = trpc.plantVarieties.getCritical.useQuery();
  const { data: conservationStats } = trpc.plantVarieties.getConservationStats.useQuery();
  const { data: cannabisLandraces } = trpc.plantVarieties.getCannabisLandraces.useQuery();
  const { data: tobaccoVarieties } = trpc.plantVarieties.getTobaccoVarieties.useQuery();
  const { data: countries } = trpc.plantVarieties.getUniqueCountries.useQuery();

  // Filter varieties based on active tab
  const displayedVarieties = useMemo(() => {
    if (!varietiesData) return [];
    
    switch (activeTab) {
      case "critical":
        return criticalVarieties || [];
      case "cannabis":
        return cannabisLandraces || [];
      case "tobacco":
        return tobaccoVarieties || [];
      default:
        return varietiesData;
    }
  }, [activeTab, varietiesData, criticalVarieties, cannabisLandraces, tobaccoVarieties]);

  const criticalCount = criticalVarieties?.length || 0;
  const cannabisCount = cannabisLandraces?.length || 0;
  const tobaccoCount = tobaccoVarieties?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/plants">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux plantes
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              Plantes & Variétés
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explorez les landraces de cannabis et les variétés de tabac avec leurs profils terpéniques. 
              Identifiez rapidement les variétés en danger critique de disparition.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/carte-varietes">
              <Button variant="outline" className="gap-2">
                <Globe className="w-4 h-4" />
                Carte des origines
              </Button>
            </Link>
            <Link href="/plantes-varietes/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle variété
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total variétés" 
            value={conservationStats?.total || 0} 
            icon={<Leaf className="w-5 h-5 text-primary" />}
            color="bg-primary/10"
          />
          <StatsCard 
            title="En danger critique" 
            value={criticalCount} 
            icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
            color="bg-red-500/10"
          />
          <StatsCard 
            title="Landraces cannabis" 
            value={cannabisCount} 
            icon={<Cannabis className="w-5 h-5 text-emerald-400" />}
            color="bg-emerald-500/10"
          />
          <StatsCard 
            title="Variétés tabac" 
            value={tobaccoCount} 
            icon={<Cigarette className="w-5 h-5 text-amber-400" />}
            color="bg-amber-500/10"
          />
        </div>

        {/* Critical Alert Banner */}
        {criticalCount > 0 && (
          <Card className="mb-6 border-red-500/30 bg-red-500/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-full bg-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-red-400">
                  {criticalCount} variété{criticalCount > 1 ? 's' : ''} en danger critique
                </div>
                <div className="text-sm text-muted-foreground">
                  Ces variétés nécessitent une attention particulière pour leur conservation.
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => setActiveTab("critical")}
              >
                Voir les variétés critiques
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="all" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Toutes</span>
            </TabsTrigger>
            <TabsTrigger value="critical" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Critiques</span>
              {criticalCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                  {criticalCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cannabis" className="gap-2">
              <Cannabis className="w-4 h-4" />
              <span className="hidden sm:inline">Cannabis</span>
            </TabsTrigger>
            <TabsTrigger value="tobacco" className="gap-2">
              <Cigarette className="w-4 h-4" />
              <span className="hidden sm:inline">Tabac</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une variété..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="cannabis">Cannabis</SelectItem>
                  <SelectItem value="tabac">Tabac</SelectItem>
                  <SelectItem value="aromatique">Aromatique</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="landrace">Landrace</SelectItem>
                  <SelectItem value="cultivar">Cultivar</SelectItem>
                  <SelectItem value="chemotype">Chémotype</SelectItem>
                  <SelectItem value="hybrid">Hybride</SelectItem>
                  <SelectItem value="wild">Sauvage</SelectItem>
                </SelectContent>
              </Select>

              {/* Conservation Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Statut conservation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="critical">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      Critique
                    </span>
                  </SelectItem>
                  <SelectItem value="endangered">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-orange-400" />
                      En danger
                    </span>
                  </SelectItem>
                  <SelectItem value="vulnerable">
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-3 h-3 text-amber-400" />
                      Vulnérable
                    </span>
                  </SelectItem>
                  <SelectItem value="stable">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-green-400" />
                      Stable
                    </span>
                  </SelectItem>
                  <SelectItem value="unknown">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-3 h-3 text-gray-400" />
                      Inconnu
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Country Filter */}
              {countries && countries.length > 0 && (
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Pays d'origine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous pays</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoadingVarieties ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <VarietyCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedVarieties && displayedVarieties.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {displayedVarieties.length} variété{displayedVarieties.length > 1 ? 's' : ''} trouvée{displayedVarieties.length > 1 ? 's' : ''}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedVarieties.map((item: any) => (
                <VarietyCard 
                  key={item.variety?.id || item.id} 
                  variety={item.variety || item} 
                  plant={item.plant} 
                />
              ))}
            </div>
          </>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Leaf className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune variété trouvée</h3>
              <p className="text-muted-foreground mb-4">
                Essayez de modifier vos filtres ou d'élargir votre recherche.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedType("all");
                setSelectedStatus("all");
                setSelectedCountry("all");
              }}>
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Conservation Status Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5" />
              Légende des statuts de conservation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(conservationStatusConfig).map(([key, config]) => (
                <div key={key} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                  <Badge variant="outline" className={`${config.color} shrink-0`}>
                    {config.icon}
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{config.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
