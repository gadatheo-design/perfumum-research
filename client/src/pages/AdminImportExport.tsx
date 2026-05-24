// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { 
  Database, Download, Loader2, FileJson, FileSpreadsheet, 
  Beaker, FlaskConical, Leaf, MapPin, Link2, Archive,
  CheckCircle2, Package, BookOpen, Layers, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

type EntityType = "molecules" | "recettes" | "accords" | "familles" | "matieres" | "plants" | "terroirs" | "liaisons";
type ExportFormat = "csv" | "json";

interface ExportConfig {
  entity: EntityType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  endpoint: string;
}

const exportConfigs: ExportConfig[] = [
  {
    entity: "molecules",
    label: "Molécules",
    description: "Catalogue complet des molécules olfactives avec propriétés chimiques",
    icon: <Beaker className="h-5 w-5" />,
    color: "emerald",
    endpoint: "export.molecules",
  },
  {
    entity: "recettes",
    label: "Recettes",
    description: "Toutes les formulations avec compositions et notes",
    icon: <FlaskConical className="h-5 w-5" />,
    color: "blue",
    endpoint: "export.recettes",
  },
  {
    entity: "accords",
    label: "Accords",
    description: "Accords olfactifs et leurs caractéristiques",
    icon: <Layers className="h-5 w-5" />,
    color: "purple",
    endpoint: "export.accords",
  },
  {
    entity: "familles",
    label: "Familles",
    description: "Classification des familles olfactives",
    icon: <BookOpen className="h-5 w-5" />,
    color: "indigo",
    endpoint: "export.familles",
  },
  {
    entity: "matieres",
    label: "Matières Premières",
    description: "Inventaire complet du laboratoire",
    icon: <Package className="h-5 w-5" />,
    color: "amber",
    endpoint: "export.matieres",
  },
  {
    entity: "plants",
    label: "Plantes",
    description: "Base de données botaniques (Leaf Economies)",
    icon: <Leaf className="h-5 w-5" />,
    color: "green",
    endpoint: "plants.list",
  },
  {
    entity: "terroirs",
    label: "Terroirs",
    description: "Régions géographiques et leurs caractéristiques",
    icon: <MapPin className="h-5 w-5" />,
    color: "orange",
    endpoint: "terroirs.getAll",
  },
];

const liaisonConfigs = [
  {
    id: "molecule-recette",
    label: "Molécule ↔ Recette",
    description: "Liaisons entre molécules et recettes",
    endpoint: "moleculeRecetteLinks.getAll",
  },
  {
    id: "plant-molecule",
    label: "Plante ↔ Molécule",
    description: "Liaisons entre plantes et molécules",
    endpoint: "plantMoleculeLinks?.getAll",
  },
  {
    id: "plant-terroir",
    label: "Plante ↔ Terroir",
    description: "Liaisons entre plantes et terroirs",
    endpoint: "plantTerroirLinks.getAll",
  },
];

