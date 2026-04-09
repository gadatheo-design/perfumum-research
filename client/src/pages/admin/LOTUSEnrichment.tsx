import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function LOTUSEnrichment() {
  const [searchQuery, setSearchQuery] = useState('');
  const [batchOrganisms, setBatchOrganisms] = useState('');
  
  const searchMutation = trpc.lotusEnrichment.searchCompound.useMutation();
  const batchMutation = trpc.lotusEnrichment.batchSearchOrganisms.useMutation();
  const statsMutation = trpc.lotusEnrichment.getStats.useQuery();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await searchMutation.mutateAsync({ query: searchQuery });
  };

  const handleBatchSearch = async () => {
    const organisms = batchOrganisms.split('\n').filter(o => o.trim());
    if (organisms.length === 0) return;
    await batchMutation.mutateAsync({ organisms });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🧬 LOTUS Enrichment</h1>
          <p className="text-muted-foreground">Natural Products Online</p>
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
                <CardTitle>Search Molecules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter molecule name..."
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
                <CardTitle>Batch Search Organisms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  placeholder="Enter organism names (one per line)..."
                  value={batchOrganisms}
                  onChange={(e) => setBatchOrganisms(e.target.value)}
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
                <CardTitle>LOTUS Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {statsMutation.data && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Plant-Molecule Pairs:</strong> {statsMutation.data.coverage?.plantMoleculePairs}</p>
                    <p className="text-sm"><strong>Organisms:</strong> {statsMutation.data.coverage?.organisms}</p>
                    <p className="text-sm"><strong>Compounds:</strong> {statsMutation.data.coverage?.compounds}</p>
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
