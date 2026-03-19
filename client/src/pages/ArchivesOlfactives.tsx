// @ts-nocheck
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollText, Search, Calendar, MapPin, CheckCircle2, HelpCircle, AlertCircle, Globe, ExternalLink, BookOpen } from 'lucide-react';
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function ArchivesOlfactives() {
  const [searchQuery, setSearchQuery] = useState('');
  const [civilizationFilter, setCivilizationFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [tradSearch, setTradSearch] = useState('');
  const [withGettyOnly, setWithGettyOnly] = useState(false);

  const { data: traditions, isLoading: tradLoading } = trpc.olfactiveArchives.listTraditions.useQuery({
    search: tradSearch || undefined,
    withGettyOnly,
    limit: 100,
  });

  const { data: tradStats } = trpc.olfactiveArchives.traditionStats.useQuery();

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
      <Breadcrumbs />
      {/* En-tête */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ScrollText className="h-10 w-10 text-amber-600" />
          <div>
            <h1 className="text-4xl font-bold">Archives Olfactives</h1>
            <p className="text-muted-foreground text-lg">
              Manuscrits, formules anciennes, découvertes archéologiques et traditions olfactives
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="archives">
        <TabsList className="mb-4">
          <TabsTrigger value="archives" className="gap-2">
            <ScrollText className="h-4 w-4" />
            Archives historiques
          </TabsTrigger>
          <TabsTrigger value="traditions" className="gap-2">
            <Globe className="h-4 w-4" />
            Traditions olfactives
            {tradStats && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">{tradStats.total}</span>}
          </TabsTrigger>
        </TabsList>

        {/* ===== ONGLET TRADITIONS OLFACTIVES ===== */}
        <TabsContent value="traditions" className="space-y-6">
          {/* Stats */}
          {tradStats && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{tradStats.total}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">Traditions totales</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{tradStats.withGetty}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Liées au Getty AAT</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{tradStats.withWikidata}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Liées à Wikidata</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filtres traditions */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une tradition..."
                value={tradSearch}
                onChange={(e) => setTradSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <button
              onClick={() => setWithGettyOnly(!withGettyOnly)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                withGettyOnly
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-background text-foreground border-border hover:bg-muted'
              }`}
            >
              Getty AAT uniquement
            </button>
          </div>

          {/* Liste des traditions */}
          {tradLoading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[...Array(6)].map((_, i) => <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />)}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {(traditions || []).map((trad: any) => (
                <Card key={trad.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">{trad.name}</h3>
                        {trad.region && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />{trad.region}
                            {trad.period && <span className="ml-2"><Calendar className="h-3 w-3 inline" /> {trad.period}</span>}
                          </p>
                        )}
                        {trad.description && (
                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{trad.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {trad.getty_aat_id && (
                            <a
                              href={`https://vocab.getty.edu/${trad.getty_aat_id.replace('aat:', 'page/aat/')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                              Getty AAT
                              {trad.getty_aat_label && <span className="opacity-70">— {trad.getty_aat_label}</span>}
                            </a>
                          )}
                          {trad.wikidata_qid && (
                            <a
                              href={`https://www.wikidata.org/wiki/${trad.wikidata_qid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                              Wikidata
                            </a>
                          )}
                          {!trad.getty_aat_id && !trad.wikidata_id && (
                            <span className="text-xs text-muted-foreground italic">Aucun identifiant externe</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(traditions || []).length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Aucune tradition trouvée.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* ===== ONGLET ARCHIVES HISTORIQUES ===== */}
        <TabsContent value="archives">

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
        </TabsContent>
      </Tabs>
    </div>
  );
}
