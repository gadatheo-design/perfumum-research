import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  FlaskConical, Network, Search, Play, CheckCircle2, XCircle,
  AlertCircle, Database, ExternalLink, Loader2,
  ChevronDown, ChevronRight, Dna, Leaf, Droplets, Tag
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KGEntry { qid: string; label: string }
interface KGData {
  qid: string;
  classes: KGEntry[];
  subclasses: KGEntry[];
  skeletons: KGEntry[];
  biosynthesisPathways: KGEntry[];
  chirality: KGEntry[];
  parentMolecules: KGEntry[];
  derivedMolecules: KGEntry[];
  isomers: KGEntry[];
  producingOrganisms: KGEntry[];
  essentialOils: KGEntry[];
  resins: KGEntry[];
  odors: KGEntry[];
  uses: KGEntry[];
  identifiers: {
    cas?: string; inchi?: string; inchikey?: string; smiles?: string;
    chebi?: string; pubchem?: string; chemspider?: string;
    mw?: string; formula?: string;
  };
  retrievedAt: string;
}

interface PubChemResult {
  moleculeId: number; name: string; success: boolean;
  cid?: number; inchiKey?: string; xlogp?: number | null; error?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WD_URL = (qid: string) => `https://www.wikidata.org/wiki/${qid}`;

function TagList({ items, color = "secondary" }: { items: KGEntry[]; color?: "secondary" | "outline" | "default" }) {
  if (!items || !items.length) return <span className="text-muted-foreground text-xs italic">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map(i => (
        <a key={i.qid} href={WD_URL(i.qid)} target="_blank" rel="noopener noreferrer">
          <Badge variant={color} className="text-xs cursor-pointer hover:opacity-80">{i.label}</Badge>
        </a>
      ))}
    </div>
  );
}

