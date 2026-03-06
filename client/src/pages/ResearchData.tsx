// @ts-nocheck
/**
 * Research Data Page
 * 
 * Displays research publications, analytical methods, researchers, and institutions
 * from the scientific literature on cannabis and tobacco pyrolysis/vaporization.
 */

import { safeJsonParse } from "@/lib/utils";
import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  FlaskConical, 
  Users, 
  Building2, 
  Search, 
  TrendingUp,
  Calendar,
  Quote,
  ExternalLink,
  ChevronRight,
  Thermometer,
  Leaf,
  Cigarette,
  Beaker,
  BarChart3
} from 'lucide-react';

export default function ResearchData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data
  const { data: statsData } = trpc.research.getResearchDataStats.useQuery();
  const { data: publicationsData } = trpc.research.getPublications.useQuery({ search: searchQuery });
  const { data: methodsData } = trpc.research.getAnalyticalMethods.useQuery({ search: searchQuery });
  const { data: researchersData } = trpc.research.getResearchers.useQuery({ search: searchQuery });
  const { data: institutionsData } = trpc.research.getInstitutions.useQuery({ search: searchQuery });
  const { data: topCitedData } = trpc.research.getTopCitedPublications.useQuery({ limit: 5 });
  const { data: methodsPerformanceData } = trpc.research.getMethodsPerformance.useQuery();

  const stats = statsData?.data;
  const publications = publicationsData?.data || [];
  const methods = methodsData?.data || [];
  const researchers = researchersData?.data || [];
  const institutions = institutionsData?.data || [];
  const topCited = topCitedData?.data || [];
  const methodsPerformance = methodsPerformanceData?.data || [];

  // Subject matter badge color
  const getSubjectBadge = (subject: string) => {
    switch (subject) {
      case 'cannabis':
        return <Badge className="bg-green-600 hover:bg-green-700"><Leaf className="w-3 h-3 mr-1" /> Cannabis</Badge>;
      case 'tobacco':
        return <Badge className="bg-amber-600 hover:bg-amber-700"><Cigarette className="w-3 h-3 mr-1" /> Tabac</Badge>;
      case 'both':
        return <Badge className="bg-purple-600 hover:bg-purple-700"><Beaker className="w-3 h-3 mr-1" /> Transversal</Badge>;
      default:
        return <Badge variant="secondary">{subject}</Badge>;
    }
  };

  // Research focus badge
  const getFocusBadge = (focus: string) => {
    const focusLabels: Record<string, string> = {
      'terpene_degradation': 'Dégradation terpènes',
      'vaporization': 'Vaporisation',
      'smoke_characterization': 'Fumée',
      'analytical_methods': 'Méthodes analytiques',
      'taxonomy': 'Taxonomie',
    };
    return <Badge variant="outline">{focusLabels[focus] || focus}</Badge>;
  };

  // Status badge for researchers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Actif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      case 'industry':
        return <Badge className="bg-blue-600">Industrie</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/recherche" className="hover:text-foreground">Recherche</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Données scientifiques</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Données de Recherche Scientifique</h1>
        <p className="text-muted-foreground max-w-3xl">
          Publications, méthodes analytiques, chercheurs et institutions de référence dans le domaine 
          de la pyrolyse et vaporisation du cannabis et du tabac.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans les publications, méthodes, chercheurs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="publications" className="gap-2">
            <BookOpen className="w-4 h-4" /> Publications
          </TabsTrigger>
          <TabsTrigger value="methods" className="gap-2">
            <FlaskConical className="w-4 h-4" /> Méthodes
          </TabsTrigger>
          <TabsTrigger value="researchers" className="gap-2">
            <Users className="w-4 h-4" /> Chercheurs
          </TabsTrigger>
          <TabsTrigger value="institutions" className="gap-2">
            <Building2 className="w-4 h-4" /> Institutions
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.publicationCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Publications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <FlaskConical className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.methodCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Méthodes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.researcherCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Chercheurs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Quote className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalCitations || 0}</p>
                    <p className="text-sm text-muted-foreground">Citations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Cited Publications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Publications les plus citées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCited.map((pub: any, index: number) => (
                    <div key={pub.id} className="flex items-start gap-3">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{pub.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{pub.lead_author}</span>
                          <span className="text-xs text-muted-foreground">({pub.year})</span>
                          <Badge variant="secondary" className="text-xs">
                            {pub.citations} citations
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Methods Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5" />
                  Performance des méthodes analytiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {methodsPerformance.slice(0, 6).map((method: any) => (
                    <div key={method.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{method.code}</span>
                        <span className="text-sm text-muted-foreground">
                          {method.performance_score}/10
                        </span>
                      </div>
                      <Progress value={(method.performance_score || 0) * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Publications by Subject */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="w-5 h-5" />
                  Répartition par sujet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.publicationsBySubject?.map((item: any) => (
                    <div key={item.subject_matter} className="flex items-center justify-between">
                      {getSubjectBadge(item.subject_matter)}
                      <span className="font-medium">{item.count} publications</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Publications by Year */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Évolution temporelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.publicationsByYear?.map((item: any) => (
                    <div key={item.year} className="flex items-center justify-between">
                      <span className="font-medium">{item.year}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {item.count} pub.
                        </span>
                        <Badge variant="outline">{item.citations} cit.</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Publications Tab */}
        <TabsContent value="publications">
          <div className="space-y-4">
            {publications.map((pub: any) => (
              <Card key={pub.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{pub.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{pub.authors}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getSubjectBadge(pub.subject_matter)}
                        {getFocusBadge(pub.research_focus)}
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {pub.year}
                        </Badge>
                        {pub.temperature_range && (
                          <Badge variant="outline">
                            <Thermometer className="w-3 h-3 mr-1" />
                            {pub.temperature_range}
                          </Badge>
                        )}
                      </div>
                      {pub.key_findings && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          <strong>Résultats clés:</strong> {pub.key_findings}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{pub.citations}</p>
                      <p className="text-xs text-muted-foreground">citations</p>
                      {pub.doi && (
                        <Button variant="ghost" size="sm" className="mt-2" asChild>
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            DOI
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {publications.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Aucune publication trouvée
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Methods Tab */}
        <TabsContent value="methods">
          <div className="grid md:grid-cols-2 gap-4">
            {methods.map((method: any) => (
              <Card key={method.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{method.code || method.method_id}</CardTitle>
                      <CardDescription>{method.name}</CardDescription>
                    </div>
                    <Badge>{method.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance globale</span>
                        <span>{method.performance_score}/10</span>
                      </div>
                      <Progress value={(method.performance_score || 0) * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Résolution</span>
                        <span>{method.resolution_score}/10</span>
                      </div>
                      <Progress value={(method.resolution_score || 0) * 10} className="h-2 bg-muted" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sensibilité</span>
                        <span>{method.sensitivity_score}/10</span>
                      </div>
                      <Progress value={(method.sensitivity_score || 0) * 10} className="h-2 bg-muted" />
                    </div>
                    {method.detection_limit && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Limite de détection:</strong> {method.detection_limit}
                      </p>
                    )}
                    {method.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {method.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Researchers Tab */}
        <TabsContent value="researchers">
          <div className="grid md:grid-cols-2 gap-4">
            {researchers.map((researcher: any) => (
              <Card key={researcher.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{researcher.name}</CardTitle>
                      <CardDescription>{researcher.status_details}</CardDescription>
                    </div>
                    {getStatusBadge(researcher.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{researcher.total_citations}</p>
                      <p className="text-xs text-muted-foreground">Citations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{researcher.publication_count}</p>
                      <p className="text-xs text-muted-foreground">Publications</p>
                    </div>
                  </div>
                  {researcher.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {researcher.bio}
                    </p>
                  )}
                  {researcher.awards && (
                    <div className="mt-3">
                      {safeJsonParse(researcher.awards, []).map((award: any, i: number) => (
                        <Badge key={i} variant="secondary" className="mr-1">
                          {award.name} ({award.year})
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Institutions Tab */}
        <TabsContent value="institutions">
          <div className="grid md:grid-cols-2 gap-4">
            {institutions.map((inst: any) => (
              <Card key={inst.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{inst.name}</CardTitle>
                      <CardDescription>
                        {inst.city}, {inst.country}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{inst.institution_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{inst.total_citations}</p>
                      <p className="text-xs text-muted-foreground">Citations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{inst.publication_count}</p>
                      <p className="text-xs text-muted-foreground">Publications</p>
                    </div>
                  </div>
                  {inst.department && (
                    <p className="text-sm mb-2">
                      <strong>Département:</strong> {inst.department}
                    </p>
                  )}
                  {inst.research_group && (
                    <p className="text-sm mb-2">
                      <strong>Groupe:</strong> {inst.research_group}
                    </p>
                  )}
                  {inst.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {inst.description}
                    </p>
                  )}
                  {inst.key_contributions && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      <strong>Contributions:</strong> {inst.key_contributions}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
