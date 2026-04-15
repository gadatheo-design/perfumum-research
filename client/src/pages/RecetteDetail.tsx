import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, FlaskConical, Beaker, Download, Clock, DollarSign, Flame, Droplets, CheckCircle2, AlertCircle, TestTube, FileText, FileJson, Zap, ArrowRight, Thermometer, Network, Plus, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { exportRecipePDF } from "@/lib/exportPDF";
import { exportRecetteToMarkdown, exportRecetteToJSON } from "@/lib/recetteExportUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import { MoleculeListLinks } from "@/components/MoleculeLink";
import { RecipeOlfactiveProfile } from "@/components/RecipeRadarChart";
import { RecetteDetailSkeleton } from "@/components/RecetteDetailSkeleton";
import { RecommendationsCard } from "@/components/RecommendationsCard";
import { LinkedMolecules, SimilarContent } from "@/components/SeeAlso";
import { SeeAlsoSection } from "@/components/SeeAlsoSection";
import { LinkedReferences } from "@/components/LinkedReferences";
import "reactflow/dist/style.css";
import { useMemo, useEffect, useState } from "react";
import { GitBranch, ArrowUpRight, Leaf, Wind, TreeDeciduous, Sparkles, Package, Link2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { safeToFixed } from "@/lib/utils";


// ─── Interfaces locales pour RecetteDetail ───────────────────────────────────
interface RecipeMolecule {
  id: number;
  name: string;
  chemicalFormula?: string | null;
  family?: string | null;
  olfactiveProfile?: string | null;
  chemicalClass?: string | null;
  casNumber?: string | null;
  radarIntensity?: number | null;
  radarFreshness?: number | null;
  radarWarmth?: number | null;
  radarSweetness?: number | null;
  radarSpiciness?: number | null;
  radarEarthiness?: number | null;
  proportion?: number | null;
  role?: string | null;
  linkNotes?: string | null;
  linkSource?: string | null;
}

interface RawMaterialLink {
  id: number;
  materialId: string;
  name: string;
  latinName: string | null;
  category: string;
  rawMaterialId?: number;
  rawMaterialName?: string;
  role?: string | null;
  dosage?: number | null;
  dosageUnit?: string | null;
  percentage?: number | null;
  notes?: string | null;
  materialCategory?: string;
  terroirId?: number | null;
}

interface Transformation {
  id: number;
  molecule_name?: string | null;
  impact_type?: string | null;
  transformation_type?: string | null;
  description?: string | null;
  temperature?: number | null;
  source_molecule_name?: string | null;
  product_molecule_name?: string | null;
  temperature_optimal?: number | null;
  olfactory_change_description?: string | null;
  olfactory_contribution?: string | null;
}

interface FormuleReference {
  id: number;
  recetteId: number;
  formuleReferenceName: string;
  formuleReferenceFamily: string;
  similarityScore: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  description?: string | null;
  source?: string | null;
}

interface TerpProfile {
  id: number;
  name: string;
  profile?: string | null;
  profileId?: number;
  climaticAxis?: string | null;
  matchScore?: number | null;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function RecetteDetail() {
  const { toast } = useToast();
  const { user } = useAuth();
  const params = useParams();
  const id = parseInt(params.id || "0");

  // État du dialog d'ajout de matière première
  const [showAddRmDialog, setShowAddRmDialog] = useState(false);
  const [rmSearch, setRmSearch] = useState("");
  const [selectedRmId, setSelectedRmId] = useState<number | null>(null);
  const [rmRole, setRmRole] = useState<"autre" | "tete" | "coeur" | "base" | "fixateur" | "modificateur">("autre");
  const [rmDosage, setRmDosage] = useState("");
  const [rmDosageUnit, setRmDosageUnit] = useState("g");
  const [rmPercentage, setRmPercentage] = useState("");
  const [rmNotes, setRmNotes] = useState("");
  // Dialog d'édition d'une liaison existante
  const [editingRm, setEditingRm] = useState<RawMaterialLink | null>(null);
  const [editRmRole, setEditRmRole] = useState<"autre" | "tete" | "coeur" | "base" | "fixateur" | "modificateur">("autre");
  const [editRmDosage, setEditRmDosage] = useState("");
  const [editRmDosageUnit, setEditRmDosageUnit] = useState("g");
  const [editRmPercentage, setEditRmPercentage] = useState("");
  const [editRmNotes, setEditRmNotes] = useState("");

  const { data, isLoading } = trpc.recette.getById.useQuery({ id });
  const { data: variations } = trpc.recettes.getVariations.useQuery(id);
  const { data: parentRecette } = trpc.recettes.getParent.useQuery(id);
  const trackEvent = trpc.analytics.trackEvent.useMutation();

  // Calculer le profil radar moyen de la recette
  const currentRadar = useMemo(() => {
    const molecules = (data?.molecules as RecipeMolecule[] | undefined) || [];
    if (!molecules || molecules.length === 0) {
      return { intensity: 50, freshness: 50, warmth: 50, sweetness: 50, spiciness: 50, earthiness: 50 };
    }
    return {
      intensity: Math.round(molecules.reduce((sum, m) => sum + (m.radarIntensity || 50), 0) / molecules.length),
      freshness: Math.round(molecules.reduce((sum, m) => sum + (m.radarFreshness || 50), 0) / molecules.length),
      warmth: Math.round(molecules.reduce((sum, m) => sum + (m.radarWarmth || 50), 0) / molecules.length),
      sweetness: Math.round(molecules.reduce((sum, m) => sum + (m.radarSweetness || 50), 0) / molecules.length),
      spiciness: Math.round(molecules.reduce((sum, m) => sum + (m.radarSpiciness || 50), 0) / molecules.length),
      earthiness: Math.round(molecules.reduce((sum, m) => sum + (m.radarEarthiness || 50), 0) / molecules.length),
    };
  }, [data?.molecules]);

  // Récupérer les recommandations
  const { data: recommendations, isLoading: isLoadingRecommendations } = trpc.recommendations.similarRecettes.useQuery(
    {
      recetteId: id,
      limit: 5,
    },
    { enabled: !!data }
  );

  // Récupérer les formules de référence
  const { data: formulesReference } = trpc.recettes.getFormulesReference.useQuery(id, { enabled: !!data });

  // Récupérer les recettes similaires
  const { data: similarRecettes, isLoading: isLoadingSimilar } = trpc.crossLinks.getSimilarRecettes.useQuery(
    { recetteId: id, limit: 5 },
    { enabled: !!data }
  );

  // Récupérer les TerpProfiles liés (pour les recettes TL)
  const { data: linkedTerpProfiles } = trpc.recettes.getTerpProfiles.useQuery(id, { enabled: !!data });

  // Récupérer les transformations moléculaires affectant cette recette
  const { data: transformationsData, isLoading: isLoadingTransformations } = trpc.research.getTransformationsAffectingRecipe.useQuery(
    id,
    { enabled: !!data }
  );

  // Récupérer les matières premières directement liées à cette recette
  const utils = trpc.useUtils();
  const { data: rawMaterialsLinked } = trpc.recetteRawMaterials.getByRecette.useQuery(
    id,
    { enabled: !!id && id > 0 }
  );

  // Recherche de matières premières pour le dialog d'ajout
  const { data: rawMaterialsSearch } = trpc.rawMaterials.getFiltered.useQuery(
    { search: rmSearch, limit: 20, page: 1 },
    { enabled: showAddRmDialog }
  );

  // Mutation pour ajouter une liaison
  const addRmMutation = trpc.recetteRawMaterials.add.useMutation({
    onSuccess: () => {
      utils.recetteRawMaterials.getByRecette.invalidate(id);
      setShowAddRmDialog(false);
      setSelectedRmId(null);
      setRmSearch("");
      setRmRole("autre");
      setRmDosage("");
      setRmPercentage("");
      setRmNotes("");
      toast({ title: "Matière première liée", description: "La liaison a été créée avec succès." });
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  // Mutation pour supprimer une liaison
  const removeRmMutation = trpc.recetteRawMaterials.remove.useMutation({
    onSuccess: () => {
      utils.recetteRawMaterials.getByRecette.invalidate(id);
      toast({ title: "Liaison supprimée" });
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  // Mutation pour modifier une liaison existante
  const updateRmMutation = trpc.recetteRawMaterials.update.useMutation({
    onSuccess: () => {
      utils.recetteRawMaterials.getByRecette.invalidate(id);
      setEditingRm(null);
      toast({ title: "Liaison mise à jour" });
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    },
  });

  // Track page view
  useEffect(() => {
    if (data?.recette) {
      trackEvent.mutate({
        eventType: "recipe_view",
        entityId: data.recette.id,
        entityType: "recipe",
        metadata: JSON.stringify({
          recipeName: data.recette.name,
          category: data.family?.name,
          source: "recipe_detail",
        }),
      });
    }
  }, [data?.recette.id]);

  // Create nodes and edges for the relation graph
  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Central recette node
    nodes.push({
      id: `recette-${data.recette.id}`,
      type: "default",
      position: { x: 400, y: 250 },
      data: {
        label: (
          <div className="text-center p-6 bg-green-100 rounded-lg border-2 border-green-600 shadow-lg">
            <div className="font-bold text-xl">{data.recette.name}</div>
            <div className="text-sm text-gray-600">Recette</div>
          </div>
        ),
      },
      style: { background: "transparent", border: "none" },
    });

    // Family node (left)
    if (data.family) {
      nodes.push({
        id: `family-${data.family.id}`,
        type: "default",
        position: { x: 100, y: 100 },
        data: {
          label: (
            <div className="text-center p-5 bg-blue-100 rounded-lg border-2 border-blue-400 shadow-md">
              <div className="font-semibold text-base">{data.family.name}</div>
              <div className="text-sm text-gray-500">Famille</div>
            </div>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-family-recette`,
        source: `family-${data.family.id}`,
        target: `recette-${data.recette.id}`,
        animated: true,
        style: { stroke: "#60a5fa" },
      });
    }

    // Accord node (left-bottom)
    if (data.accord) {
      nodes.push({
        id: `accord-${data.accord.id}`,
        type: "default",
        position: { x: 100, y: 400 },
        data: {
          label: (
            <div className="text-center p-5 bg-orange-100 rounded-lg border-2 border-orange-400 shadow-md">
              <div className="font-semibold text-base">{data.accord.name}</div>
              <div className="text-sm text-gray-500">Accord</div>
            </div>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-accord-recette`,
        source: `accord-${data.accord.id}`,
        target: `recette-${data.recette.id}`,
        animated: true,
        style: { stroke: "#fb923c" },
      });
    }

    // Molecule nodes (right)
    data.molecules.forEach((molecule, index) => {
      const yOffset = (index - data.molecules.length / 2) * 100;
      nodes.push({
        id: `molecule-${molecule.id}`,
        type: "default",
        position: { x: 700, y: 250 + yOffset },
        data: {
          label: (
            <Link href={`/molecule/${molecule.id}`}>
              <div className="text-center p-5 bg-purple-100 rounded-lg border-2 border-purple-400 cursor-pointer hover:bg-purple-200 transition shadow-md hover:shadow-lg">
                <div className="font-semibold text-base">{molecule.name}</div>
                <div className="text-sm text-gray-500 font-mono">{molecule.chemicalFormula}</div>
              </div>
            </Link>
          ),
        },
        style: { background: "transparent", border: "none" },
      });

      edges.push({
        id: `e-recette-molecule-${molecule.id}`,
        source: `recette-${data.recette.id}`,
        target: `molecule-${molecule.id}`,
        animated: true,
        style: { stroke: "#a78bfa" },
      });
    });

    return { nodes, edges };
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Breadcrumbs />
        <RecetteDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Recette non trouvée</p>
            <Link href="/familles">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux Recettes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { recette, molecules: moleculesRaw, family, accord } = data;
  const molecules = (moleculesRaw as RecipeMolecule[] | undefined) || [];

  // Status badge color
  const statusColors = {
    experimental: "bg-yellow-100 text-yellow-800 border-yellow-300",
    testing: "bg-blue-100 text-blue-800 border-blue-300",
    validated: "bg-green-100 text-green-800 border-green-300",
    production: "bg-purple-100 text-purple-800 border-purple-300",
  };

  const statusIcons = {
    experimental: <TestTube className="h-4 w-4" />,
    testing: <AlertCircle className="h-4 w-4" />,
    validated: <CheckCircle2 className="h-4 w-4" />,
    production: <FlaskConical className="h-4 w-4" />,
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Breadcrumbs 
          customItems={[
            { label: "Recettes", path: "/recettes" },
            { label: data.recette.name }
          ]} 
        />

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/familles">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                // Calculer les moyennes radar depuis les molécules
                const mols = data.molecules || [];
                const avgIntensity = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarIntensity || 50), 0) / mols.length) : undefined;
                const avgFreshness = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarFreshness || 50), 0) / mols.length) : undefined;
                const avgWarmth = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarWarmth || 50), 0) / mols.length) : undefined;
                const avgSweetness = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarSweetness || 50), 0) / mols.length) : undefined;
                const avgSpiciness = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarSpiciness || 50), 0) / mols.length) : undefined;
                const avgEarthiness = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarEarthiness || 50), 0) / mols.length) : undefined;
                
                exportRecetteToMarkdown({
                  id: data.recette.id,
                  name: data.recette.name,
                  category: data.recette.category,
                  family: data.family?.name || null,
                  intensity: data.recette.intensity,
                  stability: data.recette.stability,
                  moleculeCount: data.molecules?.length,
                  ingredients: data.recette.ingredients,
                  avgIntensity,
                  avgFreshness,
                  avgWarmth,
                  avgSweetness,
                  avgSpiciness,
                  avgEarthiness,
                });
                toast({ title: "Export Markdown réussi", description: "Le fichier a été téléchargé" });
              }}>
                <FileText className="h-4 w-4 mr-2" />
                Markdown (Notion)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                // Calculer les moyennes radar depuis les molécules
                const mols = data.molecules || [];
                const avgIntensity = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarIntensity || 50), 0) / mols.length) : undefined;
                const avgFreshness = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarFreshness || 50), 0) / mols.length) : undefined;
                const avgWarmth = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarWarmth || 50), 0) / mols.length) : undefined;
                const avgSweetness = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarSweetness || 50), 0) / mols.length) : undefined;
                const avgSpiciness = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarSpiciness || 50), 0) / mols.length) : undefined;
                const avgEarthiness = mols.length > 0 ? Math.round(mols.reduce((sum, m) => sum + (m.radarEarthiness || 50), 0) / mols.length) : undefined;
                
                exportRecetteToJSON({
                  id: data.recette.id,
                  name: data.recette.name,
                  category: data.recette.category,
                  family: data.family?.name || null,
                  intensity: data.recette.intensity,
                  stability: data.recette.stability,
                  moleculeCount: data.molecules?.length,
                  ingredients: data.recette.ingredients,
                  avgIntensity,
                  avgFreshness,
                  avgWarmth,
                  avgSweetness,
                  avgSpiciness,
                  avgEarthiness,
                });
                toast({ title: "Export JSON réussi", description: "Le fichier a été téléchargé" });
              }}>
                <FileJson className="h-4 w-4 mr-2" />
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                exportRecipePDF({
                  name: data.recette.name,
                  category: data.family?.name || undefined,
                  notes: data.recette.notes || undefined,
                  id: data.recette.id,
                });
                toast({ title: "Export PDF réussi", description: "Le fichier a été téléchargé" });
              }}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {recette.status && (
            <Badge className={`${statusColors[recette.status]} border px-3 py-1.5 flex items-center gap-2`}>
              {statusIcons[recette.status]}
              {recette.status.charAt(0).toUpperCase() + recette.status.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Info */}
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="text-3xl flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-primary" />
            {recette.name}
          </CardTitle>
          {recette.category && (
            <Badge variant="outline" className="w-fit mt-2">
              {recette.category}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Description */}
          {recette.description && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-base leading-relaxed">{recette.description}</p>
            </div>
          )}

          {/* Formule */}
          {recette.formula && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Formule</h3>
              <p className="text-base whitespace-pre-wrap">{recette.formula}</p>
            </div>
          )}

          {/* Ingrédients textuels + liaisons formelles */}
          <div className="space-y-3">
            {recette.ingredients && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Ingrédients Clés</h3>
                <p className="text-base whitespace-pre-wrap">{recette.ingredients}</p>
              </div>
            )}
            {molecules.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <span>Molécules Liées</span>
                  <Badge variant="secondary" className="text-xs">{molecules.length}</Badge>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {molecules.slice(0, 12).map((m: RecipeMolecule) => (
                    <Link key={m.id} href={`/molecule/${m.id}`}>
                      <Badge
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                      >
                        {m.name}
                        {m.proportion ? <span className="ml-1 opacity-60">{Number(m.proportion).toFixed(0)}%</span> : null}
                      </Badge>
                    </Link>
                  ))}
                  {molecules.length > 12 && (
                    <Badge variant="secondary" className="text-xs">+{molecules.length - 12} autres</Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Propriétés Principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {family && (
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Famille Olfactive</p>
                <Badge variant="outline" className="mt-1">
                  {family.name}
                </Badge>
              </div>
            )}
            {accord && (
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Accord</p>
                <Badge variant="outline" className="mt-1">
                  {accord.name}
                </Badge>
              </div>
            )}
            {recette.intensity && (
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Intensité</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${recette.intensity * 10}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold">{recette.intensity}/10</span>
                </div>
              </div>
            )}
            {recette.stability && (
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Stabilité</p>
                <Badge variant="outline" className="mt-1 capitalize">
                  {recette.stability}
                </Badge>
              </div>
            )}
          </div>

          {/* Propriétés Techniques */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recette.texture && (
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <Droplets className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Texture</p>
                  <p className="font-semibold capitalize">{recette.texture}</p>
                </div>
              </div>
            )}
            {recette.combustionTemperature && (
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <Flame className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Combustion</p>
                  <p className="font-semibold">{recette.combustionTemperature}°C</p>
                </div>
              </div>
            )}
            {recette.maturationTime && (
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Maturation</p>
                  <p className="font-semibold">{recette.maturationTime} jours</p>
                </div>
              </div>
            )}
            {recette.productionTime && (
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Temps Production</p>
                  <p className="font-semibold">{recette.productionTime} min</p>
                </div>
              </div>
            )}
            {recette.costEstimate && (
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Coût Estimé</p>
                  <p className="font-semibold">{(recette.costEstimate / 100).toFixed(2)} CHF</p>
                </div>
              </div>
            )}
          </div>

          {/* Évolution Aromatique */}
          {(recette.notesTete || recette.notesCoeur || recette.notesFond) && (
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Évolution Aromatique</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {recette.notesTete && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Notes de Tête</p>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <MoleculeListLinks text={recette.notesTete} variant="inline" />
                    </div>
                  </div>
                )}
                {recette.notesCoeur && (
                  <div className="bg-pink-50 dark:bg-pink-950/30 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                    <p className="text-sm font-semibold text-pink-800 dark:text-pink-300 mb-2">Notes de Cœur</p>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <MoleculeListLinks text={recette.notesCoeur} variant="inline" />
                    </div>
                  </div>
                )}
                {recette.notesFond && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">Notes de Fond</p>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <MoleculeListLinks text={recette.notesFond} variant="inline" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Protocole */}
          {recette.protocol && (
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Protocole de Fabrication</h3>
              <p className="text-base whitespace-pre-wrap leading-relaxed text-muted-foreground">{recette.protocol}</p>
            </div>
          )}

          {/* Notes */}
          {recette.notes && (
            <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-primary">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Notes de Recherche</h3>
              <p className="text-base whitespace-pre-wrap leading-relaxed">{recette.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relation Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5" />
            Graphe de Relations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "500px" }} className="border rounded-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              attributionPosition="bottom-left"
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
              <span>Famille Olfactive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border border-orange-400 rounded"></div>
              <span>Accord</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-600 rounded"></div>
              <span>Recette</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border border-purple-400 rounded"></div>
              <span>Molécules ({molecules.length})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profil Olfactif Radar */}
      {molecules.length > 0 && (
        <RecipeOlfactiveProfile 
          molecules={molecules.map(m => ({
            id: m.id,
            name: m.name,
            chemicalFormula: m.chemicalFormula,
            radarIntensity: m.radarIntensity,
            radarFreshness: m.radarFreshness,
            radarWarmth: m.radarWarmth,
            radarSweetness: m.radarSweetness,
            radarSpiciness: m.radarSpiciness,
            radarEarthiness: m.radarEarthiness,
          }))}
          recipeName={recette.name}
          color="#22c55e"
        />
      )}

      {/* Related Molecules */}
      {molecules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-purple-600" />
              Molécules Utilisées ({molecules.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Composition moléculaire avec proportions et rôles olfactifs
            </p>
          </CardHeader>
          <CardContent>
            {/* Visualisation par rôle olfactif */}
            <div className="mb-6 space-y-4">
              {/* Notes de tête */}
              {molecules.filter((m: RecipeMolecule) => m.role === 'tête').length > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    Notes de Tête ({molecules.filter((m: RecipeMolecule) => m.role === 'tête').length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {molecules.filter((m: RecipeMolecule) => m.role === 'tête').map((molecule: RecipeMolecule) => (
                      <Link key={molecule.id} href={`/molecule/${molecule.id}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors py-1.5 px-3">
                          <span className="font-medium">{molecule.name}</span>
                          {molecule.proportion && (
                            <span className="ml-2 text-xs opacity-70">{(molecule.proportion).toFixed(2)}%</span>
                          )}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Notes de cœur */}
              {molecules.filter((m: RecipeMolecule) => m.role === 'cœur').length > 0 && (
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                  <h4 className="text-sm font-semibold text-pink-800 dark:text-pink-300 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Notes de Cœur ({molecules.filter((m: RecipeMolecule) => m.role === 'cœur').length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {molecules.filter((m: RecipeMolecule) => m.role === 'cœur').map((molecule: RecipeMolecule) => (
                      <Link key={molecule.id} href={`/molecule/${molecule.id}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors py-1.5 px-3">
                          <span className="font-medium">{molecule.name}</span>
                          {molecule.proportion && (
                            <span className="ml-2 text-xs opacity-70">{(molecule.proportion).toFixed(2)}%</span>
                          )}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Notes de fond */}
              {molecules.filter((m: RecipeMolecule) => m.role === 'fond').length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <TreeDeciduous className="h-4 w-4" />
                    Notes de Fond ({molecules.filter((m: RecipeMolecule) => m.role === 'fond').length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {molecules.filter((m: RecipeMolecule) => m.role === 'fond').map((molecule: RecipeMolecule) => (
                      <Link key={molecule.id} href={`/molecule/${molecule.id}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors py-1.5 px-3">
                          <span className="font-medium">{molecule.name}</span>
                          {molecule.proportion && (
                            <span className="ml-2 text-xs opacity-70">{(molecule.proportion).toFixed(2)}%</span>
                          )}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Molécules sans rôle défini */}
              {molecules.filter((m: RecipeMolecule) => !m.role).length > 0 && (
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Autres molécules ({molecules.filter((m: RecipeMolecule) => !m.role).length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {molecules.filter((m: RecipeMolecule) => !m.role).map((molecule: RecipeMolecule) => (
                      <Link key={molecule.id} href={`/molecule/${molecule.id}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors py-1.5 px-3">
                          <span className="font-medium">{molecule.name}</span>
                          {molecule.proportion && (
                            <span className="ml-2 text-xs opacity-70">{(molecule.proportion).toFixed(2)}%</span>
                          )}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Grille détaillée des molécules */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-4">Détails des molécules</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {molecules.map((molecule: RecipeMolecule) => (
                  <Link key={molecule.id} href={`/molecule/${molecule.id}`}>
                    <Card className="shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{molecule.name}</CardTitle>
                          {molecule.role && (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                molecule.role === 'tête' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                                molecule.role === 'cœur' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' :
                                'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                              }`}
                            >
                              {molecule.role}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground font-mono mb-2">
                          {molecule.chemicalFormula}
                        </p>
                        {molecule.proportion && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Proportion</span>
                              <span className="font-semibold">{(molecule.proportion).toFixed(2)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div 
                                className="bg-purple-500 h-1.5 rounded-full transition-all" 
                                style={{ width: `${Math.min(Number(molecule.proportion) * 10, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {molecule.olfactiveProfile && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                            {molecule.olfactiveProfile}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {molecule.family && (
                            <Badge variant="outline" className="text-xs">
                              {molecule.family}
                            </Badge>
                          )}
                          {molecule.chemicalClass && (
                            <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-950/30">
                              {molecule.chemicalClass}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matières Premières Directement Liées */}
      <Card className="shadow-sm border-amber-200 dark:border-amber-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-600" />
                Matières Premières {rawMaterialsLinked && rawMaterialsLinked.length > 0 && `(${rawMaterialsLinked.length})`}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Matières premières directement liées à cette formulation
              </p>
            </div>
            {user && (
              <Button
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30"
                onClick={() => setShowAddRmDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {rawMaterialsLinked && rawMaterialsLinked.length > 0 ? (
            <div className="space-y-2">
              {((rawMaterialsLinked as unknown) as RawMaterialLink[] | undefined)?.map((rm: RawMaterialLink) => {
                const roleColors: Record<string, string> = {
                  base: 'bg-stone-100 text-stone-700 dark:bg-stone-900/50 dark:text-stone-300',
                  coeur: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
                  tete: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
                  fixateur: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
                  modificateur: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
                  autre: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
                };
                const roleColor = roleColors[(rm.role as string) || 'autre'] || roleColors.autre;
                return (
                  <div key={rm.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 hover:border-amber-300 dark:hover:border-amber-700 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <Link href={`/matieres-premieres/${rm.rawMaterialId}`}>
                        <span className="text-amber-700 dark:text-amber-400 font-medium text-sm hover:underline cursor-pointer truncate">
                          {rm.name}
                        </span>
                      </Link>
                      {rm.category && (
                        <Badge variant="outline" className="text-xs border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hidden sm:inline-flex">
                          {rm.category.replace(/_/g, ' ')}
                        </Badge>
                      )}
                      {rm.role && (
                        <Badge className={`text-xs border-0 ${roleColor}`}>
                          {rm.role}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
                      {rm.percentage && (
                        <span className="font-mono font-semibold text-amber-700 dark:text-amber-400">{rm.percentage}%</span>
                      )}
                      {rm.dosage && (
                        <span>{rm.dosage} {rm.dosageUnit}</span>
                      )}
                      {user && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => {
                              setEditingRm(rm);
                              setEditRmRole((rm.role || 'autre') as "autre" | "tete" | "coeur" | "base" | "fixateur" | "modificateur");
                              setEditRmDosage(String(rm.dosage || ''));
                              setEditRmDosageUnit(rm.dosageUnit || 'g');
                              setEditRmPercentage(String(rm.percentage || ''));
                              setEditRmNotes(rm.notes || '');
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={() => removeRmMutation.mutate(rm.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <Link2 className="h-3 w-3" />
                Cliquez sur un nom pour accéder à la fiche. {user && 'Survolez pour éditer ou supprimer.'}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune matière première liée directement.</p>
              {user && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400"
                  onClick={() => setShowAddRmDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une matière première
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'ajout de matière première */}
      <Dialog open={showAddRmDialog} onOpenChange={setShowAddRmDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-600" />
              Lier une matière première
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Recherche */}
            <div className="space-y-1.5">
              <Label>Rechercher une matière première</Label>
              <Input
                placeholder="Nom, famille olfactive..."
                value={rmSearch}
                onChange={(e) => { setRmSearch(e.target.value); setSelectedRmId(null); }}
                autoFocus
              />
              {rawMaterialsSearch && rawMaterialsSearch.items && rawMaterialsSearch.items.length > 0 && !selectedRmId && (
                <div className="border rounded-lg max-h-40 overflow-y-auto bg-background shadow-sm">
                  {rawMaterialsSearch.items.map((rm: RawMaterialLink) => (
                    <button
                      key={rm.id}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center justify-between border-b last:border-0"
                      onClick={() => { setSelectedRmId(rm.id); setRmSearch(rm.name); }}
                    >
                      <span className="font-medium">{rm.name}</span>
                      <Badge variant="outline" className="text-xs ml-2 shrink-0">{rm.category?.replace(/_/g, ' ')}</Badge>
                    </button>
                  ))}
                </div>
              )}
              {selectedRmId && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Sélectionné : {rmSearch}
                </p>
              )}
            </div>

            {/* Rôle */}
            <div className="space-y-1.5">
              <Label>Rôle dans la formulation</Label>
              <Select value={rmRole} onValueChange={(v) => setRmRole(v as "autre" | "tete" | "coeur" | "base" | "fixateur" | "modificateur")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="coeur">Cœur</SelectItem>
                  <SelectItem value="tete">Tête</SelectItem>
                  <SelectItem value="fixateur">Fixateur</SelectItem>
                  <SelectItem value="modificateur">Modificateur</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dosage et pourcentage */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Dosage</Label>
                <Input
                  placeholder="0.5"
                  value={rmDosage}
                  onChange={(e) => setRmDosage(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Unité</Label>
                <Select value={rmDosageUnit} onValueChange={setRmDosageUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="drops">gouttes</SelectItem>
                    <SelectItem value="mg">mg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>% dans la formule</Label>
                <Input
                  placeholder="5.0"
                  value={rmPercentage}
                  onChange={(e) => setRmPercentage(e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Notes (optionnel)</Label>
              <Input
                placeholder="Observations, rôle spécifique..."
                value={rmNotes}
                onChange={(e) => setRmNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRmDialog(false)}>Annuler</Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={!selectedRmId || addRmMutation.isPending}
              onClick={() => {
                if (!selectedRmId) return;
                addRmMutation.mutate({
                  recetteId: id,
                  rawMaterialId: selectedRmId,
                  role: rmRole,
                  dosage: rmDosage || undefined,
                  dosageUnit: rmDosageUnit,
                  percentage: rmPercentage || undefined,
                  notes: rmNotes || undefined,
                });
              }}
            >
              {addRmMutation.isPending ? "Ajout..." : "Lier la matière première"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition d'une liaison existante */}
      <Dialog open={!!editingRm} onOpenChange={(open) => { if (!open) setEditingRm(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-600" />
              Modifier la liaison — {editingRm?.rawMaterialName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Rôle */}
            <div className="space-y-1.5">
              <Label>Rôle dans la formulation</Label>
              <Select value={editRmRole} onValueChange={(v) => setEditRmRole(v as "autre" | "tete" | "coeur" | "base" | "fixateur" | "modificateur")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="coeur">Cœur</SelectItem>
                  <SelectItem value="tete">Tête</SelectItem>
                  <SelectItem value="fixateur">Fixateur</SelectItem>
                  <SelectItem value="modificateur">Modificateur</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Dosage et pourcentage */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Dosage</Label>
                <Input
                  placeholder="0.5"
                  value={editRmDosage}
                  onChange={(e) => setEditRmDosage(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Unité</Label>
                <Select value={editRmDosageUnit} onValueChange={setEditRmDosageUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="drops">gouttes</SelectItem>
                    <SelectItem value="mg">mg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>% dans la formule</Label>
                <Input
                  placeholder="5.0"
                  value={editRmPercentage}
                  onChange={(e) => setEditRmPercentage(e.target.value)}
                />
              </div>
            </div>
            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Notes (optionnel)</Label>
              <Input
                placeholder="Observations, rôle spécifique..."
                value={editRmNotes}
                onChange={(e) => setEditRmNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRm(null)}>Annuler</Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={updateRmMutation.isPending}
              onClick={() => {
                if (!editingRm) return;
                updateRmMutation.mutate({
                  id: editingRm.id,
                  data: {
                    role: editRmRole,
                    dosage: editRmDosage || undefined,
                    dosageUnit: editRmDosageUnit,
                    percentage: editRmPercentage || undefined,
                    notes: editRmNotes || undefined,
                  },
                });
              }}
            >
              {updateRmMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recette Parente */}
      {parentRecette && (
        <Card className="shadow-sm border-rose-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-rose-600" />
              Recette Principale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Cette recette est une variation de :
            </p>
            <Link href={`/recette/${parentRecette.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-rose-200 hover:border-rose-400">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{parentRecette.name}</h4>
                    {parentRecette.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {parentRecette.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="border-rose-300">
                    Voir la recette principale
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Formules de Référence */}
      {formulesReference && formulesReference.length > 0 && (
        <Card className="shadow-sm border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-amber-600" />
              Formules de Référence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Cette recette s'inspire des archétypes olfactifs classiques suivants :
            </p>
            <div className="space-y-3">
              {formulesReference.map((formule: FormuleReference) => (
                <div key={formule.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-700">{formule.formuleReferenceName}</div>
                    <div className="text-sm text-slate-600">
                      Famille : <Badge variant="outline" className="ml-1">{formule.formuleReferenceFamily}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Similarité</div>
                      <div className="text-lg font-bold text-amber-600">{formule.similarityScore}%</div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/formules-reference">
                        Voir la formule
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TerpProfiles Liés (pour les recettes TL) */}
      {linkedTerpProfiles && linkedTerpProfiles.length > 0 && (
        <Card className="shadow-sm border-sky-200 bg-gradient-to-br from-sky-50/50 to-cyan-50/50 dark:from-sky-950/20 dark:to-cyan-950/20">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Leaf className="h-4 w-4 md:h-5 md:w-5 text-sky-600" />
              <span className="truncate">TerpProfiles Associés ({linkedTerpProfiles.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
              Fiches analytiques partageant des molécules avec cette recette
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {(linkedTerpProfiles as any[]).map((profile: TerpProfile) => (
                <Link key={profile.id} href={`/terp-profiles/${profile.profileId}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-sky-200 hover:border-sky-400 h-full">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm line-clamp-2">{profile.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`shrink-0 text-xs ${
                            profile.climaticAxis === 'vent' ? 'border-sky-300 bg-sky-50 text-sky-700' :
                            profile.climaticAxis === 'bois' ? 'border-amber-300 bg-amber-50 text-amber-700' :
                            'border-violet-300 bg-violet-50 text-violet-700'
                          }`}
                        >
                          {profile.climaticAxis === 'vent' && <Wind className="w-3 h-3 mr-1" />}
                          {profile.climaticAxis === 'bois' && <TreeDeciduous className="w-3 h-3 mr-1" />}
                          {profile.climaticAxis === 'disparition' && <Sparkles className="w-3 h-3 mr-1" />}
                          {profile.climaticAxis}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{profile.profileId}</span>
                        {profile.matchScore && (
                          <Badge variant="secondary" className="text-xs">
                            {profile.matchScore}% match
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transformations Moléculaires */}
      {transformationsData?.transformations && transformationsData.transformations.length > 0 && (
        <Card className="shadow-sm border-orange-200 bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Flame className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              <span className="truncate">Transformations Moléculaires ({transformationsData.transformations.length})</span>
            </CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground">
              Réactions chimiques (pyrolyse, oxydation...) qui impactent cette recette
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Bouton vers le graphe */}
            <div className="mb-4">
              <Link href="/molecular-transformations?mode=cascade">
                <Button variant="outline" size="sm" className="gap-2">
                  <Network className="h-4 w-4" />
                  Voir le graphe des transformations
                </Button>
              </Link>
            </div>
            
            {/* Liste des transformations par type d'impact */}
            <div className="space-y-4">
              {/* Impacts majeurs */}
              {(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'major').length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Impacts Majeurs ({(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'major').length})
                  </h4>
                  <div className="space-y-3">
                    {(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'major').map((t: Transformation) => (
                      <TransformationCard key={t.id} transformation={t} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Impacts modérés */}
              {(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'moderate').length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-3 flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    Impacts Modérés ({(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'moderate').length})
                  </h4>
                  <div className="space-y-3">
                    {(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'moderate').slice(0, 5).map((t: Transformation) => (
                      <TransformationCard key={t.id} transformation={t} />
                    ))}
                    {(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'moderate').length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'moderate').length - 5} autres transformations modérées
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Impacts mineurs */}
              {(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'minor').length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Impacts Mineurs ({(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'minor').length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'minor').slice(0, 10).map((t: Transformation) => (
                      <Badge key={t.id} variant="outline" className="text-xs">
                        {t.source_molecule_name} → {t.product_molecule_name}
                      </Badge>
                    ))}
                    {(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'minor').length > 10 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'minor').length - 10} autres
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {/* Traces */}
              {(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'trace').length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-950/30 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Traces ({(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'trace').length})
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {(transformationsData.transformations as any[]).filter((t: Transformation) => t.impact_type === 'trace').length} transformations à impact négligeable
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommandations IA */}
      {recommendations && recommendations.length > 0 && (
        <RecommendationsCard
          type="recettes"
          recommendations={recommendations}
          isLoading={isLoadingRecommendations}
        />
      )}

      {/* Section Voir aussi */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Molécules de cette recette */}
        <LinkedMolecules
          molecules={data?.molecules || []}
          isLoading={isLoading}
          title="Molécules de cette recette"
        />

        {/* Recettes similaires */}
        <SimilarContent
          items={similarRecettes || []}
          type="recette"
          isLoading={isLoadingSimilar}
          getSubtitle={(r) => r.category || r.description?.slice(0, 50) || undefined}
        />
      </div>

      {/* Références Bibliographiques Associées */}
      <LinkedReferences 
        entityType="recette" 
        entityId={id} 
        title="Références Bibliographiques Associées"
        maxItems={5}
      />

      {/* Variations */}
      {variations && variations.length > 0 && (
        <Card className="shadow-sm border-amber-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-amber-600" />
              Variations ({variations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Explorez les déclinaisons de cette recette :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variations.map((variation) => (
                <Link key={variation.id} href={`/recette/${variation.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-amber-200 hover:border-amber-400">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{variation.name}</h4>
                          {variation.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {variation.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="border-amber-300 shrink-0">
                          {variation.status || 'experimental'}
                        </Badge>
                      </div>
                      {variation.formula && (
                        <p className="text-xs font-mono text-muted-foreground mt-2 line-clamp-1">
                          {variation.formula}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Voir aussi — Navigation contextuelle inter-entités */}
      {(rawMaterialsLinked?.length || similarRecettes?.length || molecules?.length) ? (
        <SeeAlsoSection
          title="Connexions de cette recette"
          groups={[
            {
              label: "Matières premières utilisées",
              type: "rawMaterial",
              items: (rawMaterialsLinked || []).map((rm) => ({
                id: (rm as any).rawMaterialId as number,
                label: (rm as any).rawMaterialName || `MP #${(rm as any).rawMaterialId}`,
                sublabel: (rm as any).role ? `Rôle : ${(rm as any).role}` : undefined,
                href: `/matieres-premieres/${(rm as any).rawMaterialId}`,
                type: "rawMaterial" as const,
              })) as any[],
              viewAllHref: "/matieres-premieres",
              viewAllLabel: "Toutes les matières premières",
            },
            {
              label: "Molécules de la formule",
              type: "molecule",
              items: (molecules || []).slice(0, 10).map((m: RecipeMolecule) => ({
                id: m.id,
                label: m.name,
                sublabel: m.family || m.chemicalClass || undefined,
                href: `/molecules/${m.id}`,
                type: "molecule" as const,
              })),
              viewAllHref: "/molecules",
              viewAllLabel: "Toutes les molécules",
            },
            {
              label: "Recettes similaires",
              type: "recette",
              items: (similarRecettes || []).map((r: { id: number; name: string; family?: string | null; accord?: string | null; moleculeCount?: number }) => ({
                id: r.id,
                label: r.name,
                sublabel: r.family || undefined,
                href: `/recettes/${r.id}`,
                type: "recette" as const,
              })),
              viewAllHref: "/recettes",
              viewAllLabel: "Toutes les recettes",
            },
          ]}
        />
      ) : null}
    </div>
  );
}


// Composant pour afficher une carte de transformation
function TransformationCard({ transformation }: { transformation: Transformation }) {
  const transformationTypeLabels: Record<string, { label: string; color: string }> = {
    pyrolysis: { label: "Pyrolyse", color: "bg-orange-500" },
    oxidation: { label: "Oxydation", color: "bg-blue-500" },
    isomerization: { label: "Isomérisation", color: "bg-purple-500" },
    dehydration: { label: "Déshydratation", color: "bg-yellow-500" },
    cyclization: { label: "Cyclisation", color: "bg-green-500" },
    ring_opening: { label: "Ouverture de cycle", color: "bg-red-500" },
    polymerization: { label: "Polymérisation", color: "bg-indigo-500" },
    degradation: { label: "Dégradation", color: "bg-gray-500" },
    maillard: { label: "Réaction de Maillard", color: "bg-amber-600" },
    caramelization: { label: "Caramélisation", color: "bg-amber-400" },
    other: { label: "Autre", color: "bg-slate-500" },
  };

  const typeInfo = (transformation.transformation_type ? transformationTypeLabels[transformation.transformation_type] : null) || transformationTypeLabels.other;

  return (
    <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Link href={`/molecular-transformations?molecule=${encodeURIComponent(transformation.source_molecule_name ?? '')}&mode=cascade`}>
            <Badge variant="outline" className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors">
              {transformation.source_molecule_name}
            </Badge>
          </Link>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <Link href={`/molecular-transformations?molecule=${encodeURIComponent(transformation.product_molecule_name ?? '')}&mode=cascade`}>
            <Badge variant="outline" className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors">
              {transformation.product_molecule_name}
            </Badge>
          </Link>
        </div>
        <Badge className={`${typeInfo.color} text-white text-xs shrink-0`}>
          {typeInfo.label}
        </Badge>
      </div>
      
      {transformation.temperature_optimal && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <Thermometer className="h-3 w-3" />
          <span>{transformation.temperature_optimal}°C</span>
        </div>
      )}
      
      {transformation.olfactory_change_description && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {transformation.olfactory_change_description}
        </p>
      )}
      
      {transformation.olfactory_contribution && (
        <p className="text-xs text-primary mt-1 italic">
          Contribution: {transformation.olfactory_contribution}
        </p>
      )}
    </div>
  );
}
