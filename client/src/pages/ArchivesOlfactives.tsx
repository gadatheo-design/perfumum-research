// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollText, Search, Calendar, MapPin, CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react';

export default function ArchivesOlfactives() {
  const [searchQuery, setSearchQuery] = useState('');
  const [civilizationFilter, setCivilizationFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const { data: archives, isLoading } = trpc.archives.list.useQuery({
    civilization: civilizationFilter,
    type: typeFilter as any,
    q: searchQuery || undefined,
    limit: 50,
  });

  const typeLabels: Record<string, { label: string; icon: string }> = {
    manuscript: { label: 'Manuscrit ancien', icon: '📜' },
    formula: { label: 'Formule historique', icon: '⚗️' },
    archaeological: { label: 'Découverte archéologique', icon: '🏺' },
    botanical_illustration: { label: 'Illustration botanique', icon: '🌿' },
  };

  const authenticityLabels: Record<string, { label: string; icon: any; color: string }> = {
    confirmed: { label: 'Confirmé', icon: CheckCircle2, color: 'text-green-600' },
    probable: { label: 'Probable', icon: HelpCircle, color: 'text-yellow-600' },
    hypothetical: { label: 'Hypothétique', icon: AlertCircle, color: 'text-orange-600' },
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* En-tête */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ScrollText className="h-10 w-10 text-amber-600" />
          <div>
            <h1 className="text-4xl font-bold">Archives Olfactives</h1>
            <p className="text-muted-foreground text-lg">
              Manuscrits, formules anciennes et découvertes archéologiques
            </p>
          </div>
        </div>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche dans les archives</CardTitle>
          <CardDescription>
            Explorez les sources historiques sur l'usage des plantes aromatiques à travers les civilisations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtres */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Civilisation</label>
              <Select value={civilizationFilter} onValueChange={(v) => setCivilizationFilter(v === 'all' ? undefined : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les civilisations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les civilisations</SelectItem>
                  <SelectItem value="Égypte">Égypte</SelectItem>
                  <SelectItem value="Mésopotamie">Mésopotamie</SelectItem>
                  <SelectItem value="Grèce">Grèce</SelectItem>
                  <SelectItem value="Rome">Rome</SelectItem>
                  <SelectItem value="Inde">Inde</SelectItem>
                  <SelectItem value="Chine">Chine</SelectItem>
                  <SelectItem value="Arabie">Arabie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type de document</label>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v === 'all' ? undefined : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="manuscript">Manuscrits anciens</SelectItem>
                  <SelectItem value="formula">Formules historiques</SelectItem>
                  <SelectItem value="archaeological">Découvertes archéologiques</SelectItem>
                  <SelectItem value="botanical_illustration">Illustrations botaniques</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des archives */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement des archives...</p>
        </div>
      ) : archives && archives.length > 0 ? (
        <div className="space-y-6">
          {archives.map((archive) => {
            const typeInfo = typeLabels[archive.type];
            const authenticityInfo = authenticityLabels[archive.authenticityLevel];
            const AuthenticityIcon = authenticityInfo.icon;

            return (
              <Card key={archive.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <span className="text-2xl">{typeInfo.icon}</span>
                        {archive.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{typeInfo.label}</Badge>
                        {archive.civilization && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {archive.civilization}
                          </Badge>
                        )}
                        {archive.dateCreated && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {archive.dateCreated}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 ${authenticityInfo.color}`}>
                      <AuthenticityIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">{authenticityInfo.label}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
                  {archive.description && (
                    <div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {archive.description}
                      </p>
                    </div>
                  )}

                  {/* Provenance */}
                  {archive.provenance && (
                    <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                        Provenance
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {archive.provenance}
                      </p>
                    </div>
                  )}

                  {/* Références */}
                  {archive.references && Array.isArray(archive.references) && archive.references.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Références</p>
                      <div className="space-y-1">
                        {archive.references.map((ref: any, idx: number) => (
                          <div key={idx} className="text-sm text-muted-foreground">
                            {ref.author && <span className="font-medium">{ref.author}</span>}
                            {ref.year && <span> ({ref.year})</span>}
                            {ref.title && <span className="italic"> — {ref.title}</span>}
                            {ref.url && (
                              <a
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline ml-2"
                              >
                                [lien]
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  {archive.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={archive.imageUrl}
                        alt={archive.title}
                        className="w-full h-64 object-cover rounded-md"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || civilizationFilter || typeFilter
                ? 'Aucune archive trouvée avec ces critères.'
                : 'Aucune archive disponible pour le moment.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
