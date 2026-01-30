import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Leaf, 
  Recycle, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  FlaskConical, 
  Sprout,
  Factory,
  Blend,
  ChevronRight,
  Info,
  Star,
  Package,
  ExternalLink
} from 'lucide-react';
import { Link } from 'wouter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AlternativesDurables() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | undefined>(undefined);
  const [similarityFilter, setSimilarityFilter] = useState<string | undefined>(undefined);

  // Récupérer les alternatives avec filtres
  const { data: alternatives, isLoading } = trpc.sustainableAlternatives.search.useQuery({
    searchQuery: searchQuery || undefined,
    alternativeType: typeFilter as any,
    availability: availabilityFilter as any,
    olfactiveSimilarity: similarityFilter as any,
  });

  // Récupérer les espèces menacées avec leurs alternatives
  const { data: threatenedWithAlternatives } = trpc.sustainableAlternatives.listThreatenedWithAlternatives.useQuery();

  // Récupérer les statistiques
  const { data: stats } = trpc.sustainableAlternatives.getStats.useQuery();

  // Labels pour les types d'alternatives
  const typeLabels: Record<string, { label: string; icon: React.ReactNode; color: string; description: string }> = {
    natural_plant: { 
      label: 'Plante naturelle', 
      icon: <Leaf className="h-4 w-4" />, 
      color: 'bg-green-100 text-green-800 border-green-200',
      description: 'Plante de substitution naturelle avec profil olfactif similaire'
    },
    cultivated: { 
      label: 'Culture durable', 
      icon: <Sprout className="h-4 w-4" />, 
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Variété cultivée de manière durable et responsable'
    },
    synthetic: { 
      label: 'Synthèse', 
      icon: <FlaskConical className="h-4 w-4" />, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Molécule de synthèse reproduisant le profil olfactif'
    },
    biotechnology: { 
      label: 'Biotechnologie', 
      icon: <Factory className="h-4 w-4" />, 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'Produit de fermentation ou biotechnologie'
    },
    blend: { 
      label: 'Mélange', 
      icon: <Blend className="h-4 w-4" />, 
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'Mélange de matières premières reconstituant le profil'
    },
    other: { 
      label: 'Autre', 
      icon: <Package className="h-4 w-4" />, 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      description: 'Autre type d\'alternative'
    },
  };

  // Labels pour la similarité olfactive
  const similarityLabels: Record<string, { label: string; color: string; percentage: string }> = {
    identical: { label: 'Identique', color: 'bg-green-600 text-white', percentage: '100%' },
    very_similar: { label: 'Très similaire', color: 'bg-green-500 text-white', percentage: '>90%' },
    similar: { label: 'Similaire', color: 'bg-yellow-500 text-white', percentage: '70-90%' },
    partial: { label: 'Partiel', color: 'bg-orange-500 text-white', percentage: '50-70%' },
    inspired: { label: 'Inspiré', color: 'bg-orange-400 text-white', percentage: '<50%' },
    different: { label: 'Différent', color: 'bg-gray-500 text-white', percentage: 'Variable' },
  };

  // Labels pour la disponibilité
  const availabilityLabels: Record<string, { label: string; color: string }> = {
    widely_available: { label: 'Largement disponible', color: 'bg-green-100 text-green-800' },
    available: { label: 'Disponible', color: 'bg-blue-100 text-blue-800' },
    limited: { label: 'Limité', color: 'bg-yellow-100 text-yellow-800' },
    rare: { label: 'Rare', color: 'bg-orange-100 text-orange-800' },
    research_only: { label: 'Recherche uniquement', color: 'bg-red-100 text-red-800' },
  };

  // Labels pour le prix
  const priceLabels: Record<string, string> = {
    much_cheaper: '€ (beaucoup moins cher)',
    cheaper: '€€ (moins cher)',
    similar: '€€€ (similaire)',
    more_expensive: '€€€€ (plus cher)',
    much_more_expensive: '€€€€€ (beaucoup plus cher)',
  };

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter(undefined);
    setAvailabilityFilter(undefined);
    setSimilarityFilter(undefined);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* En-tête */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Recycle className="h-10 w-10 text-green-600" />
          <div>
            <h1 className="text-4xl font-bold">Alternatives Durables</h1>
            <p className="text-muted-foreground text-lg">
              Solutions de substitution pour les espèces aromatiques menacées
            </p>
          </div>
        </div>
        
        {/* Lien vers patrimoine menacé */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/patrimoine-menace" className="flex items-center gap-1 hover:text-primary transition-colors">
            <AlertTriangle className="h-4 w-4" />
            Voir le patrimoine menacé
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{stats.totalAlternatives}</div>
              <div className="text-sm text-muted-foreground">Alternatives documentées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600">{stats.speciesWithAlternatives}</div>
              <div className="text-sm text-muted-foreground">Espèces avec alternatives</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">
                {stats.byType?.find(t => t.type === 'natural_plant')?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Alternatives naturelles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">
                {stats.byType?.find(t => t.type === 'synthetic')?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Alternatives synthétiques</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Onglets */}
      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Recherche par critères</TabsTrigger>
          <TabsTrigger value="species">Par espèce menacée</TabsTrigger>
        </TabsList>

        {/* Onglet Recherche */}
        <TabsContent value="search" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Rechercher des alternatives
              </CardTitle>
              <CardDescription>
                Filtrez les alternatives par type, disponibilité et similarité olfactive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom d'espèce ou d'alternative..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtres en ligne */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type d'alternative</label>
                  <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v === 'all' ? undefined : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="natural_plant">Plante naturelle</SelectItem>
                      <SelectItem value="cultivated">Culture durable</SelectItem>
                      <SelectItem value="synthetic">Synthèse</SelectItem>
                      <SelectItem value="biotechnology">Biotechnologie</SelectItem>
                      <SelectItem value="blend">Mélange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Disponibilité</label>
                  <Select value={availabilityFilter} onValueChange={(v) => setAvailabilityFilter(v === 'all' ? undefined : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes disponibilités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes disponibilités</SelectItem>
                      <SelectItem value="widely_available">Largement disponible</SelectItem>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="limited">Limité</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="research_only">Recherche uniquement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Similarité olfactive</label>
                  <Select value={similarityFilter} onValueChange={(v) => setSimilarityFilter(v === 'all' ? undefined : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes similarités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes similarités</SelectItem>
                      <SelectItem value="identical">Identique (100%)</SelectItem>
                      <SelectItem value="very_similar">Très similaire (&gt;90%)</SelectItem>
                      <SelectItem value="similar">Similaire (70-90%)</SelectItem>
                      <SelectItem value="partial">Partiel (50-70%)</SelectItem>
                      <SelectItem value="inspired">Inspiré (&lt;50%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bouton reset */}
              {(searchQuery || typeFilter || availabilityFilter || similarityFilter) && (
                <Button variant="outline" onClick={resetFilters} size="sm">
                  Réinitialiser les filtres
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Résultats */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des alternatives...</p>
            </div>
          ) : alternatives && alternatives.length > 0 ? (
            <div className="grid gap-4">
              {alternatives.map((alt) => (
                <Card key={alt.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Espèce menacée */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-muted-foreground">Espèce menacée</span>
                        </div>
                        <h3 className="font-semibold text-lg">{alt.threatenedPlantName}</h3>
                        <Link 
                          href={`/plants/${alt.threatenedPlantId}`}
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          Voir la fiche <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>

                      {/* Flèche */}
                      <div className="hidden md:flex items-center justify-center">
                        <ChevronRight className="h-8 w-8 text-green-500" />
                      </div>

                      {/* Alternative */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">Alternative durable</span>
                        </div>
                        <h3 className="font-semibold text-lg">{alt.alternativeName}</h3>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {alt.alternativeType && typeLabels[alt.alternativeType] && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className={typeLabels[alt.alternativeType].color}>
                                  {typeLabels[alt.alternativeType].icon}
                                  <span className="ml-1">{typeLabels[alt.alternativeType].label}</span>
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {typeLabels[alt.alternativeType].description}
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {alt.olfactiveSimilarity && similarityLabels[alt.olfactiveSimilarity] && (
                            <Badge className={similarityLabels[alt.olfactiveSimilarity].color}>
                              {similarityLabels[alt.olfactiveSimilarity].label} ({similarityLabels[alt.olfactiveSimilarity].percentage})
                            </Badge>
                          )}
                          
                          {alt.availability && availabilityLabels[alt.availability] && (
                            <Badge variant="outline" className={availabilityLabels[alt.availability].color}>
                              {availabilityLabels[alt.availability].label}
                            </Badge>
                          )}

                          {alt.verified && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}

                          {alt.sustainabilityScore && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              <Star className="h-3 w-3 mr-1" />
                              Score: {alt.sustainabilityScore}/10
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Détails supplémentaires */}
                    {(alt.olfactiveNotes || alt.usageRecommendations || alt.notes) && (
                      <div className="mt-4 pt-4 border-t space-y-2">
                        {alt.olfactiveNotes && (
                          <p className="text-sm">
                            <span className="font-medium">Notes olfactives:</span> {alt.olfactiveNotes}
                          </p>
                        )}
                        {alt.usageRecommendations && (
                          <p className="text-sm">
                            <span className="font-medium">Recommandations:</span> {alt.usageRecommendations}
                          </p>
                        )}
                        {alt.priceComparison && (
                          <p className="text-sm">
                            <span className="font-medium">Prix:</span> {priceLabels[alt.priceComparison] || alt.priceComparison}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Molécules clés */}
                    {alt.keyMolecules && Array.isArray(alt.keyMolecules) && alt.keyMolecules.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Molécules clés:</p>
                        <div className="flex flex-wrap gap-2">
                          {alt.keyMolecules.map((mol: any, idx: number) => (
                            <Badge key={idx} variant="secondary">
                              {mol.name} {mol.percentage && `(${mol.percentage}%)`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune alternative trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || typeFilter || availabilityFilter || similarityFilter
                    ? "Aucune alternative ne correspond à vos critères de recherche."
                    : "La base de données des alternatives durables est vide pour le moment."}
                </p>
                {(searchQuery || typeFilter || availabilityFilter || similarityFilter) && (
                  <Button variant="outline" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Par espèce */}
        <TabsContent value="species" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Espèces menacées et leurs alternatives
              </CardTitle>
              <CardDescription>
                Liste des espèces aromatiques menacées avec les alternatives durables disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {threatenedWithAlternatives && threatenedWithAlternatives.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {threatenedWithAlternatives.map((plant) => (
                    <AccordionItem key={plant.id} value={`plant-${plant.id}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                          <div className="flex-1">
                            <div className="font-medium">{plant.name}</div>
                            {plant.latinName && (
                              <div className="text-sm text-muted-foreground italic">{plant.latinName}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {plant.conservationStatus && (
                              <Badge variant="destructive" className="text-xs">
                                {plant.conservationStatus}
                              </Badge>
                            )}
                            {plant.citesAppendix && plant.citesAppendix !== 'NONE' && (
                              <Badge variant="outline" className="text-xs">
                                CITES {plant.citesAppendix}
                              </Badge>
                            )}
                            <Badge variant="secondary">
                              {plant.alternativeCount} alternative{plant.alternativeCount > 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-4">
                          {/* Infos sur l'espèce */}
                          {plant.conservationNotes && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-orange-500 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-orange-800">Notes de conservation</p>
                                  <p className="text-sm text-orange-700">{plant.conservationNotes}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Alternatives textuelles existantes */}
                          {plant.sustainableAlternatives && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-start gap-2">
                                <Recycle className="h-4 w-4 text-green-500 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-green-800">Alternatives suggérées</p>
                                  <p className="text-sm text-green-700">{plant.sustainableAlternatives}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Liste des alternatives structurées */}
                          {plant.alternatives && plant.alternatives.length > 0 ? (
                            <div className="space-y-3">
                              <p className="text-sm font-medium">Alternatives documentées:</p>
                              {plant.alternatives.map((alt) => (
                                <div key={alt.id} className="border rounded-lg p-4 bg-background">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium">{alt.alternativeName}</h4>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {alt.alternativeType && typeLabels[alt.alternativeType] && (
                                          <Badge variant="outline" className={typeLabels[alt.alternativeType].color}>
                                            {typeLabels[alt.alternativeType].icon}
                                            <span className="ml-1">{typeLabels[alt.alternativeType].label}</span>
                                          </Badge>
                                        )}
                                        {alt.olfactiveSimilarity && similarityLabels[alt.olfactiveSimilarity] && (
                                          <Badge className={similarityLabels[alt.olfactiveSimilarity].color}>
                                            {similarityLabels[alt.olfactiveSimilarity].label}
                                          </Badge>
                                        )}
                                        {alt.availability && availabilityLabels[alt.availability] && (
                                          <Badge variant="outline" className={availabilityLabels[alt.availability].color}>
                                            {availabilityLabels[alt.availability].label}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    {alt.sustainabilityScore && (
                                      <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600">{alt.sustainabilityScore}</div>
                                        <div className="text-xs text-muted-foreground">/10</div>
                                      </div>
                                    )}
                                  </div>
                                  {alt.olfactiveNotes && (
                                    <p className="text-sm text-muted-foreground mt-2">{alt.olfactiveNotes}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              Aucune alternative structurée documentée pour cette espèce.
                            </p>
                          )}

                          {/* Lien vers la fiche */}
                          <div className="pt-2">
                            <Link href={`/plants/${plant.id}`}>
                              <Button variant="outline" size="sm">
                                Voir la fiche complète
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucune espèce menacée avec alternatives documentées.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Guide des types d'alternatives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Guide des types d'alternatives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(typeLabels).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`p-2 rounded-lg ${value.color}`}>
                  {value.icon}
                </div>
                <div>
                  <p className="font-medium">{value.label}</p>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
