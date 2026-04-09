import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function TropicosEnrichment() {
  const [searchQuery, setSearchQuery] = useState('');
  const [batchNames, setBatchNames] = useState('');
  
  const searchMutation = trpc.tropicosEnrichment.searchName.useMutation();
  const batchMutation = trpc.tropicosEnrichment.batchSearchNames.useMutation();
  const statsMutation = trpc.tropicosEnrichment.getStats.useQuery();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await searchMutation.mutateAsync({ name: searchQuery });
  };

  const handleBatchSearch = async () => {
    const names = batchNames.split('\n').filter(n => n.trim());
    if (names.length === 0) return;
    await batchMutation.mutateAsync({ names });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🌿 Tropicos Enrichment</h1>
          <p className="text-muted-foreground">Missouri Botanical Garden</p>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="batch">Batch Import</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Plant Names</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter plant name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={searchMutation.isPending}>
                  {searchMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Search
                </Button>
                {searchMutation.data && (
                  <div className="mt-4 p-4 bg-muted rounded">
                    <p className="text-sm">Total results: {searchMutation.data.total}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batch" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Batch Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  placeholder="Enter plant names (one per line)..."
                  value={batchNames}
                  onChange={(e) => setBatchNames(e.target.value)}
                  className="w-full h-32 p-2 border rounded"
                />
                <Button onClick={handleBatchSearch} disabled={batchMutation.isPending}>
                  {batchMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Search Batch
                </Button>
                {batchMutation.data && (
                  <div className="mt-4 p-4 bg-muted rounded">
                    <p className="text-sm">Matched: {batchMutation.data.matched}/{batchMutation.data.total}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tropicos Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {statsMutation.data && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Scientific Names:</strong> {statsMutation.data.coverage?.scientificNames}</p>
                    <p className="text-sm"><strong>Images:</strong> {statsMutation.data.coverage?.images}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
