// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface Recipe {
  id: number;
  createdAt?: Date | string | null;
}

interface TimelineChartProps {
  recipes: Recipe[];
  title?: string;
}

export function TimelineChart({ recipes, title = "Évolution temporelle des recettes" }: TimelineChartProps) {
  const chartData = useMemo(() => {
    // Group recipes by month
    const monthCounts = new Map<string, number>();

    recipes.forEach((recipe) => {
      if (!recipe.createdAt) return;

      const date = typeof recipe.createdAt === 'string' 
        ? new Date(recipe.createdAt) 
        : recipe.createdAt;

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1);
    });

    // Convert to array and sort by date
    const data = Array.from(monthCounts.entries())
      .map(([month, count]) => ({
        month,
        count,
        cumulative: 0, // Will be calculated below
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate cumulative count
    let cumulative = 0;
    data.forEach((item) => {
      cumulative += item.count;
      item.cumulative = cumulative;
    });

    return data;
  }, [recipes]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune donnée temporelle disponible.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="oklch(0.55 0.25 270)" 
              strokeWidth={2}
              name="Nouvelles recettes"
              dot={{ fill: 'oklch(0.55 0.25 270)', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="cumulative" 
              stroke="oklch(0.7 0.15 200)" 
              strokeWidth={2}
              name="Total cumulé"
              dot={{ fill: 'oklch(0.7 0.15 200)', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
