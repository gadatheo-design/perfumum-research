/**
 * Composant d'upload et validation de fichiers d'import
 * Supporte CSV et JSON avec aperçu avant import
 */

import React, { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle2, AlertTriangle, Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ImportFileUploadProps {
  entity: string;
  entityLabel: string;
  onImportSuccess?: (result: any) => void;
}

export function ImportFileUpload({ entity, entityLabel, onImportSuccess }: ImportFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [format, setFormat] = useState<"csv" | "json" | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateMutation = trpc.importExport.validateImportFile.useMutation();
  const previewMutation = trpc.importExport.previewImportData.useMutation();
  const importMutation = trpc.importExport.importData.useMutation();

  const downloadTemplateMutation = trpc.importExport.downloadTemplateCSV.useMutation();
  const downloadTemplateJSONMutation = trpc.importExport.downloadTemplateJSON.useMutation();

  // ─── GESTION DES FICHIERS ───────────────────────────────────────────────

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setValidationResult(null);

    // Lire le fichier
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      setFileContent(content);

      // Détecter le format
      const detectedFormat = selectedFile.name.endsWith(".csv")
        ? "csv"
        : selectedFile.name.endsWith(".json")
          ? "json"
          : null;

      if (!detectedFormat) {
        toast.error("Format de fichier non reconnu. Utilisez .csv ou .json");
        return;
      }

      setFormat(detectedFormat);

      // Valider automatiquement
      await validateFile(content, detectedFormat);
    };

    reader.onerror = () => {
      toast.error("Erreur lors de la lecture du fichier");
    };
  };

  const validateFile = async (content: string, fileFormat: "csv" | "json") => {
    setIsValidating(true);
    try {
      const result = await validateMutation.mutateAsync({
        entity,
        content,
        format: fileFormat,
      });

      setValidationResult(result);

      if (result.isValid) {
        toast.success(`Validation réussie : ${result.rowCount} lignes valides`);
      } else {
        toast.error(`Validation échouée : ${result.errors.length} erreur(s)`);
      }
    } catch (error) {
      toast.error(`Erreur de validation : ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  // ─── APERÇU ───────────────────────────────────────────────────────────────

  const handlePreview = async () => {
    if (!fileContent || !format) return;

    try {
      const result = await previewMutation.mutateAsync({
        entity,
        content: fileContent,
        format,
      });

      setValidationResult(result);
      setShowPreview(true);
    } catch (error) {
      toast.error(`Erreur d'aperçu : ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // ─── IMPORT ───────────────────────────────────────────────────────────────

  const handleImport = async () => {
    if (!fileContent || !format || !validationResult?.isValid) {
      toast.error("Veuillez d'abord valider le fichier");
      return;
    }

    setIsImporting(true);
    try {
      const result = await importMutation.mutateAsync({
        entity,
        content: fileContent,
        format,
        mode: "create",
      });

      toast.success(`Import réussi : ${result.rowsProcessed} lignes importées`);
      onImportSuccess?.(result);

      // Réinitialiser
      setFile(null);
      setFileContent("");
      setFormat(null);
      setValidationResult(null);
      setShowPreview(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(`Erreur d'import : ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsImporting(false);
    }
  };

  // ─── TÉLÉCHARGEMENT DE MODÈLES ──────────────────────────────────────────

  const downloadTemplate = async (format: "csv" | "json") => {
    try {
      const result =
        format === "csv"
          ? await downloadTemplateMutation.mutateAsync({ entity })
          : await downloadTemplateJSONMutation.mutateAsync({ entity });

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

      toast.success(`Modèle ${format.toUpperCase()} téléchargé`);
    } catch (error) {
      toast.error(`Erreur : ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importer {entityLabel}
        </CardTitle>
        <CardDescription>Téléchargez un fichier CSV ou JSON pour importer des données</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Zone de drop */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">Déposez votre fichier ici</p>
          <p className="text-sm text-muted-foreground mb-4">ou cliquez pour sélectionner</p>
          <p className="text-xs text-muted-foreground">Formats acceptés : CSV, JSON</p>
        </div>

        {/* Fichier sélectionné */}
        {file && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Fichier sélectionné</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setFileContent("");
                  setFormat(null);
                  setValidationResult(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Résultats de validation */}
        {validationResult && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Résumé</TabsTrigger>
              <TabsTrigger value="errors" disabled={validationResult.errors.length === 0}>
                Erreurs ({validationResult.errors.length})
              </TabsTrigger>
              <TabsTrigger value="warnings" disabled={validationResult.warnings.length === 0}>
                Avertissements ({validationResult.warnings.length})
              </TabsTrigger>
            </TabsList>

            {/* Résumé */}
            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Lignes valides</p>
                  <p className="text-2xl font-bold">{validationResult.rowCount}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Erreurs</p>
                  <p className="text-2xl font-bold text-red-600">{validationResult.errors.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Avertissements</p>
                  <p className="text-2xl font-bold text-amber-600">{validationResult.warnings.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">Statut</p>
                  <Badge variant={validationResult.isValid ? "default" : "destructive"} className="mt-1">
                    {validationResult.isValid ? "Valide" : "Invalide"}
                  </Badge>
                </div>
              </div>
            </TabsContent>

            {/* Erreurs */}
            {validationResult.errors.length > 0 && (
              <TabsContent value="errors" className="space-y-2">
                {validationResult.errors.map((err: any, i: number) => (
                  <Alert key={i} variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                      {err.message}
                      {err.row && ` (ligne ${err.row})`}
                      {err.column && ` [${err.column}]`}
                    </AlertDescription>
                  </Alert>
                ))}
              </TabsContent>
            )}

            {/* Avertissements */}
            {validationResult.warnings.length > 0 && (
              <TabsContent value="warnings" className="space-y-2">
                {validationResult.warnings.map((warn: any, i: number) => (
                  <Alert key={i}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Avertissement</AlertTitle>
                    <AlertDescription>
                      {warn.message}
                      {warn.row && ` (ligne ${warn.row})`}
                      {warn.column && ` [${warn.column}]`}
                    </AlertDescription>
                  </Alert>
                ))}
              </TabsContent>
            )}
          </Tabs>
        )}

        {/* Aperçu des données */}
        {showPreview && validationResult?.preview && validationResult.preview.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Aperçu des données (10 premières lignes)</h4>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {Object.keys(validationResult.preview[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left font-medium">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validationResult.preview.map((row: any, i: number) => (
                    <tr key={i} className="border-t hover:bg-muted/50">
                      {Object.values(row).map((value: any, j: number) => (
                        <td key={j} className="px-4 py-2">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => downloadTemplate("csv")}
            variant="outline"
            disabled={downloadTemplateMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger modèle CSV
          </Button>

          <Button
            onClick={() => downloadTemplate("json")}
            variant="outline"
            disabled={downloadTemplateJSONMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger modèle JSON
          </Button>

          {file && validationResult && (
            <>
              <Button
                onClick={handlePreview}
                variant="outline"
                disabled={previewMutation.isPending || !validationResult.isValid}
              >
                <Eye className="h-4 w-4 mr-2" />
                Aperçu complet
              </Button>

              <Button
                onClick={handleImport}
                disabled={isImporting || !validationResult.isValid}
                className="ml-auto"
              >
                {isImporting ? "Import en cours..." : "Importer les données"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
