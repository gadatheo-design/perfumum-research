import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  FileText,
  MapPin,
  Tag
} from 'lucide-react';
import perfumumData from '@/data/PERFUMUM_FINAL_DATA.json';
import { useState, useMemo } from 'react';

interface Claim {
  'ID court': string;
  Claim: string;
  Région: string;
  Type: string;
  Source: string | null;
  Statut: string;
  Preuve: string;
  Citation: string | null;
  Notes: string;
  'Créé le': string;
}

interface Source {
  'ID source': string;
  Référence: string;
  URL: string;
  Qualité: string;
  Portée: string;
  Statut: string;
  'Extraits clés': string;
}

export default function ClaimsAndProofs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const claims = (perfumumData.claims || []) as Claim[];
  const sources = (perfumumData.sources || []) as Source[];

  // Extraire les régions uniques
  const regions = useMemo(() => {
    const unique = new Set(claims.map(c => c.Région).filter(Boolean));
    return Array.from(unique).sort();
  }, [claims]);

  // Extraire les types uniques
  const types = useMemo(() => {
    const unique = new Set(claims.map(c => c.Type).filter(Boolean));
    return Array.from(unique).sort();
  }, [claims]);

  // Extraire les statuts uniques
  const statuses = useMemo(() => {
    const unique = new Set(claims.map(c => c.Statut).filter(Boolean));
    return Array.from(unique).sort();
  }, [claims]);

  // Filtrer les claims
  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      const matchesSearch = claim.Claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           claim['ID court'].toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || claim.Région === selectedRegion;
      const matchesType = selectedType === 'all' || claim.Type === selectedType;
      const matchesStatus = selectedStatus === 'all' || claim.Statut === selectedStatus;
      return matchesSearch && matchesRegion && matchesType && matchesStatus;
    });
  }, [claims, searchQuery, selectedRegion, selectedType, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'validé':
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'en cours':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'à sourcer':
      case 'to source':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'validé':
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'en cours':
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: 'Accueil', href: '/' },
          { label: 'Recherche', href: '/recherche' },
          { label: 'Claims & Preuves', href: '/claims-and-proofs' }
        ]} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Claims & Preuves Ethnobotaniques</h1>
          <p className="text-lg text-muted-foreground">
            Affirmations documentées sur les propriétés olfactives et les usages traditionnels des plantes.
            {filteredClaims.length} claim{filteredClaims.length !== 1 ? 's' : ''} trouvé{filteredClaims.length !== 1 ? 's' : ''}.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="claims" className="mb-8">
          <TabsList>
            <TabsTrigger value="claims">Claims ({claims.length})</TabsTrigger>
            <TabsTrigger value="sources">Sources ({sources.length})</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          </TabsList>

          {/* Claims Tab */}
          <TabsContent value="claims" className="space-y-6">
            {/* Filtres */}
            <div className="bg-card p-4 rounded-lg border border-border space-y-4">
              <div className="flex gap-2 items-center">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par ID ou description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Région</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">Toutes les régions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">Tous les types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Statut</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">Tous les statuts</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Claims Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClaims.map((claim) => (
                <Card key={claim['ID court']} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{claim['ID court']}</CardTitle>
                        <p className="text-sm text-muted-foreground">{claim.Claim}</p>
                      </div>
                      <Badge className={getStatusColor(claim.Statut)}>
                        {getStatusIcon(claim.Statut)}
                        <span className="ml-1">{claim.Statut}</span>
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Métadonnées */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{claim.Région}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <span>{claim.Type}</span>
                      </div>
                    </div>

                    {/* Preuve */}
                    {claim.Preuve && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Preuve</h4>
                        <p className="text-sm text-muted-foreground">{claim.Preuve}</p>
                      </div>
                    )}

                    {/* Notes */}
                    {claim.Notes && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Notes</h4>
                        <p className="text-sm text-muted-foreground">{claim.Notes}</p>
                      </div>
                    )}

                    {/* Source */}
                    {claim.Source && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          <strong>Source:</strong> {claim.Source}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredClaims.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun claim ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sources.map((source) => (
                <Card key={source['ID source']}>
                  <CardHeader>
                    <CardTitle className="text-lg">{source.Référence}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div>
                        <h4 className="font-semibold mb-1">URL</h4>
                        <a href={source.URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                          {source.URL}
                        </a>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">Qualité</h4>
                        <Badge>{source.Qualité}</Badge>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-1">Portée</h4>
                        <p className="text-muted-foreground">{source.Portée}</p>
                      </div>

                      {source['Extraits clés'] && (
                        <div>
                          <h4 className="font-semibold mb-1">Extraits clés</h4>
                          <p className="text-muted-foreground">{source['Extraits clés']}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{claims.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Régions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{regions.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{types.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{sources.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Statistiques par région */}
            <Card>
              <CardHeader>
                <CardTitle>Claims par Région</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regions.map(region => {
                    const count = claims.filter(c => c.Région === region).length;
                    const percentage = Math.round((count / claims.length) * 100);
                    return (
                      <div key={region}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{region}</span>
                          <span className="text-sm text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
