import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Radar, Pie } from "react-chartjs-2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

// Palette de couleurs PERFUMUM
const PERFUMUM_COLORS = {
  primary: "rgba(139, 92, 246, 0.8)",      // Violet
  secondary: "rgba(59, 130, 246, 0.8)",    // Bleu
  accent: "rgba(16, 185, 129, 0.8)",       // Vert
  warning: "rgba(245, 158, 11, 0.8)",      // Ambre
  danger: "rgba(239, 68, 68, 0.8)",        // Rouge
  info: "rgba(6, 182, 212, 0.8)",          // Cyan
  axes: [
    "rgba(16, 185, 129, 0.8)",   // AX1 - Vert émeraude
    "rgba(245, 158, 11, 0.8)",   // AX2 - Ambre
    "rgba(59, 130, 246, 0.8)",   // AX3 - Bleu
    "rgba(139, 92, 246, 0.8)",   // AX4 - Violet
    "rgba(236, 72, 153, 0.8)",   // AX5 - Rose
    "rgba(6, 182, 212, 0.8)",    // AX6 - Cyan
  ],
  axesBorder: [
    "rgba(16, 185, 129, 1)",
    "rgba(245, 158, 11, 1)",
    "rgba(59, 130, 246, 1)",
    "rgba(139, 92, 246, 1)",
    "rgba(236, 72, 153, 1)",
    "rgba(6, 182, 212, 1)",
  ],
};

// Options communes pour les graphiques
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        font: { size: 11 },
      },
    },
  },
};

