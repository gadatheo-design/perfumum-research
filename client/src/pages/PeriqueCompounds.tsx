// @ts-nocheck
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Search, FlaskConical, Sparkles, Filter, BarChart3, PieChart, Table2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#8B4513", "#D2691E", "#CD853F", "#DEB887", "#F4A460",
  "#DAA520", "#B8860B", "#A0522D", "#BC8F8F", "#D2B48C",
  "#C4A484", "#8B7355", "#6B4423", "#5D3A1A", "#4A2C0A"
];

const PERFUMERY_COLORS: Record<string, string> = {
  "Exceptionnel": "#FFD700",
  "Très élevé": "#FFA500",
  "Élevé": "#90EE90",
  "Modéré": "#87CEEB",
  "Faible": "#D3D3D3",
};

export default function PeriqueCompounds() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [perfumeryFilter, setPerfumeryFilter] = useState<string>("all");

  const { data: compounds, isLoading } = trpc.research.getPeriqueCompounds.useQuery();

  const categories = useMemo(() => {
    if (!compounds) return [];
    const cats = [...new Set(compounds.map((c: any) => c.category))].filter(Boolean);
    return cats.sort();
  }, [compounds]);

  const filteredCompounds = useMemo(() => {
    if (!compounds) return [];
    return compounds.filter((compound: any) => {
      const matchesSearch = 
        compound.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        compound.odor_description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || compound.category === categoryFilter;
      const matchesPerfumery = perfumeryFilter === "all" || compound.perfumery_potential === perfumeryFilter;
      return matchesSearch && matchesCategory && matchesPerfumery;
    });
  }, [compounds, searchTerm, categoryFilter, perfumeryFilter]);

  const categoryStats = useMemo(() => {
    if (!compounds) return [];
    const stats: Record<string, number> = {};
    compounds.forEach((c: any) => {
      const cat = c.category || "Non classé";
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [compounds]);

  const perfumeryStats = useMemo(() => {
    if (!compounds) return [];
    const stats: Record<string, number> = {};
    compounds.forEach((c: any) => {
      const pot = c.perfumery_potential || "Non évalué";
      stats[pot] = (stats[pot] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [compounds]);

  const newIsolatesCount = useMemo(() => {
    if (!compounds) return 0;
    return compounds.filter((c: any) => c.is_new_isolate).length;
  }, [compounds]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <FlaskConical className="h-8 w-8" />
              Composés du Perique
            </h1>
            <p className="text-muted-foreground mt-1">
              Base de données des 278+ composés chimiques identifiés dans le tabac Perique de Louisiane
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {compounds?.length || 0}
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">Composés totaux</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {newIsolatesCount}
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">Nouveaux isolats</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {categories.length}
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">Catégories chimiques</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {compounds?.filter((c: any) => c.perfumery_potential === "Exceptionnel" || c.perfumery_potential === "Très élevé").length || 0}
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">Potentiel parfumerie élevé</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table2 className="h-4 w-4" />
              Tableau
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Catégories
            </TabsTrigger>
            <TabsTrigger value="perfumery" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Parfumerie
            </TabsTrigger>
          </TabsList>

          {/* Table Tab */}
          <TabsContent value="table" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom ou description olfactive..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={perfumeryFilter} onValueChange={setPerfumeryFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <Sparkles className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Potentiel parfumerie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les potentiels</SelectItem>
                      <SelectItem value="Exceptionnel">Exceptionnel</SelectItem>
                      <SelectItem value="Très élevé">Très élevé</SelectItem>
                      <SelectItem value="Élevé">Élevé</SelectItem>
                      <SelectItem value="Modéré">Modéré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Résultats ({filteredCompounds.length})</span>
                  {searchTerm || categoryFilter !== "all" || perfumeryFilter !== "all" ? (
                    <Badge variant="secondary" className="text-xs">
                      Filtré
                    </Badge>
                  ) : null}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Composé</th>
                        <th className="text-left p-3 font-medium">Catégorie</th>
                        <th className="text-left p-3 font-medium">Description olfactive</th>
                        <th className="text-left p-3 font-medium">Potentiel</th>
                        <th className="text-center p-3 font-medium">Nouveau</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompounds.slice(0, 50).map((compound: any) => (
                        <tr key={compound.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="font-medium text-amber-900 dark:text-amber-100">
                              {compound.name}
                            </div>
                            {compound.cas_number && (
                              <div className="text-xs text-muted-foreground">
                                CAS: {compound.cas_number}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {compound.category || "Non classé"}
                            </Badge>
                          </td>
                          <td className="p-3 max-w-xs">
                            <span className="text-muted-foreground line-clamp-2">
                              {compound.odor_description || "-"}
                            </span>
                          </td>
                          <td className="p-3">
                            {compound.perfumery_potential && (
                              <Badge 
                                className="text-xs"
                                style={{ 
                                  backgroundColor: PERFUMERY_COLORS[compound.perfumery_potential] || "#D3D3D3",
                                  color: compound.perfumery_potential === "Exceptionnel" ? "#000" : "#fff"
                                }}
                              >
                                {compound.perfumery_potential}
                              </Badge>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {compound.is_new_isolate && (
                              <Badge className="bg-green-500 text-white text-xs">
                                Nouveau
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCompounds.length > 50 && (
                    <p className="text-center text-muted-foreground mt-4 text-sm">
                      Affichage des 50 premiers résultats sur {filteredCompounds.length}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Distribution par catégorie chimique</CardTitle>
                <CardDescription>
                  Répartition des {compounds?.length || 0} composés du Perique par famille chimique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryStats}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "var(--background)", 
                          border: "1px solid var(--border)" 
                        }}
                      />
                      <Bar dataKey="value" fill="#8B4513" radius={[0, 4, 4, 0]}>
                        {categoryStats.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Perfumery Tab */}
          <TabsContent value="perfumery">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Potentiel parfumerie</CardTitle>
                  <CardDescription>
                    Évaluation du potentiel des composés pour la parfumerie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={perfumeryStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} safeToFixed(${(percent * 100, 0)}%)`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {perfumeryStats.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={PERFUMERY_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Composés exceptionnels</CardTitle>
                  <CardDescription>
                    Les composés avec le plus haut potentiel parfumerie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {compounds
                      ?.filter((c: any) => c.perfumery_potential === "Exceptionnel" || c.perfumery_potential === "Très élevé")
                      .slice(0, 10)
                      .map((compound: any) => (
                        <div 
                          key={compound.id} 
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{compound.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {compound.odor_description?.slice(0, 50)}...
                            </div>
                          </div>
                          <Badge 
                            style={{ 
                              backgroundColor: PERFUMERY_COLORS[compound.perfumery_potential],
                              color: compound.perfumery_potential === "Exceptionnel" ? "#000" : "#fff"
                            }}
                          >
                            {compound.perfumery_potential}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