export default function AdminImportExport() {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [selectedEntities, setSelectedEntities] = useState<Set<EntityType>>(new Set());
  const [selectedLiaisons, setSelectedLiaisons] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportResults, setExportResults] = useState<{ entity: string; success: boolean; count?: number; error?: string }[]>([]);

  // Queries pour obtenir les données
  const { data: plantsData } = trpc.plants.list.useQuery();
  const { data: terroirsData } = trpc.terroirs.getAll.useQuery();
  const { data: plantMoleculeLinks } = trpc.plantMoleculeLinks?.getAll.useQuery();
  const { data: plantTerroirs } = trpc.plantTerroirs?.getAll.useQuery();

  // Toggle sélection d'une entité
  const toggleEntity = (entity: EntityType) => {
    const newSet = new Set(selectedEntities);
    if (newSet.has(entity)) {
      newSet.delete(entity);
    } else {
      newSet.add(entity);
    }
    setSelectedEntities(newSet);
  };

  // Toggle sélection d'une liaison
  const toggleLiaison = (liaison: string) => {
    const newSet = new Set(selectedLiaisons);
    if (newSet.has(liaison)) {
      newSet.delete(liaison);
    } else {
      newSet.add(liaison);
    }
    setSelectedLiaisons(newSet);
  };

  // Sélectionner/désélectionner tout
  const selectAllEntities = () => {
    if (selectedEntities.size === exportConfigs.length) {
      setSelectedEntities(new Set());
    } else {
      setSelectedEntities(new Set(exportConfigs.map(c => c.entity)));
    }
  };

  const selectAllLiaisons = () => {
    if (selectedLiaisons.size === liaisonConfigs.length) {
      setSelectedLiaisons(new Set());
    } else {
      setSelectedLiaisons(new Set(liaisonConfigs.map(c => c.id)));
    }
  };

  // Convertir les données en CSV
  const objectsToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const escapeField = (value: any): string => {
      if (value === null || value === undefined) return '';
      const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const headerRow = headers.join(',');
    const dataRows = data.map(row => 
      headers.map(h => escapeField(row[h])).join(',')
    );
    
    return [headerRow, ...dataRows].join('\n');
  };

  // Télécharger un fichier
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Exporter une entité unique
  const exportSingleEntity = async (config: ExportConfig) => {
    setExporting(config.entity);
    
    try {
      let data: any[];
      
      // Récupérer les données selon l'entité
      if (config.entity === "plants") {
        data = plantsData || [];
      } else if (config.entity === "terroirs") {
        data = terroirsData || [];
      } else {
        // Utiliser l'API tRPC pour les autres entités
        const response = await fetch(`/api/trpc/${config.endpoint}`);
        const result = await response.json();
        
        if (exportFormat === "csv") {
          // Pour CSV, les données sont déjà formatées
          const csvData = result.result?.data;
          if (csvData) {
            const filename = `perfumum_${config.entity}_${new Date().toISOString().split('T')[0]}.csv`;
            downloadFile(csvData, filename, 'text/csv;charset=utf-8;');
            toast.success(`Export CSV réussi : ${config.label}`);
            return;
          }
        }
        
        data = result.result?.data?.json || result.result?.data || [];
      }

      if (!data || data.length === 0) {
        toast.error(`Aucune donnée à exporter pour ${config.label}`);
        return;
      }

      // Générer le fichier
      const dateStr = new Date().toISOString().split('T')[0];
      
      if (exportFormat === "json") {
        const content = JSON.stringify(data, null, 2);
        const filename = `perfumum_${config.entity}_${dateStr}.json`;
        downloadFile(content, filename, 'application/json');
      } else {
        const content = objectsToCSV(data);
        const filename = `perfumum_${config.entity}_${dateStr}.csv`;
        downloadFile(content, filename, 'text/csv;charset=utf-8;');
      }

      toast.success(`Export ${exportFormat.toUpperCase()} réussi : ${config.label} (${data.length} entrées)`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export de ${config.label}`);
    } finally {
      setExporting(null);
    }
  };

  // Exporter une liaison
  const exportSingleLiaison = async (config: typeof liaisonConfigs[0]) => {
    setExporting(config.id);
    
    try {
      let data: any[];
      
      if (config.id === "plant-molecule") {
        data = plantMoleculeLinks || [];
      } else if (config.id === "plant-terroir") {
        data = plantTerroirs || [];
      } else {
        // Pour molecule-recette, on utilise l'API directement
        try {
          const response = await fetch('/api/trpc/linkingCoverage.getStats');
          const result = await response.json();
          // Pas de données directes disponibles, on skip
          toast.info(`Export des liaisons ${config.label} non disponible via cette interface`);
          return;
        } catch {
          data = [];
        }
      }

      if (!data || data.length === 0) {
        toast.error(`Aucune liaison à exporter pour ${config.label}`);
        return;
      }

      const dateStr = new Date().toISOString().split('T')[0];
      
      if (exportFormat === "json") {
        const content = JSON.stringify(data, null, 2);
        const filename = `perfumum_${config.id.replace(/-/g, '_')}_${dateStr}.json`;
        downloadFile(content, filename, 'application/json');
      } else {
        const content = objectsToCSV(data);
        const filename = `perfumum_${config.id.replace(/-/g, '_')}_${dateStr}.csv`;
        downloadFile(content, filename, 'text/csv;charset=utf-8;');
      }

      toast.success(`Export ${exportFormat.toUpperCase()} réussi : ${config.label} (${data.length} liaisons)`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export de ${config.label}`);
    } finally {
      setExporting(null);
    }
  };

  // Export groupé
  const exportSelected = async () => {
    const totalItems = selectedEntities.size + selectedLiaisons.size;
    if (totalItems === 0) {
      toast.error("Veuillez sélectionner au moins une entité à exporter");
      return;
    }

    setExportProgress(0);
    setExportResults([]);
    const results: typeof exportResults = [];
    let completed = 0;

    // Exporter les entités sélectionnées
    for (const entity of Array.from(selectedEntities)) {
      const config = exportConfigs.find(c => c.entity === entity);
      if (config) {
        try {
          await exportSingleEntity(config);
          results.push({ entity: config.label, success: true });
        } catch (error) {
          results.push({ entity: config.label, success: false, error: String(error) });
        }
        completed++;
        setExportProgress((completed / totalItems) * 100);
      }
    }

    // Exporter les liaisons sélectionnées
    for (const liaisonId of Array.from(selectedLiaisons)) {
      const config = liaisonConfigs.find(c => c.id === liaisonId);
      if (config) {
        try {
          await exportSingleLiaison(config);
          results.push({ entity: config.label, success: true });
        } catch (error) {
          results.push({ entity: config.label, success: false, error: String(error) });
        }
        completed++;
        setExportProgress((completed / totalItems) * 100);
      }
    }

    setExportResults(results);
    toast.success(`Export terminé : ${results.filter(r => r.success).length}/${totalItems} réussis`);
  };

  // Export complet (toutes les données)
  const exportAll = async () => {
    setSelectedEntities(new Set(exportConfigs.map(c => c.entity)));
    setSelectedLiaisons(new Set(liaisonConfigs.map(c => c.id)));
    
    // Attendre que les états soient mis à jour
    setTimeout(() => {
      exportSelected();
    }, 100);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      emerald: "border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
      blue: "border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20",
      purple: "border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/20",
      indigo: "border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20",
      amber: "border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/20",
      green: "border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950/20",
      orange: "border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/20",
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-primary/10">
                  <Database className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Export des Données
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Exportez vos données de recherche PERFUMUM en CSV ou JSON pour sauvegarde, analyse ou partage.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Format Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="h-5 w-5" />
                    Format d'export
                  </CardTitle>
                  <CardDescription>
                    Choisissez le format de fichier pour vos exports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button
                      variant={exportFormat === "csv" ? "default" : "outline"}
                      onClick={() => setExportFormat("csv")}
                      className="flex-1"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      CSV (Tableur)
                    </Button>
                    <Button
                      variant={exportFormat === "json" ? "default" : "outline"}
                      onClick={() => setExportFormat("json")}
                      className="flex-1"
                    >
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON (Données structurées)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for different export types */}
              <Tabs defaultValue="individual" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="individual">Export individuel</TabsTrigger>
                  <TabsTrigger value="batch">Export groupé</TabsTrigger>
                  <TabsTrigger value="liaisons">Liaisons</TabsTrigger>
                </TabsList>

                {/* Individual Export */}
                <TabErrorBoundary>
                <TabsContent value="individual" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exportConfigs.map((config) => (
                      <Card key={config.entity} className={`transition-colors ${getColorClasses(config.color)}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {config.icon}
                            {config.label}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {config.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            onClick={() => exportSingleEntity(config)}
                            disabled={exporting === config.entity}
                            variant="outline"
                            className="w-full"
                          >
                            {exporting === config.entity ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Export en cours...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Exporter {exportFormat.toUpperCase()}
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                </TabErrorBoundary>

                {/* Batch Export */}
                <TabErrorBoundary>
                <TabsContent value="batch" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Sélectionner les entités</span>
                        <Button variant="outline" size="sm" onClick={selectAllEntities}>
                          {selectedEntities.size === exportConfigs.length ? "Tout désélectionner" : "Tout sélectionner"}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {exportConfigs.map((config) => (
                          <div
                            key={config.entity}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedEntities.has(config.entity)
                                ? "bg-primary/10 border-primary"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => toggleEntity(config.entity)}
                          >
                            <Checkbox
                              checked={selectedEntities.has(config.entity)}
                              onCheckedChange={() => toggleEntity(config.entity)}
                            />
                            <div className="flex items-center gap-2">
                              {config.icon}
                              <span className="font-medium">{config.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {exportProgress > 0 && exportProgress < 100 && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression de l'export</span>
                            <span>{Math.round(exportProgress)}%</span>
                          </div>
                          <Progress value={exportProgress} />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {exportResults.length > 0 && (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Résultats de l'export</AlertTitle>
                      <AlertDescription>
                        <ul className="mt-2 space-y-1">
                          {exportResults.map((result, i) => (
                            <li key={i} className="flex items-center gap-2">
                              {result.success ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <span className="h-4 w-4 text-red-600">✗</span>
                              )}
                              <span>{result.entity}</span>
                              {result.error && (
                                <span className="text-sm text-muted-foreground">({result.error})</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={exportSelected}
                      disabled={selectedEntities.size === 0 || exporting !== null}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter la sélection ({selectedEntities.size} entités)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={exportAll}
                      disabled={exporting !== null}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Tout exporter
                    </Button>
                  </div>
                </TabsContent>
                </TabErrorBoundary>

                {/* Liaisons Export */}
                <TabErrorBoundary>
                <TabsContent value="liaisons" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5" />
                        Export des liaisons relationnelles
                      </CardTitle>
                      <CardDescription>
                        Exportez les relations entre les différentes entités de la base de données
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {liaisonConfigs.map((config) => (
                        <div
                          key={config.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={selectedLiaisons.has(config.id)}
                              onCheckedChange={() => toggleLiaison(config.id)}
                            />
                            <div>
                              <p className="font-medium">{config.label}</p>
                              <p className="text-sm text-muted-foreground">{config.description}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportSingleLiaison(config)}
                            disabled={exporting === config.id}
                          >
                            {exporting === config.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={selectAllLiaisons}>
                      {selectedLiaisons.size === liaisonConfigs.length ? "Tout désélectionner" : "Tout sélectionner"}
                    </Button>
                    <Button
                      onClick={() => {
                        selectedLiaisons.forEach(id => {
                          const config = liaisonConfigs.find(c => c.id === id);
                          if (config) exportSingleLiaison(config);
                        });
                      }}
                      disabled={selectedLiaisons.size === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter les liaisons sélectionnées
                    </Button>
                  </div>
                </TabsContent>
                </TabErrorBoundary>
              </Tabs>

              {/* Info Section */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Format CSV
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Séparateur : virgule (,)</li>
                        <li>• Encodage : UTF-8</li>
                        <li>• Compatible Excel, Google Sheets, LibreOffice</li>
                        <li>• Idéal pour l'analyse et le traitement tabulaire</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FileJson className="h-4 w-4" />
                        Format JSON
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Structure hiérarchique préservée</li>
                        <li>• Types de données conservés</li>
                        <li>• Compatible avec les APIs et scripts</li>
                        <li>• Idéal pour la sauvegarde et l'intégration</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Links to Import */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/admin/import-csv-preview">
                  <Button variant="outline">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Import CSV avec prévisualisation
                  </Button>
                </Link>
                <Link href="/admin/import-export-plants">
                  <Button variant="outline">
                    <Leaf className="h-4 w-4 mr-2" />
                    Import/Export Plantes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
