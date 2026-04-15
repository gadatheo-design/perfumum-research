/**
 * Composant d'upload et validation de fichiers d'import
 * Flux en 3 étapes : Sélection → Validation + Aperçu → Confirmation
 */

import React, { useState, useRef } from "react";
import {
  Upload,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  X,
  ChevronRight,
  FileText,
  Table2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ImportFileUploadProps {
  entity: string;
  entityLabel: string;
  onImportSuccess?: (result: any) => void;
}

type Step = "select" | "preview" | "confirm";

// Champs requis par entité (pour la coloration du tableau)
const REQUIRED_FIELDS: Record<string, string[]> = {
  molecules: ["name"],
  recettes: ["name"],
  accords: ["name"],
  familles: ["name", "name_fr"],
  matieres: ["name", "molecule_id", "quantity", "unit"],
  plants: ["name", "latin_name"],
  terroirs: ["name", "country"],
  matieres_premieres: ["name", "category"],
  regions: ["name"],
};

export function ImportFileUpload({ entity, entityLabel, onImportSuccess }: ImportFileUploadProps) {
  const [step, setStep] = useState<Step>("select");
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [format, setFormat] = useState<"csv" | "json" | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [importMode, setImportMode] = useState<"create" | "merge" | "replace">("create");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateMutation = trpc.importExport.validateImportFile.useMutation();
  const importMutation = trpc.importExport.importData.useMutation();

  const requiredFields = REQUIRED_FIELDS[entity] ?? [];

  // ─── GESTION DES FICHIERS ───────────────────────────────────────────────

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setValidationResult(null);
    setStep("select");

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      setFileContent(content);

      const detectedFormat = selectedFile.name.endsWith(".csv")
        ? "csv"
        : selectedFile.name.endsWith(".json")
          ? "json"
          : null;

      if (!detectedFormat) {
        toast.error("Format non reconnu. Utilisez .csv ou .json");
        return;
      }

      setFormat(detectedFormat);
      await validateFile(content, detectedFormat);
    };

    reader.onerror = () => toast.error("Erreur lors de la lecture du fichier");
    reader.readAsText(selectedFile, "UTF-8");
  };

  const validateFile = async (content: string, fileFormat: "csv" | "json") => {
    setIsValidating(true);
    try {
      const result = await validateMutation.mutateAsync({ entity, content, format: fileFormat });
      setValidationResult(result);

      if (result.isValid) {
        toast.success(`Fichier valide — ${result.rowCount} ligne(s) détectée(s)`);
        setStep("preview");
      } else {
        toast.error(`${result.errors.length} erreur(s) détectée(s) — corrigez le fichier`);
        setStep("preview");
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
    if (droppedFile) handleFileSelect(droppedFile);
  };

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
        mode: importMode,
      });

      toast.success(`Import réussi — ${result.rowsProcessed} ligne(s) importée(s)`);
      onImportSuccess?.(result);

      // Réinitialiser
      setFile(null);
      setFileContent("");
      setFormat(null);
      setValidationResult(null);
      setStep("select");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(`Erreur d'import : ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileContent("");
    setFormat(null);
    setValidationResult(null);
    setStep("select");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── TÉLÉCHARGEMENT DE MODÈLES ──────────────────────────────────────────

  const downloadTemplate = async (fmt: "csv" | "json") => {
    try {
      const encoded = encodeURIComponent(JSON.stringify({ "0": { json: { entity } } }));
      const endpoint = fmt === "csv" ? "downloadTemplateCSV" : "downloadTemplateJSON";
      const url = `/api/trpc/importExport.${endpoint}?batch=1&input=${encoded}`;

      const res = await fetch(url);
      const json = await res.json();
      const data = json[0]?.result?.data?.json;
      if (!data) throw new Error("Réponse invalide");

      const blob = new Blob([data.content], { type: data.mimeType });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

      toast.success(`Modèle ${fmt.toUpperCase()} téléchargé`);
    } catch (error) {
      toast.error(`Erreur : ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // ─── INDICATEUR D'ÉTAPES ────────────────────────────────────────────────

  const steps = [
    { id: "select", label: "Sélection", icon: FileText },
    { id: "preview", label: "Aperçu & Validation", icon: Table2 },
    { id: "confirm", label: "Confirmation", icon: ShieldCheck },
  ];

  const stepIndex = steps.findIndex((s) => s.id === step);

  // ─── RENDU ──────────────────────────────────────────────────────────────

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importer {entityLabel}
        </CardTitle>
        <CardDescription>Importez vos données via CSV ou JSON en 3 étapes</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* ── Indicateur d'étapes ── */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isDone = i < stepIndex;
            return (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : isDone ? "text-green-600" : "text-muted-foreground"
                }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 transition-colors ${
                    isActive ? "border-primary bg-primary text-primary-foreground" :
                    isDone ? "border-green-600 bg-green-600 text-white" :
                    "border-muted-foreground/30 bg-muted"
                  }`}>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── ÉTAPE 1 : Sélection ── */}
        {step === "select" && (
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isValidating ? "opacity-50 pointer-events-none" : "hover:bg-muted/50 hover:border-primary/50"
              }`}
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
              <p className="text-lg font-medium mb-1">
                {isValidating ? "Validation en cours…" : "Déposez votre fichier ici"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">ou cliquez pour sélectionner</p>
              <div className="flex justify-center gap-2">
                <Badge variant="outline">CSV</Badge>
                <Badge variant="outline">JSON</Badge>
              </div>
            </div>

            {isValidating && (
              <div className="space-y-2">
                <Progress value={undefined} className="h-1" />
                <p className="text-sm text-center text-muted-foreground">Analyse du fichier…</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => downloadTemplate("csv")}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Modèle CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadTemplate("json")}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Modèle JSON
              </Button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 : Aperçu & Validation ── */}
        {step === "preview" && validationResult && (
          <div className="space-y-5">
            {/* Fichier sélectionné */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{file?.name}</span>
                <span className="text-muted-foreground">
                  ({file ? (file.size / 1024).toFixed(1) : 0} KB · {format?.toUpperCase()})
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Résumé de validation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground mb-1">Lignes</p>
                <p className="text-2xl font-bold">{validationResult.rowCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground mb-1">Erreurs</p>
                <p className={`text-2xl font-bold ${validationResult.errors.length > 0 ? "text-red-600" : "text-green-600"}`}>
                  {validationResult.errors.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground mb-1">Avertissements</p>
                <p className={`text-2xl font-bold ${validationResult.warnings.length > 0 ? "text-amber-600" : "text-green-600"}`}>
                  {validationResult.warnings.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-xs text-muted-foreground mb-1">Statut</p>
                <div className="mt-1">
                  <Badge variant={validationResult.isValid ? "default" : "destructive"}>
                    {validationResult.isValid ? "✓ Valide" : "✗ Invalide"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Erreurs */}
            {validationResult.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  Erreurs à corriger
                </h4>
                {validationResult.errors.slice(0, 5).map((err: any, i: number) => (
                  <Alert key={i} variant="destructive" className="py-2">
                    <AlertDescription className="text-xs">
                      {err.message}
                      {err.row && <span className="ml-1 opacity-70">(ligne {err.row})</span>}
                      {err.column && <span className="ml-1 opacity-70">[{err.column}]</span>}
                    </AlertDescription>
                  </Alert>
                ))}
                {validationResult.errors.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    + {validationResult.errors.length - 5} autre(s) erreur(s)…
                  </p>
                )}
              </div>
            )}

            {/* Avertissements */}
            {validationResult.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  Avertissements
                </h4>
                {validationResult.warnings.slice(0, 3).map((warn: any, i: number) => (
                  <Alert key={i} className="py-2 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                    <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
                      {warn.message}
                      {warn.row && <span className="ml-1 opacity-70">(ligne {warn.row})</span>}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Tableau d'aperçu */}
            {validationResult.preview && validationResult.preview.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    Aperçu des données
                    <span className="text-muted-foreground font-normal">
                      ({Math.min(10, validationResult.preview.length)} / {validationResult.rowCount} lignes)
                    </span>
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-green-100 dark:bg-green-900/40 border border-green-400 inline-block" />
                      Requis
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-muted border inline-block" />
                      Optionnel
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-red-100 dark:bg-red-900/40 border border-red-400 inline-block" />
                      Vide
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/70">
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground w-8">#</th>
                        {Object.keys(validationResult.preview[0]).map((key) => {
                          const isRequired = requiredFields.includes(key);
                          return (
                            <th
                              key={key}
                              className={`px-3 py-2 text-left font-medium whitespace-nowrap ${
                                isRequired
                                  ? "text-green-700 dark:text-green-400"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {key}
                              {isRequired && (
                                <span className="ml-1 text-green-600 dark:text-green-400">*</span>
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {validationResult.preview.map((row: any, i: number) => (
                        <tr key={i} className="border-t hover:bg-muted/30 transition-colors">
                          <td className="px-3 py-1.5 text-muted-foreground">{i + 1}</td>
                          {Object.entries(row).map(([key, value]: [string, any], j: number) => {
                            const isEmpty = value === null || value === undefined || value === "";
                            const isRequired = requiredFields.includes(key);
                            const cellClass = isEmpty && isRequired
                              ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                              : isEmpty
                                ? "text-muted-foreground/50"
                                : isRequired
                                  ? "bg-green-50/50 dark:bg-green-950/20"
                                  : "";
                            return (
                              <td key={j} className={`px-3 py-1.5 max-w-[160px] truncate ${cellClass}`}>
                                {isEmpty ? (
                                  <span className="italic text-xs">—</span>
                                ) : typeof value === "object" ? (
                                  JSON.stringify(value).slice(0, 40)
                                ) : (
                                  String(value).slice(0, 40)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {validationResult.rowCount > 10 && (
                  <p className="text-xs text-muted-foreground text-right">
                    … et {validationResult.rowCount - 10} ligne(s) supplémentaire(s)
                  </p>
                )}
              </div>
            )}

            {/* Actions étape 2 */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="outline" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" />
                Changer de fichier
              </Button>
              <Button
                onClick={() => setStep("confirm")}
                disabled={!validationResult.isValid}
                className="ml-auto"
              >
                Continuer vers la confirmation
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 3 : Confirmation ── */}
        {step === "confirm" && validationResult && (
          <div className="space-y-5">
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200">Prêt à importer</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300 text-sm">
                <strong>{validationResult.rowCount}</strong> ligne(s) de <strong>{entityLabel}</strong> seront importées depuis <em>{file?.name}</em>.
              </AlertDescription>
            </Alert>

            {/* Mode d'import */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Mode d'import</h4>
              <div className="grid gap-2">
                {[
                  {
                    value: "create",
                    label: "Créer uniquement",
                    desc: "Ajoute les nouvelles entrées, ignore les doublons existants",
                    color: "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20",
                  },
                  {
                    value: "merge",
                    label: "Fusionner",
                    desc: "Crée les nouvelles entrées et met à jour les existantes",
                    color: "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20",
                  },
                  {
                    value: "replace",
                    label: "Remplacer",
                    desc: "⚠️ Supprime toutes les données existantes et importe depuis le fichier",
                    color: "border-red-200 bg-red-50/50 dark:bg-red-950/20",
                  },
                ].map((mode) => (
                  <label
                    key={mode.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      importMode === mode.value
                        ? mode.color + " border-current"
                        : "border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value={mode.value}
                      checked={importMode === mode.value}
                      onChange={() => setImportMode(mode.value as any)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium">{mode.label}</p>
                      <p className="text-xs text-muted-foreground">{mode.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions étape 3 */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("preview")}>
                Retour à l'aperçu
              </Button>
              <Button
                onClick={handleImport}
                disabled={isImporting}
                variant={importMode === "replace" ? "destructive" : "default"}
                className="ml-auto"
              >
                {isImporting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Import en cours…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Confirmer l'import
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
