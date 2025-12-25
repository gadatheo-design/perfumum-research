import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

interface RecetteRecommendation {
  recette: {
    id: number;
    name: string;
    category: string | null;
    description: string | null;
    moleculeCount: number;
  };
  similarityScore: number;
}

interface MoleculeRecommendation {
  molecule: {
    id: number;
    name: string;
    family: string | null;
    olfactiveProfile: string | null;
  };
  similarityScore: number;
}

interface RecommendationsCardProps {
  type: 'recettes' | 'molecules';
  recommendations: RecetteRecommendation[] | MoleculeRecommendation[];
  isLoading?: boolean;
}

export function RecommendationsCard({ type, recommendations, isLoading }: RecommendationsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Recommandations similaires
          </CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Recommandations similaires
          </CardTitle>
          <CardDescription>Aucune recommandation disponible</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          {type === 'recettes' ? 'Recettes similaires' : 'Molécules similaires'}
        </CardTitle>
        <CardDescription>
          Basé sur le profil radar olfactif (6 axes)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, index) => {
            const isRecette = 'recette' in rec;
            const item = isRecette ? rec.recette : rec.molecule;
            const href = isRecette ? `/recette/${item.id}` : `/molecule/${item.id}`;
            const description = isRecette
              ? (rec.recette.description || `${rec.recette.moleculeCount} molécules`)
              : (rec.molecule.olfactiveProfile || rec.molecule.family || 'Aucun profil');

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={href}>
                  <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {description}
                        </p>
                        {isRecette && rec.recette.category && (
                          <Badge variant="outline" className="mt-2">
                            {rec.recette.category}
                          </Badge>
                        )}
                        {!isRecette && rec.molecule.family && (
                          <Badge variant="outline" className="mt-2">
                            {rec.molecule.family}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1 text-primary">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-lg font-bold">{rec.similarityScore}%</span>
                        </div>
                        <span className="text-xs text-muted-foreground">similarité</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
