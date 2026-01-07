import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Search, Filter, X, ChevronDown, ChevronUp, Beaker, Globe, Clock, SlidersHorizontal, Atom, Tag, FlaskConical, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useSearch } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { motion } from "framer-motion";
import { FamilyBadge, ChemicalClassBadge, OriginBadge, ClickableBadge } from "@/components/ClickableBadge";
import { SmartLink } from "@/components/SmartLink";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Labels pour les classes chimiques
const chemicalClassLabels: Record<string, string> = {
  terpene: "Terpène",
  sesquiterpene: "Sesquiterpène",
  diterpene: "Diterpène",
  monoterpene: "Monoterpène",
  aldehyde: "Aldéhyde",
  ketone: "Cétone",
  alcohol: "Alcool",
  ester: "Ester",
  ether: "Éther",
  phenol: "Phénol",
  lactone: "Lactone",
  coumarin: "Coumarine",
  musk: "Musc",
  nitrile: "Nitrile",
  sulfur_compound: "Composé soufré",
  heterocyclic: "Hétérocyclique",
  aromatic: "Aromatique",
  aliphatic: "Aliphatique",
  other: "Autre",
};

export default function RechercheAvancee() {
  // Récupérer les paramètres URL
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    family: true,
    chemicalClass: false,
    origin: false,
    period: false,
    tags: false
  });
  
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [selectedChemicalClasses, setSelectedChemicalClasses] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { data: molecules = [], isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: civilisations = [], isLoading: loadingCivilisations } = trpc.civilisations.list.useQuery();
  const { data: recettes = [], isLoading: loadingRecettes } = trpc.recettes.list.useQuery();
  const { data: plants = [], isLoading: loadingPlants } = trpc.plants.list.useQuery();

  // Initialiser les filtres depuis l'URL
  useEffect(() => {
    const familyParam = urlParams.get('family');
    const chemicalClassParam = urlParams.get('chemicalClass');
    const originParam = urlParams.get('origin');
    const tagParam = urlParams.get('tag');
    
    if (familyParam) {
      setSelectedFamilies([familyParam]);
      setExpandedSections(prev => ({ ...prev, family: true }));
    }
    if (chemicalClassParam) {
      setSelectedChemicalClasses([chemicalClassParam]);
      setExpandedSections(prev => ({ ...prev, chemicalClass: true }));
    }
    if (originParam) {
      setSelectedOrigins([originParam]);
      setExpandedSections(prev => ({ ...prev, origin: true }));
    }
    if (tagParam) {
      setSelectedTags([tagParam]);
      setExpandedSections(prev => ({ ...prev, tags: true }));
    }
  }, [searchParams]);

  // Extraire les familles uniques
  const uniqueFamilies = useMemo(() => {
    const families = new Set<string>();
    molecules.forEach(m => {
      if (m.family) {
        m.family.split(',').forEach(f => families.add(f.trim()));
      }
    });
    return Array.from(families).sort();
  }, [molecules]);

  // Extraire les classes chimiques uniques
  const uniqueChemicalClasses = useMemo(() => {
    const classes = new Set<string>();
    molecules.forEach(m => {
      if (m.chemicalClass) {
        classes.add(m.chemicalClass);
      }
    });
    return Array.from(classes).sort();
  }, [molecules]);

  // Extraire les origines uniques
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

  // Extraire les tags uniques (depuis les molécules et recettes)
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    molecules.forEach(m => {
      // Ajouter les familles comme tags
      if (m.family) {
        m.family.split(',').forEach(f => tags.add(f.trim()));
      }
    });
    recettes.forEach(r => {
      // Ajouter les catégories comme tags
      if (r.category) tags.add(r.category);
    });
    return Array.from(tags).sort().slice(0, 30);
  }, [molecules, recettes]);

  const historicalPeriods = [
    "Antiquité (-3000 à 476)",
    "Moyen Âge (476-1492)",
    "Renaissance (1492-1789)",
    "Époque moderne (1789-1914)",
    "Époque contemporaine (1914-présent)"
  ];

  // Filtrer les molécules
  const filteredMolecules = useMemo(() => {
    return molecules.filter(molecule => {
      const matchesSearch = !searchQuery || 
        molecule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.olfactiveProfile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.sourceOrigin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.chemicalClass?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFamily = selectedFamilies.length === 0 || 
        selectedFamilies.some(f => molecule.family?.toLowerCase().includes(f.toLowerCase()));

      const matchesChemicalClass = selectedChemicalClasses.length === 0 ||
        selectedChemicalClasses.some(c => molecule.chemicalClass === c);

      const matchesOrigin = selectedOrigins.length === 0 || 
        selectedOrigins.some(o => molecule.sourceOrigin?.toLowerCase().includes(o.toLowerCase()));

      const matchesPeriod = selectedPeriods.length === 0;

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(t => molecule.family?.toLowerCase().includes(t.toLowerCase()));

      return matchesSearch && matchesFamily && matchesChemicalClass && matchesOrigin && matchesPeriod && matchesTags;
    });
  }, [molecules, searchQuery, selectedFamilies, selectedChemicalClasses, selectedOrigins, selectedPeriods, selectedTags]);

  // Filtrer les civilisations
  const filteredCivilisations = useMemo(() => {
    return civilisations.filter(civ => {
      const matchesSearch = !searchQuery || 
        civ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        civ.region?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOrigin = selectedOrigins.length === 0 || 
        selectedOrigins.some(o => civ.region?.toLowerCase().includes(o.toLowerCase()));

      const matchesPeriod = selectedPeriods.length === 0 || 
        selectedPeriods.some(p => {
          const periodYear = parseInt(p.match(/\d+/)?.[0] || "0");
          return civ.temporality?.includes(periodYear.toString());
        });

      return matchesSearch && matchesOrigin && matchesPeriod;
    });
  }, [civilisations, searchQuery, selectedOrigins, selectedPeriods]);

  // Filtrer les recettes
  const filteredRecettes = useMemo(() => {
    return recettes.filter(recette => {
      const matchesSearch = !searchQuery || 
        recette.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recette.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recette.formula?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(t => recette.category?.toLowerCase().includes(t.toLowerCase()));

      return matchesSearch && matchesTags;
    });
  }, [recettes, searchQuery, selectedTags]);

  // Filtrer les plantes
  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesSearch = !searchQuery || 
        plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.latinName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.family?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFamily = selectedFamilies.length === 0 || 
        selectedFamilies.some(f => plant.family?.toLowerCase().includes(f.toLowerCase()));

      return matchesSearch && matchesFamily;
    });
  }, [plants, searchQuery, selectedFamilies]);

  const toggleFilter = (value: string, selected: string[], setter: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedFamilies([]);
    setSelectedChemicalClasses([]);
    setSelectedOrigins([]);
    setSelectedPeriods([]);
    setSelectedTags([]);
    setSearchQuery("");
  };

  const activeFiltersCount = selectedFamilies.length + selectedChemicalClasses.length + selectedOrigins.length + selectedPeriods.length + selectedTags.length;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const totalResults = filteredMolecules.length + filteredCivilisations.length + filteredRecettes.length + filteredPlants.length;

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
                Explorez la base de données PERFUMUM avec des filtres combinés
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
                placeholder="Rechercher par nom, profil olfactif, origine, classe chimique..."
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

                {/* Classe Chimique */}
                <Card className="border-border/50">
                  <Collapsible open={expandedSections.chemicalClass} onOpenChange={() => toggleSection('chemicalClass')}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Atom className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-medium">Classe Chimique</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedChemicalClasses.length > 0 && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {selectedChemicalClasses.length}
                              </Badge>
                            )}
                            {expandedSections.chemicalClass ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-4">
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                          {uniqueChemicalClasses.map(chemClass => (
                            <div key={chemClass} className="flex items-center space-x-2">
                              <Checkbox
                                id={`chemClass-${chemClass}`}
                                checked={selectedChemicalClasses.includes(chemClass)}
                                onCheckedChange={() => toggleFilter(chemClass, selectedChemicalClasses, setSelectedChemicalClasses)}
                                className="h-4 w-4"
                              />
                              <Label
                                htmlFor={`chemClass-${chemClass}`}
                                className="text-sm cursor-pointer flex-1 text-muted-foreground hover:text-foreground transition-colors truncate"
                              >
                                {chemicalClassLabels[chemClass] || chemClass}
                              </Label>
                            </div>
                          ))}
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

                {/* Tags */}
                <Card className="border-border/50">
                  <Collapsible open={expandedSections.tags} onOpenChange={() => toggleSection('tags')}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-medium">Tags</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedTags.length > 0 && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                {selectedTags.length}
                              </Badge>
                            )}
                            {expandedSections.tags ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {uniqueTags.map(tag => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/30"
                              onClick={() => toggleFilter(tag, selectedTags, setSelectedTags)}
                            >
                              {tag}
                            </Badge>
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
              {/* Active Filters with ClickableBadge */}
              {activeFiltersCount > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedFamilies.map(f => (
                    <Badge key={`fam-${f}`} variant="secondary" className="gap-1.5 pr-1.5 bg-primary/10">
                      <Beaker className="h-3 w-3" />
                      {f}
                      <button
                        onClick={() => toggleFilter(f, selectedFamilies, setSelectedFamilies)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedChemicalClasses.map(c => (
                    <Badge key={`chem-${c}`} variant="secondary" className="gap-1.5 pr-1.5 bg-blue-500/10">
                      <Atom className="h-3 w-3" />
                      {chemicalClassLabels[c] || c}
                      <button
                        onClick={() => toggleFilter(c, selectedChemicalClasses, setSelectedChemicalClasses)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedOrigins.map(o => (
                    <Badge key={`orig-${o}`} variant="secondary" className="gap-1.5 pr-1.5 bg-green-500/10">
                      <Globe className="h-3 w-3" />
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
                    <Badge key={`per-${p}`} variant="secondary" className="gap-1.5 pr-1.5 bg-amber-500/10">
                      <Clock className="h-3 w-3" />
                      {p}
                      <button
                        onClick={() => toggleFilter(p, selectedPeriods, setSelectedPeriods)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedTags.map(t => (
                    <Badge key={`tag-${t}`} variant="secondary" className="gap-1.5 pr-1.5 bg-violet-500/10">
                      <Tag className="h-3 w-3" />
                      {t}
                      <button
                        onClick={() => toggleFilter(t, selectedTags, setSelectedTags)}
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
                <span className="font-medium text-foreground">{totalResults}</span> résultat(s) : 
                <span className="ml-2">{filteredMolecules.length} molécule(s)</span> · 
                <span className="ml-1">{filteredRecettes.length} recette(s)</span> · 
                <span className="ml-1">{filteredPlants.length} plante(s)</span> · 
                <span className="ml-1">{filteredCivilisations.length} civilisation(s)</span>
              </div>

              {/* Loading */}
              {(loadingMolecules || loadingCivilisations || loadingRecettes || loadingPlants) && (
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
                            <div className="flex flex-wrap gap-1">
                              {molecule.chemicalClass && (
                                <ChemicalClassBadge chemicalClass={molecule.chemicalClass} disabled />
                              )}
                              {molecule.sourceOrigin?.split(',').slice(0, 1).map((origin, idx) => (
                                <OriginBadge key={idx} origin={origin.trim()} disabled />
                              ))}
                            </div>
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

              {/* Recettes */}
              {!loadingRecettes && filteredRecettes.length > 0 && (selectedTags.length > 0 || searchQuery) && (
                <div className="mb-10">
                  <Separator className="my-8" />
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <FlaskConical className="w-5 h-5 text-primary" />
                    Recettes
                    <Badge variant="outline" className="ml-1">{filteredRecettes.length}</Badge>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredRecettes.slice(0, 15).map(recette => (
                      <Link key={recette.id} href={`/recette/${recette.id}`}>
                        <Card className="h-full border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">
                              {recette.name}
                            </CardTitle>
                            {recette.category && (
                              <CardDescription className="text-xs">
                                {recette.category}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="pt-0">
                            {recette.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {recette.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Plants */}
              {!loadingPlants && filteredPlants.length > 0 && (selectedFamilies.length > 0 || searchQuery) && (
                <div className="mb-10">
                  <Separator className="my-8" />
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <Leaf className="w-5 h-5 text-primary" />
                    Plantes
                    <Badge variant="outline" className="ml-1">{filteredPlants.length}</Badge>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredPlants.slice(0, 15).map(plant => (
                      <Link key={plant.id} href={`/plants/${plant.id}`}>
                        <Card className="h-full border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">
                              {plant.name}
                            </CardTitle>
                            {plant.latinName && (
                              <CardDescription className="text-xs italic">
                                {plant.latinName}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="pt-0">
                            {plant.family && (
                              <FamilyBadge family={plant.family} disabled />
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
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
              {!loadingMolecules && !loadingCivilisations && !loadingRecettes && !loadingPlants &&
               totalResults === 0 && (
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
