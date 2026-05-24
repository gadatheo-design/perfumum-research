// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  ArrowLeft,
  Atom,
  Leaf,
  ArrowRight,
  Percent,
  FlaskConical,
  Sparkles,
  Network
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Variability badge configuration
const variabilityConfig: Record<string, { label: string; color: string }> = {
  stable: { label: "Stable", color: "bg-green-500/20 text-green-400" },
  variable: { label: "Variable", color: "bg-yellow-500/20 text-yellow-400" },
  tres_variable: { label: "Très variable", color: "bg-orange-500/20 text-orange-400" },
  chemotype_dependant: { label: "Dépend du chémotype", color: "bg-purple-500/20 text-purple-400" },
};

function VariabilityBadge({ variability }: { variability: string | null }) {
  if (!variability) return null;
  const config = variabilityConfig[variability] || { label: variability, color: "bg-gray-500/20 text-gray-400" };
  return (
    <Badge variant="secondary" className={config.color}>
      {config.label}
    </Badge>
  );
}

// Relation Card Component
function RelationCard({ relation, type }: { relation: any; type: 'molecule' | 'plant' }) {
  const isMolecule = type === 'molecule';
  const entity = isMolecule ? relation.molecule : relation.plant;
  const linkPath = isMolecule ? `/molecules/${entity.id}` : `/plantes/${entity.id}`;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`p-3 rounded-lg ${isMolecule ? 'bg-violet-500/20' : 'bg-green-500/20'}`}>
            {isMolecule ? (
              <Atom className="w-5 h-5 text-violet-400" />
            ) : (
              <Leaf className="w-5 h-5 text-green-400" />
            )}
          </div>

          {/* Entity Info */}
          <div className="flex-1">
            <Link href={linkPath}>
              <span className="font-medium hover:text-primary transition-colors cursor-pointer">
                {entity.name}
              </span>
            </Link>
            {isMolecule && entity.chemicalFormula && (
              <p className="text-sm text-muted-foreground">{entity.chemicalFormula}</p>
            )}
            {!isMolecule && entity.latinName && (
              <p className="text-sm text-muted-foreground italic">{entity.latinName}</p>
            )}
          </div>

          {/* Relation Details */}
          <div className="flex flex-col items-end gap-1">
            {relation.percentageInOil && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Percent className="w-3 h-3" />
                {relation.percentageInOil}% (HE)
              </Badge>
            )}
            {relation.percentageInPlant && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                {relation.percentageInPlant}% (plante)
              </Badge>
            )}
            {relation.isMainSource === 1 && (
              <Badge className="bg-amber-500/20 text-amber-400">
                Source principale
              </Badge>
            )}
            <VariabilityBadge variability={relation.variability} />
          </div>
        </div>

        {/* Additional Info */}
        {(relation.plantPart || relation.bestExtractionMethod) && (
          <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {relation.plantPart && (
              <span className="flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                {relation.plantPart}
              </span>
            )}
            {relation.bestExtractionMethod && (
              <span className="flex items-center gap-1">
                <FlaskConical className="w-3 h-3" />
                {relation.bestExtractionMethod}
              </span>
            )}
            {relation.extractionYield && (
              <span>Rendement: {relation.extractionYield}%</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Search Results Component
function SearchResults({ searchTerm }: { searchTerm: string }) {
  const { data: moleculeResults, isLoading: loadingMolecules } = trpc.advancedSearch.moleculesByPlant.useQuery(
    searchTerm,
    { enabled: searchTerm.length >= 2 }
  );

  const { data: rawMaterialResults, isLoading: loadingRawMaterials } = trpc.advancedSearch.rawMaterialsByMolecule.useQuery(
    searchTerm,
    { enabled: searchTerm.length >= 2 }
  );

  const isLoading = loadingMolecules || loadingRawMaterials;

  if (searchTerm.length < 2) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Entrez au moins 2 caractères pour rechercher</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasMoleculeResults = moleculeResults && moleculeResults?.length > 0;
  const hasRawMaterialResults = rawMaterialResults && rawMaterialResults?.length > 0;

  if (!hasMoleculeResults && !hasRawMaterialResults) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Aucun résultat trouvé pour "{searchTerm}"</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Molecules from Plants */}
      {hasMoleculeResults && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Atom className="w-5 h-5 text-violet-400" />
            Molécules trouvées dans les plantes contenant "{searchTerm}"
          </h3>
          <div className="space-y-3">
            {moleculeResults?.map((result: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Link href={`/plantes/${result.plant.id}`}>
                      <span className="font-medium text-green-400 hover:underline cursor-pointer">
                        {result.plant.name}
                      </span>
                    </Link>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <Link href={`/molecules/${result.molecule.id}`}>
                      <span className="font-medium text-violet-400 hover:underline cursor-pointer">
                        {result.molecule.name}
                      </span>
                    </Link>
                  </div>
                  {result.percentageInOil && (
                    <Badge variant="outline">
                      {result.percentageInOil}%
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Raw Materials containing Molecules */}
      {hasRawMaterialResults && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            Matières premières contenant des molécules "{searchTerm}"
          </h3>
          <div className="space-y-3">
            {rawMaterialResults?.map((result: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Link href={`/molecules/${result.molecule.id}`}>
                      <span className="font-medium text-violet-400 hover:underline cursor-pointer">
                        {result.molecule.name}
                      </span>
                    </Link>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <Link href={`/matieres-premieres/${result.rawMaterial.id}`}>
                      <span className="font-medium text-emerald-400 hover:underline cursor-pointer">
                        {result.rawMaterial.name}
                      </span>
                    </Link>
                  </div>
                  {result.percentage && (
                    <Badge variant="outline">
                      {result.percentage}%
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MoleculePlantRelations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<number | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);

  const { data: contentStats } = trpc.contentStats?.getAll.useQuery();

  // Fetch relations when an entity is selected
  const { data: moleculeSources } = trpc.moleculePlantSources.getByMolecule.useQuery(
    selectedMoleculeId!,
    { enabled: selectedMoleculeId !== null }
  );

  const { data: plantMolecules } = trpc.moleculePlantSources.getByPlant.useQuery(
    selectedPlantId!,
    { enabled: selectedPlantId !== null }
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/recherche">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour à la recherche
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Network className="w-10 h-10 text-primary" />
            Relations Molécule-Plante
          </h1>
          <p className="text-muted-foreground text-lg">
            Explorez les connexions entre molécules aromatiques et leurs sources botaniques.
          </p>
          {contentStats && (
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <span>{contentStats?.moleculePlantLinks || 0} liaisons documentées</span>
              <span>•</span>
              <span>{contentStats?.molecules || 0} molécules</span>
              <span>•</span>
              <span>{contentStats?.plants || 0} plantes</span>
            </div>
          )}
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Recherche de relations
            </CardTitle>
            <CardDescription>
              Recherchez par nom de plante ou de molécule pour découvrir les connexions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Ex: lavande, linalol, menthe, limonène..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchTerm && (
          <SearchResults searchTerm={searchTerm} />
        )}

        {/* Info Cards when no search */}
        {!searchTerm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Atom className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="font-semibold mb-2">Molécules</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Découvrez les sources botaniques de chaque molécule aromatique.
              </p>
              <Link href="/molecules">
                <Button variant="outline" className="w-full">
                  Explorer les molécules
                </Button>
              </Link>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Plantes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Explorez la composition moléculaire de chaque plante aromatique.
              </p>
              <Link href="/plantes">
                <Button variant="outline" className="w-full">
                  Explorer les plantes
                </Button>
              </Link>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <FlaskConical className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="font-semibold mb-2">Matières Premières</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Consultez les matières premières et leurs compositions.
              </p>
              <Link href="/matieres-premieres">
                <Button variant="outline" className="w-full">
                  Explorer les matières
                </Button>
              </Link>
            </Card>
          </div>
        )}

        {/* Quick Stats */}
        {!searchTerm && contentStats && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Statistiques du contenu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-primary">{contentStats?.molecules || 0}</p>
                  <p className="text-sm text-muted-foreground">Molécules</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-green-400">{contentStats?.plants || 0}</p>
                  <p className="text-sm text-muted-foreground">Plantes</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-emerald-400">{contentStats?.rawMaterials || 0}</p>
                  <p className="text-sm text-muted-foreground">Matières premières</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold text-amber-400">{contentStats?.terroirs || 0}</p>
                  <p className="text-sm text-muted-foreground">Terroirs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
