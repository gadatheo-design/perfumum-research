import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Ban, 
  CheckCircle2, 
  FileWarning, 
  RefreshCw, 
  Loader2,
  Shield,
  AlertCircle,
  Info,
  ExternalLink,
  FlaskConical
} from "lucide-react";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function IFRACompliance() {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichResult, setEnrichResult] = useState<{
    total: number;
    enriched: number;
    banned: number;
    restricted: number;
    specRequired: number;
    notRegulated: number;
    errors: number;
  } | null>(null);

  // Statistiques IFRA
  const { data: ifraStats, refetch: refetchStats } = trpc.ifra.getEnrichmentStats.useQuery();
  const { data: ifraDbStats } = trpc.ifra.getStats.useQuery();
  
  // Molécules par statut
  const { data: bannedMolecules } = trpc.ifra.getMoleculesByStatus.useQuery({ 
    status: 'banned', 
    limit: 50 
  });
  const { data: restrictedMolecules } = trpc.ifra.getMoleculesByStatus.useQuery({ 
    status: 'restricted', 
    limit: 100 
  });
  const { data: specRequiredMolecules } = trpc.ifra.getMoleculesByStatus.useQuery({ 
    status: 'specification_required', 
    limit: 50 
  });

  // Mutation d'enrichissement
  const enrichBatch = trpc.ifra.enrichBatch.useMutation({
    onSuccess: (data) => {
      setEnrichResult(data);
      setIsEnriching(false);
      refetchStats();
    },
    onError: () => {
      setIsEnriching(false);
    }
  });

  const handleEnrichAll = () => {
    setIsEnriching(true);
    setEnrichResult(null);
    enrichBatch.mutate({ limit: 1000 });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'banned':
        return <Badge variant="destructive" className="gap-1"><Ban className="h-3 w-3" /> Interdit</Badge>;
      case 'restricted':
        return <Badge variant="secondary" className="gap-1 bg-orange-500/20 text-orange-400 border-orange-500/30"><AlertTriangle className="h-3 w-3" /> Restreint</Badge>;
      case 'specification_required':
        return <Badge variant="secondary" className="gap-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><FileWarning className="h-3 w-3" /> Spécification requise</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1 bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle2 className="h-3 w-3" /> Non réglementé</Badge>;
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <Breadcrumbs />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Conformité IFRA
          </h1>
          <p className="text-muted-foreground mt-2">
            Réglementation des matières premières selon les standards IFRA (51st Amendment)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleEnrichAll}
            disabled={isEnriching}
            variant="outline"
          >
            {isEnriching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Analyser toutes les molécules
              </>
            )}
          </Button>
          <Button variant="outline" asChild>
            <a href="https://ifrafragrance.org/standards/IFRA_STD_LIB.aspx" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Standards IFRA
            </a>
          </Button>
        </div>
      </div>

      {/* Résultat d'enrichissement */}
      {enrichResult && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-400 mb-4">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Analyse terminée</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total analysé</span>
                <p className="text-xl font-bold">{enrichResult.total}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Enrichies</span>
                <p className="text-xl font-bold text-green-400">{enrichResult.enriched}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Interdites</span>
                <p className="text-xl font-bold text-red-400">{enrichResult.banned}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Restreintes</span>
                <p className="text-xl font-bold text-orange-400">{enrichResult.restricted}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Spéc. requise</span>
                <p className="text-xl font-bold text-yellow-400">{enrichResult.specRequired}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Non réglementées</span>
                <p className="text-xl font-bold">{enrichResult.notRegulated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Molécules analysées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ifraStats?.enriched || 0}</div>
            <Progress 
              value={ifraStats?.percentage || 0} 
              className="mt-2 h-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {ifraStats?.percentage || 0}% de la base ({ifraStats?.total || 0} total)
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-400" />
              Interdites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{ifraStats?.banned || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Substances prohibées par l'IFRA
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              Restreintes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{ifraStats?.restricted || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Limites de concentration applicables
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-yellow-400" />
              Spécification requise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{ifraStats?.specRequired || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Documentation obligatoire
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Base de données IFRA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Base de données IFRA intégrée
          </CardTitle>
          <CardDescription>
            Données réglementaires du 51st Amendment (2023)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-red-500/10 rounded-lg">
              <div className="text-2xl font-bold text-red-400">{ifraDbStats?.totalBanned || 0}</div>
              <div className="text-sm text-muted-foreground">Substances interdites</div>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">{ifraDbStats?.totalRestricted || 0}</div>
              <div className="text-sm text-muted-foreground">Substances restreintes</div>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{ifraDbStats?.totalSpecRequired || 0}</div>
              <div className="text-sm text-muted-foreground">Spécifications requises</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets par catégorie */}
      <Tabs defaultValue="banned" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="banned" className="gap-2">
            <Ban className="h-4 w-4" />
            Interdites ({bannedMolecules?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="restricted" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Restreintes ({restrictedMolecules?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="spec_required" className="gap-2">
            <FileWarning className="h-4 w-4" />
            Spéc. requise ({specRequiredMolecules?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banned" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Ban className="h-5 w-5" />
                Substances interdites
              </CardTitle>
              <CardDescription>
                Ces molécules sont totalement prohibées dans les formulations parfumées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bannedMolecules && bannedMolecules.length > 0 ? (
                <div className="grid gap-3">
                  {bannedMolecules.map((mol) => (
                    <div 
                      key={mol.id} 
                      className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FlaskConical className="h-5 w-5 text-red-400" />
                        <div>
                          <Link href={`/molecule/${mol.id}`}>
                            <span className="font-medium hover:text-primary cursor-pointer">
                              {mol.name}
                            </span>
                          </Link>
                          {mol.casNumber && (
                            <span className="text-xs text-muted-foreground ml-2">
                              CAS: {mol.casNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {mol.ifraData?.reason && (
                          <span className="text-xs text-red-400">
                            {mol.ifraData.reason}
                          </span>
                        )}
                        {getStatusBadge('banned')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucune molécule interdite trouvée dans votre base de données
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restricted" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Substances restreintes
              </CardTitle>
              <CardDescription>
                Ces molécules ont des limites de concentration maximales autorisées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {restrictedMolecules && restrictedMolecules.length > 0 ? (
                <div className="grid gap-3">
                  {restrictedMolecules.map((mol) => (
                    <div 
                      key={mol.id} 
                      className="flex items-center justify-between p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FlaskConical className="h-5 w-5 text-orange-400" />
                        <div>
                          <Link href={`/molecule/${mol.id}`}>
                            <span className="font-medium hover:text-primary cursor-pointer">
                              {mol.name}
                            </span>
                          </Link>
                          {mol.casNumber && (
                            <span className="text-xs text-muted-foreground ml-2">
                              CAS: {mol.casNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {mol.ifraData?.maxPercent !== undefined && (
                          <span className="text-sm font-mono bg-orange-500/20 px-2 py-1 rounded">
                            Max {mol.ifraData.maxPercent}%
                          </span>
                        )}
                        {mol.ifraData?.category && (
                          <span className="text-xs text-muted-foreground">
                            ({mol.ifraData.category})
                          </span>
                        )}
                        {getStatusBadge('restricted')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucune molécule restreinte trouvée dans votre base de données
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spec_required" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <FileWarning className="h-5 w-5" />
                Spécification requise
              </CardTitle>
              <CardDescription>
                Ces molécules nécessitent une documentation spécifique du fournisseur
              </CardDescription>
            </CardHeader>
            <CardContent>
              {specRequiredMolecules && specRequiredMolecules.length > 0 ? (
                <div className="grid gap-3">
                  {specRequiredMolecules.map((mol) => (
                    <div 
                      key={mol.id} 
                      className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FlaskConical className="h-5 w-5 text-yellow-400" />
                        <div>
                          <Link href={`/molecule/${mol.id}`}>
                            <span className="font-medium hover:text-primary cursor-pointer">
                              {mol.name}
                            </span>
                          </Link>
                          {mol.casNumber && (
                            <span className="text-xs text-muted-foreground ml-2">
                              CAS: {mol.casNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {mol.ifraData?.specification && (
                          <span className="text-xs text-yellow-400 max-w-xs truncate">
                            {mol.ifraData.specification}
                          </span>
                        )}
                        {getStatusBadge('specification_required')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucune molécule nécessitant spécification trouvée
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Note informative */}
      <Card className="bg-muted/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">À propos des standards IFRA</p>
              <p>
                L'IFRA (International Fragrance Association) établit des standards de sécurité 
                pour l'utilisation des matières premières en parfumerie. Ces restrictions sont 
                basées sur des études toxicologiques et dermatologiques. Les limites de concentration 
                varient selon la catégorie de produit (leave-on, rinse-off, etc.).
              </p>
              <p className="mt-2">
                <strong>Note :</strong> Cette base de données est fournie à titre informatif. 
                Consultez toujours les standards IFRA officiels pour vos formulations commerciales.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
