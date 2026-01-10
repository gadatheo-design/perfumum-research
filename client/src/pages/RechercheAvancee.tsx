import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ChevronDown, ChevronUp, Beaker, Globe, Clock, SlidersHorizontal, Sparkles, Database, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 120, damping: 18 } 
  }
};

// Skeleton pour les cartes de résultats
function ResultCardSkeleton() {
  return (
    <Card className="h-full border border-border/50 bg-card">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2 mt-1" />
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-1.5 mt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

function ResultsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ResultCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton pour les filtres
function FilterSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="w-4 h-4" />
        </div>
      </CardHeader>
    </Card>
  );
}

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

  const isLoading = loadingMolecules || loadingCivilisations;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative py-16 md:py-24 border-b border-border/50 overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-violet-500/3" />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtres Avancés
                </Badge>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground"
              >
                Recherche{" "}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Avancée
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Explorez la base de données PERFUMUM avec des filtres précis pour trouver exactement ce que vous cherchez
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="flex flex-wrap justify-center gap-3 mt-6"
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border/50 shadow-sm text-sm">
                  <Database className="w-4 h-4 text-primary" />
                  <span className="font-medium">{molecules.length} molécules</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border/50 shadow-sm text-sm">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="font-medium">{civilisations.length} civilisations</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="container py-8 md:py-10 max-w-7xl">
          {/* Search Bar - Enhanced */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom, profil olfactif, origine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-14 text-base border-border/60 focus:border-primary bg-card shadow-sm"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Filter Toggle - Enhanced */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 border-border/60 hover:border-primary/40 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filtres 
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Réinitialiser
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar - Enhanced */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="lg:col-span-1 space-y-3"
                >
                  {/* Famille Olfactive */}
                  <Card className="border-border/50 overflow-hidden">
                    <Collapsible open={expandedSections.family} onOpenChange={() => toggleSection('family')}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Beaker className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <CardTitle className="text-sm font-medium">Famille Olfactive</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedFamilies.length > 0 && (
                                <Badge variant="default" className="h-5 px-1.5 text-xs">
                                  {selectedFamilies.length}
                                </Badge>
                              )}
                              <motion.div
                                animate={{ rotate: expandedSections.family ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              </motion.div>
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-4">
                          <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                            {loadingMolecules ? (
                              <div className="space-y-2">
                                {[1, 2, 3, 4].map(i => (
                                  <div key={i} className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 flex-1" />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              uniqueFamilies.slice(0, 20).map(family => (
                                <div key={family} className="flex items-center space-x-2 group">
                                  <Checkbox
                                    id={`family-${family}`}
                                    checked={selectedFamilies.includes(family)}
                                    onCheckedChange={() => toggleFilter(family, selectedFamilies, setSelectedFamilies)}
                                    className="h-4 w-4 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                  />
                                  <Label
                                    htmlFor={`family-${family}`}
                                    className="text-sm cursor-pointer flex-1 text-muted-foreground group-hover:text-foreground transition-colors truncate"
                                  >
                                    {family}
                                  </Label>
                                </div>
                              ))
                            )}
                            {uniqueFamilies.length > 20 && (
                              <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                                +{uniqueFamilies.length - 20} autres familles
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Origine Géographique */}
                  <Card className="border-border/50 overflow-hidden">
                    <Collapsible open={expandedSections.origin} onOpenChange={() => toggleSection('origin')}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <CardTitle className="text-sm font-medium">Origine Géographique</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedOrigins.length > 0 && (
                                <Badge variant="default" className="h-5 px-1.5 text-xs">
                                  {selectedOrigins.length}
                                </Badge>
                              )}
                              <motion.div
                                animate={{ rotate: expandedSections.origin ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              </motion.div>
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-4">
                          <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                            {loadingMolecules ? (
                              <div className="space-y-2">
                                {[1, 2, 3, 4].map(i => (
                                  <div key={i} className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 flex-1" />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              uniqueOrigins.slice(0, 15).map(origin => (
                                <div key={origin} className="flex items-center space-x-2 group">
                                  <Checkbox
                                    id={`origin-${origin}`}
                                    checked={selectedOrigins.includes(origin)}
                                    onCheckedChange={() => toggleFilter(origin, selectedOrigins, setSelectedOrigins)}
                                    className="h-4 w-4 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                  <Label
                                    htmlFor={`origin-${origin}`}
                                    className="text-sm cursor-pointer flex-1 text-muted-foreground group-hover:text-foreground transition-colors truncate"
                                  >
                                    {origin}
                                  </Label>
                                </div>
                              ))
                            )}
                            {uniqueOrigins.length > 15 && (
                              <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                                +{uniqueOrigins.length - 15} autres origines
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Période Historique */}
                  <Card className="border-border/50 overflow-hidden">
                    <Collapsible open={expandedSections.period} onOpenChange={() => toggleSection('period')}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              </div>
                              <CardTitle className="text-sm font-medium">Période Historique</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedPeriods.length > 0 && (
                                <Badge variant="default" className="h-5 px-1.5 text-xs">
                                  {selectedPeriods.length}
                                </Badge>
                              )}
                              <motion.div
                                animate={{ rotate: expandedSections.period ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              </motion.div>
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-4">
                          <div className="space-y-2">
                            {historicalPeriods.map(period => (
                              <div key={period} className="flex items-center space-x-2 group">
                                <Checkbox
                                  id={`period-${period}`}
                                  checked={selectedPeriods.includes(period)}
                                  onCheckedChange={() => toggleFilter(period, selectedPeriods, setSelectedPeriods)}
                                  className="h-4 w-4 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                                />
                                <Label
                                  htmlFor={`period-${period}`}
                                  className="text-sm cursor-pointer flex-1 text-muted-foreground group-hover:text-foreground transition-colors"
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
            </AnimatePresence>

            {/* Results */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              {/* Active Filters */}
              <AnimatePresence>
                {activeFiltersCount > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 flex flex-wrap gap-2"
                  >
                    {selectedFamilies.map(f => (
                      <motion.div
                        key={f}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge variant="secondary" className="gap-1.5 pr-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <Beaker className="w-3 h-3" />
                          {f}
                          <button
                            onClick={() => toggleFilter(f, selectedFamilies, setSelectedFamilies)}
                            className="ml-1 hover:bg-emerald-500/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                    {selectedOrigins.map(o => (
                      <motion.div
                        key={o}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge variant="secondary" className="gap-1.5 pr-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                          <Globe className="w-3 h-3" />
                          {o}
                          <button
                            onClick={() => toggleFilter(o, selectedOrigins, setSelectedOrigins)}
                            className="ml-1 hover:bg-blue-500/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                    {selectedPeriods.map(p => (
                      <motion.div
                        key={p}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge variant="secondary" className="gap-1.5 pr-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          {p}
                          <button
                            onClick={() => toggleFilter(p, selectedPeriods, setSelectedPeriods)}
                            className="ml-1 hover:bg-amber-500/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Count */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-5 flex items-center gap-4"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Beaker className="w-4 h-4" />
                  <span className="font-medium text-foreground">{filteredMolecules.length}</span> molécule(s)
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium text-foreground">{filteredCivilisations.length}</span> civilisation(s)
                </div>
              </motion.div>

              {/* Loading */}
              {isLoading && (
                <div className="space-y-10">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Skeleton className="w-5 h-5" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                    <ResultsGridSkeleton count={6} />
                  </div>
                </div>
              )}

              {/* Molecules */}
              {!loadingMolecules && filteredMolecules.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Beaker className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Molécules
                    <Badge variant="outline" className="ml-1">{filteredMolecules.length}</Badge>
                  </h2>
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    {filteredMolecules.slice(0, 30).map(molecule => (
                      <motion.div key={molecule.id} variants={itemVariants}>
                        <Link href={`/molecules/${molecule.id}`}>
                          <Card className="h-full border-border/50 hover:border-emerald-400/40 dark:hover:border-emerald-600/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardHeader className="pb-2 relative">
                              <CardTitle className="text-base font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                                {molecule.name}
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                              </CardTitle>
                              {molecule.family && (
                                <CardDescription className="text-xs line-clamp-1">
                                  {molecule.family}
                                </CardDescription>
                              )}
                            </CardHeader>
                            <CardContent className="pt-0 relative">
                              {molecule.olfactiveProfile && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                  {molecule.olfactiveProfile}
                                </p>
                              )}
                              {molecule.sourceOrigin && (
                                <div className="flex flex-wrap gap-1">
                                  {molecule.sourceOrigin.split(',').slice(0, 2).map((origin, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs font-normal bg-muted/50">
                                      {origin.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                  {filteredMolecules.length > 30 && (
                    <p className="text-sm text-muted-foreground mt-4 text-center py-3 bg-muted/30 rounded-lg border border-border/50">
                      Affichage des 30 premiers résultats sur <span className="font-medium text-foreground">{filteredMolecules.length}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Civilisations */}
              {!loadingCivilisations && filteredCivilisations.length > 0 && (
                <div>
                  <Separator className="my-8" />
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    Civilisations
                    <Badge variant="outline" className="ml-1">{filteredCivilisations.length}</Badge>
                  </h2>
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    {filteredCivilisations.map(civ => (
                      <motion.div key={civ.id} variants={itemVariants}>
                        <Link href={`/civilisations/${civ.id}`}>
                          <Card className="h-full border-border/50 hover:border-blue-400/40 dark:hover:border-blue-600/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardHeader className="pb-2 relative">
                              <CardTitle className="text-base font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                {civ.name}
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                              </CardTitle>
                              {civ.region && (
                                <CardDescription className="text-xs">
                                  {civ.region}
                                </CardDescription>
                              )}
                            </CardHeader>
                            <CardContent className="pt-0 relative">
                              {civ.temporality && (
                                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
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
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* No Results */}
              {!loadingMolecules && !loadingCivilisations && 
               filteredMolecules.length === 0 && filteredCivilisations.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="text-center py-16 border-border/50 bg-gradient-to-br from-muted/30 to-muted/10">
                    <CardContent>
                      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                        <Search className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-foreground">Aucun résultat</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Essayez d'ajuster vos critères de recherche ou vos filtres pour trouver ce que vous cherchez
                      </p>
                      <Button onClick={clearAllFilters} variant="outline" className="gap-2">
                        <X className="w-4 h-4" />
                        Réinitialiser les filtres
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
