// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  monoterpene: "bg-emerald-100 text-emerald-800 border-emerald-300",
  sesquiterpene: "bg-emerald-100 text-emerald-800 border-emerald-300",
  diterpene: "bg-emerald-100 text-emerald-800 border-emerald-300",
  triterpene: "bg-emerald-100 text-emerald-800 border-emerald-300",
  monoterpenoid: "bg-teal-100 text-teal-800 border-teal-300",
  sesquiterpenoid: "bg-teal-100 text-teal-800 border-teal-300",
  alcohol_aliphatic: "bg-cyan-100 text-cyan-800 border-cyan-300",
  alcohol_aromatic: "bg-cyan-100 text-cyan-800 border-cyan-300",
  alcohol_terpenic: "bg-cyan-100 text-cyan-800 border-cyan-300",
  aldehyde_aliphatic: "bg-blue-100 text-blue-800 border-blue-300",
  aldehyde_aromatic: "bg-blue-100 text-blue-800 border-blue-300",
  aldehyde_terpenic: "bg-blue-100 text-blue-800 border-blue-300",
  ketone_aliphatic: "bg-violet-100 text-violet-800 border-violet-300",
  ketone_aromatic: "bg-violet-100 text-violet-800 border-violet-300",
  ketone_terpenic: "bg-violet-100 text-violet-800 border-violet-300",
  ketone_macrocyclic: "bg-violet-100 text-violet-800 border-violet-300",
  ester_aliphatic: "bg-pink-100 text-pink-800 border-pink-300",
  ester_aromatic: "bg-pink-100 text-pink-800 border-pink-300",
  ester_terpenic: "bg-pink-100 text-pink-800 border-pink-300",
  ether_aliphatic: "bg-indigo-100 text-indigo-800 border-indigo-300",
  ether_aromatic: "bg-indigo-100 text-indigo-800 border-indigo-300",
  phenol: "bg-red-100 text-red-800 border-red-300",
  lactone: "bg-amber-100 text-amber-800 border-amber-300",
  coumarin: "bg-orange-100 text-orange-800 border-orange-300",
  musk_macrocyclic: "bg-purple-100 text-purple-800 border-purple-300",
  musk_nitro: "bg-purple-100 text-purple-800 border-purple-300",
  musk_polycyclic: "bg-purple-100 text-purple-800 border-purple-300",
  nitrile: "bg-gray-100 text-gray-800 border-gray-300",
  sulfur: "bg-yellow-100 text-yellow-800 border-yellow-300",
  heterocyclic: "bg-lime-100 text-lime-800 border-lime-300",
  other: "bg-slate-100 text-slate-800 border-slate-300",
};

// Groupes de catégories pour filtrage
const categoryGroups = [
  { label: "Terpènes", types: ["monoterpene", "sesquiterpene", "diterpene", "triterpene", "monoterpenoid", "sesquiterpenoid"] },
  { label: "Alcools", types: ["alcohol_aliphatic", "alcohol_aromatic", "alcohol_terpenic"] },
  { label: "Aldéhydes", types: ["aldehyde_aliphatic", "aldehyde_aromatic", "aldehyde_terpenic"] },
  { label: "Cétones", types: ["ketone_aliphatic", "ketone_aromatic", "ketone_terpenic", "ketone_macrocyclic"] },
  { label: "Esters", types: ["ester_aliphatic", "ester_aromatic", "ester_terpenic"] },
  { label: "Éthers", types: ["ether_aliphatic", "ether_aromatic"] },
  { label: "Phénols", types: ["phenol"] },
  { label: "Lactones", types: ["lactone"] },
  { label: "Coumarines", types: ["coumarin"] },
  { label: "Muscs", types: ["musk_macrocyclic", "musk_nitro", "musk_polycyclic"] },
  { label: "Autres", types: ["nitrile", "sulfur", "heterocyclic", "other"] },
];

/**
 * ChemicalFamiliesContent - The core content of the chemical families page
 */
export function ChemicalFamiliesContent() {
  const { data: families, isLoading } = trpc.chemicalFamilies.listWithCount.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter families
  const filteredFamilies = useMemo(() => {
    if (!families) return [];
    
    return families.filter((family: ChemicalFamily) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          family.name.toLowerCase().includes(query) ||
          family.type?.toLowerCase().includes(query) ||
          family.description?.toLowerCase().includes(query) ||
          family.typicalNotes?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (selectedCategory) {
        const group = categoryGroups.find(g => g.label === selectedCategory);
        if (group && !group.types.includes(family.type)) return false;
      }
      
      return true;
    });
  }, [families, searchQuery, selectedCategory]);

  // Group by type for display
  const groupedFamilies = useMemo(() => {
    const groups: Record<string, ChemicalFamily[]> = {};
    
    filteredFamilies.forEach((family: ChemicalFamily) => {
      const groupLabel = categoryGroups.find(g => g.types.includes(family.type))?.label || "Autres";
      if (!groups[groupLabel]) groups[groupLabel] = [];
      groups[groupLabel].push(family);
    });
    
    return groups;
  }, [filteredFamilies]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une famille chimique..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Toutes
          </Button>
          {categoryGroups.slice(0, 5).map((group) => (
            <Button
              key={group.label}
              variant={selectedCategory === group.label ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === group.label ? null : group.label)}
            >
              {group.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredFamilies.length} famille{filteredFamilies.length !== 1 ? "s" : ""} chimique{filteredFamilies.length !== 1 ? "s" : ""}
      </div>

      {/* Grouped Families */}
      {Object.entries(groupedFamilies).map(([groupLabel, groupFamilies]) => (
        <div key={groupLabel} className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            {groupLabel}
            <Badge variant="secondary">{groupFamilies.length}</Badge>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupFamilies.map((family: ChemicalFamily) => (
              <Card key={family.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{family.name}</CardTitle>
                    <Badge className={typeColors[family.type] || typeColors.other}>
                      {family.moleculeCount}
                    </Badge>
                  </div>
                  {family.subcategory && (
                    <CardDescription>{family.subcategory}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {family.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {family.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {family.volatility && (
                      <Badge variant="outline" className="text-xs">
                        <Thermometer className="h-3 w-3 mr-1" />
                        {family.volatility}
                      </Badge>
                    )}
                    {family.polarity && (
                      <Badge variant="outline" className="text-xs">
                        <Droplets className="h-3 w-3 mr-1" />
                        {family.polarity}
                      </Badge>
                    )}
                  </div>
                  
                  {family.typicalNotes && (
                    <p className="text-xs text-muted-foreground">
                      <strong>Notes :</strong> {family.typicalNotes}
                    </p>
                  )}
                  
                  <Link href={`/molecules?chemicalFamily=${family.id}`}>
                    <Button variant="ghost" size="sm" className="w-full justify-between mt-2">
                      Voir les molécules
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {filteredFamilies.length === 0 && (
        <Card className="p-12 text-center">
          <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune famille trouvée</h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche
          </p>
          <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}>
            Réinitialiser
          </Button>
        </Card>
      )}
    </div>
  );
}

export default ChemicalFamiliesContent;
