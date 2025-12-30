import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';

const RADAR_AXES = [
  { key: 'intensity', label: 'Intensité', color: 'hsl(346, 77%, 50%)' },
  { key: 'freshness', label: 'Fraîcheur', color: 'hsl(142, 76%, 36%)' },
  { key: 'warmth', label: 'Chaleur', color: 'hsl(32, 95%, 44%)' },
  { key: 'sweetness', label: 'Douceur', color: 'hsl(217, 91%, 60%)' },
  { key: 'spiciness', label: 'Épicé', color: 'hsl(262, 83%, 58%)' },
  { key: 'earthiness', label: 'Terreux', color: 'hsl(280, 100%, 70%)' },
] as const;

type RadarKey = typeof RADAR_AXES[number]['key'];

export default function RadarCorrelationHeatmap() {
  const { data: recettesWithRadar = [], isLoading } = trpc.recettes.listWithRadar.useQuery();

  // Calculer la matrice de corrélation
  const correlationMatrix = useMemo(() => {
    if (recettesWithRadar.length === 0) return null;

    const axes: RadarKey[] = ['intensity', 'freshness', 'warmth', 'sweetness', 'spiciness', 'earthiness'];
    const matrix: Record<RadarKey, Record<RadarKey, number>> = {} as any;

    // Initialiser la matrice
    axes.forEach(axis1 => {
      matrix[axis1] = {} as any;
      axes.forEach(axis2 => {
        matrix[axis1][axis2] = 0;
      });
    });

    // Extraire les valeurs pour chaque axe
    const values: Record<RadarKey, number[]> = {
      intensity: recettesWithRadar.map(r => r.avgIntensity),
      freshness: recettesWithRadar.map(r => r.avgFreshness),
      warmth: recettesWithRadar.map(r => r.avgWarmth),
      sweetness: recettesWithRadar.map(r => r.avgSweetness),
      spiciness: recettesWithRadar.map(r => r.avgSpiciness),
      earthiness: recettesWithRadar.map(r => r.avgEarthiness),
    };

    // Calculer les moyennes
    const means: Record<RadarKey, number> = {} as any;
    axes.forEach(axis => {
      means[axis] = values[axis].reduce((sum, val) => sum + val, 0) / values[axis].length;
    });

    // Calculer les corrélations de Pearson
    axes.forEach(axis1 => {
      axes.forEach(axis2 => {
        if (axis1 === axis2) {
          matrix[axis1][axis2] = 1;
          return;
        }

        const n = values[axis1].length;
        let sumXY = 0;
        let sumX2 = 0;
        let sumY2 = 0;

        for (let i = 0; i < n; i++) {
          const x = values[axis1][i] - means[axis1];
          const y = values[axis2][i] - means[axis2];
          sumXY += x * y;
          sumX2 += x * x;
          sumY2 += y * y;
        }

        const correlation = sumXY / Math.sqrt(sumX2 * sumY2);
        matrix[axis1][axis2] = isNaN(correlation) ? 0 : correlation;
      });
    });

    return matrix;
  }, [recettesWithRadar]);

  // Fonction pour obtenir la couleur en fonction de la corrélation
  const getCorrelationColor = (value: number): string => {
    if (value > 0.7) return 'bg-green-500';
    if (value > 0.4) return 'bg-green-400';
    if (value > 0.1) return 'bg-green-300';
    if (value > -0.1) return 'bg-gray-300';
    if (value > -0.4) return 'bg-red-300';
    if (value > -0.7) return 'bg-red-400';
    return 'bg-red-500';
  };

  // Fonction pour obtenir l'intensité de l'opacité
  const getOpacity = (value: number): number => {
    return Math.abs(value);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Calcul des corrélations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!correlationMatrix) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucune donnée disponible pour calculer les corrélations
          </CardContent>
        </Card>
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
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Analyse de Corrélations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Heatmap des Axes Radar
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualisez les corrélations entre les 6 axes olfactifs sur {recettesWithRadar.length} recettes
          </p>
        </motion.div>

        {/* Légende */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Interprétation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  La heatmap montre les corrélations de Pearson entre les axes olfactifs. Une corrélation proche de +1 indique que les axes varient ensemble, tandis qu'une corrélation proche de -1 indique qu'ils varient en sens inverse.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded" />
                  <span className="text-sm">Corrélation positive forte (&gt; 0.7)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-300 rounded" />
                  <span className="text-sm">Corrélation positive faible (0.1 - 0.4)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded" />
                  <span className="text-sm">Pas de corrélation (-0.1 - 0.1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-300 rounded" />
                  <span className="text-sm">Corrélation négative faible (-0.4 - -0.1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded" />
                  <span className="text-sm">Corrélation négative forte (&lt; -0.7)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Matrice de Corrélation</CardTitle>
              <CardDescription>
                Coefficient de corrélation de Pearson entre les axes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {/* En-têtes de colonnes */}
                  <div className="flex mb-2">
                    <div className="w-32 shrink-0" />
                    {RADAR_AXES.map(axis => (
                      <div
                        key={axis.key}
                        className="w-24 text-center text-sm font-medium px-2"
                        style={{ color: axis.color }}
                      >
                        {axis.label}
                      </div>
                    ))}
                  </div>

                  {/* Lignes de la matrice */}
                  {RADAR_AXES.map((axis1, i) => (
                    <motion.div
                      key={axis1.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-center mb-2"
                    >
                      {/* En-tête de ligne */}
                      <div
                        className="w-32 text-sm font-medium pr-4 text-right shrink-0"
                        style={{ color: axis1.color }}
                      >
                        {axis1.label}
                      </div>

                      {/* Cellules */}
                      {RADAR_AXES.map(axis2 => {
                        const value = correlationMatrix[axis1.key][axis2.key];
                        const colorClass = getCorrelationColor(value);
                        const opacity = getOpacity(value);

                        return (
                          <div
                            key={axis2.key}
                            className="w-24 h-16 flex items-center justify-center mx-1 rounded-lg relative group"
                            style={{ opacity }}
                          >
                            <div className={`absolute inset-0 ${colorClass} rounded-lg`} />
                            <div className="relative z-10">
                              <div className="text-sm font-bold text-white drop-shadow-lg">
                                {value.toFixed(2)}
                              </div>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                              <div className="text-xs font-medium">
                                {axis1.label} × {axis2.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                r = {value.toFixed(3)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Insights Clés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RADAR_AXES.map((axis1, i) => {
                  // Trouver les corrélations les plus fortes (positives et négatives)
                  const correlations = RADAR_AXES
                    .filter(axis2 => axis2.key !== axis1.key)
                    .map(axis2 => ({
                      axis: axis2,
                      value: correlationMatrix[axis1.key][axis2.key],
                    }))
                    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

                  const strongest = correlations[0];

                  if (Math.abs(strongest.value) < 0.3) return null;

                  return (
                    <div key={axis1.key} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div
                        className="w-3 h-3 rounded-full mt-1 shrink-0"
                        style={{ backgroundColor: axis1.color }}
                      />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium" style={{ color: axis1.color }}>
                            {axis1.label}
                          </span>
                          {' '}
                          {strongest.value > 0 ? 'corrèle positivement' : 'corrèle négativement'}
                          {' avec '}
                          <span className="font-medium" style={{ color: strongest.axis.color }}>
                            {strongest.axis.label}
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            r = {strongest.value.toFixed(2)}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
