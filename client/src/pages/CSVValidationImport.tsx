import { useState, useCallback, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Upload, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  FileText, 
  Leaf, 
  Beaker,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  RefreshCw,
  Download,
  Edit,
  Trash2,
  Info,
  HelpCircle,
  Eye,
  Check,
  X
} from "lucide-react";

// Types
interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
  suggestion?: string;
}

interface ParsedRow {
  rowIndex: number;
  data: Record<string, string>;
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  selected: boolean;
  isDuplicate: boolean;
  duplicateOf?: string;
}

interface ColumnMapping {
  csvColumn: string;
  dbField: string;
  required: boolean;
}

// Champs disponibles pour les molécules
const moleculeFields = [
  { name: "name", label: "Nom", required: true, description: "Nom courant de la molécule" },
  { name: "family", label: "Famille", required: false, description: "Famille chimique (terpène, aldéhyde...)" },
  { name: "chemicalClass", label: "Classe chimique", required: false, description: "Classification chimique détaillée" },
  { name: "casNumber", label: "Numéro CAS", required: false, description: "Identifiant CAS unique (format: XX-XX-X)" },
  { name: "iupacName", label: "Nom IUPAC", required: false, description: "Nomenclature IUPAC systématique" },
  { name: "chemicalFormula", label: "Formule chimique", required: false, description: "Formule brute (ex: C10H16)" },
  { name: "olfactiveProfile", label: "Profil olfactif", required: false, description: "Description de l'odeur" },
  { name: "sourceOrigin", label: "Sources botaniques", required: false, description: "Plantes sources" },
  { name: "molecularWeight", label: "Poids moléculaire", required: false, description: "Masse molaire en g/mol" },
  { name: "boilingPoint", label: "Point d'ébullition", required: false, description: "Température en °C" },
  { name: "notes", label: "Notes", required: false, description: "Remarques additionnelles" },
];

// Champs disponibles pour les plantes
const plantFields = [
  { name: "name", label: "Nom", required: true, description: "Nom commun de la plante" },
  { name: "latinName", label: "Nom latin", required: false, description: "Nom scientifique binomial" },
  { name: "family", label: "Famille botanique", required: false, description: "Famille botanique (Lamiaceae...)" },
  { name: "category", label: "Catégorie", required: true, description: "Type de plante (aromatique, fleur...)" },
  { name: "origin", label: "Origine", required: false, description: "Région d'origine" },
  { name: "habitat", label: "Habitat", required: false, description: "Type d'environnement" },
  { name: "olfactiveSignature", label: "Signature olfactive", required: false, description: "Caractéristiques olfactives" },
  { name: "dominantMolecules", label: "Molécules dominantes", required: false, description: "Principaux composants" },
  { name: "traditionalUse", label: "Usage traditionnel", required: false, description: "Utilisations historiques" },
  { name: "notes", label: "Notes", required: false, description: "Remarques additionnelles" },
];

// Champs pour les liaisons
const linkFields = [
  { name: "moleculeName", label: "Nom de la molécule", required: true, description: "Nom exact de la molécule" },
  { name: "plantName", label: "Nom de la plante", required: true, description: "Nom exact de la plante" },
  { name: "role", label: "Rôle", required: false, description: "majeur, secondaire, trace, variable" },
  { name: "percentage", label: "Pourcentage", required: false, description: "Pourcentage typique (0-100)" },
  { name: "notes", label: "Notes", required: false, description: "Remarques additionnelles" },
];

// Validations personnalisées
const validateCASNumber = (value: string): ValidationError | null => {
  if (!value) return null;
  const casRegex = /^\d{2,7}-\d{2}-\d$/;
  if (!casRegex.test(value)) {
    return {
      field: "casNumber",
      message: "Format CAS invalide",
      severity: "error",
      suggestion: "Le format doit être XX-XX-X (ex: 78-70-6)",
    };
  }
  return null;
};

const validateChemicalFormula = (value: string): ValidationError | null => {
  if (!value) return null;
  const formulaRegex = /^[A-Z][a-z]?(\d+)?([A-Z][a-z]?(\d+)?)*$/;
  if (!formulaRegex.test(value)) {
    return {
      field: "chemicalFormula",
      message: "Format de formule suspect",
      severity: "warning",
      suggestion: "Vérifiez le format (ex: C10H16O)",
    };
  }
  return null;
};

