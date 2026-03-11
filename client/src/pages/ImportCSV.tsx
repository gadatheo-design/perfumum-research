import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle, XCircle, Loader2, FileText, Leaf, Beaker } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
}

export default function ImportCSV() {
  const [moleculesFile, setMoleculesFile] = useState<File | null>(null);
  const [plantsFile, setPlantsFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const importMoleculesMutation = trpc.batchImport.importMolecules.useMutation();
  const importPlantsMutation = trpc.batchImport.importPlants.useMutation();

  const parseCSV = (text: string): string[][] => {
    const lines = text.split("\n").filter((line) => line.trim());
    return lines.map((line) => {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
  };

  const handleImportMolecules = async () => {
    if (!moleculesFile) return;

    setImporting(true);
    setResult(null);

    try {
      const text = await moleculesFile.text();
      const rows = parseCSV(text);
      const headers = rows[0];
      const data = rows.slice(1);

      const molecules = data.map((row) => ({
        name: row[0] || "",
        family: row[1] || "",
        odorKey: row[2] || "",
        role: row[3] || "",
        climaticAxis: row[4] || "",
      }));

      const result = await importMoleculesMutation.mutateAsync({ molecules });
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        errors: [`Erreur lors de l'importation: ${error}`],
      });
    } finally {
      setImporting(false);
    }
  };

  const handleImportPlants = async () => {
    if (!plantsFile) return;

    setImporting(true);
    setResult(null);

    try {
      const text = await plantsFile.text();
      const rows = parseCSV(text);
      const headers = rows[0];
      const data = rows.slice(1);

      const plants = data.map((row) => ({
        name: row[0] || "",
        latinName: row[1] || "",
        family: row[2] || "",
        category: row[3] || "",
        origin: row[4] || "",
        habitat: row[5] || "",
        olfactiveSignature: row[6] || "",
        dominantMolecules: row[7] || "",
        climaticAxis: row[8] || "",
        traditionalUse: row[9] || "",
        absorbeUse: row[10] || "",
        kingdom: row[11] || "",
        division: row[12] || "",
        class: row[13] || "",
        order: row[14] || "",
        genus: row[15] || "",
        species: row[16] || "",
        lifeCycle: row[17] || "",
        harvestPeriod: row[18] || "",
        essentialOilYield: row[19] || "",
        notes: row[20] || "",
      }));

      const result = await importPlantsMutation.mutateAsync({ plants });
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        errors: [`Erreur lors de l'importation: ${error}`],
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Importation CSV</h1>
        <p className="text-muted-foreground">
          Importez vos données de recherche depuis des fichiers CSV
        </p>
      </div>

      <Tabs defaultValue="molecules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="molecules" className="flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Molécules
          </TabsTrigger>
          <TabsTrigger value="plants" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Plantes
          </TabsTrigger>
        </TabsList>

        {/* Molecules Import */}
        <TabsContent value="molecules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Importer des molécules
              </CardTitle>
              <CardDescription>
                Format attendu: molecule_name, family, odor_key, role, climatic_axis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setMoleculesFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="molecules-file"
                />
                <label
                  htmlFor="molecules-file"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {moleculesFile
                      ? moleculesFile.name
                      : "Cliquez pour sélectionner un fichier CSV"}
                  </span>
                </label>
              </div>

              <Button
                onClick={handleImportMolecules}
                disabled={!moleculesFile || importing}
                className="w-full"
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importation en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer les molécules
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plants Import */}
        <TabsContent value="plants">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Importer des plantes
              </CardTitle>
              <CardDescription>
                Format attendu: name, latin_name, family, category, origin, habitat, olfactive_signature,
                dominant_molecules, climatic_axis, traditional_use, absorbe_use, kingdom, division, class,
                order_name, genus, species, life_cycle, harvest_period, essential_oil_yield, notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setPlantsFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="plants-file"
                />
                <label htmlFor="plants-file" className="cursor-pointer flex flex-col items-center gap-2">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {plantsFile ? plantsFile.name : "Cliquez pour sélectionner un fichier CSV"}
                  </span>
                </label>
              </div>

              <Button
                onClick={handleImportPlants}
                disabled={!plantsFile || importing}
                className="w-full"
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importation en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer les plantes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results */}
      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Résultat de l'importation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>{result.imported}</strong> entrées importées avec succès
              </AlertDescription>
            </Alert>

            {result.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Erreurs ({result.errors.length}):</h4>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {result.errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Format des fichiers CSV</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Les fichiers doivent être encodés en UTF-8</li>
              <li>La première ligne doit contenir les en-têtes de colonnes</li>
              <li>Les valeurs contenant des virgules doivent être entourées de guillemets</li>
              <li>Les entrées existantes (même nom) seront ignorées</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Axes climatiques acceptés</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>vent, bois, disparition</li>
              <li>Combinaisons: vent; bois, bois; disparition, vent; disparition</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Catégories de plantes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>aromatique, tabac, cannabis, resine, bois, fleur, racine, autre</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
