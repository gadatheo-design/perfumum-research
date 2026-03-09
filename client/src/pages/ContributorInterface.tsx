// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Beaker, 
  Leaf, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Plus, 
  Loader2,
  Info,
  ExternalLink,
  Database
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { AIClassificationSuggestion } from "@/components/AIClassificationSuggestion";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

// Types pour les formulaires
interface MoleculeFormData {
  name: string;
  casNumber: string;
  iupacName: string;
  chemicalFormula: string;
  family: string;
  chemicalClass: string;
  olfactiveProfile: string;
  sourceOrigin: string;
  notes: string;
}

interface PlantFormData {
  name: string;
  latinName: string;
  family: string;
  category: string;
  origin: string;
  habitat: string;
  olfactiveSignature: string;
  dominantMolecules: string;
  traditionalUse: string;
  notes: string;
}

const initialMoleculeForm: MoleculeFormData = {
  name: "",
  casNumber: "",
  iupacName: "",
  chemicalFormula: "",
  family: "",
  chemicalClass: "",
  olfactiveProfile: "",
  sourceOrigin: "",
  notes: "",
};

const initialPlantForm: PlantFormData = {
  name: "",
  latinName: "",
  family: "",
  category: "aromatique",
  origin: "",
  habitat: "",
  olfactiveSignature: "",
  dominantMolecules: "",
  traditionalUse: "",
  notes: "",
};

const chemicalClasses = [
  { value: "terpene", label: "Terpène" },
  { value: "sesquiterpene", label: "Sesquiterpène" },
  { value: "diterpene", label: "Diterpène" },
  { value: "monoterpene", label: "Monoterpène" },
  { value: "aldehyde", label: "Aldéhyde" },
  { value: "ketone", label: "Cétone" },
  { value: "alcohol", label: "Alcool" },
  { value: "ester", label: "Ester" },
  { value: "ether", label: "Éther" },
  { value: "phenol", label: "Phénol" },
  { value: "lactone", label: "Lactone" },
  { value: "coumarin", label: "Coumarine" },
  { value: "musk", label: "Musc" },
  { value: "nitrile", label: "Nitrile" },
  { value: "sulfur_compound", label: "Composé soufré" },
  { value: "heterocyclic", label: "Hétérocyclique" },
  { value: "aromatic", label: "Aromatique" },
  { value: "aliphatic", label: "Aliphatique" },
  { value: "other", label: "Autre" },
];

const plantCategories = [
  { value: "aromatique", label: "Aromatique" },
  { value: "tabac", label: "Tabac" },
  { value: "cannabis", label: "Cannabis" },
  { value: "resine", label: "Résine" },
  { value: "bois", label: "Bois" },
  { value: "fleur", label: "Fleur" },
  { value: "racine", label: "Racine" },
  { value: "autre", label: "Autre" },
];

