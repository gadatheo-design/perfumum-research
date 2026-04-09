/**
 * WikidataSync.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin page for synchronizing plant variety genealogies with Wikidata
 * Allows searching, fetching details, enriching local data with Wikidata,
 * and importing conservation status, images, and parent taxa directly.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import {
  Search, RefreshCw, CheckCircle2, AlertCircle, ExternalLink,
  Lightbulb, MapPin, Shield, Image, GitBranch, Leaf, BookOpen,
  ChevronRight, Loader2, Download, Link2, AlertTriangle,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Recommendation {
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

interface WikidataEntityResult {
  qid: string;
  label: string;
  description: string;
  scientificName: string;
  taxonRank?: string;
  conservationStatus?: string;
  imageUrl?: string;
  parentTaxon?: string;
  hybrids: string[];
  distribution: string[];
}

interface ImportResult {
  success: boolean;
  message: string;
  plantId?: number;
  plantName?: string;
  matches?: Array<{ id: number; name: string; latinName: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: Action button for a recommendation
// ─────────────────────────────────────────────────────────────────────────────

function RecommendationCard({
  rec,
  wikidataEntity,
  scientificName,
}: {
  rec: Recommendation;
  wikidataEntity: WikidataEntityResult | null;
  scientificName: string;
}) {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const importConservation = trpc.wikidataSync.importConservationStatus.useMutation();
  const importImage = trpc.wikidataSync.importWikidataImage.useMutation();
  const linkToWikidata = trpc.wikidataSync.linkToWikidata.useMutation();

  const icons: Record<string, React.ReactNode> = {
    conservation: <Shield className="h-4 w-4 text-red-500" />,
    images: <Image className="h-4 w-4 text-purple-500" />,
    parents: <GitBranch className="h-4 w-4 text-blue-500" />,
    hybrids: <Leaf className="h-4 w-4 text-green-500" />,
    distribution: <MapPin className="h-4 w-4 text-orange-500" />,
    synonyms: <BookOpen className="h-4 w-4 text-gray-500" />,
  };

  const priorityColors: Record<string, string> = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-yellow-200 bg-yellow-50',
    low: 'border-gray-200 bg-gray-50',
  };

  const priorityLabel: Record<string, string> = {
    high: '🔴 Haute',
    medium: '🟡 Moyenne',
    low: '🟢 Basse',
  };

  // Determine if this recommendation has an importable action
  const canImport =
    wikidataEntity &&
    ((rec.type === 'conservation' && wikidataEntity.conservationStatus) ||
      (rec.type === 'images' && wikidataEntity.imageUrl) ||
      (rec.type === 'parents' && wikidataEntity.parentTaxon));

  const handleImport = async () => {
    if (!wikidataEntity) return;
    setImporting(true);
    setImportResult(null);

    try {
      let result: ImportResult;

      if (rec.type === 'conservation' && wikidataEntity.conservationStatus) {
        result = await importConservation.mutateAsync({
          latinName: scientificName,
          wikidataQid: wikidataEntity.qid,
          conservationStatus: wikidataEntity.conservationStatus,
        });
      } else if (rec.type === 'images' && wikidataEntity.imageUrl) {
        result = await importImage.mutateAsync({
          latinName: scientificName,
          wikidataQid: wikidataEntity.qid,
          imageUrl: wikidataEntity.imageUrl,
        });
      } else if (rec.type === 'parents') {
        result = await linkToWikidata.mutateAsync({
          latinName: scientificName,
          wikidataQid: wikidataEntity.qid,
          parentTaxon: wikidataEntity.parentTaxon,
        });
      } else {
        return;
      }

      setImportResult(result);

      if (result.success) {
        toast({
          title: 'Import réussi',
          description: result.message,
        });
      } else {
        toast({
          title: 'Import partiel',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err?.message ?? 'Erreur lors de l\'import',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className={priorityColors[rec.priority] || 'border-gray-200'}>
      <CardContent className="py-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{icons[rec.type] || <ChevronRight className="h-4 w-4" />}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-medium text-sm">{rec.title}</span>
              <Badge variant="outline" className="text-xs">
                {priorityLabel[rec.priority] ?? rec.priority}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{rec.description}</p>
            {rec.action && (
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {rec.action}
              </p>
            )}

            {/* Import result feedback */}
            {importResult && (
              <div className={`mt-2 p-2 rounded text-xs flex items-start gap-1 ${importResult.success ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {importResult.success ? (
                  <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                )}
                <span>{importResult.message}</span>
              </div>
            )}

            {/* Ambiguous match list */}
            {importResult && !importResult.success && importResult.matches && importResult.matches.length > 1 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-gray-600">Plantes correspondantes :</p>
                {importResult.matches.map((m) => (
                  <div key={m.id} className="text-xs text-gray-500 pl-2">• {m.name} — <em>{m.latinName}</em></div>
                ))}
              </div>
            )}
          </div>

          {/* Import button */}
          {canImport && (
            <div className="shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={handleImport}
                disabled={importing || (importResult?.success === true)}
                className="text-xs h-7"
              >
                {importing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : importResult?.success ? (
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                ) : (
                  <>
                    <Download className="h-3 w-3 mr-1" />
                    Importer
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function WikidataSync() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [batchNames, setBatchNames] = useState('');

  // Recommendation state
  const [recGenus, setRecGenus] = useState('');
  const [recSpecies, setRecSpecies] = useState('');
  const [recCultivar, setRecCultivar] = useState('');
  const [recommendations, setRecommendations] = useState<any | null>(null);
  const [recLoading, setRecLoading] = useState(false);

  // Queries
  const statsQuery = trpc.wikidataSync.getStats.useQuery();
  const searchQuery_mutation = trpc.wikidataSync.searchTaxon.useMutation();
  const detailsQuery = trpc.wikidataSync.getTaxonDetails.useMutation();
  const batchQuery = trpc.wikidataSync.batchSearchTaxa.useMutation();
  const recommendationsMutation = trpc.wikidataSync.getEnrichmentRecommendations.useMutation();

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer un nom scientifique', variant: 'destructive' });
      return;
    }
    try {
      const result = await searchQuery_mutation.mutateAsync({ scientificName: searchQuery.trim() });
      setSelectedEntity(result);
    } catch (error) {
      toast({ title: 'Erreur', description: 'Taxon non trouvé sur Wikidata', variant: 'destructive' });
    }
  };

  // Handle get details
  const handleGetDetails = async () => {
    if (!searchQuery.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer un nom scientifique', variant: 'destructive' });
      return;
    }
    try {
      const result = await detailsQuery.mutateAsync({ scientificName: searchQuery.trim() });
      setSelectedEntity(result);
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de la récupération des détails', variant: 'destructive' });
    }
  };

  // Handle batch search
  const handleBatchSearch = async () => {
    if (!batchNames.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer au moins un nom scientifique', variant: 'destructive' });
      return;
    }
    const names = batchNames.split('\n').map((n) => n.trim()).filter((n) => n.length > 0);
    if (names.length === 0) {
      toast({ title: 'Erreur', description: 'Veuillez entrer au moins un nom scientifique', variant: 'destructive' });
      return;
    }
    try {
      await batchQuery.mutateAsync({ scientificNames: names });
      toast({ title: 'Succès', description: `Recherche effectuée pour ${names.length} taxon(s)` });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de la recherche en masse', variant: 'destructive' });
    }
  };

  const scientificName = `${recGenus} ${recSpecies}${recCultivar ? ` '${recCultivar}'` : ''}`.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Synchronisation Wikidata</h1>
        <p className="text-gray-600">Enrichissez vos données de variétés avec les informations de Wikidata</p>
      </div>

      {/* Status */}
      {statsQuery.data && (
        <Alert variant={statsQuery.data.status === 'ok' ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {statsQuery.data.message}
            {statsQuery.data.timestamp && (
              <span className="text-xs ml-2">({new Date(statsQuery.data.timestamp).toLocaleTimeString()})</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Recherche unique</TabsTrigger>
          <TabsTrigger value="batch">Recherche en masse</TabsTrigger>
          <TabsTrigger value="enrichment">Recommandations</TabsTrigger>
        </TabsList>

        {/* TAB 1: SINGLE SEARCH */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rechercher un taxon</CardTitle>
              <CardDescription>
                Entrez un nom scientifique pour récupérer les données de Wikidata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom scientifique</label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g., Nicotiana tabacum"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" disabled={searchQuery_mutation.isPending}>
                      <Search className="w-4 h-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </div>
              </form>

              <Button
                onClick={handleGetDetails}
                variant="outline"
                disabled={detailsQuery.isPending || !searchQuery.trim()}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Récupérer les détails complets
              </Button>

              {/* Results */}
              {selectedEntity && (
                <div className="border-t pt-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedEntity.label}</h3>
                    <p className="text-sm text-gray-600">{selectedEntity.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedEntity.scientificName && (
                      <div>
                        <p className="font-semibold">Nom scientifique</p>
                        <p>{selectedEntity.scientificName}</p>
                      </div>
                    )}
                    {selectedEntity.taxonRank && (
                      <div>
                        <p className="font-semibold">Rang taxonomique</p>
                        <p>{selectedEntity.taxonRank}</p>
                      </div>
                    )}
                    {selectedEntity.conservationStatus && (
                      <div>
                        <p className="font-semibold">Statut de conservation</p>
                        <Badge>{selectedEntity.conservationStatus}</Badge>
                      </div>
                    )}
                    {selectedEntity.id && (
                      <div>
                        <p className="font-semibold">Wikidata ID</p>
                        <a
                          href={`https://www.wikidata.org/wiki/${selectedEntity.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {selectedEntity.id}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {selectedEntity.parentTaxon && (
                    <div>
                      <p className="font-semibold">Taxon parent</p>
                      <p>{selectedEntity.parentTaxon}</p>
                    </div>
                  )}

                  {selectedEntity.hybrids && selectedEntity.hybrids.length > 0 && (
                    <div>
                      <p className="font-semibold">Hybrides ({selectedEntity.hybrids.length})</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedEntity.hybrids.map((hybrid: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{hybrid}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEntity.distribution && selectedEntity.distribution.length > 0 && (
                    <div>
                      <p className="font-semibold">Distribution ({selectedEntity.distribution.length})</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedEntity.distribution.slice(0, 10).map((country: string, idx: number) => (
                          <Badge key={idx} variant="outline">{country}</Badge>
                        ))}
                        {selectedEntity.distribution.length > 10 && (
                          <Badge variant="outline">+{selectedEntity.distribution.length - 10}</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedEntity.imageUrl && (
                    <div>
                      <p className="font-semibold mb-2">Image</p>
                      <img
                        src={selectedEntity.imageUrl}
                        alt={selectedEntity.label}
                        className="max-h-48 rounded border object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: BATCH SEARCH */}
        <TabsContent value="batch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recherche en masse</CardTitle>
              <CardDescription>
                Entrez plusieurs noms scientifiques (un par ligne) pour les rechercher en lot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Noms scientifiques (un par ligne)</label>
                <textarea
                  className="w-full mt-2 p-3 border rounded-md text-sm font-mono min-h-[120px] resize-y"
                  placeholder={"Nicotiana tabacum\nCannabis sativa\nRosa damascena"}
                  value={batchNames}
                  onChange={(e) => setBatchNames(e.target.value)}
                />
              </div>
              <Button
                onClick={handleBatchSearch}
                disabled={batchQuery.isPending || !batchNames.trim()}
                className="w-full"
              >
                {batchQuery.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Recherche en cours...</>
                ) : (
                  <><Search className="w-4 h-4 mr-2" />Lancer la recherche en masse</>
                )}
              </Button>

              {batchQuery.data && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600 font-medium">✓ {batchQuery.data.found} trouvés</span>
                    <span className="text-red-600 font-medium">✗ {batchQuery.data.notFound} non trouvés</span>
                    <span className="text-gray-500">Total : {batchQuery.data.total}</span>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {batchQuery.data.results.map((r: any, idx: number) => (
                      <div key={idx} className={`flex items-center gap-2 p-2 rounded text-sm ${r.found ? 'bg-green-50' : 'bg-red-50'}`}>
                        {r.found ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                        )}
                        <span className="font-medium">{r.scientificName}</span>
                        {r.entity && (
                          <span className="text-gray-500 text-xs">— {r.entity.id}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: ENRICHMENT RECOMMENDATIONS */}
        <TabsContent value="enrichment" className="space-y-4">
          {/* Search form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Recommandations d'enrichissement
              </CardTitle>
              <CardDescription>
                Analysez une variété pour obtenir des suggestions d'enrichissement et importez les données directement dans la base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Genre *</label>
                  <Input
                    placeholder="ex: Nicotiana"
                    value={recGenus}
                    onChange={(e) => setRecGenus(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Espèce *</label>
                  <Input
                    placeholder="ex: tabacum"
                    value={recSpecies}
                    onChange={(e) => setRecSpecies(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Cultivar (optionnel)</label>
                  <Input
                    placeholder="ex: Basma"
                    value={recCultivar}
                    onChange={(e) => setRecCultivar(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={async () => {
                  if (!recGenus.trim() || !recSpecies.trim()) {
                    toast({ title: 'Erreur', description: 'Genre et espèce requis', variant: 'destructive' });
                    return;
                  }
                  setRecLoading(true);
                  setRecommendations(null);
                  try {
                    const result = await recommendationsMutation.mutateAsync({
                      genus: recGenus.trim(),
                      species: recSpecies.trim(),
                      cultivar: recCultivar.trim() || undefined,
                    });
                    setRecommendations(result);
                  } catch (err) {
                    toast({ title: 'Erreur', description: 'Impossible de générer les recommandations', variant: 'destructive' });
                  } finally {
                    setRecLoading(false);
                  }
                }}
                disabled={recLoading}
                className="w-full md:w-auto"
              >
                {recLoading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyse en cours...</>
                ) : (
                  <><Lightbulb className="h-4 w-4 mr-2" />Générer les recommandations</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {recommendations && (
            <div className="space-y-4">
              {/* Summary card */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Analyse de{' '}
                    <span className="italic">{recGenus} {recSpecies}{recCultivar ? ` '${recCultivar}'` : ''}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-700">{recommendations.recommendations?.length || 0}</div>
                      <div className="text-xs text-yellow-600">Recommandations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">{recommendations.wikidataEntity ? '✓' : '✗'}</div>
                      <div className="text-xs text-gray-600">Wikidata trouvé</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700 text-sm">{recommendations.wikidataEntity?.qid || '—'}</div>
                      <div className="text-xs text-gray-600">QID Wikidata</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {recommendations.wikidataEntity?.conservationStatus ? (
                          <Badge variant="outline">{recommendations.wikidataEntity.conservationStatus}</Badge>
                        ) : '—'}
                      </div>
                      <div className="text-xs text-gray-600">Statut IUCN</div>
                    </div>
                  </div>

                  {/* Wikidata image preview */}
                  {recommendations.wikidataEntity?.imageUrl && (
                    <div className="mt-3 flex items-start gap-3">
                      <img
                        src={recommendations.wikidataEntity.imageUrl}
                        alt={scientificName}
                        className="h-20 w-20 object-cover rounded border shrink-0"
                      />
                      <div className="text-xs text-gray-600">
                        <p className="font-medium mb-1">Image Wikidata disponible</p>
                        <p className="break-all">{recommendations.wikidataEntity.imageUrl.split('/').pop()}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations list — each card has its own import button */}
              {recommendations.recommendations && recommendations.recommendations.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Les boutons <strong>Importer</strong> mettent à jour directement la table <code>plants</code> de votre base de données.
                  </p>
                  {recommendations.recommendations.map((rec: Recommendation, idx: number) => (
                    <RecommendationCard
                      key={idx}
                      rec={rec}
                      wikidataEntity={recommendations.wikidataEntity}
                      scientificName={`${recGenus} ${recSpecies}`}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="py-6 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-700">Données complètes !</p>
                    <p className="text-sm text-green-600">Aucune recommandation d'enrichissement pour cette variété.</p>
                  </CardContent>
                </Card>
              )}

              {/* Wikidata external link */}
              {recommendations.wikidataEntity?.qid && (
                <div className="flex justify-end">
                  <a
                    href={`https://www.wikidata.org/wiki/${recommendations.wikidataEntity.qid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Voir sur Wikidata ({recommendations.wikidataEntity.qid})
                  </a>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>À propos de Wikidata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Wikidata</strong> est une base de données libre et collaborative contenant des informations
            structurées sur des millions d'entités, y compris les plantes et leurs variétés.
          </p>
          <p>
            Cette page utilise l'API SPARQL de Wikidata pour récupérer automatiquement les données taxonomiques,
            les hybrides, la distribution géographique et le statut de conservation des variétés de plantes.
          </p>
          <p>
            Les boutons <strong>Importer</strong> dans l'onglet Recommandations mettent à jour directement
            les champs <code>conservation_status</code>, <code>image_url</code> et <code>wikidata_qid</code>
            de la table <code>plants</code>.
          </p>
          <p>
            <a
              href="https://www.wikidata.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Visiter Wikidata →
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
