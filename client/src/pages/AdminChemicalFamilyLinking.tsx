// @ts-nocheck
import { useState, useMemo } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { 
  Search, 
  Link2, 
  Unlink, 
  Beaker, 
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";

export default function AdminChemicalFamilyLinking() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchMolecule, setSearchMolecule] = useState("");
  const [searchFamily, setSearchFamily] = useState("");
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<number | null>(null);
  const [filterLinked, setFilterLinked] = useState<"all" | "linked" | "unlinked">("all");
  const [expandedFamilies, setExpandedFamilies] = useState<Set<number>>(new Set());

  // Queries
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: chemicalFamilies, isLoading: loadingFamilies, refetch: refetchFamilies } = 
    trpc.chemicalFamilies.listWithCount.useQuery();
  const { data: moleculeFamilies, refetch: refetchMoleculeFamilies } = 
    trpc.chemicalFamilies.getForMolecule.useQuery(
      { moleculeId: selectedMoleculeId! },
      { enabled: !!selectedMoleculeId }
    );

  // Mutations
  const linkMutation = trpc.chemicalFamilies.linkMolecule.useMutation({
    onSuccess: () => {
      showToast("Liaison créée avec succès");
      refetchFamilies();
      refetchMoleculeFamilies();
    },
    onError: (error) => showToast(`Erreur: ${error.message}`),
  });

  const unlinkMutation = trpc.chemicalFamilies.unlinkMolecule.useMutation({
    onSuccess: () => {
      showToast("Liaison supprimée");
      refetchFamilies();
      refetchMoleculeFamilies();
    },
    onError: (error) => showToast(`Erreur: ${error.message}`),
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter molecules
  const filteredMolecules = useMemo(() => {
    if (!molecules) return [];
    return molecules.filter((m) =>
      m.name?.toLowerCase().includes(searchMolecule.toLowerCase()) ||
      m.iupacName?.toLowerCase().includes(searchMolecule.toLowerCase())
    );
  }, [molecules, searchMolecule]);

  // Filter families
  const filteredFamilies = useMemo(() => {
    if (!chemicalFamilies) return [];
    let filtered = chemicalFamilies.filter((f) =>
      f.name?.toLowerCase().includes(searchFamily.toLowerCase()) ||
      f.type?.toLowerCase().includes(searchFamily.toLowerCase())
    );
    
    if (filterLinked === "linked") {
      filtered = filtered.filter(f => (f.moleculeCount || 0) > 0);
    } else if (filterLinked === "unlinked") {
      filtered = filtered.filter(f => (f.moleculeCount || 0) === 0);
    }
    
    return filtered;
  }, [chemicalFamilies, searchFamily, filterLinked]);

  // Check if molecule is linked to family
  const isMoleculeLinkedToFamily = (familyId: number) => {
    return moleculeFamilies?.some(f => f.id === familyId) || false;
  };

  // Toggle family expansion
  const toggleFamilyExpansion = (familyId: number) => {
    setExpandedFamilies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(familyId)) {
        newSet.delete(familyId);
      } else {
        newSet.add(familyId);
      }
      return newSet;
    });
  };

  // Handle link/unlink
  const handleToggleLink = (familyId: number) => {
    if (!selectedMoleculeId) return;
    
    if (isMoleculeLinkedToFamily(familyId)) {
      unlinkMutation.mutate({ moleculeId: selectedMoleculeId, chemicalFamilyId: familyId });
    } else {
      linkMutation.mutate({ moleculeId: selectedMoleculeId, chemicalFamilyId: familyId });
    }
  };

  // Stats
  const stats = useMemo(() => {
    if (!chemicalFamilies || !molecules) return { totalFamilies: 0, linkedFamilies: 0, totalMolecules: 0 };
    const linkedFamilies = chemicalFamilies.filter(f => (f.moleculeCount || 0) > 0).length;
    return {
      totalFamilies: chemicalFamilies.length,
      linkedFamilies,
      totalMolecules: molecules.length,
    };
  }, [chemicalFamilies, molecules]);

  const selectedMolecule = molecules?.find(m => m.id === selectedMoleculeId);

  if (loadingMolecules || loadingFamilies) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Breadcrumbs />
      
      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 animate-fadeInUp">
          <p className="text-sm">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Liaison Molécules ↔ Familles Chimiques</h1>
        <p className="text-muted-foreground">
          Associez les molécules aux familles chimiques pour enrichir la classification
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <FlaskConical className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalFamilies}</p>
                <p className="text-sm text-muted-foreground">Familles chimiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <Link2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.linkedFamilies}</p>
                <p className="text-sm text-muted-foreground">Familles avec liaisons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Beaker className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalMolecules}</p>
                <p className="text-sm text-muted-foreground">Molécules totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Molecule Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              Sélectionner une molécule
            </CardTitle>
            <CardDescription>
              Choisissez une molécule pour gérer ses liaisons
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une molécule..."
                value={searchMolecule}
                onChange={(e) => setSearchMolecule(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Molecule Info */}
            {selectedMolecule && (
              <div className="mb-4 p-4 border border-primary/50 rounded-lg bg-primary/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{selectedMolecule.name}</p>
                    {selectedMolecule.chemicalFormula && (
                      <p className="text-sm text-muted-foreground font-mono">
                        {selectedMolecule.chemicalFormula}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {moleculeFamilies?.length || 0} famille(s)
                  </Badge>
                </div>
                {moleculeFamilies && moleculeFamilies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {moleculeFamilies.map(f => (
                      <Badge key={f.id} variant="outline" className="text-xs">
                        {f.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Molecule List */}
            <div className="max-h-[400px] overflow-y-auto space-y-1">
              {filteredMolecules.slice(0, 100).map((molecule) => (
                <button
                  key={molecule.id}
                  onClick={() => setSelectedMoleculeId(molecule.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedMoleculeId === molecule.id
                      ? "bg-primary/10 border border-primary/50"
                      : "hover:bg-accent/50 border border-transparent"
                  }`}
                >
                  <p className="font-medium truncate">{molecule.name}</p>
                  {molecule.chemicalClass && (
                    <p className="text-xs text-muted-foreground">
                      {molecule.chemicalClass}
                    </p>
                  )}
                </button>
              ))}
              {filteredMolecules.length > 100 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  +{filteredMolecules.length - 100} autres molécules...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Chemical Families */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Familles chimiques
            </CardTitle>
            <CardDescription>
              {selectedMoleculeId 
                ? "Cliquez pour lier/délier la molécule sélectionnée"
                : "Sélectionnez d'abord une molécule"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une famille..."
                  value={searchFamily}
                  onChange={(e) => setSearchFamily(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterLinked} onValueChange={(v) => setFilterLinked(v as any)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="linked">Avec liaisons</SelectItem>
                  <SelectItem value="unlinked">Sans liaison</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Family List */}
            <div className="max-h-[500px] overflow-y-auto space-y-2">
              {filteredFamilies.map((family) => {
                const isLinked = isMoleculeLinkedToFamily(family.id);
                const isExpanded = expandedFamilies.has(family.id);
                
                return (
                  <Collapsible
                    key={family.id}
                    open={isExpanded}
                    onOpenChange={() => toggleFamilyExpansion(family.id)}
                  >
                    <div className={`border rounded-lg transition-colors ${
                      isLinked ? "border-green-500/50 bg-green-500/5" : "border-border"
                    }`}>
                      <div className="flex items-center justify-between p-3">
                        <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium">{family.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {family.type} • {family.moleculeCount || 0} molécule(s)
                            </p>
                          </div>
                        </CollapsibleTrigger>
                        
                        <Button
                          variant={isLinked ? "destructive" : "default"}
                          size="sm"
                          disabled={!selectedMoleculeId || linkMutation.isPending || unlinkMutation.isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLink(family.id);
                          }}
                          className="ml-2"
                        >
                          {isLinked ? (
                            <>
                              <Unlink className="h-4 w-4 mr-1" />
                              Délier
                            </>
                          ) : (
                            <>
                              <Link2 className="h-4 w-4 mr-1" />
                              Lier
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <CollapsibleContent>
                        <div className="px-3 pb-3 pt-0 border-t border-border/50">
                          {family.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {family.description}
                            </p>
                          )}
                          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                            {family.olfactiveRole && (
                              <div>
                                <span className="text-muted-foreground">Rôle olfactif:</span>
                                <p>{family.olfactiveRole}</p>
                              </div>
                            )}
                            {family.volatility && (
                              <div>
                                <span className="text-muted-foreground">Volatilité:</span>
                                <p>{family.volatility}</p>
                              </div>
                            )}
                            {family.typicalNotes && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Notes typiques:</span>
                                <p>{family.typicalNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
