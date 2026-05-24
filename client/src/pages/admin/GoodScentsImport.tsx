import React, { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Database, CheckCircle2, AlertTriangle, BarChart3, RefreshCw, FlaskConical } from "lucide-react";

// Taille des batches envoyés au serveur
const BATCH_SIZE = 200;

interface GoodScentsEntry {
  cas: string;
  olfactive_descriptors: string[];
  odor_description?: string;
  strength?: string;
  source?: string;
  source_year?: string;
}

export default function GoodScentsImport() {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importStats, setImportStats] = useState<{
    matched: number;
    imported: number;
    skipped: number;
    totalEntries: number;
  } | null>(null);
  const [replaceExisting, setReplaceExisting] = useState(false);

  // Statistiques de couverture
  const { data: coverageStats, refetch: refetchCoverage } = trpc.goodscents.getCoverageStats.useQuery();

  // Top descripteurs
  const { data: topDescriptors } = trpc.goodscents.getTopDescriptors.useQuery({ limit: 30 });

  // Mutation d'import
  const importMutation = trpc.goodscents.importBatch.useMutation({
    onError: (error) => {
      toast({
        title: "Erreur d'import",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Charger et parser le JSON GoodScents depuis l'URL GitHub raw
  const loadGoodScentsData = async (): Promise<GoodScentsEntry[]> => {
    // Charger behavior.csv depuis Pyrfume GitHub
    const behaviorUrl =
      "https://raw.githubusercontent.com/pyrfume/pyrfume-data/main/goodscents/behavior.csv";
    const stimuliUrl =
      "https://raw.githubusercontent.com/pyrfume/pyrfume-data/main/goodscents/stimuli.csv";

    const [behaviorResp, stimuliResp] = await Promise.all([
      fetch(behaviorUrl),
      fetch(stimuliUrl),
    ]);

    if (!behaviorResp.ok || !stimuliResp.ok) {
      throw new Error("Impossible de charger les données GoodScents depuis GitHub");
    }

    const behaviorText = await behaviorResp.text();
    const stimuliText = await stimuliResp.text();

    // Parser behavior.csv
    const behaviorLines = behaviorText.split("\n").slice(1); // skip header
    const entries: GoodScentsEntry[] = [];

    for (const line of behaviorLines) {
      if (!line.trim()) continue;
      const commaIdx = line.indexOf(",");
      if (commaIdx === -1) continue;
      const cas = line.substring(0, commaIdx).trim();
      const descriptorsRaw = line.substring(commaIdx + 1).trim();
      if (!cas || !descriptorsRaw) continue;

      const descriptors = descriptorsRaw
        .split(";")
        .map((d) => d.trim())
        .filter(Boolean);

      if (descriptors.length > 0) {
        entries.push({ cas, olfactive_descriptors: descriptors });
      }
    }

    return entries;
  };

  const handleImport = useCallback(async () => {
    setIsImporting(true);
    setProgress(0);
    setImportStats(null);

    try {
      toast({
        title: "Chargement des données GoodScents",
        description: "Téléchargement depuis GitHub Pyrfume...",
      });

      const entries = await loadGoodScentsData();

      toast({
        title: `${entries.length} molécules chargées`,
        description: "Import en cours par batches...",
      });

      // Import par batches
      let totalMatched = 0;
      let totalImported = 0;
      let totalSkipped = 0;

      for (let i = 0; i < entries.length; i += BATCH_SIZE) {
        const batch = entries.slice(i, i + BATCH_SIZE);
        const batchInput = batch.map((e) => ({
          cas: e.cas,
          descriptors: e.olfactive_descriptors,
          odorDescription: e.odor_description,
          strength: e.strength,
          source: e.source,
          sourceYear: e.source_year,
        }));

        const result = await importMutation.mutateAsync({
          entries: batchInput,
          replaceExisting: replaceExisting && i === 0, // Supprimer seulement au premier batch
        });

        totalMatched += result.matched;
        totalImported += result.imported;
        totalSkipped += result.skipped;

        const newProgress = Math.round(((i + BATCH_SIZE) / entries.length) * 100);
        setProgress(Math.min(newProgress, 100));
      }

      setImportStats({
        matched: totalMatched,
        imported: totalImported,
        skipped: totalSkipped,
        totalEntries: entries.length,
      });

      toast({
        title: "Import GoodScents terminé !",
        description: `${totalImported} descripteurs importés pour ${totalMatched} molécules`,
      });

      refetchCoverage();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setProgress(0);
    }
  }, [replaceExisting, importMutation, toast, refetchCoverage]);

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FlaskConical className="h-8 w-8 text-emerald-500" />
          Import GoodScents
        </h1>
        <p className="text-muted-foreground mt-2">
          Enrichissement des profils olfactifs depuis{" "}
          <a
            href="https://www.thegoodscentscompany.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline"
          >
            The Good Scents Company
          </a>{" "}
          via{" "}
          <a
            href="https://github.com/pyrfume/pyrfume-data/tree/main/goodscents"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline"
          >
            Pyrfume Data (MIT)
          </a>
          . Correspondance par numéro CAS.
        </p>
      </div>

      {/* Statistiques de couverture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{coverageStats?.totalMolecules ?? "—"}</p>
                <p className="text-sm text-muted-foreground">Molécules PERFUMUM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{coverageStats?.covered ?? "—"}</p>
                <p className="text-sm text-muted-foreground">Couvertes par GoodScents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {coverageStats?.coveragePercent ?? "—"}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {coverageStats?.totalDescriptors ?? "—"} descripteurs importés
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression */}
      {isImporting && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
              <span className="font-medium">Import en cours... {progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>
      )}

      {/* Résultats d'import */}
      {importStats && (
        <Alert className="mb-6 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div>
                <p className="text-2xl font-bold text-emerald-700">{importStats.totalEntries}</p>
                <p className="text-xs text-muted-foreground">Entrées GoodScents</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{importStats.matched}</p>
                <p className="text-xs text-muted-foreground">Molécules matchées (CAS)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">{importStats.imported}</p>
                <p className="text-xs text-muted-foreground">Descripteurs importés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{importStats.skipped}</p>
                <p className="text-xs text-muted-foreground">CAS non trouvés</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Panneau d'import */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Lancer l'import
          </CardTitle>
          <CardDescription>
            Télécharge automatiquement{" "}
            <code className="text-xs bg-muted px-1 rounded">behavior.csv</code> depuis GitHub
            Pyrfume et importe les descripteurs olfactifs pour les molécules PERFUMUM dont le
            numéro CAS correspond.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm">
              <strong>Source :</strong> ~4 622 molécules avec 668 descripteurs olfactifs uniques
              (fruity, green, sweet, floral, woody...). La correspondance se fait par numéro CAS.
              Les molécules PERFUMUM sans CAS ne seront pas enrichies.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="replace-existing"
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="replace-existing" className="text-sm text-muted-foreground">
              Remplacer les données GoodScents existantes (si déjà importées)
            </label>
          </div>

          <Button
            onClick={handleImport}
            disabled={isImporting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Import en cours...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Importer les profils GoodScents
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Top descripteurs */}
      {topDescriptors && topDescriptors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top descripteurs olfactifs dans PERFUMUM
            </CardTitle>
            <CardDescription>
              Descripteurs GoodScents présents dans les molécules PERFUMUM (par nombre de molécules)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topDescriptors.map((d) => (
                <Badge
                  key={d.descriptor}
                  variant="secondary"
                  className="text-sm px-3 py-1"
                >
                  {d.descriptor}
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    {d.count}
                  </span>
                </Badge>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => refetchCoverage()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
