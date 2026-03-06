// @ts-nocheck
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Star, ArrowUpDown, Download, FileText, Table, Check } from "lucide-react";
import { Link } from "wouter";
import { FavoriteButton } from "@/components/FavoriteButton";
import { GammeBadge, type GammeType } from "@/components/GammeBadge";
import { getGammeFromOlfactiveProfile } from "@/lib/gammeMapping";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToPDF, type MoleculeExportData } from "@/lib/exportUtils";
import { FloatingCompareBar } from "@/components/FloatingCompareBar";
import { useLocation } from "wouter";

type SortOption = "name-asc" | "name-desc" | "family-asc" | "recent";

export default function Favoris() {
  const { data: favorites, isLoading } = trpc.favorites.list.useQuery();
  const [, setLocation] = useLocation();
  const [familyFilter, setFamilyFilter] = useState<string>("all");
  const [gammeFilter, setGammeFilter] = useState<GammeType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  
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

  // Extract unique families
  const families = useMemo(() => {
    if (!favorites) return [];
    const uniqueFamilies = new Set(
      favorites
        .filter(f => f.molecule)
        .map(f => f.molecule!.family)
        .filter(Boolean)
    );
    return Array.from(uniqueFamilies).sort();
  }, [favorites]);

  // Filter and sort favorites
  const filteredFavorites = useMemo(() => {
    if (!favorites) return [];

    let filtered = favorites.filter(fav => {
      if (!fav.molecule) return false;
      
      const matchesFamily = 
        familyFilter === "all" || fav.molecule.family === familyFilter;
      
      const gamme = getGammeFromOlfactiveProfile(fav.molecule.olfactiveProfile);
      const matchesGamme = 
        gammeFilter === "all" || gamme === gammeFilter;

      return matchesFamily && matchesGamme;
    });

    // Sort
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => {
          if (!a.molecule || !b.molecule) return 0;
          return a.molecule.name.localeCompare(b.molecule.name);
        });
        break;
      case "name-desc":
        filtered.sort((a, b) => {
          if (!a.molecule || !b.molecule) return 0;
          return b.molecule.name.localeCompare(a.molecule.name);
        });
        break;
      case "family-asc":
        filtered.sort((a, b) => {
          if (!a.molecule || !b.molecule) return 0;
          const famA = a.molecule.family || "";
          const famB = b.molecule.family || "";
          return famA.localeCompare(famB);
        });
        break;
      case "recent":
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        break;
    }

    return filtered;
  }, [favorites, familyFilter, gammeFilter, sortBy]);

  const resetFilters = () => {
    setFamilyFilter("all");
    setGammeFilter("all");
    setSortBy("recent");
  };

  const hasActiveFilters = familyFilter !== "all" || gammeFilter !== "all" || sortBy !== "recent";

  // Prepare export data
  const prepareExportData = (): MoleculeExportData[] => {
    return filteredFavorites.map(fav => ({
      name: fav.molecule!.name,
      family: fav.molecule!.family,
      chemicalFormula: fav.molecule!.chemicalFormula,
      olfactiveProfile: fav.molecule!.olfactiveProfile,
      emotionalResonance: fav.molecule!.emotionalResonance,
      functionalEffect: fav.molecule!.functionalEffect,
      sourceOrigin: fav.molecule!.sourceOrigin,
      concentration: fav.molecule!.concentration,
      addedDate: new Date(fav.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }));
  };

  const handleExportPDF = () => {
    try {
      const data = prepareExportData();
      exportToPDF(data);
      // Export PDF réussi;
    } catch (error) {
      console.error("Erreur d'export PDF:", error);
      alert("Erreur lors de l'export PDF");
    }
  };

  const handleExportCSV = () => {
    try {
      const data = prepareExportData();
      exportToCSV(data);
      // Export CSV réussi;
    } catch (error) {
      console.error("Erreur d'export CSV:", error);
      alert("Erreur lors de l'export CSV");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Breadcrumbs />
              <div className="flex items-center gap-3 mb-4 mt-6">
                <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Molécules Favorites
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Collection personnelle de molécules sauvegardées pour référence rapide
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border/40">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Family Filter */}
                  <Select value={familyFilter} onValueChange={setFamilyFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Famille chimique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les familles</SelectItem>
                      {families.map(family => (
                        <SelectItem key={family} value={family!}>
                          {family}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Gamme Filter */}
                  <Select value={gammeFilter} onValueChange={(v) => setGammeFilter(v as GammeType | "all")}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Gamme" />
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

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Plus récents</SelectItem>
                      <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
                      <SelectItem value="family-asc">Famille</SelectItem>
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Réinitialiser
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    {filteredFavorites.length} favorite{filteredFavorites.length > 1 ? "s" : ""}
                    {hasActiveFilters && ` sur ${favorites?.length || 0}`}
                  </div>
                  
                  {filteredFavorites.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Exporter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleExportPDF}>
                          <FileText className="h-4 w-4 mr-2" />
                          Exporter en PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportCSV}>
                          <Table className="h-4 w-4 mr-2" />
                          Exporter en CSV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Favorites List */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !favorites || favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Aucune molécule favorite</h3>
                  <p className="text-muted-foreground mb-6">
                    Ajoutez des molécules à vos favoris pour les retrouver facilement ici
                  </p>
                  <Link href="/molecules">
                    <a>
                      <Button>
                        Explorer les molécules
                      </Button>
                    </a>
                  </Link>
                </div>
              ) : filteredFavorites.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Aucune molécule ne correspond aux filtres sélectionnés
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredFavorites.map((favorite) => {
                    const molecule = favorite.molecule;
                    if (!molecule) return null;
                    return (
                      <Link key={favorite.id} href={`/molecule/${molecule.id}`}>
                        <Card className={`hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full ${
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
                                    <FavoriteButton 
                                      moleculeId={molecule.id} 
                                      variant="icon"
                                    />
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
                              {molecule.chemicalFormula && (
                                <p className="text-sm font-mono text-muted-foreground">
                                  {molecule.chemicalFormula}
                                </p>
                              )}
                            </CardHeader>
                            <CardContent className="space-y-4">
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

                              <div className="pt-2 border-t border-border/40">
                                <p className="text-xs text-muted-foreground">
                                  Ajouté le {new Date(favorite.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                    );
                  })}
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
