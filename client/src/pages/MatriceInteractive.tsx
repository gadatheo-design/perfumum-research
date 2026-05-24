// @ts-nocheck
import { useState, useMemo, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Search, X, Filter, Grid3x3, Network, Download, FileText } from "lucide-react";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { SynergiesHeatmap } from "@/components/SynergiesHeatmap";

export default function MatriceInteractive() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTabac, setSelectedTabac] = useState<string>("all");
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [selectedGamme, setSelectedGamme] = useState<GammeType | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "heatmap">("grid");

  // Fetch data
  const { data: tabacs, isLoading: loadingTabacs } = trpc.tabacs?.list.useQuery();
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules?.list.useQuery();
  const { data: synergies, isLoading: loadingSynergies } = trpc.synergies?.list.useQuery();

  // Extract unique families from molecules
  const uniqueFamilies = useMemo(() => {
    if (!molecules) return [];
    const families = new Set(molecules?.map(m => m.family).filter((f): f is string => Boolean(f)));
    return Array.from(families).sort();
  }, [molecules]);

  // Filter molecules based on selections
  const filteredMolecules = useMemo(() => {
    if (!molecules) return [];
    
    return molecules?.filter(molecule => {
      // Search filter
      if (searchQuery && !molecule.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !molecule.olfactiveProfile?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Family filter
      if (selectedFamily !== "all" && molecule.family !== selectedFamily) {
        return false;
      }

      // Gamme filter (based on olfactive profile keywords)
      if (selectedGamme !== "all") {
        const profile = molecule.olfactiveProfile?.toLowerCase() || "";
        const gammeKeywords: Record<GammeType, string[]> = {
          petrichor: ["terre", "minéral", "pluie", "géosmine", "pierre", "argile", "humus"],
          volcanique: ["fumé", "pyrolysé", "cendre", "brûlé", "carbonisé", "résine brûlée"],
          civilisations: ["encens", "sacré", "rituel", "myrrhe", "oliban", "bois sacré"],
          glaciaire: ["frais", "ozone", "métallique", "altitude", "menthe", "eucalyptus"],
          biolab: ["expérimental", "synthétique", "biotechnologie", "design moléculaire"],
          colombie: ["café", "cacao", "andes", "colombie", "colombian", "chocolate", "coffee"]
        };
        
        const keywords = gammeKeywords[selectedGamme as GammeType];
        if (!keywords.some(kw => profile.includes(kw))) {
          return false;
        }
      }

      return true;
    });
  }, [molecules, searchQuery, selectedFamily, selectedGamme]);

  // Get synergies for selected tabac
  const tabacSynergies = useMemo(() => {
    if (!synergies || selectedTabac === "all") return [];
    return synergies?.filter(s => s.tabacName === selectedTabac);
  }, [synergies, selectedTabac]);

  // Get molecules with synergies for selected tabac
  const moleculesWithSynergies = useMemo(() => {
    if (selectedTabac === "all") return filteredMolecules;
    
    const synergyMoleculeIds = new Set(tabacSynergies.map(s => s.moleculeId));
    return filteredMolecules.map(molecule => ({
      ...molecule,
      hasSynergy: synergyMoleculeIds.has(molecule.id),
      synergyType: tabacSynergies.find(s => s.moleculeId === molecule.id)?.type
    }));
  }, [filteredMolecules, selectedTabac, tabacSynergies]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTabac("all");
    setSelectedFamily("all");
    setSelectedGamme("all");
  };

  const exportToCSV = () => {
    // Prepare CSV data from filtered molecules and synergies
    const csvRows = [];
    
    // Header
    csvRows.push(["Molécule", "Famille Chimique", "Profil Olfactif", "Tabac", "Type Synergie", "Effet", "Notes"].join(","));
    
    // Data rows
    if (selectedTabac === "all") {
      // Export all molecules with their data
      moleculesWithSynergies.forEach(molecule => {
        const row = [
          `"${molecule.name}"`,
          `"${molecule.family || 'N/A'}"`,
          `"${molecule.olfactiveProfile || 'N/A'}"`,
          "Tous",
          "",
          "",
          ""
        ];
        csvRows.push(row.join(","));
      });
    } else {
      // Export molecules with synergies for selected tabac
      moleculesWithSynergies.forEach(molecule => {
        const synergy = tabacSynergies.find(s => s.moleculeId === molecule.id);
        const row = [
          `"${molecule.name}"`,
          `"${molecule.family || 'N/A'}"`,
          `"${molecule.olfactiveProfile || 'N/A'}"`,
          `"${selectedTabac}"`,
          synergy ? `"${synergy.type}"` : "",
          synergy ? `"${synergy.effet || ''}"` : "",
          synergy ? `"${synergy.notes || ''}"` : ""
        ];
        csvRows.push(row.join(","));
      });
    }
    
    // Create CSV blob and download
    const csvContent = csvRows.join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const filename = `perfumum-matrice-${selectedTabac !== "all" ? selectedTabac : "complete"}-${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async () => {
    if (!contentRef.current) return;
    
    try {
      // Dynamically import libraries
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      // Capture the content
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add title page
      pdf.setFontSize(20);
      pdf.text('PERFUMUM - Matrice Interactive', 148.5, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Export du ${new Date().toLocaleDateString('fr-FR')}`, 148.5, 30, { align: 'center' });
      
      if (selectedTabac !== "all") {
        pdf.text(`Tabac: ${selectedTabac}`, 148.5, 40, { align: 'center' });
      }
      
      pdf.text(`${moleculesWithSynergies.length} molécules | ${tabacSynergies.length} synergies`, 148.5, 50, { align: 'center' });
      
      // Add visualization on new page
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save PDF
      const filename = `perfumum-matrice-${selectedTabac !== "all" ? selectedTabac : "complete"}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
    }
  };

  const activeFiltersCount = [
    searchQuery !== "",
    selectedTabac !== "all",
    selectedFamily !== "all",
    selectedGamme !== "all"
  ].filter(Boolean).length;

  if (loadingTabacs || loadingMolecules || loadingSynergies) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 section-spacing">
          <div className="container">
            <p className="text-center text-muted-foreground">Chargement de la matrice interactive...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 section-spacing">
        <div className="container" ref={contentRef}>
          <Breadcrumbs />
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Matrice Interactive</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Explorez les relations entre <strong>8 tabacs</strong>, <strong>131 molécules</strong> et <strong>28 familles chimiques</strong>. 
              Filtrez par gamme Perfumeum, famille chimique ou tabac pour découvrir les synergies moléculaires.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{tabacs?.length || 0}</CardTitle>
                <CardDescription>Tabacs</CardDescription>
              </CardHeader>
            </Card>
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{molecules?.length || 0}</CardTitle>
                <CardDescription>Molécules</CardDescription>
              </CardHeader>
            </Card>
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{uniqueFamilies.length}</CardTitle>
                <CardDescription>Familles Chimiques</CardDescription>
              </CardHeader>
            </Card>
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{synergies?.length || 0}</CardTitle>
                <CardDescription>Synergies</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Filters */}
          <Card className="brutal-border mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <CardTitle>Filtres</CardTitle>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary">{activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    Grille
                  </Button>
                  <Button
                    variant={viewMode === "heatmap" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("heatmap")}
                  >
                    <Network className="h-4 w-4 mr-2" />
                    Heatmap
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV()}
                    title="Exporter les données en CSV"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToPDF()}
                    title="Exporter en PDF"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  {activeFiltersCount > 0 && (
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Rechercher une molécule</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nom ou profil olfactif..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tabac Filter */}
                <div className="space-y-2">
                  <Label htmlFor="tabac">Tabac</Label>
                  <Select value={selectedTabac} onValueChange={setSelectedTabac}>
                    <SelectTrigger id="tabac">
                      <SelectValue placeholder="Tous les tabacs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les tabacs</SelectItem>
                      {tabacs?.map(tabac => (
                        <SelectItem key={tabac.id} value={tabac.name}>
                          {tabac.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Family Filter */}
                <div className="space-y-2">
                  <Label htmlFor="family">Famille Chimique</Label>
                  <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                    <SelectTrigger id="family">
                      <SelectValue placeholder="Toutes les familles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les familles</SelectItem>
                      {uniqueFamilies.map(family => (
                        <SelectItem key={family} value={family}>
                          {family}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gamme Filter */}
                <div className="space-y-2">
                  <Label htmlFor="gamme">Gamme Perfumeum</Label>
                  <Select value={selectedGamme} onValueChange={(value) => setSelectedGamme(value as GammeType | "all")}>
                    <SelectTrigger id="gamme">
                      <SelectValue placeholder="Toutes les gammes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les gammes</SelectItem>
                      <SelectItem value="petrichor">Pétrichor</SelectItem>
                      <SelectItem value="volcanique">Volcanique</SelectItem>
                      <SelectItem value="civilisations">Civilisations</SelectItem>
                      <SelectItem value="glaciaire">Glaciaire</SelectItem>
                      <SelectItem value="biolab">Bio-Lab</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {moleculesWithSynergies.length} molécule{moleculesWithSynergies.length > 1 ? 's' : ''} trouvée{moleculesWithSynergies.length > 1 ? 's' : ''}
              {selectedTabac !== "all" && tabacSynergies.length > 0 && (
                <> • <strong>{tabacSynergies.length}</strong> synergie{tabacSynergies.length > 1 ? 's' : ''} avec {selectedTabac}</>
              )}
            </p>
          </div>

          {/* View Mode: Heatmap or Grid */}
          {viewMode === "heatmap" ? (
            <SynergiesHeatmap
              molecules={molecules || []}
              tabacs={tabacs || []}
              synergies={synergies || []}
              selectedTabac={selectedTabac}
              selectedFamily={selectedFamily}
            />
          ) : moleculesWithSynergies.length === 0 ? (
            <Card className="brutal-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Aucune molécule trouvée avec ces filtres.</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moleculesWithSynergies.map((molecule: any) => (
                <Card 
                  key={molecule.id} 
                  className={`brutal-border transition-all duration-300 hover:shadow-lg ${
                    molecule.hasSynergy ? 'ring-2 ring-primary/50' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg">{molecule.name}</CardTitle>
                      {molecule.hasSynergy && (
                        <Badge variant="default" className="text-xs">
                          Synergie
                        </Badge>
                      )}
                    </div>
                    {molecule.family && (
                      <Badge variant="outline" className="w-fit text-xs">
                        {molecule.family}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {molecule.chemicalFormula && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Formule</p>
                        <code className="text-sm mono">{molecule.chemicalFormula}</code>
                      </div>
                    )}
                    {molecule.olfactiveProfile && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Profil Olfactif</p>
                        <p className="text-sm">{molecule.olfactiveProfile}</p>
                      </div>
                    )}
                    {molecule.synergyType && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Type de Synergie</p>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {molecule.synergyType}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    <Footer />

    </div>
  );
}
