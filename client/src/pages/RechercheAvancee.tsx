import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";

export default function RechercheAvancee() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  
  // Fetch data
  const { data: molecules = [], isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: civilisations = [], isLoading: loadingCivilisations } = trpc.civilisations.list.useQuery();

  // Extract unique values for filters
  const uniqueFamilies = useMemo(() => {
    const families = new Set<string>();
    molecules.forEach(m => {
      if (m.family) {
        m.family.split(',').forEach(f => families.add(f.trim()));
      }
    });
    return Array.from(families).sort();
  }, [molecules]);

  const uniqueOrigins = useMemo(() => {
    const origins = new Set<string>();
    molecules.forEach(m => {
      if (m.sourceOrigin) {
        m.sourceOrigin.split(',').forEach(o => origins.add(o.trim()));
      }
    });
    civilisations.forEach(c => {
      if (c.region) origins.add(c.region);
    });
    return Array.from(origins).sort();
  }, [molecules, civilisations]);

  const historicalPeriods = [
    "Antiquité (-3000 à 476)",
    "Moyen Âge (476-1492)",
    "Renaissance (1492-1789)",
    "Époque moderne (1789-1914)",
    "Époque contemporaine (1914-présent)"
  ];

  // Filter molecules based on search and filters
  const filteredMolecules = useMemo(() => {
    return molecules.filter(molecule => {
      // Text search
      const matchesSearch = !searchQuery || 
        molecule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.olfactiveProfile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.sourceOrigin?.toLowerCase().includes(searchQuery.toLowerCase());

      // Family filter
      const matchesFamily = selectedFamilies.length === 0 || 
        selectedFamilies.some(f => molecule.family?.includes(f));

      // Origin filter
      const matchesOrigin = selectedOrigins.length === 0 || 
        selectedOrigins.some(o => molecule.sourceOrigin?.includes(o));

      // For period filter, we would need historical data in molecules
      // For now, we'll just check if any filter is active
      const matchesPeriod = selectedPeriods.length === 0;

      return matchesSearch && matchesFamily && matchesOrigin && matchesPeriod;
    });
  }, [molecules, searchQuery, selectedFamilies, selectedOrigins, selectedPeriods]);

  // Filter civilisations
  const filteredCivilisations = useMemo(() => {
    return civilisations.filter(civ => {
      const matchesSearch = !searchQuery || 
        civ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        civ.region?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOrigin = selectedOrigins.length === 0 || 
        selectedOrigins.some(o => civ.region?.includes(o));

      const matchesPeriod = selectedPeriods.length === 0 || 
        selectedPeriods.some(p => {
          const periodYear = parseInt(p.match(/\d+/)?.[0] || "0");
          return civ.temporality?.includes(periodYear.toString());
        });

      return matchesSearch && matchesOrigin && matchesPeriod;
    });
  }, [civilisations, searchQuery, selectedOrigins, selectedPeriods]);

  const toggleFilter = (value: string, selected: string[], setter: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedFamilies([]);
    setSelectedOrigins([]);
    setSelectedPeriods([]);
    setSearchQuery("");
  };

  const activeFiltersCount = selectedFamilies.length + selectedOrigins.length + selectedPeriods.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Recherche Avancée
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Explorez la base de données PERFUMUM avec des filtres précis
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Rechercher par nom, profil olfactif, origine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg border-2 focus:border-violet-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearAllFilters} className="text-sm">
              Réinitialiser les filtres
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1 space-y-4">
              {/* Famille Olfactive Filter */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Famille Olfactive</CardTitle>
                  <CardDescription className="text-xs">
                    {selectedFamilies.length > 0 ? `${selectedFamilies.length} sélectionnée(s)` : "Toutes"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {uniqueFamilies.map(family => (
                      <div key={family} className="flex items-center space-x-2">
                        <Checkbox
                          id={`family-${family}`}
                          checked={selectedFamilies.includes(family)}
                          onCheckedChange={() => toggleFilter(family, selectedFamilies, setSelectedFamilies)}
                        />
                        <Label
                          htmlFor={`family-${family}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {family}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Origine Géographique Filter */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Origine Géographique</CardTitle>
                  <CardDescription className="text-xs">
                    {selectedOrigins.length > 0 ? `${selectedOrigins.length} sélectionnée(s)` : "Toutes"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {uniqueOrigins.map(origin => (
                      <div key={origin} className="flex items-center space-x-2">
                        <Checkbox
                          id={`origin-${origin}`}
                          checked={selectedOrigins.includes(origin)}
                          onCheckedChange={() => toggleFilter(origin, selectedOrigins, setSelectedOrigins)}
                        />
                        <Label
                          htmlFor={`origin-${origin}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {origin}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Période Historique Filter */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Période Historique</CardTitle>
                  <CardDescription className="text-xs">
                    {selectedPeriods.length > 0 ? `${selectedPeriods.length} sélectionnée(s)` : "Toutes"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {historicalPeriods.map(period => (
                      <div key={period} className="flex items-center space-x-2">
                        <Checkbox
                          id={`period-${period}`}
                          checked={selectedPeriods.includes(period)}
                          onCheckedChange={() => toggleFilter(period, selectedPeriods, setSelectedPeriods)}
                        />
                        <Label
                          htmlFor={`period-${period}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {period}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedFamilies.map(f => (
                  <Badge key={f} variant="secondary" className="gap-1">
                    {f}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleFilter(f, selectedFamilies, setSelectedFamilies)}
                    />
                  </Badge>
                ))}
                {selectedOrigins.map(o => (
                  <Badge key={o} variant="secondary" className="gap-1">
                    {o}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleFilter(o, selectedOrigins, setSelectedOrigins)}
                    />
                  </Badge>
                ))}
                {selectedPeriods.map(p => (
                  <Badge key={p} variant="secondary" className="gap-1">
                    {p}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleFilter(p, selectedPeriods, setSelectedPeriods)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              {filteredMolecules.length} molécule(s) · {filteredCivilisations.length} civilisation(s)
            </div>

            {/* Loading State */}
            {(loadingMolecules || loadingCivilisations) && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Chargement des données...</p>
              </div>
            )}

            {/* Molecules Results */}
            {!loadingMolecules && filteredMolecules.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  Molécules
                  <Badge variant="outline">{filteredMolecules.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredMolecules.map(molecule => (
                    <Link key={molecule.id} href={`/molecules/${molecule.id}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">{molecule.name}</CardTitle>
                          {molecule.family && (
                            <CardDescription className="text-xs">
                              {molecule.family}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          {molecule.olfactiveProfile && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                              {molecule.olfactiveProfile}
                            </p>
                          )}
                          {molecule.sourceOrigin && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {molecule.sourceOrigin.split(',').slice(0, 2).map((origin, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {origin.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Civilisations Results */}
            {!loadingCivilisations && filteredCivilisations.length > 0 && (
              <div>
                <Separator className="my-8" />
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  Civilisations
                  <Badge variant="outline">{filteredCivilisations.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCivilisations.map(civ => (
                    <Link key={civ.id} href={`/civilisations/${civ.id}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">{civ.name}</CardTitle>
                          {civ.region && (
                            <CardDescription className="text-xs">
                              {civ.region}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          {civ.temporality && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {civ.temporality}
                            </p>
                          )}
                          {civ.longDescription && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              {civ.longDescription}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!loadingMolecules && !loadingCivilisations && 
             filteredMolecules.length === 0 && filteredCivilisations.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-xl font-semibold mb-2">Aucun résultat</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Essayez d'ajuster vos critères de recherche ou vos filtres
                  </p>
                  <Button onClick={clearAllFilters} variant="outline">
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
