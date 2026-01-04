import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, AlertTriangle, CheckCircle, XCircle, Info, Calculator } from "lucide-react";

export default function Ifra() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [concentration, setConcentration] = useState<string>("");
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<number | null>(null);

  // Queries
  const { data: restrictions, isLoading: loadingRestrictions } = trpc.ifraRestrictions.list.useQuery();
  const { data: categories } = trpc.ifraCategories.list.useQuery();
  const { data: stats } = trpc.ifraCategories.getStats.useQuery();
  const { data: searchResults } = trpc.ifraCategories.searchByName.useQuery(searchTerm, {
    enabled: searchTerm.length >= 2,
  });

  // Calcul de conformité
  const { data: complianceResult } = trpc.ifraCategories.checkCompliance.useQuery(
    {
      moleculeId: selectedMoleculeId!,
      categoryCode: selectedCategory,
      concentration: parseFloat(concentration) || 0,
    },
    {
      enabled: !!selectedMoleculeId && !!selectedCategory && !!concentration,
    }
  );

  // Filtrer les restrictions
  const filteredRestrictions = useMemo(() => {
    if (!restrictions) return [];
    
    let filtered = restrictions;
    
    if (searchTerm && searchTerm.length >= 2) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.molecule.name.toLowerCase().includes(term) ||
        r.molecule.casNumber?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [restrictions, searchTerm]);

  // Obtenir la limite pour une catégorie
  const getCategoryLimit = (restriction: any, categoryCode: string) => {
    const categoryMap: Record<string, string> = {
      '1': 'category1',
      '2': 'category2',
      '3': 'category3',
      '4': 'category4',
      '5A': 'category5a',
      '5B': 'category5b',
      '5C': 'category5c',
      '5D': 'category5d',
      '6': 'category6',
      '7A': 'category7a',
      '7B': 'category7b',
      '8': 'category8',
      '9': 'category9',
      '10A': 'category10a',
      '10B': 'category10b',
      '11A': 'category11a',
      '11B': 'category11b',
    };
    
    const column = categoryMap[categoryCode.toUpperCase()];
    return column ? restriction.restriction[column] : null;
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Réglementation IFRA</h1>
        <p className="text-muted-foreground">
          Consultez les restrictions de l'International Fragrance Association et calculez les limites autorisées par type de produit.
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total molécules</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats.prohibited}</div>
              <p className="text-xs text-muted-foreground">Interdites</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-600">{stats.restricted}</div>
              <p className="text-xs text-muted-foreground">Restreintes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.specification}</div>
              <p className="text-xs text-muted-foreground">Spécifications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.noRestriction}</div>
              <p className="text-xs text-muted-foreground">Sans restriction</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList>
          <TabsTrigger value="search">Recherche</TabsTrigger>
          <TabsTrigger value="calculator">Calculateur</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        {/* Onglet Recherche */}
        <TabsContent value="search" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une molécule (nom ou CAS)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loadingRestrictions ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : filteredRestrictions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Aucune molécule trouvée" : "Aucune restriction IFRA enregistrée"}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRestrictions.map((item) => (
                <Card key={item.restriction.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.molecule.name}</CardTitle>
                        <CardDescription>
                          CAS: {item.molecule.casNumber || "N/A"} • {item.restriction.ifraAmendment || "IFRA"}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          item.restriction.restrictionType === "prohibited"
                            ? "destructive"
                            : item.restriction.restrictionType === "restricted"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {item.restriction.restrictionType === "prohibited" && "Interdit"}
                        {item.restriction.restrictionType === "restricted" && "Restreint"}
                        {item.restriction.restrictionType === "specification" && "Spécification"}
                        {item.restriction.restrictionType === "no_restriction" && "Sans restriction"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {item.restriction.reasonForRestriction && (
                      <Alert className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Raison de la restriction</AlertTitle>
                        <AlertDescription>{item.restriction.reasonForRestriction}</AlertDescription>
                      </Alert>
                    )}

                    {item.restriction.restrictionType === "restricted" && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Limites par catégorie (%)</h4>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
                          {[
                            { code: "1", label: "Lèvres" },
                            { code: "2", label: "Déo" },
                            { code: "4", label: "Parfum" },
                            { code: "5A", label: "Corps" },
                            { code: "7A", label: "Cheveux" },
                            { code: "10B", label: "Bougies" },
                          ].map(({ code, label }) => {
                            const limit = getCategoryLimit(item, code);
                            return (
                              <div key={code} className="bg-muted rounded p-2 text-center">
                                <div className="font-mono font-bold">
                                  {limit !== null ? `${limit}%` : "—"}
                                </div>
                                <div className="text-xs text-muted-foreground">{label}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {item.restriction.alternativeSuggestions && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-1">Alternatives suggérées</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.restriction.alternativeSuggestions}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Onglet Calculateur */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculateur de conformité IFRA
              </CardTitle>
              <CardDescription>
                Vérifiez si votre concentration est conforme aux limites IFRA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Molécule</label>
                  <Select
                    value={selectedMoleculeId?.toString() || ""}
                    onValueChange={(v) => setSelectedMoleculeId(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une molécule" />
                    </SelectTrigger>
                    <SelectContent>
                      {restrictions?.map((r) => (
                        <SelectItem key={r.molecule.id} value={r.molecule.id.toString()}>
                          {r.molecule.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Catégorie de produit</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.code} value={cat.code}>
                          Cat {cat.code}: {cat.nameFr || cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Concentration (%)</label>
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    max="100"
                    placeholder="Ex: 0.5"
                    value={concentration}
                    onChange={(e) => setConcentration(e.target.value)}
                  />
                </div>
              </div>

              {complianceResult && (
                <Alert
                  variant={complianceResult.compliant ? "default" : "destructive"}
                  className="mt-4"
                >
                  {complianceResult.compliant ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {complianceResult.compliant ? "Conforme" : "Non conforme"}
                  </AlertTitle>
                  <AlertDescription>
                    <p>{complianceResult.message}</p>
                    {complianceResult.limit !== null && (
                      <p className="mt-2">
                        Limite IFRA: <strong>{complianceResult.limit}%</strong>
                        {complianceResult.margin !== undefined && (
                          <span className="ml-2 text-muted-foreground">
                            (marge: {complianceResult.margin.toFixed(3)}%)
                          </span>
                        )}
                      </p>
                    )}
                    {complianceResult.reason && (
                      <p className="mt-2 text-sm">{complianceResult.reason}</p>
                    )}
                    {complianceResult.alternatives && !complianceResult.compliant && (
                      <p className="mt-2 text-sm">
                        <strong>Alternatives:</strong> {complianceResult.alternatives}
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Catégories */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((cat) => (
              <Card key={cat.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Catégorie {cat.code}</CardTitle>
                    <Badge
                      variant={
                        cat.exposureLevel === "very_high"
                          ? "destructive"
                          : cat.exposureLevel === "high"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {cat.exposureLevel === "very_high" && "Exposition très élevée"}
                      {cat.exposureLevel === "high" && "Exposition élevée"}
                      {cat.exposureLevel === "medium" && "Exposition moyenne"}
                      {cat.exposureLevel === "low" && "Exposition faible"}
                      {cat.exposureLevel === "very_low" && "Exposition très faible"}
                    </Badge>
                  </div>
                  <CardDescription>{cat.nameFr || cat.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {cat.descriptionFr || cat.description}
                  </p>
                  {cat.examplesFr && (
                    <div className="text-xs bg-muted rounded p-2">
                      <strong>Exemples:</strong> {cat.examplesFr}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
