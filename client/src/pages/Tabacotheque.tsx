// @ts-nocheck
import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Cigarette, Dna, FlaskConical, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const TOBACCO_TYPES = [
  { value: 'blond', label: 'Blond', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'brun', label: 'Brun', color: 'bg-amber-100 text-amber-800' },
  { value: 'oriental', label: 'Oriental', color: 'bg-orange-100 text-orange-800' },
  { value: 'experimental', label: 'Expérimental', color: 'bg-purple-100 text-purple-800' },
];

export function Tabacotheque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Fetch varieties
  const { data: varietiesData, isLoading: isLoadingVarieties } = trpc.tobacco.getVarieties.useQuery({
    search: searchTerm || undefined,
    type: selectedType as any,
    limit: 100,
  });

  // Fetch statistics
  const { data: statsData } = trpc.tobacco.getStatistics.useQuery();

  const varieties = varietiesData?.data || [];
  const stats = statsData?.data;

  // Filter varieties based on search and type
  const filteredVarieties = useMemo(() => {
    return varieties;
  }, [varieties]);

  const typeColor = (type: string) => {
    const typeObj = TOBACCO_TYPES.find(t => t.value === type);
    return typeObj?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            🌿 Tabacothèque PERFUMUM
          </h1>
          <p className="text-lg text-amber-700 mb-8">
            Explorez notre collection complète de variétés de tabac patrimoniales et expérimentales
          </p>

          {/* Quick Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/historic-cigarettes">
              <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-amber-400 group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-colors">
                      <Cigarette className="h-6 w-6 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900">Cigarettes Historiques</h3>
                      <p className="text-sm text-amber-600">11 marques soviétiques, orientales et chinoises</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-amber-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/perique-compounds">
              <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-amber-400 group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                      <FlaskConical className="h-6 w-6 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900">Composés du Perique</h3>
                      <p className="text-sm text-amber-600">278 molécules aromatiques analysées</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-amber-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tps-genes">
              <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-amber-400 group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                      <Dna className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900">Gènes TPS</h3>
                      <p className="text-sm text-amber-600">Terpène synthases et voies biosynthétiques</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-amber-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-900">{stats.total}</div>
                    <div className="text-sm text-amber-700">Variétés totales</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-900">{stats.byType.oriental}</div>
                    <div className="text-sm text-orange-700">Orientales</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-900">{stats.byType.blond}</div>
                    <div className="text-sm text-yellow-700">Blonds</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-900">{stats.byType.experimental}</div>
                    <div className="text-sm text-purple-700">Expérimentales</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Rechercher une variété..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === null ? 'default' : 'outline'}
                onClick={() => setSelectedType(null)}
                className="rounded-full"
              >
                Tous
              </Button>
              {TOBACCO_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? 'default' : 'outline'}
                  onClick={() => setSelectedType(type.value)}
                  className="rounded-full"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Varieties Grid */}
        {isLoadingVarieties ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : filteredVarieties.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-gray-500 mb-4">Aucune variété trouvée</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType(null);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVarieties.map((variety) => (
              <Card key={variety.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-amber-900">
                        {variety.name}
                      </CardTitle>
                      {variety.origin && (
                        <CardDescription className="mt-1">
                          {variety.origin}
                        </CardDescription>
                      )}
                    </div>
                    <Badge className={typeColor(variety.type)}>
                      {TOBACCO_TYPES.find(t => t.value === variety.type)?.label || variety.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {variety.aromaticProfile && (
                    <div>
                      <h4 className="font-semibold text-sm text-amber-900 mb-2">Profil Aromatique</h4>
                      <p className="text-sm text-gray-600">
                        {typeof variety.aromaticProfile === 'string'
                          ? variety.aromaticProfile
                          : JSON.stringify(variety.aromaticProfile).substring(0, 100) + '...'}
                      </p>
                    </div>
                  )}

                  {variety.intensity && (
                    <div>
                      <h4 className="font-semibold text-sm text-amber-900 mb-2">Intensité</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-600 h-2 rounded-full"
                            style={{ width: `${(variety.intensity / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-amber-900">
                          {variety.intensity}/10
                        </span>
                      </div>
                    </div>
                  )}

                  {variety.internalNotes && (
                    <div>
                      <h4 className="font-semibold text-sm text-amber-900 mb-2">Notes</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {variety.internalNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!isLoadingVarieties && filteredVarieties.length > 0 && (
          <div className="mt-8 text-center text-amber-700">
            <p>
              Affichage de <span className="font-semibold">{filteredVarieties.length}</span> variété
              {filteredVarieties.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
