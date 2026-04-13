import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, BookOpen, ExternalLink, Check, AlertCircle, Download } from 'lucide-react';

interface EnrichmentResult {
  id: number;
  title: string;
  authors: string;
  year: number | null;
  journal: string | null;
  doi: string | null;
  source: 'crossref' | 'openalex';
  citationsCount?: number;
  pdfUrl?: string | null;
}

export default function BibliographicEnrichment() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('by-doi');
  const [doiInput, setDoiInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [enrichmentResults, setEnrichmentResults] = useState<EnrichmentResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<EnrichmentResult | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedBibliographyId, setSelectedBibliographyId] = useState<number | null>(null);

  // Procédures tRPC
  const enrichFromDOI = trpc.bibliography.enrichFromDOI.useQuery(
    { doi: doiInput },
    { enabled: false }
  );

  const enrichFromTitle = trpc.bibliography.enrichFromTitle.useQuery(
    { title: titleInput },
    { enabled: false }
  );

  const applyEnrichmentMutation = trpc.bibliography.applyEnrichment.useMutation({
    onSuccess: () => {
      toast({
        title: 'Enrichissement appliqué',
        description: 'Les métadonnées ont été sauvegardées en base.',
      });
      setShowApplyDialog(false);
      setSelectedResult(null);
    },
    onError: (err) => {
      toast({
        title: 'Erreur',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const handleSearchByDOI = async () => {
    if (!doiInput.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer un DOI', variant: 'destructive' });
      return;
    }
    try {
      const result = await enrichFromDOI.refetch();
      if (result.data) {
        setEnrichmentResults([{ ...result.data, id: 0, source: 'crossref' }]);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les métadonnées CrossRef',
        variant: 'destructive',
      });
    }
  };

  const handleSearchByTitle = async () => {
    if (!titleInput.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer un titre', variant: 'destructive' });
      return;
    }
    try {
      const result = await enrichFromTitle.refetch();
      if (result.data) {
        setEnrichmentResults(
          (result.data as EnrichmentResult[]).map((r, i) => ({
            ...r,
            id: i,
            source: 'openalex' as const,
          }))
        );
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les métadonnées OpenAlex',
        variant: 'destructive',
      });
    }
  };

  const handleApplyEnrichment = (result: EnrichmentResult) => {
    setSelectedResult(result);
    setShowApplyDialog(true);
  };

  const handleConfirmApply = async () => {
    if (!selectedResult || !selectedBibliographyId) return;

    applyEnrichmentMutation.mutate({
      id: selectedBibliographyId,
      title: selectedResult.title,
      authors: selectedResult.authors,
      year: selectedResult.year,
      journal: selectedResult.journal,
      doi: selectedResult.doi,
      pdfUrl: selectedResult.pdfUrl,
      citationsCount: selectedResult.citationsCount,
      source: selectedResult.source,
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Enrichissement Bibliographique
        </h1>
        <p className="text-muted-foreground mt-2">
          Enrichissez vos références bibliographiques avec les métadonnées de CrossRef et OpenAlex
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="by-doi">Par DOI (CrossRef)</TabsTrigger>
          <TabsTrigger value="by-title">Par Titre (OpenAlex)</TabsTrigger>
        </TabsList>

        {/* Recherche par DOI */}
        <TabsContent value="by-doi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enrichir via CrossRef</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doi-input">DOI</Label>
                <div className="flex gap-2">
                  <Input
                    id="doi-input"
                    placeholder="ex: 10.1038/nature12373 ou https://doi.org/10.1038/nature12373"
                    value={doiInput}
                    onChange={(e) => setDoiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchByDOI()}
                  />
                  <Button
                    onClick={handleSearchByDOI}
                    disabled={enrichFromDOI.isFetching}
                    className="gap-2"
                  >
                    {enrichFromDOI.isFetching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Rechercher
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recherche par Titre */}
        <TabsContent value="by-title" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enrichir via OpenAlex</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title-input">Titre de l'article</Label>
                <div className="flex gap-2">
                  <Input
                    id="title-input"
                    placeholder="ex: Molecular mechanisms of olfactory perception"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchByTitle()}
                  />
                  <Button
                    onClick={handleSearchByTitle}
                    disabled={enrichFromTitle.isFetching}
                    className="gap-2"
                  >
                    {enrichFromTitle.isFetching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Rechercher
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Résultats */}
      {enrichmentResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Résultats ({enrichmentResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enrichmentResults.map((result, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold line-clamp-2">{result.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {result.authors}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {result.year && (
                          <Badge variant="outline" className="text-xs">
                            {result.year}
                          </Badge>
                        )}
                        {result.journal && (
                          <Badge variant="outline" className="text-xs">
                            {result.journal}
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          {result.source === 'crossref' ? 'CrossRef' : 'OpenAlex'}
                        </Badge>
                        {result.citationsCount !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            {result.citationsCount} citations
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {result.doi && (
                        <a
                          href={`https://doi.org/${result.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {result.pdfUrl && (
                        <a
                          href={result.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApplyEnrichment(result)}
                        className="gap-1"
                      >
                        <Check className="h-3 w-3" />
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog d'application */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appliquer l'enrichissement</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Titre :</span> {selectedResult.title}
                </p>
                <p>
                  <span className="font-semibold">Auteurs :</span> {selectedResult.authors}
                </p>
                {selectedResult.year && (
                  <p>
                    <span className="font-semibold">Année :</span> {selectedResult.year}
                  </p>
                )}
                {selectedResult.journal && (
                  <p>
                    <span className="font-semibold">Journal :</span> {selectedResult.journal}
                  </p>
                )}
                {selectedResult.doi && (
                  <p>
                    <span className="font-semibold">DOI :</span> {selectedResult.doi}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bib-id">ID de la référence bibliographique</Label>
                <Input
                  id="bib-id"
                  type="number"
                  placeholder="Entrez l'ID de la référence"
                  value={selectedBibliographyId || ''}
                  onChange={(e) => setSelectedBibliographyId(e.target.value ? Number(e.target.value) : null)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirmApply}
                  disabled={!selectedBibliographyId || applyEnrichmentMutation.isPending}
                  className="gap-2"
                >
                  {applyEnrichmentMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Appliquer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
