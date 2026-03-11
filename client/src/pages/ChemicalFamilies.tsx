import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Atom, Beaker, ChevronRight, Search, Thermometer, Droplets, FlaskConical, X, Filter } from "lucide-react";
import { Link } from "wouter";

// Type pour les familles chimiques enrichies
interface ChemicalFamily {
  id: number;
  name: string;
  type: string;
  subcategory: string | null;
  description: string | null;
  olfactiveRole: string | null;
  volatility: string | null;
  polarity: string | null;
  molecularWeightRange: string | null;
  typicalNotes: string | null;
  exampleMolecules: string | null;
  moleculeCount: number;
}

// Couleurs par catégorie de type
const typeColors: Record<string, string> = {
  // Terpènes
  monoterpene: "bg-emerald-100 text-emerald-800 border-emerald-300",
  sesquiterpene: "bg-emerald-100 text-emerald-800 border-emerald-300",
  diterpene: "bg-emerald-100 text-emerald-800 border-emerald-300",
  triterpene: "bg-emerald-100 text-emerald-800 border-emerald-300",
  monoterpenoid: "bg-teal-100 text-teal-800 border-teal-300",
  sesquiterpenoid: "bg-teal-100 text-teal-800 border-teal-300",
  // Alcools
  alcohol_aliphatic: "bg-cyan-100 text-cyan-800 border-cyan-300",
  alcohol_aromatic: "bg-cyan-100 text-cyan-800 border-cyan-300",
  alcohol_terpenic: "bg-cyan-100 text-cyan-800 border-cyan-300",
  // Aldéhydes
  aldehyde_aliphatic: "bg-blue-100 text-blue-800 border-blue-300",
  aldehyde_aromatic: "bg-blue-100 text-blue-800 border-blue-300",
  aldehyde_terpenic: "bg-blue-100 text-blue-800 border-blue-300",
  // Cétones
  ketone_aliphatic: "bg-violet-100 text-violet-800 border-violet-300",
  ketone_aromatic: "bg-violet-100 text-violet-800 border-violet-300",
  ketone_terpenic: "bg-violet-100 text-violet-800 border-violet-300",
  ketone_macrocyclic: "bg-violet-100 text-violet-800 border-violet-300",
  // Esters
  ester_aliphatic: "bg-pink-100 text-pink-800 border-pink-300",
  ester_aromatic: "bg-pink-100 text-pink-800 border-pink-300",
  ester_terpenic: "bg-pink-100 text-pink-800 border-pink-300",
  // Éthers
  ether_aliphatic: "bg-indigo-100 text-indigo-800 border-indigo-300",
  ether_aromatic: "bg-indigo-100 text-indigo-800 border-indigo-300",
  // Phénols
  phenol: "bg-red-100 text-red-800 border-red-300",
  phenol_ether: "bg-red-100 text-red-800 border-red-300",
  // Lactones
  lactone: "bg-orange-100 text-orange-800 border-orange-300",
  lactone_macrocyclic: "bg-orange-100 text-orange-800 border-orange-300",
  // Coumarines
  coumarin: "bg-amber-100 text-amber-800 border-amber-300",
  // Muscs
  musk_nitro: "bg-purple-100 text-purple-800 border-purple-300",
  musk_polycyclic: "bg-purple-100 text-purple-800 border-purple-300",
  musk_macrocyclic: "bg-purple-100 text-purple-800 border-purple-300",
  musk_linear: "bg-purple-100 text-purple-800 border-purple-300",
  // Azotés
  nitrile: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
  indole: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
  pyrazine: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
  pyridine: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
  amine: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
  // Soufrés
  sulfur_compound: "bg-lime-100 text-lime-800 border-lime-300",
  thiophene: "bg-lime-100 text-lime-800 border-lime-300",
  // Acides
  acid_carboxylic: "bg-yellow-100 text-yellow-800 border-yellow-300",
  acid_fatty: "bg-yellow-100 text-yellow-800 border-yellow-300",
  // Hétérocycles
  furan: "bg-rose-100 text-rose-800 border-rose-300",
  heterocyclic_oxygen: "bg-rose-100 text-rose-800 border-rose-300",
  heterocyclic_nitrogen: "bg-rose-100 text-rose-800 border-rose-300",
  // Autres
  hydrocarbon_aromatic: "bg-slate-100 text-slate-800 border-slate-300",
  hydrocarbon_aliphatic: "bg-slate-100 text-slate-800 border-slate-300",
  oxide: "bg-sky-100 text-sky-800 border-sky-300",
  acetals: "bg-stone-100 text-stone-800 border-stone-300",
  anhydride: "bg-zinc-100 text-zinc-800 border-zinc-300",
  other: "bg-gray-100 text-gray-800 border-gray-300",
};

