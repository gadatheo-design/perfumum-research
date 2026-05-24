// @ts-nocheck
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, Beaker, Leaf, FlaskConical, Filter, X, Plus,
  Loader2, ChevronRight, Target, Sparkles, Wind, TreeDeciduous
} from "lucide-react";

// Molécules communes pour la recherche
const COMMON_MOLECULES = [
  { name: "Limonène", family: "Monoterpène", axis: "vent" },
  { name: "Linalol", family: "Alcool terpénique", axis: "vent" },
  { name: "Myrcène", family: "Monoterpène", axis: "bois" },
  { name: "β-Caryophyllène", family: "Sesquiterpène", axis: "bois" },
  { name: "Pinène", family: "Monoterpène", axis: "vent" },
  { name: "Eucalyptol", family: "Oxyde terpénique", axis: "vent" },
  { name: "Géraniol", family: "Alcool terpénique", axis: "vent" },
  { name: "Cédrol", family: "Sesquiterpène", axis: "bois" },
  { name: "Vétivérol", family: "Sesquiterpène", axis: "bois" },
  { name: "Humulène", family: "Sesquiterpène", axis: "bois" },
  { name: "Terpinéol", family: "Alcool terpénique", axis: "vent" },
  { name: "Camphre", family: "Cétone terpénique", axis: "vent" },
];

const CLIMATIC_AXES = [
  { value: "vent", label: "Vent", icon: Wind, color: "text-blue-500" },
  { value: "bois", label: "Bois", icon: TreeDeciduous, color: "text-amber-700" },
  { value: "disparition", label: "Disparition", icon: Sparkles, color: "text-purple-500" },
];

const USAGES = [
  { value: "parfum", label: "Parfum" },
  { value: "encens", label: "Encens" },
  { value: "espace", label: "Espace" },
];

