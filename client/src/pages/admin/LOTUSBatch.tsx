import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { toast } from "sonner";
import { Link2, Leaf, Database, Play, Eye, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";

export default function LOTUSBatch() {
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchResults, setBatchResults] = useState<any>(null);
  const [previewResults, setPreviewResults] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats, refetch: refetchStats } = trpc.lotus.getStats.useQuery();

  const { data: plantsData } = trpc.gbif.getPlantsToEnrich.useQuery({
    limit: 100,
    onlyMissing: false,
  });

  const enrichMutation = trpc.lotus.enrichPlantLinks.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.plant} : ${data.created} liaison(s) créée(s)`);
      refetchStats();
      setPreviewResults(null);
    },
    onError: (err) => toast.error(`Erreur : ${err.message}`),
  });

  const previewMutation = trpc.lotus.previewPlant.useQuery(
    { plantId: selectedPlantId! },
    {
      enabled: false,
    }
  );

  const handlePreview = async (plantId: number) => {
    setSelectedPlantId(plantId);
    // Déclencher manuellement via refetch
  };

  const handleEnrich = async (plantId: number, dryRun = false) => {
    enrichMutation.mutate({ plantId, dryRun });
  };

  const handleBatch = async () => {
    setBatchRunning(true);
    setBatchResults(null);
    try {
      const result = await trpc.lotus.enrichBatch.mutate({ limit: 10, onlyWithoutLinks: true });
      setBatchResults(result);
      refetchStats();
      toast.success(`Batch terminé : ${result.totalCreated} liaisons créées sur ${result.processed} plantes`);
    } catch (err: any) {
      toast.error(`Erreur batch : ${err.message}`);
    } finally {
      setBatchRunning(false);
    }
  };

  const filteredPlants = plantsData?.filter(p =>
    !searchQuery ||
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.latinName?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Breadcrumbs items={[
        { label: "Admin", href: "/admin" },
        { label: "LOTUS — Liaisons Plante-Molécule" },
      ]} />

      <main className="flex-1 container py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Link2 className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">LOTUS — Liaisons Plante-Molécule</h1>
            <p className="text-muted-foreground text-sm">
              Enrichissement automatique des liaisons via{" "}
              <a href="https://lotus.naturalproducts.net" target="_blank" rel="noopener noreferrer"
                className="text-emerald-600 hover:underline inline-flex items-center gap-1">
                LOTUS/Wikidata <ExternalLink className="h-3 w-3" />
              </a>
              {" "}— 220 000+ paires espèce-molécule, sans crédits IA
            </p>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-emerald-600">{stats.totalPlants}</div>
                <div className="text-sm text-muted-foreground">Plantes avec nom latin</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-blue-600">{stats.plantsWithLotus}</div>
                <div className="text-sm text-muted-foreground">Plantes enrichies LOTUS</div>
                <Progress value={stats.totalPlants > 0 ? (stats.plantsWithLotus / stats.totalPlants) * 100 : 0} className="mt-2 h-1" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-violet-600">{stats.totalLotusLinks}</div>
                <div className="text-sm text-muted-foreground">Liaisons créées via LOTUS</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Batch global */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Play className="h-4 w-4" />
              Enrichissement batch (10 plantes)
            </CardTitle>
            <CardDescription>
              Traite les 10 prochaines plantes sans liaisons LOTUS. Respecte le rate limit Wikidata (1,2s/requête).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleBatch}
              disabled={batchRunning}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {batchRunning ? "Traitement en cours..." : "Lancer le batch (10 plantes)"}
            </Button>

            {batchResults && (
              <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">✓ {batchResults.totalCreated} liaisons créées</span>
                  <span className="text-blue-600">{batchResults.processed} plantes traitées</span>
                  {batchResults.errors > 0 && <span className="text-red-600">{batchResults.errors} erreurs</span>}
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {batchResults.details?.map((d: any, i: number) => (
                    <div key={i} className="text-xs flex items-center gap-2">
                      {d.error ? (
                        <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                      ) : d.created > 0 ? (
                        <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                      )}
                      <span className="font-medium">{d.plant}</span>
                      {d.error ? (
                        <span className="text-red-500">{d.error}</span>
                      ) : (
                        <span className="text-muted-foreground">{d.created} liaison(s)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Liste des plantes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Enrichissement par plante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text"
              placeholder="Rechercher une plante..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background"
            />

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredPlants.slice(0, 50).map((plant) => (
                <div key={plant.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div>
                    <div className="font-medium text-sm">{plant.name}</div>
                    <div className="text-xs text-muted-foreground italic">{plant.latinName}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEnrich(plant.id, true)}
                      disabled={enrichMutation.isPending}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Dry-run
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEnrich(plant.id, false)}
                      disabled={enrichMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Link2 className="h-3 w-3 mr-1" />
                      Enrichir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
