/**
 * LotusPlantLinker.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interface de liaison LOTUS → fiches plantes existantes
 *
 * Workflow :
 *  1. Saisir un nom scientifique → récupérer les molécules LOTUS (Wikidata P703)
 *  2. Sélectionner une plante dans la base PERFUMUM
 *  3. Choisir les molécules à importer
 *  4. Cliquer "Importer" → crée la molécule si elle n'existe pas + lien plant_molecules
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import {
  ArrowLeft,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Leaf,
  FlaskConical,
  Link2,
  ExternalLink,
  Info,
  Zap,
  Database,
  ChevronRight,
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

interface ImportStatus {
  moleculeName: string;
  status: "pending" | "importing" | "success" | "error" | "already_linked";
  message?: string;
  moleculeAction?: "found" | "created";
}

// ─────────────────────────────────────────────────────────────────────────────
// MOLECULE CARD
// ─────────────────────────────────────────────────────────────────────────────

function MoleculeCard({
  compound,
  selected,
  onToggle,
  importStatus,
}: {
  compound: LotusCompound;
  selected: boolean;
  onToggle: () => void;
  importStatus?: ImportStatus;
}) {
  const hasStructure = !!(compound.inchikey || compound.smiles);

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
        selected
          ? "border-emerald-500/50 bg-emerald-500/5"
          : "border-border hover:border-border/80 hover:bg-muted/30"
      } ${importStatus?.status === "success" ? "opacity-60" : ""}`}
      onClick={onToggle}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={onToggle}
        className="mt-0.5 shrink-0"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm truncate">{compound.name}</span>
          {hasStructure && (
            <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-600 shrink-0">
              Structure 3D
            </Badge>
          )}
          {compound.cas && (
            <Badge variant="outline" className="text-xs shrink-0">
              CAS {compound.cas}
            </Badge>
          )}
          {importStatus && (
            <div className="ml-auto shrink-0">
              {importStatus.status === "importing" && (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              )}
              {importStatus.status === "success" && (
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              )}
              {importStatus.status === "error" && (
                <XCircle className="h-3 w-3 text-red-500" />
              )}
              {importStatus.status === "already_linked" && (
                <Link2 className="h-3 w-3 text-blue-500" />
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
          <span className="font-mono">{compound.wikidataQid}</span>
          {compound.formula && <span>{compound.formula}</span>}
          {compound.mass && <span>~{parseFloat(compound.mass).toFixed(1)} Da</span>}
        </div>
        {importStatus?.message && (
          <p className={`text-xs mt-1 ${
            importStatus.status === "success" ? "text-emerald-600" :
            importStatus.status === "already_linked" ? "text-blue-600" :
            "text-red-600"
          }`}>
            {importStatus.message}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function LotusPlantLinker() {
  // Step 1: LOTUS search
  const [searchQuery, setSearchQuery] = useState("");
  const [compounds, setCompounds] = useState<LotusCompound[]>([]);
  const [searchedName, setSearchedName] = useState("");

  // Step 2: Plant selection
  const [plantSearch, setPlantSearch] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<{ id: number; name: string; latinName: string } | null>(null);

  // Step 3: Molecule selection
  const [selectedMolecules, setSelectedMolecules] = useState<Set<string>>(new Set());
  const [defaultRole, setDefaultRole] = useState<"majeur" | "secondaire" | "trace" | "variable">("trace");

  // Import state
  const [importStatuses, setImportStatuses] = useState<Record<string, ImportStatus>>({});
  const [isImporting, setIsImporting] = useState(false);

  // ── tRPC hooks ──────────────────────────────────────────────────────────────

  const getMolecules = trpc.lotusEnrichment.getMoleculesByPlant.useMutation({
    onSuccess: (data) => {
      setCompounds(data.compounds || []);
      setSearchedName(data.scientificName);
      setSelectedMolecules(new Set());
      setImportStatuses({});
    },
  });

  const plantSearchQuery = trpc.plantStatistics.search.useQuery(
    { query: plantSearch },
    { enabled: plantSearch.length >= 2 }
  );

  const importMutation = trpc.lotusEnrichment.importLotusToPlant.useMutation();

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    getMolecules.mutate({ scientificName: searchQuery.trim(), limit: 50 });
  };

  const toggleMolecule = (qid: string) => {
    setSelectedMolecules((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedMolecules(new Set(compounds.map((c) => c.wikidataQid)));
  };

  const selectNone = () => setSelectedMolecules(new Set());

  const handleImport = async () => {
    if (!selectedPlant || selectedMolecules.size === 0) return;

    setIsImporting(true);
    const toImport = compounds.filter((c) => selectedMolecules.has(c.wikidataQid));

    for (const compound of toImport) {
      setImportStatuses((prev) => ({
        ...prev,
        [compound.wikidataQid]: { moleculeName: compound.name, status: "importing" },
      }));

      try {
        const result = await importMutation.mutateAsync({
          plantId: selectedPlant.id,
          moleculeName: compound.name,
          wikidataQid: compound.wikidataQid,
          inchikey: compound.inchikey,
          cas: compound.cas,
          smiles: compound.smiles,
          formula: compound.formula,
          mass: compound.mass,
          iupacName: compound.iupacName,
          pubchemCid: compound.pubchemCid,
          role: defaultRole,
        });

        if (result.success) {
          setImportStatuses((prev) => ({
            ...prev,
            [compound.wikidataQid]: {
              moleculeName: compound.name,
              status: "success",
              message: result.message,
              moleculeAction: result.moleculeAction,
            },
          }));
        } else if (result.alreadyLinked) {
          setImportStatuses((prev) => ({
            ...prev,
            [compound.wikidataQid]: {
              moleculeName: compound.name,
              status: "already_linked",
              message: result.message,
            },
          }));
        } else {
          setImportStatuses((prev) => ({
            ...prev,
            [compound.wikidataQid]: {
              moleculeName: compound.name,
              status: "error",
              message: result.message,
            },
          }));
        }
      } catch (err: any) {
        setImportStatuses((prev) => ({
          ...prev,
          [compound.wikidataQid]: {
            moleculeName: compound.name,
            status: "error",
            message: err.message || "Erreur inconnue",
          },
        }));
      }

      // Polite delay
      await new Promise((r) => setTimeout(r, 150));
    }

    setIsImporting(false);
  };

  // ── Computed ────────────────────────────────────────────────────────────────

  const importSummary = useMemo(() => {
    const statuses = Object.values(importStatuses);
    return {
      success: statuses.filter((s) => s.status === "success").length,
      created: statuses.filter((s) => s.status === "success" && s.moleculeAction === "created").length,
      linked: statuses.filter((s) => s.status === "success" && s.moleculeAction === "found").length,
      alreadyLinked: statuses.filter((s) => s.status === "already_linked").length,
      errors: statuses.filter((s) => s.status === "error").length,
    };
  }, [importStatuses]);

  const hasImportResults = Object.keys(importStatuses).length > 0 && !isImporting;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin/lotus-enrichment">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-violet-500" />
              Liaison LOTUS → Plantes
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Importez les molécules LOTUS/Wikidata directement dans les fiches de plantes PERFUMUM
            </p>
          </div>
          <a
            href="https://lotus.naturalproducts.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0"
          >
            lotus.naturalproducts.net <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Info banner */}
        <Alert className="border-violet-500/20 bg-violet-500/5">
          <Info className="h-4 w-4 text-violet-600" />
          <AlertDescription className="text-sm">
            LOTUS documente <strong>plus de 300 000 paires plante-molécule</strong> via Wikidata (propriété P703).
            Chaque import crée la molécule dans la base si elle n'existe pas, puis établit le lien <em>plant_molecules</em>.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Colonne gauche : Paramètres ────────────────────────────────── */}
          <div className="space-y-4">

            {/* Étape 1 : Recherche LOTUS */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold shrink-0">1</span>
                  Recherche LOTUS
                </CardTitle>
                <CardDescription className="text-xs">
                  Entrez le nom scientifique pour récupérer les molécules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="ex: Rosa damascena"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={getMolecules.isPending || !searchQuery.trim()}
                    size="sm"
                    className="shrink-0"
                  >
                    {getMolecules.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {getMolecules.isError && (
                  <p className="text-xs text-red-500">{getMolecules.error.message}</p>
                )}
                {compounds.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FlaskConical className="h-3 w-3 text-violet-500" />
                    <span><strong>{compounds.length}</strong> molécules trouvées pour <em>{searchedName}</em></span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Étape 2 : Sélection de la plante */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold shrink-0">2</span>
                  Plante cible
                </CardTitle>
                <CardDescription className="text-xs">
                  Sélectionnez la plante dans PERFUMUM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Rechercher une plante..."
                  value={plantSearch}
                  onChange={(e) => {
                    setPlantSearch(e.target.value);
                    setSelectedPlant(null);
                  }}
                  className="text-sm"
                />
                {plantSearchQuery.data && plantSearchQuery.data.length > 0 && !selectedPlant && (
                  <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                    {plantSearchQuery.data.map((p: any) => (
                      <button
                        key={p.id}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          setSelectedPlant({ id: p.id, name: p.name, latinName: p.latinName });
                          setPlantSearch(p.name);
                        }}
                      >
                        <div className="font-medium">{p.name}</div>
                        <div className="text-muted-foreground italic">{p.latinName}</div>
                      </button>
                    ))}
                  </div>
                )}
                {selectedPlant && (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/30">
                    <Leaf className="h-3 w-3 text-emerald-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{selectedPlant.name}</div>
                      <div className="text-xs text-muted-foreground italic truncate">{selectedPlant.latinName}</div>
                    </div>
                    <button
                      onClick={() => { setSelectedPlant(null); setPlantSearch(""); }}
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <XCircle className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Étape 3 : Options d'import */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold shrink-0">3</span>
                  Options d'import
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Rôle par défaut</Label>
                  <Select value={defaultRole} onValueChange={(v: any) => setDefaultRole(v)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="majeur">Majeur (&gt;10%)</SelectItem>
                      <SelectItem value="secondaire">Secondaire (1–10%)</SelectItem>
                      <SelectItem value="trace">Trace (&lt;1%)</SelectItem>
                      <SelectItem value="variable">Variable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <Button
                  onClick={handleImport}
                  disabled={!selectedPlant || selectedMolecules.size === 0 || isImporting}
                  className="w-full gap-2 bg-violet-600 hover:bg-violet-700"
                  size="sm"
                >
                  {isImporting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Import en cours...</>
                  ) : (
                    <><Zap className="h-4 w-4" /> Importer {selectedMolecules.size} molécule{selectedMolecules.size > 1 ? "s" : ""}</>
                  )}
                </Button>
                {!selectedPlant && (
                  <p className="text-xs text-muted-foreground text-center">Sélectionnez une plante cible</p>
                )}
                {selectedPlant && selectedMolecules.size === 0 && (
                  <p className="text-xs text-muted-foreground text-center">Sélectionnez au moins une molécule</p>
                )}
              </CardContent>
            </Card>

            {/* Résumé d'import */}
            {hasImportResults && (
              <Card className="border-violet-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4 text-violet-500" />
                    Résumé
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-xs">
                  {importSummary.created > 0 && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{importSummary.created} molécule{importSummary.created > 1 ? "s" : ""} créée{importSummary.created > 1 ? "s" : ""}</span>
                    </div>
                  )}
                  {importSummary.linked > 0 && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Link2 className="h-3 w-3" />
                      <span>{importSummary.linked} lien{importSummary.linked > 1 ? "s" : ""} établi{importSummary.linked > 1 ? "s" : ""}</span>
                    </div>
                  )}
                  {importSummary.alreadyLinked > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Link2 className="h-3 w-3" />
                      <span>{importSummary.alreadyLinked} déjà lié{importSummary.alreadyLinked > 1 ? "s" : ""}</span>
                    </div>
                  )}
                  {importSummary.errors > 0 && (
                    <div className="flex items-center gap-2 text-red-500">
                      <XCircle className="h-3 w-3" />
                      <span>{importSummary.errors} erreur{importSummary.errors > 1 ? "s" : ""}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Colonne droite : Liste des molécules ───────────────────────── */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-violet-500" />
                    Molécules LOTUS
                    {compounds.length > 0 && (
                      <Badge variant="secondary" className="text-xs">{compounds.length}</Badge>
                    )}
                  </CardTitle>
                  {compounds.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={selectAll}
                        className="text-xs text-violet-600 hover:underline"
                      >
                        Tout sélectionner
                      </button>
                      <span className="text-muted-foreground text-xs">·</span>
                      <button
                        onClick={selectNone}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Aucun
                      </button>
                      {selectedMolecules.size > 0 && (
                        <>
                          <span className="text-muted-foreground text-xs">·</span>
                          <span className="text-xs font-medium text-violet-600">
                            {selectedMolecules.size} sélectionnée{selectedMolecules.size > 1 ? "s" : ""}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {getMolecules.isPending && (
                  <div className="flex items-center justify-center py-16 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Interrogation de LOTUS/Wikidata...
                  </div>
                )}
                {!getMolecules.isPending && compounds.length === 0 && !getMolecules.isError && (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-sm gap-3">
                    <FlaskConical className="h-10 w-10 opacity-20" />
                    <p>Entrez un nom scientifique pour récupérer les molécules LOTUS</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["Rosa damascena", "Lavandula angustifolia", "Nicotiana tabacum", "Cannabis sativa"].map((name) => (
                        <button
                          key={name}
                          onClick={() => { setSearchQuery(name); }}
                          className="text-xs px-2 py-1 rounded-full border border-border hover:border-violet-500/50 hover:text-violet-600 transition-colors"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {getMolecules.isError && (
                  <div className="flex items-center justify-center py-16 text-red-500 text-sm gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Erreur : {getMolecules.error.message}</span>
                  </div>
                )}
                {compounds.length > 0 && (
                  <ScrollArea className="h-[520px] pr-2">
                    <div className="space-y-2">
                      {compounds.map((compound) => (
                        <MoleculeCard
                          key={compound.wikidataQid}
                          compound={compound}
                          selected={selectedMolecules.has(compound.wikidataQid)}
                          onToggle={() => toggleMolecule(compound.wikidataQid)}
                          importStatus={importStatuses[compound.wikidataQid]}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Liens utiles */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link href="/admin/lotus-enrichment" className="flex items-center gap-1 hover:text-foreground">
            <ChevronRight className="h-3 w-3" /> Retour à LOTUS Enrichissement
          </Link>
          <Link href="/admin/plant-molecules" className="flex items-center gap-1 hover:text-foreground">
            <ChevronRight className="h-3 w-3" /> Gérer les liaisons plante-molécule
          </Link>
          <Link href="/admin/molecules" className="flex items-center gap-1 hover:text-foreground">
            <ChevronRight className="h-3 w-3" /> Catalogue des molécules
          </Link>
        </div>
      </div>
    </div>
  );
}
