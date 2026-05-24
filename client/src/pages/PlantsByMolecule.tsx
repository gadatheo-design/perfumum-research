import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { safeJsonParse } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FlaskConical, Leaf, Search, X, ArrowLeft, Loader2, SlidersHorizontal, ChevronRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const categoryColors: Record<string, string> = {
  aromatique: "bg-green-500/10 text-green-700 border-green-500/30 dark:text-green-400",
  tabac: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400",
  cannabis: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  resine: "bg-orange-500/10 text-orange-700 border-orange-500/30 dark:text-orange-400",
  bois: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30 dark:text-yellow-400",
  fleur: "bg-pink-500/10 text-pink-700 border-pink-500/30 dark:text-pink-400",
  racine: "bg-stone-500/10 text-stone-700 border-stone-500/30 dark:text-stone-400",
  autre: "bg-slate-500/10 text-slate-700 border-slate-500/30 dark:text-slate-400",
};

export default function PlantsByMolecule() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialQuery = params.get("q") || "";

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [selectedMolecules, setSelectedMolecules] = useState<string[]>(
    initialQuery ? [initialQuery] : []
  );

  useEffect(() => {
    if (initialQuery && !selectedMolecules.includes(initialQuery)) {
      setSelectedMolecules([initialQuery]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: allPlants, isLoading: isLoadingPlants } = trpc.plants.list.useQuery();

  const allDominantMolecules = useMemo(() => {
    if (!allPlants) return [];
    const molSet = new Set<string>();
    allPlants?.forEach((plant: any) => {
      if (plant.dominantMolecules) {
        const mols = typeof plant.dominantMolecules === "string"
          ? safeJsonParse<string[]>(plant.dominantMolecules, [])
          : (plant.dominantMolecules as string[]);
        if (Array.isArray(mols)) mols.forEach((m: string) => { if (m?.trim()) molSet.add(m.trim()); });
      }
    });
    return Array.from(molSet).sort((a, b) => a.localeCompare(b));
  }, [allPlants]);

  const suggestions = useMemo(() => {
    if (!searchInput.trim() || searchInput.length < 2) return [];
    const lower = searchInput.toLowerCase();
    return allDominantMolecules.filter(m => m.toLowerCase().includes(lower) && !selectedMolecules.includes(m)).slice(0, 8);
  }, [searchInput, allDominantMolecules, selectedMolecules]);

  const filteredPlants = useMemo(() => {
    if (!allPlants || selectedMolecules.length === 0) return [];
    return allPlants?.filter((plant: any) => {
      if (!plant.dominantMolecules) return false;
      const mols = typeof plant.dominantMolecules === "string"
        ? safeJsonParse<string[]>(plant.dominantMolecules, [])
        : (plant.dominantMolecules as string[]);
      if (!Array.isArray(mols)) return false;
      const molsLower = mols.map((m: string) => m.toLowerCase());
      return selectedMolecules.every(sel => molsLower.some(m => m.includes(sel.toLowerCase())));
    });
  }, [allPlants, selectedMolecules]);

  const addMolecule = (mol: string) => {
    if (!selectedMolecules.includes(mol)) setSelectedMolecules(prev => [...prev, mol]);
    setSearchInput("");
  };

  const removeMolecule = (mol: string) => setSelectedMolecules(prev => prev.filter(m => m !== mol));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchInput.trim()) addMolecule(searchInput.trim());
  };

  const groupedResults = useMemo(() => {
    const groups: Record<string, typeof filteredPlants> = {};
    filteredPlants.forEach((plant: any) => {
      const cat = plant.category || "autre";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(plant);
    });
    return groups;
  }, [filteredPlants]);

  const categoryOrder = ["fleur", "aromatique", "resine", "bois", "racine", "tabac", "cannabis", "autre"];

  return (
    <div className="container py-8 max-w-6xl">
      <Breadcrumbs currentLabel="Plantes par molécule" />

      <div className="flex items-center gap-4 mb-6">
        <Link href="/plantes?tab=plantes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux plantes
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FlaskConical className="h-8 w-8 text-primary" />
          Plantes par molécule dominante
        </h1>
        <p className="text-muted-foreground">
          Filtrez les plantes selon une ou plusieurs molécules dominantes. Sélectionnez plusieurs molécules pour affiner la recherche (mode ET).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau de sélection */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtres moléculaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Rechercher une molécule…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9"
                />
              </div>

              {suggestions.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Suggestions</p>
                  {suggestions.map((mol) => (
                    <button
                      key={mol}
                      onClick={() => addMolecule(mol)}
                      className="w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <FlaskConical className="h-3 w-3 text-muted-foreground" />
                        {mol}
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}

              {selectedMolecules.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                      Sélectionnées ({selectedMolecules.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMolecules.map((mol) => (
                        <Badge key={mol} variant="default" className="gap-1 pr-1 cursor-pointer">
                          <FlaskConical className="h-3 w-3" />
                          {mol}
                          <button
                            onClick={() => removeMolecule(mol)}
                            className="ml-0.5 rounded-full hover:bg-primary-foreground/20 p-0.5 transition-colors"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setSelectedMolecules([])}>
                    <X className="h-3 w-3 mr-1.5" />
                    Effacer les filtres
                  </Button>
                </>
              )}

              {selectedMolecules.length === 0 && !searchInput && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Molécules fréquentes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["linalool","limonene","beta-caryophyllene","alpha-pinene","myrcene","geraniol","citronellol","eugenol","nicotine","thymol"].map((mol) => (
                        <Badge
                          key={mol}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors text-xs"
                          onClick={() => addMolecule(mol)}
                        >
                          {mol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {selectedMolecules.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {isLoadingPlants ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : filteredPlants.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    plante{filteredPlants.length !== 1 ? "s" : ""} trouvée{filteredPlants.length !== 1 ? "s" : ""}
                  </p>
                  {selectedMolecules.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">contenant toutes les molécules sélectionnées</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Résultats */}
        <div className="lg:col-span-2">
          {isLoadingPlants ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : selectedMolecules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FlaskConical className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium mb-2">Sélectionnez une molécule</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Utilisez le panneau de gauche pour rechercher et sélectionner une ou plusieurs molécules dominantes.
              </p>
            </div>
          ) : filteredPlants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Leaf className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun résultat</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Aucune plante ne contient simultanément toutes les molécules sélectionnées. Essayez de réduire le nombre de filtres.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {categoryOrder.filter(cat => groupedResults[cat]?.length > 0).map((cat) => (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className={`capitalize ${categoryColors[cat] || ""}`}>{cat}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {groupedResults[cat].length} plante{groupedResults[cat].length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {groupedResults[cat].map((plant: any) => {
                      const mols = typeof plant.dominantMolecules === "string"
                        ? safeJsonParse<string[]>(plant.dominantMolecules, [])
                        : (plant.dominantMolecules as string[] || []);
                      return (
                        <Link key={plant.id} href={`/plantes/${plant.id}`}>
                          <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group h-full">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                {plant.imageUrl ? (
                                  <img src={plant.imageUrl} alt={plant.name} className="w-12 h-12 rounded-lg object-cover shrink-0 border" />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                    <Leaf className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">{plant.name}</h3>
                                  {plant.latinName && <p className="text-xs text-muted-foreground italic truncate">{plant.latinName}</p>}
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {mols.slice(0, 5).map((mol: string, idx: number) => {
                                      const isMatch = selectedMolecules.some(sel => mol.toLowerCase().includes(sel.toLowerCase()));
                                      return (
                                        <Badge key={idx} variant={isMatch ? "default" : "outline"} className={`text-xs ${isMatch ? "bg-primary/90" : ""}`}>
                                          {mol}
                                        </Badge>
                                      );
                                    })}
                                    {mols.length > 5 && <Badge variant="outline" className="text-xs text-muted-foreground">+{mols.length - 5}</Badge>}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
