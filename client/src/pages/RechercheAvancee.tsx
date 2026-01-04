import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Search, Filter, X, ChevronDown, ChevronUp, Beaker, Globe, Clock, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function RechercheAvancee() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    family: true,
    origin: false,
    period: false
  });
  
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  
  const { data: molecules = [], isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: civilisations = [], isLoading: loadingCivilisations } = trpc.civilisations.list.useQuery();

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

  const filteredMolecules = useMemo(() => {
    return molecules.filter(molecule => {
      const matchesSearch = !searchQuery || 
        molecule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.olfactiveProfile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.sourceOrigin?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFamily = selectedFamilies.length === 0 || 
        selectedFamilies.some(f => molecule.family?.includes(f));

      const matchesOrigin = selectedOrigins.length === 0 || 
        selectedOrigins.some(o => molecule.sourceOrigin?.includes(o));

      const matchesPeriod = selectedPeriods.length === 0;

      return matchesSearch && matchesFamily && matchesOrigin && matchesPeriod;
    });
  }, [molecules, searchQuery, selectedFamilies, selectedOrigins, selectedPeriods]);

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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtres Avancés
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Recherche Avancée
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Explorez la base de données PERFUMUM avec des filtres précis
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container py-8 max-w-7xl">
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par nom, profil olfactif, origine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-14 text-base border-border/60 focus:border-primary bg-card"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Filter Toggle */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Réinitialiser
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 space-y-3"
              >
                {/* Famille Olfactive */}
                <Card className="border-border/50">
                  <Collapsible open={expandedSections.family} onOpenChange={() => toggleSection('family')}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Beaker className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-medium">Famille Olfactive</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedFamilies.length > 0 && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {selectedFamilies.length}
                              </Badge>
                            )}
                            {expandedSections.family ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-4">
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                          {uniqueFamilies.slice(0, 20).map(family => (
                            <div key={family} className="flex items-center space-x-2">
                              <Checkbox
                                id={`family-${family}`}
                                checked={selectedFamilies.includes(family)}
                                onCheckedChange={() => toggleFilter(family, selectedFamilies, setSelectedFamilies)}
                                className="h-4 w-4"
                              />
                              <Label
                                htmlFor={`family-${family}`}
                                className="text-sm cursor-pointer flex-1 text-muted-foreground hover:text-foreground transition-colors truncate"
                              >
                                {family}
                              </Label>
                            </div>
                          ))}
                          {uniqueFamilies.length > 20 && (
                            <p className="text-xs text-muted-foreground pt-2">
                              +{uniqueFamilies.length - 20} autres familles
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>

                {/* Origine Géographique */}
                <Card className="border-border/50">
                  <Collapsible open={expandedSections.origin} onOpenChange={() => toggleSection('origin')}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-medium">Origine Géographique</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedOrigins.length > 0 && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {selectedOrigins.length}
                              </Badge>
                            )}
                            {expandedSections.origin ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-4">
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                          {uniqueOrigins.slice(0, 15).map(origin => (
                            <div key={origin} className="flex items-center space-x-2">
                              <Checkbox
                                id={`origin-${origin}`}
                                checked={selectedOrigins.includes(origin)}
                                onCheckedChange={() => toggleFilter(origin, selectedOrigins, setSelectedOrigins)}
                                className="h-4 w-4"
                              />
                              <Label
                                htmlFor={`origin-${origin}`}
                                className="text-sm cursor-pointer flex-1 text-muted-foreground hover:text-foreground transition-colors truncate"
                              >
                                {origin}
                              </Label>
                            </div>
                          ))}
                          {uniqueOrigins.length > 15 && (
                            <p className="text-xs text-muted-foreground pt-2">
                              +{uniqueOrigins.length - 15} autres origines
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>

                {/* Période Historique */}
                <Card className="border-border/50">
                  <Collapsible open={expandedSections.period} onOpenChange={() => toggleSection('period')}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-medium">Période Historique</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedPeriods.length > 0 && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {selectedPeriods.length}
                              </Badge>
                            )}
                            {expandedSections.period ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-4">
                        <div className="space-y-2">
                          {historicalPeriods.map(period => (
                            <div key={period} className="flex items-center space-x-2">
                              <Checkbox
                                id={`period-${period}`}
                                checked={selectedPeriods.includes(period)}
                                onCheckedChange={() => toggleFilter(period, selectedPeriods, setSelectedPeriods)}
                                className="h-4 w-4"
                              />
                              <Label
                                htmlFor={`period-${period}`}
                                className="text-sm cursor-pointer flex-1 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {period}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </motion.div>
            )}

            {/* Results */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedFamilies.map(f => (
                    <Badge key={f} variant="secondary" className="gap-1.5 pr-1.5">
                      {f}
                      <button
                        onClick={() => toggleFilter(f, selectedFamilies, setSelectedFamilies)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedOrigins.map(o => (
                    <Badge key={o} variant="secondary" className="gap-1.5 pr-1.5">
                      {o}
                      <button
                        onClick={() => toggleFilter(o, selectedOrigins, setSelectedOrigins)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedPeriods.map(p => (
                    <Badge key={p} variant="secondary" className="gap-1.5 pr-1.5">
                      {p}
                      <button
                        onClick={() => toggleFilter(p, selectedPeriods, setSelectedPeriods)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Results Count */}
              <div className="mb-5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filteredMolecules.length}</span> molécule(s) · <span className="font-medium text-foreground">{filteredCivilisations.length}</span> civilisation(s)
              </div>

              {/* Loading */}
              {(loadingMolecules || loadingCivilisations) && (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                  <p className="mt-4 text-muted-foreground">Chargement des données...</p>
                </div>
              )}

              {/* Molecules */}
              {!loadingMolecules && filteredMolecules.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <Beaker className="w-5 h-5 text-primary" />
                    Molécules
                    <Badge variant="outline" className="ml-1">{filteredMolecules.length}</Badge>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredMolecules.slice(0, 30).map(molecule => (
                      <Link key={molecule.id} href={`/molecules/${molecule.id}`}>
                        <Card className="h-full border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">
                              {molecule.name}
                            </CardTitle>
                            {molecule.family && (
                              <CardDescription className="text-xs line-clamp-1">
                                {molecule.family}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="pt-0">
                            {molecule.olfactiveProfile && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {molecule.olfactiveProfile}
                              </p>
                            )}
                            {molecule.sourceOrigin && (
                              <div className="flex flex-wrap gap-1">
                                {molecule.sourceOrigin.split(',').slice(0, 2).map((origin, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs font-normal">
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
                  {filteredMolecules.length > 30 && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Affichage des 30 premiers résultats sur {filteredMolecules.length}
                    </p>
                  )}
                </div>
              )}

              {/* Civilisations */}
              {!loadingCivilisations && filteredCivilisations.length > 0 && (
                <div>
                  <Separator className="my-8" />
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <Globe className="w-5 h-5 text-primary" />
                    Civilisations
                    <Badge variant="outline" className="ml-1">{filteredCivilisations.length}</Badge>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCivilisations.map(civ => (
                      <Link key={civ.id} href={`/civilisations/${civ.id}`}>
                        <Card className="h-full border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">
                              {civ.name}
                            </CardTitle>
                            {civ.region && (
                              <CardDescription className="text-xs">
                                {civ.region}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="pt-0">
                            {civ.temporality && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {civ.temporality}
                              </p>
                            )}
                            {civ.longDescription && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
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
                <Card className="text-center py-16 border-border/50">
                  <CardContent>
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Aucun résultat</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Essayez d'ajuster vos critères de recherche ou vos filtres pour trouver ce que vous cherchez
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
      </main>
      
      <Footer />
    </div>
  );
}