export default function RechercheProfilMoleculaire() {
  // États des filtres
  const [selectedMolecules, setSelectedMolecules] = useState<string[]>([]);
  const [moleculeSearch, setMoleculeSearch] = useState("");
  const [selectedAxes, setSelectedAxes] = useState<string[]>([]);
  const [selectedUsages, setSelectedUsages] = useState<string[]>([]);
  const [minPercentage, setMinPercentage] = useState(0);
  const [searchMode, setSearchMode] = useState<"any" | "all">("any");

  // Données
  const { data: plants, isLoading: plantsLoading } = trpc.plants?.list.useQuery();
  const { data: molecules, isLoading: moleculesLoading } = trpc.molecules?.getAll.useQuery();

  // Filtrer les molécules pour l'autocomplétion
  const filteredMolecules = useMemo(() => {
    if (!moleculeSearch) return COMMON_MOLECULES;
    const search = moleculeSearch.toLowerCase();
    return COMMON_MOLECULES.filter(m => 
      m.name.toLowerCase().includes(search)
    );
  }, [moleculeSearch]);

  // Ajouter une molécule
  const addMolecule = (name: string) => {
    if (!selectedMolecules.includes(name)) {
      setSelectedMolecules([...selectedMolecules, name]);
    }
    setMoleculeSearch("");
  };

  // Retirer une molécule
  const removeMolecule = (name: string) => {
    setSelectedMolecules(selectedMolecules.filter(m => m !== name));
  };

  // Toggle axe climatique
  const toggleAxis = (axis: string) => {
    if (selectedAxes.includes(axis)) {
      setSelectedAxes(selectedAxes.filter(a => a !== axis));
    } else {
      setSelectedAxes([...selectedAxes, axis]);
    }
  };

  // Toggle usage
  const toggleUsage = (usage: string) => {
    if (selectedUsages.includes(usage)) {
      setSelectedUsages(selectedUsages.filter(u => u !== usage));
    } else {
      setSelectedUsages([...selectedUsages, usage]);
    }
  };

  // Filtrer les plantes selon les critères
  const filteredPlants = useMemo(() => {
    if (!plants) return [];
    
    return plants?.filter((plant: any) => {
      // Filtre par molécules
      if (selectedMolecules.length > 0) {
        const plantMolecules = (plant.dominantMolecules || "").toLowerCase();
        if (searchMode === "all") {
          // Toutes les molécules doivent être présentes
          const allPresent = selectedMolecules.every(mol => 
            plantMolecules.includes(mol.toLowerCase())
          );
          if (!allPresent) return false;
        } else {
          // Au moins une molécule doit être présente
          const anyPresent = selectedMolecules.some(mol => 
            plantMolecules.includes(mol.toLowerCase())
          );
          if (!anyPresent) return false;
        }
      }

      // Filtre par axe climatique
      if (selectedAxes.length > 0) {
        const plantAxis = plant.climaticAxis || "";
        const hasAxis = selectedAxes.some(axis => plantAxis.includes(axis));
        if (!hasAxis) return false;
      }

      return true;
    });
  }, [plants, selectedMolecules, selectedAxes, searchMode]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSelectedMolecules([]);
    setSelectedAxes([]);
    setSelectedUsages([]);
    setMinPercentage(0);
    setMoleculeSearch("");
  };

  const isLoading = plantsLoading || moleculesLoading;
  const hasFilters = selectedMolecules.length > 0 || selectedAxes.length > 0 || selectedUsages.length > 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-7xl">
        <Breadcrumbs customItems={[
          { label: "Recherche", path: "/recherche" },
          { label: "Profil Moléculaire" }
        ]} />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Recherche par Profil Moléculaire</h1>
          </div>
          <p className="text-muted-foreground">
            Trouvez des plantes et matières premières selon leur composition moléculaire.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Panneau de filtres */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recherche de molécules */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Molécules cibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une molécule..."
                    value={moleculeSearch}
                    onChange={(e) => setMoleculeSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Suggestions */}
                {moleculeSearch && filteredMolecules.length > 0 && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {filteredMolecules.map((mol) => (
                      <button
                        key={mol.name}
                        onClick={() => addMolecule(mol.name)}
                        className="w-full px-3 py-2 text-left hover:bg-muted flex items-center justify-between text-sm"
                      >
                        <span>{mol.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {mol.family}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {/* Molécules sélectionnées */}
                {selectedMolecules.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedMolecules.map((mol) => (
                      <Badge key={mol} variant="secondary" className="flex items-center gap-1">
                        {mol}
                        <button onClick={() => removeMolecule(mol)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Mode de recherche */}
                {selectedMolecules.length > 1 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Mode de recherche</Label>
                    <Select value={searchMode} onValueChange={(v: "any" | "all") => setSearchMode(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Au moins une molécule</SelectItem>
                        <SelectItem value="all">Toutes les molécules</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Molécules suggérées */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Suggestions</Label>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_MOLECULES.slice(0, 6).map((mol) => (
                      <Button
                        key={mol.name}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => addMolecule(mol.name)}
                        disabled={selectedMolecules.includes(mol.name)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {mol.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Axes climatiques */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Axes Climatiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {CLIMATIC_AXES.map((axis) => {
                  const Icon = axis.icon;
                  return (
                    <div key={axis.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={axis.value}
                        checked={selectedAxes.includes(axis.value)}
                        onCheckedChange={() => toggleAxis(axis.value)}
                      />
                      <label
                        htmlFor={axis.value}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <Icon className={`h-4 w-4 ${axis.color}`} />
                        {axis.label}
                      </label>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Usages */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Usage ABSORBE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {USAGES.map((usage) => (
                  <div key={usage.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={usage.value}
                      checked={selectedUsages.includes(usage.value)}
                      onCheckedChange={() => toggleUsage(usage.value)}
                    />
                    <label
                      htmlFor={usage.value}
                      className="text-sm cursor-pointer"
                    >
                      {usage.label}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            {hasFilters && (
              <Button variant="outline" onClick={resetFilters} className="w-full">
                <X className="h-4 w-4 mr-2" />
                Réinitialiser les filtres
              </Button>
            )}
          </div>

          {/* Résultats */}
          <div className="lg:col-span-3">
            {/* Barre de résumé */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {isLoading ? (
                    "Chargement..."
                  ) : (
                    `${filteredPlants.length} résultat${filteredPlants.length > 1 ? "s" : ""}`
                  )}
                </span>
              </div>
            </div>

            {/* Liste des résultats */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredPlants.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredPlants.map((plant: any) => (
                  <Card key={plant.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{plant.name}</CardTitle>
                          {plant.latinName && (
                            <CardDescription className="italic">
                              {plant.latinName}
                            </CardDescription>
                          )}
                        </div>
                        {plant.climaticAxis && (
                          <Badge variant="outline">
                            {plant.climaticAxis}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {plant.family && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Famille: </span>
                          {plant.family}
                        </div>
                      )}
                      
                      {plant.dominantMolecules && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Molécules: </span>
                          <span className="font-medium">{plant.dominantMolecules}</span>
                        </div>
                      )}

                      {plant.olfactiveSignature && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plant.olfactiveSignature}
                        </p>
                      )}

                      <Link href={`/plants/${plant.id}`}>
                        <Button variant="ghost" size="sm" className="w-full mt-2">
                          Voir la fiche complète
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <FlaskConical className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Aucun résultat</h3>
                  <p className="text-muted-foreground">
                    {hasFilters 
                      ? "Essayez de modifier vos critères de recherche."
                      : "Sélectionnez des molécules ou des axes climatiques pour commencer."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
