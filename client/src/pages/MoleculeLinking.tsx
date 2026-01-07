import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Link2,
  Unlink,
  Search,
  Atom,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Beaker,
  Clock,
  MapPin,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

// Composant pour afficher un match potentiel
function PotentialMatchCard({
  match,
  onLink,
  isLinking,
}: {
  match: {
    molecule: {
      id: number;
      name: string;
      chemicalFormula: string | null;
      casNumber: string | null;
      family: string | null;
    };
    matchType: string;
    matchScore: number;
  };
  onLink: () => void;
  isLinking: boolean;
}) {
  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case "exact_name":
        return "Nom exact";
      case "partial_name":
        return "Nom partiel";
      case "formula":
        return "Formule";
      case "cas":
        return "Numéro CAS";
      default:
        return type;
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Atom className="h-4 w-4 text-primary" />
              <span className="font-medium">{match.molecule.name}</span>
              <Badge variant="outline" className="text-xs">
                {getMatchTypeLabel(match.matchType)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {match.molecule.chemicalFormula && (
                <span>Formule: {match.molecule.chemicalFormula}</span>
              )}
              {match.molecule.casNumber && (
                <span>CAS: {match.molecule.casNumber}</span>
              )}
              {match.molecule.family && (
                <Badge variant="secondary" className="text-xs">
                  {match.molecule.family}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className={`text-lg font-bold ${getMatchColor(match.matchScore)}`}>
                {match.matchScore}%
              </span>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
            <Button size="sm" onClick={onLink} disabled={isLinking}>
              <Link2 className="h-4 w-4 mr-1" />
              Lier
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour une molécule perdue
function LostMoleculeCard({
  molecule,
  onSelect,
  isSelected,
}: {
  molecule: {
    id: number;
    moleculeId: string;
    name: string;
    moleculeClass: string | null;
    formula: string | null;
    linkedMoleculeId: number | null;
  };
  onSelect: () => void;
  isSelected: boolean;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Beaker className="h-4 w-4 text-primary" />
              <span className="font-medium">{molecule.name}</span>
              {molecule.linkedMoleculeId ? (
                <Badge variant="default" className="text-xs bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Liée
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Non liée
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-mono text-xs">{molecule.moleculeId}</span>
              {molecule.formula && <span>Formule: {molecule.formula}</span>}
              {molecule.moleculeClass && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {molecule.moleculeClass}
                </Badge>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal
export default function MoleculeLinking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "linked" | "unlinked">("all");
  const [selectedMolecule, setSelectedMolecule] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("unlinked");

  const utils = trpc.useUtils();

  // Requêtes
  const { data: unlinkedMolecules, isLoading: isLoadingUnlinked } =
    trpc.lostMolecules.linking.getUnlinked.useQuery();
  const { data: linkedMolecules, isLoading: isLoadingLinked } =
    trpc.lostMolecules.linking.getLinked.useQuery();
  const { data: potentialMatches, isLoading: isLoadingMatches } =
    trpc.lostMolecules.linking.findPotentialMatches.useQuery(selectedMolecule!, {
      enabled: selectedMolecule !== null,
    });

  // Mutations
  const linkMutation = trpc.lostMolecules.linking.linkToMolecule.useMutation({
    onSuccess: () => {
      toast.success("Molécule liée avec succès");
      utils.lostMolecules.linking.getUnlinked.invalidate();
      utils.lostMolecules.linking.getLinked.invalidate();
      setSelectedMolecule(null);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const unlinkMutation = trpc.lostMolecules.linking.unlink.useMutation({
    onSuccess: () => {
      toast.success("Liaison supprimée");
      utils.lostMolecules.linking.getUnlinked.invalidate();
      utils.lostMolecules.linking.getLinked.invalidate();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Filtrage
  const filteredUnlinked = useMemo(() => {
    if (!unlinkedMolecules) return [];
    return unlinkedMolecules.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.moleculeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [unlinkedMolecules, searchTerm]);

  const filteredLinked = useMemo(() => {
    if (!linkedMolecules) return [];
    return linkedMolecules.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.moleculeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [linkedMolecules, searchTerm]);

  // Molécule sélectionnée
  const selectedMoleculeData = useMemo(() => {
    if (selectedMolecule === null) return null;
    return (
      unlinkedMolecules?.find((m) => m.id === selectedMolecule) ||
      linkedMolecules?.find((m) => m.id === selectedMolecule)
    );
  }, [selectedMolecule, unlinkedMolecules, linkedMolecules]);

  return (
    <div className="container py-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Link2 className="h-8 w-8 text-primary" />
            Liaison des Molécules Perdues
          </h1>
          <p className="text-muted-foreground mt-1">
            Connectez les molécules historiques aux molécules de la base principale
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/heritage-timeline">
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Timeline historique
            </Button>
          </Link>
          <Link href="/lost-molecules-graph">
            <Button variant="outline" size="sm">
              <Atom className="h-4 w-4 mr-2" />
              Graphe
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Non liées</CardDescription>
            <CardTitle className="text-2xl text-orange-500">
              {unlinkedMolecules?.length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Liées</CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {linkedMolecules?.length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-2xl">
              {(unlinkedMolecules?.length || 0) + (linkedMolecules?.length || 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taux de liaison</CardDescription>
            <CardTitle className="text-2xl">
              {Math.round(
                ((linkedMolecules?.length || 0) /
                  ((unlinkedMolecules?.length || 0) + (linkedMolecules?.length || 0) || 1)) *
                  100
              )}
              %
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une molécule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des molécules */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unlinked">
                Non liées ({filteredUnlinked.length})
              </TabsTrigger>
              <TabsTrigger value="linked">
                Liées ({filteredLinked.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unlinked" className="mt-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 pr-4">
                  {isLoadingUnlinked ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))
                  ) : filteredUnlinked.length > 0 ? (
                    filteredUnlinked.map((molecule) => (
                      <LostMoleculeCard
                        key={molecule.id}
                        molecule={molecule}
                        onSelect={() => setSelectedMolecule(molecule.id)}
                        isSelected={selectedMolecule === molecule.id}
                      />
                    ))
                  ) : (
                    <Card className="p-8 text-center">
                      <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                      <p className="text-muted-foreground">
                        Toutes les molécules sont liées !
                      </p>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="linked" className="mt-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 pr-4">
                  {isLoadingLinked ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))
                  ) : filteredLinked.length > 0 ? (
                    filteredLinked.map((molecule) => (
                      <Card key={molecule.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Beaker className="h-4 w-4 text-primary" />
                                <span className="font-medium">{molecule.name}</span>
                                <Badge variant="default" className="text-xs bg-green-500">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Liée
                                </Badge>
                              </div>
                              {molecule.linkedMolecule && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Link2 className="h-3 w-3" />
                                  <span>→ {molecule.linkedMolecule.name}</span>
                                  {molecule.linkedMolecule.chemicalFormula && (
                                    <span className="font-mono text-xs">
                                      ({molecule.linkedMolecule.chemicalFormula})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => unlinkMutation.mutate(molecule.id)}
                              disabled={unlinkMutation.isPending}
                            >
                              <Unlink className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Aucune molécule liée pour le moment.
                      </p>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel de correspondances */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Correspondances suggérées
              </CardTitle>
              <CardDescription>
                {selectedMoleculeData
                  ? `Pour: ${selectedMoleculeData.name}`
                  : "Sélectionnez une molécule pour voir les correspondances"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMolecule === null ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une molécule non liée dans la liste de gauche</p>
                </div>
              ) : isLoadingMatches ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : potentialMatches && potentialMatches.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 pr-4">
                    {potentialMatches.map((match) => (
                      <PotentialMatchCard
                        key={match.molecule.id}
                        match={match}
                        onLink={() =>
                          linkMutation.mutate({
                            lostMoleculeId: selectedMolecule,
                            moleculeId: match.molecule.id,
                          })
                        }
                        isLinking={linkMutation.isPending}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune correspondance trouvée automatiquement.</p>
                  <p className="text-sm mt-2">
                    Vous pouvez rechercher manuellement dans la base de données.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
