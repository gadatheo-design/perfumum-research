// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, Leaf, Search, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function MoleculeSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMolecule, setSelectedMolecule] = useState<number | null>(null);

  // Recherche de molécules
  const { data: searchResults, isLoading: isSearching } = trpc.molecules.searchByName.useQuery(
    { name: searchTerm },
    { enabled: searchTerm.length >= 2 }
  );

  // Récupérer les plantes pour la molécule sélectionnée
  const { data: plantResults, isLoading: isLoadingPlants } = trpc.molecules.getPlantsByMolecule.useQuery(
    { moleculeId: selectedMolecule! },
    { enabled: selectedMolecule !== null }
  );

  // Statistiques globales
  const { data: stats } = trpc.molecules.getGlobalStats.useQuery();

  return (
    <div className="container py-8 max-w-6xl">
      <Breadcrumbs />
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Beaker className="h-8 w-8 text-primary" />
          Recherche par Molécule
        </h1>
        <p className="text-muted-foreground">
          Trouvez toutes les plantes contenant une molécule spécifique
        </p>
        {stats && (
          <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>{stats.totalMolecules} molécules</span>
            <span>•</span>
            <span>{stats.totalPlants || 258} plantes</span>
            <span>•</span>
            <span>{stats.totalLinks || 956} liaisons</span>
          </div>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher une molécule (ex: linalol, géraniol, myrcène...)"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedMolecule(null);
          }}
          className="pl-10 h-12 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Résultats de recherche */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {searchTerm.length >= 2 
              ? `Molécules correspondantes (${searchResults?.length || 0})`
              : "Tapez au moins 2 caractères pour rechercher"
            }
          </h2>
          
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {searchResults && searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((molecule) => (
                <Card
                  key={molecule.id}
                  className={`cursor-pointer transition-all hover:border-primary ${
                    selectedMolecule === molecule.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedMolecule(molecule.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{molecule.name}</h3>
                        <div className="flex gap-2 mt-1">
                          {molecule.olfactiveFamily && (
                            <Badge variant="outline" className="text-xs">
                              {molecule.olfactiveFamily}
                            </Badge>
                          )}
                          {molecule.chemicalClass && (
                            <Badge variant="secondary" className="text-xs">
                              {molecule.chemicalClass}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {molecule.casNumber && (
                        <span className="text-xs text-muted-foreground font-mono">
                          CAS: {molecule.casNumber}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {searchResults && searchResults.length === 0 && searchTerm.length >= 2 && (
            <p className="text-muted-foreground text-center py-8">
              Aucune molécule trouvée pour "{searchTerm}"
            </p>
          )}
        </div>

        {/* Plantes contenant la molécule */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {selectedMolecule 
              ? `Plantes contenant cette molécule (${plantResults?.length || 0})`
              : "Sélectionnez une molécule"
            }
          </h2>

          {isLoadingPlants && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {plantResults && plantResults.length > 0 && (
            <div className="space-y-2">
              {plantResults.map((item) => (
                <Link key={item.plant.id} href={`/plants/${item.plant.id}`}>
                  <Card className="cursor-pointer transition-all hover:border-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Leaf className="h-5 w-5 text-green-600" />
                          <div>
                            <h3 className="font-medium">{item.plant.name}</h3>
                            {item.plant.latinName && (
                              <p className="text-sm text-muted-foreground italic">
                                {item.plant.latinName}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.isSignature === 1 && (
                            <Badge className="bg-amber-500 text-white">
                              Signature
                            </Badge>
                          )}
                          {item.percentageTypical && (
                            <Badge variant="outline">
                              {item.percentageTypical}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {plantResults && plantResults.length === 0 && selectedMolecule && (
            <p className="text-muted-foreground text-center py-8">
              Aucune plante associée à cette molécule
            </p>
          )}

          {!selectedMolecule && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Leaf className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Cliquez sur une molécule pour voir les plantes qui la contiennent</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
