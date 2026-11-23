import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Network, Search, Filter, Zap, Shield, Shuffle, Eye, RefreshCw } from "lucide-react";

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  potentialisation: { label: "Potentialisation", color: "bg-green-500/20 text-green-700 border-green-500/30" },
  stabilisation: { label: "Stabilisation", color: "bg-blue-500/20 text-blue-700 border-blue-500/30" },
  transformation: { label: "Transformation", color: "bg-purple-500/20 text-purple-700 border-purple-500/30" },
  masquage: { label: "Masquage", color: "bg-orange-500/20 text-orange-700 border-orange-500/30" },
  neutralisation: { label: "Neutralisation", color: "bg-red-500/20 text-red-700 border-red-500/30" },
  amplification: { label: "Amplification", color: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" },
};

function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_LABELS[type] || { label: type, color: "bg-gray-500/20 text-gray-700 border-gray-500/30" };
  return (
    <Badge variant="outline" className={`text-xs ${cfg.color}`}>
      {cfg.label}
    </Badge>
  );
}

export default function AdminSynergies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Synergies moléculaires (molecule_synergies)
  const { data: moleculeSynergies, isLoading: loadingMol, refetch: refetchMol } =
    trpc.synergies.getAllMoleculeSynergies.useQuery();

  // Synergies tabac (synergies table)
  const { data: tabacSynergies, isLoading: loadingTabac, refetch: refetchTabac } =
    trpc.synergies.list.useQuery();

  // Filtrage synergies moléculaires
  const filteredMolSynergies = (moleculeSynergies || []).filter((s: any) => {
    const matchSearch =
      !searchQuery ||
      s.molecule1Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.molecule2Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "all" || s.type === typeFilter;
    return matchSearch && matchType;
  });

  // Filtrage synergies tabac
  const filteredTabacSynergies = (tabacSynergies || []).filter((s: any) => {
    const matchSearch =
      !searchQuery ||
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.moleculeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tabacName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.effet?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "all" || s.type === typeFilter;
    return matchSearch && matchType;
  });

  // Statistiques
  const totalSynergies = (moleculeSynergies?.length || 0) + (tabacSynergies?.length || 0);
  const typeStats: Record<string, number> = {};
  [...(moleculeSynergies || []), ...(tabacSynergies || [])].forEach((s: any) => {
    if (s.type) typeStats[s.type] = (typeStats[s.type] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Admin
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Gestion des Synergies</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { refetchMol(); refetchTabac(); }}
              className="gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Link href="/matrice-synergies">
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="h-4 w-4" />
                Voir la matrice
              </Button>
            </Link>
            <Link href="/synergies">
              <Button variant="outline" size="sm" className="gap-1">
                <Network className="h-4 w-4" />
                Voir le graphe
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-primary">{totalSynergies}</div>
              <div className="text-sm text-muted-foreground">Total synergies</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{moleculeSynergies?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Synergies moléculaires</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-amber-600">{tabacSynergies?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Synergies tabac</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(typeStats).length}</div>
              <div className="text-sm text-muted-foreground">Types documentés</div>
            </CardContent>
          </Card>
        </div>

        {/* Distribution par type */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Distribution par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeStats).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type} className="flex items-center gap-1">
                  <TypeBadge type={type} />
                  <span className="text-xs text-muted-foreground">({count})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par molécule, tabac, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-52">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {Object.entries(TYPE_LABELS).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="molecules">
          <div className="overflow-x-auto pb-1">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="molecules" className="gap-1 text-xs sm:text-sm">
                <Zap className="h-4 w-4" />
                <span className="hidden xs:inline">Synergies </span>Moléculaires
                <Badge variant="secondary" className="ml-1 text-xs">{filteredMolSynergies.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="tabac" className="gap-1 text-xs sm:text-sm">
                <Shuffle className="h-4 w-4" />
                <span className="hidden xs:inline">Synergies </span>Tabac
                <Badge variant="secondary" className="ml-1 text-xs">{filteredTabacSynergies.length}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Synergies moléculaires */}
          <TabsContent value="molecules" className="mt-4">
            {loadingMol ? (
              <div className="text-center py-8 text-muted-foreground">Chargement...</div>
            ) : filteredMolSynergies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Network className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Aucune synergie moléculaire trouvée</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMolSynergies.map((s: any) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <TypeBadge type={s.type} />
                          <span className="font-medium text-sm">
                            <Link href={`/molecule/${s.molecule1Id}`} className="text-primary hover:underline">
                              {s.molecule1Name || `Molécule #${s.molecule1Id}`}
                            </Link>
                            <span className="text-muted-foreground mx-2">↔</span>
                            <Link href={`/molecule/${s.molecule2Id}`} className="text-primary hover:underline">
                              {s.molecule2Name || `Molécule #${s.molecule2Id}`}
                            </Link>
                          </span>
                        </div>
                        {s.molecule1Family && (
                          <div className="text-xs text-muted-foreground mb-1">
                            {s.molecule1Family} × {s.molecule2Family || "—"}
                          </div>
                        )}
                        {s.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                        )}
                        {s.applications && (
                          <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">
                            Applications : {s.applications}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        #{s.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Synergies tabac */}
          <TabsContent value="tabac" className="mt-4">
            {loadingTabac ? (
              <div className="text-center py-8 text-muted-foreground">Chargement...</div>
            ) : filteredTabacSynergies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shuffle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Aucune synergie tabac trouvée</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTabacSynergies.map((s: any) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <TypeBadge type={s.type} />
                          <span className="font-medium text-sm">{s.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-1">
                          {s.tabacName && (
                            <span className="bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded">
                              Tabac : {s.tabacName}
                            </span>
                          )}
                          {s.moleculeName && (
                            <span className="bg-purple-500/10 text-purple-700 px-2 py-0.5 rounded">
                              Molécule : {s.moleculeName}
                            </span>
                          )}
                          {s.familleName && (
                            <span className="bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded">
                              Famille : {s.familleName}
                            </span>
                          )}
                        </div>
                        {s.effet && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{s.effet}</p>
                        )}
                        {s.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">{s.notes}</p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        #{s.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Liens vers les outils de visualisation */}
        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Outils de visualisation et d'exploration des synergies :
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/matrice-synergies">
                <Button variant="outline" size="sm" className="gap-1">
                  <Shield className="h-4 w-4" />
                  Matrice de compatibilité
                </Button>
              </Link>
              <Link href="/synergies">
                <Button variant="outline" size="sm" className="gap-1">
                  <Network className="h-4 w-4" />
                  Graphe des synergies
                </Button>
              </Link>
              <Link href="/suggestions-synergies">
                <Button variant="outline" size="sm" className="gap-1">
                  <Zap className="h-4 w-4" />
                  Suggestions IA
                </Button>
              </Link>
              <Link href="/synergies-heatmap">
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Heatmap
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
