/**
 * VarietyGenealogyImport.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin page for importing plant variety genealogies from CSV
 * Supports dry-run preview mode and batch import with validation
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function VarietyGenealogyImport() {
  const { toast } = useToast();
  const [csvData, setCsvData] = useState('');
  const [activeTab, setActiveTab] = useState('input');

  // Queries
  const templateQuery = trpc.varietyGenealogyImport.getTemplate.useQuery();
  const validateQuery = trpc.varietyGenealogyImport.validate.useMutation();
  const previewQuery = trpc.varietyGenealogyImport.preview.useMutation();

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvData(content);
      toast({
        title: 'Succès',
        description: 'Fichier CSV chargé',
      });
    };
    reader.onerror = () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la lecture du fichier',
        variant: 'destructive',
      });
    };
  };

  // Handle download template
  const handleDownloadTemplate = () => {
    if (!templateQuery.data) return;

    const element = document.createElement('a');
    const file = new Blob([templateQuery.data.template], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = 'variety-genealogy-template.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle validate
  const handleValidate = async () => {
    if (!csvData.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer ou charger des données CSV',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await validateQuery.mutateAsync({ csvData });
      if (result.valid) {
        toast({
          title: 'Succès',
          description: `CSV valide: ${result.rowCount} lignes, ${result.columnCount} colonnes`,
        });
        setActiveTab('preview');
        // Trigger preview
        await previewQuery.mutateAsync({ csvData, dryRun: true });
      } else {
        toast({
          title: 'Erreur de validation',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la validation',
        variant: 'destructive',
      });
    }
  };

  // Handle preview
  const handlePreview = async () => {
    if (!csvData.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer ou charger des données CSV',
        variant: 'destructive',
      });
      return;
    }

    try {
      await previewQuery.mutateAsync({ csvData, dryRun: true });
      setActiveTab('preview');
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la prévisualisation',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Import de généalogies de variétés</h1>
        <p className="text-gray-600">Importez en masse les généalogies de variétés depuis un fichier CSV</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Données CSV</TabsTrigger>
          <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
          <TabsTrigger value="template">Modèle</TabsTrigger>
        </TabsList>

        {/* TAB 1: CSV INPUT */}
        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Charger les données CSV</CardTitle>
              <CardDescription>
                Collez vos données CSV ou téléchargez un fichier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="text-sm font-medium">Fichier CSV</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="mt-2 block w-full"
                />
              </div>

              {/* CSV Textarea */}
              <div>
                <label className="text-sm font-medium">Ou collez les données CSV</label>
                <Textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  placeholder="name,species,genus,parentName,relationType,year,origin,description&#10;Basma,tabacum,Nicotiana,,,,Turkey,Traditional Turkish tobacco&#10;Samsun,tabacum,Nicotiana,Basma,hybrid,1950,Turkey,Hybrid of Basma and Oriental"
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleValidate} disabled={validateQuery.isPending}>
                  {validateQuery.isPending ? 'Validation...' : 'Valider'}
                </Button>
                <Button onClick={handlePreview} variant="outline" disabled={previewQuery.isPending}>
                  {previewQuery.isPending ? 'Prévisualisation...' : 'Prévisualiser'}
                </Button>
                <Button onClick={handleDownloadTemplate} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le modèle
                </Button>
              </div>

              {/* Info */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Les colonnes requises sont: <strong>name</strong>, <strong>species</strong>, <strong>genus</strong>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: PREVIEW */}
        <TabsContent value="preview" className="space-y-4">
          {previewQuery.isPending ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-600">Génération de la prévisualisation...</p>
              </CardContent>
            </Card>
          ) : previewQuery.data ? (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{previewQuery.data.stats.totalRows}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Valides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {previewQuery.data.stats.validRows}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avertissements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {previewQuery.data.stats.warningRows}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {previewQuery.data.stats.errorRows}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu des données</CardTitle>
                  <CardDescription>
                    {previewQuery.data.stats.errorRows > 0 && (
                      <span className="text-red-600">
                        {previewQuery.data.stats.errorRows} erreur(s) détectée(s)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ligne</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Espèce</TableHead>
                          <TableHead>Genre</TableHead>
                          <TableHead>Parent</TableHead>
                          <TableHead>Type relation</TableHead>
                          <TableHead>Message</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewQuery.data.preview.map((row) => (
                          <TableRow key={row.rowNumber}>
                            <TableCell className="font-mono text-sm">{row.rowNumber}</TableCell>
                            <TableCell>
                              {row.status === 'valid' && (
                                <Badge variant="default" className="gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Valide
                                </Badge>
                              )}
                              {row.status === 'warning' && (
                                <Badge variant="secondary" className="gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Avertissement
                                </Badge>
                              )}
                              {row.status === 'error' && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Erreur
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{row.name}</TableCell>
                            <TableCell>{row.species}</TableCell>
                            <TableCell>{row.genus}</TableCell>
                            <TableCell>{row.parentName || '-'}</TableCell>
                            <TableCell>{row.relationType || '-'}</TableCell>
                            <TableCell className="text-sm text-gray-600">{row.message || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Import Button */}
              {previewQuery.data.stats.errorRows === 0 && (
                <div className="flex gap-2">
                  <Button size="lg" disabled={previewQuery.data.stats.validRows === 0}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importer {previewQuery.data.stats.validRows} variété(s)
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setActiveTab('input')}
                  >
                    Modifier les données
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <p>Aucune prévisualisation disponible. Validez d'abord les données.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB 3: TEMPLATE */}
        <TabsContent value="template" className="space-y-4">
          {templateQuery.data && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Modèle CSV</CardTitle>
                  <CardDescription>
                    Format et colonnes requises pour l'import
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Column Documentation */}
                  <div>
                    <h3 className="font-semibold mb-3">Colonnes</h3>
                    <div className="space-y-2">
                      {templateQuery.data.columns.map((col) => (
                        <div key={col.name} className="border-l-4 border-blue-500 pl-3 py-2">
                          <p className="font-mono text-sm font-semibold">
                            {col.name}
                            {col.required && <span className="text-red-600"> *</span>}
                          </p>
                          <p className="text-sm text-gray-600">{col.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Example */}
                  <div>
                    <h3 className="font-semibold mb-2">Exemple</h3>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                      {templateQuery.data.template}
                    </pre>
                  </div>

                  {/* Download Button */}
                  <Button onClick={handleDownloadTemplate} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le modèle CSV
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
