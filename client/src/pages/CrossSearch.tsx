// @ts-nocheck
/**
 * CrossSearch - Page de recherche croisée entre terroirs, plantes et molécules
 * 
 * Permet de rechercher et filtrer les données entre:
 * - Terroirs (pays, climat)
 * - Plantes (catégorie, famille)
 * - Molécules (famille, classe chimique)
 * 
 * Les filtres sont interconnectés: sélectionner un terroir filtre les plantes
 * qui y poussent, et les molécules qu'elles contiennent.
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Search,
  Filter,
  X,
  MapPin,
  Leaf,
  Atom,
  ChevronRight,
  Globe,
  Cloud,
  Layers,
  FlaskConical,
  RotateCcw,
  ArrowRight,
  Check,
  ChevronsUpDown,
  Sparkles,
  Network,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface FilterState {
  terroirCountries: string[];
  terroirClimates: string[];
  plantCategories: string[];
  plantFamilies: string[];
  moleculeFamilies: string[];
  chemicalClasses: string[];
  searchQuery: string;
}

const initialFilters: FilterState = {
  terroirCountries: [],
  terroirClimates: [],
  plantCategories: [],
  plantFamilies: [],
  moleculeFamilies: [],
  chemicalClasses: [],
  searchQuery: "",
};

// Composant MultiSelect amélioré
function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
  icon: Icon,
  label,
}: {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-10 py-2",
            selected.length > 0 && "border-primary/50"
          )}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selected.slice(0, 2).map(value => (
                  <Badge key={value} variant="secondary" className="text-xs">
                    {value}
                  </Badge>
                ))}
                {selected.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selected.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Rechercher ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>Aucun résultat</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => toggleOption(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Composant de carte de résultat
function ResultCard({
  type,
  item,
  stats,
}: {
  type: "terroir" | "plant" | "molecule";
  item: any;
  stats?: { label: string; value: number }[];
}) {
  const icons = {
    terroir: MapPin,
    plant: Leaf,
    molecule: Atom,
  };
  const colors = {
    terroir: "text-emerald-500 bg-emerald-500/10",
    plant: "text-green-500 bg-green-500/10",
    molecule: "text-purple-500 bg-purple-500/10",
  };
  const links = {
    terroir: `/terroirs/${item.id}`,
    plant: `/plants/${item.id}`,
    molecule: `/molecules/${item.id}`,
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <Link href={links[type]}>
        <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-lg shrink-0", colors[type])}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                {type === "terroir" && (
                  <p className="text-sm text-muted-foreground truncate">
                    {[item.region, item.country].filter(Boolean).join(", ") || "—"}
                  </p>
                )}
                {type === "plant" && (
                  <p className="text-sm text-muted-foreground truncate italic">
                    {item.latinName || item.category || "—"}
                  </p>
                )}
                {type === "molecule" && (
                  <p className="text-sm text-muted-foreground truncate">
                    {item.olfactiveProfile?.substring(0, 50) || item.chemicalClass || "—"}
                  </p>
                )}
                {stats && stats.length > 0 && (
                  <div className="flex gap-3 mt-2">
                    {stats.map((stat, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {stat.value} {stat.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// Composant de statistiques
function StatsBar({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-xl">
      <div className="text-center">
        <div className="text-2xl font-bold text-emerald-500">{stats.totalTerroirs}</div>
        <div className="text-xs text-muted-foreground">Terroirs</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-500">{stats.totalPlants}</div>
        <div className="text-xs text-muted-foreground">Plantes</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-500">{stats.totalMolecules}</div>
        <div className="text-xs text-muted-foreground">Molécules</div>
      </div>
      <div className="text-center hidden md:block">
        <div className="text-2xl font-bold text-amber-500">{stats.totalPlantTerroirLinks}</div>
        <div className="text-xs text-muted-foreground">Liens T↔P</div>
      </div>
      <div className="text-center hidden md:block">
        <div className="text-2xl font-bold text-rose-500">{stats.totalPlantMoleculeLinks}</div>
        <div className="text-xs text-muted-foreground">Liens P↔M</div>
      </div>
    </div>
  );
}

// Composant principal
export default function CrossSearch() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [activeTab, setActiveTab] = useState<"all" | "terroirs" | "plants" | "molecules">("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce la recherche textuelle
  const updateSearch = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      setFilters(prev => ({ ...prev, searchQuery: value }));
      clearTimeout(timeout);
      timeout = setTimeout(() => setDebouncedSearch(value), 300);
    };
  }, []);

  // Récupérer les options de filtres
  const { data: filterOptions, isLoading: loadingOptions } = trpc.advancedSearch.getCrossSearchFilterOptions.useQuery();

  // Effectuer la recherche croisée
  const { data: searchResults, isLoading: loadingResults } = trpc.advancedSearch.crossSearch.useQuery({
    terroirCountries: filters.terroirCountries.length > 0 ? filters.terroirCountries : undefined,
    terroirClimates: filters.terroirClimates.length > 0 ? filters.terroirClimates : undefined,
    plantCategories: filters.plantCategories.length > 0 ? filters.plantCategories : undefined,
    plantFamilies: filters.plantFamilies.length > 0 ? filters.plantFamilies : undefined,
    moleculeFamilies: filters.moleculeFamilies.length > 0 ? filters.moleculeFamilies : undefined,
    chemicalClasses: filters.chemicalClasses.length > 0 ? filters.chemicalClasses : undefined,
    searchQuery: debouncedSearch || undefined,
    includeRelations: true,
  });

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = useMemo(() => {
    return (
      filters.terroirCountries.length > 0 ||
      filters.terroirClimates.length > 0 ||
      filters.plantCategories.length > 0 ||
      filters.plantFamilies.length > 0 ||
      filters.moleculeFamilies.length > 0 ||
      filters.chemicalClasses.length > 0 ||
      filters.searchQuery.length > 0
    );
  }, [filters]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters(initialFilters);
    setDebouncedSearch("");
  };

  // Compter les filtres actifs
  const activeFilterCount = useMemo(() => {
    return (
      filters.terroirCountries.length +
      filters.terroirClimates.length +
      filters.plantCategories.length +
      filters.plantFamilies.length +
      filters.moleculeFamilies.length +
      filters.chemicalClasses.length +
      (filters.searchQuery ? 1 : 0)
    );
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container py-8 md:py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Network className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Recherche Croisée</h1>
              <p className="text-muted-foreground">
                Explorez les connexions entre terroirs, plantes et molécules
              </p>
            </div>
          </div>

          {/* Barre de recherche principale */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par nom, description, profil olfactif..."
              value={filters.searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              className="pl-12 pr-12 h-12 text-lg rounded-xl"
            />
            {filters.searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => updateSearch("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Panneau de filtres */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtres
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </CardTitle>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filtres Terroirs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <MapPin className="h-4 w-4" />
                    Terroirs
                  </div>
                  {loadingOptions ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <>
                      <MultiSelect
                        options={filterOptions?.terroirCountries || []}
                        selected={filters.terroirCountries}
                        onChange={(values) => setFilters(prev => ({ ...prev, terroirCountries: values }))}
                        placeholder="Pays"
                        icon={Globe}
                        label="pays"
                      />
                      <MultiSelect
                        options={filterOptions?.terroirClimates || []}
                        selected={filters.terroirClimates}
                        onChange={(values) => setFilters(prev => ({ ...prev, terroirClimates: values }))}
                        placeholder="Climat"
                        icon={Cloud}
                        label="climats"
                      />
                    </>
                  )}
                </div>

                <Separator />

                {/* Filtres Plantes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <Leaf className="h-4 w-4" />
                    Plantes
                  </div>
                  {loadingOptions ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <>
                      <MultiSelect
                        options={filterOptions?.plantCategories || []}
                        selected={filters.plantCategories}
                        onChange={(values) => setFilters(prev => ({ ...prev, plantCategories: values }))}
                        placeholder="Catégorie"
                        icon={Layers}
                        label="catégories"
                      />
                      <MultiSelect
                        options={filterOptions?.plantFamilies || []}
                        selected={filters.plantFamilies}
                        onChange={(values) => setFilters(prev => ({ ...prev, plantFamilies: values }))}
                        placeholder="Famille botanique"
                        icon={Leaf}
                        label="familles"
                      />
                    </>
                  )}
                </div>

                <Separator />

                {/* Filtres Molécules */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-600">
                    <Atom className="h-4 w-4" />
                    Molécules
                  </div>
                  {loadingOptions ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <>
                      <MultiSelect
                        options={filterOptions?.moleculeFamilies || []}
                        selected={filters.moleculeFamilies}
                        onChange={(values) => setFilters(prev => ({ ...prev, moleculeFamilies: values }))}
                        placeholder="Famille olfactive"
                        icon={Sparkles}
                        label="familles olfactives"
                      />
                      <MultiSelect
                        options={filterOptions?.chemicalClasses || []}
                        selected={filters.chemicalClasses}
                        onChange={(values) => setFilters(prev => ({ ...prev, chemicalClasses: values }))}
                        placeholder="Classe chimique"
                        icon={FlaskConical}
                        label="classes chimiques"
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Légende des relations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Relations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-amber-500" />
                  <span>Terroir → Plante : lieu de culture</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-rose-500" />
                  <span>Plante → Molécule : composition</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résultats */}
          <div className="space-y-4">
            {/* Statistiques */}
            {searchResults && <StatsBar stats={searchResults.stats} />}

            {/* Onglets de résultats */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all" className="gap-2">
                  Tous
                </TabsTrigger>
                <TabsTrigger value="terroirs" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Terroirs</span>
                  {searchResults && (
                    <Badge variant="secondary" className="ml-1">
                      {searchResults.terroirs.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="plants" className="gap-2">
                  <Leaf className="h-4 w-4" />
                  <span className="hidden sm:inline">Plantes</span>
                  {searchResults && (
                    <Badge variant="secondary" className="ml-1">
                      {searchResults.plants.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="molecules" className="gap-2">
                  <Atom className="h-4 w-4" />
                  <span className="hidden sm:inline">Molécules</span>
                  {searchResults && (
                    <Badge variant="secondary" className="ml-1">
                      {searchResults.molecules.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {loadingResults ? (
                <div className="grid gap-3 mt-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <TabsContent value="all" className="mt-4 space-y-6">
                    {/* Terroirs */}
                    {searchResults && searchResults.terroirs.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2 text-emerald-600">
                          <MapPin className="h-4 w-4" />
                          Terroirs ({searchResults.terroirs.length})
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <AnimatePresence mode="popLayout">
                            {searchResults.terroirs.slice(0, 4).map(terroir => (
                              <ResultCard
                                key={`terroir-${terroir.id}`}
                                type="terroir"
                                item={terroir}
                                stats={[
                                  { label: "plantes", value: terroir.plantCount },
                                  { label: "molécules", value: terroir.moleculeCount },
                                ]}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                        {searchResults.terroirs.length > 4 && (
                          <Button
                            variant="ghost"
                            className="w-full mt-2"
                            onClick={() => setActiveTab("terroirs")}
                          >
                            Voir tous les terroirs ({searchResults.terroirs.length})
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Plantes */}
                    {searchResults && searchResults.plants.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2 text-green-600">
                          <Leaf className="h-4 w-4" />
                          Plantes ({searchResults.plants.length})
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <AnimatePresence mode="popLayout">
                            {searchResults.plants.slice(0, 4).map(plant => (
                              <ResultCard
                                key={`plant-${plant.id}`}
                                type="plant"
                                item={plant}
                                stats={[
                                  { label: "terroirs", value: plant.terroirCount },
                                  { label: "molécules", value: plant.moleculeCount },
                                ]}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                        {searchResults.plants.length > 4 && (
                          <Button
                            variant="ghost"
                            className="w-full mt-2"
                            onClick={() => setActiveTab("plants")}
                          >
                            Voir toutes les plantes ({searchResults.plants.length})
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Molécules */}
                    {searchResults && searchResults.molecules.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2 text-purple-600">
                          <Atom className="h-4 w-4" />
                          Molécules ({searchResults.molecules.length})
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <AnimatePresence mode="popLayout">
                            {searchResults.molecules.slice(0, 4).map(molecule => (
                              <ResultCard
                                key={`molecule-${molecule.id}`}
                                type="molecule"
                                item={molecule}
                                stats={[
                                  { label: "plantes", value: molecule.plantCount },
                                ]}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                        {searchResults.molecules.length > 4 && (
                          <Button
                            variant="ghost"
                            className="w-full mt-2"
                            onClick={() => setActiveTab("molecules")}
                          >
                            Voir toutes les molécules ({searchResults.molecules.length})
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    )}

                    {/* État vide */}
                    {searchResults && 
                     searchResults.terroirs.length === 0 && 
                     searchResults.plants.length === 0 && 
                     searchResults.molecules.length === 0 && (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Aucun résultat</h3>
                        <p className="text-muted-foreground mb-4">
                          Essayez de modifier vos filtres ou votre recherche
                        </p>
                        {hasActiveFilters && (
                          <Button variant="outline" onClick={resetFilters}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Réinitialiser les filtres
                          </Button>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="terroirs" className="mt-4">
                    <ScrollArea className="h-[600px]">
                      <div className="grid gap-3 sm:grid-cols-2 pr-4">
                        <AnimatePresence mode="popLayout">
                          {searchResults?.terroirs.map(terroir => (
                            <ResultCard
                              key={`terroir-${terroir.id}`}
                              type="terroir"
                              item={terroir}
                              stats={[
                                { label: "plantes", value: terroir.plantCount },
                                { label: "molécules", value: terroir.moleculeCount },
                              ]}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="plants" className="mt-4">
                    <ScrollArea className="h-[600px]">
                      <div className="grid gap-3 sm:grid-cols-2 pr-4">
                        <AnimatePresence mode="popLayout">
                          {searchResults?.plants.map(plant => (
                            <ResultCard
                              key={`plant-${plant.id}`}
                              type="plant"
                              item={plant}
                              stats={[
                                { label: "terroirs", value: plant.terroirCount },
                                { label: "molécules", value: plant.moleculeCount },
                              ]}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="molecules" className="mt-4">
                    <ScrollArea className="h-[600px]">
                      <div className="grid gap-3 sm:grid-cols-2 pr-4">
                        <AnimatePresence mode="popLayout">
                          {searchResults?.molecules.map(molecule => (
                            <ResultCard
                              key={`molecule-${molecule.id}`}
                              type="molecule"
                              item={molecule}
                              stats={[
                                { label: "plantes", value: molecule.plantCount },
                              ]}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
