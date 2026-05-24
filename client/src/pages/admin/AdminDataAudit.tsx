import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";

export default function AdminDataAudit() {
  const [activeTab, setActiveTab] = useState("overview");

  // Use only existing procedures from the audit router
  const dataStats = trpc.audit.getDataStats.useQuery();
  const coverageStats = trpc.audit.getCoverageStats.useQuery();
  const orphanMolecules = trpc.audit.getOrphanMolecules.useQuery();
  const orphanPlants = trpc.audit.getOrphanPlants.useQuery();
  const moleculesWithoutFormula = trpc.audit.getMoleculesWithoutFormula.useQuery();

  const isLoading =
    dataStats.isLoading ||
    coverageStats.isLoading ||
    orphanMolecules.isLoading ||
    orphanPlants.isLoading ||
    moleculesWithoutFormula.isLoading;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Audit de Données</h1>
        <p className="text-muted-foreground mt-2">
          Analyse complète de la qualité et de la couverture des données PERFUMUM
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="formulas">Formules</TabsTrigger>
          <TabsTrigger value="orphans">Orphelines</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <>
              {/* Résumé principal */}
              {dataStats.data && dataStats.data.success && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Molécules totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {"molecules" in dataStats.data ? dataStats.data.molecules : 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Entrées uniques</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Plantes totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {"plants" in dataStats.data ? dataStats.data.plants : 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Espèces uniques</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Liaisons totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {"plantMoleculeLinks" in dataStats.data ? dataStats.data.plantMoleculeLinks : 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Plante-molécule</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Couverture */}
              {coverageStats.data && coverageStats.data.success && "molecules" in coverageStats.data && (
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
                          {coverageStats.data.molecules?.coverage ?? 0}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${coverageStats.data.molecules?.coverage ?? 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Liaisons plantes</span>
                        <span className="text-sm font-bold">
                          {coverageStats.data.plants?.coverage ?? 0}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${coverageStats.data.plants?.coverage ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Analyse des formules */}
        <TabsContent value="formulas" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : moleculesWithoutFormula.data && moleculesWithoutFormula.data.success && "count" in moleculesWithoutFormula.data ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Sans formule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {moleculesWithoutFormula.data.count}
                    </div>
                    <p className="text-xs text-muted-foreground">À compléter</p>
                  </CardContent>
                </Card>
              </div>

              {(moleculesWithoutFormula.data.molecules?.length ?? 0) > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Molécules sans formule (max 100)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {(moleculesWithoutFormula.data.molecules ?? []).slice(0, 50).map((item: { id: number; name: string }, idx: number) => (
                        <div key={idx} className="text-sm p-2 bg-secondary rounded">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground ml-2">(id: {item.id})</span>
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
              {orphanMolecules.data && orphanMolecules.data.success && "count" in orphanMolecules.data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Molécules orphelines</CardTitle>
                    <CardDescription>Molécules sans plante source</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600 mb-4">
                      {orphanMolecules.data.count} molécules
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {(orphanMolecules.data.molecules ?? []).slice(0, 50).map((mol: { id: number; name: string }, idx: number) => (
                        <div key={idx} className="text-sm p-2 bg-secondary rounded">
                          <span className="font-medium">{mol.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {orphanPlants.data && orphanPlants.data.success && "count" in orphanPlants.data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Plantes orphelines</CardTitle>
                    <CardDescription>Plantes sans molécule associée</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600 mb-4">
                      {orphanPlants.data.count} plantes
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {(orphanPlants.data.plants ?? []).slice(0, 50).map((plant: { id: number; name: string }, idx: number) => (
                        <div key={idx} className="text-sm p-2 bg-secondary rounded">
                          <span className="font-medium">{plant.name}</span>
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
                  const report = {
                    timestamp: new Date().toISOString(),
                    dataStats: dataStats.data,
                    coverageStats: coverageStats.data,
                    orphanMolecules: orphanMolecules.data,
                    orphanPlants: orphanPlants.data,
                    moleculesWithoutFormula: moleculesWithoutFormula.data,
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
