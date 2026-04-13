/**
 * WikidataSync.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Improved admin page for Wikidata synchronization
 * - Better visual design with status cards
 * - Enhanced recommendations with direct import
 * - Quick import tab for batch linking
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import {
  Search, RefreshCw, ExternalLink, CheckCircle2, AlertCircle, AlertTriangle,
  Loader2, Download, Lightbulb, ChevronRight, Globe, Leaf, Shield, Image,
  GitBranch, MapPin, Zap, Database, Link2,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Recommendation {
  type: 'conservation' | 'images' | 'parents' | 'hybrids' | 'distribution' | 'general' | 'synonyms';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: string;
}

interface ImportResult {
  success: boolean;
  message: string;
  matches?: Array<{ id: number; name: string; latinName: string }>;
}

/** Entite Wikidata retournee par les mutations cote client */
interface WikidataEntityClient {
  id?: string;
  qid?: string;
  label?: string;
  description?: string;
  scientificName?: string;
  taxonRank?: string;
  parentTaxon?: string;
  hybrids?: string[];
  distribution?: string[];
  conservationStatus?: string;
  imageUrl?: string;
}

/** Resultat d'un import rapide (Quick Import tab) */
interface QuickImportResult {
  name: string;
  qid: string | null;
  success: boolean;
  message: string;
}

/** Resultat d'une recherche en masse (Batch tab) */
interface BatchSearchResult {
  scientificName: string;
  found: boolean;
  entity?: { id: string } | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATION CARD
// ─────────────────────────────────────────────────────────────────────────────

const priorityColors: Record<string, string> = {
  high:   'border-l-4 border-l-red-400 bg-red-50/50',
  medium: 'border-l-4 border-l-yellow-400 bg-yellow-50/50',
  low:    'border-l-4 border-l-blue-300 bg-blue-50/30',
};

const priorityBadge: Record<string, string> = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low:    'bg-blue-100 text-blue-700',
};

const priorityLabel: Record<string, string> = {
  high: 'Haute priorité', medium: 'Priorité moyenne', low: 'Basse priorité',
};

const typeIcons: Record<string, React.ReactNode> = {
  conservation: <Shield className="h-4 w-4 text-green-600" />,
  images:       <Image className="h-4 w-4 text-purple-600" />,
  parents:      <GitBranch className="h-4 w-4 text-blue-600" />,
  hybrids:      <Leaf className="h-4 w-4 text-emerald-600" />,
  distribution: <MapPin className="h-4 w-4 text-orange-600" />,
  general:      <Globe className="h-4 w-4 text-gray-600" />,
};

