// @ts-nocheck
import { useState, useCallback, useMemo } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  FileText, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Play,
  Info,
  X
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ParsedRow {
  plantId?: number;
  plantName?: string;
  terroirId?: number;
  terroirName?: string;
  localName?: string;
  cultivationStart?: number;
  annualProduction?: string;
  qualityNotes?: string;
  notes?: string;
  status: 'valid' | 'warning' | 'error';
  message?: string;
}

export default function PlantTerroirImportCSV() {
  const [activeTab, setActiveTab] = useState("upload");
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

  // Queries pour validation
  const { data: plants } = trpc.plants.list.useQuery();
  const { data: terroirs } = trpc.terroirs.getAll.useQuery();
  const { data: existingRelations } = trpc.plantTerroirs.getAllWithNames.useQuery();

  // Mutation pour l'import
  const importMutation = trpc.plantTerroirs.bulkImport.useMutation({
    onSuccess: (result) => {
      setImportResult(result);
      if (result.imported > 0) {
        toast.success(`${result.imported} liaison(s) importée(s) avec succès !`);
        utils.plantTerroirs.getAllWithNames.invalidate();
        utils.plantTerroirs.getAuditStats.invalidate();
        utils.plantTerroirs.getNetworkStats.invalidate();
      }
      if (result.duplicates && result.duplicates > 0) {
        toast.info(`${result.duplicates} liaison(s) ignorée(s) (déjà existantes)`);
      }
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} erreur(s) lors de l'import`);
      }
      setActiveTab("results");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Maps pour la validation
  const plantNameMap = useMemo(() => {
    if (!plants) return new Map<string, number>();
    const map = new Map<string, number>();
    plants.forEach((p: any) => {
      map.set(p.name.toLowerCase(), p.id);
      if (p.latinName) {
        map.set(p.latinName.toLowerCase(), p.id);
      }
    });
    return map;
  }, [plants]);

  const terroirNameMap = useMemo(() => {
    if (!terroirs) return new Map<string, number>();
    const map = new Map<string, number>();
    terroirs.forEach((t: any) => {
      map.set(t.name.toLowerCase(), t.id);
    });
    return map;
  }, [terroirs]);

  const existingSet = useMemo(() => {
    if (!existingRelations) return new Set<string>();
    return new Set(existingRelations.map(r => `${r.plantId}-${r.terroirId}`));
  }, [existingRelations]);

  // Parser le CSV
  const parseCSV = useCallback((content: string) => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      toast.error("Le fichier CSV doit contenir au moins une ligne d'en-tête et une ligne de données");
      return;
    }

    // Parser l'en-tête
    const headerLine = lines[0];
    const separator = headerLine.includes(';') ? ';' : ',';
    const headers = headerLine.split(separator).map(h => h.trim().toLowerCase().replace(/"/g, ''));

    // Mapper les colonnes
    const columnMap: Record<string, number> = {};
    const expectedColumns = ['plantid', 'plantname', 'plant_name', 'plante', 'terroirid', 'terroirname', 'terroir_name', 'terroir', 'localname', 'local_name', 'nom_local', 'cultivationstart', 'cultivation_start', 'annee_debut', 'annualproduction', 'annual_production', 'production', 'qualitynotes', 'quality_notes', 'qualite', 'notes'];
    
    headers.forEach((h, i) => {
      if (h.includes('plant') && h.includes('id')) columnMap['plantId'] = i;
      else if (h.includes('plant') && (h.includes('name') || h.includes('nom'))) columnMap['plantName'] = i;
      else if (h === 'plante' || h === 'plant') columnMap['plantName'] = i;
      else if (h.includes('terroir') && h.includes('id')) columnMap['terroirId'] = i;
      else if (h.includes('terroir') && (h.includes('name') || h.includes('nom'))) columnMap['terroirName'] = i;
      else if (h === 'terroir') columnMap['terroirName'] = i;
      else if (h.includes('local') || h.includes('nom_local')) columnMap['localName'] = i;
      else if (h.includes('cultivation') || h.includes('annee') || h.includes('debut')) columnMap['cultivationStart'] = i;
      else if (h.includes('production')) columnMap['annualProduction'] = i;
      else if (h.includes('qualit')) columnMap['qualityNotes'] = i;
      else if (h === 'notes') columnMap['notes'] = i;
    });

    // Parser les lignes de données
    const rows: ParsedRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(separator).map(v => v.trim().replace(/"/g, ''));
      
      const row: ParsedRow = {
        status: 'valid',
      };

      // Extraire les valeurs
      if (columnMap['plantId'] !== undefined) {
        const val = values[columnMap['plantId']];
        if (val && !isNaN(parseInt(val))) {
          row.plantId = parseInt(val);
        }
      }
      if (columnMap['plantName'] !== undefined) {
        row.plantName = values[columnMap['plantName']];
      }
      if (columnMap['terroirId'] !== undefined) {
        const val = values[columnMap['terroirId']];
        if (val && !isNaN(parseInt(val))) {
          row.terroirId = parseInt(val);
        }
      }
      if (columnMap['terroirName'] !== undefined) {
        row.terroirName = values[columnMap['terroirName']];
      }
      if (columnMap['localName'] !== undefined) {
        row.localName = values[columnMap['localName']];
      }
      if (columnMap['cultivationStart'] !== undefined) {
        const val = values[columnMap['cultivationStart']];
        if (val && !isNaN(parseInt(val))) {
          row.cultivationStart = parseInt(val);
        }
      }
      if (columnMap['annualProduction'] !== undefined) {
        row.annualProduction = values[columnMap['annualProduction']];
      }
      if (columnMap['qualityNotes'] !== undefined) {
        row.qualityNotes = values[columnMap['qualityNotes']];
      }
      if (columnMap['notes'] !== undefined) {
        row.notes = values[columnMap['notes']];
      }

      // Valider la ligne
      let resolvedPlantId = row.plantId;
      let resolvedTerroirId = row.terroirId;

      // Résoudre l'ID de la plante par nom si nécessaire
      if (!resolvedPlantId && row.plantName) {
        resolvedPlantId = plantNameMap.get(row.plantName.toLowerCase());
        if (resolvedPlantId) {
          row.plantId = resolvedPlantId;
        }
      }

      // Résoudre l'ID du terroir par nom si nécessaire
      if (!resolvedTerroirId && row.terroirName) {
        resolvedTerroirId = terroirNameMap.get(row.terroirName.toLowerCase());
        if (resolvedTerroirId) {
          row.terroirId = resolvedTerroirId;
        }
      }

      // Vérifier les erreurs
      if (!resolvedPlantId && !row.plantName) {
        row.status = 'error';
        row.message = 'Plante non spécifiée';
      } else if (!resolvedPlantId) {
        row.status = 'error';
        row.message = `Plante non trouvée: "${row.plantName}"`;
      } else if (!resolvedTerroirId && !row.terroirName) {
        row.status = 'error';
        row.message = 'Terroir non spécifié';
      } else if (!resolvedTerroirId) {
        row.status = 'error';
        row.message = `Terroir non trouvé: "${row.terroirName}"`;
      } else if (existingSet.has(`${resolvedPlantId}-${resolvedTerroirId}`)) {
        row.status = 'warning';
        row.message = 'Liaison déjà existante';
      }

      rows.push(row);
    }

    setParsedRows(rows);
    setActiveTab("preview");
    
    const validCount = rows.filter(r => r.status === 'valid').length;
    const warningCount = rows.filter(r => r.status === 'warning').length;
    const errorCount = rows.filter(r => r.status === 'error').length;
    
    toast.success(`${rows.length} ligne(s) parsée(s): ${validCount} valide(s), ${warningCount} avertissement(s), ${errorCount} erreur(s)`);
  }, [plantNameMap, terroirNameMap, existingSet]);

  // Gérer l'upload de fichier
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      parseCSV(content);
    };
    reader.readAsText(file);
  };

  // Lancer l'import
  const handleImport = () => {
    const validRows = parsedRows.filter(r => r.status === 'valid' || r.status === 'warning');
    if (validRows.length === 0) {
      toast.error("Aucune ligne valide à importer");
      return;
    }

    importMutation.mutate(validRows.map(r => ({
      plantId: r.plantId,
      plantName: r.plantName,
      terroirId: r.terroirId,
      terroirName: r.terroirName,
      localName: r.localName,
      cultivationStart: r.cultivationStart,
      annualProduction: r.annualProduction,
      qualityNotes: r.qualityNotes,
      notes: r.notes,
    })));
  };

  // Télécharger le template CSV
  const downloadTemplate = () => {
    const template = `plantName;terroirName;localName;cultivationStart;annualProduction;qualityNotes;notes
Lavande;Provence, France;Lavande fine;1950;500 tonnes;Qualité exceptionnelle;Notes supplémentaires
Rose;Grasse, France;Rose de mai;1800;100 tonnes;AOC;`;
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_liaisons_plante_terroir.csv';
    link.click();
  };

  // Statistiques de prévisualisation
  const previewStats = useMemo(() => {
    return {
      total: parsedRows.length,
      valid: parsedRows.filter(r => r.status === 'valid').length,
      warning: parsedRows.filter(r => r.status === 'warning').length,
      error: parsedRows.filter(r => r.status === 'error').length,
    };
  }, [parsedRows]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/plant-terroir-linking">
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
                  <h1 className="text-4xl font-bold">Import CSV des Liaisons</h1>
                  <p className="text-muted-foreground">
                    Importez des liaisons plante-terroir en masse depuis un fichier CSV
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2" disabled={parsedRows.length === 0}>
                    <Eye className="h-4 w-4" />
                    Prévisualisation
                    {parsedRows.length > 0 && <Badge variant="secondary">{parsedRows.length}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="results" className="flex items-center gap-2" disabled={!importResult}>
                    <CheckCircle2 className="h-4 w-4" />
                    Résultats
                  </TabsTrigger>
                </TabsList>

                {/* Tab Upload */}
                <TabsContent value="upload" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Format du fichier CSV
                        </CardTitle>
                        <CardDescription>
                          Colonnes attendues (séparateur: virgule ou point-virgule)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="rounded-lg border p-4 bg-muted/30">
                            <h4 className="font-medium mb-2">Colonnes obligatoires (au moins une paire):</h4>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li><code className="bg-muted px-1 rounded">plantId</code> ou <code className="bg-muted px-1 rounded">plantName</code></li>
                              <li><code className="bg-muted px-1 rounded">terroirId</code> ou <code className="bg-muted px-1 rounded">terroirName</code></li>
                            </ul>
                          </div>
                          <div className="rounded-lg border p-4 bg-muted/30">
                            <h4 className="font-medium mb-2">Colonnes optionnelles:</h4>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              <li><code className="bg-muted px-1 rounded">localName</code> - Nom local de la plante</li>
                              <li><code className="bg-muted px-1 rounded">cultivationStart</code> - Année de début</li>
                              <li><code className="bg-muted px-1 rounded">annualProduction</code> - Production annuelle</li>
                              <li><code className="bg-muted px-1 rounded">qualityNotes</code> - Notes qualité</li>
                              <li><code className="bg-muted px-1 rounded">notes</code> - Notes générales</li>
                            </ul>
                          </div>
                          <Button variant="outline" onClick={downloadTemplate} className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger le template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Upload className="h-5 w-5" />
                          Charger un fichier
                        </CardTitle>
                        <CardDescription>
                          Sélectionnez un fichier CSV ou collez le contenu
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                            <Input
                              type="file"
                              accept=".csv,.txt"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="csv-upload"
                            />
                            <label htmlFor="csv-upload" className="cursor-pointer">
                              <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                              <p className="font-medium">Cliquez pour sélectionner un fichier</p>
                              <p className="text-sm text-muted-foreground">ou glissez-déposez ici</p>
                            </label>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-background px-2 text-muted-foreground">ou</span>
                            </div>
                          </div>

                          <Textarea
                            placeholder="Collez le contenu CSV ici..."
                            value={csvContent}
                            onChange={(e) => setCsvContent(e.target.value)}
                            className="min-h-[150px] font-mono text-sm"
                          />

                          <Button 
                            onClick={() => parseCSV(csvContent)} 
                            disabled={!csvContent.trim()}
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Prévisualiser
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Conseil</AlertTitle>
                    <AlertDescription>
                      Vous pouvez utiliser soit les IDs (plantId, terroirId) soit les noms (plantName, terroirName). 
                      Le système recherchera automatiquement les correspondances dans la base de données.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                {/* Tab Prévisualisation */}
                <TabsContent value="preview" className="space-y-6">
                  {/* Statistiques */}
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{previewStats.total}</p>
                          <p className="text-sm text-muted-foreground">Total lignes</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{previewStats.valid}</p>
                          <p className="text-sm text-muted-foreground">Valides</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-amber-600">{previewStats.warning}</p>
                          <p className="text-sm text-muted-foreground">Avertissements</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{previewStats.error}</p>
                          <p className="text-sm text-muted-foreground">Erreurs</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Table de prévisualisation */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Prévisualisation des données</CardTitle>
                          <CardDescription>
                            Vérifiez les données avant l'import
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => {
                            setCsvContent("");
                            setParsedRows([]);
                            setActiveTab("upload");
                          }}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Effacer
                          </Button>
                          <Button 
                            onClick={handleImport}
                            disabled={previewStats.valid === 0 || importMutation.isPending}
                          >
                            {importMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Importer ({previewStats.valid + previewStats.warning})
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">Status</TableHead>
                              <TableHead>Plante</TableHead>
                              <TableHead>Terroir</TableHead>
                              <TableHead>Nom local</TableHead>
                              <TableHead>Notes</TableHead>
                              <TableHead>Message</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {parsedRows.map((row, index) => (
                              <TableRow key={index} className={
                                row.status === 'error' ? 'bg-red-500/5' :
                                row.status === 'warning' ? 'bg-amber-500/5' : ''
                              }>
                                <TableCell>
                                  {row.status === 'valid' && (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  )}
                                  {row.status === 'warning' && (
                                    <AlertCircle className="h-5 w-5 text-amber-600" />
                                  )}
                                  {row.status === 'error' && (
                                    <X className="h-5 w-5 text-red-600" />
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{row.plantName || `#${row.plantId}`}</p>
                                    {row.plantId && <p className="text-xs text-muted-foreground">ID: {row.plantId}</p>}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{row.terroirName || `#${row.terroirId}`}</p>
                                    {row.terroirId && <p className="text-xs text-muted-foreground">ID: {row.terroirId}</p>}
                                  </div>
                                </TableCell>
                                <TableCell>{row.localName || '-'}</TableCell>
                                <TableCell className="max-w-[150px] truncate">{row.notes || '-'}</TableCell>
                                <TableCell>
                                  {row.message && (
                                    <Badge variant={row.status === 'error' ? 'destructive' : 'secondary'}>
                                      {row.message}
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Résultats */}
                <TabsContent value="results" className="space-y-6">
                  {importResult && (
                    <>
                      <Alert variant={importResult.success ? "default" : "destructive"}>
                        {importResult.success ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                          {importResult.success ? "Import terminé" : "Import échoué"}
                        </AlertTitle>
                        <AlertDescription>
                          {importResult.imported} liaison(s) importée(s), {importResult.duplicates} doublon(s) ignoré(s), {importResult.errors.length} erreur(s)
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-green-600">{importResult.imported}</p>
                              <p className="text-sm text-muted-foreground">Importées</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-amber-600">{importResult.duplicates}</p>
                              <p className="text-sm text-muted-foreground">Doublons ignorés</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-red-600">{importResult.errors.length}</p>
                              <p className="text-sm text-muted-foreground">Erreurs</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {importResult.errors.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                              <AlertCircle className="h-5 w-5" />
                              Erreurs détaillées
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[200px]">
                              <ul className="space-y-2">
                                {importResult.errors.map((error, index) => (
                                  <li key={index} className="text-sm text-red-600 bg-red-500/5 p-2 rounded">
                                    {error}
                                  </li>
                                ))}
                              </ul>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      )}

                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => {
                          setCsvContent("");
                          setParsedRows([]);
                          setImportResult(null);
                          setActiveTab("upload");
                        }}>
                          <Upload className="h-4 w-4 mr-2" />
                          Nouvel import
                        </Button>
                        <Link href="/plant-terroir-audit">
                          <Button>
                            Voir l'audit
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
