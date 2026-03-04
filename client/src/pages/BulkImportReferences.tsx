// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Upload, Download, CheckCircle, AlertCircle, Loader2, Eye, EyeOff, FileText } from 'lucide-react';

type EntityType = 'molecule' | 'recette' | 'plant' | 'prototype' | 'tradition' | 'terroir' | 'supplier' | 'leaf_economy';
type LinkType = 'documents' | 'mentions' | 'analyzes' | 'conserves' | 'reconstructs' | 'sources' | 'validates' | 'contextualizes';

interface ParsedLink {
  referenceId: number;
  entityType: EntityType;
  entityId: number;
  linkType?: LinkType;
  relevanceScore?: number;
  notes?: string;
  context?: string;
}

export default function BulkImportReferences() {
  const [csvContent, setCSVContent] = useState('');
  const [parsedLinks, setParsedLinks] = useState<ParsedLink[]>([]);
  const [validationErrors, setValidationErrors] = useState<Array<{ row: number; error: string }>>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const importMutation = trpc.referenceEntityLinks.bulkImportFromCSV.useMutation();

  const parseCSV = (content: string) => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      setValidationErrors([{ row: 0, error: 'CSV must contain at least a header row and one data row' }]);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredColumns = ['referenceid', 'entitytype', 'entityid'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
      setValidationErrors([{ row: 0, error: `Missing required columns: ${missingColumns.join(', ')}` }]);
      return;
    }

    const errors: Array<{ row: number; error: string }> = [];
    const parsed: ParsedLink[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      if (!row.referenceid || !row.entitytype || !row.entityid) {
        errors.push({ row: i + 1, error: 'Missing required fields' });
        continue;
      }

      const refId = parseInt(row.referenceid);
      const entId = parseInt(row.entityid);
      const score = row.relevancescore ? parseInt(row.relevancescore) : undefined;

      if (isNaN(refId) || isNaN(entId)) {
        errors.push({ row: i + 1, error: 'referenceId and entityId must be numbers' });
        continue;
      }

      if (score && (isNaN(score) || score < 0 || score > 100)) {
        errors.push({ row: i + 1, error: 'relevanceScore must be between 0 and 100' });
        continue;
      }

      const validEntityTypes: EntityType[] = ['leaf_economy', 'molecule', 'recette', 'plant', 'prototype', 'tradition', 'terroir', 'supplier'];
      if (!validEntityTypes.includes(row.entitytype as EntityType)) {
        errors.push({ row: i + 1, error: `Invalid entityType: ${row.entitytype}` });
        continue;
      }

      parsed.push({
        referenceId: refId,
        entityType: row.entitytype as EntityType,
        entityId: entId,
        linkType: row.linktype as LinkType | undefined,
        relevanceScore: score,
        notes: row.notes,
        context: row.context,
      });
    }

    setValidationErrors(errors);
    setParsedLinks(parsed);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCSVContent(content);
      parseCSV(content);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (parsedLinks.length === 0) {
      setValidationErrors([{ row: 0, error: 'No valid links to import' }]);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await importMutation.mutateAsync(parsedLinks);
      setImportResult(result);
      setShowResultDialog(true);
      setCSVContent('');
      setParsedLinks([]);
      setValidationErrors([]);
    } catch (error: any) {
      setValidationErrors([{ row: 0, error: error.message || 'Import failed' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `referenceId,entityType,entityId,linkType,relevanceScore,notes,context
1,molecule,1,documents,75,Sample note,Sample context
2,plant,2,mentions,60,Another note,Another context`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reference_links_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Références', href: '/references-v3' }, { label: 'Importation en masse' }]} />

        <div className="mt-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Importation en masse des liaisons</h1>
            <p className="text-muted-foreground mt-2">Importez plusieurs liaisons références-entités à partir d'un fichier CSV</p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5" />Télécharger un fichier CSV</CardTitle>
                <CardDescription>Préparez un fichier CSV avec les colonnes requises</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Fichier CSV</label>
                  <Input type="file" accept=".csv" onChange={handleFileUpload} className="cursor-pointer" />
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2"><FileText className="w-4 h-4" />Colonnes requises</h3>
                  <ul className="text-sm space-y-1 ml-6 list-disc">
                    <li><code className="bg-background px-2 py-1 rounded">referenceId</code> - ID de la référence</li>
                    <li><code className="bg-background px-2 py-1 rounded">entityType</code> - Type d'entité</li>
                    <li><code className="bg-background px-2 py-1 rounded">entityId</code> - ID de l'entité</li>
                  </ul>
                </div>

                <Button variant="outline" onClick={downloadTemplate} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger un modèle
                </Button>
              </CardContent>
            </Card>

            {validationErrors.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-900 flex items-center gap-2"><AlertCircle className="w-5 h-5" />Erreurs de validation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {validationErrors.map((error, idx) => (
                      <div key={idx} className="text-sm text-red-800">
                        <span className="font-semibold">Ligne {error.row}:</span> {error.error}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {parsedLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Eye className="w-5 h-5" />Aperçu ({parsedLinks.length} liaisons)</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showPreview && (
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {parsedLinks.slice(0, 10).map((link, idx) => (
                        <div key={idx} className="text-sm border-l-4 border-blue-500 pl-3 py-2">
                          <div className="font-semibold">Ref {link.referenceId} → {link.entityType} {link.entityId}</div>
                          {link.relevanceScore && <div className="text-muted-foreground">Score: {link.relevanceScore}</div>}
                        </div>
                      ))}
                      {parsedLinks.length > 10 && <div className="text-sm text-muted-foreground">... et {parsedLinks.length - 10} autres</div>}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {parsedLinks.length > 0 && validationErrors.length === 0 && (
              <Button onClick={handleImport} disabled={isSubmitting} size="lg" className="w-full">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Importer {parsedLinks.length} liaisons
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {importResult?.success ? (
                <><CheckCircle className="w-5 h-5 text-green-600" />Importation réussie</>
              ) : (
                <><AlertCircle className="w-5 h-5 text-red-600" />Importation partielle</>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{importResult?.created} liaison(s) créée(s) avec succès</p>
            </div>
            {importResult?.errors && importResult.errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-red-900 mb-2">{importResult.errors.length} erreur(s)</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {importResult.errors.slice(0, 5).map((error: any, idx: number) => (
                    <div key={idx} className="text-xs text-red-800">
                      <span className="font-semibold">Ligne {error.row}:</span> {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={() => setShowResultDialog(false)} className="w-full">Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
