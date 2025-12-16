import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Zap, Filter, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SYNERGY_TYPES = [
  { value: "all", label: "Tous les types", color: "bg-slate-100 text-slate-800" },
  { value: "potentialisation", label: "Potentialisation", color: "bg-green-100 text-green-800" },
  { value: "stabilisation", label: "Stabilisation", color: "bg-blue-100 text-blue-800" },
  { value: "transformation", label: "Transformation", color: "bg-purple-100 text-purple-800" },
  { value: "masquage", label: "Masquage", color: "bg-orange-100 text-orange-800" },
];

export function SynergiesMoleculaires() {
  const [filterType, setFilterType] = useState<string>("all");
  
  const { data: synergies, isLoading } = trpc.synergies.list.useQuery();
  const { data: stats } = trpc.synergies.getStats.useQuery();

  const filteredSynergies = synergies?.filter(
    (s) => filterType === "all" || s.type === filterType
  );

  const getTypeColor = (type: string) => {
    return SYNERGY_TYPES.find((t) => t.value === type)?.color || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8 space-y-8">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-violet-100 border-2 border-violet-200">
              <Zap className="h-8 w-8 text-violet-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight">
                  SYNERGIES MOLÉCULAIRES
                </h1>
                <Badge className="bg-violet-600 text-white">NEW</Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Interactions et effets synergiques entre terpènes
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
                <CardDescription>Total synergies</CardDescription>
              </CardHeader>
            </Card>
            {stats.byType.map((stat) => (
              <Card key={stat.type}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold">{stat.count}</CardTitle>
                  <CardDescription className="capitalize">{stat.type}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Filtres</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterType("all")}
              >
                Réinitialiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Type de synergie :</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {SYNERGY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filterType !== "all" && (
                <span className="text-sm text-muted-foreground">
                  {filteredSynergies?.length} résultat(s)
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Synergies List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
              <p className="text-muted-foreground">Chargement des synergies...</p>
            </div>
          </div>
        ) : filteredSynergies && filteredSynergies.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredSynergies.map((synergie) => (
              <Card key={synergie.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{synergie.name}</CardTitle>
                        <Badge className={getTypeColor(synergie.type)}>
                          {synergie.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {synergie.tabacName && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Tabac:</span>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                              {synergie.tabacName}
                            </span>
                          </span>
                        )}
                        {synergie.moleculeName && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Molécule:</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                              {synergie.moleculeName}
                            </span>
                          </span>
                        )}
                        {synergie.familleName && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Famille:</span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                              {synergie.familleName}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <TrendingUp className="h-5 w-5 text-violet-600 flex-shrink-0" />
                  </div>
                </CardHeader>
                {(synergie.effet || synergie.notes) && (
                  <CardContent className="space-y-3">
                    {synergie.effet && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Effet :</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {synergie.effet}
                        </p>
                      </div>
                    )}
                    {synergie.notes && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Notes techniques :</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {synergie.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="font-medium">Aucune synergie trouvée</p>
                  <p className="text-sm text-muted-foreground">
                    {filterType !== "all"
                      ? "Essayez de modifier les filtres"
                      : "Les données de synergies seront ajoutées prochainement"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card className="bg-violet-50 border-2 border-violet-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Zap className="h-6 w-6 text-violet-600 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-bold text-violet-900">À propos des Synergies Moléculaires</h3>
                <p className="text-sm text-violet-800 leading-relaxed">
                  Les synergies moléculaires décrivent les interactions complexes entre tabacs, molécules et familles olfactives. 
                  Quatre types principaux sont identifiés : <strong>potentialisation</strong> (amplification mutuelle), 
                  <strong>stabilisation</strong> (prolongation de la durée), <strong>transformation</strong> (création de nouvelles notes), 
                  et <strong>masquage</strong> (atténuation de certaines caractéristiques).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
