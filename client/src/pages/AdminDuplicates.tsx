/**
 * Page d'administration pour la gestion des doublons
 * Permet de visualiser et fusionner les molécules et plantes dupliquées
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw,
  AlertTriangle,
  Database,
  Beaker,
  Leaf
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDuplicates() {
  const [activeTab, setActiveTab] = useState<"molecules" | "plants">("molecules");

  // Requêtes pour analyser les doublons
  const { 
    data: moleculeData, 
    isLoading: moleculeLoading, 
    refetch: refetchMolecules 
  } = trpc.duplicates.analyzeMolecules.useQuery();

  const { 
    data: plantData, 
    isLoading: plantLoading, 
    refetch: refetchPlants 
  } = trpc.duplicates.analyzePlants.useQuery();

  const handleRefresh = () => {
    if (activeTab === "molecules") {
      refetchMolecules();
    } else {
      refetchPlants();
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Doublons</h1>
          <p className="text-muted-foreground mt-2">
            Identifiez et fusionnez les entrées dupliquées dans la base de données
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques globales */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Molécules</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moleculeLoading ? <Skeleton className="h-8 w-20" /> : moleculeData?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {moleculeLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                `${moleculeData?.totalDuplicates || 0} doublons détectés`
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plantes</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plantLoading ? <Skeleton className="h-8 w-20" /> : plantData?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {plantLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                `${plantData?.totalDuplicates || 0} doublons détectés`
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualité des Données</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moleculeLoading || plantLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                `${(100 - parseFloat(moleculeData?.duplicationRate || "0")).toFixed(1)}%`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Taux de données uniques
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets Molécules / Plantes */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "molecules" | "plants")}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="molecules">
            Molécules
            {moleculeData && moleculeData.totalDuplicates > 0 && (
              <Badge variant="destructive" className="ml-2">
                {moleculeData.totalDuplicates}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="plants">
            Plantes
            {plantData && plantData.totalDuplicates > 0 && (
              <Badge variant="destructive" className="ml-2">
                {plantData.totalDuplicates}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Contenu Molécules */}
        <TabsContent value="molecules" className="space-y-4">
          {moleculeLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">Analyse en cours...</span>
                </div>
              </CardContent>
            </Card>
          ) : moleculeData && moleculeData.totalDuplicates === 0 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Aucun doublon détecté</AlertTitle>
              <AlertDescription>
                Toutes les molécules de la base de données sont uniques. Excellente qualité des données !
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Doublons par nom */}
              {moleculeData && moleculeData.nameDuplicates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      Doublons par Nom ({moleculeData.nameDuplicates.length})
                    </CardTitle>
                    <CardDescription>
                      Molécules ayant le même nom
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Occurrences</TableHead>
                          <TableHead>IDs</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {moleculeData.nameDuplicates.slice(0, 10).map((dup) => (
                          <TableRow key={dup.value}>
                            <TableCell className="font-medium">{dup.value}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{dup.count}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {dup.molecules.map(m => m.id).join(", ")}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Gérer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {moleculeData.nameDuplicates.length > 10 && (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Et {moleculeData.nameDuplicates.length - 10} autres groupes de doublons...
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Doublons par CAS */}
              {moleculeData && moleculeData.casDuplicates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      Doublons par CAS Number ({moleculeData.casDuplicates.length})
                    </CardTitle>
                    <CardDescription>
                      Molécules ayant le même numéro CAS
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>CAS Number</TableHead>
                          <TableHead>Occurrences</TableHead>
                          <TableHead>Noms</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {moleculeData.casDuplicates.slice(0, 10).map((dup) => (
                          <TableRow key={dup.value}>
                            <TableCell className="font-medium">{dup.value}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{dup.count}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {dup.molecules.map(m => m.nom).join(", ")}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Gérer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {moleculeData.casDuplicates.length > 10 && (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Et {moleculeData.casDuplicates.length - 10} autres groupes de doublons...
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Doublons par SMILES */}
              {moleculeData && moleculeData.smilesDuplicates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      Doublons par SMILES ({moleculeData.smilesDuplicates.length})
                    </CardTitle>
                    <CardDescription>
                      Molécules ayant la même structure chimique (SMILES)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SMILES</TableHead>
                          <TableHead>Occurrences</TableHead>
                          <TableHead>Noms</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {moleculeData.smilesDuplicates.slice(0, 10).map((dup) => (
                          <TableRow key={dup.value}>
                            <TableCell className="font-mono text-xs max-w-xs truncate">
                              {dup.value}
                            </TableCell>
                            <TableCell>
                              <Badge variant="destructive">{dup.count}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {dup.molecules.map(m => m.nom).join(", ")}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Gérer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {moleculeData.smilesDuplicates.length > 10 && (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Et {moleculeData.smilesDuplicates.length - 10} autres groupes de doublons...
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Contenu Plantes */}
        <TabsContent value="plants" className="space-y-4">
          {plantLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">Analyse en cours...</span>
                </div>
              </CardContent>
            </Card>
          ) : plantData && plantData.totalDuplicates === 0 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Aucun doublon détecté</AlertTitle>
              <AlertDescription>
                Toutes les plantes de la base de données sont uniques. Excellente qualité des données !
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Doublons par nom scientifique */}
              {plantData && plantData.scientificDuplicates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      Doublons par Nom Scientifique ({plantData.scientificDuplicates.length})
                    </CardTitle>
                    <CardDescription>
                      Plantes ayant le même nom scientifique (latin)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom Scientifique</TableHead>
                          <TableHead>Occurrences</TableHead>
                          <TableHead>Noms Communs</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {plantData.scientificDuplicates.slice(0, 10).map((dup) => (
                          <TableRow key={dup.value}>
                            <TableCell className="font-medium italic">{dup.value}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{dup.count}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {dup.plants.map(p => p.common_name || "N/A").join(", ")}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Gérer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {plantData.scientificDuplicates.length > 10 && (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Et {plantData.scientificDuplicates.length - 10} autres groupes de doublons...
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Doublons par nom commun */}
              {plantData && plantData.commonDuplicates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      Doublons par Nom Commun ({plantData.commonDuplicates.length})
                    </CardTitle>
                    <CardDescription>
                      Plantes ayant le même nom commun
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom Commun</TableHead>
                          <TableHead>Occurrences</TableHead>
                          <TableHead>Noms Scientifiques</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {plantData.commonDuplicates.slice(0, 10).map((dup) => (
                          <TableRow key={dup.value}>
                            <TableCell className="font-medium">{dup.value}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{dup.count}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground italic">
                              {dup.plants.map(p => p.scientific_name).join(", ")}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Gérer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {plantData.commonDuplicates.length > 10 && (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Et {plantData.commonDuplicates.length - 10} autres groupes de doublons...
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Avertissement */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>
          La fusion de doublons est une opération irréversible. Assurez-vous de créer une sauvegarde de la base de données avant toute modification.
        </AlertDescription>
      </Alert>
    </div>
  );
}
