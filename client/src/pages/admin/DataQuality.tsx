// @ts-nocheck
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Database, 
  Trash2, 
  Sparkles, 
  Link2, 
  AlertTriangle, 
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  BarChart3,
  FlaskConical,
  Leaf,
  Cigarette,
  Droplets,
  BookOpen,
  Network,
  TrendingUp,
  Clock,
  Info,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

// ── Helpers pour le tableau de bord métriques ──
function pct(val: any, total: any): number {
  const v = Number(val ?? 0);
  const t = Number(total ?? 0);
  if (t === 0) return 0;
  return Math.round((v / t) * 100);
}
function scoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}
function progressColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}
function calcGlobalScore(m: any): number {
  if (!m) return 0;
  const scores = [
    pct(m.molecules?.with_cas, m.molecules?.total),
    pct(m.molecules?.with_smiles, m.molecules?.total),
    pct(m.molecules?.validated, m.molecules?.total),
    pct(m.tabacs?.with_terroir, m.tabacs?.total),
    pct(m.cigarillos?.with_terpene, m.cigarillos?.total),
    pct(m.accords?.with_desc, m.accords?.total),
    pct(m.plants?.with_latin, m.plants?.total),
    pct(m.plants?.with_family, m.plants?.total),
  ];
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
function MetricRow({ label, value, total, tooltip, link }: { label: string; value: number; total: number; tooltip?: string; link?: string }) {
  const score = pct(value, total);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">{label}</span>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><Info className="w-3 h-3 text-muted-foreground/50" /></TooltipTrigger>
                <TooltipContent><p className="text-xs max-w-48">{tooltip}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold ${scoreColor(score)}`}>{score}%</span>
          <span className="text-xs text-muted-foreground">({value}/{total})</span>
          {link && <Link href={link}><ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary cursor-pointer" /></Link>}
        </div>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${progressColor(score)}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function DataQuality() {
  const [isExecutingMerge, setIsExecutingMerge] = useState(false);
  const [isExecutingEnrich, setIsExecutingEnrich] = useState(false);
  
  // Queries
  const { data: duplicates, isLoading: loadingDuplicates, refetch: refetchDuplicates } = 
    trpc.dataCleanup.analyzeDuplicates.useQuery();
  const { data: enrichPreview, isLoading: loadingEnrich, refetch: refetchEnrich } = 
    trpc.dataCleanup.previewEnrichFormulas.useQuery();
  const { data: linkAnalysis, isLoading: loadingLinks, refetch: refetchLinks } = 
    trpc.dataCleanup.analyzeLinkCoverage.useQuery();
  const { data: moleculesWithoutRecettes } = 
    trpc.dataCleanup.getMoleculesWithoutRecettes.useQuery({ limit: 10 });
  const { data: moleculesWithoutPlants } = 
    trpc.dataCleanup.getMoleculesWithoutPlants.useQuery({ limit: 10 });
  const { data: plantsWithoutMolecules } = 
    trpc.dataCleanup.getPlantsWithoutMolecules.useQuery({ limit: 10 });
  const { data: qualityMetrics, isLoading: loadingMetrics, refetch: refetchMetrics } =
    trpc.dataQuality.getMetrics.useQuery(undefined, { refetchInterval: 60_000 });
  
  // Mutations
  const mergeMutation = trpc.dataCleanup.executeMergeDuplicates.useMutation({
    onSuccess: (data) => {
      toast.success(`Fusion terminée: ${data.merged?.length || 0} groupes traités`);
      refetchDuplicates();
      refetchLinks();
      setIsExecutingMerge(false);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setIsExecutingMerge(false);
    }
  });
  
  const enrichMutation = trpc.dataCleanup.executeEnrichFormulas.useMutation({
    onSuccess: (data) => {
      toast.success(`Enrichissement terminé: ${data.updated?.length || 0} molécules enrichies`);
      refetchEnrich();
      setIsExecutingEnrich(false);
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
      setIsExecutingEnrich(false);
    }
  });
  
  const handleMergeDuplicates = () => {
    setIsExecutingMerge(true);
    mergeMutation.mutate({});
  };
  
  const handleEnrichFormulas = () => {
    setIsExecutingEnrich(true);
    enrichMutation.mutate({});
  };
  
  const refreshAll = () => {
    refetchDuplicates();
    refetchEnrich();
    refetchLinks();
    refetchMetrics();
    toast.info("Données actualisées");
  };
  const globalScore = calcGlobalScore(qualityMetrics);

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Qualité des Données</h1>
          <p className="text-muted-foreground mt-1">
            Nettoyage, enrichissement et analyse des liaisons
          </p>
        </div>
        <Button variant="outline" onClick={refreshAll}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Molécules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkAnalysis?.entities?.molecules || "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recettes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkAnalysis?.entities?.recettes || "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkAnalysis?.entities?.plants || "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Terroirs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkAnalysis?.entities?.terroirs || "..."}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Métriques
          </TabsTrigger>
          <TabsTrigger value="duplicates" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Doublons
          </TabsTrigger>
          <TabsTrigger value="enrich" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Enrichissement
          </TabsTrigger>
          <TabsTrigger value="links" className="gap-2">
            <Link2 className="h-4 w-4" />
            Liaisons
          </TabsTrigger>
        </TabsList>

        {/* Métriques Tab */}
        <TabsContent value="metrics" className="space-y-6">
          {/* Score global */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-8 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative inline-flex items-center justify-center w-24 h-24">
                    <svg width="96" height="96" className="-rotate-90">
                      <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                      <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6"
                        strokeDasharray={`${(globalScore / 100) * 251} 251`} strokeLinecap="round"
                        className={scoreColor(globalScore)} />
                    </svg>
                    <span className={`absolute text-2xl font-bold ${scoreColor(globalScore)}`}>{globalScore}%</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Score global</span>
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-bold">
                    {globalScore >= 80 ? "Qualité excellente" : globalScore >= 60 ? "Qualité satisfaisante" : globalScore >= 40 ? "Qualité à améliorer" : "Qualité insuffisante"}
                  </h2>
                  <p className="text-muted-foreground text-sm">Score calculé sur 8 métriques clés : CAS, SMILES, validation, terroirs, profils terpéniques, descriptions, noms latins, familles botaniques.</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-green-600 border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {Number(qualityMetrics?.molecules?.validated ?? 0)} validées
                    </Badge>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-500/30">
                      <Clock className="w-3 h-3 mr-1" />
                      {Number(qualityMetrics?.molecules?.in_review ?? 0)} en révision
                    </Badge>
                    <Badge variant="outline" className="text-red-600 border-red-500/30">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {Number(qualityMetrics?.molecules?.draft ?? 0)} brouillons
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grille métriques */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FlaskConical className="w-5 h-5 text-blue-500" />
                  Molécules
                  <Badge variant="secondary" className="ml-auto">{Number(qualityMetrics?.molecules?.total ?? 0)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <MetricRow label="Numéro CAS" value={Number(qualityMetrics?.molecules?.with_cas ?? 0)} total={Number(qualityMetrics?.molecules?.total ?? 1)} tooltip="Identifiant chimique universel" link="/molecules" />
                <MetricRow label="SMILES" value={Number(qualityMetrics?.molecules?.with_smiles ?? 0)} total={Number(qualityMetrics?.molecules?.total ?? 1)} tooltip="Structure moléculaire 2D/3D" link="/molecules" />
                <MetricRow label="Classe chimique" value={Number(qualityMetrics?.molecules?.with_class ?? 0)} total={Number(qualityMetrics?.molecules?.total ?? 1)} />
                <MetricRow label="Enrichissement PubChem" value={Number(qualityMetrics?.molecules?.with_pubchem ?? 0)} total={Number(qualityMetrics?.molecules?.total ?? 1)} />
                <div className="pt-2 border-t text-xs text-muted-foreground">{Number(qualityMetrics?.molecules?.distinct_families ?? 0)} familles normalisées</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Leaf className="w-5 h-5 text-green-500" />
                  Plantes
                  <Badge variant="secondary" className="ml-auto">{Number(qualityMetrics?.plants?.total ?? 0)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <MetricRow label="Nom latin" value={Number(qualityMetrics?.plants?.with_latin ?? 0)} total={Number(qualityMetrics?.plants?.total ?? 1)} link="/plantes" />
                <MetricRow label="Famille botanique" value={Number(qualityMetrics?.plants?.with_family ?? 0)} total={Number(qualityMetrics?.plants?.total ?? 1)} link="/plantes" />
                <MetricRow label="Plantes validées" value={Number(qualityMetrics?.plants?.validated ?? 0)} total={Number(qualityMetrics?.plants?.total ?? 1)} />
                <div className="pt-2 border-t text-xs text-muted-foreground">{Number(qualityMetrics?.plantMolecules?.plants_with_molecules ?? 0)} plantes avec profil moléculaire ({Number(qualityMetrics?.plantMolecules?.total ?? 0)} liaisons)</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cigarette className="w-5 h-5 text-amber-500" />
                  Tabacs
                  <Badge variant="secondary" className="ml-auto">{Number(qualityMetrics?.tabacs?.total ?? 0)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <MetricRow label="Lien terroir" value={Number(qualityMetrics?.tabacs?.with_terroir ?? 0)} total={Number(qualityMetrics?.tabacs?.total ?? 1)} link="/tabacs-resines" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  Recettes Cigarillos
                  <Badge variant="secondary" className="ml-auto">{Number(qualityMetrics?.cigarillos?.total ?? 0)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <MetricRow label="Profil terpénique" value={Number(qualityMetrics?.cigarillos?.with_terpene ?? 0)} total={Number(qualityMetrics?.cigarillos?.total ?? 1)} link="/recettes-cigarillos" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Droplets className="w-5 h-5 text-purple-500" />
                  Accords
                  <Badge variant="secondary" className="ml-auto">{Number(qualityMetrics?.accords?.total ?? 0)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <MetricRow label="Description" value={Number(qualityMetrics?.accords?.with_desc ?? 0)} total={Number(qualityMetrics?.accords?.total ?? 1)} link="/accords" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Network className="w-5 h-5 text-cyan-500" />
                  Synergies & Recettes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-muted/50 rounded">
                    <div className="text-2xl font-bold text-cyan-500">{Number(qualityMetrics?.synergies?.total ?? 0)}</div>
                    <div className="text-xs text-muted-foreground">Synergies</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded">
                    <div className="text-2xl font-bold text-indigo-500">{Number(qualityMetrics?.recipes?.total ?? 0)}</div>
                    <div className="text-xs text-muted-foreground">Recettes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Doublons Tab */}
        <TabsContent value="duplicates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Analyse des Doublons
              </CardTitle>
              <CardDescription>
                Identification et fusion des molécules dupliquées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingDuplicates ? (
                <div className="text-muted-foreground">Chargement...</div>
              ) : duplicates && !("error" in duplicates) ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Total molécules</div>
                      <div className="text-2xl font-bold">{duplicates?.totalMolecules}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Groupes de doublons</div>
                      <div className="text-2xl font-bold">{duplicates?.duplicateGroups}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Total doublons</div>
                      <div className="text-2xl font-bold">{duplicates?.totalDuplicates}</div>
                    </div>
                  </div>
                  
                  {duplicates?.duplicates && duplicates?.duplicates?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Doublons détectés</h4>
                      <div className="max-h-60 overflow-y-auto space-y-1">
                        {duplicates?.duplicates?.slice(0, 20).map((dup: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                            <span className="font-medium">{dup.name}</span>
                            <Badge variant="secondary">{dup.count} occurrences</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleMergeDuplicates} 
                    disabled={isExecutingMerge || duplicates?.duplicateGroups === 0}
                    className="w-full"
                  >
                    {isExecutingMerge ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Fusion en cours...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Fusionner les doublons
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>Impossible de charger les données</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Enrichissement Tab */}
        <TabsContent value="enrich" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Enrichissement des Formules
              </CardTitle>
              <CardDescription>
                Ajout automatique des formules chimiques et SMILES
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingEnrich ? (
                <div className="text-muted-foreground">Chargement...</div>
              ) : enrichPreview && !("error" in enrichPreview) ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Sans formule</div>
                      <div className="text-2xl font-bold">{enrichPreview?.totalWithoutFormula}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Enrichissables</div>
                      <div className="text-2xl font-bold text-green-600">{enrichPreview?.updated?.length || 0}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Non trouvées</div>
                      <div className="text-2xl font-bold text-orange-600">{enrichPreview?.notFound?.length || 0}</div>
                    </div>
                  </div>
                  
                  {enrichPreview?.updated && enrichPreview?.updated.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Molécules à enrichir</h4>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {enrichPreview?.updated.slice(0, 10).map((item: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-green-500/10 rounded text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleEnrichFormulas} 
                    disabled={isExecutingEnrich || (enrichPreview?.updated?.length || 0) === 0}
                    className="w-full"
                  >
                    {isExecutingEnrich ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Enrichissement en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Enrichir les molécules
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>Impossible de charger les données</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Liaisons Tab */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Analyse des Liaisons
              </CardTitle>
              <CardDescription>
                Couverture des connexions entre entités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingLinks ? (
                <div className="text-muted-foreground">Chargement...</div>
              ) : linkAnalysis ? (
                <>
                  {/* Coverage Progress */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Molécules → Recettes</span>
                        <span className="font-medium">{linkAnalysis?.coverage?.moleculesWithRecettesPercent}%</span>
                      </div>
                      <Progress value={linkAnalysis?.coverage?.moleculesWithRecettesPercent || 0} />
                      <div className="text-xs text-muted-foreground">
                        {linkAnalysis?.coverage?.moleculesWithRecettes} / {linkAnalysis?.entities?.molecules} molécules liées
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Molécules → Plantes</span>
                        <span className="font-medium">{linkAnalysis?.coverage?.moleculesWithPlantsPercent}%</span>
                      </div>
                      <Progress value={linkAnalysis?.coverage?.moleculesWithPlantsPercent || 0} />
                      <div className="text-xs text-muted-foreground">
                        {linkAnalysis?.coverage?.moleculesWithPlants} / {linkAnalysis?.entities?.molecules} molécules liées
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Plantes → Molécules</span>
                        <span className="font-medium">{linkAnalysis?.coverage?.plantsWithMoleculesPercent}%</span>
                      </div>
                      <Progress value={linkAnalysis?.coverage?.plantsWithMoleculesPercent || 0} />
                      <div className="text-xs text-muted-foreground">
                        {linkAnalysis?.coverage?.plantsWithMolecules} / {linkAnalysis?.entities?.plants} plantes liées
                      </div>
                    </div>
                  </div>
                  
                  {/* Gaps */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">Sans recettes</span>
                      </div>
                      <div className="text-2xl font-bold">{linkAnalysis?.gaps?.moleculesWithoutRecettes}</div>
                      {moleculesWithoutRecettes && moleculesWithoutRecettes?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {moleculesWithoutRecettes?.slice(0, 3).map((m: any) => (
                            <div key={m.id} className="text-xs text-muted-foreground flex items-center gap-1">
                              <ChevronRight className="h-3 w-3" />
                              {m.name}
                            </div>
                          ))}
                          {moleculesWithoutRecettes?.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              ... et {linkAnalysis?.gaps?.moleculesWithoutRecettes - 3} autres
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">Sans plantes</span>
                      </div>
                      <div className="text-2xl font-bold">{linkAnalysis?.gaps?.moleculesWithoutPlants}</div>
                      {moleculesWithoutPlants && moleculesWithoutPlants?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {moleculesWithoutPlants?.slice(0, 3).map((m: any) => (
                            <div key={m.id} className="text-xs text-muted-foreground flex items-center gap-1">
                              <ChevronRight className="h-3 w-3" />
                              {m.name}
                            </div>
                          ))}
                          {moleculesWithoutPlants?.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              ... et {linkAnalysis?.gaps?.moleculesWithoutPlants - 3} autres
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">Plantes isolées</span>
                      </div>
                      <div className="text-2xl font-bold">{linkAnalysis?.gaps?.plantsWithoutMolecules}</div>
                      {plantsWithoutMolecules && plantsWithoutMolecules?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {plantsWithoutMolecules?.slice(0, 3).map((p: any) => (
                            <div key={p.id} className="text-xs text-muted-foreground flex items-center gap-1">
                              <ChevronRight className="h-3 w-3" />
                              {p.name}
                            </div>
                          ))}
                          {plantsWithoutMolecules?.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              ... et {linkAnalysis?.gaps?.plantsWithoutMolecules - 3} autres
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>Impossible de charger les données</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