// Catégories principales pour le filtrage
const mainCategories = [
  { value: "all", label: "Toutes les familles" },
  { value: "terpenes", label: "Terpènes & Terpénoïdes", types: ["monoterpene", "sesquiterpene", "diterpene", "triterpene", "monoterpenoid", "sesquiterpenoid"] },
  { value: "alcohols", label: "Alcools", types: ["alcohol_aliphatic", "alcohol_aromatic", "alcohol_terpenic"] },
  { value: "aldehydes", label: "Aldéhydes", types: ["aldehyde_aliphatic", "aldehyde_aromatic", "aldehyde_terpenic"] },
  { value: "ketones", label: "Cétones", types: ["ketone_aliphatic", "ketone_aromatic", "ketone_terpenic", "ketone_macrocyclic"] },
  { value: "esters", label: "Esters", types: ["ester_aliphatic", "ester_aromatic", "ester_terpenic"] },
  { value: "ethers", label: "Éthers", types: ["ether_aliphatic", "ether_aromatic"] },
  { value: "phenols", label: "Phénols", types: ["phenol", "phenol_ether"] },
  { value: "lactones", label: "Lactones & Coumarines", types: ["lactone", "lactone_macrocyclic", "coumarin"] },
  { value: "musks", label: "Muscs", types: ["musk_nitro", "musk_polycyclic", "musk_macrocyclic", "musk_linear"] },
  { value: "nitrogen", label: "Composés azotés", types: ["nitrile", "indole", "pyrazine", "pyridine", "amine"] },
  { value: "sulfur", label: "Composés soufrés", types: ["sulfur_compound", "thiophene"] },
  { value: "acids", label: "Acides", types: ["acid_carboxylic", "acid_fatty"] },
  { value: "heterocycles", label: "Hétérocycles", types: ["furan", "heterocyclic_oxygen", "heterocyclic_nitrogen"] },
  { value: "other", label: "Autres", types: ["hydrocarbon_aromatic", "hydrocarbon_aliphatic", "oxide", "acetals", "anhydride", "other"] },
];

// Volatilité badge
const volatilityBadge = (volatility: string | null) => {
  if (!volatility) return null;
  const colors: Record<string, string> = {
    "Forte": "bg-red-50 text-red-700 border-red-200",
    "Moyenne-Forte": "bg-orange-50 text-orange-700 border-orange-200",
    "Moyenne": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Faible-Moyenne": "bg-lime-50 text-lime-700 border-lime-200",
    "Faible": "bg-green-50 text-green-700 border-green-200",
    "Très faible": "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <Badge variant="outline" className={`${colors[volatility] || "bg-gray-50"} text-xs`}>
      <Thermometer className="w-3 h-3 mr-1" />
      {volatility}
    </Badge>
  );
};

// Polarité badge
const polarityBadge = (polarity: string | null) => {
  if (!polarity) return null;
  const colors: Record<string, string> = {
    "Élevée": "bg-blue-50 text-blue-700 border-blue-200",
    "Moyenne": "bg-cyan-50 text-cyan-700 border-cyan-200",
    "Faible": "bg-teal-50 text-teal-700 border-teal-200",
    "Variable": "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <Badge variant="outline" className={`${colors[polarity] || "bg-gray-50"} text-xs`}>
      <Droplets className="w-3 h-3 mr-1" />
      {polarity}
    </Badge>
  );
};

