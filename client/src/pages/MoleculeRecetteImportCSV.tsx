import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  Trash2,
  Save
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ParsedRow {
  moleculeName: string;
  recetteName: string;
  proportion?: number;
  role?: string;
  notes?: string;
  isValid: boolean;
  error?: string;
}

export default function MoleculeRecetteImportCSV() {
  const [csvContent, setCsvContent] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    imported: number;
    skipped?: number;
    duplicates?: number;
    errors: string[];
  } | null>(null);

  const utils = trpc.useUtils();

  // Queries pour la validation
  const { data: molecules } = trpc.molecules?.list.useQuery();
  const { data: recettes } = trpc.recettes?.list.useQuery();

  // Mutation
  const importLinks = trpc.molecules?.bulkImportRecettes.useMutation({
    onSuccess: (result) => {
      setImportResult(result);
      if (result.imported > 0) {
        toast.success(`${result.imported} liaison(s) importée(s) avec succès !`);
        utils.molecules?.getRecetteAuditStats.invalidate();
        utils.molecules?.getAllRecetteRelationsWithNames.invalidate();
      }
      if (result.duplicates && result.duplicates > 0) {
        toast.info(`${result.duplicates} doublon(s) ignoré(s)`);
      }
      if (result.errors.length > 0) {
        toast.warning(`${result.errors.length} erreur(s) lors de l'import`);
      }
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  // Maps pour la validation
  const moleculeNameSet = useMemo(() => {
    if (!molecules) return new Set<string>();
    return new Set(molecules?.map((m: any) => m.name.toLowerCase()));
  }, [molecules]);

  const recetteNameSet = useMemo(() => {
    if (!recettes) return new Set<string>();
    return new Set(recettes?.map((r: any) => r.name.toLowerCase()));
  }, [recettes]);

  // Parser le CSV
  const parseCSV = useCallback(() => {
    if (!csvContent.trim()) {
      toast.warning("Veuillez coller du contenu CSV");
      return;
    }

    const lines = csvContent.trim().split("\n");
    if (lines.length < 2) {
      toast.warning("Le CSV doit contenir au moins une ligne d'en-tête et une ligne de données");
      return;
    }

    // Détecter le séparateur
    const separator = lines[0].includes(";") ? ";" : ",";
    
    // Parser l'en-tête
    const headers = lines[0].split(separator).map(h => h.trim().toLowerCase());
    
    // Mapper les colonnes
    const columnMap: Record<string, number> = {};
    headers.forEach((h, i) => {
      if (h.includes("molecule") || h === "molécule" || h === "molecule_name") {
        columnMap["moleculeName"] = i;
      } else if (h.includes("recette") || h === "recipe" || h === "recette_name") {
        columnMap["recetteName"] = i;
      } else if (h === "proportion" || h === "%") {
        columnMap["proportion"] = i;
      } else if (h === "role" || h === "rôle") {
        columnMap["role"] = i;
      } else if (h === "notes" || h === "note") {
        columnMap["notes"] = i;
      }
    });

    if (columnMap["moleculeName"] === undefined || columnMap["recetteName"] === undefined) {
      toast.error("Colonnes requises manquantes : 'molecule' et 'recette'");
      return;
    }

    // Parser les lignes de données
    const rows: ParsedRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(separator).map(v => v.trim());
      const moleculeName = values[columnMap["moleculeName"]] || "";
      const recetteName = values[columnMap["recetteName"]] || "";
      const proportion = columnMap["proportion"] !== undefined 
        ? parseFloat(values[columnMap["proportion"]]) || undefined 
        : undefined;
      const role = columnMap["role"] !== undefined ? values[columnMap["role"]] : undefined;
      const notes = columnMap["notes"] !== undefined ? values[columnMap["notes"]] : undefined;

      // Validation
      let isValid = true;
      let error: string | undefined;

      if (!moleculeName) {
        isValid = false;
        error = "Nom de molécule manquant";
      } else if (!recetteName) {
        isValid = false;
        error = "Nom de recette manquant";
      } else if (!moleculeNameSet.has(moleculeName.toLowerCase())) {
        isValid = false;
        error = `Molécule "${moleculeName}" non trouvée`;
      } else if (!recetteNameSet.has(recetteName.toLowerCase())) {
        isValid = false;
        error = `Recette "${recetteName}" non trouvée`;
      }

      rows.push({
        moleculeName,
        recetteName,
        proportion,
        role,
        notes,
        isValid,
        error,
      });
    }

    setParsedRows(rows);
    setImportResult(null);

    const validCount = rows.filter(r => r.isValid).length;
    const invalidCount = rows.length - validCount;
    toast.success(`${rows.length} ligne(s) analysée(s) : ${validCount} valide(s), ${invalidCount} invalide(s)`);
  }, [csvContent, moleculeNameSet, recetteNameSet]);

  // Importer les données
  const handleImport = useCallback(() => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      toast.warning("Aucune ligne valide à importer");
      return;
    }

    importLinks.mutate(validRows.map(r => ({
      moleculeName: r.moleculeName,
      recetteName: r.recetteName,
      proportion: r.proportion,
      role: r.role,
      notes: r.notes,
    })));
  }, [parsedRows, importLinks]);

  // Télécharger le template
  const downloadTemplate = useCallback(() => {
    const template = "molecule;recette;proportion;role;notes\nLinalol;Résine CBD #1;15;cœur;Note exemple\nMyrcène;Résine CBD #2;20;fond;";
    const blob = new Blob([template], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_molecule_recette.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const validRowsCount = parsedRows.filter(r => r.isValid).length;
  const invalidRowsCount = parsedRows.length - validRowsCount;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/molecule-recette-linking">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour Liaisons
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Import CSV Molécule ↔ Recette</h1>
                  <p className="text-muted-foreground">
                    Importez des liaisons en masse depuis un fichier CSV
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Format du fichier CSV
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      <strong>Colonnes requises :</strong> molecule, recette<br />
                      <strong>Colonnes optionnelles :</strong> proportion, role (tête/cœur/fond), notes<br />
                      <strong>Séparateurs supportés :</strong> virgule (,) ou point-virgule (;)
                    </AlertDescription>
                  </Alert>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le template CSV
                  </Button>
                </CardContent>
              </Card>

              {/* Zone de saisie */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Coller le contenu CSV</CardTitle>
                  <CardDescription>
                    Collez directement le contenu de votre fichier CSV ci-dessous
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="molecule;recette;proportion;role;notes&#10;Linalol;Résine CBD #1;15;cœur;Note exemple&#10;Myrcène;Résine CBD #2;20;fond;"
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={parseCSV} disabled={!csvContent.trim()}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Analyser le CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCsvContent("");
                        setParsedRows([]);
                        setImportResult(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Effacer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Prévisualisation */}
              {parsedRows.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Prévisualisation
                      <Badge variant="secondary">{parsedRows.length} ligne(s)</Badge>
                      {validRowsCount > 0 && (
                        <Badge variant="default" className="bg-green-500">
                          {validRowsCount} valide(s)
                        </Badge>
                      )}
                      {invalidRowsCount > 0 && (
                        <Badge variant="destructive">
                          {invalidRowsCount} invalide(s)
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border max-h-[400px] overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-8">État</TableHead>
                            <TableHead>Molécule</TableHead>
                            <TableHead>Recette</TableHead>
                            <TableHead>Proportion</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Erreur</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parsedRows.map((row, index) => (
                            <TableRow key={index} className={!row.isValid ? "bg-destructive/10" : ""}>
                              <TableCell>
                                {row.isValid ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-destructive" />
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{row.moleculeName}</TableCell>
                              <TableCell>{row.recetteName}</TableCell>
                              <TableCell>{row.proportion || "-"}</TableCell>
                              <TableCell>{row.role || "-"}</TableCell>
                              <TableCell className="max-w-[150px] truncate">{row.notes || "-"}</TableCell>
                              <TableCell className="text-destructive text-sm">{row.error || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={handleImport}
                        disabled={validRowsCount === 0 || importLinks.isPending}
                      >
                        {importLinks.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Importer {validRowsCount} liaison(s)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Résultat de l'import */}
              {importResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {importResult.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                      Résultat de l'import
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 bg-green-500/10 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
                        <div className="text-sm text-muted-foreground">Importées</div>
                      </div>
                      <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-600">{importResult.duplicates || 0}</div>
                        <div className="text-sm text-muted-foreground">Doublons</div>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{importResult.skipped || 0}</div>
                        <div className="text-sm text-muted-foreground">Ignorées</div>
                      </div>
                      <div className="p-3 bg-destructive/10 rounded-lg text-center">
                        <div className="text-2xl font-bold text-destructive">{importResult.errors.length}</div>
                        <div className="text-sm text-muted-foreground">Erreurs</div>
                      </div>
                    </div>

                    {importResult.errors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-medium mb-2">Erreurs rencontrées :</div>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {importResult.errors.slice(0, 10).map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                            {importResult.errors.length > 10 && (
                              <li>... et {importResult.errors.length - 10} autre(s)</li>
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
