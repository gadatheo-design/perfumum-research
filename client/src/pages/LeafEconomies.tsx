import { safeJsonParse } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { 
  Leaf, 
  Wind, 
  TreeDeciduous, 
  Sparkles, 
  Search, 
  FlaskConical,
  MapPin,
  ChevronRight,
  FileText
} from "lucide-react";

const climaticAxisConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  vent: { label: "Vent", icon: <Wind className="h-4 w-4" />, color: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200" },
  bois: { label: "Bois", icon: <TreeDeciduous className="h-4 w-4" />, color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  disparition: { label: "Disparition", icon: <Sparkles className="h-4 w-4" />, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  sel: { label: "Sel", icon: <Sparkles className="h-4 w-4" />, color: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200" },
};

const categoryConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  aromatique: { label: "Aromatique", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: <Leaf className="h-4 w-4" /> },
  tabac: { label: "Tabac", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", icon: <Leaf className="h-4 w-4" /> },
  cannabis: { label: "Cannabis", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200", icon: <Leaf className="h-4 w-4" /> },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  brut: { label: "Brut", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
  a_analyser: { label: "À analyser", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  analyse: { label: "Analysé", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  traduction: { label: "Traduction", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  archive: { label: "Archivé", color: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200" },
};

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    return safeJsonParse(value, null);
  } catch {
    return value.split(";").map(s => s.trim()).filter(Boolean);
  }
}

export default function LeafEconomies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [axisFilter, setAxisFilter] = useState<string>("all");

  const { data: samples, isLoading } = trpc.leafEconomies.list.useQuery();

  const filteredSamples = useMemo(() => {
    if (!samples) return [];
    
    return samples.filter(sample => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          sample.sampleId?.toLowerCase().includes(search) ||
          sample.species?.toLowerCase().includes(search) ||
          sample.claimedVariety?.toLowerCase().includes(search) ||
          sample.absorbeInterpretation?.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      if (categoryFilter !== "all" && sample.category !== categoryFilter) {
        return false;
      }

      if (statusFilter !== "all" && sample.status !== statusFilter) {
        return false;
      }

      if (axisFilter !== "all") {
        const axes = parseJsonArray(sample.climaticAxis);
        if (!axes.includes(axisFilter)) return false;
      }

      return true;
    });
  }, [samples, searchTerm, categoryFilter, statusFilter, axisFilter]);

  const stats = useMemo(() => {
    if (!samples) return { total: 0, aromatique: 0, tabac: 0, cannabis: 0, withAnalysis: 0 };
    return {
      total: samples.length,
      aromatique: samples.filter(s => s.category === "aromatique").length,
      tabac: samples.filter(s => s.category === "tabac").length,
      cannabis: samples.filter(s => s.category === "cannabis").length,
      withAnalysis: samples.filter(s => s.analysisAvailable === 1).length,
    };
  }, [samples]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-900">
      <div className="bg-emerald-900 text-white py-12 px-4">
        <div className="container max-w-6xl">
      <Breadcrumbs />
          <div className="flex items-center gap-2 text-emerald-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <span>San Andrés</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Leaf Economies</h1>
          <p className="text-emerald-200 text-lg max-w-2xl">
            Tabac, Cannabis et plantes aromatiques comme régulateurs climatiques à San Andrés.
            Base relationnelle plantes ↔ molécules pour la recherche olfactive.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl py-8 px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Échantillons</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.aromatique}</div>
              <div className="text-sm text-muted-foreground">Aromatiques</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-600">{stats.tabac}</div>
              <div className="text-sm text-muted-foreground">Tabacs</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 dark:bg-emerald-900/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600">{stats.cannabis}</div>
              <div className="text-sm text-muted-foreground">Cannabis</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.withAnalysis}</div>
              <div className="text-sm text-muted-foreground">Analysés</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par espèce, variété, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="aromatique">Aromatique</SelectItem>
                  <SelectItem value="tabac">Tabac</SelectItem>
                  <SelectItem value="cannabis">Cannabis</SelectItem>
                </SelectContent>
              </Select>
              <Select value={axisFilter} onValueChange={setAxisFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Axe climatique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous axes</SelectItem>
                  <SelectItem value="vent">Vent</SelectItem>
                  <SelectItem value="bois">Bois</SelectItem>
                  <SelectItem value="disparition">Disparition</SelectItem>
                  <SelectItem value="sel">Sel</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="brut">Brut</SelectItem>
                  <SelectItem value="a_analyser">À analyser</SelectItem>
                  <SelectItem value="analyse">Analysé</SelectItem>
                  <SelectItem value="traduction">Traduction</SelectItem>
                  <SelectItem value="archive">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSamples.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun échantillon trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos filtres ou votre recherche.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSamples.map((sample) => {
              const axes = parseJsonArray(sample.climaticAxis);
              const category = categoryConfig[sample.category] || categoryConfig.aromatique;
              const status = statusConfig[sample.status || "brut"];

              return (
                <Link key={sample.id} href={`/san-andres/echantillon/${sample.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2 font-mono text-xs">
                          {sample.sampleId}
                        </Badge>
                        <CardTitle className="text-lg">
                          {sample.species || "Espèce inconnue"}
                        </CardTitle>
                        {sample.claimedVariety && (
                          <CardDescription className="italic">
                            {sample.claimedVariety}
                          </CardDescription>
                        )}
                      </div>
                      <Badge className={category.color}>
                        {category.icon}
                        <span className="ml-1">{category.label}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {axes.map((axis) => {
                        const config = climaticAxisConfig[axis];
                        if (!config) return null;
                        return (
                          <Badge key={axis} variant="secondary" className={config.color}>
                            {config.icon}
                            <span className="ml-1">{config.label}</span>
                          </Badge>
                        );
                      })}
                    </div>

                    {sample.topMolecule1 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Molécules: </span>
                        <span className="font-medium">
                          {[sample.topMolecule1, sample.topMolecule2, sample.topMolecule3]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}

                    {sample.absorbeInterpretation && (
                      <p className="text-sm text-muted-foreground italic border-l-2 border-emerald-500 pl-3">
                        {sample.absorbeInterpretation}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-4">
                        {sample.island && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {sample.island === "san_andres" ? "San Andrés" : 
                             sample.island === "providencia" ? "Providencia" : "Autre"}
                          </span>
                        )}
                        {sample.extraction && sample.extraction !== "aucune" && (
                          <span className="flex items-center gap-1">
                            <FlaskConical className="h-3 w-3" />
                            {sample.extraction.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      <Badge className={status.color} variant="outline">
                        {status.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              );
            })}
          </div>
        )}

        <Card className="mt-12 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Méthodologie Absorbe
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <blockquote className="border-l-4 border-emerald-500 pl-4 italic">
              Cette recherche aborde le tabac, le cannabis et les plantes aromatiques de San Andrés 
              non comme substances ou symboles, mais comme <strong>régulateurs climatiques et sociaux</strong>. 
              Le tabac structure le temps sans fumée, le cannabis module l'attention à très faible dose, 
              et les aromatiques assurent la diffusion sèche. L'ensemble refuse l'exotisme et privilégie 
              la <strong>disparition contrôlée</strong> comme méthode critique.
            </blockquote>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