export function ChemicalFamilies() {
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(true);
  
  // Utiliser la nouvelle API enrichie
  const { data: families = [], isLoading } = trpc.chemicalFamilies.listWithCount.useQuery();
  const { data: molecules = [] } = trpc.chemicalFamilies.getMoleculesById.useQuery(
    { familyId: selectedFamilyId || 0 },
    { enabled: !!selectedFamilyId }
  );

  // Filtrer les familles
  const filteredFamilies = families.filter((family: ChemicalFamily) => {
    // Filtre de recherche
    const matchesSearch = searchQuery === "" || 
      family.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      family.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      family.typicalNotes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      family.exampleMolecules?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre de catégorie
    const selectedCategory = mainCategories.find(c => c.value === categoryFilter);
    const matchesCategory = categoryFilter === "all" || 
      (selectedCategory?.types?.includes(family.type));
    
    return matchesSearch && matchesCategory;
  });

  // Famille sélectionnée
  const selectedFamily = families.find((f: ChemicalFamily) => f.id === selectedFamilyId);

  // Stats
  const totalMolecules = families.reduce((sum: number, f: ChemicalFamily) => sum + Number(f.moleculeCount || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
              <div className="lg:col-span-2">
                <Skeleton className="h-[600px]" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                <Beaker className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Familles Chimiques
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Classification des molécules olfactives par structure chimique. Explorez les aldéhydes, esters, terpènes, muscs et autres familles qui composent l'univers de la parfumerie.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-b border-border/40">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Familles chimiques</CardDescription>
                  <CardTitle className="text-3xl">{families.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Molécules liées</CardDescription>
                  <CardTitle className="text-3xl">{totalMolecules}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Catégories</CardDescription>
                  <CardTitle className="text-3xl">{mainCategories.length - 1}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Famille sélectionnée</CardDescription>
                  <CardTitle className="text-xl truncate">
                    {selectedFamily?.name || "Aucune"}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-border/40">
          <div className="container">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
              </Button>
              {(searchQuery || categoryFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="space-y-4 p-4 border border-border/40 rounded-lg bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recherche */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une famille chimique..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Catégorie */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {mainCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main content */}
        <section className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Families list */}
              <div className="lg:col-span-1 space-y-3 max-h-[800px] overflow-y-auto pr-2">
                <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-background py-2">
                  {filteredFamilies.length} famille{filteredFamilies.length > 1 ? "s" : ""} trouvée{filteredFamilies.length > 1 ? "s" : ""}
                </h2>
                {filteredFamilies.map((family: ChemicalFamily) => (
                  <Card
                    key={family.id}
                    className={`shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer ${
                      selectedFamilyId === family.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedFamilyId(family.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{family.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`${typeColors[family.type] || "bg-gray-100"} text-xs`}
                            >
                              {family.subcategory || family.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {family.moleculeCount} mol.
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Family details */}
              <div className="lg:col-span-2">
                {selectedFamily ? (
                  <div className="space-y-6">
                    {/* Family info */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <FlaskConical className="h-6 w-6 text-primary" />
                              <CardTitle className="text-2xl">{selectedFamily.name}</CardTitle>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className={typeColors[selectedFamily.type] || "bg-gray-100"}
                              >
                                {selectedFamily.type.replace(/_/g, " ")}
                              </Badge>
                              {selectedFamily.subcategory && (
                                <Badge variant="secondary">
                                  {selectedFamily.subcategory}
                                </Badge>
                              )}
                              {volatilityBadge(selectedFamily.volatility)}
                              {polarityBadge(selectedFamily.polarity)}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            {selectedFamily.moleculeCount} mol.
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedFamily.description && (
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                              Description
                            </h4>
                            <p className="text-foreground leading-relaxed">
                              {selectedFamily.description}
                            </p>
                          </div>
                        )}
                        
                        {selectedFamily.olfactiveRole && (
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                              Rôle olfactif
                            </h4>
                            <p className="text-foreground">
                              {selectedFamily.olfactiveRole}
                            </p>
                          </div>
                        )}

                        {selectedFamily.typicalNotes && (
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                              Notes typiques
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedFamily.typicalNotes.split(",").map((note, i) => (
                                <Badge key={i} variant="secondary" className="bg-primary/10">
                                  {note.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          {selectedFamily.molecularWeightRange && (
                            <div className="p-3 rounded-lg bg-muted/50">
                              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                Masse moléculaire
                              </h4>
                              <p className="font-mono text-sm">{selectedFamily.molecularWeightRange}</p>
                            </div>
                          )}
                          {selectedFamily.exampleMolecules && (
                            <div className="p-3 rounded-lg bg-muted/50">
                              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                Exemples
                              </h4>
                              <p className="text-sm">{selectedFamily.exampleMolecules}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Molecules list */}
                    {molecules.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Molécules liées ({molecules.length})
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {molecules.map((molecule) => (
                            <Link key={molecule.id} href={`/molecule/${molecule.id}`}>
                              <Card className="shadow-sm hover:shadow-md hover:scale-[1.005] transition-all cursor-pointer">
                                <CardHeader className="pb-2">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <CardTitle className="text-lg">{molecule.name}</CardTitle>
                                      <div className="flex items-center gap-2 mt-1">
                                        {molecule.chemicalFormula && (
                                          <span className="font-mono text-sm text-muted-foreground">
                                            {molecule.chemicalFormula}
                                          </span>
                                        )}
                                        {molecule.casNumber && (
                                          <Badge variant="outline" className="text-xs">
                                            CAS: {molecule.casNumber}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  {molecule.olfactiveProfile && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {molecule.olfactiveProfile}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {molecules.length === 0 && selectedFamily.moleculeCount === 0 && (
                      <Card>
                        <CardContent className="text-center py-8">
                          <Atom className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Aucune molécule n'est encore liée à cette famille chimique.
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Utilisez l'interface d'administration pour créer des liaisons.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card className="h-full min-h-[400px] flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <Atom className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">
                        Sélectionnez une famille chimique pour voir ses détails
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {filteredFamilies.length} famille{filteredFamilies.length > 1 ? "s" : ""} disponible{filteredFamilies.length > 1 ? "s" : ""}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
