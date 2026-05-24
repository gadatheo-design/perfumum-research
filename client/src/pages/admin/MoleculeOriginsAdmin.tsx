// @ts-nocheck
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, Globe, MapPin, Search, Plus, Trash2, Star, 
  Link as LinkIcon, Edit, Filter, ChevronRight, FlaskConical,
  AlertCircle, Check
} from "lucide-react";
import { toast } from "sonner";

interface MoleculeOriginFormData {
  moleculeId: number;
  originId: number;
  isPrimaryOrigin: number;
  qualityRating: number;
  productionVolume: string;
  priceRange: string;
  specificCharacteristics: string;
  notes: string;
}

export default function MoleculeOriginsAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMoleculeForAdd, setSelectedMoleculeForAdd] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<MoleculeOriginFormData>>({
    isPrimaryOrigin: 0,
    qualityRating: 3,
  });

  // Queries
  const { data: origins, isLoading: originsLoading } = trpc.geographicOrigins.listWithMoleculeCount.useQuery();
  const { data: molecules, isLoading: moleculesLoading } = trpc.molecules?.list.useQuery();
  const { data: allOriginsWithMolecules } = trpc.geographicOrigins.list.useQuery();
  
  // Get molecules for a specific origin
  const { data: originMolecules, refetch: refetchOriginMolecules } = trpc.geographicOrigins.getMoleculesWithDetails.useQuery(
    selectedOrigin !== "all" ? parseInt(selectedOrigin) : 0,
    { enabled: selectedOrigin !== "all" }
  );

  // Mutations
  const addMutation = trpc.moleculeOrigins.add.useMutation({
    onSuccess: () => {
      toast.success("Association créée avec succès");
      setIsAddDialogOpen(false);
      setFormData({ isPrimaryOrigin: 0, qualityRating: 3 });
      refetchOriginMolecules();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const removeMutation = trpc.moleculeOrigins.remove.useMutation({
    onSuccess: () => {
      toast.success("Association supprimée");
      refetchOriginMolecules();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const updateMutation = trpc.moleculeOrigins.update.useMutation({
    onSuccess: () => {
      toast.success("Association mise à jour");
      refetchOriginMolecules();
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Filter molecules not yet associated with selected origin
  const availableMolecules = useMemo(() => {
    if (!molecules || selectedOrigin === "all") return [];
    const associatedIds = new Set(originMolecules?.map((om: any) => om.moleculeId) || []);
    return molecules?.filter((m: any) => !associatedIds.has(m.id));
  }, [molecules, originMolecules, selectedOrigin]);

  // Filter molecules by search
  const filteredAvailableMolecules = useMemo(() => {
    if (!searchTerm) return availableMolecules.slice(0, 50);
    return availableMolecules.filter((m: any) => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 50);
  }, [availableMolecules, searchTerm]);

  const handleAddAssociation = () => {
    if (!selectedMoleculeForAdd || selectedOrigin === "all") {
      toast.error("Veuillez sélectionner une molécule et une origine");
      return;
    }
    
    addMutation.mutate({
      moleculeId: selectedMoleculeForAdd,
      originId: parseInt(selectedOrigin),
      isPrimaryOrigin: formData.isPrimaryOrigin || 0,
      qualityRating: formData.qualityRating || 3,
      productionVolume: formData.productionVolume || "",
      priceRange: formData.priceRange || "",
      specificCharacteristics: formData.specificCharacteristics || "",
      notes: formData.notes || "",
    });
  };

  const handleRemoveAssociation = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette association ?")) {
      removeMutation.mutate(id);
    }
  };

  const handleTogglePrimary = (id: number, currentValue: number) => {
    updateMutation.mutate({
      id,
      data: { isPrimaryOrigin: currentValue === 1 ? 0 : 1 },
    });
  };

  if (originsLoading || moleculesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-7xl">
        <Breadcrumbs customItems={[
          { label: "Administration", path: "/admin" },
          { label: "Origines Géographiques des Molécules" }
        ]} />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LinkIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Origines Géographiques des Molécules</h1>
          </div>
          <p className="text-muted-foreground">
            Associez des molécules à leurs origines géographiques (pays, région). Pour lier des <strong>plantes à des terroirs</strong>, utilisez la page <a href="/plant-terroir-linking" className="underline text-primary">Plante ↔ Terroir</a>.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{origins?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Terroirs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{molecules?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Molécules</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {origins?.reduce((sum: number, o: any) => sum + (o.moleculeCount || 0), 0) || 0}
              </div>
              <p className="text-sm text-muted-foreground">Associations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {origins?.filter((o: any) => (o.moleculeCount || 0) > 0).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Terroirs avec molécules</p>
            </CardContent>
          </Card>
        </div>

        {/* Sélection du terroir */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Sélectionner un terroir
            </CardTitle>
            <CardDescription>
              Choisissez un terroir pour voir et gérer ses molécules associées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
              <SelectTrigger className="w-full md:w-[400px]">
                <SelectValue placeholder="Sélectionner un terroir..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- Sélectionner un terroir --</SelectItem>
                {origins?.sort((a: any, b: any) => a.country.localeCompare(b.country)).map((origin: any) => (
                  <SelectItem key={origin.id} value={origin.id.toString()}>
                    {origin.name} ({origin.country}) - {origin.moleculeCount || 0} molécules
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Contenu principal */}
        {selectedOrigin !== "all" ? (
          <Tabs defaultValue="associated" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="associated">
                  Molécules associées ({originMolecules?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="add">
                  Ajouter des molécules
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab: Molécules associées */}
            <TabsContent value="associated" className="space-y-4">
              {originMolecules && originMolecules?.length > 0 ? (
                <div className="grid gap-4">
                  {originMolecules?.map((om: any) => (
                    <Card key={om.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FlaskConical className="h-4 w-4 text-primary" />
                              <span className="font-medium">{om.molecule?.name}</span>
                              {om.isPrimaryOrigin === 1 && (
                                <Badge variant="default" className="bg-yellow-500">
                                  <Star className="h-3 w-3 mr-1" />
                                  Origine principale
                                </Badge>
                              )}
                              {om.qualityRating && (
                                <Badge variant="outline">
                                  Qualité: {om.qualityRating}/5
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              {om.molecule?.family && (
                                <p>Famille: {om.molecule.family}</p>
                              )}
                              {om.productionVolume && (
                                <p>Production: {om.productionVolume}</p>
                              )}
                              {om.priceRange && (
                                <p>Prix: {om.priceRange}</p>
                              )}
                              {om.specificCharacteristics && (
                                <p>Caractéristiques: {om.specificCharacteristics}</p>
                              )}
                              {om.notes && (
                                <p className="italic">Notes: {om.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTogglePrimary(om.id, om.isPrimaryOrigin || 0)}
                              title={om.isPrimaryOrigin === 1 ? "Retirer comme origine principale" : "Définir comme origine principale"}
                            >
                              <Star className={`h-4 w-4 ${om.isPrimaryOrigin === 1 ? "fill-yellow-500 text-yellow-500" : ""}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAssociation(om.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Aucune molécule associée</h3>
                    <p className="text-muted-foreground mb-4">
                      Ce terroir n'a pas encore de molécules associées.
                    </p>
                    <Button onClick={() => document.querySelector('[data-value="add"]')?.dispatchEvent(new Event('click'))}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter des molécules
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab: Ajouter des molécules */}
            <TabsContent value="add" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ajouter une molécule</CardTitle>
                  <CardDescription>
                    Recherchez et sélectionnez une molécule à associer à ce terroir
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Recherche */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une molécule..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Liste des molécules disponibles */}
                  <div className="max-h-[300px] overflow-y-auto border rounded-md">
                    {filteredAvailableMolecules.length > 0 ? (
                      filteredAvailableMolecules.map((molecule: any) => (
                        <div
                          key={molecule.id}
                          className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedMoleculeForAdd === molecule.id ? "bg-primary/10" : ""
                          }`}
                          onClick={() => setSelectedMoleculeForAdd(molecule.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{molecule.name}</span>
                              {molecule.family && (
                                <span className="text-sm text-muted-foreground ml-2">
                                  ({molecule.family})
                                </span>
                              )}
                            </div>
                            {selectedMoleculeForAdd === molecule.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          {molecule.sourceOrigin && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Source: {molecule.sourceOrigin}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        {searchTerm ? "Aucune molécule trouvée" : "Toutes les molécules sont déjà associées"}
                      </div>
                    )}
                  </div>

                  {/* Formulaire d'ajout */}
                  {selectedMoleculeForAdd && (
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">Détails de l'association</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Origine principale ?</Label>
                          <Select
                            value={formData.isPrimaryOrigin?.toString() || "0"}
                            onValueChange={(v) => setFormData({ ...formData, isPrimaryOrigin: parseInt(v) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Non</SelectItem>
                              <SelectItem value="1">Oui</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Qualité (1-5)</Label>
                          <Select
                            value={formData.qualityRating?.toString() || "3"}
                            onValueChange={(v) => setFormData({ ...formData, qualityRating: parseInt(v) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <SelectItem key={n} value={n.toString()}>
                                  {n} - {["Faible", "Moyenne", "Bonne", "Très bonne", "Exceptionnelle"][n-1]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Volume de production</Label>
                          <Input
                            placeholder="Ex: 500 tonnes/an"
                            value={formData.productionVolume || ""}
                            onChange={(e) => setFormData({ ...formData, productionVolume: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Gamme de prix</Label>
                          <Input
                            placeholder="Ex: €€€, Premium"
                            value={formData.priceRange || ""}
                            onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Caractéristiques spécifiques</Label>
                        <Textarea
                          placeholder="Caractéristiques propres à cette origine..."
                          value={formData.specificCharacteristics || ""}
                          onChange={(e) => setFormData({ ...formData, specificCharacteristics: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          placeholder="Notes additionnelles..."
                          value={formData.notes || ""}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                      </div>

                      <Button 
                        onClick={handleAddAssociation}
                        disabled={addMutation.isPending}
                        className="w-full"
                      >
                        {addMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Ajouter l'association
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Sélectionnez un terroir</h3>
              <p className="text-muted-foreground">
                Choisissez un terroir dans la liste ci-dessus pour voir et gérer ses molécules associées.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Liste des terroirs avec leurs comptages */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Aperçu des terroirs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {origins?.sort((a: any, b: any) => (b.moleculeCount || 0) - (a.moleculeCount || 0)).map((origin: any) => (
                <div
                  key={origin.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedOrigin === origin.id.toString() ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedOrigin(origin.id.toString())}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{origin.name}</h4>
                      <p className="text-sm text-muted-foreground">{origin.country}</p>
                    </div>
                    <Badge variant={origin.moleculeCount > 0 ? "default" : "secondary"}>
                      {origin.moleculeCount || 0}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
