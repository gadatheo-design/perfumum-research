// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Beaker, 
  Edit, 
  Search, 
  Plus, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye
} from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 20;

export default function AdminMoleculesIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMolecule, setSelectedMolecule] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [radarValues, setRadarValues] = useState({
    radarIntensity: 50,
    radarFreshness: 50,
    radarWarmth: 50,
    radarSweetness: 50,
    radarSpiciness: 50,
    radarEarthiness: 50,
  });

  const { data: molecules, isLoading, refetch } = trpc.molecules?.list.useQuery();
  
  const updateRadarMutation = trpc.molecules?.updateRadar.useMutation({
    onSuccess: () => {
      toast.success("Profil radar mis à jour avec succès");
      refetch();
      setEditDialogOpen(false);
      setSelectedMolecule(null);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Filtrage et pagination
  const filteredMolecules = molecules?.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.family?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.chemicalFormula?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredMolecules.length / ITEMS_PER_PAGE);
  const paginatedMolecules = filteredMolecules.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEditRadar = (molecule: any) => {
    setSelectedMolecule(molecule);
    setRadarValues({
      radarIntensity: molecule.radarIntensity || 50,
      radarFreshness: molecule.radarFreshness || 50,
      radarWarmth: molecule.radarWarmth || 50,
      radarSweetness: molecule.radarSweetness || 50,
      radarSpiciness: molecule.radarSpiciness || 50,
      radarEarthiness: molecule.radarEarthiness || 50,
    });
    setEditDialogOpen(true);
  };

  const handleSaveRadar = () => {
    if (!selectedMolecule) return;
    updateRadarMutation.mutate({
      id: selectedMolecule.id,
      ...radarValues,
    });
  };

  const radarFields = [
    { key: "radarIntensity", label: "Intensité", color: "oklch(0.60 0.28 330)" },
    { key: "radarFreshness", label: "Fraîcheur", color: "oklch(0.65 0.25 140)" },
    { key: "radarWarmth", label: "Chaleur", color: "oklch(0.60 0.24 20)" },
    { key: "radarSweetness", label: "Douceur", color: "oklch(0.70 0.22 60)" },
    { key: "radarSpiciness", label: "Épices", color: "oklch(0.55 0.26 220)" },
    { key: "radarEarthiness", label: "Terreux", color: "oklch(0.55 0.12 160)" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <Header />
        <main className="flex-1 container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
        <div className="container py-8">
          {/* Header avec navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold">Gestion des Molécules</h1>
                <p className="text-muted-foreground">
                  {molecules?.length || 0} molécules dans la base de données
                </p>
              </div>
            </div>
            <Link href="/admin/molecules/new">
              <Button className="btn-enhanced">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle molécule
              </Button>
            </Link>
          </div>

          {/* Recherche */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Rechercher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, famille ou formule..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tableau des molécules */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des molécules</CardTitle>
              <CardDescription>
                {filteredMolecules.length} molécules trouvées
                {searchTerm && ` pour "${searchTerm}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Famille</TableHead>
                      <TableHead>Formule</TableHead>
                      <TableHead>Radar</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMolecules.map((molecule) => {
                      const hasRadar = molecule.radarIntensity !== null && molecule.radarIntensity !== 50;
                      
                      return (
                        <TableRow key={molecule.id}>
                          <TableCell className="font-mono text-sm">
                            {molecule.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Beaker className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{molecule.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {molecule.family && (
                              <Badge variant="outline">{molecule.family}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {molecule.chemicalFormula || "-"}
                          </TableCell>
                          <TableCell>
                            {hasRadar ? (
                              <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 hover:bg-green-500/30">
                                Configuré
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Par défaut</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/molecule/${molecule.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditRadar(molecule)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Radar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialog d'édition du radar */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profil radar olfactif</DialogTitle>
            <DialogDescription>
              {selectedMolecule?.name} - Ajustez les 6 valeurs radar (0-100)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {radarFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {radarValues[field.key as keyof typeof radarValues]}
                  </span>
                </div>
                <Slider
                  id={field.key}
                  min={0}
                  max={100}
                  step={1}
                  value={[radarValues[field.key as keyof typeof radarValues]]}
                  onValueChange={(value) =>
                    setRadarValues((prev) => ({
                      ...prev,
                      [field.key]: value[0],
                    }))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Faible</span>
                  <span>Moyen</span>
                  <span>Fort</span>
                </div>
              </div>
            ))}

            {/* Aperçu radar */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <p className="text-sm font-medium mb-2">Aperçu radar</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {radarFields.map((field) => (
                  <div key={field.key} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: field.color }}
                    />
                    <span className="text-muted-foreground">
                      {field.label}: {radarValues[field.key as keyof typeof radarValues]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedMolecule(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveRadar}
                disabled={updateRadarMutation.isPending}
                className="btn-enhanced"
              >
                {updateRadarMutation.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
