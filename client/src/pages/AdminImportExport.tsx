import { useState } from "react";
import { Database, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminImportExport() {
  const [exportingMolecules, setExportingMolecules] = useState(false);
  const [exportingRecettes, setExportingRecettes] = useState(false);
  const [exportingAccords, setExportingAccords] = useState(false);
  const [exportingFamilles, setExportingFamilles] = useState(false);
  const [exportingMatieres, setExportingMatieres] = useState(false);

  const handleExportMolecules = async () => {
    setExportingMolecules(true);
    try {
      const response = await fetch('/api/trpc/export.molecules');
      const data = await response.json();
      const csvData = data.result.data;

      if (!csvData) {
        throw new Error("No data received");
      }

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfumum_molecules_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Export CSV réussi : Molécules");
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setExportingMolecules(false);
    }
  };

  const handleExportRecettes = async () => {
    setExportingRecettes(true);
    try {
      const response = await fetch('/api/trpc/export.recettes');
      const data = await response.json();
      const csvData = data.result.data;

      if (!csvData) {
        throw new Error("No data received");
      }

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfumum_recettes_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Export CSV réussi : Recettes");
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setExportingRecettes(false);
    }
  };

  const handleExportAccords = async () => {
    setExportingAccords(true);
    try {
      const response = await fetch('/api/trpc/export.accords');
      const data = await response.json();
      const csvData = data.result.data;

      if (!csvData) {
        throw new Error("No data received");
      }

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfumum_accords_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Export CSV réussi : Accords");
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setExportingAccords(false);
    }
  };

  const handleExportFamilles = async () => {
    setExportingFamilles(true);
    try {
      const response = await fetch('/api/trpc/export.familles');
      const data = await response.json();
      const csvData = data.result.data;

      if (!csvData) {
        throw new Error("No data received");
      }

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfumum_familles_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Export CSV réussi : Familles");
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setExportingFamilles(false);
    }
  };

  const handleExportMatieres = async () => {
    setExportingMatieres(true);
    try {
      const response = await fetch('/api/trpc/export.matieres');
      const data = await response.json();
      const csvData = data.result.data;

      if (!csvData) {
        throw new Error("No data received");
      }

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfumum_matieres_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Export CSV réussi : Matières Premières");
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setExportingMatieres(false);
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
                  onClick={handleExportMolecules}
                  disabled={exportingMolecules}
                  variant="outline"
                  className="w-full"
                >
                  {exportingMolecules ? (
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
                  onClick={handleExportRecettes}
                  disabled={exportingRecettes}
                  variant="outline"
                  className="w-full"
                >
                  {exportingRecettes ? (
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
                  onClick={handleExportAccords}
                  disabled={exportingAccords}
                  variant="outline"
                  className="w-full"
                >
                  {exportingAccords ? (
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
                  onClick={handleExportFamilles}
                  disabled={exportingFamilles}
                  variant="outline"
                  className="w-full"
                >
                  {exportingFamilles ? (
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
                  onClick={handleExportMatieres}
                  disabled={exportingMatieres}
                  variant="outline"
                  className="w-full"
                >
                  {exportingMatieres ? (
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

        {/* Note d'information */}
        <div className="p-6 bg-muted/50 rounded-lg border">
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
