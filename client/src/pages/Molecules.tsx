// @ts-nocheck
import { useState, useMemo } from "react";
import { ViewToggle, useViewMode } from "@/components/ViewToggle";
import { MoleculeListItem } from "@/components/MoleculeListItem";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc";
import { Loader2, Atom, X, Filter, Check, Download, ShieldCheck } from "lucide-react";
import { GridSkeleton, FilterBarSkeleton } from "@/components/skeletons";
import { SearchBar } from "@/components/filters/SearchBar";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromOlfactiveProfile } from "@/lib/gammeMapping";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VoirAussi, suggestionsMolecules } from "@/components/VoirAussi";
import { ProfileAutocomplete } from "@/components/filters/ProfileAutocomplete";
import { ActiveFiltersChips } from "@/components/filters/ActiveFiltersChips";
import { FloatingCompareBar } from "@/components/FloatingCompareBar";
import { useLocation } from "wouter";
import { MiniRadarChart } from "@/components/MiniRadarChart";
import { Beaker, Droplets, Zap, FlaskConical } from "lucide-react";
import { TruncatableBody } from "@/components/TruncatableText";
import { IFRAStatusBadge } from "@/components/IFRAStatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Molecules() {
  const { data: molecules, isLoading } = trpc.molecules?.list.useQuery();
  const { data: chemicalFamiliesData } = trpc.chemicalFamilies.listAll.useQuery();
  const trackEvent = trpc.analytics.trackEvent.useMutation();
  const [, setLocation] = useLocation();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [chemicalClassFilter, setChemicalClassFilter] = useState("all");
  const [chemicalFamilyFilter, setChemicalFamilyFilter] = useState("all");
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
  
  // Flavornet percept filter
  const [selectedPercept, setSelectedPercept] = useState<string>("all");
  const { data: availablePercepts } = trpc.flavornet.getUniquePercepts.useQuery();
  
  // IFRA status filter
  const [ifraStatusFilter, setIfraStatusFilter] = useState<string>("all");
  
  // Validation status filter
  const [validationFilter, setValidationFilter] = useState<string>("all");
  
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
  
  // View mode (grid/list)
  const [viewMode, setViewMode] = useViewMode("molecules-view-mode", "grid");
  
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
    const uniqueFamilies = new Set(molecules?.map(m => m.family).filter(Boolean));
    return Array.from(uniqueFamilies).sort().map(f => ({ value: f!, label: f! }));
  }, [molecules]);

  // Extract unique chemical classes for filter
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

  const chemicalClasses = useMemo(() => {
    if (!molecules) return [];
    const uniqueClasses = new Set(molecules?.map(m => m.chemicalClass).filter(Boolean));
    return Array.from(uniqueClasses).sort().map(c => ({ 
      value: c!, 
      label: chemicalClassLabels[c!] || c! 
    }));
  }, [molecules]);

  // Extract chemical families from classification service
  const chemicalFamilies = useMemo(() => {
    if (!chemicalFamiliesData) return [];
    return chemicalFamiliesData?.map((f: any) => ({
      value: f.id,
      label: f.nameFr,
      labelEn: f.name
    }));
  }, [chemicalFamiliesData]);

  // Helper : obtenir les tags olfactifs d'une molécule (tableau ou string)
  const getOlfactiveTags = (profile: string | string[] | null | undefined): string[] => {
    if (!profile) return [];
    if (Array.isArray(profile)) return profile;
    return profile.split(/[,;\n]/).map(p => p.trim()).filter(Boolean);
  };

  // Helper : obtenir la représentation texte d'un profil olfactif
  const getOlfactiveText = (profile: string | string[] | null | undefined): string => {
    if (!profile) return '';
    if (Array.isArray(profile)) return profile.join(', ');
    return profile;
  };

  // Extract unique olfactive profiles
  const olfactiveProfiles = useMemo(() => {
    if (!molecules) return [];
    const profileSet = new Set<string>();
    molecules?.forEach(m => {
      getOlfactiveTags(m.olfactiveProfile as any).forEach(tag => profileSet.add(tag));
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
    
    return molecules?.filter(molecule => {
      // Search filter
      const matchesSearch = 
        molecule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getOlfactiveText(molecule.olfactiveProfile as any).toLowerCase().includes(searchQuery.toLowerCase()) ||
        molecule.emotionalResonance?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Family filter
      const matchesFamily = 
        familyFilter === "all" || molecule.family === familyFilter;
      
      // Chemical class filter
      const matchesChemicalClass = 
        chemicalClassFilter === "all" || molecule.chemicalClass === chemicalClassFilter;
      
      // Chemical family filter (via dedicated table - will be checked separately)
      // Note: This requires async lookup, so we handle it differently
      
      // Olfactive profile filter
      const matchesProfile = 
        selectedProfiles.length === 0 ||
        selectedProfiles.some(profile =>
          getOlfactiveTags(molecule.olfactiveProfile as any).some(tag =>
            tag.toLowerCase().includes(profile.toLowerCase())
          )
        );
      
      // Concentration filter
      const conc = parseConcentration(molecule.concentration);
      const matchesConcentration = 
        conc === null || 
        (conc >= concentrationRange[0] && conc <= concentrationRange[1]);
      
      // Gamme filter
      const matchesGamme = 
        !selectedGamme || getGammeFromOlfactiveProfile(getOlfactiveText(molecule.olfactiveProfile as any)) === selectedGamme;
      
      // Flavornet percept filter
      const matchesPercept = 
        selectedPercept === "all" || 
        ((molecule as any).flavornetPercepts && (molecule as any).flavornetPercepts.toLowerCase().includes(selectedPercept.toLowerCase()));
      
      // IFRA status filter
      const matchesIfraStatus = 
        ifraStatusFilter === "all" || 
        molecule.ifraStatus === ifraStatusFilter;
      
      // Validation status filter
      const matchesValidation =
        validationFilter === "all" ||
        (validationFilter === "valide" && (molecule.validationStatus === "valide" || !molecule.validationStatus)) ||
        (validationFilter !== "valide" && molecule.validationStatus === validationFilter);
      
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
      
      return matchesSearch && matchesFamily && matchesChemicalClass && matchesProfile && matchesConcentration && matchesGamme &&
        matchesPercept && matchesIfraStatus && matchesValidation &&
        matchesRadarIntensity && matchesRadarFreshness && matchesRadarWarmth && 
        matchesRadarSweetness && matchesRadarSpiciness && matchesRadarEarthiness &&
        matchesBoilingPoint && matchesMolecularWeight;
    });
  }, [molecules, searchQuery, familyFilter, chemicalClassFilter, selectedProfiles, concentrationRange, selectedGamme,
      selectedPercept, ifraStatusFilter, validationFilter,
      radarIntensityRange, radarFreshnessRange, radarWarmthRange, 
      radarSweetnessRange, radarSpicinessRange, radarEarthinessRange,
      boilingPointRange, molecularWeightRange]);

  // Query for molecules in selected chemical family
  const { data: chemicalFamilyMoleculesData } = trpc.chemicalFamilies.getMoleculesById.useQuery(
    { id: parseInt(chemicalFamilyFilter) || 0 },
    { enabled: chemicalFamilyFilter !== "all" && !isNaN(parseInt(chemicalFamilyFilter)) }
  );

  // Apply chemical family filter on top of other filters
  const finalFilteredMolecules = useMemo(() => {
    if (chemicalFamilyFilter === "all") return filteredMolecules;
    if (!chemicalFamilyMoleculesData?.molecules) return [];
    const moleculeIdsInFamily = new Set((chemicalFamilyMoleculesData as any).molecules?.map((m: any) => m.id) || []);
    return filteredMolecules.filter(m => moleculeIdsInFamily.has(m.id));
  }, [filteredMolecules, chemicalFamilyFilter, chemicalFamilyMoleculesData]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFamilyFilter("all");
    setChemicalClassFilter("all");
    setChemicalFamilyFilter("all");
    setSelectedProfiles([]);
    setConcentrationRange([0.0001, 0.1]);
    setSelectedGamme(null);
    setSelectedPercept("all");
    setIfraStatusFilter("all");
    setValidationFilter("all");
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
    chemicalClassFilter !== "all" ||
    chemicalFamilyFilter !== "all" ||
    selectedProfiles.length > 0 || 
    concentrationRange[0] !== 0.0001 || 
    concentrationRange[1] !== 0.1 ||
    selectedGamme !== null ||
    selectedPercept !== "all" ||
    ifraStatusFilter !== "all" ||
    validationFilter !== "all" ||
    radarIntensityRange[0] !== 0 || radarIntensityRange[1] !== 100 ||
    radarFreshnessRange[0] !== 0 || radarFreshnessRange[1] !== 100 ||
    radarWarmthRange[0] !== 0 || radarWarmthRange[1] !== 100 ||
    radarSweetnessRange[0] !== 0 || radarSweetnessRange[1] !== 100 ||
    radarSpicinessRange[0] !== 0 || radarSpicinessRange[1] !== 100 ||
    radarEarthinessRange[0] !== 0 || radarEarthinessRange[1] !== 100 ||
    boilingPointRange[0] !== 0 || boilingPointRange[1] !== 500 ||
    molecularWeightRange[0] !== 0 || molecularWeightRange[1] !== 500;

  // Export filtered molecules to CSV
  const exportToCSV = () => {
    if (!finalFilteredMolecules || finalFilteredMolecules.length === 0) return;
    
    // Define CSV headers
    const headers = [
      'ID', 'Nom', 'CAS', 'Famille', 'Classe chimique', 'Profil olfactif',
      'Résonance émotionnelle', 'Concentration', 'Point d\'ébullition (°C)',
      'Masse moléculaire (g/mol)', 'Statut IFRA', 'IFRA Max %', 'Percepts Flavornet',
      'Indice Kovats', 'PubChem CID', 'ChEBI ID', 'SMILES'
    ];
    
    // Convert molecules to CSV rows
    const rows = finalFilteredMolecules.map(m => [
      m.id,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      m.casNumber || '',
      m.family || '',
      m.chemicalClass || '',
      `"${(getOlfactiveText(m.olfactiveProfile as any) || '').replace(/"/g, '""')}"`,
      `"${(m.emotionalResonance || '').replace(/"/g, '""')}"`,
      m.concentration || '',
      m.boilingPoint || '',
      m.molecularWeight || '',
      m.ifraStatus || 'not_regulated',
      (m as any).ifraMaxPercent || '',
      `"${((m as any).flavornetPercepts || '').replace(/"/g, '""')}"`,
      (m as any).flavornetKovatsIndex || '',
      m.pubchemCid || '',
      m.chebiId || '',
      `"${(m.smiles || '').replace(/"/g, '""')}"`
    ]);
    
    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `perfumum-molecules-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Track export event
    trackEvent.mutate({
      eventType: 'pdf_export',
      metadata: { action: 'molecules_export_csv', count: finalFilteredMolecules.length, hasFilters: hasActiveFilters }
    });
  };

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

        {/* Chemical Family Statistics */}
        {chemicalFamiliesData && chemicalFamiliesData?.length > 0 && (
          <section className="py-6 bg-muted/20 border-b border-border/40">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  Classification par famille chimique
                </h2>
                <div className="flex flex-wrap gap-2">
                  {chemicalFamiliesData?.slice(0, 12).map((family: any) => (
                    <Button
                      key={family.id}
                      variant={chemicalFamilyFilter === family.id ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => setChemicalFamilyFilter(
                        chemicalFamilyFilter === family.id ? "all" : family.id
                      )}
                    >
                      {family.nameFr}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {family.count}
                      </Badge>
                    </Button>
                  ))}
                  {chemicalFamiliesData?.length > 12 && (
                    <span className="text-xs text-muted-foreground self-center ml-2">
                      +{chemicalFamiliesData?.length - 12} familles
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {chemicalFamiliesData?.reduce((acc: number, f: any) => acc + (f.count || 0), 0)} molécules classées dans {chemicalFamiliesData?.length} familles chimiques
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="py-8 border-b border-border/40">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {/* Filter toggle + Export + View mode */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-enhanced"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-enhanced"
                    onClick={exportToCSV}
                    disabled={!finalFilteredMolecules || finalFilteredMolecules.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV ({finalFilteredMolecules?.length || 0})
                  </Button>
                </div>
                <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
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
                  ...(chemicalClassFilter !== "all" ? [{
                    type: "chemicalClass" as const,
                    label: "Classe",
                    value: chemicalClassLabels[chemicalClassFilter] || chemicalClassFilter,
                    onRemove: () => setChemicalClassFilter("all")
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
                  }] : []),
                  ...(chemicalFamilyFilter !== "all" ? [{
                    type: "chemicalFamily" as const,
                    label: "Famille chimique",
                    value: chemicalFamilies.find(f => f.value === chemicalFamilyFilter)?.label || chemicalFamilyFilter,
                    onRemove: () => setChemicalFamilyFilter("all")
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
                      placeholder="Famille olfactive"
                    />
                    <FilterSelect
                      value={chemicalClassFilter}
                      onChange={setChemicalClassFilter}
                      options={chemicalClasses}
                      placeholder="Classe chimique"
                    />
                  </div>

                  {/* Chemical Family Filter */}
                  {chemicalFamilies.length > 0 && (
                    <div className="border-t border-border/40 pt-4 mt-4">
                      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4" />
                        Famille chimique (table dédiée)
                      </h3>
                      <Select value={chemicalFamilyFilter} onValueChange={setChemicalFamilyFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Toutes les familles chimiques" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les familles chimiques</SelectItem>
                          {chemicalFamilies.map((family) => (
                            <SelectItem key={family.value} value={family.value}>
                              {family.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {chemicalFamilyFilter !== "all" && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {chemicalFamilyMoleculesData?.total || 0} molécule(s) dans cette famille
                        </p>
                      )}
                    </div>
                  )}

                  {/* Olfactive Profiles - Autocomplete */}
                  <ProfileAutocomplete
                    profiles={olfactiveProfiles}
                    selectedProfiles={selectedProfiles}
                    onToggleProfile={toggleProfile}
                    onClearAll={() => setSelectedProfiles([])}
                  />

                  {/* Flavornet Percept Filter */}
                  <div className="border-t border-border/40 pt-4 mt-4">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Droplets className="w-4 h-4" />
                      Descripteur olfactif (Flavornet)
                    </h3>
                    <Select value={selectedPercept} onValueChange={setSelectedPercept}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tous les percepts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les percepts</SelectItem>
                        {availablePercepts?.map((percept) => (
                          <SelectItem key={percept} value={percept}>
                            {percept.charAt(0).toUpperCase() + percept.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedPercept !== "all" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Filtrage par descripteur: {selectedPercept}
                      </p>
                    )}
                  </div>

                  {/* Validation Status Filter */}
                  <div className="border-t border-border/40 pt-4 mt-4">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Statut de validation
                    </h3>
                    <Select value={validationFilter} onValueChange={setValidationFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="valide">✅ Validé</SelectItem>
                        <SelectItem value="en_revision">🔄 En révision</SelectItem>
                        <SelectItem value="brouillon">📝 Brouillon</SelectItem>
                        <SelectItem value="rejete">❌ Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationFilter !== "all" && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {finalFilteredMolecules?.length || 0} molécule(s) avec ce statut
                      </p>
                    )}
                  </div>

                  {/* IFRA Status Filter */}
                  <div className="border-t border-border/40 pt-4 mt-4">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Statut réglementaire IFRA
                    </h3>
                    <Select value={ifraStatusFilter} onValueChange={setIfraStatusFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="banned">Interdit</SelectItem>
                        <SelectItem value="restricted">Restreint</SelectItem>
                        <SelectItem value="specification_required">Spécification requise</SelectItem>
                        <SelectItem value="not_regulated">Non réglementé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                {finalFilteredMolecules.length} molécule{finalFilteredMolecules.length > 1 ? "s" : ""} trouvée{finalFilteredMolecules.length > 1 ? "s" : ""}
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
                <GridSkeleton count={6} />
              ) : finalFilteredMolecules.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Aucune molécule trouvée</p>
                  {hasActiveFilters && (
                    <Button variant="outline" className="btn-enhanced" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  )}
                </div>
              ) : viewMode === "list" ? (
                /* Vue Liste */
                <div className="space-y-2">
                  {finalFilteredMolecules.map((molecule) => (
                    <MoleculeListItem
                      key={molecule.id}
                      molecule={molecule}
                      isSelected={selectedMolecules.includes(molecule.id)}
                      onToggleSelection={toggleMoleculeSelection}
                      onTrackEvent={() => {
                        trackEvent.mutate({
                          eventType: "molecule_view",
                          entityId: molecule.id,
                          entityType: "molecule",
                          metadata: JSON.stringify({
                            moleculeName: molecule.name,
                            family: molecule.family,
                            source: "molecules_list_view"
                          }),
                        });
                      }}
                    />
                  ))}
                </div>
              ) : (
                /* Vue Grille */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {finalFilteredMolecules.map((molecule) => (
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
                            source: "molecules_grid_view"
                          }),
                        });
                      }}
                    >
                      <Card className={`card-hover cursor-pointer h-full ${
                        selectedMolecules.includes(molecule.id) ? 'ring-2 ring-primary' : ''
                      }`}>
                        <CardHeader>
                          {/* Image 2D PubChem */}
                          {(molecule as any).pubchemCid && (
                            <div className="w-full h-28 mb-3 rounded-lg overflow-hidden bg-white/5 border border-border flex items-center justify-center">
                              <img
                                src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${(molecule as any).pubchemCid}/PNG?image_size=200x150`}
                                alt={`Structure 2D de ${molecule.name}`}
                                className="max-h-full max-w-full object-contain p-1"
                                loading="lazy"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            </div>
                          )}
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
                                <FavoriteButton page={{ id: String(molecule.id), title: molecule.name || '', href: `/molecules/${molecule.id}` }} variant="ghost" />
                              </div>
                              {getGammeFromOlfactiveProfile(getOlfactiveText(molecule.olfactiveProfile as any)) && (
                                <GammeBadge 
                                  gamme={getGammeFromOlfactiveProfile(getOlfactiveText(molecule.olfactiveProfile as any))!} 
                                  size="sm" 
                                  showIcon={false}
                                />
                              )}
                              {molecule.family && (
                                <Badge variant="outline">
                                  {molecule.family}
                                </Badge>
                              )}
                              {/* Indicateurs de source d'enrichissement */}
                              {(molecule as any).pubchemCid && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800">
                                  PubChem
                                </Badge>
                              )}
                              {(molecule as any).chebiId && !(molecule as any).pubchemCid && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800">
                                  ChEBI
                                </Badge>
                              )}
                              {/* Badge IFRA */}
                              <IFRAStatusBadge 
                                status={(molecule as any).ifraStatus} 
                                maxPercent={(molecule as any).ifraMaxPercent}
                                compact={true}
                              />
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
                                <TruncatableBody
                                  text={`${molecule.molecularWeight} g/mol`}
                                  maxLines={1}
                                  expandable={false}
                                  className="text-xs"
                                />
                              </div>
                            )}
                            {molecule.volatility && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Droplets className="h-3.5 w-3.5 shrink-0" />
                                <TruncatableBody
                                  text={molecule.volatility}
                                  maxLines={1}
                                  expandable={false}
                                  className="text-xs"
                                />
                              </div>
                            )}
                            {molecule.intensity !== null && molecule.intensity !== undefined && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Zap className="h-3.5 w-3.5 shrink-0" />
                                <TruncatableBody
                                  text={`Intensité ${molecule.intensity > 10 ? Math.round(molecule.intensity / 10) : molecule.intensity}/10`}
                                  maxLines={1}
                                  expandable={false}
                                  className="text-xs"
                                />
                              </div>
                            )}
                            {molecule.boilingPoint && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <FlaskConical className="h-3.5 w-3.5 shrink-0" />
                                <TruncatableBody
                                  text={`${molecule.boilingPoint}°C`}
                                  maxLines={1}
                                  expandable={false}
                                  className="text-xs"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        {molecule.olfactiveProfile && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Profil Olfactif</h4>
                            {Array.isArray(molecule.olfactiveProfile) && molecule.olfactiveProfile.length > 1 ? (
                              <div className="flex flex-wrap gap-1">
                                {(molecule.olfactiveProfile as string[]).map((tag, i) => (
                                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {getOlfactiveText(molecule.olfactiveProfile as any)}
                              </p>
                            )}
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

      {/* Voir aussi */}
      <VoirAussi items={suggestionsMolecules} />

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
