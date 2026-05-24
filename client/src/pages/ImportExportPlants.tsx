import { useState, useRef } from "react";
import { safeJsonParse } from "@/lib/utils";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Upload, Download, FileSpreadsheet, FileJson, FileText, 
  CheckCircle2, AlertCircle, Loader2, ArrowRight, Leaf,
  Database, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ImportExportPlants() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importData, setImportData] = useState<string>("");
  const [importFormat, setImportFormat] = useState<string>("csv");
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);

  const { data: plants } = trpc.plants?.list.useQuery();
  const { data: plantVarieties } = trpc.plantVarieties?.getAll.useQuery();

  // Générer le template CSV
  const generateCSVTemplate = () => {
    const headers = [
      "name",
      "latin_name",
      "family",
      "category",
      "origin",
      "habitat",
      "olfactive_signature",
      "dominant_molecules",
      "climatic_axis",
      "traditional_use",
      "absorbe_use",
      "kingdom",
      "division",
      "class",
      "order_name",
      "genus",
      "species",
      "life_cycle",
      "harvest_period",
      "essential_oil_yield",
      "notes"
    ];
    
    const exampleRow = [
      "Lavande fine",
      "Lavandula angustifolia",
      "Lamiaceae",
      "aromatique",
      "Provence, France",
      "Zones méditerranéennes, sols calcaires",
      "Florale, herbacée, légèrement camphrée",
      "Linalol, Acétate de linalyle",
      "vent",
      "Aromathérapie, parfumerie",
      "Axe Vent - fraîcheur structurée",
      "Plantae",
      "Magnoliophyta",
      "Magnoliopsida",
      "Lamiales",
      "Lavandula",
      "angustifolia",
      "perennial",
      "Juin-Août",
      "1.5-3%",
      "Variété AOC Haute-Provence"
    ];

    return headers.join(",") + "\n" + exampleRow.join(",");
  };

  // Générer le template JSON
  const generateJSONTemplate = () => {
    return JSON.stringify([
      {
        name: "Lavande fine",
        latinName: "Lavandula angustifolia",
        family: "Lamiaceae",
        category: "aromatique",
        origin: "Provence, France",
        habitat: "Zones méditerranéennes, sols calcaires",
        olfactiveSignature: "Florale, herbacée, légèrement camphrée",
        dominantMolecules: ["Linalol", "Acétate de linalyle"],
        climaticAxis: "vent",
        traditionalUse: "Aromathérapie, parfumerie",
        absorbeUse: "Axe Vent - fraîcheur structurée",
        taxonomy: {
          kingdom: "Plantae",
          division: "Magnoliophyta",
          class: "Magnoliopsida",
          order: "Lamiales",
          genus: "Lavandula",
          species: "angustifolia"
        },
        lifeCycle: "perennial",
        harvestPeriod: "Juin-Août",
        essentialOilYield: "1.5-3%",
        notes: "Variété AOC Haute-Provence"
      }
    ], null, 2);
  };

  // Télécharger le template
  const downloadTemplate = (format: string) => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "csv") {
      content = generateCSVTemplate();
      filename = "perfumum_plants_template.csv";
      mimeType = "text/csv";
    } else {
      content = generateJSONTemplate();
      filename = "perfumum_plants_template.json";
      mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Template téléchargé",
      description: `Le fichier ${filename} a été téléchargé.`,
    });
  };

  // Exporter les données
  const exportData = async () => {
    if (!plants || plants?.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Il n'y a pas de plantes à exporter.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (exportFormat === "csv") {
        // Générer CSV
        const headers = [
          "id", "name", "latin_name", "family", "category", "origin",
          "habitat", "olfactive_signature", "dominant_molecules", "climatic_axis",
          "traditional_use", "absorbe_use", "notes", "created_at"
        ];
        
        const rows = plants?.map((plant: any) => [
          plant.id,
          `"${(plant.name || "").replace(/"/g, '""')}"`,
          `"${(plant.latinName || "").replace(/"/g, '""')}"`,
          `"${(plant.family || "").replace(/"/g, '""')}"`,
          plant.category || "",
          `"${(plant.origin || "").replace(/"/g, '""')}"`,
          `"${(plant.habitat || "").replace(/"/g, '""')}"`,
          `"${(plant.olfactiveSignature || "").replace(/"/g, '""')}"`,
          `"${(plant.dominantMolecules || "").replace(/"/g, '""')}"`,
          plant.climaticAxis || "",
          `"${(plant.traditionalUse || "").replace(/"/g, '""')}"`,
          `"${(plant.absorbeUse || "").replace(/"/g, '""')}"`,
          `"${(plant.notes || "").replace(/"/g, '""')}"`,
          plant.createdAt || ""
        ].join(","));

        content = headers.join(",") + "\n" + rows.join("\n");
        filename = `perfumum_plants_export_${new Date().toISOString().split("T")[0]}.csv`;
        mimeType = "text/csv";
      } else {
        // Générer JSON
        content = JSON.stringify(plants, null, 2);
        filename = `perfumum_plants_export_${new Date().toISOString().split("T")[0]}.json`;
        mimeType = "application/json";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: `${plants?.length} plantes exportées vers ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Gérer le fichier uploadé
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
      
      // Détecter le format
      if (file.name.endsWith(".json")) {
        setImportFormat("json");
      } else if (file.name.endsWith(".csv")) {
        setImportFormat("csv");
      }
    };
    reader.readAsText(file);
  };

  // Parser et valider les données
  const parseImportData = () => {
    const errors: string[] = [];
    const parsedData: any[] = [];

    try {
      if (importFormat === "json") {
        const data = safeJsonParse<any[] | null>(importData, null);
        if (!Array.isArray(data)) {
          errors.push("Le JSON doit être un tableau d'objets");
          return { data: [], errors };
        }
        
        data.forEach((item, index) => {
          if (!item.name) {
            errors.push(`Ligne ${index + 1}: Le champ 'name' est requis`);
          } else {
            parsedData.push(item);
          }
        });
      } else {
        // Parser CSV
        const lines = importData.split("\n").filter(line => line.trim());
        if (lines.length < 2) {
          errors.push("Le fichier CSV doit contenir au moins une ligne d'en-tête et une ligne de données");
          return { data: [], errors };
        }

        const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/ /g, "_"));
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
          const item: any = {};
          
          headers.forEach((header, index) => {
            item[header] = values[index] || "";
          });

          if (!item.name) {
            errors.push(`Ligne ${i + 1}: Le champ 'name' est requis`);
          } else {
            parsedData.push(item);
          }
        }
      }
    } catch (e) {
      errors.push(`Erreur de parsing: ${e instanceof Error ? e.message : "Format invalide"}`);
    }

    return { data: parsedData, errors };
  };

  // Importer les données
  const handleImport = async () => {
    if (!importData.trim()) {
      toast({
        title: "Données manquantes",
        description: "Veuillez coller ou charger des données à importer.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportResults(null);

    const { data, errors } = parseImportData();

    if (errors.length > 0 && data.length === 0) {
      setImportResults({ success: 0, errors });
      setIsImporting(false);
      return;
    }

    // Simuler l'import (en production, appeler une mutation tRPC)
    // Pour l'instant, on affiche juste les résultats de validation
    setImportResults({
      success: data.length,
      errors: errors,
    });

    toast({
      title: "Validation terminée",
      description: `${data.length} entrées valides, ${errors.length} erreurs`,
    });

    setIsImporting(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-6xl">
        <Breadcrumbs customItems={[
          { label: "Administration", path: "/admin" },
          { label: "Import/Export Plantes" }
        ]} />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Import/Export Plantes</h1>
          </div>
          <p className="text-muted-foreground">
            Importez et exportez les données botaniques au format CSV ou JSON.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{plants?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Plantes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{plantVarieties?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Variétés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">CSV</div>
              <p className="text-sm text-muted-foreground">Format supporté</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">JSON</div>
              <p className="text-sm text-muted-foreground">Format supporté</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="import" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Tab Import */}
          <TabsContent value="import" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Templates
                  </CardTitle>
                  <CardDescription>
                    Téléchargez un template pour préparer vos données
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => downloadTemplate("csv")}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                    Template CSV
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => downloadTemplate("json")}
                  >
                    <FileJson className="h-4 w-4 mr-2 text-blue-600" />
                    Template JSON
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </CardContent>
              </Card>

              {/* Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Charger un fichier
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez un fichier CSV ou JSON
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <div className="flex gap-2">
                    <Badge variant={importFormat === "csv" ? "default" : "outline"}>
                      CSV
                    </Badge>
                    <Badge variant={importFormat === "json" ? "default" : "outline"}>
                      JSON
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Zone de données */}
            <Card>
              <CardHeader>
                <CardTitle>Données à importer</CardTitle>
                <CardDescription>
                  Collez vos données ou chargez un fichier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <Select value={importFormat} onValueChange={setImportFormat}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder={importFormat === "csv" 
                    ? "name,latin_name,family,category...\nLavande,Lavandula angustifolia,Lamiaceae,aromatique..."
                    : '[\n  {\n    "name": "Lavande",\n    "latinName": "Lavandula angustifolia"\n  }\n]'
                  }
                  className="min-h-[200px] font-mono text-sm"
                />
                <Button 
                  onClick={handleImport}
                  disabled={isImporting || !importData.trim()}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validation en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Valider et Importer
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Résultats */}
            {importResults && (
              <Alert variant={importResults.errors.length > 0 ? "destructive" : "default"}>
                {importResults.errors.length > 0 ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <AlertTitle>
                  {importResults.errors.length > 0 
                    ? "Validation avec erreurs"
                    : "Validation réussie"
                  }
                </AlertTitle>
                <AlertDescription>
                  <p>{importResults.success} entrées valides</p>
                  {importResults.errors.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm">
                      {importResults.errors.slice(0, 5).map((error: string, i: number) => (
                        <li key={i}>{error}</li>
                      ))}
                      {importResults.errors.length > 5 && (
                        <li>... et {importResults.errors.length - 5} autres erreurs</li>
                      )}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Tab Export */}
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Exporter les données
                </CardTitle>
                <CardDescription>
                  Exportez toutes les plantes de la base de données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Format d'export</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-green-600" />
                          CSV (Excel, LibreOffice)
                        </div>
                      </SelectItem>
                      <SelectItem value="json">
                        <div className="flex items-center gap-2">
                          <FileJson className="h-4 w-4 text-blue-600" />
                          JSON (Développeurs)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <Leaf className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{plants?.length || 0} plantes</p>
                      <p className="text-sm text-muted-foreground">
                        Prêtes à être exportées
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={exportData}
                  disabled={isExporting || !plants?.length}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter en {exportFormat.toUpperCase()}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Options avancées */}
            <Card>
              <CardHeader>
                <CardTitle>Options avancées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" disabled>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export Variétés (bientôt)
                  </Button>
                  <Button variant="outline" disabled>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export Analyses (bientôt)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Note informative */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Synchronisation des données
          </h3>
          <p className="text-sm text-muted-foreground">
            Les imports et exports permettent de synchroniser les données botaniques avec des sources externes 
            (fichiers Excel, bases de données, APIs). Utilisez les templates fournis pour garantir la compatibilité 
            des formats. Les données importées sont validées avant insertion dans la base de données.
          </p>
        </div>
      </div>
    </div>
  );
}
