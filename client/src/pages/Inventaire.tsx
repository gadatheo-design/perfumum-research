import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ArrowUpDown,
  Download,
  Filter,
  Droplet,
  FlaskConical,
  Beaker,
  Loader2
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type SortField = "name" | "stock" | "status" | "type";
type SortOrder = "asc" | "desc";

type MatiereType = "huile_essentielle" | "absolu" | "resinoid" | "concrete" | "co2" | "teinture" | "poudre" | "alcoolat" | "autre";
type MatiereNote = "tete" | "coeur" | "fond" | "tete_coeur" | "coeur_fond";
type MatiereStatus = "en_stock" | "a_commander" | "epuise";
type ExtractionMethod = "distillation" | "extraction_solvant" | "co2_supercritique" | "expression" | "teinture" | "autre";

interface NewMatiereForm {
  name: string;
  botanicalName: string;
  type: MatiereType;
  olfactiveFamily: string;
  note: MatiereNote | "";
  origin: string;
  extractionMethod: ExtractionMethod | "";
  olfactiveProfile: string;
  character: string;
  supplier: string;
  pricePerMl: string;
  stock: string;
  status: MatiereStatus;
  technicalNotes: string;
  manipulationNotes: string;
  maxTemperature: string;
}

const defaultFormState: NewMatiereForm = {
  name: "",
  botanicalName: "",
  type: "huile_essentielle",
  olfactiveFamily: "",
  note: "",
  origin: "",
  extractionMethod: "",
  olfactiveProfile: "",
  character: "",
  supplier: "",
  pricePerMl: "",
  stock: "",
  status: "a_commander",
  technicalNotes: "",
  manipulationNotes: "",
  maxTemperature: "",
};

