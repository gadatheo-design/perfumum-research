// @ts-nocheck
import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Upload, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  FileText, 
  Leaf, 
  Beaker,
  Eye,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  RefreshCw,
  Pencil,
  Save,
  X
} from "lucide-react";

interface ParsedRow {
  data: Record<string, string>;
  valid: boolean;
  errors: string[];
  selected: boolean;
}

interface ColumnMapping {
  csvColumn: string;
  dbField: string;
  required: boolean;
}

// Champs disponibles pour les molécules
const moleculeFields = [
  { name: "name", label: "Nom", required: true },
  { name: "family", label: "Famille", required: false },
  { name: "chemicalClass", label: "Classe chimique", required: false },
  { name: "casNumber", label: "Numéro CAS", required: false },
  { name: "iupacName", label: "Nom IUPAC", required: false },
  { name: "chemicalFormula", label: "Formule chimique", required: false },
  { name: "olfactiveProfile", label: "Profil olfactif", required: false },
  { name: "emotionalResonance", label: "Résonance émotionnelle", required: false },
  { name: "functionalEffect", label: "Effet fonctionnel", required: false },
  { name: "sourceOrigin", label: "Origine", required: false },
  { name: "botanicalSources", label: "Sources botaniques", required: false },
  { name: "molecularWeight", label: "Poids moléculaire", required: false },
  { name: "boilingPoint", label: "Point d'ébullition", required: false },
  { name: "notes", label: "Notes", required: false },
];

// Champs disponibles pour les plantes
const plantFields = [
  { name: "name", label: "Nom", required: true },
  { name: "latinName", label: "Nom latin", required: false },
  { name: "family", label: "Famille botanique", required: false },
  { name: "category", label: "Catégorie", required: true },
  { name: "origin", label: "Origine", required: false },
  { name: "habitat", label: "Habitat", required: false },
  { name: "olfactiveSignature", label: "Signature olfactive", required: false },
  { name: "dominantMolecules", label: "Molécules dominantes", required: false },
  { name: "climaticAxis", label: "Axe climatique", required: false },
  { name: "traditionalUse", label: "Usage traditionnel", required: false },
  { name: "absorbeUse", label: "Usage Absorbe", required: false },
  { name: "notes", label: "Notes", required: false },
];

// Catégories valides pour les plantes
const validCategories = ["aromatique", "tabac", "cannabis", "resine", "bois", "fleur", "racine", "autre"];

