import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RecipeTimeline() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const { data: recettes = [], isLoading } = trpc.recettes.list.useQuery();

  // Grouper les recettes par mois
  const timelineData = useMemo(() => {
    const filtered = recettes.filter(r => {
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (selectedYear !== 'all') {
        const year = new Date(r.createdAt).getFullYear();
        if (year.toString() !== selectedYear) return false;
      }
      return true;
    });

    const grouped = new Map<string, { count: number; recettes: typeof recettes }>();

    filtered.forEach(recette => {
      const date = new Date(recette.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, { count: 0, recettes: [] });
      }
      
      const entry = grouped.get(key)!;
      entry.count++;
      entry.recettes.push(recette);
    });

    // Convertir en tableau et trier
    const timeline = Array.from(grouped.entries())
      .map(([key, value]) => ({
        month: key,
        count: value.count,
        recettes: value.recettes,
        label: new Date(key + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return timeline;
  }, [recettes, selectedCategory, selectedYear]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const filtered = recettes.filter(r => {
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (selectedYear !== 'all') {
        const year = new Date(r.createdAt).getFullYear();
        if (year.toString() !== selectedYear) return false;
      }
      return true;
    });

    const totalRecettes = filtered.length;
    const avgPerMonth = timelineData.length > 0 ? (totalRecettes / timelineData.length).toFixed(1) : '0';
    const maxMonth = timelineData.reduce((max, curr) => curr.count > max.count ? curr : max, { count: 0, label: '-' });

    return {
      total: totalRecettes,
      avgPerMonth,
      maxMonth: maxMonth.label,
      maxCount: maxMonth.count,
    };
  }, [recettes, timelineData, selectedCategory, selectedYear]);

  // Extraire les années disponibles
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    recettes.forEach(r => {
      years.add(new Date(r.createdAt).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [recettes]);

  // Extraire les catégories disponibles
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    recettes.forEach(r => {
      if (r.category) categories.add(r.category);
    });
    return Array.from(categories).sort();
  }, [recettes]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Chargement de la timeline...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Timeline Interactive</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Évolution des Recettes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualisez l'évolution temporelle de vos créations olfactives
          </p>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium mb-2 block">Catégorie</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {availableCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium mb-2 block">Année</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les années" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les années</SelectItem>
                      {availableYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedYear('all');
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-4"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Recettes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Moyenne / Mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.avgPerMonth}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Mois le Plus Productif</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-primary">{stats.maxMonth}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Max Recettes / Mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.maxCount}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Graphique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Évolution Temporelle
              </CardTitle>
              <CardDescription>
                Nombre de recettes créées par mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Recettes créées"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Liste détaillée par mois */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Détail par Mois</h2>
          {timelineData.map((month, index) => (
            <motion.div
              key={month.month}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <CardTitle>{month.label}</CardTitle>
                    </div>
                    <Badge variant="secondary">{month.count} recettes</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {month.recettes.map(recette => (
                      <Link key={recette.id} href={`/recette/${recette.id}`}>
                        <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                          <h4 className="font-medium line-clamp-1">{recette.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {recette.description || 'Aucune description'}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {recette.category}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
