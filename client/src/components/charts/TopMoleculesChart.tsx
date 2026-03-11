import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import { useMemo } from "react";

interface Molecule {
  id: number;
  name: string;
}

interface TopMoleculesChartProps {
  molecules: Molecule[];
  title?: string;
  limit?: number;
}

export function TopMoleculesChart({ 
  molecules, 
  title = "Top 10 molécules les plus utilisées",
  limit = 10 
}: TopMoleculesChartProps) {
  const chartData = useMemo(() => {
    // Count molecule occurrences
    const moleculeCounts = new Map<string, number>();

    molecules.forEach((molecule) => {
      const name = molecule.name;
      moleculeCounts.set(name, (moleculeCounts.get(name) || 0) + 1);
    });

    // Convert to array and sort by count
    return Array.from(moleculeCounts.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [molecules, limit]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune donnée de molécule disponible.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number" 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={120}
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
            <Bar 
              dataKey="count" 
              fill="oklch(0.55 0.25 270)" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
