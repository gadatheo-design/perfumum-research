import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Leaf,
  TreeDeciduous,
  Droplets,
  Wind,
  ArrowLeft,
  MapPin,
  Beaker,
  FlaskConical,
  Info,
  Dna
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Climatic Axis Badge Component
function ClimaticAxisBadge({ axis }: { axis: string | null }) {
  if (!axis) return null;
  
  const axisConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    vent: { icon: <Wind className="w-3 h-3" />, color: "bg-sky-500/20 text-sky-400", label: "Vent" },
    bois: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-amber-500/20 text-amber-400", label: "Bois" },
    disparition: { icon: <Droplets className="w-3 h-3" />, color: "bg-violet-500/20 text-violet-400", label: "Disparition" },
    vent_bois: { icon: <Wind className="w-3 h-3" />, color: "bg-emerald-500/20 text-emerald-400", label: "Vent + Bois" },
    bois_disparition: { icon: <TreeDeciduous className="w-3 h-3" />, color: "bg-orange-500/20 text-orange-400", label: "Bois + Disparition" },
    vent_disparition: { icon: <Wind className="w-3 h-3" />, color: "bg-indigo-500/20 text-indigo-400", label: "Vent + Disparition" },
  };

  const config = axisConfig[axis] || axisConfig.vent;

  return (
    <Badge variant="secondary" className={`${config.color} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Toxicity Badge Component
function ToxicityBadge({ toxicity }: { toxicity: string | null }) {
  if (!toxicity) return null;
  
  const toxicityConfig: Record<string, { color: string; label: string }> = {
    faible: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Toxicité faible" },
    modérée: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Toxicité modérée" },
    élevée: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Toxicité élevée" },
  };

  const config = toxicityConfig[toxicity] || toxicityConfig.faible;

  return (
    <Badge variant="outline" className={`${config.color} text-xs`}>
      {config.label}
    </Badge>
  );
}

// Chemotype Card Component
function ChemotypeCard({ chemotype }: { chemotype: any }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
              <Dna className="w-5 h-5 text-primary/70" />
              {chemotype.name}
            </CardTitle>
            {chemotype.latinName && (
              <CardDescription className="italic text-sm mt-1">
                {chemotype.latinName}
              </CardDescription>
            )}
          </div>
          {chemotype.climaticAxis && (
            <ClimaticAxisBadge axis={chemotype.climaticAxis} />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Plante parente */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Leaf className="w-4 h-4 text-green-500" />
          <span>Plante: <span className="text-foreground font-medium">{chemotype.plantName}</span></span>
        </div>

        {/* Molécule dominante */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FlaskConical className="w-4 h-4 text-purple-500" />
          <span>
            Molécule dominante: <span className="text-foreground font-medium">{chemotype.dominantMoleculeName}</span>
            {(chemotype.dominantPercentageMin || chemotype.dominantPercentageMax) && (
              <span className="text-primary ml-1">
                ({chemotype.dominantPercentageMin || '?'}-{chemotype.dominantPercentageMax || '?'}%)
              </span>
            )}
          </span>
        </div>

        {/* Origine */}
        {chemotype.origin && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>{chemotype.origin}</span>
          </div>
        )}

        {/* Profil olfactif */}
        {chemotype.olfactiveProfile && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {chemotype.olfactiveProfile}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {chemotype.toxicity && <ToxicityBadge toxicity={chemotype.toxicity} />}
          {chemotype.intensity && (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              Intensité: {chemotype.intensity}/10
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Chemotypes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<string>("all");
  const [selectedAxis, setSelectedAxis] = useState<string>("all");

  const { data: chemotypes = [], isLoading } = trpc.chemotypes?.getAll.useQuery();
  const { data: stats } = trpc.chemotypes?.getStats.useQuery();

  // Get unique plant names for filter
  const plantNames = useMemo(() => {
    const names = new Set(chemotypes?.map(ct => ct.plantName));
    return Array.from(names).sort();
  }, [chemotypes]);

  // Get unique axes for filter
  const axes = useMemo(() => {
    const axisSet = new Set(chemotypes?.filter(ct => ct.climaticAxis).map(ct => ct.climaticAxis));
    return Array.from(axisSet).sort();
  }, [chemotypes]);

  // Filter chemotypes
  const filteredChemotypes = useMemo(() => {
    return chemotypes?.filter(ct => {
      const matchesSearch = !searchQuery || 
        ct.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ct.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ct.dominantMoleculeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ct.origin && ct.origin.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesPlant = selectedPlant === "all" || ct.plantName === selectedPlant;
      const matchesAxis = selectedAxis === "all" || ct.climaticAxis === selectedAxis;
      
      return matchesSearch && matchesPlant && matchesAxis;
    });
  }, [chemotypes, searchQuery, selectedPlant, selectedAxis]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back button */}
        <Link href="/recherche">
          <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la recherche
          </Button>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Dna className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Chémotypes</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Variations chimiques au sein d'une même espèce végétale
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">{stats?.total || 0}</div>
              <p className="text-sm text-muted-foreground">Chémotypes documentés</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-500">{stats?.byPlant?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Plantes avec chémotypes</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-500">{stats?.byAxis?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Axes climatiques</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-500">
                {stats?.byPlant?.[0]?.count || 0}
              </div>
              <p className="text-sm text-muted-foreground">Max par plante</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, plante, molécule ou origine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedPlant} onValueChange={setSelectedPlant}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Toutes les plantes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les plantes</SelectItem>
              {plantNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedAxis} onValueChange={setSelectedAxis}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Tous les axes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les axes</SelectItem>
              {axes.map(axis => (
                <SelectItem key={axis as string} value={axis as string}>{axis}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredChemotypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChemotypes.map(chemotype => (
              <ChemotypeCard key={chemotype.id} chemotype={chemotype} />
            ))}
          </div>
        ) : (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-12 text-center">
              <Beaker className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun chémotype trouvé</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedPlant !== "all" || selectedAxis !== "all"
                  ? "Essayez de modifier vos filtres de recherche."
                  : "La base de données des chémotypes est vide. Ajoutez des chémotypes pour commencer."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="w-5 h-5" />
              Qu'est-ce qu'un chémotype ?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              Un <strong>chémotype</strong> (ou chimiotype) désigne une variation chimique au sein d'une même espèce végétale. 
              Deux plantes de la même espèce peuvent produire des huiles essentielles de compositions très différentes 
              selon leur terroir, leur altitude, leur climat ou leur génétique.
            </p>
            <p>
              Par exemple, le <strong>Thym (Thymus vulgaris)</strong> peut présenter plusieurs chémotypes distincts :
            </p>
            <ul>
              <li><strong>Thym à thymol</strong> : puissant, phénolique, antiseptique</li>
              <li><strong>Thym à linalol</strong> : doux, floral, bien toléré</li>
              <li><strong>Thym à géraniol</strong> : rosé, délicat, anti-infectieux</li>
              <li><strong>Thym à thujanol</strong> : frais, hépatique, régénérant</li>
            </ul>
            <p>
              La connaissance des chémotypes est essentielle en parfumerie et aromathérapie pour garantir 
              la reproductibilité des formulations et adapter les usages aux propriétés spécifiques de chaque variante.
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
