import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminDataAudit() {
  const [activeTab, setActiveTab] = useState("overview");

  // Récupérer les données d'audit
  const auditReport = trpc.audit.generateAuditReport.useQuery();
  const chemicalFormulas = trpc.audit.analyzeChemicalFormulas.useQuery();
  const molecularWeights = trpc.audit.analyzeMolecularWeights.useQuery();
  const orphanMolecules = trpc.audit.findOrphanMolecules.useQuery();
  const orphanPlants = trpc.audit.findOrphanPlants.useQuery();

  const isLoading =
    auditReport.isLoading ||
    chemicalFormulas.isLoading ||
    molecularWeights.isLoading ||
    orphanMolecules.isLoading ||
    orphanPlants.isLoading;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Audit de Données</h1>
        <p className="text-muted-foreground mt-2">
          Analyse complète de la qualité et de la couverture des données PERFUMUM
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="formulas">Formules</TabsTrigger>
          <TabsTrigger value="weights">Poids</TabsTrigger>
          <TabsTrigger value="orphans">Orphelines</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : auditReport.data ? (
            <>
              {/* Résumé principal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Molécules totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditReport.data.summary.totalMolecules}</div>
                    <p className="text-xs text-muted-foreground">Entrées uniques</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Plantes totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditReport.data.summary.totalPlants}</div>
                    <p className="text-xs text-muted-foreground">Espèces uniques</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Liaisons totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditReport.data.summary.totalLinks}</div>
                    <p className="text-xs text-muted-foreground">Plante-molécule</p>
                  </CardContent>
                </Card>
              </div>

              {/* Couverture */}
              <Card>
                <CardHeader>
                  <CardTitle>Couverture des données</CardTitle>
                  <CardDescription>Pourcentage de complétude par domaine</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Formules chimiques</span>
                      <span className="text-sm font-bold">
                        {auditReport.data.coverage.formulaCoverage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${auditReport.data.coverage.formulaCoverage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Poids moléculaires</span>
                      <span className="text-sm font-bold">
                        {auditReport.data.coverage.weightCoverage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${auditReport.data.coverage.weightCoverage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Liaisons plantes</span>
                      <span className="text-sm font-bold">
                        {auditReport.data.coverage.plantLinksCoverage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${auditReport.data.coverage.plantLinksCoverage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </TabsContent>

        {/* Analyse des formules */}
        <TabsContent value="formulas" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : chemicalFormulas.data ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avec formule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{chemicalFormulas.data.withFormula}</div>
                    <p className="text-xs text-muted-foreground">
                      {((chemicalFormulas.data.withFormula / chemicalFormulas.data.total) * 100).toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Sans formule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{chemicalFormulas.data.withoutFormula}</div>
                    <p className="text-xs text-muted-foreground">À compléter</p>
                  </CardContent>
                </Card>
              </div>

              {chemicalFormulas.data.duplicateFormulas.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {chemicalFormulas.data.duplicateFormulas.length} formules dupliquées identifiées
                  </AlertDescription>
                </Alert>
              )}

              {chemicalFormulas.data.invalidFormulas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Formules invalides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {chemicalFormulas.data.invalidFormulas.slice(0, 20).map((item, idx) => (
                        <div key={idx} className="text-sm p-2 bg-secondary rounded">
                          <span className="font-mono">{item.formula}</span>
                          <span className="text-muted-foreground ml-2">({item.moleculeName})</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </TabsContent>

        {/* Analyse des poids moléculaires */}
        <TabsContent value="weights" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : molecularWeights.data ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Poids min</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{molecularWeights.data.weightRange.min.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">g/mol</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Poids moy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{molecularWeights.data.weightRange.avg.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">g/mol</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Poids max</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{molecularWeights.data.weightRange.max.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">g/mol</p>
                  </CardContent>
                </Card>
              </div>

              {molecularWeights.data.anomalies.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Anomalies détectées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {molecularWeights.data.anomalies.slice(0, 20).map((item, idx) => (
                        <div key={idx} className="text-sm p-2 bg-secondary rounded">
                          <span className="font-medium">{item.moleculeName}</span>
                          <span className="text-muted-foreground ml-2">— {item.issue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </TabsContent>

        {/* Entités orphelines */}
        <TabsContent value="orphans" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <>
              {orphanMolecules.data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Molécules orphelines</CardTitle>
                    <CardDescription>Molécules sans plante source</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600 mb-4">
                      {orphanMolecules.data.total} molécules
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {orphanMolecules.data.orphans.map((mol, idx) => (
                        <div key={idx} className="text-sm p-2 bg-secondary rounded">
                          <span className="font-medium">{mol.name}</span>
                          {mol.chemicalFormula && (
                            <span className="text-muted-foreground ml-2">({mol.chemicalFormula})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {orphanPlants.data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Plantes orphelines</CardTitle>
                    <CardDescription>Plantes sans molécule associée</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600 mb-4">
                      {orphanPlants.data.total} plantes
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {orphanPlants.data.orphans.map((plant, idx) => (
                        <div key={idx} className="text-sm p-2 bg-secondary rounded">
                          <span className="font-medium">{plant.name}</span>
                          {plant.latinName && (
                            <span className="text-muted-foreground ml-2 italic">({plant.latinName})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Export */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export des données d'audit</CardTitle>
              <CardDescription>Télécharger les rapports d'audit complets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={() => {
                  // Générer un rapport JSON
                  const report = {
                    timestamp: new Date().toISOString(),
                    auditReport: auditReport.data,
                    chemicalFormulas: chemicalFormulas.data,
                    molecularWeights: molecularWeights.data,
                    orphanMolecules: orphanMolecules.data,
                    orphanPlants: orphanPlants.data,
                  };
                  const blob = new Blob([JSON.stringify(report, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `audit-report-${new Date().toISOString().split("T")[0]}.json`;
                  a.click();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Télécharger rapport JSON
              </button>

              <button
                onClick={() => {
                  // Générer un rapport CSV
                  let csv = "Type,Métrique,Valeur\n";
                  if (auditReport.data) {
                    csv += `Résumé,Molécules totales,${auditReport.data.summary.totalMolecules}\n`;
                    csv += `Résumé,Plantes totales,${auditReport.data.summary.totalPlants}\n`;
                    csv += `Résumé,Liaisons totales,${auditReport.data.summary.totalLinks}\n`;
                    csv += `Couverture,Formules chimiques,${auditReport.data.coverage.formulaCoverage.toFixed(1)}%\n`;
                    csv += `Couverture,Poids moléculaires,${auditReport.data.coverage.weightCoverage.toFixed(1)}%\n`;
                    csv += `Couverture,Liaisons plantes,${auditReport.data.coverage.plantLinksCoverage.toFixed(1)}%\n`;
                  }
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `audit-report-${new Date().toISOString().split("T")[0]}.csv`;
                  a.click();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Télécharger rapport CSV
              </button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
