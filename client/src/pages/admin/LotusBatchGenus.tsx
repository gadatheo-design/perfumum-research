/**
 * LotusBatchGenus.tsx
 * Import en masse des molécules LOTUS pour un genre de plante entier
 * 3 étapes : 1) Sélection du genre  2) Aperçu dry-run  3) Import avec résultats
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  FlaskConical,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Info,
  Play,
  Eye,
  ChevronRight,
  ChevronDown,
  Leaf,
  Atom,
  SkipForward,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface SpeciesRow {
  id: number;
  name: string;
  latinName: string;
  existingMoleculeLinks: number;
}

interface PreviewSpeciesRow {
  plantId: number;
  plantName: string;
  latinName: string;
  totalMolecules: number;
  newMolecules: number;
  existingMolecules: number;
  compounds: Array<{
    wikidataQid: string;
    name: string;
    formula?: string;
    cas?: string;
    inchikey?: string;
  }>;
}

interface ImportSpeciesResult {
  plantId: number;
  plantName: string;
  latinName: string;
  totalMolecules: number;
  created: number;
  linked: number;
  skipped: number;
  errors: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Sélection du genre" },
    { n: 2, label: "Aperçu LOTUS" },
    { n: 3, label: "Résultats" },
  ];
  return (
    <div className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === s.n
                ? "bg-violet-600 text-white"
                : step > s.n
                ? "bg-green-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step > s.n ? "✓" : s.n}
          </div>
          <span className={step === s.n ? "font-medium" : "text-muted-foreground"}>{s.label}</span>
          {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECIES PREVIEW ROW
// ─────────────────────────────────────────────────────────────────────────────

function SpeciesPreviewRow({ row }: { row: PreviewSpeciesRow }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <div>
            <div className="font-medium text-sm italic">{row.latinName}</div>
            <div className="text-xs text-muted-foreground">{row.plantName}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="text-xs">
            {row.totalMolecules} mol.
          </Badge>
          {row.newMolecules > 0 && (
            <Badge className="text-xs bg-green-500/20 text-green-700 border-green-500/30">
              +{row.newMolecules} nouvelles
            </Badge>
          )}
          {row.existingMolecules > 0 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {row.existingMolecules} déjà en base
            </Badge>
          )}
        </div>
      </div>
      {expanded && row.compounds.length > 0 && (
        <div className="border-t border-border/30 bg-muted/20 p-3">
          <div className="text-xs text-muted-foreground mb-2 font-medium">
            Aperçu des {Math.min(row.compounds.length, 10)} premières molécules :
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {row.compounds.slice(0, 10).map((c) => (
              <div
                key={c.wikidataQid}
                className="flex items-center gap-2 text-xs bg-background rounded p-1.5 border border-border/30"
              >
                <Atom className="h-3 w-3 text-violet-400 shrink-0" />
                <span className="truncate font-medium">{c.name}</span>
                {c.formula && (
                  <Badge variant="secondary" className="text-[9px] shrink-0 font-mono">
                    {c.formula}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPORT RESULT ROW
// ─────────────────────────────────────────────────────────────────────────────

function ImportResultRow({ row }: { row: ImportSpeciesResult }) {
  const total = row.created + row.linked + row.skipped + row.errors;
  const success = row.created + row.linked;
  return (
    <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
      <div>
        <div className="font-medium text-sm italic">{row.latinName}</div>
        <div className="text-xs text-muted-foreground">{row.totalMolecules} mol. LOTUS</div>
      </div>
      <div className="flex items-center gap-2 text-xs shrink-0">
        {row.created > 0 && (
          <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
            +{row.created} créées
          </Badge>
        )}
        {row.linked > 0 && (
          <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">
            {row.linked} liées
          </Badge>
        )}
        {row.skipped > 0 && (
          <Badge variant="outline" className="text-muted-foreground">
            {row.skipped} déjà liées
          </Badge>
        )}
        {row.errors > 0 && (
          <Badge className="bg-red-500/20 text-red-700 border-red-500/30">
            {row.errors} erreurs
          </Badge>
        )}
        {total === 0 && (
          <Badge variant="outline" className="text-muted-foreground">
            Aucune mol. LOTUS
          </Badge>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const POPULAR_GENERA = [
  "Nicotiana", "Cannabis", "Citrus", "Lavandula", "Rosa", "Cymbopogon",
  "Boswellia", "Commiphora", "Jasminum", "Ocimum", "Piper", "Bursera",
];

export default function LotusBatchGenus() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [genusInput, setGenusInput] = useState("");
  const [activeGenus, setActiveGenus] = useState("");
  const [selectedSpeciesIds, setSelectedSpeciesIds] = useState<number[]>([]);
  const [defaultRole, setDefaultRole] = useState<"majeur" | "secondaire" | "trace" | "variable">("trace");
  const [limitPerSpecies, setLimitPerSpecies] = useState(30);
  const [previewData, setPreviewData] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);

  // Step 1: get species in DB for genus
  const [genusQuery, setGenusQuery] = useState("");
  const genusSpecies = trpc.lotusEnrichment.getGenusSpecies.useQuery(
    { genus: genusQuery },
    { enabled: genusQuery.length > 1, staleTime: 30_000 }
  );

  // Step 2: preview dry-run
  const previewMutation = trpc.lotusEnrichment.previewGenusImport.useMutation({
    onSuccess: (data) => {
      setPreviewData(data);
      setStep(2);
    },
  });

  // Step 3: batch import
  const importMutation = trpc.lotusEnrichment.batchImportByGenus.useMutation({
    onSuccess: (data) => {
      setImportResult(data);
      setStep(3);
    },
  });

  const handleGenusSearch = () => {
    const g = genusInput.trim();
    if (!g) return;
    setActiveGenus(g);
    setGenusQuery(g);
    setSelectedSpeciesIds([]);
  };

  const handleSelectGenus = (g: string) => {
    setGenusInput(g);
    setActiveGenus(g);
    setGenusQuery(g);
    setSelectedSpeciesIds([]);
  };

  const handleToggleSpecies = (id: number) => {
    setSelectedSpeciesIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const ids = (genusSpecies.data?.species ?? []).map((s) => s.id);
    setSelectedSpeciesIds(ids);
  };

  const handleDeselectAll = () => setSelectedSpeciesIds([]);

  const handlePreview = () => {
    if (!activeGenus) return;
    previewMutation.mutate({ genus: activeGenus, limitPerSpecies });
  };

  const handleImport = () => {
    if (!activeGenus) return;
    importMutation.mutate({
      genus: activeGenus,
      limitPerSpecies,
      defaultRole,
      selectedSpeciesIds: selectedSpeciesIds.length > 0 ? selectedSpeciesIds : undefined,
    });
  };

  const handleReset = () => {
    setStep(1);
    setPreviewData(null);
    setImportResult(null);
    setSelectedSpeciesIds([]);
  };

  const speciesList: SpeciesRow[] = genusSpecies.data?.species ?? [];
  const allSelected = speciesList.length > 0 && selectedSpeciesIds.length === speciesList.length;

  // Progress bar for import
  const importProgress = useMemo(() => {
    if (!importResult) return 0;
    const total = importResult.totalCreated + importResult.totalLinked + importResult.totalSkipped + importResult.totalErrors;
    if (total === 0) return 100;
    return Math.round(((importResult.totalCreated + importResult.totalLinked + importResult.totalSkipped) / total) * 100);
  }, [importResult]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-violet-500" />
            Import LOTUS — Genre entier
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Importez en masse toutes les molécules LOTUS pour toutes les espèces d'un genre botanique
          </p>
        </div>
        <a
          href="/admin/lotus-enrichment"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" /> Retour LOTUS
        </a>
      </div>

      {/* Step indicator */}
      <StepIndicator step={step} />

      {/* ─── STEP 1: Genre selection ─── */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Search bar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4" />
                Sélectionner un genre botanique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Lavandula, Rosa, Nicotiana..."
                  value={genusInput}
                  onChange={(e) => setGenusInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenusSearch()}
                  className="flex-1"
                />
                <Button onClick={handleGenusSearch} disabled={!genusInput.trim()}>
                  <Search className="h-4 w-4 mr-1" /> Chercher
                </Button>
              </div>

              {/* Popular genera */}
              <div>
                <div className="text-xs text-muted-foreground mb-2 font-medium">Genres fréquents dans PERFUMUM :</div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_GENERA.map((g) => (
                    <button
                      key={g}
                      onClick={() => handleSelectGenus(g)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        activeGenus === g
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-border hover:border-violet-400 hover:text-violet-600"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Species list */}
          {genusSpecies.isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement des espèces...
            </div>
          )}

          {speciesList.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    {speciesList.length} espèce{speciesList.length > 1 ? "s" : ""} de{" "}
                    <em>{activeGenus}</em> dans PERFUMUM
                  </CardTitle>
                  <div className="flex gap-2 text-xs">
                    <button onClick={handleSelectAll} className="text-violet-600 hover:underline">
                      Tout sélectionner
                    </button>
                    <span className="text-muted-foreground">·</span>
                    <button onClick={handleDeselectAll} className="text-muted-foreground hover:underline">
                      Tout désélectionner
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {speciesList.map((sp) => (
                  <div
                    key={sp.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      selectedSpeciesIds.includes(sp.id)
                        ? "border-violet-500/50 bg-violet-500/5"
                        : "border-border/50 hover:border-violet-300/50"
                    }`}
                    onClick={() => handleToggleSpecies(sp.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedSpeciesIds.includes(sp.id)}
                        onCheckedChange={() => handleToggleSpecies(sp.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <div className="text-sm font-medium italic">{sp.latinName}</div>
                        <div className="text-xs text-muted-foreground">{sp.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {sp.existingMoleculeLinks > 0 ? (
                        <Badge variant="secondary" className="text-xs">
                          {sp.existingMoleculeLinks} mol. liées
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Aucun lien
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

                {/* Options */}
                <div className="pt-3 border-t border-border/50 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Molécules max par espèce
                    </label>
                    <Select
                      value={String(limitPerSpecies)}
                      onValueChange={(v) => setLimitPerSpecies(Number(v))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 molécules</SelectItem>
                        <SelectItem value="20">20 molécules</SelectItem>
                        <SelectItem value="30">30 molécules</SelectItem>
                        <SelectItem value="50">50 molécules</SelectItem>
                        <SelectItem value="100">100 molécules</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Rôle par défaut
                    </label>
                    <Select
                      value={defaultRole}
                      onValueChange={(v) => setDefaultRole(v as typeof defaultRole)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="majeur">Majeur</SelectItem>
                        <SelectItem value="secondaire">Secondaire</SelectItem>
                        <SelectItem value="trace">Trace</SelectItem>
                        <SelectItem value="variable">Variable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handlePreview}
                    disabled={previewMutation.isPending || speciesList.length === 0}
                  >
                    {previewMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    Aperçu LOTUS (dry-run)
                  </Button>
                  <Button
                    className="flex-1 bg-violet-600 hover:bg-violet-700"
                    onClick={handleImport}
                    disabled={importMutation.isPending || speciesList.length === 0}
                  >
                    {importMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Importer maintenant
                  </Button>
                </div>

                {selectedSpeciesIds.length > 0 && selectedSpeciesIds.length < speciesList.length && (
                  <Alert className="border-blue-500/20 bg-blue-500/5">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-xs">
                      {selectedSpeciesIds.length} espèce{selectedSpeciesIds.length > 1 ? "s" : ""} sélectionnée{selectedSpeciesIds.length > 1 ? "s" : ""} sur {speciesList.length}. Seules ces espèces seront traitées.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {genusSpecies.data && speciesList.length === 0 && (
            <Alert className="border-yellow-500/20 bg-yellow-500/5">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-sm">
                Aucune espèce du genre <em>{activeGenus}</em> trouvée dans PERFUMUM.
              </AlertDescription>
            </Alert>
          )}

          {previewMutation.isError && (
            <Alert className="border-red-500/30 bg-red-500/10">
              <XCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-sm text-red-700 dark:text-red-300">
                {previewMutation.error.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* ─── STEP 2: Preview ─── */}
      {step === 2 && previewData && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Espèces", value: previewData.speciesFound, color: "text-foreground" },
              { label: "Molécules LOTUS", value: previewData.totalMolecules, color: "text-foreground" },
              { label: "Nouvelles", value: previewData.newMolecules, color: "text-green-600" },
              { label: "Déjà en base", value: previewData.existingMolecules, color: "text-muted-foreground" },
            ].map((stat) => (
              <Card key={stat.label} className="p-3 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </Card>
            ))}
          </div>

          <Alert className="border-violet-500/20 bg-violet-500/5">
            <Info className="h-4 w-4 text-violet-600" />
            <AlertDescription className="text-sm">{previewData.message}</AlertDescription>
          </Alert>

          {/* Species preview */}
          <div className="space-y-2">
            {(previewData.preview ?? []).map((row: PreviewSpeciesRow) => (
              <SpeciesPreviewRow key={row.plantId} row={row} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" /> Modifier la sélection
            </Button>
            <Button
              className="flex-1 bg-violet-600 hover:bg-violet-700"
              onClick={handleImport}
              disabled={importMutation.isPending}
            >
              {importMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Confirmer l'import ({previewData.newMolecules} nouvelles)
            </Button>
          </div>

          {importMutation.isPending && (
            <Alert className="border-violet-500/20 bg-violet-500/5">
              <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
              <AlertDescription className="text-sm">
                Import en cours — interrogation de Wikidata SPARQL et écriture en base...
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* ─── STEP 3: Import results ─── */}
      {step === 3 && importResult && (
        <div className="space-y-4">
          {/* Global summary */}
          <Alert className="border-green-500/30 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-300 font-medium">
              {importResult.message}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Espèces traitées", value: importResult.totalProcessed, color: "text-foreground" },
              { label: "Molécules créées", value: importResult.totalCreated, color: "text-green-600" },
              { label: "Liens établis", value: importResult.totalLinked, color: "text-blue-600" },
              { label: "Déjà liées", value: importResult.totalSkipped, color: "text-muted-foreground" },
            ].map((stat) => (
              <Card key={stat.label} className="p-3 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </Card>
            ))}
          </div>

          {importResult.totalErrors > 0 && (
            <Alert className="border-red-500/30 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700 dark:text-red-300 text-sm">
                {importResult.totalErrors} erreur{importResult.totalErrors > 1 ? "s" : ""} lors de l'import. Vérifiez les espèces concernées ci-dessous.
              </AlertDescription>
            </Alert>
          )}

          {/* Per-species results */}
          <div className="space-y-2">
            {(importResult.speciesResults ?? []).map((row: ImportSpeciesResult) => (
              <ImportResultRow key={row.plantId} row={row} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" /> Nouveau genre
            </Button>
            <a href="/admin/lotus-enrichment" className="flex-1">
              <Button variant="outline" className="w-full">
                <FlaskConical className="h-4 w-4 mr-2" /> Retour LOTUS
              </Button>
            </a>
            <a href="/molecules" className="flex-1">
              <Button className="w-full bg-violet-600 hover:bg-violet-700">
                <Atom className="h-4 w-4 mr-2" /> Voir les molécules
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
