// @ts-nocheck
import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Search, 
  ArrowLeft,
  GripVertical,
  Beaker,
  BookOpen,
  Plus,
  X,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PendingLink {
  moleculeId: number;
  moleculeName: string;
  recetteId: number;
  recetteName: string;
  proportion: number;
  role: string;
}

export default function MoleculeRecetteDragDrop() {
  const [searchMolecule, setSearchMolecule] = useState("");
  const [searchRecette, setSearchRecette] = useState("");
  const [selectedMolecules, setSelectedMolecules] = useState<Set<number>>(new Set());
  const [selectedRecettes, setSelectedRecettes] = useState<Set<number>>(new Set());
  const [pendingLinks, setPendingLinks] = useState<PendingLink[]>([]);
  const [defaultProportion, setDefaultProportion] = useState(10);
  const [defaultRole, setDefaultRole] = useState("cœur");

  const utils = trpc.useUtils();

  // Queries
  const { data: molecules, isLoading: loadingMolecules } = trpc.molecules.list.useQuery();
  const { data: recettes, isLoading: loadingRecettes } = trpc.recettes.list.useQuery();
  const { data: existingRelations } = trpc.molecules.getAllRecetteRelationsWithNames.useQuery();

  // Mutation
  const createLinks = trpc.molecules.createMultipleRecettes.useMutation({
    onSuccess: (result) => {
      if (result.created > 0) {
        toast.success(`${result.created} liaison(s) créée(s) avec succès !`);
        setPendingLinks([]);
        setSelectedMolecules(new Set());
        setSelectedRecettes(new Set());
        utils.molecules.getRecetteAuditStats.invalidate();
        utils.molecules.getAllRecetteRelationsWithNames.invalidate();
      }
      if (result.errors.length > 0) {
        toast.warning(`${result.errors.length} erreur(s) : ${result.errors[0]}`);
      }
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });

  // Set des relations existantes
  const existingSet = useMemo(() => {
    if (!existingRelations) return new Set<string>();
    return new Set(existingRelations.map((r: any) => `${r.moleculeId}-${r.recetteId}`));
  }, [existingRelations]);

  // Filtrer les molécules
  const filteredMolecules = useMemo(() => {
    if (!molecules) return [];
    return molecules.filter((m: any) =>
      m.name.toLowerCase().includes(searchMolecule.toLowerCase())
    );
  }, [molecules, searchMolecule]);

  // Filtrer les recettes
  const filteredRecettes = useMemo(() => {
    if (!recettes) return [];
    return recettes.filter((r: any) =>
      r.name.toLowerCase().includes(searchRecette.toLowerCase())
    );
  }, [recettes, searchRecette]);

  // Toggle sélection molécule
  const toggleMolecule = useCallback((id: number) => {
    setSelectedMolecules(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Toggle sélection recette
  const toggleRecette = useCallback((id: number) => {
    setSelectedRecettes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Créer les liaisons en attente
  const createPendingLinks = useCallback(() => {
    if (selectedMolecules.size === 0 || selectedRecettes.size === 0) {
      toast.warning("Sélectionnez au moins une molécule et une recette");
      return;
    }

    const newLinks: PendingLink[] = [];
    const moleculeMap = new Map(molecules?.map((m: any) => [m.id, m.name]) || []);
    const recetteMap = new Map(recettes?.map((r: any) => [r.id, r.name]) || []);

    selectedMolecules.forEach(moleculeId => {
      selectedRecettes.forEach(recetteId => {
        const key = `${moleculeId}-${recetteId}`;
        // Vérifier si la liaison existe déjà ou est en attente
        if (!existingSet.has(key) && !pendingLinks.some(l => l.moleculeId === moleculeId && l.recetteId === recetteId)) {
          newLinks.push({
            moleculeId,
            moleculeName: moleculeMap.get(moleculeId) || `Molécule #${moleculeId}`,
            recetteId,
            recetteName: recetteMap.get(recetteId) || `Recette #${recetteId}`,
            proportion: defaultProportion,
            role: defaultRole,
          });
        }
      });
    });

    if (newLinks.length === 0) {
      toast.info("Toutes les liaisons sélectionnées existent déjà");
      return;
    }

    setPendingLinks(prev => [...prev, ...newLinks]);
    toast.success(`${newLinks.length} liaison(s) ajoutée(s) à la file d'attente`);
  }, [selectedMolecules, selectedRecettes, molecules, recettes, existingSet, pendingLinks, defaultProportion, defaultRole]);

  // Supprimer une liaison en attente
  const removePendingLink = useCallback((index: number) => {
    setPendingLinks(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Sauvegarder toutes les liaisons
  const saveAllLinks = useCallback(() => {
    if (pendingLinks.length === 0) {
      toast.warning("Aucune liaison en attente");
      return;
    }

    createLinks.mutate(pendingLinks.map(l => ({
      moleculeId: l.moleculeId,
      recetteId: l.recetteId,
      proportion: l.proportion,
      role: l.role,
    })));
  }, [pendingLinks, createLinks]);

  const isLoading = loadingMolecules || loadingRecettes;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/molecule-recette-linking">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour Liaisons
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <GripVertical className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Création en masse</h1>
                  <p className="text-muted-foreground">
                    Sélectionnez des molécules et des recettes pour créer des liaisons rapidement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Chargement...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Colonne Molécules */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Beaker className="h-5 w-5 text-blue-500" />
                        Molécules
                        {selectedMolecules.size > 0 && (
                          <Badge variant="secondary">{selectedMolecules.size} sélectionnée(s)</Badge>
                        )}
                      </CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher..."
                          value={searchMolecule}
                          onChange={(e) => setSearchMolecule(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] overflow-y-auto space-y-1">
                        {filteredMolecules.slice(0, 100).map((m: any) => {
                          const isSelected = selectedMolecules.has(m.id);
                          return (
                            <div
                              key={m.id}
                              onClick={() => toggleMolecule(m.id)}
                              className={`p-2 rounded cursor-pointer transition-colors flex items-center gap-2 ${
                                isSelected 
                                  ? 'bg-primary/10 border border-primary/30' 
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                              }`}>
                                {isSelected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                              </div>
                              <span className="text-sm flex-1 truncate">{m.name}</span>
                              {m.family && (
                                <Badge variant="outline" className="text-xs">{m.family}</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Colonne Recettes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-green-500" />
                        Recettes
                        {selectedRecettes.size > 0 && (
                          <Badge variant="secondary">{selectedRecettes.size} sélectionnée(s)</Badge>
                        )}
                      </CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher..."
                          value={searchRecette}
                          onChange={(e) => setSearchRecette(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] overflow-y-auto space-y-1">
                        {filteredRecettes.slice(0, 100).map((r: any) => {
                          const isSelected = selectedRecettes.has(r.id);
                          return (
                            <div
                              key={r.id}
                              onClick={() => toggleRecette(r.id)}
                              className={`p-2 rounded cursor-pointer transition-colors flex items-center gap-2 ${
                                isSelected 
                                  ? 'bg-primary/10 border border-primary/30' 
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                              }`}>
                                {isSelected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                              </div>
                              <span className="text-sm flex-1 truncate">{r.name}</span>
                              {r.category && (
                                <Badge variant="outline" className="text-xs">{r.category}</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Colonne File d'attente */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Plus className="h-5 w-5 text-amber-500" />
                        File d'attente
                        {pendingLinks.length > 0 && (
                          <Badge variant="secondary">{pendingLinks.length} liaison(s)</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Liaisons prêtes à être créées
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Options par défaut */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Proportion (%)</label>
                          <Input
                            type="number"
                            value={defaultProportion}
                            onChange={(e) => setDefaultProportion(Number(e.target.value))}
                            min={1}
                            max={100}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Rôle</label>
                          <select
                            value={defaultRole}
                            onChange={(e) => setDefaultRole(e.target.value)}
                            className="w-full h-8 px-2 border rounded-md bg-background text-sm"
                          >
                            <option value="tête">Tête</option>
                            <option value="cœur">Cœur</option>
                            <option value="fond">Fond</option>
                          </select>
                        </div>
                      </div>

                      {/* Bouton ajouter */}
                      <Button 
                        onClick={createPendingLinks}
                        className="w-full"
                        disabled={selectedMolecules.size === 0 || selectedRecettes.size === 0}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter à la file ({selectedMolecules.size} × {selectedRecettes.size})
                      </Button>

                      {/* Liste des liaisons en attente */}
                      <div className="h-[250px] overflow-y-auto space-y-2">
                        {pendingLinks.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            Sélectionnez des molécules et recettes puis cliquez sur "Ajouter"
                          </div>
                        ) : (
                          pendingLinks.map((link, index) => (
                            <div key={index} className="p-2 bg-muted/50 rounded text-sm flex items-center gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{link.moleculeName}</div>
                                <div className="text-muted-foreground truncate">→ {link.recetteName}</div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removePendingLink(index)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setPendingLinks([])}
                          disabled={pendingLinks.length === 0}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Vider
                        </Button>
                        <Button
                          onClick={saveAllLinks}
                          disabled={pendingLinks.length === 0 || createLinks.isPending}
                          className="flex-1"
                        >
                          {createLinks.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Sauvegarder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