export default function ContributorInterface() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("molecule");
  
  // Formulaires
  const [moleculeForm, setMoleculeForm] = useState<MoleculeFormData>(initialMoleculeForm);
  const [plantForm, setPlantForm] = useState<PlantFormData>(initialPlantForm);
  
  // Debounced values pour la détection de doublons
  const debouncedMoleculeName = useDebounce(moleculeForm.name, 500);
  const debouncedMoleculeCas = useDebounce(moleculeForm.casNumber, 500);
  const debouncedPlantName = useDebounce(plantForm.name, 500);
  const debouncedPlantLatinName = useDebounce(plantForm.latinName, 500);
  
  // Queries pour la détection de doublons
  const moleculeDuplicates = trpc.contributor.findMoleculeDuplicates.useQuery(
    { 
      name: debouncedMoleculeName || undefined,
      casNumber: debouncedMoleculeCas || undefined,
    },
    { 
      enabled: !!(debouncedMoleculeName || debouncedMoleculeCas),
      staleTime: 30000,
    }
  );
  
  const plantDuplicates = trpc.contributor.findPlantDuplicates.useQuery(
    { 
      name: debouncedPlantName || undefined,
      latinName: debouncedPlantLatinName || undefined,
    },
    { 
      enabled: !!(debouncedPlantName || debouncedPlantLatinName),
      staleTime: 30000,
    }
  );
  
  // Mutations
  const createMolecule = trpc.molecules.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Molécule ajoutée",
        description: "La molécule a été ajoutée avec succès à la base de données.",
      });
      setMoleculeForm(initialMoleculeForm);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const createPlant = trpc.plants.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Plante ajoutée",
        description: "La plante a été ajoutée avec succès à la base de données.",
      });
      setPlantForm(initialPlantForm);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handlers
  const handleMoleculeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!moleculeForm.name) {
      toast({
        title: "Champ requis",
        description: "Le nom de la molécule est obligatoire.",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier s'il y a des doublons exacts
    if (moleculeDuplicates.data?.exact && moleculeDuplicates.data.exact.length > 0) {
      toast({
        title: "Doublon détecté",
        description: "Une molécule avec ce nom ou ce numéro CAS existe déjà.",
        variant: "destructive",
      });
      return;
    }
    
    createMolecule.mutate({
      name: moleculeForm.name,
      casNumber: moleculeForm.casNumber || undefined,
      iupacName: moleculeForm.iupacName || undefined,
      chemicalFormula: moleculeForm.chemicalFormula || undefined,
      family: moleculeForm.family || undefined,
      chemicalClass: moleculeForm.chemicalClass || undefined,
      olfactiveProfile: moleculeForm.olfactiveProfile || undefined,
      sourceOrigin: moleculeForm.sourceOrigin || undefined,
      notes: moleculeForm.notes || undefined,
    });
  };
  
  const handlePlantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plantForm.name) {
      toast({
        title: "Champ requis",
        description: "Le nom de la plante est obligatoire.",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier s'il y a des doublons exacts
    if (plantDuplicates.data?.exact && plantDuplicates.data.exact.length > 0) {
      toast({
        title: "Doublon détecté",
        description: "Une plante avec ce nom ou ce nom latin existe déjà.",
        variant: "destructive",
      });
      return;
    }
    
    createPlant.mutate({
      name: plantForm.name,
      latinName: plantForm.latinName || undefined,
      family: plantForm.family || undefined,
      category: plantForm.category as any,
      origin: plantForm.origin || undefined,
      habitat: plantForm.habitat || undefined,
      olfactiveSignature: plantForm.olfactiveSignature || undefined,
      dominantMolecules: plantForm.dominantMolecules || undefined,
      traditionalUse: plantForm.traditionalUse || undefined,
      notes: plantForm.notes || undefined,
    });
  };
  
  // Composant d'alerte pour les doublons
  const DuplicateAlert = ({ 
    exact, 
    similar, 
    type 
  }: { 
    exact: any[]; 
    similar: any[]; 
    type: "molecule" | "plant" 
  }) => {
    if (exact.length === 0 && similar.length === 0) return null;
    
    return (
      <div className="space-y-3">
        {exact.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Doublon exact détecté</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                {type === "molecule" 
                  ? "Une molécule identique existe déjà :" 
                  : "Une plante identique existe déjà :"}
              </p>
              <ul className="list-disc list-inside space-y-1">
                {exact.map((item: any) => (
                  <li key={item.id} className="text-sm">
                    <strong>{item.name}</strong>
                    {type === "molecule" && item.casNumber && (
                      <span className="text-muted-foreground"> (CAS: {item.casNumber})</span>
                    )}
                    {type === "plant" && item.latinName && (
                      <span className="text-muted-foreground"> ({item.latinName})</span>
                    )}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {similar.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Entrées similaires trouvées</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Vérifiez que votre entrée n'est pas un doublon :
              </p>
              <ul className="list-disc list-inside space-y-1">
                {similar.slice(0, 5).map((item: any) => (
                  <li key={item.id} className="text-sm">
                    <strong>{item.name}</strong>
                    {type === "molecule" && item.casNumber && (
                      <span className="text-muted-foreground"> (CAS: {item.casNumber})</span>
                    )}
                    {type === "plant" && item.latinName && (
                      <span className="text-muted-foreground"> ({item.latinName})</span>
                    )}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Breadcrumbs />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full mb-6 border border-primary/20">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Interface Contributeur</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Ajouter des Données
              </h1>
              
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Enrichissez la base de données PERFUMUM en ajoutant de nouvelles molécules ou plantes.
                La détection automatique de doublons vous aide à éviter les entrées redondantes.
              </p>
            </div>
          </div>
        </section>

        {/* Formulaires */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="molecule" className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Nouvelle Molécule
                  </TabsTrigger>
                  <TabsTrigger value="plant" className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    Nouvelle Plante
                  </TabsTrigger>
                </TabsList>
                
                {/* Formulaire Molécule */}
                <TabErrorBoundary>
                <TabsContent value="molecule">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Beaker className="h-5 w-5 text-purple-500" />
                        Ajouter une Molécule
                      </CardTitle>
                      <CardDescription>
                        Remplissez les informations de la molécule. Les champs marqués d'un * sont obligatoires.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleMoleculeSubmit} className="space-y-6">
                        {/* Détection de doublons */}
                        {moleculeDuplicates.data && (
                          <DuplicateAlert 
                            exact={moleculeDuplicates.data.exact} 
                            similar={moleculeDuplicates.data.similar}
                            type="molecule"
                          />
                        )}
                        
                        {/* Identification */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Identification</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="mol-name">Nom *</Label>
                              <Input
                                id="mol-name"
                                placeholder="ex: Limonène"
                                value={moleculeForm.name}
                                onChange={(e) => setMoleculeForm({ ...moleculeForm, name: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mol-cas">Numéro CAS</Label>
                              <Input
                                id="mol-cas"
                                placeholder="ex: 138-86-3"
                                value={moleculeForm.casNumber}
                                onChange={(e) => setMoleculeForm({ ...moleculeForm, casNumber: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="mol-iupac">Nom IUPAC</Label>
                              <Input
                                id="mol-iupac"
                                placeholder="ex: 1-methyl-4-(1-methylethenyl)cyclohexene"
                                value={moleculeForm.iupacName}
                                onChange={(e) => setMoleculeForm({ ...moleculeForm, iupacName: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mol-formula">Formule chimique</Label>
                              <Input
                                id="mol-formula"
                                placeholder="ex: C10H16"
                                value={moleculeForm.chemicalFormula}
                                onChange={(e) => setMoleculeForm({ ...moleculeForm, chemicalFormula: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mol-class">Classe chimique</Label>
                              <Select
                                value={moleculeForm.chemicalClass}
                                onValueChange={(value) => setMoleculeForm({ ...moleculeForm, chemicalClass: value })}
                              >
                                <SelectTrigger id="mol-class">
                                  <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {chemicalClasses.map((cls) => (
                                    <SelectItem key={cls.value} value={cls.value}>
                                      {cls.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Caractéristiques olfactives */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Caractéristiques olfactives</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="mol-family">Famille olfactive</Label>
                              <Input
                                id="mol-family"
                                placeholder="ex: Agrumes, Boisé, Floral..."
                                value={moleculeForm.family}
                                onChange={(e) => setMoleculeForm({ ...moleculeForm, family: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="mol-source">Origine / Source</Label>
                              <Input
                                id="mol-source"
                                placeholder="ex: Zeste de citron, Pin sylvestre..."
                                value={moleculeForm.sourceOrigin}
                                onChange={(e) => setMoleculeForm({ ...moleculeForm, sourceOrigin: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="mol-profile">Profil olfactif</Label>
                              <Textarea
                                id="mol-profile"
                                placeholder="Description détaillée de l'odeur..."
                                value={moleculeForm.olfactiveProfile}
                                onChange={(e) => setMoleculeForm({ ...moleculeForm, olfactiveProfile: e.target.value })}
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />

                        {/* Classification assistée par IA */}
                        {moleculeForm.name && (
                          <AIClassificationSuggestion
                            molecule={{
                              name: moleculeForm.name,
                              iupacName: moleculeForm.iupacName || undefined,
                              casNumber: moleculeForm.casNumber || undefined,
                              chemicalFormula: moleculeForm.chemicalFormula || undefined,
                              olfactiveProfile: moleculeForm.olfactiveProfile || undefined,
                              botanicalSources: moleculeForm.sourceOrigin || undefined,
                            }}
                            currentChemicalClass={moleculeForm.chemicalClass || undefined}
                            currentOlfactiveFamily={moleculeForm.family || undefined}
                            onAcceptChemicalClass={(value) => setMoleculeForm({ ...moleculeForm, chemicalClass: value })}
                            onAcceptOlfactiveFamily={(value) => setMoleculeForm({ ...moleculeForm, family: value })}
                            onAcceptOlfactiveProfile={(value) => setMoleculeForm({ ...moleculeForm, olfactiveProfile: value })}
                          />
                        )}
                        
                        <Separator />
                        
                        {/* Notes */}
                        <div className="space-y-2">
                          <Label htmlFor="mol-notes">Notes de recherche</Label>
                          <Textarea
                            id="mol-notes"
                            placeholder="Observations, références, remarques..."
                            value={moleculeForm.notes}
                            onChange={(e) => setMoleculeForm({ ...moleculeForm, notes: e.target.value })}
                            rows={3}
                          />
                        </div>
                        
                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setMoleculeForm(initialMoleculeForm)}
                          >
                            Réinitialiser
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createMolecule.isPending || (moleculeDuplicates.data?.exact?.length ?? 0) > 0}
                          >
                            {createMolecule.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter la molécule
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                </TabErrorBoundary>
                
                {/* Formulaire Plante */}
                <TabErrorBoundary>
                <TabsContent value="plant">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-500" />
                        Ajouter une Plante
                      </CardTitle>
                      <CardDescription>
                        Remplissez les informations de la plante. Les champs marqués d'un * sont obligatoires.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePlantSubmit} className="space-y-6">
                        {/* Détection de doublons */}
                        {plantDuplicates.data && (
                          <DuplicateAlert 
                            exact={plantDuplicates.data.exact} 
                            similar={plantDuplicates.data.similar}
                            type="plant"
                          />
                        )}
                        
                        {/* Identification */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Identification</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="plant-name">Nom commun *</Label>
                              <Input
                                id="plant-name"
                                placeholder="ex: Lavande"
                                value={plantForm.name}
                                onChange={(e) => setPlantForm({ ...plantForm, name: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="plant-latin">Nom latin</Label>
                              <Input
                                id="plant-latin"
                                placeholder="ex: Lavandula angustifolia"
                                value={plantForm.latinName}
                                onChange={(e) => setPlantForm({ ...plantForm, latinName: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="plant-family">Famille botanique</Label>
                              <Input
                                id="plant-family"
                                placeholder="ex: Lamiaceae"
                                value={plantForm.family}
                                onChange={(e) => setPlantForm({ ...plantForm, family: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="plant-category">Catégorie</Label>
                              <Select
                                value={plantForm.category}
                                onValueChange={(value) => setPlantForm({ ...plantForm, category: value })}
                              >
                                <SelectTrigger id="plant-category">
                                  <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {plantCategories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Origine et habitat */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Origine et habitat</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="plant-origin">Origine géographique</Label>
                              <Input
                                id="plant-origin"
                                placeholder="ex: Méditerranée, Provence..."
                                value={plantForm.origin}
                                onChange={(e) => setPlantForm({ ...plantForm, origin: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="plant-habitat">Habitat naturel</Label>
                              <Input
                                id="plant-habitat"
                                placeholder="ex: Garrigue, altitude 500-1500m..."
                                value={plantForm.habitat}
                                onChange={(e) => setPlantForm({ ...plantForm, habitat: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Caractéristiques olfactives */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Caractéristiques olfactives</h3>
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="plant-signature">Signature olfactive</Label>
                              <Textarea
                                id="plant-signature"
                                placeholder="Description de l'odeur caractéristique..."
                                value={plantForm.olfactiveSignature}
                                onChange={(e) => setPlantForm({ ...plantForm, olfactiveSignature: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="plant-molecules">Molécules dominantes</Label>
                              <Input
                                id="plant-molecules"
                                placeholder="ex: Linalol, Acétate de linalyle..."
                                value={plantForm.dominantMolecules}
                                onChange={(e) => setPlantForm({ ...plantForm, dominantMolecules: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Usages */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="plant-traditional">Usages traditionnels</Label>
                            <Textarea
                              id="plant-traditional"
                              placeholder="Usages historiques et traditionnels..."
                              value={plantForm.traditionalUse}
                              onChange={(e) => setPlantForm({ ...plantForm, traditionalUse: e.target.value })}
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="plant-notes">Notes de recherche</Label>
                            <Textarea
                              id="plant-notes"
                              placeholder="Observations, références, remarques..."
                              value={plantForm.notes}
                              onChange={(e) => setPlantForm({ ...plantForm, notes: e.target.value })}
                              rows={3}
                            />
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPlantForm(initialPlantForm)}
                          >
                            Réinitialiser
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createPlant.isPending || (plantDuplicates.data?.exact?.length ?? 0) > 0}
                          >
                            {createPlant.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter la plante
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                </TabErrorBoundary>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
