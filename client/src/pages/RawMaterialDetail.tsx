import { useParams, Link } from "wouter";
import { AddInventoryModal } from "@/components/AddInventoryModal";
import { CombinedChromatogram } from "@/components/CombinedChromatogram";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Droplets,
  Flower2,
  TreeDeciduous,
  Leaf,
  Beaker,
  MapPin,
  FlaskConical,
  Sparkles,
  Wind,
  Sun,
  Thermometer,
  Atom,
  ExternalLink,
  Clock,
  Gauge,
  Package,
  BarChart3,
  Plus,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Upload,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { AIEnrichButton } from "@/components/AIEnrichButton";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LinkedMolecules, SimilarContent } from "@/components/SeeAlso";
import { TabErrorBoundary } from "@/components/TabErrorBoundary";

// Category configuration
const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  huile_essentielle: { label: "Huile essentielle", icon: <Droplets className="w-5 h-5" />, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  absolue: { label: "Absolue", icon: <Flower2 className="w-5 h-5" />, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  concrete: { label: "Concrète", icon: <Sparkles className="w-5 h-5" />, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  resinoid: { label: "Résinoïde", icon: <TreeDeciduous className="w-5 h-5" />, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  teinture: { label: "Teinture", icon: <FlaskConical className="w-5 h-5" />, color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  co2_extract: { label: "Extrait CO₂", icon: <Wind className="w-5 h-5" />, color: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
  hydrolat: { label: "Hydrolat", icon: <Droplets className="w-5 h-5" />, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  beurre: { label: "Beurre", icon: <Sun className="w-5 h-5" />, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  cire: { label: "Cire", icon: <Thermometer className="w-5 h-5" />, color: "bg-stone-500/20 text-stone-400 border-stone-500/30" },
  oleoresine: { label: "Oléorésine", icon: <Droplets className="w-5 h-5" />, color: "bg-red-500/20 text-red-400 border-red-500/30" },
  infusion: { label: "Infusion", icon: <Leaf className="w-5 h-5" />, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  maceration: { label: "Macération", icon: <Beaker className="w-5 h-5" />, color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  distillat: { label: "Distillat", icon: <FlaskConical className="w-5 h-5" />, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  autre: { label: "Autre", icon: <Beaker className="w-5 h-5" />, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

// Olfactive family configuration
const olfactiveFamilyConfig: Record<string, { label: string; color: string }> = {
  floral: { label: "Floral", color: "bg-pink-500/20 text-pink-400" },
  boise: { label: "Boisé", color: "bg-amber-500/20 text-amber-400" },
  agrume: { label: "Agrume", color: "bg-yellow-500/20 text-yellow-400" },
  epice: { label: "Épicé", color: "bg-red-500/20 text-red-400" },
  herbace: { label: "Herbacé", color: "bg-green-500/20 text-green-400" },
  balsamique: { label: "Balsamique", color: "bg-orange-500/20 text-orange-400" },
  musque: { label: "Musqué", color: "bg-purple-500/20 text-purple-400" },
  animal: { label: "Animal", color: "bg-stone-500/20 text-stone-400" },
  vert: { label: "Vert", color: "bg-emerald-500/20 text-emerald-400" },
  fruité: { label: "Fruité", color: "bg-rose-500/20 text-rose-400" },
  marin: { label: "Marin", color: "bg-blue-500/20 text-blue-400" },
  terreux: { label: "Terreux", color: "bg-stone-600/20 text-stone-400" },
  fumé: { label: "Fumé", color: "bg-gray-500/20 text-gray-400" },
  gourmand: { label: "Gourmand", color: "bg-amber-600/20 text-amber-400" },
  aromatique: { label: "Aromatique", color: "bg-teal-500/20 text-teal-400" },
  autre: { label: "Autre", color: "bg-slate-500/20 text-slate-400" },
};

export default function RawMaterialDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const utils = trpc.useUtils();

  const { data: material, isLoading } = trpc.rawMaterials.getById.useQuery(id);
  const { data: molecules } = trpc.rawMaterials.getMolecules.useQuery(id);
  const { data: msSpectraData, isLoading: isLoadingSpectra } = trpc.rawMaterials.getMsSpectra.useQuery(
    { rawMaterialId: id },
    { enabled: id > 0 }
  );

  // Récupérer les matières premières similaires
  const { data: similarMaterials, isLoading: isLoadingSimilar } = trpc.crossLinks.getSimilarRawMaterials.useQuery(
    { rawMaterialId: id, limit: 5 },
    { enabled: id > 0 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Card className="p-12 text-center">
            <Droplets className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Matière première non trouvée</h3>
            <p className="text-muted-foreground mb-4">
              Cette matière première n'existe pas ou a été supprimée.
            </p>
            <Link href="/matieres-premieres">
              <Button>Retour aux matières premières</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryInfo = categoryConfig[material?.category] || categoryConfig.autre;
  const olfactiveInfo = material?.olfactiveFamily 
    ? olfactiveFamilyConfig[material?.olfactiveFamily] || olfactiveFamilyConfig.autre
    : null;

  // Helpers de normalisation des champs JSON polymorphes
  const asArrayRM = (val: unknown): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return (val as unknown[]).map(String).filter(Boolean);
    if (typeof val === "string") {
      const t = val.trim();
      if (t.startsWith("[")) { try { const p = JSON.parse(t); if (Array.isArray(p)) return p.map(String).filter(Boolean); } catch { /* ignore */ } }
      return t ? [t] : [];
    }
    return [String(val)];
  };

  // Champs normalisés
  const normAllergens = asArrayRM(material?.allergens);
  const normSynergies = asArrayRM((material as any).synergies);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          currentLabel={material?.name}
          customItems={[
            { label: "Matières Premières", path: "/matieres-premieres" },
            { label: material?.name }
          ]}
        />
        
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/matieres-premieres">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour aux matières premières
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-4 rounded-xl ${categoryInfo.color}`}>
              {categoryInfo.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h1 className="text-4xl font-bold">{material?.name}</h1>
                <AIEnrichButton
                  entityType="rawMaterial"
                  entityId={material?.id}
                  entityName={material?.name}
                  onEnrichSuccess={() => {
                    utils.rawMaterials.getById.invalidate(id);
                    utils.rawMaterials.getMolecules.invalidate(id);
                  }}
                />
              </div>
              {material?.latinName && (
                <p className="text-xl text-muted-foreground italic">{material?.latinName}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className={categoryInfo.color}>
                  {categoryInfo.label}
                </Badge>
                {olfactiveInfo && (
                  <Badge variant="secondary" className={olfactiveInfo.color}>
                    {olfactiveInfo.label}
                  </Badge>
                )}
                {material?.quality && (
                  <Badge variant="outline">{material?.quality.replace('_', ' ')}</Badge>
                )}
                {material?.priceRange && (
                  <Badge variant="outline">{material?.priceRange}</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="molecules">Molécules ({molecules?.length || 0})</TabsTrigger>
            <TabsTrigger value="inventory">Inventaire</TabsTrigger>
            <TabsTrigger value="spectra">Spectres MS</TabsTrigger>
            <TabsTrigger value="usage">Utilisation</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <TabErrorBoundary tabLabel="Vue d'ensemble">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Origin Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Origine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {material?.originCountry && (
                    <div>
                      <span className="text-sm text-muted-foreground">Pays</span>
                      <p className="font-medium">{material?.originCountry}</p>
                    </div>
                  )}
                  {material?.originRegion && (
                    <div>
                      <span className="text-sm text-muted-foreground">Région</span>
                      <p className="font-medium">{material?.originRegion}</p>
                    </div>
                  )}
                  {material?.plantPart && (
                    <div>
                      <span className="text-sm text-muted-foreground">Partie de la plante</span>
                      <p className="font-medium capitalize">{material?.plantPart.replace('_', ' ')}</p>
                    </div>
                  )}
                  {material?.plantId && (
                    <div>
                      <span className="text-sm text-muted-foreground">Plante source</span>
                      <Link href={`/plantes/${material?.plantId}`}>
                        <Button variant="link" className="p-0 h-auto">
                          Voir la plante <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  )}
                  {material?.terroirId && (
                    <div>
                      <span className="text-sm text-muted-foreground">Terroir</span>
                      <Link href={`/terroirs/${material?.terroirId}`}>
                        <Button variant="link" className="p-0 h-auto">
                          Voir le terroir <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Olfactive Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Profil olfactif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {material?.olfactiveProfile && (
                    <div>
                      <span className="text-sm text-muted-foreground">Description</span>
                      <p className="text-sm">{material?.olfactiveProfile}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-3">
                    {material?.topNotes && (
                      <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
                        <span className="text-xs text-sky-400 font-medium">Notes de tête</span>
                        <p className="text-sm mt-1">{material?.topNotes}</p>
                      </div>
                    )}
                    {material?.heartNotes && (
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                        <span className="text-xs text-rose-400 font-medium">Notes de cœur</span>
                        <p className="text-sm mt-1">{material?.heartNotes}</p>
                      </div>
                    )}
                    {material?.baseNotes && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <span className="text-xs text-amber-400 font-medium">Notes de fond</span>
                        <p className="text-sm mt-1">{material?.baseNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-6">
                    {material?.intensity && (
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Intensité: {material?.intensity}/10</span>
                      </div>
                    )}
                    {material?.tenacity && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Tenue: {material?.tenacity}h</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Extraction Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    Extraction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {material?.extractionYield && (
                    <div>
                      <span className="text-sm text-muted-foreground">Rendement</span>
                      <p className="font-medium">{material?.extractionYield}%</p>
                    </div>
                  )}
                  {material?.extractionNotes && (
                    <div>
                      <span className="text-sm text-muted-foreground">Notes d'extraction</span>
                      <p className="text-sm">{material?.extractionNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Regulations Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="w-5 h-5" />
                    Réglementation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {material?.ifraCategory && (
                    <div>
                      <span className="text-sm text-muted-foreground">Catégorie IFRA</span>
                      <p className="font-medium">{material?.ifraCategory}</p>
                    </div>
                  )}
                  {material?.maxUsageLevel && (
                    <div>
                      <span className="text-sm text-muted-foreground">Niveau d'usage max</span>
                      <p className="font-medium">{material?.maxUsageLevel}%</p>
                    </div>
                  )}
                  {material?.restrictions && (
                    <div>
                      <span className="text-sm text-muted-foreground">Restrictions</span>
                      <p className="text-sm">{material?.restrictions}</p>
                    </div>
                  )}
                  {normAllergens.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Allergènes</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {normAllergens.map((allergen: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs bg-red-500/10 text-red-400">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            </TabErrorBoundary>
          </TabsContent>

          {/* Molecules Tab */}
          <TabsContent value="molecules">
            <TabErrorBoundary tabLabel="Composition moléculaire">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="w-5 h-5" />
                  Composition moléculaire
                </CardTitle>
                <CardDescription>
                  Molécules présentes dans cette matière première
                </CardDescription>
              </CardHeader>
              <CardContent>
                {molecules && molecules?.length > 0 ? (
                  <div className="space-y-3">
                    {molecules?.map((item: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Atom className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <Link href={`/molecules/${item.molecule.id}`}>
                              <span className="font-medium hover:text-primary transition-colors cursor-pointer">
                                {item.molecule.name}
                              </span>
                            </Link>
                            {item.molecule.chemicalFormula && (
                              <p className="text-sm text-muted-foreground">
                                {item.molecule.chemicalFormula}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {item.percentage && (
                            <Badge variant="secondary">
                              {item.percentage}%
                            </Badge>
                          )}
                          {item.isSignature === 1 && (
                            <Badge className="bg-amber-500/20 text-amber-400">
                              Signature
                            </Badge>
                          )}
                          {item.variability && (
                            <Badge variant="outline" className="text-xs">
                              {item.variability}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Atom className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune molécule associée à cette matière première.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            </TabErrorBoundary>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <TabErrorBoundary tabLabel="Inventaire">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Historique des achats
                </CardTitle>
                <CardDescription>
                  Suivi des acquisitions de cette matière première
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    Aucune entrée d'inventaire pour le moment
                  </p>
                  <AddInventoryModal 
                    rawMaterialId={id} 
                    rawMaterialName={material?.name || ""} 
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Informations de stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Package className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stock actuel</p>
                      <p className="text-2xl font-bold">0 ml</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dernier achat</p>
                      <p className="text-lg font-medium">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prix moyen</p>
                      <p className="text-lg font-medium">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </TabErrorBoundary>
          </TabsContent>

          {/* Spectra Tab */}
          <TabsContent value="spectra" className="space-y-6">
            <TabErrorBoundary tabLabel="Spectres MS">
            {/* Chromatogramme combiné */}
            <CombinedChromatogram
              spectra={msSpectraData?.spectra || []}
              materialName={material?.name || ""}
              isLoading={isLoadingSpectra}
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Molécules identifiées
                </CardTitle>
                <CardDescription>
                  Spectres de masse des molécules clés de cette matière première
                </CardDescription>
              </CardHeader>
              <CardContent>
                {molecules && molecules?.length > 0 ? (
                  <div className="space-y-3">
                    {molecules?.slice(0, 10).map((mol: any) => (
                      <Link 
                        key={mol.id}
                        href={`/ms-spectra?search=${encodeURIComponent(mol.molecule?.name || mol.name || '')}`}
                      >
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-500/20">
                              <BarChart3 className="w-4 h-4 text-violet-400" />
                            </div>
                            <div>
                              <span className="font-medium">{mol.molecule?.name || mol.name}</span>
                              {mol.percentage && (
                                <span className="text-sm text-muted-foreground ml-2">({mol.percentage}%)</span>
                              )}
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                    <div className="flex justify-center gap-4 pt-4">
                      <Link href="/compare-spectra">
                        <Button variant="outline">
                          Comparer les spectres
                        </Button>
                      </Link>
                      <Link href="/identify-spectrum">
                        <Button variant="outline">
                          Identifier un spectre
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">
                      Aucune molécule liée - les spectres MS seront disponibles après liaison
                    </p>
                    <Link href="/ms-spectra">
                      <Button variant="outline">
                        Explorer les spectres MS
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Liens vers les outils d'analyse */}
            <Card>
              <CardHeader>
                <CardTitle>Outils d'analyse</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/gcms-chromatograms">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Chromatogrammes GC-MS
                  </Button>
                </Link>
                <Link href="/ms-spectra">
                  <Button variant="outline" className="w-full justify-start">
                    <Atom className="w-4 h-4 mr-2" />
                    Bibliothèque de spectres
                  </Button>
                </Link>
                <Link href="/analysis-hub">
                  <Button variant="outline" className="w-full justify-start">
                    <Beaker className="w-4 h-4 mr-2" />
                    Hub Analyse
                  </Button>
                </Link>
              </CardContent>
            </Card>
            </TabErrorBoundary>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage">
            <TabErrorBoundary tabLabel="Usage">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notes d'utilisation</CardTitle>
                </CardHeader>
                <CardContent>
                  {material?.usageNotes ? (
                    <p className="text-sm">{material?.usageNotes}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune note d'utilisation disponible.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conseils d'assemblage</CardTitle>
                </CardHeader>
                <CardContent>
                  {material?.blendingTips ? (
                    <p className="text-sm">{material?.blendingTips}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucun conseil d'assemblage disponible.</p>
                  )}
                </CardContent>
              </Card>

              {normSynergies.length > 0 && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Synergies recommandées</CardTitle>
                    <CardDescription>
                      Matières premières qui se marient bien avec celle-ci
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {normSynergies.map((synergy: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-sm">
                          {synergy}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {material?.notes && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Notes de recherche</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{material?.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
            </TabErrorBoundary>
          </TabsContent>
        </Tabs>

        {/* Section Voir aussi */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Molécules de cette matière première */}
          <LinkedMolecules
            molecules={molecules || []}
            isLoading={isLoading}
            title="Molécules dominantes"
          />

          {/* Matières premières similaires */}
          <SimilarContent
            items={similarMaterials || []}
            type="rawMaterial"
            isLoading={isLoadingSimilar}
            getSubtitle={(m) => m.olfactiveFamily || m.category || undefined}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
