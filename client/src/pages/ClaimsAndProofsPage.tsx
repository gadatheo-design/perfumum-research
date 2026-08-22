import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, BookOpen, FileText } from 'lucide-react';
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

export function ClaimsAndProofsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('claims');

  // Fetch claims
  const { data: claimsData, isLoading: isLoadingClaims } = trpc.research.getClaims.useQuery({
    search: searchTerm || undefined,
    limit: 100,
  });

  // Fetch sources
  const { data: sourcesData, isLoading: isLoadingSources } = trpc.research.getSources.useQuery({
    search: searchTerm || undefined,
    limit: 100,
  });

  // Fetch statistics
  const { data: statsData } = trpc.research.getStatistics.useQuery();

  const claims = claimsData?.data || [];
  const sources = sourcesData?.data || [];
  const stats = statsData?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-purple-100 text-purple-800';
      case 'low':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            📚 Claims & Preuves Ethnobotaniques
          </h1>
          <p className="text-lg text-blue-700 mb-8">
            Archive complète des affirmations ethnobotaniques et de leurs sources bibliographiques
          </p>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-900">{stats.totalClaims}</div>
                    <div className="text-sm text-blue-700">Claims ethnobotaniques</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-900">{stats.totalSources}</div>
                    <div className="text-sm text-indigo-700">Sources bibliographiques</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-900">
                      {stats.totalClaims > 0 ? Math.round((stats.totalSources / stats.totalClaims) * 10) / 10 : 0}
                    </div>
                    <div className="text-sm text-purple-700">Sources par claim</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Rechercher un claim ou une source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="claims" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Claims ({claims.length})
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Sources ({sources.length})
            </TabsTrigger>
          </TabsList>

          {/* Claims Tab */}
          <TabErrorBoundary>
          <TabsContent value="claims">
            {isLoadingClaims ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : claims.length === 0 ? (
              <Card>
                <CardContent className="pt-12 text-center">
                  <p className="text-gray-500 mb-4">Aucun claim trouvé</p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                  >
                    Réinitialiser la recherche
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {claims.map((claim: any) => (
                  <Card key={claim.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-blue-900">
                            {claim.claimId}
                          </CardTitle>
                          <CardDescription className="mt-2 text-base">
                            {claim.claim}
                          </CardDescription>
                        </div>
                        {claim.status && (
                          <Badge className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    {claim.claimType && (
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-blue-900">Type:</span>
                          <Badge variant="outline">{claim.claimType}</Badge>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          </TabErrorBoundary>

          {/* Sources Tab */}
          <TabErrorBoundary>
          <TabsContent value="sources">
            {isLoadingSources ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : sources.length === 0 ? (
              <Card>
                <CardContent className="pt-12 text-center">
                  <p className="text-gray-500 mb-4">Aucune source trouvée</p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                  >
                    Réinitialiser la recherche
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sources.map((source: any) => (
                  <Card key={source.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-indigo-900">
                            {source.sourceId}
                          </CardTitle>
                          <CardDescription className="mt-2 text-base">
                            {source.reference}
                          </CardDescription>
                        </div>
                        {source.quality && (
                          <Badge className={getQualityColor(source.quality)}>
                            {source.quality}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    {source.status && (
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-indigo-900">Statut:</span>
                          <Badge variant="outline">{source.status}</Badge>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          </TabErrorBoundary>
        </Tabs>

        {/* Results Count */}
        {!isLoadingClaims && !isLoadingSources && (
          <div className="mt-8 text-center text-blue-700">
            <p>
              Total: <span className="font-semibold">{claims.length + sources.length}</span> entrées
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
