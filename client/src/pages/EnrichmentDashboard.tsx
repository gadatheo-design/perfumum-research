import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { 
  ArrowLeft, 
  Loader2, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RefreshCw,
  BarChart3,
  Atom,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/_core/hooks/useAuth";

export default function EnrichmentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 });

  // Récupérer les statistiques d'enrichissement
  const { data: stats, isLoading: isLoadingStats, refetch: refetchStats } = trpc.molecules.getEnrichmentStats.useQuery();
  
  // Récupérer les molécules non enrichies
  const { data: unenrichedMolecules, isLoading: isLoadingUnenriched, refetch: refetchUnenriched } = 
    trpc.molecules.getUnenriched.useQuery({ limit: 50 });

  // Mutation pour enrichir une molécule
  const enrichMutation = trpc.molecules.enrichFromPubChem.useMutation();

  // Fonction pour enrichir par lot
  const handleBatchEnrich = async () => {
    if (!unenrichedMolecules || unenrichedMolecules.length === 0) {
      toast({
        title: "Aucune molécule à enrichir",
        description: "Toutes les molécules ont déjà été traitées.",
      });
      return;
    }

    setIsEnriching(true);
    setEnrichmentProgress({ current: 0, total: unenrichedMolecules.length, success: 0, failed: 0 });

    let success = 0;
    let failed = 0;

    for (let i = 0; i < unenrichedMolecules.length; i++) {
      const molecule = unenrichedMolecules[i];
      
      try {
        const result = await enrichMutation.mutateAsync({ moleculeId: molecule.id });
        if (result.success) {
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
      }

      setEnrichmentProgress({ 
        current: i + 1, 
        total: unenrichedMolecules.length, 
        success, 
        failed 
      });

      // Délai entre les requêtes pour respecter les limites de l'API
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setIsEnriching(false);
    
    toast({
      title: "Enrichissement terminé",
      description: `${success} molécules enrichies, ${failed} échecs`,
    });

    // Rafraîchir les données
    refetchStats();
    refetchUnenriched();
  };

  const enrichedPercent = stats ? Math.round((stats.enriched / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8">
        {/* Navigation */}
        <Link href="/molecules" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          Retour aux molécules
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Tableau de Bord d'Enrichissement
          </h1>
          <p className="text-muted-foreground">
            Gérez l'enrichissement des données moléculaires via PubChem
          </p>
        </div>

        {/* Statistiques globales */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Molécules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-2">
                <Atom className="h-6 w-6 text-primary" />
                {isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Enrichies (PubChem)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
                {isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.enriched || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Non enrichies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-6 w-6" />
                {isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.unenriched || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Taux de couverture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                {isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : `${enrichedPercent}%`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de progression globale */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progression de l'enrichissement</CardTitle>
            <CardDescription>
              {stats?.enriched || 0} molécules sur {stats?.total || 0} ont été enrichies via PubChem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={enrichedPercent} className="h-4 mb-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span className="font-medium text-foreground">{enrichedPercent}%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions d'enrichissement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enrichissement par lot</CardTitle>
            <CardDescription>
              Lancez l'enrichissement automatique des molécules non traitées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!user ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">Connectez-vous pour lancer l'enrichissement</p>
                <Button variant="outline" asChild>
                  <Link href="/login">Se connecter</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={handleBatchEnrich} 
                    disabled={isEnriching || !unenrichedMolecules?.length}
                    className="gap-2"
                  >
                    {isEnriching ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enrichissement en cours...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Lancer l'enrichissement ({unenrichedMolecules?.length || 0} molécules)
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => { refetchStats(); refetchUnenriched(); }}
                    disabled={isEnriching}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Actualiser
                  </Button>
                </div>

                {/* Progression de l'enrichissement en cours */}
                {isEnriching && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        Progression: {enrichmentProgress.current} / {enrichmentProgress.total}
                      </span>
                      <span className="text-sm">
                        <span className="text-green-600">{enrichmentProgress.success} réussies</span>
                        {" • "}
                        <span className="text-red-600">{enrichmentProgress.failed} échecs</span>
                      </span>
                    </div>
                    <Progress 
                      value={(enrichmentProgress.current / enrichmentProgress.total) * 100} 
                      className="h-2" 
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Liste des molécules non enrichies */}
        <Card>
          <CardHeader>
            <CardTitle>Molécules en attente d'enrichissement</CardTitle>
            <CardDescription>
              Les 50 prochaines molécules à traiter
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUnenriched ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : unenrichedMolecules && unenrichedMolecules.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {unenrichedMolecules.map((molecule) => (
                  <Link 
                    key={molecule.id} 
                    href={`/molecule/${molecule.id}`}
                    className="p-2 bg-muted/50 rounded hover:bg-muted transition-colors text-sm truncate"
                  >
                    {molecule.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>Toutes les molécules ont été traitées !</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
