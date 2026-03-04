// @ts-nocheck
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PieChart, BarChart3, TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export function StatisticsCharts() {
  const { data: stats, isLoading } = trpc.analytics.getStatistics.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucune statistique disponible
      </div>
    );
  }

  // Graphique 1 : Distribution familles chimiques (Camembert)
  const familyData = {
    labels: Object.keys(stats.familyDistribution),
    datasets: [
      {
        label: 'Molécules',
        data: Object.values(stats.familyDistribution),
        backgroundColor: [
          'oklch(0.55 0.25 290)', // primary
          'oklch(0.60 0.28 330)', // chart-1
          'oklch(0.65 0.25 140)', // chart-2
          'oklch(0.70 0.22 60)',  // chart-3
          'oklch(0.55 0.26 220)', // chart-4
          'oklch(0.60 0.24 20)',  // chart-5
          'oklch(0.50 0.18 25)',  // volcanique
          'oklch(0.55 0.12 160)', // petrichor
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Graphique 2 : Top 10 molécules consultées (Barres)
  const topMoleculesData = {
    labels: stats.topMolecules.map(t => t.molecule?.name || 'Inconnue').slice(0, 10),
    datasets: [
      {
        label: 'Vues',
        data: stats.topMolecules.map(t => t.views).slice(0, 10),
        backgroundColor: 'oklch(0.55 0.25 290)',
        borderColor: 'oklch(0.55 0.25 290)',
        borderWidth: 2,
      },
    ],
  };

  // Graphique 3 : Évolution mensuelle (Courbe)
  const monthlyEvolutionData = {
    labels: stats.monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Molécules',
        data: stats.monthlyData.map(d => d.molecules),
        borderColor: 'oklch(0.55 0.25 290)',
        backgroundColor: 'oklch(0.55 0.25 290 / 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Recettes',
        data: stats.monthlyData.map(d => d.recettes),
        borderColor: 'oklch(0.60 0.28 330)',
        backgroundColor: 'oklch(0.60 0.28 330 / 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          font: {
            family: 'Space Grotesk',
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
      y: {
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
        grid: {
          color: 'hsl(var(--border))',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          font: {
            family: 'Space Grotesk',
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="brutal-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Molécules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.totalMolecules}</div>
          </CardContent>
        </Card>
        <Card className="brutal-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Recettes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.totalRecettes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique 1 : Distribution familles */}
        <Card className="brutal-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle>Distribution des Familles Chimiques</CardTitle>
            </div>
            <CardDescription>Répartition des molécules par famille</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie data={familyData} options={pieOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Graphique 2 : Top molécules */}
        <Card className="brutal-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Top 10 Molécules Consultées</CardTitle>
            </div>
            <CardDescription>Molécules les plus vues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar data={topMoleculesData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique 3 : Évolution mensuelle (pleine largeur) */}
      <Card className="brutal-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Évolution Mensuelle 2025</CardTitle>
          </div>
          <CardDescription>Croissance du catalogue au fil de l'année</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Line data={monthlyEvolutionData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