export default function Inventaire() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<NewMatiereForm>(defaultFormState);

  const utils = trpc.useUtils();
  const { data: matieres, isLoading } = trpc.laboratoire.list.useQuery();
  
  const createMutation = trpc.laboratoire.create.useMutation({
    onSuccess: () => {
      toast.success("Matière ajoutée avec succès");
      utils.laboratoire.list.invalidate();
      setIsDialogOpen(false);
      setFormData(defaultFormState);
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout: " + error.message);
    },
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    
    createMutation.mutate({
      name: formData.name,
      botanicalName: formData.botanicalName || undefined,
      type: formData.type,
      olfactiveFamily: formData.olfactiveFamily || undefined,
      note: formData.note || undefined,
      origin: formData.origin || undefined,
      extractionMethod: formData.extractionMethod || undefined,
      olfactiveProfile: formData.olfactiveProfile || undefined,
      character: formData.character || undefined,
      supplier: formData.supplier || undefined,
      pricePerMl: formData.pricePerMl ? parseFloat(formData.pricePerMl) : undefined,
      stock: formData.stock ? parseFloat(formData.stock) : undefined,
      status: formData.status,
      technicalNotes: formData.technicalNotes || undefined,
      manipulationNotes: formData.manipulationNotes || undefined,
      maxTemperature: formData.maxTemperature ? parseFloat(formData.maxTemperature) : undefined,
    });
  };

  // Compute statistics
  const stats = useMemo(() => {
    if (!matieres) return { total: 0, enStock: 0, aCommander: 0, epuise: 0, valeurTotale: 0 };
    
    const enStock = matieres.filter(m => m.status === "en_stock").length;
    const aCommander = matieres.filter(m => m.status === "a_commander").length;
    const epuise = matieres.filter(m => m.status === "epuise").length;
    const valeurTotale = matieres.reduce((acc, m) => {
      const stock = m.stock || 0;
      const price = m.pricePerMl || 0;
      return acc + (stock * price / 100);
    }, 0);

    return { total: matieres.length, enStock, aCommander, epuise, valeurTotale };
  }, [matieres]);

  // Filter and sort matieres
  const filteredMatieres = useMemo(() => {
    if (!matieres) return [];
    
    let filtered = matieres.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.botanicalName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.supplier?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      const matchesType = typeFilter === "all" || m.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "stock":
          comparison = (a.stock || 0) - (b.stock || 0);
          break;
        case "status":
          comparison = (a.status || "").localeCompare(b.status || "");
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [matieres, searchQuery, statusFilter, typeFilter, sortField, sortOrder]);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "en_stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />En stock</Badge>;
      case "a_commander":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100"><AlertTriangle className="h-3 w-3 mr-1" />À commander</Badge>;
      case "epuise":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" />Épuisé</Badge>;
      default:
        return <Badge variant="outline">Non défini</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "huile_essentielle":
        return <Droplet className="h-4 w-4 text-blue-500" />;
      case "absolu":
        return <FlaskConical className="h-4 w-4 text-purple-500" />;
      case "resinoid":
        return <Beaker className="h-4 w-4 text-amber-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatType = (type: string) => {
    const types: Record<string, string> = {
      huile_essentielle: "Huile Essentielle",
      absolu: "Absolu",
      resinoid: "Résinoïde",
      concrete: "Concrète",
      co2: "CO₂",
      teinture: "Teinture",
      poudre: "Poudre",
      alcoolat: "Alcoolat",
      autre: "Autre"
    };
    return types[type] || type;
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Chargement de l'inventaire...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Inventaire
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Gestion du stock de matières premières du laboratoire PERFUMUM
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary">{stats.total}</div>
                  <p className="text-sm text-muted-foreground">Total matières</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600">{stats.enStock}</div>
                  <p className="text-sm text-muted-foreground">En stock</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-amber-600">{stats.aCommander}</div>
                  <p className="text-sm text-muted-foreground">À commander</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-red-600">{stats.epuise}</div>
                  <p className="text-sm text-muted-foreground">Épuisé</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-600">{safeToFixed(stats, 0)} CHF</div>
                  <p className="text-sm text-muted-foreground">Valeur stock</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b bg-muted/30">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-5xl mx-auto">
              <div className="flex flex-1 gap-4 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une matière..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="en_stock">En stock</SelectItem>
                    <SelectItem value="a_commander">À commander</SelectItem>
                    <SelectItem value="epuise">Épuisé</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="huile_essentielle">Huile Essentielle</SelectItem>
                    <SelectItem value="absolu">Absolu</SelectItem>
                    <SelectItem value="resinoid">Résinoïde</SelectItem>
                    <SelectItem value="concrete">Concrète</SelectItem>
                    <SelectItem value="co2">CO₂</SelectItem>
                    <SelectItem value="teinture">Teinture</SelectItem>
                    <SelectItem value="poudre">Poudre</SelectItem>
                    <SelectItem value="alcoolat">Alcoolat</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Nouvelle Matière Première</DialogTitle>
                      <DialogDescription>
                        Ajoutez une nouvelle matière première à l'inventaire du laboratoire
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Informations de base */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nom *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Ex: Lavande Fine"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="botanicalName">Nom botanique</Label>
                          <Input
                            id="botanicalName"
                            value={formData.botanicalName}
                            onChange={(e) => setFormData({...formData, botanicalName: e.target.value})}
                            placeholder="Ex: Lavandula angustifolia"
                          />
                        </div>
                      </div>
                      
                      {/* Type et Note */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type *</Label>
                          <Select value={formData.type} onValueChange={(v: MatiereType) => setFormData({...formData, type: v})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="huile_essentielle">Huile Essentielle</SelectItem>
                              <SelectItem value="absolu">Absolu</SelectItem>
                              <SelectItem value="resinoid">Résinoïde</SelectItem>
                              <SelectItem value="concrete">Concrète</SelectItem>
                              <SelectItem value="co2">CO₂</SelectItem>
                              <SelectItem value="teinture">Teinture</SelectItem>
                              <SelectItem value="poudre">Poudre</SelectItem>
                              <SelectItem value="alcoolat">Alcoolat</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Note olfactive</Label>
                          <Select value={formData.note} onValueChange={(v: MatiereNote | "") => setFormData({...formData, note: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tete">Tête</SelectItem>
                              <SelectItem value="coeur">Cœur</SelectItem>
                              <SelectItem value="fond">Fond</SelectItem>
                              <SelectItem value="tete_coeur">Tête-Cœur</SelectItem>
                              <SelectItem value="coeur_fond">Cœur-Fond</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Famille et Origine */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="olfactiveFamily">Famille olfactive</Label>
                          <Input
                            id="olfactiveFamily"
                            value={formData.olfactiveFamily}
                            onChange={(e) => setFormData({...formData, olfactiveFamily: e.target.value})}
                            placeholder="Ex: Floral, Boisé, Epicé"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="origin">Origine</Label>
                          <Input
                            id="origin"
                            value={formData.origin}
                            onChange={(e) => setFormData({...formData, origin: e.target.value})}
                            placeholder="Ex: France, Madagascar"
                          />
                        </div>
                      </div>
                      
                      {/* Extraction et Fournisseur */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Méthode d'extraction</Label>
                          <Select value={formData.extractionMethod} onValueChange={(v: ExtractionMethod | "") => setFormData({...formData, extractionMethod: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="distillation">Distillation</SelectItem>
                              <SelectItem value="extraction_solvant">Extraction solvant</SelectItem>
                              <SelectItem value="co2_supercritique">CO₂ supercritique</SelectItem>
                              <SelectItem value="expression">Expression</SelectItem>
                              <SelectItem value="teinture">Teinture</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supplier">Fournisseur</Label>
                          <Input
                            id="supplier"
                            value={formData.supplier}
                            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                            placeholder="Ex: Hermitage Oils"
                          />
                        </div>
                      </div>
                      
                      {/* Profil olfactif */}
                      <div className="space-y-2">
                        <Label htmlFor="olfactiveProfile">Profil olfactif</Label>
                        <Textarea
                          id="olfactiveProfile"
                          value={formData.olfactiveProfile}
                          onChange={(e) => setFormData({...formData, olfactiveProfile: e.target.value})}
                          placeholder="Décrivez les notes olfactives..."
                          rows={2}
                        />
                      </div>
                      
                      {/* Stock et Prix */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="stock">Stock (ml)</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pricePerMl">Prix/ml (CHF)</Label>
                          <Input
                            id="pricePerMl"
                            type="number"
                            step="0.01"
                            value={formData.pricePerMl}
                            onChange={(e) => setFormData({...formData, pricePerMl: e.target.value})}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Statut</Label>
                          <Select value={formData.status} onValueChange={(v: MatiereStatus) => setFormData({...formData, status: v})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en_stock">En stock</SelectItem>
                              <SelectItem value="a_commander">À commander</SelectItem>
                              <SelectItem value="epuise">Épuisé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Notes techniques */}
                      <div className="space-y-2">
                        <Label htmlFor="technicalNotes">Notes techniques</Label>
                        <Textarea
                          id="technicalNotes"
                          value={formData.technicalNotes}
                          onChange={(e) => setFormData({...formData, technicalNotes: e.target.value})}
                          placeholder="Notes sur la conservation, manipulation..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                        {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Ajouter
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Matières Premières ({filteredMatieres.length})</CardTitle>
                  <CardDescription>
                    Inventaire complet des huiles essentielles, absolus, résinoïdes et autres matières
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">
                            <button 
                              onClick={() => toggleSort("name")}
                              className="flex items-center gap-1 hover:text-primary"
                            >
                              Nom
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            <button 
                              onClick={() => toggleSort("type")}
                              className="flex items-center gap-1 hover:text-primary"
                            >
                              Type
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="text-left py-3 px-4 font-medium">Fournisseur</th>
                          <th className="text-right py-3 px-4 font-medium">
                            <button 
                              onClick={() => toggleSort("stock")}
                              className="flex items-center gap-1 hover:text-primary ml-auto"
                            >
                              Stock (ml)
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="text-right py-3 px-4 font-medium">Prix/ml</th>
                          <th className="text-center py-3 px-4 font-medium">
                            <button 
                              onClick={() => toggleSort("status")}
                              className="flex items-center gap-1 hover:text-primary mx-auto"
                            >
                              Statut
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMatieres.map((matiere) => (
                          <tr key={matiere.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {getTypeIcon(matiere.type)}
                                <div>
                                  <div className="font-medium">{matiere.name}</div>
                                  {matiere.botanicalName && (
                                    <div className="text-xs text-muted-foreground italic">{matiere.botanicalName}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {formatType(matiere.type)}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {matiere.supplier || "—"}
                            </td>
                            <td className="py-3 px-4 text-right font-mono">
                              {matiere.stock !== null ? matiere.stock : "—"}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-sm">
                              {matiere.pricePerMl ? `${safeToFixed(matiere.pricePerMl / 100, 2)} CHF` : "—"}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {getStatusBadge(matiere.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredMatieres.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune matière trouvée</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Actions Rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">À Commander</h3>
                        <p className="text-sm text-muted-foreground">{stats.aCommander} matières</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Stock Critique</h3>
                        <p className="text-sm text-muted-foreground">{stats.epuise} épuisées</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Link href="/matieres-premieres">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Plus className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Matières Premières</h3>
                          <p className="text-sm text-muted-foreground">Catalogue complet</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
