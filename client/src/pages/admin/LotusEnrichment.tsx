/**
 * LotusEnrichment.tsx
 * Page admin pour l'enrichissement LOTUS (Natural Products Online)
 * Permet de rechercher les molécules d'une plante via Wikidata SPARQL (P703)
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  FlaskConical,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Atom,
  ArrowLeftRight,
  Info,
  Download,
  Database,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface LotusCompound {
  wikidataQid: string;
  name: string;
  inchikey?: string;
  cas?: string;
  smiles?: string;
  formula?: string;
  mass?: string;
  iupacName?: string;
  pubchemCid?: string;
}

interface MolecularProfile {
  found: boolean;
  scientificName: string;
  total: number;
  withStructure: number;
  nameOnly: number;
  compounds: LotusCompound[];
  summary: {
    withInChIKey: number;
    withCAS: number;
    withSMILES: number;
    withFormula: number;
    withPubChem: number;
  };
  source: string;
  lotusUrl: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOLECULE CARD
// ─────────────────────────────────────────────────────────────────────────────

function MoleculeCard({
  compound,
  plantName,
  onImport,
  isImporting,
}: {
  compound: LotusCompound;
  plantName: string;
  onImport: (compound: LotusCompound) => void;
  isImporting: boolean;
}) {
  return (
    <div className="border border-border/50 rounded-lg p-3 hover:border-violet-500/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{compound.name}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {compound.formula && (
              <Badge variant="secondary" className="text-[10px] font-mono">{compound.formula}</Badge>
            )}
            {compound.cas && (
              <Badge variant="outline" className="text-[10px]">CAS: {compound.cas}</Badge>
            )}
            {compound.inchikey && (
              <Badge variant="outline" className="text-[10px] font-mono truncate max-w-[140px]">
                {compound.inchikey.slice(0, 14)}…
              </Badge>
            )}
          </div>
          {compound.mass && (
            <div className="text-xs text-muted-foreground mt-1">
              Masse : {parseFloat(compound.mass).toFixed(2)} g/mol
            </div>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <a
            href={`https://www.wikidata.org/wiki/${compound.wikidataQid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
          {compound.pubchemCid && (
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${compound.pubchemCid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Database className="h-3 w-3" />
              </Button>
            </a>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onImport(compound)}
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Download className="h-3 w-3 mr-1" />
            )}
            Noter
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPORT RESULT
// ─────────────────────────────────────────────────────────────────────────────

function ImportResult({ result }: { result: any }) {
  if (!result) return null;
  if (result.success) {
    return (
      <Alert className="border-green-500/30 bg-green-500/10 mt-3">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-700 dark:text-green-300">
          <strong>{result.message}</strong>
          {result.nextStep && (
            <div className="mt-1 text-xs opacity-80">→ {result.nextStep}</div>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  if (result.alreadyExists) {
    return (
      <Alert className="border-blue-500/30 bg-blue-500/10 mt-3">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          {result.message}
          {result.existingMolecules && (
            <ul className="mt-1 text-xs list-disc list-inside">
              {result.existingMolecules.map((m: any) => (
                <li key={m.id}>{m.name}</li>
              ))}
            </ul>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert className="border-red-500/30 bg-red-500/10 mt-3">
      <XCircle className="h-4 w-4 text-red-500" />
      <AlertDescription className="text-red-700 dark:text-red-300">
        {result.message}
        {result.matches && result.matches.length > 0 && (
          <ul className="mt-1 text-xs list-disc list-inside">
            {result.matches.map((m: any) => (
              <li key={m.id}>{m.name} — {m.latinName}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function LotusEnrichment() {
  const [plantQuery, setPlantQuery] = useState("");
  const [moleculeQuery, setMoleculeQuery] = useState("");
  const [activeTab, setActiveTab] = useState("plant");
  const [profile, setProfile] = useState<MolecularProfile | null>(null);
  const [reverseResult, setReverseResult] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [importingQid, setImportingQid] = useState<string | null>(null);

  // API status
  const { data: stats } = trpc.lotusEnrichment.getStats.useQuery(undefined, {
    staleTime: 60_000,
  });

  // Molecular profile mutation
  const getMolProfile = trpc.lotusEnrichment.getMolecularProfile.useMutation({
    onSuccess: (data) => {
      setProfile(data as MolecularProfile);
      setImportResult(null);
    },
  });

  // Reverse lookup mutation
  const getPlantsByMol = trpc.lotusEnrichment.getPlantsByMolecule.useMutation({
    onSuccess: (data) => {
      setReverseResult(data);
    },
  });

  // Import molecule link mutation
  const importLink = trpc.lotusEnrichment.importMoleculeLink.useMutation({
    onSuccess: (data) => {
      setImportResult(data);
      setImportingQid(null);
    },
    onError: (err) => {
      setImportResult({ success: false, message: err.message });
      setImportingQid(null);
    },
  });

  const handlePlantSearch = () => {
    if (!plantQuery.trim()) return;
    setProfile(null);
    setImportResult(null);
    getMolProfile.mutate({ scientificName: plantQuery.trim() });
  };

  const handleMoleculeSearch = () => {
    if (!moleculeQuery.trim()) return;
    setReverseResult(null);
    getPlantsByMol.mutate({ moleculeName: moleculeQuery.trim() });
  };

  const handleImport = (compound: LotusCompound) => {
    if (!plantQuery.trim()) return;
    setImportingQid(compound.wikidataQid);
    importLink.mutate({
      plantLatinName: plantQuery.trim(),
      moleculeName: compound.name,
      wikidataQid: compound.wikidataQid,
      inchikey: compound.inchikey,
      cas: compound.cas,
      smiles: compound.smiles,
      formula: compound.formula,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-violet-500" />
            Enrichissement LOTUS
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Natural Products Online — paires plante-molécule via Wikidata SPARQL (P703)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {stats?.status === "ok" ? (
            <Badge variant="outline" className="border-green-500/50 text-green-600 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" /> LOTUS en ligne
            </Badge>
          ) : (
            <Badge variant="outline" className="border-red-500/50 text-red-600 text-xs">
              <XCircle className="h-3 w-3 mr-1" /> LOTUS hors ligne
            </Badge>
          )}
          <a
            href="https://lotus.naturalproducts.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            lotus.naturalproducts.net <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Info banner */}
      <Alert className="border-violet-500/20 bg-violet-500/5">
        <Info className="h-4 w-4 text-violet-600" />
        <AlertDescription className="text-sm">
          LOTUS recense plus de <strong>220 000 paires plante-molécule</strong> documentées dans la littérature scientifique.
          Les données sont stockées dans Wikidata via la propriété <code className="text-xs bg-muted px-1 rounded">P703</code> (found in taxon).
          Recherchez une plante pour voir ses molécules, ou une molécule pour voir ses plantes sources.
        </AlertDescription>
      </Alert>

      {/* Search tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="plant">
            <Atom className="h-3 w-3 mr-1" /> Molécules d'une plante
          </TabsTrigger>
          <TabsTrigger value="molecule">
            <ArrowLeftRight className="h-3 w-3 mr-1" /> Plantes d'une molécule
          </TabsTrigger>
        </TabsList>

        {/* Plant → Molecules */}
        <TabsContent value="plant" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profil moléculaire d'une plante</CardTitle>
              <CardDescription>Entrez le nom scientifique latin pour voir toutes ses molécules documentées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex : Rosa damascena, Nicotiana tabacum..."
                  value={plantQuery}
                  onChange={(e) => setPlantQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePlantSearch()}
                  className="flex-1"
                />
                <Button onClick={handlePlantSearch} disabled={getMolProfile.isPending || !plantQuery.trim()}>
                  {getMolProfile.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Rechercher
                </Button>
              </div>
            </CardContent>
          </Card>

          {getMolProfile.isPending && (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-3" />
              Interrogation de Wikidata SPARQL…
            </div>
          )}

          {profile && !getMolProfile.isPending && (
            <div className="space-y-4">
              {!profile.found ? (
                <Alert className="border-yellow-500/30 bg-yellow-500/10">
                  <XCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    Aucune molécule trouvée pour <strong>"{profile.scientificName}"</strong> dans LOTUS/Wikidata.
                    Vérifiez l'orthographe du nom scientifique.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {/* Summary */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold italic">{profile.scientificName}</h2>
                      <p className="text-xs text-muted-foreground">
                        {profile.total} molécule{profile.total > 1 ? "s" : ""} documentée{profile.total > 1 ? "s" : ""} dans LOTUS
                      </p>
                    </div>
                    <a href={profile.lotusUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" /> LOTUS
                      </Button>
                    </a>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[
                      { label: "Total", value: profile.total, color: "text-violet-600" },
                      { label: "Avec InChIKey", value: profile.summary.withInChIKey, color: "text-blue-600" },
                      { label: "Avec CAS", value: profile.summary.withCAS, color: "text-green-600" },
                      { label: "Avec SMILES", value: profile.summary.withSMILES, color: "text-orange-600" },
                      { label: "Avec PubChem", value: profile.summary.withPubChem, color: "text-pink-600" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className={`text-2xl font-bold ${color}`}>{value}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Molecule list */}
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {profile.compounds.map((compound) => (
                      <MoleculeCard
                        key={compound.wikidataQid}
                        compound={compound}
                        plantName={profile.scientificName}
                        onImport={handleImport}
                        isImporting={importingQid === compound.wikidataQid}
                      />
                    ))}
                  </div>

                  <ImportResult result={importResult} />
                </>
              )}
            </div>
          )}
        </TabsContent>

        {/* Molecule → Plants */}
        <TabsContent value="molecule" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Plantes sources d'une molécule</CardTitle>
              <CardDescription>Entrez le nom d'une molécule pour voir toutes les plantes qui la produisent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex : geraniol, linalool, nicotine, eugenol..."
                  value={moleculeQuery}
                  onChange={(e) => setMoleculeQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMoleculeSearch()}
                  className="flex-1"
                />
                <Button onClick={handleMoleculeSearch} disabled={getPlantsByMol.isPending || !moleculeQuery.trim()}>
                  {getPlantsByMol.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Rechercher
                </Button>
              </div>
            </CardContent>
          </Card>

          {getPlantsByMol.isPending && (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-3" />
              Interrogation de Wikidata SPARQL…
            </div>
          )}

          {reverseResult && !getPlantsByMol.isPending && (
            <div className="space-y-3">
              {!reverseResult.found ? (
                <Alert className="border-yellow-500/30 bg-yellow-500/10">
                  <XCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    Aucune plante trouvée pour la molécule <strong>"{reverseResult.moleculeName}"</strong>.
                    Essayez le nom anglais ou le nom IUPAC.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">{reverseResult.moleculeName}</h2>
                    <p className="text-xs text-muted-foreground">
                      {reverseResult.total} plante{reverseResult.total > 1 ? "s" : ""} source{reverseResult.total > 1 ? "s" : ""} documentée{reverseResult.total > 1 ? "s" : ""} dans LOTUS
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {reverseResult.plants.map((plant: any) => (
                      <div
                        key={plant.wikidataQid}
                        className="border border-border/50 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-sm italic">{plant.scientificName}</div>
                          {plant.taxonRank && (
                            <Badge variant="secondary" className="text-[10px] mt-0.5">{plant.taxonRank}</Badge>
                          )}
                        </div>
                        <a
                          href={`https://www.wikidata.org/wiki/${plant.wikidataQid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
