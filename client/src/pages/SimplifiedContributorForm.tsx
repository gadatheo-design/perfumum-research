// @ts-nocheck
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { 
  Beaker, 
  Leaf, 
  Link2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  BookOpen
} from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

// Types pour les formulaires simplifiés
interface SimpleMoleculeForm {
  name: string;
  family: string;
  olfactiveProfile: string;
  sourceOrigin: string;
}

interface SimplePlantForm {
  name: string;
  latinName: string;
  category: string;
  olfactiveSignature: string;
}

interface SimpleLinkForm {
  moleculeId: number | null;
  plantId: number | null;
  role: string;
}

const initialMoleculeForm: SimpleMoleculeForm = {
  name: "",
  family: "",
  olfactiveProfile: "",
  sourceOrigin: "",
};

const initialPlantForm: SimplePlantForm = {
  name: "",
  latinName: "",
  category: "aromatique",
  olfactiveSignature: "",
};

const initialLinkForm: SimpleLinkForm = {
  moleculeId: null,
  plantId: null,
  role: "secondaire",
};

// Familles chimiques simplifiées
const simpleFamilies = [
  { value: "terpene", label: "Terpène", description: "Composés aromatiques des plantes (pinène, limonène...)" },
  { value: "aldehyde", label: "Aldéhyde", description: "Notes fraîches et citronnées" },
  { value: "alcohol", label: "Alcool", description: "Notes florales et fraîches (linalol, géraniol...)" },
  { value: "ester", label: "Ester", description: "Notes fruitées et sucrées" },
  { value: "phenol", label: "Phénol", description: "Notes épicées et médicinales" },
  { value: "other", label: "Autre", description: "Autres classes chimiques" },
];

// Catégories de plantes simplifiées
const simpleCategories = [
  { value: "aromatique", label: "Aromatique", description: "Plantes à huiles essentielles (lavande, menthe...)" },
  { value: "fleur", label: "Fleur", description: "Plantes à fleurs parfumées (rose, jasmin...)" },
  { value: "bois", label: "Bois", description: "Arbres et arbustes (cèdre, santal...)" },
  { value: "resine", label: "Résine", description: "Plantes à résine (encens, myrrhe...)" },
  { value: "racine", label: "Racine", description: "Plantes dont on utilise les racines (vétiver, iris...)" },
  { value: "autre", label: "Autre", description: "Autres catégories" },
];

// Rôles simplifiés
const simpleRoles = [
  { value: "majeur", label: "Majeur", description: "Composant principal (>10% de l'huile essentielle)" },
  { value: "secondaire", label: "Secondaire", description: "Composant significatif (1-10%)" },
  { value: "trace", label: "Trace", description: "Présent en faible quantité (<1%)" },
];

