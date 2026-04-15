/**
 * Page d'import/export bidirectionnelle avec modèles de fichiers
 * Remplace AdminImportExport.tsx avec fonctionnalités complètes
 */

import React, { useState } from "react";
import {
  Upload,
  Download,
  Database,
  FileSpreadsheet,
  FileJson,
  Leaf,
  Zap,
  Palette,
  Beaker,
  Package,
  MapPin,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

import { ImportFileUpload } from "@/components/ImportFileUpload";

// Configuration des entités avec icônes
const ENTITIES = [
  {
    entity: "molecules",
    label: "Molécules",
    icon: <Beaker className="h-5 w-5" />,
    color: "emerald",
    description: "Catalogue des molécules olfactives",
  },
  {
    entity: "recettes",
    label: "Recettes",
    icon: <Zap className="h-5 w-5" />,
    color: "blue",
    description: "Formulations et compositions",
  },
  {
    entity: "accords",
    label: "Accords",
    icon: <Palette className="h-5 w-5" />,
    color: "purple",
    description: "Accords olfactifs",
  },
  {
    entity: "familles",
    label: "Familles Olfactives",
    icon: <Database className="h-5 w-5" />,
    color: "indigo",
    description: "Classification olfactive",
  },
  {
    entity: "matieres",
    label: "Matières Premières",
    icon: <Package className="h-5 w-5" />,
    color: "amber",
    description: "Inventaire du laboratoire",
  },
  {
    entity: "plants",
    label: "Plantes",
    icon: <Leaf className="h-5 w-5" />,
    color: "green",
    description: "Base botanique (Leaf Economies)",
  },
  {
    entity: "terroirs",
    label: "Terroirs",
    icon: <MapPin className="h-5 w-5" />,
    color: "orange",
    description: "Régions de production",
  },
  {
    entity: "regions",
    label: "Régions Géographiques",
    icon: <Globe className="h-5 w-5" />,
    color: "cyan",
    description: "Géographie et climat",
  },
];

export default function AdminImportExportNew() {
  const [activeEntity, setActiveEntity] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");

  const templatesQuery = trpc.importExport.listTemplates.useQuery();
  const exportMutation = (trpc.importExport as any).downloadTemplateCSV.useMutation();
  const exportJSONMutation = (trpc.importExport as any).downloadTemplateJSON.useMutation();

  // Télécharger un modèle
  const downloadTemplate = async (entity: string, format: "csv" | "json") => {
    try {
      const result =
        format === "csv"
          ? await exportMutation.mutateAsync({ entity })
          : await exportJSONMutation.mutateAsync({ entity });

      // Créer un blob et télécharger
      const blob = new Blob([result.content], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Modèle ${format.toUpperCase()} téléchargé : ${result.filename}`);
    } catch (error) {
      toast.error(`Erreur : ${error instanceof Error ? error.message : String(error)}`);
    }
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
      cyan: "border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/20",
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header and Breadcrumbs removed - components not available */}

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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Import/Export des Données</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Importez et exportez vos données de recherche PERFUMUM en CSV ou JSON. Utilisez les modèles
                fournis pour garantir la compatibilité.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Tabs pour Import/Export */}
              <Tabs defaultValue="import" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="import" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Importer
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exporter
                  </TabsTrigger>
                </TabsList>

                {/* TAB IMPORT */}
                <TabsContent value="import" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sélectionner une entité à importer</CardTitle>
                      <CardDescription>
                        Choisissez le type de données que vous souhaitez importer
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {ENTITIES.map((entity) => (
                          <button
                            key={entity.entity}
                            onClick={() => setActiveEntity(entity.entity)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              activeEntity === entity.entity
                                ? "border-primary bg-primary/10"
                                : `border-dashed ${getColorClasses(entity.color)}`
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {entity.icon}
                              <span className="font-medium">{entity.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{entity.description}</p>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Import Component */}
                  {activeEntity && (
                    <ImportFileUpload
                      entity={activeEntity}
                      entityLabel={ENTITIES.find((e) => e.entity === activeEntity)?.label || activeEntity}
                      onImportSuccess={() => {
                        setActiveEntity(null);
                      }}
                    />
                  )}
                </TabsContent>

                {/* TAB EXPORT */}
                <TabsContent value="export" className="space-y-6">
                  {/* Format Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Format d'export
                      </CardTitle>
                      <CardDescription>Choisissez le format de fichier pour vos exports</CardDescription>
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

                  {/* Modèles disponibles */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Télécharger les modèles</CardTitle>
                      <CardDescription>
                        Sélectionnez les entités dont vous souhaitez télécharger les modèles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {ENTITIES.map((entity) => (
                          <Card key={entity.entity} className={`border ${getColorClasses(entity.color)}`}>
                            <CardContent className="pt-6">
                              <div className="flex items-center gap-2 mb-4">
                                {entity.icon}
                                <span className="font-medium text-sm">{entity.label}</span>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadTemplate(entity.entity, "csv")}
                                  disabled={exportMutation.isPending}
                                  className="w-full"
                                >
                                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                                  CSV
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadTemplate(entity.entity, "json")}
                                  disabled={exportJSONMutation.isPending}
                                  className="w-full"
                                >
                                  <FileJson className="h-3 w-3 mr-1" />
                                  JSON
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Information Section */}
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
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
