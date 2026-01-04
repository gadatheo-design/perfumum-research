import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Beaker,
  ExternalLink,
  Play,
  Pause
} from "lucide-react";
import { Link } from "wouter";

export default function EnrichissementPubChem() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentResults, setEnrichmentResults] = useState<Array<{
    moleculeId: number;
    moleculeName: string;
    success: boolean;
    casNumber?: string;
    iupacName?: string;
    error?: string;
  }>>([]);

  // Récupérer les statistiques d'enrichissement
  const { data: stats, refetch: refetchStats } = trpc.pubchem.getEnrichmentStats.useQuery();
  
  // Récupérer les molécules à enrichir
  const { data: moleculesToEnrich, refetch: refetchMolecules } = trpc.pubchem.getMoleculesToEnrich.useQuery({
    limit: 100,
    offset: 0,
  });

  // Mutation pour enrichir par lot
  const enrichBatch = trpc.pubchem.enrichBatch.useMutation({
    onSuccess: (data) => {
      setEnrichmentResults(prev => [...prev, ...data.results]);
      refetchStats();
      refetchMolecules();
    },
  });

  // Mutation pour enrichir une seule molécule
  const enrichSingle = trpc.pubchem.enrichMolecule.useMutation({
    onSuccess: () => {
      refetchStats();
      refetchMolecules();
    },
  });

  const handleSelectAll = () => {
    if (moleculesToEnrich?.molecules) {
      if (selectedIds.length === moleculesToEnrich.molecules.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(moleculesToEnrich.molecules.map(m => m.id));
      }
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleEnrichSelected = async () => {
    if (selectedIds.length === 0) return;
    
    setIsEnriching(true);
    setEnrichmentResults([]);
    
    try {
      // Enrichir par lots de 10 pour éviter les timeouts
      const batchSize = 10;
      for (let i = 0; i < selectedIds.length; i += batchSize) {
        const batch = selectedIds.slice(i, i + batchSize);
        await enrichBatch.mutateAsync({ moleculeIds: batch });
      }
    } finally {
      setIsEnriching(false);
      setSelectedIds([]);
    }
  };

  const handleEnrichSingle = async (moleculeId: number) => {
    await enrichSingle.mutateAsync({ moleculeId });
  };

  const completeness = stats?.completeness || 0;

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <Database className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Enrichissement PubChem</h1>
          <p className="text-muted-foreground">
            Enrichir les molécules avec les données CAS/IUPAC depuis la base PubChem (NIH)
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Molécules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avec CAS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.withCAS || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.missingCAS || 0} manquants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avec IUPAC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.withIUPAC || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.missingIUPAC || 0} manquants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Complétude
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completeness}%</div>
            <Progress value={completeness} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Détails de l'enrichissement</CardTitle>
          <CardDescription>
            État actuel des données scientifiques dans la base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Classe chimique</Badge>
              <span className="font-medium">{stats?.withChemicalClass || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Masse moléculaire</Badge>
              <span className="font-medium">{stats?.withMolecularWeight || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Point d'ébullition</Badge>
              <span className="font-medium">{stats?.withBoilingPoint || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Réf. PubChem</Badge>
              <span className="font-medium">{stats?.withPubChemRef || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Liste des molécules à enrichir */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Molécules à enrichir</CardTitle>
                <CardDescription>
                  {moleculesToEnrich?.total || 0} molécules sans données CAS/IUPAC
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedIds.length === moleculesToEnrich?.molecules.length 
                    ? "Désélectionner tout" 
                    : "Sélectionner tout"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleEnrichSelected}
                  disabled={selectedIds.length === 0 || isEnriching}
                >
                  {isEnriching ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Enrichissement...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Enrichir ({selectedIds.length})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {moleculesToEnrich?.molecules.map((molecule) => (
                  <div
                    key={molecule.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedIds.includes(molecule.id)}
                        onCheckedChange={() => handleToggleSelect(molecule.id)}
                      />
                      <div>
                        <Link href={`/molecules/${molecule.id}`}>
                          <span className="font-medium hover:underline cursor-pointer">
                            {molecule.name}
                          </span>
                        </Link>
                        {molecule.chemicalFormula && (
                          <p className="text-xs text-muted-foreground">
                            {molecule.chemicalFormula}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEnrichSingle(molecule.id)}
                      disabled={enrichSingle.isPending}
                    >
                      <Beaker className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Résultats de l'enrichissement */}
        <Card>
          <CardHeader>
            <CardTitle>Résultats de l'enrichissement</CardTitle>
            <CardDescription>
              Historique des enrichissements effectués
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {enrichmentResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
                  <p>Aucun enrichissement effectué</p>
                  <p className="text-sm">Sélectionnez des molécules et lancez l'enrichissement</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {enrichmentResults.map((result, index) => (
                    <div
                      key={`${result.moleculeId}-${index}`}
                      className={`p-3 rounded-lg border ${
                        result.success 
                          ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950" 
                          : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">{result.moleculeName}</span>
                        </div>
                        {result.success && result.casNumber && (
                          <a
                            href={`https://pubchem.ncbi.nlm.nih.gov/#query=${result.casNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            PubChem <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      {result.success ? (
                        <div className="mt-2 text-sm">
                          {result.casNumber && (
                            <p><span className="text-muted-foreground">CAS:</span> {result.casNumber}</p>
                          )}
                          {result.iupacName && (
                            <p className="truncate"><span className="text-muted-foreground">IUPAC:</span> {result.iupacName}</p>
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-red-600">{result.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Information sur PubChem */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>À propos de PubChem</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            PubChem est une base de données chimique gratuite maintenue par le National Center for 
            Biotechnology Information (NCBI), qui fait partie de la National Library of Medicine (NLM) 
            des National Institutes of Health (NIH) des États-Unis.
          </p>
          <div className="flex gap-4">
            <a
              href="https://pubchem.ncbi.nlm.nih.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Visiter PubChem <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Documentation API <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
