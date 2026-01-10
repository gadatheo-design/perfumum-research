import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { trpc } from '../lib/trpc';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Sparkles, Search, Zap, Atom, 
  FlaskConical, TrendingUp, ArrowRight, Layers, Grid3X3, BarChart3 
} from 'lucide-react';
import { Link } from 'wouter';
import { AnimatedCard, HoverScale, FadeInSection } from '@/components/PageTransition';

export default function Synergies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const { data: synergies, isLoading, error } = trpc.synergies.list.useQuery();

  const types = useMemo(() => {
    if (!synergies) return [];
    const uniqueTypes = new Set(synergies.map((s: any) => s.type).filter(Boolean));
    return Array.from(uniqueTypes);
  }, [synergies]);

  const filteredSynergies = useMemo(() => {
    if (!synergies) return [];
    return synergies.filter((synergy: any) => {
      const matchesSearch = !searchQuery || 
        synergy.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        synergy.effet?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || synergy.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [synergies, searchQuery, selectedType]);

  const stats = useMemo(() => {
    if (!synergies) return { total: 0, byType: {} };
    const byType: Record<string, number> = {};
    synergies.forEach((s: any) => {
      if (s.type) {
        byType[s.type] = (byType[s.type] || 0) + 1;
      }
    });
    return { total: synergies.length, byType };
  }, [synergies]);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'potentialisation': 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30',
      'synergie': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      'modulation': 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30',
      'antagonisme': 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
      'complémentarité': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    };
    return colors[type?.toLowerCase()] || 'bg-muted text-muted-foreground border-border';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'potentialisation': <Zap className="w-4 h-4" />,
      'synergie': <Sparkles className="w-4 h-4" />,
      'modulation': <TrendingUp className="w-4 h-4" />,
      'antagonisme': <Atom className="w-4 h-4" />,
    };
    return icons[type?.toLowerCase()] || <FlaskConical className="w-4 h-4" />;
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="py-8 text-center">
              <p className="text-destructive">Erreur: {error.message}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Interactions Moléculaires
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Synergies Moléculaires
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Explorez les interactions entre molécules olfactives. Découvrez comment les terpènes 
                et autres composés se potentialisent, se modulent ou se complètent.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Synergies</div>
                </div>
                {Object.entries(stats.byType).slice(0, 3).map(([type, count]) => (
                  <div key={type} className="bg-muted/50 rounded-lg p-3 border border-border/50">
                    <div className="text-2xl font-bold text-foreground">{count}</div>
                    <div className="text-xs text-muted-foreground capitalize">{type}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container py-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une synergie..."
                className="pl-9 bg-background"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                Tous
              </Button>
              {types.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-sm text-muted-foreground"
          >
            {filteredSynergies.length} {filteredSynergies.length === 1 ? 'synergie trouvée' : 'synergies trouvées'}
          </motion.div>

          {/* Synergies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSynergies.length === 0 ? (
              <Card className="col-span-full border-border/50">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium">Aucune synergie trouvée</p>
                  <p className="text-sm text-muted-foreground mt-1">Essayez de modifier vos critères de recherche</p>
                </CardContent>
              </Card>
            ) : (
              filteredSynergies.map((synergy: any, index: number) => (
                <motion.div
                  key={synergy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <AnimatedCard hoverScale={1.02} hoverY={-4} className="h-full">
                  <Card className="h-full border-border/50 hover:border-primary/40 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          {getTypeIcon(synergy.type)}
                          {synergy.name}
                        </CardTitle>
                        {synergy.type && (
                          <Badge variant="outline" className={`text-xs ${getTypeColor(synergy.type)}`}>
                            {synergy.type}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {synergy.effet && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {synergy.effet}
                        </p>
                      )}
                      {synergy.molecules && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Molécules</span>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {synergy.molecules.split(',').slice(0, 4).map((mol: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs font-normal">
                                {mol.trim()}
                              </Badge>
                            ))}
                            {synergy.molecules.split(',').length > 4 && (
                              <Badge variant="secondary" className="text-xs font-normal">
                                +{synergy.molecules.split(',').length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  </AnimatedCard>
                </motion.div>
              ))
            )}
          </div>

          {/* Navigation vers pages connexes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Card className="border-border/50 bg-muted/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Outils de visualisation
                </CardTitle>
                <CardDescription>Explorez les synergies sous différents angles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/synergies-heatmap">
                    <HoverScale scale={1.03}>
                      <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                        <div className="font-medium flex items-center gap-2 mb-1">
                          <BarChart3 className="w-4 h-4 text-primary" />
                          Heatmap Synergies
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                        </div>
                        <div className="text-sm text-muted-foreground">Matrice visuelle des interactions</div>
                      </div>
                    </HoverScale>
                  </Link>
                  <Link href="/matrice-synergies">
                    <HoverScale scale={1.03}>
                      <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                        <div className="font-medium flex items-center gap-2 mb-1">
                          <Grid3X3 className="w-4 h-4 text-primary" />
                          Matrice Interactive
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                        </div>
                        <div className="text-sm text-muted-foreground">Explorer les combinaisons</div>
                      </div>
                    </HoverScale>
                  </Link>
                  <Link href="/molecules">
                    <HoverScale scale={1.03}>
                      <div className="group p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                        <div className="font-medium flex items-center gap-2 mb-1">
                          <Atom className="w-4 h-4 text-primary" />
                          Molécules
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                        </div>
                        <div className="text-sm text-muted-foreground">Base de données moléculaire</div>
                      </div>
                    </HoverScale>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