function KGPanel({ kg }: { kg: KGData }) {
  const [open, setOpen] = useState(true);
  const ids = kg.identifiers ?? {};
  return (
    <div className="border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Knowledge Graph Wikidata</span>
          <a href={WD_URL(kg.qid)} target="_blank" rel="noopener noreferrer">
            <Badge variant="outline" className="text-xs">{kg.qid} <ExternalLink className="h-3 w-3 ml-1 inline" /></Badge>
          </a>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Identifiants */}
          <div className="space-y-2 col-span-full">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Identifiants croisés</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ids.cas && <div><span className="text-muted-foreground text-xs">CAS</span><p className="font-mono text-xs">{ids.cas}</p></div>}
              {ids.chebi && (
                <div>
                  <span className="text-muted-foreground text-xs">ChEBI</span>
                  <a href={`https://www.ebi.ac.uk/chebi/searchId.do?chebiId=${ids.chebi}`} target="_blank" rel="noopener noreferrer" className="block font-mono text-xs text-blue-500 hover:underline">CHEBI:{ids.chebi}</a>
                </div>
              )}
              {ids.pubchem && (
                <div>
                  <span className="text-muted-foreground text-xs">PubChem</span>
                  <a href={`https://pubchem.ncbi.nlm.nih.gov/compound/${ids.pubchem}`} target="_blank" rel="noopener noreferrer" className="block font-mono text-xs text-blue-500 hover:underline">{ids.pubchem}</a>
                </div>
              )}
              {ids.chemspider && (
                <div>
                  <span className="text-muted-foreground text-xs">ChemSpider</span>
                  <a href={`https://www.chemspider.com/Chemical-Structure.${ids.chemspider}.html`} target="_blank" rel="noopener noreferrer" className="block font-mono text-xs text-blue-500 hover:underline">{ids.chemspider}</a>
                </div>
              )}
              {ids.formula && <div><span className="text-muted-foreground text-xs">Formule</span><p className="font-mono text-xs">{ids.formula}</p></div>}
              {ids.mw && <div><span className="text-muted-foreground text-xs">Masse molaire</span><p className="font-mono text-xs">{parseFloat(ids.mw).toFixed(3)} g/mol</p></div>}
            </div>
            {ids.inchikey && <div><span className="text-muted-foreground text-xs">InChIKey</span><p className="font-mono text-xs break-all">{ids.inchikey}</p></div>}
            {ids.inchi && <div><span className="text-muted-foreground text-xs">InChI</span><p className="font-mono text-xs break-all text-muted-foreground">{ids.inchi}</p></div>}
          </div>

          {/* Classification */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1"><Tag className="h-3 w-3" /> Classification</p>
            <div className="space-y-1">
              <div><span className="text-xs text-muted-foreground">Classe (P31) : </span><TagList items={kg.classes} /></div>
              <div><span className="text-xs text-muted-foreground">Sous-classe (P279) : </span><TagList items={kg.subclasses} /></div>
              {kg.skeletons?.length > 0 && <div><span className="text-xs text-muted-foreground">Squelette terpénique : </span><TagList items={kg.skeletons} color="default" /></div>}
              {kg.chirality?.length > 0 && <div><span className="text-xs text-muted-foreground">Chiralité : </span><TagList items={kg.chirality} /></div>}
            </div>
          </div>

          {/* Biosynthèse */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1"><Dna className="h-3 w-3" /> Biosynthèse & Relations</p>
            <div className="space-y-1">
              {kg.biosynthesisPathways?.length > 0 && <div><span className="text-xs text-muted-foreground">Voie (P2868) : </span><TagList items={kg.biosynthesisPathways} color="default" /></div>}
              {kg.parentMolecules?.length > 0 && <div><span className="text-xs text-muted-foreground">Molécules parentes : </span><TagList items={kg.parentMolecules} /></div>}
              {kg.derivedMolecules?.length > 0 && <div><span className="text-xs text-muted-foreground">Dérivées : </span><TagList items={kg.derivedMolecules} /></div>}
              {kg.isomers?.length > 0 && <div><span className="text-xs text-muted-foreground">Isomères : </span><TagList items={kg.isomers} /></div>}
            </div>
          </div>

          {/* Organismes producteurs */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1"><Leaf className="h-3 w-3" /> Organismes producteurs ({kg.producingOrganisms?.length ?? 0})</p>
            <TagList items={(kg.producingOrganisms ?? []).slice(0, 20)} />
            {(kg.producingOrganisms?.length ?? 0) > 20 && <p className="text-xs text-muted-foreground">+{(kg.producingOrganisms?.length ?? 0) - 20} autres</p>}
          </div>

          {/* Huiles essentielles & Résines */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1"><Droplets className="h-3 w-3" /> Huiles essentielles & Résines</p>
            {(kg.essentialOils?.length ?? 0) > 0 && <div><span className="text-xs text-muted-foreground">HE : </span><TagList items={kg.essentialOils} /></div>}
            {(kg.resins?.length ?? 0) > 0 && <div><span className="text-xs text-muted-foreground">Résines : </span><TagList items={kg.resins} /></div>}
            {(kg.odors?.length ?? 0) > 0 && <div><span className="text-xs text-muted-foreground">Odeurs : </span><TagList items={kg.odors} /></div>}
            {(kg.uses?.length ?? 0) > 0 && <div><span className="text-xs text-muted-foreground">Usages : </span><TagList items={kg.uses} /></div>}
            {!kg.essentialOils?.length && !kg.resins?.length && !kg.odors?.length && !kg.uses?.length && (
              <span className="text-muted-foreground text-xs italic">Aucune donnée disponible sur Wikidata</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 1 : Recherche KG individuelle ────────────────────────────────────────

function KGSearchTab() {
  const [moleculeId, setMoleculeId] = useState("");
  const [searchId, setSearchId] = useState<number | null>(null);

  const kgQuery = trpc.wikidataKg.getMoleculeKG.useQuery(
    { moleculeId: searchId! },
    { enabled: searchId !== null }
  );

  const enrichMut = trpc.wikidataKg.enrichSingleWithKG.useMutation();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-48">
          <Label htmlFor="mol-id">ID de la molécule</Label>
          <Input
            id="mol-id"
            placeholder="Ex: 30002 (Linalol)"
            value={moleculeId}
            onChange={e => setMoleculeId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && setSearchId(Number(moleculeId))}
          />
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={() => setSearchId(Number(moleculeId))} disabled={!moleculeId}>
            <Search className="h-4 w-4 mr-2" /> Interroger Wikidata
          </Button>
          <Button
            variant="outline"
            onClick={() => enrichMut.mutate({ moleculeId: Number(moleculeId) })}
            disabled={!moleculeId || enrichMut.isPending}
          >
            {enrichMut.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
            Enregistrer en base
          </Button>
        </div>
      </div>

      {enrichMut.data && (
        <div className={`p-3 rounded-lg text-sm ${enrichMut.data.success ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"}`}>
          {enrichMut.data.success
            ? `✓ KG enregistré — QID: ${enrichMut.data.qid} | ${enrichMut.data.classesCount} classes | ${enrichMut.data.organismsCount} organismes | ${enrichMut.data.essentialOilsCount} HE | ${enrichMut.data.hasIdentifiers} identifiants`
            : `✗ Erreur: ${(enrichMut.data as { error?: string }).error}`}
        </div>
      )}

      {kgQuery.isLoading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Interrogation de Wikidata SPARQL...</div>}
      {kgQuery.error && <div className="text-red-500 text-sm">Erreur: {kgQuery.error.message}</div>}
      {kgQuery.data && <KGPanel kg={kgQuery.data as unknown as KGData} />}
    </div>
  );
}

// ─── Tab 2 : Batch PubChem Étendu ─────────────────────────────────────────────

function PubChemBatchTab() {
  const [mode, setMode] = useState<"missing_inchi" | "missing_xlogp" | "missing_any" | "all_with_cid">("missing_any");
  const [batchSize, setBatchSize] = useState(20);
  const [results, setResults] = useState<PubChemResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const statsQuery = trpc.pubchemExtended.getCoverageStats.useQuery();
  const toEnrichQuery = trpc.pubchemExtended.getMoleculesToEnrich.useQuery({ mode, limit: batchSize });
  const enrichBatchMut = trpc.pubchemExtended.enrichBatch.useMutation();

  const runBatch = async () => {
    if (!toEnrichQuery.data?.length) return;
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    const ids = toEnrichQuery.data.map(m => m.id);
    const chunkSize = 10;
    const allResults: PubChemResult[] = [];
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      try {
        const res = await enrichBatchMut.mutateAsync({ moleculeIds: chunk });
        allResults.push(...res.results);
        setResults([...allResults]);
        setProgress(Math.round(((i + chunk.length) / ids.length) * 100));
      } catch (e) {
        console.error(e);
      }
    }
    setIsRunning(false);
    statsQuery.refetch();
  };

  const stats = statsQuery.data;

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total molécules", value: stats.total, color: "text-foreground" },
            { label: "Avec CID", value: stats.hasCid, color: "text-blue-500" },
            { label: "Avec InChI", value: stats.hasInchi, color: "text-green-500" },
            { label: "Avec XLogP", value: stats.hasXlogp, color: "text-purple-500" },
            { label: "Sans InChI", value: stats.missingInchi, color: "text-orange-500" },
          ].map(s => (
            <Card key={s.label} className="p-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
              {stats.total > 0 && <Progress value={(s.value / stats.total) * 100} className="h-1 mt-1" />}
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Mode d'enrichissement</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="missing_any">Manquant InChI ou XLogP</SelectItem>
              <SelectItem value="missing_inchi">Manquant InChI uniquement</SelectItem>
              <SelectItem value="missing_xlogp">Manquant XLogP uniquement</SelectItem>
              <SelectItem value="all_with_cid">Tout (avec CID)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Taille du lot (max 50)</Label>
          <Input type="number" min={1} max={50} value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} />
        </div>
        <div className="flex items-end">
          <Button onClick={runBatch} disabled={isRunning || !toEnrichQuery.data?.length} className="w-full">
            {isRunning
              ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Enrichissement... {progress}%</>
              : <><Play className="h-4 w-4 mr-2" />Lancer ({toEnrichQuery.data?.length ?? 0} molécules)</>}
          </Button>
        </div>
      </div>

      {isRunning && <Progress value={progress} className="h-2" />}

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" />{results.filter(r => r.success).length} succès</span>
            <span className="text-red-500 flex items-center gap-1"><XCircle className="h-4 w-4" />{results.filter(r => !r.success).length} échecs</span>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {results.map(r => (
              <div key={r.moleculeId} className={`flex items-center justify-between px-3 py-1.5 rounded text-xs ${r.success ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}>
                <span className="font-medium">{r.name}</span>
                <span className="text-muted-foreground">
                  {r.success
                    ? `CID: ${r.cid} | ${r.inchiKey?.slice(0, 14)}... | logP: ${r.xlogp ?? "—"}`
                    : r.error}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 3 : Batch KG Wikidata ─────────────────────────────────────────────────

function WikidataKGBatchTab() {
  const [batchSize, setBatchSize] = useState(10);
  const [onlyMissing, setOnlyMissing] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<Array<{
    moleculeId: number; name: string; success: boolean;
    qid?: string; classesCount?: number; organismsCount?: number; error?: string;
  }>>([]);

  const statsQuery = trpc.wikidataKg.getKGCoverageStats.useQuery();
  const enrichBatchMut = trpc.wikidataKg.enrichBatchWithKG.useMutation();

  const runBatch = async () => {
    setIsRunning(true);
    setResults([]);
    try {
      const res = await enrichBatchMut.mutateAsync({ limit: batchSize, onlyMissingKg: onlyMissing });
      setResults(res.results);
      statsQuery.refetch();
    } catch (e) {
      console.error(e);
    }
    setIsRunning(false);
  };

  const stats = statsQuery.data;

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total molécules", value: stats.total },
            { label: "Avec QID Wikidata", value: stats.hasQid },
            { label: "KG enrichi", value: stats.hasKg },
            { label: "KG manquant", value: stats.missingKg },
          ].map(s => (
            <Card key={s.label} className="p-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value.toLocaleString()}</p>
              {stats.total > 0 && <Progress value={(s.value / stats.total) * 100} className="h-1 mt-1" />}
            </Card>
          ))}
        </div>
      )}

      {stats && stats.hasQid > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <span>
            Couverture KG : <strong>{stats.coveragePercent}%</strong> des molécules avec QID ont leur Knowledge Graph enrichi ({stats.hasKg}/{stats.hasQid})
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Nombre de molécules à traiter</Label>
          <Input type="number" min={1} max={50} value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} />
          <p className="text-xs text-muted-foreground mt-1">~{(batchSize * 1.5).toFixed(0)}s estimé (1.5s/molécule)</p>
        </div>
        <div className="flex items-center gap-2 pt-5">
          <Switch checked={onlyMissing} onCheckedChange={setOnlyMissing} id="only-missing" />
          <Label htmlFor="only-missing">Seulement les molécules sans KG</Label>
        </div>
        <div className="flex items-end">
          <Button onClick={runBatch} disabled={isRunning} className="w-full">
            {isRunning
              ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Enrichissement Wikidata...</>
              : <><Network className="h-4 w-4 mr-2" />Lancer le batch KG</>}
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" />{results.filter(r => r.success).length} succès</span>
            <span className="text-red-500 flex items-center gap-1"><XCircle className="h-4 w-4" />{results.filter(r => !r.success).length} échecs</span>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-1">
            {results.map(r => (
              <div key={r.moleculeId} className={`flex items-center justify-between px-3 py-2 rounded text-xs ${r.success ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}`}>
                <span className="font-medium">{r.name}</span>
                <span className="text-muted-foreground">
                  {r.success
                    ? <>
                        <a href={WD_URL(r.qid!)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{r.qid}</a>
                        {" | "}{r.classesCount} classes | {r.organismsCount} organismes
                      </>
                    : r.error}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────

export default function MoleculeKGEnrichment() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Network className="h-6 w-6 text-primary" />
          Enrichissement Knowledge Graph Moléculaire
        </h1>
        <p className="text-muted-foreground mt-1">
          <strong>Phase A</strong> — PubChem étendu : InChI, InChIKey, XLogP, TPSA, identifiants croisés (ChEBI, KEGG, HMDB) ·
          <strong> Phase B</strong> — Knowledge Graph Wikidata : classes chimiques, biosynthèse, organismes producteurs, huiles essentielles
        </p>
      </div>

      <Tabs defaultValue="search">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="search"><Search className="h-4 w-4 mr-1" />Recherche KG</TabsTrigger>
          <TabsTrigger value="pubchem"><FlaskConical className="h-4 w-4 mr-1" />Phase A — PubChem</TabsTrigger>
          <TabsTrigger value="wikidata"><Network className="h-4 w-4 mr-1" />Phase B — Wikidata</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interroger le Knowledge Graph d'une molécule</CardTitle>
              <CardDescription>Saisir l'ID de la molécule pour récupérer son KG complet depuis Wikidata SPARQL en temps réel</CardDescription>
            </CardHeader>
            <CardContent><KGSearchTab /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pubchem" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Phase A — Enrichissement PubChem Étendu</CardTitle>
              <CardDescription>
                Complète les molécules avec CID PubChem en récupérant : InChI, InChIKey, SMILES isomérique,
                masse exacte, XLogP, TPSA, liaisons H, atomes lourds, synonymes (CAS, EINECS, FEMA), identifiants ChEBI / KEGG / HMDB
              </CardDescription>
            </CardHeader>
            <CardContent><PubChemBatchTab /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wikidata" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Phase B — Knowledge Graph Wikidata</CardTitle>
              <CardDescription>
                Construit le graphe de connaissances complet pour chaque molécule via SPARQL Wikidata :
                classes chimiques, sous-classes, squelettes terpéniques, voies de biosynthèse, chiralité,
                molécules parentes/dérivées, isomères, organismes producteurs, huiles essentielles, résines, odeurs, usages
              </CardDescription>
            </CardHeader>
            <CardContent><WikidataKGBatchTab /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
