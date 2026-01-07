import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  MapPin,
  Beaker,
  Filter,
  ChevronRight,
  Globe,
  Calendar,
  FlaskConical,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Atom,
} from "lucide-react";
import { Link } from "wouter";

// Couleurs par classe de chémotype
const chemotypeColors: Record<string, string> = {
  alkaloid: "#ef4444",
  cannabinoid: "#22c55e",
  terpene: "#3b82f6",
  sesquiterpene: "#6366f1",
  monoterpene: "#8b5cf6",
  phenolic: "#f97316",
  flavonoid: "#eab308",
  other: "#6b7280",
};

// Icône de confiance
function ConfidenceIcon({ level }: { level: string }) {
  switch (level) {
    case "high":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "medium":
      return <HelpCircle className="h-4 w-4 text-yellow-500" />;
    case "low":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-400" />;
  }
}

// Composant de carte pour une période
function TimelinePeriodCard({
  entry,
  isSelected,
  onClick,
}: {
  entry: {
    timeContext: string;
    regionContext: string | null;
    moleculeClass: string | null;
    molecules: { id: number; moleculeId: string; name: string; formula: string | null }[];
    evidenceCount: number;
    confidence: "low" | "medium" | "high";
    methods: string[];
  };
  isSelected: boolean;
  onClick: () => void;
}) {
  const color = entry.moleculeClass ? chemotypeColors[entry.moleculeClass] || chemotypeColors.other : chemotypeColors.other;

  return (
    <Card
      className={`min-w-[280px] max-w-[320px] cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{entry.timeContext}</CardTitle>
          </div>
          <ConfidenceIcon level={entry.confidence} />
        </div>
        {entry.regionContext && (
          <CardDescription className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {entry.regionContext}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {entry.moleculeClass && (
          <Badge
            style={{ backgroundColor: color, color: "white" }}
            className="capitalize"
          >
            {entry.moleculeClass}
          </Badge>
        )}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {entry.molecules.length} molécule{entry.molecules.length > 1 ? "s" : ""} • {entry.evidenceCount} évidence{entry.evidenceCount > 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-1">
            {entry.molecules.slice(0, 3).map((mol) => (
              <Badge key={mol.id} variant="outline" className="text-xs">
                {mol.name}
              </Badge>
            ))}
            {entry.molecules.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{entry.molecules.length - 3}
              </Badge>
            )}
          </div>
        </div>
        {entry.methods.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FlaskConical className="h-3 w-3" />
            {entry.methods.slice(0, 2).join(", ")}
            {entry.methods.length > 2 && ` +${entry.methods.length - 2}`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Composant principal
export default function HeritageTimeline() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("timeline");

  // Requêtes tRPC
  const { data: timelineData, isLoading: isLoadingTimeline } = trpc.lostMolecules.timeline.getData.useQuery(
    selectedRegion !== "all" || selectedClass !== "all"
      ? {
          regionContext: selectedRegion !== "all" ? selectedRegion : undefined,
          moleculeClass: selectedClass !== "all" ? selectedClass : undefined,
        }
      : undefined
  );

  const { data: timeContexts } = trpc.lostMolecules.timeline.getTimeContexts.useQuery();
  const { data: regionContexts } = trpc.lostMolecules.timeline.getRegionContexts.useQuery();
  const { data: bibStats } = trpc.lostMolecules.bibliography.getStats.useQuery();

  // Classes uniques
  const uniqueClasses = useMemo(() => {
    if (!timelineData) return [];
    const classes = new Set<string>();
    timelineData.forEach((entry) => {
      if (entry.moleculeClass) classes.add(entry.moleculeClass);
    });
    return Array.from(classes);
  }, [timelineData]);

  // Entrée sélectionnée
  const selectedEntryData = useMemo(() => {
    if (selectedEntry === null || !timelineData) return null;
    return timelineData[selectedEntry];
  }, [selectedEntry, timelineData]);

  return (
    <div className="container py-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-8 w-8 text-primary" />
            Timeline Historique des Chémotypes
          </h1>
          <p className="text-muted-foreground mt-1">
            Évolution des chémotypes patrimoniaux par période et région géographique
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/lost-molecules-graph">
            <Button variant="outline" size="sm">
              <Atom className="h-4 w-4 mr-2" />
              Graphe des molécules
            </Button>
          </Link>
          <Link href="/bibliographie">
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Bibliographie
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      {bibStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Périodes historiques</CardDescription>
              <CardTitle className="text-2xl">{timeContexts?.length || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Régions géographiques</CardDescription>
              <CardTitle className="text-2xl">{regionContexts?.length || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Références bibliographiques</CardDescription>
              <CardTitle className="text-2xl">{bibStats.totalReferences}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Liées aux évidences</CardDescription>
              <CardTitle className="text-2xl">{bibStats.linkedToEvidence}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <label className="text-sm font-medium mb-1 block">Région géographique</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Toutes les régions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  {regionContexts?.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto">
              <label className="text-sm font-medium mb-1 block">Classe de chémotype</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {uniqueClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: chemotypeColors[cls] || chemotypeColors.other }}
                        />
                        <span className="capitalize">{cls}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="timeline">Timeline horizontale</TabsTrigger>
          <TabsTrigger value="list">Liste détaillée</TabsTrigger>
          <TabsTrigger value="regions">Par région</TabsTrigger>
        </TabsList>

        {/* Timeline horizontale */}
        <TabsContent value="timeline" className="mt-4">
          {isLoadingTimeline ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="min-w-[280px] h-[200px]" />
              ))}
            </div>
          ) : timelineData && timelineData.length > 0 ? (
            <div className="space-y-4">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {timelineData.map((entry, index) => (
                    <TimelinePeriodCard
                      key={`${entry.timeContext}-${entry.regionContext}-${index}`}
                      entry={entry}
                      isSelected={selectedEntry === index}
                      onClick={() => setSelectedEntry(selectedEntry === index ? null : index)}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Détails de l'entrée sélectionnée */}
              {selectedEntryData && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {selectedEntryData.timeContext}
                      {selectedEntryData.regionContext && (
                        <Badge variant="outline" className="ml-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {selectedEntryData.regionContext}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Molécules identifiées</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {selectedEntryData.molecules.map((mol) => (
                          <Link key={mol.id} href={`/molecules/${mol.id}`}>
                            <Card className="p-3 hover:bg-accent cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{mol.name}</p>
                                  {mol.formula && (
                                    <p className="text-xs text-muted-foreground">{mol.formula}</p>
                                  )}
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {selectedEntryData.methods.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Méthodes analytiques</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEntryData.methods.map((method, i) => (
                            <Badge key={i} variant="secondary">
                              <FlaskConical className="h-3 w-3 mr-1" />
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Aucune donnée de timeline disponible pour les filtres sélectionnés.
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Liste détaillée */}
        <TabsContent value="list" className="mt-4">
          {isLoadingTimeline ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : timelineData && timelineData.length > 0 ? (
            <div className="space-y-4">
              {timelineData.map((entry, index) => (
                <Card key={`${entry.timeContext}-${entry.regionContext}-${index}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{entry.timeContext}</span>
                          {entry.regionContext && (
                            <Badge variant="outline">
                              <MapPin className="h-3 w-3 mr-1" />
                              {entry.regionContext}
                            </Badge>
                          )}
                          {entry.moleculeClass && (
                            <Badge
                              style={{
                                backgroundColor: chemotypeColors[entry.moleculeClass] || chemotypeColors.other,
                                color: "white",
                              }}
                              className="capitalize"
                            >
                              {entry.moleculeClass}
                            </Badge>
                          )}
                          <ConfidenceIcon level={entry.confidence} />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {entry.molecules.map((mol) => (
                            <Badge key={mol.id} variant="secondary" className="text-xs">
                              {mol.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{entry.evidenceCount} évidence{entry.evidenceCount > 1 ? "s" : ""}</span>
                        <span>{entry.methods.length} méthode{entry.methods.length > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune donnée disponible.</p>
            </Card>
          )}
        </TabsContent>

        {/* Par région */}
        <TabsContent value="regions" className="mt-4">
          {regionContexts && regionContexts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionContexts.map((region) => {
                const regionData = timelineData?.filter((e) => e.regionContext === region) || [];
                const moleculeCount = new Set(regionData.flatMap((e) => e.molecules.map((m) => m.id))).size;
                return (
                  <Card
                    key={region}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedRegion(region);
                      setActiveTab("timeline");
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        {region}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>{regionData.length} période{regionData.length > 1 ? "s" : ""} historique{regionData.length > 1 ? "s" : ""}</p>
                        <p>{moleculeCount} molécule{moleculeCount > 1 ? "s" : ""} unique{moleculeCount > 1 ? "s" : ""}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune région disponible.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