const validatePercentage = (value: string): ValidationError | null => {
  if (!value) return null;
  const num = parseFloat(value);
  if (isNaN(num) || num < 0 || num > 100) {
    return {
      field: "percentage",
      message: "Pourcentage invalide",
      severity: "error",
      suggestion: "Doit être un nombre entre 0 et 100",
    };
  }
  return null;
};

const validateRole = (value: string): ValidationError | null => {
  if (!value) return null;
  const validRoles = ["majeur", "secondaire", "trace", "variable"];
  if (!validRoles.includes(value.toLowerCase())) {
    return {
      field: "role",
      message: "Rôle non reconnu",
      severity: "warning",
      suggestion: `Valeurs acceptées: ${validRoles.join(", ")}`,
    };
  }
  return null;
};

const validateCategory = (value: string): ValidationError | null => {
  if (!value) return null;
  const validCategories = ["aromatique", "tabac", "cannabis", "resine", "bois", "fleur", "racine", "autre"];
  if (!validCategories.includes(value.toLowerCase())) {
    return {
      field: "category",
      message: "Catégorie non reconnue",
      severity: "warning",
      suggestion: `Valeurs acceptées: ${validCategories.join(", ")}`,
    };
  }
  return null;
};

export default function CSVValidationImport() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"molecules" | "plants" | "links">("molecules");
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [step, setStep] = useState<"upload" | "mapping" | "validation" | "review" | "result">("upload");
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Record<string, string>>({});

  // Queries pour la détection de doublons
  const { data: existingMolecules } = trpc.molecules.list.useQuery(undefined, {
    enabled: activeTab === "molecules" && step === "validation",
  });
  const { data: existingPlants } = trpc.plants.list.useQuery(undefined, {
    enabled: activeTab === "plants" && step === "validation",
  });

  // Mutations
  const importMoleculesMutation = trpc.importMolecules.useMutation();
  const importPlantsMutation = trpc.importPlants.useMutation();

  const fields = activeTab === "molecules" ? moleculeFields : activeTab === "plants" ? plantFields : linkFields;

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
      
      // Créer les lignes parsées initiales
      const parsed: ParsedRow[] = rows.map((row, index) => {
        const data: Record<string, string> = {};
        headers.forEach((header, i) => {
          data[header] = row[i] || "";
        });
        return {
          rowIndex: index + 2, // +2 car ligne 1 = headers
          data,
          valid: true,
          errors: [],
          warnings: [],
          selected: true,
          isDuplicate: false,
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

  // Validation avancée des données
  const validateRows = useCallback(() => {
    const existingNames = new Set<string>();
    
    // Collecter les noms existants en base
    if (activeTab === "molecules" && existingMolecules) {
      existingMolecules.forEach((m: any) => existingNames.add(m.name.toLowerCase()));
    } else if (activeTab === "plants" && existingPlants) {
      existingPlants.forEach((p: any) => existingNames.add(p.name.toLowerCase()));
    }

    const seenInFile = new Set<string>();

    const validated = parsedRows.map((row) => {
      const errors: ValidationError[] = [];
      const warnings: ValidationError[] = [];
      let isDuplicate = false;
      let duplicateOf: string | undefined;

      // Récupérer le nom mappé
      const nameColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === "name")?.[0];
      const name = nameColumn ? row.data[nameColumn]?.trim().toLowerCase() : "";

      // Vérifier les champs requis
      fields.filter(f => f.required).forEach((field) => {
        const mappedColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === field.name)?.[0];
        if (mappedColumn && !row.data[mappedColumn]?.trim()) {
          errors.push({
            field: field.name,
            message: `${field.label} est requis`,
            severity: "error",
          });
        }
      });

      // Vérifier les doublons
      if (name) {
        if (existingNames.has(name)) {
          isDuplicate = true;
          duplicateOf = "base de données";
          warnings.push({
            field: "name",
            message: "Doublon potentiel en base",
            severity: "warning",
            suggestion: "Vérifiez si cette entrée existe déjà",
          });
        } else if (seenInFile.has(name)) {
          isDuplicate = true;
          duplicateOf = "fichier CSV";
          warnings.push({
            field: "name",
            message: "Doublon dans le fichier",
            severity: "warning",
            suggestion: "Cette entrée apparaît plusieurs fois dans le CSV",
          });
        }
        seenInFile.add(name);
      }

      // Validations spécifiques selon le type
      if (activeTab === "molecules") {
        const casColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === "casNumber")?.[0];
        if (casColumn && row.data[casColumn]) {
          const casError = validateCASNumber(row.data[casColumn]);
          if (casError) errors.push(casError);
        }

        const formulaColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === "chemicalFormula")?.[0];
        if (formulaColumn && row.data[formulaColumn]) {
          const formulaError = validateChemicalFormula(row.data[formulaColumn]);
          if (formulaError) warnings.push(formulaError);
        }
      }

      if (activeTab === "plants") {
        const categoryColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === "category")?.[0];
        if (categoryColumn && row.data[categoryColumn]) {
          const categoryError = validateCategory(row.data[categoryColumn]);
          if (categoryError) warnings.push(categoryError);
        }
      }

      if (activeTab === "links") {
        const roleColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === "role")?.[0];
        if (roleColumn && row.data[roleColumn]) {
          const roleError = validateRole(row.data[roleColumn]);
          if (roleError) warnings.push(roleError);
        }

        const percentageColumn = Object.entries(columnMappings).find(([_, dbField]) => dbField === "percentage")?.[0];
        if (percentageColumn && row.data[percentageColumn]) {
          const percentageError = validatePercentage(row.data[percentageColumn]);
          if (percentageError) errors.push(percentageError);
        }
      }

      return {
        ...row,
        valid: errors.length === 0,
        errors,
        warnings,
        isDuplicate,
        duplicateOf,
      };
    });

    setParsedRows(validated);
    setStep("validation");
  }, [parsedRows, columnMappings, fields, activeTab, existingMolecules, existingPlants]);

  // Statistiques de validation
  const validationStats = useMemo(() => {
    const selected = parsedRows.filter(r => r.selected);
    const valid = selected.filter(r => r.valid && !r.isDuplicate);
    const withErrors = selected.filter(r => !r.valid);
    const withWarnings = selected.filter(r => r.warnings.length > 0);
    const duplicates = selected.filter(r => r.isDuplicate);
    
    return {
      total: parsedRows.length,
      selected: selected.length,
      valid: valid.length,
      withErrors: withErrors.length,
      withWarnings: withWarnings.length,
      duplicates: duplicates.length,
    };
  }, [parsedRows]);

  // Toggle sélection
  const toggleRowSelection = (index: number) => {
    setParsedRows(prev => prev.map((row, i) => 
      i === index ? { ...row, selected: !row.selected } : row
    ));
  };

  // Éditer une ligne
  const startEditing = (index: number) => {
    setEditingRow(index);
    setEditedData({ ...parsedRows[index].data });
  };

  const saveEdit = () => {
    if (editingRow === null) return;
    setParsedRows(prev => prev.map((row, i) => 
      i === editingRow ? { ...row, data: editedData } : row
    ));
    setEditingRow(null);
    setEditedData({});
    // Re-valider après édition
    setTimeout(validateRows, 100);
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditedData({});
  };

  // Supprimer une ligne
  const deleteRow = (index: number) => {
    setParsedRows(prev => prev.filter((_, i) => i !== index));
  };

  // Importer les données
  const handleImport = async () => {
    const rowsToImport = parsedRows.filter(r => r.selected && r.valid && !r.isDuplicate);
    if (rowsToImport.length === 0) {
      toast.error("Aucune ligne valide à importer");
      return;
    }

    setImporting(true);
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
            role: "",
            climaticAxis: "",
          })),
        });
      } else if (activeTab === "plants") {
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
            climaticAxis: "",
            traditionalUse: p.traditionalUse || "",
            absorbeUse: "",
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

      if (result) {
        setImportResult({
          success: result.imported,
          errors: result.errors,
        });
        setStep("result");
        toast.success(`${result.imported} éléments importés avec succès`);
      }
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-spacing bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <FileSpreadsheet className="h-5 w-5" />
                <span className="font-medium">Import CSV avec Validation</span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">Importez vos données en toute sécurité</h1>
              <p className="text-lg text-muted-foreground">
                Validation automatique des données, détection des doublons et correction des erreurs avant import.
              </p>
            </div>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-4 border-b">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                {["upload", "mapping", "validation", "review", "result"].map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      step === s ? "bg-primary text-primary-foreground" :
                      ["upload", "mapping", "validation", "review", "result"].indexOf(step) > i ? "bg-green-500 text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {["upload", "mapping", "validation", "review", "result"].indexOf(step) > i ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < 4 && <div className={`w-16 h-0.5 mx-2 ${
                      ["upload", "mapping", "validation", "review", "result"].indexOf(step) > i ? "bg-green-500" : "bg-muted"
                    }`} />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Upload</span>
                <span>Mapping</span>
                <span>Validation</span>
                <span>Révision</span>
                <span>Résultat</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {/* Type Selection */}
              <Tabs value={activeTab} onValueChange={(v) => {
                setActiveTab(v as any);
                handleReset();
              }} className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="molecules" className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Molécules
                  </TabsTrigger>
                  <TabsTrigger value="plants" className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Plantes
                  </TabsTrigger>
                  <TabsTrigger value="links" className="flex items-center gap-2" disabled>
                    <ArrowRight className="h-4 w-4" />
                    Liaisons (bientôt)
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {!user && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Connexion requise</AlertTitle>
                  <AlertDescription>
                    Vous devez être connecté pour importer des données.
                  </AlertDescription>
                </Alert>
              )}

              {/* Step: Upload */}
              {step === "upload" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Étape 1 : Charger le fichier CSV
                    </CardTitle>
                    <CardDescription>
                      Sélectionnez un fichier CSV contenant vos données. Les séparateurs , et ; sont supportés.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Input
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-upload"
                      />
                      <label htmlFor="csv-upload" className="cursor-pointer">
                        <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">
                          Cliquez pour sélectionner un fichier
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ou glissez-déposez votre fichier CSV ici
                        </p>
                      </label>
                    </div>

                    {/* Template Download */}
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Modèle de fichier</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Téléchargez un modèle CSV avec les colonnes recommandées pour {activeTab === "molecules" ? "les molécules" : "les plantes"}.
                      </p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Télécharger le modèle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Mapping */}
              {step === "mapping" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      Étape 2 : Mapper les colonnes
                    </CardTitle>
                    <CardDescription>
                      Associez chaque colonne CSV à un champ de la base de données. Les champs marqués * sont obligatoires.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {csvHeaders.map((header) => (
                        <div key={header} className="flex items-center gap-4">
                          <div className="w-1/3">
                            <Badge variant="outline" className="font-mono">
                              {header}
                            </Badge>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="w-1/2">
                            <Select
                              value={columnMappings[header] || ""}
                              onValueChange={(value) => setColumnMappings(prev => ({
                                ...prev,
                                [header]: value,
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un champ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">-- Ignorer --</SelectItem>
                                {fields.map((field) => (
                                  <SelectItem key={field.name} value={field.name}>
                                    <div className="flex items-center gap-2">
                                      <span>{field.label}</span>
                                      {field.required && <span className="text-red-500">*</span>}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                {fields.find(f => f.name === columnMappings[header])?.description || "Sélectionnez un champ"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button variant="outline" onClick={handleReset}>
                        Annuler
                      </Button>
                      <Button onClick={validateRows} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Valider les données
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step: Validation */}
              {(step === "validation" || step === "review") && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <p className="text-2xl font-bold">{validationStats.total}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <p className="text-2xl font-bold text-green-500">{validationStats.valid}</p>
                        <p className="text-xs text-muted-foreground">Valides</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <p className="text-2xl font-bold text-red-500">{validationStats.withErrors}</p>
                        <p className="text-xs text-muted-foreground">Erreurs</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <p className="text-2xl font-bold text-amber-500">{validationStats.withWarnings}</p>
                        <p className="text-xs text-muted-foreground">Avertissements</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <p className="text-2xl font-bold text-purple-500">{validationStats.duplicates}</p>
                        <p className="text-xs text-muted-foreground">Doublons</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Data Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Révision des données
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setParsedRows(prev => prev.map(r => ({ ...r, selected: true })));
                          }}>
                            Tout sélectionner
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => {
                            setParsedRows(prev => prev.map(r => ({ ...r, selected: r.valid && !r.isDuplicate })));
                          }}>
                            Sélectionner valides
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">
                                <Checkbox 
                                  checked={parsedRows.every(r => r.selected)}
                                  onCheckedChange={(checked) => {
                                    setParsedRows(prev => prev.map(r => ({ ...r, selected: !!checked })));
                                  }}
                                />
                              </TableHead>
                              <TableHead className="w-16">Ligne</TableHead>
                              <TableHead>Statut</TableHead>
                              {Object.entries(columnMappings).filter(([_, v]) => v).slice(0, 4).map(([csvCol, dbField]) => (
                                <TableHead key={csvCol}>{fields.find(f => f.name === dbField)?.label || dbField}</TableHead>
                              ))}
                              <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {parsedRows.map((row, index) => (
                              <TableRow key={index} className={!row.valid ? "bg-red-50 dark:bg-red-950/20" : row.isDuplicate ? "bg-amber-50 dark:bg-amber-950/20" : ""}>
                                <TableCell>
                                  <Checkbox 
                                    checked={row.selected}
                                    onCheckedChange={() => toggleRowSelection(index)}
                                  />
                                </TableCell>
                                <TableCell className="font-mono text-sm">{row.rowIndex}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    {row.valid && !row.isDuplicate ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : !row.valid ? (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    ) : (
                                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    )}
                                    {row.errors.length > 0 && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <Badge variant="destructive" className="text-xs">{row.errors.length}</Badge>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <ul className="text-sm">
                                              {row.errors.map((e, i) => (
                                                <li key={i}>{e.message}</li>
                                              ))}
                                            </ul>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                    {row.warnings.length > 0 && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <Badge variant="outline" className="text-xs text-amber-600">{row.warnings.length}</Badge>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <ul className="text-sm">
                                              {row.warnings.map((w, i) => (
                                                <li key={i}>{w.message}</li>
                                              ))}
                                            </ul>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                    {row.isDuplicate && (
                                      <Badge variant="outline" className="text-xs">Doublon</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                {Object.entries(columnMappings).filter(([_, v]) => v).slice(0, 4).map(([csvCol]) => (
                                  <TableCell key={csvCol} className="max-w-32 truncate">
                                    {row.data[csvCol] || "-"}
                                  </TableCell>
                                ))}
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => startEditing(index)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => deleteRow(index)}>
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>

                      <div className="flex justify-between mt-6">
                        <Button variant="outline" onClick={() => setStep("mapping")}>
                          Retour au mapping
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={validateRows} className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Re-valider
                          </Button>
                          <Button 
                            onClick={handleImport} 
                            disabled={importing || validationStats.valid === 0 || !user}
                            className="gap-2"
                          >
                            {importing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            Importer {validationStats.valid} lignes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Step: Result */}
              {step === "result" && importResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {importResult.success > 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      Résultat de l'import
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-4xl font-bold text-green-500 mb-2">{importResult.success}</p>
                      <p className="text-lg text-muted-foreground mb-6">
                        {activeTab === "molecules" ? "molécules" : "plantes"} importées avec succès
                      </p>

                      {importResult.errors.length > 0 && (
                        <Alert variant="destructive" className="mb-6 text-left">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Erreurs rencontrées</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc list-inside mt-2">
                              {importResult.errors.slice(0, 5).map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                              {importResult.errors.length > 5 && (
                                <li>... et {importResult.errors.length - 5} autres erreurs</li>
                              )}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button onClick={handleReset} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Nouvel import
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Edit Dialog */}
        <Dialog open={editingRow !== null} onOpenChange={() => cancelEdit()}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la ligne {editingRow !== null ? parsedRows[editingRow]?.rowIndex : ""}</DialogTitle>
              <DialogDescription>
                Corrigez les erreurs avant l'import.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
              {csvHeaders.map((header) => {
                const dbField = columnMappings[header];
                if (!dbField) return null;
                const field = fields.find(f => f.name === dbField);
                return (
                  <div key={header} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {field?.label || header}
                      {field?.required && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      value={editedData[header] || ""}
                      onChange={(e) => setEditedData(prev => ({ ...prev, [header]: e.target.value }))}
                    />
                    {field?.description && (
                      <p className="text-xs text-muted-foreground">{field.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cancelEdit}>Annuler</Button>
              <Button onClick={saveEdit}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