// Composant Tooltip d'aide
function HelpTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help inline-block ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function SimplifiedContributorForm() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("molecule");
  
  // États des formulaires
  const [moleculeForm, setMoleculeForm] = useState<SimpleMoleculeForm>(initialMoleculeForm);
  const [plantForm, setPlantForm] = useState<SimplePlantForm>(initialPlantForm);
  const [linkForm, setLinkForm] = useState<SimpleLinkForm>(initialLinkForm);
  const [searchMolecule, setSearchMolecule] = useState("");
  const [searchPlant, setSearchPlant] = useState("");

  // Debounce pour la recherche
  const debouncedMoleculeName = useDebounce(moleculeForm.name, 500);
  const debouncedPlantName = useDebounce(plantForm.name, 500);
  const debouncedSearchMolecule = useDebounce(searchMolecule, 300);
  const debouncedSearchPlant = useDebounce(searchPlant, 300);

  // Queries pour la détection de doublons
  const moleculeDuplicates = trpc.contributor.findMoleculeDuplicates.useQuery(
    { name: debouncedMoleculeName || undefined },
    { enabled: !!debouncedMoleculeName, staleTime: 30000 }
  );

  const plantDuplicates = trpc.contributor.findPlantDuplicates.useQuery(
    { name: debouncedPlantName || undefined },
    { enabled: !!debouncedPlantName, staleTime: 30000 }
  );

  // Queries pour la recherche de liaisons
  const { data: allMolecules } = trpc.molecules.list.useQuery();
  const { data: allPlants } = trpc.plants.list.useQuery();

  // Filtrage pour la recherche
  const filteredMolecules = allMolecules?.filter((m: any) =>
    m.name.toLowerCase().includes(debouncedSearchMolecule.toLowerCase())
  ).slice(0, 10) || [];

  const filteredPlants = allPlants?.filter((p: any) =>
    p.name.toLowerCase().includes(debouncedSearchPlant.toLowerCase()) ||
    (p.latinName && p.latinName.toLowerCase().includes(debouncedSearchPlant.toLowerCase()))
  ).slice(0, 10) || [];

  // Mutations
  const createMoleculeMutation = trpc.molecules.create.useMutation({
    onSuccess: () => {
      toast.success("Molécule créée avec succès !");
      setMoleculeForm(initialMoleculeForm);
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const createPlantMutation = trpc.plants.create.useMutation({
    onSuccess: () => {
      toast.success("Plante créée avec succès !");
      setPlantForm(initialPlantForm);
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const createLinkMutation = trpc.contributor.createPlantMoleculeLink.useMutation({
    onSuccess: () => {
      toast.success("Liaison créée avec succès !");
      setLinkForm(initialLinkForm);
      setSearchMolecule("");
      setSearchPlant("");
    },
    onError: (error: any) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Handlers
  const handleMoleculeSubmit = () => {
    if (!moleculeForm.name.trim()) {
      toast.error("Le nom de la molécule est requis");
      return;
    }
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    createMoleculeMutation.mutate({
      name: moleculeForm.name,
      family: moleculeForm.family || undefined,
      olfactiveProfile: moleculeForm.olfactiveProfile || undefined,
      sourceOrigin: moleculeForm.sourceOrigin || undefined,
    });
  };

  const handlePlantSubmit = () => {
    if (!plantForm.name.trim()) {
      toast.error("Le nom de la plante est requis");
      return;
    }
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    createPlantMutation.mutate({
      name: plantForm.name,
      latinName: plantForm.latinName || undefined,
      category: plantForm.category as any,
      olfactiveSignature: plantForm.olfactiveSignature || undefined,
    });
  };

  const handleLinkSubmit = () => {
    if (!linkForm.moleculeId || !linkForm.plantId) {
      toast.error("Veuillez sélectionner une molécule et une plante");
      return;
    }
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    createLinkMutation.mutate({
      plantId: linkForm.plantId,
      moleculeId: linkForm.moleculeId,
      role: linkForm.role as "majeur" | "secondaire" | "trace" | "variable",
    });
  };

  const hasMoleculeDuplicates = moleculeDuplicates.data && (moleculeDuplicates.data.exact?.length > 0 || moleculeDuplicates.data.similar?.length > 0);
  const hasPlantDuplicates = plantDuplicates.data && (plantDuplicates.data.exact?.length > 0 || plantDuplicates.data.similar?.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="section-spacing bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">Formulaires Simplifiés</span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">Contribuer facilement</h1>
              <p className="text-lg text-muted-foreground">
                Ajoutez des molécules, des plantes ou créez des liaisons en quelques clics.
                Chaque champ est accompagné d'un guide pour vous aider.
              </p>
            </div>
          </div>
        </section>

        {/* Guide rapide */}
        <section className="py-4">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="mb-8">
                <AccordionItem value="guide">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Guide rapide pour les contributeurs
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Beaker className="h-5 w-5 text-blue-500" />
                          <h4 className="font-medium">Molécules</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Les molécules sont les composés chimiques responsables des odeurs. 
                          Exemples : linalol, limonène, géraniol.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Leaf className="h-5 w-5 text-green-500" />
                          <h4 className="font-medium">Plantes</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Les plantes sont les sources naturelles des molécules aromatiques.
                          Exemples : lavande, rose, cèdre.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Link2 className="h-5 w-5 text-purple-500" />
                          <h4 className="font-medium">Liaisons</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Les liaisons connectent les molécules à leurs plantes sources.
                          Exemple : linalol → lavande (majeur).
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Formulaires */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {!user && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Connexion requise</AlertTitle>
                  <AlertDescription>
                    Vous devez être connecté pour contribuer. Vos contributions seront soumises à validation.
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="molecule" className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    <span className="hidden sm:inline">Molécule</span>
                  </TabsTrigger>
                  <TabsTrigger value="plant" className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    <span className="hidden sm:inline">Plante</span>
                  </TabsTrigger>
                  <TabsTrigger value="link" className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Liaison</span>
                  </TabsTrigger>
                </TabsList>

                {/* Formulaire Molécule */}
                <TabsContent value="molecule">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Beaker className="h-5 w-5 text-blue-500" />
                        Ajouter une molécule
                      </CardTitle>
                      <CardDescription>
                        Remplissez les champs ci-dessous. Seul le nom est obligatoire.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Nom */}
                      <div className="space-y-2">
                        <Label htmlFor="mol-name" className="flex items-center">
                          Nom de la molécule <span className="text-red-500 ml-1">*</span>
                          <HelpTooltip content="Le nom courant de la molécule, par exemple 'Linalol', 'Limonène', 'Géraniol'." />
                        </Label>
                        <Input
                          id="mol-name"
                          placeholder="Ex: Linalol"
                          value={moleculeForm.name}
                          onChange={(e) => setMoleculeForm({ ...moleculeForm, name: e.target.value })}
                        />
                        {hasMoleculeDuplicates && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              Doublons potentiels trouvés : {[...moleculeDuplicates.data?.exact || [], ...moleculeDuplicates.data?.similar || []].map((d: any) => d.name).join(", ")}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Famille chimique */}
                      <div className="space-y-2">
                        <Label htmlFor="mol-family" className="flex items-center">
                          Famille chimique
                          <HelpTooltip content="La classe chimique principale de la molécule. Aide à organiser et rechercher les molécules." />
                        </Label>
                        <Select
                          value={moleculeForm.family}
                          onValueChange={(value) => setMoleculeForm({ ...moleculeForm, family: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une famille" />
                          </SelectTrigger>
                          <SelectContent>
                            {simpleFamilies.map((fam) => (
                              <SelectItem key={fam.value} value={fam.value}>
                                <div className="flex flex-col">
                                  <span>{fam.label}</span>
                                  <span className="text-xs text-muted-foreground">{fam.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Profil olfactif */}
                      <div className="space-y-2">
                        <Label htmlFor="mol-profile" className="flex items-center">
                          Profil olfactif
                          <HelpTooltip content="Décrivez l'odeur de la molécule avec des mots-clés : floral, boisé, citronné, épicé, etc." />
                        </Label>
                        <Textarea
                          id="mol-profile"
                          placeholder="Ex: Floral, frais, légèrement citronné"
                          value={moleculeForm.olfactiveProfile}
                          onChange={(e) => setMoleculeForm({ ...moleculeForm, olfactiveProfile: e.target.value })}
                          rows={2}
                        />
                      </div>

                      {/* Origine */}
                      <div className="space-y-2">
                        <Label htmlFor="mol-origin" className="flex items-center">
                          Sources botaniques
                          <HelpTooltip content="Les plantes dans lesquelles on trouve cette molécule. Ex: Lavande, Bergamote, Bois de rose." />
                        </Label>
                        <Input
                          id="mol-origin"
                          placeholder="Ex: Lavande, Bergamote, Bois de rose"
                          value={moleculeForm.sourceOrigin}
                          onChange={(e) => setMoleculeForm({ ...moleculeForm, sourceOrigin: e.target.value })}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setMoleculeForm(initialMoleculeForm)}
                          className="gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Réinitialiser
                        </Button>
                        <Button
                          onClick={handleMoleculeSubmit}
                          disabled={createMoleculeMutation.isPending || !user || !moleculeForm.name.trim()}
                          className="gap-2"
                        >
                          {createMoleculeMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          Enregistrer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Formulaire Plante */}
                <TabsContent value="plant">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-500" />
                        Ajouter une plante
                      </CardTitle>
                      <CardDescription>
                        Remplissez les champs ci-dessous. Seul le nom est obligatoire.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Nom */}
                      <div className="space-y-2">
                        <Label htmlFor="plant-name" className="flex items-center">
                          Nom commun <span className="text-red-500 ml-1">*</span>
                          <HelpTooltip content="Le nom courant de la plante en français. Ex: Lavande, Rose, Cèdre." />
                        </Label>
                        <Input
                          id="plant-name"
                          placeholder="Ex: Lavande"
                          value={plantForm.name}
                          onChange={(e) => setPlantForm({ ...plantForm, name: e.target.value })}
                        />
                        {hasPlantDuplicates && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              Doublons potentiels trouvés : {[...plantDuplicates.data?.exact || [], ...plantDuplicates.data?.similar || []].map((d: any) => d.name).join(", ")}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Nom latin */}
                      <div className="space-y-2">
                        <Label htmlFor="plant-latin" className="flex items-center">
                          Nom latin
                          <HelpTooltip content="Le nom scientifique de la plante. Ex: Lavandula angustifolia, Rosa damascena." />
                        </Label>
                        <Input
                          id="plant-latin"
                          placeholder="Ex: Lavandula angustifolia"
                          value={plantForm.latinName}
                          onChange={(e) => setPlantForm({ ...plantForm, latinName: e.target.value })}
                          className="italic"
                        />
                      </div>

                      {/* Catégorie */}
                      <div className="space-y-2">
                        <Label htmlFor="plant-category" className="flex items-center">
                          Catégorie
                          <HelpTooltip content="Le type de plante selon son utilisation en parfumerie." />
                        </Label>
                        <Select
                          value={plantForm.category}
                          onValueChange={(value) => setPlantForm({ ...plantForm, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {simpleCategories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                <div className="flex flex-col">
                                  <span>{cat.label}</span>
                                  <span className="text-xs text-muted-foreground">{cat.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Signature olfactive */}
                      <div className="space-y-2">
                        <Label htmlFor="plant-signature" className="flex items-center">
                          Signature olfactive
                          <HelpTooltip content="Décrivez l'odeur caractéristique de la plante ou de son huile essentielle." />
                        </Label>
                        <Textarea
                          id="plant-signature"
                          placeholder="Ex: Herbacée, florale, légèrement camphrée"
                          value={plantForm.olfactiveSignature}
                          onChange={(e) => setPlantForm({ ...plantForm, olfactiveSignature: e.target.value })}
                          rows={2}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setPlantForm(initialPlantForm)}
                          className="gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Réinitialiser
                        </Button>
                        <Button
                          onClick={handlePlantSubmit}
                          disabled={createPlantMutation.isPending || !user || !plantForm.name.trim()}
                          className="gap-2"
                        >
                          {createPlantMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          Enregistrer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Formulaire Liaison */}
                <TabsContent value="link">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-purple-500" />
                        Créer une liaison molécule-plante
                      </CardTitle>
                      <CardDescription>
                        Connectez une molécule à une plante source.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Sélection molécule */}
                      <div className="space-y-2">
                        <Label className="flex items-center">
                          Molécule <span className="text-red-500 ml-1">*</span>
                          <HelpTooltip content="Recherchez et sélectionnez la molécule à lier." />
                        </Label>
                        <Input
                          placeholder="Rechercher une molécule..."
                          value={searchMolecule}
                          onChange={(e) => {
                            setSearchMolecule(e.target.value);
                            setLinkForm({ ...linkForm, moleculeId: null });
                          }}
                        />
                        {searchMolecule && filteredMolecules.length > 0 && !linkForm.moleculeId && (
                          <div className="border rounded-md max-h-40 overflow-y-auto">
                            {filteredMolecules.map((mol: any) => (
                              <div
                                key={mol.id}
                                onClick={() => {
                                  setLinkForm({ ...linkForm, moleculeId: mol.id });
                                  setSearchMolecule(mol.name);
                                }}
                                className="p-2 hover:bg-muted cursor-pointer border-b last:border-0"
                              >
                                <p className="font-medium">{mol.name}</p>
                                {mol.family && <p className="text-xs text-muted-foreground">{mol.family}</p>}
                              </div>
                            ))}
                          </div>
                        )}
                        {linkForm.moleculeId && (
                          <Badge variant="secondary" className="mt-1">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Sélectionné : {searchMolecule}
                          </Badge>
                        )}
                      </div>

                      {/* Sélection plante */}
                      <div className="space-y-2">
                        <Label className="flex items-center">
                          Plante <span className="text-red-500 ml-1">*</span>
                          <HelpTooltip content="Recherchez et sélectionnez la plante source de la molécule." />
                        </Label>
                        <Input
                          placeholder="Rechercher une plante..."
                          value={searchPlant}
                          onChange={(e) => {
                            setSearchPlant(e.target.value);
                            setLinkForm({ ...linkForm, plantId: null });
                          }}
                        />
                        {searchPlant && filteredPlants.length > 0 && !linkForm.plantId && (
                          <div className="border rounded-md max-h-40 overflow-y-auto">
                            {filteredPlants.map((plant: any) => (
                              <div
                                key={plant.id}
                                onClick={() => {
                                  setLinkForm({ ...linkForm, plantId: plant.id });
                                  setSearchPlant(plant.name);
                                }}
                                className="p-2 hover:bg-muted cursor-pointer border-b last:border-0"
                              >
                                <p className="font-medium">{plant.name}</p>
                                {plant.latinName && <p className="text-xs text-muted-foreground italic">{plant.latinName}</p>}
                              </div>
                            ))}
                          </div>
                        )}
                        {linkForm.plantId && (
                          <Badge variant="secondary" className="mt-1">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Sélectionné : {searchPlant}
                          </Badge>
                        )}
                      </div>

                      {/* Rôle */}
                      <div className="space-y-2">
                        <Label className="flex items-center">
                          Rôle de la molécule
                          <HelpTooltip content="L'importance de la molécule dans la composition de la plante." />
                        </Label>
                        <Select
                          value={linkForm.role}
                          onValueChange={(value) => setLinkForm({ ...linkForm, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {simpleRoles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex flex-col">
                                  <span>{role.label}</span>
                                  <span className="text-xs text-muted-foreground">{role.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setLinkForm(initialLinkForm);
                            setSearchMolecule("");
                            setSearchPlant("");
                          }}
                          className="gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Réinitialiser
                        </Button>
                        <Button
                          onClick={handleLinkSubmit}
                          disabled={createLinkMutation.isPending || !user || !linkForm.moleculeId || !linkForm.plantId}
                          className="gap-2"
                        >
                          {createLinkMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Link2 className="h-4 w-4" />
                          )}
                          Créer la liaison
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Liens utiles */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-lg">Ressources utiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                      href="https://pubchem.ncbi.nlm.nih.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">PubChem</p>
                        <p className="text-xs text-muted-foreground">Base de données chimiques</p>
                      </div>
                    </a>
                    <a
                      href="https://www.thegoodscentscompany.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Good Scents</p>
                        <p className="text-xs text-muted-foreground">Profils olfactifs</p>
                      </div>
                    </a>
                    <a
                      href="/contributor"
                      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Formulaire avancé</p>
                        <p className="text-xs text-muted-foreground">Plus d'options</p>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
