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
  Sparkles, Search, Filter, Zap, Atom, 
  FlaskConical, TrendingUp, ArrowRight, Layers 
} from 'lucide-react';
import { Link } from 'wouter';

export default function Synergies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const { data: synergies, isLoading, error } = trpc.synergies.list.useQuery();

  // Get unique types
  const types = useMemo(() => {
    if (!synergies) return [];
    const uniqueTypes = new Set(synergies.map((s: any) => s.type).filter(Boolean));
    return Array.from(uniqueTypes);
  }, [synergies]);

  // Filter synergies
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

  // Stats
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
      'potentialisation': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
      'synergie': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
      'modulation': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
      'antagonisme': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
      'complémentarité': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
    };
    return colors[type?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
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
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="py-8 text-center">
              <p className="text-red-600 dark:text-red-400">Erreur: {error.message}</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-green-50/30 dark:to-green-950/10">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white py-16"
        >
          <div className="container">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="w-12 h-12" />
              <h1 className="text-5xl font-bold">Synergies Moléculaires</h1>
            </div>
            <p className="text-xl text-green-100 max-w-3xl mb-8">
              Explorez les interactions entre molécules olfactives. Découvrez comment les terpènes 
              et autres composés se potentialisent, se modulent ou se complètent.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-green-200 text-sm">Synergies documentées</div>
              </div>
              {Object.entries(stats.byType).slice(0, 3).map(([type, count]) => (
                <div key={type} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{count}</div>
                  <div className="text-green-200 text-sm capitalize">{type}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="container py-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une synergie..."
                className="pl-10"
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
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune synergie trouvée</p>
                  <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
                </CardContent>
              </Card>
            ) : (
              filteredSynergies.map((synergy: any, index: number) => (
                <motion.div
                  key={synergy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-green-500/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getTypeIcon(synergy.type)}
                          {synergy.name}
                        </CardTitle>
                        {synergy.type && (
                          <Badge variant="outline" className={getTypeColor(synergy.type)}>
                            {synergy.type}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {synergy.effet && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {synergy.effet}
                        </p>
                      )}
                      {synergy.molecules && (
                        <div className="mt-3 pt-3 border-t">
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Molécules impliquées</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {synergy.molecules.split(',').map((mol: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {mol.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Navigation vers pages connexes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-6 bg-muted/30 rounded-lg"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-green-600" />
              Outils de visualisation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/synergies-heatmap">
                <div className="block p-4 bg-background rounded-lg border hover:border-green-500/50 transition-colors cursor-pointer">
                  <div className="font-medium flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600" />
                    Heatmap Synergies
                  </div>
                  <div className="text-sm text-muted-foreground">Matrice visuelle des interactions</div>
                </div>
              </Link>
              <Link href="/matrice-synergies">
                <div className="block p-4 bg-background rounded-lg border hover:border-green-500/50 transition-colors cursor-pointer">
                  <div className="font-medium flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600" />
                    Matrice Interactive
                  </div>
                  <div className="text-sm text-muted-foreground">Explorer les combinaisons</div>
                </div>
              </Link>
              <Link href="/molecules">
                <div className="block p-4 bg-background rounded-lg border hover:border-green-500/50 transition-colors cursor-pointer">
                  <div className="font-medium flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600" />
                    Molécules
                  </div>
                  <div className="text-sm text-muted-foreground">Base de données moléculaire</div>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
