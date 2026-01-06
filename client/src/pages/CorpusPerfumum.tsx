import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { 
  Dna, BookOpen, Leaf, FlaskConical, Users, ScrollText, 
  Route, BookMarked, Sparkles, Thermometer, BarChart3, 
  Eye, Microscope, TestTube, Search, ArrowRight, Database
} from "lucide-react";

// Composant pour afficher les statistiques du corpus
function CorpusStats() {
  const { data: stats, isLoading } = trpc.corpusStats.getAll.useQuery();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  const statItems = [
    { key: 'axes', label: 'Axes de recherche', icon: Dna, color: 'text-primary' },
    { key: 'content', label: 'Notes de recherche', icon: BookOpen, color: 'text-blue-500' },
    { key: 'plants', label: 'Plantes aromatiques', icon: Leaf, color: 'text-green-500' },
    { key: 'molecules', label: 'Molécules', icon: FlaskConical, color: 'text-purple-500' },
    { key: 'partners', label: 'Partenaires', icon: Users, color: 'text-amber-500' },
    { key: 'manuscripts', label: 'Manuscrits', icon: ScrollText, color: 'text-rose-500' },
    { key: 'routes', label: 'Routes commerciales', icon: Route, color: 'text-cyan-500' },
    { key: 'glossary', label: 'Termes glossaire', icon: BookMarked, color: 'text-indigo-500' },
    { key: 'blends', label: 'Mélanges olfactifs', icon: Sparkles, color: 'text-pink-500' },
    { key: 'observations', label: 'Observations citoyennes', icon: Eye, color: 'text-teal-500' },
    { key: 'herbarium', label: 'Échantillons herbier', icon: Microscope, color: 'text-lime-500' },
    { key: 'tissue', label: 'Cultures tissulaires', icon: TestTube, color: 'text-orange-500' },
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {statItems.map(({ key, label, icon: Icon, color }) => (
        <Card key={key} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="text-2xl font-bold">{stats?.[key] || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Composant pour les axes de recherche
function ResearchAxesSection() {
  const { data: axes, isLoading } = trpc.perfumumAxes.list.useQuery();
  
  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted rounded-lg"></div>;
  }
  
  const axisColors: Record<string, string> = {
    'AX1_GENOMIC_CONSERVATION': 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700',
    'AX2_ETHNOBOTANY_COMP': 'bg-amber-500/10 border-amber-500/30 text-amber-700',
    'AX3_ANALYTICAL_TRANS_EPOCH': 'bg-blue-500/10 border-blue-500/30 text-blue-700',
    'AX4_CONSERVATION_BIOTECH': 'bg-purple-500/10 border-purple-500/30 text-purple-700',
    'AX5_IMMERSIVE_DEMOCRAT': 'bg-pink-500/10 border-pink-500/30 text-pink-700',
    'AX6_OLFACTIVE_DIPLOMACY': 'bg-cyan-500/10 border-cyan-500/30 text-cyan-700',
  };
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {axes?.map((axis: any) => (
        <Card key={axis.axis_id} className={`border-2 ${axisColors[axis.axis_id] || 'border-border'} hover:shadow-lg transition-all`}>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">{axis.axis_id}</Badge>
              <Badge variant="secondary" className="text-xs">{axis.status}</Badge>
            </div>
            <CardTitle className="text-lg">{axis.title_fr}</CardTitle>
            <CardDescription>{axis.tagline_fr}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href={`/corpus/axe/${axis.slug}`}>
                Explorer cet axe <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Composant pour les plantes
function PlantsSection() {
  const [familyFilter, setFamilyFilter] = useState<string>("");
  const { data: plants, isLoading } = trpc.perfumumPlants.list.useQuery(
    familyFilter ? { family: familyFilter } : undefined
  );
  const { data: stats } = trpc.perfumumPlants.getStats.useQuery();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={familyFilter} onValueChange={setFamilyFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les familles</SelectItem>
            {stats?.byFamily?.map((f: any) => (
              <SelectItem key={f.family} value={f.family}>
                {f.family} ({f.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {plants?.length || 0} plantes affichées
        </span>
      </div>
      
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 h-32"></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plants?.map((plant: any) => (
            <Card key={plant.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{plant.name}</CardTitle>
                <CardDescription className="italic text-sm">{plant.latin_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {plant.family && <Badge variant="outline" className="text-xs">{plant.family}</Badge>}
                  {plant.climatic_axis && <Badge variant="secondary" className="text-xs">{plant.climatic_axis}</Badge>}
                </div>
                {plant.olfactive_signature && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{plant.olfactive_signature}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant pour les molécules
function MoleculesSection() {
  const [roleFilter, setRoleFilter] = useState<string>("");
  const { data: molecules, isLoading } = trpc.perfumumMolecules.list.useQuery(
    roleFilter ? { role: roleFilter } : undefined
  );
  const { data: stats } = trpc.perfumumMolecules.getStats.useQuery();
  
  const roleColors: Record<string, string> = {
    'diffusion': 'bg-sky-100 text-sky-700',
    'modulation': 'bg-violet-100 text-violet-700',
    'structure': 'bg-amber-100 text-amber-700',
    'fixation': 'bg-rose-100 text-rose-700',
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les rôles</SelectItem>
            {stats?.byRole?.map((r: any) => (
              <SelectItem key={r.role} value={r.role}>
                {r.role} ({r.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {molecules?.length || 0} molécules affichées
        </span>
      </div>
      
      {isLoading ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 h-24"></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {molecules?.map((mol: any) => (
            <Card key={mol.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-medium">{mol.molecule_name}</h4>
                <div className="flex flex-wrap gap-1">
                  {mol.family && <Badge variant="outline" className="text-xs">{mol.family}</Badge>}
                  {mol.role && (
                    <Badge className={`text-xs ${roleColors[mol.role] || ''}`}>{mol.role}</Badge>
                  )}
                </div>
                {mol.odor_key && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{mol.odor_key}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant pour le glossaire
function GlossarySection() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: glossary, isLoading } = trpc.perfumumGlossary.list.useQuery();
  
  const filteredGlossary = glossary?.filter((term: any) =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition_fr.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un terme..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 h-20"></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGlossary?.map((term: any) => (
            <Card key={term.term_id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{term.term}</CardTitle>
                {term.category && (
                  <Badge variant="outline" className="w-fit text-xs">{term.category}</Badge>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{term.definition_fr}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant pour les mélanges olfactifs
function ScentBlendsSection() {
  const [axisFilter, setAxisFilter] = useState<string>("");
  const { data: blends, isLoading } = trpc.scentBlends.list.useQuery(
    axisFilter ? { climateAxis: axisFilter } : undefined
  );
  
  const axisLabels: Record<string, string> = {
    'vent': '🌬️ Vent',
    'bois': '🌲 Bois',
    'peau': '👤 Peau',
    'disparition': '💨 Disparition',
  };
  
  const mediumLabels: Record<string, string> = {
    'parfum': '💧 Parfum',
    'encens': '🔥 Encens',
    'espace': '🏠 Espace',
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={axisFilter} onValueChange={setAxisFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par axe climatique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les axes</SelectItem>
            <SelectItem value="vent">🌬️ Vent</SelectItem>
            <SelectItem value="bois">🌲 Bois</SelectItem>
            <SelectItem value="peau">👤 Peau</SelectItem>
            <SelectItem value="disparition">💨 Disparition</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {blends?.length || 0} mélanges affichés
        </span>
      </div>
      
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 h-32"></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blends?.map((blend: any) => (
            <Card key={blend.blend_id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{axisLabels[blend.climate_axis] || blend.climate_axis}</Badge>
                  <Badge variant="secondary">{mediumLabels[blend.intended_medium] || blend.intended_medium}</Badge>
                </div>
                <CardTitle className="text-base">{blend.concept || blend.blend_id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {blend.materials?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {blend.materials.slice(0, 5).map((mat: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">{mat}</Badge>
                    ))}
                    {blend.materials.length > 5 && (
                      <Badge variant="outline" className="text-xs">+{blend.materials.length - 5}</Badge>
                    )}
                  </div>
                )}
                {blend.safety_notes && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{blend.safety_notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant pour les métriques d'impact
function ImpactMetricsSection() {
  const { data: metrics, isLoading } = trpc.impactMetrics.list.useQuery();
  
  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted rounded-lg"></div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Année</th>
              <th className="text-center p-3 font-medium">Génomes séquencés</th>
              <th className="text-center p-3 font-medium">Profils chimiques</th>
              <th className="text-center p-3 font-medium">Documents numérisés</th>
              <th className="text-center p-3 font-medium">Contributeurs citoyens</th>
              <th className="text-center p-3 font-medium">Partenaires</th>
            </tr>
          </thead>
          <tbody>
            {metrics?.map((metric: any) => (
              <tr key={metric.year} className="border-b hover:bg-muted/50">
                <td className="p-3 font-medium">{metric.year}</td>
                <td className="text-center p-3">{metric.genomes_sequenced_target}</td>
                <td className="text-center p-3">{metric.chemical_profiles_target}</td>
                <td className="text-center p-3">{metric.documents_digitized_target}</td>
                <td className="text-center p-3">{metric.citizen_contributors_target}</td>
                <td className="text-center p-3">{metric.partners_target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CorpusPerfumum() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-spacing bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Database className="h-10 w-10 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold">Corpus PERFUMUM</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Base de données centralisée du projet de recherche olfactive PERFUMUM.
                Explorez les 6 axes de recherche, les plantes aromatiques, les molécules et les données ethnobotaniques.
              </p>
            </div>
          </div>
        </section>
        
        {/* Statistics Section */}
        <section className="section-spacing">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Vue d'ensemble du corpus</h2>
            <CorpusStats />
          </div>
        </section>
        
        {/* Main Content Tabs */}
        <section className="section-spacing bg-muted/30">
          <div className="container">
            <Tabs defaultValue="axes" className="space-y-6">
              <TabsList className="flex flex-wrap h-auto gap-2 bg-background p-2 rounded-lg">
                <TabsTrigger value="axes" className="gap-2">
                  <Dna className="h-4 w-4" /> Axes de recherche
                </TabsTrigger>
                <TabsTrigger value="plants" className="gap-2">
                  <Leaf className="h-4 w-4" /> Plantes
                </TabsTrigger>
                <TabsTrigger value="molecules" className="gap-2">
                  <FlaskConical className="h-4 w-4" /> Molécules
                </TabsTrigger>
                <TabsTrigger value="glossary" className="gap-2">
                  <BookMarked className="h-4 w-4" /> Glossaire
                </TabsTrigger>
                <TabsTrigger value="blends" className="gap-2">
                  <Sparkles className="h-4 w-4" /> Mélanges
                </TabsTrigger>
                <TabsTrigger value="metrics" className="gap-2">
                  <BarChart3 className="h-4 w-4" /> Métriques
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="axes" className="space-y-6">
                <h2 className="text-2xl font-bold">Les 6 axes de recherche PERFUMUM</h2>
                <p className="text-muted-foreground">
                  Le projet PERFUMUM s'articule autour de 6 axes de recherche complémentaires, 
                  couvrant la conservation génomique, l'ethnobotanique, l'analyse chimique, 
                  la biotechnologie, l'immersion sensorielle et la diplomatie olfactive.
                </p>
                <ResearchAxesSection />
              </TabsContent>
              
              <TabsContent value="plants" className="space-y-6">
                <h2 className="text-2xl font-bold">Plantes aromatiques</h2>
                <p className="text-muted-foreground">
                  Catalogue des plantes aromatiques documentées dans le cadre du projet PERFUMUM,
                  avec leurs signatures olfactives et leurs usages traditionnels.
                </p>
                <PlantsSection />
              </TabsContent>
              
              <TabsContent value="molecules" className="space-y-6">
                <h2 className="text-2xl font-bold">Molécules olfactives</h2>
                <p className="text-muted-foreground">
                  Répertoire des molécules olfactives identifiées, classées par famille chimique
                  et par rôle dans la composition (diffusion, modulation, structure, fixation).
                </p>
                <MoleculesSection />
              </TabsContent>
              
              <TabsContent value="glossary" className="space-y-6">
                <h2 className="text-2xl font-bold">Glossaire PERFUMUM</h2>
                <p className="text-muted-foreground">
                  Définitions des termes clés utilisés dans le projet de recherche PERFUMUM.
                </p>
                <GlossarySection />
              </TabsContent>
              
              <TabsContent value="blends" className="space-y-6">
                <h2 className="text-2xl font-bold">Mélanges olfactifs</h2>
                <p className="text-muted-foreground">
                  Compositions olfactives expérimentales organisées selon la matrice 
                  axe climatique × médium (parfum, encens, espace).
                </p>
                <ScentBlendsSection />
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-6">
                <h2 className="text-2xl font-bold">Métriques d'impact</h2>
                <p className="text-muted-foreground">
                  Objectifs et indicateurs de progression du projet PERFUMUM sur 10 ans (2025-2035).
                </p>
                <ImpactMetricsSection />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
