// @ts-nocheck
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Leaf, Beaker, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function PlantMoleculeAudit() {
  const { data: auditStats, isLoading } = trpc.linkingCoverage.getPlantMoleculeAuditStats.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Chargement de l'audit...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Audit Plante ↔ Molécule</h1>
                  <p className="text-muted-foreground">
                    Analyse de la couverture des liaisons plante-molécule
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Statistiques globales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Plantes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-3xl font-bold">{auditStats?.totalPlants || 0}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Molécules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-3xl font-bold">{auditStats?.totalMolecules || 0}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Liaisons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-3xl font-bold">{auditStats?.totalRelations || 0}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Couverture Molécules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">{auditStats?.coverageMolecules || 0}%</span>
                      {(auditStats?.coverageMolecules || 0) >= 10 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <Progress value={(auditStats?.coverageMolecules || 0) * 10} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Objectif : 10%</p>
                  </CardContent>
                </Card>
              </div>

              {/* Plantes sans molécule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Plantes sans molécule ({auditStats?.plantsWithoutMolecule || 0})
                  </CardTitle>
                  <CardDescription>
                    Ces plantes n'ont pas encore de liaison avec des molécules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Famille</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditStats?.plantsWithoutMoleculeList?.map((plant: any) => (
                          <TableRow key={plant.id}>
                            <TableCell className="font-medium">{plant.name}</TableCell>
                            <TableCell><Badge variant="outline">{plant.category}</Badge></TableCell>
                            <TableCell className="text-muted-foreground">{plant.family || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Molécules sans plante */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5" />
                    Molécules sans plante ({auditStats?.moleculesWithoutPlant || 0})
                  </CardTitle>
                  <CardDescription>
                    Ces molécules n'ont pas encore de liaison avec des plantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Famille</TableHead>
                          <TableHead>Profil olfactif</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditStats?.moleculesWithoutPlantList?.map((molecule: any) => (
                          <TableRow key={molecule.id}>
                            <TableCell className="font-medium">{molecule.name}</TableCell>
                            <TableCell><Badge variant="outline">{molecule.family || '-'}</Badge></TableCell>
                            <TableCell className="text-muted-foreground truncate max-w-xs">{molecule.olfactiveProfile || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Top plantes par nombre de molécules */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Plantes par nombre de molécules</CardTitle>
                  <CardDescription>
                    Plantes avec le plus de liaisons molécule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plante</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead className="text-right">Molécules</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditStats?.topPlantsByMolecules?.map((plant: any) => (
                        <TableRow key={plant.id}>
                          <TableCell className="font-medium">{plant.name}</TableCell>
                          <TableCell><Badge variant="outline">{plant.category}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-primary">{plant.moleculeCount}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
