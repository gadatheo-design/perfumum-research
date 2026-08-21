// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

// Couleurs pour les graphiques
const CHART_COLORS = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", 
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
];

export default function InventoryDashboard() {
  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "value" | "quantity">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Données
  const { data: inventoryStats, isLoading: isLoadingStats } = trpc.rawMaterials.getInventoryStats.useQuery();
  const { data: allInventory, isLoading: isLoadingInventory } = trpc.rawMaterials.getAllInventory.useQuery();
  const { data: rawMaterials } = trpc.rawMaterials.getAll.useQuery();

  // Extraire les catégories et fournisseurs uniques
  const categories = useMemo(() => {
    if (!rawMaterials) return [];
    const cats = new Set(rawMaterials?.map(m => m.category).filter(Boolean));
    return Array.from(cats);
  }, [rawMaterials]);

  const suppliers = useMemo(() => {
    if (!allInventory) return [];
    const sups = new Set(allInventory?.map(e => e.supplierName).filter(Boolean));
    return Array.from(sups);
  }, [allInventory]);

  // Filtrer et trier les entrées
  const filteredInventory = useMemo(() => {
    if (!allInventory) return [];
    
    let filtered = [...allInventory];

    // Recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.rawMaterial?.name?.toLowerCase().includes(term) ||
        entry.supplierName?.toLowerCase().includes(term) ||
        entry.batchNumber?.toLowerCase().includes(term)
      );
    }

    // Filtre par fournisseur
    if (supplierFilter && supplierFilter !== "all") {
      filtered = filtered.filter(entry => entry.supplierName === supplierFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.purchaseDate || 0).getTime() - new Date(b.purchaseDate || 0).getTime();
          break;
        case "value":
          comparison = (parseFloat(a.price || "0")) - (parseFloat(b.price || "0"));
          break;
        case "quantity":
          comparison = (parseFloat(a.quantity || "0")) - (parseFloat(b.quantity || "0"));
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [allInventory, searchTerm, supplierFilter, sortBy, sortOrder]);

  // Calculer les alertes de stock bas
  const lowStockAlerts = useMemo(() => {
    if (!allInventory || !rawMaterials) return [];
    
    // Grouper par matière première
    const stockByMaterial: Record<number, { total: number; material: any }> = {};
    
    allInventory?.forEach(entry => {
      if (entry.rawMaterialId) {
        if (!stockByMaterial[entry.rawMaterialId]) {
          stockByMaterial[entry.rawMaterialId] = { 
            total: 0, 
            material: rawMaterials?.find(m => m.id === entry.rawMaterialId) 
          };
        }
        stockByMaterial[entry.rawMaterialId].total += parseFloat(entry.quantity || "0");
      }
    });

    // Identifier les stocks bas (< 5 unités)
    return Object.entries(stockByMaterial)
      .filter(([_, data]) => data.total < 5 && data.material)
      .map(([id, data]) => ({
        id: parseInt(id),
        name: data.material?.name,
        stock: data.total,
        unit: data.material?.unit || "ml",
      }));
  }, [allInventory, rawMaterials]);

  // Calculer les statistiques par mois pour le graphique
  const monthlyStats = useMemo(() => {
    if (!allInventory) return [];
    
    const stats: Record<string, { count: number; value: number }> = {};
    
    allInventory?.forEach(entry => {
      if (entry.purchaseDate) {
        const date = new Date(entry.purchaseDate);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!stats[key]) {
          stats[key] = { count: 0, value: 0 };
        }
        stats[key].count++;
        stats[key].value += parseFloat(entry.price || "0");
      }
    });

    return Object.entries(stats)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, data]) => ({
        month,
        label: new Date(month + "-01").toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
        ...data,
      }));
  }, [allInventory]);

  // Calculer la valeur max pour le graphique
  const maxValue = useMemo(() => {
    return Math.max(...monthlyStats.map(s => s.value), 1);
  }, [monthlyStats]);

  if (isLoadingStats || isLoadingInventory) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Breadcrumbs />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-emerald-500" />
            Tableau de bord Inventaire
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre stock de matières premières
          </p>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Package className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total entrées</p>
                  <p className="text-2xl font-bold">{inventoryStats?.totalEntries || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valeur totale</p>
                  <p className="text-2xl font-bold">
                    {(inventoryStats?.totalValue || 0).toFixed(2)} CHF
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alertes stock</p>
                  <p className="text-2xl font-bold">{lowStockAlerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fournisseurs</p>
                  <p className="text-2xl font-bold">{suppliers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Graphique des achats */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Évolution des achats
              </CardTitle>
              <CardDescription>
                Valeur des achats par mois (12 derniers mois)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyStats.length > 0 ? (
                <div className="h-64 flex items-end gap-2">
                  {monthlyStats.map((stat, i) => (
                    <div key={stat.month} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full rounded-t transition-all hover:opacity-80"
                        style={{ 
                          height: `${(stat.value / maxValue) * 200}px`,
                          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                          minHeight: stat.value > 0 ? "4px" : "0"
                        }}
                        title={`${(stat).toFixed(2)} CHF`}
                      />
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Aucune donnée disponible
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alertes de stock bas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Alertes de stock
              </CardTitle>
              <CardDescription>
                Matières premières à réapprovisionner
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockAlerts.length > 0 ? (
                <div className="space-y-3">
                  {lowStockAlerts.slice(0, 5).map(alert => (
                    <Link key={alert.id} href={`/raw-materials/${alert.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium truncate max-w-[150px]">
                            {alert.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-amber-500 border-amber-500/50">
                          {/* `alert` est l'objet, pas le nombre : appeler
                              `.toFixed()` dessus lève un TypeError dès qu'une
                              alerte existe. La quantité est dans `stock`. */}
                          {alert.stock.toFixed(1)} {alert.unit}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                  {lowStockAlerts.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      + {lowStockAlerts.length - 5} autres alertes
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
                  <p className="text-muted-foreground">
                    Tous les stocks sont suffisants
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Rechercher par nom, fournisseur, lot..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="w-full md:w-48">
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les fournisseurs</SelectItem>
                    {suppliers.map(sup => (
                      <SelectItem key={sup} value={sup || "unknown"}>{sup}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-48">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger>
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date d'achat</SelectItem>
                    <SelectItem value="value">Valeur</SelectItem>
                    <SelectItem value="quantity">Quantité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "desc" ? "↓ Décroissant" : "↑ Croissant"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des entrées */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des achats</CardTitle>
            <CardDescription>
              {filteredInventory.length} entrée{filteredInventory.length > 1 ? "s" : ""} trouvée{filteredInventory.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredInventory.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matière première</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Lot</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.slice(0, 50).map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Link href={`/raw-materials/${entry.rawMaterialId}`}>
                            <span className="font-medium hover:text-primary cursor-pointer">
                              {entry.rawMaterial?.name || `Matière #${entry.rawMaterialId}`}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {entry.purchaseDate ? new Date(entry.purchaseDate).toLocaleDateString("fr-FR") : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {parseFloat(entry.quantity || "0").toFixed(2)} {entry.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {parseFloat(entry.price || "0").toFixed(2)} {entry.currency}
                          </span>
                        </TableCell>
                        <TableCell>
                          {entry.supplierName || "-"}
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground font-mono text-sm">
                            {entry.batchNumber || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/raw-materials/${entry.rawMaterialId}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  Aucune entrée d'inventaire trouvée
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Liens rapides */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/raw-materials">
            <Button variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Voir toutes les matières premières
            </Button>
          </Link>
          <Link href="/analysis-hub">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Hub d'analyse GC-MS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
