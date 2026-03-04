// @ts-nocheck
import { useState, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  FileArchive,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ImageIcon,
  Loader2,
  Info,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export default function BatchImport() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("upload");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  
  const zipInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const { data: csvTemplate } = trpc.batchImport.getCsvTemplate.useQuery();
  const validateCsvMutation = trpc.batchImport.validateCsv.useMutation();
  const importZipMutation = trpc.batchImport.importZip.useMutation();

  const handleZipSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.zip')) {
        toast.error("Veuillez sélectionner un fichier ZIP");
        return;
      }
      setZipFile(file);
      setImportResult(null);
    }
  };

  const handleCsvSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      setCsvContent(text);
      setValidationResult(null);
    }
  };

  const handleValidateCsv = async () => {
    if (!csvContent.trim()) {
      toast.error("Veuillez d'abord charger ou saisir un fichier CSV");
      return;
    }
    
    setIsValidating(true);
    try {
      const result = await validateCsvMutation.mutateAsync({ csvContent });
      setValidationResult(result);
      if (result.valid) {
        toast.success(`CSV valide: ${result.validRows} lignes prêtes à importer`);
      } else {
        toast.error(result.error || "Le CSV contient des erreurs");
      }
    } catch (error) {
      toast.error("Erreur lors de la validation du CSV");
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!zipFile) {
      toast.error("Veuillez sélectionner un fichier ZIP");
      return;
    }
    if (!csvContent.trim()) {
      toast.error("Veuillez charger un fichier CSV de métadonnées");
      return;
    }
    if (!validationResult?.valid) {
      toast.error("Veuillez d'abord valider le CSV");
      return;
    }

    setIsImporting(true);
    try {
      const zipBuffer = await zipFile.arrayBuffer();
      const zipBase64 = btoa(
        new Uint8Array(zipBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const result = await importZipMutation.mutateAsync({
        zipData: zipBase64,
        csvContent,
      });

      setImportResult(result);
      setActiveTab("results");
      
      if (result.successCount === result.totalProcessed) {
        toast.success(`Import réussi: ${result.successCount} images importées`);
      } else {
        toast.warning(`Import partiel: ${result.successCount}/${result.totalProcessed} images importées`);
      }
    } catch (error) {
      toast.error("Erreur lors de l'import");
    } finally {
      setIsImporting(false);
    }
  };

  const handleCopyTemplate = () => {
    if (csvTemplate) {
      const templateCsv = csvTemplate.headers.join(',') + '\n' + csvTemplate.example;
      navigator.clipboard.writeText(templateCsv);
      setCopiedTemplate(true);
      toast.success("Modèle CSV copié dans le presse-papiers");
      setTimeout(() => setCopiedTemplate(false), 2000);
    }
  };

  const handleDownloadTemplate = () => {
    if (csvTemplate) {
      const templateCsv = csvTemplate.headers.join(',') + '\n' + csvTemplate.example;
      const blob = new Blob([templateCsv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modele_import_images.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900">
        <div className="container max-w-4xl py-16 px-4">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Connexion requise</h3>
              <p className="text-muted-foreground mb-6">
                Vous devez être connecté pour utiliser l'import batch d'images.
              </p>
              <Button asChild>
                <a href="/api/oauth/login">Se connecter</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 px-4">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/galerie" className="hover:text-white transition-colors">Galerie</Link>
            <span>/</span>
            <span>Import batch</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-800">
              <FileArchive className="h-8 w-8 text-slate-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Import batch d'images</h1>
              <p className="text-slate-400">
                Importez plusieurs images d'un coup avec un fichier ZIP et des métadonnées CSV
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-4xl py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2" disabled={!validationResult}>
              <FileSpreadsheet className="h-4 w-4" />
              Prévisualisation
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2" disabled={!importResult}>
              <CheckCircle2 className="h-4 w-4" />
              Résultats
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Comment utiliser l'import batch</AlertTitle>
              <AlertDescription>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Préparez un fichier ZIP contenant vos images</li>
                  <li>Créez un fichier CSV avec les métadonnées (utilisez le modèle ci-dessous)</li>
                  <li>Uploadez les deux fichiers et validez le CSV</li>
                  <li>Lancez l'import</li>
                </ol>
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Modèle CSV
                </CardTitle>
                <CardDescription>
                  Téléchargez ou copiez le modèle CSV pour préparer vos métadonnées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleDownloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le modèle
                  </Button>
                  <Button variant="outline" onClick={handleCopyTemplate}>
                    {copiedTemplate ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copiedTemplate ? "Copié !" : "Copier"}
                  </Button>
                </div>
                
                {csvTemplate && (
                  <div className="bg-muted/50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Colonnes disponibles:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {csvTemplate.instructions.map((instruction: string, i: number) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileArchive className="h-5 w-5" />
                    Fichier ZIP
                  </CardTitle>
                  <CardDescription>
                    Archive contenant les images à importer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    ref={zipInputRef}
                    type="file"
                    accept=".zip"
                    onChange={handleZipSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => zipInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    {zipFile ? (
                      <div className="space-y-2">
                        <CheckCircle2 className="h-8 w-8 mx-auto text-green-500" />
                        <p className="font-medium">{zipFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(zipFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Cliquez pour sélectionner un fichier ZIP
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Fichier CSV
                  </CardTitle>
                  <CardDescription>
                    Métadonnées des images (ou saisissez manuellement)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => csvInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Charger un fichier CSV
                  </Button>
                  <Textarea
                    placeholder="Ou collez/saisissez le contenu CSV ici..."
                    value={csvContent}
                    onChange={(e) => {
                      setCsvContent(e.target.value);
                      setValidationResult(null);
                    }}
                    className="min-h-[150px] font-mono text-sm"
                  />
                  <Button
                    onClick={handleValidateCsv}
                    disabled={!csvContent.trim() || isValidating}
                    className="w-full"
                  >
                    {isValidating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Valider le CSV
                  </Button>
                </CardContent>
              </Card>
            </div>

            {validationResult && (
              <Alert variant={validationResult.valid ? "default" : "destructive"}>
                {validationResult.valid ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {validationResult.valid ? "CSV valide" : "Erreurs dans le CSV"}
                </AlertTitle>
                <AlertDescription>
                  {validationResult.valid ? (
                    <span>
                      {validationResult.validRows} ligne(s) prête(s) à importer.
                      <Button
                        variant="link"
                        className="p-0 h-auto ml-2"
                        onClick={() => setActiveTab("preview")}
                      >
                        Voir la prévisualisation →
                      </Button>
                    </span>
                  ) : (
                    validationResult.error
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-4">
              <Link href="/galerie">
                <Button variant="outline">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Retour à la galerie
                </Button>
              </Link>
              <Button
                onClick={handleImport}
                disabled={!zipFile || !validationResult?.valid || isImporting}
                size="lg"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Lancer l'import
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            {validationResult && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Prévisualisation des données</h3>
                    <p className="text-sm text-muted-foreground">
                      {validationResult.validRows} ligne(s) valide(s) sur {validationResult.totalRows}
                    </p>
                  </div>
                  <Badge variant={validationResult.valid ? "default" : "destructive"}>
                    {validationResult.valid ? "Prêt à importer" : "Erreurs détectées"}
                  </Badge>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">État</TableHead>
                            <TableHead>Fichier</TableHead>
                            <TableHead>Titre</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>LeafEconomy ID</TableHead>
                            <TableHead>Tags</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {validationResult.rows.map((row: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                {row.valid ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {row.filename || "-"}
                              </TableCell>
                              <TableCell>{row.title || "-"}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{row.category || "echantillon"}</Badge>
                              </TableCell>
                              <TableCell>{row.leafEconomyId || "-"}</TableCell>
                              <TableCell>
                                {row.tags?.length > 0 ? (
                                  <div className="flex gap-1 flex-wrap">
                                    {row.tags.map((tag: string, i: number) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setActiveTab("upload")}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={!zipFile || !validationResult?.valid || isImporting}
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Import en cours...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Lancer l'import
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {importResult && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {importResult.successCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Images importées</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold text-red-600">
                        {importResult.errorCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Erreurs</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold">
                        {importResult.totalProcessed}
                      </p>
                      <p className="text-sm text-muted-foreground">Total traité</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>
                          {Math.round((importResult.successCount / importResult.totalProcessed) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(importResult.successCount / importResult.totalProcessed) * 100}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Détails de l'import</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">État</TableHead>
                            <TableHead>Fichier</TableHead>
                            <TableHead>Résultat</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {importResult.results.map((result: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                {result.success ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {result.filename}
                              </TableCell>
                              <TableCell>
                                {result.success ? (
                                  <span className="text-green-600">
                                    Importé avec succès (ID: {result.imageId})
                                  </span>
                                ) : (
                                  <span className="text-red-600">{result.error}</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setZipFile(null);
                      setCsvContent("");
                      setValidationResult(null);
                      setImportResult(null);
                      setActiveTab("upload");
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Nouvel import
                  </Button>
                  <Link href="/galerie">
                    <Button>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Voir la galerie
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
