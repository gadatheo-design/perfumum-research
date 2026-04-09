import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function COCONUTEnrichment() {
  const [searchQuery, setSearchQuery] = useState('');
  const [batchQueries, setBatchQueries] = useState('');
  
  const searchMutation = trpc.coconutEnrichment.searchCompound.useMutation();
  const batchMutation = trpc.coconutEnrichment.batchSearchCompounds.useMutation();
  const statsMutation = trpc.coconutEnrichment.getStats.useQuery();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await searchMutation.mutateAsync({ query: searchQuery });
  };

  const handleBatchSearch = async () => {
    const queries = batchQueries.split('\n').filter(q => q.trim());
    if (queries.length === 0) return;
    await batchMutation.mutateAsync({ queries });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🥥 COCONUT Enrichment</h1>
          <p className="text-muted-foreground">Collection of Open Natural Products</p>
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
                <CardTitle>Search Compounds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter compound name..."
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
                  placeholder="Enter compound names (one per line)..."
                  value={batchQueries}
                  onChange={(e) => setBatchQueries(e.target.value)}
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
                <CardTitle>COCONUT Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {statsMutation.data && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Compounds:</strong> {statsMutation.data.coverage?.compounds}</p>
                    <p className="text-sm"><strong>Organisms:</strong> {statsMutation.data.coverage?.organisms}</p>
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
