/**
 * WikidataSync.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin page for synchronizing plant variety genealogies with Wikidata
 * Allows searching, fetching details, and enriching local data with Wikidata
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, Lightbulb } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export function WikidataSync() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [batchNames, setBatchNames] = useState('');

  // Queries
  const statsQuery = trpc.wikidataSync.getStats.useQuery();
  const searchQuery_mutation = trpc.wikidataSync.searchTaxon.useMutation();
  const detailsQuery = trpc.wikidataSync.getTaxonDetails.useMutation();
  const batchQuery = trpc.wikidataSync.batchSearchTaxa.useMutation();

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un nom scientifique',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await searchQuery_mutation.mutateAsync({
        scientificName: searchQuery.trim(),
      });
      setSelectedEntity(result);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Erreur',
        description: 'Taxon non trouvé sur Wikidata',
        variant: 'destructive',
      });
    }
  };

  // Handle get details
  const handleGetDetails = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un nom scientifique',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await detailsQuery.mutateAsync({
        scientificName: searchQuery.trim(),
      });
      setSelectedEntity(result);
    } catch (error) {
      console.error('Details error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la récupération des détails',
        variant: 'destructive',
      });
    }
  };

  // Handle batch search
  const handleBatchSearch = async () => {
    if (!batchNames.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer au moins un nom scientifique',
        variant: 'destructive',
      });
      return;
    }

    const names = batchNames
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer au moins un nom scientifique',
        variant: 'destructive',
      });
      return;
    }

    try {
      await batchQuery.mutateAsync({
        scientificNames: names,
      });
      toast({
        title: 'Succès',
        description: `Recherche effectuée pour ${names.length} taxon(s)`,
      });
    } catch (error) {
      console.error('Batch search error:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la recherche en masse',
        variant: 'destructive',
      });
    }
  };

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
                          <Badge key={idx} variant="secondary">
                            {hybrid}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEntity.distribution && selectedEntity.distribution.length > 0 && (
                    <div>
                      <p className="font-semibold">Distribution ({selectedEntity.distribution.length})</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedEntity.distribution.map((country: string, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEntity.imageUrl && (
                    <div>
                      <p className="font-semibold">Image</p>
                      <img
                        src={selectedEntity.imageUrl}
                        alt={selectedEntity.label}
                        className="max-w-xs max-h-64 rounded-lg"
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
                Entrez plusieurs noms scientifiques (un par ligne) pour les rechercher tous à la fois
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Noms scientifiques</label>
                <textarea
                  value={batchNames}
                  onChange={(e) => setBatchNames(e.target.value)}
                  placeholder="Nicotiana tabacum&#10;Nicotiana rustica&#10;Cannabis sativa&#10;Citrus sinensis"
                  rows={10}
                  className="w-full mt-2 p-2 border rounded-lg font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleBatchSearch}
                disabled={batchQuery.isPending || !batchNames.trim()}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Rechercher {batchNames.split('\n').filter((n) => n.trim()).length} taxon(s)
              </Button>

              {/* Batch Results */}
              {batchQuery.data && (
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{batchQuery.data.total}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Trouvés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{batchQuery.data.found}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Non trouvés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{batchQuery.data.notFound}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom scientifique</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Label Wikidata</TableHead>
                          <TableHead>Rang taxonomique</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batchQuery.data.results.map((result: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-sm">{result.scientificName}</TableCell>
                            <TableCell>
                              {result.found ? (
                                <Badge variant="default" className="gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Trouvé
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Non trouvé
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{result.entity?.label || '-'}</TableCell>
                            <TableCell>{result.entity?.taxonRank || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: ENRICHMENT RECOMMENDATIONS */}
        <TabsContent value="enrichment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations d'enrichissement</CardTitle>
              <CardDescription>
                Obtenez des suggestions pour enrichir vos données de variétés avec Wikidata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  Cette fonctionnalité est en développement. Elle permettra bientôt de générer automatiquement
                  des recommandations d'enrichissement pour vos variétés.
                </AlertDescription>
              </Alert>

              <div className="text-sm text-gray-600 space-y-2">
                <p>Les recommandations incluront :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Statut de conservation IUCN</li>
                  <li>Images morphologiques</li>
                  <li>Taxons parents</li>
                  <li>Hybrides connus</li>
                  <li>Distribution géographique</li>
                  <li>Synonymes scientifiques</li>
                </ul>
              </div>
            </CardContent>
          </Card>
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
