import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Network } from "lucide-react";
import { useMemo } from "react";

const COLORS = {
  potentialisation: '#10b981', // green
  stabilisation: '#3b82f6',    // blue
  transformation: '#8b5cf6',   // purple
  masquage: '#f97316'          // orange
};

export default function Statistiques() {
  const { data: synergies, isLoading: loadingSynergies } = trpc.synergies?.list.useQuery();
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules?.list.useQuery();
  const { data: tabacs, isLoading: loadingTabacs } = trpc.tabacs?.list.useQuery();

  // Synergies distribution by type
  const synergiesDistribution = useMemo(() => {
    if (!synergies) return [];
    
    const distribution: Record<string, number> = {};
    synergies?.forEach(s => {
      const type = s.type || 'unknown';
      distribution[type] = (distribution[type] || 0) + 1;
    });

    return Object.entries(distribution).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      percentage: ((count / synergies?.length) * 100).toFixed(1)
    }));
  }, [synergies]);

  // Chemical families distribution
  const familiesDistribution = useMemo(() => {
    if (!molecules) return [];
    
    const distribution: Record<string, number> = {};
    molecules?.forEach(m => {
      if (m.family) {
        distribution[m.family] = (distribution[m.family] || 0) + 1;
      }
    });

    return Object.entries(distribution)
      .map(([family, count]) => ({ family, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 families
  }, [molecules]);

  // Tabacs × Synergies correlation
  const tabacsSynergies = useMemo(() => {
    if (!synergies || !tabacs) return [];
    
    const distribution: Record<string, number> = {};
    synergies?.forEach(s => {
      const tabacName = s.tabacName || 'Unknown';
      distribution[tabacName] = (distribution[tabacName] || 0) + 1;
    });

    return tabacs?.map(t => ({
      name: t.name,
      synergies: distribution[t.name] || 0
    })).sort((a, b) => b.synergies - a.synergies);
  }, [synergies, tabacs]);

  // Top molecules with most synergies
  const topMolecules = useMemo(() => {
    if (!synergies || !molecules) return [];
    
    const distribution: Record<number, number> = {};
    synergies?.forEach(s => {
      const moleculeId = s.moleculeId;
      if (moleculeId !== null) {
        distribution[moleculeId] = (distribution[moleculeId] || 0) + 1;
      }
    });

    return Object.entries(distribution)
      .map(([moleculeId, count]) => {
        const molecule = molecules?.find(m => m.id === parseInt(moleculeId));
        return {
          name: molecule?.name || 'Unknown',
          family: molecule?.family || 'N/A',
          synergies: count
        };
      })
      .sort((a, b) => b.synergies - a.synergies)
      .slice(0, 5);
  }, [synergies, molecules]);

  if (loadingSynergies || loadingMolecules || loadingTabacs) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 section-spacing">
          <div className="container">
            <p className="text-center text-muted-foreground">Chargement des statistiques...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 section-spacing">
        <div className="container">
          <Breadcrumbs />
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Statistiques Avancées</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Analyse quantitative des synergies moléculaires, familles chimiques et corrélations Tabacs × Molécules. 
              Visualisations interactives pour explorer les données de recherche PERFUMUM.
            </p>
          </div>

          {/* Global Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{synergies?.length || 0}</CardTitle>
                <CardDescription>Synergies totales</CardDescription>
              </CardHeader>
            </Card>
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{molecules?.length || 0}</CardTitle>
                <CardDescription>Molécules</CardDescription>
              </CardHeader>
            </Card>
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{tabacs?.length || 0}</CardTitle>
                <CardDescription>Tabacs</CardDescription>
              </CardHeader>
            </Card>
            <Card className="brutal-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">{familiesDistribution.length}</CardTitle>
                <CardDescription>Familles chimiques</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Synergies Distribution Pie Chart */}
            <Card className="brutal-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  <CardTitle>Distribution des Synergies par Type</CardTitle>
                </div>
                <CardDescription>
                  Répartition des {synergies?.length || 0} synergies selon leur type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={synergiesDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {synergiesDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#888'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {synergiesDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[item.name.toLowerCase() as keyof typeof COLORS] }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top 10 Chemical Families Bar Chart */}
            <Card className="brutal-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <CardTitle>Top 10 Familles Chimiques</CardTitle>
                </div>
                <CardDescription>
                  Familles les plus représentées parmi {molecules?.length || 0} molécules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={familiesDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="family" type="category" width={120} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="oklch(0.60 0.15 270)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabacs × Synergies Correlation */}
            <Card className="brutal-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  <CardTitle>Synergies par Tabac</CardTitle>
                </div>
                <CardDescription>
                  Nombre de synergies documentées pour chaque tabac
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tabacsSynergies}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={11} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="synergies" fill="oklch(0.55 0.18 25)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top 5 Molecules with Most Synergies */}
            <Card className="brutal-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <CardTitle>Top 5 Molécules</CardTitle>
                </div>
                <CardDescription>
                  Molécules avec le plus de synergies documentées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMolecules.map((molecule, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{molecule.name}</p>
                        <p className="text-sm text-muted-foreground">{molecule.family}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {molecule.synergies} synergies
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card className="brutal-border">
            <CardHeader>
              <CardTitle>Insights Clés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">📊 Distribution des Synergies</h3>
                <p className="text-sm text-muted-foreground">
                  Les synergies de type <strong>potentialisation</strong> et <strong>stabilisation</strong> représentent 
                  la majorité des interactions documentées, reflétant une approche centrée sur l'amplification et 
                  la préservation des profils olfactifs naturels.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🧪 Familles Chimiques</h3>
                <p className="text-sm text-muted-foreground">
                  Les {familiesDistribution.length} familles chimiques identifiées couvrent un large spectre olfactif, 
                  avec une concentration notable dans les terpènes, aldéhydes et esters qui constituent le cœur 
                  des compositions PERFUMUM.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🔬 Corrélations Tabacs × Molécules</h3>
                <p className="text-sm text-muted-foreground">
                  Les {tabacs?.length || 0} tabacs documentés présentent des profils de synergies distincts, 
                  permettant d'identifier des affinités moléculaires spécifiques pour chaque variété. Cette cartographie 
                  guide la formulation de compositions ciblées.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    <Footer />

    </div>
  );
}
