import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dna, FlaskConical, Leaf, Search, ArrowRight, Beaker, Link2, Plus, Trash2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import BiosyntheticPathwayViz from "@/components/BiosyntheticPathwayViz";
import BiosyntheticPathwayFlow from "@/components/BiosyntheticPathwayFlow";

interface TpsGene {
  id: number;
  name: string;
  subfamily: string | null;
  product_class: string;
  main_product: string | null;
  olfactory_notes: string | null;
  pathway: string | null;
  regulation_factors: string | null;
  expression_conditions: string | null;
  source_reference: string | null;
}

interface BiosyntheticPathway {
  id: number;
  name: string;
  abbreviation: string | null;
  location: string;
  main_products: string | null;
  key_enzymes: string | null;
  precursors: string | null;
  description: string | null;
  source_reference: string | null;
}

const productClassColors: Record<string, string> = {
  monoterpene: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  sesquiterpene: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  diterpene: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  hemiterpene: "bg-sky-500/20 text-sky-400 border-sky-500/30",
};

const pathwayColors: Record<string, string> = {
  MEP: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  MVA: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  both: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

const locationColors: Record<string, string> = {
  plastid: "bg-green-500/20 text-green-400 border-green-500/30",
  cytosol: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  both: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  mitochondria: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function TpsGenesExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productClassFilter, setProductClassFilter] = useState<string>("all");
  const [pathwayFilter, setPathwayFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("genes");

  const { data: tpsGenes = [], isLoading: genesLoading } = trpc.research.getTpsGenes.useQuery({});
  const { data: pathways = [], isLoading: pathwaysLoading } = trpc.research.getBiosyntheticPathways.useQuery();
  const { data: stats } = trpc.research.getGenomicStats.useQuery();

  const filteredGenes = useMemo(() => {
    return (tpsGenes as TpsGene[]).filter((gene) => {
      const matchesSearch =
        !searchTerm ||
        gene.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gene.main_product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gene.olfactory_notes?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProductClass =
        productClassFilter === "all" || gene.product_class === productClassFilter;

      const matchesPathway =
        pathwayFilter === "all" || gene.pathway === pathwayFilter;

      return matchesSearch && matchesProductClass && matchesPathway;
    });
  }, [tpsGenes, searchTerm, productClassFilter, pathwayFilter]);

  const isLoading = genesLoading || pathwaysLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
              <Dna className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gènes TPS du Tabac</h1>
              <p className="text-muted-foreground">
                Exploration des terpène synthases et voies biosynthétiques de Nicotiana tabacum
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">{stats?.totalTpsGenes || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Gènes TPS</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">{stats?.monoterpenes || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Monoterpènes</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">{stats?.sesquiterpenes || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Sesquiterpènes</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{stats?.diterpenes || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Diterpènes</div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{stats?.pathways || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Voies</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="genes" className="data-[state=active]:bg-emerald-500/20">
              <Dna className="h-4 w-4 mr-2" />
              Gènes TPS
            </TabsTrigger>
            <TabsTrigger value="pathways" className="data-[state=active]:bg-blue-500/20">
              <FlaskConical className="h-4 w-4 mr-2" />
              Voies Biosynthétiques
            </TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:bg-violet-500/20">
              <Link2 className="h-4 w-4 mr-2" />
              Liaisons Molécules
            </TabsTrigger>
            <TabsTrigger value="flow" className="data-[state=active]:bg-amber-500/20">
              <ArrowRight className="h-4 w-4 mr-2" />
              Chemins
            </TabsTrigger>
          </TabsList>

          {/* TPS Genes Tab */}
          <TabsContent value="genes" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, produit ou notes olfactives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card/50 border-border/50"
                />
              </div>
              <Select value={productClassFilter} onValueChange={setProductClassFilter}>
                <SelectTrigger className="w-full md:w-48 bg-card/50 border-border/50">
                  <SelectValue placeholder="Classe de produit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  <SelectItem value="monoterpene">Monoterpènes (C10)</SelectItem>
                  <SelectItem value="sesquiterpene">Sesquiterpènes (C15)</SelectItem>
                  <SelectItem value="diterpene">Diterpènes (C20)</SelectItem>
                  <SelectItem value="hemiterpene">Hémiterpènes (C5)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pathwayFilter} onValueChange={setPathwayFilter}>
                <SelectTrigger className="w-full md:w-48 bg-card/50 border-border/50">
                  <SelectValue placeholder="Voie métabolique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les voies</SelectItem>
                  <SelectItem value="MEP">Voie MEP (Plastes)</SelectItem>
                  <SelectItem value="MVA">Voie MVA (Cytosol)</SelectItem>
                  <SelectItem value="both">Les deux voies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              {filteredGenes.length} gène{filteredGenes.length > 1 ? "s" : ""} trouvé{filteredGenes.length > 1 ? "s" : ""}
            </div>

            {/* Gene Cards */}
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Chargement des données génomiques...</div>
            ) : filteredGenes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Aucun gène trouvé avec ces critères</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGenes.map((gene) => (
                  <Card key={gene.id} className="bg-card/50 border-border/50 hover:border-emerald-500/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold text-foreground leading-tight">
                          {gene.name}
                        </CardTitle>
                        <Badge variant="outline" className={productClassColors[gene.product_class] || "bg-gray-500/20"}>
                          {gene.product_class}
                        </Badge>
                      </div>
                      {gene.subfamily && (
                        <CardDescription className="text-xs">
                          Sous-famille: {gene.subfamily}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Main Product */}
                      {gene.main_product && (
                        <div className="flex items-center gap-2">
                          <Beaker className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span className="text-sm font-medium text-foreground">{gene.main_product}</span>
                        </div>
                      )}

                      {/* Olfactory Notes */}
                      {gene.olfactory_notes && (
                        <div className="text-sm text-muted-foreground italic">
                          &quot;{gene.olfactory_notes}&quot;
                        </div>
                      )}

                      {/* Pathway Badge */}
                      {gene.pathway && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={pathwayColors[gene.pathway] || "bg-gray-500/20"}>
                            Voie {gene.pathway}
                          </Badge>
                        </div>
                      )}

                      {/* Expression Conditions */}
                      {gene.expression_conditions && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Expression:</span> {gene.expression_conditions}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Biosynthetic Pathways Tab */}
          <TabsContent value="pathways" className="space-y-4">
            {/* Visualisation D3.js interactive */}
            <BiosyntheticPathwayViz />

            {pathwaysLoading ? (
              <div className="text-center py-12 text-muted-foreground">Chargement des voies biosynthétiques...</div>
            ) : (pathways as BiosyntheticPathway[]).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Aucune voie biosynthétique trouvée</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(pathways as BiosyntheticPathway[]).map((pathway) => (
                  <Card key={pathway.id} className="bg-card/50 border-border/50 hover:border-blue-500/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                            <FlaskConical className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-foreground">
                              {pathway.name}
                            </CardTitle>
                            {pathway.abbreviation && (
                              <CardDescription className="text-sm">
                                ({pathway.abbreviation})
                              </CardDescription>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className={locationColors[pathway.location] || "bg-gray-500/20"}>
                          {pathway.location === "plastid" ? "Plastes" : 
                           pathway.location === "cytosol" ? "Cytosol" : 
                           pathway.location === "both" ? "Les deux" : pathway.location}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Description */}
                      {pathway.description && (
                        <p className="text-sm text-muted-foreground">
                          {pathway.description}
                        </p>
                      )}

                      {/* Precursors -> Products Flow */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {pathway.precursors && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-slate-500/20 text-slate-300 border-slate-500/30">
                              {pathway.precursors.split(",")[0].trim()}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        {pathway.main_products && (
                          <div className="flex flex-wrap gap-1">
                            {pathway.main_products.split(",").slice(0, 3).map((product, idx) => (
                              <Badge key={idx} variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                                {product.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Key Enzymes */}
                      {pathway.key_enzymes && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">Enzymes clés:</div>
                          <div className="text-xs text-foreground/80">
                            {pathway.key_enzymes}
                          </div>
                        </div>
                      )}

                      {/* Source Reference */}
                      {pathway.source_reference && (
                        <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                          Source: {pathway.source_reference}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Molecule Links Tab */}
          <TabsContent value="links" className="space-y-4">
            <TpsGeneMoleculeLinksTab tpsGenes={tpsGenes as TpsGene[]} />
          </TabsContent>

          {/* Biosynthetic Pathways Flow Tab */}
          <TabsContent value="flow" className="space-y-4">
            <BiosyntheticPathwayFlowTab />
          </TabsContent>
        </Tabs>

        {/* Info Box */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                <Leaf className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">À propos des gènes TPS</h3>
                <p className="text-sm text-muted-foreground">
                  Le génome de <em>Nicotiana tabacum</em> contient environ <strong>160 gènes TPS</strong> (Terpène Synthases) 
                  répartis en 7 sous-familles (TPS-a à TPS-g). Ces gènes sont responsables de la biosynthèse des terpènes 
                  qui contribuent aux profils aromatiques caractéristiques du tabac.
                </p>
                <p className="text-sm text-muted-foreground">
                  Les voies <strong>MEP</strong> (dans les plastes) et <strong>MVA</strong> (dans le cytosol) produisent 
                  les précurseurs universels IPP et DMAPP, qui sont ensuite convertis en monoterpènes, sesquiterpènes 
                  et diterpènes par les terpène synthases spécifiques.
                </p>
                <p className="text-xs text-muted-foreground italic mt-2">
                  Source: Rabara et al. 2023, Nature Genetics 2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


// ============================================================================
// TPS Gene - Molecule Links Tab Component
// ============================================================================

interface TpsGeneMoleculeLinksTabProps {
  tpsGenes: TpsGene[];
}

function TpsGeneMoleculeLinksTab({ tpsGenes }: TpsGeneMoleculeLinksTabProps) {
  const [selectedGeneId, setSelectedGeneId] = useState<string>("all");
  const [relationshipFilter, setRelationshipFilter] = useState<string>("all");
  const [confidenceFilter, setConfidenceFilter] = useState<string>("all");
  const [isAutoLinkDialogOpen, setIsAutoLinkDialogOpen] = useState(false);

  const { data: links = [], isLoading: linksLoading, refetch: refetchLinks } = trpc.research.getTpsGeneMoleculeLinks.useQuery(
    selectedGeneId !== "all" ? { tpsGeneId: parseInt(selectedGeneId) } : undefined
  );
  
  const { data: linkStats } = trpc.research.getTpsGeneMoleculeLinkStats.useQuery();
  
  const autoLinkMutation = trpc.research.autoLinkTpsGenesToMolecules.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`${data.linksCreated} liaisons créées automatiquement`);
        refetchLinks();
        setIsAutoLinkDialogOpen(false);
      } else {
        toast.error(data.error || "Erreur lors de la création des liaisons");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteLinkMutation = trpc.research.deleteTpsGeneMoleculeLink.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Liaison supprimée");
        refetchLinks();
      } else {
        toast.error(data.error || "Erreur lors de la suppression");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const filteredLinks = useMemo(() => {
    return (links as any[]).filter((link) => {
      const matchesRelationship = relationshipFilter === "all" || link.relationshipType === relationshipFilter;
      const matchesConfidence = confidenceFilter === "all" || link.confidenceLevel === confidenceFilter;
      return matchesRelationship && matchesConfidence;
    });
  }, [links, relationshipFilter, confidenceFilter]);

  const relationshipColors: Record<string, string> = {
    produces: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    catalyzes: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    regulates: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    precursor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  const confidenceColors: Record<string, string> = {
    confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
    predicted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    inferred: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">{linkStats?.totalLinks || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Liaisons totales</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">{linkStats?.linkedGenes || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Gènes liés ({linkStats?.geneCoverage?.toFixed(1) || 0}%)
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{linkStats?.linkedMolecules || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Molécules liées ({linkStats?.moleculeCoverage?.toFixed(1) || 0}%)
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">{linkStats?.totalGenes || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Gènes TPS total</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <Select value={selectedGeneId} onValueChange={setSelectedGeneId}>
            <SelectTrigger className="w-full md:w-[250px] bg-card/50 border-border/50">
              <SelectValue placeholder="Filtrer par gène" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les gènes</SelectItem>
              {tpsGenes.map((gene) => (
                <SelectItem key={gene.id} value={gene.id.toString()}>
                  {gene.name} - {gene.main_product}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-card/50 border-border/50">
              <SelectValue placeholder="Type de relation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes relations</SelectItem>
              <SelectItem value="produces">Produit</SelectItem>
              <SelectItem value="catalyzes">Catalyse</SelectItem>
              <SelectItem value="regulates">Régule</SelectItem>
              <SelectItem value="precursor">Précurseur</SelectItem>
            </SelectContent>
          </Select>

          <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-card/50 border-border/50">
              <SelectValue placeholder="Niveau de confiance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous niveaux</SelectItem>
              <SelectItem value="confirmed">Confirmé</SelectItem>
              <SelectItem value="predicted">Prédit</SelectItem>
              <SelectItem value="inferred">Inféré</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAutoLinkDialogOpen} onOpenChange={setIsAutoLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Auto-liaison
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Liaison automatique</DialogTitle>
              <DialogDescription>
                Cette fonction va analyser tous les gènes TPS et créer automatiquement des liaisons 
                avec les molécules correspondantes basées sur la correspondance des noms de produits.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <p className="text-sm text-amber-400">
                Les liaisons existantes ne seront pas dupliquées. Seules les nouvelles correspondances seront ajoutées.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAutoLinkDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => autoLinkMutation.mutate()}
                disabled={autoLinkMutation.isPending}
                className="gap-2"
              >
                {autoLinkMutation.isPending ? (
                  <>Analyse en cours...</>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Lancer l'auto-liaison
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Links List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-violet-400" />
            Liaisons Gènes TPS ↔ Molécules
          </CardTitle>
          <CardDescription>
            {filteredLinks.length} liaison{filteredLinks.length !== 1 ? 's' : ''} trouvée{filteredLinks.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linksLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement des liaisons...
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-8">
              <Link2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Aucune liaison trouvée. Utilisez l'auto-liaison pour créer des correspondances automatiques.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredLinks.map((link: any) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30 hover:border-violet-500/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Gene Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Dna className="h-4 w-4 text-emerald-400" />
                        <span className="font-medium">{link.geneName}</span>
                        <Badge variant="outline" className={productClassColors[link.geneProductClass] || ""}>
                          {link.geneProductClass}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {link.geneMainProduct} • {link.geneOlfactoryNotes}
                      </p>
                    </div>

                    {/* Relationship Arrow */}
                    <div className="flex flex-col items-center px-4">
                      <Badge variant="outline" className={relationshipColors[link.relationshipType] || ""}>
                        {link.relationshipType}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground my-1" />
                      <Badge variant="outline" className={confidenceColors[link.confidenceLevel] || ""}>
                        {link.confidenceLevel}
                      </Badge>
                    </div>

                    {/* Molecule Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Beaker className="h-4 w-4 text-blue-400" />
                        <span className="font-medium">{link.moleculeName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {link.moleculeFormula} • {link.moleculeOlfactiveProfile}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => deleteLinkMutation.mutate({ id: link.id })}
                    disabled={deleteLinkMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-violet-400 mb-2">
            À propos des liaisons Gènes-Molécules
          </h3>
          <p className="text-sm text-muted-foreground">
            Les liaisons entre gènes TPS et molécules permettent de tracer la biosynthèse des composés 
            aromatiques. Chaque gène TPS code pour une enzyme qui catalyse la formation de terpènes 
            spécifiques à partir de précurseurs comme le GPP, FPP ou GGPP.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <Badge variant="outline" className={relationshipColors.produces}>Produit</Badge>
              <p className="text-xs text-muted-foreground mt-1">Synthèse directe</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className={relationshipColors.catalyzes}>Catalyse</Badge>
              <p className="text-xs text-muted-foreground mt-1">Réaction enzymatique</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className={relationshipColors.regulates}>Régule</Badge>
              <p className="text-xs text-muted-foreground mt-1">Contrôle expression</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className={relationshipColors.precursor}>Précurseur</Badge>
              <p className="text-xs text-muted-foreground mt-1">Substrat initial</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


/**
 * BiosyntheticPathwayFlowTab - Onglet de visualisation des chemins biosynthétiques
 */
function BiosyntheticPathwayFlowTab() {
  const [selectedPathway, setSelectedPathway] = useState<"MEP" | "MVA" | "all">("all");
  
  const { data: pathwaysData, isLoading } = trpc.research.getBiosyntheticPathwayFlow.useQuery({
    pathway: selectedPathway,
    limit: 100,
  });

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-amber-400" />
            Chemins Biosynthétiques
          </CardTitle>
          <CardDescription>
            Visualisation du parcours complet: Gène TPS → Molécule → Recette
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BiosyntheticPathwayFlow
            data={pathwaysData?.paths || []}
            stats={pathwaysData?.stats}
            isLoading={isLoading}
            selectedPathway={selectedPathway}
            onPathwayChange={setSelectedPathway}
          />
        </CardContent>
      </Card>
    </div>
  );
}