function RecommendationCard({
  rec, wikidataEntity, scientificName,
}: {
  rec: Recommendation; wikidataEntity: WikidataEntityClient | null; scientificName: string;
}) {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  // Contrôles spécifiques à l'import d'image
  const [imageType, setImageType] = useState<'leaf' | 'flower' | 'fruit' | 'whole_plant' | 'other'>('whole_plant');
  const [forceOverwrite, setForceOverwrite] = useState(false);

  const importConservation = trpc.wikidataSync.importConservationStatus.useMutation();
  const importImage        = trpc.wikidataSync.importWikidataImage.useMutation();
  const linkToWikidata     = trpc.wikidataSync.linkToWikidata.useMutation();

  const canImport =
    wikidataEntity &&
    ((rec.type === 'conservation' && wikidataEntity.conservationStatus) ||
     (rec.type === 'images'       && wikidataEntity.imageUrl) ||
     (rec.type === 'parents'      && wikidataEntity.parentTaxon));

  const handleImport = async () => {
    if (!wikidataEntity) return;
    setImporting(true);
    setImportResult(null);
    try {
      let result: ImportResult;
      if (rec.type === 'conservation' && wikidataEntity.conservationStatus) {
        result = await importConservation.mutateAsync({
          latinName: scientificName, wikidataQid: wikidataEntity.qid ?? '',
          conservationStatus: wikidataEntity.conservationStatus ?? '',
        });
      } else if (rec.type === 'images' && wikidataEntity.imageUrl) {
        result = await importImage.mutateAsync({
          latinName: scientificName, wikidataQid: wikidataEntity.qid ?? '',
          imageUrl: wikidataEntity.imageUrl ?? '',
          imageType,
          forceOverwrite,
        });
      } else if (rec.type === 'parents') {
        result = await linkToWikidata.mutateAsync({
          latinName: scientificName, wikidataQid: wikidataEntity.qid ?? '',
          parentTaxon: wikidataEntity.parentTaxon,
        });
      } else { return; }

      setImportResult(result);
      toast({
        title: result.success ? 'Import réussi' : 'Import partiel',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l\'import';
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className={`rounded-lg p-4 ${priorityColors[rec.priority] || 'border border-gray-200'}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{typeIcons[rec.type] || <ChevronRight className="h-4 w-4" />}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm">{rec.title}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityBadge[rec.priority] || ''}`}>
              {priorityLabel[rec.priority] ?? rec.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{rec.description}</p>
          {rec.action && (
            <p className="text-xs text-blue-600 mt-1.5 flex items-center gap-1">
              <ChevronRight className="h-3 w-3 shrink-0" />{rec.action}
            </p>
          )}
          {importResult && (
            <div className={`mt-2 p-2 rounded text-xs flex items-start gap-1.5 ${importResult.success ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
              {importResult.success
                ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                : <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
              <span>{importResult.message}</span>
            </div>
          )}
          {importResult && !importResult.success && importResult.matches && importResult.matches.length > 1 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-gray-600">Plantes correspondantes :</p>
              {importResult.matches.map(m => (
                <div key={m.id} className="text-xs text-gray-500 pl-2">• {m.name} — <em>{m.latinName}</em></div>
              ))}
            </div>
          )}
          {/* Contrôles image : visibles uniquement pour les recommandations de type 'images' */}
          {rec.type === 'images' && canImport && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-500 shrink-0">Partie :</label>
                <select
                  value={imageType}
                  onChange={e => setImageType(e.target.value as typeof imageType)}
                  className="text-xs border rounded px-1.5 py-0.5 bg-white dark:bg-zinc-900 h-6"
                >
                  <option value="whole_plant">Plante entière</option>
                  <option value="flower">🌸 Fleur</option>
                  <option value="leaf">🍃 Feuille</option>
                  <option value="fruit">🍊 Fruit</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceOverwrite}
                  onChange={e => setForceOverwrite(e.target.checked)}
                  className="rounded h-3 w-3"
                />
                Écraser image existante
              </label>
            </div>
          )}
        </div>
        {canImport && (
          <div className="shrink-0">
            <Button size="sm" variant="outline" onClick={handleImport}
              disabled={importing || importResult?.success === true}
              className={`text-xs h-7 gap-1 ${importResult?.success ? 'border-green-300 text-green-700' : ''}`}>
              {importing
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : importResult?.success
                  ? <CheckCircle2 className="h-3 w-3 text-green-600" />
                  : <><Download className="h-3 w-3" />Importer</>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTITY CARD (search result display)
// ─────────────────────────────────────────────────────────────────────────────

function EntityCard({ entity }: { entity: WikidataEntityClient | null }) {
  if (!entity) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg italic">{entity.label || entity.scientificName}</h3>
          {entity.description && <p className="text-sm text-gray-500 mt-0.5">{entity.description}</p>}
        </div>
        {entity.id && (
          <a href={`https://www.wikidata.org/wiki/${entity.id}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline shrink-0">
            <ExternalLink className="w-3.5 h-3.5" />{entity.id}
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        {entity.scientificName && (
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-500 mb-0.5">Nom scientifique</p>
            <p className="font-medium italic">{entity.scientificName}</p>
          </div>
        )}
        {entity.taxonRank && (
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-500 mb-0.5">Rang taxonomique</p>
            <p className="font-medium">{entity.taxonRank}</p>
          </div>
        )}
        {entity.conservationStatus && (
          <div className="bg-green-50 rounded p-2">
            <p className="text-xs text-gray-500 mb-0.5">Statut IUCN</p>
            <Badge variant="outline" className="text-xs">{entity.conservationStatus}</Badge>
          </div>
        )}
        {entity.parentTaxon && (
          <div className="bg-blue-50 rounded p-2">
            <p className="text-xs text-gray-500 mb-0.5">Taxon parent</p>
            <p className="font-medium text-sm">{entity.parentTaxon}</p>
          </div>
        )}
      </div>

      {entity.hybrids && entity.hybrids.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-emerald-600" />Hybrides ({entity.hybrids.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {entity.hybrids.map((h: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">{h}</Badge>
            ))}
          </div>
        </div>
      )}

      {entity.distribution && entity.distribution.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-600" />Distribution ({entity.distribution.length} pays)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {entity.distribution.slice(0, 15).map((c: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
            ))}
            {entity.distribution.length > 15 && (
              <Badge variant="outline" className="text-xs text-gray-500">+{entity.distribution.length - 15}</Badge>
            )}
          </div>
        </div>
      )}

      {entity.imageUrl && (
        <div>
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <Image className="w-4 h-4 text-purple-600" />Image Wikidata
          </p>
          <div className="flex gap-3 items-start">
            <img src={entity.imageUrl} alt={entity.label}
              className="h-40 w-40 object-cover rounded-lg border shrink-0" />
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium text-gray-700">Disponible pour import</p>
              <p className="break-all">{entity.imageUrl.split('/').pop()}</p>
              <a href={entity.imageUrl} target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />Voir en plein écran
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function WikidataSync() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('search');

  // Search tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<WikidataEntityClient | null>(null);

  // Batch tab state
  const [batchNames, setBatchNames] = useState('');

  // Recommendations tab state
  const [recGenus, setRecGenus] = useState('');
  const [recSpecies, setRecSpecies] = useState('');
  const [recCultivar, setRecCultivar] = useState('');
  const [recommendations, setRecommendations] = useState<{ found: boolean; wikidataEntity: WikidataEntityClient | null; recommendations: Recommendation[] } | null>(null);
  const [recLoading, setRecLoading] = useState(false);

  // Quick import tab state
  const [quickNames, setQuickNames] = useState('');
  const [quickResults, setQuickResults] = useState<QuickImportResult[]>([]);
  const [quickLoading, setQuickLoading] = useState(false);

  // Queries & mutations
  const statsQuery = trpc.wikidataSync.getStats.useQuery();
  const searchMutation   = trpc.wikidataSync.searchTaxon.useMutation();
  const detailsMutation  = trpc.wikidataSync.getTaxonDetails.useMutation();
  const batchMutation    = trpc.wikidataSync.batchSearchTaxa.useMutation();
  const recMutation      = trpc.wikidataSync.getEnrichmentRecommendations.useMutation();
  const linkMutation     = trpc.wikidataSync.linkToWikidata.useMutation();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const result = await searchMutation.mutateAsync({ scientificName: searchQuery.trim() });
      setSelectedEntity(result);
    } catch {
      toast({ title: 'Taxon non trouvé', description: 'Aucune entrée Wikidata pour ce nom', variant: 'destructive' });
    }
  };

  const handleGetDetails = async () => {
    if (!searchQuery.trim()) return;
    try {
      const result = await detailsMutation.mutateAsync({ scientificName: searchQuery.trim() });
      setSelectedEntity(result);
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors de la récupération des détails', variant: 'destructive' });
    }
  };

  const handleBatchSearch = async () => {
    const names = batchNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    if (!names.length) return;
    try {
      await batchMutation.mutateAsync({ scientificNames: names });
      toast({ title: 'Succès', description: `Recherche effectuée pour ${names.length} taxon(s)` });
    } catch {
      toast({ title: 'Erreur', description: 'Erreur lors de la recherche en masse', variant: 'destructive' });
    }
  };

  const handleQuickImport = async () => {
    const names = quickNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    if (!names.length) return;
    setQuickLoading(true);
    setQuickResults([]);
    const results: QuickImportResult[] = [];
    for (const name of names) {
      try {
        const entity = await searchMutation.mutateAsync({ scientificName: name });
        if (entity?.id) {
          const linkResult = await linkMutation.mutateAsync({
            latinName: name, wikidataQid: entity.id,
          });
          results.push({ name, qid: entity.id, success: linkResult.success, message: linkResult.message });
        } else {
          results.push({ name, qid: null, success: false, message: 'Taxon non trouvé sur Wikidata' });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erreur';
        results.push({ name, qid: null, success: false, message: msg });
      }
    }
    setQuickResults(results);
    setQuickLoading(false);
    const ok = results.filter(r => r.success).length;
    toast({ title: `Import terminé`, description: `${ok}/${names.length} plantes liées à Wikidata` });
  };

  const scientificName = `${recGenus} ${recSpecies}${recCultivar ? ` '${recCultivar}'` : ''}`.trim();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Synchronisation Wikidata
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Enrichissez les données de plantes avec les informations taxonomiques, images et statuts de conservation de Wikidata
          </p>
        </div>
        <a href="https://www.wikidata.org/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline shrink-0">
          <ExternalLink className="w-3.5 h-3.5" />Visiter Wikidata
        </a>
      </div>

      {/* Status banner */}
      {statsQuery.data && (
        <Alert variant={statsQuery.data.status === 'ok' ? 'default' : 'destructive'}
          className={statsQuery.data.status === 'ok' ? 'bg-green-50 border-green-200' : ''}>
          {statsQuery.data.status === 'ok'
            ? <CheckCircle2 className="h-4 w-4 text-green-600" />
            : <AlertCircle className="h-4 w-4" />}
          <AlertDescription className="flex items-center justify-between">
            <span>{statsQuery.data.message}</span>
            {statsQuery.data.timestamp && (
              <span className="text-xs text-gray-400 ml-2">
                {new Date(statsQuery.data.timestamp).toLocaleTimeString('fr-FR')}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="gap-1.5">
            <Search className="w-3.5 h-3.5" />Recherche
          </TabsTrigger>
          <TabsTrigger value="batch" className="gap-1.5">
            <Database className="w-3.5 h-3.5" />En masse
          </TabsTrigger>
          <TabsTrigger value="enrichment" className="gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />Recommandations
          </TabsTrigger>
          <TabsTrigger value="quickimport" className="gap-1.5">
            <Zap className="w-3.5 h-3.5" />Import rapide
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: SINGLE SEARCH ── */}
        <TabsContent value="search" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Rechercher un taxon</CardTitle>
              <CardDescription>
                Entrez un nom scientifique pour récupérer les données Wikidata (taxonomie, distribution, images, statut IUCN)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="ex: Nicotiana tabacum, Rosa damascena, Cannabis sativa"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={searchMutation.isPending || !searchQuery.trim()}>
                  {searchMutation.isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Search className="w-4 h-4" />}
                  <span className="ml-2 hidden sm:inline">Rechercher</span>
                </Button>
              </form>
              <Button variant="outline" onClick={handleGetDetails}
                disabled={detailsMutation.isPending || !searchQuery.trim()} className="w-full">
                {detailsMutation.isPending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Chargement...</>
                  : <><RefreshCw className="w-4 h-4 mr-2" />Récupérer les détails complets (distribution, hybrides, image)</>}
              </Button>
            </CardContent>
          </Card>

          {selectedEntity && (
            <Card>
              <CardContent className="pt-5">
                <EntityCard entity={selectedEntity} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── TAB 2: BATCH SEARCH ── */}
        <TabsContent value="batch" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recherche en masse</CardTitle>
              <CardDescription>Vérifiez l'existence de plusieurs taxons sur Wikidata en une seule opération</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Noms scientifiques (un par ligne)</label>
                <textarea
                  className="w-full mt-2 p-3 border rounded-lg text-sm font-mono min-h-[140px] resize-y bg-gray-50 focus:bg-white transition-colors"
                  placeholder={"Nicotiana tabacum\nCannabis sativa\nRosa damascena\nLavandula angustifolia"}
                  value={batchNames}
                  onChange={e => setBatchNames(e.target.value)}
                />
              </div>
              <Button onClick={handleBatchSearch}
                disabled={batchMutation.isPending || !batchNames.trim()} className="w-full">
                {batchMutation.isPending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Recherche en cours...</>
                  : <><Search className="w-4 h-4 mr-2" />Lancer la recherche en masse</>}
              </Button>

              {batchMutation.data && (
                <div className="space-y-3">
                  <div className="flex gap-4 text-sm font-medium">
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />{batchMutation.data.found} trouvés
                    </span>
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{batchMutation.data.notFound} non trouvés
                    </span>
                    <span className="text-gray-400">Total : {batchMutation.data.total}</span>
                  </div>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto rounded-lg border p-2">
                    {batchMutation.data.results.map((r: BatchSearchResult, i: number) => (
                      <div key={i} className={`flex items-center gap-2 p-2 rounded text-sm ${r.found ? 'bg-green-50' : 'bg-red-50'}`}>
                        {r.found
                          ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                          : <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />}
                        <span className="font-medium italic">{r.scientificName}</span>
                        {r.entity && (
                          <a href={`https://www.wikidata.org/wiki/${r.entity.id}`} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline ml-auto flex items-center gap-0.5">
                            {r.entity.id}<ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB 3: RECOMMENDATIONS ── */}
        <TabsContent value="enrichment" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />Recommandations d'enrichissement
              </CardTitle>
              <CardDescription>
                Analysez une espèce pour obtenir des suggestions ciblées et importez les données directement en base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Genre *</label>
                  <Input placeholder="ex: Nicotiana" value={recGenus} onChange={e => setRecGenus(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Espèce *</label>
                  <Input placeholder="ex: tabacum" value={recSpecies} onChange={e => setRecSpecies(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Cultivar</label>
                  <Input placeholder="ex: Basma (optionnel)" value={recCultivar} onChange={e => setRecCultivar(e.target.value)} />
                </div>
              </div>
              <Button
                onClick={async () => {
                  if (!recGenus.trim() || !recSpecies.trim()) {
                    toast({ title: 'Champs requis', description: 'Genre et espèce sont obligatoires', variant: 'destructive' });
                    return;
                  }
                  setRecLoading(true);
                  setRecommendations(null);
                  try {
                    const result = await recMutation.mutateAsync({
                      genus: recGenus.trim(), species: recSpecies.trim(),
                      cultivar: recCultivar.trim() || undefined,
                    });
                    setRecommendations(result);
                  } catch {
                    toast({ title: 'Erreur', description: 'Impossible de générer les recommandations', variant: 'destructive' });
                  } finally {
                    setRecLoading(false);
                  }
                }}
                disabled={recLoading}
                className="w-full sm:w-auto"
              >
                {recLoading
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyse en cours...</>
                  : <><Lightbulb className="h-4 w-4 mr-2" />Générer les recommandations</>}
              </Button>
            </CardContent>
          </Card>

          {recommendations && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Recommandations', value: recommendations.recommendations?.length || 0, color: 'text-yellow-600' },
                  { label: 'Wikidata', value: recommendations.wikidataEntity ? '✓ Trouvé' : '✗ Absent', color: recommendations.wikidataEntity ? 'text-green-600' : 'text-red-500' },
                  { label: 'QID', value: recommendations.wikidataEntity?.qid || '—', color: 'text-blue-600' },
                  { label: 'IUCN', value: recommendations.wikidataEntity?.conservationStatus || '—', color: 'text-emerald-600' },
                ].map(s => (
                  <Card key={s.label} className="text-center py-3">
                    <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </Card>
                ))}
              </div>

              {/* Wikidata image */}
              {recommendations.wikidataEntity?.imageUrl && (
                <Card className="overflow-hidden">
                  <div className="flex gap-4 p-4 items-center">
                    <img src={recommendations.wikidataEntity.imageUrl} alt={scientificName}
                      className="h-28 w-28 object-cover rounded-lg border shrink-0" />
                    <div className="space-y-1">
                      <p className="font-semibold italic">{scientificName}</p>
                      <p className="text-xs text-gray-500">Image disponible sur Wikidata (P18)</p>
                      <div className="flex gap-2 mt-2">
                        <a href={recommendations.wikidataEntity.imageUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="gap-1 text-xs h-7">
                            <ExternalLink className="w-3 h-3" />Voir
                          </Button>
                        </a>
                        {recommendations.wikidataEntity.qid && (
                          <a href={`https://www.wikidata.org/wiki/${recommendations.wikidataEntity.qid}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="gap-1 text-xs h-7">
                              <Globe className="w-3 h-3" />{recommendations.wikidataEntity.qid}
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Recommendations list */}
              {recommendations.recommendations?.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Les boutons <strong>Importer</strong> mettent à jour directement la table <code className="bg-gray-100 px-1 rounded">plants</code>.
                  </p>
                  {recommendations.recommendations.map((rec: Recommendation, i: number) => (
                    <RecommendationCard key={i} rec={rec}
                      wikidataEntity={recommendations.wikidataEntity}
                      scientificName={`${recGenus} ${recSpecies}`} />
                  ))}
                </div>
              ) : (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="py-8 text-center">
                    <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                    <p className="font-semibold text-green-700 text-lg">Données complètes !</p>
                    <p className="text-sm text-green-600 mt-1">Aucune recommandation d'enrichissement pour cette variété.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* ── TAB 4: QUICK IMPORT ── */}
        <TabsContent value="quickimport" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />Import rapide — Liaison Wikidata
              </CardTitle>
              <CardDescription>
                Liez plusieurs plantes PERFUMUM à leur QID Wikidata en une seule opération. Le QID sera enregistré dans le champ <code>wikidata_qid</code> de chaque plante.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Correspondance automatique</p>
                  <p className="text-xs mt-0.5">Chaque nom est recherché sur Wikidata, puis lié à la plante PERFUMUM correspondante. En cas d'ambiguïté (plusieurs plantes avec le même nom), la première correspondance est utilisée.</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Noms scientifiques (un par ligne)</label>
                <textarea
                  className="w-full mt-2 p-3 border rounded-lg text-sm font-mono min-h-[140px] resize-y bg-gray-50 focus:bg-white transition-colors"
                  placeholder={"Rosa damascena\nLavandula angustifolia\nBoswellia sacra\nCannabis sativa"}
                  value={quickNames}
                  onChange={e => setQuickNames(e.target.value)}
                />
              </div>
              <Button onClick={handleQuickImport}
                disabled={quickLoading || !quickNames.trim()} className="w-full">
                {quickLoading
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Import en cours...</>
                  : <><Link2 className="w-4 h-4 mr-2" />Lier à Wikidata</>}
              </Button>

              {quickResults.length > 0 && (
                <div className="space-y-3">
                  <div className="flex gap-4 text-sm font-medium">
                    <span className="text-green-600">{quickResults.filter(r => r.success).length} liées</span>
                    <span className="text-red-500">{quickResults.filter(r => !r.success).length} erreurs</span>
                  </div>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto rounded-lg border p-2">
                    {quickResults.map((r, i) => (
                      <div key={i} className={`flex items-start gap-2 p-2 rounded text-sm ${r.success ? 'bg-green-50' : 'bg-red-50'}`}>
                        {r.success
                          ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                          : <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <span className="font-medium italic">{r.name}</span>
                          {r.qid && (
                            <a href={`https://www.wikidata.org/wiki/${r.qid}`} target="_blank" rel="noopener noreferrer"
                              className="ml-2 text-xs text-blue-500 hover:underline">{r.qid}</a>
                          )}
                          <p className="text-xs text-gray-500 mt-0.5">{r.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
