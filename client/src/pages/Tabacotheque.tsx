import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Cigarette, Dna, FlaskConical, ArrowRight, Atom, MapPin, Flame } from 'lucide-react';
import { Link } from 'wouter';

const TOBACCO_TYPES = [
  { value: 'blond', label: 'Blond', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'brun', label: 'Brun', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'oriental', label: 'Oriental', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'experimental', label: 'Expérimental', color: 'bg-purple-100 text-purple-800 border-purple-200' },
];

const TYPE_ICONS: Record<string, string> = {
  blond: '☀️',
  brun: '🌰',
  oriental: '🌿',
  experimental: '⚗️',
};

function VarietyCard({ variety, typeColor }: { variety: any; typeColor: (t: string) => string }) {
  const typeInfo = TOBACCO_TYPES.find(t => t.value === variety.type);
  const aromaticTags = useMemo(() => {
    if (!variety.aromaticProfile) return [];
    try {
      const parsed = typeof variety.aromaticProfile === 'string'
        ? JSON.parse(variety.aromaticProfile)
        : variety.aromaticProfile;
      return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
    } catch {
      return [];
    }
  }, [variety.aromaticProfile]);

  const molCount = parseInt(variety.molecule_count || '0', 10);

  return (
    <Link href={`/tabac/${variety.id}`}>
      <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-amber-300 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg text-amber-900 truncate">
                {variety.name}
              </CardTitle>
              {variety.origin && (
                <CardDescription className="mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{variety.origin}</span>
                </CardDescription>
              )}
            </div>
            <Badge className={`${typeColor(variety.type)} flex-shrink-0 text-xs`}>
              {typeInfo?.label || variety.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {aromaticTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {aromaticTags.map((tag: string, i: number) => (
                <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {variety.intensity && (
            <div>
              <div className="flex items-center justify-between text-xs text-amber-700 mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3" /> Intensité
                </span>
                <span className="font-semibold">{variety.intensity}/10</span>
              </div>
              <div className="w-full bg-amber-100 rounded-full h-1.5">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(variety.intensity / 10) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Atom className="h-3 w-3" />
              <span>{molCount > 0 ? `${molCount} molécule${molCount > 1 ? 's' : ''}` : 'Profil à enrichir'}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function Tabacotheque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: varietiesData, isLoading: isLoadingVarieties } = trpc.tobacco.getVarietiesWithMoleculeCount.useQuery();
  const { data: statsData } = trpc.tobacco.getStatistics.useQuery();

  const allVarieties = (varietiesData?.data || []) as any[];
  const stats = statsData?.data;

  const filteredVarieties = useMemo(() => {
    return allVarieties.filter(v => {
      const matchesSearch = !searchTerm ||
        v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.internalNotes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || v.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [allVarieties, searchTerm, selectedType]);

  const typeColor = (type: string) => {
    const typeObj = TOBACCO_TYPES.find(t => t.value === type);
    return typeObj?.color || 'bg-gray-100 text-gray-800';
  };

  const typeGroups = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const v of filteredVarieties) {
      const t = v.type || 'autre';
      if (!groups[t]) groups[t] = [];
      groups[t].push(v);
    }
    return groups;
  }, [filteredVarieties]);

  const typeOrder = ['oriental', 'blond', 'brun', 'experimental'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            🌿 Tabacothèque PERFUMUM
          </h1>
          <p className="text-lg text-amber-700 mb-8">
            Collection de {allVarieties.length} variétés de tabac patrimoniales, orientales et expérimentales
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
                      <p className="text-sm text-amber-600">Marques soviétiques, orientales et chinoises</p>
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
                      <p className="text-sm text-amber-600">Fermentation anaérobie louisianaise</p>
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
              <Card className="border-amber-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-900">{stats.total}</div>
                    <div className="text-sm text-amber-700 mt-1">Variétés totales</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-900">{stats.byType.oriental}</div>
                    <div className="text-sm text-orange-700 mt-1">🌿 Orientales</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-yellow-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-900">{stats.byType.blond}</div>
                    <div className="text-sm text-yellow-700 mt-1">☀️ Blonds</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-900">{stats.byType.experimental}</div>
                    <div className="text-sm text-purple-700 mt-1">⚗️ Expérimentales</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, origine, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === null ? 'default' : 'outline'}
                onClick={() => setSelectedType(null)}
                className="rounded-full"
                size="sm"
              >
                Tous ({allVarieties.length})
              </Button>
              {TOBACCO_TYPES.map((type) => {
                const count = allVarieties.filter(v => v.type === type.value).length;
                return (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? 'default' : 'outline'}
                    onClick={() => setSelectedType(type.value)}
                    className="rounded-full"
                    size="sm"
                  >
                    {TYPE_ICONS[type.value]} {type.label} ({count})
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Varieties Display */}
        {isLoadingVarieties ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : filteredVarieties.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-gray-500 mb-4">Aucune variété trouvée</p>
              <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedType(null); }}>
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        ) : selectedType ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVarieties.map((variety) => (
              <VarietyCard key={variety.id} variety={variety} typeColor={typeColor} />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {typeOrder.map(type => {
              const group = typeGroups[type];
              if (!group || group.length === 0) return null;
              const typeInfo = TOBACCO_TYPES.find(t => t.value === type);
              return (
                <div key={type}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{TYPE_ICONS[type]}</span>
                    <h2 className="text-xl font-bold text-amber-900">
                      {typeInfo?.label || type}
                    </h2>
                    <Badge className={typeColor(type)}>{group.length} variétés</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.map((variety) => (
                      <VarietyCard key={variety.id} variety={variety} typeColor={typeColor} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoadingVarieties && filteredVarieties.length > 0 && (
          <div className="mt-8 text-center text-amber-700">
            <p>
              {filteredVarieties.length} variété{filteredVarieties.length > 1 ? 's' : ''} affichée{filteredVarieties.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
