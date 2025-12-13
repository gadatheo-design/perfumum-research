import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { Loader2, Atom, X, Filter, Check } from "lucide-react";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromOlfactiveProfile } from "@/lib/gammeMapping";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ProfileAutocomplete } from "@/components/filters/ProfileAutocomplete";
import { ActiveFiltersChips } from "@/components/filters/ActiveFiltersChips";
import { FloatingCompareBar } from "@/components/FloatingCompareBar";
import { useLocation } from "wouter";
import { MiniRadarChart } from "@/components/MiniRadarChart";
import { Beaker, Droplets, Zap, FlaskConical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Molecules() {
  const { data: molecules, isLoading } = trpc.molecules.list.useQuery();
  const trackEvent = trpc.analytics.trackEvent.useMutation();
  const [, setLocation] = useLocation();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [concentrationRange, setConcentrationRange] = useState<[number, number]>([0.0001, 0.1]);
  // Hide filters by default on mobile (<1024px), show on desktop
  const [showFilters, setShowFilters] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [selectedGamme, setSelectedGamme] = useState<GammeType | null>(null);
  
  // Radar filters
  const [radarIntensityRange, setRadarIntensityRange] = useState<[number, number]>([0, 100]);
  
  // Chemical properties filters
  const [boilingPointRange, setBoilingPointRange] = useState<[number, number]>([0, 500]);
  const [molecularWeightRange, setMolecularWeightRange] = useState<[number, number]>([0, 500]);
  const [radarFreshnessRange, setRadarFreshnessRange] = useState<[number, number]>([0, 100]);
  const [radarWarmthRange, setRadarWarmthRange] = useState<[number, number]>([0, 100]);
  const [radarSweetnessRange, setRadarSweetnessRange] = useState<[number, number]>([0, 100]);
  const [radarSpicinessRange, setRadarSpicinessRange] = useState<[number, number]>([0, 100]);
  const [radarEarthinessRange, setRadarEarthinessRange] = useState<[number, number]>([0, 100]);
  
  // Comparison mode state
  const [selectedMolecules, setSelectedMolecules] = useState<number[]>([]);
  const MAX_COMPARISON = 4;
  
  const toggleMoleculeSelection = (moleculeId: number) => {
    setSelectedMolecules(prev => {
      if (prev.includes(moleculeId)) {
        return prev.filter(id => id !== moleculeId);
      }
      if (prev.length >= MAX_COMPARISON) {
        return prev; // Don't add if already at max
      }
      return [...prev, moleculeId];
    });
  };
  
  const clearSelection = () => setSelectedMolecules([]);

  // Extract unique families for filter
  const families = useMemo(() => {
    if (!molecules) return [];
    const uniqueFamilies = new Set(molecules.map(m => m.family).filter(Boolean));
    return Array.from(uniqueFamilies).sort().map(f => ({ value: f!, label: f! }));
  }, [molecules]);

  // Extract unique olfactive profiles
  const olfactiveProfiles = useMemo(() => {
    if (!molecules) return [];
    const profileSet = new Set<string>();
    molecules.forEach(m => {
      if (m.olfactiveProfile) {
        // Split by comma, semicolon, or newline
        m.olfactiveProfile.split(/[,;\n]/).forEach(p => {
          const trimmed = p.trim();
          if (trimmed) profileSet.add(trimmed);
        });
      }
    });
    return Array.from(profileSet).sort();
  }, [molecules]);

  // Parse concentration from string (e.g., "0.05%" -> 0.05)
  const parseConcentration = (concStr: string | null): number | null => {
    if (!concStr) return null;
    const match = concStr.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : null;
  };

  // Filter molecules
  const filteredMolecules = useMemo(() => {
    if (!molecules) return [];
    
    return molecules.filter(molecule => {
      // Search filter
      const matchesSearch = 
        molecule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.olfactiveProfile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.emotionalResonance?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Family filter
      const matchesFamily = 
        familyFilter === "all" || molecule.family === familyFilter;
      
      // Olfactive profile filter
      const matchesProfile = 
        selectedProfiles.length === 0 ||
        (molecule.olfactiveProfile && selectedProfiles.some(profile => 
          molecule.olfactiveProfile!.toLowerCase().includes(profile.toLowerCase())
        ));
      
      // Concentration filter
      const conc = parseConcentration(molecule.concentration);
      const matchesConcentration = 
        conc === null || 
        (conc >= concentrationRange[0] && conc <= concentrationRange[1]);
      
      // Gamme filter
      const matchesGamme = 
        !selectedGamme || getGammeFromOlfactiveProfile(molecule.olfactiveProfile) === selectedGamme;
      
      // Radar filters
      const matchesRadarIntensity = 
        (molecule.radarIntensity || 50) >= radarIntensityRange[0] && 
        (molecule.radarIntensity || 50) <= radarIntensityRange[1];
      const matchesRadarFreshness = 
        (molecule.radarFreshness || 50) >= radarFreshnessRange[0] && 
        (molecule.radarFreshness || 50) <= radarFreshnessRange[1];
      const matchesRadarWarmth = 
        (molecule.radarWarmth || 50) >= radarWarmthRange[0] && 
        (molecule.radarWarmth || 50) <= radarWarmthRange[1];
      const matchesRadarSweetness = 
        (molecule.radarSweetness || 50) >= radarSweetnessRange[0] && 
        (molecule.radarSweetness || 50) <= radarSweetnessRange[1];
      const matchesRadarSpiciness = 
        (molecule.radarSpiciness || 50) >= radarSpicinessRange[0] && 
        (molecule.radarSpiciness || 50) <= radarSpicinessRange[1];
      const matchesRadarEarthiness = 
        (molecule.radarEarthiness || 50) >= radarEarthinessRange[0] && 
        (molecule.radarEarthiness || 50) <= radarEarthinessRange[1];
      
      // Chemical properties filters
      const bp = molecule.boilingPoint;
      const matchesBoilingPoint = 
        bp === null || bp === undefined ||
        (bp >= boilingPointRange[0] && bp <= boilingPointRange[1]);
      
      const mw = molecule.molecularWeight;
      const matchesMolecularWeight = 
        mw === null || mw === undefined ||
        (mw >= molecularWeightRange[0] && mw <= molecularWeightRange[1]);
      
      return matchesSearch && matchesFamily && matchesProfile && matchesConcentration && matchesGamme &&
        matchesRadarIntensity && matchesRadarFreshness && matchesRadarWarmth && 
        matchesRadarSweetness && matchesRadarSpiciness && matchesRadarEarthiness &&
        matchesBoilingPoint && matchesMolecularWeight;
    });
  }, [molecules, searchQuery, familyFilter, selectedProfiles, concentrationRange, selectedGamme,
      radarIntensityRange, radarFreshnessRange, radarWarmthRange, 
      radarSweetnessRange, radarSpicinessRange, radarEarthinessRange,
      boilingPointRange, molecularWeightRange]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFamilyFilter("all");
    setSelectedProfiles([]);
    setConcentrationRange([0.0001, 0.1]);
    setSelectedGamme(null);
    setRadarIntensityRange([0, 100]);
    setRadarFreshnessRange([0, 100]);
    setRadarWarmthRange([0, 100]);
    setRadarSweetnessRange([0, 100]);
    setRadarSpicinessRange([0, 100]);
    setRadarEarthinessRange([0, 100]);
    setBoilingPointRange([0, 500]);
    setMolecularWeightRange([0, 500]);
  };

  // Toggle profile selection
  const toggleProfile = (profile: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profile) 
        ? prev.filter(p => p !== profile)
        : [...prev, profile]
    );
  };

  // Check if any filter is active
  const hasActiveFilters = 
    searchQuery !== "" || 
    familyFilter !== "all" || 
    selectedProfiles.length > 0 || 
    concentrationRange[0] !== 0.0001 || 
    concentrationRange[1] !== 0.1 ||
    selectedGamme !== null ||
    radarIntensityRange[0] !== 0 || radarIntensityRange[1] !== 100 ||
    radarFreshnessRange[0] !== 0 || radarFreshnessRange[1] !== 100 ||
    radarWarmthRange[0] !== 0 || radarWarmthRange[1] !== 100 ||
    radarSweetnessRange[0] !== 0 || radarSweetnessRange[1] !== 100 ||
    radarSpicinessRange[0] !== 0 || radarSpicinessRange[1] !== 100 ||
    radarEarthinessRange[0] !== 0 || radarEarthinessRange[1] !== 100 ||
    boilingPointRange[0] !== 0 || boilingPointRange[1] !== 500 ||
    molecularWeightRange[0] !== 0 || molecularWeightRange[1] !== 500;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Atom className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Molécules
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Catalogue des molécules olfactives étudiées dans le cadre de la recherche PERFUMUM. Chaque molécule est documentée avec son profil olfactif, sa résonance émotionnelle et ses propriétés fonctionnelles.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border/40">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {/* Filter toggle */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-enhanced"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
                </Button>
              </div>

              {/* Active Filters Chips */}
              <ActiveFiltersChips
                filters={[
                  ...(searchQuery ? [{
                    type: "search" as const,
                    label: "Recherche",
                    value: searchQuery,
                    onRemove: () => setSearchQuery("")
                  }] : []),
                  ...(familyFilter !== "all" ? [{
                    type: "family" as const,
                    label: "Famille",
                    value: familyFilter,
                    onRemove: () => setFamilyFilter("all")
                  }] : []),
                  ...selectedProfiles.map(profile => ({
                    type: "profile" as const,
                    label: "Profil",
                    value: profile,
                    onRemove: () => toggleProfile(profile)
                  })),
                  ...((concentrationRange[0] !== 0.0001 || concentrationRange[1] !== 0.1) ? [{
                    type: "concentration" as const,
                    label: "Concentration",
                    value: `${concentrationRange[0].toFixed(4)}% - ${concentrationRange[1].toFixed(4)}%`,
                    onRemove: () => setConcentrationRange([0.0001, 0.1])
                  }] : []),
                  ...(selectedGamme ? [{
                    type: "gamme" as const,
                    label: "Gamme",
                    value: selectedGamme,
                    onRemove: () => setSelectedGamme(null)
                  }] : [])
                ]}
                onResetAll={resetFilters}
              />

              {showFilters && (
                <div className="space-y-6 p-6 border border-border/40 rounded-lg bg-muted/20">
                  {/* Search & Family */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                     {/* Search Bar */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher une molécule..."
              />

              {/* Gamme Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground">Gammes :</span>
                <GammeBadge 
                  gamme="petrichor" 
                  size="sm" 
                  className={selectedGamme === 'petrichor' ? 'ring-2 ring-offset-2 ring-gamme-petrichor' : 'opacity-60 hover:opacity-100'}
                  onClick={() => setSelectedGamme(selectedGamme === 'petrichor' ? null : 'petrichor')}
                />
                <GammeBadge 
                  gamme="volcanique" 
                  size="sm" 
                  className={selectedGamme === 'volcanique' ? 'ring-2 ring-offset-2 ring-gamme-volcanique' : 'opacity-60 hover:opacity-100'}
                  onClick={() => setSelectedGamme(selectedGamme === 'volcanique' ? null : 'volcanique')}
                />
                <GammeBadge 
                  gamme="civilisations" 
                  size="sm" 
                  className={selectedGamme === 'civilisations' ? 'ring-2 ring-offset-2 ring-gamme-civilisations' : 'opacity-60 hover:opacity-100'}
                  onClick={() => setSelectedGamme(selectedGamme === 'civilisations' ? null : 'civilisations')}
                />
                <GammeBadge 
                  gamme="glaciaire" 
                  size="sm" 
                  className={selectedGamme === 'glaciaire' ? 'ring-2 ring-offset-2 ring-gamme-glaciaire' : 'opacity-60 hover:opacity-100'}
                  onClick={() => setSelectedGamme(selectedGamme === 'glaciaire' ? null : 'glaciaire')}
                />
                <GammeBadge 
                  gamme="biolab" 
                  size="sm" 
                  className={selectedGamme === 'biolab' ? 'ring-2 ring-offset-2 ring-gamme-biolab' : 'opacity-60 hover:opacity-100'}
                  onClick={() => setSelectedGamme(selectedGamme === 'biolab' ? null : 'biolab')}
                />
              </div>
                    </div>
                    <FilterSelect
                      value={familyFilter}
                      onChange={setFamilyFilter}
                      options={families}
                      placeholder="Famille chimique"
                    />
                  </div>

                  {/* Olfactive Profiles - Autocomplete */}
                  <ProfileAutocomplete
                    profiles={olfactiveProfiles}
                    selectedProfiles={selectedProfiles}
                    onToggleProfile={toggleProfile}
                    onClearAll={() => setSelectedProfiles([])}
                  />

                  {/* Concentration Range */}
                  <div>
                    <label className="text-sm font-semibold mb-3 block">
                      Concentration ({concentrationRange[0].toFixed(4)}% - {concentrationRange[1].toFixed(4)}%)
                    </label>
                    <div className="px-4">
                      <Slider
                        min={0.0001}
                        max={0.1}
                        step={0.0001}
                        value={concentrationRange}
                        onValueChange={(value) => setConcentrationRange(value as [number, number])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>0.0001%</span>
                        <span>0.1%</span>
                      </div>
                    </div>
                  </div>

                  {/* Radar Filters */}
                  <div className="border-t border-border/40 pt-6 mt-6">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <Atom className="w-4 h-4" />
                      Filtres Profil Radar Olfactif
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Intensité */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Intensité ({radarIntensityRange[0]} - {radarIntensityRange[1]})
                        </label>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={radarIntensityRange}
                          onValueChange={(value) => setRadarIntensityRange(value as [number, number])}
                          className="w-full"
                        />
                      </div>

                      {/* Fraîcheur */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Fraîcheur ({radarFreshnessRange[0]} - {radarFreshnessRange[1]})
                        </label>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={radarFreshnessRange}
                          onValueChange={(value) => setRadarFreshnessRange(value as [number, number])}
                          className="w-full"
                        />
                      </div>

                      {/* Chaleur */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Chaleur ({radarWarmthRange[0]} - {radarWarmthRange[1]})
                        </label>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={radarWarmthRange}
                          onValueChange={(value) => setRadarWarmthRange(value as [number, number])}
                          className="w-full"
                        />
                      </div>

                      {/* Douceur */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Douceur ({radarSweetnessRange[0]} - {radarSweetnessRange[1]})
                        </label>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={radarSweetnessRange}
                          onValueChange={(value) => setRadarSweetnessRange(value as [number, number])}
                          className="w-full"
                        />
                      </div>

                      {/* Épices */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Épices ({radarSpicinessRange[0]} - {radarSpicinessRange[1]})
                        </label>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={radarSpicinessRange}
                          onValueChange={(value) => setRadarSpicinessRange(value as [number, number])}
                          className="w-full"
                        />
                      </div>

                      {/* Terreux */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Terreux ({radarEarthinessRange[0]} - {radarEarthinessRange[1]})
                        </label>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={radarEarthinessRange}
                          onValueChange={(value) => setRadarEarthinessRange(value as [number, number])}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Propriétés Chimiques */}
                    <div className="border-t border-border/50 pt-4 mt-4">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <FlaskConical className="w-5 h-5" />
                        Propriétés Chimiques
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Point d'ébullition */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Point d'ébullition ({boilingPointRange[0]}°C - {boilingPointRange[1]}°C)
                        </label>
                        <Slider
                          min={0}
                          max={500}
                          step={10}
                          value={boilingPointRange}
                          onValueChange={(value) => setBoilingPointRange(value as [number, number])}
                          className="w-full"
                        />
                      </div>

                      {/* Masse moléculaire */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Masse moléculaire ({molecularWeightRange[0]} g/mol - {molecularWeightRange[1]} g/mol)
                        </label>
                        <Slider
                          min={0}
                          max={500}
                          step={10}
                          value={molecularWeightRange}
                          onValueChange={(value) => setMolecularWeightRange(value as [number, number])}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Results count */}
              <div className="mt-4 text-sm text-muted-foreground">
                {filteredMolecules.length} molécule{filteredMolecules.length > 1 ? "s" : ""} trouvée{filteredMolecules.length > 1 ? "s" : ""}
                {hasActiveFilters && ` sur ${molecules?.length || 0}`}
              </div>
            </div>
          </div>
        </section>

        {/* Molecules List */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredMolecules.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Aucune molécule trouvée</p>
                  {hasActiveFilters && (
                    <Button variant="outline" className="btn-enhanced" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMolecules.map((molecule) => (
                    <Link 
                      key={molecule.id} 
                      href={`/molecule/${molecule.id}`}
                      onClick={() => {
                        trackEvent.mutate({
                          eventType: "molecule_view",
                          entityId: molecule.id,
                          entityType: "molecule",
                          metadata: JSON.stringify({
                            moleculeName: molecule.name,
                            family: molecule.family,
                            source: "molecules_list"
                          }),
                        });
                      }}
                    >
                      <Card className={`card-hover cursor-pointer h-full ${
                        selectedMolecules.includes(molecule.id) ? 'ring-2 ring-primary' : ''
                      }`}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              {/* Selection checkbox */}
                              <div 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleMoleculeSelection(molecule.id);
                                }}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                                  selectedMolecules.includes(molecule.id)
                                    ? 'bg-primary border-primary'
                                    : 'border-muted-foreground/40 hover:border-primary'
                                }`}
                              >
                                {selectedMolecules.includes(molecule.id) && (
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                )}
                              </div>
                              <CardTitle className="text-xl hover:text-primary transition-colors">
                                {molecule.name}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <div onClick={(e) => e.preventDefault()}>
                                <FavoriteButton moleculeId={molecule.id} moleculeName={molecule.name} variant="icon" />
                              </div>
                              {getGammeFromOlfactiveProfile(molecule.olfactiveProfile) && (
                                <GammeBadge 
                                  gamme={getGammeFromOlfactiveProfile(molecule.olfactiveProfile)!} 
                                  size="sm" 
                                  showIcon={false}
                                />
                              )}
                              {molecule.family && (
                                <Badge variant="outline">
                                  {molecule.family}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {/* Always show chemical formula */}
                          <p className="text-sm font-mono text-muted-foreground">
                            {molecule.chemicalFormula || "Formule non disponible"}
                          </p>
                          {molecule.concentration && (
                            <p className="text-xs text-muted-foreground">
                              Concentration : {molecule.concentration}
                            </p>
                          )}
                        </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Mini Radar Chart + Properties */}
                        <div className="flex items-start gap-4">
                          {/* Mini Radar */}
                          {(molecule.radarIntensity || molecule.radarFreshness || molecule.radarWarmth || 
                            molecule.radarSweetness || molecule.radarSpiciness || molecule.radarEarthiness) && (
                            <div className="shrink-0">
                              <MiniRadarChart 
                                data={{
                                  intensity: molecule.radarIntensity,
                                  freshness: molecule.radarFreshness,
                                  warmth: molecule.radarWarmth,
                                  sweetness: molecule.radarSweetness,
                                  spiciness: molecule.radarSpiciness,
                                  earthiness: molecule.radarEarthiness,
                                }}
                                size={80}
                                className="text-primary"
                              />
                            </div>
                          )}
                          
                          {/* Key Properties */}
                          <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                            {molecule.molecularWeight && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Beaker className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{molecule.molecularWeight} g/mol</span>
                              </div>
                            )}
                            {molecule.volatility && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Droplets className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{molecule.volatility}</span>
                              </div>
                            )}
                            {molecule.intensity !== null && molecule.intensity !== undefined && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Zap className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">Intensité {molecule.intensity}/10</span>
                              </div>
                            )}
                            {molecule.boilingPoint && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <FlaskConical className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{molecule.boilingPoint}°C</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {molecule.olfactiveProfile && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Profil Olfactif</h4>
                            <p className="text-sm text-muted-foreground">
                              {molecule.olfactiveProfile}
                            </p>
                          </div>
                        )}
                        
                        {molecule.emotionalResonance && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Résonance Émotionnelle</h4>
                            <p className="text-sm text-muted-foreground italic">
                              {molecule.emotionalResonance}
                            </p>
                          </div>
                        )}
                        
                        {molecule.functionalEffect && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Effet Fonctionnel</h4>
                            <p className="text-sm text-muted-foreground">
                              {molecule.functionalEffect}
                            </p>
                          </div>
                        )}
                        
                        {molecule.sourceOrigin && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Origine</h4>
                            <p className="text-sm text-muted-foreground">
                              {molecule.sourceOrigin}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 PERFUMUM — Recherche Olfactive</p>
          </div>
        </div>
      </footer>

      {/* Floating Compare Bar */}
      <FloatingCompareBar
        selectedCount={selectedMolecules.length}
        maxCount={MAX_COMPARISON}
        onClear={clearSelection}
        onCompare={() => {
          const ids = selectedMolecules.join(',');
          setLocation(`/compare?ids=${ids}`);
        }}
      />
    <Footer />

    </div>
  );
}
