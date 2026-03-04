// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beaker, FlaskConical, Sparkles, TrendingUp } from "lucide-react";
import { TimelineChart } from "./charts/TimelineChart";
import { TopMoleculesChart } from "./charts/TopMoleculesChart";

interface AnalyticsDashboardProps {
  totalRecipes: number;
  totalMolecules: number;
  totalAccords: number;
  totalPrototypes: number;
  recipes: any[];
  molecules: any[];
}

export function AnalyticsDashboard({
  totalRecipes,
  totalMolecules,
  totalAccords,
  totalPrototypes,
  recipes,
  molecules,
}: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recettes</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecipes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Formules documentées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Molécules</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMolecules}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Composés référencés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Accords</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccords}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Synergies identifiées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prototypes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrototypes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Fondamentaux (C1-C4)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimelineChart recipes={recipes} />
        <TopMoleculesChart molecules={molecules} />
      </div>
    </div>
  );
}
