import { useState } from "react";
import { Database, Download, Upload, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type EntityType = "molecules" | "recettes" | "accords" | "familles" | "matieres";

const entityLabels: Record<EntityType, string> = {
  molecules: "Molécules",
  recettes: "Recettes",
  accords: "Accords",
  familles: "Familles",
  matieres: "Matières Premières",
};

export default function AdminImportExport() {
  const [exportingEntity, setExportingEntity] = useState<EntityType | null>(null);

  // Export queries
  const exportMolecules = trpc.export.molecules.useQuery(undefined, { enabled: false });
  const exportRecettes = trpc.export.recettes.useQuery(undefined, { enabled: false });
  const exportAccords = trpc.export.accords.useQuery(undefined, { enabled: false });
  const exportFamilles = trpc.export.familles.useQuery(undefined, { enabled: false });
  const exportMatieres = trpc.export.matieres.useQuery(undefined, { enabled: false });

  const handleExport = async (entityType: EntityType) => {
    setExportingEntity(entityType);
    try {
      let result;
      switch (entityType) {
        case "molecules":
          result = await exportMolecules.refetch();
          break;
        case "recettes":
          result = await exportRecettes.refetch();
          break;
        case "accords":
          result = await exportAccords.refetch();
          break;
        case "familles":
          result = await exportFamilles.refetch();
          break;
        case "matieres":
          result = await exportMatieres.refetch();
          break;
      }

      const csvData = result.data;
      if (!csvData) {
        throw new Error("No data received from server");
      }

      // Create blob and download
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfumum_${entityType}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Export CSV réussi : ${entityLabels[entityType]}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setExportingEntity(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-emerald-600" />
            <div>
              <h1 className="text-2xl font-bold">Import / Export CSV</h1>
              <p className="text-sm text-muted-foreground">
                Gérez vos données de recherche au format CSV
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Section Export */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold">Exporter les données</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Exportez vos données de recherche au format CSV pour les sauvegarder, les analyser ou les partager.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="text-lg">Molécules</CardTitle>
                <CardDescription>
                  Exporter le catalogue complet des molécules olfactives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport("molecules")}
                  disabled={exportingEntity === "molecules"}
                  variant="outline"
                  className="w-full"
                >
                  {exportingEntity === "molecules" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Exporter Molécules
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg">Recettes</CardTitle>
                <CardDescription>
                  Exporter toutes les formulations complètes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport("recettes")}
                  disabled={exportingEntity === "recettes"}
                  variant="outline"
                  className="w-full"
                >
                  {exportingEntity === "recettes" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Exporter Recettes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-lg">Accords</CardTitle>
                <CardDescription>
                  Exporter les accords olfactifs créés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport("accords")}
                  disabled={exportingEntity === "accords"}
                  variant="outline"
                  className="w-full"
                >
                  {exportingEntity === "accords" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Exporter Accords
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="text-lg">Familles</CardTitle>
                <CardDescription>
                  Exporter les familles olfactives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport("familles")}
                  disabled={exportingEntity === "familles"}
                  variant="outline"
                  className="w-full"
                >
                  {exportingEntity === "familles" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Exporter Familles
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-lg">Matières Premières</CardTitle>
                <CardDescription>
                  Exporter l'inventaire complet du laboratoire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport("matieres")}
                  disabled={exportingEntity === "matieres"}
                  variant="outline"
                  className="w-full"
                >
                  {exportingEntity === "matieres" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Exporter Matières
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section Import */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Importer les données</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Fonctionnalité d'import CSV en cours de développement.
          </p>
          
          <div className="p-6 bg-muted/50 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              L'import CSV sera disponible dans une prochaine version. Pour le moment, vous pouvez exporter vos données pour les sauvegarder.
            </p>
          </div>
        </section>

        {/* Note d'information */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold mb-2">ℹ️ Format CSV</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Les fichiers CSV utilisent la virgule (,) comme séparateur et incluent une ligne d'en-tête avec les noms des colonnes.
          </p>
          <p className="text-sm text-muted-foreground">
            Pour connaître le format exact, exportez quelques entrées existantes pour voir la structure.
          </p>
        </div>
      </main>
    </div>
  );
}