// Graphique de répartition par axe de recherche
export function AxesDistributionChart() {
  const { data: axes, isLoading } = trpc.perfumumAxes.list.useQuery();
  const { data: stats } = trpc.corpusStats.getAll.useQuery();

  const chartData = useMemo(() => {
    if (!axes) return null;

    const labels = axes.map((ax: any) => ax.title_fr?.split(" ").slice(0, 3).join(" ") || ax.axis_id);
    
    // Simuler des données de contenu par axe (à remplacer par des vraies données)
    const dataValues = axes.map((_: any, i: number) => {
      // Distribution approximative basée sur les statistiques
      const baseValue = stats?.content ? Math.floor(stats.content / 6) : 10;
      return baseValue + Math.floor(Math.random() * 5);
    });

    return {
      labels,
      datasets: [
        {
          label: "Notes de recherche",
          data: dataValues,
          backgroundColor: PERFUMUM_COLORS.axes,
          borderColor: PERFUMUM_COLORS.axesBorder,
          borderWidth: 2,
        },
      ],
    };
  }, [axes, stats]);

  if (isLoading || !chartData) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Répartition par axe de recherche</CardTitle>
        <CardDescription>Distribution des notes de recherche selon les 6 axes PERFUMUM</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Bar
          data={chartData}
          options={{
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: "rgba(0,0,0,0.05)" },
              },
              x: {
                grid: { display: false },
                ticks: { font: { size: 10 } },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

// Graphique radar des axes de recherche
export function AxesRadarChart() {
  const { data: axes, isLoading } = trpc.perfumumAxes.list.useQuery();

  const chartData = useMemo(() => {
    if (!axes) return null;

    const labels = axes.map((ax: any) => 
      ax.title_fr?.split(" ").slice(0, 2).join(" ") || ax.axis_id.replace("AX", "Axe ")
    );

    return {
      labels,
      datasets: [
        {
          label: "Progression actuelle",
          data: [75, 60, 85, 45, 30, 55], // Données simulées - à remplacer
          backgroundColor: "rgba(139, 92, 246, 0.2)",
          borderColor: "rgba(139, 92, 246, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(139, 92, 246, 1)",
        },
        {
          label: "Objectif 2030",
          data: [100, 100, 100, 100, 100, 100],
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 0.5)",
          borderWidth: 1,
          borderDash: [5, 5],
          pointBackgroundColor: "rgba(16, 185, 129, 0.5)",
        },
      ],
    };
  }, [axes]);

  if (isLoading || !chartData) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progression des axes</CardTitle>
        <CardDescription>Avancement par rapport aux objectifs 2030</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Radar
          data={chartData}
          options={{
            ...commonOptions,
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                ticks: { stepSize: 25, font: { size: 10 } },
                pointLabels: { font: { size: 10 } },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

// Graphique de répartition des molécules par rôle
export function MoleculesRoleChart() {
  const { data: stats, isLoading } = trpc.perfumumMolecules.getStats.useQuery();

  const chartData = useMemo(() => {
    if (!stats?.byRole) return null;

    const roleLabels: Record<string, string> = {
      diffusion: "Diffusion",
      modulation: "Modulation",
      structure: "Structure",
      fixation: "Fixation",
    };

    const roleColors: Record<string, string> = {
      diffusion: "rgba(56, 189, 248, 0.8)",
      modulation: "rgba(167, 139, 250, 0.8)",
      structure: "rgba(251, 191, 36, 0.8)",
      fixation: "rgba(251, 113, 133, 0.8)",
    };

    return {
      labels: stats.byRole.map((r: any) => roleLabels[r.role] || r.role),
      datasets: [
        {
          data: stats.byRole.map((r: any) => r.count),
          backgroundColor: stats.byRole.map((r: any) => roleColors[r.role] || PERFUMUM_COLORS.primary),
          borderColor: "white",
          borderWidth: 2,
        },
      ],
    };
  }, [stats]);

  if (isLoading || !chartData) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Molécules par rôle</CardTitle>
        <CardDescription>Distribution des molécules selon leur fonction olfactive</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Doughnut
          data={chartData}
          options={{
            ...commonOptions,
            cutout: "60%",
            plugins: {
              ...commonOptions.plugins,
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                  },
                },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

// Graphique de répartition des plantes par famille
export function PlantsFamilyChart() {
  const { data: stats, isLoading } = trpc.perfumumPlants.getStats.useQuery();

  const chartData = useMemo(() => {
    if (!stats?.byFamily) return null;

    // Prendre les 8 familles les plus représentées
    const topFamilies = stats.byFamily.slice(0, 8);

    return {
      labels: topFamilies.map((f: any) => f.family),
      datasets: [
        {
          data: topFamilies.map((f: any) => f.count),
          backgroundColor: [
            "rgba(16, 185, 129, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(6, 182, 212, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(132, 204, 22, 0.8)",
          ],
          borderColor: "white",
          borderWidth: 2,
        },
      ],
    };
  }, [stats]);

  if (isLoading || !chartData) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Plantes par famille</CardTitle>
        <CardDescription>Top 8 des familles botaniques représentées</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Pie
          data={chartData}
          options={{
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                  },
                },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

// Graphique des statistiques globales du corpus
export function CorpusOverviewChart() {
  const { data: stats, isLoading } = trpc.corpusStats.getAll.useQuery();

  const chartData = useMemo(() => {
    if (!stats) return null;

    const categories = [
      { key: "plants", label: "Plantes", color: "rgba(16, 185, 129, 0.8)" },
      { key: "molecules", label: "Molécules", color: "rgba(139, 92, 246, 0.8)" },
      { key: "glossary", label: "Glossaire", color: "rgba(59, 130, 246, 0.8)" },
      { key: "blends", label: "Mélanges", color: "rgba(236, 72, 153, 0.8)" },
      { key: "manuscripts", label: "Manuscrits", color: "rgba(245, 158, 11, 0.8)" },
      { key: "partners", label: "Partenaires", color: "rgba(6, 182, 212, 0.8)" },
    ];

    return {
      labels: categories.map((c) => c.label),
      datasets: [
        {
          label: "Entrées dans le corpus",
          data: categories.map((c) => stats[c.key] || 0),
          backgroundColor: categories.map((c) => c.color),
          borderColor: categories.map((c) => c.color.replace("0.8", "1")),
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [stats]);

  if (isLoading || !chartData) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vue d'ensemble du corpus</CardTitle>
        <CardDescription>Nombre d'entrées par catégorie principale</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Bar
          data={chartData}
          options={{
            ...commonOptions,
            indexAxis: "y" as const,
            plugins: {
              ...commonOptions.plugins,
              legend: { display: false },
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: { color: "rgba(0,0,0,0.05)" },
              },
              y: {
                grid: { display: false },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

// Composant principal regroupant tous les graphiques
export function CorpusChartsSection() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <AxesDistributionChart />
        <AxesRadarChart />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <MoleculesRoleChart />
        <PlantsFamilyChart />
        <CorpusOverviewChart />
      </div>
    </div>
  );
}
