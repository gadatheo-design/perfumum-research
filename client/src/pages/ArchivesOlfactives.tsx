import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollText, Search, Calendar, MapPin, CheckCircle2, HelpCircle, AlertCircle, Leaf, FlaskConical, LayoutGrid, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { Timeline, type TimelineItem } from '@/components/Timeline';

export default function ArchivesOlfactives() {
  const [searchQuery, setSearchQuery] = useState('');
  const [civilizationFilter, setCivilizationFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [selectedArchive, setSelectedArchive] = useState<number | null>(null);

  const { data: archives, isLoading } = trpc.archives.list.useQuery({
    civilization: civilizationFilter,
    type: typeFilter as any,
    q: searchQuery || undefined,
    limit: 100,
  });

  // Charger les plantes pour les liens
  const { data: plants } = trpc.plants.list.useQuery({ limit: 500 });

  // Charger les détails de l'archive sélectionnée
  const { data: archiveDetails } = trpc.archives.getById.useQuery(
    { id: selectedArchive! },
    { enabled: !!selectedArchive }
  );

  // Convertir les archives en items de timeline
  const timelineItems: TimelineItem[] = useMemo(() => {
    if (!archives) return [];
    return archives.map(archive => ({
      id: archive.id,
      title: archive.title,
      date: archive.dateCreated || 'Date inconnue',
      type: archive.type,
      civilization: archive.civilization || undefined,
      description: archive.description || undefined,
      authenticityLevel: archive.authenticityLevel,
      imageUrl: archive.imageUrl || undefined,
      plantIds: archive.plantIds as number[] || [],
      moleculeIds: archive.moleculeIds as number[] || [],
    }));
  }, [archives]);

  // Obtenir les plantes liées à une archive
  const getLinkedPlants = (plantIds: number[] | null) => {
    if (!plantIds || !plants) return [];
    return plants.filter(p => plantIds.includes(p.id));
  };

  const typeLabels: Record<string, { label: string; icon: string; color: string }> = {
    manuscript: { label: 'Manuscrit ancien', icon: '📜', color: 'bg-amber-100 text-amber-800' },
    formula: { label: 'Formule historique', icon: '⚗️', color: 'bg-purple-100 text-purple-800' },
    archaeological: { label: 'Découverte archéologique', icon: '🏺', color: 'bg-orange-100 text-orange-800' },
    botanical_illustration: { label: 'Illustration botanique', icon: '🌿', color: 'bg-green-100 text-green-800' },
  };

  const authenticityLabels: Record<string, { label: string; icon: any; color: string }> = {
    confirmed: { label: 'Confirmé', icon: CheckCircle2, color: 'text-green-600' },
    probable: { label: 'Probable', icon: HelpCircle, color: 'text-yellow-600' },
    hypothetical: { label: 'Hypothétique', icon: AlertCircle, color: 'text-orange-600' },
  };

  const handleTimelineItemClick = (item: TimelineItem) => {
    setSelectedArchive(item.id);
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

      {/* Onglets de vue */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'timeline' | 'grid')}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline chronologique
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Vue grille
            </TabsTrigger>
          </TabsList>

          {/* Recherche rapide */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Vue Timeline */}
        <TabsContent value="timeline" className="mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Chargement de la timeline...</p>
              </CardContent>
            </Card>
          ) : timelineItems.length > 0 ? (
            <Timeline
              items={timelineItems}
              onItemClick={handleTimelineItemClick}
              title="Chronologie des archives"
              description="Visualisez l'évolution des connaissances olfactives à travers les âges"
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune archive trouvée.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Vue Grille */}
        <TabsContent value="grid" className="mt-6 space-y-6">
          {/* Filtres avancés */}
          <Card>
            <CardHeader>
              <CardTitle>Filtres de recherche</CardTitle>
              <CardDescription>
                Explorez les sources historiques sur l'usage des plantes aromatiques
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
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
                    <SelectItem value="Perse">Perse</SelectItem>
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
            </CardContent>
          </Card>

          {/* Liste des archives */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement des archives...</p>
            </div>
          ) : archives && archives.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {archives.map((archive) => {
                const typeInfo = typeLabels[archive.type];
                const authenticityInfo = authenticityLabels[archive.authenticityLevel];
                const AuthenticityIcon = authenticityInfo.icon;
                const linkedPlants = getLinkedPlants(archive.plantIds as number[] | null);

                return (
                  <Card 
                    key={archive.id} 
                    className={`hover:shadow-lg transition-shadow cursor-pointer ${selectedArchive === archive.id ? 'ring-2 ring-amber-500' : ''}`}
                    onClick={() => setSelectedArchive(archive.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <span className="text-xl">{typeInfo.icon}</span>
                            {archive.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                            {archive.civilization && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {archive.civilization}
                              </Badge>
                            )}
                            {archive.dateCreated && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {archive.dateCreated}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 ${authenticityInfo.color}`}>
                          <AuthenticityIcon className="h-4 w-4" />
                          <span className="text-xs">{authenticityInfo.label}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Description */}
                      {archive.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {archive.description}
                        </p>
                      )}

                      {/* Plantes liées */}
                      {linkedPlants.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium flex items-center gap-1">
                            <Leaf className="h-4 w-4 text-green-600" />
                            Plantes mentionnées
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {linkedPlants.slice(0, 5).map(plant => (
                              <Link key={plant.id} href={`/plantes/${plant.id}`}>
                                <Badge 
                                  variant="outline" 
                                  className="cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {plant.commonName || plant.scientificName}
                                </Badge>
                              </Link>
                            ))}
                            {linkedPlants.length > 5 && (
                              <Badge variant="secondary">+{linkedPlants.length - 5}</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Image */}
                      {archive.imageUrl && (
                        <img
                          src={archive.imageUrl}
                          alt={archive.title}
                          className="w-full h-32 object-cover rounded-md"
                        />
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
        </TabsContent>
      </Tabs>

      {/* Panneau de détails de l'archive sélectionnée */}
      {selectedArchive && archiveDetails && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="bg-amber-50/50 dark:bg-amber-950/30">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{typeLabels[archiveDetails.type]?.icon}</span>
                  {archiveDetails.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {archiveDetails.dateCreated && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {archiveDetails.dateCreated}
                      {archiveDetails.civilization && ` — ${archiveDetails.civilization}`}
                    </span>
                  )}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedArchive(null)}>
                Fermer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Colonne gauche */}
              <div className="space-y-4">
                {/* Description */}
                {archiveDetails.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{archiveDetails.description}</p>
                  </div>
                )}

                {/* Provenance */}
                {archiveDetails.provenance && (
                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Provenance</h4>
                    <p className="text-sm">{archiveDetails.provenance}</p>
                  </div>
                )}

                {/* Authenticité */}
                <div>
                  <h4 className="font-medium mb-2">Niveau d'authenticité</h4>
                  <div className={`flex items-center gap-2 ${authenticityLabels[archiveDetails.authenticityLevel].color}`}>
                    {(() => {
                      const Icon = authenticityLabels[archiveDetails.authenticityLevel].icon;
                      return <Icon className="h-5 w-5" />;
                    })()}
                    <span>{authenticityLabels[archiveDetails.authenticityLevel].label}</span>
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-4">
                {/* Image */}
                {archiveDetails.imageUrl && (
                  <img
                    src={archiveDetails.imageUrl}
                    alt={archiveDetails.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                {/* Plantes liées avec navigation */}
                {archiveDetails.plantIds && (archiveDetails.plantIds as number[]).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Plantes mentionnées dans cette archive
                    </h4>
                    <div className="space-y-2">
                      {getLinkedPlants(archiveDetails.plantIds as number[]).map(plant => (
                        <Link key={plant.id} href={`/plantes/${plant.id}`}>
                          <div className="flex items-center gap-3 p-2 rounded-lg border hover:bg-green-50 hover:border-green-300 transition-colors cursor-pointer">
                            <Leaf className="h-5 w-5 text-green-600" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{plant.commonName || plant.scientificName}</p>
                              {plant.commonName && plant.scientificName && (
                                <p className="text-xs text-muted-foreground italic">{plant.scientificName}</p>
                              )}
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Molécules liées */}
                {archiveDetails.moleculeIds && (archiveDetails.moleculeIds as number[]).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-purple-600" />
                      Molécules identifiées
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {(archiveDetails.moleculeIds as number[]).length} molécule(s) associée(s)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Références */}
            {archiveDetails.references && Array.isArray(archiveDetails.references) && archiveDetails.references.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Références bibliographiques</h4>
                <div className="space-y-2">
                  {archiveDetails.references.map((ref: any, idx: number) => (
                    <div key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      <span>
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
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