export default function ImportCSVPreview() {
  const [activeTab, setActiveTab] = useState<"molecules" | "plants">("molecules");
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "result">("upload");
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);
  
  // État pour l'édition inline
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Record<string, string>>({});
  
  // État pour le dialog d'édition détaillée
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDialogRowIndex, setEditDialogRowIndex] = useState<number | null>(null);
  const [editDialogData, setEditDialogData] = useState<Record<string, string>>({});

  const importMoleculesMutation = trpc.batchImport.importMolecules.useMutation();
  const importPlantsMutation = trpc.batchImport.importPlants.useMutation();

  const fields = activeTab === "molecules" ? moleculeFields : plantFields;

  // Parser CSV robuste
  const parseCSV = useCallback((text: string): { headers: string[]; rows: string[][] } => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    const result: string[][] = [];

    for (const line of lines) {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if ((char === "," || char === ";") && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      result.push(values);
    }

    return {
      headers: result[0] || [],
      rows: result.slice(1),
    };
  }, []);

  // Gérer le chargement du fichier
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStep("upload");

    try {
      const text = await selectedFile.text();
      const { headers, rows } = parseCSV(text);
      
      setCsvHeaders(headers);
      
      // Créer les lignes parsées avec validation
      const parsed: ParsedRow[] = rows.map((row) => {
        const data: Record<string, string> = {};
        headers.forEach((header, index) => {
          data[header] = row[index] || "";
        });
        return {
          data,
          valid: true,
          errors: [],
          selected: true,
        };
      });
      
      setParsedRows(parsed);
      
      // Auto-mapping intelligent
      const autoMappings: Record<string, string> = {};
      headers.forEach((header) => {
        const headerLower = header.toLowerCase().replace(/[_\s-]/g, "");
        const matchedField = fields.find((f) => {
          const fieldLower = f.name.toLowerCase();
          const labelLower = f.label.toLowerCase().replace(/[_\s-]/g, "");
          return headerLower === fieldLower || 
                 headerLower === labelLower ||
                 headerLower.includes(fieldLower) ||
                 fieldLower.includes(headerLower);
        });
        if (matchedField) {
          autoMappings[header] = matchedField.name;
        }
      });
      setColumnMappings(autoMappings);
      
      setStep("mapping");
      toast.success(`${parsed.length} lignes chargées`);
    } catch (error) {
      toast.error("Erreur lors de la lecture du fichier");
    }
  }, [parseCSV, fields]);

  // Fonction de validation d'une ligne
  const validateRow = useCallback((rowData: Record<string, string>): string[] => {
    const errors: string[] = [];
    
    // Vérifier les champs requis
    fields.filter(f => f.required).forEach((field) => {
      const mappedColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === field.name)?.[0];
      if (mappedColumn && !rowData[mappedColumn]?.trim()) {
        errors.push(`${field.label} est requis`);
      }
    });

    // Validation spécifique pour les plantes
    if (activeTab === "plants") {
      const categoryColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === "category")?.[0];
      if (categoryColumn) {
        const category = rowData[categoryColumn]?.toLowerCase();
        if (category && !validCategories.includes(category)) {
          errors.push(`Catégorie invalide: ${category}. Valeurs acceptées: ${validCategories.join(", ")}`);
        }
      }
    }

    return errors;
  }, [fields, columnMappings, activeTab]);

  // Valider les lignes selon le mapping
  const validatedRows = useMemo(() => {
    return parsedRows.map((row) => {
      const errors = validateRow(row.data);
      return {
        ...row,
        valid: errors.length === 0,
        errors,
      };
    });
  }, [parsedRows, validateRow]);

  // Statistiques de prévisualisation
  const previewStats = useMemo(() => {
    const selected = validatedRows.filter(r => r.selected);
    const valid = selected.filter(r => r.valid);
    const invalid = selected.filter(r => !r.valid);
    return {
      total: validatedRows.length,
      selected: selected.length,
      valid: valid.length,
      invalid: invalid.length,
    };
  }, [validatedRows]);

  // Toggle sélection d'une ligne
  const toggleRowSelection = (index: number) => {
    setParsedRows(prev => prev.map((row, i) => 
      i === index ? { ...row, selected: !row.selected } : row
    ));
  };

  // Sélectionner/désélectionner tout
  const toggleAllSelection = (selected: boolean) => {
    setParsedRows(prev => prev.map(row => ({ ...row, selected })));
  };

  // Commencer l'édition inline d'une ligne
  const startInlineEdit = (index: number) => {
    setEditingRow(index);
    setEditingData({ ...parsedRows[index].data });
  };

  // Sauvegarder l'édition inline
  const saveInlineEdit = () => {
    if (editingRow === null) return;
    
    setParsedRows(prev => prev.map((row, i) => 
      i === editingRow ? { ...row, data: { ...editingData } } : row
    ));
    
    setEditingRow(null);
    setEditingData({});
    toast.success("Ligne mise à jour");
  };

  // Annuler l'édition inline
  const cancelInlineEdit = () => {
    setEditingRow(null);
    setEditingData({});
  };

  // Ouvrir le dialog d'édition détaillée
  const openEditDialog = (index: number) => {
    setEditDialogRowIndex(index);
    setEditDialogData({ ...parsedRows[index].data });
    setEditDialogOpen(true);
  };

  // Sauvegarder depuis le dialog
  const saveDialogEdit = () => {
    if (editDialogRowIndex === null) return;
    
    setParsedRows(prev => prev.map((row, i) => 
      i === editDialogRowIndex ? { ...row, data: { ...editDialogData } } : row
    ));
    
    setEditDialogOpen(false);
    setEditDialogRowIndex(null);
    setEditDialogData({});
    toast.success("Ligne mise à jour");
  };

  // Corriger automatiquement les erreurs courantes
  const autoFixRow = (index: number) => {
    const row = parsedRows[index];
    const newData = { ...row.data };
    let fixed = false;

    // Auto-correction pour les plantes
    if (activeTab === "plants") {
      const categoryColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === "category")?.[0];
      if (categoryColumn) {
        const category = newData[categoryColumn]?.toLowerCase().trim();
        // Correction des catégories mal orthographiées
        const categoryFixes: Record<string, string> = {
          "aromatic": "aromatique",
          "tobacco": "tabac",
          "resin": "resine",
          "wood": "bois",
          "flower": "fleur",
          "root": "racine",
          "other": "autre",
          "": "autre",
        };
        if (categoryFixes[category]) {
          newData[categoryColumn] = categoryFixes[category];
          fixed = true;
        } else if (!validCategories.includes(category)) {
          newData[categoryColumn] = "autre";
          fixed = true;
        }
      }
    }

    if (fixed) {
      setParsedRows(prev => prev.map((r, i) => 
        i === index ? { ...r, data: newData } : r
      ));
      toast.success("Corrections automatiques appliquées");
    } else {
      toast.info("Aucune correction automatique disponible");
    }
  };

  // Corriger toutes les erreurs automatiquement
  const autoFixAllErrors = () => {
    let fixedCount = 0;
    
    setParsedRows(prev => prev.map((row) => {
      if (row.valid) return row;
      
      const newData = { ...row.data };
      let fixed = false;

      if (activeTab === "plants") {
        const categoryColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === "category")?.[0];
        if (categoryColumn) {
          const category = newData[categoryColumn]?.toLowerCase().trim();
          const categoryFixes: Record<string, string> = {
            "aromatic": "aromatique",
            "tobacco": "tabac",
            "resin": "resine",
            "wood": "bois",
            "flower": "fleur",
            "root": "racine",
            "other": "autre",
            "": "autre",
          };
          if (categoryFixes[category] || !validCategories.includes(category)) {
            newData[categoryColumn] = categoryFixes[category] || "autre";
            fixed = true;
          }
        }
      }

      if (fixed) {
        fixedCount++;
        return { ...row, data: newData };
      }
      return row;
    }));

    if (fixedCount > 0) {
      toast.success(`${fixedCount} lignes corrigées automatiquement`);
    } else {
      toast.info("Aucune correction automatique disponible");
    }
  };

  // Importer les données
  const handleImport = async () => {
    const rowsToImport = validatedRows.filter(r => r.selected && r.valid);
    if (rowsToImport.length === 0) {
      toast.error("Aucune ligne valide à importer");
      return;
    }

    setImporting(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      const mappedData = rowsToImport.map((row) => {
        const mapped: Record<string, string> = {};
        Object.entries(columnMappings).forEach(([csvCol, dbField]) => {
          mapped[dbField] = row.data[csvCol] || "";
        });
        return mapped;
      });

      let result;
      if (activeTab === "molecules") {
        result = await importMoleculesMutation.mutateAsync({
          molecules: mappedData.map(m => ({
            name: m.name || "",
            family: m.family || "",
            odorKey: m.olfactiveProfile || "",
            role: m.functionalEffect || "",
            climaticAxis: "",
          })),
        });
      } else {
        result = await importPlantsMutation.mutateAsync({
          plants: mappedData.map(p => ({
            name: p.name || "",
            latinName: p.latinName || "",
            family: p.family || "",
            category: p.category || "autre",
            origin: p.origin || "",
            habitat: p.habitat || "",
            olfactiveSignature: p.olfactiveSignature || "",
            dominantMolecules: p.dominantMolecules || "",
            climaticAxis: p.climaticAxis || "",
            traditionalUse: p.traditionalUse || "",
            absorbeUse: p.absorbeUse || "",
            kingdom: "",
            division: "",
            class: "",
            order: "",
            genus: "",
            species: "",
            lifeCycle: "",
            harvestPeriod: "",
            essentialOilYield: "",
            notes: p.notes || "",
          })),
        });
      }

      setImportResult({
        success: result.imported,
        errors: result.errors,
      });
      setStep("result");
      toast.success(`${result.imported} éléments importés avec succès`);
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
      setImportResult({
        success: 0,
        errors: [error.message],
      });
      setStep("result");
    } finally {
      setImporting(false);
    }
  };

  // Réinitialiser
  const handleReset = () => {
    setFile(null);
    setCsvHeaders([]);
    setParsedRows([]);
    setColumnMappings({});
    setStep("upload");
    setImportResult(null);
    setEditingRow(null);
    setEditingData({});
  };

  // Obtenir les colonnes mappées pour l'affichage
  const mappedColumns = useMemo(() => {
    return Object.entries(columnMappings)
      .filter(([_, dbField]) => dbField)
      .map(([csvCol, dbField]) => ({
        csvCol,
        dbField,
        label: fields.find(f => f.name === dbField)?.label || dbField,
        required: fields.find(f => f.name === dbField)?.required || false,
      }));
  }, [columnMappings, fields]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Import CSV avec Prévisualisation</h1>
                  <p className="text-muted-foreground">
                    Importez vos données avec mapping intelligent, validation et correction des erreurs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Sélection du type */}
              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "molecules" | "plants"); handleReset(); }}>
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
              </Tabs>

              {/* Étapes de progression */}
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={step === "upload" ? "default" : "outline"}>1. Upload</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant={step === "mapping" ? "default" : "outline"}>2. Mapping</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant={step === "preview" ? "default" : "outline"}>3. Prévisualisation & Correction</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant={step === "result" ? "default" : "outline"}>4. Résultat</Badge>
              </div>

              {/* Étape 1: Upload */}
              {step === "upload" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Charger un fichier CSV
                    </CardTitle>
                    <CardDescription>
                      Sélectionnez un fichier CSV contenant vos {activeTab === "molecules" ? "molécules" : "plantes"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-file"
                      />
                      <label htmlFor="csv-file" className="cursor-pointer flex flex-col items-center gap-4">
                        <FileText className="h-16 w-16 text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium">Cliquez pour sélectionner un fichier</p>
                          <p className="text-sm text-muted-foreground">ou glissez-déposez ici</p>
                        </div>
                        {file && (
                          <Badge variant="secondary" className="mt-2">
                            {file.name}
                          </Badge>
                        )}
                      </label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Étape 2: Mapping */}
              {step === "mapping" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      Mapping des colonnes
                    </CardTitle>
                    <CardDescription>
                      Associez les colonnes de votre CSV aux champs de la base de données
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      {csvHeaders.map((header) => (
                        <div key={header} className="flex items-center gap-4">
                          <div className="w-1/3">
                            <Badge variant="outline" className="w-full justify-center py-2">
                              {header}
                            </Badge>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="w-1/2">
                            <Select
                              value={columnMappings[header] || ""}
                              onValueChange={(value) => {
                                setColumnMappings(prev => ({
                                  ...prev,
                                  [header]: value,
                                }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un champ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">— Ignorer —</SelectItem>
                                {fields.map((field) => (
                                  <SelectItem key={field.name} value={field.name}>
                                    {field.label} {field.required && "*"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={handleReset}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Recommencer
                      </Button>
                      <Button onClick={() => setStep("preview")}>
                        <Eye className="h-4 w-4 mr-2" />
                        Prévisualiser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Étape 3: Prévisualisation avec édition */}
              {step === "preview" && (
                <>
                  {/* Statistiques */}
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{previewStats.total}</div>
                        <p className="text-xs text-muted-foreground">Total lignes</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-600">{previewStats.selected}</div>
                        <p className="text-xs text-muted-foreground">Sélectionnées</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">{previewStats.valid}</div>
                        <p className="text-xs text-muted-foreground">Valides</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-red-600">{previewStats.invalid}</div>
                        <p className="text-xs text-muted-foreground">À corriger</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Prévisualisation et correction des données
                        </span>
                        <div className="flex gap-2">
                          {previewStats.invalid > 0 && (
                            <Button variant="outline" size="sm" onClick={autoFixAllErrors}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Corriger tout automatiquement
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => toggleAllSelection(true)}>
                            Tout sélectionner
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => toggleAllSelection(false)}>
                            Tout désélectionner
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        Cliquez sur une ligne pour la modifier. Les lignes en rouge contiennent des erreurs à corriger.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">✓</TableHead>
                              <TableHead className="w-16">Statut</TableHead>
                              {mappedColumns.map(({ csvCol, label, required }) => (
                                <TableHead key={csvCol}>
                                  {label} {required && <span className="text-red-500">*</span>}
                                </TableHead>
                              ))}
                              <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {validatedRows.map((row, index) => (
                              <TableRow 
                                key={index} 
                                className={`${!row.valid ? "bg-red-50 dark:bg-red-950/20" : ""} ${editingRow === index ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={row.selected}
                                    onCheckedChange={() => toggleRowSelection(index)}
                                  />
                                </TableCell>
                                <TableCell>
                                  {row.valid ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <div className="flex items-center gap-1" title={row.errors.join("\n")}>
                                      <XCircle className="h-4 w-4 text-red-600" />
                                      <span className="text-xs text-red-600">{row.errors.length}</span>
                                    </div>
                                  )}
                                </TableCell>
                                {mappedColumns.map(({ csvCol }) => (
                                  <TableCell key={csvCol} className="max-w-[200px]">
                                    {editingRow === index ? (
                                      <Input
                                        value={editingData[csvCol] || ""}
                                        onChange={(e) => setEditingData(prev => ({
                                          ...prev,
                                          [csvCol]: e.target.value,
                                        }))}
                                        className="h-8 text-sm"
                                      />
                                    ) : (
                                      <span className="truncate block" title={row.data[csvCol]}>
                                        {row.data[csvCol] || <span className="text-muted-foreground">-</span>}
                                      </span>
                                    )}
                                  </TableCell>
                                ))}
                                <TableCell>
                                  <div className="flex gap-1">
                                    {editingRow === index ? (
                                      <>
                                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveInlineEdit}>
                                          <Save className="h-3 w-3 text-green-600" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancelInlineEdit}>
                                          <X className="h-3 w-3 text-red-600" />
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startInlineEdit(index)} title="Édition rapide">
                                          <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEditDialog(index)} title="Édition détaillée">
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                        {!row.valid && (
                                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => autoFixRow(index)} title="Correction auto">
                                            <RefreshCw className="h-3 w-3 text-orange-500" />
                                          </Button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {previewStats.invalid > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Lignes avec erreurs détectées</AlertTitle>
                      <AlertDescription>
                        {previewStats.invalid} lignes contiennent des erreurs. Vous pouvez les corriger manuellement 
                        ou utiliser la correction automatique. Les lignes non corrigées ne seront pas importées.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep("mapping")}>
                      Retour au mapping
                    </Button>
                    <Button 
                      onClick={handleImport} 
                      disabled={importing || previewStats.valid === 0}
                      className="flex-1"
                    >
                      {importing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Importation en cours...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Importer {previewStats.valid} {activeTab === "molecules" ? "molécules" : "plantes"} valides
                        </>
                      )}
                    </Button>
                  </div>

                  {importing && (
                    <Progress value={importProgress} className="w-full" />
                  )}
                </>
              )}

              {/* Étape 4: Résultat */}
              {step === "result" && importResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {importResult.success > 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      Résultat de l'importation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <div className="text-5xl font-bold text-green-600 mb-2">
                        {importResult.success}
                      </div>
                      <p className="text-muted-foreground">
                        {activeTab === "molecules" ? "molécules" : "plantes"} importées avec succès
                      </p>
                    </div>

                    {importResult.errors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Erreurs ({importResult.errors.length})</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside mt-2 max-h-32 overflow-y-auto">
                            {importResult.errors.slice(0, 10).map((error, i) => (
                              <li key={i} className="text-sm">{error}</li>
                            ))}
                            {importResult.errors.length > 10 && (
                              <li className="text-sm">... et {importResult.errors.length - 10} autres erreurs</li>
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-4 justify-center pt-4">
                      <Button variant="outline" onClick={handleReset}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Nouvelle importation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Dialog d'édition détaillée */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Édition détaillée de la ligne</DialogTitle>
            <DialogDescription>
              Modifiez les valeurs de cette ligne. Les champs marqués d'un * sont obligatoires.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {mappedColumns.map(({ csvCol, label, required }) => (
              <div key={csvCol} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={csvCol} className="text-right">
                  {label} {required && <span className="text-red-500">*</span>}
                </Label>
                {csvCol.toLowerCase().includes("note") || csvCol.toLowerCase().includes("description") ? (
                  <Textarea
                    id={csvCol}
                    value={editDialogData[csvCol] || ""}
                    onChange={(e) => setEditDialogData(prev => ({
                      ...prev,
                      [csvCol]: e.target.value,
                    }))}
                    className="col-span-3"
                    rows={3}
                  />
                ) : (
                  <Input
                    id={csvCol}
                    value={editDialogData[csvCol] || ""}
                    onChange={(e) => setEditDialogData(prev => ({
                      ...prev,
                      [csvCol]: e.target.value,
                    }))}
                    className="col-span-3"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Afficher les erreurs de validation en temps réel */}
          {editDialogRowIndex !== null && (
            (() => {
              const errors = validateRow(editDialogData);
              if (errors.length > 0) {
                return (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erreurs de validation</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        {errors.map((error, i) => (
                          <li key={i} className="text-sm">{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                );
              }
              return (
                <Alert className="mb-4 border-green-500 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Validation réussie</AlertTitle>
                  <AlertDescription>
                    Toutes les données sont valides.
                  </AlertDescription>
                </Alert>
              );
            })()
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveDialogEdit}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
